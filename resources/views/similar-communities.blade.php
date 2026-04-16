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
          'image' => 'https://cdn.doom.pk/content/ec919fa6-66ac-4f44-b5b0-285fd16e2c17.png',
          'external' => true,
      ],
      [
          'key' => 'mercy',
          'href' => 'https://mercyparkour.codes/',
          'image' => 'https://cdn.doom.pk/content/3f69b687-0ed2-45f4-9cc5-3645b6dc19aa.png',
          'external' => true,
      ],
      [
          'key' => 'lucio',
          'href' => 'https://www.luciosurfleague.com/',
          'image' => 'https://cdn.doom.pk/content/8ab3aac4-aec0-429d-9536-6a38c24d13d3.png',
          'external' => true,
      ],
      [
          'key' => 'gemster',
          'href' => 'https://discord.me/lavaparkour',
          'image' => 'https://cdn.doom.pk/content/54293283-8373-4bd7-a89d-7885f78eeca9.png',
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
          <a
            href="{{ $community['href'] }}"
            class="group overflow-hidden rounded-lg border border-zinc-200/80 bg-white/70 transition hover:border-zinc-300 hover:bg-white/85 dark:border-white/10 dark:bg-zinc-950/70 dark:hover:border-white/15 dark:hover:bg-zinc-950/85"
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

            <div class="flex items-end justify-between gap-4 p-5">
              <div class="min-w-0">
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
              </div>

              <span class="mb-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200/80 bg-zinc-50 text-zinc-700 transition group-hover:border-emerald-300 group-hover:text-emerald-600 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:group-hover:border-emerald-400/40 dark:group-hover:text-emerald-300">
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7 17 17 7" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h8v8" />
                </svg>
              </span>
            </div>
          </a>
        @endforeach
      </div>
    </div>
  </section>
@endsection
