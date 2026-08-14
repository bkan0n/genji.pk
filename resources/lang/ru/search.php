<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Search (RU)
    |--------------------------------------------------------------------------
    */

    // ──────────────────────────────────────────────────────────────────────
    // META / PAGE
    // ──────────────────────────────────────────────────────────────────────
    'page_title' => 'Поиск',
    'og_title' => 'Genji Parkour - Поиск',
    'og_description' => 'Найдите карты, прохождения, руководства и личные рекорды.',

    // ──────────────────────────────────────────────────────────────────────
    // HEADER
    // ──────────────────────────────────────────────────────────────────────
    'title' => 'Карты',
    'subtitle' => 'поиск · прохождения · руководства · личные рекорды',

    // ──────────────────────────────────────────────────────────────────────
    // TABS
    // ──────────────────────────────────────────────────────────────────────
    'map_search' => 'Поиск карт',
    'completions' => 'Прохождения',
    'guides' => 'Гайды',
    'personal_records' => 'Личные рекорды',

    // ──────────────────────────────────────────────────────────────────────
    // TOOLBAR & HELPERS
    // ──────────────────────────────────────────────────────────────────────
    'select_mode' => 'Выберите режим поиска',
    'add_filter_hint' => 'Добавьте фильтр или нажмите ✔',
    'screenshot' => 'Скриншот',
    'open_screenshot' => 'Открыть скриншот',
    'no_description' => 'Нет описания',
    'watch' => 'Смотреть',
    'na' => 'N/A',

    // ──────────────────────────────────────────────────────────────────────
    // PLACEHOLDERS
    // ──────────────────────────────────────────────────────────────────────
    'map_name_placeholder' => 'Название карты',
    'map_code_placeholder' => 'Код карты',
    'nickname_placeholder' => 'Никнейм',
    'completion' => 'Прохождение',

    // ──────────────────────────────────────────────────────────────────────
    // UNOFFICIAL NOTICE
    // ──────────────────────────────────────────────────────────────────────
    'unofficial_notice' => [
        'title' => 'Поиск неофициального кода',
        'li1'   => 'Неофициальные коды доступны только на китайских серверах (CN).',
    ],
    
    // ──────────────────────────────────────────────────────────────────────
    // FILTERS TOOLBAR (UI toolbar options)
    // ──────────────────────────────────────────────────────────────────────
    'filters_toolbar' => [
        'creator'                 => 'Создатель',
        'enter_creator'           => 'Введите создателя',
        'map_name'                => 'Название карты',
        'enter_map_name'          => 'Введите название карты',
        'user'                    => 'Имя пользователя',
        'enter_nickname'          => 'Введите имя пользователя',
        'code'                    => 'Код карты',
        'enter_map_code'          => 'Введите код карты',
        'difficulty_exact'        => 'Сложность',
        'beginner'                => 'Beginner',
        'easy'                    => 'Easy',
        'medium'                  => 'Medium',
        'hard'                    => 'Hard',
        'very_hard'               => 'Very hard',
        'extreme'                 => 'Extreme',
        'hell'                    => 'Hell',
        'category'                => 'Тип карты',
        'classic'                 => 'Классика',
        'increasing_difficulty'   => 'Возрастающая сложность',
        'tournament'              => 'Турнир',
        'mechanics'               => 'Механики',
        'restrictions'            => 'Ограничения',
        'playtest_status'         => 'В плейтесте',
        'in_progress'             => 'В процессе',
        'approved'                => 'Одобрено',
        'rejected'                => 'Отклонено',
        'only_true'               => 'True',
        'only_false'              => 'False',
        'playtest_filter'         => 'Плейтест',
        'playtest_all'            => 'Все',
        'playtest_only'           => 'Только',
        'playtest_none'           => 'Нет',
        'completion_filter'       => 'Пройдено',
        'medal_filter'            => 'Медали',
        'participation_filter'    => 'Фильтр участия',
        'participated_yes'        => 'Участвовал',
        'participated_no'         => 'Не участвовал',
        'archived'                => 'Архив',
        'archived_only'           => 'В архиве',
        'not_archived'            => 'Не в архиве',
        'record_archived'         => 'Архивные рекорды',
        'archived_all'            => 'Все',
        'official'                => 'Официальная',
        'server'                  => 'Сервер',
        'global_server'           => 'Глобальный',
        'china_server'            => 'Китайский',
        'apply_filters'           => 'Применить фильтры',
        'clear_filters'           => 'Сбросить фильтры',
        'tags'                    => 'Теги',
        'sort'                    => 'Сортировка',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // FILTERS (common labels used across views)
    // ──────────────────────────────────────────────────────────────────────
    'filters' => [
        'map_name' => 'Название карты',
        'map_code' => 'Код карты',
        'difficulty' => 'Сложность карты',
        'creator' => 'Создатель карты',
        'mechanics' => 'Механики',
        'restrictions' => 'Ограничения',
        'only_playtest' => 'Только плейтест',
        'only_maps_with_medals' => 'Только карты с медалями',
        'ignore_completions' => 'Игнорировать прохождения',
        'player_name' => 'Имя игрока',
    ],

    'card' => [
        'completed'     => 'Пройдено',
        'not_completed' => 'Не пройдено',
        'mapped_by'     => 'Карта создана ',
        'like'          => 'Нравится',
        'official'      => 'Официальный',
        'unofficial'    => 'Неофициальный',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MECHANICS
    // ──────────────────────────────────────────────────────────────────────
    'mechanics' => [
        'edge_climb' => 'Edge Climb',
        'bhop' => 'Bhop',
        'crouch_edge' => 'Crouch Edge',
        'save_climb' => 'Save Climb',
        'bhop_first' => 'Bhop First',
        'high_edge' => 'High Edge',
        'distance_edge' => 'Distance Edge',
        'quick_climb' => 'Quick Climb',
        'slide' => 'Slide',
        'stall' => 'Stall',
        'dash' => 'Dash',
        'ultimate' => 'Ultimate',
        'emote_save_bhop' => 'Emote Save Bhop',
        'death_bhop' => 'Death Bhop',
        'triple_jump' => 'Triple Jump',
        'multi_climb' => 'Multi Climb',
        'vertical_multi_climb' => 'Vertical Multi Climb',
        'create_bhop' => 'Create Bhop',
        'standing_create_bhop' => 'Standing Create Bhop',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // RESTRICTIONS
    // ──────────────────────────────────────────────────────────────────────
    'restrictions' => [
        'dash_start' => 'Dash Start',
        'triple_jump' => 'Triple Jump',
        'emote_save_bhop' => 'Emote Save Bhop',
        'death_bhop' => 'Death Bhop',
        'multi_climb' => 'Multi Climb',
        'standing_create_bhop' => 'Standing Create Bhop',
        'create_bhop' => 'Create Bhop',
        'wall_climb' => 'Wall Climb',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP TYPE
    // ──────────────────────────────────────────────────────────────────────
    'map_type' => [
        'classic' => 'Классика',
        'increasing_difficulty' => 'Возрастающая сложность',
        'tournament' => 'Турнир',
        'practice' => 'Практика',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP NAME (canonical list)
    // ──────────────────────────────────────────────────────────────────────
    'map_name' => [
        'aatlis' => 'Aatlis',
        'ayutthaya' => 'Ayutthaya',
        'black_forest' => 'Black Forest',
        'blizzard_world' => 'Blizzard World',
        'busan' => 'Busan',
        'castillo' => 'Castillo',
        'chateau_guillard' => 'Chateau Guillard',
        'circuit_royal' => 'Circuit Royal',
        'colosseo' => 'Colosseo',
        'dorado' => 'Dorado',
        'ecopoint_antarctica' => 'Ecopoint: Antarctica',
        'eichenwalde' => 'Eichenwalde',
        'esperanca' => 'Esperanca',
        'hanamura' => 'Hanamura',
        'havana' => 'Havana',
        'hollywood' => 'Hollywood',
        'horizon_lunar_colony' => 'Horizon Lunar Colony',
        'ilios' => 'Ilios',
        'junkertown' => 'Junkertown',
        'kanezaka' => 'Kanezaka',
        'kings_row' => 'King\'s Row',
        'lijiang_tower' => 'Lijiang Tower',
        'malevento' => 'Malevento',
        'midtown' => 'Midtown',
        'necropolis' => 'Necropolis',
        'nepal' => 'Nepal',
        'new_queen_street' => 'New Queen Street',
        'numbani' => 'Numbani',
        'oasis' => 'Oasis',
        'paraiso' => 'Paraiso',
        'paris' => 'Paris',
        'petra' => 'Petra',
        'practice_range' => 'Practice Range',
        'rialto' => 'Rialto',
        'route_66' => 'Route 66',
        'temple_of_anubis' => 'Temple of Anubis',
        'volskaya_industries' => 'Volskaya Industries',
        'watchpoint_gibraltar' => 'Watchpoint: Gibraltar',
        'workshop_chamber' => 'Workshop Chamber',
        'workshop_expanse' => 'Workshop Expanse',
        'workshop_green_screen' => 'Workshop Green Screen',
        'workshop_island' => 'Workshop Island',
        'framework' => 'Фреймворк',
        'tools' => 'Инструменты',
        'shambali' => 'Shambali',
        'chateau_guillard_halloween' => 'Chateau Guillard (Halloween)',
        'eichenwalde_halloween' => 'Eichenwalde (Halloween)',
        'hollywood_halloween' => 'Hollywood (Halloween)',
        'black_forest_winter' => 'Black Forest (Winter)',
        'blizzard_world_winter' => 'Blizzard World (Winter)',
        'ecopoint_antarctica_winter' => 'Ecopoint: Antarctica (Winter)',
        'hanamura_winter' => 'Hanamura (Winter)',
        'kings_row_winter' => 'King\'s Row (Winter)',
        'busan_lunar_new_year' => 'Busan (Lunar New Year)',
        'lijiang_tower_lunar_new_year' => 'Lijiang Tower (Lunar New Year)',
        'antarctic_peninsula' => 'Antarctic Peninsula',
        'suravasa' => 'Suravasa',
        'new_junk_city' => 'New Junk City',
        'samoa' => 'Samoa',
        'hanaoka' => 'Hanaoka',
        'runasapi' => 'Runasapi',
        'throne_of_anubis' => 'Throne of Anubis',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // MAP EDIT REQUEST
    // ──────────────────────────────────────────────────────────────────────
    'map_edit_request' => [
        'title' => 'Запрос на редактирование карты',
        'subtitle' => 'Предложить изменения для карты',

        'map_edit_btn' => 'Создать запрос на редактирование карты',
        'map_edit_btn_login' => 'Войдите, чтобы создать запрос на редактирование карты',

        'code' => 'Код',
        'created_by' => 'Создано',
        'reason' => 'Причина',
        'reason_placeholder' => 'Объясните, почему вы хотите изменить эту карту…',

        'send' => 'Отправить запрос на редактирование карты',
        'close' => 'Закрыть',

        'proposed_changes' => 'Предлагаемые изменения',
        'proposed_hint' => 'Будут отправлены только изменённые поля',

        'official' => 'Официальная',
        'unofficial' => 'Неофициальная',
        'visible' => 'Видимая',
        'hidden' => 'Скрытая',
        'active' => 'Активная',
        'archived' => 'В архиве',

        'new_code' => 'Новый код',
        'new_code_placeholder' => 'Оставьте пустым, чтобы сохранить текущий',

        'map_name' => 'Название карты',
        'checkpoints' => 'Чекпоинты',
        'creators' => 'Создатели',

        'creator_search' => 'Поиск пользователя…',
        'creator_hint' => 'Выберите пользователей для добавления. Первый создатель — основной.',

        'select' => 'Выбрать…',
        'selected_count' => 'Выбрано: {count}',

        'category' => 'Категория',
        'difficulty' => 'Сложность',
        'mechanics' => 'Механики',
        'restrictions' => 'Ограничения',

        'optional_title' => 'Заголовок',
        'custom_banner' => 'Пользовательский баннер',
        'drag_and_drop' => 'Перетащите файл или нажмите, чтобы загрузить',
        'banner_hint' => 'Рекомендуется 16:9. JPG/PNG/WebP/AVIF, макс. 10 МБ.',
        'remove' => 'Удалить',

        'optional_description' => 'Описание',
        'medal_gold' => 'Золотая медаль',
        'medal_silver' => 'Серебряная медаль',
        'medal_bronze' => 'Бронзовая медаль',

        'uploading' => 'Загрузка…',
        'uploaded' => 'Загружено',

        'login_required' => 'Вы должны войти в систему, чтобы отправить запрос на редактирование карты.',
        'reason_required' => 'Пожалуйста, укажите причину.',
        'sending' => 'Отправка…',
        'sent' => 'Запрос на редактирование карты отправлен ✅',

        'na' => 'Н/Д',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // POPUP / MISC
    // ──────────────────────────────────────────────────────────────────────
    'popup' => [
        'login_required_btn' => 'Требуется вход в систему',
        'login_required_msg' => 'На этой странице требуется вход в систему',
        'login_required_pr' => 'Для использования этой функции требуется вход в систему',
        'login_required_filter' => 'Для использования этого фильтра требуется вход в систему',
        'login_required_progression' => 'Пожалуйста, войдите в систему, чтобы увидеть свой прогресс',
        'map_code_required' => 'Введите код карты',
        'no_results' => 'Результаты не найдены',
        'filter_applied' => 'Фильтр применен для {filterId}: {value}',
        'filters_cleared' => 'Все фильтры были очищены',
        'enter_username' => 'Введите действительное имя пользователя',
        'username_updated' => 'Ваше имя пользователя было обновлено',
        'primary_username_updated' => 'Основное имя пользователя обновлено',
        'already_exist_username' => 'Имя пользователя уже существует',
        'set_primary_username' => 'Установить как основное имя пользователя',
        'delete_username' => 'Удалить имя пользователя',
        'no_username_set' => 'Имя пользователя не установлено',
        'confirm_button' => 'Подтвердить',
        'copy_map_code' => 'Скопировать код карты',
        'map_code_copied' => 'Код карты скопирован: {code}',
        'copy_failed' => 'Не удалось скопировать код карты',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // PAGINATION
    // ──────────────────────────────────────────────────────────────────────
    'pagination' => [
        'first' => '« Первая',
        'prev' => '‹ Предыдущая',
        'next' => 'Следующая ›',
        'last' => 'Последняя »',
        'page_of' => 'Страница {current} из {total}',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // CHARTS
    // ──────────────────────────────────────────────────────────────────────
    'chart' => [
        'mapDifficultyDistribution' => 'Распределение сложностей карт',
        'amountOfMaps' => 'Количество карт',
        'difficultyLevel' => 'Уровень сложности',
        'popularCreators' => 'Создатели карт по среднему качеству',
        'mapAmountLogScale' => 'Количество карт (по логарифмической шкале)',
        'averageQuality' => 'Среднее качество',
        'topMapsFor' => 'Самые популярные карты по сложности {difficulty}',
        'mapCodes' => 'Коды карт',
        'completions' => 'Прохождения',
        'rank' => 'Ранг',
        'playersIn' => 'Игроков в {tier} тире',
        'map' => 'Карты',
        'quality' => 'Качество',
        'completionsTooltip' => '{map}: {completions} Прохождений, Качество: {quality}',
        'playersInTier' => '{amount} игроков в {tier} тире',
        'tooltipLabel' => '{creator} - Карт : {mapCount}, Качество : {quality}',
        'tierRank' => 'Уровень ранга',
        'skillRank' => 'Ранг навыков',
        'easy' => 'Easy',
        'medium' => 'Medium',
        'hard' => 'Hard',
        'very hard' => 'Very Hard',
        'extreme' => 'Extreme',
        'hell' => 'Hell',
        'mapsTooltip' => '{count} карт',
        'record_progression_time' => 'Запись прогресса с течением времени',
        'user_record_progression' => 'Ваш прогресс',
        'average_time' => 'Среднее время',
        'min_time' => 'Минимальное время',
        'max_time' => 'максимальное время',
        'amount' => 'Количество',
        'quantity' => 'Количество',
        'total_amount_time' => 'Всего времени в часах',
        'time_played_per_difficulty' => 'Времени потрачено на каждую сложность',
    ],

    // ──────────────────────────────────────────────────────────────────────
    // TABLE HEADERS
    // ──────────────────────────────────────────────────────────────────────
    'thead' => [
        'mapCode' => 'Код',
        'unofficialCode' => 'Неофициальный код',
        'officialCode'   => 'Официальный код',
        'mapName' => 'Название',
        'mapType' => 'Тип',
        'mapCreator' => 'Создатель',
        'mapDifficulty' => 'Сложность',
        'mapCheckpoints' => 'Количество чекпоинтов',
        'mapQuality' => 'Качество',
        'mapGold' => 'Золото',
        'mapSilver' => 'Серебро',
        'mapBronze' => 'Бронза',
        'mapDetails' => 'Детали',
        'mapView' => 'Обзор',
        'mapNickname' => 'Никнейм',
        'mapDiscordTag' => 'Тег в дискорде',
        'mapTime' => 'Время',
        'mapMedal' => 'Медали',
        'mapVideo' => 'Видео',
        'mapXP' => 'Опыт',
        'mapSkillRank' => 'Ранг навыков',
        'mapWR' => 'Мировые рекорды',
        'mapMade' => 'Карт сделано',
        'mapPlaytestsVotes' => 'Голосов в плейтесте',
        'mapTierRank' => 'Тир',
        'mapRankDistribution' => 'Распределение рангов',
        'mapMechanics' => 'Механики',
        'mapRestrictions' => 'Ограничения',
        'mapDescription' => 'Описание',
        'mapUpvotes' => 'Голосов',
        'mapVerified' => 'Проверено',
        'mapOfficial' => 'Официальная',
        'mapStatus' => 'Статус',
        'mapTags' => 'Теги карты',
    ],
];
