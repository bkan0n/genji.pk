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
  <div class="mb-6 sm:mb-8">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {{ __('infos.hero.title') }}
          <span class="block text-sm font-medium text-zinc-300 sm:text-base">
            {{ __('infos.hero.subtitle') ?? 'ranks · submissions · playtesting · techniques' }}
          </span>
        </h1>
      </div>
    </div>
  </div>

    {{-- Tabs --}}
    <div class="mb-8">
      <div id="infosTabs" class="relative inline-flex rounded-xl border border-white/10 bg-white/5 p-1 text-xs sm:text-sm">
        <div id="tabHighlight" class="absolute top-1 left-1 h-[calc(100%-0.5rem)] rounded-lg bg-white transition-all duration-300 ease-out will-change-transform"></div>

        <button type="button" class="infos-tab relative z-10 rounded-lg px-4 py-2 font-semibold text-white hover:bg-white/10" data-infos-tab="ranking_process" data-active="true">
          {{ __('infos.tabs.ranking_process') }}
        </button>
        <button type="button" class="infos-tab relative z-10 rounded-lg px-4 py-2 font-semibold text-white hover:bg-white/10" data-infos-tab="ranks_threshold">
          {{ __('infos.tabs.ranks_threshold') }}
        </button>
        <button type="button" class="infos-tab relative z-10 rounded-lg px-4 py-2 font-semibold text-white hover:bg-white/10" data-infos-tab="playtesting">
          {{ __('infos.tabs.playtesting') }}
        </button>
        <button type="button" class="infos-tab relative z-10 rounded-lg px-4 py-2 font-semibold text-white hover:bg-white/10" data-infos-tab="submit">
          {{ __('infos.tabs.submit_map') }}
        </button>
        <button type="button" class="infos-tab relative z-10 rounded-lg px-4 py-2 font-semibold text-white hover:bg-white/10" data-infos-tab="techs">
          {{ __('infos.tabs.techs') }}
        </button>
      </div>
    </div>

    {{-- Content --}}
    <div class="space-y-10">
      {{-- Ranking process --}}
      <div data-infos-kind="rank_how_to_submit"     data-infos-group="ranking_process" class="space-y-4"></div>
      <div data-infos-kind="rank_submission_rules"  data-infos-group="ranking_process" class="space-y-4"></div>
      {{-- Ranks thresholds --}}
      <div data-infos-kind="rank_info_thresholds"   data-infos-group="ranks_threshold" class="space-y-4" hidden></div>
      <div data-infos-kind="rank_medals_thresholds" data-infos-group="ranks_threshold" class="space-y-4" hidden></div>

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
