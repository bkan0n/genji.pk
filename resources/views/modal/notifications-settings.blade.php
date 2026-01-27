{{-- Settings Modal (overlay + carte) --}}
@php
  $isEmailAuth =
    data_get(session('user'), 'auth_type') === 'email'
    || session('user_provider') === 'email';

  $tr = function (string $key, string $fallback) {
    $v = __($key);
    return $v === $key ? $fallback : $v;
  };
@endphp

<div id="gp-settings-modal" class="fixed inset-0 z-[130] hidden" data-is-email-auth="{{ $isEmailAuth ? '1' : '0' }}">
  <button
    id="gp-settings-backdrop"
    class="absolute inset-0 bg-black/70"
    aria-label="{{ __('modals.settings.close') }}"
  ></button>

  <div class="relative z-10 flex min-h-full">
    <div class="mx-auto w-full max-w-4xl px-4 pt-24">
      <div
        id="gp-settings-card"
        class="pointer-events-auto scale-95 opacity-0 transition duration-200 ease-out"
        data-modal-box
      >
        {{-- ====== Carte Settings ====== --}}
        <article
          class="relative w-full max-w-none overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/80 shadow-2xl backdrop-blur"
        >

          <header class="flex items-center justify-center px-5 pt-5 pb-3">
            <h2 class="text-xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-2xl">
              {{ __('modals.settings.title') }}
            </h2>

            <button
              id="settingsClose"
              type="button"
              class="absolute right-3 top-3 inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 p-2 text-zinc-900 dark:text-white/70 hover:bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 hover:text-zinc-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              aria-label="{{ __('modals.settings.close') }}"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </header>

          <div class="px-4 pb-5 sm:px-5 overflow-y-auto max-h-[calc(85vh-72px)]">
            <div
              role="tablist"
              aria-label="{{ __('modals.settings.tabs_aria') }}"
              class="mb-4 flex items-center justify-center gap-2"
            >
              <button
                type="button"
                class="settings-tab inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition hover:bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 hover:text-zinc-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 data-[active=true]:bg-white data-[active=true]:text-zinc-900 data-[active=true]:hover:bg-white data-[active=true]:hover:text-zinc-900"
                data-target="overwatch-section"
                data-active="true"
                aria-selected="true"
                role="tab"
                id="tab-overwatch"
              >
                {{ __('modals.settings.tabs.overwatch') }}
              </button>
              <button
                type="button"
                class="settings-tab inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition hover:bg-white/35 dark:bg-zinc-900/5 dark:bg-white/10 hover:text-zinc-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 data-[active=true]:bg-white data-[active=true]:text-zinc-900 data-[active=true]:hover:bg-white data-[active=true]:hover:text-zinc-900"
                data-target="notifications-section"
                data-active="false"
                aria-selected="false"
                role="tab"
                id="tab-notifications"
              >
                {{ __('modals.settings.tabs.notifications') }}
              </button>
            </div>

            {{-- Overwatch --}}
            <section
              id="overwatch-section"
              class="settings-section block"
              role="tabpanel"
              aria-labelledby="tab-overwatch"
            >
              <div class="space-y-3 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 p-4">
                <div class="flex items-center gap-2">
                  <div class="flex-1 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/75 dark:bg-zinc-900/60 px-3 py-2">
                    <input
                      id="overwatch-username"
                      type="text"
                      placeholder="{{ __('modals.common.loading') }}"
                      class="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600 dark:text-zinc-500"
                    />
                  </div>
                  <button
                    id="confirm-overwatch-username"
                    class="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-zinc-900 dark:text-white hover:bg-emerald-500"
                    type="button"
                  >
                    {{ __('modals.settings.overwatch.confirm') }}
                  </button>
                </div>
                <div id="overwatch-usernames-list" class="space-y-2"></div>
              </div>
            </section>

            {{-- Notifications --}}
            <section
              id="notifications-section"
              class="settings-section hidden"
              role="tabpanel"
              aria-labelledby="tab-notifications"
            >
              @php
                // Canonical list of event types (must match API "event_type" exactly)
                $events = [
                  'verification_approved' => $tr('modals.settings.notifications.events.verification_approved', 'Verification approved'),
                  'verification_rejected' => $tr('modals.settings.notifications.events.verification_rejected', 'Verification rejected'),
                  'record_removed'        => $tr('modals.settings.notifications.events.record_removed', 'Record removed'),
                  'skill_role_update'     => $tr('modals.settings.notifications.events.skill_role_update', 'Skill role update'),
                  'xp_gain'               => $tr('modals.settings.notifications.events.xp_gain', 'XP gain'),
                  'rank_up'               => $tr('modals.settings.notifications.events.rank_up', 'Rank up'),
                  'prestige'              => $tr('modals.settings.notifications.events.prestige', 'Prestige'),
                  'mastery_earned'        => $tr('modals.settings.notifications.events.mastery_earned', 'Mastery earned'),
                  'lootbox_earned'        => $tr('modals.settings.notifications.events.lootbox_earned', 'Lootbox earned'),
                  'playtest_update'       => $tr('modals.settings.notifications.events.playtest_update', 'Playtest update'),
                ];

                $channels = [
                  'web'         => $tr('modals.settings.notifications.channels.web', 'Web'),
                  'discord_dm'  => $tr('modals.settings.notifications.channels.discord_dm', 'Discord DM'),
                  'discord_ping'=> $tr('modals.settings.notifications.channels.discord_ping', 'Discord Ping'),
                ];
              @endphp

              <div class="rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-900/3 dark:bg-white/5 p-4">
                @if($isEmailAuth)
                  <div class="mb-3 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-black/20 p-3 text-sm text-zinc-800 dark:text-zinc-200">
                    {{ $tr('modals.settings.notifications.discord_unavailable', 'Discord notifications are not available for email accounts.') }}
                  </div>
                @endif

                {{-- Header (desktop) --}}
                <div class="hidden sm:grid grid-cols-4 items-center gap-4 px-3 pb-2 text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                  <div>{{ $tr('modals.settings.notifications.columns.event', 'Event') }}</div>
                  <div class="text-center">{{ $channels['web'] }}</div>
                  <div class="text-center">{{ $channels['discord_dm'] }}</div>
                  <div class="text-center">{{ $channels['discord_ping'] }}</div>
                </div>

                <div
                  id="gp-notification-preferences"
                  class="space-y-2"
                  data-label-web="{{ $channels['web'] }}"
                  data-label-discord-dm="{{ $channels['discord_dm'] }}"
                  data-label-discord-ping="{{ $channels['discord_ping'] }}"
                  data-label-event="{{ $tr('modals.settings.notifications.columns.event', 'Event') }}"
                >
                  @foreach($events as $eventType => $label)
                    @php
                      $eventSlug = str_replace('_', '-', $eventType);
                    @endphp

                    <div class="grid grid-cols-1 sm:grid-cols-4 items-start gap-4 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 px-3 py-2">
                      <div class="min-w-0 text-sm leading-snug text-zinc-800 dark:text-zinc-200">
                        {{ $label }}
                      </div>

                      @foreach($channels as $channel => $channelLabel)
                        @php
                          $disabled = $isEmailAuth && $channel !== 'web';
                          $channelSlug = str_replace('_', '-', $channel);
                          $inputId = "setting-{$channelSlug}-{$eventSlug}";
                        @endphp

                        <div class="flex items-center gap-2 sm:justify-center {{ $disabled ? 'opacity-60' : '' }}">
                          <span class="sm:hidden text-[11px] font-extrabold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                            {{ $channelLabel }}
                          </span>

                          <label class="inline-flex shrink-0 items-center {{ $disabled ? 'cursor-not-allowed' : 'cursor-pointer' }}" @if($disabled) aria-disabled="true" @endif>
                            <input
                              id="{{ $inputId }}"
                              type="checkbox"
                              class="peer sr-only"
                              data-channel="{{ $channel }}"
                              data-event-type="{{ $eventType }}"
                              @disabled($disabled)
                            />
                            <span
                              class="relative h-5 w-9 rounded-full bg-zinc-700 transition-colors duration-200 ease-in-out
                                     peer-checked:bg-emerald-500 peer-disabled:bg-zinc-100 dark:bg-zinc-800 peer-disabled:opacity-60
                                     after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:translate-x-0 after:rounded-full after:bg-white after:transition-transform after:duration-200 after:ease-in-out after:content-['']
                                     peer-checked:after:translate-x-4 active:after:scale-95 peer-disabled:after:bg-zinc-200"
                            ></span>
                          </label>
                        </div>
                      @endforeach
                    </div>
                  @endforeach
                </div>

              </div>
            </section>
          </div>
        </article>
      </div>
    </div>
  </div>
</div>