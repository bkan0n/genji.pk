"""Check startup hooks without booting a web server or using real secrets."""

import os
from pathlib import Path
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[2]


class StartupTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.path = Path(self.directory.name)
        (self.path / 'bootstrap/cache').mkdir(parents=True)
        self.log = self.path / 'artisan.log'
        php = self.path / 'php'
        php.write_text('#!/bin/sh\nprintf "%s\\n" "$*" >> "$STARTUP_TEST_LOG"\n'
                       '[ "${STARTUP_TEST_FAIL:-0}" = 0 ]\n')
        php.chmod(0o755)

    def start(self, **extra):
        env = {
            **os.environ,
            'PATH': str(self.path) + os.pathsep + os.environ['PATH'],
            'APP_BASE_DIR': str(self.path),
            'APP_KEY': 'test-key',
            'SERVERSIDEUP_DEFAULT_COMMAND': 'true',
            'STARTUP_TEST_LOG': str(self.log),
            **extra,
        }
        result = subprocess.run(
            ['sh', str(ROOT / 'docker/entrypoint.d/90-laravel.sh')],
            env=env, capture_output=True, text=True, timeout=5,
        )
        calls = self.log.read_text().splitlines() if self.log.exists() else []
        return result, calls

    def test_cli_commands_skip_application_initialization(self):
        result, calls = self.start(SERVERSIDEUP_DEFAULT_COMMAND='false', APP_KEY='')
        self.assertEqual(result.returncode, 0)
        self.assertEqual(calls, [])

    def test_web_startup_requires_application_key(self):
        result, calls = self.start(APP_KEY='')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(calls, [])

    def test_web_startup_discovers_packages_and_warms_caches(self):
        result, calls = self.start()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(calls, ['artisan package:discover --ansi', 'artisan optimize --ansi'])

    def test_cache_warming_can_be_disabled(self):
        result, calls = self.start(WARM_CACHES='0')
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(calls, ['artisan package:discover --ansi'])

    def test_failed_artisan_command_fails_startup(self):
        result, calls = self.start(STARTUP_TEST_FAIL='1')
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(calls, ['artisan package:discover --ansi'])


if __name__ == '__main__':
    unittest.main()
