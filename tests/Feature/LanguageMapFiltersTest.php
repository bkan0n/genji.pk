<?php

namespace Tests\Feature;

use Tests\TestCase;

class LanguageMapFiltersTest extends TestCase
{
    public function test_switching_language_preserves_every_canonical_map_filter(): void
    {
        $query = 'section=map_search&map_name=King%27s+Row&map_name=Hanamura&mechanics=Dash&mechanics=Bhop&page=2';
        $previous = url('/search') . '?' . $query . '&lang=en';

        $this->from($previous)->get('/lang/cn')
            ->assertRedirect(url('/search') . '?' . $query . '&lang=cn');
    }

    public function test_switching_back_preserves_unicode_and_replaces_encoded_language_key(): void
    {
        $query = 'map_name=Hanamura&map_name=Eichenwalde&query=%E5%9B%BD%E7%8E%8B';
        $previous = url('/search') . '?' . $query . '&%6Cang=cn';

        $this->from($previous)->get('/lang/en')
            ->assertRedirect(url('/search') . '?' . $query . '&lang=en');
    }
}
