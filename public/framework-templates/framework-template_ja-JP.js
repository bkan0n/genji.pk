// framework-template_ja-JP.js (auto)
export const frameworkTemplate = `設定
{
	メイン
	{
		モード名: "Genji Parkour - 源氏跑酷 - v1.10.4A"
		説明: "\\n\\n\\n◀ The Official Genji Parkour Editor ▶\\nCode: 54CRY\\nAdapted by: LulledLion, FishoFire, Nebula\\nv1.10.4A"
	}
	ロビー
	{
		待機中のプレイヤーを許可: はい
		マッチ・ボイスチャット: 無効
		最大観戦者数: 3
		チーム1の最大プレイヤー数: 11
		チーム2の最大プレイヤー数: 0
		ロビーに戻る: いいえ
		マッチ後にチーム交換: いいえ
	}
	モード
	{
		一般
		{
			ヒーロー変更許可: OFF
			敵のライフ・ゲージ: OFF
			ゲーム・モード開始: 即座
			ヒーロー制限: OFF
			キル・カメラ: OFF
			キル・フィード: OFF
			リスポーン時間スカラー: 0%
			ライフ・パック リスポーン: 無効
			ランダムなヒーローでリスポーン: ON
		}
		スカーミッシュ
		{
			有効なマップ
			{
			}
			パークを有効にする: OFF
		}
		チーム・デスマッチ
		{
			有効なマップ
			{
			}
			パークを有効にする: OFF
			自主的リスポーン: OFF
		}
		無効 バウンティ・ハンター
		{
			パークを有効にする: OFF
		}
		無効 キャプチャー・ザ・フラッグ
		{
			パークを有効にする: OFF
		}
		無効 エリミネーション
		{
			パークを有効にする: OFF
		}
		無効 練習場
		{
			パークを有効にする: OFF
		}
	}
	ヒーロー
	{
		一般
		{
			ゲンジ
			{
				木の葉返し: OFF
				弾数制限なし: ON
				風斬り クールダウン時間: 1%
				アルティメット効果時間: 25%
				アルティメット・チャージ - パッシブ（龍撃剣）: 0%
				アルティメット・チャージ（龍撃剣）: 10%
			}
			有効なヒーロー
			{
				ゲンジ
			}
		}
	}
	拡張
	{
		ダミーボットの生成数を増加
		エフェクトの再生数を増加
	}
}
変数 {
    グローバル:
        0: A
        2: C
        3: MsDestructo
        4: TimeRemaining
        5: PortalEffects
        7: H
        8: I
        10: K
        12: Dao
        13: SHIFT
        14: EditSelected
        15: EditSelectIdArray
        16: EditorOn
        18: TQ
        20: TQ2
        21: EditorMoveItem
        22: EditMode
        23: TQ5
        24: TQ6
        25: BounceToggleLock
        26: killballnumber
        27: pinballnumber
        30: save
        32: LeaderBoardFull
        33: LeaderBoardHuds
        34: LeaderBoardRemake
        35: kaxiaotiao
        38: NANBA
        40: PortalNames
        41: PortalLoc
        42: PortalDest
        43: PortalOn
        44: Difficultyhud
        45: CustomPortalStart
        46: CustomPortalEndpoint
        47: CustomPortalCP
        50: CompMode
        51: CompTime
        52: CompAtmpNum
        53: CompAtmpSaveNames
        54: CompAtmpSaveCount
        55: CompRestartLimit
        56: instructiontext
        57: TitleData
        60: SaveName
        61: SaveCp
        62: SaveEnt
        63: SaveTimer
        64: SaveElapsed
        65: SavePauseTime
        66: SavePauseEnabled
        67: HintCp
        68: HintText
        69: ColorConfig
        70: Name
        71: Code
        73: Cachedcredits
        74: CpHudText
        75: CpHudCp
        76: CpIwtText
        77: CpIwtCp
        78: CpIwtPos
        79: CpIwtColor
        80: BanTriple
        81: BanMulti
        82: BanCreate
        83: BanDead
        84: BanEmote
        85: BanClimb
        86: BanBhop
        87: BanStand
        88: BanDjump
        89: BanSaveDouble
        90: DestructoIter
        91: MapVectorArray
        127: __overpyTranslationHelper__
    プレイヤー:
        0: lockState
        1: checkpoint_current
        2: checkpoint_practice
        3: checkpoint_moved
        4: checkpoint_notLast
        5: timer_normal
        6: timer_practice
        7: timer_split
        8: timer_splitDisplay
        9: toggle_invincible
        10: toggle_spectate
        11: toggle_practice
        12: toggle_quickRestart
        13: toggle_guide
        14: toggle_leaderboard
        15: toggle_invisible
        16: toggle_hints
        17: skill_countBhops
        18: skill_usedHop
        19: skill_countCreates
        20: skill_countMulti
        21: skill_usedClimb
        22: skill_usedBhop
        23: skill_usedDouble
        24: skill_ultCd
        25: banString
        26: ban_multi
        27: ban_create
        28: ban_dead
        29: ban_emote
        30: ban_climb
        31: ban_bhop
        32: ban_standcreate
        33: ban_djump
        34: ban_savedouble
        35: cache_collectedLocks
        36: cache_bounceTouched
        37: cache_portalStart
        38: cache_portalEnd
        39: cache_bounceMaxLocks
        40: cache_killPosition
        41: cache_killRadii
        42: cache_bouncePosition
        43: cache_inputs
        44: cache_rainbow
        45: cache_titleHud
        46: preview_array1
        47: preview_array2
        48: preview_i
        49: editor_modeSelect
        50: editor_fly
        51: editor_saveCache
        52: editor_undo
        53: editor_lock
        54: editor_hitboxEffect
        55: editor_hitboxToggle
        56: editor_bounceIndex
        57: editor_killIndex
        58: editor_temp
        59: comp_done
        60: comp_countAttempts
        61: comp_instructionHud
        62: addon_toggle3rdPov
        63: addon_ledgeDash
        64: addon_enableDoubleChecks
}
サブルーチン {
    0: StartGame
    1: LeaderboardUpdate
    2: CheckpointFailReset
    3: UpdateTitle
    4: DashUltGive
    5: CheckUlt
    6: CheckAbility1
    7: UpdateCache
    8: DeleteSave
    9: MakeSave
    10: TimerPause
    11: TimerResume
    12: EditUpdateSelectedIds
    13: EditorSelectLast
    14: AddonCustomLoadAndReset
    15: AddonCheckMap
    16: Addon3rdPerson
    17: RebuildKillOrbs
    18: RebuildPortals
    19: RebuildBounceOrbs
}
ルール ("Disable inspector") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        インスペクターでの記録を無効化;
    }
}

ルール ("OverPy | Global Init") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        グローバル変数を設定(__overpyTranslationHelper__, 文字列の分割(カスタムストリング("0White0흰색0白色"), 最初の値(NULL)));
    }
}

//Optimize for size enabled
ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Parkour v1.10.4A ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("Parkour | Setup & Variables") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        "◀ The Official Genji Parkour Editor ▶\\nDiscord: dsc.gg/genjiparkour\\nCode: 54CRY\\nAdapted by: LulledLion, FishoFire, Nebula"
        ゲーム・モードの標準完了を無効化;
        ゲーム・モードの標準スコアリングを無効化;
        ゲーム・モードのBGMを無効化;
        ゲーム・モードの通知を無効化;
        リスポーンエリアの強制を開始(すべてのチーム, False);
        リスポーンエリアの強制を開始(すべてのチーム, 1);
        リスポーンエリアの強制を開始(すべてのチーム, 2);
        "wait for map data rule"
        待機(0.24, 条件無視);
        "Turn Editor On"
        グローバル変数を設定(EditorOn, ワークショップの設定の切り替え(カスタムストリング("Map Settings ■ 地图设置 ■ 맵 설정"), カスタムストリング("Editor Mode ■ 作图模式 ■ 수정 모드"), False, 0));
        IF(ワークショップの設定の切り替え(カスタムストリング("Map Settings ■ 地图设置 ■ 맵 설정"), カスタムストリング("Basic Map Validator ■ 验证地图 ■ 맵 가능 여부 확인기"), True, 3));
            ルールを開始(AddonCheckMap, 何もしない);
        END;
        グローバル変数を設定(PortalOn, ワークショップの設定の切り替え(カスタムストリング("Map Settings ■ 地图设置 ■ 맵 설정"), カスタムストリング("Portals 󠀨Control Maps󠀩 ■ 启用传送门 󠀨占点地图󠀩 ■ 순간이동 활성화 󠀨쟁탈 맵󠀩"), True, 4));
        グローバル変数を設定(CompMode, AND(NOT(グローバル.EditorOn), ワークショップの設定の切り替え(カスタムストリング("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), カスタムストリング("Tournament Mode ■ 开启竞赛模式 ■ 토너먼트 모드 활성화"), False, 100)));
        IF(グローバル.CompMode);
            "-! comp minutes !-\\n5-240"
            グローバル変数を設定(CompTime, ワークショップの設定（整数）(カスタムストリング("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), カスタムストリング("Time Limit 󠀨Global󠀩 ■ 时间限制 ■ 시간 제한 󠀨전체󠀩"), 120, 1, 240, 101));
            "-! comp attempt count !-"
            グローバル変数を設定(CompAtmpNum, ワークショップの設定（整数）(カスタムストリング("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), カスタムストリング("Attempt Count ■ 尝试次数 ■ 시도 수 확인"), 5, 0, 500, 102));
            "-! comp restartlimiter !-"
            グローバル変数を設定(CompRestartLimit, ワークショップの設定の切り替え(カスタムストリング("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), カスタムストリング("Disable Restart During Run ■ 竞赛中禁用重新开始 ■ 시도 중 재시작 비활성화"), False, 103));
        ELSE;
            グローバル変数を設定(instructiontext, NULL);
        END;
        グローバル変数を設定(SaveName, 空の配列);
        グローバル変数を設定(SaveCp, 空の配列);
        グローバル変数を設定(SaveTimer, 空の配列);
        グローバル変数を設定(SaveEnt, 空の配列);
        グローバル変数を設定(SaveElapsed, 空の配列);
        グローバル変数を設定(Dao, IF-THEN-ELSE(カウント: (グローバル.Dao), フィルタリングされた配列(グローバル.Dao, COMPARE(追加(現在の配列の要素, False), >=, NULL)), 空の配列));
        グローバル変数を設定(SHIFT, IF-THEN-ELSE(カウント: (グローバル.SHIFT), フィルタリングされた配列(グローバル.SHIFT, COMPARE(追加(現在の配列の要素, False), >=, NULL)), 空の配列));
        グローバル変数を設定(pinballnumber, IF-THEN-ELSE(カウント: (グローバル.pinballnumber), グローバル.pinballnumber, 空の配列));
        グローバル変数を設定(A, IF-THEN-ELSE(カウント: (グローバル.A), グローバル.A, 空の配列));
        グローバル変数を設定(A, IF-THEN-ELSE(カウント: (グローバル.A), グローバル.A, 空の配列));
        グローバル変数を設定(killballnumber, IF-THEN-ELSE(カウント: (グローバル.killballnumber), グローバル.killballnumber, 空の配列));
        グローバル変数を設定(H, IF-THEN-ELSE(カウント: (グローバル.H), グローバル.H, 空の配列));
        グローバル変数を設定(I, IF-THEN-ELSE(カウント: (グローバル.I), グローバル.I, 空の配列));
        グローバル変数を設定(K, IF-THEN-ELSE(カウント: (グローバル.K), グローバル.K, 空の配列));
        グローバル変数を設定(TQ, IF-THEN-ELSE(カウント: (グローバル.TQ), グローバル.TQ, 空の配列));
        グローバル変数を設定(TQ2, IF-THEN-ELSE(カウント: (グローバル.TQ2), グローバル.TQ2, 空の配列));
        グローバル変数を設定(EditMode, IF-THEN-ELSE(カウント: (グローバル.EditMode), グローバル.EditMode, 空の配列));
        グローバル変数を設定(TQ5, IF-THEN-ELSE(カウント: (グローバル.TQ5), グローバル.TQ5, 空の配列));
        グローバル変数を設定(TQ6, IF-THEN-ELSE(カウント: (グローバル.TQ6), グローバル.TQ6, 空の配列));
        グローバル変数を設定(BounceToggleLock, IF-THEN-ELSE(カウント: (グローバル.BounceToggleLock), グローバル.BounceToggleLock, 空の配列));
        グローバル変数を設定(CustomPortalStart, IF-THEN-ELSE(カウント: (グローバル.CustomPortalStart), グローバル.CustomPortalStart, 空の配列));
        グローバル変数を設定(CustomPortalEndpoint, IF-THEN-ELSE(カウント: (グローバル.CustomPortalEndpoint), グローバル.CustomPortalEndpoint, 空の配列));
        グローバル変数を設定(CustomPortalCP, IF-THEN-ELSE(カウント: (グローバル.CustomPortalCP), グローバル.CustomPortalCP, 空の配列));
        グローバル変数を設定(LeaderBoardFull, 空の配列);
        グローバル変数を設定(TitleData, NULL);
        グローバル変数を設定(HintCp, 空の配列);
        グローバル変数を設定(HintText, 空の配列);
        "clean out -1's after the ban has loaded"
        グローバル変数を設定(BanBhop, IF-THEN-ELSE(カウント: (グローバル.BanBhop), フィルタリングされた配列(グローバル.BanBhop, COMPARE(追加(現在の配列の要素, False), >=, NULL)), 空の配列));
        グローバル変数を設定(BanClimb, IF-THEN-ELSE(カウント: (グローバル.BanClimb), フィルタリングされた配列(グローバル.BanClimb, COMPARE(追加(現在の配列の要素, False), >=, NULL)), 空の配列));
        グローバル変数を設定(BanEmote, IF-THEN-ELSE(カウント: (グローバル.BanEmote), フィルタリングされた配列(グローバル.BanEmote, COMPARE(追加(現在の配列の要素, False), >=, NULL)), 空の配列));
        グローバル変数を設定(BanDead, IF-THEN-ELSE(カウント: (グローバル.BanDead), フィルタリングされた配列(グローバル.BanDead, COMPARE(追加(現在の配列の要素, False), >=, NULL)), 空の配列));
        グローバル変数を設定(BanCreate, IF-THEN-ELSE(カウント: (グローバル.BanCreate), フィルタリングされた配列(グローバル.BanCreate, COMPARE(追加(現在の配列の要素, False), >=, NULL)), 空の配列));
        グローバル変数を設定(BanMulti, IF-THEN-ELSE(カウント: (グローバル.BanMulti), フィルタリングされた配列(グローバル.BanMulti, COMPARE(追加(現在の配列の要素, False), >=, NULL)), 空の配列));
        "BanTriple = [i for i in BanTriple if i + false >= 0] if len(BanTriple) else [] # legacy code, now auto sets it to null to save space"
        グローバル変数を設定(BanStand, IF-THEN-ELSE(カウント: (グローバル.BanStand), フィルタリングされた配列(グローバル.BanStand, COMPARE(追加(現在の配列の要素, False), >=, NULL)), 空の配列));
        グローバル変数を設定(BanSaveDouble, IF-THEN-ELSE(カウント: (グローバル.BanSaveDouble), グローバル.BanSaveDouble, 空の配列));
        グローバル変数を設定(BanDjump, IF-THEN-ELSE(カウント: (グローバル.BanDjump), グローバル.BanDjump, 空の配列));
        "fix team because of naming"
        IF(COMPARE(配列内の値(グローバル.ColorConfig, 16), ==, 色(チーム1)));
            インデックスのグローバル変数を設定(ColorConfig, 16, 色(青));
        ELSE IF(COMPARE(配列内の値(グローバル.ColorConfig, 16), ==, 色(チーム2)));
            インデックスのグローバル変数を設定(ColorConfig, 16, 色(赤));
        END;
        "prevent same color lock orbs"
        IF(COMPARE(配列内の値(グローバル.ColorConfig, 15), ==, 配列内の値(グローバル.ColorConfig, 16)));
            インデックスのグローバル変数を設定(ColorConfig, 16, IF-THEN-ELSE(COMPARE(配列内の値(グローバル.ColorConfig, 15), ==, 色(オレンジ)), 色(緑), 色(オレンジ)));
        END;
        "prevent same color bhop/climb used/unused"
        IF(COMPARE(配列内の値(グローバル.ColorConfig, 7), ==, 配列内の値(グローバル.ColorConfig, 8)));
            インデックスのグローバル変数を設定(ColorConfig, 8, IF-THEN-ELSE(COMPARE(配列内の値(グローバル.ColorConfig, 7), ==, 色(赤)), 色(オレンジ), 色(赤)));
    }
}

ルール ("Parkour | Match time") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        IF(COMPARE(現在のゲーム・モード, !=, ゲーム・モード(スカーミッシュ)));
            待機(False, 条件無視);
            マッチ時間を設定(False);
            待機(False, 条件無視);
            マッチ時間を設定(False);
            待機(False, 条件無視);
        END;
        マッチ時間を設定(70);
        マッチ時間をポーズする;
        待機(False, 条件無視);
        グローバル変数を設定(TimeRemaining, 265);
        WHILE(グローバル.TimeRemaining);
            待機(60, 条件無視);
            グローバル変数を変更(TimeRemaining, 引く, True);
            IF(グローバル.CompMode);
                グローバル変数を変更(CompTime, 引く, True);
                IF(NOT(グローバル.CompTime));
                    大きなメッセージ(最初の値(True), IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("时间到了"), カスタムストリング("Time's Up")));
                    プレイヤー変数を設定(すべてのプレイヤー(すべてのチーム), comp_done, True);
                    プレイヤー変数の追跡を中止(すべてのプレイヤー(すべてのチーム), timer_normal);
                    受けるダメージを設定(すべてのプレイヤー(すべてのチーム), 100);
                    キル(すべてのプレイヤー(すべてのチーム), NULL);
                END;
            END;
        END;
        "\\"房间已达最大持续时间, 即将重启\\" checkCN \\"Maximum Lobby Time Reached, Restarting\\""
        大きなメッセージ(最初の値(True), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒMaximum Lobby Time Reached, RestartingMaximum Lobby Time Reached, RestartingMaximum Lobby Time Reached, Restarting"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
        待機(5, 条件無視);
        "Prevent crash during POTG and closing lobby"
        プレイヤー変数を設定(すべてのプレイヤー(すべてのチーム), lockState, True);
        プレイヤーの勝利を宣言(ホスト・プレイヤー);
        チームの勝利を宣言(チーム: (ホスト・プレイヤー));
    }
}

ルール ("Parkour | Player Initialize") {
    イベント {
        プレイヤーがマッチに参加;
        すべて;
        すべて;
    }
    アクション {
        ゲーム・モードHUDを無効化(イベント・プレイヤー);
        移動時のプレイヤーとの衝突判定を無効化(イベント・プレイヤー);
        受けるダメージを設定(イベント・プレイヤー, 0);
        プレイヤー変数を設定(イベント・プレイヤー, lockState, True);
        中止する条件(ダミーボットである(イベント・プレイヤー));
        観戦時に全プレイヤー選択可能を有効化(イベント・プレイヤー);
        観戦中のターゲットHUD表示を有効化(イベント・プレイヤー);
        ゲーム・モードの標準リスポーンを無効化(イベント・プレイヤー);
        ヒーローをプリロード(イベント・プレイヤー, ヒーロー(ゲンジ));
        プレイヤー変数を設定(イベント・プレイヤー, editor_lock, True);
        プレイヤー変数を設定(イベント・プレイヤー, toggle_guide, True);
        "eventPlayer.toggle_quickRestart = true"
        プレイヤー変数を設定(イベント・プレイヤー, cache_bounceTouched, -1);
        "big waits first for about 1 second before loading, to make sure things like comp mode are fully loaded and configured, load fx in meanwhile"
        待機(True, 条件無視);
        エフェクトを作成(イベント・プレイヤー, リング, 配列内の値(グローバル.ColorConfig, 9), 最後の値(配列内の値(グローバル.A, (イベント・プレイヤー).checkpoint_current)), True, 位置と範囲);
        エフェクトを作成(IF-THEN-ELSE((イベント・プレイヤー).checkpoint_notLast, イベント・プレイヤー, NULL), リング, 配列内の値(グローバル.ColorConfig, 10), 配列内の値(グローバル.A, 追加((イベント・プレイヤー).checkpoint_current, True)), True, 表示される相手、位置、範囲);
        エフェクトを作成(IF-THEN-ELSE((イベント・プレイヤー).checkpoint_notLast, イベント・プレイヤー, NULL), 光の筋, 配列内の値(グローバル.ColorConfig, 11), 配列内の値(グローバル.A, 追加((イベント・プレイヤー).checkpoint_current, True)), True, 表示される相手、位置、範囲);
        アイコンを作成(IF-THEN-ELSE((イベント・プレイヤー).checkpoint_notLast, イベント・プレイヤー, NULL), 追加(配列内の値(グローバル.A, 追加((イベント・プレイヤー).checkpoint_current, True)), 上), 矢印:下, 表示される相手、位置, 配列内の値(グローバル.ColorConfig, 12), True);
        条件待機(スポーンした(イベント・プレイヤー), 999999999999);
        プレイヤー変数を設定(イベント・プレイヤー, editor_lock, False);
        IF(グローバル.CompMode);
            目視可否を設定(イベント・プレイヤー, すべて);
            IF(含む配列(グローバル.CompAtmpSaveNames, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列)));
                プレイヤー変数を設定(イベント・プレイヤー, comp_countAttempts, 配列内の値(グローバル.CompAtmpSaveCount, 配列値のインデックス(グローバル.CompAtmpSaveNames, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列))));
            "instructions and settings for comp start"
            ELSE;
                プレイヤー変数を設定(イベント・プレイヤー, comp_instructionHud, True);
                グローバル変数を変更(CompAtmpSaveNames, 配列に追加, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列));
                グローバル変数を変更(CompAtmpSaveCount, 配列に追加, 1);
                プレイヤー変数を設定(イベント・プレイヤー, comp_countAttempts, 1);
                移動速度を設定(イベント・プレイヤー, False);
                アビリティ1を有効化(イベント・プレイヤー, False);
                アルティメット・アビリティを有効化(イベント・プレイヤー, False);
                条件待機(NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(インタラクト))), True);
                条件待機(OR(ボタンが長押しされている(イベント・プレイヤー, ボタン(インタラクト)), COMPARE(グローバル.CompTime, <, 1)), 999999999999);
                移動速度を設定(イベント・プレイヤー, 100);
                プレイヤー変数を設定(イベント・プレイヤー, comp_instructionHud, False);
            END;
            IF(OR(COMPARE((イベント・プレイヤー).comp_countAttempts, <, NULL), COMPARE(グローバル.CompTime, <, 1)));
                プレイヤー変数を設定(イベント・プレイヤー, comp_done, True);
            END;
        END;
        待機(False, 条件無視);
        "initialization of the game"
        サブルーチンの呼び出し(StartGame);
        プレイヤー変数を設定(イベント・プレイヤー, lockState, False);
    }
}

ルール ("Parkour | Player Leaves") {
    イベント {
        プレイヤーがマッチから離脱;
        すべて;
        すべて;
    }
    アクション {
        IF(配列内の値(グローバル.SaveCp, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー)));
            IF(AND(COMPARE(配列内の値(グローバル.SaveCp, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー)), <, 減算(カウント: (グローバル.A), True)), 配列内の値(グローバル.SaveElapsed, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー))));
                インデックスのグローバル変数を設定(SaveTimer, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー), 追加(減算(合計経過時間, 配列内の値(グローバル.SaveElapsed, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー))), 配列内の値(グローバル.SaveTimer, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー))));
            END;
        "delete if player didnt do first cp"
        ELSE;
            サブルーチンの呼び出し(DeleteSave);
    }
}

ルール ("Parkour | Ground: Traces, Arrive, & Reset") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        (イベント・プレイヤー).lockState == False;
        地上にいる(イベント・プレイヤー) == True;
        生存している(イベント・プレイヤー) == True;
    }
    アクション {
        IF(NOT((イベント・プレイヤー).checkpoint_notLast));
            IF(AND(移動している(イベント・プレイヤー), NOT(OR(OR(OR((イベント・プレイヤー).toggle_practice, (イベント・プレイヤー).toggle_invisible), グローバル.EditorOn), グローバル.CompMode))));
                "traces ----------------------------------------------------------------------------------------------------"
                プレイヤー変数を設定(イベント・プレイヤー, cache_rainbow, 配列内の値(配列(色(赤), 色(オレンジ), 色(黄色), 色(ライムグリーン), 色(緑), 色(ターコイズ), 色(青), 色(紫), 色(バイオレット), 色(ローズ)), 剰余(整数への四捨五入(乗算(合計経過時間, 2), 下), 10)));
                "eventPlayer.cache_rainbow =  rgb((cosDeg(getTotalTimeElapsed()/2 * 360 - 0) + 0.5) * 255, (cosDeg(getTotalTimeElapsed/2 * 360 - 120) + 0.5) * 255, (cosDeg(getTotalTimeElapsed/2 * 360 - 240) + 0.5) * 255)\\n1.6 - 0.2 in 0.2 steps"
                エフェクトを再生(最初の値(True), リングの爆発, (イベント・プレイヤー).cache_rainbow, 位置: (イベント・プレイヤー), 0.4);
                待機(0.048, 条件無視);
                エフェクトを再生(最初の値(True), リングの爆発, (イベント・プレイヤー).cache_rainbow, 位置: (イベント・プレイヤー), 0.6);
                待機(0.048, 条件無視);
                エフェクトを再生(最初の値(True), リングの爆発, (イベント・プレイヤー).cache_rainbow, 位置: (イベント・プレイヤー), 0.8);
                待機(0.048, 条件無視);
                エフェクトを再生(最初の値(True), リングの爆発, (イベント・プレイヤー).cache_rainbow, 位置: (イベント・プレイヤー), 1);
                待機(0.048, 条件無視);
                エフェクトを再生(最初の値(True), リングの爆発, (イベント・プレイヤー).cache_rainbow, 位置: (イベント・プレイヤー), 1.2);
                待機(0.048, 条件無視);
                エフェクトを再生(最初の値(True), リングの爆発, (イベント・プレイヤー).cache_rainbow, 位置: (イベント・プレイヤー), 1.4);
                待機(0.048, 条件無視);
            END;
        "or eventPlayer.lockState:"
        ELSE IF(OR(OR((イベント・プレイヤー).toggle_invincible, (イベント・プレイヤー).toggle_spectate), AND(グローバル.CompMode, NOT(グローバル.CompTime))));
        ELSE IF(COMPARE(二点間の距離(イベント・プレイヤー, 配列内の値(グローバル.A, 追加((イベント・プレイヤー).checkpoint_current, True))), <=, 1.4));
            "arrived ----------------------------------------------------------------------------------------------------"
            IF(COMPARE(カウント: ((イベント・プレイヤー).cache_collectedLocks), <, (イベント・プレイヤー).cache_bounceMaxLocks));
                "\\"   ! 进点前需集齐所有收集球 !\\" checkCN \\"   ! collect ALL {} orbs to unlock !\\".format(ColorConfig[Customize.orb_lock])"
                小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   ! Collect All Lock Orbs To Complete !   ! Collect All Lock Orbs To Complete !   ! Collect All Lock Orbs To Complete !"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
                "kill player if not colleted the locks"
                サブルーチンの呼び出し(CheckpointFailReset);
            ELSE IF(AND((イベント・プレイヤー).ban_climb, (イベント・プレイヤー).skill_usedClimb));
                "\\"   爬墙 ↑ 已禁用!\\" checkCN \\"   Climb ↑ is banned!\\")"
                小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   Climb ↑ Is Banned!   Climb ↑ Is Banned!   Climb ↑ Is Banned!"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
                サブルーチンの呼び出し(CheckpointFailReset);
            ELSE IF(AND((イベント・プレイヤー).ban_bhop, (イベント・プレイヤー).skill_usedBhop));
                "\\"   ≥ 留小跳进点!\\" checkCN \\"   ≥ Must Have A Bhop To Complete!!\\""
                小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   ≥ Must Have A Bhop To Complete!   ≥ Must Have A Bhop To Complete!   ≥ Must Have A Bhop To Complete!"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
                サブルーチンの呼び出し(CheckpointFailReset);
            ELSE IF(AND((イベント・プレイヤー).ban_djump, (イベント・プレイヤー).skill_usedDouble));
                "\\"   » 留二段跳!\\" checkCN \\"   » Must Have A Double Jump To Complete!\\""
                小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   » Must Have A Double Jump To Complete!   » Must Have A Double Jump To Complete!   » Must Have A Double Jump To Com{0}", カスタムストリング("plete!")), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
                サブルーチンの呼び出し(CheckpointFailReset);
            ELSE;
                プレイヤー変数を設定(イベント・プレイヤー, checkpoint_moved, True);
                (イベント・プレイヤー).checkpoint_current += True;
                IF(COMPARE((イベント・プレイヤー).timer_splitDisplay, >, -999999999999));
                    プレイヤー変数を設定(イベント・プレイヤー, timer_splitDisplay, 減算(IF-THEN-ELSE((イベント・プレイヤー).toggle_practice, (イベント・プレイヤー).timer_practice, (イベント・プレイヤー).timer_normal), (イベント・プレイヤー).timer_split));
                END;
                IF((イベント・プレイヤー).toggle_practice);
                    プレイヤー変数を設定(イベント・プレイヤー, timer_split, (イベント・プレイヤー).timer_practice);
                ELSE;
                    プレイヤー変数を設定(イベント・プレイヤー, timer_split, (イベント・プレイヤー).timer_normal);
                    サブルーチンの呼び出し(DeleteSave);
                    "complete lvl"
                    IF(AND(COMPARE((イベント・プレイヤー).checkpoint_current, ==, 減算(カウント: (グローバル.A), True)), NOT(グローバル.EditorOn)));
                        プレイヤー変数の追跡を中止(イベント・プレイヤー, timer_normal);
                        サブルーチンの呼び出し(LeaderboardUpdate);
                        IF(AND(グローバル.CompMode, グローバル.CompAtmpNum));
                            IF(COMPARE((イベント・プレイヤー).comp_countAttempts, ==, グローバル.CompAtmpNum));
                                インデックスのグローバル変数を設定(CompAtmpSaveCount, 配列値のインデックス(グローバル.CompAtmpSaveNames, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列)), -1);
                                プレイヤー変数を設定(イベント・プレイヤー, comp_countAttempts, -1);
                                プレイヤー変数を設定(イベント・プレイヤー, comp_done, True);
                                プレイヤー変数を設定(イベント・プレイヤー, toggle_leaderboard, True);
                                "eventPlayer.disableRespawn()"
                                受けるダメージを設定(イベント・プレイヤー, 100);
                                キル(イベント・プレイヤー, NULL);
                                受けるダメージを設定(イベント・プレイヤー, 0);
                            ELSE;
                                インデックスのグローバル変数を設定(CompAtmpSaveCount, 配列値のインデックス(グローバル.CompAtmpSaveNames, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列)), 追加((イベント・プレイヤー).comp_countAttempts, True));
                            END;
                        END;
                        "\\"已通关! 用时\\" checkCN \\"Mission Complete! Time\\""
                        大きなメッセージ(最初の値(True), カスタムストリング("{0} {1} {2} Sec", イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒMission Complete! TimeMission Complete! TimeMission Complete! Time"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), (イベント・プレイヤー).timer_normal));
                        待機(False, 条件無視);
                    "update save"
                    ELSE;
                        サブルーチンの呼び出し(MakeSave);
                    END;
                    サブルーチンの呼び出し(UpdateTitle);
                END;
                サブルーチンの呼び出し(UpdateCache);
                "teleport cps"
                IF(COMPARE(カウント: (配列内の値(グローバル.A, (イベント・プレイヤー).checkpoint_current)), >, 1));
                    サブルーチンの呼び出し(CheckpointFailReset);
                ELSE;
                    サブルーチンの呼び出し(AddonCustomLoadAndReset);
                END;
                待機(False, 条件無視);
                "msg disabled due to annoying new sound\\nbigMessage(eventPlayer,  \\"{1} {0}\\".format(eventPlayer.checkpoint_current, \\"抵达检查点\\" checkCN \\"Arrived at level\\"))"
                エフェクトを再生(イベント・プレイヤー, 爆発音（リング）, NULL, イベント・プレイヤー, 100);
                エフェクトを再生(IF-THEN-ELSE(OR(グローバル.CompMode, (イベント・プレイヤー).toggle_invisible), イベント・プレイヤー, True), リングの爆発, 色(スカイブルー), 位置: (イベント・プレイヤー), 4);
            END;
        ELSE IF(COMPARE(二点間の距離(イベント・プレイヤー, 最後の値(配列内の値(グローバル.A, (イベント・プレイヤー).checkpoint_current))), >, 1.4));
            サブルーチンの呼び出し(CheckpointFailReset);
        END;
        プレイヤー変数を設定(イベント・プレイヤー, cache_collectedLocks, 空の配列);
        待機(0.048, 条件無視);
        条件が「TRUE」の場合ループ;
    }
}

ルール ("Parkour | Boundary Sphere") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        (イベント・プレイヤー).cache_killPosition != 空の配列;
        (イベント・プレイヤー).toggle_invincible == False;
        (イベント・プレイヤー).checkpoint_notLast != False;
        いずれに対しても「TRUE」((イベント・プレイヤー).cache_killRadii, COMPARE(乗算(正規化(現在の配列の要素), 二点間の距離(配列内の値((イベント・プレイヤー).cache_killPosition, 現在の配列のインデックス), イベント・プレイヤー)), <, 現在の配列の要素)) == True;
    }
    アクション {
        サブルーチンの呼び出し(CheckpointFailReset);
    }
}

ルール ("Parkour | Bounce Ball / Orb") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        (イベント・プレイヤー).cache_bouncePosition != 空の配列;
        "@Condition eventPlayer.checkpoint_notLast # disabled coz editor"
        いずれに対しても「TRUE」((イベント・プレイヤー).cache_bouncePosition, COMPARE(二点間の距離(現在の配列の要素, 追加(位置: (イベント・プレイヤー), 乗算(0.7, 上))), <, 1.4)) == True;
    }
    アクション {
        プレイヤー変数を設定(イベント・プレイヤー, cache_bounceTouched, 配列値のインデックス(グローバル.TQ, フィルタリングされた配列(グローバル.TQ, AND(AND(AND(COMPARE(配列内の値(グローバル.pinballnumber, 現在の配列のインデックス), ==, (イベント・プレイヤー).checkpoint_current), COMPARE(現在の配列のインデックス, !=, (イベント・プレイヤー).cache_bounceTouched)), NOT(含む配列((イベント・プレイヤー).cache_collectedLocks, 現在の配列のインデックス))), COMPARE(二点間の距離(追加(イベント・プレイヤー, 乗算(0.7, 上)), 現在の配列の要素), <, 1.4)))));
        "prevent same one activating twice in a row"
        IF(COMPARE((イベント・プレイヤー).cache_bounceTouched, >=, NULL));
            IF(配列内の値(グローバル.BounceToggleLock, (イベント・プレイヤー).cache_bounceTouched));
                プレイヤー変数を変更(イベント・プレイヤー, cache_collectedLocks, 配列に追加, (イベント・プレイヤー).cache_bounceTouched);
                "\\"   弹球已收集\\" checkCN \\"   orb has been collected\\""
                小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   Collected Orb   Collected Orb   Collected Orb"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
            END;
            IF(COMPARE(配列内の値(グローバル.EditMode, (イベント・プレイヤー).cache_bounceTouched), >, NULL));
                推進力を適用(イベント・プレイヤー, 上, 配列内の値(グローバル.EditMode, (イベント・プレイヤー).cache_bounceTouched), 対ワールド: , 逆モーションXYZをキャンセル);
            ELSE IF(COMPARE(配列内の値(グローバル.EditMode, (イベント・プレイヤー).cache_bounceTouched), <, NULL));
                メインアクションをキャンセル(イベント・プレイヤー);
                プレイヤー変数を設定(イベント・プレイヤー, skill_usedDouble, NULL);
                "\\"   二段跳已就绪\\" checkCN \\"   » Double Jump is ready\\""
                小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   » Double Jump Is Ready   » Double Jump Is Ready   » Double Jump Is Ready"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
            END;
            IF(配列内の値(グローバル.TQ5, (イベント・プレイヤー).cache_bounceTouched));
                アルティメット・アビリティを有効化(イベント・プレイヤー, True);
                アルティメット・チャージを設定(イベント・プレイヤー, 100);
                "\\"终极技能已就绪\\" checkCN \\"Ultimate is ready\\""
                小さなメッセージ(イベント・プレイヤー, カスタムストリング("   {0} {1}", アビリティアイコンストリング(ヒーロー(ゲンジ), ボタン(アルティメット)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒUltimate Is ReadyUltimate Is ReadyUltimate Is Ready"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))));
            END;
            IF(配列内の値(グローバル.TQ6, (イベント・プレイヤー).cache_bounceTouched));
                IF(アビリティ1を使用(イベント・プレイヤー));
                    条件待機(NOT(アビリティ1を使用(イベント・プレイヤー)), True);
                    待機(False, 条件無視);
                END;
                アビリティ1を有効化(イベント・プレイヤー, True);
                "\\"技能1影已就绪\\" checkCN \\"Dash is ready\\""
                小さなメッセージ(イベント・プレイヤー, カスタムストリング("   {0} {1}", アビリティアイコンストリング(ヒーロー(ゲンジ), ボタン(アビリティ1)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒDash Is ReadyDash Is ReadyDash Is Ready"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))));
            END;
            エフェクトを再生(イベント・プレイヤー, 爆発音（バフ）, NULL, イベント・プレイヤー, 75);
        END;
        待機(0.24, 条件無視);
        条件が「TRUE」の場合ループ;
        プレイヤー変数を設定(イベント・プレイヤー, cache_bounceTouched, -1);
    }
}

ルール ("Parkour | Death Reset") {
    イベント {
        プレイヤーが倒れた;
        すべて;
        すべて;
    }
    条件 {
        ダミーボットである(イベント・プレイヤー) == False;
        (イベント・プレイヤー).toggle_spectate == False;
        (イベント・プレイヤー).comp_done == False;
    }
    アクション {
        IF(カウント: (グローバル.A));
            蘇生(イベント・プレイヤー);
        ELSE;
            リスポーン(イベント・プレイヤー);
        END;
        サブルーチンの呼び出し(CheckpointFailReset);
        "rest is to prevent dead spamming from crashing server\\nbut doing waits only when needed without relying on a variable count"
        条件待機(生存している(イベント・プレイヤー), True);
        条件待機(倒れている(イベント・プレイヤー), True);
        IF(AND(倒れている(イベント・プレイヤー), NOT(OR((イベント・プレイヤー).toggle_spectate, (イベント・プレイヤー).comp_done))));
            待機(0.16, 条件無視);
            蘇生(イベント・プレイヤー);
            サブルーチンの呼び出し(CheckpointFailReset);
            条件待機(生存している(イベント・プレイヤー), True);
            条件待機(倒れている(イベント・プレイヤー), True);
            IF(AND(倒れている(イベント・プレイヤー), NOT(OR((イベント・プレイヤー).toggle_spectate, (イベント・プレイヤー).comp_done))));
                待機(0.44, 条件無視);
                蘇生(イベント・プレイヤー);
                サブルーチンの呼び出し(CheckpointFailReset);
                条件待機(生存している(イベント・プレイヤー), True);
                条件待機(倒れている(イベント・プレイヤー), True);
                IF(AND(倒れている(イベント・プレイヤー), NOT(OR((イベント・プレイヤー).toggle_spectate, (イベント・プレイヤー).comp_done))));
                    待機(0.64, 条件無視);
                    リスポーン(イベント・プレイヤー);
                    サブルーチンの呼び出し(CheckpointFailReset);
    }
}

ルール ("Parkour | SUB Update Effect Cache") {
    イベント {
        サブルーチン;
        UpdateCache;
    }
    アクション {
        "note: if adding cp pos to cache, make sure to also adjust editor things like move and teleport"
        プレイヤー変数を設定(イベント・プレイヤー, cache_bouncePosition, フィルタリングされた配列(グローバル.TQ, COMPARE(配列内の値(グローバル.pinballnumber, 現在の配列のインデックス), ==, (イベント・プレイヤー).checkpoint_current)));
        "eventPlayer.cache_bounceLocks = [_ for _, i in BounceToggleLock if BouncePadCheckpoints[i] == eventPlayer.checkpoint_current and _]\\neventPlayer.cache_bounceMaxLocks = len([_ for _ in eventPlayer.cache_bounceLocks if _])"
        プレイヤー変数を設定(イベント・プレイヤー, cache_bounceMaxLocks, カウント: (フィルタリングされた配列(グローバル.BounceToggleLock, AND(COMPARE(配列内の値(グローバル.pinballnumber, 現在の配列のインデックス), ==, (イベント・プレイヤー).checkpoint_current), 現在の配列の要素))));
        プレイヤー変数を設定(イベント・プレイヤー, cache_killPosition, フィルタリングされた配列(グローバル.H, COMPARE(配列内の値(グローバル.killballnumber, 現在の配列のインデックス), ==, (イベント・プレイヤー).checkpoint_current)));
        プレイヤー変数を設定(イベント・プレイヤー, cache_killRadii, フィルタリングされた配列(グローバル.I, COMPARE(配列内の値(グローバル.killballnumber, 現在の配列のインデックス), ==, (イベント・プレイヤー).checkpoint_current)));
        プレイヤー変数を設定(イベント・プレイヤー, cache_portalStart, フィルタリングされた配列(グローバル.CustomPortalStart, OR(COMPARE(配列内の値(グローバル.CustomPortalCP, 現在の配列のインデックス), ==, (イベント・プレイヤー).checkpoint_current), COMPARE(配列内の値(グローバル.CustomPortalCP, 現在の配列のインデックス), <, NULL))));
        プレイヤー変数を設定(イベント・プレイヤー, cache_portalEnd, フィルタリングされた配列(グローバル.CustomPortalEndpoint, OR(COMPARE(配列内の値(グローバル.CustomPortalCP, 現在の配列のインデックス), ==, (イベント・プレイヤー).checkpoint_current), COMPARE(配列内の値(グローバル.CustomPortalCP, 現在の配列のインデックス), <, NULL))));
        プレイヤー変数を設定(イベント・プレイヤー, checkpoint_notLast, AND(COMPARE((イベント・プレイヤー).checkpoint_current, <, 減算(カウント: (グローバル.A), True)), COMPARE(カウント: (グローバル.A), >, 1)));
        プレイヤー変数を設定(イベント・プレイヤー, toggle_hints, False);
        プレイヤー変数を設定(イベント・プレイヤー, banString, 空の配列);
        待機(False, 条件無視);
        IF((イベント・プレイヤー).checkpoint_notLast);
            プレイヤー変数を設定(イベント・プレイヤー, ban_multi, OR(ワークショップの設定の切り替え(カスタムストリング("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), カスタムストリング("Ban Multiclimb ■ 封禁蹭留 ■ 무한 벽타기 금지"), False, 1), 含む配列(グローバル.BanMulti, (イベント・プレイヤー).checkpoint_current)));
            IF((イベント・プレイヤー).ban_multi);
                プレイヤー変数を設定(イベント・プレイヤー, banString, カスタムストリング("∞ {0}", (イベント・プレイヤー).banString));
            END;
            プレイヤー変数を設定(イベント・プレイヤー, ban_create, OR(ワークショップの設定の切り替え(カスタムストリング("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), カスタムストリング("Ban Createbhop ■ 封禁卡小 ■ 콩콩이 생성 금지"), False, 2), 含む配列(グローバル.BanCreate, (イベント・プレイヤー).checkpoint_current)));
            IF((イベント・プレイヤー).ban_create);
                プレイヤー変数を設定(イベント・プレイヤー, banString, カスタムストリング("♂ {0}", (イベント・プレイヤー).banString));
            END;
            プレイヤー変数を設定(イベント・プレイヤー, ban_standcreate, OR(ワークショップの設定の切り替え(カスタムストリング("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), カスタムストリング("Ban Standcreate ■ 封禁站卡 ■ 서서 콩콩이 생성 금지"), False, 3), 含む配列(グローバル.BanStand, (イベント・プレイヤー).checkpoint_current)));
            IF((イベント・プレイヤー).ban_standcreate);
                "≥  √ ▼ ↓"
                プレイヤー変数を設定(イベント・プレイヤー, banString, カスタムストリング("♠ {0}", (イベント・プレイヤー).banString));
            END;
            プレイヤー変数を設定(イベント・プレイヤー, ban_dead, OR(ワークショップの設定の切り替え(カスタムストリング("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), カスタムストリング("Ban Deathbhop ■ 封禁死小 ■ 죽음 콩콩이 금지"), False, 4), 含む配列(グローバル.BanDead, (イベント・プレイヤー).checkpoint_current)));
            IF((イベント・プレイヤー).ban_dead);
                プレイヤー変数を設定(イベント・プレイヤー, banString, カスタムストリング("X {0}", (イベント・プレイヤー).banString));
            END;
            プレイヤー変数を設定(イベント・プレイヤー, ban_emote, OR(ワークショップの設定の切り替え(カスタムストリング("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), カスタムストリング("Ban Emote Savehop ■ 封禁表情留小 ■ 감정표현 콩콩이 금지"), False, 5), 含む配列(グローバル.BanEmote, (イベント・プレイヤー).checkpoint_current)));
            IF((イベント・プレイヤー).ban_emote);
                プレイヤー変数を設定(イベント・プレイヤー, banString, カスタムストリング("♥ {0}", (イベント・プレイヤー).banString));
            END;
            プレイヤー変数を設定(イベント・プレイヤー, ban_savedouble, OR(ワークショップの設定の切り替え(カスタムストリング("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), カスタムストリング("Ban Save Double ■ 封禁留二段跳 ■ 이단점프 킵 금지"), False, 6), 含む配列(グローバル.BanSaveDouble, (イベント・プレイヤー).checkpoint_current)));
            IF((イベント・プレイヤー).ban_savedouble);
                プレイヤー変数を設定(イベント・プレイヤー, banString, カスタムストリング("△ {0}", (イベント・プレイヤー).banString));
            END;
            プレイヤー変数を設定(イベント・プレイヤー, ban_climb, OR(ワークショップの設定の切り替え(カスタムストリング("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), カスタムストリング("Ban Wallclimb ■ 封禁爬墙 ■ 벽타기 금지"), False, 7), 含む配列(グローバル.BanClimb, (イベント・プレイヤー).checkpoint_current)));
            IF((イベント・プレイヤー).ban_climb);
                プレイヤー変数を設定(イベント・プレイヤー, banString, カスタムストリング("↑ {0}", (イベント・プレイヤー).banString));
            END;
            プレイヤー変数を設定(イベント・プレイヤー, ban_bhop, OR(ワークショップの設定の切り替え(カスタムストリング("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), カスタムストリング("Require Bhop Available ■ 留小跳进点 ■ 도착 시 콩콩이 필요"), False, 8), 含む配列(グローバル.BanBhop, (イベント・プレイヤー).checkpoint_current)));
            IF((イベント・プレイヤー).ban_bhop);
                "≥  √ ▼ ↓"
                プレイヤー変数を設定(イベント・プレイヤー, banString, カスタムストリング("≥ {0}", (イベント・プレイヤー).banString));
            END;
            プレイヤー変数を設定(イベント・プレイヤー, ban_djump, OR(ワークショップの設定の切り替え(カスタムストリング("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), カスタムストリング("Require Djump Available ■ 留二段跳进点 ■ 도착 시 이단 점프 필요"), False, 9), 含む配列(グローバル.BanDjump, (イベント・プレイヤー).checkpoint_current)));
            IF((イベント・プレイヤー).ban_djump);
                "≥  √ ▼ ↓ ︽"
                プレイヤー変数を設定(イベント・プレイヤー, banString, カスタムストリング("» {0}", (イベント・プレイヤー).banString));
            END;
        ELSE;
            プレイヤー変数を設定(イベント・プレイヤー, ban_multi, False);
            プレイヤー変数を設定(イベント・プレイヤー, ban_create, False);
            プレイヤー変数を設定(イベント・プレイヤー, ban_standcreate, False);
            プレイヤー変数を設定(イベント・プレイヤー, ban_dead, False);
            プレイヤー変数を設定(イベント・プレイヤー, ban_emote, False);
            プレイヤー変数を設定(イベント・プレイヤー, ban_climb, False);
            プレイヤー変数を設定(イベント・プレイヤー, ban_savedouble, False);
            プレイヤー変数を設定(イベント・プレイヤー, ban_bhop, False);
            プレイヤー変数を設定(イベント・プレイヤー, ban_djump, False);
        END;
        待機(False, 条件無視);
        ルールを開始(CheckUlt, 何もしない);
        ルールを開始(CheckAbility1, 何もしない);
        中止する条件(OR(COMPARE(イベント・プレイヤー, !=, ホスト・プレイヤー), NOT(グローバル.EditorOn)));
        サブルーチンの呼び出し(EditUpdateSelectedIds);
        エフェクトを破棄((ホスト・プレイヤー).editor_hitboxEffect);
        エフェクトを作成(IF-THEN-ELSE((ホスト・プレイヤー).editor_hitboxToggle, ホスト・プレイヤー, NULL), 球体, 色(白), 配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current), 1.4, 表示される相手、位置、範囲);
        プレイヤー変数を設定(ホスト・プレイヤー, editor_hitboxEffect, 最新のエンティティ);
        エフェクトを作成(IF-THEN-ELSE(AND((ホスト・プレイヤー).editor_hitboxToggle, (ホスト・プレイヤー).checkpoint_notLast), ホスト・プレイヤー, NULL), 球体, 色(白), 配列内の値(グローバル.A, 追加((ホスト・プレイヤー).checkpoint_current, True)), 1.4, 表示される相手、位置、範囲);
        プレイヤー変数を変更(ホスト・プレイヤー, editor_hitboxEffect, 配列に追加, 最新のエンティティ);
        プレイヤー変数を設定(ホスト・プレイヤー, editor_bounceIndex, フィルタリングされた配列(マッピングされた配列(グローバル.pinballnumber, IF-THEN-ELSE(COMPARE(現在の配列の要素, ==, (ホスト・プレイヤー).checkpoint_current), 現在の配列のインデックス, -1)), COMPARE(現在の配列の要素, >=, NULL)));
        プレイヤー変数を設定(ホスト・プレイヤー, editor_killIndex, フィルタリングされた配列(マッピングされた配列(グローバル.killballnumber, IF-THEN-ELSE(COMPARE(現在の配列の要素, ==, (ホスト・プレイヤー).checkpoint_current), 現在の配列のインデックス, -1)), COMPARE(現在の配列の要素, >=, NULL)));
        IF((ホスト・プレイヤー).checkpoint_moved);
            サブルーチンの呼び出し(EditorSelectLast);
            プレイヤー変数を設定(ホスト・プレイヤー, checkpoint_moved, False);
        END;
    }
}

ルール ("Parkour | SUB Delete Save") {
    イベント {
        サブルーチン;
        DeleteSave;
    }
    アクション {
        グローバル変数を変更(SaveName, インデックスを配列から削除, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー));
        グローバル変数を変更(SaveCp, インデックスを配列から削除, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー));
        グローバル変数を変更(SaveTimer, インデックスを配列から削除, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー));
        グローバル変数を変更(SaveElapsed, インデックスを配列から削除, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー));
        "must always be last because its the index itself"
        グローバル変数を変更(SaveEnt, インデックスを配列から削除, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー));
    }
}

ルール ("Parkour | SUB Make Save") {
    イベント {
        サブルーチン;
        MakeSave;
    }
    アクション {
        グローバル変数を変更(SaveEnt, 配列に追加, イベント・プレイヤー);
        グローバル変数を変更(SaveName, 配列に追加, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列));
        グローバル変数を変更(SaveCp, 配列に追加, (イベント・プレイヤー).checkpoint_current);
        グローバル変数を変更(SaveTimer, 配列に追加, (イベント・プレイヤー).timer_normal);
        グローバル変数を変更(SaveElapsed, 配列に追加, 合計経過時間);
    }
}

ルール ("Parkour | SUB Timer Pause") {
    イベント {
        サブルーチン;
        TimerPause;
    }
    アクション {
        プレイヤー変数の追跡を中止(イベント・プレイヤー, timer_normal);
        中止する条件(NOT(含む配列(グローバル.SaveEnt, イベント・プレイヤー)));
        インデックスのグローバル変数を設定(SaveTimer, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー), (イベント・プレイヤー).timer_normal);
        インデックスのグローバル変数を設定(SaveElapsed, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー), NULL);
    }
}

ルール ("Parkour | SUB Timer Resume") {
    イベント {
        サブルーチン;
        TimerResume;
    }
    アクション {
        プレイヤー変数を特定のレートで追跡(イベント・プレイヤー, timer_normal, 999999999999, True, なし);
        インデックスのグローバル変数を設定(SaveElapsed, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー), 合計経過時間);
    }
}

ルール ("Parkour | SUB Leaderboard Update") {
    イベント {
        サブルーチン;
        LeaderboardUpdate;
    }
    アクション {
        "[[name, seconds, prettytime]]\\nyou already have a time"
        IF(含む配列(マッピングされた配列(グローバル.LeaderBoardFull, 最初の値(現在の配列の要素)), 文字列の分割(最初の値(イベント・プレイヤー), 空の配列)));
            中止する条件(COMPARE((イベント・プレイヤー).timer_normal, >=, 配列内の値(最初の値(フィルタリングされた配列(グローバル.LeaderBoardFull, COMPARE(最初の値(現在の配列の要素), ==, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列)))), True)));
            グローバル変数を設定(LeaderBoardFull, フィルタリングされた配列(グローバル.LeaderBoardFull, COMPARE(最初の値(現在の配列の要素), !=, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列))));
        ELSE IF(OR(COMPARE(カウント: (グローバル.LeaderBoardFull), <, 25), COMPARE((イベント・プレイヤー).timer_normal, <, 最後の値(配列内の値(グローバル.LeaderBoardFull, 19)))));
            グローバル変数を変更(LeaderBoardFull, インデックスを配列から削除, 24);
        ELSE;
            "Full and time too slow"
            中止;
        END;
        グローバル変数を変更(LeaderBoardFull, 配列に追加, 配列(配列(文字列の分割(最初の値(イベント・プレイヤー), 空の配列), (イベント・プレイヤー).timer_normal, カスタムストリング("{0} sec", (イベント・プレイヤー).timer_normal))));
        "CreateLeaderboard()"
        グローバル変数を設定(LeaderBoardRemake, True);
    }
}

ルール ("Parkour | SUB Checkpoint Fail") {
    イベント {
        サブルーチン;
        CheckpointFailReset;
    }
    アクション {
        プレイヤー変数を設定(イベント・プレイヤー, timer_split, IF-THEN-ELSE((イベント・プレイヤー).toggle_practice, (イベント・プレイヤー).timer_practice, (イベント・プレイヤー).timer_normal));
        プレイヤー変数を設定(イベント・プレイヤー, cache_collectedLocks, 空の配列);
        メインアクションをキャンセル(イベント・プレイヤー);
        プレイヤー変数を設定(イベント・プレイヤー, skill_usedDouble, NULL);
        IF(NOT(OR((イベント・プレイヤー).checkpoint_current, (イベント・プレイヤー).toggle_practice)));
            プレイヤー変数を設定(イベント・プレイヤー, timer_normal, NULL);
            プレイヤー変数を設定(イベント・プレイヤー, timer_split, NULL);
        END;
        IF(カウント: (グローバル.A));
            IF(アビリティ1を使用(イベント・プレイヤー));
                プレイヤーの位置強制を開始(イベント・プレイヤー, イベント・プレイヤー, False);
                条件待機(NOT(アビリティ1を使用(イベント・プレイヤー)), True);
                待機(False, 条件無視);
                プレイヤーの位置強制を停止(イベント・プレイヤー);
            END;
            テレポート(イベント・プレイヤー, 最後の値(配列内の値(グローバル.A, (イベント・プレイヤー).checkpoint_current)));
            "After teleport incase stopForcingPosition launches the player"
            推進力を適用(イベント・プレイヤー, 乗算(-1, 速度: (イベント・プレイヤー)), 1.192093e-7, 対ワールド: , 逆モーションXYZをキャンセル);
            "old: disallow jump > 0.1 sec wait > allow jump, this method bugs with ult check disabling ultimate for some reason\\nif eventPlayer.ban_dead or eventPlayer.ban_emote and eventPlayer.isHoldingButton(Button.JUMP):"
            IF((イベント・プレイヤー).ban_dead);
                IF(ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)));
                    ボタンを押す(イベント・プレイヤー, ボタン(ジャンプ));
                END;
            ELSE;
                "Reset Hop"
                ステータスを設定(イベント・プレイヤー, NULL, 固定されている, 0.096);
            END;
            IF(アルティメットを使用している(イベント・プレイヤー));
                受けるダメージを設定(イベント・プレイヤー, 100);
                キル(イベント・プレイヤー, NULL);
                受けるダメージを設定(イベント・プレイヤー, 0);
                待機(False, 条件無視);
            END;
        END;
        ルールを開始(CheckUlt, ルールをやり直す);
        ルールを開始(CheckAbility1, ルールをやり直す);
        サブルーチンの呼び出し(AddonCustomLoadAndReset);
    }
}

ルール ("Parkour | SUB Start Game") {
    イベント {
        サブルーチン;
        StartGame;
    }
    アクション {
        IF(AND(グローバル.CompMode, OR(COMPARE(グローバル.CompTime, <, 1), (イベント・プレイヤー).comp_done)));
            プレイヤー変数を設定(イベント・プレイヤー, toggle_leaderboard, True);
            プレイヤー変数を設定(イベント・プレイヤー, comp_done, True);
            "eventPlayer.disableRespawn()"
            受けるダメージを設定(イベント・プレイヤー, 100);
            キル(イベント・プレイヤー, NULL);
            受けるダメージを設定(イベント・プレイヤー, 0);
            中止;
        END;
        IF(カウント: (グローバル.A));
            "load saved progres"
            IF(含む配列(グローバル.SaveName, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列)));
                インデックスのグローバル変数を設定(SaveEnt, 配列値のインデックス(グローバル.SaveName, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列)), イベント・プレイヤー);
                プレイヤー変数を設定(イベント・プレイヤー, checkpoint_current, 配列内の値(グローバル.SaveCp, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー)));
                プレイヤー変数を設定(イベント・プレイヤー, timer_normal, 配列内の値(グローバル.SaveTimer, 配列値のインデックス(グローバル.SaveEnt, イベント・プレイヤー)));
            ELSE;
                プレイヤー変数を設定(イベント・プレイヤー, checkpoint_current, NULL);
                プレイヤー変数を設定(イベント・プレイヤー, timer_normal, NULL);
                サブルーチンの呼び出し(MakeSave);
            END;
            サブルーチンの呼び出し(UpdateTitle);
            サブルーチンの呼び出し(UpdateCache);
            サブルーチンの呼び出し(CheckpointFailReset);
            "FFA"
            条件待機(ゲームが進行中, 999999999999);
            サブルーチンの呼び出し(TimerResume);
        END;
        "eventPlayer.enableRespawn()"
        プレイヤー変数を設定(イベント・プレイヤー, toggle_invincible, False);
        プレイヤー変数を設定(イベント・プレイヤー, toggle_spectate, False);
        プレイヤー変数を設定(イベント・プレイヤー, checkpoint_moved, True);
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Mechanics | Checks ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("Mechanic | All | Jump") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        ジャンプ中(イベント・プレイヤー) == True;
    }
    アクション {
        プレイヤー変数を設定(イベント・プレイヤー, skill_usedBhop, True);
        IF((イベント・プレイヤー).skill_usedHop);
            "\\"   小跳已用\\" checkCN \\"   Bhop\\""
            小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   Bhop   Bhop   Bhop"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
        ELSE;
            プレイヤー変数を設定(イベント・プレイヤー, skill_usedHop, True);
    }
}

ルール ("Mechanic | All | No Jump") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        (イベント・プレイヤー).skill_usedHop == NULL;
        地上にいる(イベント・プレイヤー) == False;
    }
    アクション {
        プレイヤー変数を設定(イベント・プレイヤー, skill_usedHop, True);
    }
}

ルール ("Mechanic | All | Bhop Reset") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        地上にいる(イベント・プレイヤー) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)) == False;
    }
    アクション {
        プレイヤー変数を設定(イベント・プレイヤー, skill_usedBhop, False);
    }
}

ルール ("Mechanic | All | Emote") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        エモートでコミュニケーションしている(イベント・プレイヤー) == True;
    }
    アクション {
        プレイヤー変数を設定(イベント・プレイヤー, skill_usedBhop, False);
        IF((イベント・プレイヤー).addon_toggle3rdPov);
            プレイヤー変数を設定(イベント・プレイヤー, addon_toggle3rdPov, False);
            カメラの停止(イベント・プレイヤー);
        END;
        IF((イベント・プレイヤー).ban_emote);
            条件待機(NOT(エモートでコミュニケーションしている(イベント・プレイヤー)), 999999999999);
            中止する条件((イベント・プレイヤー).toggle_invincible);
            "\\"   表情留小 ♥ 已禁用!\\" checkCN \\"   Emote Savehop ♥ is banned!\\""
            小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   Emote Savehop ♥ Is Banned!   Emote Savehop ♥ Is Banned!   Emote Savehop ♥ Is Banned!"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
            待機(False, 条件無視);
            サブルーチンの呼び出し(CheckpointFailReset);
    }
}

ルール ("Mechanic | All | Ground Reset") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        地上にいる(イベント・プレイヤー) == True;
    }
    アクション {
        "All"
        プレイヤー変数を設定(イベント・プレイヤー, skill_usedHop, NULL);
        プレイヤー変数を設定(イベント・プレイヤー, skill_countBhops, NULL);
        "$$ Climb"
        プレイヤー変数を設定(イベント・プレイヤー, skill_usedClimb, False);
        プレイヤー変数を設定(イベント・プレイヤー, skill_countMulti, NULL);
        プレイヤー変数を設定(イベント・プレイヤー, skill_countCreates, NULL);
        "$$ Genji"
        プレイヤー変数を設定(イベント・プレイヤー, skill_usedDouble, NULL);
    }
}

ルール ("Mechanic | Climbers | On Wall") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        "This rule is also linked to the determination of wall climbing, please do not close/delete"
        壁の上にいる(イベント・プレイヤー) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)) == True;
    }
    アクション {
        プレイヤー変数を設定(イベント・プレイヤー, skill_usedClimb, True);
    }
}

ルール ("Mechanic | Climbers | Bhop count for stand ban") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        ジャンプ中(イベント・プレイヤー) == True;
        (イベント・プレイヤー).ban_standcreate != False;
    }
    アクション {
        (イベント・プレイヤー).skill_countBhops += True;
        IF(AND(COMPARE((イベント・プレイヤー).skill_countBhops, >, 1), NOT((イベント・プレイヤー).toggle_invincible)));
            "\\"   站卡 ♠ 已禁用!\\" checkCN \\"   Stand createBhop ♠ is banned!\\""
            小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   Stand Createbhop ♠ Is Banned!   Stand Createbhop ♠ Is Banned!   Stand Createbhop ♠ Is Banned!"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
            サブルーチンの呼び出し(CheckpointFailReset);
    }
}

ルール ("Mechanic | Climbers | Create Bhop") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        ボタンが長押しされている(イベント・プレイヤー, ボタン(しゃがみ)) == True;
        しゃがんでいる(イベント・プレイヤー) == True;
        空中にいる(イベント・プレイヤー) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)) == False;
        ジャンプ中(イベント・プレイヤー) == False;
    }
    アクション {
        プレイヤー変数を設定(イベント・プレイヤー, skill_usedBhop, False);
        "prevent restart from giving messsage, but stil allow it to become green"
        中止する条件((イベント・プレイヤー).lockState);
        IF(AND((イベント・プレイヤー).ban_create, NOT((イベント・プレイヤー).toggle_invincible)));
            "\\"   卡小 ♂ 已禁用!\\" checkCN \\"   Create Bhop ♂ is banned!\\""
            小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   Create Bhop ♂ Is Banned!   Create Bhop ♂ Is Banned!   Create Bhop ♂ Is Banned!"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
            サブルーチンの呼び出し(CheckpointFailReset);
        ELSE;
            IF(AND((イベント・プレイヤー).ban_standcreate, COMPARE((イベント・プレイヤー).skill_countBhops, >, NULL)));
                プレイヤー変数を変更(イベント・プレイヤー, skill_countBhops, 引く, True);
            END;
            (イベント・プレイヤー).skill_countCreates += True;
            "\\"   success!\\" checkCN \\"   Bhop has been created!\\""
            小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   Bhop Created!   Bhop Created!   Bhop Created!"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
    }
}

ルール ("Mechanic | Climbers | Multiclimb") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        壁の上にいる(イベント・プレイヤー) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)) == False;
        (イベント・プレイヤー).skill_usedClimb == False;
    }
    アクション {
        待機(False, 条件無視);
        IF(AND(壁の上にいる(イベント・プレイヤー), NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)))));
            "AutoClimb used"
            プレイヤー変数を設定(イベント・プレイヤー, skill_usedClimb, True);
        ELSE;
            IF(AND(AND((イベント・プレイヤー).ban_multi, (イベント・プレイヤー).checkpoint_notLast), NOT((イベント・プレイヤー).toggle_invincible)));
                "\\"   蹭留 ∞ 已禁用!\\" checkCN \\"   Multiclimb ∞ is banned!\\""
                小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   Multiclimb ∞ Is Banned!   Multiclimb ∞ Is Banned!   Multiclimb ∞ Is Banned!"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
                サブルーチンの呼び出し(CheckpointFailReset);
            ELSE;
                (イベント・プレイヤー).skill_countMulti += True;
    }
}

ルール ("Mechanic | Climbers | Ban Wallclimb - Message") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        (イベント・プレイヤー).ban_climb != False;
        (イベント・プレイヤー).toggle_invincible == False;
        (イベント・プレイヤー).skill_usedClimb != False;
    }
    アクション {
        "CheckpointFailReset()\\n\\"   爬墙 ↑ 已禁用!\\" checkCN \\"   Climb ↑ is banned!\\""
        小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   Climb ↑ Is Banned!   Climb ↑ Is Banned!   Climb ↑ Is Banned!"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
    }
}

ルール ("Mechanic | Genji | SUB Check Ultimate") {
    イベント {
        サブルーチン;
        CheckUlt;
    }
    アクション {
        IF((イベント・プレイヤー).lockState);
            "for dash start etc you can be away from cp so the keep charge activators"
            アルティメット・チャージを設定(イベント・プレイヤー, False);
        END;
        IF(アルティメットを使用している(イベント・プレイヤー));
            条件待機(NOT(アルティメットを使用している(イベント・プレイヤー)), 2);
            待機(False, 条件無視);
        END;
        "incase spamming the button"
        IF(ボタンが長押しされている(イベント・プレイヤー, ボタン(アルティメット)));
            待機(False, 条件無視);
        END;
        IF(OR(OR((イベント・プレイヤー).toggle_invincible, AND(COMPARE(イベント・プレイヤー, ==, ホスト・プレイヤー), グローバル.EditorOn)), NOT((イベント・プレイヤー).checkpoint_notLast)));
            "skip msg if these"
            スキップ(2);
        ELSE IF(AND(含む配列(グローバル.Dao, (イベント・プレイヤー).checkpoint_current), COMPARE(二点間の距離(イベント・プレイヤー, 最後の値(配列内の値(グローバル.A, (イベント・プレイヤー).checkpoint_current))), <=, 1.4)));
            "\\"终极技能已就绪\\" checkCN \\"Ultimate is ready\\""
            小さなメッセージ(イベント・プレイヤー, カスタムストリング("   {0} {1}", アビリティアイコンストリング(ヒーロー(ゲンジ), ボタン(アルティメット)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒUltimate Is ReadyUltimate Is ReadyUltimate Is Ready"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))));
            //lbl_a:
            待機(False, 条件無視);
            アルティメット・アビリティを有効化(イベント・プレイヤー, True);
            アルティメット・チャージを設定(イベント・プレイヤー, 100);
        "used to be just else, but have to deal with multi ult orbs"
        ELSE IF(OR(COMPARE(二点間の距離(イベント・プレイヤー, 最後の値(配列内の値(グローバル.A, (イベント・プレイヤー).checkpoint_current))), <=, 2), COMPARE(アルティメット・チャージのパーセンテージ(イベント・プレイヤー), <, 100)));
            アルティメット・アビリティを有効化(イベント・プレイヤー, False);
            アルティメット・チャージを設定(イベント・プレイヤー, False);
        END;
        待機(0.36, 条件無視);
    }
}

ルール ("Mechanic | Genji | SUB Check Dash") {
    イベント {
        サブルーチン;
        CheckAbility1;
    }
    アクション {
        条件待機(NOT(アビリティ1を使用(イベント・プレイヤー)), True);
        IF(OR(OR((イベント・プレイヤー).toggle_invincible, AND(COMPARE(イベント・プレイヤー, ==, ホスト・プレイヤー), グローバル.EditorOn)), NOT((イベント・プレイヤー).checkpoint_notLast)));
            "skip msg if these"
            スキップ(2);
        ELSE IF(AND(含む配列(グローバル.SHIFT, (イベント・プレイヤー).checkpoint_current), COMPARE(二点間の距離(イベント・プレイヤー, 最後の値(配列内の値(グローバル.A, (イベント・プレイヤー).checkpoint_current))), <=, 1.4)));
            "\\"技能1影已就绪\\" checkCN \\"Dash is ready\\""
            小さなメッセージ(イベント・プレイヤー, カスタムストリング("   {0} {1}", アビリティアイコンストリング(ヒーロー(ゲンジ), ボタン(アビリティ1)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒDash Is ReadyDash Is ReadyDash Is Ready"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))));
            //lbl_a:
            アビリティ1を有効化(イベント・プレイヤー, True);
        ELSE;
            アビリティ1を有効化(イベント・プレイヤー, False);
        END;
    }
}

ルール ("Mechanic | Genji | Ultimate") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        アルティメットを使用している(イベント・プレイヤー) == True;
    }
    アクション {
        待機(1.8, 「FALSE」の場合中止);
        IF(AND((イベント・プレイヤー).checkpoint_notLast, NOT((イベント・プレイヤー).toggle_invincible)));
            "disable primary fire because of slash exploit"
            ボタンを無効化(イベント・プレイヤー, ボタン(メイン攻撃));
        END;
        条件待機(NOT(アルティメットを使用している(イベント・プレイヤー)), 2);
        待機(False, 条件無視);
        ボタンを有効化(イベント・プレイヤー, ボタン(メイン攻撃));
        "sets ult charge back if done with map etc"
        ルールを開始(CheckUlt, 何もしない);
    }
}

ルール ("Mechanic | Genji | Dash") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        アビリティ1を使用(イベント・プレイヤー) == True;
    }
    アクション {
        "async(CheckAbility1(), AsyncBehavior.NOOP)"
        サブルーチンの呼び出し(CheckAbility1);
    }
}

ルール ("Mechanic | Genji | Double Jump") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        生存している(イベント・プレイヤー) == True;
        空中にいる(イベント・プレイヤー) == True;
        OR(OR((イベント・プレイヤー).ban_djump, (イベント・プレイヤー).ban_savedouble), (イベント・プレイヤー).addon_enableDoubleChecks) == True;
    }
    アクション {
        "Save drop"
        条件待機(OR(OR(地上にいる(イベント・プレイヤー), ジャンプ中(イベント・プレイヤー)), ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ))), 0.096);
        条件が「FALSE」の場合中止;
        WHILE(True);
            "Released Jump"
            条件待機(OR(地上にいる(イベント・プレイヤー), NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)))), 999999999999);
            条件が「FALSE」の場合中止;
            "Double Jumped"
            条件待機(OR(地上にいる(イベント・プレイヤー), ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ))), 999999999999);
            条件が「FALSE」の場合中止;
            プレイヤー変数を設定(イベント・プレイヤー, skill_usedDouble, True);
            "Reset"
            条件待機(OR(地上にいる(イベント・プレイヤー), NOT((イベント・プレイヤー).skill_usedDouble)), 999999999999);
            条件が「FALSE」の場合中止;
        END;
    }
}

ルール ("Mechanic | Genji | Ban Save Double - 封禁二段跳") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        (イベント・プレイヤー).ban_savedouble != False;
        (イベント・プレイヤー).toggle_invincible == False;
        空中にいる(イベント・プレイヤー) == True;
        (イベント・プレイヤー).skill_usedDouble == False;
    }
    アクション {
        条件待機(OR(OR(COMPARE(Z成分: (スロットル: (イベント・プレイヤー)), >, NULL), NOT(空中にいる(イベント・プレイヤー))), (イベント・プレイヤー).skill_usedDouble), 999999999999);
        条件が「FALSE」の場合中止;
        条件待機(OR(OR(COMPARE(Z成分: (スロットル: (イベント・プレイヤー)), <=, NULL), NOT(空中にいる(イベント・プレイヤー))), (イベント・プレイヤー).skill_usedDouble), 999999999999);
        条件が「FALSE」の場合中止;
        "Prevent false positives\\nDefault climb speed is 7.8 and small slowdown upon mantling"
        ループする条件(COMPARE(垂直速度: (イベント・プレイヤー), <, 6));
        IF((イベント・プレイヤー).skill_usedBhop);
            待機(0.8, 「FALSE」の場合中止);
        ELSE;
            待機(0.8, 「FALSE」の場合中止);
            中止する条件((イベント・プレイヤー).skill_usedBhop);
        END;
        "\\"   延二段跳已禁用!\\" checkCN \\"   save double banned!\\""
        小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   Save Double Banned!   Save Double Banned!   Save Double Banned!"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
        サブルーチンの呼び出し(CheckpointFailReset);
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Editor ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("Editor | Export Map") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        イベント・プレイヤー == ホスト・プレイヤー;
        グローバル.EditorOn != False;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(近接)) == True;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)) == True;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(リロード)) == True;
    }
    アクション {
        "@Condition hostPlayer.editor_lock == false # !!! don't lock. always be sure data can be exported incase of a perma lock situation"
        待機(True, 「FALSE」の場合中止);
        "doesnt matter thats its in pasta's because it wil be fixed on spawning"
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, True);
        プレイヤー変数を設定(ホスト・プレイヤー, editor_saveCache, 配列(グローバル.TimeRemaining, グローバル.ColorConfig));
        グローバル変数を設定(TimeRemaining, NULL);
        グローバル変数を設定(ColorConfig, NULL);
        グローバル変数を設定(EditorOn, NULL);
        グローバル変数を設定(C, NULL);
        グローバル変数を設定(K, NULL);
        グローバル変数を設定(NANBA, NULL);
        グローバル変数を設定(TQ2, NULL);
        グローバル変数を設定(SaveName, NULL);
        グローバル変数を設定(SaveCp, NULL);
        グローバル変数を設定(SaveTimer, NULL);
        グローバル変数を設定(SaveEnt, NULL);
        "SavePauseTime = null\\nSavePauseEnabled = null"
        グローバル変数を設定(SaveElapsed, NULL);
        グローバル変数を設定(CompMode, NULL);
        "LeaderBoardFull = null\\nLeaderBoardHuds = null"
        グローバル変数を設定(PortalOn, NULL);
        グローバル変数を設定(TitleData, NULL);
        グローバル変数を設定(CpHudText, NULL);
        グローバル変数を設定(CpHudCp, NULL);
        グローバル変数を設定(HintText, NULL);
        グローバル変数を設定(HintCp, NULL);
        グローバル変数を設定(CpIwtText, NULL);
        グローバル変数を設定(CpIwtCp, NULL);
        グローバル変数を設定(CpIwtPos, NULL);
        グローバル変数を設定(CpIwtColor, NULL);
        グローバル変数を設定(PortalNames, NULL);
        グローバル変数を設定(PortalLoc, NULL);
        グローバル変数を設定(PortalDest, NULL);
        グローバル変数を設定(PortalEffects, NULL);
        IF(COMPARE(グローバル.Name, ==, カスタムストリング("name here - 作者")));
            グローバル変数を設定(Name, カスタムストリング("{0}", ホスト・プレイヤー));
        END;
        グローバル変数を設定(Cachedcredits, 配列(グローバル.Name, グローバル.Code));
        グローバル変数を設定(Name, NULL);
        グローバル変数を設定(Code, NULL);
        HUDテキストを作成(ホスト・プレイヤー, カスタムストリング("­"), NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("   0. 清理无用数据:\\n (此窗口打开时将自动完成)\\n\\n   1. 复制数据:\\n Esc → 打开地图工坊查看器 → 右下角'变量目标'改为全局\\n 点击窗口下方图标 (X) 复制作图数据\\n\\n   2. 录入数据:\\n Esc → 打开地图工坊编辑器{0}", カスタムストリング(" → 规则第(2/2)页 → 展开规则'数据录入 <---- 在这输入'\\n 点击'动作'一栏右侧橙色粘贴图标 录入数据\\n\\n   3. 地图工坊设置:\\n ESC → 显示大厅 → 设置 → 地图工坊设置→\\n 拉至底部 关闭'作图模式'\\n 选择地图难度\\n{0}", カスタムストリング("\\n   4. 创建初始地图代码:\\n Esc → 显示大厅 → 设置 → 分享代码 →\\n 创建新的代码 → 复制并记下代码\\n\\n   5. 添加作者信息:\\n Esc → 打开地图工坊编辑器 → 规则第(2/2)页 → 展开规则'Credits Here {0}", カスタムストリング("- 作者名字'\\n 修改自定义字符串文本框中的内容\\n\\n   6. 更新地图及作者信息:\\n Esc → 显示大厅 → 设置 → 共享代码 →\\n 上传至现有代码 → 粘贴步骤4中获得的代码")))), カスタムストリング("   0. Clear Extra Data:\\n Already Done Upon Opening This Window\\n\\n   1. Copy Data:\\n Open Workshop Inspector → Set Variable Targ{0}", カスタムストリング("et To Global\\n Click The [X]\\n\\n   2. Insert Data:\\n Paste The Data Into Rule Named 'Map Data <---- Insert Here'\\n\\n   3. Workshop {0}", カスタムストリング("Settings:\\n Esc → Show Lobby → Settings → Workshop Settings →\\n Toggle 'Editor Mode' Off\\n Select Display Difficulty\\n\\n   4. Crea{0}", カスタムストリング("te Initial Sharecode:\\n Esc → Show Lobby → Settings → Share Code →\\n Create New Code → Copy Code\\n\\n   5. Add Credits:\\n Enter You{0}", カスタムストリング("r Name & Map Code In The 'Credits Here' Rule\\n\\n   6. Update For Credits:\\n Esc → Show Lobby → Settings → Share Code →\\n Upload T{0}", カスタムストリング("o Existing Code → Paste The Code You Created In Step 4"))))))), トップ, -185, NULL, NULL, 色(ライムグリーン), 文字列, デフォルト表示);
        インデックスのプレイヤー変数を設定(ホスト・プレイヤー, editor_saveCache, 2, 最新のテキストID);
        サブルーチンの呼び出し(AddonCheckMap);
        インスペクターでの記録を有効化;
        インスペクターでの記録を無効化;
        グローバル変数を設定(EditorOn, True);
        グローバル変数を設定(TimeRemaining, 最初の値((ホスト・プレイヤー).editor_saveCache));
        グローバル変数を設定(ColorConfig, 配列内の値((ホスト・プレイヤー).editor_saveCache, True));
        HUDテキストを作成(ホスト・プレイヤー, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("    > 按互动键关闭当前窗口 <    "), カスタムストリング("    > Press Interact To Close This Window <    ")), NULL, NULL, トップ, -183, 色(ライムグリーン), NULL, NULL, 文字列, デフォルト表示);
        インデックスのプレイヤー変数を設定(ホスト・プレイヤー, editor_saveCache, False, 最新のテキストID);
        条件待機(NOT(ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト))), 999999999999);
        条件待機(ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)), 999999999999);
        "Close Window"
        HUDテキストを破棄(最初の値((ホスト・プレイヤー).editor_saveCache));
        "Instructions"
        HUDテキストを破棄(最後の値((ホスト・プレイヤー).editor_saveCache));
        プレイヤー変数を設定(ホスト・プレイヤー, editor_saveCache, NULL);
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, False);
    }
}

ルール ("Editor | Hud & Effects") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        待機(0.832000000000000, 条件無視);
        "waitUntil(entityExists(getAllPlayers()), Math.INFINITY)  # cant be condition because host player can leaves, removing the rule fx\\nwait()"
        IF(グローバル.EditorOn);
            HUDテキストを作成((ローカルプレイヤー).toggle_guide, NULL, NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("{0}+{1}+{2} | 重新开始", 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(インタラクト))), カスタムストリング("{0}+{1}+{2} | Restart", 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(インタラクト)))), 右, -156, NULL, NULL, 配列内の値(グローバル.ColorConfig, 5), 表示される相手、文字列, デフォルト表示);
            HUDテキストを作成(IF-THEN-ELSE((ホスト・プレイヤー).toggle_guide, ホスト・プレイヤー, NULL), NULL, NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), IF-THEN-ELSE(グローバル.EditorMoveItem, カスタムストリング("方向键 | 移动实体 \\n{0} | 向上移动 \\n{1} | 向下移动 \\n{2} (长按) | 快速移动", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(アルティメット)), 入力割り当ての文字列(ボタン(ジャンプ))), 配列内の値(配列(カスタムストリング("{0} + {1} | 新建检查点\\n{0} + {2} | 删除选中的检查点", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(メイン攻撃)), 入力割り当ての文字列(ボタン(サブ攻撃))), カスタムストリング("{0} + {1} | 新建击杀球\\n{0} + {1} (长按) | 在准心位置新建", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(メイン攻撃))), カスタムストリング("{0} + {1} | 新建弹球\\n{0} + {1} (长按) | 在准心位置新建", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(メイン攻撃))), カスタムストリング("{0} + {1} | 蹭留\\n{0} + {2} | 卡小", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(メイン攻撃)), 入力割り当ての文字列(ボタン(サブ攻撃))), カスタムストリング("{0} + {1} | 新建传送门\\n{0} + {1} (长按) | 在准心位置新建", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(メイン攻撃)))), (ホスト・プレイヤー).editor_modeSelect)), IF-THEN-ELSE(グローバル.EditorMoveItem, カスタムストリング("Walk | Move Selected\\n{0} | Move Up\\n{1} | Move Down\\n{2} (Hold) | Move Faster", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(アルティメット)), 入力割り当ての文字列(ボタン(ジャンプ))), 配列内の値(配列(カスタムストリング("{0} + {1} | Create New\\n{0} + {2} | Delete Selected", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(メイン攻撃)), 入力割り当ての文字列(ボタン(サブ攻撃))), カスタムストリング("{0} + {1} | Create New\\n{0} + {1} (Hold)| Raycast New", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(メイン攻撃))), カスタムストリング("{0} + {1} | Create New\\n{0} + {1} (Hold)| Raycast New", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(メイン攻撃))), カスタムストリング("{0} + {1} | Multi-Climb\\n{0} + {2} | Createbhop", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(メイン攻撃)), 入力割り当ての文字列(ボタン(サブ攻撃))), カスタムストリング("{0} + {1} | Create New\\n{0} + {1} (Hold)| Raycast New", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(メイン攻撃)))), (ホスト・プレイヤー).editor_modeSelect))), 右, -148, NULL, NULL, 色(黄色), 表示される相手、文字列, デフォルト表示);
            HUDテキストを作成(IF-THEN-ELSE(AND((ホスト・プレイヤー).toggle_guide, NOT(グローバル.EditorMoveItem)), ホスト・プレイヤー, NULL), NULL, NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), 配列内の値(配列(空の配列, カスタムストリング("{0} + {1} | 删除选中的击杀球", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(サブ攻撃))), カスタムストリング("{0} + {1} | 删除选中的弹球", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(サブ攻撃))), 空の配列, カスタムストリング("{0} + {1} | 删除选中的传送门", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(サブ攻撃)))), (ホスト・プレイヤー).editor_modeSelect), 配列内の値(配列(空の配列, カスタムストリング("{0} + {1} | Delete Selected", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(サブ攻撃))), カスタムストリング("{0} + {1} | Delete Selected", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(サブ攻撃))), 空の配列, カスタムストリング("{0} + {1} | Delete Selected", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(サブ攻撃)))), (ホスト・プレイヤー).editor_modeSelect)), 右, -147, NULL, NULL, 色(黄色), 表示される相手、文字列, デフォルト表示);
            HUDテキストを作成(IF-THEN-ELSE((ホスト・プレイヤー).toggle_guide, ホスト・プレイヤー, NULL), NULL, NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), IF-THEN-ELSE(グローバル.EditorMoveItem, カスタムストリング("{0} | 放置实体{1} | Cancel Placement\\n", 入力割り当ての文字列(ボタン(メイン攻撃)), 入力割り当ての文字列(ボタン(サブ攻撃))), 配列内の値(配列(カスタムストリング("{0} + {1} | 移除/新建传送点\\n{0} + {2} | 检查点碰撞模型\\n", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(リロード)), 入力割り当ての文字列(ボタン(アビリティ1))), カスタムストリング("{0} + {1} | 选择上一个击杀球\\n{0} + {2} | 选择下一个击杀球\\n", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(ジャンプ))), カスタムストリング("{0} + {1} | 选择上一个弹球\\n{0} + {2} | 选择下一个弹球\\n", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(ジャンプ))), カスタムストリング("{0} + {1} | 爬墙\\n{0} + {2} | 延二段跳", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(ジャンプ))), カスタムストリング("{0} + {1} | 选择下一个传送门\\n{0} + {2} | 选择上一个传送门\\n", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(ジャンプ)), 入力割り当ての文字列(ボタン(しゃがみ)))), (ホスト・プレイヤー).editor_modeSelect)), IF-THEN-ELSE(グローバル.EditorMoveItem, カスタムストリング("{0} | Confirm Placement\\n{1} | Cancel Placement", 入力割り当ての文字列(ボタン(メイン攻撃)), 入力割り当ての文字列(ボタン(サブ攻撃))), 配列内の値(配列(カスタムストリング("{0} + {1} | Remove/Add Teleport\\n{0} + {2} | Toggle Hitbox\\n", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(リロード)), 入力割り当ての文字列(ボタン(アビリティ1))), カスタムストリング("{0} + {1} | Select Previous\\n{0} + {2} | Select Next\\n", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(ジャンプ))), カスタムストリング("{0} + {1} | Select Previous\\n{0} + {2} | Select Next\\n", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(ジャンプ))), カスタムストリング("{0} + {1} | Wallclimb\\n{0} + {2} | Save Double", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(ジャンプ))), カスタムストリング("{0} + {1} | Select Next\\n{0} + {2} | Select Previous\\n", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(ジャンプ)), 入力割り当ての文字列(ボタン(しゃがみ)))), (ホスト・プレイヤー).editor_modeSelect))), 右, -146, NULL, NULL, 色(黄色), 表示される相手、文字列, デフォルト表示);
            HUDテキストを作成(IF-THEN-ELSE(AND((ホスト・プレイヤー).toggle_guide, NOT(グローバル.EditorMoveItem)), ホスト・プレイヤー, NULL), NULL, NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), 配列内の値(配列(カスタムストリング("{0} (长按) | 移动检查点", 入力割り当ての文字列(ボタン(アビリティ2))), カスタムストリング("{0} + {1} | 增大击杀球\\n{0} + {2} | 缩小击杀球", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(ジャンプ)), 入力割り当ての文字列(ボタン(しゃがみ))), カスタムストリング("{0} + {1} | 增加弹球弹力\\n{0} + {2} | 减少弹球弹力", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(ジャンプ)), 入力割り当ての文字列(ボタン(しゃがみ))), カスタムストリング("{0} + {1} | 死小\\n{0} + {2} | 表情留小", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(メイン攻撃)), 入力割り当ての文字列(ボタン(サブ攻撃))), カスタムストリング("{0} + {1} | 移动选中的实体\\n{0} + {2} | 应用到当前/所有关卡(开关)", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(メイン攻撃)), 入力割り当ての文字列(ボタン(ジャンプ)))), (ホスト・プレイヤー).editor_modeSelect), 配列内の値(配列(カスタムストリング("{0} (Hold) | Move", 入力割り当ての文字列(ボタン(アビリティ2))), カスタムストリング("{0} + {1} | Increase Size\\n{0} + {2} | Decrease Size", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(ジャンプ)), 入力割り当ての文字列(ボタン(しゃがみ))), カスタムストリング("{0} + {1} | Increase Strength\\n{0} + {2} | Decrease Strength", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(ジャンプ)), 入力割り当ての文字列(ボタン(しゃがみ))), カスタムストリング("{0} + {1} | Death Hop\\n{0} + {2} | Emote", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(メイン攻撃)), 入力割り当ての文字列(ボタン(サブ攻撃))), カスタムストリング("{0} + {1} | Move\\n{0} + {2} | Cp/Map (Toggle)", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(メイン攻撃)), 入力割り当ての文字列(ボタン(ジャンプ)))), (ホスト・プレイヤー).editor_modeSelect)), 右, -145, NULL, NULL, 色(黄色), 表示される相手、文字列, デフォルト表示);
            HUDテキストを作成(IF-THEN-ELSE(AND((ホスト・プレイヤー).toggle_guide, NOT(グローバル.EditorMoveItem)), ホスト・プレイヤー, NULL), NULL, NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), 配列内の値(配列(空の配列, カスタムストリング("{0} + {1} | 移动选中的实体", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(メイン攻撃))), カスタムストリング("{0} + {1} | 移动选中的实体", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(メイン攻撃))), カスタムストリング("{0} + {1} | 留小跳进点\\n{0} + {2} | 站卡", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(ジャンプ)), 入力割り当ての文字列(ボタン(しゃがみ))), 空の配列), (ホスト・プレイヤー).editor_modeSelect), 配列内の値(配列(空の配列, カスタムストリング("{0} + {1} | Move", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(メイン攻撃))), カスタムストリング("{0} + {1} | Move", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(メイン攻撃))), カスタムストリング("{0} + {1} | Require Bhop\\n{0} + {2} | Stand Create", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(ジャンプ)), 入力割り当ての文字列(ボタン(しゃがみ))), 空の配列), (ホスト・プレイヤー).editor_modeSelect)), 右, -144, NULL, NULL, 色(黄色), 表示される相手、文字列, デフォルト表示);
            HUDテキストを作成(IF-THEN-ELSE((ホスト・プレイヤー).toggle_guide, ホスト・プレイヤー, NULL), NULL, NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング(" \\n{0} + {1} | 下一关", 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(メイン攻撃))), カスタムストリング(" \\n{0} + {1} | Next Checkpoint", 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(メイン攻撃)))), 右, -150, NULL, NULL, IF-THEN-ELSE((ホスト・プレイヤー).toggle_guide, 色(緑), 色(オレンジ)), 表示される相手、文字列、色, デフォルト表示);
            HUDテキストを作成(IF-THEN-ELSE((ホスト・プレイヤー).toggle_guide, ホスト・プレイヤー, NULL), NULL, NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("{0} + {1} | 上一关\\n{2} (长按) | 飞行\\n", 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(サブ攻撃)), 入力割り当ての文字列(ボタン(アビリティ1))), カスタムストリング("{0} + {1} | Prev Checkpoint\\n{2} (hold)| Fly\\n", 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(サブ攻撃)), 入力割り当ての文字列(ボタン(アビリティ1)))), 右, -149, NULL, NULL, IF-THEN-ELSE((ホスト・プレイヤー).toggle_guide, 色(緑), 色(オレンジ)), 表示される相手、文字列、色, デフォルト表示);
            HUDテキストを作成(IF-THEN-ELSE((ホスト・プレイヤー).toggle_guide, ホスト・プレイヤー, NULL), NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("保存地图长按 {0} + {1} + {2}", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(近接)), カスタムストリング("{0} 后按弹出窗口的提示进行操作                                                                                                ", 入力割り当ての文字列(ボタン(リロード)))), カスタムストリング("To Save Map, Hold {0} + {1} + {2}", 入力割り当ての文字列(ボタン(インタラクト)), 入力割り当ての文字列(ボタン(近接)), カスタムストリング("{0} Then Follow Instructions                                                                                                ", 入力割り当ての文字列(ボタン(リロード))))), NULL, 左, -197, NULL, 色(黄色), NULL, 表示される相手、文字列, デフォルト表示);
            HUDテキストを作成(IF-THEN-ELSE((ローカルプレイヤー).editor_saveCache, NULL, ローカルプレイヤー), IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), IF-THEN-ELSE(ボタンが長押しされている(ホスト・プレイヤー, ボタン(近接)), カスタムストリング("{0} 检查点模式\\n{1} 击杀球模式\\n{2}", IF-THEN-ELSE((ホスト・プレイヤー).editor_modeSelect, カスタムストリング("     "), アイコンストリング(矢印:右)), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 1), アイコンストリング(矢印:右), カスタムストリング("     ")), カスタムストリング("{0} 弹球模式\\n{1} 封禁(单关)\\n{2} 自定义传送门 ", IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), アイコンストリング(矢印:右), カスタムストリング("     ")), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 3), アイコンストリング(矢印:右), カスタムストリング("     ")), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 4), アイコンストリング(矢印:右), カスタムストリング("     ")))), IF-THEN-ELSE(COMPARE(ローカルプレイヤー, ==, ホスト・プレイヤー), カスタムストリング(" {0} {1} ", 配列内の値(配列(アイコンストリング(通報), アイコンストリング(スカル), アイコンストリング(月), アイコンストリング(停止), アイコンストリング(螺旋を描く)), (ホスト・プレイヤー).editor_modeSelect), 配列内の値(文字列の分割(カスタムストリング("检查点模式0击杀球模式0弹球模式0封禁(单关)0自定义传送门"), 最初の値(NULL)), (ホスト・プレイヤー).editor_modeSelect)), カスタムストリング(" {0} 源氏 编辑者 {0} ", アイコンストリング(雷光の弓)))), IF-THEN-ELSE(ボタンが長押しされている(ホスト・プレイヤー, ボタン(近接)), カスタムストリング("{0} Checkpoints\\n{1} Boundary Spheres\\n{2}", IF-THEN-ELSE((ホスト・プレイヤー).editor_modeSelect, カスタムストリング("     "), アイコンストリング(矢印:右)), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 1), アイコンストリング(矢印:右), カスタムストリング("     ")), カスタムストリング("{0} Function Orbs\\n{1} Skill Bans\\n{2} Portals", IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), アイコンストリング(矢印:右), カスタムストリング("     ")), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 3), アイコンストリング(矢印:右), カスタムストリング("     ")), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 4), アイコンストリング(矢印:右), カスタムストリング("     ")))), IF-THEN-ELSE(COMPARE(ローカルプレイヤー, ==, ホスト・プレイヤー), カスタムストリング(" {0} {1} ", 配列内の値(配列(アイコンストリング(通報), アイコンストリング(スカル), アイコンストリング(月), アイコンストリング(停止), アイコンストリング(螺旋を描く)), (ホスト・プレイヤー).editor_modeSelect), 配列内の値(文字列の分割(カスタムストリング("Checkpoints0Boundary Spheres0Function Orbs0Skill Bans0Portals"), 最初の値(NULL)), (ホスト・プレイヤー).editor_modeSelect)), カスタムストリング(" {0} Genji Editor {0} ", アイコンストリング(雷光の弓))))), NULL, NULL, トップ, -174, 色(青), NULL, NULL, 表示される相手、文字列, デフォルト表示);
            HUDテキストを作成(最初の値(True), NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), IF-THEN-ELSE(COMPARE(ローカルプレイヤー, ==, ホスト・プレイヤー), カスタムストリング("{0} + 射击 | 切换作图模式", 入力割り当ての文字列(ボタン(近接))), カスタムストリング("房主/编辑者 {0}", ホスト・プレイヤー)), IF-THEN-ELSE(COMPARE(ローカルプレイヤー, ==, ホスト・プレイヤー), カスタムストリング("{0} + Shoot | Change Mode", 入力割り当ての文字列(ボタン(近接))), カスタムストリング("Current Host/Editor: {0}", ホスト・プレイヤー))), NULL, トップ, -175, NULL, IF-THEN-ELSE((ローカルプレイヤー).editor_lock, 色(グレー), 色(白)), NULL, 表示される相手、文字列、色, デフォルト表示);
            HUDテキストを作成(IF-THEN-ELSE(AND((ホスト・プレイヤー).toggle_guide, OR(NOT((ホスト・プレイヤー).editor_modeSelect), AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), カウント: ((ホスト・プレイヤー).editor_bounceIndex)))), ホスト・プレイヤー, NULL), NULL, NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("{0} + {1} | {2}", 入力割り当ての文字列(ボタン(アルティメット)), 入力割り当ての文字列(ボタン(メイン攻撃)), カスタムストリング("{0} {1} | {2}                                                                                                ", IF-THEN-ELSE((ホスト・プレイヤー).editor_modeSelect, カスタムストリング("弹球给刀"), カスタムストリング("检查点给刀")), アビリティアイコンストリング(ヒーロー(ゲンジ), ボタン(アルティメット)), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), 配列内の値(グローバル.TQ5, グローバル.EditSelected), 含む配列(グローバル.Dao, (ホスト・プレイヤー).checkpoint_current)))), カスタムストリング("{0} + {1} | {2}", 入力割り当ての文字列(ボタン(アルティメット)), 入力割り当ての文字列(ボタン(メイン攻撃)), カスタムストリング("{0} Give Ult {1} | {2}                                                                                                ", IF-THEN-ELSE((ホスト・プレイヤー).editor_modeSelect, カスタムストリング("Orb"), カスタムストリング("Level")), アビリティアイコンストリング(ヒーロー(ゲンジ), ボタン(アルティメット)), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), 配列内の値(グローバル.TQ5, グローバル.EditSelected), 含む配列(グローバル.Dao, (ホスト・プレイヤー).checkpoint_current))))), 左, -189, NULL, NULL, IF-THEN-ELSE(AND(配列内の値(グローバル.TQ5, グローバル.EditSelected), COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2)), 色(緑), IF-THEN-ELSE(AND(含む配列(グローバル.Dao, (ホスト・プレイヤー).checkpoint_current), NOT((ホスト・プレイヤー).editor_modeSelect)), 色(緑), 色(オレンジ))), 表示される相手、文字列、色, デフォルト表示);
            HUDテキストを作成(IF-THEN-ELSE(AND((ホスト・プレイヤー).toggle_guide, OR(NOT((ホスト・プレイヤー).editor_modeSelect), AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), カウント: ((ホスト・プレイヤー).editor_bounceIndex)))), ホスト・プレイヤー, NULL), NULL, NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("{0} + {1} | {2}", 入力割り当ての文字列(ボタン(アルティメット)), 入力割り当ての文字列(ボタン(サブ攻撃)), カスタムストリング("{0} {1} | {2}                                                                                                ", IF-THEN-ELSE((ホスト・プレイヤー).editor_modeSelect, カスタムストリング("弹球给Shift"), カスタムストリング("检查点给Shift")), アビリティアイコンストリング(ヒーロー(ゲンジ), ボタン(アビリティ1)), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), 配列内の値(グローバル.TQ6, グローバル.EditSelected), 含む配列(グローバル.SHIFT, (ホスト・プレイヤー).checkpoint_current)))), カスタムストリング("{0} + {1} | {2}", 入力割り当ての文字列(ボタン(アルティメット)), 入力割り当ての文字列(ボタン(サブ攻撃)), カスタムストリング("{0} Give Dash {1} | {2}                                                                                                ", IF-THEN-ELSE((ホスト・プレイヤー).editor_modeSelect, カスタムストリング("Orb"), カスタムストリング("Level")), アビリティアイコンストリング(ヒーロー(ゲンジ), ボタン(アビリティ1)), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), 配列内の値(グローバル.TQ6, グローバル.EditSelected), 含む配列(グローバル.SHIFT, (ホスト・プレイヤー).checkpoint_current))))), 左, -188, NULL, NULL, IF-THEN-ELSE(AND(配列内の値(グローバル.TQ6, グローバル.EditSelected), COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2)), 色(緑), IF-THEN-ELSE(AND(含む配列(グローバル.SHIFT, (ホスト・プレイヤー).checkpoint_current), NOT((ホスト・プレイヤー).editor_modeSelect)), 色(緑), 色(オレンジ))), 表示される相手、文字列、色, デフォルト表示);
            HUDテキストを作成(IF-THEN-ELSE(AND(AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), (ホスト・プレイヤー).toggle_guide), カウント: ((ホスト・プレイヤー).editor_bounceIndex)), ホスト・プレイヤー, NULL), NULL, NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("{0} + {1} |  收集球(进点前必须集齐) {2}", 入力割り当ての文字列(ボタン(アルティメット)), 入力割り当ての文字列(ボタン(アビリティ2)), カスタムストリング("{0} | {1}\\n                                                                                                ", アイコンストリング(アスタリスク), 配列内の値(グローバル.BounceToggleLock, グローバル.EditSelected))), カスタムストリング("{0} + {1} | Unlocks Checkpoint {2}", 入力割り当ての文字列(ボタン(アルティメット)), 入力割り当ての文字列(ボタン(アビリティ2)), カスタムストリング("{0} | {1}\\n                                                                                                ", アイコンストリング(アスタリスク), 配列内の値(グローバル.BounceToggleLock, グローバル.EditSelected)))), 左, -187, NULL, NULL, IF-THEN-ELSE(配列内の値(グローバル.BounceToggleLock, グローバル.EditSelected), 色(緑), 色(オレンジ)), 表示される相手、文字列、色, デフォルト表示);
            HUDテキストを作成(IF-THEN-ELSE((ホスト・プレイヤー).toggle_guide, ホスト・プレイヤー, NULL), IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("球体/传送门上限: {0}/193 ", 追加(追加(カウント: (グローバル.TQ), カウント: (グローバル.H)), カウント: (グローバル.CustomPortalStart))), カスタムストリング("Orb/Portal Limit: {0}/193 ", 追加(追加(カウント: (グローバル.TQ), カウント: (グローバル.H)), カウント: (グローバル.CustomPortalStart)))), NULL, カスタムストリング("                                                                                                                                "), 左, -191, 色(青), NULL, NULL, 表示される相手、文字列, デフォルト表示);
            "display selected cc/orb info"
            HUDテキストを作成(IF-THEN-ELSE((ホスト・プレイヤー).toggle_guide, ホスト・プレイヤー, NULL), IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), IF-THEN-ELSE(AND(NOT((ホスト・プレイヤー).editor_modeSelect), カウント: (グローバル.A)), カスタムストリング("\\n 选中的检查点 \\n 矢量: {0}{1} \\n", 配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current), IF-THEN-ELSE(COMPARE(カウント: (配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current)), <, 2), 空の配列, カスタムストリング("\\n 传送点: {0}", 配列内の値(配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current), True)))), IF-THEN-ELSE(AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 1), カウント: ((ホスト・プレイヤー).editor_killIndex)), カスタムストリング("\\n 选中的击杀球\\n 矢量: {0}\\n 半径: {1}\\n  + 進不去\\n  - 出不來\\n", 配列内の値(グローバル.H, グローバル.EditSelected), 配列内の値(グローバル.I, グローバル.EditSelected)), IF-THEN-ELSE(AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), カウント: ((ホスト・プレイヤー).editor_bounceIndex)), カスタムストリング("\\n 选中的弹球\\n 矢量: {0}\\n 弹力: {1}\\n 序号: {2}\\n", 配列内の値(グローバル.TQ, グローバル.EditSelected), 配列内の値(グローバル.EditMode, グローバル.EditSelected), グローバル.EditSelected), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 3), カスタムストリング("\\n 封禁(单关)\\n――――――――――――\\n {0} 蹭留 ∞\\n {1} 卡小 ♂\\n {2}", IF-THEN-ELSE(含む配列(グローバル.BanMulti, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), IF-THEN-ELSE(含む配列(グローバル.BanCreate, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), カスタムストリング("{0} 站卡 ♠\\n {1} 爬墙 ↑\\n {2}", IF-THEN-ELSE(含む配列(グローバル.BanStand, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), IF-THEN-ELSE(含む配列(グローバル.BanClimb, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), カスタムストリング("{0} 死小 X\\n {1} 表情留小 ♥\\n {2}", IF-THEN-ELSE(含む配列(グローバル.BanDead, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), IF-THEN-ELSE(含む配列(グローバル.BanEmote, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), カスタムストリング("{0} 延二段跳 △\\n――――――――――――\\n {1} 留小跳进点 ≥\\n", IF-THEN-ELSE(含む配列(グローバル.BanSaveDouble, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), IF-THEN-ELSE(含む配列(グローバル.BanBhop, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列))))), IF-THEN-ELSE(AND(AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 4), 含む配列(配列((ホスト・プレイヤー).checkpoint_current, -1), 配列内の値(グローバル.CustomPortalCP, グローバル.EditSelected))), カウント: (グローバル.CustomPortalCP)), カスタムストリング("\\n 入口矢量: {0}\\n 出口矢量: {1}\\n 应用关卡: {2}\\n", 配列内の値(グローバル.CustomPortalStart, グローバル.EditSelected), 配列内の値(グローバル.CustomPortalEndpoint, グローバル.EditSelected), IF-THEN-ELSE(COMPARE(配列内の値(グローバル.CustomPortalCP, グローバル.EditSelected), <, NULL), カスタムストリング("所有"), (ホスト・プレイヤー).checkpoint_current)), カスタムストリング("\\n   当前无数据选中   \\n")))))), IF-THEN-ELSE(AND(NOT((ホスト・プレイヤー).editor_modeSelect), カウント: (グローバル.A)), カスタムストリング("\\n Selected Checkpoint\\n Vector: {0}{1} \\n", 配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current), IF-THEN-ELSE(COMPARE(カウント: (配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current)), <, 2), 空の配列, カスタムストリング("\\n Teleport: {0}", 配列内の値(配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current), True)))), IF-THEN-ELSE(AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 1), カウント: ((ホスト・プレイヤー).editor_killIndex)), カスタムストリング("\\n Selected Boundary Sphere\\n Vector: {0}\\n Radius: {1}\\n  + Keep Out\\n  - Stay In\\n", 配列内の値(グローバル.H, グローバル.EditSelected), 配列内の値(グローバル.I, グローバル.EditSelected)), IF-THEN-ELSE(AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), カウント: ((ホスト・プレイヤー).editor_bounceIndex)), カスタムストリング("\\n Selected Bounce Orb\\n Vector: {0}\\n Strength: {1} \\n ID: {2}\\n", 配列内の値(グローバル.TQ, グローバル.EditSelected), 配列内の値(グローバル.EditMode, グローバル.EditSelected), グローバル.EditSelected), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 3), カスタムストリング("\\n Skill Bans\\n――――――――――――\\n {0} Multi-Climb ∞\\n {1} Create ♂\\n {2}", IF-THEN-ELSE(含む配列(グローバル.BanMulti, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), IF-THEN-ELSE(含む配列(グローバル.BanCreate, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), カスタムストリング("{0} Stand ♠\\n {1} Climb ↑\\n {2}", IF-THEN-ELSE(含む配列(グローバル.BanStand, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), IF-THEN-ELSE(含む配列(グローバル.BanClimb, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), カスタムストリング("{0} Dead X\\n {1} Emote ♥\\n {2}", IF-THEN-ELSE(含む配列(グローバル.BanDead, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), IF-THEN-ELSE(含む配列(グローバル.BanEmote, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), カスタムストリング("{0} Save Double △\\n――――――――――――\\n {1} Require Bhop ≥\\n", IF-THEN-ELSE(含む配列(グローバル.BanSaveDouble, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列), IF-THEN-ELSE(含む配列(グローバル.BanBhop, (ホスト・プレイヤー).checkpoint_current), カスタムストリング("√"), 空の配列))))), IF-THEN-ELSE(AND(AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 4), 含む配列(配列((ホスト・プレイヤー).checkpoint_current, -1), 配列内の値(グローバル.CustomPortalCP, グローバル.EditSelected))), カウント: (グローバル.CustomPortalCP)), カスタムストリング("\\n Start: {0} \\n End: {1} \\n CP: {2} \\n", 配列内の値(グローバル.CustomPortalStart, グローバル.EditSelected), 配列内の値(グローバル.CustomPortalEndpoint, グローバル.EditSelected), IF-THEN-ELSE(COMPARE(配列内の値(グローバル.CustomPortalCP, グローバル.EditSelected), <, NULL), カスタムストリング("All"), (ホスト・プレイヤー).checkpoint_current)), カスタムストリング("\\n   No Data Selected   \\n"))))))), NULL, カスタムストリング("                                                                                                                                "), 左, -190, 色(白), NULL, 色(オレンジ), 表示される相手、文字列, デフォルト表示);
            "effects =========================================================================================================================================================================="
            ワールド内テキストを作成(IF-THEN-ELSE(カウント: (グローバル.EditSelectIdArray), True, NULL), IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("选中的实体"), カスタムストリング("Selected")), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 1), 配列内の値(グローバル.H, グローバル.EditSelected), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), 配列内の値(グローバル.TQ, グローバル.EditSelected), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 4), 配列内の値(グローバル.CustomPortalStart, グローバル.EditSelected), NULL))), 1.2, クリップしない, 表示される相手、位置, 色(オレンジ), デフォルト表示);
            アイコンを作成(IF-THEN-ELSE(カウント: (グローバル.EditSelectIdArray), True, NULL), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 1), 配列内の値(グローバル.H, グローバル.EditSelected), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), 配列内の値(グローバル.TQ, グローバル.EditSelected), IF-THEN-ELSE(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 4), 配列内の値(グローバル.CustomPortalStart, グローバル.EditSelected), NULL))), 矢印:下, 表示される相手、位置, 色(白), True);
            "Purple sphere for teleport location"
            エフェクトを作成(IF-THEN-ELSE(AND(COMPARE(カウント: (配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current)), >, 1), NOT((ホスト・プレイヤー).editor_modeSelect)), ホスト・プレイヤー, NULL), 球体, 色(紫), 減算(配列内の値(配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current), True), 乗算(0.1, 上)), 0.2, 表示される相手、位置、範囲);
            "Teleport text"
            ワールド内テキストを作成(IF-THEN-ELSE(AND(COMPARE(カウント: (配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current)), >, 1), NOT((ホスト・プレイヤー).editor_modeSelect)), ホスト・プレイヤー, NULL), IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("传送点位置"), カスタムストリング("teleporter location")), 配列内の値(配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current), True), 1.6, クリップしない, 表示される相手、位置、文字列, 色(スカイブルー), デフォルト表示);
            "normal cp if teleport"
            エフェクトを作成(IF-THEN-ELSE(AND(配列内の値(配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current), True), NOT((ホスト・プレイヤー).editor_modeSelect)), ホスト・プレイヤー, NULL), リング, 色(オレンジ), 最初の値(配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current)), True, 表示される相手、位置、範囲);
            ワールド内テキストを作成(IF-THEN-ELSE(AND(配列内の値(配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current), True), NOT((ホスト・プレイヤー).editor_modeSelect)), ホスト・プレイヤー, NULL), IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("检查点位置"), カスタムストリング("level location")), 最初の値(配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current)), 1.6, クリップしない, 表示される相手、位置、文字列, 色(スカイブルー), デフォルト表示);
            "portal fx"
            エフェクトを作成(IF-THEN-ELSE(AND(カウント: (グローバル.EditSelectIdArray), COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 4)), ホスト・プレイヤー, NULL), スパークル, 色(紫), 配列内の値(グローバル.CustomPortalEndpoint, グローバル.EditSelected), 0.2, 表示される相手、位置、範囲);
    }
}

ルール ("Editor | Toggle Fly & Noclip") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        グローバル.EditorOn != False;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ1)) == True;
        (イベント・プレイヤー).editor_fly == NULL;
        AND(グローバル.EditorMoveItem, COMPARE(イベント・プレイヤー, ==, ホスト・プレイヤー)) == False;
    }
    アクション {
        条件待機(OR(ボタンが長押しされている(イベント・プレイヤー, ボタン(リロード)), NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ1)))), 0.7);
        IF(OR(ボタンが長押しされている(イベント・プレイヤー, ボタン(リロード)), NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ1)))));
            待機(False, 条件無視);
            中止;
        END;
        プレイヤー変数を設定(イベント・プレイヤー, editor_fly, 追加(位置: (イベント・プレイヤー), 上));
        プレイヤーの位置強制を開始(イベント・プレイヤー, (イベント・プレイヤー).editor_fly, True);
        移動時の環境との衝突判定を無効化(イベント・プレイヤー, True);
        ボタンを無効化(イベント・プレイヤー, ボタン(アルティメット));
        条件待機(NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ1))), True);
        WHILE(AND(AND(生存している(イベント・プレイヤー), (イベント・プレイヤー).editor_fly), NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ1)))));
            IF(OR(COMPARE(イベント・プレイヤー, !=, ホスト・プレイヤー), NOT((イベント・プレイヤー).editor_lock)));
                (イベント・プレイヤー).editor_fly += 乗算(減算(追加(0.096, 乗算(0.192, ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)))), 乗算(0.048, ボタンが長押しされている(イベント・プレイヤー, ボタン(しゃがみ)))), 追加(追加(乗算(乗算(プレイヤーが向いている方向: (イベント・プレイヤー), Z成分: (スロットル: (イベント・プレイヤー))), ベクトル(True, NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ1))), True)), ワールド座標のベクトル: (乗算(スロットル: (イベント・プレイヤー), 左), イベント・プレイヤー, 回転)), 乗算(上, 減算(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ2)), ボタンが長押しされている(イベント・プレイヤー, ボタン(アルティメット))))));
            ELSE IF(NOT((ホスト・プレイヤー).editor_modeSelect));
                (イベント・プレイヤー).editor_fly += 乗算(追加(0.00288, 乗算(0.09312, ボタンが長押しされている(イベント・プレイヤー, ボタン(メイン攻撃)))), 追加(追加(乗算(プレイヤーが向いている方向: (イベント・プレイヤー), Z成分: (スロットル: (イベント・プレイヤー))), ワールド座標のベクトル: (乗算(スロットル: (イベント・プレイヤー), 左), イベント・プレイヤー, 回転)), 乗算(上, 減算(ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)), ボタンが長押しされている(イベント・プレイヤー, ボタン(しゃがみ))))));
            END;
            待機(False, 条件無視);
        END;
        ボタンを有効化(イベント・プレイヤー, ボタン(アルティメット));
        移動時の環境との衝突判定を有効化(イベント・プレイヤー);
        プレイヤー変数を設定(イベント・プレイヤー, editor_fly, NULL);
        プレイヤーの位置強制を停止(イベント・プレイヤー);
        待機(True, 条件無視);
    }
}

ルール ("Editor | Change Mode") {
    イベント {
        進行中 - グローバル;
    }
    条件 {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        グローバル.EditorOn != False;
        (ホスト・プレイヤー).editor_lock == False;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(近接)) == True;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)) != ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃));
    }
    アクション {
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, True);
        IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)));
            (ホスト・プレイヤー).editor_modeSelect += 4;
        ELSE;
            (ホスト・プレイヤー).editor_modeSelect += True;
        END;
        プレイヤー変数を変更(ホスト・プレイヤー, editor_modeSelect, 剰余, 5);
        サブルーチンの呼び出し(EditUpdateSelectedIds);
        サブルーチンの呼び出し(EditorSelectLast);
        待機(False, 条件無視);
        条件待機(COMPARE(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)), ==, ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃))), 0.1);
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, False);
    }
}

ルール ("Editor | Update Selected Id") {
    イベント {
        サブルーチン;
        EditUpdateSelectedIds;
    }
    アクション {
        IF(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 1));
            グローバル変数を設定(EditSelectIdArray, マッピングされた配列(グローバル.killballnumber, 現在の配列のインデックス));
            グローバル変数を設定(EditSelectIdArray, フィルタリングされた配列(グローバル.EditSelectIdArray, COMPARE(配列内の値(グローバル.killballnumber, 現在の配列の要素), ==, (ホスト・プレイヤー).checkpoint_current)));
        ELSE IF(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2));
            グローバル変数を設定(EditSelectIdArray, マッピングされた配列(グローバル.pinballnumber, 現在の配列のインデックス));
            グローバル変数を設定(EditSelectIdArray, フィルタリングされた配列(グローバル.EditSelectIdArray, COMPARE(配列内の値(グローバル.pinballnumber, 現在の配列の要素), ==, (ホスト・プレイヤー).checkpoint_current)));
        ELSE IF(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 4));
            グローバル変数を設定(EditSelectIdArray, マッピングされた配列(グローバル.CustomPortalCP, 現在の配列のインデックス));
            グローバル変数を設定(EditSelectIdArray, フィルタリングされた配列(グローバル.EditSelectIdArray, OR(COMPARE(配列内の値(グローバル.CustomPortalCP, 現在の配列の要素), <, NULL), COMPARE(配列内の値(グローバル.CustomPortalCP, 現在の配列の要素), ==, (ホスト・プレイヤー).checkpoint_current))));
        ELSE;
            グローバル変数を設定(EditSelectIdArray, 空の配列);
        END;
    }
}

ルール ("Editor | Select Last") {
    イベント {
        サブルーチン;
        EditorSelectLast;
    }
    アクション {
        グローバル変数を設定(EditSelected, 最後の値(グローバル.EditSelectIdArray));
    }
}

ルール ("Editor | Create Cp/Orb") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        "Required for UpdateCache()"
        イベント・プレイヤー == ホスト・プレイヤー;
        グローバル.EditorOn != False;
        (ホスト・プレイヤー).editor_lock == False;
        含む配列(配列(NULL, 1, 2, 4), (ホスト・プレイヤー).editor_modeSelect) == True;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)) == True;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)) == True;
    }
    アクション {
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, True);
        IF(NOT((ホスト・プレイヤー).editor_modeSelect));
            IF(AND(カウント: (グローバル.A), COMPARE(二点間の距離(ホスト・プレイヤー, 配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current)), <=, 1.4)));
                小さなメッセージ(ホスト・プレイヤー, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("   放置的检查点距离太近"), カスタムストリング("   Cannot Place Checkpoint Too Close.")));
            ELSE;
                "$$"
                IF(COMPARE((ホスト・プレイヤー).checkpoint_current, >=, 減算(カウント: (グローバル.A), True)));
                    プレイヤー変数を設定(ホスト・プレイヤー, checkpoint_current, 減算(カウント: (グローバル.A), True));
                END;
                IF(COMPARE((ホスト・プレイヤー).checkpoint_current, ==, 減算(カウント: (グローバル.A), True)));
                    グローバル変数を変更(A, 配列に追加, 位置: (ホスト・プレイヤー));
                    (ホスト・プレイヤー).checkpoint_current += True;
                ELSE;
                    グローバル変数を変更(A, 配列に追加, 位置: (ホスト・プレイヤー));
                    グローバル変数を設定(A, マッピングされた配列(グローバル.A, IF-THEN-ELSE(COMPARE(現在の配列のインデックス, <, 追加((ホスト・プレイヤー).checkpoint_current, True)), 現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列のインデックス, ==, 追加((ホスト・プレイヤー).checkpoint_current, True)), 最後の値(グローバル.A), 配列内の値(グローバル.A, 減算(現在の配列のインデックス, True))))));
                    (ホスト・プレイヤー).checkpoint_current += True;
                    グローバル変数を設定(killballnumber, マッピングされた配列(グローバル.killballnumber, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                    グローバル変数を設定(pinballnumber, マッピングされた配列(グローバル.pinballnumber, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                    グローバル変数を設定(CustomPortalCP, マッピングされた配列(グローバル.CustomPortalCP, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                    グローバル変数を設定(Dao, マッピングされた配列(グローバル.Dao, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                    グローバル変数を設定(SHIFT, マッピングされた配列(グローバル.SHIFT, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                    グローバル変数を設定(BanMulti, マッピングされた配列(グローバル.BanMulti, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                    グローバル変数を設定(BanCreate, マッピングされた配列(グローバル.BanCreate, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                    グローバル変数を設定(BanStand, マッピングされた配列(グローバル.BanStand, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                    グローバル変数を設定(BanDead, マッピングされた配列(グローバル.BanDead, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                    グローバル変数を設定(BanEmote, マッピングされた配列(グローバル.BanEmote, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                    グローバル変数を設定(BanClimb, マッピングされた配列(グローバル.BanClimb, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                    グローバル変数を設定(BanSaveDouble, マッピングされた配列(グローバル.BanSaveDouble, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                    グローバル変数を設定(BanBhop, マッピングされた配列(グローバル.BanBhop, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                    グローバル変数を設定(BanDjump, マッピングされた配列(グローバル.BanDjump, 追加(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
                END;
                サブルーチンの呼び出し(UpdateCache);
                小さなメッセージ(ホスト・プレイヤー, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("   新检查点已创建"), カスタムストリング("   New Checkpoint Created")));
            END;
        ELSE IF(NOT(カウント: (グローバル.A)));
            小さなメッセージ(ホスト・プレイヤー, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("   请先放置检查点"), カスタムストリング("   Make A Checkpoint First")));
        ELSE IF(COMPARE(追加(追加(カウント: (グローバル.TQ), カウント: (グローバル.H)), カウント: (グローバル.CustomPortalStart)), >=, 193));
            大きなメッセージ(ホスト・プレイヤー, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("当前地图弹球/传送门数量已达上限"), カスタムストリング("Orb/Portal Limit Reached For This Map")));
        ELSE IF(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 1));
            グローバル変数を変更(H, 配列に追加, 位置: (ホスト・プレイヤー));
            グローバル変数を変更(killballnumber, 配列に追加, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を変更(I, 配列に追加, 5);
            "to create the fx properly"
            サブルーチンの呼び出し(EditUpdateSelectedIds);
            サブルーチンの呼び出し(EditorSelectLast);
            エフェクトを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), COMPARE((現在の配列の要素).checkpoint_current, ==, 配列内の値(グローバル.killballnumber, 一度だけ評価(グローバル.EditSelected)))), 球体, 配列内の値(グローバル.ColorConfig, 14), 配列内の値(グローバル.H, 一度だけ評価(グローバル.EditSelected)), 絶対値(配列内の値(グローバル.I, 一度だけ評価(グローバル.EditSelected))), 表示される相手、位置、範囲);
            グローバル変数を変更(K, 配列に追加, 最新のエンティティ);
            大きなメッセージ(最初の値(True), カスタムストリング("{0} {1}", IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("新击杀球已创建! \\n仅生效于检查点"), カスタムストリング("New boundary Sphere Created! \\nOnly Valid For This Checkpoint")), (ホスト・プレイヤー).checkpoint_current));
            条件待機(NOT(AND(ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)))), True);
            "EditUpdateSelectedIds() # to arrow during the placement properly"
            WHILE(AND(ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃))));
                インデックスのグローバル変数を設定(H, グローバル.EditSelected, レイ・キャストのヒット位置(目の位置(ホスト・プレイヤー), 追加(目の位置(ホスト・プレイヤー), 乗算(プレイヤーが向いている方向: (ホスト・プレイヤー), 8)), NULL, NULL, False));
                待機(False, 条件無視);
            END;
            "UpdateCache()"
            グローバル変数を設定(EditorMoveItem, True);
        ELSE IF(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2));
            グローバル変数を変更(TQ, 配列に追加, 位置: (ホスト・プレイヤー));
            グローバル変数を変更(pinballnumber, 配列に追加, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を変更(EditMode, 配列に追加, 10);
            グローバル変数を変更(TQ5, 配列に追加, False);
            グローバル変数を変更(TQ6, 配列に追加, False);
            グローバル変数を変更(BounceToggleLock, 配列に追加, False);
            サブルーチンの呼び出し(EditUpdateSelectedIds);
            サブルーチンの呼び出し(EditorSelectLast);
            エフェクトを作成(フィルタリングされた配列(配列に追加(すべてのプレイヤー(すべてのチーム), NULL), AND(COMPARE((現在の配列の要素).checkpoint_current, ==, 配列内の値(グローバル.pinballnumber, 一度だけ評価(グローバル.EditSelected))), NOT(含む配列((現在の配列の要素).cache_collectedLocks, 一度だけ評価(グローバル.EditSelected))))), オーブ, IF-THEN-ELSE(配列内の値(グローバル.BounceToggleLock, 一度だけ評価(グローバル.EditSelected)), 配列内の値(グローバル.ColorConfig, 16), 配列内の値(グローバル.ColorConfig, 15)), 配列内の値(グローバル.TQ, 一度だけ評価(グローバル.EditSelected)), True, 表示される相手、位置、半径、色);
            グローバル変数を変更(TQ2, 配列に追加, 最新のエンティティ);
            大きなメッセージ(最初の値(True), カスタムストリング("{0} {1}", IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("新弹球已创建! \\n仅生效于检查点"), カスタムストリング("New Bounce Orb Created! \\nOnly Valid For This Checkpoint")), (ホスト・プレイヤー).checkpoint_current));
            条件待機(NOT(AND(ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)))), True);
            WHILE(AND(ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃))));
                インデックスのグローバル変数を設定(TQ, グローバル.EditSelected, レイ・キャストのヒット位置(目の位置(ホスト・プレイヤー), 追加(目の位置(ホスト・プレイヤー), 乗算(プレイヤーが向いている方向: (ホスト・プレイヤー), 7)), NULL, NULL, False));
                待機(False, 条件無視);
            END;
            "UpdateCache()"
            グローバル変数を設定(EditorMoveItem, True);
        ELSE IF(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 4));
            グローバル変数を変更(CustomPortalStart, 配列に追加, 位置: (ホスト・プレイヤー));
            グローバル変数を変更(CustomPortalEndpoint, 配列に追加, 追加(位置: (ホスト・プレイヤー), 乗算(10, 上)));
            グローバル変数を変更(CustomPortalCP, 配列に追加, (ホスト・プレイヤー).checkpoint_current);
            サブルーチンの呼び出し(EditUpdateSelectedIds);
            サブルーチンの呼び出し(EditorSelectLast);
            エフェクトを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), OR(COMPARE(配列内の値(グローバル.CustomPortalCP, 一度だけ評価(グローバル.EditSelected)), ==, (現在の配列の要素).checkpoint_current), COMPARE(配列内の値(グローバル.CustomPortalCP, 一度だけ評価(グローバル.EditSelected)), <, NULL))), いいオーラ, 配列内の値(グローバル.ColorConfig, 17), 配列内の値(グローバル.CustomPortalStart, 一度だけ評価(グローバル.EditSelected)), 0.6, 表示される相手、位置、半径、色);
            グローバル変数を変更(PortalEffects, 配列に追加, 最新のエンティティ);
            グローバル変数を設定(EditSelected, 減算(カウント: (グローバル.CustomPortalStart), True));
            条件待機(NOT(AND(ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)))), True);
            "EditUpdateSelectedIds()"
            WHILE(AND(ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃))));
                インデックスのグローバル変数を設定(CustomPortalStart, グローバル.EditSelected, レイ・キャストのヒット位置(目の位置(ホスト・プレイヤー), 追加(目の位置(ホスト・プレイヤー), 乗算(プレイヤーが向いている方向: (ホスト・プレイヤー), 6)), NULL, NULL, False));
                待機(False, 条件無視);
            END;
            大きなメッセージ(最初の値(True), IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("新传送门已创建!\\n生效于当前检查点"), カスタムストリング("Portal Created \\nOnly Valid For This Checkpoint")));
            グローバル変数を設定(EditorMoveItem, True);
        END;
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, False);
        待機(0.64, 条件無視);
    }
}

ルール ("Editor | Delete Cp/Orb/Portal") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        "Required for UpdateCache()"
        イベント・プレイヤー == ホスト・プレイヤー;
        グローバル.EditorOn != False;
        (ホスト・プレイヤー).editor_lock == False;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)) == True;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃)) == True;
    }
    アクション {
        "@Condition EditorMoveItem == false\\n@Condition len(EditSelectIdArray) > 0"
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, True);
        IF(AND(NOT((ホスト・プレイヤー).editor_modeSelect), カウント: (グローバル.A)));
            "Resync Kill Orbs =================="
            プレイヤー変数を設定(ホスト・プレイヤー, editor_temp, フィルタリングされた配列(マッピングされた配列(グローバル.killballnumber, IF-THEN-ELSE(COMPARE(現在の配列の要素, ==, (ホスト・プレイヤー).checkpoint_current), 現在の配列のインデックス, -1)), COMPARE(現在の配列の要素, >=, NULL)));
            "hostPlayer.editor_temp = [i for e, i in KillballCheckpoints if e == hostPlayer.checkpoint_current]"
            グローバル変数用(NANBA, 0, カウント: ((ホスト・プレイヤー).editor_temp), True);
                エフェクトを破棄(配列内の値(グローバル.K, 配列内の値((ホスト・プレイヤー).editor_temp, グローバル.NANBA)));
                グローバル変数を変更(K, インデックスを配列から削除, 配列内の値((ホスト・プレイヤー).editor_temp, グローバル.NANBA));
                待機(False, 条件無視);
            END;
            グローバル変数を変更(killballnumber, 削除, (ホスト・プレイヤー).checkpoint_current);
            "Decrement checkpoints after removed one"
            グローバル変数を設定(killballnumber, マッピングされた配列(グローバル.killballnumber, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            "Remove Radii at Checkpoint indexes (temp)"
            グローバル変数を設定(I, フィルタリングされた配列(グローバル.I, NOT(含む配列((ホスト・プレイヤー).editor_temp, 現在の配列のインデックス))));
            グローバル変数を設定(H, フィルタリングされた配列(グローバル.H, NOT(含む配列((ホスト・プレイヤー).editor_temp, 現在の配列のインデックス))));
            "Resync Bounce Orbs =============="
            プレイヤー変数を設定(ホスト・プレイヤー, editor_temp, フィルタリングされた配列(マッピングされた配列(グローバル.pinballnumber, IF-THEN-ELSE(COMPARE(現在の配列の要素, ==, (ホスト・プレイヤー).checkpoint_current), 現在の配列のインデックス, -1)), COMPARE(現在の配列の要素, >=, NULL)));
            "hostPlayer.editor_temp = [i for e, i in BouncePadCheckpoints if e == hostPlayer.checkpoint_current]"
            グローバル変数用(NANBA, 0, カウント: ((ホスト・プレイヤー).editor_temp), True);
                エフェクトを破棄(配列内の値(グローバル.TQ2, 配列内の値((ホスト・プレイヤー).editor_temp, グローバル.NANBA)));
                グローバル変数を変更(TQ2, インデックスを配列から削除, 配列内の値((ホスト・プレイヤー).editor_temp, グローバル.NANBA));
                待機(False, 条件無視);
            END;
            グローバル変数を変更(pinballnumber, 削除, (ホスト・プレイヤー).checkpoint_current);
            "Decrement checkpoints after removed one"
            グローバル変数を設定(pinballnumber, マッピングされた配列(グローバル.pinballnumber, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            グローバル変数を設定(TQ, フィルタリングされた配列(グローバル.TQ, NOT(含む配列((ホスト・プレイヤー).editor_temp, 現在の配列のインデックス))));
            グローバル変数を設定(EditMode, フィルタリングされた配列(グローバル.EditMode, NOT(含む配列((ホスト・プレイヤー).editor_temp, 現在の配列のインデックス))));
            グローバル変数を設定(TQ5, フィルタリングされた配列(グローバル.TQ5, NOT(含む配列((ホスト・プレイヤー).editor_temp, 現在の配列のインデックス))));
            グローバル変数を設定(TQ6, フィルタリングされた配列(グローバル.TQ6, NOT(含む配列((ホスト・プレイヤー).editor_temp, 現在の配列のインデックス))));
            グローバル変数を設定(BounceToggleLock, フィルタリングされた配列(グローバル.BounceToggleLock, NOT(含む配列((ホスト・プレイヤー).editor_temp, 現在の配列のインデックス))));
            "Resync custom portals =================="
            プレイヤー変数を設定(ホスト・プレイヤー, editor_temp, フィルタリングされた配列(マッピングされた配列(グローバル.CustomPortalCP, IF-THEN-ELSE(COMPARE(現在の配列の要素, ==, (ホスト・プレイヤー).checkpoint_current), 現在の配列のインデックス, -1)), COMPARE(現在の配列の要素, >=, NULL)));
            グローバル変数用(NANBA, 0, カウント: ((ホスト・プレイヤー).editor_temp), True);
                エフェクトを破棄(配列内の値(グローバル.PortalEffects, 配列内の値((ホスト・プレイヤー).editor_temp, グローバル.NANBA)));
                グローバル変数を変更(PortalEffects, インデックスを配列から削除, 配列内の値((ホスト・プレイヤー).editor_temp, グローバル.NANBA));
                待機(False, 条件無視);
            END;
            グローバル変数を変更(CustomPortalCP, 削除, (ホスト・プレイヤー).checkpoint_current);
            "Decrement checkpoints after removed one"
            グローバル変数を設定(CustomPortalCP, マッピングされた配列(グローバル.CustomPortalCP, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            "Remove Radii at Checkpoint indexes (temp)"
            グローバル変数を設定(CustomPortalStart, フィルタリングされた配列(グローバル.CustomPortalStart, NOT(含む配列((ホスト・プレイヤー).editor_temp, 現在の配列のインデックス))));
            グローバル変数を設定(CustomPortalEndpoint, フィルタリングされた配列(グローバル.CustomPortalEndpoint, NOT(含む配列((ホスト・プレイヤー).editor_temp, 現在の配列のインデックス))));
            プレイヤー変数を設定(ホスト・プレイヤー, editor_temp, NULL);
            グローバル変数を変更(Dao, 削除, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を設定(Dao, マッピングされた配列(グローバル.Dao, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            グローバル変数を変更(SHIFT, 削除, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を設定(SHIFT, マッピングされた配列(グローバル.SHIFT, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            グローバル変数を変更(BanMulti, 削除, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を設定(BanMulti, マッピングされた配列(グローバル.BanMulti, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            グローバル変数を変更(BanCreate, 削除, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を設定(BanCreate, マッピングされた配列(グローバル.BanCreate, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            グローバル変数を変更(BanStand, 削除, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を設定(BanStand, マッピングされた配列(グローバル.BanStand, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            グローバル変数を変更(BanDead, 削除, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を設定(BanDead, マッピングされた配列(グローバル.BanDead, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            グローバル変数を変更(BanEmote, 削除, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を設定(BanEmote, マッピングされた配列(グローバル.BanEmote, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            グローバル変数を変更(BanClimb, 削除, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を設定(BanClimb, マッピングされた配列(グローバル.BanClimb, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            グローバル変数を変更(BanSaveDouble, 削除, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を設定(BanSaveDouble, マッピングされた配列(グローバル.BanSaveDouble, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            グローバル変数を変更(BanBhop, 削除, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を設定(BanBhop, マッピングされた配列(グローバル.BanBhop, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            グローバル変数を変更(BanDjump, 削除, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を設定(BanDjump, マッピングされた配列(グローバル.BanDjump, 減算(現在の配列の要素, IF-THEN-ELSE(COMPARE(現在の配列の要素, >=, (ホスト・プレイヤー).checkpoint_current), 1, NULL))));
            グローバル変数を変更(A, インデックスを配列から削除, (ホスト・プレイヤー).checkpoint_current);
            グローバル変数を変更(C, インデックスを配列から削除, (ホスト・プレイヤー).checkpoint_current);
            プレイヤー変数を設定(ホスト・プレイヤー, checkpoint_current, 最大(減算((ホスト・プレイヤー).checkpoint_current, True), False));
            サブルーチンの呼び出し(RebuildKillOrbs);
            サブルーチンの呼び出し(RebuildBounceOrbs);
            サブルーチンの呼び出し(RebuildPortals);
            小さなメッセージ(ホスト・プレイヤー, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("   检查点已删除"), カスタムストリング("   Checkpoint Has Been Deleted")));
        ELSE IF(AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 1), カウント: (グローバル.EditSelectIdArray)));
            グローバル変数を変更(H, インデックスを配列から削除, グローバル.EditSelected);
            グローバル変数を変更(I, インデックスを配列から削除, グローバル.EditSelected);
            グローバル変数を変更(killballnumber, インデックスを配列から削除, グローバル.EditSelected);
            エフェクトを破棄(配列内の値(グローバル.K, グローバル.EditSelected));
            グローバル変数を変更(K, インデックスを配列から削除, グローバル.EditSelected);
            サブルーチンの呼び出し(RebuildKillOrbs);
        ELSE IF(AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), カウント: (グローバル.EditSelectIdArray)));
            グローバル変数を変更(TQ, インデックスを配列から削除, グローバル.EditSelected);
            グローバル変数を変更(EditMode, インデックスを配列から削除, グローバル.EditSelected);
            グローバル変数を変更(TQ5, インデックスを配列から削除, グローバル.EditSelected);
            グローバル変数を変更(TQ6, インデックスを配列から削除, グローバル.EditSelected);
            グローバル変数を変更(BounceToggleLock, インデックスを配列から削除, グローバル.EditSelected);
            エフェクトを破棄(配列内の値(グローバル.TQ2, グローバル.EditSelected));
            グローバル変数を変更(TQ2, インデックスを配列から削除, グローバル.EditSelected);
            グローバル変数を変更(pinballnumber, インデックスを配列から削除, グローバル.EditSelected);
            サブルーチンの呼び出し(RebuildBounceOrbs);
        ELSE IF(AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 4), カウント: (グローバル.EditSelectIdArray)));
            エフェクトを破棄(配列内の値(グローバル.PortalEffects, グローバル.EditSelected));
            待機(False, 条件無視);
            グローバル変数を変更(CustomPortalStart, インデックスを配列から削除, グローバル.EditSelected);
            グローバル変数を変更(CustomPortalEndpoint, インデックスを配列から削除, グローバル.EditSelected);
            グローバル変数を変更(CustomPortalCP, インデックスを配列から削除, グローバル.EditSelected);
            グローバル変数を変更(PortalEffects, インデックスを配列から削除, グローバル.EditSelected);
            サブルーチンの呼び出し(RebuildPortals);
        ELSE;
            プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, False);
            待機(False, 条件無視);
            中止;
        END;
        サブルーチンの呼び出し(UpdateCache);
        サブルーチンの呼び出し(EditorSelectLast);
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, False);
        待機(追加(0.16, 乗算(エンティティ数, 0.007)), 条件無視);
    }
}

ルール ("Editor | Toggle Orb Functions") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        "Required for UpdateCache()"
        イベント・プレイヤー == ホスト・プレイヤー;
        グローバル.EditorOn != False;
        (ホスト・プレイヤー).editor_modeSelect == 2;
        (ホスト・プレイヤー).editor_lock == False;
        カウント: (グローバル.EditSelectIdArray) > NULL;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(アルティメット)) == True;
        OR(OR(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃))), ボタンが長押しされている(ホスト・プレイヤー, ボタン(アビリティ2))) == True;
    }
    アクション {
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, True);
        IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)));
            インデックスのグローバル変数を設定(TQ5, グローバル.EditSelected, NOT(配列内の値(グローバル.TQ5, グローバル.EditSelected)));
        ELSE IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃)));
            インデックスのグローバル変数を設定(TQ6, グローバル.EditSelected, NOT(配列内の値(グローバル.TQ6, グローバル.EditSelected)));
        ELSE;
            インデックスのグローバル変数を設定(BounceToggleLock, グローバル.EditSelected, NOT(配列内の値(グローバル.BounceToggleLock, グローバル.EditSelected)));
            インデックスのグローバル変数を設定(EditMode, グローバル.EditSelected, 乗算(10, NOT(配列内の値(グローバル.BounceToggleLock, グローバル.EditSelected))));
        END;
        サブルーチンの呼び出し(UpdateCache);
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, False);
        待機(False, 条件無視);
    }
}

ルール ("Editor | Orb Radii/Strength") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        "Required for UpdateCache()"
        イベント・プレイヤー == ホスト・プレイヤー;
        グローバル.EditorOn != False;
        含む配列(配列(1, 2), (ホスト・プレイヤー).editor_modeSelect) == True;
        (ホスト・プレイヤー).editor_lock == False;
        カウント: (グローバル.EditSelectIdArray) > NULL;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(アビリティ2)) == True;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(ジャンプ)) != ボタンが長押しされている(ホスト・プレイヤー, ボタン(しゃがみ));
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)) == False;
    }
    アクション {
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, True);
        WHILE(AND(ボタンが長押しされている(ホスト・プレイヤー, ボタン(アビリティ2)), OR(ボタンが長押しされている(ホスト・プレイヤー, ボタン(ジャンプ)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(しゃがみ)))));
            IF(AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2), カウント: ((ホスト・プレイヤー).editor_bounceIndex)));
                配列内の値(グローバル.EditMode, グローバル.EditSelected) += IF-THEN-ELSE(ボタンが長押しされている(ホスト・プレイヤー, ボタン(ジャンプ)), 0.1, -0.1);
            ELSE IF(AND(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 1), カウント: ((ホスト・プレイヤー).editor_killIndex)));
                配列内の値(グローバル.I, グローバル.EditSelected) += IF-THEN-ELSE(ボタンが長押しされている(ホスト・プレイヤー, ボタン(ジャンプ)), 0.1, -0.1);
            END;
            待機(0.1, 条件無視);
        END;
        サブルーチンの呼び出し(UpdateCache);
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, False);
    }
}

ルール ("Editor | Select Orb/Portal") {
    イベント {
        進行中 - グローバル;
    }
    条件 {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        グローバル.EditorOn != False;
        含む配列(配列(1, 2, 4), (ホスト・プレイヤー).editor_modeSelect) == True;
        (ホスト・プレイヤー).editor_lock == False;
        カウント: (グローバル.EditSelectIdArray) > NULL;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)) == True;
        OR(ボタンが長押しされている(ホスト・プレイヤー, ボタン(しゃがみ)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(ジャンプ))) == True;
    }
    アクション {
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, True);
        IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(しゃがみ)));
            グローバル変数を設定(EditSelected, IF-THEN-ELSE(配列値のインデックス(グローバル.EditSelectIdArray, グローバル.EditSelected), 配列内の値(グローバル.EditSelectIdArray, 減算(配列値のインデックス(グローバル.EditSelectIdArray, グローバル.EditSelected), True)), 最後の値(グローバル.EditSelectIdArray)));
        ELSE;
            グローバル変数を設定(EditSelected, IF-THEN-ELSE(COMPARE(配列値のインデックス(グローバル.EditSelectIdArray, グローバル.EditSelected), ==, 減算(カウント: (グローバル.EditSelectIdArray), True)), 最初の値(グローバル.EditSelectIdArray), 配列内の値(グローバル.EditSelectIdArray, 追加(配列値のインデックス(グローバル.EditSelectIdArray, グローバル.EditSelected), True))));
        END;
        待機(False, 条件無視);
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, False);
        条件待機(NOT(AND(ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)), OR(ボタンが長押しされている(ホスト・プレイヤー, ボタン(しゃがみ)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(ジャンプ))))), 0.24);
    }
}

ルール ("Editor | Cp Size Hitbox Display") {
    イベント {
        進行中 - グローバル;
    }
    条件 {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        グローバル.EditorOn != False;
        (ホスト・プレイヤー).editor_modeSelect == NULL;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)) == True;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(アビリティ1)) == True;
    }
    アクション {
        プレイヤー変数を設定(ホスト・プレイヤー, editor_hitboxToggle, NOT((ホスト・プレイヤー).editor_hitboxToggle));
        待機(False, 条件無視);
    }
}

ルール ("Editor | Cp Add/Remove Teleport") {
    イベント {
        進行中 - グローバル;
    }
    条件 {
        グローバル.EditorOn != False;
        (ホスト・プレイヤー).editor_modeSelect == NULL;
        (ホスト・プレイヤー).editor_lock == False;
        カウント: (グローバル.A) > True;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)) == True;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(リロード)) == True;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(近接)) == False;
    }
    アクション {
        "prevent overlap with save map"
        条件待機(OR(ボタンが長押しされている(ホスト・プレイヤー, ボタン(近接)), NOT(AND(ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(リロード))))), True);
        中止する条件(OR(ボタンが長押しされている(ホスト・プレイヤー, ボタン(近接)), AND(ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(リロード)))));
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, True);
        IF(NOT((ホスト・プレイヤー).checkpoint_current));
            小さなメッセージ(ホスト・プレイヤー, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("   不能在第一个检查点设置传送门"), カスタムストリング("   Cannot Place A Teleport On First Checkpoint")));
            プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, False);
            中止;
        END;
        "remove"
        IF(COMPARE(カウント: (配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current)), >, 1));
            インデックスのグローバル変数を設定(A, (ホスト・プレイヤー).checkpoint_current, 最初の値(配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current)));
            小さなメッセージ(ホスト・プレイヤー, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("   关卡{0}的传送点已移除", (ホスト・プレイヤー).checkpoint_current), カスタムストリング("   Teleport For Level {0} Has Been Removed", (ホスト・プレイヤー).checkpoint_current)));
        "add"
        ELSE;
            インデックスのグローバル変数を設定(A, (ホスト・プレイヤー).checkpoint_current, 配列(IF-THEN-ELSE(カウント: (配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current)), 最初の値(配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current)), 配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current)), 位置: (ホスト・プレイヤー)));
            小さなメッセージ(ホスト・プレイヤー, カスタムストリング("{0} {1}", IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("   传送点已添加到当前关卡"), カスタムストリング("   Teleport Has Been Added For Level")), (ホスト・プレイヤー).checkpoint_current));
        END;
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, False);
        待機(False, 条件無視);
    }
}

ルール ("Editor | Moving Checkpoint") {
    イベント {
        進行中 - グローバル;
    }
    条件 {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        グローバル.EditorOn != False;
        (ホスト・プレイヤー).editor_modeSelect == NULL;
        (ホスト・プレイヤー).editor_lock == False;
        カウント: (グローバル.A) > NULL;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(アビリティ2)) == True;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃)) == False;
    }
    アクション {
        待機(0.3, 「FALSE」の場合中止);
        IF((ホスト・プレイヤー).addon_toggle3rdPov);
            プレイヤー変数を設定(ホスト・プレイヤー, addon_toggle3rdPov, False);
        END;
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, True);
        プレイヤー変数を設定(ホスト・プレイヤー, editor_undo, 配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current));
        カメラの始動(ホスト・プレイヤー, 減算(追加(目の位置(ホスト・プレイヤー), 乗算(0.5, 上)), 乗算(2.5, プレイヤーが向いている方向: (ホスト・プレイヤー))), 目の位置(ホスト・プレイヤー), 15);
        WHILE(AND(AND(ボタンが長押しされている(ホスト・プレイヤー, ボタン(アビリティ2)), 生存している(ホスト・プレイヤー)), NOT(ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃)))));
            IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)));
                移動速度を設定(ホスト・プレイヤー, 100);
            ELSE;
                移動速度を設定(ホスト・プレイヤー, 3);
            END;
            IF(カウント: (配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current)));
                インデックスのグローバル変数を設定(A, (ホスト・プレイヤー).checkpoint_current, 配列(位置: (ホスト・プレイヤー), 配列内の値(配列内の値(グローバル.A, (ホスト・プレイヤー).checkpoint_current), True)));
            ELSE;
                インデックスのグローバル変数を設定(A, (ホスト・プレイヤー).checkpoint_current, 位置: (ホスト・プレイヤー));
            END;
            待機(False, 条件無視);
        END;
        カメラの停止(ホスト・プレイヤー);
        移動速度を設定(ホスト・プレイヤー, 100);
        IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(アビリティ2)));
            インデックスのグローバル変数を設定(A, (ホスト・プレイヤー).checkpoint_current, (ホスト・プレイヤー).editor_undo);
            条件待機(NOT(ボタンが長押しされている(ホスト・プレイヤー, ボタン(アビリティ2))), 999999999999);
        END;
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, False);
    }
}

ルール ("Editor | Toggle Ult/Dash") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        イベント・プレイヤー == ホスト・プレイヤー;
        グローバル.EditorOn != False;
        (ホスト・プレイヤー).editor_modeSelect == NULL;
        (ホスト・プレイヤー).editor_lock == False;
        カウント: (グローバル.A) > NULL;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)) != ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃));
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(アルティメット)) == True;
    }
    アクション {
        IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)));
            IF(含む配列(グローバル.Dao, (ホスト・プレイヤー).checkpoint_current));
                グローバル変数を変更(Dao, 削除, (ホスト・プレイヤー).checkpoint_current);
            ELSE;
                グローバル変数を変更(Dao, 配列に追加, (ホスト・プレイヤー).checkpoint_current);
            END;
        ELSE;
            IF(含む配列(グローバル.SHIFT, (ホスト・プレイヤー).checkpoint_current));
                グローバル変数を変更(SHIFT, 削除, (ホスト・プレイヤー).checkpoint_current);
            ELSE;
                グローバル変数を変更(SHIFT, 配列に追加, (ホスト・プレイヤー).checkpoint_current);
            END;
        END;
        待機(False, 条件無視);
    }
}

ルール ("Editor | Toggle Bans") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        "Required for UpdateCache()"
        イベント・プレイヤー == ホスト・プレイヤー;
        グローバル.EditorOn != False;
        (ホスト・プレイヤー).editor_modeSelect == 3;
        (ホスト・プレイヤー).editor_lock == False;
        カウント: (グローバル.A) > NULL;
        OR(OR(OR(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃))), ボタンが長押しされている(ホスト・プレイヤー, ボタン(ジャンプ))), ボタンが長押しされている(ホスト・プレイヤー, ボタン(しゃがみ))) == True;
        OR(ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(アビリティ2))) == True;
    }
    アクション {
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, True);
        IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(インタラクト)));
            IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)));
                IF(含む配列(グローバル.BanMulti, (ホスト・プレイヤー).checkpoint_current));
                    グローバル変数を変更(BanMulti, 削除, (ホスト・プレイヤー).checkpoint_current);
                ELSE;
                    グローバル変数を変更(BanMulti, 配列に追加, (ホスト・プレイヤー).checkpoint_current);
                END;
            ELSE IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃)));
                IF(含む配列(グローバル.BanCreate, (ホスト・プレイヤー).checkpoint_current));
                    グローバル変数を変更(BanCreate, 削除, (ホスト・プレイヤー).checkpoint_current);
                ELSE;
                    グローバル変数を変更(BanCreate, 配列に追加, (ホスト・プレイヤー).checkpoint_current);
                END;
            ELSE IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(しゃがみ)));
                IF(含む配列(グローバル.BanClimb, (ホスト・プレイヤー).checkpoint_current));
                    グローバル変数を変更(BanClimb, 削除, (ホスト・プレイヤー).checkpoint_current);
                ELSE;
                    グローバル変数を変更(BanClimb, 配列に追加, (ホスト・プレイヤー).checkpoint_current);
                END;
            ELSE;
                IF(含む配列(グローバル.BanSaveDouble, (ホスト・プレイヤー).checkpoint_current));
                    グローバル変数を変更(BanSaveDouble, 削除, (ホスト・プレイヤー).checkpoint_current);
                ELSE;
                    グローバル変数を変更(BanSaveDouble, 配列に追加, (ホスト・プレイヤー).checkpoint_current);
                END;
            END;
        ELSE;
            IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)));
                IF(含む配列(グローバル.BanDead, (ホスト・プレイヤー).checkpoint_current));
                    グローバル変数を変更(BanDead, 削除, (ホスト・プレイヤー).checkpoint_current);
                ELSE;
                    グローバル変数を変更(BanDead, 配列に追加, (ホスト・プレイヤー).checkpoint_current);
                END;
            ELSE IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃)));
                IF(含む配列(グローバル.BanEmote, (ホスト・プレイヤー).checkpoint_current));
                    グローバル変数を変更(BanEmote, 削除, (ホスト・プレイヤー).checkpoint_current);
                ELSE;
                    グローバル変数を変更(BanEmote, 配列に追加, (ホスト・プレイヤー).checkpoint_current);
                END;
            ELSE IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(しゃがみ)));
                IF(含む配列(グローバル.BanStand, (ホスト・プレイヤー).checkpoint_current));
                    グローバル変数を変更(BanStand, 削除, (ホスト・プレイヤー).checkpoint_current);
                ELSE;
                    グローバル変数を変更(BanStand, 配列に追加, (ホスト・プレイヤー).checkpoint_current);
                END;
            ELSE;
                IF(含む配列(グローバル.BanBhop, (ホスト・プレイヤー).checkpoint_current));
                    グローバル変数を変更(BanBhop, 削除, (ホスト・プレイヤー).checkpoint_current);
                ELSE;
                    グローバル変数を変更(BanBhop, 配列に追加, (ホスト・プレイヤー).checkpoint_current);
                END;
            END;
        END;
        "BanStand"
        待機(0.3, 条件無視);
        サブルーチンの呼び出し(UpdateCache);
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, False);
    }
}

ルール ("Editor | Change Portal Cp") {
    イベント {
        進行中 - グローバル;
    }
    条件 {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        グローバル.EditorOn != False;
        (ホスト・プレイヤー).editor_modeSelect == 4;
        (ホスト・プレイヤー).editor_lock == False;
        カウント: (グローバル.EditSelectIdArray) > NULL;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(ジャンプ)) == True;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(アビリティ2)) == True;
    }
    アクション {
        インデックスのグローバル変数を設定(CustomPortalCP, グローバル.EditSelected, IF-THEN-ELSE(COMPARE(配列内の値(グローバル.CustomPortalCP, グローバル.EditSelected), <, NULL), (ホスト・プレイヤー).checkpoint_current, -1));
        待機(0.3, 条件無視);
    }
}

ルール ("Editor | Move Object") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        "Required for UpdateCache()"
        イベント・プレイヤー == ホスト・プレイヤー;
        グローバル.EditorOn != False;
        含む配列(配列(1, 2, 4), (ホスト・プレイヤー).editor_modeSelect) == True;
        (ホスト・プレイヤー).editor_lock == False;
        カウント: (グローバル.EditSelectIdArray) > NULL;
        ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃)) == False;
        OR(グローバル.EditorMoveItem, AND(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(アビリティ2)))) == True;
    }
    アクション {
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, True);
        グローバル変数を設定(EditorMoveItem, True);
        IF((ホスト・プレイヤー).addon_toggle3rdPov);
            プレイヤー変数を設定(ホスト・プレイヤー, addon_toggle3rdPov, False);
        END;
        "hostPlayer.editor_fly = null"
        条件待機(NOT(OR(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(アビリティ2)))), 999999999999);
        "hostPlayer.disallowButton(Button.ULTIMATE)\\nhostPlayer.disallowButton(Button.JUMP)"
        ステータスを設定(ホスト・プレイヤー, NULL, ハックされている, 999999999999);
        移動速度を設定(ホスト・プレイヤー, False);
        "hostPlayer.startForcingPosition(hostPlayer.getPosition(), false)"
        IF(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 1));
            プレイヤー変数を設定(ホスト・プレイヤー, editor_undo, 配列内の値(グローバル.H, グローバル.EditSelected));
            カメラの始動(ホスト・プレイヤー, 追加(配列内の値(グローバル.H, グローバル.EditSelected), 乗算(プレイヤーが向いている方向: (ホスト・プレイヤー), 乗算(絶対値(配列内の値(グローバル.I, グローバル.EditSelected)), -1.5))), 配列内の値(グローバル.H, グローバル.EditSelected), 30);
            WHILE(NOT(OR(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃)))));
                配列内の値(グローバル.H, グローバル.EditSelected) += 乗算(減算(追加(0.096, 乗算(0.192, ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)))), 乗算(0.048, ボタンが長押しされている(イベント・プレイヤー, ボタン(しゃがみ)))), 追加(追加(乗算(乗算(プレイヤーが向いている方向: (イベント・プレイヤー), Z成分: (スロットル: (イベント・プレイヤー))), ベクトル(True, NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ1))), True)), ワールド座標のベクトル: (乗算(スロットル: (イベント・プレイヤー), 左), イベント・プレイヤー, 回転)), 乗算(上, 減算(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ2)), ボタンが長押しされている(イベント・プレイヤー, ボタン(アルティメット))))));
                待機(False, 条件無視);
            END;
        ELSE IF(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 2));
            プレイヤー変数を設定(ホスト・プレイヤー, editor_undo, 配列内の値(グローバル.TQ, グローバル.EditSelected));
            カメラの始動(ホスト・プレイヤー, 追加(配列内の値(グローバル.TQ, グローバル.EditSelected), 乗算(プレイヤーが向いている方向: (ホスト・プレイヤー), -4)), 配列内の値(グローバル.TQ, グローバル.EditSelected), 30);
            WHILE(NOT(OR(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃)))));
                配列内の値(グローバル.TQ, グローバル.EditSelected) += 乗算(減算(追加(0.096, 乗算(0.192, ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)))), 乗算(0.048, ボタンが長押しされている(イベント・プレイヤー, ボタン(しゃがみ)))), 追加(追加(乗算(乗算(プレイヤーが向いている方向: (イベント・プレイヤー), Z成分: (スロットル: (イベント・プレイヤー))), ベクトル(True, NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ1))), True)), ワールド座標のベクトル: (乗算(スロットル: (イベント・プレイヤー), 左), イベント・プレイヤー, 回転)), 乗算(上, 減算(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ2)), ボタンが長押しされている(イベント・プレイヤー, ボタン(アルティメット))))));
                待機(False, 条件無視);
            END;
        ELSE IF(COMPARE((ホスト・プレイヤー).editor_modeSelect, ==, 4));
            プレイヤー変数を設定(ホスト・プレイヤー, editor_undo, 配列(配列内の値(グローバル.CustomPortalStart, グローバル.EditSelected), 配列内の値(グローバル.CustomPortalEndpoint, グローバル.EditSelected)));
            "move start position"
            カメラの始動(ホスト・プレイヤー, 追加(配列内の値(グローバル.CustomPortalStart, グローバル.EditSelected), 乗算(プレイヤーが向いている方向: (ホスト・プレイヤー), -4)), 配列内の値(グローバル.CustomPortalStart, グローバル.EditSelected), 30);
            WHILE(NOT(OR(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃)))));
                配列内の値(グローバル.CustomPortalStart, グローバル.EditSelected) += 乗算(減算(追加(0.096, 乗算(0.192, ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)))), 乗算(0.048, ボタンが長押しされている(イベント・プレイヤー, ボタン(しゃがみ)))), 追加(追加(乗算(乗算(プレイヤーが向いている方向: (イベント・プレイヤー), Z成分: (スロットル: (イベント・プレイヤー))), ベクトル(True, NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ1))), True)), ワールド座標のベクトル: (乗算(スロットル: (イベント・プレイヤー), 左), イベント・プレイヤー, 回転)), 乗算(上, 減算(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ2)), ボタンが長押しされている(イベント・プレイヤー, ボタン(アルティメット))))));
                待機(False, 条件無視);
            END;
            "move destination"
            カメラの始動(ホスト・プレイヤー, 追加(配列内の値(グローバル.CustomPortalEndpoint, グローバル.EditSelected), 乗算(プレイヤーが向いている方向: (ホスト・プレイヤー), -4)), 配列内の値(グローバル.CustomPortalEndpoint, グローバル.EditSelected), 30);
            条件待機(OR(NOT(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃))), ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃))), True);
            WHILE(NOT(OR(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃)), ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃)))));
                配列内の値(グローバル.CustomPortalEndpoint, グローバル.EditSelected) += 乗算(減算(追加(0.096, 乗算(0.192, ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)))), 乗算(0.048, ボタンが長押しされている(イベント・プレイヤー, ボタン(しゃがみ)))), 追加(追加(乗算(乗算(プレイヤーが向いている方向: (イベント・プレイヤー), Z成分: (スロットル: (イベント・プレイヤー))), ベクトル(True, NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ1))), True)), ワールド座標のベクトル: (乗算(スロットル: (イベント・プレイヤー), 左), イベント・プレイヤー, 回転)), 乗算(上, 減算(ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ2)), ボタンが長押しされている(イベント・プレイヤー, ボタン(アルティメット))))));
                待機(False, 条件無視);
            END;
        END;
        IF(ボタンが長押しされている(ホスト・プレイヤー, ボタン(サブ攻撃)));
            スキップ(乗算(2, (ホスト・プレイヤー).editor_modeSelect));
        ELSE;
        ELSE;
            インデックスのグローバル変数を設定(H, グローバル.EditSelected, (ホスト・プレイヤー).editor_undo);
        ELSE;
            インデックスのグローバル変数を設定(TQ, グローバル.EditSelected, (ホスト・プレイヤー).editor_undo);
        ELSE;
        ELSE;
        ELSE;
            インデックスのグローバル変数を設定(CustomPortalStart, グローバル.EditSelected, 最初の値((ホスト・プレイヤー).editor_undo));
            インデックスのグローバル変数を設定(CustomPortalEndpoint, グローバル.EditSelected, 最後の値((ホスト・プレイヤー).editor_undo));
        END;
        プレイヤー変数を設定(ホスト・プレイヤー, editor_undo, NULL);
        "hostPlayer.allowButton(Button.ULTIMATE)\\nhostPlayer.allowButton(Button.JUMP)"
        ステータスをクリア(ホスト・プレイヤー, ハックされている);
        カメラの停止(ホスト・プレイヤー);
        移動速度を設定(ホスト・プレイヤー, 100);
        "hostPlayer.stopForcingPosition()"
        グローバル変数を設定(EditorMoveItem, NULL);
        サブルーチンの呼び出し(UpdateCache);
        条件待機(NOT(ボタンが長押しされている(ホスト・プレイヤー, ボタン(メイン攻撃))), True);
        プレイヤー変数を設定(ホスト・プレイヤー, editor_lock, False);
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Commands ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("Command | Toggle Leaderboard (Hold Melee)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        カウント: (グローバル.LeaderBoardFull) > NULL;
        グローバル.EditorOn == False;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(近接)) == True;
    }
    アクション {
        待機(True, 「FALSE」の場合中止);
        プレイヤー変数を設定(イベント・プレイヤー, toggle_leaderboard, NOT((イベント・プレイヤー).toggle_leaderboard));
    }
}

ルール ("Command | Split hide (Hold Dash + Primary + Secondary)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ1)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(メイン攻撃)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(サブ攻撃)) == True;
    }
    アクション {
        待機(True, 「FALSE」の場合中止);
        プレイヤー変数を設定(イベント・プレイヤー, timer_splitDisplay, IF-THEN-ELSE(COMPARE((イベント・プレイヤー).timer_splitDisplay, <=, -999999999999), NULL, -999999999999));
        エフェクトを再生(イベント・プレイヤー, 衝撃音（バフ）, NULL, イベント・プレイヤー, 100);
        "$$ Language"
        小さなメッセージ(イベント・プレイヤー, IF-THEN-ELSE(COMPARE((イベント・プレイヤー).timer_splitDisplay, <=, -999999999999), カスタムストリング("   Split Display Off"), カスタムストリング("   Split Display On")));
        待機(0.32, 条件無視);
    }
}

ルール ("Command | Toggle Invisible (Hold Deflect)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ2)) == True;
        グローバル.EditorOn == False;
        グローバル.CompMode == False;
    }
    アクション {
        待機(True, 「FALSE」の場合中止);
        プレイヤー変数を設定(イベント・プレイヤー, toggle_invisible, NOT((イベント・プレイヤー).toggle_invisible));
        目視可否を設定(イベント・プレイヤー, なし);
        IF((イベント・プレイヤー).toggle_invisible);
            目視可否を設定(イベント・プレイヤー, すべて);
        END;
        小さなメッセージ(イベント・プレイヤー, カスタムストリング("  {0}{1}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒInvisibleInvisibleInvisible"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), IF-THEN-ELSE((イベント・プレイヤー).toggle_invisible, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ | On | On | On"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ | Off | Off | Off"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))))));
        "\\"   {0} {1}\\".format(\\"隐身模式\\" checkCN \\"Invisible\\", \\"On\\" if eventPlayer.toggle_invisible else \\"Off\\"))"
        エフェクトを再生(イベント・プレイヤー, 衝撃音（デバフ）, NULL, イベント・プレイヤー, 100);
    }
}

ルール ("Command | Preview Orbs & Portals (Hold Primary + Secondary)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        "@Condition EditorOn == false"
        (イベント・プレイヤー).lockState == False;
        (イベント・プレイヤー).checkpoint_notLast != False;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(メイン攻撃)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(サブ攻撃)) == True;
    }
    アクション {
        "wait(0.9, Wait.ABORT_WHEN_FALSE)"
        待機(0.45, 「FALSE」の場合中止);
        プレイヤー変数を設定(イベント・プレイヤー, preview_array1, 配列(最初の値(配列内の値(グローバル.A, 追加((イベント・プレイヤー).checkpoint_current, True)))));
        IF(カウント: (グローバル.pinballnumber));
            プレイヤー変数を変更(イベント・プレイヤー, preview_array1, 配列に追加, フィルタリングされた配列(グローバル.TQ, COMPARE(配列内の値(グローバル.pinballnumber, 現在の配列のインデックス), ==, (イベント・プレイヤー).checkpoint_current)));
            プレイヤー変数を変更(イベント・プレイヤー, preview_array2, 配列に追加, フィルタリングされた配列(マッピングされた配列(グローバル.pinballnumber, 現在の配列のインデックス), COMPARE(配列内の値(グローバル.pinballnumber, 現在の配列の要素), ==, (イベント・プレイヤー).checkpoint_current)));
        END;
        IF(カウント: (グローバル.CustomPortalStart));
            "eventPlayer.preview_array1.append( [i for i in CustomPortalStart if CustomPortalCP[CustomPortalStart.index(i)] == eventPlayer.checkpoint_current] )"
            プレイヤー変数用(イベント・プレイヤー, preview_i, 0, カウント: ((イベント・プレイヤー).cache_portalStart), True);
                プレイヤー変数を変更(イベント・プレイヤー, preview_array1, 配列に追加, 配列(配列内の値((イベント・プレイヤー).cache_portalStart, (イベント・プレイヤー).preview_i), 配列内の値((イベント・プレイヤー).cache_portalEnd, (イベント・プレイヤー).preview_i)));
                プレイヤー変数を変更(イベント・プレイヤー, preview_array2, 配列に追加, 配列(配列((イベント・プレイヤー).preview_i, False), 配列((イベント・プレイヤー).preview_i, True)));
            END;
        END;
        待機(False, 条件無視);
        プレイヤー変数を設定(イベント・プレイヤー, preview_i, NULL);
        IF((イベント・プレイヤー).addon_toggle3rdPov);
            プレイヤー変数を設定(イベント・プレイヤー, addon_toggle3rdPov, False);
        END;
        カメラの始動(イベント・プレイヤー, 減算(追加(配列内の値((イベント・プレイヤー).preview_array1, (イベント・プレイヤー).preview_i), 上), 乗算(減算(3.5, 乗算(3, Z成分: (スロットル: (イベント・プレイヤー)))), プレイヤーが向いている方向: (イベント・プレイヤー))), 追加(配列内の値((イベント・プレイヤー).preview_array1, (イベント・プレイヤー).preview_i), 上), 15);
        移動速度を設定(イベント・プレイヤー, False);
        メイン攻撃を許可(イベント・プレイヤー, False);
        サブ攻撃を許可(イベント・プレイヤー, False);
        ボタンを無効化(イベント・プレイヤー, ボタン(アビリティ1));
        ボタンを無効化(イベント・プレイヤー, ボタン(ジャンプ));
        WHILE(AND(AND(AND(ボタンが長押しされている(イベント・プレイヤー, ボタン(メイン攻撃)), ボタンが長押しされている(イベント・プレイヤー, ボタン(サブ攻撃))), 生存している(イベント・プレイヤー)), NOT((イベント・プレイヤー).lockState)));
            IF(COMPARE(X成分: (スロットル: (イベント・プレイヤー)), <, -0.5));
                (イベント・プレイヤー).preview_i += True;
            ELSE IF(COMPARE(X成分: (スロットル: (イベント・プレイヤー)), >, 0.5));
                (イベント・プレイヤー).preview_i += 減算(カウント: ((イベント・プレイヤー).preview_array1), True);
            END;
            プレイヤー変数を変更(イベント・プレイヤー, preview_i, 剰余, カウント: ((イベント・プレイヤー).preview_array1));
            条件待機(COMPARE(絶対値(X成分: (スロットル: (イベント・プレイヤー))), <, 0.5), True);
            待機(False, 条件無視);
        END;
        メイン攻撃を許可(イベント・プレイヤー, True);
        サブ攻撃を許可(イベント・プレイヤー, True);
        ボタンを有効化(イベント・プレイヤー, ボタン(アビリティ1));
        ボタンを有効化(イベント・プレイヤー, ボタン(ジャンプ));
        カメラの停止(イベント・プレイヤー);
        移動速度を設定(イベント・プレイヤー, 100);
        プレイヤー変数を設定(イベント・プレイヤー, preview_i, NULL);
        プレイヤー変数を設定(イベント・プレイヤー, preview_array1, NULL);
        プレイヤー変数を設定(イベント・プレイヤー, preview_array2, NULL);
    }
}

ルール ("Command | Restart Run (Crouch + Interact + Deflect)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        OR(COMPARE((イベント・プレイヤー).editor_lock, ==, False), COMPARE(イベント・プレイヤー, !=, ホスト・プレイヤー)) == True;
        (イベント・プレイヤー).lockState == False;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(しゃがみ)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(インタラクト)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ2)) == True;
    }
    アクション {
        プレイヤー変数を設定(イベント・プレイヤー, lockState, True);
        IF(グローバル.CompMode);
            待機(False, 条件無視);
            IF(COMPARE(グローバル.CompTime, <, 1));
                小さなメッセージ(イベント・プレイヤー, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("   比赛结束"), カスタムストリング("   Competition Is Over")));
                プレイヤー変数を設定(イベント・プレイヤー, lockState, False);
                中止;
            ELSE IF((イベント・プレイヤー).comp_done);
                プレイヤー変数を設定(イベント・プレイヤー, lockState, False);
                中止;
            ELSE IF(AND(グローバル.CompRestartLimit, (イベント・プレイヤー).checkpoint_notLast));
                小さなメッセージ(イベント・プレイヤー, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("   禁止在此比赛中运行期间重新启动"), カスタムストリング("   Restart During Run Is Disabled For This Competition")));
                プレイヤー変数を設定(イベント・プレイヤー, lockState, False);
                中止;
            ELSE IF(グローバル.CompAtmpNum);
                IF(COMPARE((イベント・プレイヤー).comp_countAttempts, ==, グローバル.CompAtmpNum));
                    小さなメッセージ(イベント・プレイヤー, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("   最后一次尝试"), カスタムストリング("   This Is Your Final Attempt")));
                    プレイヤー変数を設定(イベント・プレイヤー, lockState, False);
                    中止;
                END;
                IF(COMPARE((イベント・プレイヤー).comp_countAttempts, <, NULL));
                    小さなメッセージ(イベント・プレイヤー, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("   你没有尝试过"), カスタムストリング("   You Are Out Of Attempts")));
                    プレイヤー変数を設定(イベント・プレイヤー, lockState, False);
                    中止;
                END;
                (イベント・プレイヤー).comp_countAttempts += True;
                インデックスのグローバル変数を設定(CompAtmpSaveCount, 配列値のインデックス(グローバル.CompAtmpSaveNames, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列)), (イベント・プレイヤー).comp_countAttempts);
            END;
        END;
        プレイヤー変数を設定(イベント・プレイヤー, editor_fly, NULL);
        プレイヤー変数を設定(イベント・プレイヤー, checkpoint_current, NULL);
        プレイヤー変数を設定(イベント・プレイヤー, timer_splitDisplay, 乗算(-999999999999, COMPARE((イベント・プレイヤー).timer_splitDisplay, <=, -999999999999)));
        プレイヤー変数を設定(イベント・プレイヤー, toggle_practice, False);
        プレイヤー変数を設定(イベント・プレイヤー, timer_practice, NULL);
        プレイヤー変数の追跡を中止(イベント・プレイヤー, timer_practice);
        IF(含む配列(グローバル.SaveEnt, イベント・プレイヤー));
            サブルーチンの呼び出し(DeleteSave);
        END;
        IF(倒れている(イベント・プレイヤー));
            "eventPlayer.respawn()"
            蘇生(イベント・プレイヤー);
        END;
        サブルーチンの呼び出し(StartGame);
        エフェクトを再生(イベント・プレイヤー, 爆発音（リング）, NULL, イベント・プレイヤー, 100);
        待機(グローバル.CompMode, 条件無視);
        "eventPlayer.allowButton(Button.ABILITY_1)"
        プレイヤー変数を設定(イベント・プレイヤー, lockState, False);
        "Anti spam"
        待機(0.096, 条件無視);
    }
}

ルール ("Command | Spectate (Hold Interact)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        ボタンが長押しされている(イベント・プレイヤー, ボタン(インタラクト)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ2)) == False;
        AND(グローバル.EditorOn, OR(OR(ボタンが長押しされている(イベント・プレイヤー, ボタン(近接)), ボタンが長押しされている(イベント・プレイヤー, ボタン(メイン攻撃))), ボタンが長押しされている(イベント・プレイヤー, ボタン(サブ攻撃)))) == False;
    }
    アクション {
        待機(True, 「FALSE」の場合中止);
        "editor has interact combos"
        IF(グローバル.EditorOn);
            待機(True, 「FALSE」の場合中止);
        END;
        ゲーム・モードの標準リスポーンを有効化(イベント・プレイヤー);
        ゲーム・モードの標準リスポーンを無効化(イベント・プレイヤー);
        IF((イベント・プレイヤー).toggle_spectate);
            蘇生(イベント・プレイヤー);
            IF((イベント・プレイヤー).toggle_practice);
                プレイヤー変数を特定のレートで追跡(イベント・プレイヤー, timer_practice, 999999999999, True, なし);
            ELSE IF((イベント・プレイヤー).checkpoint_notLast);
                サブルーチンの呼び出し(TimerResume);
            END;
            サブルーチンの呼び出し(CheckpointFailReset);
        ELSE;
            プレイヤー変数を設定(イベント・プレイヤー, toggle_invincible, False);
            サブルーチンの呼び出し(TimerPause);
            プレイヤー変数の追跡を中止(イベント・プレイヤー, timer_practice);
            受けるダメージを設定(イベント・プレイヤー, 100);
            キル(イベント・プレイヤー, NULL);
            受けるダメージを設定(イベント・プレイヤー, 0);
            小さなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   Hold Interact Again To Turn Off Spectate Mode   Hold Interact Again To Turn Off Spectate Mode   Hold Interact Agai{0}", カスタムストリング("n To Turn Off Spectate Mode")), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
        END;
        プレイヤー変数を設定(イベント・プレイヤー, toggle_spectate, NOT((イベント・プレイヤー).toggle_spectate));
    }
}

ルール ("Command | Toggle Invincible Mode (Melee + Reload)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        AND(グローバル.CompMode, (イベント・プレイヤー).comp_done) == False;
        (イベント・プレイヤー).lockState == False;
        生存している(イベント・プレイヤー) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(近接)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(リロード)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(インタラクト)) == False;
    }
    アクション {
        プレイヤー変数を設定(イベント・プレイヤー, lockState, True);
        プレイヤー変数を設定(イベント・プレイヤー, toggle_invincible, NOT((イベント・プレイヤー).toggle_invincible));
        プレイヤー変数を設定(イベント・プレイヤー, cache_collectedLocks, 空の配列);
        IF((イベント・プレイヤー).toggle_invincible);
            "\\"探点模式\\" checkCN \\"Invincible mode\\""
            大きなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒInvincible ModeInvincible ModeInvincible Mode"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
            サブルーチンの呼び出し(TimerPause);
            プレイヤー変数の追跡を中止(イベント・プレイヤー, timer_practice);
            ルールを開始(CheckUlt, 何もしない);
            ルールを開始(CheckAbility1, 何もしない);
        ELSE;
            IF((イベント・プレイヤー).toggle_practice);
                "\\"练习模式\\" checkCN \\"Practice mode\\""
                大きなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒPractice ModePractice ModePractice Mode"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
                プレイヤー変数を特定のレートで追跡(イベント・プレイヤー, timer_practice, 999999999999, True, なし);
                サブルーチンの呼び出し(CheckpointFailReset);
            ELSE IF((イベント・プレイヤー).checkpoint_notLast);
                "\\"跑图模式\\" checkCN \\"Normal mode\\""
                大きなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒNormal ModeNormal ModeNormal Mode"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
                サブルーチンの呼び出し(TimerResume);
                サブルーチンの呼び出し(CheckpointFailReset);
            END;
        END;
        プレイヤー変数を設定(イベント・プレイヤー, lockState, False);
        "Anti spam"
        待機(0.096, 条件無視);
    }
}

ルール ("Command | Toggle Practice Mode (Melee + Ultimate)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        グローバル.EditorOn == False;
        グローバル.CompMode == False;
        (イベント・プレイヤー).lockState == False;
        生存している(イベント・プレイヤー) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(リロード)) == False;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(近接)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(アルティメット)) == True;
    }
    アクション {
        プレイヤー変数を設定(イベント・プレイヤー, lockState, True);
        プレイヤー変数を設定(イベント・プレイヤー, toggle_practice, NOT((イベント・プレイヤー).toggle_practice));
        IF((イベント・プレイヤー).toggle_practice);
            "\\"练习模式\\" checkCN \\"Practice mode\\""
            大きなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒPractice ModePractice ModePractice Mode"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
            サブルーチンの呼び出し(TimerPause);
            プレイヤー変数を設定(イベント・プレイヤー, checkpoint_practice, (イベント・プレイヤー).checkpoint_current);
            プレイヤー変数を設定(イベント・プレイヤー, timer_splitDisplay, 乗算(-999999999999, COMPARE((イベント・プレイヤー).timer_splitDisplay, <=, -999999999999)));
            プレイヤー変数を設定(イベント・プレイヤー, timer_split, NULL);
            プレイヤー変数を設定(イベント・プレイヤー, timer_practice, NULL);
            プレイヤー変数を特定のレートで追跡(イベント・プレイヤー, timer_practice, 999999999999, True, なし);
            IF((イベント・プレイヤー).toggle_invincible);
                プレイヤー変数を設定(イベント・プレイヤー, toggle_invincible, False);
                サブルーチンの呼び出し(CheckpointFailReset);
            END;
        ELSE;
            "\\"跑图模式\\" checkCN \\"Normal mode\\""
            大きなメッセージ(イベント・プレイヤー, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒNormal ModeNormal ModeNormal Mode"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))));
            プレイヤー変数の追跡を中止(イベント・プレイヤー, timer_practice);
            プレイヤー変数を設定(イベント・プレイヤー, checkpoint_current, (イベント・プレイヤー).checkpoint_practice);
            サブルーチンの呼び出し(UpdateCache);
            IF(AND((イベント・プレイヤー).checkpoint_notLast, NOT((イベント・プレイヤー).toggle_invincible)));
                プレイヤー変数を設定(イベント・プレイヤー, timer_split, (イベント・プレイヤー).timer_normal);
                サブルーチンの呼び出し(TimerResume);
                サブルーチンの呼び出し(CheckpointFailReset);
            END;
        END;
        プレイヤー変数を設定(イベント・プレイヤー, lockState, False);
        "Anti spam"
        待機(0.096, 条件無視);
    }
}

ルール ("Command | Restart Practice (Hold Interact)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        グローバル.EditorOn == False;
        (イベント・プレイヤー).lockState == False;
        (イベント・プレイヤー).toggle_practice != False;
        OR(生存している(イベント・プレイヤー), (イベント・プレイヤー).toggle_spectate) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(インタラクト)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(しゃがみ)) == False;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(アルティメット)) == False;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(近接)) == False;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ2)) == False;
    }
    アクション {
        "first 2 ifs prevent collide with spec"
        IF((イベント・プレイヤー).toggle_spectate);
            条件待機(生存している(イベント・プレイヤー), 999999999999);
            条件待機(NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(インタラクト))), 2);
            中止;
        END;
        条件待機(NOT(ボタンが長押しされている(イベント・プレイヤー, ボタン(インタラクト))), 0.9);
        中止する条件(ボタンが長押しされている(イベント・プレイヤー, ボタン(インタラクト)));
        プレイヤー変数を設定(イベント・プレイヤー, timer_practice, NULL);
        プレイヤー変数を設定(イベント・プレイヤー, timer_split, NULL);
        プレイヤー変数を設定(イベント・プレイヤー, checkpoint_current, (イベント・プレイヤー).checkpoint_practice);
        サブルーチンの呼び出し(UpdateCache);
        サブルーチンの呼び出し(CheckpointFailReset);
    }
}

ルール ("Command | Skip (Crouch + Primary-Next | Secondary-Previous)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        カウント: (グローバル.A) > True;
        グローバル.EditorMoveItem == False;
        AND((イベント・プレイヤー).editor_lock, COMPARE(イベント・プレイヤー, ==, ホスト・プレイヤー)) == False;
        OR(グローバル.EditorOn, (イベント・プレイヤー).toggle_practice) == True;
        (イベント・プレイヤー).lockState == False;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(しゃがみ)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(メイン攻撃)) != ボタンが長押しされている(イベント・プレイヤー, ボタン(サブ攻撃));
    }
    アクション {
        "@Condition hostPlayer.editor_on or ( eventPlayer.toggle_practice and eventPlayer.isHoldingButton(Button.ABILITY_1) )"
        プレイヤー変数を設定(イベント・プレイヤー, lockState, True);
        プレイヤー変数を設定(イベント・プレイヤー, timer_split, NULL);
        プレイヤー変数を設定(イベント・プレイヤー, timer_practice, NULL);
        (イベント・プレイヤー).checkpoint_current += IF-THEN-ELSE(ボタンが長押しされている(イベント・プレイヤー, ボタン(サブ攻撃)), 減算(カウント: (グローバル.A), True), True);
        プレイヤー変数を変更(イベント・プレイヤー, checkpoint_current, 剰余, カウント: (グローバル.A));
        プレイヤー変数を設定(イベント・プレイヤー, checkpoint_moved, True);
        サブルーチンの呼び出し(UpdateCache);
        サブルーチンの呼び出し(CheckpointFailReset);
        "Anti spam"
        待機(0.064, 条件無視);
        "faster if you spam button"
        条件待機(COMPARE(ボタンが長押しされている(イベント・プレイヤー, ボタン(メイン攻撃)), ==, ボタンが長押しされている(イベント・プレイヤー, ボタン(サブ攻撃))), 0.256);
        条件が「TRUE」の場合ループ;
        "After loop to prevent instant teleports"
        プレイヤー変数を設定(イベント・プレイヤー, lockState, False);
    }
}

ルール ("Command | Quick Reset (Reload | Hold Reload to Enable)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        ボタンが長押しされている(イベント・プレイヤー, ボタン(リロード)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(近接)) == False;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(インタラクト)) == False;
    }
    アクション {
        IF((イベント・プレイヤー).toggle_quickRestart);
            IF((イベント・プレイヤー).editor_fly);
                プレイヤー変数を設定(イベント・プレイヤー, editor_fly, 最後の値(配列内の値(グローバル.A, (イベント・プレイヤー).checkpoint_current)));
            END;
            サブルーチンの呼び出し(CheckpointFailReset);
            待機(0.32, 条件無視);
        END;
        待機(True, 「FALSE」の場合中止);
        プレイヤー変数を設定(イベント・プレイヤー, toggle_quickRestart, NOT((イベント・プレイヤー).toggle_quickRestart));
        エフェクトを再生(イベント・プレイヤー, 衝撃音（バフ）, NULL, イベント・プレイヤー, 100);
        "(\\"快速回点已启用\\" if eventPlayer.toggle_quickRestart else \\"快速回点已关闭\\") checkCN\\n\\"Quick reset is enabled\\" if eventPlayer.toggle_quickRestart else \\"Quick reset is disabled\\""
        大きなメッセージ(イベント・プレイヤー, IF-THEN-ELSE((イベント・プレイヤー).toggle_quickRestart, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒQuick Reset Is EnabledQuick Reset Is EnabledQuick Reset Is Enabled"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒQuick Reset Is DisabledQuick Reset Is DisabledQuick Reset Is Disabled"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))));
    }
}

ルール ("Command | Toggle Hud (Hold Secondary)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        グローバル.EditorMoveItem == False;
        AND(AND(グローバル.EditorOn, COMPARE(イベント・プレイヤー, ==, ホスト・プレイヤー)), ボタンが長押しされている(イベント・プレイヤー, ボタン(近接))) == False;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(サブ攻撃)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(メイン攻撃)) == False;
        "don't activate during skipping"
        ボタンが長押しされている(イベント・プレイヤー, ボタン(しゃがみ)) == False;
    }
    アクション {
        待機(1.5, 「FALSE」の場合中止);
        プレイヤー変数を設定(イベント・プレイヤー, toggle_guide, NOT((イベント・プレイヤー).toggle_guide));
        小さなメッセージ(イベント・プレイヤー, IF-THEN-ELSE((イベント・プレイヤー).toggle_guide, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   HUD Is Now Shown   HUD Is Now Shown   HUD Is Now Shown"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ   HUD Is Now Hidden   HUD Is Now Hidden   HUD Is Now Hidden"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))));
        "(\\"   HUD已隐藏\\" if eventPlayer.toggle_guide else  \\"   HUD已开启\\")\\ncheckCN\\n(\\"   Hud is now hidden\\" if eventPlayer.toggle_guide else \\"   Hud is now shown\\"))"
        エフェクトを再生(イベント・プレイヤー, 衝撃音（バフ）, NULL, イベント・プレイヤー, 100);
    }
}

ルール ("Command | Toggle Hints (Melee + Deflect)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        グローバル.HintText != NULL;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(近接)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(アビリティ2)) == True;
        OR((イベント・プレイヤー).toggle_hints, 含む配列(グローバル.HintCp, (イベント・プレイヤー).checkpoint_current)) == True;
    }
    アクション {
        プレイヤー変数を設定(イベント・プレイヤー, toggle_hints, NOT((イベント・プレイヤー).toggle_hints));
    }
}

ルール ("Command | Toggle 3rd Person Camera (Hold Crouch + Jump)") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        "True if not null"
        (イベント・プレイヤー).addon_toggle3rdPov <= True;
        (イベント・プレイヤー).lockState == False;
        (イベント・プレイヤー).editor_lock == False;
        地上にいる(イベント・プレイヤー) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(しゃがみ)) == True;
        ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)) == True;
    }
    アクション {
        待機(True, 「FALSE」の場合中止);
        プレイヤー変数を設定(イベント・プレイヤー, addon_toggle3rdPov, NOT((イベント・プレイヤー).addon_toggle3rdPov));
        サブルーチンの呼び出し(Addon3rdPerson);
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Huds ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("Huds | Global Localplayer") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        待機(0.8, 条件無視);
        "name/credit construction\\nnote on changing default name/credit\\nif you change it, also change it in the credits rule\\nthe old credits should always remain valid here to keep old data valid"
        IF(COMPARE(グローバル.Name, ==, カスタムストリング("name here - 作者")));
            "Legacy Credits"
            グローバル変数を設定(Name, 最初の値(グローバル.Cachedcredits));
        END;
        IF(NOT(グローバル.Name));
            グローバル変数を設定(Name, カスタムストリング("name here - 作者"));
        END;
        IF(COMPARE(グローバル.Code, ==, カスタムストリング("code here - 代码")));
            "Legacy Credits"
            グローバル変数を設定(Code, 最後の値(グローバル.Cachedcredits));
        END;
        IF(NOT(グローバル.Code));
            グローバル変数を設定(Code, カスタムストリング("code here - 代码"));
        END;
        グローバル変数を設定(Cachedcredits, NULL);
        IF(NOT(グローバル.EditorOn));
            HUDテキストを作成(最初の値(True), NULL, IF-THEN-ELSE((ローカルプレイヤー).toggle_guide, カスタムストリング("Discord: dsc.gg/genjiparkour"), 空の配列), カスタムストリング("{0}: {1}                                                                                                ", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒMade ByMade ByMade By"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), グローバル.Name), 左, -200, NULL, 配列内の値(グローバル.ColorConfig, 18), 最初の値(グローバル.ColorConfig), 表示される相手、文字列, デフォルト表示);
            HUDテキストを作成(最初の値(True), NULL, NULL, カスタムストリング("{0}: {1}                                                                                                ", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒMap CodeMap CodeMap Code"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), グローバル.Code), 左, -199, NULL, NULL, 配列内の値(グローバル.ColorConfig, True), 表示される相手、文字列, デフォルト表示);
            HUDテキストを作成((ローカルプレイヤー).toggle_guide, NULL, NULL, カスタムストリング("{0} {1} + {2}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒHoldHoldHold"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 入力割り当ての文字列(ボタン(メイン攻撃)), カスタムストリング("{0} | {1}", 入力割り当ての文字列(ボタン(サブ攻撃)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒPreview CPPreview CPPreview CP"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))))), 右, -160, NULL, NULL, IF-THEN-ELSE((ローカルプレイヤー).preview_array1, 一度だけ評価(配列内の値(グローバル.ColorConfig, 6)), 一度だけ評価(配列内の値(グローバル.ColorConfig, 5))), 表示される相手、文字列、色, デフォルト表示);
            HUDテキストを作成(最初の値(AND((ローカルプレイヤー).preview_array1, (ローカルプレイヤー).toggle_guide)), NULL, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒWalk ◀ ▶ | Preview Others\\nWalk ▲ ▼ | Modify Zoom\\nAim | Change Preview AngleWalk ◀ ▶ | Preview Others\\nWalk ▲ ▼ | Modify{0}", カスタムストリング(" Zoom\\nAim | Change Preview AngleWalk ◀ ▶ | Preview Others\\nWalk ▲ ▼ | Modify Zoom\\nAim | Change Preview Angle")), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), NULL, トップ, -171, NULL, 配列内の値(グローバル.ColorConfig, 6), NULL, 表示される相手、文字列, 表示されない);
            HUDテキストを作成(ローカルプレイヤー, NULL, NULL, IF-THEN-ELSE(OR(COMPARE((ローカルプレイヤー).timer_splitDisplay, <=, -999999999999), (ローカルプレイヤー).toggle_spectate), 空の配列, カスタムストリング("{0}{1}                                                                                                ", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒSplit: Split: Split: "), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), (ローカルプレイヤー).timer_splitDisplay)), 左, -195, NULL, NULL, 配列内の値(グローバル.ColorConfig, 3), 表示される相手、文字列, デフォルト表示);
            "Remove no hints - visual and element bloat"
            IF(カウント: (グローバル.HintText));
                HUDテキストを作成(最初の値(AND((ローカルプレイヤー).toggle_guide, 含む配列(グローバル.HintCp, (ローカルプレイヤー).checkpoint_current))), NULL, カスタムストリング("{0}{1}", IF-THEN-ELSE((ローカルプレイヤー).toggle_hints, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ― ― ― ― ― Hint ― ― ― ― ―\\n― ― ― ― ― Hint ― ― ― ― ―\\n― ― ― ― ― Hint ― ― ― ― ―\\n"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ― ― ― Hint Available ― ― ―― ― ― Hint Available ― ― ―― ― ― Hint Available ― ― ―"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))), IF-THEN-ELSE((ローカルプレイヤー).toggle_hints, 配列内の値(グローバル.HintText, 配列値のインデックス(グローバル.HintCp, (ローカルプレイヤー).checkpoint_current)), 空の配列)), カスタムストリング("{0} + {1} | {2}", 入力割り当ての文字列(ボタン(アビリティ2)), 入力割り当ての文字列(ボタン(近接)), IF-THEN-ELSE((ローカルプレイヤー).toggle_hints, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒHide HintHide HintHide Hint"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒShow HintShow HintShow Hint"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))))), 右, -151, NULL, IF-THEN-ELSE((ローカルプレイヤー).toggle_hints, 色(緑), 色(オレンジ)), IF-THEN-ELSE(含む配列(グローバル.HintCp, (ローカルプレイヤー).checkpoint_current), 一度だけ評価(配列内の値(グローバル.ColorConfig, 5)), 色(グレー)), 表示される相手、文字列、色, デフォルト表示);
            END;
            HUDテキストを作成((ローカルプレイヤー).toggle_guide, NULL, NULL, カスタムストリング("{0} + {1} + {2}", 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(アビリティ2)), カスタムストリング("{0} | {1}\\n{2}", 入力割り当ての文字列(ボタン(インタラクト)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒRestartRestartRestart"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), カスタムストリング("{0} {1} | {2}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒHoldHoldHold"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 入力割り当ての文字列(ボタン(近接)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒLeaderboardLeaderboardLeaderboard"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))))), 右, -156, NULL, NULL, 配列内の値(グローバル.ColorConfig, 5), 表示される相手、文字列, デフォルト表示);
            グローバル変数を設定(Difficultyhud, 配列(ワークショップ設定コンボ(カスタムストリング("Map Settings ■ 地图设置 ■ 맵 설정"), カスタムストリング("Difficulty 󠀨Display Hud󠀩 ■ 难度 󠀨顶部hud󠀩 ■ 난이도 󠀨HUD 디스플레이󠀩"), 0, 配列(カスタムストリング("<fg27AAFFFF>Playtest ■ 游戏测试 ■ 플레이테스트"), カスタムストリング("<fgA0E81BFF>Easy-"), カスタムストリング("<fgA0E81BFF>Easy"), カスタムストリング("<fgA0E81BFF>Easy+"), カスタムストリング("<fge0e000FF>Medium-"), カスタムストリング("<fge0e000FF>Medium"), カスタムストリング("<fge0e000FF>Medium+"), カスタムストリング("<fgEC9900FF>Hard-"), カスタムストリング("<fgEC9900FF>Hard"), カスタムストリング("<fgEC9900FF>Hard+"), カスタムストリング("<fgFF4500FF>Very Hard-"), カスタムストリング("<fgFF4500FF>Very Hard"), カスタムストリング("<fgFF4500FF>Very Hard+"), カスタムストリング("<fgC80013FF>Extreme-"), カスタムストリング("<fgC80013FF>Extreme"), カスタムストリング("<fgC80013FF>Extreme+"), カスタムストリング("<fg960000FF>Hell"), カスタムストリング("Do Not Display ■ 不显示 ■ 표시 X")), 1), ワークショップの設定の切り替え(カスタムストリング("Map Settings ■ 地图设置 ■ 맵 설정"), カスタムストリング("Playtest Display ■ 游戏测试 ■ 플레이테스트 디스플레이"), False, 2)));
            "display\\n17th entry is 'dont display'"
            IF(COMPARE(最初の値(グローバル.Difficultyhud), !=, 17));
                HUDテキストを作成(最初の値(AND((ローカルプレイヤー).toggle_guide, NOT((ローカルプレイヤー).toggle_leaderboard))), IF-THEN-ELSE(最後の値(グローバル.Difficultyhud), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒPlaytestPlaytestPlaytest"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 空の配列), 配列内の値(配列(カスタムストリング("Playtest"), カスタムストリング("Easy -"), カスタムストリング("Easy"), カスタムストリング("Easy +"), カスタムストリング("Medium -"), カスタムストリング("Medium"), カスタムストリング("Medium +"), カスタムストリング("Hard -"), カスタムストリング("Hard"), カスタムストリング("Hard +"), カスタムストリング("Very Hard -"), カスタムストリング("Very Hard"), カスタムストリング("Very Hard +"), カスタムストリング("Extreme -"), カスタムストリング("Extreme"), カスタムストリング("Extreme +"), カスタムストリング("Hell"), NULL), 最初の値(グローバル.Difficultyhud)), NULL, トップ, -173, 色(青), 配列内の値(配列(色(青), 色(ライムグリーン), 色(ライムグリーン), 色(ライムグリーン), 色(黄色), 色(黄色), 色(黄色), 色(オレンジ), 色(オレンジ), 色(オレンジ), カスタム・カラー(255, 69, 0, 255), カスタム・カラー(255, 69, 0, 255), カスタム・カラー(255, 69, 0, 255), 色(赤), 色(赤), 色(赤), カスタム・カラー(150, 0, 0, 255), NULL), 最初の値(グローバル.Difficultyhud)), NULL, 表示される相手、文字列, デフォルト表示);
            END;
        END;
        "global huds"
        HUDテキストを作成(最初の値(True), NULL, カスタムストリング("{0}{1}{2}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒServer Restart In Server Restart In Server Restart In "), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), グローバル.TimeRemaining, カスタムストリング("{0}v1.10.4A{1}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ Min -  Min -  Min - "), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), IF-THEN-ELSE(COMPARE(テキスト数, >=, 128), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ\\nError: Max HUD Count Reached\\nError: Max HUD Count Reached\\nError: Max HUD Count Reached"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 空の配列))), NULL, 右, -162, NULL, 配列内の値(グローバル.ColorConfig, 2), NULL, 表示される相手、文字列, 常に表示);
        "padding for custom hud display"
        HUDテキストを作成(最初の値(True), NULL, NULL, カスタムストリング("­\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n"), トップ, -164, NULL, NULL, 色(オレンジ), 目視可能: , デフォルト表示);
        HUDテキストを作成((ローカルプレイヤー).toggle_guide, NULL, NULL, IF-THEN-ELSE((ローカルプレイヤー).toggle_quickRestart, カスタムストリング("{0} | {1}", 入力割り当ての文字列(ボタン(リロード)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒQuick ResetQuick ResetQuick Reset"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))), カスタムストリング("{0} {1} | {2}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒHoldHoldHold"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 入力割り当ての文字列(ボタン(リロード)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒEnable Quick ResetEnable Quick ResetEnable Quick Reset"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))))), 右, -157, NULL, NULL, 配列内の値(グローバル.ColorConfig, 5), 表示される相手、文字列, デフォルト表示);
        HUDテキストを作成((ローカルプレイヤー).toggle_guide, NULL, NULL, カスタムストリング("{0} + {1} | {2}", 入力割り当ての文字列(ボタン(リロード)), 入力割り当ての文字列(ボタン(近接)), カスタムストリング("{0}{1}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒInvincibleInvincibleInvincible"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), IF-THEN-ELSE((ローカルプレイヤー).toggle_invincible, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ | On | On | On"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 空の配列))), 右, -154, NULL, NULL, IF-THEN-ELSE((ローカルプレイヤー).toggle_invincible, 一度だけ評価(配列内の値(グローバル.ColorConfig, 6)), 一度だけ評価(配列内の値(グローバル.ColorConfig, 5))), 表示される相手、文字列、色, デフォルト表示);
        HUDテキストを作成(最初の値(True), NULL, IF-THEN-ELSE((ローカルプレイヤー).toggle_guide, 空の配列, カスタムストリング("{0}{1}{2}", IF-THEN-ELSE((ローカルプレイヤー).toggle_invincible, アビリティアイコンストリング(ヒーロー(バティスト), ボタン(アビリティ2)), 空の配列), IF-THEN-ELSE((ローカルプレイヤー).toggle_practice, アビリティアイコンストリング(ヒーロー(D.Va), ボタン(アルティメット)), 空の配列), IF-THEN-ELSE((ローカルプレイヤー).toggle_invisible, アビリティアイコンストリング(ヒーロー(ソンブラ), ボタン(アビリティ1)), 空の配列))), カスタムストリング("{0} {1} | {2} HUD", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒHoldHoldHold"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 入力割り当ての文字列(ボタン(サブ攻撃)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒToggleToggleToggle"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))), 右, -161, NULL, 配列内の値(グローバル.ColorConfig, 5), 配列内の値(グローバル.ColorConfig, 5), 表示される相手、文字列, デフォルト表示);
        "text per checkpoint  text per cp each"
        IF(カウント: (グローバル.CpHudText));
            HUDテキストを作成(最初の値(AND(含む配列(グローバル.CpHudCp, (ローカルプレイヤー).checkpoint_current), (ローカルプレイヤー).toggle_guide)), 配列内の値(グローバル.CpHudText, 配列値のインデックス(グローバル.CpHudCp, (ローカルプレイヤー).checkpoint_current)), NULL, NULL, トップ, -169, 色(青), NULL, NULL, 表示される相手、文字列, デフォルト表示);
        END;
        IF(カウント: (グローバル.CpIwtText));
            ワールド内テキストを作成(含む配列(グローバル.CpIwtCp, (ローカルプレイヤー).checkpoint_current), 配列内の値(グローバル.CpIwtText, 配列値のインデックス(グローバル.CpIwtCp, (ローカルプレイヤー).checkpoint_current)), 配列内の値(グローバル.CpIwtPos, 配列値のインデックス(グローバル.CpIwtCp, (ローカルプレイヤー).checkpoint_current)), 2, 表面に対してクリップ, 表示される相手、位置、文字列, グローバル.CpIwtColor, デフォルト表示);
        END;
        IF(グローバル.CompMode);
            HUDテキストを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), (現在の配列の要素).comp_instructionHud), カスタムストリング("                                                                                                                           "), NULL, NULL, トップ, -181, 色(白), NULL, NULL, 目視可能: , デフォルト表示);
            IF(最初の値(グローバル.instructiontext));
                HUDテキストを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), (現在の配列の要素).comp_instructionHud), NULL, NULL, 最初の値(グローバル.instructiontext), トップ, -180, NULL, NULL, 色(白), 目視可能: , デフォルト表示);
            END;
            IF(配列内の値(グローバル.instructiontext, True));
                HUDテキストを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), (現在の配列の要素).comp_instructionHud), NULL, NULL, 配列内の値(グローバル.instructiontext, True), トップ, -179, NULL, NULL, 色(白), 目視可能: , デフォルト表示);
            END;
            IF(配列内の値(グローバル.instructiontext, 2));
                HUDテキストを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), (現在の配列の要素).comp_instructionHud), NULL, NULL, 配列内の値(グローバル.instructiontext, 2), トップ, -178, NULL, NULL, 色(白), 目視可能: , デフォルト表示);
            END;
            IF(配列内の値(グローバル.instructiontext, 3));
                HUDテキストを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), (現在の配列の要素).comp_instructionHud), NULL, NULL, 配列内の値(グローバル.instructiontext, 3), トップ, -177, NULL, NULL, 色(白), 目視可能: , デフォルト表示);
            END;
            HUDテキストを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), (現在の配列の要素).comp_instructionHud), カスタムストリング("                                   Press {0} to start                                ", 入力割り当ての文字列(ボタン(インタラクト))), NULL, NULL, トップ, -176, 色(白), NULL, NULL, 表示される相手、文字列, デフォルト表示);
        ELSE IF(NOT(グローバル.EditorOn));
            HUDテキストを作成((ローカルプレイヤー).toggle_guide, NULL, NULL, カスタムストリング("{0} {1} | {2}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒHoldHoldHold"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 入力割り当ての文字列(ボタン(アビリティ2)), カスタムストリング("{0}{1}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒInvisibleInvisibleInvisible"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), IF-THEN-ELSE((ローカルプレイヤー).toggle_invisible, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ | On | On | On"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 空の配列))), 右, -158, NULL, NULL, IF-THEN-ELSE((ローカルプレイヤー).toggle_invisible, 一度だけ評価(配列内の値(グローバル.ColorConfig, 6)), 一度だけ評価(配列内の値(グローバル.ColorConfig, 5))), 表示される相手、文字列、色, デフォルト表示);
            HUDテキストを作成((ローカルプレイヤー).toggle_guide, NULL, NULL, カスタムストリング("{0} + {1} | {2}", 入力割り当ての文字列(ボタン(アルティメット)), 入力割り当ての文字列(ボタン(近接)), カスタムストリング("{0}{1}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒPracticePracticePractice"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), IF-THEN-ELSE((ローカルプレイヤー).toggle_practice, カスタムストリング(" | ({0})", (ローカルプレイヤー).checkpoint_practice), 空の配列))), 右, -153, NULL, NULL, IF-THEN-ELSE((ローカルプレイヤー).toggle_practice, 一度だけ評価(配列内の値(グローバル.ColorConfig, 6)), 一度だけ評価(配列内の値(グローバル.ColorConfig, 5))), 表示される相手、文字列、色, デフォルト表示);
            HUDテキストを作成(最初の値(AND((ローカルプレイヤー).toggle_practice, (ローカルプレイヤー).toggle_guide)), NULL, カスタムストリング("{0} + {1} | {2}", 入力割り当ての文字列(ボタン(しゃがみ)), 入力割り当ての文字列(ボタン(メイン攻撃)), カスタムストリング("{0}\\n{1} + {2}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒNext LevelNext LevelNext Level"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 入力割り当ての文字列(ボタン(しゃがみ)), カスタムストリング("{0} | {1}\\n{2}", 入力割り当ての文字列(ボタン(サブ攻撃)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒPrevious LevelPrevious LevelPrevious Level"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), カスタムストリング("{0} | {1}", 入力割り当ての文字列(ボタン(インタラクト)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒRestart PracticeRestart PracticeRestart Practice"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))))))), NULL, 右, -152, NULL, 一度だけ評価(配列内の値(グローバル.ColorConfig, 6)), NULL, 表示される相手、文字列、色, デフォルト表示);
            スキップ(True);
        ELSE;
            //spectateHud:
            HUDテキストを作成((ローカルプレイヤー).toggle_guide, NULL, NULL, カスタムストリング("{0} {1} | {2}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒHoldHoldHold"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 入力割り当ての文字列(ボタン(インタラクト)), カスタムストリング("{0}{1}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒSpectateSpectateSpectate"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), IF-THEN-ELSE((ローカルプレイヤー).toggle_spectate, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ | On | On | On"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 空の配列))), 右, -155, NULL, NULL, IF-THEN-ELSE((ローカルプレイヤー).toggle_spectate, 一度だけ評価(配列内の値(グローバル.ColorConfig, 6)), 一度だけ評価(配列内の値(グローバル.ColorConfig, 5))), 表示される相手、文字列、色, デフォルト表示);
    }
}

ルール ("Huds | Leaderboard") {
    イベント {
        進行中 - グローバル;
    }
    条件 {
        グローバル.LeaderBoardRemake != False;
        グローバル.LeaderBoardFull != 空の配列;
    }
    アクション {
        "account for delay in completion"
        待機(False, 条件無視);
        WHILE(カウント: (グローバル.LeaderBoardHuds));
            HUDテキストを破棄(最初の値(グローバル.LeaderBoardHuds));
            グローバル変数を変更(LeaderBoardHuds, インデックスを配列から削除, False);
        END;
        "top 5"
        グローバル変数を設定(LeaderBoardFull, ソートされた配列(グローバル.LeaderBoardFull, 配列内の値(現在の配列の要素, True)));
        グローバル変数を設定(LeaderBoardRemake, 空の配列);
        グローバル変数を設定(LeaderBoardHuds, マッピングされた配列(グローバル.LeaderBoardFull, カスタムストリング("　 {0}:　{1} - {2}", 追加(現在の配列のインデックス, True), 最初の値(現在の配列の要素), 最後の値(現在の配列の要素))));
        WHILE(カウント: (グローバル.LeaderBoardHuds));
            グローバル変数を設定(LeaderBoardRemake, カスタムストリング("{0}\\n{1}", グローバル.LeaderBoardRemake, 最初の値(グローバル.LeaderBoardHuds)));
            グローバル変数を変更(LeaderBoardHuds, インデックスを配列から削除, False);
        END;
        グローバル変数を設定(LeaderBoardRemake, カスタムストリング("{0}\\n", グローバル.LeaderBoardRemake));
        "if LeaderBoardFull[0]:"
        HUDテキストを作成((ローカルプレイヤー).toggle_guide, NULL, カスタムストリング(" \\n{0} {1} {0}", アイコンストリング(通報), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒTop 5Top 5Top 5"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))), NULL, 右, -141, NULL, 色(白), NULL, 表示される相手、文字列, 常に表示);
        グローバル変数を設定(LeaderBoardHuds, 最新のテキストID);
        HUDテキストを作成(最初の値(True), ヒーローアイコン文字列(ヒーロー(ゲンジ)), 最初の値(最初の値(グローバル.LeaderBoardFull)), 最後の値(最初の値(グローバル.LeaderBoardFull)), 右, -140, 色(赤), 色(赤), 色(赤), 目視可能: , 常に表示);
        グローバル変数を変更(LeaderBoardHuds, 配列に追加, 最新のテキストID);
        IF(配列内の値(グローバル.LeaderBoardFull, True));
            HUDテキストを作成(最初の値(True), ヒーローアイコン文字列(ヒーロー(ゲンジ)), 最初の値(配列内の値(グローバル.LeaderBoardFull, True)), 最後の値(配列内の値(グローバル.LeaderBoardFull, True)), 右, -139, 色(オレンジ), 色(オレンジ), 色(オレンジ), 目視可能: , 常に表示);
            グローバル変数を変更(LeaderBoardHuds, 配列に追加, 最新のテキストID);
            IF(配列内の値(グローバル.LeaderBoardFull, 2));
                HUDテキストを作成(最初の値(True), ヒーローアイコン文字列(ヒーロー(ゲンジ)), 最初の値(配列内の値(グローバル.LeaderBoardFull, 2)), 最後の値(配列内の値(グローバル.LeaderBoardFull, 2)), 右, -138, 色(黄色), 色(黄色), 色(黄色), 目視可能: , 常に表示);
                グローバル変数を変更(LeaderBoardHuds, 配列に追加, 最新のテキストID);
                IF(配列内の値(グローバル.LeaderBoardFull, 3));
                    HUDテキストを作成(最初の値(True), ヒーローアイコン文字列(ヒーロー(ゲンジ)), 最初の値(配列内の値(グローバル.LeaderBoardFull, 3)), 最後の値(配列内の値(グローバル.LeaderBoardFull, 3)), 右, -137, 色(ライムグリーン), 色(ライムグリーン), 色(ライムグリーン), 目視可能: , 常に表示);
                    グローバル変数を変更(LeaderBoardHuds, 配列に追加, 最新のテキストID);
                    IF(配列内の値(グローバル.LeaderBoardFull, 4));
                        HUDテキストを作成(最初の値(True), ヒーローアイコン文字列(ヒーロー(ゲンジ)), 最初の値(配列内の値(グローバル.LeaderBoardFull, 4)), 最後の値(配列内の値(グローバル.LeaderBoardFull, 4)), 右, -136, 色(緑), 色(緑), 色(緑), 目視可能: , 常に表示);
                        グローバル変数を変更(LeaderBoardHuds, 配列に追加, 最新のテキストID);
                    END;
                END;
            END;
        END;
        HUDテキストを作成(IF-THEN-ELSE(一度だけ評価(AND(グローバル.CompMode, NOT(グローバル.CompTime))), True, (ローカルプレイヤー).toggle_leaderboard), カスタムストリング("　　　　 {0} {1} {0} 　　　　\\n　　　　　　　　　　　　　　　　　　{2}", アイコンストリング(通報), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒLeaderboardLeaderboardLeaderboard"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 一度だけ評価(グローバル.LeaderBoardRemake)), NULL, NULL, トップ, -165, 色(白), NULL, NULL, 表示される相手、文字列, デフォルト表示);
        グローバル変数を変更(LeaderBoardHuds, 配列に追加, 最新のテキストID);
        グローバル変数を設定(LeaderBoardRemake, NULL);
        待機(False, 条件無視);
    }
}

ルール ("Huds | Each Player") {
    イベント {
        プレイヤーがマッチに参加;
        すべて;
        すべて;
    }
    アクション {
        待機(0.512, 条件無視);
        HUDテキストを作成(イベント・プレイヤー, NULL, IF-THEN-ELSE((イベント・プレイヤー).toggle_practice, カスタムストリング("{0} {1} sec", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒPractice Time:Practice Time:Practice Time:"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), (イベント・プレイヤー).timer_practice), 空の配列), カスタムストリング("{0} {1} sec                                                                                                ", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒTime:Time:Time:"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), (イベント・プレイヤー).timer_normal), 左, -196, NULL, 色(グレー), 配列内の値(グローバル.ColorConfig, 3), 文字列, デフォルト表示);
        HUDテキストを作成(IF-THEN-ELSE((イベント・プレイヤー).toggle_leaderboard, NULL, イベント・プレイヤー), IF-THEN-ELSE((イベント・プレイヤー).preview_array1, カスタムストリング(" {0} ({1}/{2}", IF-THEN-ELSE((イベント・プレイヤー).preview_i, IF-THEN-ELSE(COMPARE((イベント・プレイヤー).preview_i, <=, カウント: ((イベント・プレイヤー).cache_bouncePosition)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒOrbOrbOrb"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒPortalPortalPortal"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒCheckpointCheckpointCheckpoint"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))), 追加((イベント・プレイヤー).preview_i, True), カスタムストリング("{0})\\n―――――――――――\\n {1}\\n", カウント: ((イベント・プレイヤー).preview_array1), IF-THEN-ELSE(AND(COMPARE((イベント・プレイヤー).preview_i, <=, カウント: ((イベント・プレイヤー).cache_bouncePosition)), (イベント・プレイヤー).preview_i), カスタムストリング("{0} {1} {2}", IF-THEN-ELSE(配列内の値(グローバル.TQ5, 配列内の値((イベント・プレイヤー).preview_array2, (イベント・プレイヤー).preview_i)), アビリティアイコンストリング(ヒーロー(ゲンジ), ボタン(アルティメット)), 空の配列), IF-THEN-ELSE(配列内の値(グローバル.TQ6, 配列内の値((イベント・プレイヤー).preview_array2, (イベント・プレイヤー).preview_i)), アビリティアイコンストリング(ヒーロー(ゲンジ), ボタン(アビリティ1)), 空の配列), カスタムストリング("{0} {1}", IF-THEN-ELSE(配列内の値(グローバル.BounceToggleLock, 配列内の値((イベント・プレイヤー).preview_array2, (イベント・プレイヤー).preview_i)), アイコンストリング(警告), 空の配列), IF-THEN-ELSE(COMPARE(配列内の値(グローバル.EditMode, 配列内の値((イベント・プレイヤー).preview_array2, (イベント・プレイヤー).preview_i)), >, NULL), アイコンストリング(矢印:上), IF-THEN-ELSE(COMPARE(配列内の値(グローバル.EditMode, 配列内の値((イベント・プレイヤー).preview_array2, (イベント・プレイヤー).preview_i)), <, NULL), アイコンストリング(矢印:下), 空の配列)))), IF-THEN-ELSE((イベント・プレイヤー).preview_i, IF-THEN-ELSE(最後の値(配列内の値((イベント・プレイヤー).preview_array2, (イベント・プレイヤー).preview_i)), カスタムストリング("{0} {1}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒPortal ExitPortal ExitPortal Exit"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 配列内の値((イベント・プレイヤー).preview_array2, (イベント・プレイヤー).preview_i)), カスタムストリング("{0} {1}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒPortal StartPortal StartPortal Start"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 配列内の値((イベント・プレイヤー).preview_array2, (イベント・プレイヤー).preview_i))), (イベント・プレイヤー).banString)))), 空の配列), IF-THEN-ELSE((イベント・プレイヤー).preview_array1, 空の配列, カスタムストリング("{0}{1} {2}", IF-THEN-ELSE(AND((イベント・プレイヤー).toggle_guide, (イベント・プレイヤー).banString), カスタムストリング("{0}\\n", (イベント・プレイヤー).banString), 空の配列), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒLevelLevelLevel"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), カスタムストリング("{0} / {1}", (イベント・プレイヤー).checkpoint_current, 減算(カウント: (グローバル.A), True)))), IF-THEN-ELSE(AND((イベント・プレイヤー).cache_bounceMaxLocks, NOT((イベント・プレイヤー).preview_array1)), カスタムストリング("{0} {1} / {2}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ{0} Orbs{0} Orbs{0} Orbs", 配列内の値(グローバル.ColorConfig, 16)), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), カウント: ((イベント・プレイヤー).cache_collectedLocks), (イベント・プレイヤー).cache_bounceMaxLocks), 空の配列), トップ, -172, 配列内の値(グローバル.ColorConfig, 4), 配列内の値(グローバル.ColorConfig, 4), 配列内の値(グローバル.ColorConfig, 16), 表示される相手、文字列, デフォルト表示);
        HUDテキストを作成(イベント・プレイヤー, NULL, NULL, カスタムストリング("{0}{1}{2}", IF-THEN-ELSE(X成分: ((イベント・プレイヤー).cache_inputs), カスタムストリング("■"), カスタムストリング("□")), IF-THEN-ELSE(COMPARE(Z成分: (スロットル: (イベント・プレイヤー)), >, NULL), カスタムストリング("▲"), カスタムストリング("△")), カスタムストリング("{0}\\n{1}{2}", IF-THEN-ELSE(Y成分: ((イベント・プレイヤー).cache_inputs), カスタムストリング("●"), カスタムストリング("○")), IF-THEN-ELSE(COMPARE(X成分: (スロットル: (イベント・プレイヤー)), >, NULL), カスタムストリング("◀"), カスタムストリング("◁")), カスタムストリング("{0}{1}                                                                                                ", IF-THEN-ELSE(COMPARE(Z成分: (スロットル: (イベント・プレイヤー)), <, NULL), カスタムストリング("▼"), カスタムストリング("∇")), IF-THEN-ELSE(COMPARE(X成分: (スロットル: (イベント・プレイヤー)), <, NULL), カスタムストリング("▶"), カスタムストリング("▷"))))), 左, -192, NULL, NULL, 一度だけ評価(配列内の値(グローバル.ColorConfig, 3)), 文字列, デフォルト表示);
        "climb/bhop indicators"
        HUDテキストを作成(イベント・プレイヤー, カスタムストリング("{0}{1}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒClimbClimbClimb"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), IF-THEN-ELSE((イベント・プレイヤー).skill_countMulti, カスタムストリング(" ({0})", (イベント・プレイヤー).skill_countMulti), 空の配列)), NULL, カスタムストリング("                                                                                                                                "), 左, -193, IF-THEN-ELSE((イベント・プレイヤー).skill_usedClimb, 一度だけ評価(配列内の値(グローバル.ColorConfig, 8)), 一度だけ評価(配列内の値(グローバル.ColorConfig, 7))), NULL, NULL, 文字列、色, デフォルト表示);
        HUDテキストを作成(イベント・プレイヤー, カスタムストリング("{0}{1}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒBhopBhopBhop"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), IF-THEN-ELSE((イベント・プレイヤー).skill_countCreates, カスタムストリング(" ({0})", (イベント・プレイヤー).skill_countCreates), 空の配列)), NULL, カスタムストリング("                                                                                                                                "), 左, -194, IF-THEN-ELSE((イベント・プレイヤー).skill_usedBhop, 一度だけ評価(配列内の値(グローバル.ColorConfig, 8)), 一度だけ評価(配列内の値(グローバル.ColorConfig, 7))), NULL, NULL, 文字列、色, デフォルト表示);
        ワールド内テキストを作成(IF-THEN-ELSE(AND((イベント・プレイヤー).checkpoint_notLast, (イベント・プレイヤー).toggle_guide), イベント・プレイヤー, NULL), IF-THEN-ELSE(AND((イベント・プレイヤー).cache_bounceMaxLocks, COMPARE(カウント: ((イベント・プレイヤー).cache_collectedLocks), <, (イベント・プレイヤー).cache_bounceMaxLocks)), カスタムストリング("{0}{1}", アイコンストリング(警告), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒCollect Orbs FirstCollect Orbs FirstCollect Orbs First"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒCome HereCome HereCome Here"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列))))), 配列内の値(グローバル.A, 追加((イベント・プレイヤー).checkpoint_current, True)), 1.5, クリップしない, 表示される相手、位置、文字列, 配列内の値(グローバル.ColorConfig, 13), デフォルト表示);
        待機(2.5, 条件無視);
        IF(グローバル.CompMode);
            HUDテキストを作成(イベント・プレイヤー, NULL, IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), IF-THEN-ELSE(グローバル.CompTime, カスタムストリング("剩余时间: {0} 分钟{1}", グローバル.CompTime, IF-THEN-ELSE(COMPARE((イベント・プレイヤー).comp_countAttempts, <, NULL), カスタムストリング("\\n你没有尝试过"), IF-THEN-ELSE(グローバル.CompAtmpNum, カスタムストリング("\\n尝试 {0} / {1}", (イベント・プレイヤー).comp_countAttempts, グローバル.CompAtmpNum), 空の配列))), カスタムストリング("! 比赛结束 !")), IF-THEN-ELSE(グローバル.CompTime, カスタムストリング("Time Left: {0} Min{1}", グローバル.CompTime, IF-THEN-ELSE(COMPARE((イベント・プレイヤー).comp_countAttempts, <, NULL), カスタムストリング("\\nYou Are Out Of Attempts"), IF-THEN-ELSE(グローバル.CompAtmpNum, カスタムストリング("\\nAttempt {0} / {1}", (イベント・プレイヤー).comp_countAttempts, グローバル.CompAtmpNum), 空の配列))), カスタムストリング("! Competition Is Over !"))), IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), IF-THEN-ELSE(グローバル.CompTime, カスタムストリング("竞赛模式"), カスタムストリング("竞赛模式\\n\\n\\n")), IF-THEN-ELSE(グローバル.CompTime, カスタムストリング("Tournament Mode"), カスタムストリング("Tournament Mode\\n\\n\\n"))), トップ, -182, NULL, 色(黄色), 色(黄色), 文字列, デフォルト表示);
    }
}

ルール ("Huds | SUB Update Title") {
    イベント {
        サブルーチン;
        UpdateTitle;
    }
    アクション {
        "or eventPlayer.toggle_practice:"
        中止する条件(OR(OR(グローバル.CompMode, グローバル.EditorOn), NOT(AND(カウント: (グローバル.TitleData), 含む配列(最初の値(グローバル.TitleData), (イベント・プレイヤー).checkpoint_current)))));
        ワールド内テキストを破棄((イベント・プレイヤー).cache_titleHud);
        ワールド内テキストを作成(最初の値(NOT((イベント・プレイヤー).toggle_invisible)), 配列内の値(配列内の値(グローバル.TitleData, True), 配列値のインデックス(最初の値(グローバル.TitleData), (イベント・プレイヤー).checkpoint_current)), イベント・プレイヤー, 1.1, 表面に対してクリップ, 表示される相手、位置, 配列内の値(最後の値(グローバル.TitleData), 配列値のインデックス(最初の値(グローバル.TitleData), (イベント・プレイヤー).checkpoint_current)), デフォルト表示);
        プレイヤー変数を設定(イベント・プレイヤー, cache_titleHud, 最新のテキストID);
    }
}

ルール ("Huds | Addons") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        待機(0.8, 条件無視);
        条件待機(エンティティが存在している(すべてのプレイヤー(すべてのチーム)), 999999999999);
        待機(False, 条件無視);
        IF(COMPARE((すべてのプレイヤー(すべてのチーム)).addon_toggle3rdPov, <=, True));
            HUDテキストを作成((ローカルプレイヤー).toggle_guide, NULL, NULL, カスタムストリング("{0} {1} + {2}", 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒHoldHoldHold"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 入力割り当ての文字列(ボタン(しゃがみ)), カスタムストリング("{0} | {1}{2}", 入力割り当ての文字列(ボタン(ジャンプ)), 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ3rd Person3rd Person3rd Person"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), IF-THEN-ELSE((ローカルプレイヤー).addon_toggle3rdPov, 配列内の値(文字列の分割(カスタムストリング("ＴＬＥｒｒ | On | On | On"), グローバル.__overpyTranslationHelper__), 絶対値(配列値のインデックス(グローバル.__overpyTranslationHelper__, 文字列の分割(色(白), 空の配列)))), 空の配列))), 右, -159, NULL, NULL, IF-THEN-ELSE((ローカルプレイヤー).addon_toggle3rdPov, 一度だけ評価(配列内の値(グローバル.ColorConfig, 6)), 一度だけ評価(配列内の値(グローバル.ColorConfig, 5))), 表示される相手、文字列、色, デフォルト表示);
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Effects ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("Effects | Setup Effects") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        "add back to below wait if removed"
        待機(1.264, 条件無視);
        "pre set control map portals. not in portal rule because shared I variable"
        IF(カウント: (グローバル.PortalDest));
            グローバル変数用(NANBA, 0, カウント: (グローバル.PortalLoc), True);
                エフェクトを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), OR((現在の配列の要素).toggle_invincible, NOT((現在の配列の要素).checkpoint_notLast))), 悪いオーラ, IF-THEN-ELSE(剰余(グローバル.NANBA, 2), 色(アクア), 色(オレンジ)), 配列内の値(グローバル.PortalLoc, グローバル.NANBA), 0.6, 目視可能: );
                ワールド内テキストを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), OR((現在の配列の要素).toggle_invincible, NOT((現在の配列の要素).checkpoint_notLast))), 配列内の値(グローバル.PortalNames, グローバル.NANBA), 追加(配列内の値(グローバル.PortalLoc, グローバル.NANBA), 上), True, 表面に対してクリップ, 目視可能: , 色(白), デフォルト表示);
            END;
            待機(False, 条件無視);
        END;
        IF(グローバル.EditorOn);
            サブルーチンの呼び出し(RebuildKillOrbs);
            サブルーチンの呼び出し(RebuildBounceOrbs);
            サブルーチンの呼び出し(RebuildPortals);
        ELSE;
            IF(カウント: (グローバル.CustomPortalStart));
                グローバル変数用(NANBA, 0, カウント: (グローバル.CustomPortalStart), True);
                    エフェクトを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), OR(COMPARE((現在の配列の要素).checkpoint_current, ==, 一度だけ評価(配列内の値(グローバル.CustomPortalCP, グローバル.NANBA))), 一度だけ評価(COMPARE(配列内の値(グローバル.CustomPortalCP, グローバル.NANBA), <, NULL)))), いいオーラ, 配列内の値(グローバル.ColorConfig, 17), 配列内の値(グローバル.CustomPortalStart, グローバル.NANBA), 0.6, 目視可能: );
                    待機(False, 条件無視);
                END;
                待機(0.5, 条件無視);
            END;
            IF(カウント: (グローバル.H));
                グローバル変数用(NANBA, 0, カウント: (グローバル.H), True);
                    エフェクトを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), COMPARE((現在の配列の要素).checkpoint_current, ==, 一度だけ評価(配列内の値(グローバル.killballnumber, グローバル.NANBA)))), 球体, 配列内の値(グローバル.ColorConfig, 14), 配列内の値(グローバル.H, グローバル.NANBA), 絶対値(配列内の値(グローバル.I, グローバル.NANBA)), 目視可能: );
                    待機(False, 条件無視);
                END;
                待機(0.5, 条件無視);
            END;
            IF(カウント: (グローバル.TQ));
                グローバル変数用(NANBA, 0, カウント: (グローバル.TQ), True);
                    エフェクトを作成(フィルタリングされた配列(配列に追加(すべてのプレイヤー(すべてのチーム), NULL), AND(COMPARE((現在の配列の要素).checkpoint_current, ==, 一度だけ評価(配列内の値(グローバル.pinballnumber, グローバル.NANBA))), NOT(含む配列((現在の配列の要素).cache_collectedLocks, 一度だけ評価(グローバル.NANBA))))), オーブ, IF-THEN-ELSE(配列内の値(グローバル.BounceToggleLock, グローバル.NANBA), 配列内の値(グローバル.ColorConfig, 16), 配列内の値(グローバル.ColorConfig, 15)), 配列内の値(グローバル.TQ, グローバル.NANBA), True, 目視可能: );
                    待機(False, 条件無視);
                END;
            END;
            "End portal preview"
            エフェクトを作成(IF-THEN-ELSE(AND(AND((ローカルプレイヤー).preview_i, COMPARE((ローカルプレイヤー).preview_i, >, カウント: ((ローカルプレイヤー).cache_bouncePosition))), 最後の値(配列内の値((ローカルプレイヤー).preview_array2, (ローカルプレイヤー).preview_i))), ローカルプレイヤー, NULL), スパークル, 色(紫), 配列内の値((ローカルプレイヤー).preview_array1, (ローカルプレイヤー).preview_i), 0.5, 表示される相手、位置、範囲);
    }
}

ルール ("Effects | SUB Rebuild Bounce Orbs") {
    イベント {
        サブルーチン;
        RebuildBounceOrbs;
    }
    アクション {
        エフェクトを破棄(グローバル.TQ2);
        グローバル変数を設定(TQ2, 空の配列);
        グローバル変数用(NANBA, 0, カウント: (グローバル.pinballnumber), True);
            エフェクトを作成(フィルタリングされた配列(配列に追加(すべてのプレイヤー(すべてのチーム), NULL), AND(COMPARE((現在の配列の要素).checkpoint_current, ==, 配列内の値(グローバル.pinballnumber, 一度だけ評価(グローバル.NANBA))), NOT(含む配列((現在の配列の要素).cache_collectedLocks, 一度だけ評価(グローバル.NANBA))))), オーブ, IF-THEN-ELSE(配列内の値(グローバル.BounceToggleLock, 一度だけ評価(グローバル.NANBA)), 配列内の値(グローバル.ColorConfig, 16), 配列内の値(グローバル.ColorConfig, 15)), 配列内の値(グローバル.TQ, 一度だけ評価(グローバル.NANBA)), True, 表示される相手、位置、半径、色);
            グローバル変数を変更(TQ2, 配列に追加, 最新のエンティティ);
            "wait()"
            IF(NOT(剰余(グローバル.NANBA, 5)));
                待機(False, 条件無視);
            END;
        END;
    }
}

ルール ("Effects | SUB Rebuild boundary spheres") {
    イベント {
        サブルーチン;
        RebuildKillOrbs;
    }
    アクション {
        エフェクトを破棄(グローバル.K);
        グローバル変数を設定(K, 空の配列);
        グローバル変数用(NANBA, 0, カウント: (グローバル.killballnumber), True);
            エフェクトを作成(フィルタリングされた配列(配列に追加(すべてのプレイヤー(すべてのチーム), NULL), COMPARE((現在の配列の要素).checkpoint_current, ==, 配列内の値(グローバル.killballnumber, 一度だけ評価(グローバル.NANBA)))), 球体, 配列内の値(グローバル.ColorConfig, 14), 配列内の値(グローバル.H, 一度だけ評価(グローバル.NANBA)), 絶対値(配列内の値(グローバル.I, 一度だけ評価(グローバル.NANBA))), 表示される相手、位置、範囲);
            グローバル変数を変更(K, 配列に追加, 最新のエンティティ);
            IF(NOT(剰余(グローバル.NANBA, 5)));
                待機(False, 条件無視);
            END;
        END;
    }
}

ルール ("Effects | SUB Rebuild Portals") {
    イベント {
        サブルーチン;
        RebuildPortals;
    }
    アクション {
        エフェクトを破棄(グローバル.PortalEffects);
        グローバル変数を設定(PortalEffects, 空の配列);
        IF(カウント: (グローバル.CustomPortalCP));
            グローバル変数用(NANBA, 0, カウント: (グローバル.CustomPortalCP), True);
                エフェクトを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), OR(COMPARE((現在の配列の要素).checkpoint_current, ==, 配列内の値(グローバル.CustomPortalCP, 一度だけ評価(グローバル.NANBA))), COMPARE(配列内の値(グローバル.CustomPortalCP, 一度だけ評価(グローバル.NANBA)), <, NULL))), いいオーラ, 配列内の値(グローバル.ColorConfig, 17), 配列内の値(グローバル.CustomPortalStart, 一度だけ評価(グローバル.NANBA)), 0.6, 表示される相手、位置、範囲);
                グローバル変数を変更(PortalEffects, 配列に追加, 最新のエンティティ);
                IF(NOT(剰余(グローバル.NANBA, 5)));
                    待機(False, 条件無視);
                END;
            END;
        END;
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Addon Functions ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("Addon | AFK timer") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        移動している(イベント・プレイヤー) == False;
        生存している(イベント・プレイヤー) == True;
        エモートでコミュニケーションしている(イベント・プレイヤー) == False;
        グローバル.EditorOn == False;
    }
    アクション {
        待機(300, 「FALSE」の場合中止);
        IF((イベント・プレイヤー).addon_toggle3rdPov);
            プレイヤー変数を設定(イベント・プレイヤー, addon_toggle3rdPov, False);
        END;
        ステータスを設定(イベント・プレイヤー, NULL, 眠っている, 999999999999);
        "raycast to prevent camera stuck on low wall"
        カメラの始動(イベント・プレイヤー, 追加(位置: (イベント・プレイヤー), 乗算(上, 減算(二点間の距離(位置: (イベント・プレイヤー), レイ・キャストのヒット位置(位置: (イベント・プレイヤー), 追加(位置: (イベント・プレイヤー), 乗算(4, 上)), NULL, NULL, False)), True))), 位置: (イベント・プレイヤー), 10);
        "cancel it after jumping or not sleep, reset cures sleep"
        待機(True, 条件無視);
        条件待機(OR(ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)), NOT(ステータスがある(イベント・プレイヤー, 眠っている))), 999999999999);
        ステータスをクリア(イベント・プレイヤー, 眠っている);
        カメラの停止(イベント・プレイヤー);
        IF(AND((イベント・プレイヤー).checkpoint_notLast, NOT((イベント・プレイヤー).toggle_invincible)));
            サブルーチンの呼び出し(CheckpointFailReset);
        END;
        条件が「TRUE」の場合ループ;
    }
}

ルール ("Addon | Pre-set control map portal - toggled via workshop") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        グローバル.PortalOn != False;
        カウント: (グローバル.PortalLoc) != NULL;
        OR((イベント・プレイヤー).toggle_invincible, NOT((イベント・プレイヤー).checkpoint_notLast)) == True;
        いずれに対しても「TRUE」(グローバル.PortalLoc, COMPARE(二点間の距離(現在の配列の要素, 追加(位置: (イベント・プレイヤー), 乗算(0.2, 上))), <, 1.3)) == True;
    }
    アクション {
        テレポート(イベント・プレイヤー, 最初の値(ソートされた配列(グローバル.PortalDest, 二点間の距離(イベント・プレイヤー, 配列内の値(グローバル.PortalLoc, 現在の配列のインデックス)))));
    }
}

ルール ("Addon | Custom portals") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        カウント: ((イベント・プレイヤー).cache_portalStart) != NULL;
        いずれに対しても「TRUE」((イベント・プレイヤー).cache_portalStart, COMPARE(二点間の距離(現在の配列の要素, 追加(位置: (イベント・プレイヤー), 乗算(0.2, 上))), <, 1.3)) == True;
    }
    アクション {
        テレポート(イベント・プレイヤー, 最初の値(ソートされた配列((イベント・プレイヤー).cache_portalEnd, 二点間の距離(イベント・プレイヤー, 配列内の値((イベント・プレイヤー).cache_portalStart, 現在の配列のインデックス)))));
        待機(0.4, 条件無視);
    }
}

ルール ("Addon | Pre-set control map portal - toggled on via workshop settings") {
    イベント {
        進行中 - グローバル;
    }
    条件 {
        グローバル.PortalOn != False;
    }
    アクション {
        "overwrite pasta"
        待機(0.752, 条件無視);
        IF(COMPARE(現在のマップ, ==, マップ(BUSAN)));
            "\\"down > sanc\\",\\"down > meka\\",\\"sanc > down\\",\\"sanc > meka\\",\\"meka > sanc\\",\\"meka > down\\""
            グローバル変数を設定(PortalNames, 文字列の分割(カスタムストリング("Sanctuary0MEKA base0Downtown0MEKA base0Sanctuary0Downtown"), 最初の値(NULL)));
            グローバル変数を設定(PortalLoc, 配列(ベクトル(47.946, 7.248, -93.922), ベクトル(55.921, 6.998, -94.024), ベクトル(-326.382, 10.81, 117.261), ベクトル(-330.96, 10.81, 117.416), ベクトル(219.567, 10.215, 243.653), ベクトル(225.976, 10.227, 240.799)));
            グローバル変数を設定(PortalDest, 配列(ベクトル(-328.552, 10.01, 120.82), ベクトル(221.152, 9.376, 238.765), ベクトル(52.197, 6.301, -97.513), ベクトル(221.271, 9.431, 238.978), ベクトル(-328.601, 10.01, 120.823), ベクトル(52.197, 6.299, -97.513)));
        ELSE IF(COMPARE(現在のマップ, ==, マップ(ILIOS)));
            "\\"light > ruin\\",\\"light > well\\",\\"ruin > light\\",\\"ruin > well\\",\\"well > light\\",\\"well > ruin\\""
            グローバル変数を設定(PortalNames, 文字列の分割(カスタムストリング("Ruins0Well0Lighthouse0Well0Lighthouse0Ruins"), 最初の値(NULL)));
            グローバル変数を設定(PortalLoc, 配列(ベクトル(325.722, -22.665, -40.401), ベクトル(327.43, -22.665, -36.089), ベクトル(26.176, 58.367, -156.415), ベクトル(30.472, 58.367, -156.307), ベクトル(-199.945, 2.015, -2.918), ベクトル(-194.93, 2.015, -8.054)));
            グローバル変数を設定(PortalDest, 配列(ベクトル(28.375, 57.659, -161.195), ベクトル(-200.464, 1.306, -8.604), ベクトル(333.088, -23.389, -40.933), ベクトル(-200.464, 1.306, -8.604), ベクトル(333.088, -23.389, -40.933), ベクトル(28.375, 57.829, -161.195)));
        ELSE IF(OR(COMPARE(現在のマップ, ==, マップ(LIJIANG TOWER)), COMPARE(現在のマップ, ==, マップ(LIJIANG TOWER 旧正月))));
            "\\"control > garden\\",\\"control > market\\",\\"garden > control\\",\\"garden > market\\",\\"market > control\\",\\"market > garden\\""
            グローバル変数を設定(PortalNames, 文字列の分割(カスタムストリング("Garden0Night Market0Control Center0Night Market0Control Center0Garden"), 最初の値(NULL)));
            グローバル変数を設定(PortalLoc, 配列(ベクトル(-2.815, 271, 295.373), ベクトル(2.905, 271, 295.052), ベクトル(5.788, 95.056, 135.298), ベクトル(-5.343, 95.05, 134.638), ベクトル(-2.738, False, -61.911), ベクトル(5.043, False, -61.879)));
            グローバル変数を設定(PortalDest, 配列(ベクトル(0.286, 94.292, 140.396), ベクトル(0.584, -0.709, -54.469), ベクトル(0.245, 270.292, 301.428), ベクトル(0.773, -0.708, -54.361), ベクトル(0.245, 270.292, 301.428), ベクトル(0.286, 94.292, 140.396)));
        ELSE IF(COMPARE(現在のマップ, ==, マップ(NEPAL)));
            "\\"vil > shrine\\",\\"vil > sanc\\", \\"shrine > vil\\",\\"shrine > sanc\\",#\\"sanc > vil\\",\\"sanc > shrine\\""
            グローバル変数を設定(PortalNames, 文字列の分割(カスタムストリング("Shrine0Sanctum0Village0Sanctum0Village0Shrine"), 最初の値(NULL)));
            グローバル変数を設定(PortalLoc, 配列(ベクトル(-194.732, -92.86, -3.802), ベクトル(-194.585, -92.86, 4.187), ベクトル(-33.165, 14, 5.212), ベクトル(-33.058, 14, -5.55), ベクトル(84.75, 129.008, -3.624), ベクトル(84.534, 129, 4.032)));
            グローバル変数を設定(PortalDest, 配列(ベクトル(-40.19, 13.292, -0.105), ベクトル(78.43, 128.292, 0.149), ベクトル(-190.54, -93.569, 0.122), ベクトル(78.43, 128.292, 0.149), ベクトル(-190.54, -93.569, 0.122), ベクトル(-40.19, 13.292, -0.105)));
        ELSE IF(COMPARE(現在のマップ, ==, マップ(OASIS)));
            "\\"uni > garden\\",\\"uni > city\\",\\"garden > uni\\",\\"garden > city\\",\\"city > garden\\",\\"city > uni\\""
            グローバル変数を設定(PortalNames, 文字列の分割(カスタムストリング("Gardens0City Center0University0City Center0Gardens0University"), 最初の値(NULL)));
            グローバル変数を設定(PortalLoc, 配列(ベクトル(-211.137, 20, -5.084), ベクトル(-211.346, 20, 5.029), ベクトル(143.061, 8.377, -245.04), ベクトル(139.333, 8.377, -249.964), ベクトル(157.297, 12.522, 255.759), ベクトル(151.452, 12.522, 261.099)));
            グローバル変数を設定(PortalDest, 配列(ベクトル(134.366, 7.829, -240.53), ベクトル(158.27, 11.814, 262.272), ベクトル(-206.269, 19.292, 0.103), ベクトル(158.283, 11.814, 262.283), ベクトル(134.318, 7.829, -240.667), ベクトル(-206.269, 19.292, 0.103)));
        ELSE IF(COMPARE(現在のマップ, ==, マップ(ANTARCTIC PENINSULA)));
            グローバル変数を設定(PortalNames, 文字列の分割(カスタムストリング("labs0icebreaker0Sublevel0icebreaker0labs0Sublevel"), 最初の値(NULL)));
            グローバル変数を設定(PortalLoc, 配列(ベクトル(280.66, -12.15, -223.65), ベクトル(273.27, 42.74, 198.15), ベクトル(266.58, 42.74, 198.17), ベクトル(-58.29, -154, 63.03), ベクトル(-58.36, -154, 56.47), ベクトル(287.08, -12.15, -223.59)));
            グローバル変数を設定(PortalDest, 配列(ベクトル(270, 42.7, 190.44), ベクトル(284.07, -12.75, -216.15), ベクトル(-53.51, -154.5, 60.08), ベクトル(284.07, -12.75, -216.15), ベクトル(270, 42.7, 190.44), ベクトル(-53.51, -154.5, 60.08)));
        ELSE IF(COMPARE(現在のマップ, ==, マップ(SAMOA)));
            グローバル変数を設定(PortalNames, 文字列の分割(カスタムストリング("beach0volcano0downtown0volcano0beach0downtown"), 最初の値(NULL)));
            グローバル変数を設定(PortalLoc, 配列(ベクトル(231.98, 7.23, -262.84), ベクトル(236.78, 7.23, -262.75), ベクトル(-327.59, 3.6, -108.69), ベクトル(-332.71, 3.6, -108.59), ベクトル(25.4, 341, 354.38), ベクトル(30, 341, 354.34)));
            グローバル変数を設定(PortalDest, 配列(ベクトル(-329.86, 3.05, -103.4), ベクトル(27.59, 339.76, 348.77), ベクトル(234.07, 6.12, -266.88), ベクトル(27.59, 339.76, 348.77), ベクトル(-329.86, 3.05, -103.4), ベクトル(234.07, 6.12, -266.88)));
    }
}

ルール ("Addon | Little destructo - fence breaker") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        "Made by FishoFire version 1.0\\nwait to overwrite any from copy pastas"
        待機(0.032, 条件無視);
        "first entry will act as index, rest is the points themselves"
        グローバル変数を設定(MapVectorArray, 配列(NULL));
        "tdm/dm = first spawn points, the maps are not big so it just covers entire map. all teams defaults to team 1 spawn\\npush: payload and cp 0 are set but rest isnt. normal payload maps have more then 1 point.\\nrest of maps have up to 3 points"
        グローバル変数を変更(MapVectorArray, 配列に追加, IF-THEN-ELSE(COMPARE(現在のゲーム・モード, ==, ゲーム・モード(キャプチャー・ザ・フラッグ)), 配列(フラッグの位置(チーム1), フラッグの位置(チーム2)), IF-THEN-ELSE(含む配列(配列(ゲーム・モード(チーム・デスマッチ), ゲーム・モード(デスマッチ)), 現在のゲーム・モード), 最初の値(リスポーン地点(すべてのチーム)), IF-THEN-ELSE(AND(最初の値(ペイロードの位置), NOT(追加(目標の位置(True), 目標の位置(2)))), ペイロードの位置, 配列(目標の位置(False), 目標の位置(True), 目標の位置(2))))));
        "explode in a grid around the selected points"
        WHILE(COMPARE(カウント: (グローバル.MapVectorArray), >, 1));
            インデックスのグローバル変数を設定(MapVectorArray, False, NULL);
            WHILE(COMPARE(最初の値(グローバル.MapVectorArray), <, 256));
                投射物を作成(オーブ投射物, NULL, 追加(追加(減算(配列内の値(グローバル.MapVectorArray, True), ベクトル(240, False, 240)), 乗算(剰余(最初の値(グローバル.MapVectorArray), 16), 乗算(30, 左))), 乗算(整数への四捨五入(除算(最初の値(グローバル.MapVectorArray), 16), 下), 乗算(30, 前方向))), 下, 対ワールド: , 回復, チーム1, 0, 0, 30, いい爆発, 爆発音, 1, 1, 0, 0, 0, 0);
                配列内の値(グローバル.MapVectorArray, 0) += True;
                "use modulo to only wait every x orbs keep the 0 change the other number"
                IF(NOT(剰余(最初の値(グローバル.MapVectorArray), 3)));
                    待機(False, 条件無視);
                END;
            END;
            グローバル変数を変更(MapVectorArray, インデックスを配列から削除, True);
        END;
        "handle exceptions (looking at you new queen street)"
        グローバル変数を設定(MapVectorArray, 配列(ベクトル(8.276, 4.113, 15.261), ベクトル(-8.319, 2.624, 14.245), ベクトル(0.006, 4.821, 18.513)));
        WHILE(カウント: (グローバル.MapVectorArray));
            "same as other projectile before"
            投射物を作成(オーブ投射物, NULL, 最初の値(グローバル.MapVectorArray), 下, 対ワールド: , 回復, チーム1, 0, 0, 30, いい爆発, 爆発音, 1, 1, 0, 0, 0, 0);
            グローバル変数を変更(MapVectorArray, インデックスを配列から削除, False);
            待機(False, 条件無視);
        END;
        グローバル変数を設定(MapVectorArray, NULL);
    }
}

ルール ("Addon | Cache jump & crouch inputs for spectators") {
    イベント {
        プレイヤーがマッチに参加;
        すべて;
        すべて;
    }
    アクション {
        待機(False, 条件無視);
        プレイヤー変数を設定(イベント・プレイヤー, cache_inputs, ベクトル(ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)), ボタンが長押しされている(イベント・プレイヤー, ボタン(しゃがみ)), False));
        ループ;
    }
}

ルール ("Addon | SUB Basic Map Validator") {
    イベント {
        サブルーチン;
        AddonCheckMap;
    }
    アクション {
        中止する条件(COMPARE(カウント: (グローバル.A), <=, 1));
        ダミーボットを作成(ヒーロー(アナ), IF-THEN-ELSE(COMPARE(スロットの数(チーム1), <, スロットの数(チーム2)), チーム1, チーム2), -1, 最初の値(グローバル.A), NULL);
        グローバル変数を設定(MsDestructo, 最新のエンティティ);
        移動時の環境との衝突判定を無効化(グローバル.MsDestructo, False);
        ステータスを設定(グローバル.MsDestructo, NULL, フェーズアウト中, 999999999999);
        目視可否を設定(グローバル.MsDestructo, すべて);
        プレイヤーのスケールを開始(グローバル.MsDestructo, 3.111111111111110, False);
        重力を設定(グローバル.MsDestructo, 999999999999);
        "Not infinity incase dummy does not spawn"
        条件待機(スポーンした(グローバル.MsDestructo), 16);
        プレイヤー変数用(グローバル.MsDestructo, checkpoint_current, 1, カウント: (グローバル.A), True);
            IF(AND(最初の値(最も近い歩行可能な位置(配列内の値(グローバル.A, (グローバル.MsDestructo).checkpoint_current))), COMPARE(二点間の距離(配列内の値(グローバル.A, (グローバル.MsDestructo).checkpoint_current), 最も近い歩行可能な位置(配列内の値(グローバル.A, (グローバル.MsDestructo).checkpoint_current))), >, 1.4)));
                プレイヤーの位置強制を開始(グローバル.MsDestructo, レイ・キャストのヒット位置(追加(配列内の値(グローバル.A, (グローバル.MsDestructo).checkpoint_current), 乗算(1.4, 上)), 追加(配列内の値(グローバル.A, (グローバル.MsDestructo).checkpoint_current), 乗算(-1.4, 上)), 空の配列, 空の配列, False), True);
                待機(0.112, 条件無視);
                プレイヤーの位置強制を停止(グローバル.MsDestructo);
                条件待機(地上にいる(グローバル.MsDestructo), True);
                スキップする条件(AND(地上にいる(グローバル.MsDestructo), COMPARE(二点間の距離(グローバル.MsDestructo, 配列内の値(グローバル.A, (グローバル.MsDestructo).checkpoint_current)), <=, 1.4)), 11);
                プレイヤー変数用(グローバル.MsDestructo, checkpoint_practice, 1.4, 1.2, -0.2);
                    プレイヤーの位置強制を開始(グローバル.MsDestructo, 追加(配列内の値(グローバル.A, (グローバル.MsDestructo).checkpoint_current), 乗算(上, (グローバル.MsDestructo).checkpoint_practice)), True);
                    待機(0.112, 条件無視);
                    プレイヤーの位置強制を停止(グローバル.MsDestructo);
                    条件待機(地上にいる(グローバル.MsDestructo), True);
                    スキップする条件(AND(地上にいる(グローバル.MsDestructo), COMPARE(二点間の距離(グローバル.MsDestructo, 配列内の値(グローバル.A, (グローバル.MsDestructo).checkpoint_current)), <=, 1.4)), 5);
                END;
                インスペクターでの記録を有効化;
                インスペクターに記録(カスタムストリング("Fail {0}", (グローバル.MsDestructo).checkpoint_current));
                インスペクターでの記録を無効化;
            END;
            //lbl_MapChecker_nextCp:
        END;
        プレイヤー変数を設定(グローバル.MsDestructo, editor_saveCache, グローバル.EditorOn);
        グローバル変数を設定(EditorOn, NULL);
        インスペクターでの記録を有効化;
        インスペクターに記録(カスタムストリング("■ Map Check Complete ■"));
        インスペクターでの記録を無効化;
        グローバル変数を設定(EditorOn, (グローバル.MsDestructo).editor_saveCache);
        ダミーボットを破壊する(チーム: (グローバル.MsDestructo), スロット: (グローバル.MsDestructo));
        グローバル変数を設定(MsDestructo, NULL);
    }
}

ルール ("Addon | SUB 3rd Person Camera") {
    イベント {
        サブルーチン;
        Addon3rdPerson;
    }
    アクション {
        IF((イベント・プレイヤー).addon_toggle3rdPov);
            カメラの始動(イベント・プレイヤー, フレームごとに更新(追加(レイ・キャストのヒット位置(追加(乗算(0.5, 上), 目の位置(イベント・プレイヤー)), 追加(追加(乗算(0.5, 上), 目の位置(イベント・プレイヤー)), 乗算(-3.5, プレイヤーが向いている方向: (イベント・プレイヤー))), 空の配列, 空の配列, False), 乗算(0.5, プレイヤーが向いている方向: (イベント・プレイヤー)))), フレームごとに更新(追加(乗算(0.5, 上), 目の位置(イベント・プレイヤー))), False);
        ELSE;
            カメラの停止(イベント・プレイヤー);
        END;
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("Ø Map Data - 数据录入 <---- INSERT HERE / 在这输入") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("☞ Credits and Colors here - 作者代码HUD颜色 <---- INSERT HERE / 在这输入") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        待機(False, 条件無視);
        "Filling this in adds it to the inspector pasta after next restart.\\nYou can fill in again to overwrite.\\n修改的内容 在重新开始 比赛后生效\\n您可以反复 修改字符串 中的内容"
        グローバル変数を設定(Name, カスタムストリング("name here - 作者"));
        グローバル変数を設定(Code, カスタムストリング("code here - 代码"));
        "+++++  +++++  +++++  +++++  +++++  +++++\\ncolor customization below / 自定义 颜色(实体、HUD)\\n+++++  +++++  +++++  +++++  +++++  +++++\\n\\ncredit hud name   -   作者HUD"
        インデックスのグローバル変数を設定(ColorConfig, False, 色(バイオレット));
        "credit hud code   -   代码HUD"
        インデックスのグローバル変数を設定(ColorConfig, True, 色(スカイブルー));
        "dsc.gg/genjiparkour"
        インデックスのグローバル変数を設定(ColorConfig, 18, 色(アクア));
        "server time hud   -   房间倒计时"
        インデックスのグローバル変数を設定(ColorConfig, 2, 色(赤));
        "time  hud   -   单关用时HUD"
        インデックスのグローバル変数を設定(ColorConfig, 3, 色(白));
        "level hud   -   关卡HUD"
        インデックスのグローバル変数を設定(ColorConfig, 4, 色(白));
        "command hud   -   指令HUD"
        インデックスのグローバル変数を設定(ColorConfig, 5, 色(白));
        "command hud highlight   -   指令HUD高亮"
        インデックスのグローバル変数を設定(ColorConfig, 6, 色(緑));
        "bhop/climb available   -   小跳/爬墙未用HUD"
        インデックスのグローバル変数を設定(ColorConfig, 7, 色(緑));
        "bhop/climb used (cant be same as available)   -   小跳/爬墙已用HUD"
        インデックスのグローバル変数を設定(ColorConfig, 8, 色(赤));
        "current checkpoint ring   -   当前检查点光圈"
        インデックスのグローバル変数を設定(ColorConfig, 9, 色(スカイブルー));
        "next checkpoint ring   -   下一关检查点光圈"
        インデックスのグローバル変数を設定(ColorConfig, 10, 色(ライムグリーン));
        "next checkpoint light shaft   -   下一关检查点光柱"
        インデックスのグローバル変数を設定(ColorConfig, 11, 色(白));
        "next checkpoint icon   -   下一关检查点图标"
        インデックスのグローバル変数を設定(ColorConfig, 12, 色(スカイブルー));
        "\\"come here\\" text   -   到这里来\\" 文本"
        インデックスのグローバル変数を設定(ColorConfig, 13, 色(白));
        "kill orbs   -   击杀球"
        インデックスのグローバル変数を設定(ColorConfig, 14, 色(青));
        "normal orbs   -   弹球"
        インデックスのグローバル変数を設定(ColorConfig, 15, 色(緑));
        "lock orbs (overwritten if its same as normal)\\n收集球 (与普通弹 球相同时将 自动覆写)"
        インデックスのグローバル変数を設定(ColorConfig, 16, 色(オレンジ));
        "portals   -   自定义 传送门"
        インデックスのグローバル変数を設定(ColorConfig, 17, 色(白));
    }
}

ルール ("Instructions for Depricated Rules (ban / portal / dash /ult) - 旧版编辑器中已弃用规则指引 (单关封禁 / 传送门 / 给刀给S)") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        "The following rules should now be handled with the ingame editor\\n- Ban per checkpoint\\n- Dash/Ult per checkpoint\\n- Custom portals"
        中止;
        "When updating old maps, these things should be added to your map data.\\nThis is done with the instructions below"
        中止;
        "step 1) Open the old rule\\nstep 2) Select the variables and press copy\\n(do not select waits or workshop toggles, only select variables)\\nstep 3) Go to map data rule and paste this the variables"
        中止;
        "以下规则现在 要用游戏内置 编辑器编辑\\n- 单关 封禁(卡小、蹭留等)\\n- 检查点给 刀给S\\n- 自定义 传送门"
        中止;
        "当更新旧 图数据 时，以上 这些东西 应该放 到地图 数据里\\n以下是一 些更新旧 图数据 指引:"
        中止;
        "步骤 1) 找到旧图 数据的 规则\\n步骤 2) 选中旧图 数据的 全局变 量并复制\\n(不要复制含 等待 地图工坊设置 的指令, 只要 全局变量 的数据)\\n步骤 3) 将全局变 量数据粘 贴到新版 编辑器的 地图数 据规则"
        中止;
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Addons Settings & Data - 附加组件 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

ルール ("Addon | Comp Mode instruction message - 竞赛模式指引消息 <---- INSERT HERE / 在这输入") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        待機(0.4, 条件無視);
        "Instructions that show when you start comp mode.\\nDue to the hud text limit, you there is 4 huds available.\\nIf you dont need a field just empty the textfield."
        中止;
        "竞赛模式 指引消息\\n指引消息将 会在竞赛模 式开始时 显示\\n由于 hud 文本限制，你有 4 个hud可用\\n如果你不需 要一个字段 只是空文 本字段"
        グローバル変数を設定(instructiontext, 文字列の分割(カスタムストリング("Change in Comp Mode instruction message hud 10Change in Comp Mode instruction message hud 20Change in Comp Mode instruction m{0}", カスタムストリング("essage hud 30Change in Comp Mode instruction message hud 4")), 最初の値(NULL)));
    }
}

無効 ルール ("Addon | Custom difficulty hud  - 自定义难度hud <---- INSERT HERE / 在这输入") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        "1) workshop settings > difficulty > set to \\"dont display\\"\\n2) enable this rule\\n3) type your difficulty in the hud below"
        待機(2.5, 条件無視);
        "1) 地图工坊设 置难度改为 “不显示”\\n2) 勾选此规则 点击上方的 开启/关闭 开启此规则\\n3) 修改下面的 创建hud文本 中的“enter custom difficulty here”"
        HUDテキストを作成(最初の値(True), IF-THEN-ELSE(最後の値(グローバル.Difficultyhud), IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("游戏测试"), カスタムストリング("Playtest")), 空の配列), カスタムストリング("enter custom difficulty here"), NULL, トップ, -173, 色(青), 色(緑), NULL, 表示される相手、文字列, デフォルト表示);
    }
}

無効 ルール ("Addon | Title Data - 标题数据 <---- EDIT ME / 在此处编辑") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        "enable this rule and fill in the title data below.\\n启用此规则 并填写下面 的标题数据"
        待機(0.768, 条件無視);
        "checkpoint number\\n每关数量"
        インデックスのグローバル変数を設定(TitleData, False, 配列(NULL, 10, 20, 30, 40, 50));
        "title\\n标题文本"
        インデックスのグローバル変数を設定(TitleData, True, 文字列の分割(カスタムストリング("Bunny0Jumper0Ninja0Pro0Expert0Master"), 最初の値(NULL)));
        "color\\n颜色"
        インデックスのグローバル変数を設定(TitleData, 2, 配列(色(ライムグリーン), 色(白), 色(黄色), 色(オレンジ), 色(紫), 色(赤)));
    }
}

無効 ルール ("Addon | Friend Title - 朋友称号 <---- DISPLAY MESSAGE HERE (ON PLAYER)") {
    イベント {
        プレイヤーがマッチに参加;
        すべて;
        すべて;
    }
    アクション {
        "\\"your nickname\\" your friends ingame name\\n\\"display title\\" fill in the custom title\\n修改字符串 \\"your nickname <-------\\" 为好友名字 区分大小写\\n修改字符串 \\"display title\\" 为好友头顶 显示的称号"
        条件待機(スポーンした(イベント・プレイヤー), 999999999999);
        IF(COMPARE(カスタムストリング("your nickname <-------"), ==, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列)));
            大きなメッセージ(最初の値(True), カスタムストリング("Message to the whole room"));
            ワールド内テキストを作成(最初の値(NOT((イベント・プレイヤー).toggle_invisible)), カスタムストリング("display title"), イベント・プレイヤー, 1.5, 表面に対してクリップ, 表示される相手、位置、文字列, 色(オレンジ), デフォルト表示);
        END;
        IF(COMPARE(カスタムストリング("your nickname <-------"), ==, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列)));
            大きなメッセージ(最初の値(True), カスタムストリング("Message to the whole room"));
            ワールド内テキストを作成(最初の値(NOT((イベント・プレイヤー).toggle_invisible)), カスタムストリング("display title"), イベント・プレイヤー, 1.5, 表面に対してクリップ, 表示される相手、位置、文字列, 色(オレンジ), デフォルト表示);
        END;
        IF(COMPARE(カスタムストリング("your nickname <-------"), ==, 文字列の分割(最初の値(イベント・プレイヤー), 空の配列)));
            大きなメッセージ(最初の値(True), カスタムストリング("Message to the whole room"));
            ワールド内テキストを作成(最初の値(NOT((イベント・プレイヤー).toggle_invisible)), カスタムストリング("display title"), イベント・プレイヤー, 1.5, 表面に対してクリップ, 表示される相手、位置、文字列, 色(オレンジ), デフォルト表示);
    }
}

無効 ルール ("Addon | Display Author Time - 展示世界纪录 <---- EDIT ME / 在此处编辑") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        "type your entry in the textfield that says \\"name and time here\\"\\n在文本框 中输入“名称和时间”"
        HUDテキストを作成(最初の値(True), NULL, カスタムストリング(" \\n{0} author time {0}", アイコンストリング(砲撃)), カスタムストリング("name and time here"), 右, -142, NULL, 色(ローズ), 色(ローズ), 目視可能: , デフォルト表示);
    }
}

無効 ルール ("Addon | HUD text for certain Checkpoints - 特定关卡显示的HUD文本 <---- EDIT ME / 在此处编辑") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        "the example fill shows a text for cp 1 and cp 3\\n示例已填写 关卡1和3 的hud文本"
        待機(0.768, 条件無視);
        "in CpHudText fill in text\\n修改字符串 “CpHudText” 为顶部显示 的hud文本"
        グローバル変数を設定(CpHudText, 文字列の分割(カスタムストリング("text cp 10text cp 3"), 最初の値(NULL)));
        "in CpHudCp fill in the at wich to display\\n修改数组 “CpHudCp” 为hud文本 显示的关卡"
        グローバル変数を設定(CpHudCp, 配列(1, 3));
    }
}

無効 ルール ("Addon | Inworld text for certain Checkpoints - 特定关卡显示的地图文本 <---- EDIT ME / 在此处编辑") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        "the example fill shows a text for cp 1 and cp 3\\n示例已填写 关卡1和3 的地图文本"
        待機(0.768, 条件無視);
        "in CpIwtText fill in text\\n修改字符串 “CpIwtText” 为关卡显示 的地图文本"
        グローバル変数を設定(CpIwtText, 文字列の分割(カスタムストリング("text cp 10text cp 3"), 最初の値(NULL)));
        "in CpIwtCp fill in cp at wich to display\\n修改数组 “CpIwtCp” 为显示地图 文本的关卡"
        グローバル変数を設定(CpIwtCp, 配列(1, 3));
        "in CpIwtPos fill in the vector\\n修改数组 “CpIwtPos” 为地图文本 的矢量位置"
        グローバル変数を設定(CpIwtPos, 配列(ベクトル(True, True, True), ベクトル(True, True, True)));
        "color applies to all\\n选择应用到 所有地图文 本的颜色"
        グローバル変数を設定(CpIwtColor, 色(ライムグリーン));
    }
}

無効 ルール ("Addon | Hint text for certain Checkpoints - 特定关卡的提示文本 <---- EDIT ME / 在此处编辑") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        "the example fill shows a text for cp 1 and cp 3\\n示例已填写 关卡1和3 的提示文本"
        待機(0.768, 条件無視);
        "in HintText fill in text\\n修改字符串 “HintText” 为关卡显示 的提示文本"
        グローバル変数を設定(HintText, 文字列の分割(カスタムストリング("text cp 10text cp 3"), 最初の値(NULL)));
        "in HintCp fill in the at wich to display\\n修改数组 “HintCp” 为提示文本 显示的关卡"
        グローバル変数を設定(HintCp, 配列(1, 3));
    }
}

無効 ルール ("Addon | 3rd Person Camera Mode - 第三人称") {
    イベント {
        プレイヤーがマッチに参加;
        すべて;
        すべて;
    }
    アクション {
        "Default 1st person: False\\nDefault 3rd person: True"
        プレイヤー変数を設定(イベント・プレイヤー, addon_toggle3rdPov, True);
        サブルーチンの呼び出し(Addon3rdPerson);
    }
}

ルール ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Addons Skills - 附加组件技能 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    イベント {
        進行中 - グローバル;
    }
}

無効 ルール ("Addon | Stall Enhancer - 增强系統跳的判定") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        スポーンした(イベント・プレイヤー) == True;
        垂直速度: (イベント・プレイヤー) >= -0.2;
        垂直速度: (イベント・プレイヤー) <= 0.05;
        水平速度: (イベント・プレイヤー) <= 1.3;
        空中にいる(イベント・プレイヤー) == True;
        グローバル.EditorOn != False;
        (イベント・プレイヤー).editor_fly == False;
    }
    アクション {
        待機(0.25, 「FALSE」の場合中止);
        プレイヤーの位置強制を開始(イベント・プレイヤー, 位置: (イベント・プレイヤー), False);
        条件待機(NOT(移動している(イベント・プレイヤー)), 1);
        プレイヤーの位置強制を停止(イベント・プレイヤー);
        移動速度を設定(イベント・プレイヤー, False);
        重力を設定(イベント・プレイヤー, False);
        "double jump catch"
        条件待機(OR(OR(OR(OR(ボタンが長押しされている(イベント・プレイヤー, ボタン(リロード)), (イベント・プレイヤー).editor_fly), 倒れている(イベント・プレイヤー)), アビリティ1を使用(イベント・プレイヤー)), COMPARE(速さ: (イベント・プレイヤー), >, 3)), 3);
        "wait(3)"
        重力を設定(イベント・プレイヤー, 100);
        移動速度を設定(イベント・プレイヤー, 100);
        IF(AND(生存している(イベント・プレイヤー), NOT(OR((イベント・プレイヤー).editor_fly, ボタンが長押しされている(イベント・プレイヤー, ボタン(リロード))))));
            推進力を適用(イベント・プレイヤー, 上, 10, 対ワールド: , 逆モーションXYZをキャンセル);
            条件が「TRUE」の場合ループ;
    }
}

無効 ルール ("Addon | Fake Ledge Dash - 超级跳") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        "Version 2"
        アビリティ1を使用(イベント・プレイヤー) == True;
        速さ: (イベント・プレイヤー) < 45;
        Z成分: (スロットル: (イベント・プレイヤー)) > NULL;
        絶対値(減算(垂直速度: (イベント・プレイヤー), 7)) < 0.8;
    }
    アクション {
        "Dash into a wall/edge\\nRelease wall/edge before dash ends"
        プレイヤー変数を設定(イベント・プレイヤー, addon_ledgeDash, プレイヤーが向いている方向: (イベント・プレイヤー));
        "25 * 0.016"
        条件待機(NOT(アビリティ1を使用(イベント・プレイヤー)), True);
        IF(空中にいる(イベント・プレイヤー));
            推進力を適用(イベント・プレイヤー, (イベント・プレイヤー).addon_ledgeDash, 50, 対ワールド: , 逆モーションXYZをキャンセル);
    }
}

無効 ルール ("Addon | Group up - Map Data") {
    イベント {
        進行中 - グローバル;
    }
    アクション {
        "replace 777 with checkpoint number\\nreplace vector 0,0,0 with orb position"
        ワールド内テキストを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), COMPARE((現在の配列の要素).checkpoint_current, ==, 777)), カスタムストリング("{0} {1} {0}", アビリティアイコンストリング(ヒーロー(ゲンジ), ボタン(アルティメット)), IF-THEN-ELSE(COMPARE(文字列("うーん"), ==, カスタムストリング("噢")), カスタムストリング("待在这里"), カスタムストリング("group up"))), ベクトル(True, True, True), 1.5, クリップしない, 表示される相手、文字列, 色(オレンジ), デフォルト表示);
        "replace 777 with checkpoint number\\nreplace vector 0,0,0 with orb position\\n3.5 is the radius"
        エフェクトを作成(フィルタリングされた配列(すべてのプレイヤー(すべてのチーム), COMPARE((現在の配列の要素).checkpoint_current, ==, 777)), 球体, 色(オレンジ), ベクトル(True, True, True), 3.5, 目視可能: );
    }
}

無効 ルール ("Addon | Group Up") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        "replace 777 with checkpoint number"
        (イベント・プレイヤー).checkpoint_current == 777;
        生存している(イベント・プレイヤー) == True;
        地上にいる(イベント・プレイヤー) == False;
        (イベント・プレイヤー).toggle_invincible == False;
        "replace vector 0,0,0 with orb position\\n3.5 is the radius"
        二点間の距離(イベント・プレイヤー, ベクトル(True, True, True)) < 3.5;
    }
    アクション {
        小さなメッセージ(イベント・プレイヤー, カスタムストリング("   stay in the bubble"));
        待機(True, 「FALSE」の場合中止);
        小さなメッセージ(イベント・プレイヤー, カスタムストリング("   9"));
        待機(True, 「FALSE」の場合中止);
        小さなメッセージ(イベント・プレイヤー, カスタムストリング("   8"));
        待機(True, 「FALSE」の場合中止);
        小さなメッセージ(イベント・プレイヤー, カスタムストリング("   7"));
        待機(True, 「FALSE」の場合中止);
        小さなメッセージ(イベント・プレイヤー, カスタムストリング("   6"));
        待機(True, 「FALSE」の場合中止);
        小さなメッセージ(イベント・プレイヤー, カスタムストリング("   5"));
        待機(True, 「FALSE」の場合中止);
        小さなメッセージ(イベント・プレイヤー, カスタムストリング("   4"));
        待機(True, 「FALSE」の場合中止);
        小さなメッセージ(イベント・プレイヤー, カスタムストリング("   3"));
        待機(True, 「FALSE」の場合中止);
        小さなメッセージ(イベント・プレイヤー, カスタムストリング("   2"));
        待機(True, 「FALSE」の場合中止);
        小さなメッセージ(イベント・プレイヤー, カスタムストリング("   1"));
        待機(True, 「FALSE」の場合中止);
        プレイヤーの位置強制を開始(イベント・プレイヤー, 追加(配列内の値(グローバル.A, 追加((イベント・プレイヤー).checkpoint_current, True)), 乗算(0.1, 上)), False);
        ステータスを設定(イベント・プレイヤー, NULL, 固定されている, 0.3);
        待機(0.112, 条件無視);
        プレイヤーの位置強制を停止(イベント・プレイヤー);
    }
}

無効 ルール ("Addon | Custom checkpoint loading or resetting") {
    イベント {
        サブルーチン;
        AddonCustomLoadAndReset;
    }
    アクション {
        "This subroutine activates on failing, arriving, resetting, skipping etc\\nexample: reset gravity and movespeed after being changed by custom orbs"
        重力を設定(イベント・プレイヤー, 100);
        移動速度を設定(イベント・プレイヤー, 100);
    }
}

無効 ルール ("Addon | Custom Orb Script") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        すべて;
    }
    条件 {
        "Do not edit this condition !!!!!!!!!!!!!!!!!"
        (イベント・プレイヤー).cache_bounceTouched >= NULL;
    }
    アクション {
        "Note that the ID can change if you place or delete orbs infront of that orb.\\nAdd the desired ID numbers for the orb in the array\\nadd the script after it\\nyou can use the activateed sub above this rule to reset the effects"
        IF(含む配列(配列(1, 2), (イベント・プレイヤー).cache_bounceTouched));
            "example gravity (should be reset to 100 in AddonCustomLoadAndReset)"
            重力を設定(イベント・プレイヤー, 25);
            小さなメッセージ(イベント・プレイヤー, カスタムストリング(" You Feel Light"));
            待機(2, 条件無視);
            重力を設定(イベント・プレイヤー, 100);
        END;
        IF(含む配列(配列(3, 4), (イベント・プレイヤー).cache_bounceTouched));
            "example canceling primary makes double jump recover"
            メインアクションをキャンセル(イベント・プレイヤー);
            プレイヤー変数を設定(イベント・プレイヤー, skill_usedDouble, NULL);
            小さなメッセージ(イベント・プレイヤー, カスタムストリング(" Double Jump Recovered"));
        END;
        IF(含む配列(配列(5, 6), (イベント・プレイヤー).cache_bounceTouched));
            "example move speed"
            移動速度を設定(イベント・プレイヤー, 250);
            小さなメッセージ(イベント・プレイヤー, カスタムストリング(" Zooom"));
            待機(2, 条件無視);
            移動速度を設定(イベント・プレイヤー, 100);
    }
}

無効 ルール ("Addon | Fake Triple Jump - 假三段跳") {
    イベント {
        進行中 - 各プレイヤー;
        すべて;
        ゲンジ;
    }
    条件 {
        "@Condition BanTriple == false"
        地上にいる(イベント・プレイヤー) == False;
        "Double cannot be used already"
        (イベント・プレイヤー).skill_usedDouble == False;
        "Don't activate on reset"
        ボタンが長押しされている(イベント・プレイヤー, ボタン(リロード)) == False;
    }
    アクション {
        "Enable checking double jump"
        プレイヤー変数を設定(イベント・プレイヤー, addon_enableDoubleChecks, True);
        待機(False, 条件無視);
        条件が「TRUE」の場合ループ;
        中止する条件(OR((イベント・プレイヤー).skill_usedDouble, ボタンが長押しされている(イベント・プレイヤー, ボタン(リロード))));
        "Input window to Triple"
        条件待機(AND(ジャンプ中(イベント・プレイヤー), ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ))), 0.048);
        IF(AND(ボタンが長押しされている(イベント・プレイヤー, ボタン(ジャンプ)), ジャンプ中(イベント・プレイヤー)));
            推進力を適用(イベント・プレイヤー, 上, 9, 対ワールド: , 逆モーションXYZをキャンセル);
        ELSE;
            条件が「TRUE」の場合ループ;
    }
}


`;