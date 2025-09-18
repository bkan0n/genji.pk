@extends('layouts.app')

@section('title', 'Genji Parkour - Convertor')
@section('og:title', 'Convertor – Genji Parkour')
@section('og:description', 'OverPy → Workshop converter, translation tools, and map data editor.')

@push('head')
  @php($nonce = csp_nonce())
  <script
    nonce="{{ $nonce }}"
    src="https://cdn.jsdelivr.net/gh/Zezombye/overpy@master/out/overpy_standalone.js"
    defer
  ></script>
  <script
    nonce="{{ $nonce }}"
    src="https://cdn.jsdelivr.net/npm/diff@5.1.0/dist/diff.min.js"
    defer
  ></script>
@endpush

@section('content')
  <!-- Hero -->
  <section class="relative overflow-visible">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div class="grid items-start gap-10 lg:grid-cols-12">
        <div class="space-y-4 lg:col-span-8">
          <span
            class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-300"
          >
            <span class="bg-brand-400 inline-block h-2 w-2 rounded-full"></span>
            {{ __('convertor.badge_tools') }}
          </span>
          <h1
            class="text-4xl leading-[1.15] font-black tracking-tight sm:text-5xl sm:leading-[1.12]"
          >
            {{ __('convertor.hero_title_top') }}
            <span
              class="from-brand-300 block bg-gradient-to-r via-emerald-200 to-white bg-clip-text pb-1 text-transparent sm:pb-1.5"
            >
              {{ __('convertor.hero_title_bottom') }}
            </span>
          </h1>
          <p class="max-w-2xl text-zinc-300">
            {{ __('convertor.hero_sub') }}
          </p>
        </div>

        <div class="lg:col-span-4">
          <div class="relative rounded-2xl border border-white/10 bg-white/5 p-2">
            <div class="rounded-xl bg-zinc-900 p-5">
              <div class="mb-3 text-xs text-zinc-400">
                {{ __('convertor.tips_title') }}
              </div>
              <ul class="space-y-2 text-sm text-zinc-300">
                <li class="rounded-lg border border-white/10 p-3">{{ __('convertor.tips_1') }}</li>
                <li class="rounded-lg border border-white/10 p-3">{{ __('convertor.tips_2') }}</li>
                <li class="rounded-lg border border-white/10 p-3">{{ __('convertor.tips_3') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mt-10">
        <div id="mainTabs" class="inline-flex rounded-xl border border-white/10 bg-white/5 p-1">
          <button
            id="convertMapBtn"
            class="active cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900"
          >
            {{ __('convertor.convert_map') }}
          </button>
          <button
            id="helpBtn"
            class="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            {{ __('convertor.help') }}
          </button>
          <button
            id="mapSettingsBtn"
            class="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            {{ __('convertor.edit_map_data') }}
          </button>
        </div>
      </div>

      <!-- Convertor card -->
      <div
        id="convertMap"
        class="convert-map-layout mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6"
      >
        <div class="flex items-center justify-between gap-3">
          <p class="text-sm text-zinc-300">
            {{ __('convertor.description_line_1') }}
            <br />
            {{ __('convertor.description_line_2') }}
            <br />
            {{ __('convertor.description_line_3') }}
            <br />
            {{ __('convertor.description_line_4') }}
          </p>
          <button
            class="copy-btn inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
          >
            {{ __('convertor.copy_to_clipboard') }}
          </button>
        </div>

        <!-- Import info -->
        <div class="mt-6 grid gap-4 sm:grid-cols-3">
          <div class="column yes rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <h3 class="mb-2 text-sm font-semibold text-emerald-200">{{ __('convertor.yes') }}</h3>
            <ul class="list-disc space-y-1 pl-4 text-sm text-zinc-300">
              <li>{{ __('convertor.yes_1') }}</li>
              <li>{{ __('convertor.yes_2') }}</li>
              <li>{{ __('convertor.yes_3') }}</li>
              <li>{{ __('convertor.yes_4') }}</li>
              <li>{{ __('convertor.yes_5') }}</li>
              <li>{{ __('convertor.yes_6') }}</li>
            </ul>
          </div>
          <div class="column maybe rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-4">
            <h3 class="mb-2 text-sm font-semibold text-yellow-200">{{ __('convertor.maybe') }}</h3>
            <ul class="list-disc space-y-1 pl-4 text-sm text-zinc-300">
              <li>{{ __('convertor.maybe_1') }}</li>
              <li>{{ __('convertor.maybe_2') }}</li>
            </ul>
          </div>
          <div class="column no rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
            <h3 class="mb-2 text-sm font-semibold text-rose-200">{{ __('convertor.no') }}</h3>
            <ul class="list-disc space-y-1 pl-4 text-sm text-zinc-300">
              <li>{{ __('convertor.no_1') }}</li>
              <li>{{ __('convertor.no_2') }}</li>
              <li>{{ __('convertor.no_3') }}</li>
              <li>{{ __('convertor.no_4') }}</li>
            </ul>
          </div>
        </div>

        <!-- Controls -->
        <div class="convert-controls mt-6 flex flex-wrap items-center gap-3 text-sm">
          <label for="lang" class="text-zinc-300">{{ __('convertor.pasta_language') }}:</label>
          <select id="lang" class="cursor-pointer rounded-lg border border-white/10 px-3 py-2">
            <option value="en-US">English</option>
            <option value="zh-CN">简体中文</option>
            <option value="ja-JP">日本語</option>
            <option value="ko-KR">한국어</option>
            <option value="ru-RU">Русский</option>
            <option value="es-MX">Español</option>
            <option value="pt-BR">Português</option>
            <option value="de-DE">Deutsch</option>
          </select>

          <button
            id="convert-btn"
            class="cursor-pointer rounded-lg border border-white/10 px-4 py-2 hover:bg-white/5"
          >
            {{ __('convertor.convert_data') }}
          </button>

          <label for="targetLang" class="ml-2 text-zinc-300">
            {{ __('convertor.target_language') }}:
          </label>
          <select id="targetLang" class="rounded-lg border border-white/10 px-3 py-2">
            <option value="en-US">English</option>
            <option value="zh-CN">简体中文</option>
            <option value="ja-JP">日本語</option>
            <option value="ko-KR">한국어</option>
            <option value="ru-RU">Русский</option>
            <option value="es-MX">Español</option>
            <option value="pt-BR">Português</option>
            <option value="de-DE">Deutsch</option>
          </select>

          <button
            id="translate-btn"
            class="cursor-pointer rounded-lg border border-white/10 px-4 py-2 hover:bg-white/5"
          >
            {{ __('convertor.translate_data') }}
          </button>

          <button
            id="diff-btn"
            class="diff-btn hidden cursor-pointer rounded-lg border border-white/10 px-4 py-2 hover:bg-white/5"
          >
            {{ __('convertor.diffchecker') }}
          </button>
        </div>

        <!-- Textarea -->
        <textarea
          class="mapdata mt-4 h-80 w-full resize-y rounded-xl border border-white/10 bg-zinc-900/80 p-4 font-mono text-sm text-zinc-100 placeholder:text-zinc-500"
          placeholder="{{ __('convertor.map_placeholder') }}"
        ></textarea>

        <!-- Footer info -->
        <div class="footer mt-3 flex items-center justify-between text-xs text-zinc-400">
          <span class="footer-left">{{ __('convertor.footer_made_by') }}</span>
          <span class="footer-right">{{ __('convertor.footer_version') }}</span>
        </div>
      </div>

      <!-- Help -->
      <div id="help" class="content help-section mt-6 hidden">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6">
          <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div class="help-step space-y-2">
              <strong class="block">{{ __('convertor.step1') }}</strong>
              <p class="text-sm text-zinc-300">{{ __('convertor.step1_text') }}</p>
              <img
                class="rounded-lg ring-1 ring-white/10"
                src="{{ asset('assets/abilities/copy-settings.webp') }}"
                alt="Copy settings"
              />
            </div>

            <div class="help-step space-y-2">
              <strong class="block">{{ __('convertor.step2') }}</strong>
              <p class="text-sm text-zinc-300">{{ __('convertor.step2_text') }}</p>
              <img
                class="rounded-lg ring-1 ring-white/10"
                src="{{ asset('assets/abilities/text-area.webp') }}"
                alt="Text area"
              />
            </div>

            <div class="help-step space-y-2">
              <strong class="block">{{ __('convertor.step3') }}</strong>
              <p class="text-sm text-zinc-300">{{ __('convertor.step3_text') }}</p>
              <div class="text-xs text-zinc-300">
                <code class="rounded bg-white/10 px-1.5 py-0.5">
                  {{ __('convertor.step3_convert') }}
                </code>
                ,
                <code class="rounded bg-white/10 px-1.5 py-0.5">
                  {{ __('convertor.step3_translate') }}
                </code>
              </div>
              <img
                class="rounded-lg ring-1 ring-white/10"
                src="{{ asset('assets/abilities/pasta-language.webp') }}"
                alt="Language settings"
              />
            </div>

            <div class="help-step space-y-2">
              <strong class="block">{{ __('convertor.step4') }}</strong>
              <p class="text-sm text-zinc-300">{{ __('convertor.step4_text') }}</p>
              <img
                class="rounded-lg ring-1 ring-white/10"
                src="{{ asset('assets/abilities/edit-map-data.webp') }}"
                alt="Edit map data"
              />
            </div>

            <div class="help-step space-y-2">
              <strong class="block">{{ __('convertor.step5') }}</strong>
              <p class="text-sm text-zinc-300">{{ __('convertor.step5_text') }}</p>
              <img
                class="rounded-lg ring-1 ring-white/10"
                src="{{ asset('assets/abilities/pasta-settings.webp') }}"
                alt="Paste settings"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Map settings -->
      <div
        id="mapSettings"
        class="convert-map-layout mt-6 hidden rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6"
      >
        <div class="global-infos mb-3 flex flex-wrap items-center justify-between gap-3">
          <div class="global-bans text-sm text-zinc-300"></div>
          <div class="settings-buttons flex items-center gap-2">
            <button
              id="globalSettingsBtn"
              class="global-edit-mode-btn cursor-pointer rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
            >
              {{ __('convertor.global_settings') }}
            </button>
            <button
              id="editModeBtn"
              class="edit-mode-btn cursor-pointer rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
            >
              {{ __('convertor.edit_mode') }}
            </button>
          </div>
        </div>

        <div
          class="empty-message rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-zinc-300"
        >
          {{ __('convertor.please_use_converter') }}
        </div>
      </div>
    </div>
  </section>

  <!-- Modals -->
  <!-- Edit checkpoint -->
  <div
    id="editModal"
    class="modal fixed inset-0 z-[300] hidden items-center justify-center bg-black/50 p-4"
  >
    <div
      class="modal-content2 w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-900 p-5 ring-1 ring-white/10"
      data-modal-box
    >
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">{{ __('convertor.map_data.edit_checkpoint') }}</h3>
        <button
          id="closeModal2"
          class="modal-close2 rounded-full px-2 py-0.5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
        >
          &times;
        </button>
      </div>
      <form id="editForm" class="mt-4 space-y-4">
        <div id="editFieldsContainer" class="space-y-3"></div>
        <div class="modal-buttons3 flex justify-end gap-2">
          <button
            type="button"
            id="saveEditorChangesBtn"
            class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-500"
          >
            {{ __('convertor.map_data.save') }}
          </button>
          <button
            type="button"
            id="cancelEditorChangesBtn"
            class="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
          >
            {{ __('convertor.map_data.cancel') }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Global settings -->
  <div
    id="globalSettingsModal"
    class="modal fixed inset-0 z-[300] hidden items-center justify-center bg-black/50 p-4"
  >
    <div
      class="modal-content2 w-full max-w-2xl rounded-2xl border border-white/10 bg-zinc-900 p-5 ring-1 ring-white/10"
      data-modal-box
    >
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">{{ __('convertor.map_data.global_settings') }}</h3>
        <button
          id="closeGlobalModal"
          class="modal-close2 rounded-full px-2 py-0.5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
        >
          &times;
        </button>
      </div>
      <form id="globalSettingsForm" class="mt-4">
        <div id="globalSettingsFields" class="space-y-3"></div>
        <div class="modal-buttons2 mt-4 flex justify-end gap-2">
          <button
            type="button"
            id="saveGlobalChangesBtn"
            class="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-500"
          >
            {{ __('convertor.map_data.save') }}
          </button>
          <button
            type="button"
            id="cancelGlobalChangesBtn"
            class="rounded-lg border border-white/10 px-3 py-1.5 text-sm hover:bg-white/5"
          >
            {{ __('convertor.map_data.cancel') }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Diff modal -->
  <div
    id="diffModal"
    class="modal-diff fixed inset-0 z-[300] hidden items-center justify-center bg-black/50 p-4"
  >
    <div
      class="modal-content3 relative max-h-[80vh] w-full max-w-5xl overflow-auto rounded-2xl border border-white/10 bg-zinc-900 p-5 ring-1 ring-white/10"
      data-modal-box
    >
      <button
        class="modal-close absolute top-2 right-3 rounded-full px-2 py-0.5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
      >
        &times;
      </button>
      <pre id="diffContent" class="font-mono text-sm whitespace-pre-wrap text-zinc-100"></pre>
    </div>
  </div>
@endsection

@push('scripts')
  <script nonce="{{ $nonce }}">
    document.documentElement.lang = @json(app()->getLocale());
    window.CONVERTOR_I18N = @json(\Illuminate\Support\Facades\Lang::get('convertor'));
  </script>
  @vite('resources/js/pages/convertor.js', null, ['nonce' => csp_nonce()])
@endpush
