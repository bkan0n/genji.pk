@extends('layouts.app')

@section('title', __('infos.meta.title'))
@section('og:title', __('infos.meta.og.title'))
@section('og:description', __('infos.meta.og.description'))

@push('head')
  @php($nonce = csp_nonce())
@endpush

@section('content')
  <section class="relative overflow-visible min-h-[100vh]">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      {{-- Hero --}}
      <div class="mb-10 space-y-4 sm:mb-12">
        <div class="space-y-3">
          <h1 class="text-3xl font-black tracking-tight sm:text-4xl">
            {{ __('infos.hero.title') }}
          </h1>
          <p class="max-w-2xl text-sm text-zinc-300 sm:text-base">
            {{ __('infos.hero.subtitle') }}
          </p>
        </div>
      </div>

      {{-- Tabs --}}
      <div class="mb-8 flex flex-wrap gap-2 text-xs sm:text-sm">
        <button
          type="button"
          class="infos-tab cursor-pointer inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-zinc-300 hover:border-emerald-400/40"
          data-infos-tab="rank"
          data-active="true"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
          <span>{{ __('infos.tabs.ranks') }}</span>
        </button>
        <button
          type="button"
          class="infos-tab cursor-pointer inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-zinc-300 hover:border-emerald-400/40"
          data-infos-tab="playtesting"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
          <span>{{ __('infos.tabs.playtesting') }}</span>
        </button>
        <button
          type="button"
          class="infos-tab cursor-pointer inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-zinc-300 hover:border-emerald-400/40"
          data-infos-tab="submit"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-sky-400"></span>
          <span>{{ __('infos.tabs.submit_map') }}</span>
        </button>
        <button
          type="button"
          class="infos-tab cursor-pointer inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 font-medium text-zinc-300 hover:border-emerald-400/40"
          data-infos-tab="techs"
        >
          <span class="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
          <span>{{ __('infos.tabs.techs') }}</span>
        </button>
      </div>

      {{-- Content --}}
      <div class="space-y-10">
        {{-- Rank tab: 4 sections --}}
        <div data-infos-kind="rank_how_to_submit" data-infos-group="rank" class="space-y-4"></div>

        <div data-infos-kind="rank_submission_rules" data-infos-group="rank" class="space-y-4"></div>

        <div data-infos-kind="rank_info_thresholds" data-infos-group="rank" class="space-y-4"></div>

        <div data-infos-kind="rank_medals_thresholds" data-infos-group="rank" class="space-y-4"></div>

        {{-- Playtesting tab --}}
        <div data-infos-kind="playtesting_info" data-infos-group="playtesting" class="space-y-4" hidden></div>

        {{-- Submit map tab --}}
        <div data-infos-kind="how_to_submit" data-infos-group="submit" class="space-y-4" hidden></div>

        {{-- Techs & difficulty tab --}}
        <div data-infos-kind="difficulty_techs_info" data-infos-group="techs" class="space-y-4" hidden></div>
      </div>
    </div>
  </section>
@endsection

@push('scripts')
  <script nonce="{{ $nonce }}">
    document.documentElement.lang = @json(app()->getLocale());
    window.INFOS_I18N = @json(\Illuminate\Support\Facades\Lang::get('infos'));
  </script>
  @vite('resources/js/pages/infos.js')
@endpush
