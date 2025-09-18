<?php

namespace App\Support;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;

class Translations
{
    protected array $data;

    public function __construct()
    {
        $path = resource_path('translations/flags.json');
        $this->data = File::exists($path) ? json_decode(File::get($path), true) : [];
    }

    public function all(?string $locale = null): array
    {
        $locale = $locale ?: app()->getLocale();

        return $this->data[$locale] ?? ($this->data['en'] ?? []);
    }

    public function languages(): array
    {
        return $this->data['languages'] ?? [];
    }

    public function get(string $key, ?string $locale = null, $default = null)
    {
        return Arr::get($this->all($locale), $key, $default);
    }
}
