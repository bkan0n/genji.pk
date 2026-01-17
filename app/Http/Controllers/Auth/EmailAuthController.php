<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\GenjiApiService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Validator;

class EmailAuthController extends Controller
{
    private const DEVICE_SESSION_COOKIE = 'device_session_id';
    public function __construct(protected GenjiApiService $api) {}

    public function showRegister(Request $request)
    {
        $request->session()->reflash();
        return redirect('/?openRegister=1');
    }

    public function showLogin(Request $request)
    {
        $request->session()->reflash();
        return redirect('/?openLogin=1');
    }

    public function register(Request $request)
    {
        $v = Validator::make($request->all(), [
            'email' => ['required','email'],
            'password' => ['required','min:8','confirmed'],
            'username' => ['required','min:1','max:20'],
        ]);

        if ($v->fails()) {
            return redirect('/?openRegister=1')
                ->withErrors($v)
                ->withInput();
        }

        $result = $this->api->emailRegister(
            (string) $request->input('email'),
            (string) $request->input('password'),
            (string) $request->input('username')
        );

        if (isset($result['error']) && $result['error']) {
            return redirect('/?openRegister=1')
                ->withInput()
                ->with('register_error', $result['message'] ?? __('auth.messages.registration_failed'));
        }

        // Ouvre login + email form directement
        return redirect('/?openLogin=1&email=1')
            ->with('success', __('auth.messages.register_success'));
    }

    public function login(Request $request)
    {
        $v = Validator::make($request->all(), [
            'email' => ['required','email'],
            'password' => ['required'],
        ]);

        if ($v->fails()) {
            return redirect('/?openLogin=1&email=1')
                ->withErrors($v)
                ->withInput();
        }

        $result = $this->api->emailLogin(
            (string) $request->input('email'),
            (string) $request->input('password')
        );

        if (isset($result['error']) && $result['error']) {
            return redirect('/?openLogin=1&email=1')
                ->withInput()
                ->with('login_error', $result['message'] ?? __('auth.messages.invalid_credentials'));
        }

        // Store user in session
        $user = $result['user'] ?? null;
        if (!$user || !isset($user['id'])) {
            return redirect('/?openLogin=1&email=1')
                ->with('login_error', __('auth.messages.login_failed'));
        }

        $request->session()->put('user_id', $user['id']);
        $request->session()->put('user', [
            'id' => $user['id'],
            'email' => $user['email'] ?? null,
            'username' => $user['username'] ?? null,
            'email_verified' => (bool) ($user['email_verified'] ?? false),
            'coins' => $user['coins'] ?? 0,
            'auth_type' => 'email',
        ]);

        $previousDeviceSessionId = (string) $request->cookie(self::DEVICE_SESSION_COOKIE, '');
        $preAuthSessionId = (string) $request->session()->getId();

        $request->session()->regenerate(true);

        $newSessionId = (string) $request->session()->getId();

        if ($previousDeviceSessionId !== '' && $previousDeviceSessionId !== $newSessionId) {
            $this->api->sessionDestroy($previousDeviceSessionId);
        }

        if ($preAuthSessionId !== '' && $preAuthSessionId !== $newSessionId && $preAuthSessionId !== $previousDeviceSessionId) {
            $this->api->sessionDestroy($preAuthSessionId);
        }

        $this->queueDeviceSessionCookie($request, $newSessionId);

        if ($request->boolean('remember')) {
            $rememberToken = $this->api->createRememberToken($result['user']['id']);
            if ($rememberToken) {
                $this->queueRememberCookie($request, $rememberToken);
            }
        }

        if (!(bool) ($user['email_verified'] ?? false)) {
            return redirect('/?openVerifyEmail=1')
                ->with('warning', __('auth.messages.email_not_verified'));
        }

        return redirect('/');
    }

    private function queueRememberCookie(Request $request, string $token): void
    {
        $minutes = 60 * 24 * 30;
        $domain = config('session.domain');
        $secureCfg = config('session.secure');
        $secure = is_null($secureCfg) ? $request->isSecure() : (bool) $secureCfg;

        cookie()->queue(cookie(
            'remember_token',
            $token,
            $minutes,
            '/',
            $domain,
            $secure,
            true,
            false,
            'Lax'
        ));
    }

    private function queueDeviceSessionCookie(Request $request, string $sessionId): void
    {
        $minutes = 60 * 24 * 90;
        $domain = config('session.domain');
        $secureCfg = config('session.secure');
        $secure = is_null($secureCfg) ? $request->isSecure() : (bool) $secureCfg;

        cookie()->queue(cookie(
            self::DEVICE_SESSION_COOKIE,
            $sessionId,
            $minutes,
            '/',
            $domain,
            $secure,
            true,
            false,
            'Lax'
        ));
    }


    public function verifyEmail(Request $request)
    {
        $token = (string) $request->query('token', '');

        if ($token === '') {
            return redirect('/?openLogin=1&email=1')
                ->with('login_error', __('auth.messages.invalid_reset_link'));
        }

        $result = $this->api->verifyEmail($token);

        if (isset($result['error']) && $result['error']) {
            return redirect('/?openLogin=1&email=1')
                ->with('login_error', $result['message'] ?? __('auth.messages.reset_failed'));
        }

        if ($request->session()->has('user')) {
            $u = $request->session()->get('user');
            $u['email_verified'] = true;
            $request->session()->put('user', $u);
        }

        return redirect('/?openLogin=1&email=1')
            ->with('success', __('auth.messages.verify_success'));
    }

    public function showVerifyNotice()
    {
        return view('auth.verify-email');
    }

    public function resendVerification(Request $request)
    {
        $user = $request->session()->get('user');
        $email = $user['email'] ?? null;

        if (!$email) {
            return back()->with('error', __('auth.messages.resend_verification_failed'));
        }

        $this->api->resendVerification($email);

        return back()->with('success', __('auth.messages.verification_resent'));
    }

    public function showForgotPassword()
    {
        return view('auth.forgot-password');
    }

    public function forgotPassword(Request $request)
    {
        $v = Validator::make($request->all(), [
            'email' => ['required','email'],
        ]);

        if ($v->fails()) {
            return back()->withErrors($v)->withInput();
        }

        $this->api->forgotPassword((string) $request->input('email'));

        return back()->with('success', __('auth.messages.reset_sent'));
    }

    public function showResetPassword(Request $request)
    {
        $token = (string) $request->query('token', '');

        if ($token === '') {
            return redirect('/?openLogin=1&email=1')
                ->with('login_error', __('auth.messages.invalid_reset_link'));
        }

        // Stocker le token en session et rediriger avec le paramètre pour ouvrir le modal
        $request->session()->put('reset_token', $token);
        
        return redirect('/?openResetPassword=1');
    }

    public function resetPassword(Request $request)
    {
        $v = Validator::make($request->all(), [
            'token' => ['required'],
            'password' => ['required','min:8','confirmed'],
        ]);

        if ($v->fails()) {
            return back()->withErrors($v)->withInput();
        }

        $result = $this->api->resetPassword(
            (string) $request->input('token'),
            (string) $request->input('password')
        );

        if (isset($result['error']) && $result['error']) {
            return back()->with('error', $result['message'] ?? __('auth.messages.reset_failed'));
        }

        return redirect('/?openLogin=1&email=1')
            ->with('success', __('auth.messages.reset_success'));
    }

    public function logout(Request $request)
    {
        $this->api->sessionDestroy((string) $request->session()->getId());

        $request->session()->invalidate();

        cookie()->queue(cookie()->forget('remember_token'));
        cookie()->queue(cookie()->forget(self::DEVICE_SESSION_COOKIE));

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
