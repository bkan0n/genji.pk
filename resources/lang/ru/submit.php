<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Submit & Playtest (RU)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // HERO & TABS
    // ──────────────────────────────────────────────────────────────────────
    'header' => [
        'title'    => 'Отправить и протестировать',
        'subtitle' => 'карты · записи · отзывы',
    ],

    'tabs' => [
        'record'   => 'Отправить завершение',
        'playtest' => 'Отправить голосование за тестирование',
        'map'      => 'Отправить карту',
    ],

    'help' => [
        'how_to_submit'         => 'Как отправить?',
        'playtesting_info'      => 'Информация о тестировании',
        'difficulty_techs_info' => 'Информация о сложности и техниках',
        'rank_how_to_submit'      => 'Как отправить?',
        'rank_submission_rules'   => 'Правила отправки',
        'rank_info_thresholds'    => 'Информация о рангах и порогах',
        'medals_info_thresholds'  => 'Информация о медалях и порогах',
    ],

    'help_groups' => [
        'map_submission_info' => 'Информация о отправке карт',
        'rank_promotion'      => 'Повышение ранга',
    ],

    'notice' => [
        'title' => 'Отправка на тестирование',
        'pending_accept' => "Ваша отправка не будет засчитана в официальные записи, пока карта не будет принята.",
        'mutable_difficulty' => 'Сложность может измениться в любое время, пока карта не будет завершена.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RECORD (Submit Record tab)
    // ──────────────────────────────────────────────────────────────────────
    'record' => [
        'select_quality'    => 'Выберите качество (1–6)',
        'optional'          => 'Необязательно',
        'video'             => 'Видео (URL)',
        'screenshot'        => 'Скриншот',
        'drag_and_drop'     => 'Перетащите изображение сюда или нажмите, чтобы загрузить',
        'cancel'            => 'Отмена',
        'submit_label'      => 'Отправить запись',

        'code_invalid'        => 'Пожалуйста, введите действительный код карты.',
        'time_label'          => 'Время записи',
        'time_invalid'        => 'Пожалуйста, введите действительное время.',
        'quality_required'    => 'Пожалуйста, выберите качество.',
        'screenshot_required' => 'Пожалуйста, загрузите скриншот.',
        'video_invalid'       => 'Пожалуйста, введите действительный URL видео.',
        'confirm' => 'Ваша запись была успешно отправлена.',

        'time_hint' => 'Неверный формат времени: до 5 цифр перед точкой и 2 после (например, 12345.67).',
        'view_modal' => 'Просмотреть тестирование',

        'quality'   => 'Качество',
        'quality_1' => '1 - Плохо',
        'quality_2' => '2 - Ниже среднего',
        'quality_3' => '3 - Средне',
        'quality_4' => '4 - Хорошо',
        'quality_5' => '5 - Отлично',
        'quality_6' => '6 - Превосходно',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP
    // ──────────────────────────────────────────────────────────────────────
    'map' => [
        'meta' => [
            'creator'           => 'Создатель',
            'code'              => 'Код',
            'name'              => 'Название карты',
            'checkpoints'       => 'Контрольные точки',
            'edit'              => 'Редактировать',
            'add_creator'       => 'Добавить создателя',
            'search_creator'    => 'Поиск создателя…',
            'search_map_name'   => 'Поиск названия карты…',
        ],

        'required_title'          => 'Обязательно',
        'dropdown' => [
            'select_difficulty'   => 'Выберите сложность',
            'select_category'     => 'Выберите категорию',
            'select_mechanics'    => 'Выберите механику',
            'select_restrictions' => 'Выберите ограничения',
            'difficulty'          => 'Сложность',
            'category'            => 'Тип карты',
            'mechanics'           => 'Механика',
            'restrictions'        => 'Ограничения',
        ],

        'optional_title'         => 'Необязательно',
        'title_label'            => 'Название',
        'title_placeholder'      => 'Необязательное короткое название (макс. 128 символов)',
        'custom_banner'          => 'Пользовательский баннер',
        'banner_hint'            => 'Рекомендуется 16:9. JPG/PNG/WebP/AVIF, макс. 10 МБ.',
        'description_label'      => 'Описание',
        'guide_label'            => 'Руководство (URL)',
        'guide_hint'             => 'Один URL на строку; используется первый действительный URL.',
        'medals_hint'            => 'Формат: макс. 5 цифр перед десятичной точкой и до 2 после (например, 12345.67). Значения ≥ 0. Обязательный порядок: бронза > серебро > золото.',
        'remove'                 => 'Удалить',

        'submit_label' => 'Отправить карту',

        'val' => [
            'creator'                => 'Пожалуйста, выберите основного создателя.',
            'map_code'               => 'Пожалуйста, введите действительный код карты.',
            'map_code_already_exist' => 'Этот код карты уже существует.',
            'map_name'               => 'Пожалуйста, введите название карты.',
            'checkpoints'            => 'Пожалуйста, выберите сложность.',
            'map_type'               => 'Пожалуйста, выберите тип карты.',
            'mechanics'              => 'Пожалуйста, выберите хотя бы одну механику.',
            'restrictions'           => 'Пожалуйста, выберите хотя бы одно ограничение.',
            'medals_generic'         => 'Недействительные медали.',
            'medals_missing'         => 'Пожалуйста, заполните все три значения медалей.',
            'medals_order'           => 'Порядок должен быть: бронза > серебро > золото.',
        ],

        'confirm'        => 'Ваша карта была успешно отправлена.',

        'no_description' => 'Описание не предоставлено.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // HELP MODALS (full texts for modals)
    // ──────────────────────────────────────────────────────────────────────
    'help_modal' => [
        'common' => [
            'title'       => 'Помощь',
            'close_label' => 'Закрыть',
            'soon'        => 'Скоро.',
        ],

        'rank_promotion' => [
            'how_to_submit' => [
                'title' => 'Повышение ранга · Как подать заявку?',
            ],
            'submission_rules' => [
                'title' => 'Повышение ранга · Правила подачи',
            ],
            'rank_info_thresholds' => [
                'title' => 'Информация о ранге и пороги',
            ],
            'medals_info_thresholds' => [
                'title' => 'Информация о медалях и пороги',
            ],
        ],

        'how_to_submit' => [
            'title' => 'Как подать карту?',
            'intro' => 'Этот диалог проведет вас через каждый шаг раздела «Подать карту».',

            'meta' => [
                'title'        => '1) Метаданные (карта и создатели)',
                'li_creator'   => 'Основной создатель: автоматически заполняется из вашей сессии. Вы можете изменить его (и добавить со-создателей, если опция видима).',
                'li_code'      => 'Код карты: нажмите «Изменить» рядом с полем «Код». Код должен быть уникальным (мы проверяем, существует ли он уже).',
                'li_name'      => 'Название карты: нажмите «Изменить» рядом с «Название карты» и выберите название с помощью автозаполнения.',
                'li_checkpoints'=> 'Контрольные точки: нажмите «Изменить» и введите строго положительное число.',
            ],

            'required' => [
                'title'        => '2) Обязательные поля',
                'p1'           => 'Эти поля должны быть заполнены перед отправкой:',
                'li_difficulty'=> 'Сложность: выберите значение (Легкий → Ад).',
                'li_category'  => 'Категория / Тип карты: выберите тип (например, Классический, Увеличение сложности).',
                'li_mechanics' => 'Механика: выберите хотя бы одну.',
                'li_restrictions'=> 'Ограничения: выберите хотя бы одно.',
            ],

            'medals' => [
                'title'  => '3) Медали (необязательно, но проверяются при наличии)',
                'p1'     => 'Вы можете определить время (в секундах) для золота, серебра и бронзы.',
                'li_rules'   => 'Если вы установите одну медаль, вы должны установить все три.',
                'li_pattern' => 'Формат: 1–5 цифр, опционально “.” и 1–2 десятичных знака (например, 5550.23). Неположительные значения.',
                'li_order'   => 'Обязательный порядок: Бронза > Серебро > Золото (Бронза больше Серебра, которое больше Золота).',
            ],

            'optional' => [
                'title'      => '4) Необязательно',
                'li_title'   => 'Название: короткое необязательное название (макс. 128 символов).',
                'li_banner'  => 'Пользовательский баннер: перетащите и отпустите или нажмите, чтобы загрузить (JPG/PNG/WebP/AVIF), размер ≤ 8 МБ. Рекомендуется 16:9.',
                'li_description' => 'Описание: свободный текст (если пусто, отображается “N/A”).',
                'li_guide'   => 'URL-адрес(а) руководства: один URL на строку. Первый действительный URL используется.',
            ],

            'submit' => [
                'title'           => '5) Отправить',
                'li_validation'   => 'Нажмите “Отправить”. Форма проверяет: основной создатель, уникальный код, название карты, контрольные точки > 0, сложность, категория, ≥1 механика и ≥1 ограничение, а также согласованность медалей, если они присутствуют.',
                'li_confirmation' => 'При успешной отправке появляется уведомление, и форма сбрасывается.',
            ],

            'tips' => [
                'title'    => 'Советы',
                'li_edit'  => 'Поля с кнопкой «Изменить» можно быстро исправить прямо в форме.',
                'li_guest' => 'Если вы не вошли в систему, отправка заблокирована, и отображается сообщение «Требуется вход в систему».',
                'li_support'=> 'Если загрузка баннера не удалась, попробуйте снова (≤ 8 МБ) или свяжитесь с поддержкой.',
            ],
        ],

        'playtesting_info' => [
            'title' => 'Информация о тестировании',

            // — Обзор / соответствие ---------------------------------------------------------
            'must_submit_completion' => 'Вы должны подать завершение карты, чтобы проголосовать!',

            // — Правила -------------------------------------------------------------------------
            'rules' => [
                'title' => 'Правила тестирования',
                'needs_votes_and_completions' => 'Каждая сложность требует определенного количества голосов и подач завершений.',
                'creator_cannot_vote' => 'Создатели не могут голосовать за свою собственную карту; их подача карты содержит их лучшее предположение о сложности.',
                'playtesters_give_tips' => 'Тестировщики предоставят советы создателю о том, как улучшить карту, или что должно измениться, если есть явные проблемы.',
            ],

            // — Process (4 phases + precise steps) -------------------------------------------
            'process' => [
                'title' => 'Процесс',

                // Phase labels
                'creation'     => 'Этап создания',
                'testing'      => 'Этап тестирования',
                'verification' => 'Этап проверки',
                'acceptance'   => 'Этап принятия',

                // Steps (exact labels from the diagram)
                'steps' => [
                    'map_is_made'                               => 'Карта создана',
                    'map_submission_form'                       => 'Форма подачи карты',

                    'creator_suggests_difficulty'               => 'Создатель предлагает сложность',
                    'testers_submit_completion'                 => 'Тестировщики подают завершение',
                    'testers_vote_on_difficulty'                => 'Тестировщики голосуют за сложность',
                    'creator_finalizes_submission'              => 'Создатель завершает подачу',

                    'sensei_receive_submission_notification'    => 'Sensei получает уведомление о подаче',
                    'sensei_approval'                           => 'Sensei одобряет',
                    'accept'                                    => 'Принять',
                    'reject'                                    => 'Отклонить',
                    'map_sent_back_previous_step'               => 'Карта отправлена обратно на предыдущий этап*',

                    'map_accepted'                              => 'Карта принята',
                    'map_added_to_pool'                         => 'Карта добавлена в пул карт',
                    'testers_granted_completion_without_time'   => 'Тестировщики получили завершение (без времени)',
                ],

                // Notes under/around the diagram
                'notes' => [
                    'change_only_by_sensei' => 'Изменение деталей карты может быть выполнено только через Sensei (ограничения, код и т. д.).',
                    'sensei_power'          => 'В любой момент Sensei имеет возможность вручную принудить любой результат или вернуться к любому этапу.',
                    'verification_removal'  => '* Завершения и голоса могут быть удалены на этом этапе.',
                ],
            ],

            // — Required votes table ----------------------------------------------------------
            'votes' => [
                'title' => 'Требуемые голоса',
                'votes' => 'голоса',
                'vote'  => 'голос',

                // Row labels (left column)
                'beginner_to_hard' => 'Beginner → Hard',
                'very_hard'        => 'Very Hard',
                'extreme'          => 'Extreme',
                'hell'             => 'Hell',

                // Right column if you want to render counts via i18n (optional)
                'counts' => [
                    'beginner_to_hard' => '5 голосов',
                    'very_hard'        => '3 голоса',
                    'extreme'          => '2 голоса',
                    'hell'             => '1 голос',
                ],
            ],
        ],

        'difficulty_techs_info' => [
            'title'        => 'Сложность и Техники',
            'legend_title' => 'Легенда',
            'legend' => [
                'lv1_title' => 'Простой / приоритетное использование',
                'lv1_desc'  => 'Простое и легкое использование техники с приоритетом на нее.',
                'lv2_title' => 'Общий / иногда продвинутый',
                'lv2_desc'  => 'Частое использование общей техники и редкое использование продвинутых форм.',
                'lv3_title' => 'Продвинутый / требовательный',
                'lv3_desc'  => 'Сложное и требовательное использование техники.',
            ],
            'matrix_title' => 'Техники по сложности',

            // Optional local labels (used as fallback if you don’t want to reuse filters.*)
            'labels' => [
                'beginner'  => 'Beginner',
                'easy'      => 'Easy',
                'medium'    => 'Medium',
                'hard'      => 'Hard',
                'very_hard' => 'Very Hard',
                'extreme'   => 'Extreme',
                'hell'      => 'Hell',
            ],

            // Technique names (rows)
            'techs' => [
                'basics'        => 'Basics*',
                'bhop'          => 'Bhop**',
                'edge_climb'    => 'Edge Climb',
                'stall'         => 'Stall',
                'crouch_edge'   => 'Crouch Edge',
                'save_climb'    => 'Save Climb',
                'distance_edge' => 'Distance Edge',
                'high_edge'     => 'High Edge',
                'multi_climb'   => 'Multi Climb',
                'create_bhop'   => 'Create Bhop',
            ],

            // Footnotes
            'notes' => [
                'star'        => 'Double Jump / Slide / Wall Climb',
                'double_star' => 'Late Bhop / First Bhop / Emote Savebhop / Deathbhop',
            ],
        ],

        'rank_promotion' => [
            'how_to_submit' => [
                'title' => 'Rank promotion · How to submit?',
                'intro' => 'To request a rank promotion, you must submit a completion (“record”) on a valid map and provide a quality rating.',

                'requirements' => [
                    'title' => 'Requirements',
                    'map_in_pool'   => 'Complete a Genji Parkour map that is in the current map pool.',
                    'map_code_note' => "Note: Maps that aren't currently accepted won't appear in the map code field.",
                ],

                'steps' => [
                    'title'            => 'Steps',
                    'open_tab'         => 'Open the “Submit completion” tab.',
                    'enter_code'       => 'Enter the map code and your record time.',
                    'upload_screenshot'=> 'Upload a screenshot (required) and optionally a video URL.',
                    'select_quality'   => 'Select a quality rating (1–6).',
                    'submit'           => 'Click “Submit record”.',
                    'verification'     => 'Your submission will go through a verification process.',
                    'notification'     => "Once verified, you'll receive a notification.",
                ],

                'quality' => [
                    'title' => 'Quality rating scale',
                    'six'   => '6: Excellent',
                    'five'  => '5: Great',
                    'four'  => '4: Good',
                    'three' => '3: Average',
                    'two'   => '2: Subpar',
                    'one'   => '1: Poor',
                ],
            ],

            'submission_rules' => [
                'title' => 'Submission Rules',

                'completion' => [
                    'title' => 'Completion Requirements/Guidelines',
                    'li_code_match'   => 'Map code in the screenshot must match the map code in the bot.',
                    'li_time_display' => 'Time must be displayed in either the Top 5 leaderboard or as the announcement in the middle of the screen. For video submissions, it must show both.',
                    'li_no_edit_map'  => 'You cannot edit the map in any way using Custom Game settings, Workshop Settings, or any other Workshop code. This includes but is not limited to changing tech bans, gravity, etc.',
                    'li_no_scripts'   => 'You are not allowed to use scripts, macros, or anything similar to complete any portion of a map.',
                    'li_no_banned_tech' => 'You may not use a banned tech (restricted via map author / listed in @GenjiBot#9209) where the ban is non-functional due to Workshop bugs.',
                ],

                'records' => [
                    'title' => 'Records Only',
                    'li_time_visible' => 'Time must be fully visible from 0.00 to the finish. Do not fade in or out while the timer is running.',
                    'li_video_required' => 'Video proof is required for World Records and Medals.',
                    'li_no_cuts' => 'Cuts in the video are not allowed (between 0.00 and finish).',
                    'li_sound_not_required' => 'Game sound is not required.',
                    'li_editing_ok_but_no_interfere' => 'Editing before and after is allowed, but it cannot interfere with the timer or any ability to validate the submission.',
                ],

                'reserve_rights' => 'Senseis reserve the right to deny any submission for any reason, regardless if it is listed here or not.',
            ],
            'rank_info_thresholds' => [
                'title' => 'Rank info & Thresholds',

                'info' => [
                    'title' => 'Ranks Info',
                    'li_no_order'   => 'Ranks do not need to be acquired in order.',
                    'li_requirement' => 'To receive a rank you must complete the required amount of maps for that difficulty/rank.',
                    'li_thresholds'  => 'See chart below for rank thresholds.',
                ],

                'table' => [
                    'title' => 'Rank & Difficulty chart',
                    'completions_label' => 'completions',
                    'na' => 'N/A',
                ],

                'rows' => [
                    'ninja' => [
                        'name'  => 'Ninja',
                        'image' => '/assets/ranks/ninja.webp',
                    ],
                    'jumper' => [
                        'name'  => 'Jumper',
                        'image' => '/assets/ranks/jumper.webp',
                    ],
                    'skilled' => [
                        'name'  => 'Skilled',
                        'image' => '/assets/ranks/skilled.webp',
                    ],
                    'pro' => [
                        'name'  => 'Pro',
                        'image' => '/assets/ranks/pro.webp',
                    ],
                    'master' => [
                        'name'  => 'Master',
                        'image' => '/assets/ranks/master.webp',
                    ],
                    'grand_master' => [
                        'name'  => 'Grand Master',
                        'image' => '/assets/ranks/grandmaster.webp',
                    ],
                    'god' => [
                        'name'  => 'God',
                        'image' => '/assets/ranks/god.webp',
                    ],
                ],
            ],

            'medals_info_thresholds' => [
                'title' => 'Medals info & Thresholds',

                'info' => [
                    'title' => 'Medals Info',
                    'li_plus_explain' => 'To get a +, ++ or +++ rank, you must obtain the same amount of Bronze, Silver, or Gold medals as the rank normally requires (see chart below).',
                    'li_time_and_video_required' => 'You must post a completion which includes a time and a video URL showing your run.',
                    'li_icon_next_to_name' => 'You will get an icon next to your name if you have a plus (+, ++, +++) rank!',
                    'li_auto_receive' => "Once verified, you'll automatically receive your medal.",
                    'li_retroactive_credit' => 'If medals are added to a map after you have already submitted, you will still get credit.',
                ],

                'table' => [
                    'title' => 'Medal thresholds by difficulty',
                    'medal_bronze' => 'Bronze',
                    'medal_silver' => 'Silver',
                    'medal_gold'   => 'Gold',
                    'completions_label' => 'medals',
                    'na' => 'N/A',
                ],

                'images' => [
                    'gold'   => '/assets/medals/gold.png',
                    'silver' => '/assets/medals/silver.png',
                    'bronze' => '/assets/medals/bronze.png',
                ],
            ],
        ],
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PLAYTEST (shared modal/labels)
    // ──────────────────────────────────────────────────────────────────────
    'playtest' => [
        'title_suffix'         => 'is requesting playtest feedback',
        'votes'                => 'Votes',
        'difficulty_rating'    => 'Difficulty rating',
        'rating_sub'           => 'Based on community votes',
        'question_difficulty'  => 'Vote map difficulty',
        'complete_to_vote'     => 'Submit a completion to be able to vote',
        'vote_recorded'        => 'Your vote has been submitted',
        'vote_updated'         => 'Your vote has been updated',
        'no_votes'             => 'No votes yet',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS (toolbar + common filter labels)
    // ──────────────────────────────────────────────────────────────────────
    'filters'              => [
        'creator'          => 'Creator',
        'enter_creator'    => 'Enter creator',

        'map_name'         => 'Map name',
        'enter_map_name'   => 'Enter map name',

        'user'             => 'User name',
        'enter_nickname'   => 'Enter user name',

        'code'             => 'Map code',
        'map_code'         => 'Map code',
        'enter_map_code'   => 'Enter map code',

        'difficulty'       => 'Difficulty',
        'beginner'         => 'Beginner',
        'easy'             => 'Easy',
        'medium'           => 'Medium',
        'hard'             => 'Hard',
        'very_hard'        => 'Very Hard',
        'extreme'          => 'Extreme',
        'hell'             => 'Hell',

        'category'               => 'Map type',
        'map_type'               => 'Map type',
        'classic'                => 'Classic',
        'increasing_difficulty'  => 'Increasing difficulty',
        'tournament'             => 'Tournament',

        'mechanics'              => 'Mechanics',
        'restrictions'           => 'Restrictions',

        'playtest_status'        => 'Only playtest',
        'only_true'              => 'True',
        'only_false'             => 'False',
        'completion_filter'      => 'Only completions',
        'medal_filter'           => 'Only medals',

        'participation_filter'   => 'Participation filter',
        'participated_yes'       => 'Participated',
        'participated_no'        => 'Not participated',

        'apply_filters'          => 'Apply filters',
        'clear_filters'          => 'Clear filters',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABLE HEADERS
    // ──────────────────────────────────────────────────────────────────────
    'table' => [
        'code'              => 'Code',
        'map_name'          => 'Name',
        'map_type'          => 'Type',
        'creator'           => 'Creator',
        'difficulty'        => 'Difficulty',
        'checkpoints'       => 'Checkpoints',
        'quality'           => 'Quality',
        'medal_gold'        => 'Gold',
        'medal_silver'      => 'Silver',
        'medal_bronze'      => 'Bronze',
        'details'           => 'Details',
        'view'              => 'View',
        'nickname'          => 'Nickname',
        'time'              => 'Time',
        'medal'             => 'Medal',
        'video'             => 'Video',
        'xp'                => 'XP',
        'playtests_votes'   => 'Playtest Votes',
        'mechanics'         => 'Mechanics',
        'restrictions'      => 'Restrictions',
        'description'       => 'Description',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MESSAGES (confirmations, generic)
    // ──────────────────────────────────────────────────────────────────────
    'messages' => [
        'submit_record_confirm' => 'Your record was submitted successfully.',
        'submit_map_confirm'    => 'Your map was submitted successfully.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // ERRORS (used in JS)
    // ──────────────────────────────────────────────────────────────────────
    'errors' => [
        'server_unreachable'      => 'Server unreachable. Please try again.',
        'playtests_load_failed'   => 'Failed to load playtests. Please try again later.',
        'image_type'              => 'Invalid image type.',
        'image_too_large'         => 'Image too large (max 8MB).',
        'upload_failed'           => 'Upload failed.',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / MISC
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'no_results'              => 'No results found.',
        'filter_applied'          => 'Filter applied: {filterId} = {value}',
        'login_required_msg'      => 'Please log in to use submit & playtest tools',
        'map_code_copied'         => 'Map code copied: {code}',
        'click_to_copy_map_code'  => 'Click to copy',
        'copied'                  => 'Copied!',
        'copy'                    => 'Copy',
        'copy_failed'             => 'Failed to copy.',
        'login'                   => 'Login',
        'user_id_copied'          => 'User ID {id} copied to clipboard!',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PAGINATION
    // ──────────────────────────────────────────────────────────────────────
    'pagination' => [
        'first'     => '« First',
        'prev'      => '‹ Prev',
        'next'      => 'Next ›',
        'last'      => 'Last »',
        'page_of'   => 'Page {current} of {total}',
    ],
];
