<?php

namespace App\Providers;

use App\Extensions\ApiSessionHandler;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\ServiceProvider;

class SessionServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(\App\Services\GenjiApiService::class);
    }

    public function boot(): void
    {
        Session::extend('api', function ($app) {
            return new ApiSessionHandler();
        });
    }
}
