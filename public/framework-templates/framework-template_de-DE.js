// framework-template_de-DE.js (auto)
export const frameworkTemplate = `einstellungen
{
	hauptregeln
	{
		Modusname: "Genji Parkour - 源氏跑酷 - v1.10.4A"
		Beschreibung: "\\n\\n\\n◀ The Official Genji Parkour Editor ▶\\nCode: 54CRY\\nAdapted by: LulledLion, FishoFire, Nebula\\nv1.10.4A"
	}
	Lobby
	{
		Spieler in der Spielsuche zulassen: Ja
		Voicechat Match: Deaktiviert
		Max. Anzahl Zuschauer: 3
		Max. Anzahl Spieler Team 1: 11
		Max. Anzahl Spieler Team 2: 0
		Zurück zur Lobby: Nie
		Seitenwechsel nach Match: Nein
	}
	modi
	{
		Allgemein
		{
			Heldenwechsel zulassen: Aus
			Gegnerische Trefferpunktebalken: Aus
			Start des Spielmodus: Sofort
			Heldenbegrenzung: Aus
			Killcam: Aus
			Killfeed: Aus
			Wiederbelebungszeit: 0%
			Medikits: Deaktiviert
			Zufälliger Held nach Tod: Ein
		}
		Übungsgefecht
		{
			verfügbare karten
			{
			}
			Boni aktivieren: Aus
		}
		Team-Deathmatch
		{
			verfügbare karten
			{
			}
			Boni aktivieren: Aus
			Selbst ausgelöste Wiederbelebung: Aus
		}
		deaktiviert Kopfgeldjäger
		{
			Boni aktivieren: Aus
		}
		deaktiviert Flaggeneroberung
		{
			Boni aktivieren: Aus
		}
		deaktiviert Eliminierung
		{
			Boni aktivieren: Aus
		}
		deaktiviert Trainingsbereich
		{
			Boni aktivieren: Aus
		}
	}
	helden
	{
		Allgemein
		{
			Genji
			{
				Reflektieren: Aus
				Unbegrenzte Munition: Ein
				Sturmschlag – Abklingzeit: 1%
				Ultimatedauer: 25%
				Ultimeteraufladung – Passiv Drachenklinge: 0%
				Ultimeteraufladung Drachenklinge: 10%
			}
			verfügbare helden
			{
				Genji
			}
		}
	}
	Erweiterungen
	{
		Mehr Bots erschaffen
		Mehr Effekte abspielen
	}
}
Variablen {
    global:
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
    player:
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
Subroutinen {
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
regel ("Disable inspector") {
    event {
        Ongoing - Global;
    }
    aktionen {
        Disable Inspector Recording;
    }
}

regel ("OverPy | Global Init") {
    event {
        Ongoing - Global;
    }
    aktionen {
        Set Global Variable(__overpyTranslationHelper__, String Split(Custom String("0White0흰색0白色"), First Of(Null)));
    }
}

//Optimize for size enabled
regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Parkour v1.10.4A ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("Parkour | Setup & Variables") {
    event {
        Ongoing - Global;
    }
    aktionen {
        "◀ The Official Genji Parkour Editor ▶\\nDiscord: dsc.gg/genjiparkour\\nCode: 54CRY\\nAdapted by: LulledLion, FishoFire, Nebula"
        Disable Built-In Game Mode Completion;
        Disable Built-In Game Mode Scoring;
        Disable Built-In Game Mode Music;
        Disable Built-In Game Mode Announcer;
        Start Forcing Spawn Room(All Teams, False);
        Start Forcing Spawn Room(All Teams, 1);
        Start Forcing Spawn Room(All Teams, 2);
        "wait for map data rule"
        Wait(0.24, Ignore Condition);
        "Turn Editor On"
        Set Global Variable(EditorOn, Workshop Setting Toggle(Custom String("Map Settings ■ 地图设置 ■ 맵 설정"), Custom String("Editor Mode ■ 作图模式 ■ 수정 모드"), False, 0));
        If(Workshop Setting Toggle(Custom String("Map Settings ■ 地图设置 ■ 맵 설정"), Custom String("Basic Map Validator ■ 验证地图 ■ 맵 가능 여부 확인기"), True, 3));
            Start Rule(AddonCheckMap, Do Nothing);
        End;
        Set Global Variable(PortalOn, Workshop Setting Toggle(Custom String("Map Settings ■ 地图设置 ■ 맵 설정"), Custom String("Portals 󠀨Control Maps󠀩 ■ 启用传送门 󠀨占点地图󠀩 ■ 순간이동 활성화 󠀨쟁탈 맵󠀩"), True, 4));
        Set Global Variable(CompMode, And(Not(Global.EditorOn), Workshop Setting Toggle(Custom String("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), Custom String("Tournament Mode ■ 开启竞赛模式 ■ 토너먼트 모드 활성화"), False, 100)));
        If(Global.CompMode);
            "-! comp minutes !-\\n5-240"
            Set Global Variable(CompTime, Workshop Setting Integer(Custom String("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), Custom String("Time Limit 󠀨Global󠀩 ■ 时间限制 ■ 시간 제한 󠀨전체󠀩"), 120, 1, 240, 101));
            "-! comp attempt count !-"
            Set Global Variable(CompAtmpNum, Workshop Setting Integer(Custom String("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), Custom String("Attempt Count ■ 尝试次数 ■ 시도 수 확인"), 5, 0, 500, 102));
            "-! comp restartlimiter !-"
            Set Global Variable(CompRestartLimit, Workshop Setting Toggle(Custom String("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), Custom String("Disable Restart During Run ■ 竞赛中禁用重新开始 ■ 시도 중 재시작 비활성화"), False, 103));
        Else;
            Set Global Variable(instructiontext, Null);
        End;
        Set Global Variable(SaveName, Empty Array);
        Set Global Variable(SaveCp, Empty Array);
        Set Global Variable(SaveTimer, Empty Array);
        Set Global Variable(SaveEnt, Empty Array);
        Set Global Variable(SaveElapsed, Empty Array);
        Set Global Variable(Dao, If-Then-Else(Count Of(Global.Dao), Filtered Array(Global.Dao, Compare(Add(Current Array Element, False), >=, Null)), Empty Array));
        Set Global Variable(SHIFT, If-Then-Else(Count Of(Global.SHIFT), Filtered Array(Global.SHIFT, Compare(Add(Current Array Element, False), >=, Null)), Empty Array));
        Set Global Variable(pinballnumber, If-Then-Else(Count Of(Global.pinballnumber), Global.pinballnumber, Empty Array));
        Set Global Variable(A, If-Then-Else(Count Of(Global.A), Global.A, Empty Array));
        Set Global Variable(A, If-Then-Else(Count Of(Global.A), Global.A, Empty Array));
        Set Global Variable(killballnumber, If-Then-Else(Count Of(Global.killballnumber), Global.killballnumber, Empty Array));
        Set Global Variable(H, If-Then-Else(Count Of(Global.H), Global.H, Empty Array));
        Set Global Variable(I, If-Then-Else(Count Of(Global.I), Global.I, Empty Array));
        Set Global Variable(K, If-Then-Else(Count Of(Global.K), Global.K, Empty Array));
        Set Global Variable(TQ, If-Then-Else(Count Of(Global.TQ), Global.TQ, Empty Array));
        Set Global Variable(TQ2, If-Then-Else(Count Of(Global.TQ2), Global.TQ2, Empty Array));
        Set Global Variable(EditMode, If-Then-Else(Count Of(Global.EditMode), Global.EditMode, Empty Array));
        Set Global Variable(TQ5, If-Then-Else(Count Of(Global.TQ5), Global.TQ5, Empty Array));
        Set Global Variable(TQ6, If-Then-Else(Count Of(Global.TQ6), Global.TQ6, Empty Array));
        Set Global Variable(BounceToggleLock, If-Then-Else(Count Of(Global.BounceToggleLock), Global.BounceToggleLock, Empty Array));
        Set Global Variable(CustomPortalStart, If-Then-Else(Count Of(Global.CustomPortalStart), Global.CustomPortalStart, Empty Array));
        Set Global Variable(CustomPortalEndpoint, If-Then-Else(Count Of(Global.CustomPortalEndpoint), Global.CustomPortalEndpoint, Empty Array));
        Set Global Variable(CustomPortalCP, If-Then-Else(Count Of(Global.CustomPortalCP), Global.CustomPortalCP, Empty Array));
        Set Global Variable(LeaderBoardFull, Empty Array);
        Set Global Variable(TitleData, Null);
        Set Global Variable(HintCp, Empty Array);
        Set Global Variable(HintText, Empty Array);
        "clean out -1's after the ban has loaded"
        Set Global Variable(BanBhop, If-Then-Else(Count Of(Global.BanBhop), Filtered Array(Global.BanBhop, Compare(Add(Current Array Element, False), >=, Null)), Empty Array));
        Set Global Variable(BanClimb, If-Then-Else(Count Of(Global.BanClimb), Filtered Array(Global.BanClimb, Compare(Add(Current Array Element, False), >=, Null)), Empty Array));
        Set Global Variable(BanEmote, If-Then-Else(Count Of(Global.BanEmote), Filtered Array(Global.BanEmote, Compare(Add(Current Array Element, False), >=, Null)), Empty Array));
        Set Global Variable(BanDead, If-Then-Else(Count Of(Global.BanDead), Filtered Array(Global.BanDead, Compare(Add(Current Array Element, False), >=, Null)), Empty Array));
        Set Global Variable(BanCreate, If-Then-Else(Count Of(Global.BanCreate), Filtered Array(Global.BanCreate, Compare(Add(Current Array Element, False), >=, Null)), Empty Array));
        Set Global Variable(BanMulti, If-Then-Else(Count Of(Global.BanMulti), Filtered Array(Global.BanMulti, Compare(Add(Current Array Element, False), >=, Null)), Empty Array));
        "BanTriple = [i for i in BanTriple if i + false >= 0] if len(BanTriple) else [] # legacy code, now auto sets it to null to save space"
        Set Global Variable(BanStand, If-Then-Else(Count Of(Global.BanStand), Filtered Array(Global.BanStand, Compare(Add(Current Array Element, False), >=, Null)), Empty Array));
        Set Global Variable(BanSaveDouble, If-Then-Else(Count Of(Global.BanSaveDouble), Global.BanSaveDouble, Empty Array));
        Set Global Variable(BanDjump, If-Then-Else(Count Of(Global.BanDjump), Global.BanDjump, Empty Array));
        "fix team because of naming"
        If(Compare(Value In Array(Global.ColorConfig, 16), ==, Color(Team 1)));
            Set Global Variable At Index(ColorConfig, 16, Color(Blue));
        Else If(Compare(Value In Array(Global.ColorConfig, 16), ==, Color(Team 2)));
            Set Global Variable At Index(ColorConfig, 16, Color(Red));
        End;
        "prevent same color lock orbs"
        If(Compare(Value In Array(Global.ColorConfig, 15), ==, Value In Array(Global.ColorConfig, 16)));
            Set Global Variable At Index(ColorConfig, 16, If-Then-Else(Compare(Value In Array(Global.ColorConfig, 15), ==, Color(Orange)), Color(Green), Color(Orange)));
        End;
        "prevent same color bhop/climb used/unused"
        If(Compare(Value In Array(Global.ColorConfig, 7), ==, Value In Array(Global.ColorConfig, 8)));
            Set Global Variable At Index(ColorConfig, 8, If-Then-Else(Compare(Value In Array(Global.ColorConfig, 7), ==, Color(Red)), Color(Orange), Color(Red)));
    }
}

regel ("Parkour | Match time") {
    event {
        Ongoing - Global;
    }
    aktionen {
        If(Compare(Current Game Mode, !=, Game Mode(Übungsgefecht)));
            Wait(False, Ignore Condition);
            Set Match Time(False);
            Wait(False, Ignore Condition);
            Set Match Time(False);
            Wait(False, Ignore Condition);
        End;
        Set Match Time(70);
        Pause Match Time;
        Wait(False, Ignore Condition);
        Set Global Variable(TimeRemaining, 265);
        While(Global.TimeRemaining);
            Wait(60, Ignore Condition);
            Modify Global Variable(TimeRemaining, Subtract, True);
            If(Global.CompMode);
                Modify Global Variable(CompTime, Subtract, True);
                If(Not(Global.CompTime));
                    Big Message(First Of(True), If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("时间到了"), Custom String("Time's Up")));
                    Set Player Variable(All Players(All Teams), comp_done, True);
                    Stop Chasing Player Variable(All Players(All Teams), timer_normal);
                    Set Damage Received(All Players(All Teams), 100);
                    Kill(All Players(All Teams), Null);
                End;
            End;
        End;
        "\\"房间已达最大持续时间, 即将重启\\" checkCN \\"Maximum Lobby Time Reached, Restarting\\""
        Big Message(First Of(True), Value In Array(String Split(Custom String("ＴＬＥｒｒMaximum Lobby Time Reached, RestartingMaximum Lobby Time Reached, RestartingMaximum Lobby Time Reached, Restarting"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
        Wait(5, Ignore Condition);
        "Prevent crash during POTG and closing lobby"
        Set Player Variable(All Players(All Teams), lockState, True);
        Declare Player Victory(Host Player);
        Declare Team Victory(Team Of(Host Player));
    }
}

regel ("Parkour | Player Initialize") {
    event {
        Player Joined Match;
        All;
        All;
    }
    aktionen {
        Disable Game Mode HUD(Event Player);
        Disable Movement Collision With Players(Event Player);
        Set Damage Received(Event Player, 0);
        Set Player Variable(Event Player, lockState, True);
        Abort If(Is Dummy Bot(Event Player));
        Enable Death Spectate All Players(Event Player);
        Enable Death Spectate Target HUD(Event Player);
        Disable Built-In Game Mode Respawning(Event Player);
        Preload Hero(Event Player, Hero(Genji));
        Set Player Variable(Event Player, editor_lock, True);
        Set Player Variable(Event Player, toggle_guide, True);
        "eventPlayer.toggle_quickRestart = true"
        Set Player Variable(Event Player, cache_bounceTouched, -1);
        "big waits first for about 1 second before loading, to make sure things like comp mode are fully loaded and configured, load fx in meanwhile"
        Wait(True, Ignore Condition);
        Create Effect(Event Player, Ring, Value In Array(Global.ColorConfig, 9), Last Of(Value In Array(Global.A, (Event Player).checkpoint_current)), True, Position and Radius);
        Create Effect(If-Then-Else((Event Player).checkpoint_notLast, Event Player, Null), Ring, Value In Array(Global.ColorConfig, 10), Value In Array(Global.A, Add((Event Player).checkpoint_current, True)), True, Visible To Position and Radius);
        Create Effect(If-Then-Else((Event Player).checkpoint_notLast, Event Player, Null), Light Shaft, Value In Array(Global.ColorConfig, 11), Value In Array(Global.A, Add((Event Player).checkpoint_current, True)), True, Visible To Position and Radius);
        Create Icon(If-Then-Else((Event Player).checkpoint_notLast, Event Player, Null), Add(Value In Array(Global.A, Add((Event Player).checkpoint_current, True)), Up), Arrow: Down, Visible To and Position, Value In Array(Global.ColorConfig, 12), True);
        Wait Until(Has Spawned(Event Player), 999999999999);
        Set Player Variable(Event Player, editor_lock, False);
        If(Global.CompMode);
            Set Invisible(Event Player, All);
            If(Array Contains(Global.CompAtmpSaveNames, String Split(First Of(Event Player), Empty Array)));
                Set Player Variable(Event Player, comp_countAttempts, Value In Array(Global.CompAtmpSaveCount, Index Of Array Value(Global.CompAtmpSaveNames, String Split(First Of(Event Player), Empty Array))));
            "instructions and settings for comp start"
            Else;
                Set Player Variable(Event Player, comp_instructionHud, True);
                Modify Global Variable(CompAtmpSaveNames, Append To Array, String Split(First Of(Event Player), Empty Array));
                Modify Global Variable(CompAtmpSaveCount, Append To Array, 1);
                Set Player Variable(Event Player, comp_countAttempts, 1);
                Set Move Speed(Event Player, False);
                Set Ability 1 Enabled(Event Player, False);
                Set Ultimate Ability Enabled(Event Player, False);
                Wait Until(Not(Is Button Held(Event Player, Button(Interact))), True);
                Wait Until(Or(Is Button Held(Event Player, Button(Interact)), Compare(Global.CompTime, <, 1)), 999999999999);
                Set Move Speed(Event Player, 100);
                Set Player Variable(Event Player, comp_instructionHud, False);
            End;
            If(Or(Compare((Event Player).comp_countAttempts, <, Null), Compare(Global.CompTime, <, 1)));
                Set Player Variable(Event Player, comp_done, True);
            End;
        End;
        Wait(False, Ignore Condition);
        "initialization of the game"
        Call Subroutine(StartGame);
        Set Player Variable(Event Player, lockState, False);
    }
}

regel ("Parkour | Player Leaves") {
    event {
        Player Left Match;
        All;
        All;
    }
    aktionen {
        If(Value In Array(Global.SaveCp, Index Of Array Value(Global.SaveEnt, Event Player)));
            If(And(Compare(Value In Array(Global.SaveCp, Index Of Array Value(Global.SaveEnt, Event Player)), <, Subtract(Count Of(Global.A), True)), Value In Array(Global.SaveElapsed, Index Of Array Value(Global.SaveEnt, Event Player))));
                Set Global Variable At Index(SaveTimer, Index Of Array Value(Global.SaveEnt, Event Player), Add(Subtract(Total Time Elapsed, Value In Array(Global.SaveElapsed, Index Of Array Value(Global.SaveEnt, Event Player))), Value In Array(Global.SaveTimer, Index Of Array Value(Global.SaveEnt, Event Player))));
            End;
        "delete if player didnt do first cp"
        Else;
            Call Subroutine(DeleteSave);
    }
}

regel ("Parkour | Ground: Traces, Arrive, & Reset") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        (Event Player).lockState == False;
        Is On Ground(Event Player) == True;
        Is Alive(Event Player) == True;
    }
    aktionen {
        If(Not((Event Player).checkpoint_notLast));
            If(And(Is Moving(Event Player), Not(Or(Or(Or((Event Player).toggle_practice, (Event Player).toggle_invisible), Global.EditorOn), Global.CompMode))));
                "traces ----------------------------------------------------------------------------------------------------"
                Set Player Variable(Event Player, cache_rainbow, Value In Array(Array(Color(Red), Color(Orange), Color(Yellow), Color(Lime Green), Color(Green), Color(Turquoise), Color(Blue), Color(Purple), Color(Violet), Color(Rose)), Modulo(Round To Integer(Multiply(Total Time Elapsed, 2), Down), 10)));
                "eventPlayer.cache_rainbow =  rgb((cosDeg(getTotalTimeElapsed()/2 * 360 - 0) + 0.5) * 255, (cosDeg(getTotalTimeElapsed/2 * 360 - 120) + 0.5) * 255, (cosDeg(getTotalTimeElapsed/2 * 360 - 240) + 0.5) * 255)\\n1.6 - 0.2 in 0.2 steps"
                Play Effect(First Of(True), Ring Explosion, (Event Player).cache_rainbow, Position Of(Event Player), 0.4);
                Wait(0.048, Ignore Condition);
                Play Effect(First Of(True), Ring Explosion, (Event Player).cache_rainbow, Position Of(Event Player), 0.6);
                Wait(0.048, Ignore Condition);
                Play Effect(First Of(True), Ring Explosion, (Event Player).cache_rainbow, Position Of(Event Player), 0.8);
                Wait(0.048, Ignore Condition);
                Play Effect(First Of(True), Ring Explosion, (Event Player).cache_rainbow, Position Of(Event Player), 1);
                Wait(0.048, Ignore Condition);
                Play Effect(First Of(True), Ring Explosion, (Event Player).cache_rainbow, Position Of(Event Player), 1.2);
                Wait(0.048, Ignore Condition);
                Play Effect(First Of(True), Ring Explosion, (Event Player).cache_rainbow, Position Of(Event Player), 1.4);
                Wait(0.048, Ignore Condition);
            End;
        "or eventPlayer.lockState:"
        Else If(Or(Or((Event Player).toggle_invincible, (Event Player).toggle_spectate), And(Global.CompMode, Not(Global.CompTime))));
        Else If(Compare(Distance Between(Event Player, Value In Array(Global.A, Add((Event Player).checkpoint_current, True))), <=, 1.4));
            "arrived ----------------------------------------------------------------------------------------------------"
            If(Compare(Count Of((Event Player).cache_collectedLocks), <, (Event Player).cache_bounceMaxLocks));
                "\\"   ! 进点前需集齐所有收集球 !\\" checkCN \\"   ! collect ALL {} orbs to unlock !\\".format(ColorConfig[Customize.orb_lock])"
                Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   ! Collect All Lock Orbs To Complete !   ! Collect All Lock Orbs To Complete !   ! Collect All Lock Orbs To Complete !"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
                "kill player if not colleted the locks"
                Call Subroutine(CheckpointFailReset);
            Else If(And((Event Player).ban_climb, (Event Player).skill_usedClimb));
                "\\"   爬墙 ↑ 已禁用!\\" checkCN \\"   Climb ↑ is banned!\\")"
                Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   Climb ↑ Is Banned!   Climb ↑ Is Banned!   Climb ↑ Is Banned!"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
                Call Subroutine(CheckpointFailReset);
            Else If(And((Event Player).ban_bhop, (Event Player).skill_usedBhop));
                "\\"   ≥ 留小跳进点!\\" checkCN \\"   ≥ Must Have A Bhop To Complete!!\\""
                Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   ≥ Must Have A Bhop To Complete!   ≥ Must Have A Bhop To Complete!   ≥ Must Have A Bhop To Complete!"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
                Call Subroutine(CheckpointFailReset);
            Else If(And((Event Player).ban_djump, (Event Player).skill_usedDouble));
                "\\"   » 留二段跳!\\" checkCN \\"   » Must Have A Double Jump To Complete!\\""
                Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   » Must Have A Double Jump To Complete!   » Must Have A Double Jump To Complete!   » Must Have A Double Jump To Com{0}", Custom String("plete!")), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
                Call Subroutine(CheckpointFailReset);
            Else;
                Set Player Variable(Event Player, checkpoint_moved, True);
                Modify Player Variable(Event Player, checkpoint_current, Add, True);
                If(Compare((Event Player).timer_splitDisplay, >, -999999999999));
                    Set Player Variable(Event Player, timer_splitDisplay, Subtract(If-Then-Else((Event Player).toggle_practice, (Event Player).timer_practice, (Event Player).timer_normal), (Event Player).timer_split));
                End;
                If((Event Player).toggle_practice);
                    Set Player Variable(Event Player, timer_split, (Event Player).timer_practice);
                Else;
                    Set Player Variable(Event Player, timer_split, (Event Player).timer_normal);
                    Call Subroutine(DeleteSave);
                    "complete lvl"
                    If(And(Compare((Event Player).checkpoint_current, ==, Subtract(Count Of(Global.A), True)), Not(Global.EditorOn)));
                        Stop Chasing Player Variable(Event Player, timer_normal);
                        Call Subroutine(LeaderboardUpdate);
                        If(And(Global.CompMode, Global.CompAtmpNum));
                            If(Compare((Event Player).comp_countAttempts, ==, Global.CompAtmpNum));
                                Set Global Variable At Index(CompAtmpSaveCount, Index Of Array Value(Global.CompAtmpSaveNames, String Split(First Of(Event Player), Empty Array)), -1);
                                Set Player Variable(Event Player, comp_countAttempts, -1);
                                Set Player Variable(Event Player, comp_done, True);
                                Set Player Variable(Event Player, toggle_leaderboard, True);
                                "eventPlayer.disableRespawn()"
                                Set Damage Received(Event Player, 100);
                                Kill(Event Player, Null);
                                Set Damage Received(Event Player, 0);
                            Else;
                                Set Global Variable At Index(CompAtmpSaveCount, Index Of Array Value(Global.CompAtmpSaveNames, String Split(First Of(Event Player), Empty Array)), Add((Event Player).comp_countAttempts, True));
                            End;
                        End;
                        "\\"已通关! 用时\\" checkCN \\"Mission Complete! Time\\""
                        Big Message(First Of(True), Custom String("{0} {1} {2} Sec", Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒMission Complete! TimeMission Complete! TimeMission Complete! Time"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), (Event Player).timer_normal));
                        Wait(False, Ignore Condition);
                    "update save"
                    Else;
                        Call Subroutine(MakeSave);
                    End;
                    Call Subroutine(UpdateTitle);
                End;
                Call Subroutine(UpdateCache);
                "teleport cps"
                If(Compare(Count Of(Value In Array(Global.A, (Event Player).checkpoint_current)), >, 1));
                    Call Subroutine(CheckpointFailReset);
                Else;
                    Call Subroutine(AddonCustomLoadAndReset);
                End;
                Wait(False, Ignore Condition);
                "msg disabled due to annoying new sound\\nbigMessage(eventPlayer,  \\"{1} {0}\\".format(eventPlayer.checkpoint_current, \\"抵达检查点\\" checkCN \\"Arrived at level\\"))"
                Play Effect(Event Player, Ring Explosion Sound, Null, Event Player, 100);
                Play Effect(If-Then-Else(Or(Global.CompMode, (Event Player).toggle_invisible), Event Player, True), Ring Explosion, Color(Sky Blue), Position Of(Event Player), 4);
            End;
        Else If(Compare(Distance Between(Event Player, Last Of(Value In Array(Global.A, (Event Player).checkpoint_current))), >, 1.4));
            Call Subroutine(CheckpointFailReset);
        End;
        Set Player Variable(Event Player, cache_collectedLocks, Empty Array);
        Wait(0.048, Ignore Condition);
        Loop If Condition Is True;
    }
}

regel ("Parkour | Boundary Sphere") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        (Event Player).cache_killPosition != Empty Array;
        (Event Player).toggle_invincible == False;
        (Event Player).checkpoint_notLast != False;
        Is True For Any((Event Player).cache_killRadii, Compare(Multiply(Normalize(Current Array Element), Distance Between(Value In Array((Event Player).cache_killPosition, Current Array Index), Event Player)), <, Current Array Element)) == True;
    }
    aktionen {
        Call Subroutine(CheckpointFailReset);
    }
}

regel ("Parkour | Bounce Ball / Orb") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        (Event Player).cache_bouncePosition != Empty Array;
        "@Condition eventPlayer.checkpoint_notLast # disabled coz editor"
        Is True For Any((Event Player).cache_bouncePosition, Compare(Distance Between(Current Array Element, Add(Position Of(Event Player), Multiply(0.7, Up))), <, 1.4)) == True;
    }
    aktionen {
        Set Player Variable(Event Player, cache_bounceTouched, Index Of Array Value(Global.TQ, Filtered Array(Global.TQ, And(And(And(Compare(Value In Array(Global.pinballnumber, Current Array Index), ==, (Event Player).checkpoint_current), Compare(Current Array Index, !=, (Event Player).cache_bounceTouched)), Not(Array Contains((Event Player).cache_collectedLocks, Current Array Index))), Compare(Distance Between(Add(Event Player, Multiply(0.7, Up)), Current Array Element), <, 1.4)))));
        "prevent same one activating twice in a row"
        If(Compare((Event Player).cache_bounceTouched, >=, Null));
            If(Value In Array(Global.BounceToggleLock, (Event Player).cache_bounceTouched));
                Modify Player Variable(Event Player, cache_collectedLocks, Append To Array, (Event Player).cache_bounceTouched);
                "\\"   弹球已收集\\" checkCN \\"   orb has been collected\\""
                Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   Collected Orb   Collected Orb   Collected Orb"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
            End;
            If(Compare(Value In Array(Global.EditMode, (Event Player).cache_bounceTouched), >, Null));
                Apply Impulse(Event Player, Up, Value In Array(Global.EditMode, (Event Player).cache_bounceTouched), To World, Cancel Contrary Motion XYZ);
            Else If(Compare(Value In Array(Global.EditMode, (Event Player).cache_bounceTouched), <, Null));
                Cancel Primary Action(Event Player);
                Set Player Variable(Event Player, skill_usedDouble, Null);
                "\\"   二段跳已就绪\\" checkCN \\"   » Double Jump is ready\\""
                Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   » Double Jump Is Ready   » Double Jump Is Ready   » Double Jump Is Ready"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
            End;
            If(Value In Array(Global.TQ5, (Event Player).cache_bounceTouched));
                Set Ultimate Ability Enabled(Event Player, True);
                Set Ultimate Charge(Event Player, 100);
                "\\"终极技能已就绪\\" checkCN \\"Ultimate is ready\\""
                Small Message(Event Player, Custom String("   {0} {1}", Ability Icon String(Hero(Genji), Button(Ultimate)), Value In Array(String Split(Custom String("ＴＬＥｒｒUltimate Is ReadyUltimate Is ReadyUltimate Is Ready"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))));
            End;
            If(Value In Array(Global.TQ6, (Event Player).cache_bounceTouched));
                If(Is Using Ability 1(Event Player));
                    Wait Until(Not(Is Using Ability 1(Event Player)), True);
                    Wait(False, Ignore Condition);
                End;
                Set Ability 1 Enabled(Event Player, True);
                "\\"技能1影已就绪\\" checkCN \\"Dash is ready\\""
                Small Message(Event Player, Custom String("   {0} {1}", Ability Icon String(Hero(Genji), Button(Ability 1)), Value In Array(String Split(Custom String("ＴＬＥｒｒDash Is ReadyDash Is ReadyDash Is Ready"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))));
            End;
            Play Effect(Event Player, Buff Explosion Sound, Null, Event Player, 75);
        End;
        Wait(0.24, Ignore Condition);
        Loop If Condition Is True;
        Set Player Variable(Event Player, cache_bounceTouched, -1);
    }
}

regel ("Parkour | Death Reset") {
    event {
        Player Died;
        All;
        All;
    }
    bedingungen {
        Is Dummy Bot(Event Player) == False;
        (Event Player).toggle_spectate == False;
        (Event Player).comp_done == False;
    }
    aktionen {
        If(Count Of(Global.A));
            Resurrect(Event Player);
        Else;
            Respawn(Event Player);
        End;
        Call Subroutine(CheckpointFailReset);
        "rest is to prevent dead spamming from crashing server\\nbut doing waits only when needed without relying on a variable count"
        Wait Until(Is Alive(Event Player), True);
        Wait Until(Is Dead(Event Player), True);
        If(And(Is Dead(Event Player), Not(Or((Event Player).toggle_spectate, (Event Player).comp_done))));
            Wait(0.16, Ignore Condition);
            Resurrect(Event Player);
            Call Subroutine(CheckpointFailReset);
            Wait Until(Is Alive(Event Player), True);
            Wait Until(Is Dead(Event Player), True);
            If(And(Is Dead(Event Player), Not(Or((Event Player).toggle_spectate, (Event Player).comp_done))));
                Wait(0.44, Ignore Condition);
                Resurrect(Event Player);
                Call Subroutine(CheckpointFailReset);
                Wait Until(Is Alive(Event Player), True);
                Wait Until(Is Dead(Event Player), True);
                If(And(Is Dead(Event Player), Not(Or((Event Player).toggle_spectate, (Event Player).comp_done))));
                    Wait(0.64, Ignore Condition);
                    Respawn(Event Player);
                    Call Subroutine(CheckpointFailReset);
    }
}

regel ("Parkour | SUB Update Effect Cache") {
    event {
        Subroutine;
        UpdateCache;
    }
    aktionen {
        "note: if adding cp pos to cache, make sure to also adjust editor things like move and teleport"
        Set Player Variable(Event Player, cache_bouncePosition, Filtered Array(Global.TQ, Compare(Value In Array(Global.pinballnumber, Current Array Index), ==, (Event Player).checkpoint_current)));
        "eventPlayer.cache_bounceLocks = [_ for _, i in BounceToggleLock if BouncePadCheckpoints[i] == eventPlayer.checkpoint_current and _]\\neventPlayer.cache_bounceMaxLocks = len([_ for _ in eventPlayer.cache_bounceLocks if _])"
        Set Player Variable(Event Player, cache_bounceMaxLocks, Count Of(Filtered Array(Global.BounceToggleLock, And(Compare(Value In Array(Global.pinballnumber, Current Array Index), ==, (Event Player).checkpoint_current), Current Array Element))));
        Set Player Variable(Event Player, cache_killPosition, Filtered Array(Global.H, Compare(Value In Array(Global.killballnumber, Current Array Index), ==, (Event Player).checkpoint_current)));
        Set Player Variable(Event Player, cache_killRadii, Filtered Array(Global.I, Compare(Value In Array(Global.killballnumber, Current Array Index), ==, (Event Player).checkpoint_current)));
        Set Player Variable(Event Player, cache_portalStart, Filtered Array(Global.CustomPortalStart, Or(Compare(Value In Array(Global.CustomPortalCP, Current Array Index), ==, (Event Player).checkpoint_current), Compare(Value In Array(Global.CustomPortalCP, Current Array Index), <, Null))));
        Set Player Variable(Event Player, cache_portalEnd, Filtered Array(Global.CustomPortalEndpoint, Or(Compare(Value In Array(Global.CustomPortalCP, Current Array Index), ==, (Event Player).checkpoint_current), Compare(Value In Array(Global.CustomPortalCP, Current Array Index), <, Null))));
        Set Player Variable(Event Player, checkpoint_notLast, And(Compare((Event Player).checkpoint_current, <, Subtract(Count Of(Global.A), True)), Compare(Count Of(Global.A), >, 1)));
        Set Player Variable(Event Player, toggle_hints, False);
        Set Player Variable(Event Player, banString, Empty Array);
        Wait(False, Ignore Condition);
        If((Event Player).checkpoint_notLast);
            Set Player Variable(Event Player, ban_multi, Or(Workshop Setting Toggle(Custom String("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), Custom String("Ban Multiclimb ■ 封禁蹭留 ■ 무한 벽타기 금지"), False, 1), Array Contains(Global.BanMulti, (Event Player).checkpoint_current)));
            If((Event Player).ban_multi);
                Set Player Variable(Event Player, banString, Custom String("∞ {0}", (Event Player).banString));
            End;
            Set Player Variable(Event Player, ban_create, Or(Workshop Setting Toggle(Custom String("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), Custom String("Ban Createbhop ■ 封禁卡小 ■ 콩콩이 생성 금지"), False, 2), Array Contains(Global.BanCreate, (Event Player).checkpoint_current)));
            If((Event Player).ban_create);
                Set Player Variable(Event Player, banString, Custom String("♂ {0}", (Event Player).banString));
            End;
            Set Player Variable(Event Player, ban_standcreate, Or(Workshop Setting Toggle(Custom String("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), Custom String("Ban Standcreate ■ 封禁站卡 ■ 서서 콩콩이 생성 금지"), False, 3), Array Contains(Global.BanStand, (Event Player).checkpoint_current)));
            If((Event Player).ban_standcreate);
                "≥  √ ▼ ↓"
                Set Player Variable(Event Player, banString, Custom String("♠ {0}", (Event Player).banString));
            End;
            Set Player Variable(Event Player, ban_dead, Or(Workshop Setting Toggle(Custom String("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), Custom String("Ban Deathbhop ■ 封禁死小 ■ 죽음 콩콩이 금지"), False, 4), Array Contains(Global.BanDead, (Event Player).checkpoint_current)));
            If((Event Player).ban_dead);
                Set Player Variable(Event Player, banString, Custom String("X {0}", (Event Player).banString));
            End;
            Set Player Variable(Event Player, ban_emote, Or(Workshop Setting Toggle(Custom String("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), Custom String("Ban Emote Savehop ■ 封禁表情留小 ■ 감정표현 콩콩이 금지"), False, 5), Array Contains(Global.BanEmote, (Event Player).checkpoint_current)));
            If((Event Player).ban_emote);
                Set Player Variable(Event Player, banString, Custom String("♥ {0}", (Event Player).banString));
            End;
            Set Player Variable(Event Player, ban_savedouble, Or(Workshop Setting Toggle(Custom String("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), Custom String("Ban Save Double ■ 封禁留二段跳 ■ 이단점프 킵 금지"), False, 6), Array Contains(Global.BanSaveDouble, (Event Player).checkpoint_current)));
            If((Event Player).ban_savedouble);
                Set Player Variable(Event Player, banString, Custom String("△ {0}", (Event Player).banString));
            End;
            Set Player Variable(Event Player, ban_climb, Or(Workshop Setting Toggle(Custom String("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), Custom String("Ban Wallclimb ■ 封禁爬墙 ■ 벽타기 금지"), False, 7), Array Contains(Global.BanClimb, (Event Player).checkpoint_current)));
            If((Event Player).ban_climb);
                Set Player Variable(Event Player, banString, Custom String("↑ {0}", (Event Player).banString));
            End;
            Set Player Variable(Event Player, ban_bhop, Or(Workshop Setting Toggle(Custom String("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), Custom String("Require Bhop Available ■ 留小跳进点 ■ 도착 시 콩콩이 필요"), False, 8), Array Contains(Global.BanBhop, (Event Player).checkpoint_current)));
            If((Event Player).ban_bhop);
                "≥  √ ▼ ↓"
                Set Player Variable(Event Player, banString, Custom String("≥ {0}", (Event Player).banString));
            End;
            Set Player Variable(Event Player, ban_djump, Or(Workshop Setting Toggle(Custom String("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), Custom String("Require Djump Available ■ 留二段跳进点 ■ 도착 시 이단 점프 필요"), False, 9), Array Contains(Global.BanDjump, (Event Player).checkpoint_current)));
            If((Event Player).ban_djump);
                "≥  √ ▼ ↓ ︽"
                Set Player Variable(Event Player, banString, Custom String("» {0}", (Event Player).banString));
            End;
        Else;
            Set Player Variable(Event Player, ban_multi, False);
            Set Player Variable(Event Player, ban_create, False);
            Set Player Variable(Event Player, ban_standcreate, False);
            Set Player Variable(Event Player, ban_dead, False);
            Set Player Variable(Event Player, ban_emote, False);
            Set Player Variable(Event Player, ban_climb, False);
            Set Player Variable(Event Player, ban_savedouble, False);
            Set Player Variable(Event Player, ban_bhop, False);
            Set Player Variable(Event Player, ban_djump, False);
        End;
        Wait(False, Ignore Condition);
        Start Rule(CheckUlt, Do Nothing);
        Start Rule(CheckAbility1, Do Nothing);
        Abort If(Or(Compare(Event Player, !=, Host Player), Not(Global.EditorOn)));
        Call Subroutine(EditUpdateSelectedIds);
        Destroy Effect((Host Player).editor_hitboxEffect);
        Create Effect(If-Then-Else((Host Player).editor_hitboxToggle, Host Player, Null), Sphere, Color(Weiß), Value In Array(Global.A, (Host Player).checkpoint_current), 1.4, Visible To Position and Radius);
        Set Player Variable(Host Player, editor_hitboxEffect, Last Created Entity);
        Create Effect(If-Then-Else(And((Host Player).editor_hitboxToggle, (Host Player).checkpoint_notLast), Host Player, Null), Sphere, Color(Weiß), Value In Array(Global.A, Add((Host Player).checkpoint_current, True)), 1.4, Visible To Position and Radius);
        Modify Player Variable(Host Player, editor_hitboxEffect, Append To Array, Last Created Entity);
        Set Player Variable(Host Player, editor_bounceIndex, Filtered Array(Mapped Array(Global.pinballnumber, If-Then-Else(Compare(Current Array Element, ==, (Host Player).checkpoint_current), Current Array Index, -1)), Compare(Current Array Element, >=, Null)));
        Set Player Variable(Host Player, editor_killIndex, Filtered Array(Mapped Array(Global.killballnumber, If-Then-Else(Compare(Current Array Element, ==, (Host Player).checkpoint_current), Current Array Index, -1)), Compare(Current Array Element, >=, Null)));
        If((Host Player).checkpoint_moved);
            Call Subroutine(EditorSelectLast);
            Set Player Variable(Host Player, checkpoint_moved, False);
        End;
    }
}

regel ("Parkour | SUB Delete Save") {
    event {
        Subroutine;
        DeleteSave;
    }
    aktionen {
        Modify Global Variable(SaveName, Remove From Array By Index, Index Of Array Value(Global.SaveEnt, Event Player));
        Modify Global Variable(SaveCp, Remove From Array By Index, Index Of Array Value(Global.SaveEnt, Event Player));
        Modify Global Variable(SaveTimer, Remove From Array By Index, Index Of Array Value(Global.SaveEnt, Event Player));
        Modify Global Variable(SaveElapsed, Remove From Array By Index, Index Of Array Value(Global.SaveEnt, Event Player));
        "must always be last because its the index itself"
        Modify Global Variable(SaveEnt, Remove From Array By Index, Index Of Array Value(Global.SaveEnt, Event Player));
    }
}

regel ("Parkour | SUB Make Save") {
    event {
        Subroutine;
        MakeSave;
    }
    aktionen {
        Modify Global Variable(SaveEnt, Append To Array, Event Player);
        Modify Global Variable(SaveName, Append To Array, String Split(First Of(Event Player), Empty Array));
        Modify Global Variable(SaveCp, Append To Array, (Event Player).checkpoint_current);
        Modify Global Variable(SaveTimer, Append To Array, (Event Player).timer_normal);
        Modify Global Variable(SaveElapsed, Append To Array, Total Time Elapsed);
    }
}

regel ("Parkour | SUB Timer Pause") {
    event {
        Subroutine;
        TimerPause;
    }
    aktionen {
        Stop Chasing Player Variable(Event Player, timer_normal);
        Abort If(Not(Array Contains(Global.SaveEnt, Event Player)));
        Set Global Variable At Index(SaveTimer, Index Of Array Value(Global.SaveEnt, Event Player), (Event Player).timer_normal);
        Set Global Variable At Index(SaveElapsed, Index Of Array Value(Global.SaveEnt, Event Player), Null);
    }
}

regel ("Parkour | SUB Timer Resume") {
    event {
        Subroutine;
        TimerResume;
    }
    aktionen {
        Chase Player Variable At Rate(Event Player, timer_normal, 999999999999, True, None);
        Set Global Variable At Index(SaveElapsed, Index Of Array Value(Global.SaveEnt, Event Player), Total Time Elapsed);
    }
}

regel ("Parkour | SUB Leaderboard Update") {
    event {
        Subroutine;
        LeaderboardUpdate;
    }
    aktionen {
        "[[name, seconds, prettytime]]\\nyou already have a time"
        If(Array Contains(Mapped Array(Global.LeaderBoardFull, First Of(Current Array Element)), String Split(First Of(Event Player), Empty Array)));
            Abort If(Compare((Event Player).timer_normal, >=, Value In Array(First Of(Filtered Array(Global.LeaderBoardFull, Compare(First Of(Current Array Element), ==, String Split(First Of(Event Player), Empty Array)))), True)));
            Set Global Variable(LeaderBoardFull, Filtered Array(Global.LeaderBoardFull, Compare(First Of(Current Array Element), !=, String Split(First Of(Event Player), Empty Array))));
        Else If(Or(Compare(Count Of(Global.LeaderBoardFull), <, 25), Compare((Event Player).timer_normal, <, Last Of(Value In Array(Global.LeaderBoardFull, 19)))));
            Modify Global Variable(LeaderBoardFull, Remove From Array By Index, 24);
        Else;
            "Full and time too slow"
            Abort;
        End;
        Modify Global Variable(LeaderBoardFull, Append To Array, Array(Array(String Split(First Of(Event Player), Empty Array), (Event Player).timer_normal, Custom String("{0} sec", (Event Player).timer_normal))));
        "CreateLeaderboard()"
        Set Global Variable(LeaderBoardRemake, True);
    }
}

regel ("Parkour | SUB Checkpoint Fail") {
    event {
        Subroutine;
        CheckpointFailReset;
    }
    aktionen {
        Set Player Variable(Event Player, timer_split, If-Then-Else((Event Player).toggle_practice, (Event Player).timer_practice, (Event Player).timer_normal));
        Set Player Variable(Event Player, cache_collectedLocks, Empty Array);
        Cancel Primary Action(Event Player);
        Set Player Variable(Event Player, skill_usedDouble, Null);
        If(Not(Or((Event Player).checkpoint_current, (Event Player).toggle_practice)));
            Set Player Variable(Event Player, timer_normal, Null);
            Set Player Variable(Event Player, timer_split, Null);
        End;
        If(Count Of(Global.A));
            If(Is Using Ability 1(Event Player));
                Start Forcing Player Position(Event Player, Event Player, False);
                Wait Until(Not(Is Using Ability 1(Event Player)), True);
                Wait(False, Ignore Condition);
                Stop Forcing Player Position(Event Player);
            End;
            Teleport(Event Player, Last Of(Value In Array(Global.A, (Event Player).checkpoint_current)));
            "After teleport incase stopForcingPosition launches the player"
            Apply Impulse(Event Player, Multiply(-1, Velocity Of(Event Player)), 1.192093e-7, To World, Cancel Contrary Motion XYZ);
            "old: disallow jump > 0.1 sec wait > allow jump, this method bugs with ult check disabling ultimate for some reason\\nif eventPlayer.ban_dead or eventPlayer.ban_emote and eventPlayer.isHoldingButton(Button.JUMP):"
            If((Event Player).ban_dead);
                If(Is Button Held(Event Player, Button(Jump)));
                    Press Button(Event Player, Button(Jump));
                End;
            Else;
                "Reset Hop"
                Set Status(Event Player, Null, Rooted, 0.096);
            End;
            If(Is Using Ultimate(Event Player));
                Set Damage Received(Event Player, 100);
                Kill(Event Player, Null);
                Set Damage Received(Event Player, 0);
                Wait(False, Ignore Condition);
            End;
        End;
        Start Rule(CheckUlt, Restart Rule);
        Start Rule(CheckAbility1, Restart Rule);
        Call Subroutine(AddonCustomLoadAndReset);
    }
}

regel ("Parkour | SUB Start Game") {
    event {
        Subroutine;
        StartGame;
    }
    aktionen {
        If(And(Global.CompMode, Or(Compare(Global.CompTime, <, 1), (Event Player).comp_done)));
            Set Player Variable(Event Player, toggle_leaderboard, True);
            Set Player Variable(Event Player, comp_done, True);
            "eventPlayer.disableRespawn()"
            Set Damage Received(Event Player, 100);
            Kill(Event Player, Null);
            Set Damage Received(Event Player, 0);
            Abort;
        End;
        If(Count Of(Global.A));
            "load saved progres"
            If(Array Contains(Global.SaveName, String Split(First Of(Event Player), Empty Array)));
                Set Global Variable At Index(SaveEnt, Index Of Array Value(Global.SaveName, String Split(First Of(Event Player), Empty Array)), Event Player);
                Set Player Variable(Event Player, checkpoint_current, Value In Array(Global.SaveCp, Index Of Array Value(Global.SaveEnt, Event Player)));
                Set Player Variable(Event Player, timer_normal, Value In Array(Global.SaveTimer, Index Of Array Value(Global.SaveEnt, Event Player)));
            Else;
                Set Player Variable(Event Player, checkpoint_current, Null);
                Set Player Variable(Event Player, timer_normal, Null);
                Call Subroutine(MakeSave);
            End;
            Call Subroutine(UpdateTitle);
            Call Subroutine(UpdateCache);
            Call Subroutine(CheckpointFailReset);
            "FFA"
            Wait Until(Is Game In Progress, 999999999999);
            Call Subroutine(TimerResume);
        End;
        "eventPlayer.enableRespawn()"
        Set Player Variable(Event Player, toggle_invincible, False);
        Set Player Variable(Event Player, toggle_spectate, False);
        Set Player Variable(Event Player, checkpoint_moved, True);
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Mechanics | Checks ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("Mechanic | All | Jump") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is Jumping(Event Player) == True;
    }
    aktionen {
        Set Player Variable(Event Player, skill_usedBhop, True);
        If((Event Player).skill_usedHop);
            "\\"   小跳已用\\" checkCN \\"   Bhop\\""
            Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   Bhop   Bhop   Bhop"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
        Else;
            Set Player Variable(Event Player, skill_usedHop, True);
    }
}

regel ("Mechanic | All | No Jump") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        (Event Player).skill_usedHop == Null;
        Is On Ground(Event Player) == False;
    }
    aktionen {
        Set Player Variable(Event Player, skill_usedHop, True);
    }
}

regel ("Mechanic | All | Bhop Reset") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is On Ground(Event Player) == True;
        Is Button Held(Event Player, Button(Jump)) == False;
    }
    aktionen {
        Set Player Variable(Event Player, skill_usedBhop, False);
    }
}

regel ("Mechanic | All | Emote") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is Communicating Any Emote(Event Player) == True;
    }
    aktionen {
        Set Player Variable(Event Player, skill_usedBhop, False);
        If((Event Player).addon_toggle3rdPov);
            Set Player Variable(Event Player, addon_toggle3rdPov, False);
            Stop Camera(Event Player);
        End;
        If((Event Player).ban_emote);
            Wait Until(Not(Is Communicating Any Emote(Event Player)), 999999999999);
            Abort If((Event Player).toggle_invincible);
            "\\"   表情留小 ♥ 已禁用!\\" checkCN \\"   Emote Savehop ♥ is banned!\\""
            Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   Emote Savehop ♥ Is Banned!   Emote Savehop ♥ Is Banned!   Emote Savehop ♥ Is Banned!"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
            Wait(False, Ignore Condition);
            Call Subroutine(CheckpointFailReset);
    }
}

regel ("Mechanic | All | Ground Reset") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is On Ground(Event Player) == True;
    }
    aktionen {
        "All"
        Set Player Variable(Event Player, skill_usedHop, Null);
        Set Player Variable(Event Player, skill_countBhops, Null);
        "$$ Climb"
        Set Player Variable(Event Player, skill_usedClimb, False);
        Set Player Variable(Event Player, skill_countMulti, Null);
        Set Player Variable(Event Player, skill_countCreates, Null);
        "$$ Genji"
        Set Player Variable(Event Player, skill_usedDouble, Null);
    }
}

regel ("Mechanic | Climbers | On Wall") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        "This rule is also linked to the determination of wall climbing, please do not close/delete"
        Is On Wall(Event Player) == True;
        Is Button Held(Event Player, Button(Jump)) == True;
    }
    aktionen {
        Set Player Variable(Event Player, skill_usedClimb, True);
    }
}

regel ("Mechanic | Climbers | Bhop count for stand ban") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is Jumping(Event Player) == True;
        (Event Player).ban_standcreate != False;
    }
    aktionen {
        Modify Player Variable(Event Player, skill_countBhops, Add, True);
        If(And(Compare((Event Player).skill_countBhops, >, 1), Not((Event Player).toggle_invincible)));
            "\\"   站卡 ♠ 已禁用!\\" checkCN \\"   Stand createBhop ♠ is banned!\\""
            Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   Stand Createbhop ♠ Is Banned!   Stand Createbhop ♠ Is Banned!   Stand Createbhop ♠ Is Banned!"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
            Call Subroutine(CheckpointFailReset);
    }
}

regel ("Mechanic | Climbers | Create Bhop") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is Button Held(Event Player, Button(Crouch)) == True;
        Is Crouching(Event Player) == True;
        Is In Air(Event Player) == True;
        Is Button Held(Event Player, Button(Jump)) == False;
        Is Jumping(Event Player) == False;
    }
    aktionen {
        Set Player Variable(Event Player, skill_usedBhop, False);
        "prevent restart from giving messsage, but stil allow it to become green"
        Abort If((Event Player).lockState);
        If(And((Event Player).ban_create, Not((Event Player).toggle_invincible)));
            "\\"   卡小 ♂ 已禁用!\\" checkCN \\"   Create Bhop ♂ is banned!\\""
            Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   Create Bhop ♂ Is Banned!   Create Bhop ♂ Is Banned!   Create Bhop ♂ Is Banned!"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
            Call Subroutine(CheckpointFailReset);
        Else;
            If(And((Event Player).ban_standcreate, Compare((Event Player).skill_countBhops, >, Null)));
                Modify Player Variable(Event Player, skill_countBhops, Subtract, True);
            End;
            Modify Player Variable(Event Player, skill_countCreates, Add, True);
            "\\"   success!\\" checkCN \\"   Bhop has been created!\\""
            Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   Bhop Created!   Bhop Created!   Bhop Created!"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
    }
}

regel ("Mechanic | Climbers | Multiclimb") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is On Wall(Event Player) == True;
        Is Button Held(Event Player, Button(Jump)) == False;
        (Event Player).skill_usedClimb == False;
    }
    aktionen {
        Wait(False, Ignore Condition);
        If(And(Is On Wall(Event Player), Not(Is Button Held(Event Player, Button(Jump)))));
            "AutoClimb used"
            Set Player Variable(Event Player, skill_usedClimb, True);
        Else;
            If(And(And((Event Player).ban_multi, (Event Player).checkpoint_notLast), Not((Event Player).toggle_invincible)));
                "\\"   蹭留 ∞ 已禁用!\\" checkCN \\"   Multiclimb ∞ is banned!\\""
                Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   Multiclimb ∞ Is Banned!   Multiclimb ∞ Is Banned!   Multiclimb ∞ Is Banned!"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
                Call Subroutine(CheckpointFailReset);
            Else;
                Modify Player Variable(Event Player, skill_countMulti, Add, True);
    }
}

regel ("Mechanic | Climbers | Ban Wallclimb - Message") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        (Event Player).ban_climb != False;
        (Event Player).toggle_invincible == False;
        (Event Player).skill_usedClimb != False;
    }
    aktionen {
        "CheckpointFailReset()\\n\\"   爬墙 ↑ 已禁用!\\" checkCN \\"   Climb ↑ is banned!\\""
        Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   Climb ↑ Is Banned!   Climb ↑ Is Banned!   Climb ↑ Is Banned!"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
    }
}

regel ("Mechanic | Genji | SUB Check Ultimate") {
    event {
        Subroutine;
        CheckUlt;
    }
    aktionen {
        If((Event Player).lockState);
            "for dash start etc you can be away from cp so the keep charge activators"
            Set Ultimate Charge(Event Player, False);
        End;
        If(Is Using Ultimate(Event Player));
            Wait Until(Not(Is Using Ultimate(Event Player)), 2);
            Wait(False, Ignore Condition);
        End;
        "incase spamming the button"
        If(Is Button Held(Event Player, Button(Ultimate)));
            Wait(False, Ignore Condition);
        End;
        If(Or(Or((Event Player).toggle_invincible, And(Compare(Event Player, ==, Host Player), Global.EditorOn)), Not((Event Player).checkpoint_notLast)));
            "skip msg if these"
            Skip(2);
        Else If(And(Array Contains(Global.Dao, (Event Player).checkpoint_current), Compare(Distance Between(Event Player, Last Of(Value In Array(Global.A, (Event Player).checkpoint_current))), <=, 1.4)));
            "\\"终极技能已就绪\\" checkCN \\"Ultimate is ready\\""
            Small Message(Event Player, Custom String("   {0} {1}", Ability Icon String(Hero(Genji), Button(Ultimate)), Value In Array(String Split(Custom String("ＴＬＥｒｒUltimate Is ReadyUltimate Is ReadyUltimate Is Ready"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))));
            //lbl_a:
            Wait(False, Ignore Condition);
            Set Ultimate Ability Enabled(Event Player, True);
            Set Ultimate Charge(Event Player, 100);
        "used to be just else, but have to deal with multi ult orbs"
        Else If(Or(Compare(Distance Between(Event Player, Last Of(Value In Array(Global.A, (Event Player).checkpoint_current))), <=, 2), Compare(Ultimate Charge Percent(Event Player), <, 100)));
            Set Ultimate Ability Enabled(Event Player, False);
            Set Ultimate Charge(Event Player, False);
        End;
        Wait(0.36, Ignore Condition);
    }
}

regel ("Mechanic | Genji | SUB Check Dash") {
    event {
        Subroutine;
        CheckAbility1;
    }
    aktionen {
        Wait Until(Not(Is Using Ability 1(Event Player)), True);
        If(Or(Or((Event Player).toggle_invincible, And(Compare(Event Player, ==, Host Player), Global.EditorOn)), Not((Event Player).checkpoint_notLast)));
            "skip msg if these"
            Skip(2);
        Else If(And(Array Contains(Global.SHIFT, (Event Player).checkpoint_current), Compare(Distance Between(Event Player, Last Of(Value In Array(Global.A, (Event Player).checkpoint_current))), <=, 1.4)));
            "\\"技能1影已就绪\\" checkCN \\"Dash is ready\\""
            Small Message(Event Player, Custom String("   {0} {1}", Ability Icon String(Hero(Genji), Button(Ability 1)), Value In Array(String Split(Custom String("ＴＬＥｒｒDash Is ReadyDash Is ReadyDash Is Ready"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))));
            //lbl_a:
            Set Ability 1 Enabled(Event Player, True);
        Else;
            Set Ability 1 Enabled(Event Player, False);
        End;
    }
}

regel ("Mechanic | Genji | Ultimate") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is Using Ultimate(Event Player) == True;
    }
    aktionen {
        Wait(1.8, Abort When False);
        If(And((Event Player).checkpoint_notLast, Not((Event Player).toggle_invincible)));
            "disable primary fire because of slash exploit"
            Disallow Button(Event Player, Button(Primary Fire));
        End;
        Wait Until(Not(Is Using Ultimate(Event Player)), 2);
        Wait(False, Ignore Condition);
        Allow Button(Event Player, Button(Primary Fire));
        "sets ult charge back if done with map etc"
        Start Rule(CheckUlt, Do Nothing);
    }
}

regel ("Mechanic | Genji | Dash") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is Using Ability 1(Event Player) == True;
    }
    aktionen {
        "async(CheckAbility1(), AsyncBehavior.NOOP)"
        Call Subroutine(CheckAbility1);
    }
}

regel ("Mechanic | Genji | Double Jump") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is Alive(Event Player) == True;
        Is In Air(Event Player) == True;
        Or(Or((Event Player).ban_djump, (Event Player).ban_savedouble), (Event Player).addon_enableDoubleChecks) == True;
    }
    aktionen {
        "Save drop"
        Wait Until(Or(Or(Is On Ground(Event Player), Is Jumping(Event Player)), Is Button Held(Event Player, Button(Jump))), 0.096);
        Abort If Condition Is False;
        While(True);
            "Released Jump"
            Wait Until(Or(Is On Ground(Event Player), Not(Is Button Held(Event Player, Button(Jump)))), 999999999999);
            Abort If Condition Is False;
            "Double Jumped"
            Wait Until(Or(Is On Ground(Event Player), Is Button Held(Event Player, Button(Jump))), 999999999999);
            Abort If Condition Is False;
            Set Player Variable(Event Player, skill_usedDouble, True);
            "Reset"
            Wait Until(Or(Is On Ground(Event Player), Not((Event Player).skill_usedDouble)), 999999999999);
            Abort If Condition Is False;
        End;
    }
}

regel ("Mechanic | Genji | Ban Save Double - 封禁二段跳") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        (Event Player).ban_savedouble != False;
        (Event Player).toggle_invincible == False;
        Is In Air(Event Player) == True;
        (Event Player).skill_usedDouble == False;
    }
    aktionen {
        Wait Until(Or(Or(Compare(Z Component Of(Throttle Of(Event Player)), >, Null), Not(Is In Air(Event Player))), (Event Player).skill_usedDouble), 999999999999);
        Abort If Condition Is False;
        Wait Until(Or(Or(Compare(Z Component Of(Throttle Of(Event Player)), <=, Null), Not(Is In Air(Event Player))), (Event Player).skill_usedDouble), 999999999999);
        Abort If Condition Is False;
        "Prevent false positives\\nDefault climb speed is 7.8 and small slowdown upon mantling"
        Loop If(Compare(Vertical Speed Of(Event Player), <, 6));
        If((Event Player).skill_usedBhop);
            Wait(0.8, Abort When False);
        Else;
            Wait(0.8, Abort When False);
            Abort If((Event Player).skill_usedBhop);
        End;
        "\\"   延二段跳已禁用!\\" checkCN \\"   save double banned!\\""
        Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   Save Double Banned!   Save Double Banned!   Save Double Banned!"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
        Call Subroutine(CheckpointFailReset);
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Editor ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("Editor | Export Map") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Event Player == Host Player;
        Global.EditorOn != False;
        Is Button Held(Host Player, Button(Melee)) == True;
        Is Button Held(Host Player, Button(Interact)) == True;
        Is Button Held(Host Player, Button(Reload)) == True;
    }
    aktionen {
        "@Condition hostPlayer.editor_lock == false # !!! don't lock. always be sure data can be exported incase of a perma lock situation"
        Wait(True, Abort When False);
        "doesnt matter thats its in pasta's because it wil be fixed on spawning"
        Set Player Variable(Host Player, editor_lock, True);
        Set Player Variable(Host Player, editor_saveCache, Array(Global.TimeRemaining, Global.ColorConfig));
        Set Global Variable(TimeRemaining, Null);
        Set Global Variable(ColorConfig, Null);
        Set Global Variable(EditorOn, Null);
        Set Global Variable(C, Null);
        Set Global Variable(K, Null);
        Set Global Variable(NANBA, Null);
        Set Global Variable(TQ2, Null);
        Set Global Variable(SaveName, Null);
        Set Global Variable(SaveCp, Null);
        Set Global Variable(SaveTimer, Null);
        Set Global Variable(SaveEnt, Null);
        "SavePauseTime = null\\nSavePauseEnabled = null"
        Set Global Variable(SaveElapsed, Null);
        Set Global Variable(CompMode, Null);
        "LeaderBoardFull = null\\nLeaderBoardHuds = null"
        Set Global Variable(PortalOn, Null);
        Set Global Variable(TitleData, Null);
        Set Global Variable(CpHudText, Null);
        Set Global Variable(CpHudCp, Null);
        Set Global Variable(HintText, Null);
        Set Global Variable(HintCp, Null);
        Set Global Variable(CpIwtText, Null);
        Set Global Variable(CpIwtCp, Null);
        Set Global Variable(CpIwtPos, Null);
        Set Global Variable(CpIwtColor, Null);
        Set Global Variable(PortalNames, Null);
        Set Global Variable(PortalLoc, Null);
        Set Global Variable(PortalDest, Null);
        Set Global Variable(PortalEffects, Null);
        If(Compare(Global.Name, ==, Custom String("name here - 作者")));
            Set Global Variable(Name, Custom String("{0}", Host Player));
        End;
        Set Global Variable(Cachedcredits, Array(Global.Name, Global.Code));
        Set Global Variable(Name, Null);
        Set Global Variable(Code, Null);
        Create HUD Text(Host Player, Custom String("­"), Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("   0. 清理无用数据:\\n (此窗口打开时将自动完成)\\n\\n   1. 复制数据:\\n Esc → 打开地图工坊查看器 → 右下角'变量目标'改为全局\\n 点击窗口下方图标 (X) 复制作图数据\\n\\n   2. 录入数据:\\n Esc → 打开地图工坊编辑器{0}", Custom String(" → 规则第(2/2)页 → 展开规则'数据录入 <---- 在这输入'\\n 点击'动作'一栏右侧橙色粘贴图标 录入数据\\n\\n   3. 地图工坊设置:\\n ESC → 显示大厅 → 设置 → 地图工坊设置→\\n 拉至底部 关闭'作图模式'\\n 选择地图难度\\n{0}", Custom String("\\n   4. 创建初始地图代码:\\n Esc → 显示大厅 → 设置 → 分享代码 →\\n 创建新的代码 → 复制并记下代码\\n\\n   5. 添加作者信息:\\n Esc → 打开地图工坊编辑器 → 规则第(2/2)页 → 展开规则'Credits Here {0}", Custom String("- 作者名字'\\n 修改自定义字符串文本框中的内容\\n\\n   6. 更新地图及作者信息:\\n Esc → 显示大厅 → 设置 → 共享代码 →\\n 上传至现有代码 → 粘贴步骤4中获得的代码")))), Custom String("   0. Clear Extra Data:\\n Already Done Upon Opening This Window\\n\\n   1. Copy Data:\\n Open Workshop Inspector → Set Variable Targ{0}", Custom String("et To Global\\n Click The [X]\\n\\n   2. Insert Data:\\n Paste The Data Into Rule Named 'Map Data <---- Insert Here'\\n\\n   3. Workshop {0}", Custom String("Settings:\\n Esc → Show Lobby → Settings → Workshop Settings →\\n Toggle 'Editor Mode' Off\\n Select Display Difficulty\\n\\n   4. Crea{0}", Custom String("te Initial Sharecode:\\n Esc → Show Lobby → Settings → Share Code →\\n Create New Code → Copy Code\\n\\n   5. Add Credits:\\n Enter You{0}", Custom String("r Name & Map Code In The 'Credits Here' Rule\\n\\n   6. Update For Credits:\\n Esc → Show Lobby → Settings → Share Code →\\n Upload T{0}", Custom String("o Existing Code → Paste The Code You Created In Step 4"))))))), Top, -185, Null, Null, Color(Lime Green), String, Default Visibility);
        Set Player Variable At Index(Host Player, editor_saveCache, 2, Last Text ID);
        Call Subroutine(AddonCheckMap);
        Enable Inspector Recording;
        Disable Inspector Recording;
        Set Global Variable(EditorOn, True);
        Set Global Variable(TimeRemaining, First Of((Host Player).editor_saveCache));
        Set Global Variable(ColorConfig, Value In Array((Host Player).editor_saveCache, True));
        Create HUD Text(Host Player, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("    > 按互动键关闭当前窗口 <    "), Custom String("    > Press Interact To Close This Window <    ")), Null, Null, Top, -183, Color(Lime Green), Null, Null, String, Default Visibility);
        Set Player Variable At Index(Host Player, editor_saveCache, False, Last Text ID);
        Wait Until(Not(Is Button Held(Host Player, Button(Interact))), 999999999999);
        Wait Until(Is Button Held(Host Player, Button(Interact)), 999999999999);
        "Close Window"
        Destroy HUD Text(First Of((Host Player).editor_saveCache));
        "Instructions"
        Destroy HUD Text(Last Of((Host Player).editor_saveCache));
        Set Player Variable(Host Player, editor_saveCache, Null);
        Set Player Variable(Host Player, editor_lock, False);
    }
}

regel ("Editor | Hud & Effects") {
    event {
        Ongoing - Global;
    }
    aktionen {
        Wait(0.832000000000000, Ignore Condition);
        "waitUntil(entityExists(getAllPlayers()), Math.INFINITY)  # cant be condition because host player can leaves, removing the rule fx\\nwait()"
        If(Global.EditorOn);
            Create HUD Text((Local Player).toggle_guide, Null, Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("{0}+{1}+{2} | 重新开始", Input Binding String(Button(Crouch)), Input Binding String(Button(Ability 2)), Input Binding String(Button(Interact))), Custom String("{0}+{1}+{2} | Restart", Input Binding String(Button(Crouch)), Input Binding String(Button(Ability 2)), Input Binding String(Button(Interact)))), Right, -156, Null, Null, Value In Array(Global.ColorConfig, 5), Visible To and String, Default Visibility);
            Create HUD Text(If-Then-Else((Host Player).toggle_guide, Host Player, Null), Null, Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), If-Then-Else(Global.EditorMoveItem, Custom String("方向键 | 移动实体 \\n{0} | 向上移动 \\n{1} | 向下移动 \\n{2} (长按) | 快速移动", Input Binding String(Button(Ability 2)), Input Binding String(Button(Ultimate)), Input Binding String(Button(Jump))), Value In Array(Array(Custom String("{0} + {1} | 新建检查点\\n{0} + {2} | 删除选中的检查点", Input Binding String(Button(Interact)), Input Binding String(Button(Primary Fire)), Input Binding String(Button(Secondary Fire))), Custom String("{0} + {1} | 新建击杀球\\n{0} + {1} (长按) | 在准心位置新建", Input Binding String(Button(Interact)), Input Binding String(Button(Primary Fire))), Custom String("{0} + {1} | 新建弹球\\n{0} + {1} (长按) | 在准心位置新建", Input Binding String(Button(Interact)), Input Binding String(Button(Primary Fire))), Custom String("{0} + {1} | 蹭留\\n{0} + {2} | 卡小", Input Binding String(Button(Interact)), Input Binding String(Button(Primary Fire)), Input Binding String(Button(Secondary Fire))), Custom String("{0} + {1} | 新建传送门\\n{0} + {1} (长按) | 在准心位置新建", Input Binding String(Button(Interact)), Input Binding String(Button(Primary Fire)))), (Host Player).editor_modeSelect)), If-Then-Else(Global.EditorMoveItem, Custom String("Walk | Move Selected\\n{0} | Move Up\\n{1} | Move Down\\n{2} (Hold) | Move Faster", Input Binding String(Button(Ability 2)), Input Binding String(Button(Ultimate)), Input Binding String(Button(Jump))), Value In Array(Array(Custom String("{0} + {1} | Create New\\n{0} + {2} | Delete Selected", Input Binding String(Button(Interact)), Input Binding String(Button(Primary Fire)), Input Binding String(Button(Secondary Fire))), Custom String("{0} + {1} | Create New\\n{0} + {1} (Hold)| Raycast New", Input Binding String(Button(Interact)), Input Binding String(Button(Primary Fire))), Custom String("{0} + {1} | Create New\\n{0} + {1} (Hold)| Raycast New", Input Binding String(Button(Interact)), Input Binding String(Button(Primary Fire))), Custom String("{0} + {1} | Multi-Climb\\n{0} + {2} | Createbhop", Input Binding String(Button(Interact)), Input Binding String(Button(Primary Fire)), Input Binding String(Button(Secondary Fire))), Custom String("{0} + {1} | Create New\\n{0} + {1} (Hold)| Raycast New", Input Binding String(Button(Interact)), Input Binding String(Button(Primary Fire)))), (Host Player).editor_modeSelect))), Right, -148, Null, Null, Color(Yellow), Visible To and String, Default Visibility);
            Create HUD Text(If-Then-Else(And((Host Player).toggle_guide, Not(Global.EditorMoveItem)), Host Player, Null), Null, Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Value In Array(Array(Empty Array, Custom String("{0} + {1} | 删除选中的击杀球", Input Binding String(Button(Interact)), Input Binding String(Button(Secondary Fire))), Custom String("{0} + {1} | 删除选中的弹球", Input Binding String(Button(Interact)), Input Binding String(Button(Secondary Fire))), Empty Array, Custom String("{0} + {1} | 删除选中的传送门", Input Binding String(Button(Interact)), Input Binding String(Button(Secondary Fire)))), (Host Player).editor_modeSelect), Value In Array(Array(Empty Array, Custom String("{0} + {1} | Delete Selected", Input Binding String(Button(Interact)), Input Binding String(Button(Secondary Fire))), Custom String("{0} + {1} | Delete Selected", Input Binding String(Button(Interact)), Input Binding String(Button(Secondary Fire))), Empty Array, Custom String("{0} + {1} | Delete Selected", Input Binding String(Button(Interact)), Input Binding String(Button(Secondary Fire)))), (Host Player).editor_modeSelect)), Right, -147, Null, Null, Color(Yellow), Visible To and String, Default Visibility);
            Create HUD Text(If-Then-Else((Host Player).toggle_guide, Host Player, Null), Null, Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), If-Then-Else(Global.EditorMoveItem, Custom String("{0} | 放置实体{1} | Cancel Placement\\n", Input Binding String(Button(Primary Fire)), Input Binding String(Button(Secondary Fire))), Value In Array(Array(Custom String("{0} + {1} | 移除/新建传送点\\n{0} + {2} | 检查点碰撞模型\\n", Input Binding String(Button(Interact)), Input Binding String(Button(Reload)), Input Binding String(Button(Ability 1))), Custom String("{0} + {1} | 选择上一个击杀球\\n{0} + {2} | 选择下一个击杀球\\n", Input Binding String(Button(Interact)), Input Binding String(Button(Crouch)), Input Binding String(Button(Jump))), Custom String("{0} + {1} | 选择上一个弹球\\n{0} + {2} | 选择下一个弹球\\n", Input Binding String(Button(Interact)), Input Binding String(Button(Crouch)), Input Binding String(Button(Jump))), Custom String("{0} + {1} | 爬墙\\n{0} + {2} | 延二段跳", Input Binding String(Button(Interact)), Input Binding String(Button(Crouch)), Input Binding String(Button(Jump))), Custom String("{0} + {1} | 选择下一个传送门\\n{0} + {2} | 选择上一个传送门\\n", Input Binding String(Button(Interact)), Input Binding String(Button(Jump)), Input Binding String(Button(Crouch)))), (Host Player).editor_modeSelect)), If-Then-Else(Global.EditorMoveItem, Custom String("{0} | Confirm Placement\\n{1} | Cancel Placement", Input Binding String(Button(Primary Fire)), Input Binding String(Button(Secondary Fire))), Value In Array(Array(Custom String("{0} + {1} | Remove/Add Teleport\\n{0} + {2} | Toggle Hitbox\\n", Input Binding String(Button(Interact)), Input Binding String(Button(Reload)), Input Binding String(Button(Ability 1))), Custom String("{0} + {1} | Select Previous\\n{0} + {2} | Select Next\\n", Input Binding String(Button(Interact)), Input Binding String(Button(Crouch)), Input Binding String(Button(Jump))), Custom String("{0} + {1} | Select Previous\\n{0} + {2} | Select Next\\n", Input Binding String(Button(Interact)), Input Binding String(Button(Crouch)), Input Binding String(Button(Jump))), Custom String("{0} + {1} | Wallclimb\\n{0} + {2} | Save Double", Input Binding String(Button(Interact)), Input Binding String(Button(Crouch)), Input Binding String(Button(Jump))), Custom String("{0} + {1} | Select Next\\n{0} + {2} | Select Previous\\n", Input Binding String(Button(Interact)), Input Binding String(Button(Jump)), Input Binding String(Button(Crouch)))), (Host Player).editor_modeSelect))), Right, -146, Null, Null, Color(Yellow), Visible To and String, Default Visibility);
            Create HUD Text(If-Then-Else(And((Host Player).toggle_guide, Not(Global.EditorMoveItem)), Host Player, Null), Null, Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Value In Array(Array(Custom String("{0} (长按) | 移动检查点", Input Binding String(Button(Ability 2))), Custom String("{0} + {1} | 增大击杀球\\n{0} + {2} | 缩小击杀球", Input Binding String(Button(Ability 2)), Input Binding String(Button(Jump)), Input Binding String(Button(Crouch))), Custom String("{0} + {1} | 增加弹球弹力\\n{0} + {2} | 减少弹球弹力", Input Binding String(Button(Ability 2)), Input Binding String(Button(Jump)), Input Binding String(Button(Crouch))), Custom String("{0} + {1} | 死小\\n{0} + {2} | 表情留小", Input Binding String(Button(Ability 2)), Input Binding String(Button(Primary Fire)), Input Binding String(Button(Secondary Fire))), Custom String("{0} + {1} | 移动选中的实体\\n{0} + {2} | 应用到当前/所有关卡(开关)", Input Binding String(Button(Ability 2)), Input Binding String(Button(Primary Fire)), Input Binding String(Button(Jump)))), (Host Player).editor_modeSelect), Value In Array(Array(Custom String("{0} (Hold) | Move", Input Binding String(Button(Ability 2))), Custom String("{0} + {1} | Increase Size\\n{0} + {2} | Decrease Size", Input Binding String(Button(Ability 2)), Input Binding String(Button(Jump)), Input Binding String(Button(Crouch))), Custom String("{0} + {1} | Increase Strength\\n{0} + {2} | Decrease Strength", Input Binding String(Button(Ability 2)), Input Binding String(Button(Jump)), Input Binding String(Button(Crouch))), Custom String("{0} + {1} | Death Hop\\n{0} + {2} | Emote", Input Binding String(Button(Ability 2)), Input Binding String(Button(Primary Fire)), Input Binding String(Button(Secondary Fire))), Custom String("{0} + {1} | Move\\n{0} + {2} | Cp/Map (Toggle)", Input Binding String(Button(Ability 2)), Input Binding String(Button(Primary Fire)), Input Binding String(Button(Jump)))), (Host Player).editor_modeSelect)), Right, -145, Null, Null, Color(Yellow), Visible To and String, Default Visibility);
            Create HUD Text(If-Then-Else(And((Host Player).toggle_guide, Not(Global.EditorMoveItem)), Host Player, Null), Null, Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Value In Array(Array(Empty Array, Custom String("{0} + {1} | 移动选中的实体", Input Binding String(Button(Ability 2)), Input Binding String(Button(Primary Fire))), Custom String("{0} + {1} | 移动选中的实体", Input Binding String(Button(Ability 2)), Input Binding String(Button(Primary Fire))), Custom String("{0} + {1} | 留小跳进点\\n{0} + {2} | 站卡", Input Binding String(Button(Ability 2)), Input Binding String(Button(Jump)), Input Binding String(Button(Crouch))), Empty Array), (Host Player).editor_modeSelect), Value In Array(Array(Empty Array, Custom String("{0} + {1} | Move", Input Binding String(Button(Ability 2)), Input Binding String(Button(Primary Fire))), Custom String("{0} + {1} | Move", Input Binding String(Button(Ability 2)), Input Binding String(Button(Primary Fire))), Custom String("{0} + {1} | Require Bhop\\n{0} + {2} | Stand Create", Input Binding String(Button(Ability 2)), Input Binding String(Button(Jump)), Input Binding String(Button(Crouch))), Empty Array), (Host Player).editor_modeSelect)), Right, -144, Null, Null, Color(Yellow), Visible To and String, Default Visibility);
            Create HUD Text(If-Then-Else((Host Player).toggle_guide, Host Player, Null), Null, Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String(" \\n{0} + {1} | 下一关", Input Binding String(Button(Crouch)), Input Binding String(Button(Primary Fire))), Custom String(" \\n{0} + {1} | Next Checkpoint", Input Binding String(Button(Crouch)), Input Binding String(Button(Primary Fire)))), Right, -150, Null, Null, If-Then-Else((Host Player).toggle_guide, Color(Green), Color(Orange)), Visible To String and Color, Default Visibility);
            Create HUD Text(If-Then-Else((Host Player).toggle_guide, Host Player, Null), Null, Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("{0} + {1} | 上一关\\n{2} (长按) | 飞行\\n", Input Binding String(Button(Crouch)), Input Binding String(Button(Secondary Fire)), Input Binding String(Button(Ability 1))), Custom String("{0} + {1} | Prev Checkpoint\\n{2} (hold)| Fly\\n", Input Binding String(Button(Crouch)), Input Binding String(Button(Secondary Fire)), Input Binding String(Button(Ability 1)))), Right, -149, Null, Null, If-Then-Else((Host Player).toggle_guide, Color(Green), Color(Orange)), Visible To String and Color, Default Visibility);
            Create HUD Text(If-Then-Else((Host Player).toggle_guide, Host Player, Null), Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("保存地图长按 {0} + {1} + {2}", Input Binding String(Button(Interact)), Input Binding String(Button(Melee)), Custom String("{0} 后按弹出窗口的提示进行操作                                                                                                ", Input Binding String(Button(Reload)))), Custom String("To Save Map, Hold {0} + {1} + {2}", Input Binding String(Button(Interact)), Input Binding String(Button(Melee)), Custom String("{0} Then Follow Instructions                                                                                                ", Input Binding String(Button(Reload))))), Null, Left, -197, Null, Color(Yellow), Null, Visible To and String, Default Visibility);
            Create HUD Text(If-Then-Else((Local Player).editor_saveCache, Null, Local Player), If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), If-Then-Else(Is Button Held(Host Player, Button(Melee)), Custom String("{0} 检查点模式\\n{1} 击杀球模式\\n{2}", If-Then-Else((Host Player).editor_modeSelect, Custom String("     "), Icon String(Arrow: Right)), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 1), Icon String(Arrow: Right), Custom String("     ")), Custom String("{0} 弹球模式\\n{1} 封禁(单关)\\n{2} 自定义传送门 ", If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 2), Icon String(Arrow: Right), Custom String("     ")), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 3), Icon String(Arrow: Right), Custom String("     ")), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 4), Icon String(Arrow: Right), Custom String("     ")))), If-Then-Else(Compare(Local Player, ==, Host Player), Custom String(" {0} {1} ", Value In Array(Array(Icon String(Flag), Icon String(Skull), Icon String(Moon), Icon String(Stop), Icon String(Spiral)), (Host Player).editor_modeSelect), Value In Array(String Split(Custom String("检查点模式0击杀球模式0弹球模式0封禁(单关)0自定义传送门"), First Of(Null)), (Host Player).editor_modeSelect)), Custom String(" {0} 源氏 编辑者 {0} ", Icon String(Bolt)))), If-Then-Else(Is Button Held(Host Player, Button(Melee)), Custom String("{0} Checkpoints\\n{1} Boundary Spheres\\n{2}", If-Then-Else((Host Player).editor_modeSelect, Custom String("     "), Icon String(Arrow: Right)), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 1), Icon String(Arrow: Right), Custom String("     ")), Custom String("{0} Function Orbs\\n{1} Skill Bans\\n{2} Portals", If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 2), Icon String(Arrow: Right), Custom String("     ")), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 3), Icon String(Arrow: Right), Custom String("     ")), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 4), Icon String(Arrow: Right), Custom String("     ")))), If-Then-Else(Compare(Local Player, ==, Host Player), Custom String(" {0} {1} ", Value In Array(Array(Icon String(Flag), Icon String(Skull), Icon String(Moon), Icon String(Stop), Icon String(Spiral)), (Host Player).editor_modeSelect), Value In Array(String Split(Custom String("Checkpoints0Boundary Spheres0Function Orbs0Skill Bans0Portals"), First Of(Null)), (Host Player).editor_modeSelect)), Custom String(" {0} Genji Editor {0} ", Icon String(Bolt))))), Null, Null, Top, -174, Color(Blue), Null, Null, Visible To and String, Default Visibility);
            Create HUD Text(First Of(True), Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), If-Then-Else(Compare(Local Player, ==, Host Player), Custom String("{0} + 射击 | 切换作图模式", Input Binding String(Button(Melee))), Custom String("房主/编辑者 {0}", Host Player)), If-Then-Else(Compare(Local Player, ==, Host Player), Custom String("{0} + Shoot | Change Mode", Input Binding String(Button(Melee))), Custom String("Current Host/Editor: {0}", Host Player))), Null, Top, -175, Null, If-Then-Else((Local Player).editor_lock, Color(Grau), Color(Weiß)), Null, Visible To String and Color, Default Visibility);
            Create HUD Text(If-Then-Else(And((Host Player).toggle_guide, Or(Not((Host Player).editor_modeSelect), And(Compare((Host Player).editor_modeSelect, ==, 2), Count Of((Host Player).editor_bounceIndex)))), Host Player, Null), Null, Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("{0} + {1} | {2}", Input Binding String(Button(Ultimate)), Input Binding String(Button(Primary Fire)), Custom String("{0} {1} | {2}                                                                                                ", If-Then-Else((Host Player).editor_modeSelect, Custom String("弹球给刀"), Custom String("检查点给刀")), Ability Icon String(Hero(Genji), Button(Ultimate)), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 2), Value In Array(Global.TQ5, Global.EditSelected), Array Contains(Global.Dao, (Host Player).checkpoint_current)))), Custom String("{0} + {1} | {2}", Input Binding String(Button(Ultimate)), Input Binding String(Button(Primary Fire)), Custom String("{0} Give Ult {1} | {2}                                                                                                ", If-Then-Else((Host Player).editor_modeSelect, Custom String("Orb"), Custom String("Level")), Ability Icon String(Hero(Genji), Button(Ultimate)), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 2), Value In Array(Global.TQ5, Global.EditSelected), Array Contains(Global.Dao, (Host Player).checkpoint_current))))), Left, -189, Null, Null, If-Then-Else(And(Value In Array(Global.TQ5, Global.EditSelected), Compare((Host Player).editor_modeSelect, ==, 2)), Color(Green), If-Then-Else(And(Array Contains(Global.Dao, (Host Player).checkpoint_current), Not((Host Player).editor_modeSelect)), Color(Green), Color(Orange))), Visible To String and Color, Default Visibility);
            Create HUD Text(If-Then-Else(And((Host Player).toggle_guide, Or(Not((Host Player).editor_modeSelect), And(Compare((Host Player).editor_modeSelect, ==, 2), Count Of((Host Player).editor_bounceIndex)))), Host Player, Null), Null, Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("{0} + {1} | {2}", Input Binding String(Button(Ultimate)), Input Binding String(Button(Secondary Fire)), Custom String("{0} {1} | {2}                                                                                                ", If-Then-Else((Host Player).editor_modeSelect, Custom String("弹球给Shift"), Custom String("检查点给Shift")), Ability Icon String(Hero(Genji), Button(Ability 1)), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 2), Value In Array(Global.TQ6, Global.EditSelected), Array Contains(Global.SHIFT, (Host Player).checkpoint_current)))), Custom String("{0} + {1} | {2}", Input Binding String(Button(Ultimate)), Input Binding String(Button(Secondary Fire)), Custom String("{0} Give Dash {1} | {2}                                                                                                ", If-Then-Else((Host Player).editor_modeSelect, Custom String("Orb"), Custom String("Level")), Ability Icon String(Hero(Genji), Button(Ability 1)), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 2), Value In Array(Global.TQ6, Global.EditSelected), Array Contains(Global.SHIFT, (Host Player).checkpoint_current))))), Left, -188, Null, Null, If-Then-Else(And(Value In Array(Global.TQ6, Global.EditSelected), Compare((Host Player).editor_modeSelect, ==, 2)), Color(Green), If-Then-Else(And(Array Contains(Global.SHIFT, (Host Player).checkpoint_current), Not((Host Player).editor_modeSelect)), Color(Green), Color(Orange))), Visible To String and Color, Default Visibility);
            Create HUD Text(If-Then-Else(And(And(Compare((Host Player).editor_modeSelect, ==, 2), (Host Player).toggle_guide), Count Of((Host Player).editor_bounceIndex)), Host Player, Null), Null, Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("{0} + {1} |  收集球(进点前必须集齐) {2}", Input Binding String(Button(Ultimate)), Input Binding String(Button(Ability 2)), Custom String("{0} | {1}\\n                                                                                                ", Icon String(Asterisk), Value In Array(Global.BounceToggleLock, Global.EditSelected))), Custom String("{0} + {1} | Unlocks Checkpoint {2}", Input Binding String(Button(Ultimate)), Input Binding String(Button(Ability 2)), Custom String("{0} | {1}\\n                                                                                                ", Icon String(Asterisk), Value In Array(Global.BounceToggleLock, Global.EditSelected)))), Left, -187, Null, Null, If-Then-Else(Value In Array(Global.BounceToggleLock, Global.EditSelected), Color(Green), Color(Orange)), Visible To String and Color, Default Visibility);
            Create HUD Text(If-Then-Else((Host Player).toggle_guide, Host Player, Null), If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("球体/传送门上限: {0}/193 ", Add(Add(Count Of(Global.TQ), Count Of(Global.H)), Count Of(Global.CustomPortalStart))), Custom String("Orb/Portal Limit: {0}/193 ", Add(Add(Count Of(Global.TQ), Count Of(Global.H)), Count Of(Global.CustomPortalStart)))), Null, Custom String("                                                                                                                                "), Left, -191, Color(Blue), Null, Null, Visible To and String, Default Visibility);
            "display selected cc/orb info"
            Create HUD Text(If-Then-Else((Host Player).toggle_guide, Host Player, Null), If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), If-Then-Else(And(Not((Host Player).editor_modeSelect), Count Of(Global.A)), Custom String("\\n 选中的检查点 \\n 矢量: {0}{1} \\n", Value In Array(Global.A, (Host Player).checkpoint_current), If-Then-Else(Compare(Count Of(Value In Array(Global.A, (Host Player).checkpoint_current)), <, 2), Empty Array, Custom String("\\n 传送点: {0}", Value In Array(Value In Array(Global.A, (Host Player).checkpoint_current), True)))), If-Then-Else(And(Compare((Host Player).editor_modeSelect, ==, 1), Count Of((Host Player).editor_killIndex)), Custom String("\\n 选中的击杀球\\n 矢量: {0}\\n 半径: {1}\\n  + 進不去\\n  - 出不來\\n", Value In Array(Global.H, Global.EditSelected), Value In Array(Global.I, Global.EditSelected)), If-Then-Else(And(Compare((Host Player).editor_modeSelect, ==, 2), Count Of((Host Player).editor_bounceIndex)), Custom String("\\n 选中的弹球\\n 矢量: {0}\\n 弹力: {1}\\n 序号: {2}\\n", Value In Array(Global.TQ, Global.EditSelected), Value In Array(Global.EditMode, Global.EditSelected), Global.EditSelected), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 3), Custom String("\\n 封禁(单关)\\n――――――――――――\\n {0} 蹭留 ∞\\n {1} 卡小 ♂\\n {2}", If-Then-Else(Array Contains(Global.BanMulti, (Host Player).checkpoint_current), Custom String("√"), Empty Array), If-Then-Else(Array Contains(Global.BanCreate, (Host Player).checkpoint_current), Custom String("√"), Empty Array), Custom String("{0} 站卡 ♠\\n {1} 爬墙 ↑\\n {2}", If-Then-Else(Array Contains(Global.BanStand, (Host Player).checkpoint_current), Custom String("√"), Empty Array), If-Then-Else(Array Contains(Global.BanClimb, (Host Player).checkpoint_current), Custom String("√"), Empty Array), Custom String("{0} 死小 X\\n {1} 表情留小 ♥\\n {2}", If-Then-Else(Array Contains(Global.BanDead, (Host Player).checkpoint_current), Custom String("√"), Empty Array), If-Then-Else(Array Contains(Global.BanEmote, (Host Player).checkpoint_current), Custom String("√"), Empty Array), Custom String("{0} 延二段跳 △\\n――――――――――――\\n {1} 留小跳进点 ≥\\n", If-Then-Else(Array Contains(Global.BanSaveDouble, (Host Player).checkpoint_current), Custom String("√"), Empty Array), If-Then-Else(Array Contains(Global.BanBhop, (Host Player).checkpoint_current), Custom String("√"), Empty Array))))), If-Then-Else(And(And(Compare((Host Player).editor_modeSelect, ==, 4), Array Contains(Array((Host Player).checkpoint_current, -1), Value In Array(Global.CustomPortalCP, Global.EditSelected))), Count Of(Global.CustomPortalCP)), Custom String("\\n 入口矢量: {0}\\n 出口矢量: {1}\\n 应用关卡: {2}\\n", Value In Array(Global.CustomPortalStart, Global.EditSelected), Value In Array(Global.CustomPortalEndpoint, Global.EditSelected), If-Then-Else(Compare(Value In Array(Global.CustomPortalCP, Global.EditSelected), <, Null), Custom String("所有"), (Host Player).checkpoint_current)), Custom String("\\n   当前无数据选中   \\n")))))), If-Then-Else(And(Not((Host Player).editor_modeSelect), Count Of(Global.A)), Custom String("\\n Selected Checkpoint\\n Vector: {0}{1} \\n", Value In Array(Global.A, (Host Player).checkpoint_current), If-Then-Else(Compare(Count Of(Value In Array(Global.A, (Host Player).checkpoint_current)), <, 2), Empty Array, Custom String("\\n Teleport: {0}", Value In Array(Value In Array(Global.A, (Host Player).checkpoint_current), True)))), If-Then-Else(And(Compare((Host Player).editor_modeSelect, ==, 1), Count Of((Host Player).editor_killIndex)), Custom String("\\n Selected Boundary Sphere\\n Vector: {0}\\n Radius: {1}\\n  + Keep Out\\n  - Stay In\\n", Value In Array(Global.H, Global.EditSelected), Value In Array(Global.I, Global.EditSelected)), If-Then-Else(And(Compare((Host Player).editor_modeSelect, ==, 2), Count Of((Host Player).editor_bounceIndex)), Custom String("\\n Selected Bounce Orb\\n Vector: {0}\\n Strength: {1} \\n ID: {2}\\n", Value In Array(Global.TQ, Global.EditSelected), Value In Array(Global.EditMode, Global.EditSelected), Global.EditSelected), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 3), Custom String("\\n Skill Bans\\n――――――――――――\\n {0} Multi-Climb ∞\\n {1} Create ♂\\n {2}", If-Then-Else(Array Contains(Global.BanMulti, (Host Player).checkpoint_current), Custom String("√"), Empty Array), If-Then-Else(Array Contains(Global.BanCreate, (Host Player).checkpoint_current), Custom String("√"), Empty Array), Custom String("{0} Stand ♠\\n {1} Climb ↑\\n {2}", If-Then-Else(Array Contains(Global.BanStand, (Host Player).checkpoint_current), Custom String("√"), Empty Array), If-Then-Else(Array Contains(Global.BanClimb, (Host Player).checkpoint_current), Custom String("√"), Empty Array), Custom String("{0} Dead X\\n {1} Emote ♥\\n {2}", If-Then-Else(Array Contains(Global.BanDead, (Host Player).checkpoint_current), Custom String("√"), Empty Array), If-Then-Else(Array Contains(Global.BanEmote, (Host Player).checkpoint_current), Custom String("√"), Empty Array), Custom String("{0} Save Double △\\n――――――――――――\\n {1} Require Bhop ≥\\n", If-Then-Else(Array Contains(Global.BanSaveDouble, (Host Player).checkpoint_current), Custom String("√"), Empty Array), If-Then-Else(Array Contains(Global.BanBhop, (Host Player).checkpoint_current), Custom String("√"), Empty Array))))), If-Then-Else(And(And(Compare((Host Player).editor_modeSelect, ==, 4), Array Contains(Array((Host Player).checkpoint_current, -1), Value In Array(Global.CustomPortalCP, Global.EditSelected))), Count Of(Global.CustomPortalCP)), Custom String("\\n Start: {0} \\n End: {1} \\n CP: {2} \\n", Value In Array(Global.CustomPortalStart, Global.EditSelected), Value In Array(Global.CustomPortalEndpoint, Global.EditSelected), If-Then-Else(Compare(Value In Array(Global.CustomPortalCP, Global.EditSelected), <, Null), Custom String("All"), (Host Player).checkpoint_current)), Custom String("\\n   No Data Selected   \\n"))))))), Null, Custom String("                                                                                                                                "), Left, -190, Color(Weiß), Null, Color(Orange), Visible To and String, Default Visibility);
            "effects =========================================================================================================================================================================="
            Create In-World Text(If-Then-Else(Count Of(Global.EditSelectIdArray), True, Null), If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("选中的实体"), Custom String("Selected")), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 1), Value In Array(Global.H, Global.EditSelected), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 2), Value In Array(Global.TQ, Global.EditSelected), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 4), Value In Array(Global.CustomPortalStart, Global.EditSelected), Null))), 1.2, Do Not Clip, Visible To and Position, Color(Orange), Default Visibility);
            Create Icon(If-Then-Else(Count Of(Global.EditSelectIdArray), True, Null), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 1), Value In Array(Global.H, Global.EditSelected), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 2), Value In Array(Global.TQ, Global.EditSelected), If-Then-Else(Compare((Host Player).editor_modeSelect, ==, 4), Value In Array(Global.CustomPortalStart, Global.EditSelected), Null))), Arrow: Down, Visible To and Position, Color(Weiß), True);
            "Purple sphere for teleport location"
            Create Effect(If-Then-Else(And(Compare(Count Of(Value In Array(Global.A, (Host Player).checkpoint_current)), >, 1), Not((Host Player).editor_modeSelect)), Host Player, Null), Sphere, Color(Purple), Subtract(Value In Array(Value In Array(Global.A, (Host Player).checkpoint_current), True), Multiply(0.1, Up)), 0.2, Visible To Position and Radius);
            "Teleport text"
            Create In-World Text(If-Then-Else(And(Compare(Count Of(Value In Array(Global.A, (Host Player).checkpoint_current)), >, 1), Not((Host Player).editor_modeSelect)), Host Player, Null), If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("传送点位置"), Custom String("teleporter location")), Value In Array(Value In Array(Global.A, (Host Player).checkpoint_current), True), 1.6, Do Not Clip, Visible To Position and String, Color(Sky Blue), Default Visibility);
            "normal cp if teleport"
            Create Effect(If-Then-Else(And(Value In Array(Value In Array(Global.A, (Host Player).checkpoint_current), True), Not((Host Player).editor_modeSelect)), Host Player, Null), Ring, Color(Orange), First Of(Value In Array(Global.A, (Host Player).checkpoint_current)), True, Visible To Position and Radius);
            Create In-World Text(If-Then-Else(And(Value In Array(Value In Array(Global.A, (Host Player).checkpoint_current), True), Not((Host Player).editor_modeSelect)), Host Player, Null), If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("检查点位置"), Custom String("level location")), First Of(Value In Array(Global.A, (Host Player).checkpoint_current)), 1.6, Do Not Clip, Visible To Position and String, Color(Sky Blue), Default Visibility);
            "portal fx"
            Create Effect(If-Then-Else(And(Count Of(Global.EditSelectIdArray), Compare((Host Player).editor_modeSelect, ==, 4)), Host Player, Null), Sparkles, Color(Purple), Value In Array(Global.CustomPortalEndpoint, Global.EditSelected), 0.2, Visible To Position and Radius);
    }
}

regel ("Editor | Toggle Fly & Noclip") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Global.EditorOn != False;
        Is Button Held(Event Player, Button(Ability 1)) == True;
        (Event Player).editor_fly == Null;
        And(Global.EditorMoveItem, Compare(Event Player, ==, Host Player)) == False;
    }
    aktionen {
        Wait Until(Or(Is Button Held(Event Player, Button(Reload)), Not(Is Button Held(Event Player, Button(Ability 1)))), 0.7);
        If(Or(Is Button Held(Event Player, Button(Reload)), Not(Is Button Held(Event Player, Button(Ability 1)))));
            Wait(False, Ignore Condition);
            Abort;
        End;
        Set Player Variable(Event Player, editor_fly, Add(Position Of(Event Player), Up));
        Start Forcing Player Position(Event Player, (Event Player).editor_fly, True);
        Disable Movement Collision With Environment(Event Player, True);
        Disallow Button(Event Player, Button(Ultimate));
        Wait Until(Not(Is Button Held(Event Player, Button(Ability 1))), True);
        While(And(And(Is Alive(Event Player), (Event Player).editor_fly), Not(Is Button Held(Event Player, Button(Ability 1)))));
            If(Or(Compare(Event Player, !=, Host Player), Not((Event Player).editor_lock)));
                Modify Player Variable(Event Player, editor_fly, Add, Multiply(Subtract(Add(0.096, Multiply(0.192, Is Button Held(Event Player, Button(Jump)))), Multiply(0.048, Is Button Held(Event Player, Button(Crouch)))), Add(Add(Multiply(Multiply(Facing Direction Of(Event Player), Z Component Of(Throttle Of(Event Player))), Vector(True, Not(Is Button Held(Event Player, Button(Ability 1))), True)), World Vector Of(Multiply(Throttle Of(Event Player), Left), Event Player, Rotation)), Multiply(Up, Subtract(Is Button Held(Event Player, Button(Ability 2)), Is Button Held(Event Player, Button(Ultimate)))))));
            Else If(Not((Host Player).editor_modeSelect));
                Modify Player Variable(Event Player, editor_fly, Add, Multiply(Add(0.00288, Multiply(0.09312, Is Button Held(Event Player, Button(Primary Fire)))), Add(Add(Multiply(Facing Direction Of(Event Player), Z Component Of(Throttle Of(Event Player))), World Vector Of(Multiply(Throttle Of(Event Player), Left), Event Player, Rotation)), Multiply(Up, Subtract(Is Button Held(Event Player, Button(Jump)), Is Button Held(Event Player, Button(Crouch)))))));
            End;
            Wait(False, Ignore Condition);
        End;
        Allow Button(Event Player, Button(Ultimate));
        Enable Movement Collision With Environment(Event Player);
        Set Player Variable(Event Player, editor_fly, Null);
        Stop Forcing Player Position(Event Player);
        Wait(True, Ignore Condition);
    }
}

regel ("Editor | Change Mode") {
    event {
        Ongoing - Global;
    }
    bedingungen {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        Global.EditorOn != False;
        (Host Player).editor_lock == False;
        Is Button Held(Host Player, Button(Melee)) == True;
        Is Button Held(Host Player, Button(Primary Fire)) != Is Button Held(Host Player, Button(Secondary Fire));
    }
    aktionen {
        Set Player Variable(Host Player, editor_lock, True);
        If(Is Button Held(Host Player, Button(Primary Fire)));
            Modify Player Variable(Host Player, editor_modeSelect, Add, 4);
        Else;
            Modify Player Variable(Host Player, editor_modeSelect, Add, True);
        End;
        Modify Player Variable(Host Player, editor_modeSelect, Modulo, 5);
        Call Subroutine(EditUpdateSelectedIds);
        Call Subroutine(EditorSelectLast);
        Wait(False, Ignore Condition);
        Wait Until(Compare(Is Button Held(Host Player, Button(Primary Fire)), ==, Is Button Held(Host Player, Button(Secondary Fire))), 0.1);
        Set Player Variable(Host Player, editor_lock, False);
    }
}

regel ("Editor | Update Selected Id") {
    event {
        Subroutine;
        EditUpdateSelectedIds;
    }
    aktionen {
        If(Compare((Host Player).editor_modeSelect, ==, 1));
            Set Global Variable(EditSelectIdArray, Mapped Array(Global.killballnumber, Current Array Index));
            Set Global Variable(EditSelectIdArray, Filtered Array(Global.EditSelectIdArray, Compare(Value In Array(Global.killballnumber, Current Array Element), ==, (Host Player).checkpoint_current)));
        Else If(Compare((Host Player).editor_modeSelect, ==, 2));
            Set Global Variable(EditSelectIdArray, Mapped Array(Global.pinballnumber, Current Array Index));
            Set Global Variable(EditSelectIdArray, Filtered Array(Global.EditSelectIdArray, Compare(Value In Array(Global.pinballnumber, Current Array Element), ==, (Host Player).checkpoint_current)));
        Else If(Compare((Host Player).editor_modeSelect, ==, 4));
            Set Global Variable(EditSelectIdArray, Mapped Array(Global.CustomPortalCP, Current Array Index));
            Set Global Variable(EditSelectIdArray, Filtered Array(Global.EditSelectIdArray, Or(Compare(Value In Array(Global.CustomPortalCP, Current Array Element), <, Null), Compare(Value In Array(Global.CustomPortalCP, Current Array Element), ==, (Host Player).checkpoint_current))));
        Else;
            Set Global Variable(EditSelectIdArray, Empty Array);
        End;
    }
}

regel ("Editor | Select Last") {
    event {
        Subroutine;
        EditorSelectLast;
    }
    aktionen {
        Set Global Variable(EditSelected, Last Of(Global.EditSelectIdArray));
    }
}

regel ("Editor | Create Cp/Orb") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        "Required for UpdateCache()"
        Event Player == Host Player;
        Global.EditorOn != False;
        (Host Player).editor_lock == False;
        Array Contains(Array(Null, 1, 2, 4), (Host Player).editor_modeSelect) == True;
        Is Button Held(Host Player, Button(Interact)) == True;
        Is Button Held(Host Player, Button(Primary Fire)) == True;
    }
    aktionen {
        Set Player Variable(Host Player, editor_lock, True);
        If(Not((Host Player).editor_modeSelect));
            If(And(Count Of(Global.A), Compare(Distance Between(Host Player, Value In Array(Global.A, (Host Player).checkpoint_current)), <=, 1.4)));
                Small Message(Host Player, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("   放置的检查点距离太近"), Custom String("   Cannot Place Checkpoint Too Close.")));
            Else;
                "$$"
                If(Compare((Host Player).checkpoint_current, >=, Subtract(Count Of(Global.A), True)));
                    Set Player Variable(Host Player, checkpoint_current, Subtract(Count Of(Global.A), True));
                End;
                If(Compare((Host Player).checkpoint_current, ==, Subtract(Count Of(Global.A), True)));
                    Modify Global Variable(A, Append To Array, Position Of(Host Player));
                    Modify Player Variable(Host Player, checkpoint_current, Add, True);
                Else;
                    Modify Global Variable(A, Append To Array, Position Of(Host Player));
                    Set Global Variable(A, Mapped Array(Global.A, If-Then-Else(Compare(Current Array Index, <, Add((Host Player).checkpoint_current, True)), Current Array Element, If-Then-Else(Compare(Current Array Index, ==, Add((Host Player).checkpoint_current, True)), Last Of(Global.A), Value In Array(Global.A, Subtract(Current Array Index, True))))));
                    Modify Player Variable(Host Player, checkpoint_current, Add, True);
                    Set Global Variable(killballnumber, Mapped Array(Global.killballnumber, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                    Set Global Variable(pinballnumber, Mapped Array(Global.pinballnumber, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                    Set Global Variable(CustomPortalCP, Mapped Array(Global.CustomPortalCP, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                    Set Global Variable(Dao, Mapped Array(Global.Dao, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                    Set Global Variable(SHIFT, Mapped Array(Global.SHIFT, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                    Set Global Variable(BanMulti, Mapped Array(Global.BanMulti, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                    Set Global Variable(BanCreate, Mapped Array(Global.BanCreate, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                    Set Global Variable(BanStand, Mapped Array(Global.BanStand, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                    Set Global Variable(BanDead, Mapped Array(Global.BanDead, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                    Set Global Variable(BanEmote, Mapped Array(Global.BanEmote, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                    Set Global Variable(BanClimb, Mapped Array(Global.BanClimb, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                    Set Global Variable(BanSaveDouble, Mapped Array(Global.BanSaveDouble, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                    Set Global Variable(BanBhop, Mapped Array(Global.BanBhop, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                    Set Global Variable(BanDjump, Mapped Array(Global.BanDjump, Add(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
                End;
                Call Subroutine(UpdateCache);
                Small Message(Host Player, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("   新检查点已创建"), Custom String("   New Checkpoint Created")));
            End;
        Else If(Not(Count Of(Global.A)));
            Small Message(Host Player, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("   请先放置检查点"), Custom String("   Make A Checkpoint First")));
        Else If(Compare(Add(Add(Count Of(Global.TQ), Count Of(Global.H)), Count Of(Global.CustomPortalStart)), >=, 193));
            Big Message(Host Player, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("当前地图弹球/传送门数量已达上限"), Custom String("Orb/Portal Limit Reached For This Map")));
        Else If(Compare((Host Player).editor_modeSelect, ==, 1));
            Modify Global Variable(H, Append To Array, Position Of(Host Player));
            Modify Global Variable(killballnumber, Append To Array, (Host Player).checkpoint_current);
            Modify Global Variable(I, Append To Array, 5);
            "to create the fx properly"
            Call Subroutine(EditUpdateSelectedIds);
            Call Subroutine(EditorSelectLast);
            Create Effect(Filtered Array(All Players(All Teams), Compare((Current Array Element).checkpoint_current, ==, Value In Array(Global.killballnumber, Evaluate Once(Global.EditSelected)))), Sphere, Value In Array(Global.ColorConfig, 14), Value In Array(Global.H, Evaluate Once(Global.EditSelected)), Absolute Value(Value In Array(Global.I, Evaluate Once(Global.EditSelected))), Visible To Position and Radius);
            Modify Global Variable(K, Append To Array, Last Created Entity);
            Big Message(First Of(True), Custom String("{0} {1}", If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("新击杀球已创建! \\n仅生效于检查点"), Custom String("New boundary Sphere Created! \\nOnly Valid For This Checkpoint")), (Host Player).checkpoint_current));
            Wait Until(Not(And(Is Button Held(Host Player, Button(Interact)), Is Button Held(Host Player, Button(Primary Fire)))), True);
            "EditUpdateSelectedIds() # to arrow during the placement properly"
            While(And(Is Button Held(Host Player, Button(Interact)), Is Button Held(Host Player, Button(Primary Fire))));
                Set Global Variable At Index(H, Global.EditSelected, Ray Cast Hit Position(Eye Position(Host Player), Add(Eye Position(Host Player), Multiply(Facing Direction Of(Host Player), 8)), Null, Null, False));
                Wait(False, Ignore Condition);
            End;
            "UpdateCache()"
            Set Global Variable(EditorMoveItem, True);
        Else If(Compare((Host Player).editor_modeSelect, ==, 2));
            Modify Global Variable(TQ, Append To Array, Position Of(Host Player));
            Modify Global Variable(pinballnumber, Append To Array, (Host Player).checkpoint_current);
            Modify Global Variable(EditMode, Append To Array, 10);
            Modify Global Variable(TQ5, Append To Array, False);
            Modify Global Variable(TQ6, Append To Array, False);
            Modify Global Variable(BounceToggleLock, Append To Array, False);
            Call Subroutine(EditUpdateSelectedIds);
            Call Subroutine(EditorSelectLast);
            Create Effect(Filtered Array(Append To Array(All Players(All Teams), Null), And(Compare((Current Array Element).checkpoint_current, ==, Value In Array(Global.pinballnumber, Evaluate Once(Global.EditSelected))), Not(Array Contains((Current Array Element).cache_collectedLocks, Evaluate Once(Global.EditSelected))))), Orb, If-Then-Else(Value In Array(Global.BounceToggleLock, Evaluate Once(Global.EditSelected)), Value In Array(Global.ColorConfig, 16), Value In Array(Global.ColorConfig, 15)), Value In Array(Global.TQ, Evaluate Once(Global.EditSelected)), True, Visible To Position Radius and Color);
            Modify Global Variable(TQ2, Append To Array, Last Created Entity);
            Big Message(First Of(True), Custom String("{0} {1}", If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("新弹球已创建! \\n仅生效于检查点"), Custom String("New Bounce Orb Created! \\nOnly Valid For This Checkpoint")), (Host Player).checkpoint_current));
            Wait Until(Not(And(Is Button Held(Host Player, Button(Interact)), Is Button Held(Host Player, Button(Primary Fire)))), True);
            While(And(Is Button Held(Host Player, Button(Interact)), Is Button Held(Host Player, Button(Primary Fire))));
                Set Global Variable At Index(TQ, Global.EditSelected, Ray Cast Hit Position(Eye Position(Host Player), Add(Eye Position(Host Player), Multiply(Facing Direction Of(Host Player), 7)), Null, Null, False));
                Wait(False, Ignore Condition);
            End;
            "UpdateCache()"
            Set Global Variable(EditorMoveItem, True);
        Else If(Compare((Host Player).editor_modeSelect, ==, 4));
            Modify Global Variable(CustomPortalStart, Append To Array, Position Of(Host Player));
            Modify Global Variable(CustomPortalEndpoint, Append To Array, Add(Position Of(Host Player), Multiply(10, Up)));
            Modify Global Variable(CustomPortalCP, Append To Array, (Host Player).checkpoint_current);
            Call Subroutine(EditUpdateSelectedIds);
            Call Subroutine(EditorSelectLast);
            Create Effect(Filtered Array(All Players(All Teams), Or(Compare(Value In Array(Global.CustomPortalCP, Evaluate Once(Global.EditSelected)), ==, (Current Array Element).checkpoint_current), Compare(Value In Array(Global.CustomPortalCP, Evaluate Once(Global.EditSelected)), <, Null))), Good Aura, Value In Array(Global.ColorConfig, 17), Value In Array(Global.CustomPortalStart, Evaluate Once(Global.EditSelected)), 0.6, Visible To Position Radius and Color);
            Modify Global Variable(PortalEffects, Append To Array, Last Created Entity);
            Set Global Variable(EditSelected, Subtract(Count Of(Global.CustomPortalStart), True));
            Wait Until(Not(And(Is Button Held(Host Player, Button(Interact)), Is Button Held(Host Player, Button(Primary Fire)))), True);
            "EditUpdateSelectedIds()"
            While(And(Is Button Held(Host Player, Button(Interact)), Is Button Held(Host Player, Button(Primary Fire))));
                Set Global Variable At Index(CustomPortalStart, Global.EditSelected, Ray Cast Hit Position(Eye Position(Host Player), Add(Eye Position(Host Player), Multiply(Facing Direction Of(Host Player), 6)), Null, Null, False));
                Wait(False, Ignore Condition);
            End;
            Big Message(First Of(True), If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("新传送门已创建!\\n生效于当前检查点"), Custom String("Portal Created \\nOnly Valid For This Checkpoint")));
            Set Global Variable(EditorMoveItem, True);
        End;
        Set Player Variable(Host Player, editor_lock, False);
        Wait(0.64, Ignore Condition);
    }
}

regel ("Editor | Delete Cp/Orb/Portal") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        "Required for UpdateCache()"
        Event Player == Host Player;
        Global.EditorOn != False;
        (Host Player).editor_lock == False;
        Is Button Held(Host Player, Button(Interact)) == True;
        Is Button Held(Host Player, Button(Secondary Fire)) == True;
    }
    aktionen {
        "@Condition EditorMoveItem == false\\n@Condition len(EditSelectIdArray) > 0"
        Set Player Variable(Host Player, editor_lock, True);
        If(And(Not((Host Player).editor_modeSelect), Count Of(Global.A)));
            "Resync Kill Orbs =================="
            Set Player Variable(Host Player, editor_temp, Filtered Array(Mapped Array(Global.killballnumber, If-Then-Else(Compare(Current Array Element, ==, (Host Player).checkpoint_current), Current Array Index, -1)), Compare(Current Array Element, >=, Null)));
            "hostPlayer.editor_temp = [i for e, i in KillballCheckpoints if e == hostPlayer.checkpoint_current]"
            For Global Variable(NANBA, 0, Count Of((Host Player).editor_temp), True);
                Destroy Effect(Value In Array(Global.K, Value In Array((Host Player).editor_temp, Global.NANBA)));
                Modify Global Variable(K, Remove From Array By Index, Value In Array((Host Player).editor_temp, Global.NANBA));
                Wait(False, Ignore Condition);
            End;
            Modify Global Variable(killballnumber, Remove From Array By Value, (Host Player).checkpoint_current);
            "Decrement checkpoints after removed one"
            Set Global Variable(killballnumber, Mapped Array(Global.killballnumber, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >, (Host Player).checkpoint_current), 1, Null))));
            "Remove Radii at Checkpoint indexes (temp)"
            Set Global Variable(I, Filtered Array(Global.I, Not(Array Contains((Host Player).editor_temp, Current Array Index))));
            Set Global Variable(H, Filtered Array(Global.H, Not(Array Contains((Host Player).editor_temp, Current Array Index))));
            "Resync Bounce Orbs =============="
            Set Player Variable(Host Player, editor_temp, Filtered Array(Mapped Array(Global.pinballnumber, If-Then-Else(Compare(Current Array Element, ==, (Host Player).checkpoint_current), Current Array Index, -1)), Compare(Current Array Element, >=, Null)));
            "hostPlayer.editor_temp = [i for e, i in BouncePadCheckpoints if e == hostPlayer.checkpoint_current]"
            For Global Variable(NANBA, 0, Count Of((Host Player).editor_temp), True);
                Destroy Effect(Value In Array(Global.TQ2, Value In Array((Host Player).editor_temp, Global.NANBA)));
                Modify Global Variable(TQ2, Remove From Array By Index, Value In Array((Host Player).editor_temp, Global.NANBA));
                Wait(False, Ignore Condition);
            End;
            Modify Global Variable(pinballnumber, Remove From Array By Value, (Host Player).checkpoint_current);
            "Decrement checkpoints after removed one"
            Set Global Variable(pinballnumber, Mapped Array(Global.pinballnumber, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >, (Host Player).checkpoint_current), 1, Null))));
            Set Global Variable(TQ, Filtered Array(Global.TQ, Not(Array Contains((Host Player).editor_temp, Current Array Index))));
            Set Global Variable(EditMode, Filtered Array(Global.EditMode, Not(Array Contains((Host Player).editor_temp, Current Array Index))));
            Set Global Variable(TQ5, Filtered Array(Global.TQ5, Not(Array Contains((Host Player).editor_temp, Current Array Index))));
            Set Global Variable(TQ6, Filtered Array(Global.TQ6, Not(Array Contains((Host Player).editor_temp, Current Array Index))));
            Set Global Variable(BounceToggleLock, Filtered Array(Global.BounceToggleLock, Not(Array Contains((Host Player).editor_temp, Current Array Index))));
            "Resync custom portals =================="
            Set Player Variable(Host Player, editor_temp, Filtered Array(Mapped Array(Global.CustomPortalCP, If-Then-Else(Compare(Current Array Element, ==, (Host Player).checkpoint_current), Current Array Index, -1)), Compare(Current Array Element, >=, Null)));
            For Global Variable(NANBA, 0, Count Of((Host Player).editor_temp), True);
                Destroy Effect(Value In Array(Global.PortalEffects, Value In Array((Host Player).editor_temp, Global.NANBA)));
                Modify Global Variable(PortalEffects, Remove From Array By Index, Value In Array((Host Player).editor_temp, Global.NANBA));
                Wait(False, Ignore Condition);
            End;
            Modify Global Variable(CustomPortalCP, Remove From Array By Value, (Host Player).checkpoint_current);
            "Decrement checkpoints after removed one"
            Set Global Variable(CustomPortalCP, Mapped Array(Global.CustomPortalCP, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >, (Host Player).checkpoint_current), 1, Null))));
            "Remove Radii at Checkpoint indexes (temp)"
            Set Global Variable(CustomPortalStart, Filtered Array(Global.CustomPortalStart, Not(Array Contains((Host Player).editor_temp, Current Array Index))));
            Set Global Variable(CustomPortalEndpoint, Filtered Array(Global.CustomPortalEndpoint, Not(Array Contains((Host Player).editor_temp, Current Array Index))));
            Set Player Variable(Host Player, editor_temp, Null);
            Modify Global Variable(Dao, Remove From Array By Value, (Host Player).checkpoint_current);
            Set Global Variable(Dao, Mapped Array(Global.Dao, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
            Modify Global Variable(SHIFT, Remove From Array By Value, (Host Player).checkpoint_current);
            Set Global Variable(SHIFT, Mapped Array(Global.SHIFT, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
            Modify Global Variable(BanMulti, Remove From Array By Value, (Host Player).checkpoint_current);
            Set Global Variable(BanMulti, Mapped Array(Global.BanMulti, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
            Modify Global Variable(BanCreate, Remove From Array By Value, (Host Player).checkpoint_current);
            Set Global Variable(BanCreate, Mapped Array(Global.BanCreate, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
            Modify Global Variable(BanStand, Remove From Array By Value, (Host Player).checkpoint_current);
            Set Global Variable(BanStand, Mapped Array(Global.BanStand, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
            Modify Global Variable(BanDead, Remove From Array By Value, (Host Player).checkpoint_current);
            Set Global Variable(BanDead, Mapped Array(Global.BanDead, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
            Modify Global Variable(BanEmote, Remove From Array By Value, (Host Player).checkpoint_current);
            Set Global Variable(BanEmote, Mapped Array(Global.BanEmote, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
            Modify Global Variable(BanClimb, Remove From Array By Value, (Host Player).checkpoint_current);
            Set Global Variable(BanClimb, Mapped Array(Global.BanClimb, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
            Modify Global Variable(BanSaveDouble, Remove From Array By Value, (Host Player).checkpoint_current);
            Set Global Variable(BanSaveDouble, Mapped Array(Global.BanSaveDouble, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
            Modify Global Variable(BanBhop, Remove From Array By Value, (Host Player).checkpoint_current);
            Set Global Variable(BanBhop, Mapped Array(Global.BanBhop, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
            Modify Global Variable(BanDjump, Remove From Array By Value, (Host Player).checkpoint_current);
            Set Global Variable(BanDjump, Mapped Array(Global.BanDjump, Subtract(Current Array Element, If-Then-Else(Compare(Current Array Element, >=, (Host Player).checkpoint_current), 1, Null))));
            Modify Global Variable(A, Remove From Array By Index, (Host Player).checkpoint_current);
            Modify Global Variable(C, Remove From Array By Index, (Host Player).checkpoint_current);
            Set Player Variable(Host Player, checkpoint_current, Max(Subtract((Host Player).checkpoint_current, True), False));
            Call Subroutine(RebuildKillOrbs);
            Call Subroutine(RebuildBounceOrbs);
            Call Subroutine(RebuildPortals);
            Small Message(Host Player, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("   检查点已删除"), Custom String("   Checkpoint Has Been Deleted")));
        Else If(And(Compare((Host Player).editor_modeSelect, ==, 1), Count Of(Global.EditSelectIdArray)));
            Modify Global Variable(H, Remove From Array By Index, Global.EditSelected);
            Modify Global Variable(I, Remove From Array By Index, Global.EditSelected);
            Modify Global Variable(killballnumber, Remove From Array By Index, Global.EditSelected);
            Destroy Effect(Value In Array(Global.K, Global.EditSelected));
            Modify Global Variable(K, Remove From Array By Index, Global.EditSelected);
            Call Subroutine(RebuildKillOrbs);
        Else If(And(Compare((Host Player).editor_modeSelect, ==, 2), Count Of(Global.EditSelectIdArray)));
            Modify Global Variable(TQ, Remove From Array By Index, Global.EditSelected);
            Modify Global Variable(EditMode, Remove From Array By Index, Global.EditSelected);
            Modify Global Variable(TQ5, Remove From Array By Index, Global.EditSelected);
            Modify Global Variable(TQ6, Remove From Array By Index, Global.EditSelected);
            Modify Global Variable(BounceToggleLock, Remove From Array By Index, Global.EditSelected);
            Destroy Effect(Value In Array(Global.TQ2, Global.EditSelected));
            Modify Global Variable(TQ2, Remove From Array By Index, Global.EditSelected);
            Modify Global Variable(pinballnumber, Remove From Array By Index, Global.EditSelected);
            Call Subroutine(RebuildBounceOrbs);
        Else If(And(Compare((Host Player).editor_modeSelect, ==, 4), Count Of(Global.EditSelectIdArray)));
            Destroy Effect(Value In Array(Global.PortalEffects, Global.EditSelected));
            Wait(False, Ignore Condition);
            Modify Global Variable(CustomPortalStart, Remove From Array By Index, Global.EditSelected);
            Modify Global Variable(CustomPortalEndpoint, Remove From Array By Index, Global.EditSelected);
            Modify Global Variable(CustomPortalCP, Remove From Array By Index, Global.EditSelected);
            Modify Global Variable(PortalEffects, Remove From Array By Index, Global.EditSelected);
            Call Subroutine(RebuildPortals);
        Else;
            Set Player Variable(Host Player, editor_lock, False);
            Wait(False, Ignore Condition);
            Abort;
        End;
        Call Subroutine(UpdateCache);
        Call Subroutine(EditorSelectLast);
        Set Player Variable(Host Player, editor_lock, False);
        Wait(Add(0.16, Multiply(Entity Count, 0.007)), Ignore Condition);
    }
}

regel ("Editor | Toggle Orb Functions") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        "Required for UpdateCache()"
        Event Player == Host Player;
        Global.EditorOn != False;
        (Host Player).editor_modeSelect == 2;
        (Host Player).editor_lock == False;
        Count Of(Global.EditSelectIdArray) > Null;
        Is Button Held(Host Player, Button(Ultimate)) == True;
        Or(Or(Is Button Held(Host Player, Button(Primary Fire)), Is Button Held(Host Player, Button(Secondary Fire))), Is Button Held(Host Player, Button(Ability 2))) == True;
    }
    aktionen {
        Set Player Variable(Host Player, editor_lock, True);
        If(Is Button Held(Host Player, Button(Primary Fire)));
            Set Global Variable At Index(TQ5, Global.EditSelected, Not(Value In Array(Global.TQ5, Global.EditSelected)));
        Else If(Is Button Held(Host Player, Button(Secondary Fire)));
            Set Global Variable At Index(TQ6, Global.EditSelected, Not(Value In Array(Global.TQ6, Global.EditSelected)));
        Else;
            Set Global Variable At Index(BounceToggleLock, Global.EditSelected, Not(Value In Array(Global.BounceToggleLock, Global.EditSelected)));
            Set Global Variable At Index(EditMode, Global.EditSelected, Multiply(10, Not(Value In Array(Global.BounceToggleLock, Global.EditSelected))));
        End;
        Call Subroutine(UpdateCache);
        Set Player Variable(Host Player, editor_lock, False);
        Wait(False, Ignore Condition);
    }
}

regel ("Editor | Orb Radii/Strength") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        "Required for UpdateCache()"
        Event Player == Host Player;
        Global.EditorOn != False;
        Array Contains(Array(1, 2), (Host Player).editor_modeSelect) == True;
        (Host Player).editor_lock == False;
        Count Of(Global.EditSelectIdArray) > Null;
        Is Button Held(Host Player, Button(Ability 2)) == True;
        Is Button Held(Host Player, Button(Jump)) != Is Button Held(Host Player, Button(Crouch));
        Is Button Held(Host Player, Button(Interact)) == False;
    }
    aktionen {
        Set Player Variable(Host Player, editor_lock, True);
        While(And(Is Button Held(Host Player, Button(Ability 2)), Or(Is Button Held(Host Player, Button(Jump)), Is Button Held(Host Player, Button(Crouch)))));
            If(And(Compare((Host Player).editor_modeSelect, ==, 2), Count Of((Host Player).editor_bounceIndex)));
                Modify Global Variable At Index(EditMode, Global.EditSelected, Add, If-Then-Else(Is Button Held(Host Player, Button(Jump)), 0.1, -0.1));
            Else If(And(Compare((Host Player).editor_modeSelect, ==, 1), Count Of((Host Player).editor_killIndex)));
                Modify Global Variable At Index(I, Global.EditSelected, Add, If-Then-Else(Is Button Held(Host Player, Button(Jump)), 0.1, -0.1));
            End;
            Wait(0.1, Ignore Condition);
        End;
        Call Subroutine(UpdateCache);
        Set Player Variable(Host Player, editor_lock, False);
    }
}

regel ("Editor | Select Orb/Portal") {
    event {
        Ongoing - Global;
    }
    bedingungen {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        Global.EditorOn != False;
        Array Contains(Array(1, 2, 4), (Host Player).editor_modeSelect) == True;
        (Host Player).editor_lock == False;
        Count Of(Global.EditSelectIdArray) > Null;
        Is Button Held(Host Player, Button(Interact)) == True;
        Or(Is Button Held(Host Player, Button(Crouch)), Is Button Held(Host Player, Button(Jump))) == True;
    }
    aktionen {
        Set Player Variable(Host Player, editor_lock, True);
        If(Is Button Held(Host Player, Button(Crouch)));
            Set Global Variable(EditSelected, If-Then-Else(Index Of Array Value(Global.EditSelectIdArray, Global.EditSelected), Value In Array(Global.EditSelectIdArray, Subtract(Index Of Array Value(Global.EditSelectIdArray, Global.EditSelected), True)), Last Of(Global.EditSelectIdArray)));
        Else;
            Set Global Variable(EditSelected, If-Then-Else(Compare(Index Of Array Value(Global.EditSelectIdArray, Global.EditSelected), ==, Subtract(Count Of(Global.EditSelectIdArray), True)), First Of(Global.EditSelectIdArray), Value In Array(Global.EditSelectIdArray, Add(Index Of Array Value(Global.EditSelectIdArray, Global.EditSelected), True))));
        End;
        Wait(False, Ignore Condition);
        Set Player Variable(Host Player, editor_lock, False);
        Wait Until(Not(And(Is Button Held(Host Player, Button(Interact)), Or(Is Button Held(Host Player, Button(Crouch)), Is Button Held(Host Player, Button(Jump))))), 0.24);
    }
}

regel ("Editor | Cp Size Hitbox Display") {
    event {
        Ongoing - Global;
    }
    bedingungen {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        Global.EditorOn != False;
        (Host Player).editor_modeSelect == Null;
        Is Button Held(Host Player, Button(Interact)) == True;
        Is Button Held(Host Player, Button(Ability 1)) == True;
    }
    aktionen {
        Set Player Variable(Host Player, editor_hitboxToggle, Not((Host Player).editor_hitboxToggle));
        Wait(False, Ignore Condition);
    }
}

regel ("Editor | Cp Add/Remove Teleport") {
    event {
        Ongoing - Global;
    }
    bedingungen {
        Global.EditorOn != False;
        (Host Player).editor_modeSelect == Null;
        (Host Player).editor_lock == False;
        Count Of(Global.A) > True;
        Is Button Held(Host Player, Button(Interact)) == True;
        Is Button Held(Host Player, Button(Reload)) == True;
        Is Button Held(Host Player, Button(Melee)) == False;
    }
    aktionen {
        "prevent overlap with save map"
        Wait Until(Or(Is Button Held(Host Player, Button(Melee)), Not(And(Is Button Held(Host Player, Button(Interact)), Is Button Held(Host Player, Button(Reload))))), True);
        Abort If(Or(Is Button Held(Host Player, Button(Melee)), And(Is Button Held(Host Player, Button(Interact)), Is Button Held(Host Player, Button(Reload)))));
        Set Player Variable(Host Player, editor_lock, True);
        If(Not((Host Player).checkpoint_current));
            Small Message(Host Player, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("   不能在第一个检查点设置传送门"), Custom String("   Cannot Place A Teleport On First Checkpoint")));
            Set Player Variable(Host Player, editor_lock, False);
            Abort;
        End;
        "remove"
        If(Compare(Count Of(Value In Array(Global.A, (Host Player).checkpoint_current)), >, 1));
            Set Global Variable At Index(A, (Host Player).checkpoint_current, First Of(Value In Array(Global.A, (Host Player).checkpoint_current)));
            Small Message(Host Player, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("   关卡{0}的传送点已移除", (Host Player).checkpoint_current), Custom String("   Teleport For Level {0} Has Been Removed", (Host Player).checkpoint_current)));
        "add"
        Else;
            Set Global Variable At Index(A, (Host Player).checkpoint_current, Array(If-Then-Else(Count Of(Value In Array(Global.A, (Host Player).checkpoint_current)), First Of(Value In Array(Global.A, (Host Player).checkpoint_current)), Value In Array(Global.A, (Host Player).checkpoint_current)), Position Of(Host Player)));
            Small Message(Host Player, Custom String("{0} {1}", If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("   传送点已添加到当前关卡"), Custom String("   Teleport Has Been Added For Level")), (Host Player).checkpoint_current));
        End;
        Set Player Variable(Host Player, editor_lock, False);
        Wait(False, Ignore Condition);
    }
}

regel ("Editor | Moving Checkpoint") {
    event {
        Ongoing - Global;
    }
    bedingungen {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        Global.EditorOn != False;
        (Host Player).editor_modeSelect == Null;
        (Host Player).editor_lock == False;
        Count Of(Global.A) > Null;
        Is Button Held(Host Player, Button(Ability 2)) == True;
        Is Button Held(Host Player, Button(Secondary Fire)) == False;
    }
    aktionen {
        Wait(0.3, Abort When False);
        If((Host Player).addon_toggle3rdPov);
            Set Player Variable(Host Player, addon_toggle3rdPov, False);
        End;
        Set Player Variable(Host Player, editor_lock, True);
        Set Player Variable(Host Player, editor_undo, Value In Array(Global.A, (Host Player).checkpoint_current));
        Start Camera(Host Player, Subtract(Add(Eye Position(Host Player), Multiply(0.5, Up)), Multiply(2.5, Facing Direction Of(Host Player))), Eye Position(Host Player), 15);
        While(And(And(Is Button Held(Host Player, Button(Ability 2)), Is Alive(Host Player)), Not(Is Button Held(Host Player, Button(Secondary Fire)))));
            If(Is Button Held(Host Player, Button(Primary Fire)));
                Set Move Speed(Host Player, 100);
            Else;
                Set Move Speed(Host Player, 3);
            End;
            If(Count Of(Value In Array(Global.A, (Host Player).checkpoint_current)));
                Set Global Variable At Index(A, (Host Player).checkpoint_current, Array(Position Of(Host Player), Value In Array(Value In Array(Global.A, (Host Player).checkpoint_current), True)));
            Else;
                Set Global Variable At Index(A, (Host Player).checkpoint_current, Position Of(Host Player));
            End;
            Wait(False, Ignore Condition);
        End;
        Stop Camera(Host Player);
        Set Move Speed(Host Player, 100);
        If(Is Button Held(Host Player, Button(Ability 2)));
            Set Global Variable At Index(A, (Host Player).checkpoint_current, (Host Player).editor_undo);
            Wait Until(Not(Is Button Held(Host Player, Button(Ability 2))), 999999999999);
        End;
        Set Player Variable(Host Player, editor_lock, False);
    }
}

regel ("Editor | Toggle Ult/Dash") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Event Player == Host Player;
        Global.EditorOn != False;
        (Host Player).editor_modeSelect == Null;
        (Host Player).editor_lock == False;
        Count Of(Global.A) > Null;
        Is Button Held(Host Player, Button(Primary Fire)) != Is Button Held(Host Player, Button(Secondary Fire));
        Is Button Held(Host Player, Button(Ultimate)) == True;
    }
    aktionen {
        If(Is Button Held(Host Player, Button(Primary Fire)));
            If(Array Contains(Global.Dao, (Host Player).checkpoint_current));
                Modify Global Variable(Dao, Remove From Array By Value, (Host Player).checkpoint_current);
            Else;
                Modify Global Variable(Dao, Append To Array, (Host Player).checkpoint_current);
            End;
        Else;
            If(Array Contains(Global.SHIFT, (Host Player).checkpoint_current));
                Modify Global Variable(SHIFT, Remove From Array By Value, (Host Player).checkpoint_current);
            Else;
                Modify Global Variable(SHIFT, Append To Array, (Host Player).checkpoint_current);
            End;
        End;
        Wait(False, Ignore Condition);
    }
}

regel ("Editor | Toggle Bans") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        "Required for UpdateCache()"
        Event Player == Host Player;
        Global.EditorOn != False;
        (Host Player).editor_modeSelect == 3;
        (Host Player).editor_lock == False;
        Count Of(Global.A) > Null;
        Or(Or(Or(Is Button Held(Host Player, Button(Primary Fire)), Is Button Held(Host Player, Button(Secondary Fire))), Is Button Held(Host Player, Button(Jump))), Is Button Held(Host Player, Button(Crouch))) == True;
        Or(Is Button Held(Host Player, Button(Interact)), Is Button Held(Host Player, Button(Ability 2))) == True;
    }
    aktionen {
        Set Player Variable(Host Player, editor_lock, True);
        If(Is Button Held(Host Player, Button(Interact)));
            If(Is Button Held(Host Player, Button(Primary Fire)));
                If(Array Contains(Global.BanMulti, (Host Player).checkpoint_current));
                    Modify Global Variable(BanMulti, Remove From Array By Value, (Host Player).checkpoint_current);
                Else;
                    Modify Global Variable(BanMulti, Append To Array, (Host Player).checkpoint_current);
                End;
            Else If(Is Button Held(Host Player, Button(Secondary Fire)));
                If(Array Contains(Global.BanCreate, (Host Player).checkpoint_current));
                    Modify Global Variable(BanCreate, Remove From Array By Value, (Host Player).checkpoint_current);
                Else;
                    Modify Global Variable(BanCreate, Append To Array, (Host Player).checkpoint_current);
                End;
            Else If(Is Button Held(Host Player, Button(Crouch)));
                If(Array Contains(Global.BanClimb, (Host Player).checkpoint_current));
                    Modify Global Variable(BanClimb, Remove From Array By Value, (Host Player).checkpoint_current);
                Else;
                    Modify Global Variable(BanClimb, Append To Array, (Host Player).checkpoint_current);
                End;
            Else;
                If(Array Contains(Global.BanSaveDouble, (Host Player).checkpoint_current));
                    Modify Global Variable(BanSaveDouble, Remove From Array By Value, (Host Player).checkpoint_current);
                Else;
                    Modify Global Variable(BanSaveDouble, Append To Array, (Host Player).checkpoint_current);
                End;
            End;
        Else;
            If(Is Button Held(Host Player, Button(Primary Fire)));
                If(Array Contains(Global.BanDead, (Host Player).checkpoint_current));
                    Modify Global Variable(BanDead, Remove From Array By Value, (Host Player).checkpoint_current);
                Else;
                    Modify Global Variable(BanDead, Append To Array, (Host Player).checkpoint_current);
                End;
            Else If(Is Button Held(Host Player, Button(Secondary Fire)));
                If(Array Contains(Global.BanEmote, (Host Player).checkpoint_current));
                    Modify Global Variable(BanEmote, Remove From Array By Value, (Host Player).checkpoint_current);
                Else;
                    Modify Global Variable(BanEmote, Append To Array, (Host Player).checkpoint_current);
                End;
            Else If(Is Button Held(Host Player, Button(Crouch)));
                If(Array Contains(Global.BanStand, (Host Player).checkpoint_current));
                    Modify Global Variable(BanStand, Remove From Array By Value, (Host Player).checkpoint_current);
                Else;
                    Modify Global Variable(BanStand, Append To Array, (Host Player).checkpoint_current);
                End;
            Else;
                If(Array Contains(Global.BanBhop, (Host Player).checkpoint_current));
                    Modify Global Variable(BanBhop, Remove From Array By Value, (Host Player).checkpoint_current);
                Else;
                    Modify Global Variable(BanBhop, Append To Array, (Host Player).checkpoint_current);
                End;
            End;
        End;
        "BanStand"
        Wait(0.3, Ignore Condition);
        Call Subroutine(UpdateCache);
        Set Player Variable(Host Player, editor_lock, False);
    }
}

regel ("Editor | Change Portal Cp") {
    event {
        Ongoing - Global;
    }
    bedingungen {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        Global.EditorOn != False;
        (Host Player).editor_modeSelect == 4;
        (Host Player).editor_lock == False;
        Count Of(Global.EditSelectIdArray) > Null;
        Is Button Held(Host Player, Button(Jump)) == True;
        Is Button Held(Host Player, Button(Ability 2)) == True;
    }
    aktionen {
        Set Global Variable At Index(CustomPortalCP, Global.EditSelected, If-Then-Else(Compare(Value In Array(Global.CustomPortalCP, Global.EditSelected), <, Null), (Host Player).checkpoint_current, -1));
        Wait(0.3, Ignore Condition);
    }
}

regel ("Editor | Move Object") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        "Required for UpdateCache()"
        Event Player == Host Player;
        Global.EditorOn != False;
        Array Contains(Array(1, 2, 4), (Host Player).editor_modeSelect) == True;
        (Host Player).editor_lock == False;
        Count Of(Global.EditSelectIdArray) > Null;
        Is Button Held(Host Player, Button(Secondary Fire)) == False;
        Or(Global.EditorMoveItem, And(Is Button Held(Host Player, Button(Primary Fire)), Is Button Held(Host Player, Button(Ability 2)))) == True;
    }
    aktionen {
        Set Player Variable(Host Player, editor_lock, True);
        Set Global Variable(EditorMoveItem, True);
        If((Host Player).addon_toggle3rdPov);
            Set Player Variable(Host Player, addon_toggle3rdPov, False);
        End;
        "hostPlayer.editor_fly = null"
        Wait Until(Not(Or(Is Button Held(Host Player, Button(Primary Fire)), Is Button Held(Host Player, Button(Ability 2)))), 999999999999);
        "hostPlayer.disallowButton(Button.ULTIMATE)\\nhostPlayer.disallowButton(Button.JUMP)"
        Set Status(Host Player, Null, Hacked, 999999999999);
        Set Move Speed(Host Player, False);
        "hostPlayer.startForcingPosition(hostPlayer.getPosition(), false)"
        If(Compare((Host Player).editor_modeSelect, ==, 1));
            Set Player Variable(Host Player, editor_undo, Value In Array(Global.H, Global.EditSelected));
            Start Camera(Host Player, Add(Value In Array(Global.H, Global.EditSelected), Multiply(Facing Direction Of(Host Player), Multiply(Absolute Value(Value In Array(Global.I, Global.EditSelected)), -1.5))), Value In Array(Global.H, Global.EditSelected), 30);
            While(Not(Or(Is Button Held(Host Player, Button(Primary Fire)), Is Button Held(Host Player, Button(Secondary Fire)))));
                Modify Global Variable At Index(H, Global.EditSelected, Add, Multiply(Subtract(Add(0.096, Multiply(0.192, Is Button Held(Event Player, Button(Jump)))), Multiply(0.048, Is Button Held(Event Player, Button(Crouch)))), Add(Add(Multiply(Multiply(Facing Direction Of(Event Player), Z Component Of(Throttle Of(Event Player))), Vector(True, Not(Is Button Held(Event Player, Button(Ability 1))), True)), World Vector Of(Multiply(Throttle Of(Event Player), Left), Event Player, Rotation)), Multiply(Up, Subtract(Is Button Held(Event Player, Button(Ability 2)), Is Button Held(Event Player, Button(Ultimate)))))));
                Wait(False, Ignore Condition);
            End;
        Else If(Compare((Host Player).editor_modeSelect, ==, 2));
            Set Player Variable(Host Player, editor_undo, Value In Array(Global.TQ, Global.EditSelected));
            Start Camera(Host Player, Add(Value In Array(Global.TQ, Global.EditSelected), Multiply(Facing Direction Of(Host Player), -4)), Value In Array(Global.TQ, Global.EditSelected), 30);
            While(Not(Or(Is Button Held(Host Player, Button(Primary Fire)), Is Button Held(Host Player, Button(Secondary Fire)))));
                Modify Global Variable At Index(TQ, Global.EditSelected, Add, Multiply(Subtract(Add(0.096, Multiply(0.192, Is Button Held(Event Player, Button(Jump)))), Multiply(0.048, Is Button Held(Event Player, Button(Crouch)))), Add(Add(Multiply(Multiply(Facing Direction Of(Event Player), Z Component Of(Throttle Of(Event Player))), Vector(True, Not(Is Button Held(Event Player, Button(Ability 1))), True)), World Vector Of(Multiply(Throttle Of(Event Player), Left), Event Player, Rotation)), Multiply(Up, Subtract(Is Button Held(Event Player, Button(Ability 2)), Is Button Held(Event Player, Button(Ultimate)))))));
                Wait(False, Ignore Condition);
            End;
        Else If(Compare((Host Player).editor_modeSelect, ==, 4));
            Set Player Variable(Host Player, editor_undo, Array(Value In Array(Global.CustomPortalStart, Global.EditSelected), Value In Array(Global.CustomPortalEndpoint, Global.EditSelected)));
            "move start position"
            Start Camera(Host Player, Add(Value In Array(Global.CustomPortalStart, Global.EditSelected), Multiply(Facing Direction Of(Host Player), -4)), Value In Array(Global.CustomPortalStart, Global.EditSelected), 30);
            While(Not(Or(Is Button Held(Host Player, Button(Primary Fire)), Is Button Held(Host Player, Button(Secondary Fire)))));
                Modify Global Variable At Index(CustomPortalStart, Global.EditSelected, Add, Multiply(Subtract(Add(0.096, Multiply(0.192, Is Button Held(Event Player, Button(Jump)))), Multiply(0.048, Is Button Held(Event Player, Button(Crouch)))), Add(Add(Multiply(Multiply(Facing Direction Of(Event Player), Z Component Of(Throttle Of(Event Player))), Vector(True, Not(Is Button Held(Event Player, Button(Ability 1))), True)), World Vector Of(Multiply(Throttle Of(Event Player), Left), Event Player, Rotation)), Multiply(Up, Subtract(Is Button Held(Event Player, Button(Ability 2)), Is Button Held(Event Player, Button(Ultimate)))))));
                Wait(False, Ignore Condition);
            End;
            "move destination"
            Start Camera(Host Player, Add(Value In Array(Global.CustomPortalEndpoint, Global.EditSelected), Multiply(Facing Direction Of(Host Player), -4)), Value In Array(Global.CustomPortalEndpoint, Global.EditSelected), 30);
            Wait Until(Or(Not(Is Button Held(Host Player, Button(Primary Fire))), Is Button Held(Host Player, Button(Secondary Fire))), True);
            While(Not(Or(Is Button Held(Host Player, Button(Primary Fire)), Is Button Held(Host Player, Button(Secondary Fire)))));
                Modify Global Variable At Index(CustomPortalEndpoint, Global.EditSelected, Add, Multiply(Subtract(Add(0.096, Multiply(0.192, Is Button Held(Event Player, Button(Jump)))), Multiply(0.048, Is Button Held(Event Player, Button(Crouch)))), Add(Add(Multiply(Multiply(Facing Direction Of(Event Player), Z Component Of(Throttle Of(Event Player))), Vector(True, Not(Is Button Held(Event Player, Button(Ability 1))), True)), World Vector Of(Multiply(Throttle Of(Event Player), Left), Event Player, Rotation)), Multiply(Up, Subtract(Is Button Held(Event Player, Button(Ability 2)), Is Button Held(Event Player, Button(Ultimate)))))));
                Wait(False, Ignore Condition);
            End;
        End;
        If(Is Button Held(Host Player, Button(Secondary Fire)));
            Skip(Multiply(2, (Host Player).editor_modeSelect));
        Else;
        Else;
            Set Global Variable At Index(H, Global.EditSelected, (Host Player).editor_undo);
        Else;
            Set Global Variable At Index(TQ, Global.EditSelected, (Host Player).editor_undo);
        Else;
        Else;
        Else;
            Set Global Variable At Index(CustomPortalStart, Global.EditSelected, First Of((Host Player).editor_undo));
            Set Global Variable At Index(CustomPortalEndpoint, Global.EditSelected, Last Of((Host Player).editor_undo));
        End;
        Set Player Variable(Host Player, editor_undo, Null);
        "hostPlayer.allowButton(Button.ULTIMATE)\\nhostPlayer.allowButton(Button.JUMP)"
        Clear Status(Host Player, Hacked);
        Stop Camera(Host Player);
        Set Move Speed(Host Player, 100);
        "hostPlayer.stopForcingPosition()"
        Set Global Variable(EditorMoveItem, Null);
        Call Subroutine(UpdateCache);
        Wait Until(Not(Is Button Held(Host Player, Button(Primary Fire))), True);
        Set Player Variable(Host Player, editor_lock, False);
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Commands ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("Command | Toggle Leaderboard (Hold Melee)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Count Of(Global.LeaderBoardFull) > Null;
        Global.EditorOn == False;
        Is Button Held(Event Player, Button(Melee)) == True;
    }
    aktionen {
        Wait(True, Abort When False);
        Set Player Variable(Event Player, toggle_leaderboard, Not((Event Player).toggle_leaderboard));
    }
}

regel ("Command | Split hide (Hold Dash + Primary + Secondary)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is Button Held(Event Player, Button(Ability 1)) == True;
        Is Button Held(Event Player, Button(Primary Fire)) == True;
        Is Button Held(Event Player, Button(Secondary Fire)) == True;
    }
    aktionen {
        Wait(True, Abort When False);
        Set Player Variable(Event Player, timer_splitDisplay, If-Then-Else(Compare((Event Player).timer_splitDisplay, <=, -999999999999), Null, -999999999999));
        Play Effect(Event Player, Buff Impact Sound, Null, Event Player, 100);
        "$$ Language"
        Small Message(Event Player, If-Then-Else(Compare((Event Player).timer_splitDisplay, <=, -999999999999), Custom String("   Split Display Off"), Custom String("   Split Display On")));
        Wait(0.32, Ignore Condition);
    }
}

regel ("Command | Toggle Invisible (Hold Deflect)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is Button Held(Event Player, Button(Ability 2)) == True;
        Global.EditorOn == False;
        Global.CompMode == False;
    }
    aktionen {
        Wait(True, Abort When False);
        Set Player Variable(Event Player, toggle_invisible, Not((Event Player).toggle_invisible));
        Set Invisible(Event Player, None);
        If((Event Player).toggle_invisible);
            Set Invisible(Event Player, All);
        End;
        Small Message(Event Player, Custom String("  {0}{1}", Value In Array(String Split(Custom String("ＴＬＥｒｒInvisibleInvisibleInvisible"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), If-Then-Else((Event Player).toggle_invisible, Value In Array(String Split(Custom String("ＴＬＥｒｒ | On | On | On"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Value In Array(String Split(Custom String("ＴＬＥｒｒ | Off | Off | Off"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))))));
        "\\"   {0} {1}\\".format(\\"隐身模式\\" checkCN \\"Invisible\\", \\"On\\" if eventPlayer.toggle_invisible else \\"Off\\"))"
        Play Effect(Event Player, Debuff Impact Sound, Null, Event Player, 100);
    }
}

regel ("Command | Preview Orbs & Portals (Hold Primary + Secondary)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        "@Condition EditorOn == false"
        (Event Player).lockState == False;
        (Event Player).checkpoint_notLast != False;
        Is Button Held(Event Player, Button(Primary Fire)) == True;
        Is Button Held(Event Player, Button(Secondary Fire)) == True;
    }
    aktionen {
        "wait(0.9, Wait.ABORT_WHEN_FALSE)"
        Wait(0.45, Abort When False);
        Set Player Variable(Event Player, preview_array1, Array(First Of(Value In Array(Global.A, Add((Event Player).checkpoint_current, True)))));
        If(Count Of(Global.pinballnumber));
            Modify Player Variable(Event Player, preview_array1, Append To Array, Filtered Array(Global.TQ, Compare(Value In Array(Global.pinballnumber, Current Array Index), ==, (Event Player).checkpoint_current)));
            Modify Player Variable(Event Player, preview_array2, Append To Array, Filtered Array(Mapped Array(Global.pinballnumber, Current Array Index), Compare(Value In Array(Global.pinballnumber, Current Array Element), ==, (Event Player).checkpoint_current)));
        End;
        If(Count Of(Global.CustomPortalStart));
            "eventPlayer.preview_array1.append( [i for i in CustomPortalStart if CustomPortalCP[CustomPortalStart.index(i)] == eventPlayer.checkpoint_current] )"
            For Player Variable(Event Player, preview_i, 0, Count Of((Event Player).cache_portalStart), True);
                Modify Player Variable(Event Player, preview_array1, Append To Array, Array(Value In Array((Event Player).cache_portalStart, (Event Player).preview_i), Value In Array((Event Player).cache_portalEnd, (Event Player).preview_i)));
                Modify Player Variable(Event Player, preview_array2, Append To Array, Array(Array((Event Player).preview_i, False), Array((Event Player).preview_i, True)));
            End;
        End;
        Wait(False, Ignore Condition);
        Set Player Variable(Event Player, preview_i, Null);
        If((Event Player).addon_toggle3rdPov);
            Set Player Variable(Event Player, addon_toggle3rdPov, False);
        End;
        Start Camera(Event Player, Subtract(Add(Value In Array((Event Player).preview_array1, (Event Player).preview_i), Up), Multiply(Subtract(3.5, Multiply(3, Z Component Of(Throttle Of(Event Player)))), Facing Direction Of(Event Player))), Add(Value In Array((Event Player).preview_array1, (Event Player).preview_i), Up), 15);
        Set Move Speed(Event Player, False);
        Set Primary Fire Enabled(Event Player, False);
        Set Secondary Fire Enabled(Event Player, False);
        Disallow Button(Event Player, Button(Ability 1));
        Disallow Button(Event Player, Button(Jump));
        While(And(And(And(Is Button Held(Event Player, Button(Primary Fire)), Is Button Held(Event Player, Button(Secondary Fire))), Is Alive(Event Player)), Not((Event Player).lockState)));
            If(Compare(X Component Of(Throttle Of(Event Player)), <, -0.5));
                Modify Player Variable(Event Player, preview_i, Add, True);
            Else If(Compare(X Component Of(Throttle Of(Event Player)), >, 0.5));
                Modify Player Variable(Event Player, preview_i, Add, Subtract(Count Of((Event Player).preview_array1), True));
            End;
            Modify Player Variable(Event Player, preview_i, Modulo, Count Of((Event Player).preview_array1));
            Wait Until(Compare(Absolute Value(X Component Of(Throttle Of(Event Player))), <, 0.5), True);
            Wait(False, Ignore Condition);
        End;
        Set Primary Fire Enabled(Event Player, True);
        Set Secondary Fire Enabled(Event Player, True);
        Allow Button(Event Player, Button(Ability 1));
        Allow Button(Event Player, Button(Jump));
        Stop Camera(Event Player);
        Set Move Speed(Event Player, 100);
        Set Player Variable(Event Player, preview_i, Null);
        Set Player Variable(Event Player, preview_array1, Null);
        Set Player Variable(Event Player, preview_array2, Null);
    }
}

regel ("Command | Restart Run (Crouch + Interact + Deflect)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Or(Compare((Event Player).editor_lock, ==, False), Compare(Event Player, !=, Host Player)) == True;
        (Event Player).lockState == False;
        Is Button Held(Event Player, Button(Crouch)) == True;
        Is Button Held(Event Player, Button(Interact)) == True;
        Is Button Held(Event Player, Button(Ability 2)) == True;
    }
    aktionen {
        Set Player Variable(Event Player, lockState, True);
        If(Global.CompMode);
            Wait(False, Ignore Condition);
            If(Compare(Global.CompTime, <, 1));
                Small Message(Event Player, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("   比赛结束"), Custom String("   Competition Is Over")));
                Set Player Variable(Event Player, lockState, False);
                Abort;
            Else If((Event Player).comp_done);
                Set Player Variable(Event Player, lockState, False);
                Abort;
            Else If(And(Global.CompRestartLimit, (Event Player).checkpoint_notLast));
                Small Message(Event Player, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("   禁止在此比赛中运行期间重新启动"), Custom String("   Restart During Run Is Disabled For This Competition")));
                Set Player Variable(Event Player, lockState, False);
                Abort;
            Else If(Global.CompAtmpNum);
                If(Compare((Event Player).comp_countAttempts, ==, Global.CompAtmpNum));
                    Small Message(Event Player, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("   最后一次尝试"), Custom String("   This Is Your Final Attempt")));
                    Set Player Variable(Event Player, lockState, False);
                    Abort;
                End;
                If(Compare((Event Player).comp_countAttempts, <, Null));
                    Small Message(Event Player, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("   你没有尝试过"), Custom String("   You Are Out Of Attempts")));
                    Set Player Variable(Event Player, lockState, False);
                    Abort;
                End;
                Modify Player Variable(Event Player, comp_countAttempts, Add, True);
                Set Global Variable At Index(CompAtmpSaveCount, Index Of Array Value(Global.CompAtmpSaveNames, String Split(First Of(Event Player), Empty Array)), (Event Player).comp_countAttempts);
            End;
        End;
        Set Player Variable(Event Player, editor_fly, Null);
        Set Player Variable(Event Player, checkpoint_current, Null);
        Set Player Variable(Event Player, timer_splitDisplay, Multiply(-999999999999, Compare((Event Player).timer_splitDisplay, <=, -999999999999)));
        Set Player Variable(Event Player, toggle_practice, False);
        Set Player Variable(Event Player, timer_practice, Null);
        Stop Chasing Player Variable(Event Player, timer_practice);
        If(Array Contains(Global.SaveEnt, Event Player));
            Call Subroutine(DeleteSave);
        End;
        If(Is Dead(Event Player));
            "eventPlayer.respawn()"
            Resurrect(Event Player);
        End;
        Call Subroutine(StartGame);
        Play Effect(Event Player, Ring Explosion Sound, Null, Event Player, 100);
        Wait(Global.CompMode, Ignore Condition);
        "eventPlayer.allowButton(Button.ABILITY_1)"
        Set Player Variable(Event Player, lockState, False);
        "Anti spam"
        Wait(0.096, Ignore Condition);
    }
}

regel ("Command | Spectate (Hold Interact)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is Button Held(Event Player, Button(Interact)) == True;
        Is Button Held(Event Player, Button(Ability 2)) == False;
        And(Global.EditorOn, Or(Or(Is Button Held(Event Player, Button(Melee)), Is Button Held(Event Player, Button(Primary Fire))), Is Button Held(Event Player, Button(Secondary Fire)))) == False;
    }
    aktionen {
        Wait(True, Abort When False);
        "editor has interact combos"
        If(Global.EditorOn);
            Wait(True, Abort When False);
        End;
        Enable Built-In Game Mode Respawning(Event Player);
        Disable Built-In Game Mode Respawning(Event Player);
        If((Event Player).toggle_spectate);
            Resurrect(Event Player);
            If((Event Player).toggle_practice);
                Chase Player Variable At Rate(Event Player, timer_practice, 999999999999, True, None);
            Else If((Event Player).checkpoint_notLast);
                Call Subroutine(TimerResume);
            End;
            Call Subroutine(CheckpointFailReset);
        Else;
            Set Player Variable(Event Player, toggle_invincible, False);
            Call Subroutine(TimerPause);
            Stop Chasing Player Variable(Event Player, timer_practice);
            Set Damage Received(Event Player, 100);
            Kill(Event Player, Null);
            Set Damage Received(Event Player, 0);
            Small Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒ   Hold Interact Again To Turn Off Spectate Mode   Hold Interact Again To Turn Off Spectate Mode   Hold Interact Agai{0}", Custom String("n To Turn Off Spectate Mode")), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
        End;
        Set Player Variable(Event Player, toggle_spectate, Not((Event Player).toggle_spectate));
    }
}

regel ("Command | Toggle Invincible Mode (Melee + Reload)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        And(Global.CompMode, (Event Player).comp_done) == False;
        (Event Player).lockState == False;
        Is Alive(Event Player) == True;
        Is Button Held(Event Player, Button(Melee)) == True;
        Is Button Held(Event Player, Button(Reload)) == True;
        Is Button Held(Event Player, Button(Interact)) == False;
    }
    aktionen {
        Set Player Variable(Event Player, lockState, True);
        Set Player Variable(Event Player, toggle_invincible, Not((Event Player).toggle_invincible));
        Set Player Variable(Event Player, cache_collectedLocks, Empty Array);
        If((Event Player).toggle_invincible);
            "\\"探点模式\\" checkCN \\"Invincible mode\\""
            Big Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒInvincible ModeInvincible ModeInvincible Mode"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
            Call Subroutine(TimerPause);
            Stop Chasing Player Variable(Event Player, timer_practice);
            Start Rule(CheckUlt, Do Nothing);
            Start Rule(CheckAbility1, Do Nothing);
        Else;
            If((Event Player).toggle_practice);
                "\\"练习模式\\" checkCN \\"Practice mode\\""
                Big Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒPractice ModePractice ModePractice Mode"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
                Chase Player Variable At Rate(Event Player, timer_practice, 999999999999, True, None);
                Call Subroutine(CheckpointFailReset);
            Else If((Event Player).checkpoint_notLast);
                "\\"跑图模式\\" checkCN \\"Normal mode\\""
                Big Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒNormal ModeNormal ModeNormal Mode"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
                Call Subroutine(TimerResume);
                Call Subroutine(CheckpointFailReset);
            End;
        End;
        Set Player Variable(Event Player, lockState, False);
        "Anti spam"
        Wait(0.096, Ignore Condition);
    }
}

regel ("Command | Toggle Practice Mode (Melee + Ultimate)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Global.EditorOn == False;
        Global.CompMode == False;
        (Event Player).lockState == False;
        Is Alive(Event Player) == True;
        Is Button Held(Event Player, Button(Reload)) == False;
        Is Button Held(Event Player, Button(Melee)) == True;
        Is Button Held(Event Player, Button(Ultimate)) == True;
    }
    aktionen {
        Set Player Variable(Event Player, lockState, True);
        Set Player Variable(Event Player, toggle_practice, Not((Event Player).toggle_practice));
        If((Event Player).toggle_practice);
            "\\"练习模式\\" checkCN \\"Practice mode\\""
            Big Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒPractice ModePractice ModePractice Mode"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
            Call Subroutine(TimerPause);
            Set Player Variable(Event Player, checkpoint_practice, (Event Player).checkpoint_current);
            Set Player Variable(Event Player, timer_splitDisplay, Multiply(-999999999999, Compare((Event Player).timer_splitDisplay, <=, -999999999999)));
            Set Player Variable(Event Player, timer_split, Null);
            Set Player Variable(Event Player, timer_practice, Null);
            Chase Player Variable At Rate(Event Player, timer_practice, 999999999999, True, None);
            If((Event Player).toggle_invincible);
                Set Player Variable(Event Player, toggle_invincible, False);
                Call Subroutine(CheckpointFailReset);
            End;
        Else;
            "\\"跑图模式\\" checkCN \\"Normal mode\\""
            Big Message(Event Player, Value In Array(String Split(Custom String("ＴＬＥｒｒNormal ModeNormal ModeNormal Mode"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))));
            Stop Chasing Player Variable(Event Player, timer_practice);
            Set Player Variable(Event Player, checkpoint_current, (Event Player).checkpoint_practice);
            Call Subroutine(UpdateCache);
            If(And((Event Player).checkpoint_notLast, Not((Event Player).toggle_invincible)));
                Set Player Variable(Event Player, timer_split, (Event Player).timer_normal);
                Call Subroutine(TimerResume);
                Call Subroutine(CheckpointFailReset);
            End;
        End;
        Set Player Variable(Event Player, lockState, False);
        "Anti spam"
        Wait(0.096, Ignore Condition);
    }
}

regel ("Command | Restart Practice (Hold Interact)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Global.EditorOn == False;
        (Event Player).lockState == False;
        (Event Player).toggle_practice != False;
        Or(Is Alive(Event Player), (Event Player).toggle_spectate) == True;
        Is Button Held(Event Player, Button(Interact)) == True;
        Is Button Held(Event Player, Button(Crouch)) == False;
        Is Button Held(Event Player, Button(Ultimate)) == False;
        Is Button Held(Event Player, Button(Melee)) == False;
        Is Button Held(Event Player, Button(Ability 2)) == False;
    }
    aktionen {
        "first 2 ifs prevent collide with spec"
        If((Event Player).toggle_spectate);
            Wait Until(Is Alive(Event Player), 999999999999);
            Wait Until(Not(Is Button Held(Event Player, Button(Interact))), 2);
            Abort;
        End;
        Wait Until(Not(Is Button Held(Event Player, Button(Interact))), 0.9);
        Abort If(Is Button Held(Event Player, Button(Interact)));
        Set Player Variable(Event Player, timer_practice, Null);
        Set Player Variable(Event Player, timer_split, Null);
        Set Player Variable(Event Player, checkpoint_current, (Event Player).checkpoint_practice);
        Call Subroutine(UpdateCache);
        Call Subroutine(CheckpointFailReset);
    }
}

regel ("Command | Skip (Crouch + Primary-Next | Secondary-Previous)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Count Of(Global.A) > True;
        Global.EditorMoveItem == False;
        And((Event Player).editor_lock, Compare(Event Player, ==, Host Player)) == False;
        Or(Global.EditorOn, (Event Player).toggle_practice) == True;
        (Event Player).lockState == False;
        Is Button Held(Event Player, Button(Crouch)) == True;
        Is Button Held(Event Player, Button(Primary Fire)) != Is Button Held(Event Player, Button(Secondary Fire));
    }
    aktionen {
        "@Condition hostPlayer.editor_on or ( eventPlayer.toggle_practice and eventPlayer.isHoldingButton(Button.ABILITY_1) )"
        Set Player Variable(Event Player, lockState, True);
        Set Player Variable(Event Player, timer_split, Null);
        Set Player Variable(Event Player, timer_practice, Null);
        Modify Player Variable(Event Player, checkpoint_current, Add, If-Then-Else(Is Button Held(Event Player, Button(Secondary Fire)), Subtract(Count Of(Global.A), True), True));
        Modify Player Variable(Event Player, checkpoint_current, Modulo, Count Of(Global.A));
        Set Player Variable(Event Player, checkpoint_moved, True);
        Call Subroutine(UpdateCache);
        Call Subroutine(CheckpointFailReset);
        "Anti spam"
        Wait(0.064, Ignore Condition);
        "faster if you spam button"
        Wait Until(Compare(Is Button Held(Event Player, Button(Primary Fire)), ==, Is Button Held(Event Player, Button(Secondary Fire))), 0.256);
        Loop If Condition Is True;
        "After loop to prevent instant teleports"
        Set Player Variable(Event Player, lockState, False);
    }
}

regel ("Command | Quick Reset (Reload | Hold Reload to Enable)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is Button Held(Event Player, Button(Reload)) == True;
        Is Button Held(Event Player, Button(Melee)) == False;
        Is Button Held(Event Player, Button(Interact)) == False;
    }
    aktionen {
        If((Event Player).toggle_quickRestart);
            If((Event Player).editor_fly);
                Set Player Variable(Event Player, editor_fly, Last Of(Value In Array(Global.A, (Event Player).checkpoint_current)));
            End;
            Call Subroutine(CheckpointFailReset);
            Wait(0.32, Ignore Condition);
        End;
        Wait(True, Abort When False);
        Set Player Variable(Event Player, toggle_quickRestart, Not((Event Player).toggle_quickRestart));
        Play Effect(Event Player, Buff Impact Sound, Null, Event Player, 100);
        "(\\"快速回点已启用\\" if eventPlayer.toggle_quickRestart else \\"快速回点已关闭\\") checkCN\\n\\"Quick reset is enabled\\" if eventPlayer.toggle_quickRestart else \\"Quick reset is disabled\\""
        Big Message(Event Player, If-Then-Else((Event Player).toggle_quickRestart, Value In Array(String Split(Custom String("ＴＬＥｒｒQuick Reset Is EnabledQuick Reset Is EnabledQuick Reset Is Enabled"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Value In Array(String Split(Custom String("ＴＬＥｒｒQuick Reset Is DisabledQuick Reset Is DisabledQuick Reset Is Disabled"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))));
    }
}

regel ("Command | Toggle Hud (Hold Secondary)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Global.EditorMoveItem == False;
        And(And(Global.EditorOn, Compare(Event Player, ==, Host Player)), Is Button Held(Event Player, Button(Melee))) == False;
        Is Button Held(Event Player, Button(Secondary Fire)) == True;
        Is Button Held(Event Player, Button(Primary Fire)) == False;
        "don't activate during skipping"
        Is Button Held(Event Player, Button(Crouch)) == False;
    }
    aktionen {
        Wait(1.5, Abort When False);
        Set Player Variable(Event Player, toggle_guide, Not((Event Player).toggle_guide));
        Small Message(Event Player, If-Then-Else((Event Player).toggle_guide, Value In Array(String Split(Custom String("ＴＬＥｒｒ   HUD Is Now Shown   HUD Is Now Shown   HUD Is Now Shown"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Value In Array(String Split(Custom String("ＴＬＥｒｒ   HUD Is Now Hidden   HUD Is Now Hidden   HUD Is Now Hidden"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))));
        "(\\"   HUD已隐藏\\" if eventPlayer.toggle_guide else  \\"   HUD已开启\\")\\ncheckCN\\n(\\"   Hud is now hidden\\" if eventPlayer.toggle_guide else \\"   Hud is now shown\\"))"
        Play Effect(Event Player, Buff Impact Sound, Null, Event Player, 100);
    }
}

regel ("Command | Toggle Hints (Melee + Deflect)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Global.HintText != Null;
        Is Button Held(Event Player, Button(Melee)) == True;
        Is Button Held(Event Player, Button(Ability 2)) == True;
        Or((Event Player).toggle_hints, Array Contains(Global.HintCp, (Event Player).checkpoint_current)) == True;
    }
    aktionen {
        Set Player Variable(Event Player, toggle_hints, Not((Event Player).toggle_hints));
    }
}

regel ("Command | Toggle 3rd Person Camera (Hold Crouch + Jump)") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        "True if not null"
        (Event Player).addon_toggle3rdPov <= True;
        (Event Player).lockState == False;
        (Event Player).editor_lock == False;
        Is On Ground(Event Player) == True;
        Is Button Held(Event Player, Button(Crouch)) == True;
        Is Button Held(Event Player, Button(Jump)) == True;
    }
    aktionen {
        Wait(True, Abort When False);
        Set Player Variable(Event Player, addon_toggle3rdPov, Not((Event Player).addon_toggle3rdPov));
        Call Subroutine(Addon3rdPerson);
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Huds ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("Huds | Global Localplayer") {
    event {
        Ongoing - Global;
    }
    aktionen {
        Wait(0.8, Ignore Condition);
        "name/credit construction\\nnote on changing default name/credit\\nif you change it, also change it in the credits rule\\nthe old credits should always remain valid here to keep old data valid"
        If(Compare(Global.Name, ==, Custom String("name here - 作者")));
            "Legacy Credits"
            Set Global Variable(Name, First Of(Global.Cachedcredits));
        End;
        If(Not(Global.Name));
            Set Global Variable(Name, Custom String("name here - 作者"));
        End;
        If(Compare(Global.Code, ==, Custom String("code here - 代码")));
            "Legacy Credits"
            Set Global Variable(Code, Last Of(Global.Cachedcredits));
        End;
        If(Not(Global.Code));
            Set Global Variable(Code, Custom String("code here - 代码"));
        End;
        Set Global Variable(Cachedcredits, Null);
        If(Not(Global.EditorOn));
            Create HUD Text(First Of(True), Null, If-Then-Else((Local Player).toggle_guide, Custom String("Discord: dsc.gg/genjiparkour"), Empty Array), Custom String("{0}: {1}                                                                                                ", Value In Array(String Split(Custom String("ＴＬＥｒｒMade ByMade ByMade By"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Global.Name), Left, -200, Null, Value In Array(Global.ColorConfig, 18), First Of(Global.ColorConfig), Visible To and String, Default Visibility);
            Create HUD Text(First Of(True), Null, Null, Custom String("{0}: {1}                                                                                                ", Value In Array(String Split(Custom String("ＴＬＥｒｒMap CodeMap CodeMap Code"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Global.Code), Left, -199, Null, Null, Value In Array(Global.ColorConfig, True), Visible To and String, Default Visibility);
            Create HUD Text((Local Player).toggle_guide, Null, Null, Custom String("{0} {1} + {2}", Value In Array(String Split(Custom String("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Input Binding String(Button(Primary Fire)), Custom String("{0} | {1}", Input Binding String(Button(Secondary Fire)), Value In Array(String Split(Custom String("ＴＬＥｒｒPreview CPPreview CPPreview CP"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))))), Right, -160, Null, Null, If-Then-Else((Local Player).preview_array1, Evaluate Once(Value In Array(Global.ColorConfig, 6)), Evaluate Once(Value In Array(Global.ColorConfig, 5))), Visible To String and Color, Default Visibility);
            Create HUD Text(First Of(And((Local Player).preview_array1, (Local Player).toggle_guide)), Null, Value In Array(String Split(Custom String("ＴＬＥｒｒWalk ◀ ▶ | Preview Others\\nWalk ▲ ▼ | Modify Zoom\\nAim | Change Preview AngleWalk ◀ ▶ | Preview Others\\nWalk ▲ ▼ | Modify{0}", Custom String(" Zoom\\nAim | Change Preview AngleWalk ◀ ▶ | Preview Others\\nWalk ▲ ▼ | Modify Zoom\\nAim | Change Preview Angle")), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Null, Top, -171, Null, Value In Array(Global.ColorConfig, 6), Null, Visible To and String, Visible Never);
            Create HUD Text(Local Player, Null, Null, If-Then-Else(Or(Compare((Local Player).timer_splitDisplay, <=, -999999999999), (Local Player).toggle_spectate), Empty Array, Custom String("{0}{1}                                                                                                ", Value In Array(String Split(Custom String("ＴＬＥｒｒSplit: Split: Split: "), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), (Local Player).timer_splitDisplay)), Left, -195, Null, Null, Value In Array(Global.ColorConfig, 3), Visible To and String, Default Visibility);
            "Remove no hints - visual and element bloat"
            If(Count Of(Global.HintText));
                Create HUD Text(First Of(And((Local Player).toggle_guide, Array Contains(Global.HintCp, (Local Player).checkpoint_current))), Null, Custom String("{0}{1}", If-Then-Else((Local Player).toggle_hints, Value In Array(String Split(Custom String("ＴＬＥｒｒ― ― ― ― ― Hint ― ― ― ― ―\\n― ― ― ― ― Hint ― ― ― ― ―\\n― ― ― ― ― Hint ― ― ― ― ―\\n"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Value In Array(String Split(Custom String("ＴＬＥｒｒ― ― ― Hint Available ― ― ―― ― ― Hint Available ― ― ―― ― ― Hint Available ― ― ―"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))), If-Then-Else((Local Player).toggle_hints, Value In Array(Global.HintText, Index Of Array Value(Global.HintCp, (Local Player).checkpoint_current)), Empty Array)), Custom String("{0} + {1} | {2}", Input Binding String(Button(Ability 2)), Input Binding String(Button(Melee)), If-Then-Else((Local Player).toggle_hints, Value In Array(String Split(Custom String("ＴＬＥｒｒHide HintHide HintHide Hint"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Value In Array(String Split(Custom String("ＴＬＥｒｒShow HintShow HintShow Hint"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))))), Right, -151, Null, If-Then-Else((Local Player).toggle_hints, Color(Green), Color(Orange)), If-Then-Else(Array Contains(Global.HintCp, (Local Player).checkpoint_current), Evaluate Once(Value In Array(Global.ColorConfig, 5)), Color(Grau)), Visible To String and Color, Default Visibility);
            End;
            Create HUD Text((Local Player).toggle_guide, Null, Null, Custom String("{0} + {1} + {2}", Input Binding String(Button(Crouch)), Input Binding String(Button(Ability 2)), Custom String("{0} | {1}\\n{2}", Input Binding String(Button(Interact)), Value In Array(String Split(Custom String("ＴＬＥｒｒRestartRestartRestart"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Custom String("{0} {1} | {2}", Value In Array(String Split(Custom String("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Input Binding String(Button(Melee)), Value In Array(String Split(Custom String("ＴＬＥｒｒLeaderboardLeaderboardLeaderboard"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))))), Right, -156, Null, Null, Value In Array(Global.ColorConfig, 5), Visible To and String, Default Visibility);
            Set Global Variable(Difficultyhud, Array(Workshop Setting Combo(Custom String("Map Settings ■ 地图设置 ■ 맵 설정"), Custom String("Difficulty 󠀨Display Hud󠀩 ■ 难度 󠀨顶部hud󠀩 ■ 난이도 󠀨HUD 디스플레이󠀩"), 0, Array(Custom String("<fg27AAFFFF>Playtest ■ 游戏测试 ■ 플레이테스트"), Custom String("<fgA0E81BFF>Easy-"), Custom String("<fgA0E81BFF>Easy"), Custom String("<fgA0E81BFF>Easy+"), Custom String("<fge0e000FF>Medium-"), Custom String("<fge0e000FF>Medium"), Custom String("<fge0e000FF>Medium+"), Custom String("<fgEC9900FF>Hard-"), Custom String("<fgEC9900FF>Hard"), Custom String("<fgEC9900FF>Hard+"), Custom String("<fgFF4500FF>Very Hard-"), Custom String("<fgFF4500FF>Very Hard"), Custom String("<fgFF4500FF>Very Hard+"), Custom String("<fgC80013FF>Extreme-"), Custom String("<fgC80013FF>Extreme"), Custom String("<fgC80013FF>Extreme+"), Custom String("<fg960000FF>Hell"), Custom String("Do Not Display ■ 不显示 ■ 표시 X")), 1), Workshop Setting Toggle(Custom String("Map Settings ■ 地图设置 ■ 맵 설정"), Custom String("Playtest Display ■ 游戏测试 ■ 플레이테스트 디스플레이"), False, 2)));
            "display\\n17th entry is 'dont display'"
            If(Compare(First Of(Global.Difficultyhud), !=, 17));
                Create HUD Text(First Of(And((Local Player).toggle_guide, Not((Local Player).toggle_leaderboard))), If-Then-Else(Last Of(Global.Difficultyhud), Value In Array(String Split(Custom String("ＴＬＥｒｒPlaytestPlaytestPlaytest"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Empty Array), Value In Array(Array(Custom String("Playtest"), Custom String("Easy -"), Custom String("Easy"), Custom String("Easy +"), Custom String("Medium -"), Custom String("Medium"), Custom String("Medium +"), Custom String("Hard -"), Custom String("Hard"), Custom String("Hard +"), Custom String("Very Hard -"), Custom String("Very Hard"), Custom String("Very Hard +"), Custom String("Extreme -"), Custom String("Extreme"), Custom String("Extreme +"), Custom String("Hell"), Null), First Of(Global.Difficultyhud)), Null, Top, -173, Color(Blue), Value In Array(Array(Color(Blue), Color(Lime Green), Color(Lime Green), Color(Lime Green), Color(Yellow), Color(Yellow), Color(Yellow), Color(Orange), Color(Orange), Color(Orange), Custom Color(255, 69, 0, 255), Custom Color(255, 69, 0, 255), Custom Color(255, 69, 0, 255), Color(Red), Color(Red), Color(Red), Custom Color(150, 0, 0, 255), Null), First Of(Global.Difficultyhud)), Null, Visible To and String, Default Visibility);
            End;
        End;
        "global huds"
        Create HUD Text(First Of(True), Null, Custom String("{0}{1}{2}", Value In Array(String Split(Custom String("ＴＬＥｒｒServer Restart In Server Restart In Server Restart In "), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Global.TimeRemaining, Custom String("{0}v1.10.4A{1}", Value In Array(String Split(Custom String("ＴＬＥｒｒ Min -  Min -  Min - "), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), If-Then-Else(Compare(Text Count, >=, 128), Value In Array(String Split(Custom String("ＴＬＥｒｒ\\nError: Max HUD Count Reached\\nError: Max HUD Count Reached\\nError: Max HUD Count Reached"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Empty Array))), Null, Right, -162, Null, Value In Array(Global.ColorConfig, 2), Null, Visible To and String, Visible Always);
        "padding for custom hud display"
        Create HUD Text(First Of(True), Null, Null, Custom String("­\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n"), Top, -164, Null, Null, Color(Orange), Visible To, Default Visibility);
        Create HUD Text((Local Player).toggle_guide, Null, Null, If-Then-Else((Local Player).toggle_quickRestart, Custom String("{0} | {1}", Input Binding String(Button(Reload)), Value In Array(String Split(Custom String("ＴＬＥｒｒQuick ResetQuick ResetQuick Reset"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))), Custom String("{0} {1} | {2}", Value In Array(String Split(Custom String("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Input Binding String(Button(Reload)), Value In Array(String Split(Custom String("ＴＬＥｒｒEnable Quick ResetEnable Quick ResetEnable Quick Reset"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))))), Right, -157, Null, Null, Value In Array(Global.ColorConfig, 5), Visible To and String, Default Visibility);
        Create HUD Text((Local Player).toggle_guide, Null, Null, Custom String("{0} + {1} | {2}", Input Binding String(Button(Reload)), Input Binding String(Button(Melee)), Custom String("{0}{1}", Value In Array(String Split(Custom String("ＴＬＥｒｒInvincibleInvincibleInvincible"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), If-Then-Else((Local Player).toggle_invincible, Value In Array(String Split(Custom String("ＴＬＥｒｒ | On | On | On"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Empty Array))), Right, -154, Null, Null, If-Then-Else((Local Player).toggle_invincible, Evaluate Once(Value In Array(Global.ColorConfig, 6)), Evaluate Once(Value In Array(Global.ColorConfig, 5))), Visible To String and Color, Default Visibility);
        Create HUD Text(First Of(True), Null, If-Then-Else((Local Player).toggle_guide, Empty Array, Custom String("{0}{1}{2}", If-Then-Else((Local Player).toggle_invincible, Ability Icon String(Hero(Baptiste), Button(Ability 2)), Empty Array), If-Then-Else((Local Player).toggle_practice, Ability Icon String(Hero(D.Va), Button(Ultimate)), Empty Array), If-Then-Else((Local Player).toggle_invisible, Ability Icon String(Hero(Sombra), Button(Ability 1)), Empty Array))), Custom String("{0} {1} | {2} HUD", Value In Array(String Split(Custom String("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Input Binding String(Button(Secondary Fire)), Value In Array(String Split(Custom String("ＴＬＥｒｒToggleToggleToggle"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))), Right, -161, Null, Value In Array(Global.ColorConfig, 5), Value In Array(Global.ColorConfig, 5), Visible To and String, Default Visibility);
        "text per checkpoint  text per cp each"
        If(Count Of(Global.CpHudText));
            Create HUD Text(First Of(And(Array Contains(Global.CpHudCp, (Local Player).checkpoint_current), (Local Player).toggle_guide)), Value In Array(Global.CpHudText, Index Of Array Value(Global.CpHudCp, (Local Player).checkpoint_current)), Null, Null, Top, -169, Color(Blue), Null, Null, Visible To and String, Default Visibility);
        End;
        If(Count Of(Global.CpIwtText));
            Create In-World Text(Array Contains(Global.CpIwtCp, (Local Player).checkpoint_current), Value In Array(Global.CpIwtText, Index Of Array Value(Global.CpIwtCp, (Local Player).checkpoint_current)), Value In Array(Global.CpIwtPos, Index Of Array Value(Global.CpIwtCp, (Local Player).checkpoint_current)), 2, Clip Against Surfaces, Visible To Position and String, Global.CpIwtColor, Default Visibility);
        End;
        If(Global.CompMode);
            Create HUD Text(Filtered Array(All Players(All Teams), (Current Array Element).comp_instructionHud), Custom String("                                                                                                                           "), Null, Null, Top, -181, Color(Weiß), Null, Null, Visible To, Default Visibility);
            If(First Of(Global.instructiontext));
                Create HUD Text(Filtered Array(All Players(All Teams), (Current Array Element).comp_instructionHud), Null, Null, First Of(Global.instructiontext), Top, -180, Null, Null, Color(Weiß), Visible To, Default Visibility);
            End;
            If(Value In Array(Global.instructiontext, True));
                Create HUD Text(Filtered Array(All Players(All Teams), (Current Array Element).comp_instructionHud), Null, Null, Value In Array(Global.instructiontext, True), Top, -179, Null, Null, Color(Weiß), Visible To, Default Visibility);
            End;
            If(Value In Array(Global.instructiontext, 2));
                Create HUD Text(Filtered Array(All Players(All Teams), (Current Array Element).comp_instructionHud), Null, Null, Value In Array(Global.instructiontext, 2), Top, -178, Null, Null, Color(Weiß), Visible To, Default Visibility);
            End;
            If(Value In Array(Global.instructiontext, 3));
                Create HUD Text(Filtered Array(All Players(All Teams), (Current Array Element).comp_instructionHud), Null, Null, Value In Array(Global.instructiontext, 3), Top, -177, Null, Null, Color(Weiß), Visible To, Default Visibility);
            End;
            Create HUD Text(Filtered Array(All Players(All Teams), (Current Array Element).comp_instructionHud), Custom String("                                   Press {0} to start                                ", Input Binding String(Button(Interact))), Null, Null, Top, -176, Color(Weiß), Null, Null, Visible To and String, Default Visibility);
        Else If(Not(Global.EditorOn));
            Create HUD Text((Local Player).toggle_guide, Null, Null, Custom String("{0} {1} | {2}", Value In Array(String Split(Custom String("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Input Binding String(Button(Ability 2)), Custom String("{0}{1}", Value In Array(String Split(Custom String("ＴＬＥｒｒInvisibleInvisibleInvisible"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), If-Then-Else((Local Player).toggle_invisible, Value In Array(String Split(Custom String("ＴＬＥｒｒ | On | On | On"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Empty Array))), Right, -158, Null, Null, If-Then-Else((Local Player).toggle_invisible, Evaluate Once(Value In Array(Global.ColorConfig, 6)), Evaluate Once(Value In Array(Global.ColorConfig, 5))), Visible To String and Color, Default Visibility);
            Create HUD Text((Local Player).toggle_guide, Null, Null, Custom String("{0} + {1} | {2}", Input Binding String(Button(Ultimate)), Input Binding String(Button(Melee)), Custom String("{0}{1}", Value In Array(String Split(Custom String("ＴＬＥｒｒPracticePracticePractice"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), If-Then-Else((Local Player).toggle_practice, Custom String(" | ({0})", (Local Player).checkpoint_practice), Empty Array))), Right, -153, Null, Null, If-Then-Else((Local Player).toggle_practice, Evaluate Once(Value In Array(Global.ColorConfig, 6)), Evaluate Once(Value In Array(Global.ColorConfig, 5))), Visible To String and Color, Default Visibility);
            Create HUD Text(First Of(And((Local Player).toggle_practice, (Local Player).toggle_guide)), Null, Custom String("{0} + {1} | {2}", Input Binding String(Button(Crouch)), Input Binding String(Button(Primary Fire)), Custom String("{0}\\n{1} + {2}", Value In Array(String Split(Custom String("ＴＬＥｒｒNext LevelNext LevelNext Level"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Input Binding String(Button(Crouch)), Custom String("{0} | {1}\\n{2}", Input Binding String(Button(Secondary Fire)), Value In Array(String Split(Custom String("ＴＬＥｒｒPrevious LevelPrevious LevelPrevious Level"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Custom String("{0} | {1}", Input Binding String(Button(Interact)), Value In Array(String Split(Custom String("ＴＬＥｒｒRestart PracticeRestart PracticeRestart Practice"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))))))), Null, Right, -152, Null, Evaluate Once(Value In Array(Global.ColorConfig, 6)), Null, Visible To String and Color, Default Visibility);
            Skip(True);
        Else;
            //spectateHud:
            Create HUD Text((Local Player).toggle_guide, Null, Null, Custom String("{0} {1} | {2}", Value In Array(String Split(Custom String("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Input Binding String(Button(Interact)), Custom String("{0}{1}", Value In Array(String Split(Custom String("ＴＬＥｒｒSpectateSpectateSpectate"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), If-Then-Else((Local Player).toggle_spectate, Value In Array(String Split(Custom String("ＴＬＥｒｒ | On | On | On"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Empty Array))), Right, -155, Null, Null, If-Then-Else((Local Player).toggle_spectate, Evaluate Once(Value In Array(Global.ColorConfig, 6)), Evaluate Once(Value In Array(Global.ColorConfig, 5))), Visible To String and Color, Default Visibility);
    }
}

regel ("Huds | Leaderboard") {
    event {
        Ongoing - Global;
    }
    bedingungen {
        Global.LeaderBoardRemake != False;
        Global.LeaderBoardFull != Empty Array;
    }
    aktionen {
        "account for delay in completion"
        Wait(False, Ignore Condition);
        While(Count Of(Global.LeaderBoardHuds));
            Destroy HUD Text(First Of(Global.LeaderBoardHuds));
            Modify Global Variable(LeaderBoardHuds, Remove From Array By Index, False);
        End;
        "top 5"
        Set Global Variable(LeaderBoardFull, Sorted Array(Global.LeaderBoardFull, Value In Array(Current Array Element, True)));
        Set Global Variable(LeaderBoardRemake, Empty Array);
        Set Global Variable(LeaderBoardHuds, Mapped Array(Global.LeaderBoardFull, Custom String("　 {0}:　{1} - {2}", Add(Current Array Index, True), First Of(Current Array Element), Last Of(Current Array Element))));
        While(Count Of(Global.LeaderBoardHuds));
            Set Global Variable(LeaderBoardRemake, Custom String("{0}\\n{1}", Global.LeaderBoardRemake, First Of(Global.LeaderBoardHuds)));
            Modify Global Variable(LeaderBoardHuds, Remove From Array By Index, False);
        End;
        Set Global Variable(LeaderBoardRemake, Custom String("{0}\\n", Global.LeaderBoardRemake));
        "if LeaderBoardFull[0]:"
        Create HUD Text((Local Player).toggle_guide, Null, Custom String(" \\n{0} {1} {0}", Icon String(Flag), Value In Array(String Split(Custom String("ＴＬＥｒｒTop 5Top 5Top 5"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))), Null, Right, -141, Null, Color(Weiß), Null, Visible To and String, Visible Always);
        Set Global Variable(LeaderBoardHuds, Last Text ID);
        Create HUD Text(First Of(True), Hero Icon String(Hero(Genji)), First Of(First Of(Global.LeaderBoardFull)), Last Of(First Of(Global.LeaderBoardFull)), Right, -140, Color(Red), Color(Red), Color(Red), Visible To, Visible Always);
        Modify Global Variable(LeaderBoardHuds, Append To Array, Last Text ID);
        If(Value In Array(Global.LeaderBoardFull, True));
            Create HUD Text(First Of(True), Hero Icon String(Hero(Genji)), First Of(Value In Array(Global.LeaderBoardFull, True)), Last Of(Value In Array(Global.LeaderBoardFull, True)), Right, -139, Color(Orange), Color(Orange), Color(Orange), Visible To, Visible Always);
            Modify Global Variable(LeaderBoardHuds, Append To Array, Last Text ID);
            If(Value In Array(Global.LeaderBoardFull, 2));
                Create HUD Text(First Of(True), Hero Icon String(Hero(Genji)), First Of(Value In Array(Global.LeaderBoardFull, 2)), Last Of(Value In Array(Global.LeaderBoardFull, 2)), Right, -138, Color(Yellow), Color(Yellow), Color(Yellow), Visible To, Visible Always);
                Modify Global Variable(LeaderBoardHuds, Append To Array, Last Text ID);
                If(Value In Array(Global.LeaderBoardFull, 3));
                    Create HUD Text(First Of(True), Hero Icon String(Hero(Genji)), First Of(Value In Array(Global.LeaderBoardFull, 3)), Last Of(Value In Array(Global.LeaderBoardFull, 3)), Right, -137, Color(Lime Green), Color(Lime Green), Color(Lime Green), Visible To, Visible Always);
                    Modify Global Variable(LeaderBoardHuds, Append To Array, Last Text ID);
                    If(Value In Array(Global.LeaderBoardFull, 4));
                        Create HUD Text(First Of(True), Hero Icon String(Hero(Genji)), First Of(Value In Array(Global.LeaderBoardFull, 4)), Last Of(Value In Array(Global.LeaderBoardFull, 4)), Right, -136, Color(Green), Color(Green), Color(Green), Visible To, Visible Always);
                        Modify Global Variable(LeaderBoardHuds, Append To Array, Last Text ID);
                    End;
                End;
            End;
        End;
        Create HUD Text(If-Then-Else(Evaluate Once(And(Global.CompMode, Not(Global.CompTime))), True, (Local Player).toggle_leaderboard), Custom String("　　　　 {0} {1} {0} 　　　　\\n　　　　　　　　　　　　　　　　　　{2}", Icon String(Flag), Value In Array(String Split(Custom String("ＴＬＥｒｒLeaderboardLeaderboardLeaderboard"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Evaluate Once(Global.LeaderBoardRemake)), Null, Null, Top, -165, Color(Weiß), Null, Null, Visible To and String, Default Visibility);
        Modify Global Variable(LeaderBoardHuds, Append To Array, Last Text ID);
        Set Global Variable(LeaderBoardRemake, Null);
        Wait(False, Ignore Condition);
    }
}

regel ("Huds | Each Player") {
    event {
        Player Joined Match;
        All;
        All;
    }
    aktionen {
        Wait(0.512, Ignore Condition);
        Create HUD Text(Event Player, Null, If-Then-Else((Event Player).toggle_practice, Custom String("{0} {1} sec", Value In Array(String Split(Custom String("ＴＬＥｒｒPractice Time:Practice Time:Practice Time:"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), (Event Player).timer_practice), Empty Array), Custom String("{0} {1} sec                                                                                                ", Value In Array(String Split(Custom String("ＴＬＥｒｒTime:Time:Time:"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), (Event Player).timer_normal), Left, -196, Null, Color(Grau), Value In Array(Global.ColorConfig, 3), String, Default Visibility);
        Create HUD Text(If-Then-Else((Event Player).toggle_leaderboard, Null, Event Player), If-Then-Else((Event Player).preview_array1, Custom String(" {0} ({1}/{2}", If-Then-Else((Event Player).preview_i, If-Then-Else(Compare((Event Player).preview_i, <=, Count Of((Event Player).cache_bouncePosition)), Value In Array(String Split(Custom String("ＴＬＥｒｒOrbOrbOrb"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Value In Array(String Split(Custom String("ＴＬＥｒｒPortalPortalPortal"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))), Value In Array(String Split(Custom String("ＴＬＥｒｒCheckpointCheckpointCheckpoint"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))), Add((Event Player).preview_i, True), Custom String("{0})\\n―――――――――――\\n {1}\\n", Count Of((Event Player).preview_array1), If-Then-Else(And(Compare((Event Player).preview_i, <=, Count Of((Event Player).cache_bouncePosition)), (Event Player).preview_i), Custom String("{0} {1} {2}", If-Then-Else(Value In Array(Global.TQ5, Value In Array((Event Player).preview_array2, (Event Player).preview_i)), Ability Icon String(Hero(Genji), Button(Ultimate)), Empty Array), If-Then-Else(Value In Array(Global.TQ6, Value In Array((Event Player).preview_array2, (Event Player).preview_i)), Ability Icon String(Hero(Genji), Button(Ability 1)), Empty Array), Custom String("{0} {1}", If-Then-Else(Value In Array(Global.BounceToggleLock, Value In Array((Event Player).preview_array2, (Event Player).preview_i)), Icon String(Warning), Empty Array), If-Then-Else(Compare(Value In Array(Global.EditMode, Value In Array((Event Player).preview_array2, (Event Player).preview_i)), >, Null), Icon String(Arrow: Up), If-Then-Else(Compare(Value In Array(Global.EditMode, Value In Array((Event Player).preview_array2, (Event Player).preview_i)), <, Null), Icon String(Arrow: Down), Empty Array)))), If-Then-Else((Event Player).preview_i, If-Then-Else(Last Of(Value In Array((Event Player).preview_array2, (Event Player).preview_i)), Custom String("{0} {1}", Value In Array(String Split(Custom String("ＴＬＥｒｒPortal ExitPortal ExitPortal Exit"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Value In Array((Event Player).preview_array2, (Event Player).preview_i)), Custom String("{0} {1}", Value In Array(String Split(Custom String("ＴＬＥｒｒPortal StartPortal StartPortal Start"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Value In Array((Event Player).preview_array2, (Event Player).preview_i))), (Event Player).banString)))), Empty Array), If-Then-Else((Event Player).preview_array1, Empty Array, Custom String("{0}{1} {2}", If-Then-Else(And((Event Player).toggle_guide, (Event Player).banString), Custom String("{0}\\n", (Event Player).banString), Empty Array), Value In Array(String Split(Custom String("ＴＬＥｒｒLevelLevelLevel"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Custom String("{0} / {1}", (Event Player).checkpoint_current, Subtract(Count Of(Global.A), True)))), If-Then-Else(And((Event Player).cache_bounceMaxLocks, Not((Event Player).preview_array1)), Custom String("{0} {1} / {2}", Value In Array(String Split(Custom String("ＴＬＥｒｒ{0} Orbs{0} Orbs{0} Orbs", Value In Array(Global.ColorConfig, 16)), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Count Of((Event Player).cache_collectedLocks), (Event Player).cache_bounceMaxLocks), Empty Array), Top, -172, Value In Array(Global.ColorConfig, 4), Value In Array(Global.ColorConfig, 4), Value In Array(Global.ColorConfig, 16), Visible To and String, Default Visibility);
        Create HUD Text(Event Player, Null, Null, Custom String("{0}{1}{2}", If-Then-Else(X Component Of((Event Player).cache_inputs), Custom String("■"), Custom String("□")), If-Then-Else(Compare(Z Component Of(Throttle Of(Event Player)), >, Null), Custom String("▲"), Custom String("△")), Custom String("{0}\\n{1}{2}", If-Then-Else(Y Component Of((Event Player).cache_inputs), Custom String("●"), Custom String("○")), If-Then-Else(Compare(X Component Of(Throttle Of(Event Player)), >, Null), Custom String("◀"), Custom String("◁")), Custom String("{0}{1}                                                                                                ", If-Then-Else(Compare(Z Component Of(Throttle Of(Event Player)), <, Null), Custom String("▼"), Custom String("∇")), If-Then-Else(Compare(X Component Of(Throttle Of(Event Player)), <, Null), Custom String("▶"), Custom String("▷"))))), Left, -192, Null, Null, Evaluate Once(Value In Array(Global.ColorConfig, 3)), String, Default Visibility);
        "climb/bhop indicators"
        Create HUD Text(Event Player, Custom String("{0}{1}", Value In Array(String Split(Custom String("ＴＬＥｒｒClimbClimbClimb"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), If-Then-Else((Event Player).skill_countMulti, Custom String(" ({0})", (Event Player).skill_countMulti), Empty Array)), Null, Custom String("                                                                                                                                "), Left, -193, If-Then-Else((Event Player).skill_usedClimb, Evaluate Once(Value In Array(Global.ColorConfig, 8)), Evaluate Once(Value In Array(Global.ColorConfig, 7))), Null, Null, String and Color, Default Visibility);
        Create HUD Text(Event Player, Custom String("{0}{1}", Value In Array(String Split(Custom String("ＴＬＥｒｒBhopBhopBhop"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), If-Then-Else((Event Player).skill_countCreates, Custom String(" ({0})", (Event Player).skill_countCreates), Empty Array)), Null, Custom String("                                                                                                                                "), Left, -194, If-Then-Else((Event Player).skill_usedBhop, Evaluate Once(Value In Array(Global.ColorConfig, 8)), Evaluate Once(Value In Array(Global.ColorConfig, 7))), Null, Null, String and Color, Default Visibility);
        Create In-World Text(If-Then-Else(And((Event Player).checkpoint_notLast, (Event Player).toggle_guide), Event Player, Null), If-Then-Else(And((Event Player).cache_bounceMaxLocks, Compare(Count Of((Event Player).cache_collectedLocks), <, (Event Player).cache_bounceMaxLocks)), Custom String("{0}{1}", Icon String(Warning), Value In Array(String Split(Custom String("ＴＬＥｒｒCollect Orbs FirstCollect Orbs FirstCollect Orbs First"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))), Value In Array(String Split(Custom String("ＴＬＥｒｒCome HereCome HereCome Here"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array))))), Value In Array(Global.A, Add((Event Player).checkpoint_current, True)), 1.5, Do Not Clip, Visible To Position and String, Value In Array(Global.ColorConfig, 13), Default Visibility);
        Wait(2.5, Ignore Condition);
        If(Global.CompMode);
            Create HUD Text(Event Player, Null, If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), If-Then-Else(Global.CompTime, Custom String("剩余时间: {0} 分钟{1}", Global.CompTime, If-Then-Else(Compare((Event Player).comp_countAttempts, <, Null), Custom String("\\n你没有尝试过"), If-Then-Else(Global.CompAtmpNum, Custom String("\\n尝试 {0} / {1}", (Event Player).comp_countAttempts, Global.CompAtmpNum), Empty Array))), Custom String("! 比赛结束 !")), If-Then-Else(Global.CompTime, Custom String("Time Left: {0} Min{1}", Global.CompTime, If-Then-Else(Compare((Event Player).comp_countAttempts, <, Null), Custom String("\\nYou Are Out Of Attempts"), If-Then-Else(Global.CompAtmpNum, Custom String("\\nAttempt {0} / {1}", (Event Player).comp_countAttempts, Global.CompAtmpNum), Empty Array))), Custom String("! Competition Is Over !"))), If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), If-Then-Else(Global.CompTime, Custom String("竞赛模式"), Custom String("竞赛模式\\n\\n\\n")), If-Then-Else(Global.CompTime, Custom String("Tournament Mode"), Custom String("Tournament Mode\\n\\n\\n"))), Top, -182, Null, Color(Yellow), Color(Yellow), String, Default Visibility);
    }
}

regel ("Huds | SUB Update Title") {
    event {
        Subroutine;
        UpdateTitle;
    }
    aktionen {
        "or eventPlayer.toggle_practice:"
        Abort If(Or(Or(Global.CompMode, Global.EditorOn), Not(And(Count Of(Global.TitleData), Array Contains(First Of(Global.TitleData), (Event Player).checkpoint_current)))));
        Destroy In-World Text((Event Player).cache_titleHud);
        Create In-World Text(First Of(Not((Event Player).toggle_invisible)), Value In Array(Value In Array(Global.TitleData, True), Index Of Array Value(First Of(Global.TitleData), (Event Player).checkpoint_current)), Event Player, 1.1, Clip Against Surfaces, Visible To and Position, Value In Array(Last Of(Global.TitleData), Index Of Array Value(First Of(Global.TitleData), (Event Player).checkpoint_current)), Default Visibility);
        Set Player Variable(Event Player, cache_titleHud, Last Text ID);
    }
}

regel ("Huds | Addons") {
    event {
        Ongoing - Global;
    }
    aktionen {
        Wait(0.8, Ignore Condition);
        Wait Until(Entity Exists(All Players(All Teams)), 999999999999);
        Wait(False, Ignore Condition);
        If(Compare((All Players(All Teams)).addon_toggle3rdPov, <=, True));
            Create HUD Text((Local Player).toggle_guide, Null, Null, Custom String("{0} {1} + {2}", Value In Array(String Split(Custom String("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Input Binding String(Button(Crouch)), Custom String("{0} | {1}{2}", Input Binding String(Button(Jump)), Value In Array(String Split(Custom String("ＴＬＥｒｒ3rd Person3rd Person3rd Person"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), If-Then-Else((Local Player).addon_toggle3rdPov, Value In Array(String Split(Custom String("ＴＬＥｒｒ | On | On | On"), Global.__overpyTranslationHelper__), Absolute Value(Index Of Array Value(Global.__overpyTranslationHelper__, String Split(Color(Weiß), Empty Array)))), Empty Array))), Right, -159, Null, Null, If-Then-Else((Local Player).addon_toggle3rdPov, Evaluate Once(Value In Array(Global.ColorConfig, 6)), Evaluate Once(Value In Array(Global.ColorConfig, 5))), Visible To String and Color, Default Visibility);
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Effects ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("Effects | Setup Effects") {
    event {
        Ongoing - Global;
    }
    aktionen {
        "add back to below wait if removed"
        Wait(1.264, Ignore Condition);
        "pre set control map portals. not in portal rule because shared I variable"
        If(Count Of(Global.PortalDest));
            For Global Variable(NANBA, 0, Count Of(Global.PortalLoc), True);
                Create Effect(Filtered Array(All Players(All Teams), Or((Current Array Element).toggle_invincible, Not((Current Array Element).checkpoint_notLast))), Bad Aura, If-Then-Else(Modulo(Global.NANBA, 2), Color(Aqua), Color(Orange)), Value In Array(Global.PortalLoc, Global.NANBA), 0.6, Visible To);
                Create In-World Text(Filtered Array(All Players(All Teams), Or((Current Array Element).toggle_invincible, Not((Current Array Element).checkpoint_notLast))), Value In Array(Global.PortalNames, Global.NANBA), Add(Value In Array(Global.PortalLoc, Global.NANBA), Up), True, Clip Against Surfaces, Visible To, Color(Weiß), Default Visibility);
            End;
            Wait(False, Ignore Condition);
        End;
        If(Global.EditorOn);
            Call Subroutine(RebuildKillOrbs);
            Call Subroutine(RebuildBounceOrbs);
            Call Subroutine(RebuildPortals);
        Else;
            If(Count Of(Global.CustomPortalStart));
                For Global Variable(NANBA, 0, Count Of(Global.CustomPortalStart), True);
                    Create Effect(Filtered Array(All Players(All Teams), Or(Compare((Current Array Element).checkpoint_current, ==, Evaluate Once(Value In Array(Global.CustomPortalCP, Global.NANBA))), Evaluate Once(Compare(Value In Array(Global.CustomPortalCP, Global.NANBA), <, Null)))), Good Aura, Value In Array(Global.ColorConfig, 17), Value In Array(Global.CustomPortalStart, Global.NANBA), 0.6, Visible To);
                    Wait(False, Ignore Condition);
                End;
                Wait(0.5, Ignore Condition);
            End;
            If(Count Of(Global.H));
                For Global Variable(NANBA, 0, Count Of(Global.H), True);
                    Create Effect(Filtered Array(All Players(All Teams), Compare((Current Array Element).checkpoint_current, ==, Evaluate Once(Value In Array(Global.killballnumber, Global.NANBA)))), Sphere, Value In Array(Global.ColorConfig, 14), Value In Array(Global.H, Global.NANBA), Absolute Value(Value In Array(Global.I, Global.NANBA)), Visible To);
                    Wait(False, Ignore Condition);
                End;
                Wait(0.5, Ignore Condition);
            End;
            If(Count Of(Global.TQ));
                For Global Variable(NANBA, 0, Count Of(Global.TQ), True);
                    Create Effect(Filtered Array(Append To Array(All Players(All Teams), Null), And(Compare((Current Array Element).checkpoint_current, ==, Evaluate Once(Value In Array(Global.pinballnumber, Global.NANBA))), Not(Array Contains((Current Array Element).cache_collectedLocks, Evaluate Once(Global.NANBA))))), Orb, If-Then-Else(Value In Array(Global.BounceToggleLock, Global.NANBA), Value In Array(Global.ColorConfig, 16), Value In Array(Global.ColorConfig, 15)), Value In Array(Global.TQ, Global.NANBA), True, Visible To);
                    Wait(False, Ignore Condition);
                End;
            End;
            "End portal preview"
            Create Effect(If-Then-Else(And(And((Local Player).preview_i, Compare((Local Player).preview_i, >, Count Of((Local Player).cache_bouncePosition))), Last Of(Value In Array((Local Player).preview_array2, (Local Player).preview_i))), Local Player, Null), Sparkles, Color(Purple), Value In Array((Local Player).preview_array1, (Local Player).preview_i), 0.5, Visible To Position and Radius);
    }
}

regel ("Effects | SUB Rebuild Bounce Orbs") {
    event {
        Subroutine;
        RebuildBounceOrbs;
    }
    aktionen {
        Destroy Effect(Global.TQ2);
        Set Global Variable(TQ2, Empty Array);
        For Global Variable(NANBA, 0, Count Of(Global.pinballnumber), True);
            Create Effect(Filtered Array(Append To Array(All Players(All Teams), Null), And(Compare((Current Array Element).checkpoint_current, ==, Value In Array(Global.pinballnumber, Evaluate Once(Global.NANBA))), Not(Array Contains((Current Array Element).cache_collectedLocks, Evaluate Once(Global.NANBA))))), Orb, If-Then-Else(Value In Array(Global.BounceToggleLock, Evaluate Once(Global.NANBA)), Value In Array(Global.ColorConfig, 16), Value In Array(Global.ColorConfig, 15)), Value In Array(Global.TQ, Evaluate Once(Global.NANBA)), True, Visible To Position Radius and Color);
            Modify Global Variable(TQ2, Append To Array, Last Created Entity);
            "wait()"
            If(Not(Modulo(Global.NANBA, 5)));
                Wait(False, Ignore Condition);
            End;
        End;
    }
}

regel ("Effects | SUB Rebuild boundary spheres") {
    event {
        Subroutine;
        RebuildKillOrbs;
    }
    aktionen {
        Destroy Effect(Global.K);
        Set Global Variable(K, Empty Array);
        For Global Variable(NANBA, 0, Count Of(Global.killballnumber), True);
            Create Effect(Filtered Array(Append To Array(All Players(All Teams), Null), Compare((Current Array Element).checkpoint_current, ==, Value In Array(Global.killballnumber, Evaluate Once(Global.NANBA)))), Sphere, Value In Array(Global.ColorConfig, 14), Value In Array(Global.H, Evaluate Once(Global.NANBA)), Absolute Value(Value In Array(Global.I, Evaluate Once(Global.NANBA))), Visible To Position and Radius);
            Modify Global Variable(K, Append To Array, Last Created Entity);
            If(Not(Modulo(Global.NANBA, 5)));
                Wait(False, Ignore Condition);
            End;
        End;
    }
}

regel ("Effects | SUB Rebuild Portals") {
    event {
        Subroutine;
        RebuildPortals;
    }
    aktionen {
        Destroy Effect(Global.PortalEffects);
        Set Global Variable(PortalEffects, Empty Array);
        If(Count Of(Global.CustomPortalCP));
            For Global Variable(NANBA, 0, Count Of(Global.CustomPortalCP), True);
                Create Effect(Filtered Array(All Players(All Teams), Or(Compare((Current Array Element).checkpoint_current, ==, Value In Array(Global.CustomPortalCP, Evaluate Once(Global.NANBA))), Compare(Value In Array(Global.CustomPortalCP, Evaluate Once(Global.NANBA)), <, Null))), Good Aura, Value In Array(Global.ColorConfig, 17), Value In Array(Global.CustomPortalStart, Evaluate Once(Global.NANBA)), 0.6, Visible To Position and Radius);
                Modify Global Variable(PortalEffects, Append To Array, Last Created Entity);
                If(Not(Modulo(Global.NANBA, 5)));
                    Wait(False, Ignore Condition);
                End;
            End;
        End;
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Addon Functions ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("Addon | AFK timer") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Is Moving(Event Player) == False;
        Is Alive(Event Player) == True;
        Is Communicating Any Emote(Event Player) == False;
        Global.EditorOn == False;
    }
    aktionen {
        Wait(300, Abort When False);
        If((Event Player).addon_toggle3rdPov);
            Set Player Variable(Event Player, addon_toggle3rdPov, False);
        End;
        Set Status(Event Player, Null, Asleep, 999999999999);
        "raycast to prevent camera stuck on low wall"
        Start Camera(Event Player, Add(Position Of(Event Player), Multiply(Up, Subtract(Distance Between(Position Of(Event Player), Ray Cast Hit Position(Position Of(Event Player), Add(Position Of(Event Player), Multiply(4, Up)), Null, Null, False)), True))), Position Of(Event Player), 10);
        "cancel it after jumping or not sleep, reset cures sleep"
        Wait(True, Ignore Condition);
        Wait Until(Or(Is Button Held(Event Player, Button(Jump)), Not(Has Status(Event Player, Asleep))), 999999999999);
        Clear Status(Event Player, Asleep);
        Stop Camera(Event Player);
        If(And((Event Player).checkpoint_notLast, Not((Event Player).toggle_invincible)));
            Call Subroutine(CheckpointFailReset);
        End;
        Loop If Condition Is True;
    }
}

regel ("Addon | Pre-set control map portal - toggled via workshop") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Global.PortalOn != False;
        Count Of(Global.PortalLoc) != Null;
        Or((Event Player).toggle_invincible, Not((Event Player).checkpoint_notLast)) == True;
        Is True For Any(Global.PortalLoc, Compare(Distance Between(Current Array Element, Add(Position Of(Event Player), Multiply(0.2, Up))), <, 1.3)) == True;
    }
    aktionen {
        Teleport(Event Player, First Of(Sorted Array(Global.PortalDest, Distance Between(Event Player, Value In Array(Global.PortalLoc, Current Array Index)))));
    }
}

regel ("Addon | Custom portals") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Count Of((Event Player).cache_portalStart) != Null;
        Is True For Any((Event Player).cache_portalStart, Compare(Distance Between(Current Array Element, Add(Position Of(Event Player), Multiply(0.2, Up))), <, 1.3)) == True;
    }
    aktionen {
        Teleport(Event Player, First Of(Sorted Array((Event Player).cache_portalEnd, Distance Between(Event Player, Value In Array((Event Player).cache_portalStart, Current Array Index)))));
        Wait(0.4, Ignore Condition);
    }
}

regel ("Addon | Pre-set control map portal - toggled on via workshop settings") {
    event {
        Ongoing - Global;
    }
    bedingungen {
        Global.PortalOn != False;
    }
    aktionen {
        "overwrite pasta"
        Wait(0.752, Ignore Condition);
        If(Compare(Current Map, ==, Map(Busan)));
            "\\"down > sanc\\",\\"down > meka\\",\\"sanc > down\\",\\"sanc > meka\\",\\"meka > sanc\\",\\"meka > down\\""
            Set Global Variable(PortalNames, String Split(Custom String("Sanctuary0MEKA base0Downtown0MEKA base0Sanctuary0Downtown"), First Of(Null)));
            Set Global Variable(PortalLoc, Array(Vector(47.946, 7.248, -93.922), Vector(55.921, 6.998, -94.024), Vector(-326.382, 10.81, 117.261), Vector(-330.96, 10.81, 117.416), Vector(219.567, 10.215, 243.653), Vector(225.976, 10.227, 240.799)));
            Set Global Variable(PortalDest, Array(Vector(-328.552, 10.01, 120.82), Vector(221.152, 9.376, 238.765), Vector(52.197, 6.301, -97.513), Vector(221.271, 9.431, 238.978), Vector(-328.601, 10.01, 120.823), Vector(52.197, 6.299, -97.513)));
        Else If(Compare(Current Map, ==, Map(Ilios)));
            "\\"light > ruin\\",\\"light > well\\",\\"ruin > light\\",\\"ruin > well\\",\\"well > light\\",\\"well > ruin\\""
            Set Global Variable(PortalNames, String Split(Custom String("Ruins0Well0Lighthouse0Well0Lighthouse0Ruins"), First Of(Null)));
            Set Global Variable(PortalLoc, Array(Vector(325.722, -22.665, -40.401), Vector(327.43, -22.665, -36.089), Vector(26.176, 58.367, -156.415), Vector(30.472, 58.367, -156.307), Vector(-199.945, 2.015, -2.918), Vector(-194.93, 2.015, -8.054)));
            Set Global Variable(PortalDest, Array(Vector(28.375, 57.659, -161.195), Vector(-200.464, 1.306, -8.604), Vector(333.088, -23.389, -40.933), Vector(-200.464, 1.306, -8.604), Vector(333.088, -23.389, -40.933), Vector(28.375, 57.829, -161.195)));
        Else If(Or(Compare(Current Map, ==, Map(Lijiang Tower)), Compare(Current Map, ==, Map(Lijiang Tower Neujahr))));
            "\\"control > garden\\",\\"control > market\\",\\"garden > control\\",\\"garden > market\\",\\"market > control\\",\\"market > garden\\""
            Set Global Variable(PortalNames, String Split(Custom String("Garden0Night Market0Control Center0Night Market0Control Center0Garden"), First Of(Null)));
            Set Global Variable(PortalLoc, Array(Vector(-2.815, 271, 295.373), Vector(2.905, 271, 295.052), Vector(5.788, 95.056, 135.298), Vector(-5.343, 95.05, 134.638), Vector(-2.738, False, -61.911), Vector(5.043, False, -61.879)));
            Set Global Variable(PortalDest, Array(Vector(0.286, 94.292, 140.396), Vector(0.584, -0.709, -54.469), Vector(0.245, 270.292, 301.428), Vector(0.773, -0.708, -54.361), Vector(0.245, 270.292, 301.428), Vector(0.286, 94.292, 140.396)));
        Else If(Compare(Current Map, ==, Map(Nepal)));
            "\\"vil > shrine\\",\\"vil > sanc\\", \\"shrine > vil\\",\\"shrine > sanc\\",#\\"sanc > vil\\",\\"sanc > shrine\\""
            Set Global Variable(PortalNames, String Split(Custom String("Shrine0Sanctum0Village0Sanctum0Village0Shrine"), First Of(Null)));
            Set Global Variable(PortalLoc, Array(Vector(-194.732, -92.86, -3.802), Vector(-194.585, -92.86, 4.187), Vector(-33.165, 14, 5.212), Vector(-33.058, 14, -5.55), Vector(84.75, 129.008, -3.624), Vector(84.534, 129, 4.032)));
            Set Global Variable(PortalDest, Array(Vector(-40.19, 13.292, -0.105), Vector(78.43, 128.292, 0.149), Vector(-190.54, -93.569, 0.122), Vector(78.43, 128.292, 0.149), Vector(-190.54, -93.569, 0.122), Vector(-40.19, 13.292, -0.105)));
        Else If(Compare(Current Map, ==, Map(Oasis)));
            "\\"uni > garden\\",\\"uni > city\\",\\"garden > uni\\",\\"garden > city\\",\\"city > garden\\",\\"city > uni\\""
            Set Global Variable(PortalNames, String Split(Custom String("Gardens0City Center0University0City Center0Gardens0University"), First Of(Null)));
            Set Global Variable(PortalLoc, Array(Vector(-211.137, 20, -5.084), Vector(-211.346, 20, 5.029), Vector(143.061, 8.377, -245.04), Vector(139.333, 8.377, -249.964), Vector(157.297, 12.522, 255.759), Vector(151.452, 12.522, 261.099)));
            Set Global Variable(PortalDest, Array(Vector(134.366, 7.829, -240.53), Vector(158.27, 11.814, 262.272), Vector(-206.269, 19.292, 0.103), Vector(158.283, 11.814, 262.283), Vector(134.318, 7.829, -240.667), Vector(-206.269, 19.292, 0.103)));
        Else If(Compare(Current Map, ==, Map(Antarktische Halbinsel)));
            Set Global Variable(PortalNames, String Split(Custom String("labs0icebreaker0Sublevel0icebreaker0labs0Sublevel"), First Of(Null)));
            Set Global Variable(PortalLoc, Array(Vector(280.66, -12.15, -223.65), Vector(273.27, 42.74, 198.15), Vector(266.58, 42.74, 198.17), Vector(-58.29, -154, 63.03), Vector(-58.36, -154, 56.47), Vector(287.08, -12.15, -223.59)));
            Set Global Variable(PortalDest, Array(Vector(270, 42.7, 190.44), Vector(284.07, -12.75, -216.15), Vector(-53.51, -154.5, 60.08), Vector(284.07, -12.75, -216.15), Vector(270, 42.7, 190.44), Vector(-53.51, -154.5, 60.08)));
        Else If(Compare(Current Map, ==, Map(Samoa)));
            Set Global Variable(PortalNames, String Split(Custom String("beach0volcano0downtown0volcano0beach0downtown"), First Of(Null)));
            Set Global Variable(PortalLoc, Array(Vector(231.98, 7.23, -262.84), Vector(236.78, 7.23, -262.75), Vector(-327.59, 3.6, -108.69), Vector(-332.71, 3.6, -108.59), Vector(25.4, 341, 354.38), Vector(30, 341, 354.34)));
            Set Global Variable(PortalDest, Array(Vector(-329.86, 3.05, -103.4), Vector(27.59, 339.76, 348.77), Vector(234.07, 6.12, -266.88), Vector(27.59, 339.76, 348.77), Vector(-329.86, 3.05, -103.4), Vector(234.07, 6.12, -266.88)));
    }
}

regel ("Addon | Little destructo - fence breaker") {
    event {
        Ongoing - Global;
    }
    aktionen {
        "Made by FishoFire version 1.0\\nwait to overwrite any from copy pastas"
        Wait(0.032, Ignore Condition);
        "first entry will act as index, rest is the points themselves"
        Set Global Variable(MapVectorArray, Array(Null));
        "tdm/dm = first spawn points, the maps are not big so it just covers entire map. all teams defaults to team 1 spawn\\npush: payload and cp 0 are set but rest isnt. normal payload maps have more then 1 point.\\nrest of maps have up to 3 points"
        Modify Global Variable(MapVectorArray, Append To Array, If-Then-Else(Compare(Current Game Mode, ==, Game Mode(Flaggeneroberung)), Array(Flag Position(Team 1), Flag Position(Team 2)), If-Then-Else(Array Contains(Array(Game Mode(Team-Deathmatch), Game Mode(Deathmatch)), Current Game Mode), First Of(Spawn Points(All Teams)), If-Then-Else(And(First Of(Payload Position), Not(Add(Objective Position(True), Objective Position(2)))), Payload Position, Array(Objective Position(False), Objective Position(True), Objective Position(2))))));
        "explode in a grid around the selected points"
        While(Compare(Count Of(Global.MapVectorArray), >, 1));
            Set Global Variable At Index(MapVectorArray, False, Null);
            While(Compare(First Of(Global.MapVectorArray), <, 256));
                Create Projectile(Orb Projectile, Null, Add(Add(Subtract(Value In Array(Global.MapVectorArray, True), Vector(240, False, 240)), Multiply(Modulo(First Of(Global.MapVectorArray), 16), Multiply(30, Left))), Multiply(Round To Integer(Divide(First Of(Global.MapVectorArray), 16), Down), Multiply(30, Forward))), Down, To World, Heal, Team 1, 0, 0, 30, Good Explosion, Explosion Sound, 1, 1, 0, 0, 0, 0);
                Modify Global Variable At Index(MapVectorArray, False, Add, True);
                "use modulo to only wait every x orbs keep the 0 change the other number"
                If(Not(Modulo(First Of(Global.MapVectorArray), 3)));
                    Wait(False, Ignore Condition);
                End;
            End;
            Modify Global Variable(MapVectorArray, Remove From Array By Index, True);
        End;
        "handle exceptions (looking at you new queen street)"
        Set Global Variable(MapVectorArray, Array(Vector(8.276, 4.113, 15.261), Vector(-8.319, 2.624, 14.245), Vector(0.006, 4.821, 18.513)));
        While(Count Of(Global.MapVectorArray));
            "same as other projectile before"
            Create Projectile(Orb Projectile, Null, First Of(Global.MapVectorArray), Down, To World, Heal, Team 1, 0, 0, 30, Good Explosion, Explosion Sound, 1, 1, 0, 0, 0, 0);
            Modify Global Variable(MapVectorArray, Remove From Array By Index, False);
            Wait(False, Ignore Condition);
        End;
        Set Global Variable(MapVectorArray, Null);
    }
}

regel ("Addon | Cache jump & crouch inputs for spectators") {
    event {
        Player Joined Match;
        All;
        All;
    }
    aktionen {
        Wait(False, Ignore Condition);
        Set Player Variable(Event Player, cache_inputs, Vector(Is Button Held(Event Player, Button(Jump)), Is Button Held(Event Player, Button(Crouch)), False));
        Loop;
    }
}

regel ("Addon | SUB Basic Map Validator") {
    event {
        Subroutine;
        AddonCheckMap;
    }
    aktionen {
        Abort If(Compare(Count Of(Global.A), <=, 1));
        Create Dummy Bot(Hero(Ana), If-Then-Else(Compare(Number Of Slots(Team 1), <, Number Of Slots(Team 2)), Team 1, Team 2), -1, First Of(Global.A), Null);
        Set Global Variable(MsDestructo, Last Created Entity);
        Disable Movement Collision With Environment(Global.MsDestructo, False);
        Set Status(Global.MsDestructo, Null, Phased Out, 999999999999);
        Set Invisible(Global.MsDestructo, All);
        Start Scaling Player(Global.MsDestructo, 3.111111111111110, False);
        Set Gravity(Global.MsDestructo, 999999999999);
        "Not infinity incase dummy does not spawn"
        Wait Until(Has Spawned(Global.MsDestructo), 16);
        For Player Variable(Global.MsDestructo, checkpoint_current, 1, Count Of(Global.A), True);
            If(And(First Of(Nearest Walkable Position(Value In Array(Global.A, (Global.MsDestructo).checkpoint_current))), Compare(Distance Between(Value In Array(Global.A, (Global.MsDestructo).checkpoint_current), Nearest Walkable Position(Value In Array(Global.A, (Global.MsDestructo).checkpoint_current))), >, 1.4)));
                Start Forcing Player Position(Global.MsDestructo, Ray Cast Hit Position(Add(Value In Array(Global.A, (Global.MsDestructo).checkpoint_current), Multiply(1.4, Up)), Add(Value In Array(Global.A, (Global.MsDestructo).checkpoint_current), Multiply(-1.4, Up)), Empty Array, Empty Array, False), True);
                Wait(0.112, Ignore Condition);
                Stop Forcing Player Position(Global.MsDestructo);
                Wait Until(Is On Ground(Global.MsDestructo), True);
                Skip If(And(Is On Ground(Global.MsDestructo), Compare(Distance Between(Global.MsDestructo, Value In Array(Global.A, (Global.MsDestructo).checkpoint_current)), <=, 1.4)), 11);
                For Player Variable(Global.MsDestructo, checkpoint_practice, 1.4, 1.2, -0.2);
                    Start Forcing Player Position(Global.MsDestructo, Add(Value In Array(Global.A, (Global.MsDestructo).checkpoint_current), Multiply(Up, (Global.MsDestructo).checkpoint_practice)), True);
                    Wait(0.112, Ignore Condition);
                    Stop Forcing Player Position(Global.MsDestructo);
                    Wait Until(Is On Ground(Global.MsDestructo), True);
                    Skip If(And(Is On Ground(Global.MsDestructo), Compare(Distance Between(Global.MsDestructo, Value In Array(Global.A, (Global.MsDestructo).checkpoint_current)), <=, 1.4)), 5);
                End;
                Enable Inspector Recording;
                Log to Inspector(Custom String("Fail {0}", (Global.MsDestructo).checkpoint_current));
                Disable Inspector Recording;
            End;
            //lbl_MapChecker_nextCp:
        End;
        Set Player Variable(Global.MsDestructo, editor_saveCache, Global.EditorOn);
        Set Global Variable(EditorOn, Null);
        Enable Inspector Recording;
        Log to Inspector(Custom String("■ Map Check Complete ■"));
        Disable Inspector Recording;
        Set Global Variable(EditorOn, (Global.MsDestructo).editor_saveCache);
        Destroy Dummy Bot(Team Of(Global.MsDestructo), Slot Of(Global.MsDestructo));
        Set Global Variable(MsDestructo, Null);
    }
}

regel ("Addon | SUB 3rd Person Camera") {
    event {
        Subroutine;
        Addon3rdPerson;
    }
    aktionen {
        If((Event Player).addon_toggle3rdPov);
            Start Camera(Event Player, Update Every Frame(Add(Ray Cast Hit Position(Add(Multiply(0.5, Up), Eye Position(Event Player)), Add(Add(Multiply(0.5, Up), Eye Position(Event Player)), Multiply(-3.5, Facing Direction Of(Event Player))), Empty Array, Empty Array, False), Multiply(0.5, Facing Direction Of(Event Player)))), Update Every Frame(Add(Multiply(0.5, Up), Eye Position(Event Player))), False);
        Else;
            Stop Camera(Event Player);
        End;
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("Ø Map Data - 数据录入 <---- INSERT HERE / 在这输入") {
    event {
        Ongoing - Global;
    }
}

regel ("☞ Credits and Colors here - 作者代码HUD颜色 <---- INSERT HERE / 在这输入") {
    event {
        Ongoing - Global;
    }
    aktionen {
        Wait(False, Ignore Condition);
        "Filling this in adds it to the inspector pasta after next restart.\\nYou can fill in again to overwrite.\\n修改的内容 在重新开始 比赛后生效\\n您可以反复 修改字符串 中的内容"
        Set Global Variable(Name, Custom String("name here - 作者"));
        Set Global Variable(Code, Custom String("code here - 代码"));
        "+++++  +++++  +++++  +++++  +++++  +++++\\ncolor customization below / 自定义 颜色(实体、HUD)\\n+++++  +++++  +++++  +++++  +++++  +++++\\n\\ncredit hud name   -   作者HUD"
        Set Global Variable At Index(ColorConfig, False, Color(Violet));
        "credit hud code   -   代码HUD"
        Set Global Variable At Index(ColorConfig, True, Color(Sky Blue));
        "dsc.gg/genjiparkour"
        Set Global Variable At Index(ColorConfig, 18, Color(Aqua));
        "server time hud   -   房间倒计时"
        Set Global Variable At Index(ColorConfig, 2, Color(Red));
        "time  hud   -   单关用时HUD"
        Set Global Variable At Index(ColorConfig, 3, Color(Weiß));
        "level hud   -   关卡HUD"
        Set Global Variable At Index(ColorConfig, 4, Color(Weiß));
        "command hud   -   指令HUD"
        Set Global Variable At Index(ColorConfig, 5, Color(Weiß));
        "command hud highlight   -   指令HUD高亮"
        Set Global Variable At Index(ColorConfig, 6, Color(Green));
        "bhop/climb available   -   小跳/爬墙未用HUD"
        Set Global Variable At Index(ColorConfig, 7, Color(Green));
        "bhop/climb used (cant be same as available)   -   小跳/爬墙已用HUD"
        Set Global Variable At Index(ColorConfig, 8, Color(Red));
        "current checkpoint ring   -   当前检查点光圈"
        Set Global Variable At Index(ColorConfig, 9, Color(Sky Blue));
        "next checkpoint ring   -   下一关检查点光圈"
        Set Global Variable At Index(ColorConfig, 10, Color(Lime Green));
        "next checkpoint light shaft   -   下一关检查点光柱"
        Set Global Variable At Index(ColorConfig, 11, Color(Weiß));
        "next checkpoint icon   -   下一关检查点图标"
        Set Global Variable At Index(ColorConfig, 12, Color(Sky Blue));
        "\\"come here\\" text   -   到这里来\\" 文本"
        Set Global Variable At Index(ColorConfig, 13, Color(Weiß));
        "kill orbs   -   击杀球"
        Set Global Variable At Index(ColorConfig, 14, Color(Blue));
        "normal orbs   -   弹球"
        Set Global Variable At Index(ColorConfig, 15, Color(Green));
        "lock orbs (overwritten if its same as normal)\\n收集球 (与普通弹 球相同时将 自动覆写)"
        Set Global Variable At Index(ColorConfig, 16, Color(Orange));
        "portals   -   自定义 传送门"
        Set Global Variable At Index(ColorConfig, 17, Color(Weiß));
    }
}

regel ("Instructions for Depricated Rules (ban / portal / dash /ult) - 旧版编辑器中已弃用规则指引 (单关封禁 / 传送门 / 给刀给S)") {
    event {
        Ongoing - Global;
    }
    aktionen {
        "The following rules should now be handled with the ingame editor\\n- Ban per checkpoint\\n- Dash/Ult per checkpoint\\n- Custom portals"
        Abort;
        "When updating old maps, these things should be added to your map data.\\nThis is done with the instructions below"
        Abort;
        "step 1) Open the old rule\\nstep 2) Select the variables and press copy\\n(do not select waits or workshop toggles, only select variables)\\nstep 3) Go to map data rule and paste this the variables"
        Abort;
        "以下规则现在 要用游戏内置 编辑器编辑\\n- 单关 封禁(卡小、蹭留等)\\n- 检查点给 刀给S\\n- 自定义 传送门"
        Abort;
        "当更新旧 图数据 时，以上 这些东西 应该放 到地图 数据里\\n以下是一 些更新旧 图数据 指引:"
        Abort;
        "步骤 1) 找到旧图 数据的 规则\\n步骤 2) 选中旧图 数据的 全局变 量并复制\\n(不要复制含 等待 地图工坊设置 的指令, 只要 全局变量 的数据)\\n步骤 3) 将全局变 量数据粘 贴到新版 编辑器的 地图数 据规则"
        Abort;
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Addons Settings & Data - 附加组件 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

regel ("Addon | Comp Mode instruction message - 竞赛模式指引消息 <---- INSERT HERE / 在这输入") {
    event {
        Ongoing - Global;
    }
    aktionen {
        Wait(0.4, Ignore Condition);
        "Instructions that show when you start comp mode.\\nDue to the hud text limit, you there is 4 huds available.\\nIf you dont need a field just empty the textfield."
        Abort;
        "竞赛模式 指引消息\\n指引消息将 会在竞赛模 式开始时 显示\\n由于 hud 文本限制，你有 4 个hud可用\\n如果你不需 要一个字段 只是空文 本字段"
        Set Global Variable(instructiontext, String Split(Custom String("Change in Comp Mode instruction message hud 10Change in Comp Mode instruction message hud 20Change in Comp Mode instruction m{0}", Custom String("essage hud 30Change in Comp Mode instruction message hud 4")), First Of(Null)));
    }
}

deaktiviert regel ("Addon | Custom difficulty hud  - 自定义难度hud <---- INSERT HERE / 在这输入") {
    event {
        Ongoing - Global;
    }
    aktionen {
        "1) workshop settings > difficulty > set to \\"dont display\\"\\n2) enable this rule\\n3) type your difficulty in the hud below"
        Wait(2.5, Ignore Condition);
        "1) 地图工坊设 置难度改为 “不显示”\\n2) 勾选此规则 点击上方的 开启/关闭 开启此规则\\n3) 修改下面的 创建hud文本 中的“enter custom difficulty here”"
        Create HUD Text(First Of(True), If-Then-Else(Last Of(Global.Difficultyhud), If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("游戏测试"), Custom String("Playtest")), Empty Array), Custom String("enter custom difficulty here"), Null, Top, -173, Color(Blue), Color(Green), Null, Visible To and String, Default Visibility);
    }
}

deaktiviert regel ("Addon | Title Data - 标题数据 <---- EDIT ME / 在此处编辑") {
    event {
        Ongoing - Global;
    }
    aktionen {
        "enable this rule and fill in the title data below.\\n启用此规则 并填写下面 的标题数据"
        Wait(0.768, Ignore Condition);
        "checkpoint number\\n每关数量"
        Set Global Variable At Index(TitleData, False, Array(Null, 10, 20, 30, 40, 50));
        "title\\n标题文本"
        Set Global Variable At Index(TitleData, True, String Split(Custom String("Bunny0Jumper0Ninja0Pro0Expert0Master"), First Of(Null)));
        "color\\n颜色"
        Set Global Variable At Index(TitleData, 2, Array(Color(Lime Green), Color(Weiß), Color(Yellow), Color(Orange), Color(Purple), Color(Red)));
    }
}

deaktiviert regel ("Addon | Friend Title - 朋友称号 <---- DISPLAY MESSAGE HERE (ON PLAYER)") {
    event {
        Player Joined Match;
        All;
        All;
    }
    aktionen {
        "\\"your nickname\\" your friends ingame name\\n\\"display title\\" fill in the custom title\\n修改字符串 \\"your nickname <-------\\" 为好友名字 区分大小写\\n修改字符串 \\"display title\\" 为好友头顶 显示的称号"
        Wait Until(Has Spawned(Event Player), 999999999999);
        If(Compare(Custom String("your nickname <-------"), ==, String Split(First Of(Event Player), Empty Array)));
            Big Message(First Of(True), Custom String("Message to the whole room"));
            Create In-World Text(First Of(Not((Event Player).toggle_invisible)), Custom String("display title"), Event Player, 1.5, Clip Against Surfaces, Visible To Position and String, Color(Orange), Default Visibility);
        End;
        If(Compare(Custom String("your nickname <-------"), ==, String Split(First Of(Event Player), Empty Array)));
            Big Message(First Of(True), Custom String("Message to the whole room"));
            Create In-World Text(First Of(Not((Event Player).toggle_invisible)), Custom String("display title"), Event Player, 1.5, Clip Against Surfaces, Visible To Position and String, Color(Orange), Default Visibility);
        End;
        If(Compare(Custom String("your nickname <-------"), ==, String Split(First Of(Event Player), Empty Array)));
            Big Message(First Of(True), Custom String("Message to the whole room"));
            Create In-World Text(First Of(Not((Event Player).toggle_invisible)), Custom String("display title"), Event Player, 1.5, Clip Against Surfaces, Visible To Position and String, Color(Orange), Default Visibility);
    }
}

deaktiviert regel ("Addon | Display Author Time - 展示世界纪录 <---- EDIT ME / 在此处编辑") {
    event {
        Ongoing - Global;
    }
    aktionen {
        "type your entry in the textfield that says \\"name and time here\\"\\n在文本框 中输入“名称和时间”"
        Create HUD Text(First Of(True), Null, Custom String(" \\n{0} author time {0}", Icon String(Fire)), Custom String("name and time here"), Right, -142, Null, Color(Rose), Color(Rose), Visible To, Default Visibility);
    }
}

deaktiviert regel ("Addon | HUD text for certain Checkpoints - 特定关卡显示的HUD文本 <---- EDIT ME / 在此处编辑") {
    event {
        Ongoing - Global;
    }
    aktionen {
        "the example fill shows a text for cp 1 and cp 3\\n示例已填写 关卡1和3 的hud文本"
        Wait(0.768, Ignore Condition);
        "in CpHudText fill in text\\n修改字符串 “CpHudText” 为顶部显示 的hud文本"
        Set Global Variable(CpHudText, String Split(Custom String("text cp 10text cp 3"), First Of(Null)));
        "in CpHudCp fill in the at wich to display\\n修改数组 “CpHudCp” 为hud文本 显示的关卡"
        Set Global Variable(CpHudCp, Array(1, 3));
    }
}

deaktiviert regel ("Addon | Inworld text for certain Checkpoints - 特定关卡显示的地图文本 <---- EDIT ME / 在此处编辑") {
    event {
        Ongoing - Global;
    }
    aktionen {
        "the example fill shows a text for cp 1 and cp 3\\n示例已填写 关卡1和3 的地图文本"
        Wait(0.768, Ignore Condition);
        "in CpIwtText fill in text\\n修改字符串 “CpIwtText” 为关卡显示 的地图文本"
        Set Global Variable(CpIwtText, String Split(Custom String("text cp 10text cp 3"), First Of(Null)));
        "in CpIwtCp fill in cp at wich to display\\n修改数组 “CpIwtCp” 为显示地图 文本的关卡"
        Set Global Variable(CpIwtCp, Array(1, 3));
        "in CpIwtPos fill in the vector\\n修改数组 “CpIwtPos” 为地图文本 的矢量位置"
        Set Global Variable(CpIwtPos, Array(Vector(True, True, True), Vector(True, True, True)));
        "color applies to all\\n选择应用到 所有地图文 本的颜色"
        Set Global Variable(CpIwtColor, Color(Lime Green));
    }
}

deaktiviert regel ("Addon | Hint text for certain Checkpoints - 特定关卡的提示文本 <---- EDIT ME / 在此处编辑") {
    event {
        Ongoing - Global;
    }
    aktionen {
        "the example fill shows a text for cp 1 and cp 3\\n示例已填写 关卡1和3 的提示文本"
        Wait(0.768, Ignore Condition);
        "in HintText fill in text\\n修改字符串 “HintText” 为关卡显示 的提示文本"
        Set Global Variable(HintText, String Split(Custom String("text cp 10text cp 3"), First Of(Null)));
        "in HintCp fill in the at wich to display\\n修改数组 “HintCp” 为提示文本 显示的关卡"
        Set Global Variable(HintCp, Array(1, 3));
    }
}

deaktiviert regel ("Addon | 3rd Person Camera Mode - 第三人称") {
    event {
        Player Joined Match;
        All;
        All;
    }
    aktionen {
        "Default 1st person: False\\nDefault 3rd person: True"
        Set Player Variable(Event Player, addon_toggle3rdPov, True);
        Call Subroutine(Addon3rdPerson);
    }
}

regel ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Addons Skills - 附加组件技能 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    event {
        Ongoing - Global;
    }
}

deaktiviert regel ("Addon | Stall Enhancer - 增强系統跳的判定") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        Has Spawned(Event Player) == True;
        Vertical Speed Of(Event Player) >= -0.2;
        Vertical Speed Of(Event Player) <= 0.05;
        Horizontal Speed Of(Event Player) <= 1.3;
        Is In Air(Event Player) == True;
        Global.EditorOn != False;
        (Event Player).editor_fly == False;
    }
    aktionen {
        Wait(0.25, Abort When False);
        Start Forcing Player Position(Event Player, Position Of(Event Player), False);
        Wait Until(Not(Is Moving(Event Player)), 1);
        Stop Forcing Player Position(Event Player);
        Set Move Speed(Event Player, False);
        Set Gravity(Event Player, False);
        "double jump catch"
        Wait Until(Or(Or(Or(Or(Is Button Held(Event Player, Button(Reload)), (Event Player).editor_fly), Is Dead(Event Player)), Is Using Ability 1(Event Player)), Compare(Speed Of(Event Player), >, 3)), 3);
        "wait(3)"
        Set Gravity(Event Player, 100);
        Set Move Speed(Event Player, 100);
        If(And(Is Alive(Event Player), Not(Or((Event Player).editor_fly, Is Button Held(Event Player, Button(Reload))))));
            Apply Impulse(Event Player, Up, 10, To World, Cancel Contrary Motion XYZ);
            Loop If Condition Is True;
    }
}

deaktiviert regel ("Addon | Fake Ledge Dash - 超级跳") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        "Version 2"
        Is Using Ability 1(Event Player) == True;
        Speed Of(Event Player) < 45;
        Z Component Of(Throttle Of(Event Player)) > Null;
        Absolute Value(Subtract(Vertical Speed Of(Event Player), 7)) < 0.8;
    }
    aktionen {
        "Dash into a wall/edge\\nRelease wall/edge before dash ends"
        Set Player Variable(Event Player, addon_ledgeDash, Facing Direction Of(Event Player));
        "25 * 0.016"
        Wait Until(Not(Is Using Ability 1(Event Player)), True);
        If(Is In Air(Event Player));
            Apply Impulse(Event Player, (Event Player).addon_ledgeDash, 50, To World, Cancel Contrary Motion XYZ);
    }
}

deaktiviert regel ("Addon | Group up - Map Data") {
    event {
        Ongoing - Global;
    }
    aktionen {
        "replace 777 with checkpoint number\\nreplace vector 0,0,0 with orb position"
        Create In-World Text(Filtered Array(All Players(All Teams), Compare((Current Array Element).checkpoint_current, ==, 777)), Custom String("{0} {1} {0}", Ability Icon String(Hero(Genji), Button(Ultimate)), If-Then-Else(Compare(String("Uff"), ==, Custom String("噢")), Custom String("待在这里"), Custom String("group up"))), Vector(True, True, True), 1.5, Do Not Clip, Visible To and String, Color(Orange), Default Visibility);
        "replace 777 with checkpoint number\\nreplace vector 0,0,0 with orb position\\n3.5 is the radius"
        Create Effect(Filtered Array(All Players(All Teams), Compare((Current Array Element).checkpoint_current, ==, 777)), Sphere, Color(Orange), Vector(True, True, True), 3.5, Visible To);
    }
}

deaktiviert regel ("Addon | Group Up") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        "replace 777 with checkpoint number"
        (Event Player).checkpoint_current == 777;
        Is Alive(Event Player) == True;
        Is On Ground(Event Player) == False;
        (Event Player).toggle_invincible == False;
        "replace vector 0,0,0 with orb position\\n3.5 is the radius"
        Distance Between(Event Player, Vector(True, True, True)) < 3.5;
    }
    aktionen {
        Small Message(Event Player, Custom String("   stay in the bubble"));
        Wait(True, Abort When False);
        Small Message(Event Player, Custom String("   9"));
        Wait(True, Abort When False);
        Small Message(Event Player, Custom String("   8"));
        Wait(True, Abort When False);
        Small Message(Event Player, Custom String("   7"));
        Wait(True, Abort When False);
        Small Message(Event Player, Custom String("   6"));
        Wait(True, Abort When False);
        Small Message(Event Player, Custom String("   5"));
        Wait(True, Abort When False);
        Small Message(Event Player, Custom String("   4"));
        Wait(True, Abort When False);
        Small Message(Event Player, Custom String("   3"));
        Wait(True, Abort When False);
        Small Message(Event Player, Custom String("   2"));
        Wait(True, Abort When False);
        Small Message(Event Player, Custom String("   1"));
        Wait(True, Abort When False);
        Start Forcing Player Position(Event Player, Add(Value In Array(Global.A, Add((Event Player).checkpoint_current, True)), Multiply(0.1, Up)), False);
        Set Status(Event Player, Null, Rooted, 0.3);
        Wait(0.112, Ignore Condition);
        Stop Forcing Player Position(Event Player);
    }
}

deaktiviert regel ("Addon | Custom checkpoint loading or resetting") {
    event {
        Subroutine;
        AddonCustomLoadAndReset;
    }
    aktionen {
        "This subroutine activates on failing, arriving, resetting, skipping etc\\nexample: reset gravity and movespeed after being changed by custom orbs"
        Set Gravity(Event Player, 100);
        Set Move Speed(Event Player, 100);
    }
}

deaktiviert regel ("Addon | Custom Orb Script") {
    event {
        Ongoing - Each Player;
        All;
        All;
    }
    bedingungen {
        "Do not edit this condition !!!!!!!!!!!!!!!!!"
        (Event Player).cache_bounceTouched >= Null;
    }
    aktionen {
        "Note that the ID can change if you place or delete orbs infront of that orb.\\nAdd the desired ID numbers for the orb in the array\\nadd the script after it\\nyou can use the activateed sub above this rule to reset the effects"
        If(Array Contains(Array(1, 2), (Event Player).cache_bounceTouched));
            "example gravity (should be reset to 100 in AddonCustomLoadAndReset)"
            Set Gravity(Event Player, 25);
            Small Message(Event Player, Custom String(" You Feel Light"));
            Wait(2, Ignore Condition);
            Set Gravity(Event Player, 100);
        End;
        If(Array Contains(Array(3, 4), (Event Player).cache_bounceTouched));
            "example canceling primary makes double jump recover"
            Cancel Primary Action(Event Player);
            Set Player Variable(Event Player, skill_usedDouble, Null);
            Small Message(Event Player, Custom String(" Double Jump Recovered"));
        End;
        If(Array Contains(Array(5, 6), (Event Player).cache_bounceTouched));
            "example move speed"
            Set Move Speed(Event Player, 250);
            Small Message(Event Player, Custom String(" Zooom"));
            Wait(2, Ignore Condition);
            Set Move Speed(Event Player, 100);
    }
}

deaktiviert regel ("Addon | Fake Triple Jump - 假三段跳") {
    event {
        Ongoing - Each Player;
        All;
        Genji;
    }
    bedingungen {
        "@Condition BanTriple == false"
        Is On Ground(Event Player) == False;
        "Double cannot be used already"
        (Event Player).skill_usedDouble == False;
        "Don't activate on reset"
        Is Button Held(Event Player, Button(Reload)) == False;
    }
    aktionen {
        "Enable checking double jump"
        Set Player Variable(Event Player, addon_enableDoubleChecks, True);
        Wait(False, Ignore Condition);
        Loop If Condition Is True;
        Abort If(Or((Event Player).skill_usedDouble, Is Button Held(Event Player, Button(Reload))));
        "Input window to Triple"
        Wait Until(And(Is Jumping(Event Player), Is Button Held(Event Player, Button(Jump))), 0.048);
        If(And(Is Button Held(Event Player, Button(Jump)), Is Jumping(Event Player)));
            Apply Impulse(Event Player, Up, 9, To World, Cancel Contrary Motion XYZ);
        Else;
            Loop If Condition Is True;
    }
}


`;
