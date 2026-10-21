"""Exercise deployment failure boundaries without contacting a Docker daemon."""

import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]
DOCKER = r'''#!/usr/bin/env python3
import json, os, pathlib, sys
a = sys.argv[1:]
with open(os.environ['DOCKER_TEST_LOG'], 'a') as f:
    f.write(json.dumps(a) + '\n')
failure = os.environ.get('DOCKER_TEST_FAILURE', '')
if a[0] == 'inspect':
    template, container = a[2], a[3]
    if 'Health.Status' in template:
        print('unhealthy' if failure == 'preview' else 'healthy')
    elif 'State.Running' in template:
        print('false' if failure == 'preview' and 'preflight' in container else 'true')
    elif 'compose.project' in template:
        print('existing-project')
    elif '.Mounts' in template:
        print(os.environ.get('DOCKER_TEST_OLD_VOLUME', ''))
    else:
        print('sha256:old-image')
elif a[0] == 'exec' and '--env' in a:
    sys.exit(1 if failure == 'key' else 0)
elif a[0] == 'compose':
    command = a[5:]
    if command[0] == 'build' and failure == 'build':
        sys.exit(1)
    if command[0] == 'run' and '--name' not in command:
        if '--user' in command and failure == 'import':
            sys.exit(1)
        if '--user' not in command and failure == 'version':
            sys.exit(1)
    if command[0] == 'up' and failure == 'replace':
        sys.exit(1)
elif a[0] == 'cp':
    if failure == 'backup':
        sys.exit(1)
    pathlib.Path(a[-1]).mkdir()
'''


class DeployVpsTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.path = Path(self.directory.name)
        self.log = self.path / 'docker.jsonl'
        docker = self.path / 'docker'
        docker.write_text(DOCKER)
        docker.chmod(0o755)
        sleep = self.path / 'sleep'
        sleep.write_text('#!/bin/sh\nexit 0\n')
        sleep.chmod(0o755)

    def deploy(self, failure='', **extra):
        env = {
            **os.environ,
            'PATH': str(self.path) + os.pathsep + os.environ['PATH'],
            'APP_KEY': 'test-key-never-print-this',
            'APP_ENV': 'production',
            'APP_DEBUG': 'false',
            'APP_URL': 'https://example.test',
            'X_API_ROOT': 'https://api.example.test',
            'X_API_KEY': 'test-api-key-never-print-this',
            'DEPLOY_BACKUP_ROOT': str(self.path / 'backups'),
            'DOCKER_TEST_LOG': str(self.log),
            'DOCKER_TEST_FAILURE': failure,
            **extra,
        }
        result = subprocess.run(
            ['sh', str(ROOT / 'scripts/deploy-vps.sh'), 'production'],
            env=env, capture_output=True, text=True, timeout=20,
        )
        self.assertNotIn(env['APP_KEY'], result.stdout + result.stderr)
        self.assertNotIn(env['X_API_KEY'], result.stdout + result.stderr)
        calls = [json.loads(line) for line in self.log.read_text().splitlines()] if self.log.exists() else []
        return result, calls

    def test_wrong_environment_never_touches_docker(self):
        result, calls = self.deploy(APP_ENV='local')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(calls, [])

    def test_key_build_version_and_preview_failures_keep_original_running(self):
        for failure in ('key', 'build', 'version', 'preview'):
            with self.subTest(failure=failure):
                self.log.unlink(missing_ok=True)
                result, calls = self.deploy(failure)
                self.assertNotEqual(result.returncode, 0)
                self.assertFalse(any(call[0] == 'stop' for call in calls))
                self.assertFalse(any(call[0] == 'compose' and call[5] == 'up' for call in calls))

    def test_backup_or_import_failure_restarts_original(self):
        for failure in ('backup', 'import'):
            with self.subTest(failure=failure):
                self.log.unlink(missing_ok=True)
                result, calls = self.deploy(failure)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn(['start', 'genjishimada-web'], calls)
                self.assertFalse(any(call[0] == 'compose' and call[5] == 'up' for call in calls))

    def test_first_migration_imports_storage_and_waits_for_health(self):
        result, calls = self.deploy()
        self.assertEqual(result.returncode, 0, result.stderr)
        compose_calls = [call for call in calls if call[0] == 'compose']
        self.assertTrue(all(call[2] == 'existing-project' for call in compose_calls))
        self.assertTrue(any(call[5:7] == ['build', '--pull'] for call in compose_calls))
        self.assertTrue(any('--user' in call for call in compose_calls))
        up = next(call for call in compose_calls if call[5] == 'up')
        self.assertIn('--no-build', up)
        self.assertIn('--wait', up)
        rollback = next((self.path / 'backups').glob('*/rollback.yml')).read_text()
        self.assertIn('genji-web-rollback:', rollback)
        self.assertIn('pull_policy: never', rollback)

    def test_later_deploy_keeps_existing_volume_without_reimport(self):
        result, calls = self.deploy(DOCKER_TEST_OLD_VOLUME='existing-project_genji-storage')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertFalse(any('--user' in call for call in calls))

    def test_failed_replacement_points_to_saved_rollback(self):
        result, _ = self.deploy('replace')
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Rollback: doppler run -- docker compose', result.stdout)
        self.assertIn('rollback command', result.stderr)


if __name__ == '__main__':
    unittest.main()
