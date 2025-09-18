<?php

namespace App\Providers;

use App\Support\Translations;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use SocialiteProviders\Discord\Provider as DiscordProvider;
use SocialiteProviders\Manager\SocialiteWasCalled;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        require_once app_path('Support/helpers.php');

        $this->app->singleton(Translations::class);
    }

    public function boot(Translations $translations): void
    {
        $nonce = csp_nonce();
        Vite::useCspNonce($nonce);

        Event::listen(function (SocialiteWasCalled $event) {
            $event->extendSocialite('discord', DiscordProvider::class);
        });

        View::composer('*', function ($view) use ($translations) {
            $lang = app()->getLocale();
            $langsList = $translations->languages();
            $allForLang = $translations->all($lang);

            $view->with([
                'selectedLang' => $lang,
                'languages' => $langsList,
                'translations' => $allForLang,
                'selectedLangData' => $langsList[$lang] ?? ($langsList['en'] ?? []),
            ]);
        });
    }
}
