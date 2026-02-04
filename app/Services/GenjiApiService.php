<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenjiApiService
{
    protected string $apiRoot;
    protected string $apiKey;

    public function __construct()
    {
        $this->apiRoot = rtrim(config('services.genji_api.root'), '/');
        $this->apiKey = config('services.genji_api.key');
    }

    /**
     * Make an API request with the API key header.
     */
    protected function request(array $headers = [], array $options = [])
    {
        $verify = config('services.genji_api.verify', true);
        if (is_string($verify)) {
            $verify = filter_var($verify, FILTER_VALIDATE_BOOLEAN);
        }

        $baseHeaders = [
            'X-API-KEY' => $this->apiKey,
            'Accept' => 'application/json',
        ];

        if (!isset($headers['Content-Type'])) {
            $baseHeaders['Content-Type'] = 'application/json';
        }

        $http = Http::withHeaders(array_merge($baseHeaders, $headers))
            ->withOptions(array_merge(['verify' => (bool) $verify], $options))
            ->timeout(10);

        return $http;
    }

    // =========================================================================
    // User Endpoints (used by Discord OAuth and general user operations)
    // =========================================================================

    /**
     * Check if a user exists.
     */
    public function userExists(int $userId): bool
    {
        try {
            $response = $this->request()->get("{$this->apiRoot}/api/v3/users/{$userId}/exists");

            if ($response->successful()) {
                return $response->json() === true;
            }

            return false;
        } catch (\Exception $e) {
            Log::error('User exists API exception', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Get user by ID.
     */
    public function getUser(int $userId): ?array
    {
        try {
            $response = $this->request()->get("{$this->apiRoot}/api/v3/users/{$userId}");

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Get user API exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Create a new user.
     */
    public function createUser(int $id, string $globalName, string $nickname): ?array
    {
        try {
            $response = $this->request()->post("{$this->apiRoot}/api/v3/users/", [
                'id' => $id,
                'global_name' => $globalName,
                'nickname' => $nickname,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            Log::error('Create user API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('Create user API exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Update user names.
     */
    public function updateUser(int $userId, ?string $globalName = null, ?string $nickname = null): bool
    {
        try {
            $payload = [];
            if ($globalName !== null) {
                $payload['global_name'] = $globalName;
            }
            if ($nickname !== null) {
                $payload['nickname'] = $nickname;
            }

            if (empty($payload)) {
                return true;
            }

            $response = $this->request()->patch("{$this->apiRoot}/api/v3/users/{$userId}", $payload);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Update user API exception', ['error' => $e->getMessage()]);
            return false;
        }
    }

    // =========================================================================
    // Email Authentication Endpoints
    // =========================================================================

    /**
     * Email registration.
     */
    public function emailRegister(string $email, string $password, string $username): ?array
    {
        try {
            $response = $this->request()->post("{$this->apiRoot}/api/v3/auth/register", [
                'email' => $email,
                'password' => $password,
                'username' => $username,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return [
                'error' => true,
                'status' => $response->status(),
                'message' => $response->json()['error'] ?? 'Registration failed',
            ];
        } catch (\Exception $e) {
            Log::error('Email register API exception', ['error' => $e->getMessage()]);
            return ['error' => true, 'message' => 'Service unavailable'];
        }
    }

    /**
     * Email login.
     */
    public function emailLogin(string $email, string $password): ?array
    {
        try {
            $response = $this->request()->post("{$this->apiRoot}/api/v3/auth/login", [
                'email' => $email,
                'password' => $password,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return [
                'error' => true,
                'status' => $response->status(),
                'message' => $response->json()['error'] ?? 'Invalid credentials',
            ];
        } catch (\Exception $e) {
            Log::error('Email login API exception', ['error' => $e->getMessage()]);
            return ['error' => true, 'message' => 'Service unavailable'];
        }
    }

    /**
     * Verify email with token.
     */
    public function verifyEmail(string $token): ?array
    {
        try {
            $response = $this->request()->post("{$this->apiRoot}/api/v3/auth/verify-email", [
                'token' => $token,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return [
                'error' => true,
                'message' => $response->json()['error'] ?? 'Verification failed',
            ];
        } catch (\Exception $e) {
            Log::error('Verify email API exception', ['error' => $e->getMessage()]);
            return ['error' => true, 'message' => 'Service unavailable'];
        }
    }

    /**
     * Request password reset.
     */
    public function forgotPassword(string $email): ?array
    {
        try {
            $response = $this->request()->post("{$this->apiRoot}/api/v3/auth/forgot-password", [
                'email' => $email,
            ]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Forgot password API exception', ['error' => $e->getMessage()]);
            return ['message' => 'If an account exists, a reset link has been sent.'];
        }
    }

    /**
     * Reset password with token.
     */
    public function resetPassword(string $token, string $password): ?array
    {
        try {
            $response = $this->request()->post("{$this->apiRoot}/api/v3/auth/reset-password", [
                'token' => $token,
                'password' => $password,
            ]);

            if ($response->successful()) {
                return $response->json();
            }

            return [
                'error' => true,
                'message' => $response->json()['error'] ?? 'Reset failed',
            ];
        } catch (\Exception $e) {
            Log::error('Reset password API exception', ['error' => $e->getMessage()]);
            return ['error' => true, 'message' => 'Service unavailable'];
        }
    }

    /**
     * Resend verification email.
     */
    public function resendVerification(string $email): ?array
    {
        try {
            $response = $this->request()->post("{$this->apiRoot}/api/v3/auth/resend-verification", [
                'email' => $email,
            ]);

            return $response->json();
        } catch (\Exception $e) {
            Log::error('Resend verification API exception', ['error' => $e->getMessage()]);
            return ['message' => 'If an account exists, a verification email has been sent.'];
        }
    }

    // =========================================================================
    // Remember Token Endpoints (persistent login)
    // =========================================================================

    public function createRememberToken(int $userId): ?string
    {
        try {
            $response = $this->request()->post("{$this->apiRoot}/api/v3/auth/remember-token", [
                'user_id' => $userId,
            ]);

            if ($response->successful()) {
                return $response->json()['token'] ?? null;
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Create remember token API exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    public function validateRememberToken(string $token): ?string
    {
        try {
            $response = $this->request()->post("{$this->apiRoot}/api/v3/auth/remember-token/validate", [
                'token' => $token,
            ]);

            if (!$response->successful()) {
                return null;
            }

            $payload = json_decode($response->body(), true, 512, JSON_BIGINT_AS_STRING) ?? [];

            if (($payload['valid'] ?? false) !== true) {
                return null;
            }

            $userId = $payload['user_id'] ?? null;
            if ($userId === null || $userId === '') {
                return null;
            }

            // Verify valid session
            try {
                $userSessions = $this->getUserSessions($userId);
                if (!$userSessions || !is_array($userSessions) || count($userSessions) === 0) {
                    Log::debug('validateRememberToken: user has no active sessions', [
                        'user_id' => $userId,
                    ]);
                    return null;
                }
            } catch (\Exception $sessionCheckError) {
                Log::debug('validateRememberToken: failed to check user sessions', [
                    'user_id' => $userId,
                    'error' => $sessionCheckError->getMessage(),
                ]);
                // Continue despite the error
            }

            return (string) $userId;
        } catch (\Exception $e) {
            Log::error('Validate remember token API exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    // =========================================================================
    // Session Endpoints (for custom session driver)
    // =========================================================================

    /**
     * Read session data.
     */
    public function sessionReadMeta(string $sessionId): ?array
    {
        try {
            $response = $this->request()->get("{$this->apiRoot}/api/v3/auth/sessions/{$sessionId}");

            if ($response->successful()) {
                $json = $response->json();
                return is_array($json) ? $json : null;
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Session read API exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    public function sessionIsMod(string $sessionId): ?bool
    {
        $meta = $this->sessionReadMeta($sessionId);
        if (!$meta || !array_key_exists('is_mod', $meta)) {
            return null;
        }
        return (bool) ($meta['is_mod'] ?? false);
    }

    public function sessionRead(string $sessionId): ?string
    {
        $meta = $this->sessionReadMeta($sessionId);
        if (!$meta) {
            return null;
        }
        return $meta['payload'] ?? null;
    }

    /**
     * Write session data.
     */
    public function sessionWrite(string $sessionId, string $payload, int|string|null $userId = null, ?string $ip = null, ?string $userAgent = null): bool
    {
        try {
            $headers = [];
            if ($ip !== null && $ip !== '') {
                $headers['X-Forwarded-For'] = $ip;
                $headers['X-Real-IP'] = $ip;
            }
            if ($userAgent !== null && $userAgent !== '') {
                $headers['User-Agent'] = $userAgent;
            }

            $uid = null;
            if ($userId !== null && $userId !== '') {
                $uidStr = trim((string) $userId);
                if ($uidStr !== '' && preg_match('/^\d+$/', $uidStr)) {
                    if (PHP_INT_SIZE >= 8) {
                        $uid = (strlen($uidStr) > 15) ? $uidStr : (int) $uidStr;
                    } else {
                        $uid = $uidStr;
                    }
                }
            }
$response = $this->request($headers)->put("{$this->apiRoot}/api/v3/auth/sessions/{$sessionId}", [
                'payload' => $payload,
                'user_id' => $uid,
            ]);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Session write API exception', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Destroy session.
     */
    public function sessionDestroy(string $sessionId): bool
    {
        try {
            $response = $this->request()->delete("{$this->apiRoot}/api/v3/auth/sessions/{$sessionId}");

            if ($response->status() === 404 || $response->status() === 410) {
                return true;
            }

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Session destroy API exception', ['error' => $e->getMessage()]);
            return true;
        }
    }

    /**
     * Garbage collect expired sessions.
     */
    public function sessionGc(int $maxLifetime): int
    {
        try {
            $response = $this->request()->post(
                "{$this->apiRoot}/api/v3/auth/sessions/gc",
                ['max_lifetime' => $maxLifetime]
            );

            if ($response->successful()) {
                return $response->json()['deleted_count'] ?? 0;
            }

            return 0;
        } catch (\Exception $e) {
            Log::error('Session GC API exception', ['error' => $e->getMessage()]);
            return 0;
        }
    }

    public function getUserSessions(int|string $userId): ?array
    {
        try {
            $uid = is_numeric($userId) ? (int) $userId : null;
            if ($uid === null) {
                return null;
            }

            $response = $this->request()->get("{$this->apiRoot}/api/v3/auth/sessions/user/{$uid}");

            if ($response->successful()) {
                $json = $response->json();
                return is_array($json) ? $json : null;
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Get user sessions API exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    public function destroyAllUserSessions(int|string $userId, ?string $exceptSessionId = null): bool
    {
        try {
            $uid = is_numeric($userId) ? (int) $userId : null;
            if ($uid === null) {
                return false;
            }

            $query = [];
            if ($exceptSessionId !== null && $exceptSessionId !== '') {
                $query['except_session_id'] = $exceptSessionId;
            }

            $url = "{$this->apiRoot}/api/v3/auth/sessions/user/{$uid}";
            $response = $this->request()->delete($url, $query);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Destroy all user sessions API exception', ['error' => $e->getMessage()]);
            return false;
        }
    }
}
