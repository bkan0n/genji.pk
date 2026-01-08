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
    protected function request()
    {
        $http = Http::withHeaders([
            'X-API-KEY' => $this->apiKey,
            'Content-Type' => 'application/json',
            'Accept' => 'application/json',
        ])->timeout(10);

        // Disable SSL verification in local environment
        if (app()->environment('local')) {
            $http = $http->withoutVerifying();
        }

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
    // Session Endpoints (for custom session driver)
    // =========================================================================

    /**
     * Read session data.
     */
    public function sessionRead(string $sessionId): ?string
    {
        try {
            $response = $this->request()->get("{$this->apiRoot}/api/v3/auth/sessions/{$sessionId}");

            if ($response->successful()) {
                return $response->json()['payload'];
            }

            return null;
        } catch (\Exception $e) {
            Log::error('Session read API exception', ['error' => $e->getMessage()]);
            return null;
        }
    }

    /**
     * Write session data.
     */
    public function sessionWrite(string $sessionId, string $payload, ?int $userId = null): bool
    {
        try {
            $response = $this->request()->put("{$this->apiRoot}/api/v3/auth/sessions/{$sessionId}", [
                'payload' => $payload,
                'user_id' => $userId,
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
            return $response->successful();
        } catch (\Exception $e) {
            Log::error('Session destroy API exception', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Garbage collect expired sessions.
     */
    public function sessionGc(): int
    {
        try {
            $response = $this->request()->post("{$this->apiRoot}/api/v3/auth/sessions/gc");

            if ($response->successful()) {
                return $response->json()['deleted_count'] ?? 0;
            }

            return 0;
        } catch (\Exception $e) {
            Log::error('Session GC API exception', ['error' => $e->getMessage()]);
            return 0;
        }
    }
}
