// framework-template_zh-CN.js (auto)
export const frameworkTemplate = `设置
{
	主程序
	{
		模式名称: "Genji Parkour - 源氏跑酷 - v1.10.4A"
		描述: "\\n\\n\\n◀ The Official Genji Parkour Editor ▶\\nCode: 54CRY\\nAdapted by: LulledLion, FishoFire, Nebula\\nv1.10.4A"
	}
	大厅
	{
		队列中的玩家可以加入: 是
		比赛语音聊天: 禁用
		观战者人数上限: 3
		玩家上限 队伍1: 11
		玩家上限 队伍2: 0
		返回大厅: 从不
		比赛结束后转换队伍: 否
	}
	模式
	{
		综合
		{
			允许切换英雄: 关闭
			敌方生命条: 关闭
			游戏模式开始: 即时
			英雄限制: 关闭
			阵亡镜头: 关闭
			消灭提示: 关闭
			复生时间: 0%
			急救包刷新: 禁用
			随机英雄复生: 开启
		}
		突击模式
		{
			启用地图
			{
			}
			启用威能: 关闭
		}
		团队死斗
		{
			启用地图
			{
			}
			启用威能: 关闭
			主动复生: 关闭
		}
		禁用 赏金猎手
		{
			启用威能: 关闭
		}
		禁用 勇夺锦旗
		{
			启用威能: 关闭
		}
		禁用 决斗先锋
		{
			启用威能: 关闭
		}
		禁用 训练靶场
		{
			启用威能: 关闭
		}
	}
	英雄
	{
		综合
		{
			源氏
			{
				闪: 关闭
				无需装弹: 开启
				影冷却时间: 1%
				终极技能持续时间: 25%
				终极技能自动充能速度 斩: 0%
				终极技能充能速度（斩）: 10%
			}
			启用英雄
			{
				源氏
			}
		}
	}
	扩展
	{
		生成更多机器人
		播放更多效果
	}
}
变量 {
    全局:
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
    玩家:
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
子程序 {
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
规则 ("Disable inspector") {
    事件 {
        持续 - 全局;
    }
    动作 {
        禁用查看器录制;
    }
}

规则 ("OverPy | Global Init") {
    事件 {
        持续 - 全局;
    }
    动作 {
        设置全局变量(__overpyTranslationHelper__, 字符串分割(自定义字符串("0White0흰색0白色"), 首个(空)));
    }
}

//Optimize for size enabled
规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Parkour v1.10.4A ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("Parkour | Setup & Variables") {
    事件 {
        持续 - 全局;
    }
    动作 {
        "◀ The Official Genji Parkour Editor ▶\\nDiscord: dsc.gg/genjiparkour\\nCode: 54CRY\\nAdapted by: LulledLion, FishoFire, Nebula"
        关闭游戏预设完成条件;
        关闭游戏预设计分模式;
        关闭游戏预设音乐模式;
        关闭游戏预设通告模式;
        开始强制重生室(所有队伍, 假);
        开始强制重生室(所有队伍, 1);
        开始强制重生室(所有队伍, 2);
        "wait for map data rule"
        等待(0.24, 无视条件);
        "Turn Editor On"
        设置全局变量(EditorOn, 地图工坊设置开关(自定义字符串("Map Settings ■ 地图设置 ■ 맵 설정"), 自定义字符串("Editor Mode ■ 作图模式 ■ 수정 모드"), 假, 0));
        If(地图工坊设置开关(自定义字符串("Map Settings ■ 地图设置 ■ 맵 설정"), 自定义字符串("Basic Map Validator ■ 验证地图 ■ 맵 가능 여부 확인기"), 真, 3));
            开始规则(AddonCheckMap, 无动作);
        End;
        设置全局变量(PortalOn, 地图工坊设置开关(自定义字符串("Map Settings ■ 地图设置 ■ 맵 설정"), 自定义字符串("Portals 󠀨Control Maps󠀩 ■ 启用传送门 󠀨占点地图󠀩 ■ 순간이동 활성화 󠀨쟁탈 맵󠀩"), 真, 4));
        设置全局变量(CompMode, 与(非(全局.EditorOn), 地图工坊设置开关(自定义字符串("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), 自定义字符串("Tournament Mode ■ 开启竞赛模式 ■ 토너먼트 모드 활성화"), 假, 100)));
        If(全局.CompMode);
            "-! comp minutes !-\\n5-240"
            设置全局变量(CompTime, 地图工坊设置整数(自定义字符串("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), 自定义字符串("Time Limit 󠀨Global󠀩 ■ 时间限制 ■ 시간 제한 󠀨전체󠀩"), 120, 1, 240, 101));
            "-! comp attempt count !-"
            设置全局变量(CompAtmpNum, 地图工坊设置整数(自定义字符串("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), 自定义字符串("Attempt Count ■ 尝试次数 ■ 시도 수 확인"), 5, 0, 500, 102));
            "-! comp restartlimiter !-"
            设置全局变量(CompRestartLimit, 地图工坊设置开关(自定义字符串("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), 自定义字符串("Disable Restart During Run ■ 竞赛中禁用重新开始 ■ 시도 중 재시작 비활성화"), 假, 103));
        Else;
            设置全局变量(instructiontext, 空);
        End;
        设置全局变量(SaveName, 空数组);
        设置全局变量(SaveCp, 空数组);
        设置全局变量(SaveTimer, 空数组);
        设置全局变量(SaveEnt, 空数组);
        设置全局变量(SaveElapsed, 空数组);
        设置全局变量(Dao, If-Then-Else(数量(全局.Dao), 已过滤的数组(全局.Dao, 比较(加(当前数组元素, 假), >=, 空)), 空数组));
        设置全局变量(SHIFT, If-Then-Else(数量(全局.SHIFT), 已过滤的数组(全局.SHIFT, 比较(加(当前数组元素, 假), >=, 空)), 空数组));
        设置全局变量(pinballnumber, If-Then-Else(数量(全局.pinballnumber), 全局.pinballnumber, 空数组));
        设置全局变量(A, If-Then-Else(数量(全局.A), 全局.A, 空数组));
        设置全局变量(A, If-Then-Else(数量(全局.A), 全局.A, 空数组));
        设置全局变量(killballnumber, If-Then-Else(数量(全局.killballnumber), 全局.killballnumber, 空数组));
        设置全局变量(H, If-Then-Else(数量(全局.H), 全局.H, 空数组));
        设置全局变量(I, If-Then-Else(数量(全局.I), 全局.I, 空数组));
        设置全局变量(K, If-Then-Else(数量(全局.K), 全局.K, 空数组));
        设置全局变量(TQ, If-Then-Else(数量(全局.TQ), 全局.TQ, 空数组));
        设置全局变量(TQ2, If-Then-Else(数量(全局.TQ2), 全局.TQ2, 空数组));
        设置全局变量(EditMode, If-Then-Else(数量(全局.EditMode), 全局.EditMode, 空数组));
        设置全局变量(TQ5, If-Then-Else(数量(全局.TQ5), 全局.TQ5, 空数组));
        设置全局变量(TQ6, If-Then-Else(数量(全局.TQ6), 全局.TQ6, 空数组));
        设置全局变量(BounceToggleLock, If-Then-Else(数量(全局.BounceToggleLock), 全局.BounceToggleLock, 空数组));
        设置全局变量(CustomPortalStart, If-Then-Else(数量(全局.CustomPortalStart), 全局.CustomPortalStart, 空数组));
        设置全局变量(CustomPortalEndpoint, If-Then-Else(数量(全局.CustomPortalEndpoint), 全局.CustomPortalEndpoint, 空数组));
        设置全局变量(CustomPortalCP, If-Then-Else(数量(全局.CustomPortalCP), 全局.CustomPortalCP, 空数组));
        设置全局变量(LeaderBoardFull, 空数组);
        设置全局变量(TitleData, 空);
        设置全局变量(HintCp, 空数组);
        设置全局变量(HintText, 空数组);
        "clean out -1's after the ban has loaded"
        设置全局变量(BanBhop, If-Then-Else(数量(全局.BanBhop), 已过滤的数组(全局.BanBhop, 比较(加(当前数组元素, 假), >=, 空)), 空数组));
        设置全局变量(BanClimb, If-Then-Else(数量(全局.BanClimb), 已过滤的数组(全局.BanClimb, 比较(加(当前数组元素, 假), >=, 空)), 空数组));
        设置全局变量(BanEmote, If-Then-Else(数量(全局.BanEmote), 已过滤的数组(全局.BanEmote, 比较(加(当前数组元素, 假), >=, 空)), 空数组));
        设置全局变量(BanDead, If-Then-Else(数量(全局.BanDead), 已过滤的数组(全局.BanDead, 比较(加(当前数组元素, 假), >=, 空)), 空数组));
        设置全局变量(BanCreate, If-Then-Else(数量(全局.BanCreate), 已过滤的数组(全局.BanCreate, 比较(加(当前数组元素, 假), >=, 空)), 空数组));
        设置全局变量(BanMulti, If-Then-Else(数量(全局.BanMulti), 已过滤的数组(全局.BanMulti, 比较(加(当前数组元素, 假), >=, 空)), 空数组));
        "BanTriple = [i for i in BanTriple if i + false >= 0] if len(BanTriple) else [] # legacy code, now auto sets it to null to save space"
        设置全局变量(BanStand, If-Then-Else(数量(全局.BanStand), 已过滤的数组(全局.BanStand, 比较(加(当前数组元素, 假), >=, 空)), 空数组));
        设置全局变量(BanSaveDouble, If-Then-Else(数量(全局.BanSaveDouble), 全局.BanSaveDouble, 空数组));
        设置全局变量(BanDjump, If-Then-Else(数量(全局.BanDjump), 全局.BanDjump, 空数组));
        "fix team because of naming"
        If(比较(数组中的值(全局.ColorConfig, 16), ==, 颜色(队伍1)));
            在索引处设置全局变量(ColorConfig, 16, 颜色(蓝色));
        Else If(比较(数组中的值(全局.ColorConfig, 16), ==, 颜色(队伍2)));
            在索引处设置全局变量(ColorConfig, 16, 颜色(红色));
        End;
        "prevent same color lock orbs"
        If(比较(数组中的值(全局.ColorConfig, 15), ==, 数组中的值(全局.ColorConfig, 16)));
            在索引处设置全局变量(ColorConfig, 16, If-Then-Else(比较(数组中的值(全局.ColorConfig, 15), ==, 颜色(橙色)), 颜色(绿色), 颜色(橙色)));
        End;
        "prevent same color bhop/climb used/unused"
        If(比较(数组中的值(全局.ColorConfig, 7), ==, 数组中的值(全局.ColorConfig, 8)));
            在索引处设置全局变量(ColorConfig, 8, If-Then-Else(比较(数组中的值(全局.ColorConfig, 7), ==, 颜色(红色)), 颜色(橙色), 颜色(红色)));
    }
}

规则 ("Parkour | Match time") {
    事件 {
        持续 - 全局;
    }
    动作 {
        If(比较(当前游戏模式, !=, 游戏模式(突击模式)));
            等待(假, 无视条件);
            设置比赛时间(假);
            等待(假, 无视条件);
            设置比赛时间(假);
            等待(假, 无视条件);
        End;
        设置比赛时间(70);
        比赛时间暂停;
        等待(假, 无视条件);
        设置全局变量(TimeRemaining, 265);
        While(全局.TimeRemaining);
            等待(60, 无视条件);
            修改全局变量(TimeRemaining, 减, 真);
            If(全局.CompMode);
                修改全局变量(CompTime, 减, 真);
                If(非(全局.CompTime));
                    大字体信息(首个(真), If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("时间到了"), 自定义字符串("Time's Up")));
                    设置玩家变量(所有玩家(所有队伍), comp_done, 真);
                    停止追踪玩家变量(所有玩家(所有队伍), timer_normal);
                    设置受到伤害(所有玩家(所有队伍), 100);
                    击杀(所有玩家(所有队伍), 空);
                End;
            End;
        End;
        "\\"房间已达最大持续时间, 即将重启\\" checkCN \\"Maximum Lobby Time Reached, Restarting\\""
        大字体信息(首个(真), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒMaximum Lobby Time Reached, RestartingMaximum Lobby Time Reached, RestartingMaximum Lobby Time Reached, Restarting"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
        等待(5, 无视条件);
        "Prevent crash during POTG and closing lobby"
        设置玩家变量(所有玩家(所有队伍), lockState, 真);
        宣告玩家胜利(主机玩家);
        宣告队伍胜利(所在队伍(主机玩家));
    }
}

规则 ("Parkour | Player Initialize") {
    事件 {
        玩家加入比赛;
        双方;
        全部;
    }
    动作 {
        隐藏游戏模式HUD(事件玩家);
        取消与玩家的移动碰撞(事件玩家);
        设置受到伤害(事件玩家, 0);
        设置玩家变量(事件玩家, lockState, 真);
        根据条件中止(是否是机器人(事件玩家));
        对所有玩家启用死亡回放(事件玩家);
        启用死亡回放时目标的HUD(事件玩家);
        关闭游戏预设复生模式(事件玩家);
        预加载英雄(事件玩家, 英雄(源氏));
        设置玩家变量(事件玩家, editor_lock, 真);
        设置玩家变量(事件玩家, toggle_guide, 真);
        "eventPlayer.toggle_quickRestart = true"
        设置玩家变量(事件玩家, cache_bounceTouched, -1);
        "big waits first for about 1 second before loading, to make sure things like comp mode are fully loaded and configured, load fx in meanwhile"
        等待(真, 无视条件);
        创建效果(事件玩家, 环, 数组中的值(全局.ColorConfig, 9), 最后(数组中的值(全局.A, (事件玩家).checkpoint_current)), 真, 位置和半径);
        创建效果(If-Then-Else((事件玩家).checkpoint_notLast, 事件玩家, 空), 环, 数组中的值(全局.ColorConfig, 10), 数组中的值(全局.A, 加((事件玩家).checkpoint_current, 真)), 真, 可见，位置和半径);
        创建效果(If-Then-Else((事件玩家).checkpoint_notLast, 事件玩家, 空), 光柱, 数组中的值(全局.ColorConfig, 11), 数组中的值(全局.A, 加((事件玩家).checkpoint_current, 真)), 真, 可见，位置和半径);
        创建图标(If-Then-Else((事件玩家).checkpoint_notLast, 事件玩家, 空), 加(数组中的值(全局.A, 加((事件玩家).checkpoint_current, 真)), 上), 箭头：向下, 可见和位置, 数组中的值(全局.ColorConfig, 12), 真);
        等待直到 (已重生(事件玩家), 999999999999);
        设置玩家变量(事件玩家, editor_lock, 假);
        If(全局.CompMode);
            设置不可见(事件玩家, 全部);
            If(数组包含(全局.CompAtmpSaveNames, 字符串分割(首个(事件玩家), 空数组)));
                设置玩家变量(事件玩家, comp_countAttempts, 数组中的值(全局.CompAtmpSaveCount, 数组值的索引(全局.CompAtmpSaveNames, 字符串分割(首个(事件玩家), 空数组))));
            "instructions and settings for comp start"
            Else;
                设置玩家变量(事件玩家, comp_instructionHud, 真);
                修改全局变量(CompAtmpSaveNames, 添加至数组, 字符串分割(首个(事件玩家), 空数组));
                修改全局变量(CompAtmpSaveCount, 添加至数组, 1);
                设置玩家变量(事件玩家, comp_countAttempts, 1);
                设置移动速度(事件玩家, 假);
                设置启用技能 1(事件玩家, 假);
                设置启用终极技能(事件玩家, 假);
                等待直到 (非(按钮被按下(事件玩家, 按钮(互动))), 真);
                等待直到 (或(按钮被按下(事件玩家, 按钮(互动)), 比较(全局.CompTime, <, 1)), 999999999999);
                设置移动速度(事件玩家, 100);
                设置玩家变量(事件玩家, comp_instructionHud, 假);
            End;
            If(或(比较((事件玩家).comp_countAttempts, <, 空), 比较(全局.CompTime, <, 1)));
                设置玩家变量(事件玩家, comp_done, 真);
            End;
        End;
        等待(假, 无视条件);
        "initialization of the game"
        调用子程序(StartGame);
        设置玩家变量(事件玩家, lockState, 假);
    }
}

规则 ("Parkour | Player Leaves") {
    事件 {
        玩家离开比赛;
        双方;
        全部;
    }
    动作 {
        If(数组中的值(全局.SaveCp, 数组值的索引(全局.SaveEnt, 事件玩家)));
            If(与(比较(数组中的值(全局.SaveCp, 数组值的索引(全局.SaveEnt, 事件玩家)), <, 减(数量(全局.A), 真)), 数组中的值(全局.SaveElapsed, 数组值的索引(全局.SaveEnt, 事件玩家))));
                在索引处设置全局变量(SaveTimer, 数组值的索引(全局.SaveEnt, 事件玩家), 加(减(总计消耗时间, 数组中的值(全局.SaveElapsed, 数组值的索引(全局.SaveEnt, 事件玩家))), 数组中的值(全局.SaveTimer, 数组值的索引(全局.SaveEnt, 事件玩家))));
            End;
        "delete if player didnt do first cp"
        Else;
            调用子程序(DeleteSave);
    }
}

规则 ("Parkour | Ground: Traces, Arrive, & Reset") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        (事件玩家).lockState == 假;
        在地面上(事件玩家) == 真;
        存活(事件玩家) == 真;
    }
    动作 {
        If(非((事件玩家).checkpoint_notLast));
            If(与(正在移动(事件玩家), 非(或(或(或((事件玩家).toggle_practice, (事件玩家).toggle_invisible), 全局.EditorOn), 全局.CompMode))));
                "traces ----------------------------------------------------------------------------------------------------"
                设置玩家变量(事件玩家, cache_rainbow, 数组中的值(数组(颜色(红色), 颜色(橙色), 颜色(黄色), 颜色(灰绿色), 颜色(绿色), 颜色(青绿色), 颜色(蓝色), 颜色(亮紫色), 颜色(紫色), 颜色(玫红)), 余数(取整(乘(总计消耗时间, 2), 下), 10)));
                "eventPlayer.cache_rainbow =  rgb((cosDeg(getTotalTimeElapsed()/2 * 360 - 0) + 0.5) * 255, (cosDeg(getTotalTimeElapsed/2 * 360 - 120) + 0.5) * 255, (cosDeg(getTotalTimeElapsed/2 * 360 - 240) + 0.5) * 255)\\n1.6 - 0.2 in 0.2 steps"
                播放效果(首个(真), 环状爆炸, (事件玩家).cache_rainbow, 所选位置(事件玩家), 0.4);
                等待(0.048, 无视条件);
                播放效果(首个(真), 环状爆炸, (事件玩家).cache_rainbow, 所选位置(事件玩家), 0.6);
                等待(0.048, 无视条件);
                播放效果(首个(真), 环状爆炸, (事件玩家).cache_rainbow, 所选位置(事件玩家), 0.8);
                等待(0.048, 无视条件);
                播放效果(首个(真), 环状爆炸, (事件玩家).cache_rainbow, 所选位置(事件玩家), 1);
                等待(0.048, 无视条件);
                播放效果(首个(真), 环状爆炸, (事件玩家).cache_rainbow, 所选位置(事件玩家), 1.2);
                等待(0.048, 无视条件);
                播放效果(首个(真), 环状爆炸, (事件玩家).cache_rainbow, 所选位置(事件玩家), 1.4);
                等待(0.048, 无视条件);
            End;
        "or eventPlayer.lockState:"
        Else If(或(或((事件玩家).toggle_invincible, (事件玩家).toggle_spectate), 与(全局.CompMode, 非(全局.CompTime))));
        Else If(比较(相距距离(事件玩家, 数组中的值(全局.A, 加((事件玩家).checkpoint_current, 真))), <=, 1.4));
            "arrived ----------------------------------------------------------------------------------------------------"
            If(比较(数量((事件玩家).cache_collectedLocks), <, (事件玩家).cache_bounceMaxLocks));
                "\\"   ! 进点前需集齐所有收集球 !\\" checkCN \\"   ! collect ALL {} orbs to unlock !\\".format(ColorConfig[Customize.orb_lock])"
                小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   ! Collect All Lock Orbs To Complete !   ! Collect All Lock Orbs To Complete !   ! Collect All Lock Orbs To Complete !"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
                "kill player if not colleted the locks"
                调用子程序(CheckpointFailReset);
            Else If(与((事件玩家).ban_climb, (事件玩家).skill_usedClimb));
                "\\"   爬墙 ↑ 已禁用!\\" checkCN \\"   Climb ↑ is banned!\\")"
                小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   Climb ↑ Is Banned!   Climb ↑ Is Banned!   Climb ↑ Is Banned!"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
                调用子程序(CheckpointFailReset);
            Else If(与((事件玩家).ban_bhop, (事件玩家).skill_usedBhop));
                "\\"   ≥ 留小跳进点!\\" checkCN \\"   ≥ Must Have A Bhop To Complete!!\\""
                小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   ≥ Must Have A Bhop To Complete!   ≥ Must Have A Bhop To Complete!   ≥ Must Have A Bhop To Complete!"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
                调用子程序(CheckpointFailReset);
            Else If(与((事件玩家).ban_djump, (事件玩家).skill_usedDouble));
                "\\"   » 留二段跳!\\" checkCN \\"   » Must Have A Double Jump To Complete!\\""
                小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   » Must Have A Double Jump To Complete!   » Must Have A Double Jump To Complete!   » Must Have A Double Jump To Com{0}", 自定义字符串("plete!")), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
                调用子程序(CheckpointFailReset);
            Else;
                设置玩家变量(事件玩家, checkpoint_moved, 真);
                修改玩家变量(事件玩家, checkpoint_current, 加, 真);
                If(比较((事件玩家).timer_splitDisplay, >, -999999999999));
                    设置玩家变量(事件玩家, timer_splitDisplay, 减(If-Then-Else((事件玩家).toggle_practice, (事件玩家).timer_practice, (事件玩家).timer_normal), (事件玩家).timer_split));
                End;
                If((事件玩家).toggle_practice);
                    设置玩家变量(事件玩家, timer_split, (事件玩家).timer_practice);
                Else;
                    设置玩家变量(事件玩家, timer_split, (事件玩家).timer_normal);
                    调用子程序(DeleteSave);
                    "complete lvl"
                    If(与(比较((事件玩家).checkpoint_current, ==, 减(数量(全局.A), 真)), 非(全局.EditorOn)));
                        停止追踪玩家变量(事件玩家, timer_normal);
                        调用子程序(LeaderboardUpdate);
                        If(与(全局.CompMode, 全局.CompAtmpNum));
                            If(比较((事件玩家).comp_countAttempts, ==, 全局.CompAtmpNum));
                                在索引处设置全局变量(CompAtmpSaveCount, 数组值的索引(全局.CompAtmpSaveNames, 字符串分割(首个(事件玩家), 空数组)), -1);
                                设置玩家变量(事件玩家, comp_countAttempts, -1);
                                设置玩家变量(事件玩家, comp_done, 真);
                                设置玩家变量(事件玩家, toggle_leaderboard, 真);
                                "eventPlayer.disableRespawn()"
                                设置受到伤害(事件玩家, 100);
                                击杀(事件玩家, 空);
                                设置受到伤害(事件玩家, 0);
                            Else;
                                在索引处设置全局变量(CompAtmpSaveCount, 数组值的索引(全局.CompAtmpSaveNames, 字符串分割(首个(事件玩家), 空数组)), 加((事件玩家).comp_countAttempts, 真));
                            End;
                        End;
                        "\\"已通关! 用时\\" checkCN \\"Mission Complete! Time\\""
                        大字体信息(首个(真), 自定义字符串("{0} {1} {2} Sec", 事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒMission Complete! TimeMission Complete! TimeMission Complete! Time"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), (事件玩家).timer_normal));
                        等待(假, 无视条件);
                    "update save"
                    Else;
                        调用子程序(MakeSave);
                    End;
                    调用子程序(UpdateTitle);
                End;
                调用子程序(UpdateCache);
                "teleport cps"
                If(比较(数量(数组中的值(全局.A, (事件玩家).checkpoint_current)), >, 1));
                    调用子程序(CheckpointFailReset);
                Else;
                    调用子程序(AddonCustomLoadAndReset);
                End;
                等待(假, 无视条件);
                "msg disabled due to annoying new sound\\nbigMessage(eventPlayer,  \\"{1} {0}\\".format(eventPlayer.checkpoint_current, \\"抵达检查点\\" checkCN \\"Arrived at level\\"))"
                播放效果(事件玩家, 环状爆炸声音, 空, 事件玩家, 100);
                播放效果(If-Then-Else(或(全局.CompMode, (事件玩家).toggle_invisible), 事件玩家, 真), 环状爆炸, 颜色(天蓝色), 所选位置(事件玩家), 4);
            End;
        Else If(比较(相距距离(事件玩家, 最后(数组中的值(全局.A, (事件玩家).checkpoint_current))), >, 1.4));
            调用子程序(CheckpointFailReset);
        End;
        设置玩家变量(事件玩家, cache_collectedLocks, 空数组);
        等待(0.048, 无视条件);
        如条件为“真”则循环;
    }
}

规则 ("Parkour | Boundary Sphere") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        (事件玩家).cache_killPosition != 空数组;
        (事件玩家).toggle_invincible == 假;
        (事件玩家).checkpoint_notLast != 假;
        对任意为“真”((事件玩家).cache_killRadii, 比较(乘(归一化(当前数组元素), 相距距离(数组中的值((事件玩家).cache_killPosition, 当前数组索引), 事件玩家)), <, 当前数组元素)) == 真;
    }
    动作 {
        调用子程序(CheckpointFailReset);
    }
}

规则 ("Parkour | Bounce Ball / Orb") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        (事件玩家).cache_bouncePosition != 空数组;
        "@Condition eventPlayer.checkpoint_notLast # disabled coz editor"
        对任意为“真”((事件玩家).cache_bouncePosition, 比较(相距距离(当前数组元素, 加(所选位置(事件玩家), 乘(0.7, 上))), <, 1.4)) == 真;
    }
    动作 {
        设置玩家变量(事件玩家, cache_bounceTouched, 数组值的索引(全局.TQ, 已过滤的数组(全局.TQ, 与(与(与(比较(数组中的值(全局.pinballnumber, 当前数组索引), ==, (事件玩家).checkpoint_current), 比较(当前数组索引, !=, (事件玩家).cache_bounceTouched)), 非(数组包含((事件玩家).cache_collectedLocks, 当前数组索引))), 比较(相距距离(加(事件玩家, 乘(0.7, 上)), 当前数组元素), <, 1.4)))));
        "prevent same one activating twice in a row"
        If(比较((事件玩家).cache_bounceTouched, >=, 空));
            If(数组中的值(全局.BounceToggleLock, (事件玩家).cache_bounceTouched));
                修改玩家变量(事件玩家, cache_collectedLocks, 添加至数组, (事件玩家).cache_bounceTouched);
                "\\"   弹球已收集\\" checkCN \\"   orb has been collected\\""
                小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   Collected Orb   Collected Orb   Collected Orb"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
            End;
            If(比较(数组中的值(全局.EditMode, (事件玩家).cache_bounceTouched), >, 空));
                施加推力(事件玩家, 上, 数组中的值(全局.EditMode, (事件玩家).cache_bounceTouched), 至地图, 取消相反运动XYZ);
            Else If(比较(数组中的值(全局.EditMode, (事件玩家).cache_bounceTouched), <, 空));
                取消主要动作(事件玩家);
                设置玩家变量(事件玩家, skill_usedDouble, 空);
                "\\"   二段跳已就绪\\" checkCN \\"   » Double Jump is ready\\""
                小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   » Double Jump Is Ready   » Double Jump Is Ready   » Double Jump Is Ready"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
            End;
            If(数组中的值(全局.TQ5, (事件玩家).cache_bounceTouched));
                设置启用终极技能(事件玩家, 真);
                设置终极技能充能(事件玩家, 100);
                "\\"终极技能已就绪\\" checkCN \\"Ultimate is ready\\""
                小字体信息(事件玩家, 自定义字符串("   {0} {1}", 技能图标字符串(英雄(源氏), 按钮(终极技能)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒUltimate Is ReadyUltimate Is ReadyUltimate Is Ready"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))));
            End;
            If(数组中的值(全局.TQ6, (事件玩家).cache_bounceTouched));
                If(正在使用技能 1(事件玩家));
                    等待直到 (非(正在使用技能 1(事件玩家)), 真);
                    等待(假, 无视条件);
                End;
                设置启用技能 1(事件玩家, 真);
                "\\"技能1影已就绪\\" checkCN \\"Dash is ready\\""
                小字体信息(事件玩家, 自定义字符串("   {0} {1}", 技能图标字符串(英雄(源氏), 按钮(技能1)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒDash Is ReadyDash Is ReadyDash Is Ready"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))));
            End;
            播放效果(事件玩家, 状态爆炸声音, 空, 事件玩家, 75);
        End;
        等待(0.24, 无视条件);
        如条件为“真”则循环;
        设置玩家变量(事件玩家, cache_bounceTouched, -1);
    }
}

规则 ("Parkour | Death Reset") {
    事件 {
        玩家阵亡;
        双方;
        全部;
    }
    条件 {
        是否是机器人(事件玩家) == 假;
        (事件玩家).toggle_spectate == 假;
        (事件玩家).comp_done == 假;
    }
    动作 {
        If(数量(全局.A));
            复活(事件玩家);
        Else;
            复生(事件玩家);
        End;
        调用子程序(CheckpointFailReset);
        "rest is to prevent dead spamming from crashing server\\nbut doing waits only when needed without relying on a variable count"
        等待直到 (存活(事件玩家), 真);
        等待直到 (死亡(事件玩家), 真);
        If(与(死亡(事件玩家), 非(或((事件玩家).toggle_spectate, (事件玩家).comp_done))));
            等待(0.16, 无视条件);
            复活(事件玩家);
            调用子程序(CheckpointFailReset);
            等待直到 (存活(事件玩家), 真);
            等待直到 (死亡(事件玩家), 真);
            If(与(死亡(事件玩家), 非(或((事件玩家).toggle_spectate, (事件玩家).comp_done))));
                等待(0.44, 无视条件);
                复活(事件玩家);
                调用子程序(CheckpointFailReset);
                等待直到 (存活(事件玩家), 真);
                等待直到 (死亡(事件玩家), 真);
                If(与(死亡(事件玩家), 非(或((事件玩家).toggle_spectate, (事件玩家).comp_done))));
                    等待(0.64, 无视条件);
                    复生(事件玩家);
                    调用子程序(CheckpointFailReset);
    }
}

规则 ("Parkour | SUB Update Effect Cache") {
    事件 {
        子程序;
        UpdateCache;
    }
    动作 {
        "note: if adding cp pos to cache, make sure to also adjust editor things like move and teleport"
        设置玩家变量(事件玩家, cache_bouncePosition, 已过滤的数组(全局.TQ, 比较(数组中的值(全局.pinballnumber, 当前数组索引), ==, (事件玩家).checkpoint_current)));
        "eventPlayer.cache_bounceLocks = [_ for _, i in BounceToggleLock if BouncePadCheckpoints[i] == eventPlayer.checkpoint_current and _]\\neventPlayer.cache_bounceMaxLocks = len([_ for _ in eventPlayer.cache_bounceLocks if _])"
        设置玩家变量(事件玩家, cache_bounceMaxLocks, 数量(已过滤的数组(全局.BounceToggleLock, 与(比较(数组中的值(全局.pinballnumber, 当前数组索引), ==, (事件玩家).checkpoint_current), 当前数组元素))));
        设置玩家变量(事件玩家, cache_killPosition, 已过滤的数组(全局.H, 比较(数组中的值(全局.killballnumber, 当前数组索引), ==, (事件玩家).checkpoint_current)));
        设置玩家变量(事件玩家, cache_killRadii, 已过滤的数组(全局.I, 比较(数组中的值(全局.killballnumber, 当前数组索引), ==, (事件玩家).checkpoint_current)));
        设置玩家变量(事件玩家, cache_portalStart, 已过滤的数组(全局.CustomPortalStart, 或(比较(数组中的值(全局.CustomPortalCP, 当前数组索引), ==, (事件玩家).checkpoint_current), 比较(数组中的值(全局.CustomPortalCP, 当前数组索引), <, 空))));
        设置玩家变量(事件玩家, cache_portalEnd, 已过滤的数组(全局.CustomPortalEndpoint, 或(比较(数组中的值(全局.CustomPortalCP, 当前数组索引), ==, (事件玩家).checkpoint_current), 比较(数组中的值(全局.CustomPortalCP, 当前数组索引), <, 空))));
        设置玩家变量(事件玩家, checkpoint_notLast, 与(比较((事件玩家).checkpoint_current, <, 减(数量(全局.A), 真)), 比较(数量(全局.A), >, 1)));
        设置玩家变量(事件玩家, toggle_hints, 假);
        设置玩家变量(事件玩家, banString, 空数组);
        等待(假, 无视条件);
        If((事件玩家).checkpoint_notLast);
            设置玩家变量(事件玩家, ban_multi, 或(地图工坊设置开关(自定义字符串("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), 自定义字符串("Ban Multiclimb ■ 封禁蹭留 ■ 무한 벽타기 금지"), 假, 1), 数组包含(全局.BanMulti, (事件玩家).checkpoint_current)));
            If((事件玩家).ban_multi);
                设置玩家变量(事件玩家, banString, 自定义字符串("∞ {0}", (事件玩家).banString));
            End;
            设置玩家变量(事件玩家, ban_create, 或(地图工坊设置开关(自定义字符串("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), 自定义字符串("Ban Createbhop ■ 封禁卡小 ■ 콩콩이 생성 금지"), 假, 2), 数组包含(全局.BanCreate, (事件玩家).checkpoint_current)));
            If((事件玩家).ban_create);
                设置玩家变量(事件玩家, banString, 自定义字符串("♂ {0}", (事件玩家).banString));
            End;
            设置玩家变量(事件玩家, ban_standcreate, 或(地图工坊设置开关(自定义字符串("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), 自定义字符串("Ban Standcreate ■ 封禁站卡 ■ 서서 콩콩이 생성 금지"), 假, 3), 数组包含(全局.BanStand, (事件玩家).checkpoint_current)));
            If((事件玩家).ban_standcreate);
                "≥  √ ▼ ↓"
                设置玩家变量(事件玩家, banString, 自定义字符串("♠ {0}", (事件玩家).banString));
            End;
            设置玩家变量(事件玩家, ban_dead, 或(地图工坊设置开关(自定义字符串("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), 自定义字符串("Ban Deathbhop ■ 封禁死小 ■ 죽음 콩콩이 금지"), 假, 4), 数组包含(全局.BanDead, (事件玩家).checkpoint_current)));
            If((事件玩家).ban_dead);
                设置玩家变量(事件玩家, banString, 自定义字符串("X {0}", (事件玩家).banString));
            End;
            设置玩家变量(事件玩家, ban_emote, 或(地图工坊设置开关(自定义字符串("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), 自定义字符串("Ban Emote Savehop ■ 封禁表情留小 ■ 감정표현 콩콩이 금지"), 假, 5), 数组包含(全局.BanEmote, (事件玩家).checkpoint_current)));
            If((事件玩家).ban_emote);
                设置玩家变量(事件玩家, banString, 自定义字符串("♥ {0}", (事件玩家).banString));
            End;
            设置玩家变量(事件玩家, ban_savedouble, 或(地图工坊设置开关(自定义字符串("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), 自定义字符串("Ban Save Double ■ 封禁留二段跳 ■ 이단점프 킵 금지"), 假, 6), 数组包含(全局.BanSaveDouble, (事件玩家).checkpoint_current)));
            If((事件玩家).ban_savedouble);
                设置玩家变量(事件玩家, banString, 自定义字符串("△ {0}", (事件玩家).banString));
            End;
            设置玩家变量(事件玩家, ban_climb, 或(地图工坊设置开关(自定义字符串("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), 自定义字符串("Ban Wallclimb ■ 封禁爬墙 ■ 벽타기 금지"), 假, 7), 数组包含(全局.BanClimb, (事件玩家).checkpoint_current)));
            If((事件玩家).ban_climb);
                设置玩家变量(事件玩家, banString, 自定义字符串("↑ {0}", (事件玩家).banString));
            End;
            设置玩家变量(事件玩家, ban_bhop, 或(地图工坊设置开关(自定义字符串("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), 自定义字符串("Require Bhop Available ■ 留小跳进点 ■ 도착 시 콩콩이 필요"), 假, 8), 数组包含(全局.BanBhop, (事件玩家).checkpoint_current)));
            If((事件玩家).ban_bhop);
                "≥  √ ▼ ↓"
                设置玩家变量(事件玩家, banString, 自定义字符串("≥ {0}", (事件玩家).banString));
            End;
            设置玩家变量(事件玩家, ban_djump, 或(地图工坊设置开关(自定义字符串("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), 自定义字符串("Require Djump Available ■ 留二段跳进点 ■ 도착 시 이단 점프 필요"), 假, 9), 数组包含(全局.BanDjump, (事件玩家).checkpoint_current)));
            If((事件玩家).ban_djump);
                "≥  √ ▼ ↓ ︽"
                设置玩家变量(事件玩家, banString, 自定义字符串("» {0}", (事件玩家).banString));
            End;
        Else;
            设置玩家变量(事件玩家, ban_multi, 假);
            设置玩家变量(事件玩家, ban_create, 假);
            设置玩家变量(事件玩家, ban_standcreate, 假);
            设置玩家变量(事件玩家, ban_dead, 假);
            设置玩家变量(事件玩家, ban_emote, 假);
            设置玩家变量(事件玩家, ban_climb, 假);
            设置玩家变量(事件玩家, ban_savedouble, 假);
            设置玩家变量(事件玩家, ban_bhop, 假);
            设置玩家变量(事件玩家, ban_djump, 假);
        End;
        等待(假, 无视条件);
        开始规则(CheckUlt, 无动作);
        开始规则(CheckAbility1, 无动作);
        根据条件中止(或(比较(事件玩家, !=, 主机玩家), 非(全局.EditorOn)));
        调用子程序(EditUpdateSelectedIds);
        消除效果((主机玩家).editor_hitboxEffect);
        创建效果(If-Then-Else((主机玩家).editor_hitboxToggle, 主机玩家, 空), 球体, 颜色(白色), 数组中的值(全局.A, (主机玩家).checkpoint_current), 1.4, 可见，位置和半径);
        设置玩家变量(主机玩家, editor_hitboxEffect, 最后创建的实体);
        创建效果(If-Then-Else(与((主机玩家).editor_hitboxToggle, (主机玩家).checkpoint_notLast), 主机玩家, 空), 球体, 颜色(白色), 数组中的值(全局.A, 加((主机玩家).checkpoint_current, 真)), 1.4, 可见，位置和半径);
        修改玩家变量(主机玩家, editor_hitboxEffect, 添加至数组, 最后创建的实体);
        设置玩家变量(主机玩家, editor_bounceIndex, 已过滤的数组(映射的数组(全局.pinballnumber, If-Then-Else(比较(当前数组元素, ==, (主机玩家).checkpoint_current), 当前数组索引, -1)), 比较(当前数组元素, >=, 空)));
        设置玩家变量(主机玩家, editor_killIndex, 已过滤的数组(映射的数组(全局.killballnumber, If-Then-Else(比较(当前数组元素, ==, (主机玩家).checkpoint_current), 当前数组索引, -1)), 比较(当前数组元素, >=, 空)));
        If((主机玩家).checkpoint_moved);
            调用子程序(EditorSelectLast);
            设置玩家变量(主机玩家, checkpoint_moved, 假);
        End;
    }
}

规则 ("Parkour | SUB Delete Save") {
    事件 {
        子程序;
        DeleteSave;
    }
    动作 {
        修改全局变量(SaveName, 根据索引从数组中移除, 数组值的索引(全局.SaveEnt, 事件玩家));
        修改全局变量(SaveCp, 根据索引从数组中移除, 数组值的索引(全局.SaveEnt, 事件玩家));
        修改全局变量(SaveTimer, 根据索引从数组中移除, 数组值的索引(全局.SaveEnt, 事件玩家));
        修改全局变量(SaveElapsed, 根据索引从数组中移除, 数组值的索引(全局.SaveEnt, 事件玩家));
        "must always be last because its the index itself"
        修改全局变量(SaveEnt, 根据索引从数组中移除, 数组值的索引(全局.SaveEnt, 事件玩家));
    }
}

规则 ("Parkour | SUB Make Save") {
    事件 {
        子程序;
        MakeSave;
    }
    动作 {
        修改全局变量(SaveEnt, 添加至数组, 事件玩家);
        修改全局变量(SaveName, 添加至数组, 字符串分割(首个(事件玩家), 空数组));
        修改全局变量(SaveCp, 添加至数组, (事件玩家).checkpoint_current);
        修改全局变量(SaveTimer, 添加至数组, (事件玩家).timer_normal);
        修改全局变量(SaveElapsed, 添加至数组, 总计消耗时间);
    }
}

规则 ("Parkour | SUB Timer Pause") {
    事件 {
        子程序;
        TimerPause;
    }
    动作 {
        停止追踪玩家变量(事件玩家, timer_normal);
        根据条件中止(非(数组包含(全局.SaveEnt, 事件玩家)));
        在索引处设置全局变量(SaveTimer, 数组值的索引(全局.SaveEnt, 事件玩家), (事件玩家).timer_normal);
        在索引处设置全局变量(SaveElapsed, 数组值的索引(全局.SaveEnt, 事件玩家), 空);
    }
}

规则 ("Parkour | SUB Timer Resume") {
    事件 {
        子程序;
        TimerResume;
    }
    动作 {
        追踪玩家变量频率(事件玩家, timer_normal, 999999999999, 真, 全部禁用);
        在索引处设置全局变量(SaveElapsed, 数组值的索引(全局.SaveEnt, 事件玩家), 总计消耗时间);
    }
}

规则 ("Parkour | SUB Leaderboard Update") {
    事件 {
        子程序;
        LeaderboardUpdate;
    }
    动作 {
        "[[name, seconds, prettytime]]\\nyou already have a time"
        If(数组包含(映射的数组(全局.LeaderBoardFull, 首个(当前数组元素)), 字符串分割(首个(事件玩家), 空数组)));
            根据条件中止(比较((事件玩家).timer_normal, >=, 数组中的值(首个(已过滤的数组(全局.LeaderBoardFull, 比较(首个(当前数组元素), ==, 字符串分割(首个(事件玩家), 空数组)))), 真)));
            设置全局变量(LeaderBoardFull, 已过滤的数组(全局.LeaderBoardFull, 比较(首个(当前数组元素), !=, 字符串分割(首个(事件玩家), 空数组))));
        Else If(或(比较(数量(全局.LeaderBoardFull), <, 25), 比较((事件玩家).timer_normal, <, 最后(数组中的值(全局.LeaderBoardFull, 19)))));
            修改全局变量(LeaderBoardFull, 根据索引从数组中移除, 24);
        Else;
            "Full and time too slow"
            中止;
        End;
        修改全局变量(LeaderBoardFull, 添加至数组, 数组(数组(字符串分割(首个(事件玩家), 空数组), (事件玩家).timer_normal, 自定义字符串("{0} sec", (事件玩家).timer_normal))));
        "CreateLeaderboard()"
        设置全局变量(LeaderBoardRemake, 真);
    }
}

规则 ("Parkour | SUB Checkpoint Fail") {
    事件 {
        子程序;
        CheckpointFailReset;
    }
    动作 {
        设置玩家变量(事件玩家, timer_split, If-Then-Else((事件玩家).toggle_practice, (事件玩家).timer_practice, (事件玩家).timer_normal));
        设置玩家变量(事件玩家, cache_collectedLocks, 空数组);
        取消主要动作(事件玩家);
        设置玩家变量(事件玩家, skill_usedDouble, 空);
        If(非(或((事件玩家).checkpoint_current, (事件玩家).toggle_practice)));
            设置玩家变量(事件玩家, timer_normal, 空);
            设置玩家变量(事件玩家, timer_split, 空);
        End;
        If(数量(全局.A));
            If(正在使用技能 1(事件玩家));
                开始强制设置玩家位置(事件玩家, 事件玩家, 假);
                等待直到 (非(正在使用技能 1(事件玩家)), 真);
                等待(假, 无视条件);
                停止强制设置玩家位置(事件玩家);
            End;
            传送(事件玩家, 最后(数组中的值(全局.A, (事件玩家).checkpoint_current)));
            "After teleport incase stopForcingPosition launches the player"
            施加推力(事件玩家, 乘(-1, 速率(事件玩家)), 1.192093e-7, 至地图, 取消相反运动XYZ);
            "old: disallow jump > 0.1 sec wait > allow jump, this method bugs with ult check disabling ultimate for some reason\\nif eventPlayer.ban_dead or eventPlayer.ban_emote and eventPlayer.isHoldingButton(Button.JUMP):"
            If((事件玩家).ban_dead);
                If(按钮被按下(事件玩家, 按钮(跳跃)));
                    按下按键(事件玩家, 按钮(跳跃));
                End;
            Else;
                "Reset Hop"
                设置状态(事件玩家, 空, 定身, 0.096);
            End;
            If(正在使用终极技能(事件玩家));
                设置受到伤害(事件玩家, 100);
                击杀(事件玩家, 空);
                设置受到伤害(事件玩家, 0);
                等待(假, 无视条件);
            End;
        End;
        开始规则(CheckUlt, 重新开始规则);
        开始规则(CheckAbility1, 重新开始规则);
        调用子程序(AddonCustomLoadAndReset);
    }
}

规则 ("Parkour | SUB Start Game") {
    事件 {
        子程序;
        StartGame;
    }
    动作 {
        If(与(全局.CompMode, 或(比较(全局.CompTime, <, 1), (事件玩家).comp_done)));
            设置玩家变量(事件玩家, toggle_leaderboard, 真);
            设置玩家变量(事件玩家, comp_done, 真);
            "eventPlayer.disableRespawn()"
            设置受到伤害(事件玩家, 100);
            击杀(事件玩家, 空);
            设置受到伤害(事件玩家, 0);
            中止;
        End;
        If(数量(全局.A));
            "load saved progres"
            If(数组包含(全局.SaveName, 字符串分割(首个(事件玩家), 空数组)));
                在索引处设置全局变量(SaveEnt, 数组值的索引(全局.SaveName, 字符串分割(首个(事件玩家), 空数组)), 事件玩家);
                设置玩家变量(事件玩家, checkpoint_current, 数组中的值(全局.SaveCp, 数组值的索引(全局.SaveEnt, 事件玩家)));
                设置玩家变量(事件玩家, timer_normal, 数组中的值(全局.SaveTimer, 数组值的索引(全局.SaveEnt, 事件玩家)));
            Else;
                设置玩家变量(事件玩家, checkpoint_current, 空);
                设置玩家变量(事件玩家, timer_normal, 空);
                调用子程序(MakeSave);
            End;
            调用子程序(UpdateTitle);
            调用子程序(UpdateCache);
            调用子程序(CheckpointFailReset);
            "FFA"
            等待直到 (游戏正在进行中, 999999999999);
            调用子程序(TimerResume);
        End;
        "eventPlayer.enableRespawn()"
        设置玩家变量(事件玩家, toggle_invincible, 假);
        设置玩家变量(事件玩家, toggle_spectate, 假);
        设置玩家变量(事件玩家, checkpoint_moved, 真);
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Mechanics | Checks ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("Mechanic | All | Jump") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        正在跳跃(事件玩家) == 真;
    }
    动作 {
        设置玩家变量(事件玩家, skill_usedBhop, 真);
        If((事件玩家).skill_usedHop);
            "\\"   小跳已用\\" checkCN \\"   Bhop\\""
            小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   Bhop   Bhop   Bhop"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
        Else;
            设置玩家变量(事件玩家, skill_usedHop, 真);
    }
}

规则 ("Mechanic | All | No Jump") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        (事件玩家).skill_usedHop == 空;
        在地面上(事件玩家) == 假;
    }
    动作 {
        设置玩家变量(事件玩家, skill_usedHop, 真);
    }
}

规则 ("Mechanic | All | Bhop Reset") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        在地面上(事件玩家) == 真;
        按钮被按下(事件玩家, 按钮(跳跃)) == 假;
    }
    动作 {
        设置玩家变量(事件玩家, skill_usedBhop, 假);
    }
}

规则 ("Mechanic | All | Emote") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        正在使用表情交流(事件玩家) == 真;
    }
    动作 {
        设置玩家变量(事件玩家, skill_usedBhop, 假);
        If((事件玩家).addon_toggle3rdPov);
            设置玩家变量(事件玩家, addon_toggle3rdPov, 假);
            停止镜头(事件玩家);
        End;
        If((事件玩家).ban_emote);
            等待直到 (非(正在使用表情交流(事件玩家)), 999999999999);
            根据条件中止((事件玩家).toggle_invincible);
            "\\"   表情留小 ♥ 已禁用!\\" checkCN \\"   Emote Savehop ♥ is banned!\\""
            小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   Emote Savehop ♥ Is Banned!   Emote Savehop ♥ Is Banned!   Emote Savehop ♥ Is Banned!"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
            等待(假, 无视条件);
            调用子程序(CheckpointFailReset);
    }
}

规则 ("Mechanic | All | Ground Reset") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        在地面上(事件玩家) == 真;
    }
    动作 {
        "All"
        设置玩家变量(事件玩家, skill_usedHop, 空);
        设置玩家变量(事件玩家, skill_countBhops, 空);
        "$$ Climb"
        设置玩家变量(事件玩家, skill_usedClimb, 假);
        设置玩家变量(事件玩家, skill_countMulti, 空);
        设置玩家变量(事件玩家, skill_countCreates, 空);
        "$$ Genji"
        设置玩家变量(事件玩家, skill_usedDouble, 空);
    }
}

规则 ("Mechanic | Climbers | On Wall") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        "This rule is also linked to the determination of wall climbing, please do not close/delete"
        在墙上(事件玩家) == 真;
        按钮被按下(事件玩家, 按钮(跳跃)) == 真;
    }
    动作 {
        设置玩家变量(事件玩家, skill_usedClimb, 真);
    }
}

规则 ("Mechanic | Climbers | Bhop count for stand ban") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        正在跳跃(事件玩家) == 真;
        (事件玩家).ban_standcreate != 假;
    }
    动作 {
        修改玩家变量(事件玩家, skill_countBhops, 加, 真);
        If(与(比较((事件玩家).skill_countBhops, >, 1), 非((事件玩家).toggle_invincible)));
            "\\"   站卡 ♠ 已禁用!\\" checkCN \\"   Stand createBhop ♠ is banned!\\""
            小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   Stand Createbhop ♠ Is Banned!   Stand Createbhop ♠ Is Banned!   Stand Createbhop ♠ Is Banned!"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
            调用子程序(CheckpointFailReset);
    }
}

规则 ("Mechanic | Climbers | Create Bhop") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        按钮被按下(事件玩家, 按钮(蹲下)) == 真;
        正在蹲下(事件玩家) == 真;
        正在空中(事件玩家) == 真;
        按钮被按下(事件玩家, 按钮(跳跃)) == 假;
        正在跳跃(事件玩家) == 假;
    }
    动作 {
        设置玩家变量(事件玩家, skill_usedBhop, 假);
        "prevent restart from giving messsage, but stil allow it to become green"
        根据条件中止((事件玩家).lockState);
        If(与((事件玩家).ban_create, 非((事件玩家).toggle_invincible)));
            "\\"   卡小 ♂ 已禁用!\\" checkCN \\"   Create Bhop ♂ is banned!\\""
            小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   Create Bhop ♂ Is Banned!   Create Bhop ♂ Is Banned!   Create Bhop ♂ Is Banned!"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
            调用子程序(CheckpointFailReset);
        Else;
            If(与((事件玩家).ban_standcreate, 比较((事件玩家).skill_countBhops, >, 空)));
                修改玩家变量(事件玩家, skill_countBhops, 减, 真);
            End;
            修改玩家变量(事件玩家, skill_countCreates, 加, 真);
            "\\"   success!\\" checkCN \\"   Bhop has been created!\\""
            小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   Bhop Created!   Bhop Created!   Bhop Created!"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
    }
}

规则 ("Mechanic | Climbers | Multiclimb") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        在墙上(事件玩家) == 真;
        按钮被按下(事件玩家, 按钮(跳跃)) == 假;
        (事件玩家).skill_usedClimb == 假;
    }
    动作 {
        等待(假, 无视条件);
        If(与(在墙上(事件玩家), 非(按钮被按下(事件玩家, 按钮(跳跃)))));
            "AutoClimb used"
            设置玩家变量(事件玩家, skill_usedClimb, 真);
        Else;
            If(与(与((事件玩家).ban_multi, (事件玩家).checkpoint_notLast), 非((事件玩家).toggle_invincible)));
                "\\"   蹭留 ∞ 已禁用!\\" checkCN \\"   Multiclimb ∞ is banned!\\""
                小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   Multiclimb ∞ Is Banned!   Multiclimb ∞ Is Banned!   Multiclimb ∞ Is Banned!"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
                调用子程序(CheckpointFailReset);
            Else;
                修改玩家变量(事件玩家, skill_countMulti, 加, 真);
    }
}

规则 ("Mechanic | Climbers | Ban Wallclimb - Message") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        (事件玩家).ban_climb != 假;
        (事件玩家).toggle_invincible == 假;
        (事件玩家).skill_usedClimb != 假;
    }
    动作 {
        "CheckpointFailReset()\\n\\"   爬墙 ↑ 已禁用!\\" checkCN \\"   Climb ↑ is banned!\\""
        小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   Climb ↑ Is Banned!   Climb ↑ Is Banned!   Climb ↑ Is Banned!"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
    }
}

规则 ("Mechanic | Genji | SUB Check Ultimate") {
    事件 {
        子程序;
        CheckUlt;
    }
    动作 {
        If((事件玩家).lockState);
            "for dash start etc you can be away from cp so the keep charge activators"
            设置终极技能充能(事件玩家, 假);
        End;
        If(正在使用终极技能(事件玩家));
            等待直到 (非(正在使用终极技能(事件玩家)), 2);
            等待(假, 无视条件);
        End;
        "incase spamming the button"
        If(按钮被按下(事件玩家, 按钮(终极技能)));
            等待(假, 无视条件);
        End;
        If(或(或((事件玩家).toggle_invincible, 与(比较(事件玩家, ==, 主机玩家), 全局.EditorOn)), 非((事件玩家).checkpoint_notLast)));
            "skip msg if these"
            跳过(2);
        Else If(与(数组包含(全局.Dao, (事件玩家).checkpoint_current), 比较(相距距离(事件玩家, 最后(数组中的值(全局.A, (事件玩家).checkpoint_current))), <=, 1.4)));
            "\\"终极技能已就绪\\" checkCN \\"Ultimate is ready\\""
            小字体信息(事件玩家, 自定义字符串("   {0} {1}", 技能图标字符串(英雄(源氏), 按钮(终极技能)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒUltimate Is ReadyUltimate Is ReadyUltimate Is Ready"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))));
            //lbl_a:
            等待(假, 无视条件);
            设置启用终极技能(事件玩家, 真);
            设置终极技能充能(事件玩家, 100);
        "used to be just else, but have to deal with multi ult orbs"
        Else If(或(比较(相距距离(事件玩家, 最后(数组中的值(全局.A, (事件玩家).checkpoint_current))), <=, 2), 比较(终极技能充能百分比(事件玩家), <, 100)));
            设置启用终极技能(事件玩家, 假);
            设置终极技能充能(事件玩家, 假);
        End;
        等待(0.36, 无视条件);
    }
}

规则 ("Mechanic | Genji | SUB Check Dash") {
    事件 {
        子程序;
        CheckAbility1;
    }
    动作 {
        等待直到 (非(正在使用技能 1(事件玩家)), 真);
        If(或(或((事件玩家).toggle_invincible, 与(比较(事件玩家, ==, 主机玩家), 全局.EditorOn)), 非((事件玩家).checkpoint_notLast)));
            "skip msg if these"
            跳过(2);
        Else If(与(数组包含(全局.SHIFT, (事件玩家).checkpoint_current), 比较(相距距离(事件玩家, 最后(数组中的值(全局.A, (事件玩家).checkpoint_current))), <=, 1.4)));
            "\\"技能1影已就绪\\" checkCN \\"Dash is ready\\""
            小字体信息(事件玩家, 自定义字符串("   {0} {1}", 技能图标字符串(英雄(源氏), 按钮(技能1)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒDash Is ReadyDash Is ReadyDash Is Ready"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))));
            //lbl_a:
            设置启用技能 1(事件玩家, 真);
        Else;
            设置启用技能 1(事件玩家, 假);
        End;
    }
}

规则 ("Mechanic | Genji | Ultimate") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        正在使用终极技能(事件玩家) == 真;
    }
    动作 {
        等待(1.8, 当为“假”时中止);
        If(与((事件玩家).checkpoint_notLast, 非((事件玩家).toggle_invincible)));
            "disable primary fire because of slash exploit"
            禁用按钮(事件玩家, 按钮(主要攻击模式));
        End;
        等待直到 (非(正在使用终极技能(事件玩家)), 2);
        等待(假, 无视条件);
        可用按钮(事件玩家, 按钮(主要攻击模式));
        "sets ult charge back if done with map etc"
        开始规则(CheckUlt, 无动作);
    }
}

规则 ("Mechanic | Genji | Dash") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        正在使用技能 1(事件玩家) == 真;
    }
    动作 {
        "async(CheckAbility1(), AsyncBehavior.NOOP)"
        调用子程序(CheckAbility1);
    }
}

规则 ("Mechanic | Genji | Double Jump") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        存活(事件玩家) == 真;
        正在空中(事件玩家) == 真;
        或(或((事件玩家).ban_djump, (事件玩家).ban_savedouble), (事件玩家).addon_enableDoubleChecks) == 真;
    }
    动作 {
        "Save drop"
        等待直到 (或(或(在地面上(事件玩家), 正在跳跃(事件玩家)), 按钮被按下(事件玩家, 按钮(跳跃))), 0.096);
        如条件为“假”则中止;
        While(真);
            "Released Jump"
            等待直到 (或(在地面上(事件玩家), 非(按钮被按下(事件玩家, 按钮(跳跃)))), 999999999999);
            如条件为“假”则中止;
            "Double Jumped"
            等待直到 (或(在地面上(事件玩家), 按钮被按下(事件玩家, 按钮(跳跃))), 999999999999);
            如条件为“假”则中止;
            设置玩家变量(事件玩家, skill_usedDouble, 真);
            "Reset"
            等待直到 (或(在地面上(事件玩家), 非((事件玩家).skill_usedDouble)), 999999999999);
            如条件为“假”则中止;
        End;
    }
}

规则 ("Mechanic | Genji | Ban Save Double - 封禁二段跳") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        (事件玩家).ban_savedouble != 假;
        (事件玩家).toggle_invincible == 假;
        正在空中(事件玩家) == 真;
        (事件玩家).skill_usedDouble == 假;
    }
    动作 {
        等待直到 (或(或(比较(Z方向分量(阈值(事件玩家)), >, 空), 非(正在空中(事件玩家))), (事件玩家).skill_usedDouble), 999999999999);
        如条件为“假”则中止;
        等待直到 (或(或(比较(Z方向分量(阈值(事件玩家)), <=, 空), 非(正在空中(事件玩家))), (事件玩家).skill_usedDouble), 999999999999);
        如条件为“假”则中止;
        "Prevent false positives\\nDefault climb speed is 7.8 and small slowdown upon mantling"
        根据条件循环(比较(垂直速度(事件玩家), <, 6));
        If((事件玩家).skill_usedBhop);
            等待(0.8, 当为“假”时中止);
        Else;
            等待(0.8, 当为“假”时中止);
            根据条件中止((事件玩家).skill_usedBhop);
        End;
        "\\"   延二段跳已禁用!\\" checkCN \\"   save double banned!\\""
        小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   Save Double Banned!   Save Double Banned!   Save Double Banned!"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
        调用子程序(CheckpointFailReset);
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Editor ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("Editor | Export Map") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        事件玩家 == 主机玩家;
        全局.EditorOn != 假;
        按钮被按下(主机玩家, 按钮(近身攻击)) == 真;
        按钮被按下(主机玩家, 按钮(互动)) == 真;
        按钮被按下(主机玩家, 按钮(装填)) == 真;
    }
    动作 {
        "@Condition hostPlayer.editor_lock == false # !!! don't lock. always be sure data can be exported incase of a perma lock situation"
        等待(真, 当为“假”时中止);
        "doesnt matter thats its in pasta's because it wil be fixed on spawning"
        设置玩家变量(主机玩家, editor_lock, 真);
        设置玩家变量(主机玩家, editor_saveCache, 数组(全局.TimeRemaining, 全局.ColorConfig));
        设置全局变量(TimeRemaining, 空);
        设置全局变量(ColorConfig, 空);
        设置全局变量(EditorOn, 空);
        设置全局变量(C, 空);
        设置全局变量(K, 空);
        设置全局变量(NANBA, 空);
        设置全局变量(TQ2, 空);
        设置全局变量(SaveName, 空);
        设置全局变量(SaveCp, 空);
        设置全局变量(SaveTimer, 空);
        设置全局变量(SaveEnt, 空);
        "SavePauseTime = null\\nSavePauseEnabled = null"
        设置全局变量(SaveElapsed, 空);
        设置全局变量(CompMode, 空);
        "LeaderBoardFull = null\\nLeaderBoardHuds = null"
        设置全局变量(PortalOn, 空);
        设置全局变量(TitleData, 空);
        设置全局变量(CpHudText, 空);
        设置全局变量(CpHudCp, 空);
        设置全局变量(HintText, 空);
        设置全局变量(HintCp, 空);
        设置全局变量(CpIwtText, 空);
        设置全局变量(CpIwtCp, 空);
        设置全局变量(CpIwtPos, 空);
        设置全局变量(CpIwtColor, 空);
        设置全局变量(PortalNames, 空);
        设置全局变量(PortalLoc, 空);
        设置全局变量(PortalDest, 空);
        设置全局变量(PortalEffects, 空);
        If(比较(全局.Name, ==, 自定义字符串("name here - 作者")));
            设置全局变量(Name, 自定义字符串("{0}", 主机玩家));
        End;
        设置全局变量(Cachedcredits, 数组(全局.Name, 全局.Code));
        设置全局变量(Name, 空);
        设置全局变量(Code, 空);
        创建HUD文本(主机玩家, 自定义字符串("­"), 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("   0. 清理无用数据:\\n (此窗口打开时将自动完成)\\n\\n   1. 复制数据:\\n Esc → 打开地图工坊查看器 → 右下角'变量目标'改为全局\\n 点击窗口下方图标 (X) 复制作图数据\\n\\n   2. 录入数据:\\n Esc → 打开地图工坊编辑器{0}", 自定义字符串(" → 规则第(2/2)页 → 展开规则'数据录入 <---- 在这输入'\\n 点击'动作'一栏右侧橙色粘贴图标 录入数据\\n\\n   3. 地图工坊设置:\\n ESC → 显示大厅 → 设置 → 地图工坊设置→\\n 拉至底部 关闭'作图模式'\\n 选择地图难度\\n{0}", 自定义字符串("\\n   4. 创建初始地图代码:\\n Esc → 显示大厅 → 设置 → 分享代码 →\\n 创建新的代码 → 复制并记下代码\\n\\n   5. 添加作者信息:\\n Esc → 打开地图工坊编辑器 → 规则第(2/2)页 → 展开规则'Credits Here {0}", 自定义字符串("- 作者名字'\\n 修改自定义字符串文本框中的内容\\n\\n   6. 更新地图及作者信息:\\n Esc → 显示大厅 → 设置 → 共享代码 →\\n 上传至现有代码 → 粘贴步骤4中获得的代码")))), 自定义字符串("   0. Clear Extra Data:\\n Already Done Upon Opening This Window\\n\\n   1. Copy Data:\\n Open Workshop Inspector → Set Variable Targ{0}", 自定义字符串("et To Global\\n Click The [X]\\n\\n   2. Insert Data:\\n Paste The Data Into Rule Named 'Map Data <---- Insert Here'\\n\\n   3. Workshop {0}", 自定义字符串("Settings:\\n Esc → Show Lobby → Settings → Workshop Settings →\\n Toggle 'Editor Mode' Off\\n Select Display Difficulty\\n\\n   4. Crea{0}", 自定义字符串("te Initial Sharecode:\\n Esc → Show Lobby → Settings → Share Code →\\n Create New Code → Copy Code\\n\\n   5. Add Credits:\\n Enter You{0}", 自定义字符串("r Name & Map Code In The 'Credits Here' Rule\\n\\n   6. Update For Credits:\\n Esc → Show Lobby → Settings → Share Code →\\n Upload T{0}", 自定义字符串("o Existing Code → Paste The Code You Created In Step 4"))))))), 顶部, -185, 空, 空, 颜色(灰绿色), 字符串, 默认可见度);
        在索引处设置玩家变量(主机玩家, editor_saveCache, 2, 上一个文本ID);
        调用子程序(AddonCheckMap);
        启用查看器录制;
        禁用查看器录制;
        设置全局变量(EditorOn, 真);
        设置全局变量(TimeRemaining, 首个((主机玩家).editor_saveCache));
        设置全局变量(ColorConfig, 数组中的值((主机玩家).editor_saveCache, 真));
        创建HUD文本(主机玩家, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("    > 按互动键关闭当前窗口 <    "), 自定义字符串("    > Press Interact To Close This Window <    ")), 空, 空, 顶部, -183, 颜色(灰绿色), 空, 空, 字符串, 默认可见度);
        在索引处设置玩家变量(主机玩家, editor_saveCache, 假, 上一个文本ID);
        等待直到 (非(按钮被按下(主机玩家, 按钮(互动))), 999999999999);
        等待直到 (按钮被按下(主机玩家, 按钮(互动)), 999999999999);
        "Close Window"
        消除HUD文本(首个((主机玩家).editor_saveCache));
        "Instructions"
        消除HUD文本(最后((主机玩家).editor_saveCache));
        设置玩家变量(主机玩家, editor_saveCache, 空);
        设置玩家变量(主机玩家, editor_lock, 假);
    }
}

规则 ("Editor | Hud & Effects") {
    事件 {
        持续 - 全局;
    }
    动作 {
        等待(0.832000000000000, 无视条件);
        "waitUntil(entityExists(getAllPlayers()), Math.INFINITY)  # cant be condition because host player can leaves, removing the rule fx\\nwait()"
        If(全局.EditorOn);
            创建HUD文本((本地玩家).toggle_guide, 空, 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("{0}+{1}+{2} | 重新开始", 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(互动))), 自定义字符串("{0}+{1}+{2} | Restart", 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(互动)))), 右边, -156, 空, 空, 数组中的值(全局.ColorConfig, 5), 可见和字符串, 默认可见度);
            创建HUD文本(If-Then-Else((主机玩家).toggle_guide, 主机玩家, 空), 空, 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), If-Then-Else(全局.EditorMoveItem, 自定义字符串("方向键 | 移动实体 \\n{0} | 向上移动 \\n{1} | 向下移动 \\n{2} (长按) | 快速移动", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(终极技能)), 输入绑定字符串(按钮(跳跃))), 数组中的值(数组(自定义字符串("{0} + {1} | 新建检查点\\n{0} + {2} | 删除选中的检查点", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(主要攻击模式)), 输入绑定字符串(按钮(辅助攻击模式))), 自定义字符串("{0} + {1} | 新建击杀球\\n{0} + {1} (长按) | 在准心位置新建", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(主要攻击模式))), 自定义字符串("{0} + {1} | 新建弹球\\n{0} + {1} (长按) | 在准心位置新建", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(主要攻击模式))), 自定义字符串("{0} + {1} | 蹭留\\n{0} + {2} | 卡小", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(主要攻击模式)), 输入绑定字符串(按钮(辅助攻击模式))), 自定义字符串("{0} + {1} | 新建传送门\\n{0} + {1} (长按) | 在准心位置新建", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(主要攻击模式)))), (主机玩家).editor_modeSelect)), If-Then-Else(全局.EditorMoveItem, 自定义字符串("Walk | Move Selected\\n{0} | Move Up\\n{1} | Move Down\\n{2} (Hold) | Move Faster", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(终极技能)), 输入绑定字符串(按钮(跳跃))), 数组中的值(数组(自定义字符串("{0} + {1} | Create New\\n{0} + {2} | Delete Selected", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(主要攻击模式)), 输入绑定字符串(按钮(辅助攻击模式))), 自定义字符串("{0} + {1} | Create New\\n{0} + {1} (Hold)| Raycast New", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(主要攻击模式))), 自定义字符串("{0} + {1} | Create New\\n{0} + {1} (Hold)| Raycast New", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(主要攻击模式))), 自定义字符串("{0} + {1} | Multi-Climb\\n{0} + {2} | Createbhop", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(主要攻击模式)), 输入绑定字符串(按钮(辅助攻击模式))), 自定义字符串("{0} + {1} | Create New\\n{0} + {1} (Hold)| Raycast New", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(主要攻击模式)))), (主机玩家).editor_modeSelect))), 右边, -148, 空, 空, 颜色(黄色), 可见和字符串, 默认可见度);
            创建HUD文本(If-Then-Else(与((主机玩家).toggle_guide, 非(全局.EditorMoveItem)), 主机玩家, 空), 空, 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 数组中的值(数组(空数组, 自定义字符串("{0} + {1} | 删除选中的击杀球", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(辅助攻击模式))), 自定义字符串("{0} + {1} | 删除选中的弹球", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(辅助攻击模式))), 空数组, 自定义字符串("{0} + {1} | 删除选中的传送门", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(辅助攻击模式)))), (主机玩家).editor_modeSelect), 数组中的值(数组(空数组, 自定义字符串("{0} + {1} | Delete Selected", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(辅助攻击模式))), 自定义字符串("{0} + {1} | Delete Selected", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(辅助攻击模式))), 空数组, 自定义字符串("{0} + {1} | Delete Selected", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(辅助攻击模式)))), (主机玩家).editor_modeSelect)), 右边, -147, 空, 空, 颜色(黄色), 可见和字符串, 默认可见度);
            创建HUD文本(If-Then-Else((主机玩家).toggle_guide, 主机玩家, 空), 空, 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), If-Then-Else(全局.EditorMoveItem, 自定义字符串("{0} | 放置实体{1} | Cancel Placement\\n", 输入绑定字符串(按钮(主要攻击模式)), 输入绑定字符串(按钮(辅助攻击模式))), 数组中的值(数组(自定义字符串("{0} + {1} | 移除/新建传送点\\n{0} + {2} | 检查点碰撞模型\\n", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(装填)), 输入绑定字符串(按钮(技能1))), 自定义字符串("{0} + {1} | 选择上一个击杀球\\n{0} + {2} | 选择下一个击杀球\\n", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(跳跃))), 自定义字符串("{0} + {1} | 选择上一个弹球\\n{0} + {2} | 选择下一个弹球\\n", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(跳跃))), 自定义字符串("{0} + {1} | 爬墙\\n{0} + {2} | 延二段跳", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(跳跃))), 自定义字符串("{0} + {1} | 选择下一个传送门\\n{0} + {2} | 选择上一个传送门\\n", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(跳跃)), 输入绑定字符串(按钮(蹲下)))), (主机玩家).editor_modeSelect)), If-Then-Else(全局.EditorMoveItem, 自定义字符串("{0} | Confirm Placement\\n{1} | Cancel Placement", 输入绑定字符串(按钮(主要攻击模式)), 输入绑定字符串(按钮(辅助攻击模式))), 数组中的值(数组(自定义字符串("{0} + {1} | Remove/Add Teleport\\n{0} + {2} | Toggle Hitbox\\n", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(装填)), 输入绑定字符串(按钮(技能1))), 自定义字符串("{0} + {1} | Select Previous\\n{0} + {2} | Select Next\\n", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(跳跃))), 自定义字符串("{0} + {1} | Select Previous\\n{0} + {2} | Select Next\\n", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(跳跃))), 自定义字符串("{0} + {1} | Wallclimb\\n{0} + {2} | Save Double", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(跳跃))), 自定义字符串("{0} + {1} | Select Next\\n{0} + {2} | Select Previous\\n", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(跳跃)), 输入绑定字符串(按钮(蹲下)))), (主机玩家).editor_modeSelect))), 右边, -146, 空, 空, 颜色(黄色), 可见和字符串, 默认可见度);
            创建HUD文本(If-Then-Else(与((主机玩家).toggle_guide, 非(全局.EditorMoveItem)), 主机玩家, 空), 空, 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 数组中的值(数组(自定义字符串("{0} (长按) | 移动检查点", 输入绑定字符串(按钮(技能2))), 自定义字符串("{0} + {1} | 增大击杀球\\n{0} + {2} | 缩小击杀球", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(跳跃)), 输入绑定字符串(按钮(蹲下))), 自定义字符串("{0} + {1} | 增加弹球弹力\\n{0} + {2} | 减少弹球弹力", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(跳跃)), 输入绑定字符串(按钮(蹲下))), 自定义字符串("{0} + {1} | 死小\\n{0} + {2} | 表情留小", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(主要攻击模式)), 输入绑定字符串(按钮(辅助攻击模式))), 自定义字符串("{0} + {1} | 移动选中的实体\\n{0} + {2} | 应用到当前/所有关卡(开关)", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(主要攻击模式)), 输入绑定字符串(按钮(跳跃)))), (主机玩家).editor_modeSelect), 数组中的值(数组(自定义字符串("{0} (Hold) | Move", 输入绑定字符串(按钮(技能2))), 自定义字符串("{0} + {1} | Increase Size\\n{0} + {2} | Decrease Size", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(跳跃)), 输入绑定字符串(按钮(蹲下))), 自定义字符串("{0} + {1} | Increase Strength\\n{0} + {2} | Decrease Strength", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(跳跃)), 输入绑定字符串(按钮(蹲下))), 自定义字符串("{0} + {1} | Death Hop\\n{0} + {2} | Emote", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(主要攻击模式)), 输入绑定字符串(按钮(辅助攻击模式))), 自定义字符串("{0} + {1} | Move\\n{0} + {2} | Cp/Map (Toggle)", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(主要攻击模式)), 输入绑定字符串(按钮(跳跃)))), (主机玩家).editor_modeSelect)), 右边, -145, 空, 空, 颜色(黄色), 可见和字符串, 默认可见度);
            创建HUD文本(If-Then-Else(与((主机玩家).toggle_guide, 非(全局.EditorMoveItem)), 主机玩家, 空), 空, 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 数组中的值(数组(空数组, 自定义字符串("{0} + {1} | 移动选中的实体", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(主要攻击模式))), 自定义字符串("{0} + {1} | 移动选中的实体", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(主要攻击模式))), 自定义字符串("{0} + {1} | 留小跳进点\\n{0} + {2} | 站卡", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(跳跃)), 输入绑定字符串(按钮(蹲下))), 空数组), (主机玩家).editor_modeSelect), 数组中的值(数组(空数组, 自定义字符串("{0} + {1} | Move", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(主要攻击模式))), 自定义字符串("{0} + {1} | Move", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(主要攻击模式))), 自定义字符串("{0} + {1} | Require Bhop\\n{0} + {2} | Stand Create", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(跳跃)), 输入绑定字符串(按钮(蹲下))), 空数组), (主机玩家).editor_modeSelect)), 右边, -144, 空, 空, 颜色(黄色), 可见和字符串, 默认可见度);
            创建HUD文本(If-Then-Else((主机玩家).toggle_guide, 主机玩家, 空), 空, 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串(" \\n{0} + {1} | 下一关", 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(主要攻击模式))), 自定义字符串(" \\n{0} + {1} | Next Checkpoint", 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(主要攻击模式)))), 右边, -150, 空, 空, If-Then-Else((主机玩家).toggle_guide, 颜色(绿色), 颜色(橙色)), 可见，字符串和颜色, 默认可见度);
            创建HUD文本(If-Then-Else((主机玩家).toggle_guide, 主机玩家, 空), 空, 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("{0} + {1} | 上一关\\n{2} (长按) | 飞行\\n", 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(辅助攻击模式)), 输入绑定字符串(按钮(技能1))), 自定义字符串("{0} + {1} | Prev Checkpoint\\n{2} (hold)| Fly\\n", 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(辅助攻击模式)), 输入绑定字符串(按钮(技能1)))), 右边, -149, 空, 空, If-Then-Else((主机玩家).toggle_guide, 颜色(绿色), 颜色(橙色)), 可见，字符串和颜色, 默认可见度);
            创建HUD文本(If-Then-Else((主机玩家).toggle_guide, 主机玩家, 空), 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("保存地图长按 {0} + {1} + {2}", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(近身攻击)), 自定义字符串("{0} 后按弹出窗口的提示进行操作                                                                                                ", 输入绑定字符串(按钮(装填)))), 自定义字符串("To Save Map, Hold {0} + {1} + {2}", 输入绑定字符串(按钮(互动)), 输入绑定字符串(按钮(近身攻击)), 自定义字符串("{0} Then Follow Instructions                                                                                                ", 输入绑定字符串(按钮(装填))))), 空, 左边, -197, 空, 颜色(黄色), 空, 可见和字符串, 默认可见度);
            创建HUD文本(If-Then-Else((本地玩家).editor_saveCache, 空, 本地玩家), If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), If-Then-Else(按钮被按下(主机玩家, 按钮(近身攻击)), 自定义字符串("{0} 检查点模式\\n{1} 击杀球模式\\n{2}", If-Then-Else((主机玩家).editor_modeSelect, 自定义字符串("     "), 图标字符串(箭头：向右)), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 1), 图标字符串(箭头：向右), 自定义字符串("     ")), 自定义字符串("{0} 弹球模式\\n{1} 封禁(单关)\\n{2} 自定义传送门 ", If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 2), 图标字符串(箭头：向右), 自定义字符串("     ")), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 3), 图标字符串(箭头：向右), 自定义字符串("     ")), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 4), 图标字符串(箭头：向右), 自定义字符串("     ")))), If-Then-Else(比较(本地玩家, ==, 主机玩家), 自定义字符串(" {0} {1} ", 数组中的值(数组(图标字符串(旗帜), 图标字符串(骷髅), 图标字符串(满月), 图标字符串(停止), 图标字符串(螺旋)), (主机玩家).editor_modeSelect), 数组中的值(字符串分割(自定义字符串("检查点模式0击杀球模式0弹球模式0封禁(单关)0自定义传送门"), 首个(空)), (主机玩家).editor_modeSelect)), 自定义字符串(" {0} 源氏 编辑者 {0} ", 图标字符串(箭矢)))), If-Then-Else(按钮被按下(主机玩家, 按钮(近身攻击)), 自定义字符串("{0} Checkpoints\\n{1} Boundary Spheres\\n{2}", If-Then-Else((主机玩家).editor_modeSelect, 自定义字符串("     "), 图标字符串(箭头：向右)), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 1), 图标字符串(箭头：向右), 自定义字符串("     ")), 自定义字符串("{0} Function Orbs\\n{1} Skill Bans\\n{2} Portals", If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 2), 图标字符串(箭头：向右), 自定义字符串("     ")), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 3), 图标字符串(箭头：向右), 自定义字符串("     ")), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 4), 图标字符串(箭头：向右), 自定义字符串("     ")))), If-Then-Else(比较(本地玩家, ==, 主机玩家), 自定义字符串(" {0} {1} ", 数组中的值(数组(图标字符串(旗帜), 图标字符串(骷髅), 图标字符串(满月), 图标字符串(停止), 图标字符串(螺旋)), (主机玩家).editor_modeSelect), 数组中的值(字符串分割(自定义字符串("Checkpoints0Boundary Spheres0Function Orbs0Skill Bans0Portals"), 首个(空)), (主机玩家).editor_modeSelect)), 自定义字符串(" {0} Genji Editor {0} ", 图标字符串(箭矢))))), 空, 空, 顶部, -174, 颜色(蓝色), 空, 空, 可见和字符串, 默认可见度);
            创建HUD文本(首个(真), 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), If-Then-Else(比较(本地玩家, ==, 主机玩家), 自定义字符串("{0} + 射击 | 切换作图模式", 输入绑定字符串(按钮(近身攻击))), 自定义字符串("房主/编辑者 {0}", 主机玩家)), If-Then-Else(比较(本地玩家, ==, 主机玩家), 自定义字符串("{0} + Shoot | Change Mode", 输入绑定字符串(按钮(近身攻击))), 自定义字符串("Current Host/Editor: {0}", 主机玩家))), 空, 顶部, -175, 空, If-Then-Else((本地玩家).editor_lock, 颜色(灰色), 颜色(白色)), 空, 可见，字符串和颜色, 默认可见度);
            创建HUD文本(If-Then-Else(与((主机玩家).toggle_guide, 或(非((主机玩家).editor_modeSelect), 与(比较((主机玩家).editor_modeSelect, ==, 2), 数量((主机玩家).editor_bounceIndex)))), 主机玩家, 空), 空, 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("{0} + {1} | {2}", 输入绑定字符串(按钮(终极技能)), 输入绑定字符串(按钮(主要攻击模式)), 自定义字符串("{0} {1} | {2}                                                                                                ", If-Then-Else((主机玩家).editor_modeSelect, 自定义字符串("弹球给刀"), 自定义字符串("检查点给刀")), 技能图标字符串(英雄(源氏), 按钮(终极技能)), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 2), 数组中的值(全局.TQ5, 全局.EditSelected), 数组包含(全局.Dao, (主机玩家).checkpoint_current)))), 自定义字符串("{0} + {1} | {2}", 输入绑定字符串(按钮(终极技能)), 输入绑定字符串(按钮(主要攻击模式)), 自定义字符串("{0} Give Ult {1} | {2}                                                                                                ", If-Then-Else((主机玩家).editor_modeSelect, 自定义字符串("Orb"), 自定义字符串("Level")), 技能图标字符串(英雄(源氏), 按钮(终极技能)), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 2), 数组中的值(全局.TQ5, 全局.EditSelected), 数组包含(全局.Dao, (主机玩家).checkpoint_current))))), 左边, -189, 空, 空, If-Then-Else(与(数组中的值(全局.TQ5, 全局.EditSelected), 比较((主机玩家).editor_modeSelect, ==, 2)), 颜色(绿色), If-Then-Else(与(数组包含(全局.Dao, (主机玩家).checkpoint_current), 非((主机玩家).editor_modeSelect)), 颜色(绿色), 颜色(橙色))), 可见，字符串和颜色, 默认可见度);
            创建HUD文本(If-Then-Else(与((主机玩家).toggle_guide, 或(非((主机玩家).editor_modeSelect), 与(比较((主机玩家).editor_modeSelect, ==, 2), 数量((主机玩家).editor_bounceIndex)))), 主机玩家, 空), 空, 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("{0} + {1} | {2}", 输入绑定字符串(按钮(终极技能)), 输入绑定字符串(按钮(辅助攻击模式)), 自定义字符串("{0} {1} | {2}                                                                                                ", If-Then-Else((主机玩家).editor_modeSelect, 自定义字符串("弹球给Shift"), 自定义字符串("检查点给Shift")), 技能图标字符串(英雄(源氏), 按钮(技能1)), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 2), 数组中的值(全局.TQ6, 全局.EditSelected), 数组包含(全局.SHIFT, (主机玩家).checkpoint_current)))), 自定义字符串("{0} + {1} | {2}", 输入绑定字符串(按钮(终极技能)), 输入绑定字符串(按钮(辅助攻击模式)), 自定义字符串("{0} Give Dash {1} | {2}                                                                                                ", If-Then-Else((主机玩家).editor_modeSelect, 自定义字符串("Orb"), 自定义字符串("Level")), 技能图标字符串(英雄(源氏), 按钮(技能1)), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 2), 数组中的值(全局.TQ6, 全局.EditSelected), 数组包含(全局.SHIFT, (主机玩家).checkpoint_current))))), 左边, -188, 空, 空, If-Then-Else(与(数组中的值(全局.TQ6, 全局.EditSelected), 比较((主机玩家).editor_modeSelect, ==, 2)), 颜色(绿色), If-Then-Else(与(数组包含(全局.SHIFT, (主机玩家).checkpoint_current), 非((主机玩家).editor_modeSelect)), 颜色(绿色), 颜色(橙色))), 可见，字符串和颜色, 默认可见度);
            创建HUD文本(If-Then-Else(与(与(比较((主机玩家).editor_modeSelect, ==, 2), (主机玩家).toggle_guide), 数量((主机玩家).editor_bounceIndex)), 主机玩家, 空), 空, 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("{0} + {1} |  收集球(进点前必须集齐) {2}", 输入绑定字符串(按钮(终极技能)), 输入绑定字符串(按钮(技能2)), 自定义字符串("{0} | {1}\\n                                                                                                ", 图标字符串(星形), 数组中的值(全局.BounceToggleLock, 全局.EditSelected))), 自定义字符串("{0} + {1} | Unlocks Checkpoint {2}", 输入绑定字符串(按钮(终极技能)), 输入绑定字符串(按钮(技能2)), 自定义字符串("{0} | {1}\\n                                                                                                ", 图标字符串(星形), 数组中的值(全局.BounceToggleLock, 全局.EditSelected)))), 左边, -187, 空, 空, If-Then-Else(数组中的值(全局.BounceToggleLock, 全局.EditSelected), 颜色(绿色), 颜色(橙色)), 可见，字符串和颜色, 默认可见度);
            创建HUD文本(If-Then-Else((主机玩家).toggle_guide, 主机玩家, 空), If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("球体/传送门上限: {0}/193 ", 加(加(数量(全局.TQ), 数量(全局.H)), 数量(全局.CustomPortalStart))), 自定义字符串("Orb/Portal Limit: {0}/193 ", 加(加(数量(全局.TQ), 数量(全局.H)), 数量(全局.CustomPortalStart)))), 空, 自定义字符串("                                                                                                                                "), 左边, -191, 颜色(蓝色), 空, 空, 可见和字符串, 默认可见度);
            "display selected cc/orb info"
            创建HUD文本(If-Then-Else((主机玩家).toggle_guide, 主机玩家, 空), If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), If-Then-Else(与(非((主机玩家).editor_modeSelect), 数量(全局.A)), 自定义字符串("\\n 选中的检查点 \\n 矢量: {0}{1} \\n", 数组中的值(全局.A, (主机玩家).checkpoint_current), If-Then-Else(比较(数量(数组中的值(全局.A, (主机玩家).checkpoint_current)), <, 2), 空数组, 自定义字符串("\\n 传送点: {0}", 数组中的值(数组中的值(全局.A, (主机玩家).checkpoint_current), 真)))), If-Then-Else(与(比较((主机玩家).editor_modeSelect, ==, 1), 数量((主机玩家).editor_killIndex)), 自定义字符串("\\n 选中的击杀球\\n 矢量: {0}\\n 半径: {1}\\n  + 進不去\\n  - 出不來\\n", 数组中的值(全局.H, 全局.EditSelected), 数组中的值(全局.I, 全局.EditSelected)), If-Then-Else(与(比较((主机玩家).editor_modeSelect, ==, 2), 数量((主机玩家).editor_bounceIndex)), 自定义字符串("\\n 选中的弹球\\n 矢量: {0}\\n 弹力: {1}\\n 序号: {2}\\n", 数组中的值(全局.TQ, 全局.EditSelected), 数组中的值(全局.EditMode, 全局.EditSelected), 全局.EditSelected), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 3), 自定义字符串("\\n 封禁(单关)\\n――――――――――――\\n {0} 蹭留 ∞\\n {1} 卡小 ♂\\n {2}", If-Then-Else(数组包含(全局.BanMulti, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), If-Then-Else(数组包含(全局.BanCreate, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), 自定义字符串("{0} 站卡 ♠\\n {1} 爬墙 ↑\\n {2}", If-Then-Else(数组包含(全局.BanStand, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), If-Then-Else(数组包含(全局.BanClimb, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), 自定义字符串("{0} 死小 X\\n {1} 表情留小 ♥\\n {2}", If-Then-Else(数组包含(全局.BanDead, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), If-Then-Else(数组包含(全局.BanEmote, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), 自定义字符串("{0} 延二段跳 △\\n――――――――――――\\n {1} 留小跳进点 ≥\\n", If-Then-Else(数组包含(全局.BanSaveDouble, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), If-Then-Else(数组包含(全局.BanBhop, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组))))), If-Then-Else(与(与(比较((主机玩家).editor_modeSelect, ==, 4), 数组包含(数组((主机玩家).checkpoint_current, -1), 数组中的值(全局.CustomPortalCP, 全局.EditSelected))), 数量(全局.CustomPortalCP)), 自定义字符串("\\n 入口矢量: {0}\\n 出口矢量: {1}\\n 应用关卡: {2}\\n", 数组中的值(全局.CustomPortalStart, 全局.EditSelected), 数组中的值(全局.CustomPortalEndpoint, 全局.EditSelected), If-Then-Else(比较(数组中的值(全局.CustomPortalCP, 全局.EditSelected), <, 空), 自定义字符串("所有"), (主机玩家).checkpoint_current)), 自定义字符串("\\n   当前无数据选中   \\n")))))), If-Then-Else(与(非((主机玩家).editor_modeSelect), 数量(全局.A)), 自定义字符串("\\n Selected Checkpoint\\n Vector: {0}{1} \\n", 数组中的值(全局.A, (主机玩家).checkpoint_current), If-Then-Else(比较(数量(数组中的值(全局.A, (主机玩家).checkpoint_current)), <, 2), 空数组, 自定义字符串("\\n Teleport: {0}", 数组中的值(数组中的值(全局.A, (主机玩家).checkpoint_current), 真)))), If-Then-Else(与(比较((主机玩家).editor_modeSelect, ==, 1), 数量((主机玩家).editor_killIndex)), 自定义字符串("\\n Selected Boundary Sphere\\n Vector: {0}\\n Radius: {1}\\n  + Keep Out\\n  - Stay In\\n", 数组中的值(全局.H, 全局.EditSelected), 数组中的值(全局.I, 全局.EditSelected)), If-Then-Else(与(比较((主机玩家).editor_modeSelect, ==, 2), 数量((主机玩家).editor_bounceIndex)), 自定义字符串("\\n Selected Bounce Orb\\n Vector: {0}\\n Strength: {1} \\n ID: {2}\\n", 数组中的值(全局.TQ, 全局.EditSelected), 数组中的值(全局.EditMode, 全局.EditSelected), 全局.EditSelected), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 3), 自定义字符串("\\n Skill Bans\\n――――――――――――\\n {0} Multi-Climb ∞\\n {1} Create ♂\\n {2}", If-Then-Else(数组包含(全局.BanMulti, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), If-Then-Else(数组包含(全局.BanCreate, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), 自定义字符串("{0} Stand ♠\\n {1} Climb ↑\\n {2}", If-Then-Else(数组包含(全局.BanStand, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), If-Then-Else(数组包含(全局.BanClimb, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), 自定义字符串("{0} Dead X\\n {1} Emote ♥\\n {2}", If-Then-Else(数组包含(全局.BanDead, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), If-Then-Else(数组包含(全局.BanEmote, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), 自定义字符串("{0} Save Double △\\n――――――――――――\\n {1} Require Bhop ≥\\n", If-Then-Else(数组包含(全局.BanSaveDouble, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组), If-Then-Else(数组包含(全局.BanBhop, (主机玩家).checkpoint_current), 自定义字符串("√"), 空数组))))), If-Then-Else(与(与(比较((主机玩家).editor_modeSelect, ==, 4), 数组包含(数组((主机玩家).checkpoint_current, -1), 数组中的值(全局.CustomPortalCP, 全局.EditSelected))), 数量(全局.CustomPortalCP)), 自定义字符串("\\n Start: {0} \\n End: {1} \\n CP: {2} \\n", 数组中的值(全局.CustomPortalStart, 全局.EditSelected), 数组中的值(全局.CustomPortalEndpoint, 全局.EditSelected), If-Then-Else(比较(数组中的值(全局.CustomPortalCP, 全局.EditSelected), <, 空), 自定义字符串("All"), (主机玩家).checkpoint_current)), 自定义字符串("\\n   No Data Selected   \\n"))))))), 空, 自定义字符串("                                                                                                                                "), 左边, -190, 颜色(白色), 空, 颜色(橙色), 可见和字符串, 默认可见度);
            "effects =========================================================================================================================================================================="
            创建地图文本(If-Then-Else(数量(全局.EditSelectIdArray), 真, 空), If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("选中的实体"), 自定义字符串("Selected")), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 1), 数组中的值(全局.H, 全局.EditSelected), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 2), 数组中的值(全局.TQ, 全局.EditSelected), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 4), 数组中的值(全局.CustomPortalStart, 全局.EditSelected), 空))), 1.2, 不要截取, 可见和位置, 颜色(橙色), 默认可见度);
            创建图标(If-Then-Else(数量(全局.EditSelectIdArray), 真, 空), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 1), 数组中的值(全局.H, 全局.EditSelected), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 2), 数组中的值(全局.TQ, 全局.EditSelected), If-Then-Else(比较((主机玩家).editor_modeSelect, ==, 4), 数组中的值(全局.CustomPortalStart, 全局.EditSelected), 空))), 箭头：向下, 可见和位置, 颜色(白色), 真);
            "Purple sphere for teleport location"
            创建效果(If-Then-Else(与(比较(数量(数组中的值(全局.A, (主机玩家).checkpoint_current)), >, 1), 非((主机玩家).editor_modeSelect)), 主机玩家, 空), 球体, 颜色(亮紫色), 减(数组中的值(数组中的值(全局.A, (主机玩家).checkpoint_current), 真), 乘(0.1, 上)), 0.2, 可见，位置和半径);
            "Teleport text"
            创建地图文本(If-Then-Else(与(比较(数量(数组中的值(全局.A, (主机玩家).checkpoint_current)), >, 1), 非((主机玩家).editor_modeSelect)), 主机玩家, 空), If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("传送点位置"), 自定义字符串("teleporter location")), 数组中的值(数组中的值(全局.A, (主机玩家).checkpoint_current), 真), 1.6, 不要截取, 可见，位置和字符串, 颜色(天蓝色), 默认可见度);
            "normal cp if teleport"
            创建效果(If-Then-Else(与(数组中的值(数组中的值(全局.A, (主机玩家).checkpoint_current), 真), 非((主机玩家).editor_modeSelect)), 主机玩家, 空), 环, 颜色(橙色), 首个(数组中的值(全局.A, (主机玩家).checkpoint_current)), 真, 可见，位置和半径);
            创建地图文本(If-Then-Else(与(数组中的值(数组中的值(全局.A, (主机玩家).checkpoint_current), 真), 非((主机玩家).editor_modeSelect)), 主机玩家, 空), If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("检查点位置"), 自定义字符串("level location")), 首个(数组中的值(全局.A, (主机玩家).checkpoint_current)), 1.6, 不要截取, 可见，位置和字符串, 颜色(天蓝色), 默认可见度);
            "portal fx"
            创建效果(If-Then-Else(与(数量(全局.EditSelectIdArray), 比较((主机玩家).editor_modeSelect, ==, 4)), 主机玩家, 空), 火花, 颜色(亮紫色), 数组中的值(全局.CustomPortalEndpoint, 全局.EditSelected), 0.2, 可见，位置和半径);
    }
}

规则 ("Editor | Toggle Fly & Noclip") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        全局.EditorOn != 假;
        按钮被按下(事件玩家, 按钮(技能1)) == 真;
        (事件玩家).editor_fly == 空;
        与(全局.EditorMoveItem, 比较(事件玩家, ==, 主机玩家)) == 假;
    }
    动作 {
        等待直到 (或(按钮被按下(事件玩家, 按钮(装填)), 非(按钮被按下(事件玩家, 按钮(技能1)))), 0.7);
        If(或(按钮被按下(事件玩家, 按钮(装填)), 非(按钮被按下(事件玩家, 按钮(技能1)))));
            等待(假, 无视条件);
            中止;
        End;
        设置玩家变量(事件玩家, editor_fly, 加(所选位置(事件玩家), 上));
        开始强制设置玩家位置(事件玩家, (事件玩家).editor_fly, 真);
        取消与环境的移动碰撞(事件玩家, 真);
        禁用按钮(事件玩家, 按钮(终极技能));
        等待直到 (非(按钮被按下(事件玩家, 按钮(技能1))), 真);
        While(与(与(存活(事件玩家), (事件玩家).editor_fly), 非(按钮被按下(事件玩家, 按钮(技能1)))));
            If(或(比较(事件玩家, !=, 主机玩家), 非((事件玩家).editor_lock)));
                修改玩家变量(事件玩家, editor_fly, 加, 乘(减(加(0.096, 乘(0.192, 按钮被按下(事件玩家, 按钮(跳跃)))), 乘(0.048, 按钮被按下(事件玩家, 按钮(蹲下)))), 加(加(乘(乘(面朝方向(事件玩家), Z方向分量(阈值(事件玩家))), 矢量(真, 非(按钮被按下(事件玩家, 按钮(技能1))), 真)), 地图矢量(乘(阈值(事件玩家), 左), 事件玩家, 旋转)), 乘(上, 减(按钮被按下(事件玩家, 按钮(技能2)), 按钮被按下(事件玩家, 按钮(终极技能)))))));
            Else If(非((主机玩家).editor_modeSelect));
                修改玩家变量(事件玩家, editor_fly, 加, 乘(加(0.00288, 乘(0.09312, 按钮被按下(事件玩家, 按钮(主要攻击模式)))), 加(加(乘(面朝方向(事件玩家), Z方向分量(阈值(事件玩家))), 地图矢量(乘(阈值(事件玩家), 左), 事件玩家, 旋转)), 乘(上, 减(按钮被按下(事件玩家, 按钮(跳跃)), 按钮被按下(事件玩家, 按钮(蹲下)))))));
            End;
            等待(假, 无视条件);
        End;
        可用按钮(事件玩家, 按钮(终极技能));
        开启与环境的移动碰撞(事件玩家);
        设置玩家变量(事件玩家, editor_fly, 空);
        停止强制设置玩家位置(事件玩家);
        等待(真, 无视条件);
    }
}

规则 ("Editor | Change Mode") {
    事件 {
        持续 - 全局;
    }
    条件 {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        全局.EditorOn != 假;
        (主机玩家).editor_lock == 假;
        按钮被按下(主机玩家, 按钮(近身攻击)) == 真;
        按钮被按下(主机玩家, 按钮(主要攻击模式)) != 按钮被按下(主机玩家, 按钮(辅助攻击模式));
    }
    动作 {
        设置玩家变量(主机玩家, editor_lock, 真);
        If(按钮被按下(主机玩家, 按钮(主要攻击模式)));
            修改玩家变量(主机玩家, editor_modeSelect, 加, 4);
        Else;
            修改玩家变量(主机玩家, editor_modeSelect, 加, 真);
        End;
        修改玩家变量(主机玩家, editor_modeSelect, 余数, 5);
        调用子程序(EditUpdateSelectedIds);
        调用子程序(EditorSelectLast);
        等待(假, 无视条件);
        等待直到 (比较(按钮被按下(主机玩家, 按钮(主要攻击模式)), ==, 按钮被按下(主机玩家, 按钮(辅助攻击模式))), 0.1);
        设置玩家变量(主机玩家, editor_lock, 假);
    }
}

规则 ("Editor | Update Selected Id") {
    事件 {
        子程序;
        EditUpdateSelectedIds;
    }
    动作 {
        If(比较((主机玩家).editor_modeSelect, ==, 1));
            设置全局变量(EditSelectIdArray, 映射的数组(全局.killballnumber, 当前数组索引));
            设置全局变量(EditSelectIdArray, 已过滤的数组(全局.EditSelectIdArray, 比较(数组中的值(全局.killballnumber, 当前数组元素), ==, (主机玩家).checkpoint_current)));
        Else If(比较((主机玩家).editor_modeSelect, ==, 2));
            设置全局变量(EditSelectIdArray, 映射的数组(全局.pinballnumber, 当前数组索引));
            设置全局变量(EditSelectIdArray, 已过滤的数组(全局.EditSelectIdArray, 比较(数组中的值(全局.pinballnumber, 当前数组元素), ==, (主机玩家).checkpoint_current)));
        Else If(比较((主机玩家).editor_modeSelect, ==, 4));
            设置全局变量(EditSelectIdArray, 映射的数组(全局.CustomPortalCP, 当前数组索引));
            设置全局变量(EditSelectIdArray, 已过滤的数组(全局.EditSelectIdArray, 或(比较(数组中的值(全局.CustomPortalCP, 当前数组元素), <, 空), 比较(数组中的值(全局.CustomPortalCP, 当前数组元素), ==, (主机玩家).checkpoint_current))));
        Else;
            设置全局变量(EditSelectIdArray, 空数组);
        End;
    }
}

规则 ("Editor | Select Last") {
    事件 {
        子程序;
        EditorSelectLast;
    }
    动作 {
        设置全局变量(EditSelected, 最后(全局.EditSelectIdArray));
    }
}

规则 ("Editor | Create Cp/Orb") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        "Required for UpdateCache()"
        事件玩家 == 主机玩家;
        全局.EditorOn != 假;
        (主机玩家).editor_lock == 假;
        数组包含(数组(空, 1, 2, 4), (主机玩家).editor_modeSelect) == 真;
        按钮被按下(主机玩家, 按钮(互动)) == 真;
        按钮被按下(主机玩家, 按钮(主要攻击模式)) == 真;
    }
    动作 {
        设置玩家变量(主机玩家, editor_lock, 真);
        If(非((主机玩家).editor_modeSelect));
            If(与(数量(全局.A), 比较(相距距离(主机玩家, 数组中的值(全局.A, (主机玩家).checkpoint_current)), <=, 1.4)));
                小字体信息(主机玩家, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("   放置的检查点距离太近"), 自定义字符串("   Cannot Place Checkpoint Too Close.")));
            Else;
                "$$"
                If(比较((主机玩家).checkpoint_current, >=, 减(数量(全局.A), 真)));
                    设置玩家变量(主机玩家, checkpoint_current, 减(数量(全局.A), 真));
                End;
                If(比较((主机玩家).checkpoint_current, ==, 减(数量(全局.A), 真)));
                    修改全局变量(A, 添加至数组, 所选位置(主机玩家));
                    修改玩家变量(主机玩家, checkpoint_current, 加, 真);
                Else;
                    修改全局变量(A, 添加至数组, 所选位置(主机玩家));
                    设置全局变量(A, 映射的数组(全局.A, If-Then-Else(比较(当前数组索引, <, 加((主机玩家).checkpoint_current, 真)), 当前数组元素, If-Then-Else(比较(当前数组索引, ==, 加((主机玩家).checkpoint_current, 真)), 最后(全局.A), 数组中的值(全局.A, 减(当前数组索引, 真))))));
                    修改玩家变量(主机玩家, checkpoint_current, 加, 真);
                    设置全局变量(killballnumber, 映射的数组(全局.killballnumber, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                    设置全局变量(pinballnumber, 映射的数组(全局.pinballnumber, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                    设置全局变量(CustomPortalCP, 映射的数组(全局.CustomPortalCP, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                    设置全局变量(Dao, 映射的数组(全局.Dao, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                    设置全局变量(SHIFT, 映射的数组(全局.SHIFT, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                    设置全局变量(BanMulti, 映射的数组(全局.BanMulti, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                    设置全局变量(BanCreate, 映射的数组(全局.BanCreate, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                    设置全局变量(BanStand, 映射的数组(全局.BanStand, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                    设置全局变量(BanDead, 映射的数组(全局.BanDead, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                    设置全局变量(BanEmote, 映射的数组(全局.BanEmote, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                    设置全局变量(BanClimb, 映射的数组(全局.BanClimb, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                    设置全局变量(BanSaveDouble, 映射的数组(全局.BanSaveDouble, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                    设置全局变量(BanBhop, 映射的数组(全局.BanBhop, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                    设置全局变量(BanDjump, 映射的数组(全局.BanDjump, 加(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
                End;
                调用子程序(UpdateCache);
                小字体信息(主机玩家, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("   新检查点已创建"), 自定义字符串("   New Checkpoint Created")));
            End;
        Else If(非(数量(全局.A)));
            小字体信息(主机玩家, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("   请先放置检查点"), 自定义字符串("   Make A Checkpoint First")));
        Else If(比较(加(加(数量(全局.TQ), 数量(全局.H)), 数量(全局.CustomPortalStart)), >=, 193));
            大字体信息(主机玩家, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("当前地图弹球/传送门数量已达上限"), 自定义字符串("Orb/Portal Limit Reached For This Map")));
        Else If(比较((主机玩家).editor_modeSelect, ==, 1));
            修改全局变量(H, 添加至数组, 所选位置(主机玩家));
            修改全局变量(killballnumber, 添加至数组, (主机玩家).checkpoint_current);
            修改全局变量(I, 添加至数组, 5);
            "to create the fx properly"
            调用子程序(EditUpdateSelectedIds);
            调用子程序(EditorSelectLast);
            创建效果(已过滤的数组(所有玩家(所有队伍), 比较((当前数组元素).checkpoint_current, ==, 数组中的值(全局.killballnumber, 单次赋值(全局.EditSelected)))), 球体, 数组中的值(全局.ColorConfig, 14), 数组中的值(全局.H, 单次赋值(全局.EditSelected)), 绝对值(数组中的值(全局.I, 单次赋值(全局.EditSelected))), 可见，位置和半径);
            修改全局变量(K, 添加至数组, 最后创建的实体);
            大字体信息(首个(真), 自定义字符串("{0} {1}", If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("新击杀球已创建! \\n仅生效于检查点"), 自定义字符串("New boundary Sphere Created! \\nOnly Valid For This Checkpoint")), (主机玩家).checkpoint_current));
            等待直到 (非(与(按钮被按下(主机玩家, 按钮(互动)), 按钮被按下(主机玩家, 按钮(主要攻击模式)))), 真);
            "EditUpdateSelectedIds() # to arrow during the placement properly"
            While(与(按钮被按下(主机玩家, 按钮(互动)), 按钮被按下(主机玩家, 按钮(主要攻击模式))));
                在索引处设置全局变量(H, 全局.EditSelected, 射线命中位置(眼睛位置(主机玩家), 加(眼睛位置(主机玩家), 乘(面朝方向(主机玩家), 8)), 空, 空, 假));
                等待(假, 无视条件);
            End;
            "UpdateCache()"
            设置全局变量(EditorMoveItem, 真);
        Else If(比较((主机玩家).editor_modeSelect, ==, 2));
            修改全局变量(TQ, 添加至数组, 所选位置(主机玩家));
            修改全局变量(pinballnumber, 添加至数组, (主机玩家).checkpoint_current);
            修改全局变量(EditMode, 添加至数组, 10);
            修改全局变量(TQ5, 添加至数组, 假);
            修改全局变量(TQ6, 添加至数组, 假);
            修改全局变量(BounceToggleLock, 添加至数组, 假);
            调用子程序(EditUpdateSelectedIds);
            调用子程序(EditorSelectLast);
            创建效果(已过滤的数组(添加至数组(所有玩家(所有队伍), 空), 与(比较((当前数组元素).checkpoint_current, ==, 数组中的值(全局.pinballnumber, 单次赋值(全局.EditSelected))), 非(数组包含((当前数组元素).cache_collectedLocks, 单次赋值(全局.EditSelected))))), 球, If-Then-Else(数组中的值(全局.BounceToggleLock, 单次赋值(全局.EditSelected)), 数组中的值(全局.ColorConfig, 16), 数组中的值(全局.ColorConfig, 15)), 数组中的值(全局.TQ, 单次赋值(全局.EditSelected)), 真, 可见，位置，半径和颜色);
            修改全局变量(TQ2, 添加至数组, 最后创建的实体);
            大字体信息(首个(真), 自定义字符串("{0} {1}", If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("新弹球已创建! \\n仅生效于检查点"), 自定义字符串("New Bounce Orb Created! \\nOnly Valid For This Checkpoint")), (主机玩家).checkpoint_current));
            等待直到 (非(与(按钮被按下(主机玩家, 按钮(互动)), 按钮被按下(主机玩家, 按钮(主要攻击模式)))), 真);
            While(与(按钮被按下(主机玩家, 按钮(互动)), 按钮被按下(主机玩家, 按钮(主要攻击模式))));
                在索引处设置全局变量(TQ, 全局.EditSelected, 射线命中位置(眼睛位置(主机玩家), 加(眼睛位置(主机玩家), 乘(面朝方向(主机玩家), 7)), 空, 空, 假));
                等待(假, 无视条件);
            End;
            "UpdateCache()"
            设置全局变量(EditorMoveItem, 真);
        Else If(比较((主机玩家).editor_modeSelect, ==, 4));
            修改全局变量(CustomPortalStart, 添加至数组, 所选位置(主机玩家));
            修改全局变量(CustomPortalEndpoint, 添加至数组, 加(所选位置(主机玩家), 乘(10, 上)));
            修改全局变量(CustomPortalCP, 添加至数组, (主机玩家).checkpoint_current);
            调用子程序(EditUpdateSelectedIds);
            调用子程序(EditorSelectLast);
            创建效果(已过滤的数组(所有玩家(所有队伍), 或(比较(数组中的值(全局.CustomPortalCP, 单次赋值(全局.EditSelected)), ==, (当前数组元素).checkpoint_current), 比较(数组中的值(全局.CustomPortalCP, 单次赋值(全局.EditSelected)), <, 空))), 有益光环, 数组中的值(全局.ColorConfig, 17), 数组中的值(全局.CustomPortalStart, 单次赋值(全局.EditSelected)), 0.6, 可见，位置，半径和颜色);
            修改全局变量(PortalEffects, 添加至数组, 最后创建的实体);
            设置全局变量(EditSelected, 减(数量(全局.CustomPortalStart), 真));
            等待直到 (非(与(按钮被按下(主机玩家, 按钮(互动)), 按钮被按下(主机玩家, 按钮(主要攻击模式)))), 真);
            "EditUpdateSelectedIds()"
            While(与(按钮被按下(主机玩家, 按钮(互动)), 按钮被按下(主机玩家, 按钮(主要攻击模式))));
                在索引处设置全局变量(CustomPortalStart, 全局.EditSelected, 射线命中位置(眼睛位置(主机玩家), 加(眼睛位置(主机玩家), 乘(面朝方向(主机玩家), 6)), 空, 空, 假));
                等待(假, 无视条件);
            End;
            大字体信息(首个(真), If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("新传送门已创建!\\n生效于当前检查点"), 自定义字符串("Portal Created \\nOnly Valid For This Checkpoint")));
            设置全局变量(EditorMoveItem, 真);
        End;
        设置玩家变量(主机玩家, editor_lock, 假);
        等待(0.64, 无视条件);
    }
}

规则 ("Editor | Delete Cp/Orb/Portal") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        "Required for UpdateCache()"
        事件玩家 == 主机玩家;
        全局.EditorOn != 假;
        (主机玩家).editor_lock == 假;
        按钮被按下(主机玩家, 按钮(互动)) == 真;
        按钮被按下(主机玩家, 按钮(辅助攻击模式)) == 真;
    }
    动作 {
        "@Condition EditorMoveItem == false\\n@Condition len(EditSelectIdArray) > 0"
        设置玩家变量(主机玩家, editor_lock, 真);
        If(与(非((主机玩家).editor_modeSelect), 数量(全局.A)));
            "Resync Kill Orbs =================="
            设置玩家变量(主机玩家, editor_temp, 已过滤的数组(映射的数组(全局.killballnumber, If-Then-Else(比较(当前数组元素, ==, (主机玩家).checkpoint_current), 当前数组索引, -1)), 比较(当前数组元素, >=, 空)));
            "hostPlayer.editor_temp = [i for e, i in KillballCheckpoints if e == hostPlayer.checkpoint_current]"
            For 全局变量(NANBA, 0, 数量((主机玩家).editor_temp), 真);
                消除效果(数组中的值(全局.K, 数组中的值((主机玩家).editor_temp, 全局.NANBA)));
                修改全局变量(K, 根据索引从数组中移除, 数组中的值((主机玩家).editor_temp, 全局.NANBA));
                等待(假, 无视条件);
            End;
            修改全局变量(killballnumber, 根据值从数组中移除, (主机玩家).checkpoint_current);
            "Decrement checkpoints after removed one"
            设置全局变量(killballnumber, 映射的数组(全局.killballnumber, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >, (主机玩家).checkpoint_current), 1, 空))));
            "Remove Radii at Checkpoint indexes (temp)"
            设置全局变量(I, 已过滤的数组(全局.I, 非(数组包含((主机玩家).editor_temp, 当前数组索引))));
            设置全局变量(H, 已过滤的数组(全局.H, 非(数组包含((主机玩家).editor_temp, 当前数组索引))));
            "Resync Bounce Orbs =============="
            设置玩家变量(主机玩家, editor_temp, 已过滤的数组(映射的数组(全局.pinballnumber, If-Then-Else(比较(当前数组元素, ==, (主机玩家).checkpoint_current), 当前数组索引, -1)), 比较(当前数组元素, >=, 空)));
            "hostPlayer.editor_temp = [i for e, i in BouncePadCheckpoints if e == hostPlayer.checkpoint_current]"
            For 全局变量(NANBA, 0, 数量((主机玩家).editor_temp), 真);
                消除效果(数组中的值(全局.TQ2, 数组中的值((主机玩家).editor_temp, 全局.NANBA)));
                修改全局变量(TQ2, 根据索引从数组中移除, 数组中的值((主机玩家).editor_temp, 全局.NANBA));
                等待(假, 无视条件);
            End;
            修改全局变量(pinballnumber, 根据值从数组中移除, (主机玩家).checkpoint_current);
            "Decrement checkpoints after removed one"
            设置全局变量(pinballnumber, 映射的数组(全局.pinballnumber, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >, (主机玩家).checkpoint_current), 1, 空))));
            设置全局变量(TQ, 已过滤的数组(全局.TQ, 非(数组包含((主机玩家).editor_temp, 当前数组索引))));
            设置全局变量(EditMode, 已过滤的数组(全局.EditMode, 非(数组包含((主机玩家).editor_temp, 当前数组索引))));
            设置全局变量(TQ5, 已过滤的数组(全局.TQ5, 非(数组包含((主机玩家).editor_temp, 当前数组索引))));
            设置全局变量(TQ6, 已过滤的数组(全局.TQ6, 非(数组包含((主机玩家).editor_temp, 当前数组索引))));
            设置全局变量(BounceToggleLock, 已过滤的数组(全局.BounceToggleLock, 非(数组包含((主机玩家).editor_temp, 当前数组索引))));
            "Resync custom portals =================="
            设置玩家变量(主机玩家, editor_temp, 已过滤的数组(映射的数组(全局.CustomPortalCP, If-Then-Else(比较(当前数组元素, ==, (主机玩家).checkpoint_current), 当前数组索引, -1)), 比较(当前数组元素, >=, 空)));
            For 全局变量(NANBA, 0, 数量((主机玩家).editor_temp), 真);
                消除效果(数组中的值(全局.PortalEffects, 数组中的值((主机玩家).editor_temp, 全局.NANBA)));
                修改全局变量(PortalEffects, 根据索引从数组中移除, 数组中的值((主机玩家).editor_temp, 全局.NANBA));
                等待(假, 无视条件);
            End;
            修改全局变量(CustomPortalCP, 根据值从数组中移除, (主机玩家).checkpoint_current);
            "Decrement checkpoints after removed one"
            设置全局变量(CustomPortalCP, 映射的数组(全局.CustomPortalCP, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >, (主机玩家).checkpoint_current), 1, 空))));
            "Remove Radii at Checkpoint indexes (temp)"
            设置全局变量(CustomPortalStart, 已过滤的数组(全局.CustomPortalStart, 非(数组包含((主机玩家).editor_temp, 当前数组索引))));
            设置全局变量(CustomPortalEndpoint, 已过滤的数组(全局.CustomPortalEndpoint, 非(数组包含((主机玩家).editor_temp, 当前数组索引))));
            设置玩家变量(主机玩家, editor_temp, 空);
            修改全局变量(Dao, 根据值从数组中移除, (主机玩家).checkpoint_current);
            设置全局变量(Dao, 映射的数组(全局.Dao, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
            修改全局变量(SHIFT, 根据值从数组中移除, (主机玩家).checkpoint_current);
            设置全局变量(SHIFT, 映射的数组(全局.SHIFT, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
            修改全局变量(BanMulti, 根据值从数组中移除, (主机玩家).checkpoint_current);
            设置全局变量(BanMulti, 映射的数组(全局.BanMulti, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
            修改全局变量(BanCreate, 根据值从数组中移除, (主机玩家).checkpoint_current);
            设置全局变量(BanCreate, 映射的数组(全局.BanCreate, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
            修改全局变量(BanStand, 根据值从数组中移除, (主机玩家).checkpoint_current);
            设置全局变量(BanStand, 映射的数组(全局.BanStand, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
            修改全局变量(BanDead, 根据值从数组中移除, (主机玩家).checkpoint_current);
            设置全局变量(BanDead, 映射的数组(全局.BanDead, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
            修改全局变量(BanEmote, 根据值从数组中移除, (主机玩家).checkpoint_current);
            设置全局变量(BanEmote, 映射的数组(全局.BanEmote, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
            修改全局变量(BanClimb, 根据值从数组中移除, (主机玩家).checkpoint_current);
            设置全局变量(BanClimb, 映射的数组(全局.BanClimb, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
            修改全局变量(BanSaveDouble, 根据值从数组中移除, (主机玩家).checkpoint_current);
            设置全局变量(BanSaveDouble, 映射的数组(全局.BanSaveDouble, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
            修改全局变量(BanBhop, 根据值从数组中移除, (主机玩家).checkpoint_current);
            设置全局变量(BanBhop, 映射的数组(全局.BanBhop, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
            修改全局变量(BanDjump, 根据值从数组中移除, (主机玩家).checkpoint_current);
            设置全局变量(BanDjump, 映射的数组(全局.BanDjump, 减(当前数组元素, If-Then-Else(比较(当前数组元素, >=, (主机玩家).checkpoint_current), 1, 空))));
            修改全局变量(A, 根据索引从数组中移除, (主机玩家).checkpoint_current);
            修改全局变量(C, 根据索引从数组中移除, (主机玩家).checkpoint_current);
            设置玩家变量(主机玩家, checkpoint_current, 较大(减((主机玩家).checkpoint_current, 真), 假));
            调用子程序(RebuildKillOrbs);
            调用子程序(RebuildBounceOrbs);
            调用子程序(RebuildPortals);
            小字体信息(主机玩家, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("   检查点已删除"), 自定义字符串("   Checkpoint Has Been Deleted")));
        Else If(与(比较((主机玩家).editor_modeSelect, ==, 1), 数量(全局.EditSelectIdArray)));
            修改全局变量(H, 根据索引从数组中移除, 全局.EditSelected);
            修改全局变量(I, 根据索引从数组中移除, 全局.EditSelected);
            修改全局变量(killballnumber, 根据索引从数组中移除, 全局.EditSelected);
            消除效果(数组中的值(全局.K, 全局.EditSelected));
            修改全局变量(K, 根据索引从数组中移除, 全局.EditSelected);
            调用子程序(RebuildKillOrbs);
        Else If(与(比较((主机玩家).editor_modeSelect, ==, 2), 数量(全局.EditSelectIdArray)));
            修改全局变量(TQ, 根据索引从数组中移除, 全局.EditSelected);
            修改全局变量(EditMode, 根据索引从数组中移除, 全局.EditSelected);
            修改全局变量(TQ5, 根据索引从数组中移除, 全局.EditSelected);
            修改全局变量(TQ6, 根据索引从数组中移除, 全局.EditSelected);
            修改全局变量(BounceToggleLock, 根据索引从数组中移除, 全局.EditSelected);
            消除效果(数组中的值(全局.TQ2, 全局.EditSelected));
            修改全局变量(TQ2, 根据索引从数组中移除, 全局.EditSelected);
            修改全局变量(pinballnumber, 根据索引从数组中移除, 全局.EditSelected);
            调用子程序(RebuildBounceOrbs);
        Else If(与(比较((主机玩家).editor_modeSelect, ==, 4), 数量(全局.EditSelectIdArray)));
            消除效果(数组中的值(全局.PortalEffects, 全局.EditSelected));
            等待(假, 无视条件);
            修改全局变量(CustomPortalStart, 根据索引从数组中移除, 全局.EditSelected);
            修改全局变量(CustomPortalEndpoint, 根据索引从数组中移除, 全局.EditSelected);
            修改全局变量(CustomPortalCP, 根据索引从数组中移除, 全局.EditSelected);
            修改全局变量(PortalEffects, 根据索引从数组中移除, 全局.EditSelected);
            调用子程序(RebuildPortals);
        Else;
            设置玩家变量(主机玩家, editor_lock, 假);
            等待(假, 无视条件);
            中止;
        End;
        调用子程序(UpdateCache);
        调用子程序(EditorSelectLast);
        设置玩家变量(主机玩家, editor_lock, 假);
        等待(加(0.16, 乘(实体数量, 0.007)), 无视条件);
    }
}

规则 ("Editor | Toggle Orb Functions") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        "Required for UpdateCache()"
        事件玩家 == 主机玩家;
        全局.EditorOn != 假;
        (主机玩家).editor_modeSelect == 2;
        (主机玩家).editor_lock == 假;
        数量(全局.EditSelectIdArray) > 空;
        按钮被按下(主机玩家, 按钮(终极技能)) == 真;
        或(或(按钮被按下(主机玩家, 按钮(主要攻击模式)), 按钮被按下(主机玩家, 按钮(辅助攻击模式))), 按钮被按下(主机玩家, 按钮(技能2))) == 真;
    }
    动作 {
        设置玩家变量(主机玩家, editor_lock, 真);
        If(按钮被按下(主机玩家, 按钮(主要攻击模式)));
            在索引处设置全局变量(TQ5, 全局.EditSelected, 非(数组中的值(全局.TQ5, 全局.EditSelected)));
        Else If(按钮被按下(主机玩家, 按钮(辅助攻击模式)));
            在索引处设置全局变量(TQ6, 全局.EditSelected, 非(数组中的值(全局.TQ6, 全局.EditSelected)));
        Else;
            在索引处设置全局变量(BounceToggleLock, 全局.EditSelected, 非(数组中的值(全局.BounceToggleLock, 全局.EditSelected)));
            在索引处设置全局变量(EditMode, 全局.EditSelected, 乘(10, 非(数组中的值(全局.BounceToggleLock, 全局.EditSelected))));
        End;
        调用子程序(UpdateCache);
        设置玩家变量(主机玩家, editor_lock, 假);
        等待(假, 无视条件);
    }
}

规则 ("Editor | Orb Radii/Strength") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        "Required for UpdateCache()"
        事件玩家 == 主机玩家;
        全局.EditorOn != 假;
        数组包含(数组(1, 2), (主机玩家).editor_modeSelect) == 真;
        (主机玩家).editor_lock == 假;
        数量(全局.EditSelectIdArray) > 空;
        按钮被按下(主机玩家, 按钮(技能2)) == 真;
        按钮被按下(主机玩家, 按钮(跳跃)) != 按钮被按下(主机玩家, 按钮(蹲下));
        按钮被按下(主机玩家, 按钮(互动)) == 假;
    }
    动作 {
        设置玩家变量(主机玩家, editor_lock, 真);
        While(与(按钮被按下(主机玩家, 按钮(技能2)), 或(按钮被按下(主机玩家, 按钮(跳跃)), 按钮被按下(主机玩家, 按钮(蹲下)))));
            If(与(比较((主机玩家).editor_modeSelect, ==, 2), 数量((主机玩家).editor_bounceIndex)));
                在索引处修改全局变量(EditMode, 全局.EditSelected, 加, If-Then-Else(按钮被按下(主机玩家, 按钮(跳跃)), 0.1, -0.1));
            Else If(与(比较((主机玩家).editor_modeSelect, ==, 1), 数量((主机玩家).editor_killIndex)));
                在索引处修改全局变量(I, 全局.EditSelected, 加, If-Then-Else(按钮被按下(主机玩家, 按钮(跳跃)), 0.1, -0.1));
            End;
            等待(0.1, 无视条件);
        End;
        调用子程序(UpdateCache);
        设置玩家变量(主机玩家, editor_lock, 假);
    }
}

规则 ("Editor | Select Orb/Portal") {
    事件 {
        持续 - 全局;
    }
    条件 {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        全局.EditorOn != 假;
        数组包含(数组(1, 2, 4), (主机玩家).editor_modeSelect) == 真;
        (主机玩家).editor_lock == 假;
        数量(全局.EditSelectIdArray) > 空;
        按钮被按下(主机玩家, 按钮(互动)) == 真;
        或(按钮被按下(主机玩家, 按钮(蹲下)), 按钮被按下(主机玩家, 按钮(跳跃))) == 真;
    }
    动作 {
        设置玩家变量(主机玩家, editor_lock, 真);
        If(按钮被按下(主机玩家, 按钮(蹲下)));
            设置全局变量(EditSelected, If-Then-Else(数组值的索引(全局.EditSelectIdArray, 全局.EditSelected), 数组中的值(全局.EditSelectIdArray, 减(数组值的索引(全局.EditSelectIdArray, 全局.EditSelected), 真)), 最后(全局.EditSelectIdArray)));
        Else;
            设置全局变量(EditSelected, If-Then-Else(比较(数组值的索引(全局.EditSelectIdArray, 全局.EditSelected), ==, 减(数量(全局.EditSelectIdArray), 真)), 首个(全局.EditSelectIdArray), 数组中的值(全局.EditSelectIdArray, 加(数组值的索引(全局.EditSelectIdArray, 全局.EditSelected), 真))));
        End;
        等待(假, 无视条件);
        设置玩家变量(主机玩家, editor_lock, 假);
        等待直到 (非(与(按钮被按下(主机玩家, 按钮(互动)), 或(按钮被按下(主机玩家, 按钮(蹲下)), 按钮被按下(主机玩家, 按钮(跳跃))))), 0.24);
    }
}

规则 ("Editor | Cp Size Hitbox Display") {
    事件 {
        持续 - 全局;
    }
    条件 {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        全局.EditorOn != 假;
        (主机玩家).editor_modeSelect == 空;
        按钮被按下(主机玩家, 按钮(互动)) == 真;
        按钮被按下(主机玩家, 按钮(技能1)) == 真;
    }
    动作 {
        设置玩家变量(主机玩家, editor_hitboxToggle, 非((主机玩家).editor_hitboxToggle));
        等待(假, 无视条件);
    }
}

规则 ("Editor | Cp Add/Remove Teleport") {
    事件 {
        持续 - 全局;
    }
    条件 {
        全局.EditorOn != 假;
        (主机玩家).editor_modeSelect == 空;
        (主机玩家).editor_lock == 假;
        数量(全局.A) > 真;
        按钮被按下(主机玩家, 按钮(互动)) == 真;
        按钮被按下(主机玩家, 按钮(装填)) == 真;
        按钮被按下(主机玩家, 按钮(近身攻击)) == 假;
    }
    动作 {
        "prevent overlap with save map"
        等待直到 (或(按钮被按下(主机玩家, 按钮(近身攻击)), 非(与(按钮被按下(主机玩家, 按钮(互动)), 按钮被按下(主机玩家, 按钮(装填))))), 真);
        根据条件中止(或(按钮被按下(主机玩家, 按钮(近身攻击)), 与(按钮被按下(主机玩家, 按钮(互动)), 按钮被按下(主机玩家, 按钮(装填)))));
        设置玩家变量(主机玩家, editor_lock, 真);
        If(非((主机玩家).checkpoint_current));
            小字体信息(主机玩家, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("   不能在第一个检查点设置传送门"), 自定义字符串("   Cannot Place A Teleport On First Checkpoint")));
            设置玩家变量(主机玩家, editor_lock, 假);
            中止;
        End;
        "remove"
        If(比较(数量(数组中的值(全局.A, (主机玩家).checkpoint_current)), >, 1));
            在索引处设置全局变量(A, (主机玩家).checkpoint_current, 首个(数组中的值(全局.A, (主机玩家).checkpoint_current)));
            小字体信息(主机玩家, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("   关卡{0}的传送点已移除", (主机玩家).checkpoint_current), 自定义字符串("   Teleport For Level {0} Has Been Removed", (主机玩家).checkpoint_current)));
        "add"
        Else;
            在索引处设置全局变量(A, (主机玩家).checkpoint_current, 数组(If-Then-Else(数量(数组中的值(全局.A, (主机玩家).checkpoint_current)), 首个(数组中的值(全局.A, (主机玩家).checkpoint_current)), 数组中的值(全局.A, (主机玩家).checkpoint_current)), 所选位置(主机玩家)));
            小字体信息(主机玩家, 自定义字符串("{0} {1}", If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("   传送点已添加到当前关卡"), 自定义字符串("   Teleport Has Been Added For Level")), (主机玩家).checkpoint_current));
        End;
        设置玩家变量(主机玩家, editor_lock, 假);
        等待(假, 无视条件);
    }
}

规则 ("Editor | Moving Checkpoint") {
    事件 {
        持续 - 全局;
    }
    条件 {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        全局.EditorOn != 假;
        (主机玩家).editor_modeSelect == 空;
        (主机玩家).editor_lock == 假;
        数量(全局.A) > 空;
        按钮被按下(主机玩家, 按钮(技能2)) == 真;
        按钮被按下(主机玩家, 按钮(辅助攻击模式)) == 假;
    }
    动作 {
        等待(0.3, 当为“假”时中止);
        If((主机玩家).addon_toggle3rdPov);
            设置玩家变量(主机玩家, addon_toggle3rdPov, 假);
        End;
        设置玩家变量(主机玩家, editor_lock, 真);
        设置玩家变量(主机玩家, editor_undo, 数组中的值(全局.A, (主机玩家).checkpoint_current));
        开始镜头(主机玩家, 减(加(眼睛位置(主机玩家), 乘(0.5, 上)), 乘(2.5, 面朝方向(主机玩家))), 眼睛位置(主机玩家), 15);
        While(与(与(按钮被按下(主机玩家, 按钮(技能2)), 存活(主机玩家)), 非(按钮被按下(主机玩家, 按钮(辅助攻击模式)))));
            If(按钮被按下(主机玩家, 按钮(主要攻击模式)));
                设置移动速度(主机玩家, 100);
            Else;
                设置移动速度(主机玩家, 3);
            End;
            If(数量(数组中的值(全局.A, (主机玩家).checkpoint_current)));
                在索引处设置全局变量(A, (主机玩家).checkpoint_current, 数组(所选位置(主机玩家), 数组中的值(数组中的值(全局.A, (主机玩家).checkpoint_current), 真)));
            Else;
                在索引处设置全局变量(A, (主机玩家).checkpoint_current, 所选位置(主机玩家));
            End;
            等待(假, 无视条件);
        End;
        停止镜头(主机玩家);
        设置移动速度(主机玩家, 100);
        If(按钮被按下(主机玩家, 按钮(技能2)));
            在索引处设置全局变量(A, (主机玩家).checkpoint_current, (主机玩家).editor_undo);
            等待直到 (非(按钮被按下(主机玩家, 按钮(技能2))), 999999999999);
        End;
        设置玩家变量(主机玩家, editor_lock, 假);
    }
}

规则 ("Editor | Toggle Ult/Dash") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        事件玩家 == 主机玩家;
        全局.EditorOn != 假;
        (主机玩家).editor_modeSelect == 空;
        (主机玩家).editor_lock == 假;
        数量(全局.A) > 空;
        按钮被按下(主机玩家, 按钮(主要攻击模式)) != 按钮被按下(主机玩家, 按钮(辅助攻击模式));
        按钮被按下(主机玩家, 按钮(终极技能)) == 真;
    }
    动作 {
        If(按钮被按下(主机玩家, 按钮(主要攻击模式)));
            If(数组包含(全局.Dao, (主机玩家).checkpoint_current));
                修改全局变量(Dao, 根据值从数组中移除, (主机玩家).checkpoint_current);
            Else;
                修改全局变量(Dao, 添加至数组, (主机玩家).checkpoint_current);
            End;
        Else;
            If(数组包含(全局.SHIFT, (主机玩家).checkpoint_current));
                修改全局变量(SHIFT, 根据值从数组中移除, (主机玩家).checkpoint_current);
            Else;
                修改全局变量(SHIFT, 添加至数组, (主机玩家).checkpoint_current);
            End;
        End;
        等待(假, 无视条件);
    }
}

规则 ("Editor | Toggle Bans") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        "Required for UpdateCache()"
        事件玩家 == 主机玩家;
        全局.EditorOn != 假;
        (主机玩家).editor_modeSelect == 3;
        (主机玩家).editor_lock == 假;
        数量(全局.A) > 空;
        或(或(或(按钮被按下(主机玩家, 按钮(主要攻击模式)), 按钮被按下(主机玩家, 按钮(辅助攻击模式))), 按钮被按下(主机玩家, 按钮(跳跃))), 按钮被按下(主机玩家, 按钮(蹲下))) == 真;
        或(按钮被按下(主机玩家, 按钮(互动)), 按钮被按下(主机玩家, 按钮(技能2))) == 真;
    }
    动作 {
        设置玩家变量(主机玩家, editor_lock, 真);
        If(按钮被按下(主机玩家, 按钮(互动)));
            If(按钮被按下(主机玩家, 按钮(主要攻击模式)));
                If(数组包含(全局.BanMulti, (主机玩家).checkpoint_current));
                    修改全局变量(BanMulti, 根据值从数组中移除, (主机玩家).checkpoint_current);
                Else;
                    修改全局变量(BanMulti, 添加至数组, (主机玩家).checkpoint_current);
                End;
            Else If(按钮被按下(主机玩家, 按钮(辅助攻击模式)));
                If(数组包含(全局.BanCreate, (主机玩家).checkpoint_current));
                    修改全局变量(BanCreate, 根据值从数组中移除, (主机玩家).checkpoint_current);
                Else;
                    修改全局变量(BanCreate, 添加至数组, (主机玩家).checkpoint_current);
                End;
            Else If(按钮被按下(主机玩家, 按钮(蹲下)));
                If(数组包含(全局.BanClimb, (主机玩家).checkpoint_current));
                    修改全局变量(BanClimb, 根据值从数组中移除, (主机玩家).checkpoint_current);
                Else;
                    修改全局变量(BanClimb, 添加至数组, (主机玩家).checkpoint_current);
                End;
            Else;
                If(数组包含(全局.BanSaveDouble, (主机玩家).checkpoint_current));
                    修改全局变量(BanSaveDouble, 根据值从数组中移除, (主机玩家).checkpoint_current);
                Else;
                    修改全局变量(BanSaveDouble, 添加至数组, (主机玩家).checkpoint_current);
                End;
            End;
        Else;
            If(按钮被按下(主机玩家, 按钮(主要攻击模式)));
                If(数组包含(全局.BanDead, (主机玩家).checkpoint_current));
                    修改全局变量(BanDead, 根据值从数组中移除, (主机玩家).checkpoint_current);
                Else;
                    修改全局变量(BanDead, 添加至数组, (主机玩家).checkpoint_current);
                End;
            Else If(按钮被按下(主机玩家, 按钮(辅助攻击模式)));
                If(数组包含(全局.BanEmote, (主机玩家).checkpoint_current));
                    修改全局变量(BanEmote, 根据值从数组中移除, (主机玩家).checkpoint_current);
                Else;
                    修改全局变量(BanEmote, 添加至数组, (主机玩家).checkpoint_current);
                End;
            Else If(按钮被按下(主机玩家, 按钮(蹲下)));
                If(数组包含(全局.BanStand, (主机玩家).checkpoint_current));
                    修改全局变量(BanStand, 根据值从数组中移除, (主机玩家).checkpoint_current);
                Else;
                    修改全局变量(BanStand, 添加至数组, (主机玩家).checkpoint_current);
                End;
            Else;
                If(数组包含(全局.BanBhop, (主机玩家).checkpoint_current));
                    修改全局变量(BanBhop, 根据值从数组中移除, (主机玩家).checkpoint_current);
                Else;
                    修改全局变量(BanBhop, 添加至数组, (主机玩家).checkpoint_current);
                End;
            End;
        End;
        "BanStand"
        等待(0.3, 无视条件);
        调用子程序(UpdateCache);
        设置玩家变量(主机玩家, editor_lock, 假);
    }
}

规则 ("Editor | Change Portal Cp") {
    事件 {
        持续 - 全局;
    }
    条件 {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        全局.EditorOn != 假;
        (主机玩家).editor_modeSelect == 4;
        (主机玩家).editor_lock == 假;
        数量(全局.EditSelectIdArray) > 空;
        按钮被按下(主机玩家, 按钮(跳跃)) == 真;
        按钮被按下(主机玩家, 按钮(技能2)) == 真;
    }
    动作 {
        在索引处设置全局变量(CustomPortalCP, 全局.EditSelected, If-Then-Else(比较(数组中的值(全局.CustomPortalCP, 全局.EditSelected), <, 空), (主机玩家).checkpoint_current, -1));
        等待(0.3, 无视条件);
    }
}

规则 ("Editor | Move Object") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        "Required for UpdateCache()"
        事件玩家 == 主机玩家;
        全局.EditorOn != 假;
        数组包含(数组(1, 2, 4), (主机玩家).editor_modeSelect) == 真;
        (主机玩家).editor_lock == 假;
        数量(全局.EditSelectIdArray) > 空;
        按钮被按下(主机玩家, 按钮(辅助攻击模式)) == 假;
        或(全局.EditorMoveItem, 与(按钮被按下(主机玩家, 按钮(主要攻击模式)), 按钮被按下(主机玩家, 按钮(技能2)))) == 真;
    }
    动作 {
        设置玩家变量(主机玩家, editor_lock, 真);
        设置全局变量(EditorMoveItem, 真);
        If((主机玩家).addon_toggle3rdPov);
            设置玩家变量(主机玩家, addon_toggle3rdPov, 假);
        End;
        "hostPlayer.editor_fly = null"
        等待直到 (非(或(按钮被按下(主机玩家, 按钮(主要攻击模式)), 按钮被按下(主机玩家, 按钮(技能2)))), 999999999999);
        "hostPlayer.disallowButton(Button.ULTIMATE)\\nhostPlayer.disallowButton(Button.JUMP)"
        设置状态(主机玩家, 空, 被入侵, 999999999999);
        设置移动速度(主机玩家, 假);
        "hostPlayer.startForcingPosition(hostPlayer.getPosition(), false)"
        If(比较((主机玩家).editor_modeSelect, ==, 1));
            设置玩家变量(主机玩家, editor_undo, 数组中的值(全局.H, 全局.EditSelected));
            开始镜头(主机玩家, 加(数组中的值(全局.H, 全局.EditSelected), 乘(面朝方向(主机玩家), 乘(绝对值(数组中的值(全局.I, 全局.EditSelected)), -1.5))), 数组中的值(全局.H, 全局.EditSelected), 30);
            While(非(或(按钮被按下(主机玩家, 按钮(主要攻击模式)), 按钮被按下(主机玩家, 按钮(辅助攻击模式)))));
                在索引处修改全局变量(H, 全局.EditSelected, 加, 乘(减(加(0.096, 乘(0.192, 按钮被按下(事件玩家, 按钮(跳跃)))), 乘(0.048, 按钮被按下(事件玩家, 按钮(蹲下)))), 加(加(乘(乘(面朝方向(事件玩家), Z方向分量(阈值(事件玩家))), 矢量(真, 非(按钮被按下(事件玩家, 按钮(技能1))), 真)), 地图矢量(乘(阈值(事件玩家), 左), 事件玩家, 旋转)), 乘(上, 减(按钮被按下(事件玩家, 按钮(技能2)), 按钮被按下(事件玩家, 按钮(终极技能)))))));
                等待(假, 无视条件);
            End;
        Else If(比较((主机玩家).editor_modeSelect, ==, 2));
            设置玩家变量(主机玩家, editor_undo, 数组中的值(全局.TQ, 全局.EditSelected));
            开始镜头(主机玩家, 加(数组中的值(全局.TQ, 全局.EditSelected), 乘(面朝方向(主机玩家), -4)), 数组中的值(全局.TQ, 全局.EditSelected), 30);
            While(非(或(按钮被按下(主机玩家, 按钮(主要攻击模式)), 按钮被按下(主机玩家, 按钮(辅助攻击模式)))));
                在索引处修改全局变量(TQ, 全局.EditSelected, 加, 乘(减(加(0.096, 乘(0.192, 按钮被按下(事件玩家, 按钮(跳跃)))), 乘(0.048, 按钮被按下(事件玩家, 按钮(蹲下)))), 加(加(乘(乘(面朝方向(事件玩家), Z方向分量(阈值(事件玩家))), 矢量(真, 非(按钮被按下(事件玩家, 按钮(技能1))), 真)), 地图矢量(乘(阈值(事件玩家), 左), 事件玩家, 旋转)), 乘(上, 减(按钮被按下(事件玩家, 按钮(技能2)), 按钮被按下(事件玩家, 按钮(终极技能)))))));
                等待(假, 无视条件);
            End;
        Else If(比较((主机玩家).editor_modeSelect, ==, 4));
            设置玩家变量(主机玩家, editor_undo, 数组(数组中的值(全局.CustomPortalStart, 全局.EditSelected), 数组中的值(全局.CustomPortalEndpoint, 全局.EditSelected)));
            "move start position"
            开始镜头(主机玩家, 加(数组中的值(全局.CustomPortalStart, 全局.EditSelected), 乘(面朝方向(主机玩家), -4)), 数组中的值(全局.CustomPortalStart, 全局.EditSelected), 30);
            While(非(或(按钮被按下(主机玩家, 按钮(主要攻击模式)), 按钮被按下(主机玩家, 按钮(辅助攻击模式)))));
                在索引处修改全局变量(CustomPortalStart, 全局.EditSelected, 加, 乘(减(加(0.096, 乘(0.192, 按钮被按下(事件玩家, 按钮(跳跃)))), 乘(0.048, 按钮被按下(事件玩家, 按钮(蹲下)))), 加(加(乘(乘(面朝方向(事件玩家), Z方向分量(阈值(事件玩家))), 矢量(真, 非(按钮被按下(事件玩家, 按钮(技能1))), 真)), 地图矢量(乘(阈值(事件玩家), 左), 事件玩家, 旋转)), 乘(上, 减(按钮被按下(事件玩家, 按钮(技能2)), 按钮被按下(事件玩家, 按钮(终极技能)))))));
                等待(假, 无视条件);
            End;
            "move destination"
            开始镜头(主机玩家, 加(数组中的值(全局.CustomPortalEndpoint, 全局.EditSelected), 乘(面朝方向(主机玩家), -4)), 数组中的值(全局.CustomPortalEndpoint, 全局.EditSelected), 30);
            等待直到 (或(非(按钮被按下(主机玩家, 按钮(主要攻击模式))), 按钮被按下(主机玩家, 按钮(辅助攻击模式))), 真);
            While(非(或(按钮被按下(主机玩家, 按钮(主要攻击模式)), 按钮被按下(主机玩家, 按钮(辅助攻击模式)))));
                在索引处修改全局变量(CustomPortalEndpoint, 全局.EditSelected, 加, 乘(减(加(0.096, 乘(0.192, 按钮被按下(事件玩家, 按钮(跳跃)))), 乘(0.048, 按钮被按下(事件玩家, 按钮(蹲下)))), 加(加(乘(乘(面朝方向(事件玩家), Z方向分量(阈值(事件玩家))), 矢量(真, 非(按钮被按下(事件玩家, 按钮(技能1))), 真)), 地图矢量(乘(阈值(事件玩家), 左), 事件玩家, 旋转)), 乘(上, 减(按钮被按下(事件玩家, 按钮(技能2)), 按钮被按下(事件玩家, 按钮(终极技能)))))));
                等待(假, 无视条件);
            End;
        End;
        If(按钮被按下(主机玩家, 按钮(辅助攻击模式)));
            跳过(乘(2, (主机玩家).editor_modeSelect));
        Else;
        Else;
            在索引处设置全局变量(H, 全局.EditSelected, (主机玩家).editor_undo);
        Else;
            在索引处设置全局变量(TQ, 全局.EditSelected, (主机玩家).editor_undo);
        Else;
        Else;
        Else;
            在索引处设置全局变量(CustomPortalStart, 全局.EditSelected, 首个((主机玩家).editor_undo));
            在索引处设置全局变量(CustomPortalEndpoint, 全局.EditSelected, 最后((主机玩家).editor_undo));
        End;
        设置玩家变量(主机玩家, editor_undo, 空);
        "hostPlayer.allowButton(Button.ULTIMATE)\\nhostPlayer.allowButton(Button.JUMP)"
        清除状态(主机玩家, 被入侵);
        停止镜头(主机玩家);
        设置移动速度(主机玩家, 100);
        "hostPlayer.stopForcingPosition()"
        设置全局变量(EditorMoveItem, 空);
        调用子程序(UpdateCache);
        等待直到 (非(按钮被按下(主机玩家, 按钮(主要攻击模式))), 真);
        设置玩家变量(主机玩家, editor_lock, 假);
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Commands ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("Command | Toggle Leaderboard (Hold Melee)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        数量(全局.LeaderBoardFull) > 空;
        全局.EditorOn == 假;
        按钮被按下(事件玩家, 按钮(近身攻击)) == 真;
    }
    动作 {
        等待(真, 当为“假”时中止);
        设置玩家变量(事件玩家, toggle_leaderboard, 非((事件玩家).toggle_leaderboard));
    }
}

规则 ("Command | Split hide (Hold Dash + Primary + Secondary)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        按钮被按下(事件玩家, 按钮(技能1)) == 真;
        按钮被按下(事件玩家, 按钮(主要攻击模式)) == 真;
        按钮被按下(事件玩家, 按钮(辅助攻击模式)) == 真;
    }
    动作 {
        等待(真, 当为“假”时中止);
        设置玩家变量(事件玩家, timer_splitDisplay, If-Then-Else(比较((事件玩家).timer_splitDisplay, <=, -999999999999), 空, -999999999999));
        播放效果(事件玩家, 正面状态施加声音, 空, 事件玩家, 100);
        "$$ Language"
        小字体信息(事件玩家, If-Then-Else(比较((事件玩家).timer_splitDisplay, <=, -999999999999), 自定义字符串("   Split Display Off"), 自定义字符串("   Split Display On")));
        等待(0.32, 无视条件);
    }
}

规则 ("Command | Toggle Invisible (Hold Deflect)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        按钮被按下(事件玩家, 按钮(技能2)) == 真;
        全局.EditorOn == 假;
        全局.CompMode == 假;
    }
    动作 {
        等待(真, 当为“假”时中止);
        设置玩家变量(事件玩家, toggle_invisible, 非((事件玩家).toggle_invisible));
        设置不可见(事件玩家, 无);
        If((事件玩家).toggle_invisible);
            设置不可见(事件玩家, 全部);
        End;
        小字体信息(事件玩家, 自定义字符串("  {0}{1}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒInvisibleInvisibleInvisible"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), If-Then-Else((事件玩家).toggle_invisible, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ | On | On | On"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ | Off | Off | Off"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))))));
        "\\"   {0} {1}\\".format(\\"隐身模式\\" checkCN \\"Invisible\\", \\"On\\" if eventPlayer.toggle_invisible else \\"Off\\"))"
        播放效果(事件玩家, 负面状态施加声音, 空, 事件玩家, 100);
    }
}

规则 ("Command | Preview Orbs & Portals (Hold Primary + Secondary)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        "@Condition EditorOn == false"
        (事件玩家).lockState == 假;
        (事件玩家).checkpoint_notLast != 假;
        按钮被按下(事件玩家, 按钮(主要攻击模式)) == 真;
        按钮被按下(事件玩家, 按钮(辅助攻击模式)) == 真;
    }
    动作 {
        "wait(0.9, Wait.ABORT_WHEN_FALSE)"
        等待(0.45, 当为“假”时中止);
        设置玩家变量(事件玩家, preview_array1, 数组(首个(数组中的值(全局.A, 加((事件玩家).checkpoint_current, 真)))));
        If(数量(全局.pinballnumber));
            修改玩家变量(事件玩家, preview_array1, 添加至数组, 已过滤的数组(全局.TQ, 比较(数组中的值(全局.pinballnumber, 当前数组索引), ==, (事件玩家).checkpoint_current)));
            修改玩家变量(事件玩家, preview_array2, 添加至数组, 已过滤的数组(映射的数组(全局.pinballnumber, 当前数组索引), 比较(数组中的值(全局.pinballnumber, 当前数组元素), ==, (事件玩家).checkpoint_current)));
        End;
        If(数量(全局.CustomPortalStart));
            "eventPlayer.preview_array1.append( [i for i in CustomPortalStart if CustomPortalCP[CustomPortalStart.index(i)] == eventPlayer.checkpoint_current] )"
            For 玩家变量(事件玩家, preview_i, 0, 数量((事件玩家).cache_portalStart), 真);
                修改玩家变量(事件玩家, preview_array1, 添加至数组, 数组(数组中的值((事件玩家).cache_portalStart, (事件玩家).preview_i), 数组中的值((事件玩家).cache_portalEnd, (事件玩家).preview_i)));
                修改玩家变量(事件玩家, preview_array2, 添加至数组, 数组(数组((事件玩家).preview_i, 假), 数组((事件玩家).preview_i, 真)));
            End;
        End;
        等待(假, 无视条件);
        设置玩家变量(事件玩家, preview_i, 空);
        If((事件玩家).addon_toggle3rdPov);
            设置玩家变量(事件玩家, addon_toggle3rdPov, 假);
        End;
        开始镜头(事件玩家, 减(加(数组中的值((事件玩家).preview_array1, (事件玩家).preview_i), 上), 乘(减(3.5, 乘(3, Z方向分量(阈值(事件玩家)))), 面朝方向(事件玩家))), 加(数组中的值((事件玩家).preview_array1, (事件玩家).preview_i), 上), 15);
        设置移动速度(事件玩家, 假);
        设置主要攻击模式启用(事件玩家, 假);
        设置辅助攻击模式启用(事件玩家, 假);
        禁用按钮(事件玩家, 按钮(技能1));
        禁用按钮(事件玩家, 按钮(跳跃));
        While(与(与(与(按钮被按下(事件玩家, 按钮(主要攻击模式)), 按钮被按下(事件玩家, 按钮(辅助攻击模式))), 存活(事件玩家)), 非((事件玩家).lockState)));
            If(比较(X方向分量(阈值(事件玩家)), <, -0.5));
                修改玩家变量(事件玩家, preview_i, 加, 真);
            Else If(比较(X方向分量(阈值(事件玩家)), >, 0.5));
                修改玩家变量(事件玩家, preview_i, 加, 减(数量((事件玩家).preview_array1), 真));
            End;
            修改玩家变量(事件玩家, preview_i, 余数, 数量((事件玩家).preview_array1));
            等待直到 (比较(绝对值(X方向分量(阈值(事件玩家))), <, 0.5), 真);
            等待(假, 无视条件);
        End;
        设置主要攻击模式启用(事件玩家, 真);
        设置辅助攻击模式启用(事件玩家, 真);
        可用按钮(事件玩家, 按钮(技能1));
        可用按钮(事件玩家, 按钮(跳跃));
        停止镜头(事件玩家);
        设置移动速度(事件玩家, 100);
        设置玩家变量(事件玩家, preview_i, 空);
        设置玩家变量(事件玩家, preview_array1, 空);
        设置玩家变量(事件玩家, preview_array2, 空);
    }
}

规则 ("Command | Restart Run (Crouch + Interact + Deflect)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        或(比较((事件玩家).editor_lock, ==, 假), 比较(事件玩家, !=, 主机玩家)) == 真;
        (事件玩家).lockState == 假;
        按钮被按下(事件玩家, 按钮(蹲下)) == 真;
        按钮被按下(事件玩家, 按钮(互动)) == 真;
        按钮被按下(事件玩家, 按钮(技能2)) == 真;
    }
    动作 {
        设置玩家变量(事件玩家, lockState, 真);
        If(全局.CompMode);
            等待(假, 无视条件);
            If(比较(全局.CompTime, <, 1));
                小字体信息(事件玩家, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("   比赛结束"), 自定义字符串("   Competition Is Over")));
                设置玩家变量(事件玩家, lockState, 假);
                中止;
            Else If((事件玩家).comp_done);
                设置玩家变量(事件玩家, lockState, 假);
                中止;
            Else If(与(全局.CompRestartLimit, (事件玩家).checkpoint_notLast));
                小字体信息(事件玩家, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("   禁止在此比赛中运行期间重新启动"), 自定义字符串("   Restart During Run Is Disabled For This Competition")));
                设置玩家变量(事件玩家, lockState, 假);
                中止;
            Else If(全局.CompAtmpNum);
                If(比较((事件玩家).comp_countAttempts, ==, 全局.CompAtmpNum));
                    小字体信息(事件玩家, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("   最后一次尝试"), 自定义字符串("   This Is Your Final Attempt")));
                    设置玩家变量(事件玩家, lockState, 假);
                    中止;
                End;
                If(比较((事件玩家).comp_countAttempts, <, 空));
                    小字体信息(事件玩家, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("   你没有尝试过"), 自定义字符串("   You Are Out Of Attempts")));
                    设置玩家变量(事件玩家, lockState, 假);
                    中止;
                End;
                修改玩家变量(事件玩家, comp_countAttempts, 加, 真);
                在索引处设置全局变量(CompAtmpSaveCount, 数组值的索引(全局.CompAtmpSaveNames, 字符串分割(首个(事件玩家), 空数组)), (事件玩家).comp_countAttempts);
            End;
        End;
        设置玩家变量(事件玩家, editor_fly, 空);
        设置玩家变量(事件玩家, checkpoint_current, 空);
        设置玩家变量(事件玩家, timer_splitDisplay, 乘(-999999999999, 比较((事件玩家).timer_splitDisplay, <=, -999999999999)));
        设置玩家变量(事件玩家, toggle_practice, 假);
        设置玩家变量(事件玩家, timer_practice, 空);
        停止追踪玩家变量(事件玩家, timer_practice);
        If(数组包含(全局.SaveEnt, 事件玩家));
            调用子程序(DeleteSave);
        End;
        If(死亡(事件玩家));
            "eventPlayer.respawn()"
            复活(事件玩家);
        End;
        调用子程序(StartGame);
        播放效果(事件玩家, 环状爆炸声音, 空, 事件玩家, 100);
        等待(全局.CompMode, 无视条件);
        "eventPlayer.allowButton(Button.ABILITY_1)"
        设置玩家变量(事件玩家, lockState, 假);
        "Anti spam"
        等待(0.096, 无视条件);
    }
}

规则 ("Command | Spectate (Hold Interact)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        按钮被按下(事件玩家, 按钮(互动)) == 真;
        按钮被按下(事件玩家, 按钮(技能2)) == 假;
        与(全局.EditorOn, 或(或(按钮被按下(事件玩家, 按钮(近身攻击)), 按钮被按下(事件玩家, 按钮(主要攻击模式))), 按钮被按下(事件玩家, 按钮(辅助攻击模式)))) == 假;
    }
    动作 {
        等待(真, 当为“假”时中止);
        "editor has interact combos"
        If(全局.EditorOn);
            等待(真, 当为“假”时中止);
        End;
        开启游戏预设复生模式(事件玩家);
        关闭游戏预设复生模式(事件玩家);
        If((事件玩家).toggle_spectate);
            复活(事件玩家);
            If((事件玩家).toggle_practice);
                追踪玩家变量频率(事件玩家, timer_practice, 999999999999, 真, 全部禁用);
            Else If((事件玩家).checkpoint_notLast);
                调用子程序(TimerResume);
            End;
            调用子程序(CheckpointFailReset);
        Else;
            设置玩家变量(事件玩家, toggle_invincible, 假);
            调用子程序(TimerPause);
            停止追踪玩家变量(事件玩家, timer_practice);
            设置受到伤害(事件玩家, 100);
            击杀(事件玩家, 空);
            设置受到伤害(事件玩家, 0);
            小字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   Hold Interact Again To Turn Off Spectate Mode   Hold Interact Again To Turn Off Spectate Mode   Hold Interact Agai{0}", 自定义字符串("n To Turn Off Spectate Mode")), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
        End;
        设置玩家变量(事件玩家, toggle_spectate, 非((事件玩家).toggle_spectate));
    }
}

规则 ("Command | Toggle Invincible Mode (Melee + Reload)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        与(全局.CompMode, (事件玩家).comp_done) == 假;
        (事件玩家).lockState == 假;
        存活(事件玩家) == 真;
        按钮被按下(事件玩家, 按钮(近身攻击)) == 真;
        按钮被按下(事件玩家, 按钮(装填)) == 真;
        按钮被按下(事件玩家, 按钮(互动)) == 假;
    }
    动作 {
        设置玩家变量(事件玩家, lockState, 真);
        设置玩家变量(事件玩家, toggle_invincible, 非((事件玩家).toggle_invincible));
        设置玩家变量(事件玩家, cache_collectedLocks, 空数组);
        If((事件玩家).toggle_invincible);
            "\\"探点模式\\" checkCN \\"Invincible mode\\""
            大字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒInvincible ModeInvincible ModeInvincible Mode"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
            调用子程序(TimerPause);
            停止追踪玩家变量(事件玩家, timer_practice);
            开始规则(CheckUlt, 无动作);
            开始规则(CheckAbility1, 无动作);
        Else;
            If((事件玩家).toggle_practice);
                "\\"练习模式\\" checkCN \\"Practice mode\\""
                大字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒPractice ModePractice ModePractice Mode"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
                追踪玩家变量频率(事件玩家, timer_practice, 999999999999, 真, 全部禁用);
                调用子程序(CheckpointFailReset);
            Else If((事件玩家).checkpoint_notLast);
                "\\"跑图模式\\" checkCN \\"Normal mode\\""
                大字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒNormal ModeNormal ModeNormal Mode"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
                调用子程序(TimerResume);
                调用子程序(CheckpointFailReset);
            End;
        End;
        设置玩家变量(事件玩家, lockState, 假);
        "Anti spam"
        等待(0.096, 无视条件);
    }
}

规则 ("Command | Toggle Practice Mode (Melee + Ultimate)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        全局.EditorOn == 假;
        全局.CompMode == 假;
        (事件玩家).lockState == 假;
        存活(事件玩家) == 真;
        按钮被按下(事件玩家, 按钮(装填)) == 假;
        按钮被按下(事件玩家, 按钮(近身攻击)) == 真;
        按钮被按下(事件玩家, 按钮(终极技能)) == 真;
    }
    动作 {
        设置玩家变量(事件玩家, lockState, 真);
        设置玩家变量(事件玩家, toggle_practice, 非((事件玩家).toggle_practice));
        If((事件玩家).toggle_practice);
            "\\"练习模式\\" checkCN \\"Practice mode\\""
            大字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒPractice ModePractice ModePractice Mode"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
            调用子程序(TimerPause);
            设置玩家变量(事件玩家, checkpoint_practice, (事件玩家).checkpoint_current);
            设置玩家变量(事件玩家, timer_splitDisplay, 乘(-999999999999, 比较((事件玩家).timer_splitDisplay, <=, -999999999999)));
            设置玩家变量(事件玩家, timer_split, 空);
            设置玩家变量(事件玩家, timer_practice, 空);
            追踪玩家变量频率(事件玩家, timer_practice, 999999999999, 真, 全部禁用);
            If((事件玩家).toggle_invincible);
                设置玩家变量(事件玩家, toggle_invincible, 假);
                调用子程序(CheckpointFailReset);
            End;
        Else;
            "\\"跑图模式\\" checkCN \\"Normal mode\\""
            大字体信息(事件玩家, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒNormal ModeNormal ModeNormal Mode"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))));
            停止追踪玩家变量(事件玩家, timer_practice);
            设置玩家变量(事件玩家, checkpoint_current, (事件玩家).checkpoint_practice);
            调用子程序(UpdateCache);
            If(与((事件玩家).checkpoint_notLast, 非((事件玩家).toggle_invincible)));
                设置玩家变量(事件玩家, timer_split, (事件玩家).timer_normal);
                调用子程序(TimerResume);
                调用子程序(CheckpointFailReset);
            End;
        End;
        设置玩家变量(事件玩家, lockState, 假);
        "Anti spam"
        等待(0.096, 无视条件);
    }
}

规则 ("Command | Restart Practice (Hold Interact)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        全局.EditorOn == 假;
        (事件玩家).lockState == 假;
        (事件玩家).toggle_practice != 假;
        或(存活(事件玩家), (事件玩家).toggle_spectate) == 真;
        按钮被按下(事件玩家, 按钮(互动)) == 真;
        按钮被按下(事件玩家, 按钮(蹲下)) == 假;
        按钮被按下(事件玩家, 按钮(终极技能)) == 假;
        按钮被按下(事件玩家, 按钮(近身攻击)) == 假;
        按钮被按下(事件玩家, 按钮(技能2)) == 假;
    }
    动作 {
        "first 2 ifs prevent collide with spec"
        If((事件玩家).toggle_spectate);
            等待直到 (存活(事件玩家), 999999999999);
            等待直到 (非(按钮被按下(事件玩家, 按钮(互动))), 2);
            中止;
        End;
        等待直到 (非(按钮被按下(事件玩家, 按钮(互动))), 0.9);
        根据条件中止(按钮被按下(事件玩家, 按钮(互动)));
        设置玩家变量(事件玩家, timer_practice, 空);
        设置玩家变量(事件玩家, timer_split, 空);
        设置玩家变量(事件玩家, checkpoint_current, (事件玩家).checkpoint_practice);
        调用子程序(UpdateCache);
        调用子程序(CheckpointFailReset);
    }
}

规则 ("Command | Skip (Crouch + Primary-Next | Secondary-Previous)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        数量(全局.A) > 真;
        全局.EditorMoveItem == 假;
        与((事件玩家).editor_lock, 比较(事件玩家, ==, 主机玩家)) == 假;
        或(全局.EditorOn, (事件玩家).toggle_practice) == 真;
        (事件玩家).lockState == 假;
        按钮被按下(事件玩家, 按钮(蹲下)) == 真;
        按钮被按下(事件玩家, 按钮(主要攻击模式)) != 按钮被按下(事件玩家, 按钮(辅助攻击模式));
    }
    动作 {
        "@Condition hostPlayer.editor_on or ( eventPlayer.toggle_practice and eventPlayer.isHoldingButton(Button.ABILITY_1) )"
        设置玩家变量(事件玩家, lockState, 真);
        设置玩家变量(事件玩家, timer_split, 空);
        设置玩家变量(事件玩家, timer_practice, 空);
        修改玩家变量(事件玩家, checkpoint_current, 加, If-Then-Else(按钮被按下(事件玩家, 按钮(辅助攻击模式)), 减(数量(全局.A), 真), 真));
        修改玩家变量(事件玩家, checkpoint_current, 余数, 数量(全局.A));
        设置玩家变量(事件玩家, checkpoint_moved, 真);
        调用子程序(UpdateCache);
        调用子程序(CheckpointFailReset);
        "Anti spam"
        等待(0.064, 无视条件);
        "faster if you spam button"
        等待直到 (比较(按钮被按下(事件玩家, 按钮(主要攻击模式)), ==, 按钮被按下(事件玩家, 按钮(辅助攻击模式))), 0.256);
        如条件为“真”则循环;
        "After loop to prevent instant teleports"
        设置玩家变量(事件玩家, lockState, 假);
    }
}

规则 ("Command | Quick Reset (Reload | Hold Reload to Enable)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        按钮被按下(事件玩家, 按钮(装填)) == 真;
        按钮被按下(事件玩家, 按钮(近身攻击)) == 假;
        按钮被按下(事件玩家, 按钮(互动)) == 假;
    }
    动作 {
        If((事件玩家).toggle_quickRestart);
            If((事件玩家).editor_fly);
                设置玩家变量(事件玩家, editor_fly, 最后(数组中的值(全局.A, (事件玩家).checkpoint_current)));
            End;
            调用子程序(CheckpointFailReset);
            等待(0.32, 无视条件);
        End;
        等待(真, 当为“假”时中止);
        设置玩家变量(事件玩家, toggle_quickRestart, 非((事件玩家).toggle_quickRestart));
        播放效果(事件玩家, 正面状态施加声音, 空, 事件玩家, 100);
        "(\\"快速回点已启用\\" if eventPlayer.toggle_quickRestart else \\"快速回点已关闭\\") checkCN\\n\\"Quick reset is enabled\\" if eventPlayer.toggle_quickRestart else \\"Quick reset is disabled\\""
        大字体信息(事件玩家, If-Then-Else((事件玩家).toggle_quickRestart, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒQuick Reset Is EnabledQuick Reset Is EnabledQuick Reset Is Enabled"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒQuick Reset Is DisabledQuick Reset Is DisabledQuick Reset Is Disabled"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))));
    }
}

规则 ("Command | Toggle Hud (Hold Secondary)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        全局.EditorMoveItem == 假;
        与(与(全局.EditorOn, 比较(事件玩家, ==, 主机玩家)), 按钮被按下(事件玩家, 按钮(近身攻击))) == 假;
        按钮被按下(事件玩家, 按钮(辅助攻击模式)) == 真;
        按钮被按下(事件玩家, 按钮(主要攻击模式)) == 假;
        "don't activate during skipping"
        按钮被按下(事件玩家, 按钮(蹲下)) == 假;
    }
    动作 {
        等待(1.5, 当为“假”时中止);
        设置玩家变量(事件玩家, toggle_guide, 非((事件玩家).toggle_guide));
        小字体信息(事件玩家, If-Then-Else((事件玩家).toggle_guide, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   HUD Is Now Shown   HUD Is Now Shown   HUD Is Now Shown"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ   HUD Is Now Hidden   HUD Is Now Hidden   HUD Is Now Hidden"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))));
        "(\\"   HUD已隐藏\\" if eventPlayer.toggle_guide else  \\"   HUD已开启\\")\\ncheckCN\\n(\\"   Hud is now hidden\\" if eventPlayer.toggle_guide else \\"   Hud is now shown\\"))"
        播放效果(事件玩家, 正面状态施加声音, 空, 事件玩家, 100);
    }
}

规则 ("Command | Toggle Hints (Melee + Deflect)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        全局.HintText != 空;
        按钮被按下(事件玩家, 按钮(近身攻击)) == 真;
        按钮被按下(事件玩家, 按钮(技能2)) == 真;
        或((事件玩家).toggle_hints, 数组包含(全局.HintCp, (事件玩家).checkpoint_current)) == 真;
    }
    动作 {
        设置玩家变量(事件玩家, toggle_hints, 非((事件玩家).toggle_hints));
    }
}

规则 ("Command | Toggle 3rd Person Camera (Hold Crouch + Jump)") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        "True if not null"
        (事件玩家).addon_toggle3rdPov <= 真;
        (事件玩家).lockState == 假;
        (事件玩家).editor_lock == 假;
        在地面上(事件玩家) == 真;
        按钮被按下(事件玩家, 按钮(蹲下)) == 真;
        按钮被按下(事件玩家, 按钮(跳跃)) == 真;
    }
    动作 {
        等待(真, 当为“假”时中止);
        设置玩家变量(事件玩家, addon_toggle3rdPov, 非((事件玩家).addon_toggle3rdPov));
        调用子程序(Addon3rdPerson);
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Huds ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("Huds | Global Localplayer") {
    事件 {
        持续 - 全局;
    }
    动作 {
        等待(0.8, 无视条件);
        "name/credit construction\\nnote on changing default name/credit\\nif you change it, also change it in the credits rule\\nthe old credits should always remain valid here to keep old data valid"
        If(比较(全局.Name, ==, 自定义字符串("name here - 作者")));
            "Legacy Credits"
            设置全局变量(Name, 首个(全局.Cachedcredits));
        End;
        If(非(全局.Name));
            设置全局变量(Name, 自定义字符串("name here - 作者"));
        End;
        If(比较(全局.Code, ==, 自定义字符串("code here - 代码")));
            "Legacy Credits"
            设置全局变量(Code, 最后(全局.Cachedcredits));
        End;
        If(非(全局.Code));
            设置全局变量(Code, 自定义字符串("code here - 代码"));
        End;
        设置全局变量(Cachedcredits, 空);
        If(非(全局.EditorOn));
            创建HUD文本(首个(真), 空, If-Then-Else((本地玩家).toggle_guide, 自定义字符串("Discord: dsc.gg/genjiparkour"), 空数组), 自定义字符串("{0}: {1}                                                                                                ", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒMade ByMade ByMade By"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 全局.Name), 左边, -200, 空, 数组中的值(全局.ColorConfig, 18), 首个(全局.ColorConfig), 可见和字符串, 默认可见度);
            创建HUD文本(首个(真), 空, 空, 自定义字符串("{0}: {1}                                                                                                ", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒMap CodeMap CodeMap Code"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 全局.Code), 左边, -199, 空, 空, 数组中的值(全局.ColorConfig, 真), 可见和字符串, 默认可见度);
            创建HUD文本((本地玩家).toggle_guide, 空, 空, 自定义字符串("{0} {1} + {2}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒHoldHoldHold"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 输入绑定字符串(按钮(主要攻击模式)), 自定义字符串("{0} | {1}", 输入绑定字符串(按钮(辅助攻击模式)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒPreview CPPreview CPPreview CP"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))))), 右边, -160, 空, 空, If-Then-Else((本地玩家).preview_array1, 单次赋值(数组中的值(全局.ColorConfig, 6)), 单次赋值(数组中的值(全局.ColorConfig, 5))), 可见，字符串和颜色, 默认可见度);
            创建HUD文本(首个(与((本地玩家).preview_array1, (本地玩家).toggle_guide)), 空, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒWalk ◀ ▶ | Preview Others\\nWalk ▲ ▼ | Modify Zoom\\nAim | Change Preview AngleWalk ◀ ▶ | Preview Others\\nWalk ▲ ▼ | Modify{0}", 自定义字符串(" Zoom\\nAim | Change Preview AngleWalk ◀ ▶ | Preview Others\\nWalk ▲ ▼ | Modify Zoom\\nAim | Change Preview Angle")), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 空, 顶部, -171, 空, 数组中的值(全局.ColorConfig, 6), 空, 可见和字符串, 始终不可见);
            创建HUD文本(本地玩家, 空, 空, If-Then-Else(或(比较((本地玩家).timer_splitDisplay, <=, -999999999999), (本地玩家).toggle_spectate), 空数组, 自定义字符串("{0}{1}                                                                                                ", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒSplit: Split: Split: "), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), (本地玩家).timer_splitDisplay)), 左边, -195, 空, 空, 数组中的值(全局.ColorConfig, 3), 可见和字符串, 默认可见度);
            "Remove no hints - visual and element bloat"
            If(数量(全局.HintText));
                创建HUD文本(首个(与((本地玩家).toggle_guide, 数组包含(全局.HintCp, (本地玩家).checkpoint_current))), 空, 自定义字符串("{0}{1}", If-Then-Else((本地玩家).toggle_hints, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ― ― ― ― ― Hint ― ― ― ― ―\\n― ― ― ― ― Hint ― ― ― ― ―\\n― ― ― ― ― Hint ― ― ― ― ―\\n"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ― ― ― Hint Available ― ― ―― ― ― Hint Available ― ― ―― ― ― Hint Available ― ― ―"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))), If-Then-Else((本地玩家).toggle_hints, 数组中的值(全局.HintText, 数组值的索引(全局.HintCp, (本地玩家).checkpoint_current)), 空数组)), 自定义字符串("{0} + {1} | {2}", 输入绑定字符串(按钮(技能2)), 输入绑定字符串(按钮(近身攻击)), If-Then-Else((本地玩家).toggle_hints, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒHide HintHide HintHide Hint"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒShow HintShow HintShow Hint"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))))), 右边, -151, 空, If-Then-Else((本地玩家).toggle_hints, 颜色(绿色), 颜色(橙色)), If-Then-Else(数组包含(全局.HintCp, (本地玩家).checkpoint_current), 单次赋值(数组中的值(全局.ColorConfig, 5)), 颜色(灰色)), 可见，字符串和颜色, 默认可见度);
            End;
            创建HUD文本((本地玩家).toggle_guide, 空, 空, 自定义字符串("{0} + {1} + {2}", 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(技能2)), 自定义字符串("{0} | {1}\\n{2}", 输入绑定字符串(按钮(互动)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒRestartRestartRestart"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 自定义字符串("{0} {1} | {2}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒHoldHoldHold"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 输入绑定字符串(按钮(近身攻击)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒLeaderboardLeaderboardLeaderboard"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))))), 右边, -156, 空, 空, 数组中的值(全局.ColorConfig, 5), 可见和字符串, 默认可见度);
            设置全局变量(Difficultyhud, 数组(地图工坊设置组合(自定义字符串("Map Settings ■ 地图设置 ■ 맵 설정"), 自定义字符串("Difficulty 󠀨Display Hud󠀩 ■ 难度 󠀨顶部hud󠀩 ■ 난이도 󠀨HUD 디스플레이󠀩"), 0, 数组(自定义字符串("<fg27AAFFFF>Playtest ■ 游戏测试 ■ 플레이테스트"), 自定义字符串("<fgA0E81BFF>Easy-"), 自定义字符串("<fgA0E81BFF>Easy"), 自定义字符串("<fgA0E81BFF>Easy+"), 自定义字符串("<fge0e000FF>Medium-"), 自定义字符串("<fge0e000FF>Medium"), 自定义字符串("<fge0e000FF>Medium+"), 自定义字符串("<fgEC9900FF>Hard-"), 自定义字符串("<fgEC9900FF>Hard"), 自定义字符串("<fgEC9900FF>Hard+"), 自定义字符串("<fgFF4500FF>Very Hard-"), 自定义字符串("<fgFF4500FF>Very Hard"), 自定义字符串("<fgFF4500FF>Very Hard+"), 自定义字符串("<fgC80013FF>Extreme-"), 自定义字符串("<fgC80013FF>Extreme"), 自定义字符串("<fgC80013FF>Extreme+"), 自定义字符串("<fg960000FF>Hell"), 自定义字符串("Do Not Display ■ 不显示 ■ 표시 X")), 1), 地图工坊设置开关(自定义字符串("Map Settings ■ 地图设置 ■ 맵 설정"), 自定义字符串("Playtest Display ■ 游戏测试 ■ 플레이테스트 디스플레이"), 假, 2)));
            "display\\n17th entry is 'dont display'"
            If(比较(首个(全局.Difficultyhud), !=, 17));
                创建HUD文本(首个(与((本地玩家).toggle_guide, 非((本地玩家).toggle_leaderboard))), If-Then-Else(最后(全局.Difficultyhud), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒPlaytestPlaytestPlaytest"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 空数组), 数组中的值(数组(自定义字符串("Playtest"), 自定义字符串("Easy -"), 自定义字符串("Easy"), 自定义字符串("Easy +"), 自定义字符串("Medium -"), 自定义字符串("Medium"), 自定义字符串("Medium +"), 自定义字符串("Hard -"), 自定义字符串("Hard"), 自定义字符串("Hard +"), 自定义字符串("Very Hard -"), 自定义字符串("Very Hard"), 自定义字符串("Very Hard +"), 自定义字符串("Extreme -"), 自定义字符串("Extreme"), 自定义字符串("Extreme +"), 自定义字符串("Hell"), 空), 首个(全局.Difficultyhud)), 空, 顶部, -173, 颜色(蓝色), 数组中的值(数组(颜色(蓝色), 颜色(灰绿色), 颜色(灰绿色), 颜色(灰绿色), 颜色(黄色), 颜色(黄色), 颜色(黄色), 颜色(橙色), 颜色(橙色), 颜色(橙色), 自定义颜色(255, 69, 0, 255), 自定义颜色(255, 69, 0, 255), 自定义颜色(255, 69, 0, 255), 颜色(红色), 颜色(红色), 颜色(红色), 自定义颜色(150, 0, 0, 255), 空), 首个(全局.Difficultyhud)), 空, 可见和字符串, 默认可见度);
            End;
        End;
        "global huds"
        创建HUD文本(首个(真), 空, 自定义字符串("{0}{1}{2}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒServer Restart In Server Restart In Server Restart In "), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 全局.TimeRemaining, 自定义字符串("{0}v1.10.4A{1}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ Min -  Min -  Min - "), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), If-Then-Else(比较(文本数量, >=, 128), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ\\nError: Max HUD Count Reached\\nError: Max HUD Count Reached\\nError: Max HUD Count Reached"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 空数组))), 空, 右边, -162, 空, 数组中的值(全局.ColorConfig, 2), 空, 可见和字符串, 始终可见);
        "padding for custom hud display"
        创建HUD文本(首个(真), 空, 空, 自定义字符串("­\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n"), 顶部, -164, 空, 空, 颜色(橙色), 可见, 默认可见度);
        创建HUD文本((本地玩家).toggle_guide, 空, 空, If-Then-Else((本地玩家).toggle_quickRestart, 自定义字符串("{0} | {1}", 输入绑定字符串(按钮(装填)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒQuick ResetQuick ResetQuick Reset"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))), 自定义字符串("{0} {1} | {2}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒHoldHoldHold"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 输入绑定字符串(按钮(装填)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒEnable Quick ResetEnable Quick ResetEnable Quick Reset"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))))), 右边, -157, 空, 空, 数组中的值(全局.ColorConfig, 5), 可见和字符串, 默认可见度);
        创建HUD文本((本地玩家).toggle_guide, 空, 空, 自定义字符串("{0} + {1} | {2}", 输入绑定字符串(按钮(装填)), 输入绑定字符串(按钮(近身攻击)), 自定义字符串("{0}{1}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒInvincibleInvincibleInvincible"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), If-Then-Else((本地玩家).toggle_invincible, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ | On | On | On"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 空数组))), 右边, -154, 空, 空, If-Then-Else((本地玩家).toggle_invincible, 单次赋值(数组中的值(全局.ColorConfig, 6)), 单次赋值(数组中的值(全局.ColorConfig, 5))), 可见，字符串和颜色, 默认可见度);
        创建HUD文本(首个(真), 空, If-Then-Else((本地玩家).toggle_guide, 空数组, 自定义字符串("{0}{1}{2}", If-Then-Else((本地玩家).toggle_invincible, 技能图标字符串(英雄(巴蒂斯特), 按钮(技能2)), 空数组), If-Then-Else((本地玩家).toggle_practice, 技能图标字符串(英雄(D.Va), 按钮(终极技能)), 空数组), If-Then-Else((本地玩家).toggle_invisible, 技能图标字符串(英雄(黑影), 按钮(技能1)), 空数组))), 自定义字符串("{0} {1} | {2} HUD", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒHoldHoldHold"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 输入绑定字符串(按钮(辅助攻击模式)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒToggleToggleToggle"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))), 右边, -161, 空, 数组中的值(全局.ColorConfig, 5), 数组中的值(全局.ColorConfig, 5), 可见和字符串, 默认可见度);
        "text per checkpoint  text per cp each"
        If(数量(全局.CpHudText));
            创建HUD文本(首个(与(数组包含(全局.CpHudCp, (本地玩家).checkpoint_current), (本地玩家).toggle_guide)), 数组中的值(全局.CpHudText, 数组值的索引(全局.CpHudCp, (本地玩家).checkpoint_current)), 空, 空, 顶部, -169, 颜色(蓝色), 空, 空, 可见和字符串, 默认可见度);
        End;
        If(数量(全局.CpIwtText));
            创建地图文本(数组包含(全局.CpIwtCp, (本地玩家).checkpoint_current), 数组中的值(全局.CpIwtText, 数组值的索引(全局.CpIwtCp, (本地玩家).checkpoint_current)), 数组中的值(全局.CpIwtPos, 数组值的索引(全局.CpIwtCp, (本地玩家).checkpoint_current)), 2, 根据表面截取, 可见，位置和字符串, 全局.CpIwtColor, 默认可见度);
        End;
        If(全局.CompMode);
            创建HUD文本(已过滤的数组(所有玩家(所有队伍), (当前数组元素).comp_instructionHud), 自定义字符串("                                                                                                                           "), 空, 空, 顶部, -181, 颜色(白色), 空, 空, 可见, 默认可见度);
            If(首个(全局.instructiontext));
                创建HUD文本(已过滤的数组(所有玩家(所有队伍), (当前数组元素).comp_instructionHud), 空, 空, 首个(全局.instructiontext), 顶部, -180, 空, 空, 颜色(白色), 可见, 默认可见度);
            End;
            If(数组中的值(全局.instructiontext, 真));
                创建HUD文本(已过滤的数组(所有玩家(所有队伍), (当前数组元素).comp_instructionHud), 空, 空, 数组中的值(全局.instructiontext, 真), 顶部, -179, 空, 空, 颜色(白色), 可见, 默认可见度);
            End;
            If(数组中的值(全局.instructiontext, 2));
                创建HUD文本(已过滤的数组(所有玩家(所有队伍), (当前数组元素).comp_instructionHud), 空, 空, 数组中的值(全局.instructiontext, 2), 顶部, -178, 空, 空, 颜色(白色), 可见, 默认可见度);
            End;
            If(数组中的值(全局.instructiontext, 3));
                创建HUD文本(已过滤的数组(所有玩家(所有队伍), (当前数组元素).comp_instructionHud), 空, 空, 数组中的值(全局.instructiontext, 3), 顶部, -177, 空, 空, 颜色(白色), 可见, 默认可见度);
            End;
            创建HUD文本(已过滤的数组(所有玩家(所有队伍), (当前数组元素).comp_instructionHud), 自定义字符串("                                   Press {0} to start                                ", 输入绑定字符串(按钮(互动))), 空, 空, 顶部, -176, 颜色(白色), 空, 空, 可见和字符串, 默认可见度);
        Else If(非(全局.EditorOn));
            创建HUD文本((本地玩家).toggle_guide, 空, 空, 自定义字符串("{0} {1} | {2}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒHoldHoldHold"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 输入绑定字符串(按钮(技能2)), 自定义字符串("{0}{1}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒInvisibleInvisibleInvisible"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), If-Then-Else((本地玩家).toggle_invisible, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ | On | On | On"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 空数组))), 右边, -158, 空, 空, If-Then-Else((本地玩家).toggle_invisible, 单次赋值(数组中的值(全局.ColorConfig, 6)), 单次赋值(数组中的值(全局.ColorConfig, 5))), 可见，字符串和颜色, 默认可见度);
            创建HUD文本((本地玩家).toggle_guide, 空, 空, 自定义字符串("{0} + {1} | {2}", 输入绑定字符串(按钮(终极技能)), 输入绑定字符串(按钮(近身攻击)), 自定义字符串("{0}{1}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒPracticePracticePractice"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), If-Then-Else((本地玩家).toggle_practice, 自定义字符串(" | ({0})", (本地玩家).checkpoint_practice), 空数组))), 右边, -153, 空, 空, If-Then-Else((本地玩家).toggle_practice, 单次赋值(数组中的值(全局.ColorConfig, 6)), 单次赋值(数组中的值(全局.ColorConfig, 5))), 可见，字符串和颜色, 默认可见度);
            创建HUD文本(首个(与((本地玩家).toggle_practice, (本地玩家).toggle_guide)), 空, 自定义字符串("{0} + {1} | {2}", 输入绑定字符串(按钮(蹲下)), 输入绑定字符串(按钮(主要攻击模式)), 自定义字符串("{0}\\n{1} + {2}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒNext LevelNext LevelNext Level"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 输入绑定字符串(按钮(蹲下)), 自定义字符串("{0} | {1}\\n{2}", 输入绑定字符串(按钮(辅助攻击模式)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒPrevious LevelPrevious LevelPrevious Level"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 自定义字符串("{0} | {1}", 输入绑定字符串(按钮(互动)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒRestart PracticeRestart PracticeRestart Practice"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))))))), 空, 右边, -152, 空, 单次赋值(数组中的值(全局.ColorConfig, 6)), 空, 可见，字符串和颜色, 默认可见度);
            跳过(真);
        Else;
            //spectateHud:
            创建HUD文本((本地玩家).toggle_guide, 空, 空, 自定义字符串("{0} {1} | {2}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒHoldHoldHold"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 输入绑定字符串(按钮(互动)), 自定义字符串("{0}{1}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒSpectateSpectateSpectate"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), If-Then-Else((本地玩家).toggle_spectate, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ | On | On | On"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 空数组))), 右边, -155, 空, 空, If-Then-Else((本地玩家).toggle_spectate, 单次赋值(数组中的值(全局.ColorConfig, 6)), 单次赋值(数组中的值(全局.ColorConfig, 5))), 可见，字符串和颜色, 默认可见度);
    }
}

规则 ("Huds | Leaderboard") {
    事件 {
        持续 - 全局;
    }
    条件 {
        全局.LeaderBoardRemake != 假;
        全局.LeaderBoardFull != 空数组;
    }
    动作 {
        "account for delay in completion"
        等待(假, 无视条件);
        While(数量(全局.LeaderBoardHuds));
            消除HUD文本(首个(全局.LeaderBoardHuds));
            修改全局变量(LeaderBoardHuds, 根据索引从数组中移除, 假);
        End;
        "top 5"
        设置全局变量(LeaderBoardFull, 已排序的数组(全局.LeaderBoardFull, 数组中的值(当前数组元素, 真)));
        设置全局变量(LeaderBoardRemake, 空数组);
        设置全局变量(LeaderBoardHuds, 映射的数组(全局.LeaderBoardFull, 自定义字符串("　 {0}:　{1} - {2}", 加(当前数组索引, 真), 首个(当前数组元素), 最后(当前数组元素))));
        While(数量(全局.LeaderBoardHuds));
            设置全局变量(LeaderBoardRemake, 自定义字符串("{0}\\n{1}", 全局.LeaderBoardRemake, 首个(全局.LeaderBoardHuds)));
            修改全局变量(LeaderBoardHuds, 根据索引从数组中移除, 假);
        End;
        设置全局变量(LeaderBoardRemake, 自定义字符串("{0}\\n", 全局.LeaderBoardRemake));
        "if LeaderBoardFull[0]:"
        创建HUD文本((本地玩家).toggle_guide, 空, 自定义字符串(" \\n{0} {1} {0}", 图标字符串(旗帜), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒTop 5Top 5Top 5"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))), 空, 右边, -141, 空, 颜色(白色), 空, 可见和字符串, 始终可见);
        设置全局变量(LeaderBoardHuds, 上一个文本ID);
        创建HUD文本(首个(真), 英雄图标字符串(英雄(源氏)), 首个(首个(全局.LeaderBoardFull)), 最后(首个(全局.LeaderBoardFull)), 右边, -140, 颜色(红色), 颜色(红色), 颜色(红色), 可见, 始终可见);
        修改全局变量(LeaderBoardHuds, 添加至数组, 上一个文本ID);
        If(数组中的值(全局.LeaderBoardFull, 真));
            创建HUD文本(首个(真), 英雄图标字符串(英雄(源氏)), 首个(数组中的值(全局.LeaderBoardFull, 真)), 最后(数组中的值(全局.LeaderBoardFull, 真)), 右边, -139, 颜色(橙色), 颜色(橙色), 颜色(橙色), 可见, 始终可见);
            修改全局变量(LeaderBoardHuds, 添加至数组, 上一个文本ID);
            If(数组中的值(全局.LeaderBoardFull, 2));
                创建HUD文本(首个(真), 英雄图标字符串(英雄(源氏)), 首个(数组中的值(全局.LeaderBoardFull, 2)), 最后(数组中的值(全局.LeaderBoardFull, 2)), 右边, -138, 颜色(黄色), 颜色(黄色), 颜色(黄色), 可见, 始终可见);
                修改全局变量(LeaderBoardHuds, 添加至数组, 上一个文本ID);
                If(数组中的值(全局.LeaderBoardFull, 3));
                    创建HUD文本(首个(真), 英雄图标字符串(英雄(源氏)), 首个(数组中的值(全局.LeaderBoardFull, 3)), 最后(数组中的值(全局.LeaderBoardFull, 3)), 右边, -137, 颜色(灰绿色), 颜色(灰绿色), 颜色(灰绿色), 可见, 始终可见);
                    修改全局变量(LeaderBoardHuds, 添加至数组, 上一个文本ID);
                    If(数组中的值(全局.LeaderBoardFull, 4));
                        创建HUD文本(首个(真), 英雄图标字符串(英雄(源氏)), 首个(数组中的值(全局.LeaderBoardFull, 4)), 最后(数组中的值(全局.LeaderBoardFull, 4)), 右边, -136, 颜色(绿色), 颜色(绿色), 颜色(绿色), 可见, 始终可见);
                        修改全局变量(LeaderBoardHuds, 添加至数组, 上一个文本ID);
                    End;
                End;
            End;
        End;
        创建HUD文本(If-Then-Else(单次赋值(与(全局.CompMode, 非(全局.CompTime))), 真, (本地玩家).toggle_leaderboard), 自定义字符串("　　　　 {0} {1} {0} 　　　　\\n　　　　　　　　　　　　　　　　　　{2}", 图标字符串(旗帜), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒLeaderboardLeaderboardLeaderboard"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 单次赋值(全局.LeaderBoardRemake)), 空, 空, 顶部, -165, 颜色(白色), 空, 空, 可见和字符串, 默认可见度);
        修改全局变量(LeaderBoardHuds, 添加至数组, 上一个文本ID);
        设置全局变量(LeaderBoardRemake, 空);
        等待(假, 无视条件);
    }
}

规则 ("Huds | Each Player") {
    事件 {
        玩家加入比赛;
        双方;
        全部;
    }
    动作 {
        等待(0.512, 无视条件);
        创建HUD文本(事件玩家, 空, If-Then-Else((事件玩家).toggle_practice, 自定义字符串("{0} {1} sec", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒPractice Time:Practice Time:Practice Time:"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), (事件玩家).timer_practice), 空数组), 自定义字符串("{0} {1} sec                                                                                                ", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒTime:Time:Time:"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), (事件玩家).timer_normal), 左边, -196, 空, 颜色(灰色), 数组中的值(全局.ColorConfig, 3), 字符串, 默认可见度);
        创建HUD文本(If-Then-Else((事件玩家).toggle_leaderboard, 空, 事件玩家), If-Then-Else((事件玩家).preview_array1, 自定义字符串(" {0} ({1}/{2}", If-Then-Else((事件玩家).preview_i, If-Then-Else(比较((事件玩家).preview_i, <=, 数量((事件玩家).cache_bouncePosition)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒOrbOrbOrb"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒPortalPortalPortal"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒCheckpointCheckpointCheckpoint"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))), 加((事件玩家).preview_i, 真), 自定义字符串("{0})\\n―――――――――――\\n {1}\\n", 数量((事件玩家).preview_array1), If-Then-Else(与(比较((事件玩家).preview_i, <=, 数量((事件玩家).cache_bouncePosition)), (事件玩家).preview_i), 自定义字符串("{0} {1} {2}", If-Then-Else(数组中的值(全局.TQ5, 数组中的值((事件玩家).preview_array2, (事件玩家).preview_i)), 技能图标字符串(英雄(源氏), 按钮(终极技能)), 空数组), If-Then-Else(数组中的值(全局.TQ6, 数组中的值((事件玩家).preview_array2, (事件玩家).preview_i)), 技能图标字符串(英雄(源氏), 按钮(技能1)), 空数组), 自定义字符串("{0} {1}", If-Then-Else(数组中的值(全局.BounceToggleLock, 数组中的值((事件玩家).preview_array2, (事件玩家).preview_i)), 图标字符串(警告), 空数组), If-Then-Else(比较(数组中的值(全局.EditMode, 数组中的值((事件玩家).preview_array2, (事件玩家).preview_i)), >, 空), 图标字符串(箭头：向上), If-Then-Else(比较(数组中的值(全局.EditMode, 数组中的值((事件玩家).preview_array2, (事件玩家).preview_i)), <, 空), 图标字符串(箭头：向下), 空数组)))), If-Then-Else((事件玩家).preview_i, If-Then-Else(最后(数组中的值((事件玩家).preview_array2, (事件玩家).preview_i)), 自定义字符串("{0} {1}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒPortal ExitPortal ExitPortal Exit"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 数组中的值((事件玩家).preview_array2, (事件玩家).preview_i)), 自定义字符串("{0} {1}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒPortal StartPortal StartPortal Start"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 数组中的值((事件玩家).preview_array2, (事件玩家).preview_i))), (事件玩家).banString)))), 空数组), If-Then-Else((事件玩家).preview_array1, 空数组, 自定义字符串("{0}{1} {2}", If-Then-Else(与((事件玩家).toggle_guide, (事件玩家).banString), 自定义字符串("{0}\\n", (事件玩家).banString), 空数组), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒLevelLevelLevel"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 自定义字符串("{0} / {1}", (事件玩家).checkpoint_current, 减(数量(全局.A), 真)))), If-Then-Else(与((事件玩家).cache_bounceMaxLocks, 非((事件玩家).preview_array1)), 自定义字符串("{0} {1} / {2}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ{0} Orbs{0} Orbs{0} Orbs", 数组中的值(全局.ColorConfig, 16)), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 数量((事件玩家).cache_collectedLocks), (事件玩家).cache_bounceMaxLocks), 空数组), 顶部, -172, 数组中的值(全局.ColorConfig, 4), 数组中的值(全局.ColorConfig, 4), 数组中的值(全局.ColorConfig, 16), 可见和字符串, 默认可见度);
        创建HUD文本(事件玩家, 空, 空, 自定义字符串("{0}{1}{2}", If-Then-Else(X方向分量((事件玩家).cache_inputs), 自定义字符串("■"), 自定义字符串("□")), If-Then-Else(比较(Z方向分量(阈值(事件玩家)), >, 空), 自定义字符串("▲"), 自定义字符串("△")), 自定义字符串("{0}\\n{1}{2}", If-Then-Else(Y方向分量((事件玩家).cache_inputs), 自定义字符串("●"), 自定义字符串("○")), If-Then-Else(比较(X方向分量(阈值(事件玩家)), >, 空), 自定义字符串("◀"), 自定义字符串("◁")), 自定义字符串("{0}{1}                                                                                                ", If-Then-Else(比较(Z方向分量(阈值(事件玩家)), <, 空), 自定义字符串("▼"), 自定义字符串("∇")), If-Then-Else(比较(X方向分量(阈值(事件玩家)), <, 空), 自定义字符串("▶"), 自定义字符串("▷"))))), 左边, -192, 空, 空, 单次赋值(数组中的值(全局.ColorConfig, 3)), 字符串, 默认可见度);
        "climb/bhop indicators"
        创建HUD文本(事件玩家, 自定义字符串("{0}{1}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒClimbClimbClimb"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), If-Then-Else((事件玩家).skill_countMulti, 自定义字符串(" ({0})", (事件玩家).skill_countMulti), 空数组)), 空, 自定义字符串("                                                                                                                                "), 左边, -193, If-Then-Else((事件玩家).skill_usedClimb, 单次赋值(数组中的值(全局.ColorConfig, 8)), 单次赋值(数组中的值(全局.ColorConfig, 7))), 空, 空, 字符串和颜色, 默认可见度);
        创建HUD文本(事件玩家, 自定义字符串("{0}{1}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒBhopBhopBhop"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), If-Then-Else((事件玩家).skill_countCreates, 自定义字符串(" ({0})", (事件玩家).skill_countCreates), 空数组)), 空, 自定义字符串("                                                                                                                                "), 左边, -194, If-Then-Else((事件玩家).skill_usedBhop, 单次赋值(数组中的值(全局.ColorConfig, 8)), 单次赋值(数组中的值(全局.ColorConfig, 7))), 空, 空, 字符串和颜色, 默认可见度);
        创建地图文本(If-Then-Else(与((事件玩家).checkpoint_notLast, (事件玩家).toggle_guide), 事件玩家, 空), If-Then-Else(与((事件玩家).cache_bounceMaxLocks, 比较(数量((事件玩家).cache_collectedLocks), <, (事件玩家).cache_bounceMaxLocks)), 自定义字符串("{0}{1}", 图标字符串(警告), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒCollect Orbs FirstCollect Orbs FirstCollect Orbs First"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒCome HereCome HereCome Here"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组))))), 数组中的值(全局.A, 加((事件玩家).checkpoint_current, 真)), 1.5, 不要截取, 可见，位置和字符串, 数组中的值(全局.ColorConfig, 13), 默认可见度);
        等待(2.5, 无视条件);
        If(全局.CompMode);
            创建HUD文本(事件玩家, 空, If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), If-Then-Else(全局.CompTime, 自定义字符串("剩余时间: {0} 分钟{1}", 全局.CompTime, If-Then-Else(比较((事件玩家).comp_countAttempts, <, 空), 自定义字符串("\\n你没有尝试过"), If-Then-Else(全局.CompAtmpNum, 自定义字符串("\\n尝试 {0} / {1}", (事件玩家).comp_countAttempts, 全局.CompAtmpNum), 空数组))), 自定义字符串("! 比赛结束 !")), If-Then-Else(全局.CompTime, 自定义字符串("Time Left: {0} Min{1}", 全局.CompTime, If-Then-Else(比较((事件玩家).comp_countAttempts, <, 空), 自定义字符串("\\nYou Are Out Of Attempts"), If-Then-Else(全局.CompAtmpNum, 自定义字符串("\\nAttempt {0} / {1}", (事件玩家).comp_countAttempts, 全局.CompAtmpNum), 空数组))), 自定义字符串("! Competition Is Over !"))), If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), If-Then-Else(全局.CompTime, 自定义字符串("竞赛模式"), 自定义字符串("竞赛模式\\n\\n\\n")), If-Then-Else(全局.CompTime, 自定义字符串("Tournament Mode"), 自定义字符串("Tournament Mode\\n\\n\\n"))), 顶部, -182, 空, 颜色(黄色), 颜色(黄色), 字符串, 默认可见度);
    }
}

规则 ("Huds | SUB Update Title") {
    事件 {
        子程序;
        UpdateTitle;
    }
    动作 {
        "or eventPlayer.toggle_practice:"
        根据条件中止(或(或(全局.CompMode, 全局.EditorOn), 非(与(数量(全局.TitleData), 数组包含(首个(全局.TitleData), (事件玩家).checkpoint_current)))));
        消除地图文本((事件玩家).cache_titleHud);
        创建地图文本(首个(非((事件玩家).toggle_invisible)), 数组中的值(数组中的值(全局.TitleData, 真), 数组值的索引(首个(全局.TitleData), (事件玩家).checkpoint_current)), 事件玩家, 1.1, 根据表面截取, 可见和位置, 数组中的值(最后(全局.TitleData), 数组值的索引(首个(全局.TitleData), (事件玩家).checkpoint_current)), 默认可见度);
        设置玩家变量(事件玩家, cache_titleHud, 上一个文本ID);
    }
}

规则 ("Huds | Addons") {
    事件 {
        持续 - 全局;
    }
    动作 {
        等待(0.8, 无视条件);
        等待直到 (实体存在(所有玩家(所有队伍)), 999999999999);
        等待(假, 无视条件);
        If(比较((所有玩家(所有队伍)).addon_toggle3rdPov, <=, 真));
            创建HUD文本((本地玩家).toggle_guide, 空, 空, 自定义字符串("{0} {1} + {2}", 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒHoldHoldHold"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 输入绑定字符串(按钮(蹲下)), 自定义字符串("{0} | {1}{2}", 输入绑定字符串(按钮(跳跃)), 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ3rd Person3rd Person3rd Person"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), If-Then-Else((本地玩家).addon_toggle3rdPov, 数组中的值(字符串分割(自定义字符串("ＴＬＥｒｒ | On | On | On"), 全局.__overpyTranslationHelper__), 绝对值(数组值的索引(全局.__overpyTranslationHelper__, 字符串分割(颜色(白色), 空数组)))), 空数组))), 右边, -159, 空, 空, If-Then-Else((本地玩家).addon_toggle3rdPov, 单次赋值(数组中的值(全局.ColorConfig, 6)), 单次赋值(数组中的值(全局.ColorConfig, 5))), 可见，字符串和颜色, 默认可见度);
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Effects ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("Effects | Setup Effects") {
    事件 {
        持续 - 全局;
    }
    动作 {
        "add back to below wait if removed"
        等待(1.264, 无视条件);
        "pre set control map portals. not in portal rule because shared I variable"
        If(数量(全局.PortalDest));
            For 全局变量(NANBA, 0, 数量(全局.PortalLoc), 真);
                创建效果(已过滤的数组(所有玩家(所有队伍), 或((当前数组元素).toggle_invincible, 非((当前数组元素).checkpoint_notLast))), 有害光环, If-Then-Else(余数(全局.NANBA, 2), 颜色(水绿色), 颜色(橙色)), 数组中的值(全局.PortalLoc, 全局.NANBA), 0.6, 可见);
                创建地图文本(已过滤的数组(所有玩家(所有队伍), 或((当前数组元素).toggle_invincible, 非((当前数组元素).checkpoint_notLast))), 数组中的值(全局.PortalNames, 全局.NANBA), 加(数组中的值(全局.PortalLoc, 全局.NANBA), 上), 真, 根据表面截取, 可见, 颜色(白色), 默认可见度);
            End;
            等待(假, 无视条件);
        End;
        If(全局.EditorOn);
            调用子程序(RebuildKillOrbs);
            调用子程序(RebuildBounceOrbs);
            调用子程序(RebuildPortals);
        Else;
            If(数量(全局.CustomPortalStart));
                For 全局变量(NANBA, 0, 数量(全局.CustomPortalStart), 真);
                    创建效果(已过滤的数组(所有玩家(所有队伍), 或(比较((当前数组元素).checkpoint_current, ==, 单次赋值(数组中的值(全局.CustomPortalCP, 全局.NANBA))), 单次赋值(比较(数组中的值(全局.CustomPortalCP, 全局.NANBA), <, 空)))), 有益光环, 数组中的值(全局.ColorConfig, 17), 数组中的值(全局.CustomPortalStart, 全局.NANBA), 0.6, 可见);
                    等待(假, 无视条件);
                End;
                等待(0.5, 无视条件);
            End;
            If(数量(全局.H));
                For 全局变量(NANBA, 0, 数量(全局.H), 真);
                    创建效果(已过滤的数组(所有玩家(所有队伍), 比较((当前数组元素).checkpoint_current, ==, 单次赋值(数组中的值(全局.killballnumber, 全局.NANBA)))), 球体, 数组中的值(全局.ColorConfig, 14), 数组中的值(全局.H, 全局.NANBA), 绝对值(数组中的值(全局.I, 全局.NANBA)), 可见);
                    等待(假, 无视条件);
                End;
                等待(0.5, 无视条件);
            End;
            If(数量(全局.TQ));
                For 全局变量(NANBA, 0, 数量(全局.TQ), 真);
                    创建效果(已过滤的数组(添加至数组(所有玩家(所有队伍), 空), 与(比较((当前数组元素).checkpoint_current, ==, 单次赋值(数组中的值(全局.pinballnumber, 全局.NANBA))), 非(数组包含((当前数组元素).cache_collectedLocks, 单次赋值(全局.NANBA))))), 球, If-Then-Else(数组中的值(全局.BounceToggleLock, 全局.NANBA), 数组中的值(全局.ColorConfig, 16), 数组中的值(全局.ColorConfig, 15)), 数组中的值(全局.TQ, 全局.NANBA), 真, 可见);
                    等待(假, 无视条件);
                End;
            End;
            "End portal preview"
            创建效果(If-Then-Else(与(与((本地玩家).preview_i, 比较((本地玩家).preview_i, >, 数量((本地玩家).cache_bouncePosition))), 最后(数组中的值((本地玩家).preview_array2, (本地玩家).preview_i))), 本地玩家, 空), 火花, 颜色(亮紫色), 数组中的值((本地玩家).preview_array1, (本地玩家).preview_i), 0.5, 可见，位置和半径);
    }
}

规则 ("Effects | SUB Rebuild Bounce Orbs") {
    事件 {
        子程序;
        RebuildBounceOrbs;
    }
    动作 {
        消除效果(全局.TQ2);
        设置全局变量(TQ2, 空数组);
        For 全局变量(NANBA, 0, 数量(全局.pinballnumber), 真);
            创建效果(已过滤的数组(添加至数组(所有玩家(所有队伍), 空), 与(比较((当前数组元素).checkpoint_current, ==, 数组中的值(全局.pinballnumber, 单次赋值(全局.NANBA))), 非(数组包含((当前数组元素).cache_collectedLocks, 单次赋值(全局.NANBA))))), 球, If-Then-Else(数组中的值(全局.BounceToggleLock, 单次赋值(全局.NANBA)), 数组中的值(全局.ColorConfig, 16), 数组中的值(全局.ColorConfig, 15)), 数组中的值(全局.TQ, 单次赋值(全局.NANBA)), 真, 可见，位置，半径和颜色);
            修改全局变量(TQ2, 添加至数组, 最后创建的实体);
            "wait()"
            If(非(余数(全局.NANBA, 5)));
                等待(假, 无视条件);
            End;
        End;
    }
}

规则 ("Effects | SUB Rebuild boundary spheres") {
    事件 {
        子程序;
        RebuildKillOrbs;
    }
    动作 {
        消除效果(全局.K);
        设置全局变量(K, 空数组);
        For 全局变量(NANBA, 0, 数量(全局.killballnumber), 真);
            创建效果(已过滤的数组(添加至数组(所有玩家(所有队伍), 空), 比较((当前数组元素).checkpoint_current, ==, 数组中的值(全局.killballnumber, 单次赋值(全局.NANBA)))), 球体, 数组中的值(全局.ColorConfig, 14), 数组中的值(全局.H, 单次赋值(全局.NANBA)), 绝对值(数组中的值(全局.I, 单次赋值(全局.NANBA))), 可见，位置和半径);
            修改全局变量(K, 添加至数组, 最后创建的实体);
            If(非(余数(全局.NANBA, 5)));
                等待(假, 无视条件);
            End;
        End;
    }
}

规则 ("Effects | SUB Rebuild Portals") {
    事件 {
        子程序;
        RebuildPortals;
    }
    动作 {
        消除效果(全局.PortalEffects);
        设置全局变量(PortalEffects, 空数组);
        If(数量(全局.CustomPortalCP));
            For 全局变量(NANBA, 0, 数量(全局.CustomPortalCP), 真);
                创建效果(已过滤的数组(所有玩家(所有队伍), 或(比较((当前数组元素).checkpoint_current, ==, 数组中的值(全局.CustomPortalCP, 单次赋值(全局.NANBA))), 比较(数组中的值(全局.CustomPortalCP, 单次赋值(全局.NANBA)), <, 空))), 有益光环, 数组中的值(全局.ColorConfig, 17), 数组中的值(全局.CustomPortalStart, 单次赋值(全局.NANBA)), 0.6, 可见，位置和半径);
                修改全局变量(PortalEffects, 添加至数组, 最后创建的实体);
                If(非(余数(全局.NANBA, 5)));
                    等待(假, 无视条件);
                End;
            End;
        End;
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Addon Functions ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("Addon | AFK timer") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        正在移动(事件玩家) == 假;
        存活(事件玩家) == 真;
        正在使用表情交流(事件玩家) == 假;
        全局.EditorOn == 假;
    }
    动作 {
        等待(300, 当为“假”时中止);
        If((事件玩家).addon_toggle3rdPov);
            设置玩家变量(事件玩家, addon_toggle3rdPov, 假);
        End;
        设置状态(事件玩家, 空, 沉睡, 999999999999);
        "raycast to prevent camera stuck on low wall"
        开始镜头(事件玩家, 加(所选位置(事件玩家), 乘(上, 减(相距距离(所选位置(事件玩家), 射线命中位置(所选位置(事件玩家), 加(所选位置(事件玩家), 乘(4, 上)), 空, 空, 假)), 真))), 所选位置(事件玩家), 10);
        "cancel it after jumping or not sleep, reset cures sleep"
        等待(真, 无视条件);
        等待直到 (或(按钮被按下(事件玩家, 按钮(跳跃)), 非(具有状态(事件玩家, 沉睡))), 999999999999);
        清除状态(事件玩家, 沉睡);
        停止镜头(事件玩家);
        If(与((事件玩家).checkpoint_notLast, 非((事件玩家).toggle_invincible)));
            调用子程序(CheckpointFailReset);
        End;
        如条件为“真”则循环;
    }
}

规则 ("Addon | Pre-set control map portal - toggled via workshop") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        全局.PortalOn != 假;
        数量(全局.PortalLoc) != 空;
        或((事件玩家).toggle_invincible, 非((事件玩家).checkpoint_notLast)) == 真;
        对任意为“真”(全局.PortalLoc, 比较(相距距离(当前数组元素, 加(所选位置(事件玩家), 乘(0.2, 上))), <, 1.3)) == 真;
    }
    动作 {
        传送(事件玩家, 首个(已排序的数组(全局.PortalDest, 相距距离(事件玩家, 数组中的值(全局.PortalLoc, 当前数组索引)))));
    }
}

规则 ("Addon | Custom portals") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        数量((事件玩家).cache_portalStart) != 空;
        对任意为“真”((事件玩家).cache_portalStart, 比较(相距距离(当前数组元素, 加(所选位置(事件玩家), 乘(0.2, 上))), <, 1.3)) == 真;
    }
    动作 {
        传送(事件玩家, 首个(已排序的数组((事件玩家).cache_portalEnd, 相距距离(事件玩家, 数组中的值((事件玩家).cache_portalStart, 当前数组索引)))));
        等待(0.4, 无视条件);
    }
}

规则 ("Addon | Pre-set control map portal - toggled on via workshop settings") {
    事件 {
        持续 - 全局;
    }
    条件 {
        全局.PortalOn != 假;
    }
    动作 {
        "overwrite pasta"
        等待(0.752, 无视条件);
        If(比较(当前地图, ==, 地图(釜山)));
            "\\"down > sanc\\",\\"down > meka\\",\\"sanc > down\\",\\"sanc > meka\\",\\"meka > sanc\\",\\"meka > down\\""
            设置全局变量(PortalNames, 字符串分割(自定义字符串("Sanctuary0MEKA base0Downtown0MEKA base0Sanctuary0Downtown"), 首个(空)));
            设置全局变量(PortalLoc, 数组(矢量(47.946, 7.248, -93.922), 矢量(55.921, 6.998, -94.024), 矢量(-326.382, 10.81, 117.261), 矢量(-330.96, 10.81, 117.416), 矢量(219.567, 10.215, 243.653), 矢量(225.976, 10.227, 240.799)));
            设置全局变量(PortalDest, 数组(矢量(-328.552, 10.01, 120.82), 矢量(221.152, 9.376, 238.765), 矢量(52.197, 6.301, -97.513), 矢量(221.271, 9.431, 238.978), 矢量(-328.601, 10.01, 120.823), 矢量(52.197, 6.299, -97.513)));
        Else If(比较(当前地图, ==, 地图(伊利奥斯)));
            "\\"light > ruin\\",\\"light > well\\",\\"ruin > light\\",\\"ruin > well\\",\\"well > light\\",\\"well > ruin\\""
            设置全局变量(PortalNames, 字符串分割(自定义字符串("Ruins0Well0Lighthouse0Well0Lighthouse0Ruins"), 首个(空)));
            设置全局变量(PortalLoc, 数组(矢量(325.722, -22.665, -40.401), 矢量(327.43, -22.665, -36.089), 矢量(26.176, 58.367, -156.415), 矢量(30.472, 58.367, -156.307), 矢量(-199.945, 2.015, -2.918), 矢量(-194.93, 2.015, -8.054)));
            设置全局变量(PortalDest, 数组(矢量(28.375, 57.659, -161.195), 矢量(-200.464, 1.306, -8.604), 矢量(333.088, -23.389, -40.933), 矢量(-200.464, 1.306, -8.604), 矢量(333.088, -23.389, -40.933), 矢量(28.375, 57.829, -161.195)));
        Else If(或(比较(当前地图, ==, 地图(漓江塔)), 比较(当前地图, ==, 地图(春节漓江塔))));
            "\\"control > garden\\",\\"control > market\\",\\"garden > control\\",\\"garden > market\\",\\"market > control\\",\\"market > garden\\""
            设置全局变量(PortalNames, 字符串分割(自定义字符串("Garden0Night Market0Control Center0Night Market0Control Center0Garden"), 首个(空)));
            设置全局变量(PortalLoc, 数组(矢量(-2.815, 271, 295.373), 矢量(2.905, 271, 295.052), 矢量(5.788, 95.056, 135.298), 矢量(-5.343, 95.05, 134.638), 矢量(-2.738, 假, -61.911), 矢量(5.043, 假, -61.879)));
            设置全局变量(PortalDest, 数组(矢量(0.286, 94.292, 140.396), 矢量(0.584, -0.709, -54.469), 矢量(0.245, 270.292, 301.428), 矢量(0.773, -0.708, -54.361), 矢量(0.245, 270.292, 301.428), 矢量(0.286, 94.292, 140.396)));
        Else If(比较(当前地图, ==, 地图(尼泊尔)));
            "\\"vil > shrine\\",\\"vil > sanc\\", \\"shrine > vil\\",\\"shrine > sanc\\",#\\"sanc > vil\\",\\"sanc > shrine\\""
            设置全局变量(PortalNames, 字符串分割(自定义字符串("Shrine0Sanctum0Village0Sanctum0Village0Shrine"), 首个(空)));
            设置全局变量(PortalLoc, 数组(矢量(-194.732, -92.86, -3.802), 矢量(-194.585, -92.86, 4.187), 矢量(-33.165, 14, 5.212), 矢量(-33.058, 14, -5.55), 矢量(84.75, 129.008, -3.624), 矢量(84.534, 129, 4.032)));
            设置全局变量(PortalDest, 数组(矢量(-40.19, 13.292, -0.105), 矢量(78.43, 128.292, 0.149), 矢量(-190.54, -93.569, 0.122), 矢量(78.43, 128.292, 0.149), 矢量(-190.54, -93.569, 0.122), 矢量(-40.19, 13.292, -0.105)));
        Else If(比较(当前地图, ==, 地图(绿洲城)));
            "\\"uni > garden\\",\\"uni > city\\",\\"garden > uni\\",\\"garden > city\\",\\"city > garden\\",\\"city > uni\\""
            设置全局变量(PortalNames, 字符串分割(自定义字符串("Gardens0City Center0University0City Center0Gardens0University"), 首个(空)));
            设置全局变量(PortalLoc, 数组(矢量(-211.137, 20, -5.084), 矢量(-211.346, 20, 5.029), 矢量(143.061, 8.377, -245.04), 矢量(139.333, 8.377, -249.964), 矢量(157.297, 12.522, 255.759), 矢量(151.452, 12.522, 261.099)));
            设置全局变量(PortalDest, 数组(矢量(134.366, 7.829, -240.53), 矢量(158.27, 11.814, 262.272), 矢量(-206.269, 19.292, 0.103), 矢量(158.283, 11.814, 262.283), 矢量(134.318, 7.829, -240.667), 矢量(-206.269, 19.292, 0.103)));
        Else If(比较(当前地图, ==, 地图(南极半岛)));
            设置全局变量(PortalNames, 字符串分割(自定义字符串("labs0icebreaker0Sublevel0icebreaker0labs0Sublevel"), 首个(空)));
            设置全局变量(PortalLoc, 数组(矢量(280.66, -12.15, -223.65), 矢量(273.27, 42.74, 198.15), 矢量(266.58, 42.74, 198.17), 矢量(-58.29, -154, 63.03), 矢量(-58.36, -154, 56.47), 矢量(287.08, -12.15, -223.59)));
            设置全局变量(PortalDest, 数组(矢量(270, 42.7, 190.44), 矢量(284.07, -12.75, -216.15), 矢量(-53.51, -154.5, 60.08), 矢量(284.07, -12.75, -216.15), 矢量(270, 42.7, 190.44), 矢量(-53.51, -154.5, 60.08)));
        Else If(比较(当前地图, ==, 地图(萨摩亚)));
            设置全局变量(PortalNames, 字符串分割(自定义字符串("beach0volcano0downtown0volcano0beach0downtown"), 首个(空)));
            设置全局变量(PortalLoc, 数组(矢量(231.98, 7.23, -262.84), 矢量(236.78, 7.23, -262.75), 矢量(-327.59, 3.6, -108.69), 矢量(-332.71, 3.6, -108.59), 矢量(25.4, 341, 354.38), 矢量(30, 341, 354.34)));
            设置全局变量(PortalDest, 数组(矢量(-329.86, 3.05, -103.4), 矢量(27.59, 339.76, 348.77), 矢量(234.07, 6.12, -266.88), 矢量(27.59, 339.76, 348.77), 矢量(-329.86, 3.05, -103.4), 矢量(234.07, 6.12, -266.88)));
    }
}

规则 ("Addon | Little destructo - fence breaker") {
    事件 {
        持续 - 全局;
    }
    动作 {
        "Made by FishoFire version 1.0\\nwait to overwrite any from copy pastas"
        等待(0.032, 无视条件);
        "first entry will act as index, rest is the points themselves"
        设置全局变量(MapVectorArray, 数组(空));
        "tdm/dm = first spawn points, the maps are not big so it just covers entire map. all teams defaults to team 1 spawn\\npush: payload and cp 0 are set but rest isnt. normal payload maps have more then 1 point.\\nrest of maps have up to 3 points"
        修改全局变量(MapVectorArray, 添加至数组, If-Then-Else(比较(当前游戏模式, ==, 游戏模式(勇夺锦旗)), 数组(旗帜位置(队伍1), 旗帜位置(队伍2)), If-Then-Else(数组包含(数组(游戏模式(团队死斗), 游戏模式(死斗)), 当前游戏模式), 首个(重生点(所有队伍)), If-Then-Else(与(首个(运载目标位置), 非(加(目标位置(真), 目标位置(2)))), 运载目标位置, 数组(目标位置(假), 目标位置(真), 目标位置(2))))));
        "explode in a grid around the selected points"
        While(比较(数量(全局.MapVectorArray), >, 1));
            在索引处设置全局变量(MapVectorArray, 假, 空);
            While(比较(首个(全局.MapVectorArray), <, 256));
                创建弹道(球弹道, 空, 加(加(减(数组中的值(全局.MapVectorArray, 真), 矢量(240, 假, 240)), 乘(余数(首个(全局.MapVectorArray), 16), 乘(30, 左))), 乘(取整(除(首个(全局.MapVectorArray), 16), 下), 乘(30, 前))), 下, 至地图, 治疗, 队伍1, 0, 0, 30, 有益爆炸, 爆炸声音, 1, 1, 0, 0, 0, 0);
                在索引处修改全局变量(MapVectorArray, 假, 加, 真);
                "use modulo to only wait every x orbs keep the 0 change the other number"
                If(非(余数(首个(全局.MapVectorArray), 3)));
                    等待(假, 无视条件);
                End;
            End;
            修改全局变量(MapVectorArray, 根据索引从数组中移除, 真);
        End;
        "handle exceptions (looking at you new queen street)"
        设置全局变量(MapVectorArray, 数组(矢量(8.276, 4.113, 15.261), 矢量(-8.319, 2.624, 14.245), 矢量(0.006, 4.821, 18.513)));
        While(数量(全局.MapVectorArray));
            "same as other projectile before"
            创建弹道(球弹道, 空, 首个(全局.MapVectorArray), 下, 至地图, 治疗, 队伍1, 0, 0, 30, 有益爆炸, 爆炸声音, 1, 1, 0, 0, 0, 0);
            修改全局变量(MapVectorArray, 根据索引从数组中移除, 假);
            等待(假, 无视条件);
        End;
        设置全局变量(MapVectorArray, 空);
    }
}

规则 ("Addon | Cache jump & crouch inputs for spectators") {
    事件 {
        玩家加入比赛;
        双方;
        全部;
    }
    动作 {
        等待(假, 无视条件);
        设置玩家变量(事件玩家, cache_inputs, 矢量(按钮被按下(事件玩家, 按钮(跳跃)), 按钮被按下(事件玩家, 按钮(蹲下)), 假));
        循环;
    }
}

规则 ("Addon | SUB Basic Map Validator") {
    事件 {
        子程序;
        AddonCheckMap;
    }
    动作 {
        根据条件中止(比较(数量(全局.A), <=, 1));
        生成机器人(英雄(安娜), If-Then-Else(比较(栏位数量(队伍1), <, 栏位数量(队伍2)), 队伍1, 队伍2), -1, 首个(全局.A), 空);
        设置全局变量(MsDestructo, 最后创建的实体);
        取消与环境的移动碰撞(全局.MsDestructo, 假);
        设置状态(全局.MsDestructo, 空, 相移, 999999999999);
        设置不可见(全局.MsDestructo, 全部);
        开始调整玩家大小(全局.MsDestructo, 3.111111111111110, 假);
        设置引力(全局.MsDestructo, 999999999999);
        "Not infinity incase dummy does not spawn"
        等待直到 (已重生(全局.MsDestructo), 16);
        For 玩家变量(全局.MsDestructo, checkpoint_current, 1, 数量(全局.A), 真);
            If(与(首个(最近的可行走位置(数组中的值(全局.A, (全局.MsDestructo).checkpoint_current))), 比较(相距距离(数组中的值(全局.A, (全局.MsDestructo).checkpoint_current), 最近的可行走位置(数组中的值(全局.A, (全局.MsDestructo).checkpoint_current))), >, 1.4)));
                开始强制设置玩家位置(全局.MsDestructo, 射线命中位置(加(数组中的值(全局.A, (全局.MsDestructo).checkpoint_current), 乘(1.4, 上)), 加(数组中的值(全局.A, (全局.MsDestructo).checkpoint_current), 乘(-1.4, 上)), 空数组, 空数组, 假), 真);
                等待(0.112, 无视条件);
                停止强制设置玩家位置(全局.MsDestructo);
                等待直到 (在地面上(全局.MsDestructo), 真);
                根据条件跳过(与(在地面上(全局.MsDestructo), 比较(相距距离(全局.MsDestructo, 数组中的值(全局.A, (全局.MsDestructo).checkpoint_current)), <=, 1.4)), 11);
                For 玩家变量(全局.MsDestructo, checkpoint_practice, 1.4, 1.2, -0.2);
                    开始强制设置玩家位置(全局.MsDestructo, 加(数组中的值(全局.A, (全局.MsDestructo).checkpoint_current), 乘(上, (全局.MsDestructo).checkpoint_practice)), 真);
                    等待(0.112, 无视条件);
                    停止强制设置玩家位置(全局.MsDestructo);
                    等待直到 (在地面上(全局.MsDestructo), 真);
                    根据条件跳过(与(在地面上(全局.MsDestructo), 比较(相距距离(全局.MsDestructo, 数组中的值(全局.A, (全局.MsDestructo).checkpoint_current)), <=, 1.4)), 5);
                End;
                启用查看器录制;
                记入查看器(自定义字符串("Fail {0}", (全局.MsDestructo).checkpoint_current));
                禁用查看器录制;
            End;
            //lbl_MapChecker_nextCp:
        End;
        设置玩家变量(全局.MsDestructo, editor_saveCache, 全局.EditorOn);
        设置全局变量(EditorOn, 空);
        启用查看器录制;
        记入查看器(自定义字符串("■ Map Check Complete ■"));
        禁用查看器录制;
        设置全局变量(EditorOn, (全局.MsDestructo).editor_saveCache);
        移除机器人(所在队伍(全局.MsDestructo), 栏位(全局.MsDestructo));
        设置全局变量(MsDestructo, 空);
    }
}

规则 ("Addon | SUB 3rd Person Camera") {
    事件 {
        子程序;
        Addon3rdPerson;
    }
    动作 {
        If((事件玩家).addon_toggle3rdPov);
            开始镜头(事件玩家, 逐帧更新(加(射线命中位置(加(乘(0.5, 上), 眼睛位置(事件玩家)), 加(加(乘(0.5, 上), 眼睛位置(事件玩家)), 乘(-3.5, 面朝方向(事件玩家))), 空数组, 空数组, 假), 乘(0.5, 面朝方向(事件玩家)))), 逐帧更新(加(乘(0.5, 上), 眼睛位置(事件玩家))), 假);
        Else;
            停止镜头(事件玩家);
        End;
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("Ø Map Data - 数据录入 <---- INSERT HERE / 在这输入") {
    事件 {
        持续 - 全局;
    }
}

规则 ("☞ Credits and Colors here - 作者代码HUD颜色 <---- INSERT HERE / 在这输入") {
    事件 {
        持续 - 全局;
    }
    动作 {
        等待(假, 无视条件);
        "Filling this in adds it to the inspector pasta after next restart.\\nYou can fill in again to overwrite.\\n修改的内容 在重新开始 比赛后生效\\n您可以反复 修改字符串 中的内容"
        设置全局变量(Name, 自定义字符串("name here - 作者"));
        设置全局变量(Code, 自定义字符串("code here - 代码"));
        "+++++  +++++  +++++  +++++  +++++  +++++\\ncolor customization below / 自定义 颜色(实体、HUD)\\n+++++  +++++  +++++  +++++  +++++  +++++\\n\\ncredit hud name   -   作者HUD"
        在索引处设置全局变量(ColorConfig, 假, 颜色(紫色));
        "credit hud code   -   代码HUD"
        在索引处设置全局变量(ColorConfig, 真, 颜色(天蓝色));
        "dsc.gg/genjiparkour"
        在索引处设置全局变量(ColorConfig, 18, 颜色(水绿色));
        "server time hud   -   房间倒计时"
        在索引处设置全局变量(ColorConfig, 2, 颜色(红色));
        "time  hud   -   单关用时HUD"
        在索引处设置全局变量(ColorConfig, 3, 颜色(白色));
        "level hud   -   关卡HUD"
        在索引处设置全局变量(ColorConfig, 4, 颜色(白色));
        "command hud   -   指令HUD"
        在索引处设置全局变量(ColorConfig, 5, 颜色(白色));
        "command hud highlight   -   指令HUD高亮"
        在索引处设置全局变量(ColorConfig, 6, 颜色(绿色));
        "bhop/climb available   -   小跳/爬墙未用HUD"
        在索引处设置全局变量(ColorConfig, 7, 颜色(绿色));
        "bhop/climb used (cant be same as available)   -   小跳/爬墙已用HUD"
        在索引处设置全局变量(ColorConfig, 8, 颜色(红色));
        "current checkpoint ring   -   当前检查点光圈"
        在索引处设置全局变量(ColorConfig, 9, 颜色(天蓝色));
        "next checkpoint ring   -   下一关检查点光圈"
        在索引处设置全局变量(ColorConfig, 10, 颜色(灰绿色));
        "next checkpoint light shaft   -   下一关检查点光柱"
        在索引处设置全局变量(ColorConfig, 11, 颜色(白色));
        "next checkpoint icon   -   下一关检查点图标"
        在索引处设置全局变量(ColorConfig, 12, 颜色(天蓝色));
        "\\"come here\\" text   -   到这里来\\" 文本"
        在索引处设置全局变量(ColorConfig, 13, 颜色(白色));
        "kill orbs   -   击杀球"
        在索引处设置全局变量(ColorConfig, 14, 颜色(蓝色));
        "normal orbs   -   弹球"
        在索引处设置全局变量(ColorConfig, 15, 颜色(绿色));
        "lock orbs (overwritten if its same as normal)\\n收集球 (与普通弹 球相同时将 自动覆写)"
        在索引处设置全局变量(ColorConfig, 16, 颜色(橙色));
        "portals   -   自定义 传送门"
        在索引处设置全局变量(ColorConfig, 17, 颜色(白色));
    }
}

规则 ("Instructions for Depricated Rules (ban / portal / dash /ult) - 旧版编辑器中已弃用规则指引 (单关封禁 / 传送门 / 给刀给S)") {
    事件 {
        持续 - 全局;
    }
    动作 {
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

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Addons Settings & Data - 附加组件 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

规则 ("Addon | Comp Mode instruction message - 竞赛模式指引消息 <---- INSERT HERE / 在这输入") {
    事件 {
        持续 - 全局;
    }
    动作 {
        等待(0.4, 无视条件);
        "Instructions that show when you start comp mode.\\nDue to the hud text limit, you there is 4 huds available.\\nIf you dont need a field just empty the textfield."
        中止;
        "竞赛模式 指引消息\\n指引消息将 会在竞赛模 式开始时 显示\\n由于 hud 文本限制，你有 4 个hud可用\\n如果你不需 要一个字段 只是空文 本字段"
        设置全局变量(instructiontext, 字符串分割(自定义字符串("Change in Comp Mode instruction message hud 10Change in Comp Mode instruction message hud 20Change in Comp Mode instruction m{0}", 自定义字符串("essage hud 30Change in Comp Mode instruction message hud 4")), 首个(空)));
    }
}

禁用 规则 ("Addon | Custom difficulty hud  - 自定义难度hud <---- INSERT HERE / 在这输入") {
    事件 {
        持续 - 全局;
    }
    动作 {
        "1) workshop settings > difficulty > set to \\"dont display\\"\\n2) enable this rule\\n3) type your difficulty in the hud below"
        等待(2.5, 无视条件);
        "1) 地图工坊设 置难度改为 “不显示”\\n2) 勾选此规则 点击上方的 开启/关闭 开启此规则\\n3) 修改下面的 创建hud文本 中的“enter custom difficulty here”"
        创建HUD文本(首个(真), If-Then-Else(最后(全局.Difficultyhud), If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("游戏测试"), 自定义字符串("Playtest")), 空数组), 自定义字符串("enter custom difficulty here"), 空, 顶部, -173, 颜色(蓝色), 颜色(绿色), 空, 可见和字符串, 默认可见度);
    }
}

禁用 规则 ("Addon | Title Data - 标题数据 <---- EDIT ME / 在此处编辑") {
    事件 {
        持续 - 全局;
    }
    动作 {
        "enable this rule and fill in the title data below.\\n启用此规则 并填写下面 的标题数据"
        等待(0.768, 无视条件);
        "checkpoint number\\n每关数量"
        在索引处设置全局变量(TitleData, 假, 数组(空, 10, 20, 30, 40, 50));
        "title\\n标题文本"
        在索引处设置全局变量(TitleData, 真, 字符串分割(自定义字符串("Bunny0Jumper0Ninja0Pro0Expert0Master"), 首个(空)));
        "color\\n颜色"
        在索引处设置全局变量(TitleData, 2, 数组(颜色(灰绿色), 颜色(白色), 颜色(黄色), 颜色(橙色), 颜色(亮紫色), 颜色(红色)));
    }
}

禁用 规则 ("Addon | Friend Title - 朋友称号 <---- DISPLAY MESSAGE HERE (ON PLAYER)") {
    事件 {
        玩家加入比赛;
        双方;
        全部;
    }
    动作 {
        "\\"your nickname\\" your friends ingame name\\n\\"display title\\" fill in the custom title\\n修改字符串 \\"your nickname <-------\\" 为好友名字 区分大小写\\n修改字符串 \\"display title\\" 为好友头顶 显示的称号"
        等待直到 (已重生(事件玩家), 999999999999);
        If(比较(自定义字符串("your nickname <-------"), ==, 字符串分割(首个(事件玩家), 空数组)));
            大字体信息(首个(真), 自定义字符串("Message to the whole room"));
            创建地图文本(首个(非((事件玩家).toggle_invisible)), 自定义字符串("display title"), 事件玩家, 1.5, 根据表面截取, 可见，位置和字符串, 颜色(橙色), 默认可见度);
        End;
        If(比较(自定义字符串("your nickname <-------"), ==, 字符串分割(首个(事件玩家), 空数组)));
            大字体信息(首个(真), 自定义字符串("Message to the whole room"));
            创建地图文本(首个(非((事件玩家).toggle_invisible)), 自定义字符串("display title"), 事件玩家, 1.5, 根据表面截取, 可见，位置和字符串, 颜色(橙色), 默认可见度);
        End;
        If(比较(自定义字符串("your nickname <-------"), ==, 字符串分割(首个(事件玩家), 空数组)));
            大字体信息(首个(真), 自定义字符串("Message to the whole room"));
            创建地图文本(首个(非((事件玩家).toggle_invisible)), 自定义字符串("display title"), 事件玩家, 1.5, 根据表面截取, 可见，位置和字符串, 颜色(橙色), 默认可见度);
    }
}

禁用 规则 ("Addon | Display Author Time - 展示世界纪录 <---- EDIT ME / 在此处编辑") {
    事件 {
        持续 - 全局;
    }
    动作 {
        "type your entry in the textfield that says \\"name and time here\\"\\n在文本框 中输入“名称和时间”"
        创建HUD文本(首个(真), 空, 自定义字符串(" \\n{0} author time {0}", 图标字符串(火焰)), 自定义字符串("name and time here"), 右边, -142, 空, 颜色(玫红), 颜色(玫红), 可见, 默认可见度);
    }
}

禁用 规则 ("Addon | HUD text for certain Checkpoints - 特定关卡显示的HUD文本 <---- EDIT ME / 在此处编辑") {
    事件 {
        持续 - 全局;
    }
    动作 {
        "the example fill shows a text for cp 1 and cp 3\\n示例已填写 关卡1和3 的hud文本"
        等待(0.768, 无视条件);
        "in CpHudText fill in text\\n修改字符串 “CpHudText” 为顶部显示 的hud文本"
        设置全局变量(CpHudText, 字符串分割(自定义字符串("text cp 10text cp 3"), 首个(空)));
        "in CpHudCp fill in the at wich to display\\n修改数组 “CpHudCp” 为hud文本 显示的关卡"
        设置全局变量(CpHudCp, 数组(1, 3));
    }
}

禁用 规则 ("Addon | Inworld text for certain Checkpoints - 特定关卡显示的地图文本 <---- EDIT ME / 在此处编辑") {
    事件 {
        持续 - 全局;
    }
    动作 {
        "the example fill shows a text for cp 1 and cp 3\\n示例已填写 关卡1和3 的地图文本"
        等待(0.768, 无视条件);
        "in CpIwtText fill in text\\n修改字符串 “CpIwtText” 为关卡显示 的地图文本"
        设置全局变量(CpIwtText, 字符串分割(自定义字符串("text cp 10text cp 3"), 首个(空)));
        "in CpIwtCp fill in cp at wich to display\\n修改数组 “CpIwtCp” 为显示地图 文本的关卡"
        设置全局变量(CpIwtCp, 数组(1, 3));
        "in CpIwtPos fill in the vector\\n修改数组 “CpIwtPos” 为地图文本 的矢量位置"
        设置全局变量(CpIwtPos, 数组(矢量(真, 真, 真), 矢量(真, 真, 真)));
        "color applies to all\\n选择应用到 所有地图文 本的颜色"
        设置全局变量(CpIwtColor, 颜色(灰绿色));
    }
}

禁用 规则 ("Addon | Hint text for certain Checkpoints - 特定关卡的提示文本 <---- EDIT ME / 在此处编辑") {
    事件 {
        持续 - 全局;
    }
    动作 {
        "the example fill shows a text for cp 1 and cp 3\\n示例已填写 关卡1和3 的提示文本"
        等待(0.768, 无视条件);
        "in HintText fill in text\\n修改字符串 “HintText” 为关卡显示 的提示文本"
        设置全局变量(HintText, 字符串分割(自定义字符串("text cp 10text cp 3"), 首个(空)));
        "in HintCp fill in the at wich to display\\n修改数组 “HintCp” 为提示文本 显示的关卡"
        设置全局变量(HintCp, 数组(1, 3));
    }
}

禁用 规则 ("Addon | 3rd Person Camera Mode - 第三人称") {
    事件 {
        玩家加入比赛;
        双方;
        全部;
    }
    动作 {
        "Default 1st person: False\\nDefault 3rd person: True"
        设置玩家变量(事件玩家, addon_toggle3rdPov, 真);
        调用子程序(Addon3rdPerson);
    }
}

规则 ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Addons Skills - 附加组件技能 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    事件 {
        持续 - 全局;
    }
}

禁用 规则 ("Addon | Stall Enhancer - 增强系統跳的判定") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        已重生(事件玩家) == 真;
        垂直速度(事件玩家) >= -0.2;
        垂直速度(事件玩家) <= 0.05;
        水平速度(事件玩家) <= 1.3;
        正在空中(事件玩家) == 真;
        全局.EditorOn != 假;
        (事件玩家).editor_fly == 假;
    }
    动作 {
        等待(0.25, 当为“假”时中止);
        开始强制设置玩家位置(事件玩家, 所选位置(事件玩家), 假);
        等待直到 (非(正在移动(事件玩家)), 1);
        停止强制设置玩家位置(事件玩家);
        设置移动速度(事件玩家, 假);
        设置引力(事件玩家, 假);
        "double jump catch"
        等待直到 (或(或(或(或(按钮被按下(事件玩家, 按钮(装填)), (事件玩家).editor_fly), 死亡(事件玩家)), 正在使用技能 1(事件玩家)), 比较(速度(事件玩家), >, 3)), 3);
        "wait(3)"
        设置引力(事件玩家, 100);
        设置移动速度(事件玩家, 100);
        If(与(存活(事件玩家), 非(或((事件玩家).editor_fly, 按钮被按下(事件玩家, 按钮(装填))))));
            施加推力(事件玩家, 上, 10, 至地图, 取消相反运动XYZ);
            如条件为“真”则循环;
    }
}

禁用 规则 ("Addon | Fake Ledge Dash - 超级跳") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        "Version 2"
        正在使用技能 1(事件玩家) == 真;
        速度(事件玩家) < 45;
        Z方向分量(阈值(事件玩家)) > 空;
        绝对值(减(垂直速度(事件玩家), 7)) < 0.8;
    }
    动作 {
        "Dash into a wall/edge\\nRelease wall/edge before dash ends"
        设置玩家变量(事件玩家, addon_ledgeDash, 面朝方向(事件玩家));
        "25 * 0.016"
        等待直到 (非(正在使用技能 1(事件玩家)), 真);
        If(正在空中(事件玩家));
            施加推力(事件玩家, (事件玩家).addon_ledgeDash, 50, 至地图, 取消相反运动XYZ);
    }
}

禁用 规则 ("Addon | Group up - Map Data") {
    事件 {
        持续 - 全局;
    }
    动作 {
        "replace 777 with checkpoint number\\nreplace vector 0,0,0 with orb position"
        创建地图文本(已过滤的数组(所有玩家(所有队伍), 比较((当前数组元素).checkpoint_current, ==, 777)), 自定义字符串("{0} {1} {0}", 技能图标字符串(英雄(源氏), 按钮(终极技能)), If-Then-Else(比较(字符串("噢"), ==, 自定义字符串("噢")), 自定义字符串("待在这里"), 自定义字符串("group up"))), 矢量(真, 真, 真), 1.5, 不要截取, 可见和字符串, 颜色(橙色), 默认可见度);
        "replace 777 with checkpoint number\\nreplace vector 0,0,0 with orb position\\n3.5 is the radius"
        创建效果(已过滤的数组(所有玩家(所有队伍), 比较((当前数组元素).checkpoint_current, ==, 777)), 球体, 颜色(橙色), 矢量(真, 真, 真), 3.5, 可见);
    }
}

禁用 规则 ("Addon | Group Up") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        "replace 777 with checkpoint number"
        (事件玩家).checkpoint_current == 777;
        存活(事件玩家) == 真;
        在地面上(事件玩家) == 假;
        (事件玩家).toggle_invincible == 假;
        "replace vector 0,0,0 with orb position\\n3.5 is the radius"
        相距距离(事件玩家, 矢量(真, 真, 真)) < 3.5;
    }
    动作 {
        小字体信息(事件玩家, 自定义字符串("   stay in the bubble"));
        等待(真, 当为“假”时中止);
        小字体信息(事件玩家, 自定义字符串("   9"));
        等待(真, 当为“假”时中止);
        小字体信息(事件玩家, 自定义字符串("   8"));
        等待(真, 当为“假”时中止);
        小字体信息(事件玩家, 自定义字符串("   7"));
        等待(真, 当为“假”时中止);
        小字体信息(事件玩家, 自定义字符串("   6"));
        等待(真, 当为“假”时中止);
        小字体信息(事件玩家, 自定义字符串("   5"));
        等待(真, 当为“假”时中止);
        小字体信息(事件玩家, 自定义字符串("   4"));
        等待(真, 当为“假”时中止);
        小字体信息(事件玩家, 自定义字符串("   3"));
        等待(真, 当为“假”时中止);
        小字体信息(事件玩家, 自定义字符串("   2"));
        等待(真, 当为“假”时中止);
        小字体信息(事件玩家, 自定义字符串("   1"));
        等待(真, 当为“假”时中止);
        开始强制设置玩家位置(事件玩家, 加(数组中的值(全局.A, 加((事件玩家).checkpoint_current, 真)), 乘(0.1, 上)), 假);
        设置状态(事件玩家, 空, 定身, 0.3);
        等待(0.112, 无视条件);
        停止强制设置玩家位置(事件玩家);
    }
}

禁用 规则 ("Addon | Custom checkpoint loading or resetting") {
    事件 {
        子程序;
        AddonCustomLoadAndReset;
    }
    动作 {
        "This subroutine activates on failing, arriving, resetting, skipping etc\\nexample: reset gravity and movespeed after being changed by custom orbs"
        设置引力(事件玩家, 100);
        设置移动速度(事件玩家, 100);
    }
}

禁用 规则 ("Addon | Custom Orb Script") {
    事件 {
        持续 - 每名玩家;
        双方;
        全部;
    }
    条件 {
        "Do not edit this condition !!!!!!!!!!!!!!!!!"
        (事件玩家).cache_bounceTouched >= 空;
    }
    动作 {
        "Note that the ID can change if you place or delete orbs infront of that orb.\\nAdd the desired ID numbers for the orb in the array\\nadd the script after it\\nyou can use the activateed sub above this rule to reset the effects"
        If(数组包含(数组(1, 2), (事件玩家).cache_bounceTouched));
            "example gravity (should be reset to 100 in AddonCustomLoadAndReset)"
            设置引力(事件玩家, 25);
            小字体信息(事件玩家, 自定义字符串(" You Feel Light"));
            等待(2, 无视条件);
            设置引力(事件玩家, 100);
        End;
        If(数组包含(数组(3, 4), (事件玩家).cache_bounceTouched));
            "example canceling primary makes double jump recover"
            取消主要动作(事件玩家);
            设置玩家变量(事件玩家, skill_usedDouble, 空);
            小字体信息(事件玩家, 自定义字符串(" Double Jump Recovered"));
        End;
        If(数组包含(数组(5, 6), (事件玩家).cache_bounceTouched));
            "example move speed"
            设置移动速度(事件玩家, 250);
            小字体信息(事件玩家, 自定义字符串(" Zooom"));
            等待(2, 无视条件);
            设置移动速度(事件玩家, 100);
    }
}

禁用 规则 ("Addon | Fake Triple Jump - 假三段跳") {
    事件 {
        持续 - 每名玩家;
        双方;
        源氏;
    }
    条件 {
        "@Condition BanTriple == false"
        在地面上(事件玩家) == 假;
        "Double cannot be used already"
        (事件玩家).skill_usedDouble == 假;
        "Don't activate on reset"
        按钮被按下(事件玩家, 按钮(装填)) == 假;
    }
    动作 {
        "Enable checking double jump"
        设置玩家变量(事件玩家, addon_enableDoubleChecks, 真);
        等待(假, 无视条件);
        如条件为“真”则循环;
        根据条件中止(或((事件玩家).skill_usedDouble, 按钮被按下(事件玩家, 按钮(装填))));
        "Input window to Triple"
        等待直到 (与(正在跳跃(事件玩家), 按钮被按下(事件玩家, 按钮(跳跃))), 0.048);
        If(与(按钮被按下(事件玩家, 按钮(跳跃)), 正在跳跃(事件玩家)));
            施加推力(事件玩家, 上, 9, 至地图, 取消相反运动XYZ);
        Else;
            如条件为“真”则循环;
    }
}


`;