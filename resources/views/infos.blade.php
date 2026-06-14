@extends('layouts.app')

@section('title', __('infos.meta.title'))
@section('og:title', __('infos.meta.og.title'))
@section('og:description', __('infos.meta.og.description'))

@push('head')
  @php($nonce = csp_nonce())
@endpush

@section('content')
<section class="relative overflow-visible min-h-[100vh] text-zinc-900 dark:text-white">
  <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">

  {{-- Hero --}}
  <div class="mb-6 sm:mb-8">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight sm:text-4xl">
          {{ __('infos.hero.title') }}
          <span class="block text-sm font-medium text-zinc-600 dark:text-zinc-300 sm:text-base">
            {{ __('infos.hero.subtitle') ?? 'ranks · submissions · playtesting · techniques' }}
          </span>
        </h1>
      </div>
    </div>
  </div>

    {{-- Tabs --}}
    <div class="mb-8 overflow-x-auto pb-2">
      <div id="infosTabs" class="relative inline-flex rounded-xl border border-zinc-200 bg-white/70 p-1 text-xs shadow-sm backdrop-blur sm:text-sm dark:border-white/10 dark:bg-white/5">
        <div id="tabHighlight" class="absolute top-1 left-1 h-[calc(100%-0.5rem)] rounded-lg bg-zinc-900 shadow-[0_1px_0_rgba(0,0,0,.06),0_12px_30px_rgba(0,0,0,.14)] transition-all duration-300 ease-out will-change-transform dark:bg-white dark:shadow-[0_1px_0_rgba(255,255,255,.06),0_8px_30px_rgba(0,0,0,.25)]"></div>

        <button type="button" class="infos-tab relative z-10 rounded-lg px-4 py-2 font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/10" data-infos-tab="skill_rank" data-active="true">
          {{ __('infos.tabs.skill_rank') }}
        </button>
        <button type="button" class="infos-tab relative z-10 rounded-lg px-4 py-2 font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/10" data-infos-tab="skill_score">
          {{ __('infos.tabs.skill_score') }}
        </button>
        <button type="button" class="infos-tab relative z-10 rounded-lg px-4 py-2 font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/10" data-infos-tab="score_rank">
          {{ __('infos.tabs.score_rank') }}
        </button>
        <button type="button" class="infos-tab relative z-10 rounded-lg px-4 py-2 font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/10" data-infos-tab="playtesting">
          {{ __('infos.tabs.playtesting') }}
        </button>
        <button type="button" class="infos-tab relative z-10 rounded-lg px-4 py-2 font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/10" data-infos-tab="submit">
          {{ __('infos.tabs.submit_map') }}
        </button>
        <button type="button" class="infos-tab relative z-10 rounded-lg px-4 py-2 font-semibold text-zinc-700 hover:bg-zinc-100 dark:text-white dark:hover:bg-white/10" data-infos-tab="techs">
          {{ __('infos.tabs.techs') }}
        </button>
      </div>
    </div>

    {{-- Content --}}
    <div class="space-y-10">
      {{-- Skill Rank --}}
      <div data-infos-kind="rank_how_to_submit"     data-infos-group="skill_rank" class="space-y-4"></div>
      <div data-infos-kind="rank_submission_rules"  data-infos-group="skill_rank" class="space-y-4"></div>
      <div data-infos-kind="rank_info_thresholds"   data-infos-group="skill_rank" class="space-y-4"></div>
      <div data-infos-kind="rank_medals_thresholds" data-infos-group="skill_rank" class="space-y-4"></div>

      {{-- Skill Score --}}
      <div data-infos-kind="skill_score" data-infos-group="skill_score" class="space-y-4" hidden></div>

      {{-- Score Rank --}}
      <div data-infos-kind="score_rank" data-infos-group="score_rank" class="space-y-4" hidden></div>

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
  window.SKILL_SCORE_I18N = @json(\Illuminate\Support\Facades\Lang::get('skill.formula'));
</script>
@vite('resources/js/pages/infos.js')
@endpush
