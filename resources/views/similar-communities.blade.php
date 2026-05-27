@extends('layouts.app')

@section('title', __('similar_communities.meta.title'))
@section('og:title', __('similar_communities.meta.og.title'))
@section('og:description', __('similar_communities.meta.og.description'))

@section('content')
  @php
      $communities = [
          [
              'key' => 'momentum',
              'href' => 'https://doom.pk/',
              'discord' => 'https://discord.com/invite/pvuJ5UqA8K',
              'image' => 'https://cdn.doom.pk/content/ec919fa6-66ac-4f44-b5b0-285fd16e2c17.png',
              'external' => true,
          ],
          [
              'key' => 'gemster',
              'href' => 'https://gemstersworkshop.com/home',
              'discord' => 'https://discord.gg/lavaparkour',
              'image' => 'https://cdn.doom.pk/content/54293283-8373-4bd7-a89d-7885f78eeca9.png',
              'external' => true,
          ],
          [
              'key' => 'jetpack',
              'href' => 'https://jetpackcat.racing/',
              'discord' => 'https://dsc.gg/jetpack',
              'image' => 'https://cdn.doom.pk/content/eabcc3fd-dc55-46ea-a146-2537ae55ea4d.png',
              'external' => true,
          ],
          [
              'key' => 'genjiball',
              'href' => 'https://www.genjiball.com/',
              'discord' => 'https://discord.com/invite/genjiball',
              'image' => 'https://cdn.doom.pk/content/f7f8cf0a-c326-4267-be07-fb67fb7acd6e.png',
              'external' => true,
          ],
          [
              'key' => 'mercy',
              'href' => 'https://mercyparkour.codes/',
              'discord' => 'https://discord.com/invite/mercyparkour',
              'image' => 'https://cdn.doom.pk/content/3f69b687-0ed2-45f4-9cc5-3645b6dc19aa.png',
              'external' => true,
          ],
          [
              'key' => 'lucio',
              'href' => 'https://www.luciosurfleague.com/',
              'discord' => 'https://discord.gg/JVAKhhr',
              'image' => 'https://cdn.doom.pk/content/8ab3aac4-aec0-429d-9536-6a38c24d13d3.png',
              'external' => true,
          ],
      ];
  @endphp

  <section class="relative">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div class="max-w-3xl">
        <h1 class="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
          {{ __('similar_communities.hero.title') }}
        </h1>
        <p class="mt-3 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
          {{ __('similar_communities.hero.description') }}
        </p>
      </div>

      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        @foreach ($communities as $community)
          <article class="group overflow-hidden rounded-lg border border-zinc-200/80 bg-white/70 transition hover:border-zinc-300 hover:bg-white/85 dark:border-white/10 dark:bg-zinc-950/70 dark:hover:border-white/15 dark:hover:bg-zinc-950/85">
            <a
              href="{{ $community['href'] }}"
              class="block"
              @if ($community['external']) target="_blank" rel="noopener noreferrer" @endif
              aria-label="{{ __('similar_communities.visit') }}: {{ __('similar_communities.cards.' . $community['key'] . '.title') }}"
            >
              <div class="aspect-[16/10] overflow-hidden bg-zinc-950">
                <img
                  src="{{ $community['image'] }}"
                  alt="{{ __('similar_communities.cards.' . $community['key'] . '.title') }}"
                  class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                >
              </div>
            </a>

            <div class="flex items-end justify-between gap-4 p-5">
              <a
                href="{{ $community['href'] }}"
                class="min-w-0 flex-1"
                @if ($community['external']) target="_blank" rel="noopener noreferrer" @endif
                aria-label="{{ __('similar_communities.visit') }}: {{ __('similar_communities.cards.' . $community['key'] . '.title') }}"
              >
                <p class="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:text-emerald-400">
                  {{ __('similar_communities.cards.' . $community['key'] . '.eyebrow') }}
                </p>
                <h2 class="mt-2 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                  {{ __('similar_communities.cards.' . $community['key'] . '.title') }}
                </h2>
                <p class="mt-2 text-base text-zinc-600 dark:text-zinc-300">
                  {{ __('similar_communities.cards.' . $community['key'] . '.subtitle') }}
                </p>
                <p class="mt-3 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {{ __('similar_communities.cards.' . $community['key'] . '.description') }}
                </p>
              </a>

              <div class="mb-1 flex shrink-0 flex-col items-center gap-2">
                <a
                  href="{{ $community['discord'] }}"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200/80 bg-zinc-50 text-zinc-700 transition hover:border-emerald-300 hover:text-emerald-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="{{ __('similar_communities.visit_discord') }}: {{ __('similar_communities.cards.' . $community['key'] . '.title') }}"
                  title="{{ __('similar_communities.visit_discord') }}"
                >
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M20.317 4.369A19.791 19.791 0 0 0 15.885 3c-.191.328-.403.77-.552 1.117a18.27 18.27 0 0 0-6.666 0A11.64 11.64 0 0 0 8.115 3a19.736 19.736 0 0 0-4.433 1.369C.533 9.067-.321 13.633.099 18.134a19.9 19.9 0 0 0 5.993 3.033c.486-.667.919-1.371 1.294-2.11a12.96 12.96 0 0 1-2.036-.981c.171-.124.339-.252.502-.386c3.93 1.798 8.18 1.798 12.064 0c.165.134.332.262.503.386c-.649.379-1.331.709-2.037.981c.375.739.808 1.443 1.294 2.11a19.87 19.87 0 0 0 5.994-3.033c.498-5.216-.85-9.74-3.363-13.765ZM8.02 15.331c-1.182 0-2.158-1.085-2.158-2.419c0-1.333.957-2.418 2.158-2.418c1.21 0 2.167 1.094 2.158 2.418c0 1.334-.957 2.419-2.158 2.419Zm7.96 0c-1.182 0-2.158-1.085-2.158-2.419c0-1.333.957-2.418 2.158-2.418c1.21 0 2.167 1.094 2.158 2.418c0 1.334-.948 2.419-2.158 2.419Z" />
                  </svg>
                </a>

                <a
                  href="{{ $community['href'] }}"
                  class="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200/80 bg-zinc-50 text-zinc-700 transition hover:border-emerald-300 hover:text-emerald-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:border-emerald-400/40 dark:hover:text-emerald-300"
                  @if ($community['external']) target="_blank" rel="noopener noreferrer" @endif
                  aria-label="{{ __('similar_communities.visit') }}: {{ __('similar_communities.cards.' . $community['key'] . '.title') }}"
                >
                  <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h8v8" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        @endforeach
      </div>
    </div>
  </section>
@endsection
