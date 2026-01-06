<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class LoginController extends Controller
{
    public function show(Request $request)
    {
        if ($request->session()->has('user_id')) {
            return redirect()->to('/');
        }

        return view('auth.login');
    }
}
