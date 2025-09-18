// framework-template_pt-BR.js (auto)
export const frameworkTemplate = `configurações
{
	principal
	{
		Nome do modo: "Genji Parkour - 源氏跑酷 - v1.10.4A"
		Descrição: "\\n\\n\\n◀ The Official Genji Parkour Editor ▶\\nCode: 54CRY\\nAdapted by: LulledLion, FishoFire, Nebula\\nv1.10.4A"
	}
	lobby
	{
		Permitir jogadores na fila: Sim
		Bate-papo de Voz da Partida: Desativada
		Máximo de espectadores: 3
		Máximo de jogadores de Equipe 1: 11
		Máximo de jogadores de Equipe 2: 0
		Voltar ao lobby: Nunca
		Mudar de equipe após partida: Não
	}
	modos
	{
		Geral
		{
			Permitir troca de heróis: Desligado
			Barras de vida dos inimigos: Desligado
			Iniciar modo de jogo: Imediatamente
			Limite de heróis: Desligado
			Câmera de abates: Desligado
			Notificação de abates: Desligado
			Tempo escalar de ressurgimento: 0%
			Surgimento de kits médicos: Desabilitado
			Ressurgir como herói aleatório: Ligado
		}
		Confronto
		{
			mapas ativados
			{
			}
			Habilitar Aprimoramentos: Desligado
		}
		Combate até a Morte em Equipe
		{
			mapas ativados
			{
			}
			Habilitar Aprimoramentos: Desligado
			Ressurgimento auto iniciado: Desligado
		}
		desabilitado Caçador de Recompensas
		{
			Habilitar Aprimoramentos: Desligado
		}
		desabilitado Capture a Bandeira
		{
			Habilitar Aprimoramentos: Desligado
		}
		desabilitado Eliminação
		{
			Habilitar Aprimoramentos: Desligado
		}
		desabilitado Campo de Treinamento
		{
			Habilitar Aprimoramentos: Desligado
		}
	}
	heróis
	{
		Geral
		{
			Genji
			{
				Desviar: Desligado
				Sem requerimentos de munição: Ligado
				Tempo de recarga de Golpe Veloz: 1%
				Duração do Supremo: 25%
				Geração de Supremo - Passiva Lâmina do Dragão: 0%
				Geração de Supremo Lâmina do Dragão: 10%
			}
			heróis ativados
			{
				Genji
			}
		}
	}
	extensões
	{
		Gerar Mais Bots
		Reproduzir Mais Efeitos
	}
}
variáveis {
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
    jogador:
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
sub-rotinas {
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
regra ("Disable inspector") {
    evento {
        Em andamento - Global;
    }
    ações {
        Desativar gravação do Inspetor;
    }
}

regra ("OverPy | Global Init") {
    evento {
        Em andamento - Global;
    }
    ações {
        Definir Variável Global(__overpyTranslationHelper__, Divisão de String(String Personalizada("0White0흰색0白色"), Primeiro de(Nulo)));
    }
}

//Optimize for size enabled
regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Parkour v1.10.4A ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("Parkour | Setup & Variables") {
    evento {
        Em andamento - Global;
    }
    ações {
        "◀ The Official Genji Parkour Editor ▶\\nDiscord: dsc.gg/genjiparkour\\nCode: 54CRY\\nAdapted by: LulledLion, FishoFire, Nebula"
        Desativar Conclusão Integrada ao Modo de Jogo;
        Desativar Pontuação Integrada ao Modo de Jogo;
        Desativar Música Integrada ao Modo de Jogo;
        Desativar Narração Integrada ao Modo de Jogo;
        Começar a Forçar Sala de Ressurgimento(Todas as Equipes, False);
        Começar a Forçar Sala de Ressurgimento(Todas as Equipes, 1);
        Começar a Forçar Sala de Ressurgimento(Todas as Equipes, 2);
        "wait for map data rule"
        Esperar(0.24, Ignorar Condição);
        "Turn Editor On"
        Definir Variável Global(EditorOn, Alternar Configuração do Workshop(String Personalizada("Map Settings ■ 地图设置 ■ 맵 설정"), String Personalizada("Editor Mode ■ 作图模式 ■ 수정 모드"), False, 0));
        If(Alternar Configuração do Workshop(String Personalizada("Map Settings ■ 地图设置 ■ 맵 설정"), String Personalizada("Basic Map Validator ■ 验证地图 ■ 맵 가능 여부 확인기"), True, 3));
            Regra de início(AddonCheckMap, Não fazer nada);
        Término;
        Definir Variável Global(PortalOn, Alternar Configuração do Workshop(String Personalizada("Map Settings ■ 地图设置 ■ 맵 설정"), String Personalizada("Portals 󠀨Control Maps󠀩 ■ 启用传送门 󠀨占点地图󠀩 ■ 순간이동 활성화 󠀨쟁탈 맵󠀩"), True, 4));
        Definir Variável Global(CompMode, E(Não(Global.EditorOn), Alternar Configuração do Workshop(String Personalizada("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), String Personalizada("Tournament Mode ■ 开启竞赛模式 ■ 토너먼트 모드 활성화"), False, 100)));
        If(Global.CompMode);
            "-! comp minutes !-\\n5-240"
            Definir Variável Global(CompTime, Inteiro de Configuração do Workshop(String Personalizada("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), String Personalizada("Time Limit 󠀨Global󠀩 ■ 时间限制 ■ 시간 제한 󠀨전체󠀩"), 120, 1, 240, 101));
            "-! comp attempt count !-"
            Definir Variável Global(CompAtmpNum, Inteiro de Configuração do Workshop(String Personalizada("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), String Personalizada("Attempt Count ■ 尝试次数 ■ 시도 수 확인"), 5, 0, 500, 102));
            "-! comp restartlimiter !-"
            Definir Variável Global(CompRestartLimit, Alternar Configuração do Workshop(String Personalizada("Tournament Mode ■ 竞赛模式 ■ 토너먼트 모드"), String Personalizada("Disable Restart During Run ■ 竞赛中禁用重新开始 ■ 시도 중 재시작 비활성화"), False, 103));
        Else;
            Definir Variável Global(instructiontext, Nulo);
        Término;
        Definir Variável Global(SaveName, Matriz Vazia);
        Definir Variável Global(SaveCp, Matriz Vazia);
        Definir Variável Global(SaveTimer, Matriz Vazia);
        Definir Variável Global(SaveEnt, Matriz Vazia);
        Definir Variável Global(SaveElapsed, Matriz Vazia);
        Definir Variável Global(Dao, If-Then-Else(Contagem de(Global.Dao), Matriz Filtrada(Global.Dao, Comparar(Somar(Elemento da Matriz Atual, False), >=, Nulo)), Matriz Vazia));
        Definir Variável Global(SHIFT, If-Then-Else(Contagem de(Global.SHIFT), Matriz Filtrada(Global.SHIFT, Comparar(Somar(Elemento da Matriz Atual, False), >=, Nulo)), Matriz Vazia));
        Definir Variável Global(pinballnumber, If-Then-Else(Contagem de(Global.pinballnumber), Global.pinballnumber, Matriz Vazia));
        Definir Variável Global(A, If-Then-Else(Contagem de(Global.A), Global.A, Matriz Vazia));
        Definir Variável Global(A, If-Then-Else(Contagem de(Global.A), Global.A, Matriz Vazia));
        Definir Variável Global(killballnumber, If-Then-Else(Contagem de(Global.killballnumber), Global.killballnumber, Matriz Vazia));
        Definir Variável Global(H, If-Then-Else(Contagem de(Global.H), Global.H, Matriz Vazia));
        Definir Variável Global(I, If-Then-Else(Contagem de(Global.I), Global.I, Matriz Vazia));
        Definir Variável Global(K, If-Then-Else(Contagem de(Global.K), Global.K, Matriz Vazia));
        Definir Variável Global(TQ, If-Then-Else(Contagem de(Global.TQ), Global.TQ, Matriz Vazia));
        Definir Variável Global(TQ2, If-Then-Else(Contagem de(Global.TQ2), Global.TQ2, Matriz Vazia));
        Definir Variável Global(EditMode, If-Then-Else(Contagem de(Global.EditMode), Global.EditMode, Matriz Vazia));
        Definir Variável Global(TQ5, If-Then-Else(Contagem de(Global.TQ5), Global.TQ5, Matriz Vazia));
        Definir Variável Global(TQ6, If-Then-Else(Contagem de(Global.TQ6), Global.TQ6, Matriz Vazia));
        Definir Variável Global(BounceToggleLock, If-Then-Else(Contagem de(Global.BounceToggleLock), Global.BounceToggleLock, Matriz Vazia));
        Definir Variável Global(CustomPortalStart, If-Then-Else(Contagem de(Global.CustomPortalStart), Global.CustomPortalStart, Matriz Vazia));
        Definir Variável Global(CustomPortalEndpoint, If-Then-Else(Contagem de(Global.CustomPortalEndpoint), Global.CustomPortalEndpoint, Matriz Vazia));
        Definir Variável Global(CustomPortalCP, If-Then-Else(Contagem de(Global.CustomPortalCP), Global.CustomPortalCP, Matriz Vazia));
        Definir Variável Global(LeaderBoardFull, Matriz Vazia);
        Definir Variável Global(TitleData, Nulo);
        Definir Variável Global(HintCp, Matriz Vazia);
        Definir Variável Global(HintText, Matriz Vazia);
        "clean out -1's after the ban has loaded"
        Definir Variável Global(BanBhop, If-Then-Else(Contagem de(Global.BanBhop), Matriz Filtrada(Global.BanBhop, Comparar(Somar(Elemento da Matriz Atual, False), >=, Nulo)), Matriz Vazia));
        Definir Variável Global(BanClimb, If-Then-Else(Contagem de(Global.BanClimb), Matriz Filtrada(Global.BanClimb, Comparar(Somar(Elemento da Matriz Atual, False), >=, Nulo)), Matriz Vazia));
        Definir Variável Global(BanEmote, If-Then-Else(Contagem de(Global.BanEmote), Matriz Filtrada(Global.BanEmote, Comparar(Somar(Elemento da Matriz Atual, False), >=, Nulo)), Matriz Vazia));
        Definir Variável Global(BanDead, If-Then-Else(Contagem de(Global.BanDead), Matriz Filtrada(Global.BanDead, Comparar(Somar(Elemento da Matriz Atual, False), >=, Nulo)), Matriz Vazia));
        Definir Variável Global(BanCreate, If-Then-Else(Contagem de(Global.BanCreate), Matriz Filtrada(Global.BanCreate, Comparar(Somar(Elemento da Matriz Atual, False), >=, Nulo)), Matriz Vazia));
        Definir Variável Global(BanMulti, If-Then-Else(Contagem de(Global.BanMulti), Matriz Filtrada(Global.BanMulti, Comparar(Somar(Elemento da Matriz Atual, False), >=, Nulo)), Matriz Vazia));
        "BanTriple = [i for i in BanTriple if i + false >= 0] if len(BanTriple) else [] # legacy code, now auto sets it to null to save space"
        Definir Variável Global(BanStand, If-Then-Else(Contagem de(Global.BanStand), Matriz Filtrada(Global.BanStand, Comparar(Somar(Elemento da Matriz Atual, False), >=, Nulo)), Matriz Vazia));
        Definir Variável Global(BanSaveDouble, If-Then-Else(Contagem de(Global.BanSaveDouble), Global.BanSaveDouble, Matriz Vazia));
        Definir Variável Global(BanDjump, If-Then-Else(Contagem de(Global.BanDjump), Global.BanDjump, Matriz Vazia));
        "fix team because of naming"
        If(Comparar(Valor na Matriz(Global.ColorConfig, 16), ==, Cor(Equipe 1)));
            Definir Variável Global no Índice(ColorConfig, 16, Cor(Azul));
        Else If(Comparar(Valor na Matriz(Global.ColorConfig, 16), ==, Cor(Equipe 2)));
            Definir Variável Global no Índice(ColorConfig, 16, Cor(Vermelho));
        Término;
        "prevent same color lock orbs"
        If(Comparar(Valor na Matriz(Global.ColorConfig, 15), ==, Valor na Matriz(Global.ColorConfig, 16)));
            Definir Variável Global no Índice(ColorConfig, 16, If-Then-Else(Comparar(Valor na Matriz(Global.ColorConfig, 15), ==, Cor(Laranja)), Cor(Verde), Cor(Laranja)));
        Término;
        "prevent same color bhop/climb used/unused"
        If(Comparar(Valor na Matriz(Global.ColorConfig, 7), ==, Valor na Matriz(Global.ColorConfig, 8)));
            Definir Variável Global no Índice(ColorConfig, 8, If-Then-Else(Comparar(Valor na Matriz(Global.ColorConfig, 7), ==, Cor(Vermelho)), Cor(Laranja), Cor(Vermelho)));
    }
}

regra ("Parkour | Match time") {
    evento {
        Em andamento - Global;
    }
    ações {
        If(Comparar(Modo de jogo atual, !=, Modo de jogo(Confronto)));
            Esperar(False, Ignorar Condição);
            Definir Tempo da Partida(False);
            Esperar(False, Ignorar Condição);
            Definir Tempo da Partida(False);
            Esperar(False, Ignorar Condição);
        Término;
        Definir Tempo da Partida(70);
        Pausar Tempo da Partida;
        Esperar(False, Ignorar Condição);
        Definir Variável Global(TimeRemaining, 265);
        While(Global.TimeRemaining);
            Esperar(60, Ignorar Condição);
            Modificar Variável Global(TimeRemaining, Subtrair, True);
            If(Global.CompMode);
                Modificar Variável Global(CompTime, Subtrair, True);
                If(Não(Global.CompTime));
                    Mensagem Grande(Primeiro de(True), If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("时间到了"), String Personalizada("Time's Up")));
                    Definir Variável de Jogador(Todos os Jogadores(Todas as Equipes), comp_done, True);
                    Parar de Acompanhar Variável de Jogador(Todos os Jogadores(Todas as Equipes), timer_normal);
                    Definir Dano Recebido(Todos os Jogadores(Todas as Equipes), 100);
                    Abater(Todos os Jogadores(Todas as Equipes), Nulo);
                Término;
            Término;
        Término;
        "\\"房间已达最大持续时间, 即将重启\\" checkCN \\"Maximum Lobby Time Reached, Restarting\\""
        Mensagem Grande(Primeiro de(True), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒMaximum Lobby Time Reached, RestartingMaximum Lobby Time Reached, RestartingMaximum Lobby Time Reached, Restarting"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
        Esperar(5, Ignorar Condição);
        "Prevent crash during POTG and closing lobby"
        Definir Variável de Jogador(Todos os Jogadores(Todas as Equipes), lockState, True);
        Declarar Vitória do Jogador(Jogador Anfitrião);
        Declarar Vitória da Equipe(Equipe de(Jogador Anfitrião));
    }
}

regra ("Parkour | Player Initialize") {
    evento {
        Jogador Entrou na Partida;
        Todas;
        Tudo;
    }
    ações {
        Desabilitar HUD de Modo de Jogo(Jogador do Evento);
        Desabilitar Colisão de Movimento com Jogadores(Jogador do Evento);
        Definir Dano Recebido(Jogador do Evento, 0);
        Definir Variável de Jogador(Jogador do Evento, lockState, True);
        Anular se(É Bot(Jogador do Evento));
        Ativar Visualização de Todos os Jogadores na Morte(Jogador do Evento);
        Ativar HUD do Alvo de Visualização na Morte(Jogador do Evento);
        Desativar Ressurgimento Integrado ao Modo de Jogo(Jogador do Evento);
        Pré-carregar Herói(Jogador do Evento, Herói(Genji));
        Definir Variável de Jogador(Jogador do Evento, editor_lock, True);
        Definir Variável de Jogador(Jogador do Evento, toggle_guide, True);
        "eventPlayer.toggle_quickRestart = true"
        Definir Variável de Jogador(Jogador do Evento, cache_bounceTouched, -1);
        "big waits first for about 1 second before loading, to make sure things like comp mode are fully loaded and configured, load fx in meanwhile"
        Esperar(True, Ignorar Condição);
        Criar Efeito(Jogador do Evento, Anel, Valor na Matriz(Global.ColorConfig, 9), Último de(Valor na Matriz(Global.A, (Jogador do Evento).checkpoint_current)), True, Posição e Raio);
        Criar Efeito(If-Then-Else((Jogador do Evento).checkpoint_notLast, Jogador do Evento, Nulo), Anel, Valor na Matriz(Global.ColorConfig, 10), Valor na Matriz(Global.A, Somar((Jogador do Evento).checkpoint_current, True)), True, Visível para Posição e Raio);
        Criar Efeito(If-Then-Else((Jogador do Evento).checkpoint_notLast, Jogador do Evento, Nulo), Feixe de Luz, Valor na Matriz(Global.ColorConfig, 11), Valor na Matriz(Global.A, Somar((Jogador do Evento).checkpoint_current, True)), True, Visível para Posição e Raio);
        Criar Ícone(If-Then-Else((Jogador do Evento).checkpoint_notLast, Jogador do Evento, Nulo), Somar(Valor na Matriz(Global.A, Somar((Jogador do Evento).checkpoint_current, True)), Cima), Seta: Baixo, Visível para e Posição, Valor na Matriz(Global.ColorConfig, 12), True);
        Esperar até(Surgiu(Jogador do Evento), 999999999999);
        Definir Variável de Jogador(Jogador do Evento, editor_lock, False);
        If(Global.CompMode);
            Definir como Invisível(Jogador do Evento, Todos);
            If(Matriz Contém(Global.CompAtmpSaveNames, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia)));
                Definir Variável de Jogador(Jogador do Evento, comp_countAttempts, Valor na Matriz(Global.CompAtmpSaveCount, Índice do Valor da Matriz(Global.CompAtmpSaveNames, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia))));
            "instructions and settings for comp start"
            Else;
                Definir Variável de Jogador(Jogador do Evento, comp_instructionHud, True);
                Modificar Variável Global(CompAtmpSaveNames, Juntar à Matriz, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia));
                Modificar Variável Global(CompAtmpSaveCount, Juntar à Matriz, 1);
                Definir Variável de Jogador(Jogador do Evento, comp_countAttempts, 1);
                Definir Velocidade de Movimento(Jogador do Evento, False);
                Definir Habilidade 1 como Ativada(Jogador do Evento, False);
                Definir Habilidade Suprema como Ativada(Jogador do Evento, False);
                Esperar até(Não(É Botão Segurado(Jogador do Evento, Botão(Interagir))), True);
                Esperar até(Ou(É Botão Segurado(Jogador do Evento, Botão(Interagir)), Comparar(Global.CompTime, <, 1)), 999999999999);
                Definir Velocidade de Movimento(Jogador do Evento, 100);
                Definir Variável de Jogador(Jogador do Evento, comp_instructionHud, False);
            Término;
            If(Ou(Comparar((Jogador do Evento).comp_countAttempts, <, Nulo), Comparar(Global.CompTime, <, 1)));
                Definir Variável de Jogador(Jogador do Evento, comp_done, True);
            Término;
        Término;
        Esperar(False, Ignorar Condição);
        "initialization of the game"
        Chamar sub-rotina(StartGame);
        Definir Variável de Jogador(Jogador do Evento, lockState, False);
    }
}

regra ("Parkour | Player Leaves") {
    evento {
        Jogador Saiu da Partida;
        Todas;
        Tudo;
    }
    ações {
        If(Valor na Matriz(Global.SaveCp, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento)));
            If(E(Comparar(Valor na Matriz(Global.SaveCp, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento)), <, Subtrair(Contagem de(Global.A), True)), Valor na Matriz(Global.SaveElapsed, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento))));
                Definir Variável Global no Índice(SaveTimer, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento), Somar(Subtrair(Tempo Total Decorrido, Valor na Matriz(Global.SaveElapsed, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento))), Valor na Matriz(Global.SaveTimer, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento))));
            Término;
        "delete if player didnt do first cp"
        Else;
            Chamar sub-rotina(DeleteSave);
    }
}

regra ("Parkour | Ground: Traces, Arrive, & Reset") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        (Jogador do Evento).lockState == False;
        É No Chão(Jogador do Evento) == True;
        É Vivo(Jogador do Evento) == True;
    }
    ações {
        If(Não((Jogador do Evento).checkpoint_notLast));
            If(E(É Movimentando-se(Jogador do Evento), Não(Ou(Ou(Ou((Jogador do Evento).toggle_practice, (Jogador do Evento).toggle_invisible), Global.EditorOn), Global.CompMode))));
                "traces ----------------------------------------------------------------------------------------------------"
                Definir Variável de Jogador(Jogador do Evento, cache_rainbow, Valor na Matriz(Matriz(Cor(Vermelho), Cor(Laranja), Cor(Amarelo), Cor(Verde-limão), Cor(Verde), Cor(Turquesa), Cor(Azul), Cor(Roxo), Cor(Violeta), Cor(Rosa)), Modular(Arredondar para Inteiro(Multiplicar(Tempo Total Decorrido, 2), Baixo), 10)));
                "eventPlayer.cache_rainbow =  rgb((cosDeg(getTotalTimeElapsed()/2 * 360 - 0) + 0.5) * 255, (cosDeg(getTotalTimeElapsed/2 * 360 - 120) + 0.5) * 255, (cosDeg(getTotalTimeElapsed/2 * 360 - 240) + 0.5) * 255)\\n1.6 - 0.2 in 0.2 steps"
                Reproduzir Efeito(Primeiro de(True), Explosão em Anel, (Jogador do Evento).cache_rainbow, Posição de(Jogador do Evento), 0.4);
                Esperar(0.048, Ignorar Condição);
                Reproduzir Efeito(Primeiro de(True), Explosão em Anel, (Jogador do Evento).cache_rainbow, Posição de(Jogador do Evento), 0.6);
                Esperar(0.048, Ignorar Condição);
                Reproduzir Efeito(Primeiro de(True), Explosão em Anel, (Jogador do Evento).cache_rainbow, Posição de(Jogador do Evento), 0.8);
                Esperar(0.048, Ignorar Condição);
                Reproduzir Efeito(Primeiro de(True), Explosão em Anel, (Jogador do Evento).cache_rainbow, Posição de(Jogador do Evento), 1);
                Esperar(0.048, Ignorar Condição);
                Reproduzir Efeito(Primeiro de(True), Explosão em Anel, (Jogador do Evento).cache_rainbow, Posição de(Jogador do Evento), 1.2);
                Esperar(0.048, Ignorar Condição);
                Reproduzir Efeito(Primeiro de(True), Explosão em Anel, (Jogador do Evento).cache_rainbow, Posição de(Jogador do Evento), 1.4);
                Esperar(0.048, Ignorar Condição);
            Término;
        "or eventPlayer.lockState:"
        Else If(Ou(Ou((Jogador do Evento).toggle_invincible, (Jogador do Evento).toggle_spectate), E(Global.CompMode, Não(Global.CompTime))));
        Else If(Comparar(Distância entre(Jogador do Evento, Valor na Matriz(Global.A, Somar((Jogador do Evento).checkpoint_current, True))), <=, 1.4));
            "arrived ----------------------------------------------------------------------------------------------------"
            If(Comparar(Contagem de((Jogador do Evento).cache_collectedLocks), <, (Jogador do Evento).cache_bounceMaxLocks));
                "\\"   ! 进点前需集齐所有收集球 !\\" checkCN \\"   ! collect ALL {} orbs to unlock !\\".format(ColorConfig[Customize.orb_lock])"
                Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   ! Collect All Lock Orbs To Complete !   ! Collect All Lock Orbs To Complete !   ! Collect All Lock Orbs To Complete !"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
                "kill player if not colleted the locks"
                Chamar sub-rotina(CheckpointFailReset);
            Else If(E((Jogador do Evento).ban_climb, (Jogador do Evento).skill_usedClimb));
                "\\"   爬墙 ↑ 已禁用!\\" checkCN \\"   Climb ↑ is banned!\\")"
                Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   Climb ↑ Is Banned!   Climb ↑ Is Banned!   Climb ↑ Is Banned!"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
                Chamar sub-rotina(CheckpointFailReset);
            Else If(E((Jogador do Evento).ban_bhop, (Jogador do Evento).skill_usedBhop));
                "\\"   ≥ 留小跳进点!\\" checkCN \\"   ≥ Must Have A Bhop To Complete!!\\""
                Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   ≥ Must Have A Bhop To Complete!   ≥ Must Have A Bhop To Complete!   ≥ Must Have A Bhop To Complete!"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
                Chamar sub-rotina(CheckpointFailReset);
            Else If(E((Jogador do Evento).ban_djump, (Jogador do Evento).skill_usedDouble));
                "\\"   » 留二段跳!\\" checkCN \\"   » Must Have A Double Jump To Complete!\\""
                Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   » Must Have A Double Jump To Complete!   » Must Have A Double Jump To Complete!   » Must Have A Double Jump To Com{0}", String Personalizada("plete!")), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
                Chamar sub-rotina(CheckpointFailReset);
            Else;
                Definir Variável de Jogador(Jogador do Evento, checkpoint_moved, True);
                Modificar Variável de Jogador(Jogador do Evento, checkpoint_current, Adicionar, True);
                If(Comparar((Jogador do Evento).timer_splitDisplay, >, -999999999999));
                    Definir Variável de Jogador(Jogador do Evento, timer_splitDisplay, Subtrair(If-Then-Else((Jogador do Evento).toggle_practice, (Jogador do Evento).timer_practice, (Jogador do Evento).timer_normal), (Jogador do Evento).timer_split));
                Término;
                If((Jogador do Evento).toggle_practice);
                    Definir Variável de Jogador(Jogador do Evento, timer_split, (Jogador do Evento).timer_practice);
                Else;
                    Definir Variável de Jogador(Jogador do Evento, timer_split, (Jogador do Evento).timer_normal);
                    Chamar sub-rotina(DeleteSave);
                    "complete lvl"
                    If(E(Comparar((Jogador do Evento).checkpoint_current, ==, Subtrair(Contagem de(Global.A), True)), Não(Global.EditorOn)));
                        Parar de Acompanhar Variável de Jogador(Jogador do Evento, timer_normal);
                        Chamar sub-rotina(LeaderboardUpdate);
                        If(E(Global.CompMode, Global.CompAtmpNum));
                            If(Comparar((Jogador do Evento).comp_countAttempts, ==, Global.CompAtmpNum));
                                Definir Variável Global no Índice(CompAtmpSaveCount, Índice do Valor da Matriz(Global.CompAtmpSaveNames, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia)), -1);
                                Definir Variável de Jogador(Jogador do Evento, comp_countAttempts, -1);
                                Definir Variável de Jogador(Jogador do Evento, comp_done, True);
                                Definir Variável de Jogador(Jogador do Evento, toggle_leaderboard, True);
                                "eventPlayer.disableRespawn()"
                                Definir Dano Recebido(Jogador do Evento, 100);
                                Abater(Jogador do Evento, Nulo);
                                Definir Dano Recebido(Jogador do Evento, 0);
                            Else;
                                Definir Variável Global no Índice(CompAtmpSaveCount, Índice do Valor da Matriz(Global.CompAtmpSaveNames, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia)), Somar((Jogador do Evento).comp_countAttempts, True));
                            Término;
                        Término;
                        "\\"已通关! 用时\\" checkCN \\"Mission Complete! Time\\""
                        Mensagem Grande(Primeiro de(True), String Personalizada("{0} {1} {2} Sec", Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒMission Complete! TimeMission Complete! TimeMission Complete! Time"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), (Jogador do Evento).timer_normal));
                        Esperar(False, Ignorar Condição);
                    "update save"
                    Else;
                        Chamar sub-rotina(MakeSave);
                    Término;
                    Chamar sub-rotina(UpdateTitle);
                Término;
                Chamar sub-rotina(UpdateCache);
                "teleport cps"
                If(Comparar(Contagem de(Valor na Matriz(Global.A, (Jogador do Evento).checkpoint_current)), >, 1));
                    Chamar sub-rotina(CheckpointFailReset);
                Else;
                    Chamar sub-rotina(AddonCustomLoadAndReset);
                Término;
                Esperar(False, Ignorar Condição);
                "msg disabled due to annoying new sound\\nbigMessage(eventPlayer,  \\"{1} {0}\\".format(eventPlayer.checkpoint_current, \\"抵达检查点\\" checkCN \\"Arrived at level\\"))"
                Reproduzir Efeito(Jogador do Evento, Som de Explosão para Anel, Nulo, Jogador do Evento, 100);
                Reproduzir Efeito(If-Then-Else(Ou(Global.CompMode, (Jogador do Evento).toggle_invisible), Jogador do Evento, True), Explosão em Anel, Cor(Azul-celeste), Posição de(Jogador do Evento), 4);
            Término;
        Else If(Comparar(Distância entre(Jogador do Evento, Último de(Valor na Matriz(Global.A, (Jogador do Evento).checkpoint_current))), >, 1.4));
            Chamar sub-rotina(CheckpointFailReset);
        Término;
        Definir Variável de Jogador(Jogador do Evento, cache_collectedLocks, Matriz Vazia);
        Esperar(0.048, Ignorar Condição);
        Gerar Loop se a Condição for Verdadeira;
    }
}

regra ("Parkour | Boundary Sphere") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        (Jogador do Evento).cache_killPosition != Matriz Vazia;
        (Jogador do Evento).toggle_invincible == False;
        (Jogador do Evento).checkpoint_notLast != False;
        É Verdadeiro para Qualquer((Jogador do Evento).cache_killRadii, Comparar(Multiplicar(Normalizar(Elemento da Matriz Atual), Distância entre(Valor na Matriz((Jogador do Evento).cache_killPosition, Índice da Matriz Atual), Jogador do Evento)), <, Elemento da Matriz Atual)) == True;
    }
    ações {
        Chamar sub-rotina(CheckpointFailReset);
    }
}

regra ("Parkour | Bounce Ball / Orb") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        (Jogador do Evento).cache_bouncePosition != Matriz Vazia;
        "@Condition eventPlayer.checkpoint_notLast # disabled coz editor"
        É Verdadeiro para Qualquer((Jogador do Evento).cache_bouncePosition, Comparar(Distância entre(Elemento da Matriz Atual, Somar(Posição de(Jogador do Evento), Multiplicar(0.7, Cima))), <, 1.4)) == True;
    }
    ações {
        Definir Variável de Jogador(Jogador do Evento, cache_bounceTouched, Índice do Valor da Matriz(Global.TQ, Matriz Filtrada(Global.TQ, E(E(E(Comparar(Valor na Matriz(Global.pinballnumber, Índice da Matriz Atual), ==, (Jogador do Evento).checkpoint_current), Comparar(Índice da Matriz Atual, !=, (Jogador do Evento).cache_bounceTouched)), Não(Matriz Contém((Jogador do Evento).cache_collectedLocks, Índice da Matriz Atual))), Comparar(Distância entre(Somar(Jogador do Evento, Multiplicar(0.7, Cima)), Elemento da Matriz Atual), <, 1.4)))));
        "prevent same one activating twice in a row"
        If(Comparar((Jogador do Evento).cache_bounceTouched, >=, Nulo));
            If(Valor na Matriz(Global.BounceToggleLock, (Jogador do Evento).cache_bounceTouched));
                Modificar Variável de Jogador(Jogador do Evento, cache_collectedLocks, Juntar à Matriz, (Jogador do Evento).cache_bounceTouched);
                "\\"   弹球已收集\\" checkCN \\"   orb has been collected\\""
                Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   Collected Orb   Collected Orb   Collected Orb"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
            Término;
            If(Comparar(Valor na Matriz(Global.EditMode, (Jogador do Evento).cache_bounceTouched), >, Nulo));
                Aplicar Impulso(Jogador do Evento, Cima, Valor na Matriz(Global.EditMode, (Jogador do Evento).cache_bounceTouched), Ao Mundo, Cancelar Deslocamento Contrário XYZ);
            Else If(Comparar(Valor na Matriz(Global.EditMode, (Jogador do Evento).cache_bounceTouched), <, Nulo));
                Cancelar Ação Primária(Jogador do Evento);
                Definir Variável de Jogador(Jogador do Evento, skill_usedDouble, Nulo);
                "\\"   二段跳已就绪\\" checkCN \\"   » Double Jump is ready\\""
                Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   » Double Jump Is Ready   » Double Jump Is Ready   » Double Jump Is Ready"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
            Término;
            If(Valor na Matriz(Global.TQ5, (Jogador do Evento).cache_bounceTouched));
                Definir Habilidade Suprema como Ativada(Jogador do Evento, True);
                Definir Carga da Suprema(Jogador do Evento, 100);
                "\\"终极技能已就绪\\" checkCN \\"Ultimate is ready\\""
                Mensagem Pequena(Jogador do Evento, String Personalizada("   {0} {1}", String de Ícone de Habilidade(Herói(Genji), Botão(Habilidade Suprema)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒUltimate Is ReadyUltimate Is ReadyUltimate Is Ready"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))));
            Término;
            If(Valor na Matriz(Global.TQ6, (Jogador do Evento).cache_bounceTouched));
                If(É Usando Habilidade 1(Jogador do Evento));
                    Esperar até(Não(É Usando Habilidade 1(Jogador do Evento)), True);
                    Esperar(False, Ignorar Condição);
                Término;
                Definir Habilidade 1 como Ativada(Jogador do Evento, True);
                "\\"技能1影已就绪\\" checkCN \\"Dash is ready\\""
                Mensagem Pequena(Jogador do Evento, String Personalizada("   {0} {1}", String de Ícone de Habilidade(Herói(Genji), Botão(Habilidade 1)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒDash Is ReadyDash Is ReadyDash Is Ready"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))));
            Término;
            Reproduzir Efeito(Jogador do Evento, Som de Explosão para Bônus, Nulo, Jogador do Evento, 75);
        Término;
        Esperar(0.24, Ignorar Condição);
        Gerar Loop se a Condição for Verdadeira;
        Definir Variável de Jogador(Jogador do Evento, cache_bounceTouched, -1);
    }
}

regra ("Parkour | Death Reset") {
    evento {
        Jogador morreu;
        Todas;
        Tudo;
    }
    condições {
        É Bot(Jogador do Evento) == False;
        (Jogador do Evento).toggle_spectate == False;
        (Jogador do Evento).comp_done == False;
    }
    ações {
        If(Contagem de(Global.A));
            Ressuscitar(Jogador do Evento);
        Else;
            Ressurgir(Jogador do Evento);
        Término;
        Chamar sub-rotina(CheckpointFailReset);
        "rest is to prevent dead spamming from crashing server\\nbut doing waits only when needed without relying on a variable count"
        Esperar até(É Vivo(Jogador do Evento), True);
        Esperar até(É Morto(Jogador do Evento), True);
        If(E(É Morto(Jogador do Evento), Não(Ou((Jogador do Evento).toggle_spectate, (Jogador do Evento).comp_done))));
            Esperar(0.16, Ignorar Condição);
            Ressuscitar(Jogador do Evento);
            Chamar sub-rotina(CheckpointFailReset);
            Esperar até(É Vivo(Jogador do Evento), True);
            Esperar até(É Morto(Jogador do Evento), True);
            If(E(É Morto(Jogador do Evento), Não(Ou((Jogador do Evento).toggle_spectate, (Jogador do Evento).comp_done))));
                Esperar(0.44, Ignorar Condição);
                Ressuscitar(Jogador do Evento);
                Chamar sub-rotina(CheckpointFailReset);
                Esperar até(É Vivo(Jogador do Evento), True);
                Esperar até(É Morto(Jogador do Evento), True);
                If(E(É Morto(Jogador do Evento), Não(Ou((Jogador do Evento).toggle_spectate, (Jogador do Evento).comp_done))));
                    Esperar(0.64, Ignorar Condição);
                    Ressurgir(Jogador do Evento);
                    Chamar sub-rotina(CheckpointFailReset);
    }
}

regra ("Parkour | SUB Update Effect Cache") {
    evento {
        Sub-rotina;
        UpdateCache;
    }
    ações {
        "note: if adding cp pos to cache, make sure to also adjust editor things like move and teleport"
        Definir Variável de Jogador(Jogador do Evento, cache_bouncePosition, Matriz Filtrada(Global.TQ, Comparar(Valor na Matriz(Global.pinballnumber, Índice da Matriz Atual), ==, (Jogador do Evento).checkpoint_current)));
        "eventPlayer.cache_bounceLocks = [_ for _, i in BounceToggleLock if BouncePadCheckpoints[i] == eventPlayer.checkpoint_current and _]\\neventPlayer.cache_bounceMaxLocks = len([_ for _ in eventPlayer.cache_bounceLocks if _])"
        Definir Variável de Jogador(Jogador do Evento, cache_bounceMaxLocks, Contagem de(Matriz Filtrada(Global.BounceToggleLock, E(Comparar(Valor na Matriz(Global.pinballnumber, Índice da Matriz Atual), ==, (Jogador do Evento).checkpoint_current), Elemento da Matriz Atual))));
        Definir Variável de Jogador(Jogador do Evento, cache_killPosition, Matriz Filtrada(Global.H, Comparar(Valor na Matriz(Global.killballnumber, Índice da Matriz Atual), ==, (Jogador do Evento).checkpoint_current)));
        Definir Variável de Jogador(Jogador do Evento, cache_killRadii, Matriz Filtrada(Global.I, Comparar(Valor na Matriz(Global.killballnumber, Índice da Matriz Atual), ==, (Jogador do Evento).checkpoint_current)));
        Definir Variável de Jogador(Jogador do Evento, cache_portalStart, Matriz Filtrada(Global.CustomPortalStart, Ou(Comparar(Valor na Matriz(Global.CustomPortalCP, Índice da Matriz Atual), ==, (Jogador do Evento).checkpoint_current), Comparar(Valor na Matriz(Global.CustomPortalCP, Índice da Matriz Atual), <, Nulo))));
        Definir Variável de Jogador(Jogador do Evento, cache_portalEnd, Matriz Filtrada(Global.CustomPortalEndpoint, Ou(Comparar(Valor na Matriz(Global.CustomPortalCP, Índice da Matriz Atual), ==, (Jogador do Evento).checkpoint_current), Comparar(Valor na Matriz(Global.CustomPortalCP, Índice da Matriz Atual), <, Nulo))));
        Definir Variável de Jogador(Jogador do Evento, checkpoint_notLast, E(Comparar((Jogador do Evento).checkpoint_current, <, Subtrair(Contagem de(Global.A), True)), Comparar(Contagem de(Global.A), >, 1)));
        Definir Variável de Jogador(Jogador do Evento, toggle_hints, False);
        Definir Variável de Jogador(Jogador do Evento, banString, Matriz Vazia);
        Esperar(False, Ignorar Condição);
        If((Jogador do Evento).checkpoint_notLast);
            Definir Variável de Jogador(Jogador do Evento, ban_multi, Ou(Alternar Configuração do Workshop(String Personalizada("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), String Personalizada("Ban Multiclimb ■ 封禁蹭留 ■ 무한 벽타기 금지"), False, 1), Matriz Contém(Global.BanMulti, (Jogador do Evento).checkpoint_current)));
            If((Jogador do Evento).ban_multi);
                Definir Variável de Jogador(Jogador do Evento, banString, String Personalizada("∞ {0}", (Jogador do Evento).banString));
            Término;
            Definir Variável de Jogador(Jogador do Evento, ban_create, Ou(Alternar Configuração do Workshop(String Personalizada("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), String Personalizada("Ban Createbhop ■ 封禁卡小 ■ 콩콩이 생성 금지"), False, 2), Matriz Contém(Global.BanCreate, (Jogador do Evento).checkpoint_current)));
            If((Jogador do Evento).ban_create);
                Definir Variável de Jogador(Jogador do Evento, banString, String Personalizada("♂ {0}", (Jogador do Evento).banString));
            Término;
            Definir Variável de Jogador(Jogador do Evento, ban_standcreate, Ou(Alternar Configuração do Workshop(String Personalizada("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), String Personalizada("Ban Standcreate ■ 封禁站卡 ■ 서서 콩콩이 생성 금지"), False, 3), Matriz Contém(Global.BanStand, (Jogador do Evento).checkpoint_current)));
            If((Jogador do Evento).ban_standcreate);
                "≥  √ ▼ ↓"
                Definir Variável de Jogador(Jogador do Evento, banString, String Personalizada("♠ {0}", (Jogador do Evento).banString));
            Término;
            Definir Variável de Jogador(Jogador do Evento, ban_dead, Ou(Alternar Configuração do Workshop(String Personalizada("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), String Personalizada("Ban Deathbhop ■ 封禁死小 ■ 죽음 콩콩이 금지"), False, 4), Matriz Contém(Global.BanDead, (Jogador do Evento).checkpoint_current)));
            If((Jogador do Evento).ban_dead);
                Definir Variável de Jogador(Jogador do Evento, banString, String Personalizada("X {0}", (Jogador do Evento).banString));
            Término;
            Definir Variável de Jogador(Jogador do Evento, ban_emote, Ou(Alternar Configuração do Workshop(String Personalizada("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), String Personalizada("Ban Emote Savehop ■ 封禁表情留小 ■ 감정표현 콩콩이 금지"), False, 5), Matriz Contém(Global.BanEmote, (Jogador do Evento).checkpoint_current)));
            If((Jogador do Evento).ban_emote);
                Definir Variável de Jogador(Jogador do Evento, banString, String Personalizada("♥ {0}", (Jogador do Evento).banString));
            Término;
            Definir Variável de Jogador(Jogador do Evento, ban_savedouble, Ou(Alternar Configuração do Workshop(String Personalizada("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), String Personalizada("Ban Save Double ■ 封禁留二段跳 ■ 이단점프 킵 금지"), False, 6), Matriz Contém(Global.BanSaveDouble, (Jogador do Evento).checkpoint_current)));
            If((Jogador do Evento).ban_savedouble);
                Definir Variável de Jogador(Jogador do Evento, banString, String Personalizada("△ {0}", (Jogador do Evento).banString));
            Término;
            Definir Variável de Jogador(Jogador do Evento, ban_climb, Ou(Alternar Configuração do Workshop(String Personalizada("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), String Personalizada("Ban Wallclimb ■ 封禁爬墙 ■ 벽타기 금지"), False, 7), Matriz Contém(Global.BanClimb, (Jogador do Evento).checkpoint_current)));
            If((Jogador do Evento).ban_climb);
                Definir Variável de Jogador(Jogador do Evento, banString, String Personalizada("↑ {0}", (Jogador do Evento).banString));
            Término;
            Definir Variável de Jogador(Jogador do Evento, ban_bhop, Ou(Alternar Configuração do Workshop(String Personalizada("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), String Personalizada("Require Bhop Available ■ 留小跳进点 ■ 도착 시 콩콩이 필요"), False, 8), Matriz Contém(Global.BanBhop, (Jogador do Evento).checkpoint_current)));
            If((Jogador do Evento).ban_bhop);
                "≥  √ ▼ ↓"
                Definir Variável de Jogador(Jogador do Evento, banString, String Personalizada("≥ {0}", (Jogador do Evento).banString));
            Término;
            Definir Variável de Jogador(Jogador do Evento, ban_djump, Ou(Alternar Configuração do Workshop(String Personalizada("Ban (All Levels) ■ 封禁(应用于所有关卡) ■ 금지 (모든 레벨에 적용)"), String Personalizada("Require Djump Available ■ 留二段跳进点 ■ 도착 시 이단 점프 필요"), False, 9), Matriz Contém(Global.BanDjump, (Jogador do Evento).checkpoint_current)));
            If((Jogador do Evento).ban_djump);
                "≥  √ ▼ ↓ ︽"
                Definir Variável de Jogador(Jogador do Evento, banString, String Personalizada("» {0}", (Jogador do Evento).banString));
            Término;
        Else;
            Definir Variável de Jogador(Jogador do Evento, ban_multi, False);
            Definir Variável de Jogador(Jogador do Evento, ban_create, False);
            Definir Variável de Jogador(Jogador do Evento, ban_standcreate, False);
            Definir Variável de Jogador(Jogador do Evento, ban_dead, False);
            Definir Variável de Jogador(Jogador do Evento, ban_emote, False);
            Definir Variável de Jogador(Jogador do Evento, ban_climb, False);
            Definir Variável de Jogador(Jogador do Evento, ban_savedouble, False);
            Definir Variável de Jogador(Jogador do Evento, ban_bhop, False);
            Definir Variável de Jogador(Jogador do Evento, ban_djump, False);
        Término;
        Esperar(False, Ignorar Condição);
        Regra de início(CheckUlt, Não fazer nada);
        Regra de início(CheckAbility1, Não fazer nada);
        Anular se(Ou(Comparar(Jogador do Evento, !=, Jogador Anfitrião), Não(Global.EditorOn)));
        Chamar sub-rotina(EditUpdateSelectedIds);
        Destruir Efeito((Jogador Anfitrião).editor_hitboxEffect);
        Criar Efeito(If-Then-Else((Jogador Anfitrião).editor_hitboxToggle, Jogador Anfitrião, Nulo), Esfera, Cor(Branco), Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current), 1.4, Visível para Posição e Raio);
        Definir Variável de Jogador(Jogador Anfitrião, editor_hitboxEffect, Entidade Criada por Último);
        Criar Efeito(If-Then-Else(E((Jogador Anfitrião).editor_hitboxToggle, (Jogador Anfitrião).checkpoint_notLast), Jogador Anfitrião, Nulo), Esfera, Cor(Branco), Valor na Matriz(Global.A, Somar((Jogador Anfitrião).checkpoint_current, True)), 1.4, Visível para Posição e Raio);
        Modificar Variável de Jogador(Jogador Anfitrião, editor_hitboxEffect, Juntar à Matriz, Entidade Criada por Último);
        Definir Variável de Jogador(Jogador Anfitrião, editor_bounceIndex, Matriz Filtrada(Matriz Mapeada(Global.pinballnumber, If-Then-Else(Comparar(Elemento da Matriz Atual, ==, (Jogador Anfitrião).checkpoint_current), Índice da Matriz Atual, -1)), Comparar(Elemento da Matriz Atual, >=, Nulo)));
        Definir Variável de Jogador(Jogador Anfitrião, editor_killIndex, Matriz Filtrada(Matriz Mapeada(Global.killballnumber, If-Then-Else(Comparar(Elemento da Matriz Atual, ==, (Jogador Anfitrião).checkpoint_current), Índice da Matriz Atual, -1)), Comparar(Elemento da Matriz Atual, >=, Nulo)));
        If((Jogador Anfitrião).checkpoint_moved);
            Chamar sub-rotina(EditorSelectLast);
            Definir Variável de Jogador(Jogador Anfitrião, checkpoint_moved, False);
        Término;
    }
}

regra ("Parkour | SUB Delete Save") {
    evento {
        Sub-rotina;
        DeleteSave;
    }
    ações {
        Modificar Variável Global(SaveName, Remover da Matriz por Índice, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento));
        Modificar Variável Global(SaveCp, Remover da Matriz por Índice, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento));
        Modificar Variável Global(SaveTimer, Remover da Matriz por Índice, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento));
        Modificar Variável Global(SaveElapsed, Remover da Matriz por Índice, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento));
        "must always be last because its the index itself"
        Modificar Variável Global(SaveEnt, Remover da Matriz por Índice, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento));
    }
}

regra ("Parkour | SUB Make Save") {
    evento {
        Sub-rotina;
        MakeSave;
    }
    ações {
        Modificar Variável Global(SaveEnt, Juntar à Matriz, Jogador do Evento);
        Modificar Variável Global(SaveName, Juntar à Matriz, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia));
        Modificar Variável Global(SaveCp, Juntar à Matriz, (Jogador do Evento).checkpoint_current);
        Modificar Variável Global(SaveTimer, Juntar à Matriz, (Jogador do Evento).timer_normal);
        Modificar Variável Global(SaveElapsed, Juntar à Matriz, Tempo Total Decorrido);
    }
}

regra ("Parkour | SUB Timer Pause") {
    evento {
        Sub-rotina;
        TimerPause;
    }
    ações {
        Parar de Acompanhar Variável de Jogador(Jogador do Evento, timer_normal);
        Anular se(Não(Matriz Contém(Global.SaveEnt, Jogador do Evento)));
        Definir Variável Global no Índice(SaveTimer, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento), (Jogador do Evento).timer_normal);
        Definir Variável Global no Índice(SaveElapsed, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento), Nulo);
    }
}

regra ("Parkour | SUB Timer Resume") {
    evento {
        Sub-rotina;
        TimerResume;
    }
    ações {
        Acompanhar Variável de Jogador na Medida(Jogador do Evento, timer_normal, 999999999999, True, Nenhuma);
        Definir Variável Global no Índice(SaveElapsed, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento), Tempo Total Decorrido);
    }
}

regra ("Parkour | SUB Leaderboard Update") {
    evento {
        Sub-rotina;
        LeaderboardUpdate;
    }
    ações {
        "[[name, seconds, prettytime]]\\nyou already have a time"
        If(Matriz Contém(Matriz Mapeada(Global.LeaderBoardFull, Primeiro de(Elemento da Matriz Atual)), Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia)));
            Anular se(Comparar((Jogador do Evento).timer_normal, >=, Valor na Matriz(Primeiro de(Matriz Filtrada(Global.LeaderBoardFull, Comparar(Primeiro de(Elemento da Matriz Atual), ==, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia)))), True)));
            Definir Variável Global(LeaderBoardFull, Matriz Filtrada(Global.LeaderBoardFull, Comparar(Primeiro de(Elemento da Matriz Atual), !=, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia))));
        Else If(Ou(Comparar(Contagem de(Global.LeaderBoardFull), <, 25), Comparar((Jogador do Evento).timer_normal, <, Último de(Valor na Matriz(Global.LeaderBoardFull, 19)))));
            Modificar Variável Global(LeaderBoardFull, Remover da Matriz por Índice, 24);
        Else;
            "Full and time too slow"
            Anular;
        Término;
        Modificar Variável Global(LeaderBoardFull, Juntar à Matriz, Matriz(Matriz(Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia), (Jogador do Evento).timer_normal, String Personalizada("{0} sec", (Jogador do Evento).timer_normal))));
        "CreateLeaderboard()"
        Definir Variável Global(LeaderBoardRemake, True);
    }
}

regra ("Parkour | SUB Checkpoint Fail") {
    evento {
        Sub-rotina;
        CheckpointFailReset;
    }
    ações {
        Definir Variável de Jogador(Jogador do Evento, timer_split, If-Then-Else((Jogador do Evento).toggle_practice, (Jogador do Evento).timer_practice, (Jogador do Evento).timer_normal));
        Definir Variável de Jogador(Jogador do Evento, cache_collectedLocks, Matriz Vazia);
        Cancelar Ação Primária(Jogador do Evento);
        Definir Variável de Jogador(Jogador do Evento, skill_usedDouble, Nulo);
        If(Não(Ou((Jogador do Evento).checkpoint_current, (Jogador do Evento).toggle_practice)));
            Definir Variável de Jogador(Jogador do Evento, timer_normal, Nulo);
            Definir Variável de Jogador(Jogador do Evento, timer_split, Nulo);
        Término;
        If(Contagem de(Global.A));
            If(É Usando Habilidade 1(Jogador do Evento));
                Começar a Forçar Posição do Jogador(Jogador do Evento, Jogador do Evento, False);
                Esperar até(Não(É Usando Habilidade 1(Jogador do Evento)), True);
                Esperar(False, Ignorar Condição);
                Parar de Forçar Posição do Jogador(Jogador do Evento);
            Término;
            Teletransportar(Jogador do Evento, Último de(Valor na Matriz(Global.A, (Jogador do Evento).checkpoint_current)));
            "After teleport incase stopForcingPosition launches the player"
            Aplicar Impulso(Jogador do Evento, Multiplicar(-1, Rapidez de(Jogador do Evento)), 1.192093e-7, Ao Mundo, Cancelar Deslocamento Contrário XYZ);
            "old: disallow jump > 0.1 sec wait > allow jump, this method bugs with ult check disabling ultimate for some reason\\nif eventPlayer.ban_dead or eventPlayer.ban_emote and eventPlayer.isHoldingButton(Button.JUMP):"
            If((Jogador do Evento).ban_dead);
                If(É Botão Segurado(Jogador do Evento, Botão(Pular)));
                    Pressionar Botão(Jogador do Evento, Botão(Pular));
                Término;
            Else;
                "Reset Hop"
                Definir Status(Jogador do Evento, Nulo, Enraizado, 0.096);
            Término;
            If(É Usando Suprema(Jogador do Evento));
                Definir Dano Recebido(Jogador do Evento, 100);
                Abater(Jogador do Evento, Nulo);
                Definir Dano Recebido(Jogador do Evento, 0);
                Esperar(False, Ignorar Condição);
            Término;
        Término;
        Regra de início(CheckUlt, Regra de reinício);
        Regra de início(CheckAbility1, Regra de reinício);
        Chamar sub-rotina(AddonCustomLoadAndReset);
    }
}

regra ("Parkour | SUB Start Game") {
    evento {
        Sub-rotina;
        StartGame;
    }
    ações {
        If(E(Global.CompMode, Ou(Comparar(Global.CompTime, <, 1), (Jogador do Evento).comp_done)));
            Definir Variável de Jogador(Jogador do Evento, toggle_leaderboard, True);
            Definir Variável de Jogador(Jogador do Evento, comp_done, True);
            "eventPlayer.disableRespawn()"
            Definir Dano Recebido(Jogador do Evento, 100);
            Abater(Jogador do Evento, Nulo);
            Definir Dano Recebido(Jogador do Evento, 0);
            Anular;
        Término;
        If(Contagem de(Global.A));
            "load saved progres"
            If(Matriz Contém(Global.SaveName, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia)));
                Definir Variável Global no Índice(SaveEnt, Índice do Valor da Matriz(Global.SaveName, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia)), Jogador do Evento);
                Definir Variável de Jogador(Jogador do Evento, checkpoint_current, Valor na Matriz(Global.SaveCp, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento)));
                Definir Variável de Jogador(Jogador do Evento, timer_normal, Valor na Matriz(Global.SaveTimer, Índice do Valor da Matriz(Global.SaveEnt, Jogador do Evento)));
            Else;
                Definir Variável de Jogador(Jogador do Evento, checkpoint_current, Nulo);
                Definir Variável de Jogador(Jogador do Evento, timer_normal, Nulo);
                Chamar sub-rotina(MakeSave);
            Término;
            Chamar sub-rotina(UpdateTitle);
            Chamar sub-rotina(UpdateCache);
            Chamar sub-rotina(CheckpointFailReset);
            "FFA"
            Esperar até(É Jogo em Andamento, 999999999999);
            Chamar sub-rotina(TimerResume);
        Término;
        "eventPlayer.enableRespawn()"
        Definir Variável de Jogador(Jogador do Evento, toggle_invincible, False);
        Definir Variável de Jogador(Jogador do Evento, toggle_spectate, False);
        Definir Variável de Jogador(Jogador do Evento, checkpoint_moved, True);
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Mechanics | Checks ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("Mechanic | All | Jump") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Está Pulando(Jogador do Evento) == True;
    }
    ações {
        Definir Variável de Jogador(Jogador do Evento, skill_usedBhop, True);
        If((Jogador do Evento).skill_usedHop);
            "\\"   小跳已用\\" checkCN \\"   Bhop\\""
            Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   Bhop   Bhop   Bhop"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
        Else;
            Definir Variável de Jogador(Jogador do Evento, skill_usedHop, True);
    }
}

regra ("Mechanic | All | No Jump") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        (Jogador do Evento).skill_usedHop == Nulo;
        É No Chão(Jogador do Evento) == False;
    }
    ações {
        Definir Variável de Jogador(Jogador do Evento, skill_usedHop, True);
    }
}

regra ("Mechanic | All | Bhop Reset") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        É No Chão(Jogador do Evento) == True;
        É Botão Segurado(Jogador do Evento, Botão(Pular)) == False;
    }
    ações {
        Definir Variável de Jogador(Jogador do Evento, skill_usedBhop, False);
    }
}

regra ("Mechanic | All | Emote") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        É Comunicando Qualquer Emote(Jogador do Evento) == True;
    }
    ações {
        Definir Variável de Jogador(Jogador do Evento, skill_usedBhop, False);
        If((Jogador do Evento).addon_toggle3rdPov);
            Definir Variável de Jogador(Jogador do Evento, addon_toggle3rdPov, False);
            Parar Câmera(Jogador do Evento);
        Término;
        If((Jogador do Evento).ban_emote);
            Esperar até(Não(É Comunicando Qualquer Emote(Jogador do Evento)), 999999999999);
            Anular se((Jogador do Evento).toggle_invincible);
            "\\"   表情留小 ♥ 已禁用!\\" checkCN \\"   Emote Savehop ♥ is banned!\\""
            Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   Emote Savehop ♥ Is Banned!   Emote Savehop ♥ Is Banned!   Emote Savehop ♥ Is Banned!"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
            Esperar(False, Ignorar Condição);
            Chamar sub-rotina(CheckpointFailReset);
    }
}

regra ("Mechanic | All | Ground Reset") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        É No Chão(Jogador do Evento) == True;
    }
    ações {
        "All"
        Definir Variável de Jogador(Jogador do Evento, skill_usedHop, Nulo);
        Definir Variável de Jogador(Jogador do Evento, skill_countBhops, Nulo);
        "$$ Climb"
        Definir Variável de Jogador(Jogador do Evento, skill_usedClimb, False);
        Definir Variável de Jogador(Jogador do Evento, skill_countMulti, Nulo);
        Definir Variável de Jogador(Jogador do Evento, skill_countCreates, Nulo);
        "$$ Genji"
        Definir Variável de Jogador(Jogador do Evento, skill_usedDouble, Nulo);
    }
}

regra ("Mechanic | Climbers | On Wall") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        "This rule is also linked to the determination of wall climbing, please do not close/delete"
        É Na Parede(Jogador do Evento) == True;
        É Botão Segurado(Jogador do Evento, Botão(Pular)) == True;
    }
    ações {
        Definir Variável de Jogador(Jogador do Evento, skill_usedClimb, True);
    }
}

regra ("Mechanic | Climbers | Bhop count for stand ban") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Está Pulando(Jogador do Evento) == True;
        (Jogador do Evento).ban_standcreate != False;
    }
    ações {
        Modificar Variável de Jogador(Jogador do Evento, skill_countBhops, Adicionar, True);
        If(E(Comparar((Jogador do Evento).skill_countBhops, >, 1), Não((Jogador do Evento).toggle_invincible)));
            "\\"   站卡 ♠ 已禁用!\\" checkCN \\"   Stand createBhop ♠ is banned!\\""
            Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   Stand Createbhop ♠ Is Banned!   Stand Createbhop ♠ Is Banned!   Stand Createbhop ♠ Is Banned!"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
            Chamar sub-rotina(CheckpointFailReset);
    }
}

regra ("Mechanic | Climbers | Create Bhop") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        É Botão Segurado(Jogador do Evento, Botão(Agachar)) == True;
        É Agachado(Jogador do Evento) == True;
        É no Ar(Jogador do Evento) == True;
        É Botão Segurado(Jogador do Evento, Botão(Pular)) == False;
        Está Pulando(Jogador do Evento) == False;
    }
    ações {
        Definir Variável de Jogador(Jogador do Evento, skill_usedBhop, False);
        "prevent restart from giving messsage, but stil allow it to become green"
        Anular se((Jogador do Evento).lockState);
        If(E((Jogador do Evento).ban_create, Não((Jogador do Evento).toggle_invincible)));
            "\\"   卡小 ♂ 已禁用!\\" checkCN \\"   Create Bhop ♂ is banned!\\""
            Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   Create Bhop ♂ Is Banned!   Create Bhop ♂ Is Banned!   Create Bhop ♂ Is Banned!"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
            Chamar sub-rotina(CheckpointFailReset);
        Else;
            If(E((Jogador do Evento).ban_standcreate, Comparar((Jogador do Evento).skill_countBhops, >, Nulo)));
                Modificar Variável de Jogador(Jogador do Evento, skill_countBhops, Subtrair, True);
            Término;
            Modificar Variável de Jogador(Jogador do Evento, skill_countCreates, Adicionar, True);
            "\\"   success!\\" checkCN \\"   Bhop has been created!\\""
            Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   Bhop Created!   Bhop Created!   Bhop Created!"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
    }
}

regra ("Mechanic | Climbers | Multiclimb") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        É Na Parede(Jogador do Evento) == True;
        É Botão Segurado(Jogador do Evento, Botão(Pular)) == False;
        (Jogador do Evento).skill_usedClimb == False;
    }
    ações {
        Esperar(False, Ignorar Condição);
        If(E(É Na Parede(Jogador do Evento), Não(É Botão Segurado(Jogador do Evento, Botão(Pular)))));
            "AutoClimb used"
            Definir Variável de Jogador(Jogador do Evento, skill_usedClimb, True);
        Else;
            If(E(E((Jogador do Evento).ban_multi, (Jogador do Evento).checkpoint_notLast), Não((Jogador do Evento).toggle_invincible)));
                "\\"   蹭留 ∞ 已禁用!\\" checkCN \\"   Multiclimb ∞ is banned!\\""
                Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   Multiclimb ∞ Is Banned!   Multiclimb ∞ Is Banned!   Multiclimb ∞ Is Banned!"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
                Chamar sub-rotina(CheckpointFailReset);
            Else;
                Modificar Variável de Jogador(Jogador do Evento, skill_countMulti, Adicionar, True);
    }
}

regra ("Mechanic | Climbers | Ban Wallclimb - Message") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        (Jogador do Evento).ban_climb != False;
        (Jogador do Evento).toggle_invincible == False;
        (Jogador do Evento).skill_usedClimb != False;
    }
    ações {
        "CheckpointFailReset()\\n\\"   爬墙 ↑ 已禁用!\\" checkCN \\"   Climb ↑ is banned!\\""
        Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   Climb ↑ Is Banned!   Climb ↑ Is Banned!   Climb ↑ Is Banned!"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
    }
}

regra ("Mechanic | Genji | SUB Check Ultimate") {
    evento {
        Sub-rotina;
        CheckUlt;
    }
    ações {
        If((Jogador do Evento).lockState);
            "for dash start etc you can be away from cp so the keep charge activators"
            Definir Carga da Suprema(Jogador do Evento, False);
        Término;
        If(É Usando Suprema(Jogador do Evento));
            Esperar até(Não(É Usando Suprema(Jogador do Evento)), 2);
            Esperar(False, Ignorar Condição);
        Término;
        "incase spamming the button"
        If(É Botão Segurado(Jogador do Evento, Botão(Habilidade Suprema)));
            Esperar(False, Ignorar Condição);
        Término;
        If(Ou(Ou((Jogador do Evento).toggle_invincible, E(Comparar(Jogador do Evento, ==, Jogador Anfitrião), Global.EditorOn)), Não((Jogador do Evento).checkpoint_notLast)));
            "skip msg if these"
            Ignorar(2);
        Else If(E(Matriz Contém(Global.Dao, (Jogador do Evento).checkpoint_current), Comparar(Distância entre(Jogador do Evento, Último de(Valor na Matriz(Global.A, (Jogador do Evento).checkpoint_current))), <=, 1.4)));
            "\\"终极技能已就绪\\" checkCN \\"Ultimate is ready\\""
            Mensagem Pequena(Jogador do Evento, String Personalizada("   {0} {1}", String de Ícone de Habilidade(Herói(Genji), Botão(Habilidade Suprema)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒUltimate Is ReadyUltimate Is ReadyUltimate Is Ready"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))));
            //lbl_a:
            Esperar(False, Ignorar Condição);
            Definir Habilidade Suprema como Ativada(Jogador do Evento, True);
            Definir Carga da Suprema(Jogador do Evento, 100);
        "used to be just else, but have to deal with multi ult orbs"
        Else If(Ou(Comparar(Distância entre(Jogador do Evento, Último de(Valor na Matriz(Global.A, (Jogador do Evento).checkpoint_current))), <=, 2), Comparar(Percentual de Carga da Suprema(Jogador do Evento), <, 100)));
            Definir Habilidade Suprema como Ativada(Jogador do Evento, False);
            Definir Carga da Suprema(Jogador do Evento, False);
        Término;
        Esperar(0.36, Ignorar Condição);
    }
}

regra ("Mechanic | Genji | SUB Check Dash") {
    evento {
        Sub-rotina;
        CheckAbility1;
    }
    ações {
        Esperar até(Não(É Usando Habilidade 1(Jogador do Evento)), True);
        If(Ou(Ou((Jogador do Evento).toggle_invincible, E(Comparar(Jogador do Evento, ==, Jogador Anfitrião), Global.EditorOn)), Não((Jogador do Evento).checkpoint_notLast)));
            "skip msg if these"
            Ignorar(2);
        Else If(E(Matriz Contém(Global.SHIFT, (Jogador do Evento).checkpoint_current), Comparar(Distância entre(Jogador do Evento, Último de(Valor na Matriz(Global.A, (Jogador do Evento).checkpoint_current))), <=, 1.4)));
            "\\"技能1影已就绪\\" checkCN \\"Dash is ready\\""
            Mensagem Pequena(Jogador do Evento, String Personalizada("   {0} {1}", String de Ícone de Habilidade(Herói(Genji), Botão(Habilidade 1)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒDash Is ReadyDash Is ReadyDash Is Ready"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))));
            //lbl_a:
            Definir Habilidade 1 como Ativada(Jogador do Evento, True);
        Else;
            Definir Habilidade 1 como Ativada(Jogador do Evento, False);
        Término;
    }
}

regra ("Mechanic | Genji | Ultimate") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        É Usando Suprema(Jogador do Evento) == True;
    }
    ações {
        Esperar(1.8, Anular Quando For Falso);
        If(E((Jogador do Evento).checkpoint_notLast, Não((Jogador do Evento).toggle_invincible)));
            "disable primary fire because of slash exploit"
            Proibir Botão(Jogador do Evento, Botão(Disparo Primário));
        Término;
        Esperar até(Não(É Usando Suprema(Jogador do Evento)), 2);
        Esperar(False, Ignorar Condição);
        Permitir Botão(Jogador do Evento, Botão(Disparo Primário));
        "sets ult charge back if done with map etc"
        Regra de início(CheckUlt, Não fazer nada);
    }
}

regra ("Mechanic | Genji | Dash") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        É Usando Habilidade 1(Jogador do Evento) == True;
    }
    ações {
        "async(CheckAbility1(), AsyncBehavior.NOOP)"
        Chamar sub-rotina(CheckAbility1);
    }
}

regra ("Mechanic | Genji | Double Jump") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        É Vivo(Jogador do Evento) == True;
        É no Ar(Jogador do Evento) == True;
        Ou(Ou((Jogador do Evento).ban_djump, (Jogador do Evento).ban_savedouble), (Jogador do Evento).addon_enableDoubleChecks) == True;
    }
    ações {
        "Save drop"
        Esperar até(Ou(Ou(É No Chão(Jogador do Evento), Está Pulando(Jogador do Evento)), É Botão Segurado(Jogador do Evento, Botão(Pular))), 0.096);
        Anular se a Condição for Falsa;
        While(True);
            "Released Jump"
            Esperar até(Ou(É No Chão(Jogador do Evento), Não(É Botão Segurado(Jogador do Evento, Botão(Pular)))), 999999999999);
            Anular se a Condição for Falsa;
            "Double Jumped"
            Esperar até(Ou(É No Chão(Jogador do Evento), É Botão Segurado(Jogador do Evento, Botão(Pular))), 999999999999);
            Anular se a Condição for Falsa;
            Definir Variável de Jogador(Jogador do Evento, skill_usedDouble, True);
            "Reset"
            Esperar até(Ou(É No Chão(Jogador do Evento), Não((Jogador do Evento).skill_usedDouble)), 999999999999);
            Anular se a Condição for Falsa;
        Término;
    }
}

regra ("Mechanic | Genji | Ban Save Double - 封禁二段跳") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        (Jogador do Evento).ban_savedouble != False;
        (Jogador do Evento).toggle_invincible == False;
        É no Ar(Jogador do Evento) == True;
        (Jogador do Evento).skill_usedDouble == False;
    }
    ações {
        Esperar até(Ou(Ou(Comparar(Componente Z de(Aceleração de(Jogador do Evento)), >, Nulo), Não(É no Ar(Jogador do Evento))), (Jogador do Evento).skill_usedDouble), 999999999999);
        Anular se a Condição for Falsa;
        Esperar até(Ou(Ou(Comparar(Componente Z de(Aceleração de(Jogador do Evento)), <=, Nulo), Não(É no Ar(Jogador do Evento))), (Jogador do Evento).skill_usedDouble), 999999999999);
        Anular se a Condição for Falsa;
        "Prevent false positives\\nDefault climb speed is 7.8 and small slowdown upon mantling"
        Gerar Loop se(Comparar(Velocidade Vertical de(Jogador do Evento), <, 6));
        If((Jogador do Evento).skill_usedBhop);
            Esperar(0.8, Anular Quando For Falso);
        Else;
            Esperar(0.8, Anular Quando For Falso);
            Anular se((Jogador do Evento).skill_usedBhop);
        Término;
        "\\"   延二段跳已禁用!\\" checkCN \\"   save double banned!\\""
        Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   Save Double Banned!   Save Double Banned!   Save Double Banned!"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
        Chamar sub-rotina(CheckpointFailReset);
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Editor ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("Editor | Export Map") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Jogador do Evento == Jogador Anfitrião;
        Global.EditorOn != False;
        É Botão Segurado(Jogador Anfitrião, Botão(Corpo a corpo)) == True;
        É Botão Segurado(Jogador Anfitrião, Botão(Interagir)) == True;
        É Botão Segurado(Jogador Anfitrião, Botão(Recarregar)) == True;
    }
    ações {
        "@Condition hostPlayer.editor_lock == false # !!! don't lock. always be sure data can be exported incase of a perma lock situation"
        Esperar(True, Anular Quando For Falso);
        "doesnt matter thats its in pasta's because it wil be fixed on spawning"
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, True);
        Definir Variável de Jogador(Jogador Anfitrião, editor_saveCache, Matriz(Global.TimeRemaining, Global.ColorConfig));
        Definir Variável Global(TimeRemaining, Nulo);
        Definir Variável Global(ColorConfig, Nulo);
        Definir Variável Global(EditorOn, Nulo);
        Definir Variável Global(C, Nulo);
        Definir Variável Global(K, Nulo);
        Definir Variável Global(NANBA, Nulo);
        Definir Variável Global(TQ2, Nulo);
        Definir Variável Global(SaveName, Nulo);
        Definir Variável Global(SaveCp, Nulo);
        Definir Variável Global(SaveTimer, Nulo);
        Definir Variável Global(SaveEnt, Nulo);
        "SavePauseTime = null\\nSavePauseEnabled = null"
        Definir Variável Global(SaveElapsed, Nulo);
        Definir Variável Global(CompMode, Nulo);
        "LeaderBoardFull = null\\nLeaderBoardHuds = null"
        Definir Variável Global(PortalOn, Nulo);
        Definir Variável Global(TitleData, Nulo);
        Definir Variável Global(CpHudText, Nulo);
        Definir Variável Global(CpHudCp, Nulo);
        Definir Variável Global(HintText, Nulo);
        Definir Variável Global(HintCp, Nulo);
        Definir Variável Global(CpIwtText, Nulo);
        Definir Variável Global(CpIwtCp, Nulo);
        Definir Variável Global(CpIwtPos, Nulo);
        Definir Variável Global(CpIwtColor, Nulo);
        Definir Variável Global(PortalNames, Nulo);
        Definir Variável Global(PortalLoc, Nulo);
        Definir Variável Global(PortalDest, Nulo);
        Definir Variável Global(PortalEffects, Nulo);
        If(Comparar(Global.Name, ==, String Personalizada("name here - 作者")));
            Definir Variável Global(Name, String Personalizada("{0}", Jogador Anfitrião));
        Término;
        Definir Variável Global(Cachedcredits, Matriz(Global.Name, Global.Code));
        Definir Variável Global(Name, Nulo);
        Definir Variável Global(Code, Nulo);
        Criar Texto de HUD(Jogador Anfitrião, String Personalizada("­"), Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("   0. 清理无用数据:\\n (此窗口打开时将自动完成)\\n\\n   1. 复制数据:\\n Esc → 打开地图工坊查看器 → 右下角'变量目标'改为全局\\n 点击窗口下方图标 (X) 复制作图数据\\n\\n   2. 录入数据:\\n Esc → 打开地图工坊编辑器{0}", String Personalizada(" → 规则第(2/2)页 → 展开规则'数据录入 <---- 在这输入'\\n 点击'动作'一栏右侧橙色粘贴图标 录入数据\\n\\n   3. 地图工坊设置:\\n ESC → 显示大厅 → 设置 → 地图工坊设置→\\n 拉至底部 关闭'作图模式'\\n 选择地图难度\\n{0}", String Personalizada("\\n   4. 创建初始地图代码:\\n Esc → 显示大厅 → 设置 → 分享代码 →\\n 创建新的代码 → 复制并记下代码\\n\\n   5. 添加作者信息:\\n Esc → 打开地图工坊编辑器 → 规则第(2/2)页 → 展开规则'Credits Here {0}", String Personalizada("- 作者名字'\\n 修改自定义字符串文本框中的内容\\n\\n   6. 更新地图及作者信息:\\n Esc → 显示大厅 → 设置 → 共享代码 →\\n 上传至现有代码 → 粘贴步骤4中获得的代码")))), String Personalizada("   0. Clear Extra Data:\\n Already Done Upon Opening This Window\\n\\n   1. Copy Data:\\n Open Workshop Inspector → Set Variable Targ{0}", String Personalizada("et To Global\\n Click The [X]\\n\\n   2. Insert Data:\\n Paste The Data Into Rule Named 'Map Data <---- Insert Here'\\n\\n   3. Workshop {0}", String Personalizada("Settings:\\n Esc → Show Lobby → Settings → Workshop Settings →\\n Toggle 'Editor Mode' Off\\n Select Display Difficulty\\n\\n   4. Crea{0}", String Personalizada("te Initial Sharecode:\\n Esc → Show Lobby → Settings → Share Code →\\n Create New Code → Copy Code\\n\\n   5. Add Credits:\\n Enter You{0}", String Personalizada("r Name & Map Code In The 'Credits Here' Rule\\n\\n   6. Update For Credits:\\n Esc → Show Lobby → Settings → Share Code →\\n Upload T{0}", String Personalizada("o Existing Code → Paste The Code You Created In Step 4"))))))), Topo, -185, Nulo, Nulo, Cor(Verde-limão), String, Visibilidade-padrão);
        Definir Variável de Jogador no Índice(Jogador Anfitrião, editor_saveCache, 2, ID de Texto Mais Recente);
        Chamar sub-rotina(AddonCheckMap);
        Ativar gravação do Inspetor;
        Desativar gravação do Inspetor;
        Definir Variável Global(EditorOn, True);
        Definir Variável Global(TimeRemaining, Primeiro de((Jogador Anfitrião).editor_saveCache));
        Definir Variável Global(ColorConfig, Valor na Matriz((Jogador Anfitrião).editor_saveCache, True));
        Criar Texto de HUD(Jogador Anfitrião, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("    > 按互动键关闭当前窗口 <    "), String Personalizada("    > Press Interact To Close This Window <    ")), Nulo, Nulo, Topo, -183, Cor(Verde-limão), Nulo, Nulo, String, Visibilidade-padrão);
        Definir Variável de Jogador no Índice(Jogador Anfitrião, editor_saveCache, False, ID de Texto Mais Recente);
        Esperar até(Não(É Botão Segurado(Jogador Anfitrião, Botão(Interagir))), 999999999999);
        Esperar até(É Botão Segurado(Jogador Anfitrião, Botão(Interagir)), 999999999999);
        "Close Window"
        Destruir Texto de HUD(Primeiro de((Jogador Anfitrião).editor_saveCache));
        "Instructions"
        Destruir Texto de HUD(Último de((Jogador Anfitrião).editor_saveCache));
        Definir Variável de Jogador(Jogador Anfitrião, editor_saveCache, Nulo);
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, False);
    }
}

regra ("Editor | Hud & Effects") {
    evento {
        Em andamento - Global;
    }
    ações {
        Esperar(0.832000000000000, Ignorar Condição);
        "waitUntil(entityExists(getAllPlayers()), Math.INFINITY)  # cant be condition because host player can leaves, removing the rule fx\\nwait()"
        If(Global.EditorOn);
            Criar Texto de HUD((Jogador Local).toggle_guide, Nulo, Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("{0}+{1}+{2} | 重新开始", String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Interagir))), String Personalizada("{0}+{1}+{2} | Restart", String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Interagir)))), Direita, -156, Nulo, Nulo, Valor na Matriz(Global.ColorConfig, 5), Visível para e String, Visibilidade-padrão);
            Criar Texto de HUD(If-Then-Else((Jogador Anfitrião).toggle_guide, Jogador Anfitrião, Nulo), Nulo, Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), If-Then-Else(Global.EditorMoveItem, String Personalizada("方向键 | 移动实体 \\n{0} | 向上移动 \\n{1} | 向下移动 \\n{2} (长按) | 快速移动", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Habilidade Suprema)), String de Mapeamento de Entrada(Botão(Pular))), Valor na Matriz(Matriz(String Personalizada("{0} + {1} | 新建检查点\\n{0} + {2} | 删除选中的检查点", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Primário)), String de Mapeamento de Entrada(Botão(Disparo Secundário))), String Personalizada("{0} + {1} | 新建击杀球\\n{0} + {1} (长按) | 在准心位置新建", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Primário))), String Personalizada("{0} + {1} | 新建弹球\\n{0} + {1} (长按) | 在准心位置新建", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Primário))), String Personalizada("{0} + {1} | 蹭留\\n{0} + {2} | 卡小", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Primário)), String de Mapeamento de Entrada(Botão(Disparo Secundário))), String Personalizada("{0} + {1} | 新建传送门\\n{0} + {1} (长按) | 在准心位置新建", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Primário)))), (Jogador Anfitrião).editor_modeSelect)), If-Then-Else(Global.EditorMoveItem, String Personalizada("Walk | Move Selected\\n{0} | Move Up\\n{1} | Move Down\\n{2} (Hold) | Move Faster", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Habilidade Suprema)), String de Mapeamento de Entrada(Botão(Pular))), Valor na Matriz(Matriz(String Personalizada("{0} + {1} | Create New\\n{0} + {2} | Delete Selected", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Primário)), String de Mapeamento de Entrada(Botão(Disparo Secundário))), String Personalizada("{0} + {1} | Create New\\n{0} + {1} (Hold)| Raycast New", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Primário))), String Personalizada("{0} + {1} | Create New\\n{0} + {1} (Hold)| Raycast New", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Primário))), String Personalizada("{0} + {1} | Multi-Climb\\n{0} + {2} | Createbhop", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Primário)), String de Mapeamento de Entrada(Botão(Disparo Secundário))), String Personalizada("{0} + {1} | Create New\\n{0} + {1} (Hold)| Raycast New", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Primário)))), (Jogador Anfitrião).editor_modeSelect))), Direita, -148, Nulo, Nulo, Cor(Amarelo), Visível para e String, Visibilidade-padrão);
            Criar Texto de HUD(If-Then-Else(E((Jogador Anfitrião).toggle_guide, Não(Global.EditorMoveItem)), Jogador Anfitrião, Nulo), Nulo, Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), Valor na Matriz(Matriz(Matriz Vazia, String Personalizada("{0} + {1} | 删除选中的击杀球", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Secundário))), String Personalizada("{0} + {1} | 删除选中的弹球", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Secundário))), Matriz Vazia, String Personalizada("{0} + {1} | 删除选中的传送门", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Secundário)))), (Jogador Anfitrião).editor_modeSelect), Valor na Matriz(Matriz(Matriz Vazia, String Personalizada("{0} + {1} | Delete Selected", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Secundário))), String Personalizada("{0} + {1} | Delete Selected", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Secundário))), Matriz Vazia, String Personalizada("{0} + {1} | Delete Selected", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Disparo Secundário)))), (Jogador Anfitrião).editor_modeSelect)), Direita, -147, Nulo, Nulo, Cor(Amarelo), Visível para e String, Visibilidade-padrão);
            Criar Texto de HUD(If-Then-Else((Jogador Anfitrião).toggle_guide, Jogador Anfitrião, Nulo), Nulo, Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), If-Then-Else(Global.EditorMoveItem, String Personalizada("{0} | 放置实体{1} | Cancel Placement\\n", String de Mapeamento de Entrada(Botão(Disparo Primário)), String de Mapeamento de Entrada(Botão(Disparo Secundário))), Valor na Matriz(Matriz(String Personalizada("{0} + {1} | 移除/新建传送点\\n{0} + {2} | 检查点碰撞模型\\n", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Recarregar)), String de Mapeamento de Entrada(Botão(Habilidade 1))), String Personalizada("{0} + {1} | 选择上一个击杀球\\n{0} + {2} | 选择下一个击杀球\\n", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Pular))), String Personalizada("{0} + {1} | 选择上一个弹球\\n{0} + {2} | 选择下一个弹球\\n", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Pular))), String Personalizada("{0} + {1} | 爬墙\\n{0} + {2} | 延二段跳", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Pular))), String Personalizada("{0} + {1} | 选择下一个传送门\\n{0} + {2} | 选择上一个传送门\\n", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Pular)), String de Mapeamento de Entrada(Botão(Agachar)))), (Jogador Anfitrião).editor_modeSelect)), If-Then-Else(Global.EditorMoveItem, String Personalizada("{0} | Confirm Placement\\n{1} | Cancel Placement", String de Mapeamento de Entrada(Botão(Disparo Primário)), String de Mapeamento de Entrada(Botão(Disparo Secundário))), Valor na Matriz(Matriz(String Personalizada("{0} + {1} | Remove/Add Teleport\\n{0} + {2} | Toggle Hitbox\\n", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Recarregar)), String de Mapeamento de Entrada(Botão(Habilidade 1))), String Personalizada("{0} + {1} | Select Previous\\n{0} + {2} | Select Next\\n", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Pular))), String Personalizada("{0} + {1} | Select Previous\\n{0} + {2} | Select Next\\n", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Pular))), String Personalizada("{0} + {1} | Wallclimb\\n{0} + {2} | Save Double", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Pular))), String Personalizada("{0} + {1} | Select Next\\n{0} + {2} | Select Previous\\n", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Pular)), String de Mapeamento de Entrada(Botão(Agachar)))), (Jogador Anfitrião).editor_modeSelect))), Direita, -146, Nulo, Nulo, Cor(Amarelo), Visível para e String, Visibilidade-padrão);
            Criar Texto de HUD(If-Then-Else(E((Jogador Anfitrião).toggle_guide, Não(Global.EditorMoveItem)), Jogador Anfitrião, Nulo), Nulo, Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), Valor na Matriz(Matriz(String Personalizada("{0} (长按) | 移动检查点", String de Mapeamento de Entrada(Botão(Habilidade 2))), String Personalizada("{0} + {1} | 增大击杀球\\n{0} + {2} | 缩小击杀球", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Pular)), String de Mapeamento de Entrada(Botão(Agachar))), String Personalizada("{0} + {1} | 增加弹球弹力\\n{0} + {2} | 减少弹球弹力", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Pular)), String de Mapeamento de Entrada(Botão(Agachar))), String Personalizada("{0} + {1} | 死小\\n{0} + {2} | 表情留小", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Disparo Primário)), String de Mapeamento de Entrada(Botão(Disparo Secundário))), String Personalizada("{0} + {1} | 移动选中的实体\\n{0} + {2} | 应用到当前/所有关卡(开关)", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Disparo Primário)), String de Mapeamento de Entrada(Botão(Pular)))), (Jogador Anfitrião).editor_modeSelect), Valor na Matriz(Matriz(String Personalizada("{0} (Hold) | Move", String de Mapeamento de Entrada(Botão(Habilidade 2))), String Personalizada("{0} + {1} | Increase Size\\n{0} + {2} | Decrease Size", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Pular)), String de Mapeamento de Entrada(Botão(Agachar))), String Personalizada("{0} + {1} | Increase Strength\\n{0} + {2} | Decrease Strength", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Pular)), String de Mapeamento de Entrada(Botão(Agachar))), String Personalizada("{0} + {1} | Death Hop\\n{0} + {2} | Emote", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Disparo Primário)), String de Mapeamento de Entrada(Botão(Disparo Secundário))), String Personalizada("{0} + {1} | Move\\n{0} + {2} | Cp/Map (Toggle)", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Disparo Primário)), String de Mapeamento de Entrada(Botão(Pular)))), (Jogador Anfitrião).editor_modeSelect)), Direita, -145, Nulo, Nulo, Cor(Amarelo), Visível para e String, Visibilidade-padrão);
            Criar Texto de HUD(If-Then-Else(E((Jogador Anfitrião).toggle_guide, Não(Global.EditorMoveItem)), Jogador Anfitrião, Nulo), Nulo, Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), Valor na Matriz(Matriz(Matriz Vazia, String Personalizada("{0} + {1} | 移动选中的实体", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Disparo Primário))), String Personalizada("{0} + {1} | 移动选中的实体", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Disparo Primário))), String Personalizada("{0} + {1} | 留小跳进点\\n{0} + {2} | 站卡", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Pular)), String de Mapeamento de Entrada(Botão(Agachar))), Matriz Vazia), (Jogador Anfitrião).editor_modeSelect), Valor na Matriz(Matriz(Matriz Vazia, String Personalizada("{0} + {1} | Move", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Disparo Primário))), String Personalizada("{0} + {1} | Move", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Disparo Primário))), String Personalizada("{0} + {1} | Require Bhop\\n{0} + {2} | Stand Create", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Pular)), String de Mapeamento de Entrada(Botão(Agachar))), Matriz Vazia), (Jogador Anfitrião).editor_modeSelect)), Direita, -144, Nulo, Nulo, Cor(Amarelo), Visível para e String, Visibilidade-padrão);
            Criar Texto de HUD(If-Then-Else((Jogador Anfitrião).toggle_guide, Jogador Anfitrião, Nulo), Nulo, Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada(" \\n{0} + {1} | 下一关", String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Disparo Primário))), String Personalizada(" \\n{0} + {1} | Next Checkpoint", String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Disparo Primário)))), Direita, -150, Nulo, Nulo, If-Then-Else((Jogador Anfitrião).toggle_guide, Cor(Verde), Cor(Laranja)), Visível para String e Cor, Visibilidade-padrão);
            Criar Texto de HUD(If-Then-Else((Jogador Anfitrião).toggle_guide, Jogador Anfitrião, Nulo), Nulo, Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("{0} + {1} | 上一关\\n{2} (长按) | 飞行\\n", String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Disparo Secundário)), String de Mapeamento de Entrada(Botão(Habilidade 1))), String Personalizada("{0} + {1} | Prev Checkpoint\\n{2} (hold)| Fly\\n", String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Disparo Secundário)), String de Mapeamento de Entrada(Botão(Habilidade 1)))), Direita, -149, Nulo, Nulo, If-Then-Else((Jogador Anfitrião).toggle_guide, Cor(Verde), Cor(Laranja)), Visível para String e Cor, Visibilidade-padrão);
            Criar Texto de HUD(If-Then-Else((Jogador Anfitrião).toggle_guide, Jogador Anfitrião, Nulo), Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("保存地图长按 {0} + {1} + {2}", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Corpo a corpo)), String Personalizada("{0} 后按弹出窗口的提示进行操作                                                                                                ", String de Mapeamento de Entrada(Botão(Recarregar)))), String Personalizada("To Save Map, Hold {0} + {1} + {2}", String de Mapeamento de Entrada(Botão(Interagir)), String de Mapeamento de Entrada(Botão(Corpo a corpo)), String Personalizada("{0} Then Follow Instructions                                                                                                ", String de Mapeamento de Entrada(Botão(Recarregar))))), Nulo, Esquerda, -197, Nulo, Cor(Amarelo), Nulo, Visível para e String, Visibilidade-padrão);
            Criar Texto de HUD(If-Then-Else((Jogador Local).editor_saveCache, Nulo, Jogador Local), If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), If-Then-Else(É Botão Segurado(Jogador Anfitrião, Botão(Corpo a corpo)), String Personalizada("{0} 检查点模式\\n{1} 击杀球模式\\n{2}", If-Then-Else((Jogador Anfitrião).editor_modeSelect, String Personalizada("     "), String de Ícone(Seta: Direita)), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 1), String de Ícone(Seta: Direita), String Personalizada("     ")), String Personalizada("{0} 弹球模式\\n{1} 封禁(单关)\\n{2} 自定义传送门 ", If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), String de Ícone(Seta: Direita), String Personalizada("     ")), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 3), String de Ícone(Seta: Direita), String Personalizada("     ")), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 4), String de Ícone(Seta: Direita), String Personalizada("     ")))), If-Then-Else(Comparar(Jogador Local, ==, Jogador Anfitrião), String Personalizada(" {0} {1} ", Valor na Matriz(Matriz(String de Ícone(Bandeira), String de Ícone(Caveira), String de Ícone(Lua), String de Ícone(Parada), String de Ícone(Espiral)), (Jogador Anfitrião).editor_modeSelect), Valor na Matriz(Divisão de String(String Personalizada("检查点模式0击杀球模式0弹球模式0封禁(单关)0自定义传送门"), Primeiro de(Nulo)), (Jogador Anfitrião).editor_modeSelect)), String Personalizada(" {0} 源氏 编辑者 {0} ", String de Ícone(Raio)))), If-Then-Else(É Botão Segurado(Jogador Anfitrião, Botão(Corpo a corpo)), String Personalizada("{0} Checkpoints\\n{1} Boundary Spheres\\n{2}", If-Then-Else((Jogador Anfitrião).editor_modeSelect, String Personalizada("     "), String de Ícone(Seta: Direita)), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 1), String de Ícone(Seta: Direita), String Personalizada("     ")), String Personalizada("{0} Function Orbs\\n{1} Skill Bans\\n{2} Portals", If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), String de Ícone(Seta: Direita), String Personalizada("     ")), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 3), String de Ícone(Seta: Direita), String Personalizada("     ")), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 4), String de Ícone(Seta: Direita), String Personalizada("     ")))), If-Then-Else(Comparar(Jogador Local, ==, Jogador Anfitrião), String Personalizada(" {0} {1} ", Valor na Matriz(Matriz(String de Ícone(Bandeira), String de Ícone(Caveira), String de Ícone(Lua), String de Ícone(Parada), String de Ícone(Espiral)), (Jogador Anfitrião).editor_modeSelect), Valor na Matriz(Divisão de String(String Personalizada("Checkpoints0Boundary Spheres0Function Orbs0Skill Bans0Portals"), Primeiro de(Nulo)), (Jogador Anfitrião).editor_modeSelect)), String Personalizada(" {0} Genji Editor {0} ", String de Ícone(Raio))))), Nulo, Nulo, Topo, -174, Cor(Azul), Nulo, Nulo, Visível para e String, Visibilidade-padrão);
            Criar Texto de HUD(Primeiro de(True), Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), If-Then-Else(Comparar(Jogador Local, ==, Jogador Anfitrião), String Personalizada("{0} + 射击 | 切换作图模式", String de Mapeamento de Entrada(Botão(Corpo a corpo))), String Personalizada("房主/编辑者 {0}", Jogador Anfitrião)), If-Then-Else(Comparar(Jogador Local, ==, Jogador Anfitrião), String Personalizada("{0} + Shoot | Change Mode", String de Mapeamento de Entrada(Botão(Corpo a corpo))), String Personalizada("Current Host/Editor: {0}", Jogador Anfitrião))), Nulo, Topo, -175, Nulo, If-Then-Else((Jogador Local).editor_lock, Cor(Cinza), Cor(Branco)), Nulo, Visível para String e Cor, Visibilidade-padrão);
            Criar Texto de HUD(If-Then-Else(E((Jogador Anfitrião).toggle_guide, Ou(Não((Jogador Anfitrião).editor_modeSelect), E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), Contagem de((Jogador Anfitrião).editor_bounceIndex)))), Jogador Anfitrião, Nulo), Nulo, Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("{0} + {1} | {2}", String de Mapeamento de Entrada(Botão(Habilidade Suprema)), String de Mapeamento de Entrada(Botão(Disparo Primário)), String Personalizada("{0} {1} | {2}                                                                                                ", If-Then-Else((Jogador Anfitrião).editor_modeSelect, String Personalizada("弹球给刀"), String Personalizada("检查点给刀")), String de Ícone de Habilidade(Herói(Genji), Botão(Habilidade Suprema)), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), Valor na Matriz(Global.TQ5, Global.EditSelected), Matriz Contém(Global.Dao, (Jogador Anfitrião).checkpoint_current)))), String Personalizada("{0} + {1} | {2}", String de Mapeamento de Entrada(Botão(Habilidade Suprema)), String de Mapeamento de Entrada(Botão(Disparo Primário)), String Personalizada("{0} Give Ult {1} | {2}                                                                                                ", If-Then-Else((Jogador Anfitrião).editor_modeSelect, String Personalizada("Orb"), String Personalizada("Level")), String de Ícone de Habilidade(Herói(Genji), Botão(Habilidade Suprema)), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), Valor na Matriz(Global.TQ5, Global.EditSelected), Matriz Contém(Global.Dao, (Jogador Anfitrião).checkpoint_current))))), Esquerda, -189, Nulo, Nulo, If-Then-Else(E(Valor na Matriz(Global.TQ5, Global.EditSelected), Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2)), Cor(Verde), If-Then-Else(E(Matriz Contém(Global.Dao, (Jogador Anfitrião).checkpoint_current), Não((Jogador Anfitrião).editor_modeSelect)), Cor(Verde), Cor(Laranja))), Visível para String e Cor, Visibilidade-padrão);
            Criar Texto de HUD(If-Then-Else(E((Jogador Anfitrião).toggle_guide, Ou(Não((Jogador Anfitrião).editor_modeSelect), E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), Contagem de((Jogador Anfitrião).editor_bounceIndex)))), Jogador Anfitrião, Nulo), Nulo, Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("{0} + {1} | {2}", String de Mapeamento de Entrada(Botão(Habilidade Suprema)), String de Mapeamento de Entrada(Botão(Disparo Secundário)), String Personalizada("{0} {1} | {2}                                                                                                ", If-Then-Else((Jogador Anfitrião).editor_modeSelect, String Personalizada("弹球给Shift"), String Personalizada("检查点给Shift")), String de Ícone de Habilidade(Herói(Genji), Botão(Habilidade 1)), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), Valor na Matriz(Global.TQ6, Global.EditSelected), Matriz Contém(Global.SHIFT, (Jogador Anfitrião).checkpoint_current)))), String Personalizada("{0} + {1} | {2}", String de Mapeamento de Entrada(Botão(Habilidade Suprema)), String de Mapeamento de Entrada(Botão(Disparo Secundário)), String Personalizada("{0} Give Dash {1} | {2}                                                                                                ", If-Then-Else((Jogador Anfitrião).editor_modeSelect, String Personalizada("Orb"), String Personalizada("Level")), String de Ícone de Habilidade(Herói(Genji), Botão(Habilidade 1)), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), Valor na Matriz(Global.TQ6, Global.EditSelected), Matriz Contém(Global.SHIFT, (Jogador Anfitrião).checkpoint_current))))), Esquerda, -188, Nulo, Nulo, If-Then-Else(E(Valor na Matriz(Global.TQ6, Global.EditSelected), Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2)), Cor(Verde), If-Then-Else(E(Matriz Contém(Global.SHIFT, (Jogador Anfitrião).checkpoint_current), Não((Jogador Anfitrião).editor_modeSelect)), Cor(Verde), Cor(Laranja))), Visível para String e Cor, Visibilidade-padrão);
            Criar Texto de HUD(If-Then-Else(E(E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), (Jogador Anfitrião).toggle_guide), Contagem de((Jogador Anfitrião).editor_bounceIndex)), Jogador Anfitrião, Nulo), Nulo, Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("{0} + {1} |  收集球(进点前必须集齐) {2}", String de Mapeamento de Entrada(Botão(Habilidade Suprema)), String de Mapeamento de Entrada(Botão(Habilidade 2)), String Personalizada("{0} | {1}\\n                                                                                                ", String de Ícone(Asterisco), Valor na Matriz(Global.BounceToggleLock, Global.EditSelected))), String Personalizada("{0} + {1} | Unlocks Checkpoint {2}", String de Mapeamento de Entrada(Botão(Habilidade Suprema)), String de Mapeamento de Entrada(Botão(Habilidade 2)), String Personalizada("{0} | {1}\\n                                                                                                ", String de Ícone(Asterisco), Valor na Matriz(Global.BounceToggleLock, Global.EditSelected)))), Esquerda, -187, Nulo, Nulo, If-Then-Else(Valor na Matriz(Global.BounceToggleLock, Global.EditSelected), Cor(Verde), Cor(Laranja)), Visível para String e Cor, Visibilidade-padrão);
            Criar Texto de HUD(If-Then-Else((Jogador Anfitrião).toggle_guide, Jogador Anfitrião, Nulo), If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("球体/传送门上限: {0}/193 ", Somar(Somar(Contagem de(Global.TQ), Contagem de(Global.H)), Contagem de(Global.CustomPortalStart))), String Personalizada("Orb/Portal Limit: {0}/193 ", Somar(Somar(Contagem de(Global.TQ), Contagem de(Global.H)), Contagem de(Global.CustomPortalStart)))), Nulo, String Personalizada("                                                                                                                                "), Esquerda, -191, Cor(Azul), Nulo, Nulo, Visível para e String, Visibilidade-padrão);
            "display selected cc/orb info"
            Criar Texto de HUD(If-Then-Else((Jogador Anfitrião).toggle_guide, Jogador Anfitrião, Nulo), If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), If-Then-Else(E(Não((Jogador Anfitrião).editor_modeSelect), Contagem de(Global.A)), String Personalizada("\\n 选中的检查点 \\n 矢量: {0}{1} \\n", Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current), If-Then-Else(Comparar(Contagem de(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current)), <, 2), Matriz Vazia, String Personalizada("\\n 传送点: {0}", Valor na Matriz(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current), True)))), If-Then-Else(E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 1), Contagem de((Jogador Anfitrião).editor_killIndex)), String Personalizada("\\n 选中的击杀球\\n 矢量: {0}\\n 半径: {1}\\n  + 進不去\\n  - 出不來\\n", Valor na Matriz(Global.H, Global.EditSelected), Valor na Matriz(Global.I, Global.EditSelected)), If-Then-Else(E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), Contagem de((Jogador Anfitrião).editor_bounceIndex)), String Personalizada("\\n 选中的弹球\\n 矢量: {0}\\n 弹力: {1}\\n 序号: {2}\\n", Valor na Matriz(Global.TQ, Global.EditSelected), Valor na Matriz(Global.EditMode, Global.EditSelected), Global.EditSelected), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 3), String Personalizada("\\n 封禁(单关)\\n――――――――――――\\n {0} 蹭留 ∞\\n {1} 卡小 ♂\\n {2}", If-Then-Else(Matriz Contém(Global.BanMulti, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), If-Then-Else(Matriz Contém(Global.BanCreate, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), String Personalizada("{0} 站卡 ♠\\n {1} 爬墙 ↑\\n {2}", If-Then-Else(Matriz Contém(Global.BanStand, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), If-Then-Else(Matriz Contém(Global.BanClimb, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), String Personalizada("{0} 死小 X\\n {1} 表情留小 ♥\\n {2}", If-Then-Else(Matriz Contém(Global.BanDead, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), If-Then-Else(Matriz Contém(Global.BanEmote, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), String Personalizada("{0} 延二段跳 △\\n――――――――――――\\n {1} 留小跳进点 ≥\\n", If-Then-Else(Matriz Contém(Global.BanSaveDouble, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), If-Then-Else(Matriz Contém(Global.BanBhop, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia))))), If-Then-Else(E(E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 4), Matriz Contém(Matriz((Jogador Anfitrião).checkpoint_current, -1), Valor na Matriz(Global.CustomPortalCP, Global.EditSelected))), Contagem de(Global.CustomPortalCP)), String Personalizada("\\n 入口矢量: {0}\\n 出口矢量: {1}\\n 应用关卡: {2}\\n", Valor na Matriz(Global.CustomPortalStart, Global.EditSelected), Valor na Matriz(Global.CustomPortalEndpoint, Global.EditSelected), If-Then-Else(Comparar(Valor na Matriz(Global.CustomPortalCP, Global.EditSelected), <, Nulo), String Personalizada("所有"), (Jogador Anfitrião).checkpoint_current)), String Personalizada("\\n   当前无数据选中   \\n")))))), If-Then-Else(E(Não((Jogador Anfitrião).editor_modeSelect), Contagem de(Global.A)), String Personalizada("\\n Selected Checkpoint\\n Vector: {0}{1} \\n", Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current), If-Then-Else(Comparar(Contagem de(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current)), <, 2), Matriz Vazia, String Personalizada("\\n Teleport: {0}", Valor na Matriz(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current), True)))), If-Then-Else(E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 1), Contagem de((Jogador Anfitrião).editor_killIndex)), String Personalizada("\\n Selected Boundary Sphere\\n Vector: {0}\\n Radius: {1}\\n  + Keep Out\\n  - Stay In\\n", Valor na Matriz(Global.H, Global.EditSelected), Valor na Matriz(Global.I, Global.EditSelected)), If-Then-Else(E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), Contagem de((Jogador Anfitrião).editor_bounceIndex)), String Personalizada("\\n Selected Bounce Orb\\n Vector: {0}\\n Strength: {1} \\n ID: {2}\\n", Valor na Matriz(Global.TQ, Global.EditSelected), Valor na Matriz(Global.EditMode, Global.EditSelected), Global.EditSelected), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 3), String Personalizada("\\n Skill Bans\\n――――――――――――\\n {0} Multi-Climb ∞\\n {1} Create ♂\\n {2}", If-Then-Else(Matriz Contém(Global.BanMulti, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), If-Then-Else(Matriz Contém(Global.BanCreate, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), String Personalizada("{0} Stand ♠\\n {1} Climb ↑\\n {2}", If-Then-Else(Matriz Contém(Global.BanStand, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), If-Then-Else(Matriz Contém(Global.BanClimb, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), String Personalizada("{0} Dead X\\n {1} Emote ♥\\n {2}", If-Then-Else(Matriz Contém(Global.BanDead, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), If-Then-Else(Matriz Contém(Global.BanEmote, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), String Personalizada("{0} Save Double △\\n――――――――――――\\n {1} Require Bhop ≥\\n", If-Then-Else(Matriz Contém(Global.BanSaveDouble, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia), If-Then-Else(Matriz Contém(Global.BanBhop, (Jogador Anfitrião).checkpoint_current), String Personalizada("√"), Matriz Vazia))))), If-Then-Else(E(E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 4), Matriz Contém(Matriz((Jogador Anfitrião).checkpoint_current, -1), Valor na Matriz(Global.CustomPortalCP, Global.EditSelected))), Contagem de(Global.CustomPortalCP)), String Personalizada("\\n Start: {0} \\n End: {1} \\n CP: {2} \\n", Valor na Matriz(Global.CustomPortalStart, Global.EditSelected), Valor na Matriz(Global.CustomPortalEndpoint, Global.EditSelected), If-Then-Else(Comparar(Valor na Matriz(Global.CustomPortalCP, Global.EditSelected), <, Nulo), String Personalizada("All"), (Jogador Anfitrião).checkpoint_current)), String Personalizada("\\n   No Data Selected   \\n"))))))), Nulo, String Personalizada("                                                                                                                                "), Esquerda, -190, Cor(Branco), Nulo, Cor(Laranja), Visível para e String, Visibilidade-padrão);
            "effects =========================================================================================================================================================================="
            Criar Texto no Mundo(If-Then-Else(Contagem de(Global.EditSelectIdArray), True, Nulo), If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("选中的实体"), String Personalizada("Selected")), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 1), Valor na Matriz(Global.H, Global.EditSelected), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), Valor na Matriz(Global.TQ, Global.EditSelected), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 4), Valor na Matriz(Global.CustomPortalStart, Global.EditSelected), Nulo))), 1.2, Não Cortar, Visível para e Posição, Cor(Laranja), Visibilidade-padrão);
            Criar Ícone(If-Then-Else(Contagem de(Global.EditSelectIdArray), True, Nulo), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 1), Valor na Matriz(Global.H, Global.EditSelected), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), Valor na Matriz(Global.TQ, Global.EditSelected), If-Then-Else(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 4), Valor na Matriz(Global.CustomPortalStart, Global.EditSelected), Nulo))), Seta: Baixo, Visível para e Posição, Cor(Branco), True);
            "Purple sphere for teleport location"
            Criar Efeito(If-Then-Else(E(Comparar(Contagem de(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current)), >, 1), Não((Jogador Anfitrião).editor_modeSelect)), Jogador Anfitrião, Nulo), Esfera, Cor(Roxo), Subtrair(Valor na Matriz(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current), True), Multiplicar(0.1, Cima)), 0.2, Visível para Posição e Raio);
            "Teleport text"
            Criar Texto no Mundo(If-Then-Else(E(Comparar(Contagem de(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current)), >, 1), Não((Jogador Anfitrião).editor_modeSelect)), Jogador Anfitrião, Nulo), If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("传送点位置"), String Personalizada("teleporter location")), Valor na Matriz(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current), True), 1.6, Não Cortar, Visível para Posição e String, Cor(Azul-celeste), Visibilidade-padrão);
            "normal cp if teleport"
            Criar Efeito(If-Then-Else(E(Valor na Matriz(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current), True), Não((Jogador Anfitrião).editor_modeSelect)), Jogador Anfitrião, Nulo), Anel, Cor(Laranja), Primeiro de(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current)), True, Visível para Posição e Raio);
            Criar Texto no Mundo(If-Then-Else(E(Valor na Matriz(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current), True), Não((Jogador Anfitrião).editor_modeSelect)), Jogador Anfitrião, Nulo), If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("检查点位置"), String Personalizada("level location")), Primeiro de(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current)), 1.6, Não Cortar, Visível para Posição e String, Cor(Azul-celeste), Visibilidade-padrão);
            "portal fx"
            Criar Efeito(If-Then-Else(E(Contagem de(Global.EditSelectIdArray), Comparar((Jogador Anfitrião).editor_modeSelect, ==, 4)), Jogador Anfitrião, Nulo), Faíscas, Cor(Roxo), Valor na Matriz(Global.CustomPortalEndpoint, Global.EditSelected), 0.2, Visível para Posição e Raio);
    }
}

regra ("Editor | Toggle Fly & Noclip") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Global.EditorOn != False;
        É Botão Segurado(Jogador do Evento, Botão(Habilidade 1)) == True;
        (Jogador do Evento).editor_fly == Nulo;
        E(Global.EditorMoveItem, Comparar(Jogador do Evento, ==, Jogador Anfitrião)) == False;
    }
    ações {
        Esperar até(Ou(É Botão Segurado(Jogador do Evento, Botão(Recarregar)), Não(É Botão Segurado(Jogador do Evento, Botão(Habilidade 1)))), 0.7);
        If(Ou(É Botão Segurado(Jogador do Evento, Botão(Recarregar)), Não(É Botão Segurado(Jogador do Evento, Botão(Habilidade 1)))));
            Esperar(False, Ignorar Condição);
            Anular;
        Término;
        Definir Variável de Jogador(Jogador do Evento, editor_fly, Somar(Posição de(Jogador do Evento), Cima));
        Começar a Forçar Posição do Jogador(Jogador do Evento, (Jogador do Evento).editor_fly, True);
        Desabilitar Colisão de Movimento com Ambiente(Jogador do Evento, True);
        Proibir Botão(Jogador do Evento, Botão(Habilidade Suprema));
        Esperar até(Não(É Botão Segurado(Jogador do Evento, Botão(Habilidade 1))), True);
        While(E(E(É Vivo(Jogador do Evento), (Jogador do Evento).editor_fly), Não(É Botão Segurado(Jogador do Evento, Botão(Habilidade 1)))));
            If(Ou(Comparar(Jogador do Evento, !=, Jogador Anfitrião), Não((Jogador do Evento).editor_lock)));
                Modificar Variável de Jogador(Jogador do Evento, editor_fly, Adicionar, Multiplicar(Subtrair(Somar(0.096, Multiplicar(0.192, É Botão Segurado(Jogador do Evento, Botão(Pular)))), Multiplicar(0.048, É Botão Segurado(Jogador do Evento, Botão(Agachar)))), Somar(Somar(Multiplicar(Multiplicar(Direção Frontal de(Jogador do Evento), Componente Z de(Aceleração de(Jogador do Evento))), Vetor(True, Não(É Botão Segurado(Jogador do Evento, Botão(Habilidade 1))), True)), Vetor do Mundo de(Multiplicar(Aceleração de(Jogador do Evento), Esquerda), Jogador do Evento, Rotação)), Multiplicar(Cima, Subtrair(É Botão Segurado(Jogador do Evento, Botão(Habilidade 2)), É Botão Segurado(Jogador do Evento, Botão(Habilidade Suprema)))))));
            Else If(Não((Jogador Anfitrião).editor_modeSelect));
                Modificar Variável de Jogador(Jogador do Evento, editor_fly, Adicionar, Multiplicar(Somar(0.00288, Multiplicar(0.09312, É Botão Segurado(Jogador do Evento, Botão(Disparo Primário)))), Somar(Somar(Multiplicar(Direção Frontal de(Jogador do Evento), Componente Z de(Aceleração de(Jogador do Evento))), Vetor do Mundo de(Multiplicar(Aceleração de(Jogador do Evento), Esquerda), Jogador do Evento, Rotação)), Multiplicar(Cima, Subtrair(É Botão Segurado(Jogador do Evento, Botão(Pular)), É Botão Segurado(Jogador do Evento, Botão(Agachar)))))));
            Término;
            Esperar(False, Ignorar Condição);
        Término;
        Permitir Botão(Jogador do Evento, Botão(Habilidade Suprema));
        Habilitar Colisão de Movimento com Ambiente(Jogador do Evento);
        Definir Variável de Jogador(Jogador do Evento, editor_fly, Nulo);
        Parar de Forçar Posição do Jogador(Jogador do Evento);
        Esperar(True, Ignorar Condição);
    }
}

regra ("Editor | Change Mode") {
    evento {
        Em andamento - Global;
    }
    condições {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        Global.EditorOn != False;
        (Jogador Anfitrião).editor_lock == False;
        É Botão Segurado(Jogador Anfitrião, Botão(Corpo a corpo)) == True;
        É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)) != É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário));
    }
    ações {
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, True);
        If(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)));
            Modificar Variável de Jogador(Jogador Anfitrião, editor_modeSelect, Adicionar, 4);
        Else;
            Modificar Variável de Jogador(Jogador Anfitrião, editor_modeSelect, Adicionar, True);
        Término;
        Modificar Variável de Jogador(Jogador Anfitrião, editor_modeSelect, Modular, 5);
        Chamar sub-rotina(EditUpdateSelectedIds);
        Chamar sub-rotina(EditorSelectLast);
        Esperar(False, Ignorar Condição);
        Esperar até(Comparar(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)), ==, É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário))), 0.1);
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, False);
    }
}

regra ("Editor | Update Selected Id") {
    evento {
        Sub-rotina;
        EditUpdateSelectedIds;
    }
    ações {
        If(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 1));
            Definir Variável Global(EditSelectIdArray, Matriz Mapeada(Global.killballnumber, Índice da Matriz Atual));
            Definir Variável Global(EditSelectIdArray, Matriz Filtrada(Global.EditSelectIdArray, Comparar(Valor na Matriz(Global.killballnumber, Elemento da Matriz Atual), ==, (Jogador Anfitrião).checkpoint_current)));
        Else If(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2));
            Definir Variável Global(EditSelectIdArray, Matriz Mapeada(Global.pinballnumber, Índice da Matriz Atual));
            Definir Variável Global(EditSelectIdArray, Matriz Filtrada(Global.EditSelectIdArray, Comparar(Valor na Matriz(Global.pinballnumber, Elemento da Matriz Atual), ==, (Jogador Anfitrião).checkpoint_current)));
        Else If(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 4));
            Definir Variável Global(EditSelectIdArray, Matriz Mapeada(Global.CustomPortalCP, Índice da Matriz Atual));
            Definir Variável Global(EditSelectIdArray, Matriz Filtrada(Global.EditSelectIdArray, Ou(Comparar(Valor na Matriz(Global.CustomPortalCP, Elemento da Matriz Atual), <, Nulo), Comparar(Valor na Matriz(Global.CustomPortalCP, Elemento da Matriz Atual), ==, (Jogador Anfitrião).checkpoint_current))));
        Else;
            Definir Variável Global(EditSelectIdArray, Matriz Vazia);
        Término;
    }
}

regra ("Editor | Select Last") {
    evento {
        Sub-rotina;
        EditorSelectLast;
    }
    ações {
        Definir Variável Global(EditSelected, Último de(Global.EditSelectIdArray));
    }
}

regra ("Editor | Create Cp/Orb") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        "Required for UpdateCache()"
        Jogador do Evento == Jogador Anfitrião;
        Global.EditorOn != False;
        (Jogador Anfitrião).editor_lock == False;
        Matriz Contém(Matriz(Nulo, 1, 2, 4), (Jogador Anfitrião).editor_modeSelect) == True;
        É Botão Segurado(Jogador Anfitrião, Botão(Interagir)) == True;
        É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)) == True;
    }
    ações {
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, True);
        If(Não((Jogador Anfitrião).editor_modeSelect));
            If(E(Contagem de(Global.A), Comparar(Distância entre(Jogador Anfitrião, Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current)), <=, 1.4)));
                Mensagem Pequena(Jogador Anfitrião, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("   放置的检查点距离太近"), String Personalizada("   Cannot Place Checkpoint Too Close.")));
            Else;
                "$$"
                If(Comparar((Jogador Anfitrião).checkpoint_current, >=, Subtrair(Contagem de(Global.A), True)));
                    Definir Variável de Jogador(Jogador Anfitrião, checkpoint_current, Subtrair(Contagem de(Global.A), True));
                Término;
                If(Comparar((Jogador Anfitrião).checkpoint_current, ==, Subtrair(Contagem de(Global.A), True)));
                    Modificar Variável Global(A, Juntar à Matriz, Posição de(Jogador Anfitrião));
                    Modificar Variável de Jogador(Jogador Anfitrião, checkpoint_current, Adicionar, True);
                Else;
                    Modificar Variável Global(A, Juntar à Matriz, Posição de(Jogador Anfitrião));
                    Definir Variável Global(A, Matriz Mapeada(Global.A, If-Then-Else(Comparar(Índice da Matriz Atual, <, Somar((Jogador Anfitrião).checkpoint_current, True)), Elemento da Matriz Atual, If-Then-Else(Comparar(Índice da Matriz Atual, ==, Somar((Jogador Anfitrião).checkpoint_current, True)), Último de(Global.A), Valor na Matriz(Global.A, Subtrair(Índice da Matriz Atual, True))))));
                    Modificar Variável de Jogador(Jogador Anfitrião, checkpoint_current, Adicionar, True);
                    Definir Variável Global(killballnumber, Matriz Mapeada(Global.killballnumber, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                    Definir Variável Global(pinballnumber, Matriz Mapeada(Global.pinballnumber, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                    Definir Variável Global(CustomPortalCP, Matriz Mapeada(Global.CustomPortalCP, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                    Definir Variável Global(Dao, Matriz Mapeada(Global.Dao, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                    Definir Variável Global(SHIFT, Matriz Mapeada(Global.SHIFT, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                    Definir Variável Global(BanMulti, Matriz Mapeada(Global.BanMulti, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                    Definir Variável Global(BanCreate, Matriz Mapeada(Global.BanCreate, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                    Definir Variável Global(BanStand, Matriz Mapeada(Global.BanStand, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                    Definir Variável Global(BanDead, Matriz Mapeada(Global.BanDead, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                    Definir Variável Global(BanEmote, Matriz Mapeada(Global.BanEmote, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                    Definir Variável Global(BanClimb, Matriz Mapeada(Global.BanClimb, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                    Definir Variável Global(BanSaveDouble, Matriz Mapeada(Global.BanSaveDouble, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                    Definir Variável Global(BanBhop, Matriz Mapeada(Global.BanBhop, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                    Definir Variável Global(BanDjump, Matriz Mapeada(Global.BanDjump, Somar(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
                Término;
                Chamar sub-rotina(UpdateCache);
                Mensagem Pequena(Jogador Anfitrião, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("   新检查点已创建"), String Personalizada("   New Checkpoint Created")));
            Término;
        Else If(Não(Contagem de(Global.A)));
            Mensagem Pequena(Jogador Anfitrião, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("   请先放置检查点"), String Personalizada("   Make A Checkpoint First")));
        Else If(Comparar(Somar(Somar(Contagem de(Global.TQ), Contagem de(Global.H)), Contagem de(Global.CustomPortalStart)), >=, 193));
            Mensagem Grande(Jogador Anfitrião, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("当前地图弹球/传送门数量已达上限"), String Personalizada("Orb/Portal Limit Reached For This Map")));
        Else If(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 1));
            Modificar Variável Global(H, Juntar à Matriz, Posição de(Jogador Anfitrião));
            Modificar Variável Global(killballnumber, Juntar à Matriz, (Jogador Anfitrião).checkpoint_current);
            Modificar Variável Global(I, Juntar à Matriz, 5);
            "to create the fx properly"
            Chamar sub-rotina(EditUpdateSelectedIds);
            Chamar sub-rotina(EditorSelectLast);
            Criar Efeito(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), Comparar((Elemento da Matriz Atual).checkpoint_current, ==, Valor na Matriz(Global.killballnumber, Avaliar Uma Vez(Global.EditSelected)))), Esfera, Valor na Matriz(Global.ColorConfig, 14), Valor na Matriz(Global.H, Avaliar Uma Vez(Global.EditSelected)), Valor Absoluto(Valor na Matriz(Global.I, Avaliar Uma Vez(Global.EditSelected))), Visível para Posição e Raio);
            Modificar Variável Global(K, Juntar à Matriz, Entidade Criada por Último);
            Mensagem Grande(Primeiro de(True), String Personalizada("{0} {1}", If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("新击杀球已创建! \\n仅生效于检查点"), String Personalizada("New boundary Sphere Created! \\nOnly Valid For This Checkpoint")), (Jogador Anfitrião).checkpoint_current));
            Esperar até(Não(E(É Botão Segurado(Jogador Anfitrião, Botão(Interagir)), É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)))), True);
            "EditUpdateSelectedIds() # to arrow during the placement properly"
            While(E(É Botão Segurado(Jogador Anfitrião, Botão(Interagir)), É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário))));
                Definir Variável Global no Índice(H, Global.EditSelected, Posição de Acerto do Lançamento de Raio(Posição do Olho(Jogador Anfitrião), Somar(Posição do Olho(Jogador Anfitrião), Multiplicar(Direção Frontal de(Jogador Anfitrião), 8)), Nulo, Nulo, False));
                Esperar(False, Ignorar Condição);
            Término;
            "UpdateCache()"
            Definir Variável Global(EditorMoveItem, True);
        Else If(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2));
            Modificar Variável Global(TQ, Juntar à Matriz, Posição de(Jogador Anfitrião));
            Modificar Variável Global(pinballnumber, Juntar à Matriz, (Jogador Anfitrião).checkpoint_current);
            Modificar Variável Global(EditMode, Juntar à Matriz, 10);
            Modificar Variável Global(TQ5, Juntar à Matriz, False);
            Modificar Variável Global(TQ6, Juntar à Matriz, False);
            Modificar Variável Global(BounceToggleLock, Juntar à Matriz, False);
            Chamar sub-rotina(EditUpdateSelectedIds);
            Chamar sub-rotina(EditorSelectLast);
            Criar Efeito(Matriz Filtrada(Juntar à Matriz(Todos os Jogadores(Todas as Equipes), Nulo), E(Comparar((Elemento da Matriz Atual).checkpoint_current, ==, Valor na Matriz(Global.pinballnumber, Avaliar Uma Vez(Global.EditSelected))), Não(Matriz Contém((Elemento da Matriz Atual).cache_collectedLocks, Avaliar Uma Vez(Global.EditSelected))))), Orbe, If-Then-Else(Valor na Matriz(Global.BounceToggleLock, Avaliar Uma Vez(Global.EditSelected)), Valor na Matriz(Global.ColorConfig, 16), Valor na Matriz(Global.ColorConfig, 15)), Valor na Matriz(Global.TQ, Avaliar Uma Vez(Global.EditSelected)), True, Visível para Posição Raio e Cor);
            Modificar Variável Global(TQ2, Juntar à Matriz, Entidade Criada por Último);
            Mensagem Grande(Primeiro de(True), String Personalizada("{0} {1}", If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("新弹球已创建! \\n仅生效于检查点"), String Personalizada("New Bounce Orb Created! \\nOnly Valid For This Checkpoint")), (Jogador Anfitrião).checkpoint_current));
            Esperar até(Não(E(É Botão Segurado(Jogador Anfitrião, Botão(Interagir)), É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)))), True);
            While(E(É Botão Segurado(Jogador Anfitrião, Botão(Interagir)), É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário))));
                Definir Variável Global no Índice(TQ, Global.EditSelected, Posição de Acerto do Lançamento de Raio(Posição do Olho(Jogador Anfitrião), Somar(Posição do Olho(Jogador Anfitrião), Multiplicar(Direção Frontal de(Jogador Anfitrião), 7)), Nulo, Nulo, False));
                Esperar(False, Ignorar Condição);
            Término;
            "UpdateCache()"
            Definir Variável Global(EditorMoveItem, True);
        Else If(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 4));
            Modificar Variável Global(CustomPortalStart, Juntar à Matriz, Posição de(Jogador Anfitrião));
            Modificar Variável Global(CustomPortalEndpoint, Juntar à Matriz, Somar(Posição de(Jogador Anfitrião), Multiplicar(10, Cima)));
            Modificar Variável Global(CustomPortalCP, Juntar à Matriz, (Jogador Anfitrião).checkpoint_current);
            Chamar sub-rotina(EditUpdateSelectedIds);
            Chamar sub-rotina(EditorSelectLast);
            Criar Efeito(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), Ou(Comparar(Valor na Matriz(Global.CustomPortalCP, Avaliar Uma Vez(Global.EditSelected)), ==, (Elemento da Matriz Atual).checkpoint_current), Comparar(Valor na Matriz(Global.CustomPortalCP, Avaliar Uma Vez(Global.EditSelected)), <, Nulo))), Aura Boa, Valor na Matriz(Global.ColorConfig, 17), Valor na Matriz(Global.CustomPortalStart, Avaliar Uma Vez(Global.EditSelected)), 0.6, Visível para Posição Raio e Cor);
            Modificar Variável Global(PortalEffects, Juntar à Matriz, Entidade Criada por Último);
            Definir Variável Global(EditSelected, Subtrair(Contagem de(Global.CustomPortalStart), True));
            Esperar até(Não(E(É Botão Segurado(Jogador Anfitrião, Botão(Interagir)), É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)))), True);
            "EditUpdateSelectedIds()"
            While(E(É Botão Segurado(Jogador Anfitrião, Botão(Interagir)), É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário))));
                Definir Variável Global no Índice(CustomPortalStart, Global.EditSelected, Posição de Acerto do Lançamento de Raio(Posição do Olho(Jogador Anfitrião), Somar(Posição do Olho(Jogador Anfitrião), Multiplicar(Direção Frontal de(Jogador Anfitrião), 6)), Nulo, Nulo, False));
                Esperar(False, Ignorar Condição);
            Término;
            Mensagem Grande(Primeiro de(True), If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("新传送门已创建!\\n生效于当前检查点"), String Personalizada("Portal Created \\nOnly Valid For This Checkpoint")));
            Definir Variável Global(EditorMoveItem, True);
        Término;
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, False);
        Esperar(0.64, Ignorar Condição);
    }
}

regra ("Editor | Delete Cp/Orb/Portal") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        "Required for UpdateCache()"
        Jogador do Evento == Jogador Anfitrião;
        Global.EditorOn != False;
        (Jogador Anfitrião).editor_lock == False;
        É Botão Segurado(Jogador Anfitrião, Botão(Interagir)) == True;
        É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário)) == True;
    }
    ações {
        "@Condition EditorMoveItem == false\\n@Condition len(EditSelectIdArray) > 0"
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, True);
        If(E(Não((Jogador Anfitrião).editor_modeSelect), Contagem de(Global.A)));
            "Resync Kill Orbs =================="
            Definir Variável de Jogador(Jogador Anfitrião, editor_temp, Matriz Filtrada(Matriz Mapeada(Global.killballnumber, If-Then-Else(Comparar(Elemento da Matriz Atual, ==, (Jogador Anfitrião).checkpoint_current), Índice da Matriz Atual, -1)), Comparar(Elemento da Matriz Atual, >=, Nulo)));
            "hostPlayer.editor_temp = [i for e, i in KillballCheckpoints if e == hostPlayer.checkpoint_current]"
            For variável global(NANBA, 0, Contagem de((Jogador Anfitrião).editor_temp), True);
                Destruir Efeito(Valor na Matriz(Global.K, Valor na Matriz((Jogador Anfitrião).editor_temp, Global.NANBA)));
                Modificar Variável Global(K, Remover da Matriz por Índice, Valor na Matriz((Jogador Anfitrião).editor_temp, Global.NANBA));
                Esperar(False, Ignorar Condição);
            Término;
            Modificar Variável Global(killballnumber, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            "Decrement checkpoints after removed one"
            Definir Variável Global(killballnumber, Matriz Mapeada(Global.killballnumber, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            "Remove Radii at Checkpoint indexes (temp)"
            Definir Variável Global(I, Matriz Filtrada(Global.I, Não(Matriz Contém((Jogador Anfitrião).editor_temp, Índice da Matriz Atual))));
            Definir Variável Global(H, Matriz Filtrada(Global.H, Não(Matriz Contém((Jogador Anfitrião).editor_temp, Índice da Matriz Atual))));
            "Resync Bounce Orbs =============="
            Definir Variável de Jogador(Jogador Anfitrião, editor_temp, Matriz Filtrada(Matriz Mapeada(Global.pinballnumber, If-Then-Else(Comparar(Elemento da Matriz Atual, ==, (Jogador Anfitrião).checkpoint_current), Índice da Matriz Atual, -1)), Comparar(Elemento da Matriz Atual, >=, Nulo)));
            "hostPlayer.editor_temp = [i for e, i in BouncePadCheckpoints if e == hostPlayer.checkpoint_current]"
            For variável global(NANBA, 0, Contagem de((Jogador Anfitrião).editor_temp), True);
                Destruir Efeito(Valor na Matriz(Global.TQ2, Valor na Matriz((Jogador Anfitrião).editor_temp, Global.NANBA)));
                Modificar Variável Global(TQ2, Remover da Matriz por Índice, Valor na Matriz((Jogador Anfitrião).editor_temp, Global.NANBA));
                Esperar(False, Ignorar Condição);
            Término;
            Modificar Variável Global(pinballnumber, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            "Decrement checkpoints after removed one"
            Definir Variável Global(pinballnumber, Matriz Mapeada(Global.pinballnumber, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            Definir Variável Global(TQ, Matriz Filtrada(Global.TQ, Não(Matriz Contém((Jogador Anfitrião).editor_temp, Índice da Matriz Atual))));
            Definir Variável Global(EditMode, Matriz Filtrada(Global.EditMode, Não(Matriz Contém((Jogador Anfitrião).editor_temp, Índice da Matriz Atual))));
            Definir Variável Global(TQ5, Matriz Filtrada(Global.TQ5, Não(Matriz Contém((Jogador Anfitrião).editor_temp, Índice da Matriz Atual))));
            Definir Variável Global(TQ6, Matriz Filtrada(Global.TQ6, Não(Matriz Contém((Jogador Anfitrião).editor_temp, Índice da Matriz Atual))));
            Definir Variável Global(BounceToggleLock, Matriz Filtrada(Global.BounceToggleLock, Não(Matriz Contém((Jogador Anfitrião).editor_temp, Índice da Matriz Atual))));
            "Resync custom portals =================="
            Definir Variável de Jogador(Jogador Anfitrião, editor_temp, Matriz Filtrada(Matriz Mapeada(Global.CustomPortalCP, If-Then-Else(Comparar(Elemento da Matriz Atual, ==, (Jogador Anfitrião).checkpoint_current), Índice da Matriz Atual, -1)), Comparar(Elemento da Matriz Atual, >=, Nulo)));
            For variável global(NANBA, 0, Contagem de((Jogador Anfitrião).editor_temp), True);
                Destruir Efeito(Valor na Matriz(Global.PortalEffects, Valor na Matriz((Jogador Anfitrião).editor_temp, Global.NANBA)));
                Modificar Variável Global(PortalEffects, Remover da Matriz por Índice, Valor na Matriz((Jogador Anfitrião).editor_temp, Global.NANBA));
                Esperar(False, Ignorar Condição);
            Término;
            Modificar Variável Global(CustomPortalCP, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            "Decrement checkpoints after removed one"
            Definir Variável Global(CustomPortalCP, Matriz Mapeada(Global.CustomPortalCP, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            "Remove Radii at Checkpoint indexes (temp)"
            Definir Variável Global(CustomPortalStart, Matriz Filtrada(Global.CustomPortalStart, Não(Matriz Contém((Jogador Anfitrião).editor_temp, Índice da Matriz Atual))));
            Definir Variável Global(CustomPortalEndpoint, Matriz Filtrada(Global.CustomPortalEndpoint, Não(Matriz Contém((Jogador Anfitrião).editor_temp, Índice da Matriz Atual))));
            Definir Variável de Jogador(Jogador Anfitrião, editor_temp, Nulo);
            Modificar Variável Global(Dao, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            Definir Variável Global(Dao, Matriz Mapeada(Global.Dao, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            Modificar Variável Global(SHIFT, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            Definir Variável Global(SHIFT, Matriz Mapeada(Global.SHIFT, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            Modificar Variável Global(BanMulti, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            Definir Variável Global(BanMulti, Matriz Mapeada(Global.BanMulti, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            Modificar Variável Global(BanCreate, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            Definir Variável Global(BanCreate, Matriz Mapeada(Global.BanCreate, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            Modificar Variável Global(BanStand, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            Definir Variável Global(BanStand, Matriz Mapeada(Global.BanStand, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            Modificar Variável Global(BanDead, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            Definir Variável Global(BanDead, Matriz Mapeada(Global.BanDead, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            Modificar Variável Global(BanEmote, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            Definir Variável Global(BanEmote, Matriz Mapeada(Global.BanEmote, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            Modificar Variável Global(BanClimb, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            Definir Variável Global(BanClimb, Matriz Mapeada(Global.BanClimb, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            Modificar Variável Global(BanSaveDouble, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            Definir Variável Global(BanSaveDouble, Matriz Mapeada(Global.BanSaveDouble, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            Modificar Variável Global(BanBhop, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            Definir Variável Global(BanBhop, Matriz Mapeada(Global.BanBhop, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            Modificar Variável Global(BanDjump, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            Definir Variável Global(BanDjump, Matriz Mapeada(Global.BanDjump, Subtrair(Elemento da Matriz Atual, If-Then-Else(Comparar(Elemento da Matriz Atual, >=, (Jogador Anfitrião).checkpoint_current), 1, Nulo))));
            Modificar Variável Global(A, Remover da Matriz por Índice, (Jogador Anfitrião).checkpoint_current);
            Modificar Variável Global(C, Remover da Matriz por Índice, (Jogador Anfitrião).checkpoint_current);
            Definir Variável de Jogador(Jogador Anfitrião, checkpoint_current, Máx.(Subtrair((Jogador Anfitrião).checkpoint_current, True), False));
            Chamar sub-rotina(RebuildKillOrbs);
            Chamar sub-rotina(RebuildBounceOrbs);
            Chamar sub-rotina(RebuildPortals);
            Mensagem Pequena(Jogador Anfitrião, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("   检查点已删除"), String Personalizada("   Checkpoint Has Been Deleted")));
        Else If(E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 1), Contagem de(Global.EditSelectIdArray)));
            Modificar Variável Global(H, Remover da Matriz por Índice, Global.EditSelected);
            Modificar Variável Global(I, Remover da Matriz por Índice, Global.EditSelected);
            Modificar Variável Global(killballnumber, Remover da Matriz por Índice, Global.EditSelected);
            Destruir Efeito(Valor na Matriz(Global.K, Global.EditSelected));
            Modificar Variável Global(K, Remover da Matriz por Índice, Global.EditSelected);
            Chamar sub-rotina(RebuildKillOrbs);
        Else If(E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), Contagem de(Global.EditSelectIdArray)));
            Modificar Variável Global(TQ, Remover da Matriz por Índice, Global.EditSelected);
            Modificar Variável Global(EditMode, Remover da Matriz por Índice, Global.EditSelected);
            Modificar Variável Global(TQ5, Remover da Matriz por Índice, Global.EditSelected);
            Modificar Variável Global(TQ6, Remover da Matriz por Índice, Global.EditSelected);
            Modificar Variável Global(BounceToggleLock, Remover da Matriz por Índice, Global.EditSelected);
            Destruir Efeito(Valor na Matriz(Global.TQ2, Global.EditSelected));
            Modificar Variável Global(TQ2, Remover da Matriz por Índice, Global.EditSelected);
            Modificar Variável Global(pinballnumber, Remover da Matriz por Índice, Global.EditSelected);
            Chamar sub-rotina(RebuildBounceOrbs);
        Else If(E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 4), Contagem de(Global.EditSelectIdArray)));
            Destruir Efeito(Valor na Matriz(Global.PortalEffects, Global.EditSelected));
            Esperar(False, Ignorar Condição);
            Modificar Variável Global(CustomPortalStart, Remover da Matriz por Índice, Global.EditSelected);
            Modificar Variável Global(CustomPortalEndpoint, Remover da Matriz por Índice, Global.EditSelected);
            Modificar Variável Global(CustomPortalCP, Remover da Matriz por Índice, Global.EditSelected);
            Modificar Variável Global(PortalEffects, Remover da Matriz por Índice, Global.EditSelected);
            Chamar sub-rotina(RebuildPortals);
        Else;
            Definir Variável de Jogador(Jogador Anfitrião, editor_lock, False);
            Esperar(False, Ignorar Condição);
            Anular;
        Término;
        Chamar sub-rotina(UpdateCache);
        Chamar sub-rotina(EditorSelectLast);
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, False);
        Esperar(Somar(0.16, Multiplicar(Contagem de Entidade, 0.007)), Ignorar Condição);
    }
}

regra ("Editor | Toggle Orb Functions") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        "Required for UpdateCache()"
        Jogador do Evento == Jogador Anfitrião;
        Global.EditorOn != False;
        (Jogador Anfitrião).editor_modeSelect == 2;
        (Jogador Anfitrião).editor_lock == False;
        Contagem de(Global.EditSelectIdArray) > Nulo;
        É Botão Segurado(Jogador Anfitrião, Botão(Habilidade Suprema)) == True;
        Ou(Ou(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)), É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário))), É Botão Segurado(Jogador Anfitrião, Botão(Habilidade 2))) == True;
    }
    ações {
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, True);
        If(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)));
            Definir Variável Global no Índice(TQ5, Global.EditSelected, Não(Valor na Matriz(Global.TQ5, Global.EditSelected)));
        Else If(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário)));
            Definir Variável Global no Índice(TQ6, Global.EditSelected, Não(Valor na Matriz(Global.TQ6, Global.EditSelected)));
        Else;
            Definir Variável Global no Índice(BounceToggleLock, Global.EditSelected, Não(Valor na Matriz(Global.BounceToggleLock, Global.EditSelected)));
            Definir Variável Global no Índice(EditMode, Global.EditSelected, Multiplicar(10, Não(Valor na Matriz(Global.BounceToggleLock, Global.EditSelected))));
        Término;
        Chamar sub-rotina(UpdateCache);
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, False);
        Esperar(False, Ignorar Condição);
    }
}

regra ("Editor | Orb Radii/Strength") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        "Required for UpdateCache()"
        Jogador do Evento == Jogador Anfitrião;
        Global.EditorOn != False;
        Matriz Contém(Matriz(1, 2), (Jogador Anfitrião).editor_modeSelect) == True;
        (Jogador Anfitrião).editor_lock == False;
        Contagem de(Global.EditSelectIdArray) > Nulo;
        É Botão Segurado(Jogador Anfitrião, Botão(Habilidade 2)) == True;
        É Botão Segurado(Jogador Anfitrião, Botão(Pular)) != É Botão Segurado(Jogador Anfitrião, Botão(Agachar));
        É Botão Segurado(Jogador Anfitrião, Botão(Interagir)) == False;
    }
    ações {
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, True);
        While(E(É Botão Segurado(Jogador Anfitrião, Botão(Habilidade 2)), Ou(É Botão Segurado(Jogador Anfitrião, Botão(Pular)), É Botão Segurado(Jogador Anfitrião, Botão(Agachar)))));
            If(E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2), Contagem de((Jogador Anfitrião).editor_bounceIndex)));
                Modificar Variável Global no Índice(EditMode, Global.EditSelected, Adicionar, If-Then-Else(É Botão Segurado(Jogador Anfitrião, Botão(Pular)), 0.1, -0.1));
            Else If(E(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 1), Contagem de((Jogador Anfitrião).editor_killIndex)));
                Modificar Variável Global no Índice(I, Global.EditSelected, Adicionar, If-Then-Else(É Botão Segurado(Jogador Anfitrião, Botão(Pular)), 0.1, -0.1));
            Término;
            Esperar(0.1, Ignorar Condição);
        Término;
        Chamar sub-rotina(UpdateCache);
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, False);
    }
}

regra ("Editor | Select Orb/Portal") {
    evento {
        Em andamento - Global;
    }
    condições {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        Global.EditorOn != False;
        Matriz Contém(Matriz(1, 2, 4), (Jogador Anfitrião).editor_modeSelect) == True;
        (Jogador Anfitrião).editor_lock == False;
        Contagem de(Global.EditSelectIdArray) > Nulo;
        É Botão Segurado(Jogador Anfitrião, Botão(Interagir)) == True;
        Ou(É Botão Segurado(Jogador Anfitrião, Botão(Agachar)), É Botão Segurado(Jogador Anfitrião, Botão(Pular))) == True;
    }
    ações {
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, True);
        If(É Botão Segurado(Jogador Anfitrião, Botão(Agachar)));
            Definir Variável Global(EditSelected, If-Then-Else(Índice do Valor da Matriz(Global.EditSelectIdArray, Global.EditSelected), Valor na Matriz(Global.EditSelectIdArray, Subtrair(Índice do Valor da Matriz(Global.EditSelectIdArray, Global.EditSelected), True)), Último de(Global.EditSelectIdArray)));
        Else;
            Definir Variável Global(EditSelected, If-Then-Else(Comparar(Índice do Valor da Matriz(Global.EditSelectIdArray, Global.EditSelected), ==, Subtrair(Contagem de(Global.EditSelectIdArray), True)), Primeiro de(Global.EditSelectIdArray), Valor na Matriz(Global.EditSelectIdArray, Somar(Índice do Valor da Matriz(Global.EditSelectIdArray, Global.EditSelected), True))));
        Término;
        Esperar(False, Ignorar Condição);
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, False);
        Esperar até(Não(E(É Botão Segurado(Jogador Anfitrião, Botão(Interagir)), Ou(É Botão Segurado(Jogador Anfitrião, Botão(Agachar)), É Botão Segurado(Jogador Anfitrião, Botão(Pular))))), 0.24);
    }
}

regra ("Editor | Cp Size Hitbox Display") {
    evento {
        Em andamento - Global;
    }
    condições {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        Global.EditorOn != False;
        (Jogador Anfitrião).editor_modeSelect == Nulo;
        É Botão Segurado(Jogador Anfitrião, Botão(Interagir)) == True;
        É Botão Segurado(Jogador Anfitrião, Botão(Habilidade 1)) == True;
    }
    ações {
        Definir Variável de Jogador(Jogador Anfitrião, editor_hitboxToggle, Não((Jogador Anfitrião).editor_hitboxToggle));
        Esperar(False, Ignorar Condição);
    }
}

regra ("Editor | Cp Add/Remove Teleport") {
    evento {
        Em andamento - Global;
    }
    condições {
        Global.EditorOn != False;
        (Jogador Anfitrião).editor_modeSelect == Nulo;
        (Jogador Anfitrião).editor_lock == False;
        Contagem de(Global.A) > True;
        É Botão Segurado(Jogador Anfitrião, Botão(Interagir)) == True;
        É Botão Segurado(Jogador Anfitrião, Botão(Recarregar)) == True;
        É Botão Segurado(Jogador Anfitrião, Botão(Corpo a corpo)) == False;
    }
    ações {
        "prevent overlap with save map"
        Esperar até(Ou(É Botão Segurado(Jogador Anfitrião, Botão(Corpo a corpo)), Não(E(É Botão Segurado(Jogador Anfitrião, Botão(Interagir)), É Botão Segurado(Jogador Anfitrião, Botão(Recarregar))))), True);
        Anular se(Ou(É Botão Segurado(Jogador Anfitrião, Botão(Corpo a corpo)), E(É Botão Segurado(Jogador Anfitrião, Botão(Interagir)), É Botão Segurado(Jogador Anfitrião, Botão(Recarregar)))));
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, True);
        If(Não((Jogador Anfitrião).checkpoint_current));
            Mensagem Pequena(Jogador Anfitrião, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("   不能在第一个检查点设置传送门"), String Personalizada("   Cannot Place A Teleport On First Checkpoint")));
            Definir Variável de Jogador(Jogador Anfitrião, editor_lock, False);
            Anular;
        Término;
        "remove"
        If(Comparar(Contagem de(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current)), >, 1));
            Definir Variável Global no Índice(A, (Jogador Anfitrião).checkpoint_current, Primeiro de(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current)));
            Mensagem Pequena(Jogador Anfitrião, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("   关卡{0}的传送点已移除", (Jogador Anfitrião).checkpoint_current), String Personalizada("   Teleport For Level {0} Has Been Removed", (Jogador Anfitrião).checkpoint_current)));
        "add"
        Else;
            Definir Variável Global no Índice(A, (Jogador Anfitrião).checkpoint_current, Matriz(If-Then-Else(Contagem de(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current)), Primeiro de(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current)), Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current)), Posição de(Jogador Anfitrião)));
            Mensagem Pequena(Jogador Anfitrião, String Personalizada("{0} {1}", If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("   传送点已添加到当前关卡"), String Personalizada("   Teleport Has Been Added For Level")), (Jogador Anfitrião).checkpoint_current));
        Término;
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, False);
        Esperar(False, Ignorar Condição);
    }
}

regra ("Editor | Moving Checkpoint") {
    evento {
        Em andamento - Global;
    }
    condições {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        Global.EditorOn != False;
        (Jogador Anfitrião).editor_modeSelect == Nulo;
        (Jogador Anfitrião).editor_lock == False;
        Contagem de(Global.A) > Nulo;
        É Botão Segurado(Jogador Anfitrião, Botão(Habilidade 2)) == True;
        É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário)) == False;
    }
    ações {
        Esperar(0.3, Anular Quando For Falso);
        If((Jogador Anfitrião).addon_toggle3rdPov);
            Definir Variável de Jogador(Jogador Anfitrião, addon_toggle3rdPov, False);
        Término;
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, True);
        Definir Variável de Jogador(Jogador Anfitrião, editor_undo, Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current));
        Iniciar Câmera(Jogador Anfitrião, Subtrair(Somar(Posição do Olho(Jogador Anfitrião), Multiplicar(0.5, Cima)), Multiplicar(2.5, Direção Frontal de(Jogador Anfitrião))), Posição do Olho(Jogador Anfitrião), 15);
        While(E(E(É Botão Segurado(Jogador Anfitrião, Botão(Habilidade 2)), É Vivo(Jogador Anfitrião)), Não(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário)))));
            If(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)));
                Definir Velocidade de Movimento(Jogador Anfitrião, 100);
            Else;
                Definir Velocidade de Movimento(Jogador Anfitrião, 3);
            Término;
            If(Contagem de(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current)));
                Definir Variável Global no Índice(A, (Jogador Anfitrião).checkpoint_current, Matriz(Posição de(Jogador Anfitrião), Valor na Matriz(Valor na Matriz(Global.A, (Jogador Anfitrião).checkpoint_current), True)));
            Else;
                Definir Variável Global no Índice(A, (Jogador Anfitrião).checkpoint_current, Posição de(Jogador Anfitrião));
            Término;
            Esperar(False, Ignorar Condição);
        Término;
        Parar Câmera(Jogador Anfitrião);
        Definir Velocidade de Movimento(Jogador Anfitrião, 100);
        If(É Botão Segurado(Jogador Anfitrião, Botão(Habilidade 2)));
            Definir Variável Global no Índice(A, (Jogador Anfitrião).checkpoint_current, (Jogador Anfitrião).editor_undo);
            Esperar até(Não(É Botão Segurado(Jogador Anfitrião, Botão(Habilidade 2))), 999999999999);
        Término;
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, False);
    }
}

regra ("Editor | Toggle Ult/Dash") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Jogador do Evento == Jogador Anfitrião;
        Global.EditorOn != False;
        (Jogador Anfitrião).editor_modeSelect == Nulo;
        (Jogador Anfitrião).editor_lock == False;
        Contagem de(Global.A) > Nulo;
        É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)) != É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário));
        É Botão Segurado(Jogador Anfitrião, Botão(Habilidade Suprema)) == True;
    }
    ações {
        If(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)));
            If(Matriz Contém(Global.Dao, (Jogador Anfitrião).checkpoint_current));
                Modificar Variável Global(Dao, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            Else;
                Modificar Variável Global(Dao, Juntar à Matriz, (Jogador Anfitrião).checkpoint_current);
            Término;
        Else;
            If(Matriz Contém(Global.SHIFT, (Jogador Anfitrião).checkpoint_current));
                Modificar Variável Global(SHIFT, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
            Else;
                Modificar Variável Global(SHIFT, Juntar à Matriz, (Jogador Anfitrião).checkpoint_current);
            Término;
        Término;
        Esperar(False, Ignorar Condição);
    }
}

regra ("Editor | Toggle Bans") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        "Required for UpdateCache()"
        Jogador do Evento == Jogador Anfitrião;
        Global.EditorOn != False;
        (Jogador Anfitrião).editor_modeSelect == 3;
        (Jogador Anfitrião).editor_lock == False;
        Contagem de(Global.A) > Nulo;
        Ou(Ou(Ou(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)), É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário))), É Botão Segurado(Jogador Anfitrião, Botão(Pular))), É Botão Segurado(Jogador Anfitrião, Botão(Agachar))) == True;
        Ou(É Botão Segurado(Jogador Anfitrião, Botão(Interagir)), É Botão Segurado(Jogador Anfitrião, Botão(Habilidade 2))) == True;
    }
    ações {
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, True);
        If(É Botão Segurado(Jogador Anfitrião, Botão(Interagir)));
            If(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)));
                If(Matriz Contém(Global.BanMulti, (Jogador Anfitrião).checkpoint_current));
                    Modificar Variável Global(BanMulti, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
                Else;
                    Modificar Variável Global(BanMulti, Juntar à Matriz, (Jogador Anfitrião).checkpoint_current);
                Término;
            Else If(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário)));
                If(Matriz Contém(Global.BanCreate, (Jogador Anfitrião).checkpoint_current));
                    Modificar Variável Global(BanCreate, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
                Else;
                    Modificar Variável Global(BanCreate, Juntar à Matriz, (Jogador Anfitrião).checkpoint_current);
                Término;
            Else If(É Botão Segurado(Jogador Anfitrião, Botão(Agachar)));
                If(Matriz Contém(Global.BanClimb, (Jogador Anfitrião).checkpoint_current));
                    Modificar Variável Global(BanClimb, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
                Else;
                    Modificar Variável Global(BanClimb, Juntar à Matriz, (Jogador Anfitrião).checkpoint_current);
                Término;
            Else;
                If(Matriz Contém(Global.BanSaveDouble, (Jogador Anfitrião).checkpoint_current));
                    Modificar Variável Global(BanSaveDouble, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
                Else;
                    Modificar Variável Global(BanSaveDouble, Juntar à Matriz, (Jogador Anfitrião).checkpoint_current);
                Término;
            Término;
        Else;
            If(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)));
                If(Matriz Contém(Global.BanDead, (Jogador Anfitrião).checkpoint_current));
                    Modificar Variável Global(BanDead, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
                Else;
                    Modificar Variável Global(BanDead, Juntar à Matriz, (Jogador Anfitrião).checkpoint_current);
                Término;
            Else If(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário)));
                If(Matriz Contém(Global.BanEmote, (Jogador Anfitrião).checkpoint_current));
                    Modificar Variável Global(BanEmote, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
                Else;
                    Modificar Variável Global(BanEmote, Juntar à Matriz, (Jogador Anfitrião).checkpoint_current);
                Término;
            Else If(É Botão Segurado(Jogador Anfitrião, Botão(Agachar)));
                If(Matriz Contém(Global.BanStand, (Jogador Anfitrião).checkpoint_current));
                    Modificar Variável Global(BanStand, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
                Else;
                    Modificar Variável Global(BanStand, Juntar à Matriz, (Jogador Anfitrião).checkpoint_current);
                Término;
            Else;
                If(Matriz Contém(Global.BanBhop, (Jogador Anfitrião).checkpoint_current));
                    Modificar Variável Global(BanBhop, Remover da Matriz por Valor, (Jogador Anfitrião).checkpoint_current);
                Else;
                    Modificar Variável Global(BanBhop, Juntar à Matriz, (Jogador Anfitrião).checkpoint_current);
                Término;
            Término;
        Término;
        "BanStand"
        Esperar(0.3, Ignorar Condição);
        Chamar sub-rotina(UpdateCache);
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, False);
    }
}

regra ("Editor | Change Portal Cp") {
    evento {
        Em andamento - Global;
    }
    condições {
        "@Event eachPlayer\\n@Condition eventPlayer == hostPlayer"
        Global.EditorOn != False;
        (Jogador Anfitrião).editor_modeSelect == 4;
        (Jogador Anfitrião).editor_lock == False;
        Contagem de(Global.EditSelectIdArray) > Nulo;
        É Botão Segurado(Jogador Anfitrião, Botão(Pular)) == True;
        É Botão Segurado(Jogador Anfitrião, Botão(Habilidade 2)) == True;
    }
    ações {
        Definir Variável Global no Índice(CustomPortalCP, Global.EditSelected, If-Then-Else(Comparar(Valor na Matriz(Global.CustomPortalCP, Global.EditSelected), <, Nulo), (Jogador Anfitrião).checkpoint_current, -1));
        Esperar(0.3, Ignorar Condição);
    }
}

regra ("Editor | Move Object") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        "Required for UpdateCache()"
        Jogador do Evento == Jogador Anfitrião;
        Global.EditorOn != False;
        Matriz Contém(Matriz(1, 2, 4), (Jogador Anfitrião).editor_modeSelect) == True;
        (Jogador Anfitrião).editor_lock == False;
        Contagem de(Global.EditSelectIdArray) > Nulo;
        É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário)) == False;
        Ou(Global.EditorMoveItem, E(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)), É Botão Segurado(Jogador Anfitrião, Botão(Habilidade 2)))) == True;
    }
    ações {
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, True);
        Definir Variável Global(EditorMoveItem, True);
        If((Jogador Anfitrião).addon_toggle3rdPov);
            Definir Variável de Jogador(Jogador Anfitrião, addon_toggle3rdPov, False);
        Término;
        "hostPlayer.editor_fly = null"
        Esperar até(Não(Ou(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)), É Botão Segurado(Jogador Anfitrião, Botão(Habilidade 2)))), 999999999999);
        "hostPlayer.disallowButton(Button.ULTIMATE)\\nhostPlayer.disallowButton(Button.JUMP)"
        Definir Status(Jogador Anfitrião, Nulo, Hackeado, 999999999999);
        Definir Velocidade de Movimento(Jogador Anfitrião, False);
        "hostPlayer.startForcingPosition(hostPlayer.getPosition(), false)"
        If(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 1));
            Definir Variável de Jogador(Jogador Anfitrião, editor_undo, Valor na Matriz(Global.H, Global.EditSelected));
            Iniciar Câmera(Jogador Anfitrião, Somar(Valor na Matriz(Global.H, Global.EditSelected), Multiplicar(Direção Frontal de(Jogador Anfitrião), Multiplicar(Valor Absoluto(Valor na Matriz(Global.I, Global.EditSelected)), -1.5))), Valor na Matriz(Global.H, Global.EditSelected), 30);
            While(Não(Ou(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)), É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário)))));
                Modificar Variável Global no Índice(H, Global.EditSelected, Adicionar, Multiplicar(Subtrair(Somar(0.096, Multiplicar(0.192, É Botão Segurado(Jogador do Evento, Botão(Pular)))), Multiplicar(0.048, É Botão Segurado(Jogador do Evento, Botão(Agachar)))), Somar(Somar(Multiplicar(Multiplicar(Direção Frontal de(Jogador do Evento), Componente Z de(Aceleração de(Jogador do Evento))), Vetor(True, Não(É Botão Segurado(Jogador do Evento, Botão(Habilidade 1))), True)), Vetor do Mundo de(Multiplicar(Aceleração de(Jogador do Evento), Esquerda), Jogador do Evento, Rotação)), Multiplicar(Cima, Subtrair(É Botão Segurado(Jogador do Evento, Botão(Habilidade 2)), É Botão Segurado(Jogador do Evento, Botão(Habilidade Suprema)))))));
                Esperar(False, Ignorar Condição);
            Término;
        Else If(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 2));
            Definir Variável de Jogador(Jogador Anfitrião, editor_undo, Valor na Matriz(Global.TQ, Global.EditSelected));
            Iniciar Câmera(Jogador Anfitrião, Somar(Valor na Matriz(Global.TQ, Global.EditSelected), Multiplicar(Direção Frontal de(Jogador Anfitrião), -4)), Valor na Matriz(Global.TQ, Global.EditSelected), 30);
            While(Não(Ou(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)), É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário)))));
                Modificar Variável Global no Índice(TQ, Global.EditSelected, Adicionar, Multiplicar(Subtrair(Somar(0.096, Multiplicar(0.192, É Botão Segurado(Jogador do Evento, Botão(Pular)))), Multiplicar(0.048, É Botão Segurado(Jogador do Evento, Botão(Agachar)))), Somar(Somar(Multiplicar(Multiplicar(Direção Frontal de(Jogador do Evento), Componente Z de(Aceleração de(Jogador do Evento))), Vetor(True, Não(É Botão Segurado(Jogador do Evento, Botão(Habilidade 1))), True)), Vetor do Mundo de(Multiplicar(Aceleração de(Jogador do Evento), Esquerda), Jogador do Evento, Rotação)), Multiplicar(Cima, Subtrair(É Botão Segurado(Jogador do Evento, Botão(Habilidade 2)), É Botão Segurado(Jogador do Evento, Botão(Habilidade Suprema)))))));
                Esperar(False, Ignorar Condição);
            Término;
        Else If(Comparar((Jogador Anfitrião).editor_modeSelect, ==, 4));
            Definir Variável de Jogador(Jogador Anfitrião, editor_undo, Matriz(Valor na Matriz(Global.CustomPortalStart, Global.EditSelected), Valor na Matriz(Global.CustomPortalEndpoint, Global.EditSelected)));
            "move start position"
            Iniciar Câmera(Jogador Anfitrião, Somar(Valor na Matriz(Global.CustomPortalStart, Global.EditSelected), Multiplicar(Direção Frontal de(Jogador Anfitrião), -4)), Valor na Matriz(Global.CustomPortalStart, Global.EditSelected), 30);
            While(Não(Ou(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)), É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário)))));
                Modificar Variável Global no Índice(CustomPortalStart, Global.EditSelected, Adicionar, Multiplicar(Subtrair(Somar(0.096, Multiplicar(0.192, É Botão Segurado(Jogador do Evento, Botão(Pular)))), Multiplicar(0.048, É Botão Segurado(Jogador do Evento, Botão(Agachar)))), Somar(Somar(Multiplicar(Multiplicar(Direção Frontal de(Jogador do Evento), Componente Z de(Aceleração de(Jogador do Evento))), Vetor(True, Não(É Botão Segurado(Jogador do Evento, Botão(Habilidade 1))), True)), Vetor do Mundo de(Multiplicar(Aceleração de(Jogador do Evento), Esquerda), Jogador do Evento, Rotação)), Multiplicar(Cima, Subtrair(É Botão Segurado(Jogador do Evento, Botão(Habilidade 2)), É Botão Segurado(Jogador do Evento, Botão(Habilidade Suprema)))))));
                Esperar(False, Ignorar Condição);
            Término;
            "move destination"
            Iniciar Câmera(Jogador Anfitrião, Somar(Valor na Matriz(Global.CustomPortalEndpoint, Global.EditSelected), Multiplicar(Direção Frontal de(Jogador Anfitrião), -4)), Valor na Matriz(Global.CustomPortalEndpoint, Global.EditSelected), 30);
            Esperar até(Ou(Não(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário))), É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário))), True);
            While(Não(Ou(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário)), É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário)))));
                Modificar Variável Global no Índice(CustomPortalEndpoint, Global.EditSelected, Adicionar, Multiplicar(Subtrair(Somar(0.096, Multiplicar(0.192, É Botão Segurado(Jogador do Evento, Botão(Pular)))), Multiplicar(0.048, É Botão Segurado(Jogador do Evento, Botão(Agachar)))), Somar(Somar(Multiplicar(Multiplicar(Direção Frontal de(Jogador do Evento), Componente Z de(Aceleração de(Jogador do Evento))), Vetor(True, Não(É Botão Segurado(Jogador do Evento, Botão(Habilidade 1))), True)), Vetor do Mundo de(Multiplicar(Aceleração de(Jogador do Evento), Esquerda), Jogador do Evento, Rotação)), Multiplicar(Cima, Subtrair(É Botão Segurado(Jogador do Evento, Botão(Habilidade 2)), É Botão Segurado(Jogador do Evento, Botão(Habilidade Suprema)))))));
                Esperar(False, Ignorar Condição);
            Término;
        Término;
        If(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Secundário)));
            Ignorar(Multiplicar(2, (Jogador Anfitrião).editor_modeSelect));
        Else;
        Else;
            Definir Variável Global no Índice(H, Global.EditSelected, (Jogador Anfitrião).editor_undo);
        Else;
            Definir Variável Global no Índice(TQ, Global.EditSelected, (Jogador Anfitrião).editor_undo);
        Else;
        Else;
        Else;
            Definir Variável Global no Índice(CustomPortalStart, Global.EditSelected, Primeiro de((Jogador Anfitrião).editor_undo));
            Definir Variável Global no Índice(CustomPortalEndpoint, Global.EditSelected, Último de((Jogador Anfitrião).editor_undo));
        Término;
        Definir Variável de Jogador(Jogador Anfitrião, editor_undo, Nulo);
        "hostPlayer.allowButton(Button.ULTIMATE)\\nhostPlayer.allowButton(Button.JUMP)"
        Apagar Status(Jogador Anfitrião, Hackeado);
        Parar Câmera(Jogador Anfitrião);
        Definir Velocidade de Movimento(Jogador Anfitrião, 100);
        "hostPlayer.stopForcingPosition()"
        Definir Variável Global(EditorMoveItem, Nulo);
        Chamar sub-rotina(UpdateCache);
        Esperar até(Não(É Botão Segurado(Jogador Anfitrião, Botão(Disparo Primário))), True);
        Definir Variável de Jogador(Jogador Anfitrião, editor_lock, False);
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Commands ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("Command | Toggle Leaderboard (Hold Melee)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Contagem de(Global.LeaderBoardFull) > Nulo;
        Global.EditorOn == False;
        É Botão Segurado(Jogador do Evento, Botão(Corpo a corpo)) == True;
    }
    ações {
        Esperar(True, Anular Quando For Falso);
        Definir Variável de Jogador(Jogador do Evento, toggle_leaderboard, Não((Jogador do Evento).toggle_leaderboard));
    }
}

regra ("Command | Split hide (Hold Dash + Primary + Secondary)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        É Botão Segurado(Jogador do Evento, Botão(Habilidade 1)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Disparo Primário)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Disparo Secundário)) == True;
    }
    ações {
        Esperar(True, Anular Quando For Falso);
        Definir Variável de Jogador(Jogador do Evento, timer_splitDisplay, If-Then-Else(Comparar((Jogador do Evento).timer_splitDisplay, <=, -999999999999), Nulo, -999999999999));
        Reproduzir Efeito(Jogador do Evento, Som de Impacto para Bônus, Nulo, Jogador do Evento, 100);
        "$$ Language"
        Mensagem Pequena(Jogador do Evento, If-Then-Else(Comparar((Jogador do Evento).timer_splitDisplay, <=, -999999999999), String Personalizada("   Split Display Off"), String Personalizada("   Split Display On")));
        Esperar(0.32, Ignorar Condição);
    }
}

regra ("Command | Toggle Invisible (Hold Deflect)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        É Botão Segurado(Jogador do Evento, Botão(Habilidade 2)) == True;
        Global.EditorOn == False;
        Global.CompMode == False;
    }
    ações {
        Esperar(True, Anular Quando For Falso);
        Definir Variável de Jogador(Jogador do Evento, toggle_invisible, Não((Jogador do Evento).toggle_invisible));
        Definir como Invisível(Jogador do Evento, Ninguém);
        If((Jogador do Evento).toggle_invisible);
            Definir como Invisível(Jogador do Evento, Todos);
        Término;
        Mensagem Pequena(Jogador do Evento, String Personalizada("  {0}{1}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒInvisibleInvisibleInvisible"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), If-Then-Else((Jogador do Evento).toggle_invisible, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ | On | On | On"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ | Off | Off | Off"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))))));
        "\\"   {0} {1}\\".format(\\"隐身模式\\" checkCN \\"Invisible\\", \\"On\\" if eventPlayer.toggle_invisible else \\"Off\\"))"
        Reproduzir Efeito(Jogador do Evento, Som de Impacto para Penalidade, Nulo, Jogador do Evento, 100);
    }
}

regra ("Command | Preview Orbs & Portals (Hold Primary + Secondary)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        "@Condition EditorOn == false"
        (Jogador do Evento).lockState == False;
        (Jogador do Evento).checkpoint_notLast != False;
        É Botão Segurado(Jogador do Evento, Botão(Disparo Primário)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Disparo Secundário)) == True;
    }
    ações {
        "wait(0.9, Wait.ABORT_WHEN_FALSE)"
        Esperar(0.45, Anular Quando For Falso);
        Definir Variável de Jogador(Jogador do Evento, preview_array1, Matriz(Primeiro de(Valor na Matriz(Global.A, Somar((Jogador do Evento).checkpoint_current, True)))));
        If(Contagem de(Global.pinballnumber));
            Modificar Variável de Jogador(Jogador do Evento, preview_array1, Juntar à Matriz, Matriz Filtrada(Global.TQ, Comparar(Valor na Matriz(Global.pinballnumber, Índice da Matriz Atual), ==, (Jogador do Evento).checkpoint_current)));
            Modificar Variável de Jogador(Jogador do Evento, preview_array2, Juntar à Matriz, Matriz Filtrada(Matriz Mapeada(Global.pinballnumber, Índice da Matriz Atual), Comparar(Valor na Matriz(Global.pinballnumber, Elemento da Matriz Atual), ==, (Jogador do Evento).checkpoint_current)));
        Término;
        If(Contagem de(Global.CustomPortalStart));
            "eventPlayer.preview_array1.append( [i for i in CustomPortalStart if CustomPortalCP[CustomPortalStart.index(i)] == eventPlayer.checkpoint_current] )"
            For variável de jogador(Jogador do Evento, preview_i, 0, Contagem de((Jogador do Evento).cache_portalStart), True);
                Modificar Variável de Jogador(Jogador do Evento, preview_array1, Juntar à Matriz, Matriz(Valor na Matriz((Jogador do Evento).cache_portalStart, (Jogador do Evento).preview_i), Valor na Matriz((Jogador do Evento).cache_portalEnd, (Jogador do Evento).preview_i)));
                Modificar Variável de Jogador(Jogador do Evento, preview_array2, Juntar à Matriz, Matriz(Matriz((Jogador do Evento).preview_i, False), Matriz((Jogador do Evento).preview_i, True)));
            Término;
        Término;
        Esperar(False, Ignorar Condição);
        Definir Variável de Jogador(Jogador do Evento, preview_i, Nulo);
        If((Jogador do Evento).addon_toggle3rdPov);
            Definir Variável de Jogador(Jogador do Evento, addon_toggle3rdPov, False);
        Término;
        Iniciar Câmera(Jogador do Evento, Subtrair(Somar(Valor na Matriz((Jogador do Evento).preview_array1, (Jogador do Evento).preview_i), Cima), Multiplicar(Subtrair(3.5, Multiplicar(3, Componente Z de(Aceleração de(Jogador do Evento)))), Direção Frontal de(Jogador do Evento))), Somar(Valor na Matriz((Jogador do Evento).preview_array1, (Jogador do Evento).preview_i), Cima), 15);
        Definir Velocidade de Movimento(Jogador do Evento, False);
        Definir Disparo Primário Ativado(Jogador do Evento, False);
        Definir Disparo Secundário Ativado(Jogador do Evento, False);
        Proibir Botão(Jogador do Evento, Botão(Habilidade 1));
        Proibir Botão(Jogador do Evento, Botão(Pular));
        While(E(E(E(É Botão Segurado(Jogador do Evento, Botão(Disparo Primário)), É Botão Segurado(Jogador do Evento, Botão(Disparo Secundário))), É Vivo(Jogador do Evento)), Não((Jogador do Evento).lockState)));
            If(Comparar(Componente X de(Aceleração de(Jogador do Evento)), <, -0.5));
                Modificar Variável de Jogador(Jogador do Evento, preview_i, Adicionar, True);
            Else If(Comparar(Componente X de(Aceleração de(Jogador do Evento)), >, 0.5));
                Modificar Variável de Jogador(Jogador do Evento, preview_i, Adicionar, Subtrair(Contagem de((Jogador do Evento).preview_array1), True));
            Término;
            Modificar Variável de Jogador(Jogador do Evento, preview_i, Modular, Contagem de((Jogador do Evento).preview_array1));
            Esperar até(Comparar(Valor Absoluto(Componente X de(Aceleração de(Jogador do Evento))), <, 0.5), True);
            Esperar(False, Ignorar Condição);
        Término;
        Definir Disparo Primário Ativado(Jogador do Evento, True);
        Definir Disparo Secundário Ativado(Jogador do Evento, True);
        Permitir Botão(Jogador do Evento, Botão(Habilidade 1));
        Permitir Botão(Jogador do Evento, Botão(Pular));
        Parar Câmera(Jogador do Evento);
        Definir Velocidade de Movimento(Jogador do Evento, 100);
        Definir Variável de Jogador(Jogador do Evento, preview_i, Nulo);
        Definir Variável de Jogador(Jogador do Evento, preview_array1, Nulo);
        Definir Variável de Jogador(Jogador do Evento, preview_array2, Nulo);
    }
}

regra ("Command | Restart Run (Crouch + Interact + Deflect)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Ou(Comparar((Jogador do Evento).editor_lock, ==, False), Comparar(Jogador do Evento, !=, Jogador Anfitrião)) == True;
        (Jogador do Evento).lockState == False;
        É Botão Segurado(Jogador do Evento, Botão(Agachar)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Interagir)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Habilidade 2)) == True;
    }
    ações {
        Definir Variável de Jogador(Jogador do Evento, lockState, True);
        If(Global.CompMode);
            Esperar(False, Ignorar Condição);
            If(Comparar(Global.CompTime, <, 1));
                Mensagem Pequena(Jogador do Evento, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("   比赛结束"), String Personalizada("   Competition Is Over")));
                Definir Variável de Jogador(Jogador do Evento, lockState, False);
                Anular;
            Else If((Jogador do Evento).comp_done);
                Definir Variável de Jogador(Jogador do Evento, lockState, False);
                Anular;
            Else If(E(Global.CompRestartLimit, (Jogador do Evento).checkpoint_notLast));
                Mensagem Pequena(Jogador do Evento, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("   禁止在此比赛中运行期间重新启动"), String Personalizada("   Restart During Run Is Disabled For This Competition")));
                Definir Variável de Jogador(Jogador do Evento, lockState, False);
                Anular;
            Else If(Global.CompAtmpNum);
                If(Comparar((Jogador do Evento).comp_countAttempts, ==, Global.CompAtmpNum));
                    Mensagem Pequena(Jogador do Evento, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("   最后一次尝试"), String Personalizada("   This Is Your Final Attempt")));
                    Definir Variável de Jogador(Jogador do Evento, lockState, False);
                    Anular;
                Término;
                If(Comparar((Jogador do Evento).comp_countAttempts, <, Nulo));
                    Mensagem Pequena(Jogador do Evento, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("   你没有尝试过"), String Personalizada("   You Are Out Of Attempts")));
                    Definir Variável de Jogador(Jogador do Evento, lockState, False);
                    Anular;
                Término;
                Modificar Variável de Jogador(Jogador do Evento, comp_countAttempts, Adicionar, True);
                Definir Variável Global no Índice(CompAtmpSaveCount, Índice do Valor da Matriz(Global.CompAtmpSaveNames, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia)), (Jogador do Evento).comp_countAttempts);
            Término;
        Término;
        Definir Variável de Jogador(Jogador do Evento, editor_fly, Nulo);
        Definir Variável de Jogador(Jogador do Evento, checkpoint_current, Nulo);
        Definir Variável de Jogador(Jogador do Evento, timer_splitDisplay, Multiplicar(-999999999999, Comparar((Jogador do Evento).timer_splitDisplay, <=, -999999999999)));
        Definir Variável de Jogador(Jogador do Evento, toggle_practice, False);
        Definir Variável de Jogador(Jogador do Evento, timer_practice, Nulo);
        Parar de Acompanhar Variável de Jogador(Jogador do Evento, timer_practice);
        If(Matriz Contém(Global.SaveEnt, Jogador do Evento));
            Chamar sub-rotina(DeleteSave);
        Término;
        If(É Morto(Jogador do Evento));
            "eventPlayer.respawn()"
            Ressuscitar(Jogador do Evento);
        Término;
        Chamar sub-rotina(StartGame);
        Reproduzir Efeito(Jogador do Evento, Som de Explosão para Anel, Nulo, Jogador do Evento, 100);
        Esperar(Global.CompMode, Ignorar Condição);
        "eventPlayer.allowButton(Button.ABILITY_1)"
        Definir Variável de Jogador(Jogador do Evento, lockState, False);
        "Anti spam"
        Esperar(0.096, Ignorar Condição);
    }
}

regra ("Command | Spectate (Hold Interact)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        É Botão Segurado(Jogador do Evento, Botão(Interagir)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Habilidade 2)) == False;
        E(Global.EditorOn, Ou(Ou(É Botão Segurado(Jogador do Evento, Botão(Corpo a corpo)), É Botão Segurado(Jogador do Evento, Botão(Disparo Primário))), É Botão Segurado(Jogador do Evento, Botão(Disparo Secundário)))) == False;
    }
    ações {
        Esperar(True, Anular Quando For Falso);
        "editor has interact combos"
        If(Global.EditorOn);
            Esperar(True, Anular Quando For Falso);
        Término;
        Ativar Ressurgimento Integrado ao Modo de Jogo(Jogador do Evento);
        Desativar Ressurgimento Integrado ao Modo de Jogo(Jogador do Evento);
        If((Jogador do Evento).toggle_spectate);
            Ressuscitar(Jogador do Evento);
            If((Jogador do Evento).toggle_practice);
                Acompanhar Variável de Jogador na Medida(Jogador do Evento, timer_practice, 999999999999, True, Nenhuma);
            Else If((Jogador do Evento).checkpoint_notLast);
                Chamar sub-rotina(TimerResume);
            Término;
            Chamar sub-rotina(CheckpointFailReset);
        Else;
            Definir Variável de Jogador(Jogador do Evento, toggle_invincible, False);
            Chamar sub-rotina(TimerPause);
            Parar de Acompanhar Variável de Jogador(Jogador do Evento, timer_practice);
            Definir Dano Recebido(Jogador do Evento, 100);
            Abater(Jogador do Evento, Nulo);
            Definir Dano Recebido(Jogador do Evento, 0);
            Mensagem Pequena(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   Hold Interact Again To Turn Off Spectate Mode   Hold Interact Again To Turn Off Spectate Mode   Hold Interact Agai{0}", String Personalizada("n To Turn Off Spectate Mode")), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
        Término;
        Definir Variável de Jogador(Jogador do Evento, toggle_spectate, Não((Jogador do Evento).toggle_spectate));
    }
}

regra ("Command | Toggle Invincible Mode (Melee + Reload)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        E(Global.CompMode, (Jogador do Evento).comp_done) == False;
        (Jogador do Evento).lockState == False;
        É Vivo(Jogador do Evento) == True;
        É Botão Segurado(Jogador do Evento, Botão(Corpo a corpo)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Recarregar)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Interagir)) == False;
    }
    ações {
        Definir Variável de Jogador(Jogador do Evento, lockState, True);
        Definir Variável de Jogador(Jogador do Evento, toggle_invincible, Não((Jogador do Evento).toggle_invincible));
        Definir Variável de Jogador(Jogador do Evento, cache_collectedLocks, Matriz Vazia);
        If((Jogador do Evento).toggle_invincible);
            "\\"探点模式\\" checkCN \\"Invincible mode\\""
            Mensagem Grande(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒInvincible ModeInvincible ModeInvincible Mode"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
            Chamar sub-rotina(TimerPause);
            Parar de Acompanhar Variável de Jogador(Jogador do Evento, timer_practice);
            Regra de início(CheckUlt, Não fazer nada);
            Regra de início(CheckAbility1, Não fazer nada);
        Else;
            If((Jogador do Evento).toggle_practice);
                "\\"练习模式\\" checkCN \\"Practice mode\\""
                Mensagem Grande(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒPractice ModePractice ModePractice Mode"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
                Acompanhar Variável de Jogador na Medida(Jogador do Evento, timer_practice, 999999999999, True, Nenhuma);
                Chamar sub-rotina(CheckpointFailReset);
            Else If((Jogador do Evento).checkpoint_notLast);
                "\\"跑图模式\\" checkCN \\"Normal mode\\""
                Mensagem Grande(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒNormal ModeNormal ModeNormal Mode"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
                Chamar sub-rotina(TimerResume);
                Chamar sub-rotina(CheckpointFailReset);
            Término;
        Término;
        Definir Variável de Jogador(Jogador do Evento, lockState, False);
        "Anti spam"
        Esperar(0.096, Ignorar Condição);
    }
}

regra ("Command | Toggle Practice Mode (Melee + Ultimate)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Global.EditorOn == False;
        Global.CompMode == False;
        (Jogador do Evento).lockState == False;
        É Vivo(Jogador do Evento) == True;
        É Botão Segurado(Jogador do Evento, Botão(Recarregar)) == False;
        É Botão Segurado(Jogador do Evento, Botão(Corpo a corpo)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Habilidade Suprema)) == True;
    }
    ações {
        Definir Variável de Jogador(Jogador do Evento, lockState, True);
        Definir Variável de Jogador(Jogador do Evento, toggle_practice, Não((Jogador do Evento).toggle_practice));
        If((Jogador do Evento).toggle_practice);
            "\\"练习模式\\" checkCN \\"Practice mode\\""
            Mensagem Grande(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒPractice ModePractice ModePractice Mode"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
            Chamar sub-rotina(TimerPause);
            Definir Variável de Jogador(Jogador do Evento, checkpoint_practice, (Jogador do Evento).checkpoint_current);
            Definir Variável de Jogador(Jogador do Evento, timer_splitDisplay, Multiplicar(-999999999999, Comparar((Jogador do Evento).timer_splitDisplay, <=, -999999999999)));
            Definir Variável de Jogador(Jogador do Evento, timer_split, Nulo);
            Definir Variável de Jogador(Jogador do Evento, timer_practice, Nulo);
            Acompanhar Variável de Jogador na Medida(Jogador do Evento, timer_practice, 999999999999, True, Nenhuma);
            If((Jogador do Evento).toggle_invincible);
                Definir Variável de Jogador(Jogador do Evento, toggle_invincible, False);
                Chamar sub-rotina(CheckpointFailReset);
            Término;
        Else;
            "\\"跑图模式\\" checkCN \\"Normal mode\\""
            Mensagem Grande(Jogador do Evento, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒNormal ModeNormal ModeNormal Mode"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))));
            Parar de Acompanhar Variável de Jogador(Jogador do Evento, timer_practice);
            Definir Variável de Jogador(Jogador do Evento, checkpoint_current, (Jogador do Evento).checkpoint_practice);
            Chamar sub-rotina(UpdateCache);
            If(E((Jogador do Evento).checkpoint_notLast, Não((Jogador do Evento).toggle_invincible)));
                Definir Variável de Jogador(Jogador do Evento, timer_split, (Jogador do Evento).timer_normal);
                Chamar sub-rotina(TimerResume);
                Chamar sub-rotina(CheckpointFailReset);
            Término;
        Término;
        Definir Variável de Jogador(Jogador do Evento, lockState, False);
        "Anti spam"
        Esperar(0.096, Ignorar Condição);
    }
}

regra ("Command | Restart Practice (Hold Interact)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Global.EditorOn == False;
        (Jogador do Evento).lockState == False;
        (Jogador do Evento).toggle_practice != False;
        Ou(É Vivo(Jogador do Evento), (Jogador do Evento).toggle_spectate) == True;
        É Botão Segurado(Jogador do Evento, Botão(Interagir)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Agachar)) == False;
        É Botão Segurado(Jogador do Evento, Botão(Habilidade Suprema)) == False;
        É Botão Segurado(Jogador do Evento, Botão(Corpo a corpo)) == False;
        É Botão Segurado(Jogador do Evento, Botão(Habilidade 2)) == False;
    }
    ações {
        "first 2 ifs prevent collide with spec"
        If((Jogador do Evento).toggle_spectate);
            Esperar até(É Vivo(Jogador do Evento), 999999999999);
            Esperar até(Não(É Botão Segurado(Jogador do Evento, Botão(Interagir))), 2);
            Anular;
        Término;
        Esperar até(Não(É Botão Segurado(Jogador do Evento, Botão(Interagir))), 0.9);
        Anular se(É Botão Segurado(Jogador do Evento, Botão(Interagir)));
        Definir Variável de Jogador(Jogador do Evento, timer_practice, Nulo);
        Definir Variável de Jogador(Jogador do Evento, timer_split, Nulo);
        Definir Variável de Jogador(Jogador do Evento, checkpoint_current, (Jogador do Evento).checkpoint_practice);
        Chamar sub-rotina(UpdateCache);
        Chamar sub-rotina(CheckpointFailReset);
    }
}

regra ("Command | Skip (Crouch + Primary-Next | Secondary-Previous)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Contagem de(Global.A) > True;
        Global.EditorMoveItem == False;
        E((Jogador do Evento).editor_lock, Comparar(Jogador do Evento, ==, Jogador Anfitrião)) == False;
        Ou(Global.EditorOn, (Jogador do Evento).toggle_practice) == True;
        (Jogador do Evento).lockState == False;
        É Botão Segurado(Jogador do Evento, Botão(Agachar)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Disparo Primário)) != É Botão Segurado(Jogador do Evento, Botão(Disparo Secundário));
    }
    ações {
        "@Condition hostPlayer.editor_on or ( eventPlayer.toggle_practice and eventPlayer.isHoldingButton(Button.ABILITY_1) )"
        Definir Variável de Jogador(Jogador do Evento, lockState, True);
        Definir Variável de Jogador(Jogador do Evento, timer_split, Nulo);
        Definir Variável de Jogador(Jogador do Evento, timer_practice, Nulo);
        Modificar Variável de Jogador(Jogador do Evento, checkpoint_current, Adicionar, If-Then-Else(É Botão Segurado(Jogador do Evento, Botão(Disparo Secundário)), Subtrair(Contagem de(Global.A), True), True));
        Modificar Variável de Jogador(Jogador do Evento, checkpoint_current, Modular, Contagem de(Global.A));
        Definir Variável de Jogador(Jogador do Evento, checkpoint_moved, True);
        Chamar sub-rotina(UpdateCache);
        Chamar sub-rotina(CheckpointFailReset);
        "Anti spam"
        Esperar(0.064, Ignorar Condição);
        "faster if you spam button"
        Esperar até(Comparar(É Botão Segurado(Jogador do Evento, Botão(Disparo Primário)), ==, É Botão Segurado(Jogador do Evento, Botão(Disparo Secundário))), 0.256);
        Gerar Loop se a Condição for Verdadeira;
        "After loop to prevent instant teleports"
        Definir Variável de Jogador(Jogador do Evento, lockState, False);
    }
}

regra ("Command | Quick Reset (Reload | Hold Reload to Enable)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        É Botão Segurado(Jogador do Evento, Botão(Recarregar)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Corpo a corpo)) == False;
        É Botão Segurado(Jogador do Evento, Botão(Interagir)) == False;
    }
    ações {
        If((Jogador do Evento).toggle_quickRestart);
            If((Jogador do Evento).editor_fly);
                Definir Variável de Jogador(Jogador do Evento, editor_fly, Último de(Valor na Matriz(Global.A, (Jogador do Evento).checkpoint_current)));
            Término;
            Chamar sub-rotina(CheckpointFailReset);
            Esperar(0.32, Ignorar Condição);
        Término;
        Esperar(True, Anular Quando For Falso);
        Definir Variável de Jogador(Jogador do Evento, toggle_quickRestart, Não((Jogador do Evento).toggle_quickRestart));
        Reproduzir Efeito(Jogador do Evento, Som de Impacto para Bônus, Nulo, Jogador do Evento, 100);
        "(\\"快速回点已启用\\" if eventPlayer.toggle_quickRestart else \\"快速回点已关闭\\") checkCN\\n\\"Quick reset is enabled\\" if eventPlayer.toggle_quickRestart else \\"Quick reset is disabled\\""
        Mensagem Grande(Jogador do Evento, If-Then-Else((Jogador do Evento).toggle_quickRestart, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒQuick Reset Is EnabledQuick Reset Is EnabledQuick Reset Is Enabled"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒQuick Reset Is DisabledQuick Reset Is DisabledQuick Reset Is Disabled"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))));
    }
}

regra ("Command | Toggle Hud (Hold Secondary)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Global.EditorMoveItem == False;
        E(E(Global.EditorOn, Comparar(Jogador do Evento, ==, Jogador Anfitrião)), É Botão Segurado(Jogador do Evento, Botão(Corpo a corpo))) == False;
        É Botão Segurado(Jogador do Evento, Botão(Disparo Secundário)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Disparo Primário)) == False;
        "don't activate during skipping"
        É Botão Segurado(Jogador do Evento, Botão(Agachar)) == False;
    }
    ações {
        Esperar(1.5, Anular Quando For Falso);
        Definir Variável de Jogador(Jogador do Evento, toggle_guide, Não((Jogador do Evento).toggle_guide));
        Mensagem Pequena(Jogador do Evento, If-Then-Else((Jogador do Evento).toggle_guide, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   HUD Is Now Shown   HUD Is Now Shown   HUD Is Now Shown"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ   HUD Is Now Hidden   HUD Is Now Hidden   HUD Is Now Hidden"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))));
        "(\\"   HUD已隐藏\\" if eventPlayer.toggle_guide else  \\"   HUD已开启\\")\\ncheckCN\\n(\\"   Hud is now hidden\\" if eventPlayer.toggle_guide else \\"   Hud is now shown\\"))"
        Reproduzir Efeito(Jogador do Evento, Som de Impacto para Bônus, Nulo, Jogador do Evento, 100);
    }
}

regra ("Command | Toggle Hints (Melee + Deflect)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Global.HintText != Nulo;
        É Botão Segurado(Jogador do Evento, Botão(Corpo a corpo)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Habilidade 2)) == True;
        Ou((Jogador do Evento).toggle_hints, Matriz Contém(Global.HintCp, (Jogador do Evento).checkpoint_current)) == True;
    }
    ações {
        Definir Variável de Jogador(Jogador do Evento, toggle_hints, Não((Jogador do Evento).toggle_hints));
    }
}

regra ("Command | Toggle 3rd Person Camera (Hold Crouch + Jump)") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        "True if not null"
        (Jogador do Evento).addon_toggle3rdPov <= True;
        (Jogador do Evento).lockState == False;
        (Jogador do Evento).editor_lock == False;
        É No Chão(Jogador do Evento) == True;
        É Botão Segurado(Jogador do Evento, Botão(Agachar)) == True;
        É Botão Segurado(Jogador do Evento, Botão(Pular)) == True;
    }
    ações {
        Esperar(True, Anular Quando For Falso);
        Definir Variável de Jogador(Jogador do Evento, addon_toggle3rdPov, Não((Jogador do Evento).addon_toggle3rdPov));
        Chamar sub-rotina(Addon3rdPerson);
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Huds ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("Huds | Global Localplayer") {
    evento {
        Em andamento - Global;
    }
    ações {
        Esperar(0.8, Ignorar Condição);
        "name/credit construction\\nnote on changing default name/credit\\nif you change it, also change it in the credits rule\\nthe old credits should always remain valid here to keep old data valid"
        If(Comparar(Global.Name, ==, String Personalizada("name here - 作者")));
            "Legacy Credits"
            Definir Variável Global(Name, Primeiro de(Global.Cachedcredits));
        Término;
        If(Não(Global.Name));
            Definir Variável Global(Name, String Personalizada("name here - 作者"));
        Término;
        If(Comparar(Global.Code, ==, String Personalizada("code here - 代码")));
            "Legacy Credits"
            Definir Variável Global(Code, Último de(Global.Cachedcredits));
        Término;
        If(Não(Global.Code));
            Definir Variável Global(Code, String Personalizada("code here - 代码"));
        Término;
        Definir Variável Global(Cachedcredits, Nulo);
        If(Não(Global.EditorOn));
            Criar Texto de HUD(Primeiro de(True), Nulo, If-Then-Else((Jogador Local).toggle_guide, String Personalizada("Discord: dsc.gg/genjiparkour"), Matriz Vazia), String Personalizada("{0}: {1}                                                                                                ", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒMade ByMade ByMade By"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Global.Name), Esquerda, -200, Nulo, Valor na Matriz(Global.ColorConfig, 18), Primeiro de(Global.ColorConfig), Visível para e String, Visibilidade-padrão);
            Criar Texto de HUD(Primeiro de(True), Nulo, Nulo, String Personalizada("{0}: {1}                                                                                                ", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒMap CodeMap CodeMap Code"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Global.Code), Esquerda, -199, Nulo, Nulo, Valor na Matriz(Global.ColorConfig, True), Visível para e String, Visibilidade-padrão);
            Criar Texto de HUD((Jogador Local).toggle_guide, Nulo, Nulo, String Personalizada("{0} {1} + {2}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), String de Mapeamento de Entrada(Botão(Disparo Primário)), String Personalizada("{0} | {1}", String de Mapeamento de Entrada(Botão(Disparo Secundário)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒPreview CPPreview CPPreview CP"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))))), Direita, -160, Nulo, Nulo, If-Then-Else((Jogador Local).preview_array1, Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 6)), Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 5))), Visível para String e Cor, Visibilidade-padrão);
            Criar Texto de HUD(Primeiro de(E((Jogador Local).preview_array1, (Jogador Local).toggle_guide)), Nulo, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒWalk ◀ ▶ | Preview Others\\nWalk ▲ ▼ | Modify Zoom\\nAim | Change Preview AngleWalk ◀ ▶ | Preview Others\\nWalk ▲ ▼ | Modify{0}", String Personalizada(" Zoom\\nAim | Change Preview AngleWalk ◀ ▶ | Preview Others\\nWalk ▲ ▼ | Modify Zoom\\nAim | Change Preview Angle")), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Nulo, Topo, -171, Nulo, Valor na Matriz(Global.ColorConfig, 6), Nulo, Visível para e String, Nunca Visível);
            Criar Texto de HUD(Jogador Local, Nulo, Nulo, If-Then-Else(Ou(Comparar((Jogador Local).timer_splitDisplay, <=, -999999999999), (Jogador Local).toggle_spectate), Matriz Vazia, String Personalizada("{0}{1}                                                                                                ", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒSplit: Split: Split: "), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), (Jogador Local).timer_splitDisplay)), Esquerda, -195, Nulo, Nulo, Valor na Matriz(Global.ColorConfig, 3), Visível para e String, Visibilidade-padrão);
            "Remove no hints - visual and element bloat"
            If(Contagem de(Global.HintText));
                Criar Texto de HUD(Primeiro de(E((Jogador Local).toggle_guide, Matriz Contém(Global.HintCp, (Jogador Local).checkpoint_current))), Nulo, String Personalizada("{0}{1}", If-Then-Else((Jogador Local).toggle_hints, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ― ― ― ― ― Hint ― ― ― ― ―\\n― ― ― ― ― Hint ― ― ― ― ―\\n― ― ― ― ― Hint ― ― ― ― ―\\n"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ― ― ― Hint Available ― ― ―― ― ― Hint Available ― ― ―― ― ― Hint Available ― ― ―"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))), If-Then-Else((Jogador Local).toggle_hints, Valor na Matriz(Global.HintText, Índice do Valor da Matriz(Global.HintCp, (Jogador Local).checkpoint_current)), Matriz Vazia)), String Personalizada("{0} + {1} | {2}", String de Mapeamento de Entrada(Botão(Habilidade 2)), String de Mapeamento de Entrada(Botão(Corpo a corpo)), If-Then-Else((Jogador Local).toggle_hints, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒHide HintHide HintHide Hint"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒShow HintShow HintShow Hint"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))))), Direita, -151, Nulo, If-Then-Else((Jogador Local).toggle_hints, Cor(Verde), Cor(Laranja)), If-Then-Else(Matriz Contém(Global.HintCp, (Jogador Local).checkpoint_current), Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 5)), Cor(Cinza)), Visível para String e Cor, Visibilidade-padrão);
            Término;
            Criar Texto de HUD((Jogador Local).toggle_guide, Nulo, Nulo, String Personalizada("{0} + {1} + {2}", String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Habilidade 2)), String Personalizada("{0} | {1}\\n{2}", String de Mapeamento de Entrada(Botão(Interagir)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒRestartRestartRestart"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), String Personalizada("{0} {1} | {2}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), String de Mapeamento de Entrada(Botão(Corpo a corpo)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒLeaderboardLeaderboardLeaderboard"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))))), Direita, -156, Nulo, Nulo, Valor na Matriz(Global.ColorConfig, 5), Visível para e String, Visibilidade-padrão);
            Definir Variável Global(Difficultyhud, Matriz(Caixa de Combinação de Configurações do Workshop(String Personalizada("Map Settings ■ 地图设置 ■ 맵 설정"), String Personalizada("Difficulty 󠀨Display Hud󠀩 ■ 难度 󠀨顶部hud󠀩 ■ 난이도 󠀨HUD 디스플레이󠀩"), 0, Matriz(String Personalizada("<fg27AAFFFF>Playtest ■ 游戏测试 ■ 플레이테스트"), String Personalizada("<fgA0E81BFF>Easy-"), String Personalizada("<fgA0E81BFF>Easy"), String Personalizada("<fgA0E81BFF>Easy+"), String Personalizada("<fge0e000FF>Medium-"), String Personalizada("<fge0e000FF>Medium"), String Personalizada("<fge0e000FF>Medium+"), String Personalizada("<fgEC9900FF>Hard-"), String Personalizada("<fgEC9900FF>Hard"), String Personalizada("<fgEC9900FF>Hard+"), String Personalizada("<fgFF4500FF>Very Hard-"), String Personalizada("<fgFF4500FF>Very Hard"), String Personalizada("<fgFF4500FF>Very Hard+"), String Personalizada("<fgC80013FF>Extreme-"), String Personalizada("<fgC80013FF>Extreme"), String Personalizada("<fgC80013FF>Extreme+"), String Personalizada("<fg960000FF>Hell"), String Personalizada("Do Not Display ■ 不显示 ■ 표시 X")), 1), Alternar Configuração do Workshop(String Personalizada("Map Settings ■ 地图设置 ■ 맵 설정"), String Personalizada("Playtest Display ■ 游戏测试 ■ 플레이테스트 디스플레이"), False, 2)));
            "display\\n17th entry is 'dont display'"
            If(Comparar(Primeiro de(Global.Difficultyhud), !=, 17));
                Criar Texto de HUD(Primeiro de(E((Jogador Local).toggle_guide, Não((Jogador Local).toggle_leaderboard))), If-Then-Else(Último de(Global.Difficultyhud), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒPlaytestPlaytestPlaytest"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Matriz Vazia), Valor na Matriz(Matriz(String Personalizada("Playtest"), String Personalizada("Easy -"), String Personalizada("Easy"), String Personalizada("Easy +"), String Personalizada("Medium -"), String Personalizada("Medium"), String Personalizada("Medium +"), String Personalizada("Hard -"), String Personalizada("Hard"), String Personalizada("Hard +"), String Personalizada("Very Hard -"), String Personalizada("Very Hard"), String Personalizada("Very Hard +"), String Personalizada("Extreme -"), String Personalizada("Extreme"), String Personalizada("Extreme +"), String Personalizada("Hell"), Nulo), Primeiro de(Global.Difficultyhud)), Nulo, Topo, -173, Cor(Azul), Valor na Matriz(Matriz(Cor(Azul), Cor(Verde-limão), Cor(Verde-limão), Cor(Verde-limão), Cor(Amarelo), Cor(Amarelo), Cor(Amarelo), Cor(Laranja), Cor(Laranja), Cor(Laranja), Cor Personalizada(255, 69, 0, 255), Cor Personalizada(255, 69, 0, 255), Cor Personalizada(255, 69, 0, 255), Cor(Vermelho), Cor(Vermelho), Cor(Vermelho), Cor Personalizada(150, 0, 0, 255), Nulo), Primeiro de(Global.Difficultyhud)), Nulo, Visível para e String, Visibilidade-padrão);
            Término;
        Término;
        "global huds"
        Criar Texto de HUD(Primeiro de(True), Nulo, String Personalizada("{0}{1}{2}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒServer Restart In Server Restart In Server Restart In "), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Global.TimeRemaining, String Personalizada("{0}v1.10.4A{1}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ Min -  Min -  Min - "), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), If-Then-Else(Comparar(Contagem de Texto, >=, 128), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ\\nError: Max HUD Count Reached\\nError: Max HUD Count Reached\\nError: Max HUD Count Reached"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Matriz Vazia))), Nulo, Direita, -162, Nulo, Valor na Matriz(Global.ColorConfig, 2), Nulo, Visível para e String, Sempre Visível);
        "padding for custom hud display"
        Criar Texto de HUD(Primeiro de(True), Nulo, Nulo, String Personalizada("­\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n\\n"), Topo, -164, Nulo, Nulo, Cor(Laranja), Visível para, Visibilidade-padrão);
        Criar Texto de HUD((Jogador Local).toggle_guide, Nulo, Nulo, If-Then-Else((Jogador Local).toggle_quickRestart, String Personalizada("{0} | {1}", String de Mapeamento de Entrada(Botão(Recarregar)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒQuick ResetQuick ResetQuick Reset"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))), String Personalizada("{0} {1} | {2}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), String de Mapeamento de Entrada(Botão(Recarregar)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒEnable Quick ResetEnable Quick ResetEnable Quick Reset"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))))), Direita, -157, Nulo, Nulo, Valor na Matriz(Global.ColorConfig, 5), Visível para e String, Visibilidade-padrão);
        Criar Texto de HUD((Jogador Local).toggle_guide, Nulo, Nulo, String Personalizada("{0} + {1} | {2}", String de Mapeamento de Entrada(Botão(Recarregar)), String de Mapeamento de Entrada(Botão(Corpo a corpo)), String Personalizada("{0}{1}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒInvincibleInvincibleInvincible"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), If-Then-Else((Jogador Local).toggle_invincible, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ | On | On | On"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Matriz Vazia))), Direita, -154, Nulo, Nulo, If-Then-Else((Jogador Local).toggle_invincible, Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 6)), Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 5))), Visível para String e Cor, Visibilidade-padrão);
        Criar Texto de HUD(Primeiro de(True), Nulo, If-Then-Else((Jogador Local).toggle_guide, Matriz Vazia, String Personalizada("{0}{1}{2}", If-Then-Else((Jogador Local).toggle_invincible, String de Ícone de Habilidade(Herói(Baptiste), Botão(Habilidade 2)), Matriz Vazia), If-Then-Else((Jogador Local).toggle_practice, String de Ícone de Habilidade(Herói(D.Va), Botão(Habilidade Suprema)), Matriz Vazia), If-Then-Else((Jogador Local).toggle_invisible, String de Ícone de Habilidade(Herói(Sombra), Botão(Habilidade 1)), Matriz Vazia))), String Personalizada("{0} {1} | {2} HUD", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), String de Mapeamento de Entrada(Botão(Disparo Secundário)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒToggleToggleToggle"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))), Direita, -161, Nulo, Valor na Matriz(Global.ColorConfig, 5), Valor na Matriz(Global.ColorConfig, 5), Visível para e String, Visibilidade-padrão);
        "text per checkpoint  text per cp each"
        If(Contagem de(Global.CpHudText));
            Criar Texto de HUD(Primeiro de(E(Matriz Contém(Global.CpHudCp, (Jogador Local).checkpoint_current), (Jogador Local).toggle_guide)), Valor na Matriz(Global.CpHudText, Índice do Valor da Matriz(Global.CpHudCp, (Jogador Local).checkpoint_current)), Nulo, Nulo, Topo, -169, Cor(Azul), Nulo, Nulo, Visível para e String, Visibilidade-padrão);
        Término;
        If(Contagem de(Global.CpIwtText));
            Criar Texto no Mundo(Matriz Contém(Global.CpIwtCp, (Jogador Local).checkpoint_current), Valor na Matriz(Global.CpIwtText, Índice do Valor da Matriz(Global.CpIwtCp, (Jogador Local).checkpoint_current)), Valor na Matriz(Global.CpIwtPos, Índice do Valor da Matriz(Global.CpIwtCp, (Jogador Local).checkpoint_current)), 2, Cortar nas Superfícies, Visível para Posição e String, Global.CpIwtColor, Visibilidade-padrão);
        Término;
        If(Global.CompMode);
            Criar Texto de HUD(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), (Elemento da Matriz Atual).comp_instructionHud), String Personalizada("                                                                                                                           "), Nulo, Nulo, Topo, -181, Cor(Branco), Nulo, Nulo, Visível para, Visibilidade-padrão);
            If(Primeiro de(Global.instructiontext));
                Criar Texto de HUD(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), (Elemento da Matriz Atual).comp_instructionHud), Nulo, Nulo, Primeiro de(Global.instructiontext), Topo, -180, Nulo, Nulo, Cor(Branco), Visível para, Visibilidade-padrão);
            Término;
            If(Valor na Matriz(Global.instructiontext, True));
                Criar Texto de HUD(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), (Elemento da Matriz Atual).comp_instructionHud), Nulo, Nulo, Valor na Matriz(Global.instructiontext, True), Topo, -179, Nulo, Nulo, Cor(Branco), Visível para, Visibilidade-padrão);
            Término;
            If(Valor na Matriz(Global.instructiontext, 2));
                Criar Texto de HUD(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), (Elemento da Matriz Atual).comp_instructionHud), Nulo, Nulo, Valor na Matriz(Global.instructiontext, 2), Topo, -178, Nulo, Nulo, Cor(Branco), Visível para, Visibilidade-padrão);
            Término;
            If(Valor na Matriz(Global.instructiontext, 3));
                Criar Texto de HUD(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), (Elemento da Matriz Atual).comp_instructionHud), Nulo, Nulo, Valor na Matriz(Global.instructiontext, 3), Topo, -177, Nulo, Nulo, Cor(Branco), Visível para, Visibilidade-padrão);
            Término;
            Criar Texto de HUD(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), (Elemento da Matriz Atual).comp_instructionHud), String Personalizada("                                   Press {0} to start                                ", String de Mapeamento de Entrada(Botão(Interagir))), Nulo, Nulo, Topo, -176, Cor(Branco), Nulo, Nulo, Visível para e String, Visibilidade-padrão);
        Else If(Não(Global.EditorOn));
            Criar Texto de HUD((Jogador Local).toggle_guide, Nulo, Nulo, String Personalizada("{0} {1} | {2}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), String de Mapeamento de Entrada(Botão(Habilidade 2)), String Personalizada("{0}{1}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒInvisibleInvisibleInvisible"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), If-Then-Else((Jogador Local).toggle_invisible, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ | On | On | On"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Matriz Vazia))), Direita, -158, Nulo, Nulo, If-Then-Else((Jogador Local).toggle_invisible, Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 6)), Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 5))), Visível para String e Cor, Visibilidade-padrão);
            Criar Texto de HUD((Jogador Local).toggle_guide, Nulo, Nulo, String Personalizada("{0} + {1} | {2}", String de Mapeamento de Entrada(Botão(Habilidade Suprema)), String de Mapeamento de Entrada(Botão(Corpo a corpo)), String Personalizada("{0}{1}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒPracticePracticePractice"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), If-Then-Else((Jogador Local).toggle_practice, String Personalizada(" | ({0})", (Jogador Local).checkpoint_practice), Matriz Vazia))), Direita, -153, Nulo, Nulo, If-Then-Else((Jogador Local).toggle_practice, Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 6)), Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 5))), Visível para String e Cor, Visibilidade-padrão);
            Criar Texto de HUD(Primeiro de(E((Jogador Local).toggle_practice, (Jogador Local).toggle_guide)), Nulo, String Personalizada("{0} + {1} | {2}", String de Mapeamento de Entrada(Botão(Agachar)), String de Mapeamento de Entrada(Botão(Disparo Primário)), String Personalizada("{0}\\n{1} + {2}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒNext LevelNext LevelNext Level"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), String de Mapeamento de Entrada(Botão(Agachar)), String Personalizada("{0} | {1}\\n{2}", String de Mapeamento de Entrada(Botão(Disparo Secundário)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒPrevious LevelPrevious LevelPrevious Level"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), String Personalizada("{0} | {1}", String de Mapeamento de Entrada(Botão(Interagir)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒRestart PracticeRestart PracticeRestart Practice"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))))))), Nulo, Direita, -152, Nulo, Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 6)), Nulo, Visível para String e Cor, Visibilidade-padrão);
            Ignorar(True);
        Else;
            //spectateHud:
            Criar Texto de HUD((Jogador Local).toggle_guide, Nulo, Nulo, String Personalizada("{0} {1} | {2}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), String de Mapeamento de Entrada(Botão(Interagir)), String Personalizada("{0}{1}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒSpectateSpectateSpectate"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), If-Then-Else((Jogador Local).toggle_spectate, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ | On | On | On"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Matriz Vazia))), Direita, -155, Nulo, Nulo, If-Then-Else((Jogador Local).toggle_spectate, Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 6)), Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 5))), Visível para String e Cor, Visibilidade-padrão);
    }
}

regra ("Huds | Leaderboard") {
    evento {
        Em andamento - Global;
    }
    condições {
        Global.LeaderBoardRemake != False;
        Global.LeaderBoardFull != Matriz Vazia;
    }
    ações {
        "account for delay in completion"
        Esperar(False, Ignorar Condição);
        While(Contagem de(Global.LeaderBoardHuds));
            Destruir Texto de HUD(Primeiro de(Global.LeaderBoardHuds));
            Modificar Variável Global(LeaderBoardHuds, Remover da Matriz por Índice, False);
        Término;
        "top 5"
        Definir Variável Global(LeaderBoardFull, Matriz Ordenada(Global.LeaderBoardFull, Valor na Matriz(Elemento da Matriz Atual, True)));
        Definir Variável Global(LeaderBoardRemake, Matriz Vazia);
        Definir Variável Global(LeaderBoardHuds, Matriz Mapeada(Global.LeaderBoardFull, String Personalizada("　 {0}:　{1} - {2}", Somar(Índice da Matriz Atual, True), Primeiro de(Elemento da Matriz Atual), Último de(Elemento da Matriz Atual))));
        While(Contagem de(Global.LeaderBoardHuds));
            Definir Variável Global(LeaderBoardRemake, String Personalizada("{0}\\n{1}", Global.LeaderBoardRemake, Primeiro de(Global.LeaderBoardHuds)));
            Modificar Variável Global(LeaderBoardHuds, Remover da Matriz por Índice, False);
        Término;
        Definir Variável Global(LeaderBoardRemake, String Personalizada("{0}\\n", Global.LeaderBoardRemake));
        "if LeaderBoardFull[0]:"
        Criar Texto de HUD((Jogador Local).toggle_guide, Nulo, String Personalizada(" \\n{0} {1} {0}", String de Ícone(Bandeira), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒTop 5Top 5Top 5"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))), Nulo, Direita, -141, Nulo, Cor(Branco), Nulo, Visível para e String, Sempre Visível);
        Definir Variável Global(LeaderBoardHuds, ID de Texto Mais Recente);
        Criar Texto de HUD(Primeiro de(True), String de Ícone de Herói(Herói(Genji)), Primeiro de(Primeiro de(Global.LeaderBoardFull)), Último de(Primeiro de(Global.LeaderBoardFull)), Direita, -140, Cor(Vermelho), Cor(Vermelho), Cor(Vermelho), Visível para, Sempre Visível);
        Modificar Variável Global(LeaderBoardHuds, Juntar à Matriz, ID de Texto Mais Recente);
        If(Valor na Matriz(Global.LeaderBoardFull, True));
            Criar Texto de HUD(Primeiro de(True), String de Ícone de Herói(Herói(Genji)), Primeiro de(Valor na Matriz(Global.LeaderBoardFull, True)), Último de(Valor na Matriz(Global.LeaderBoardFull, True)), Direita, -139, Cor(Laranja), Cor(Laranja), Cor(Laranja), Visível para, Sempre Visível);
            Modificar Variável Global(LeaderBoardHuds, Juntar à Matriz, ID de Texto Mais Recente);
            If(Valor na Matriz(Global.LeaderBoardFull, 2));
                Criar Texto de HUD(Primeiro de(True), String de Ícone de Herói(Herói(Genji)), Primeiro de(Valor na Matriz(Global.LeaderBoardFull, 2)), Último de(Valor na Matriz(Global.LeaderBoardFull, 2)), Direita, -138, Cor(Amarelo), Cor(Amarelo), Cor(Amarelo), Visível para, Sempre Visível);
                Modificar Variável Global(LeaderBoardHuds, Juntar à Matriz, ID de Texto Mais Recente);
                If(Valor na Matriz(Global.LeaderBoardFull, 3));
                    Criar Texto de HUD(Primeiro de(True), String de Ícone de Herói(Herói(Genji)), Primeiro de(Valor na Matriz(Global.LeaderBoardFull, 3)), Último de(Valor na Matriz(Global.LeaderBoardFull, 3)), Direita, -137, Cor(Verde-limão), Cor(Verde-limão), Cor(Verde-limão), Visível para, Sempre Visível);
                    Modificar Variável Global(LeaderBoardHuds, Juntar à Matriz, ID de Texto Mais Recente);
                    If(Valor na Matriz(Global.LeaderBoardFull, 4));
                        Criar Texto de HUD(Primeiro de(True), String de Ícone de Herói(Herói(Genji)), Primeiro de(Valor na Matriz(Global.LeaderBoardFull, 4)), Último de(Valor na Matriz(Global.LeaderBoardFull, 4)), Direita, -136, Cor(Verde), Cor(Verde), Cor(Verde), Visível para, Sempre Visível);
                        Modificar Variável Global(LeaderBoardHuds, Juntar à Matriz, ID de Texto Mais Recente);
                    Término;
                Término;
            Término;
        Término;
        Criar Texto de HUD(If-Then-Else(Avaliar Uma Vez(E(Global.CompMode, Não(Global.CompTime))), True, (Jogador Local).toggle_leaderboard), String Personalizada("　　　　 {0} {1} {0} 　　　　\\n　　　　　　　　　　　　　　　　　　{2}", String de Ícone(Bandeira), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒLeaderboardLeaderboardLeaderboard"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Avaliar Uma Vez(Global.LeaderBoardRemake)), Nulo, Nulo, Topo, -165, Cor(Branco), Nulo, Nulo, Visível para e String, Visibilidade-padrão);
        Modificar Variável Global(LeaderBoardHuds, Juntar à Matriz, ID de Texto Mais Recente);
        Definir Variável Global(LeaderBoardRemake, Nulo);
        Esperar(False, Ignorar Condição);
    }
}

regra ("Huds | Each Player") {
    evento {
        Jogador Entrou na Partida;
        Todas;
        Tudo;
    }
    ações {
        Esperar(0.512, Ignorar Condição);
        Criar Texto de HUD(Jogador do Evento, Nulo, If-Then-Else((Jogador do Evento).toggle_practice, String Personalizada("{0} {1} sec", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒPractice Time:Practice Time:Practice Time:"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), (Jogador do Evento).timer_practice), Matriz Vazia), String Personalizada("{0} {1} sec                                                                                                ", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒTime:Time:Time:"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), (Jogador do Evento).timer_normal), Esquerda, -196, Nulo, Cor(Cinza), Valor na Matriz(Global.ColorConfig, 3), String, Visibilidade-padrão);
        Criar Texto de HUD(If-Then-Else((Jogador do Evento).toggle_leaderboard, Nulo, Jogador do Evento), If-Then-Else((Jogador do Evento).preview_array1, String Personalizada(" {0} ({1}/{2}", If-Then-Else((Jogador do Evento).preview_i, If-Then-Else(Comparar((Jogador do Evento).preview_i, <=, Contagem de((Jogador do Evento).cache_bouncePosition)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒOrbOrbOrb"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒPortalPortalPortal"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒCheckpointCheckpointCheckpoint"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))), Somar((Jogador do Evento).preview_i, True), String Personalizada("{0})\\n―――――――――――\\n {1}\\n", Contagem de((Jogador do Evento).preview_array1), If-Then-Else(E(Comparar((Jogador do Evento).preview_i, <=, Contagem de((Jogador do Evento).cache_bouncePosition)), (Jogador do Evento).preview_i), String Personalizada("{0} {1} {2}", If-Then-Else(Valor na Matriz(Global.TQ5, Valor na Matriz((Jogador do Evento).preview_array2, (Jogador do Evento).preview_i)), String de Ícone de Habilidade(Herói(Genji), Botão(Habilidade Suprema)), Matriz Vazia), If-Then-Else(Valor na Matriz(Global.TQ6, Valor na Matriz((Jogador do Evento).preview_array2, (Jogador do Evento).preview_i)), String de Ícone de Habilidade(Herói(Genji), Botão(Habilidade 1)), Matriz Vazia), String Personalizada("{0} {1}", If-Then-Else(Valor na Matriz(Global.BounceToggleLock, Valor na Matriz((Jogador do Evento).preview_array2, (Jogador do Evento).preview_i)), String de Ícone(Aviso), Matriz Vazia), If-Then-Else(Comparar(Valor na Matriz(Global.EditMode, Valor na Matriz((Jogador do Evento).preview_array2, (Jogador do Evento).preview_i)), >, Nulo), String de Ícone(Seta: Cima), If-Then-Else(Comparar(Valor na Matriz(Global.EditMode, Valor na Matriz((Jogador do Evento).preview_array2, (Jogador do Evento).preview_i)), <, Nulo), String de Ícone(Seta: Baixo), Matriz Vazia)))), If-Then-Else((Jogador do Evento).preview_i, If-Then-Else(Último de(Valor na Matriz((Jogador do Evento).preview_array2, (Jogador do Evento).preview_i)), String Personalizada("{0} {1}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒPortal ExitPortal ExitPortal Exit"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Valor na Matriz((Jogador do Evento).preview_array2, (Jogador do Evento).preview_i)), String Personalizada("{0} {1}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒPortal StartPortal StartPortal Start"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Valor na Matriz((Jogador do Evento).preview_array2, (Jogador do Evento).preview_i))), (Jogador do Evento).banString)))), Matriz Vazia), If-Then-Else((Jogador do Evento).preview_array1, Matriz Vazia, String Personalizada("{0}{1} {2}", If-Then-Else(E((Jogador do Evento).toggle_guide, (Jogador do Evento).banString), String Personalizada("{0}\\n", (Jogador do Evento).banString), Matriz Vazia), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒLevelLevelLevel"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), String Personalizada("{0} / {1}", (Jogador do Evento).checkpoint_current, Subtrair(Contagem de(Global.A), True)))), If-Then-Else(E((Jogador do Evento).cache_bounceMaxLocks, Não((Jogador do Evento).preview_array1)), String Personalizada("{0} {1} / {2}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ{0} Orbs{0} Orbs{0} Orbs", Valor na Matriz(Global.ColorConfig, 16)), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Contagem de((Jogador do Evento).cache_collectedLocks), (Jogador do Evento).cache_bounceMaxLocks), Matriz Vazia), Topo, -172, Valor na Matriz(Global.ColorConfig, 4), Valor na Matriz(Global.ColorConfig, 4), Valor na Matriz(Global.ColorConfig, 16), Visível para e String, Visibilidade-padrão);
        Criar Texto de HUD(Jogador do Evento, Nulo, Nulo, String Personalizada("{0}{1}{2}", If-Then-Else(Componente X de((Jogador do Evento).cache_inputs), String Personalizada("■"), String Personalizada("□")), If-Then-Else(Comparar(Componente Z de(Aceleração de(Jogador do Evento)), >, Nulo), String Personalizada("▲"), String Personalizada("△")), String Personalizada("{0}\\n{1}{2}", If-Then-Else(Componente Y de((Jogador do Evento).cache_inputs), String Personalizada("●"), String Personalizada("○")), If-Then-Else(Comparar(Componente X de(Aceleração de(Jogador do Evento)), >, Nulo), String Personalizada("◀"), String Personalizada("◁")), String Personalizada("{0}{1}                                                                                                ", If-Then-Else(Comparar(Componente Z de(Aceleração de(Jogador do Evento)), <, Nulo), String Personalizada("▼"), String Personalizada("∇")), If-Then-Else(Comparar(Componente X de(Aceleração de(Jogador do Evento)), <, Nulo), String Personalizada("▶"), String Personalizada("▷"))))), Esquerda, -192, Nulo, Nulo, Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 3)), String, Visibilidade-padrão);
        "climb/bhop indicators"
        Criar Texto de HUD(Jogador do Evento, String Personalizada("{0}{1}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒClimbClimbClimb"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), If-Then-Else((Jogador do Evento).skill_countMulti, String Personalizada(" ({0})", (Jogador do Evento).skill_countMulti), Matriz Vazia)), Nulo, String Personalizada("                                                                                                                                "), Esquerda, -193, If-Then-Else((Jogador do Evento).skill_usedClimb, Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 8)), Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 7))), Nulo, Nulo, String e Cor, Visibilidade-padrão);
        Criar Texto de HUD(Jogador do Evento, String Personalizada("{0}{1}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒBhopBhopBhop"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), If-Then-Else((Jogador do Evento).skill_countCreates, String Personalizada(" ({0})", (Jogador do Evento).skill_countCreates), Matriz Vazia)), Nulo, String Personalizada("                                                                                                                                "), Esquerda, -194, If-Then-Else((Jogador do Evento).skill_usedBhop, Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 8)), Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 7))), Nulo, Nulo, String e Cor, Visibilidade-padrão);
        Criar Texto no Mundo(If-Then-Else(E((Jogador do Evento).checkpoint_notLast, (Jogador do Evento).toggle_guide), Jogador do Evento, Nulo), If-Then-Else(E((Jogador do Evento).cache_bounceMaxLocks, Comparar(Contagem de((Jogador do Evento).cache_collectedLocks), <, (Jogador do Evento).cache_bounceMaxLocks)), String Personalizada("{0}{1}", String de Ícone(Aviso), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒCollect Orbs FirstCollect Orbs FirstCollect Orbs First"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒCome HereCome HereCome Here"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia))))), Valor na Matriz(Global.A, Somar((Jogador do Evento).checkpoint_current, True)), 1.5, Não Cortar, Visível para Posição e String, Valor na Matriz(Global.ColorConfig, 13), Visibilidade-padrão);
        Esperar(2.5, Ignorar Condição);
        If(Global.CompMode);
            Criar Texto de HUD(Jogador do Evento, Nulo, If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), If-Then-Else(Global.CompTime, String Personalizada("剩余时间: {0} 分钟{1}", Global.CompTime, If-Then-Else(Comparar((Jogador do Evento).comp_countAttempts, <, Nulo), String Personalizada("\\n你没有尝试过"), If-Then-Else(Global.CompAtmpNum, String Personalizada("\\n尝试 {0} / {1}", (Jogador do Evento).comp_countAttempts, Global.CompAtmpNum), Matriz Vazia))), String Personalizada("! 比赛结束 !")), If-Then-Else(Global.CompTime, String Personalizada("Time Left: {0} Min{1}", Global.CompTime, If-Then-Else(Comparar((Jogador do Evento).comp_countAttempts, <, Nulo), String Personalizada("\\nYou Are Out Of Attempts"), If-Then-Else(Global.CompAtmpNum, String Personalizada("\\nAttempt {0} / {1}", (Jogador do Evento).comp_countAttempts, Global.CompAtmpNum), Matriz Vazia))), String Personalizada("! Competition Is Over !"))), If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), If-Then-Else(Global.CompTime, String Personalizada("竞赛模式"), String Personalizada("竞赛模式\\n\\n\\n")), If-Then-Else(Global.CompTime, String Personalizada("Tournament Mode"), String Personalizada("Tournament Mode\\n\\n\\n"))), Topo, -182, Nulo, Cor(Amarelo), Cor(Amarelo), String, Visibilidade-padrão);
    }
}

regra ("Huds | SUB Update Title") {
    evento {
        Sub-rotina;
        UpdateTitle;
    }
    ações {
        "or eventPlayer.toggle_practice:"
        Anular se(Ou(Ou(Global.CompMode, Global.EditorOn), Não(E(Contagem de(Global.TitleData), Matriz Contém(Primeiro de(Global.TitleData), (Jogador do Evento).checkpoint_current)))));
        Destruir Texto no Mundo((Jogador do Evento).cache_titleHud);
        Criar Texto no Mundo(Primeiro de(Não((Jogador do Evento).toggle_invisible)), Valor na Matriz(Valor na Matriz(Global.TitleData, True), Índice do Valor da Matriz(Primeiro de(Global.TitleData), (Jogador do Evento).checkpoint_current)), Jogador do Evento, 1.1, Cortar nas Superfícies, Visível para e Posição, Valor na Matriz(Último de(Global.TitleData), Índice do Valor da Matriz(Primeiro de(Global.TitleData), (Jogador do Evento).checkpoint_current)), Visibilidade-padrão);
        Definir Variável de Jogador(Jogador do Evento, cache_titleHud, ID de Texto Mais Recente);
    }
}

regra ("Huds | Addons") {
    evento {
        Em andamento - Global;
    }
    ações {
        Esperar(0.8, Ignorar Condição);
        Esperar até(Entidade Existe(Todos os Jogadores(Todas as Equipes)), 999999999999);
        Esperar(False, Ignorar Condição);
        If(Comparar((Todos os Jogadores(Todas as Equipes)).addon_toggle3rdPov, <=, True));
            Criar Texto de HUD((Jogador Local).toggle_guide, Nulo, Nulo, String Personalizada("{0} {1} + {2}", Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒHoldHoldHold"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), String de Mapeamento de Entrada(Botão(Agachar)), String Personalizada("{0} | {1}{2}", String de Mapeamento de Entrada(Botão(Pular)), Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ3rd Person3rd Person3rd Person"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), If-Then-Else((Jogador Local).addon_toggle3rdPov, Valor na Matriz(Divisão de String(String Personalizada("ＴＬＥｒｒ | On | On | On"), Global.__overpyTranslationHelper__), Valor Absoluto(Índice do Valor da Matriz(Global.__overpyTranslationHelper__, Divisão de String(Cor(Branco), Matriz Vazia)))), Matriz Vazia))), Direita, -159, Nulo, Nulo, If-Then-Else((Jogador Local).addon_toggle3rdPov, Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 6)), Avaliar Uma Vez(Valor na Matriz(Global.ColorConfig, 5))), Visível para String e Cor, Visibilidade-padrão);
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Effects ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("Effects | Setup Effects") {
    evento {
        Em andamento - Global;
    }
    ações {
        "add back to below wait if removed"
        Esperar(1.264, Ignorar Condição);
        "pre set control map portals. not in portal rule because shared I variable"
        If(Contagem de(Global.PortalDest));
            For variável global(NANBA, 0, Contagem de(Global.PortalLoc), True);
                Criar Efeito(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), Ou((Elemento da Matriz Atual).toggle_invincible, Não((Elemento da Matriz Atual).checkpoint_notLast))), Aura Ruim, If-Then-Else(Modular(Global.NANBA, 2), Cor(Azul-piscina), Cor(Laranja)), Valor na Matriz(Global.PortalLoc, Global.NANBA), 0.6, Visível para);
                Criar Texto no Mundo(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), Ou((Elemento da Matriz Atual).toggle_invincible, Não((Elemento da Matriz Atual).checkpoint_notLast))), Valor na Matriz(Global.PortalNames, Global.NANBA), Somar(Valor na Matriz(Global.PortalLoc, Global.NANBA), Cima), True, Cortar nas Superfícies, Visível para, Cor(Branco), Visibilidade-padrão);
            Término;
            Esperar(False, Ignorar Condição);
        Término;
        If(Global.EditorOn);
            Chamar sub-rotina(RebuildKillOrbs);
            Chamar sub-rotina(RebuildBounceOrbs);
            Chamar sub-rotina(RebuildPortals);
        Else;
            If(Contagem de(Global.CustomPortalStart));
                For variável global(NANBA, 0, Contagem de(Global.CustomPortalStart), True);
                    Criar Efeito(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), Ou(Comparar((Elemento da Matriz Atual).checkpoint_current, ==, Avaliar Uma Vez(Valor na Matriz(Global.CustomPortalCP, Global.NANBA))), Avaliar Uma Vez(Comparar(Valor na Matriz(Global.CustomPortalCP, Global.NANBA), <, Nulo)))), Aura Boa, Valor na Matriz(Global.ColorConfig, 17), Valor na Matriz(Global.CustomPortalStart, Global.NANBA), 0.6, Visível para);
                    Esperar(False, Ignorar Condição);
                Término;
                Esperar(0.5, Ignorar Condição);
            Término;
            If(Contagem de(Global.H));
                For variável global(NANBA, 0, Contagem de(Global.H), True);
                    Criar Efeito(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), Comparar((Elemento da Matriz Atual).checkpoint_current, ==, Avaliar Uma Vez(Valor na Matriz(Global.killballnumber, Global.NANBA)))), Esfera, Valor na Matriz(Global.ColorConfig, 14), Valor na Matriz(Global.H, Global.NANBA), Valor Absoluto(Valor na Matriz(Global.I, Global.NANBA)), Visível para);
                    Esperar(False, Ignorar Condição);
                Término;
                Esperar(0.5, Ignorar Condição);
            Término;
            If(Contagem de(Global.TQ));
                For variável global(NANBA, 0, Contagem de(Global.TQ), True);
                    Criar Efeito(Matriz Filtrada(Juntar à Matriz(Todos os Jogadores(Todas as Equipes), Nulo), E(Comparar((Elemento da Matriz Atual).checkpoint_current, ==, Avaliar Uma Vez(Valor na Matriz(Global.pinballnumber, Global.NANBA))), Não(Matriz Contém((Elemento da Matriz Atual).cache_collectedLocks, Avaliar Uma Vez(Global.NANBA))))), Orbe, If-Then-Else(Valor na Matriz(Global.BounceToggleLock, Global.NANBA), Valor na Matriz(Global.ColorConfig, 16), Valor na Matriz(Global.ColorConfig, 15)), Valor na Matriz(Global.TQ, Global.NANBA), True, Visível para);
                    Esperar(False, Ignorar Condição);
                Término;
            Término;
            "End portal preview"
            Criar Efeito(If-Then-Else(E(E((Jogador Local).preview_i, Comparar((Jogador Local).preview_i, >, Contagem de((Jogador Local).cache_bouncePosition))), Último de(Valor na Matriz((Jogador Local).preview_array2, (Jogador Local).preview_i))), Jogador Local, Nulo), Faíscas, Cor(Roxo), Valor na Matriz((Jogador Local).preview_array1, (Jogador Local).preview_i), 0.5, Visível para Posição e Raio);
    }
}

regra ("Effects | SUB Rebuild Bounce Orbs") {
    evento {
        Sub-rotina;
        RebuildBounceOrbs;
    }
    ações {
        Destruir Efeito(Global.TQ2);
        Definir Variável Global(TQ2, Matriz Vazia);
        For variável global(NANBA, 0, Contagem de(Global.pinballnumber), True);
            Criar Efeito(Matriz Filtrada(Juntar à Matriz(Todos os Jogadores(Todas as Equipes), Nulo), E(Comparar((Elemento da Matriz Atual).checkpoint_current, ==, Valor na Matriz(Global.pinballnumber, Avaliar Uma Vez(Global.NANBA))), Não(Matriz Contém((Elemento da Matriz Atual).cache_collectedLocks, Avaliar Uma Vez(Global.NANBA))))), Orbe, If-Then-Else(Valor na Matriz(Global.BounceToggleLock, Avaliar Uma Vez(Global.NANBA)), Valor na Matriz(Global.ColorConfig, 16), Valor na Matriz(Global.ColorConfig, 15)), Valor na Matriz(Global.TQ, Avaliar Uma Vez(Global.NANBA)), True, Visível para Posição Raio e Cor);
            Modificar Variável Global(TQ2, Juntar à Matriz, Entidade Criada por Último);
            "wait()"
            If(Não(Modular(Global.NANBA, 5)));
                Esperar(False, Ignorar Condição);
            Término;
        Término;
    }
}

regra ("Effects | SUB Rebuild boundary spheres") {
    evento {
        Sub-rotina;
        RebuildKillOrbs;
    }
    ações {
        Destruir Efeito(Global.K);
        Definir Variável Global(K, Matriz Vazia);
        For variável global(NANBA, 0, Contagem de(Global.killballnumber), True);
            Criar Efeito(Matriz Filtrada(Juntar à Matriz(Todos os Jogadores(Todas as Equipes), Nulo), Comparar((Elemento da Matriz Atual).checkpoint_current, ==, Valor na Matriz(Global.killballnumber, Avaliar Uma Vez(Global.NANBA)))), Esfera, Valor na Matriz(Global.ColorConfig, 14), Valor na Matriz(Global.H, Avaliar Uma Vez(Global.NANBA)), Valor Absoluto(Valor na Matriz(Global.I, Avaliar Uma Vez(Global.NANBA))), Visível para Posição e Raio);
            Modificar Variável Global(K, Juntar à Matriz, Entidade Criada por Último);
            If(Não(Modular(Global.NANBA, 5)));
                Esperar(False, Ignorar Condição);
            Término;
        Término;
    }
}

regra ("Effects | SUB Rebuild Portals") {
    evento {
        Sub-rotina;
        RebuildPortals;
    }
    ações {
        Destruir Efeito(Global.PortalEffects);
        Definir Variável Global(PortalEffects, Matriz Vazia);
        If(Contagem de(Global.CustomPortalCP));
            For variável global(NANBA, 0, Contagem de(Global.CustomPortalCP), True);
                Criar Efeito(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), Ou(Comparar((Elemento da Matriz Atual).checkpoint_current, ==, Valor na Matriz(Global.CustomPortalCP, Avaliar Uma Vez(Global.NANBA))), Comparar(Valor na Matriz(Global.CustomPortalCP, Avaliar Uma Vez(Global.NANBA)), <, Nulo))), Aura Boa, Valor na Matriz(Global.ColorConfig, 17), Valor na Matriz(Global.CustomPortalStart, Avaliar Uma Vez(Global.NANBA)), 0.6, Visível para Posição e Raio);
                Modificar Variável Global(PortalEffects, Juntar à Matriz, Entidade Criada por Último);
                If(Não(Modular(Global.NANBA, 5)));
                    Esperar(False, Ignorar Condição);
                Término;
            Término;
        Término;
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Addon Functions ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("Addon | AFK timer") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        É Movimentando-se(Jogador do Evento) == False;
        É Vivo(Jogador do Evento) == True;
        É Comunicando Qualquer Emote(Jogador do Evento) == False;
        Global.EditorOn == False;
    }
    ações {
        Esperar(300, Anular Quando For Falso);
        If((Jogador do Evento).addon_toggle3rdPov);
            Definir Variável de Jogador(Jogador do Evento, addon_toggle3rdPov, False);
        Término;
        Definir Status(Jogador do Evento, Nulo, Dormindo, 999999999999);
        "raycast to prevent camera stuck on low wall"
        Iniciar Câmera(Jogador do Evento, Somar(Posição de(Jogador do Evento), Multiplicar(Cima, Subtrair(Distância entre(Posição de(Jogador do Evento), Posição de Acerto do Lançamento de Raio(Posição de(Jogador do Evento), Somar(Posição de(Jogador do Evento), Multiplicar(4, Cima)), Nulo, Nulo, False)), True))), Posição de(Jogador do Evento), 10);
        "cancel it after jumping or not sleep, reset cures sleep"
        Esperar(True, Ignorar Condição);
        Esperar até(Ou(É Botão Segurado(Jogador do Evento, Botão(Pular)), Não(Tem Status(Jogador do Evento, Dormindo))), 999999999999);
        Apagar Status(Jogador do Evento, Dormindo);
        Parar Câmera(Jogador do Evento);
        If(E((Jogador do Evento).checkpoint_notLast, Não((Jogador do Evento).toggle_invincible)));
            Chamar sub-rotina(CheckpointFailReset);
        Término;
        Gerar Loop se a Condição for Verdadeira;
    }
}

regra ("Addon | Pre-set control map portal - toggled via workshop") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Global.PortalOn != False;
        Contagem de(Global.PortalLoc) != Nulo;
        Ou((Jogador do Evento).toggle_invincible, Não((Jogador do Evento).checkpoint_notLast)) == True;
        É Verdadeiro para Qualquer(Global.PortalLoc, Comparar(Distância entre(Elemento da Matriz Atual, Somar(Posição de(Jogador do Evento), Multiplicar(0.2, Cima))), <, 1.3)) == True;
    }
    ações {
        Teletransportar(Jogador do Evento, Primeiro de(Matriz Ordenada(Global.PortalDest, Distância entre(Jogador do Evento, Valor na Matriz(Global.PortalLoc, Índice da Matriz Atual)))));
    }
}

regra ("Addon | Custom portals") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Contagem de((Jogador do Evento).cache_portalStart) != Nulo;
        É Verdadeiro para Qualquer((Jogador do Evento).cache_portalStart, Comparar(Distância entre(Elemento da Matriz Atual, Somar(Posição de(Jogador do Evento), Multiplicar(0.2, Cima))), <, 1.3)) == True;
    }
    ações {
        Teletransportar(Jogador do Evento, Primeiro de(Matriz Ordenada((Jogador do Evento).cache_portalEnd, Distância entre(Jogador do Evento, Valor na Matriz((Jogador do Evento).cache_portalStart, Índice da Matriz Atual)))));
        Esperar(0.4, Ignorar Condição);
    }
}

regra ("Addon | Pre-set control map portal - toggled on via workshop settings") {
    evento {
        Em andamento - Global;
    }
    condições {
        Global.PortalOn != False;
    }
    ações {
        "overwrite pasta"
        Esperar(0.752, Ignorar Condição);
        If(Comparar(Mapa Atual, ==, Mapa(Busan)));
            "\\"down > sanc\\",\\"down > meka\\",\\"sanc > down\\",\\"sanc > meka\\",\\"meka > sanc\\",\\"meka > down\\""
            Definir Variável Global(PortalNames, Divisão de String(String Personalizada("Sanctuary0MEKA base0Downtown0MEKA base0Sanctuary0Downtown"), Primeiro de(Nulo)));
            Definir Variável Global(PortalLoc, Matriz(Vetor(47.946, 7.248, -93.922), Vetor(55.921, 6.998, -94.024), Vetor(-326.382, 10.81, 117.261), Vetor(-330.96, 10.81, 117.416), Vetor(219.567, 10.215, 243.653), Vetor(225.976, 10.227, 240.799)));
            Definir Variável Global(PortalDest, Matriz(Vetor(-328.552, 10.01, 120.82), Vetor(221.152, 9.376, 238.765), Vetor(52.197, 6.301, -97.513), Vetor(221.271, 9.431, 238.978), Vetor(-328.601, 10.01, 120.823), Vetor(52.197, 6.299, -97.513)));
        Else If(Comparar(Mapa Atual, ==, Mapa(Ilios)));
            "\\"light > ruin\\",\\"light > well\\",\\"ruin > light\\",\\"ruin > well\\",\\"well > light\\",\\"well > ruin\\""
            Definir Variável Global(PortalNames, Divisão de String(String Personalizada("Ruins0Well0Lighthouse0Well0Lighthouse0Ruins"), Primeiro de(Nulo)));
            Definir Variável Global(PortalLoc, Matriz(Vetor(325.722, -22.665, -40.401), Vetor(327.43, -22.665, -36.089), Vetor(26.176, 58.367, -156.415), Vetor(30.472, 58.367, -156.307), Vetor(-199.945, 2.015, -2.918), Vetor(-194.93, 2.015, -8.054)));
            Definir Variável Global(PortalDest, Matriz(Vetor(28.375, 57.659, -161.195), Vetor(-200.464, 1.306, -8.604), Vetor(333.088, -23.389, -40.933), Vetor(-200.464, 1.306, -8.604), Vetor(333.088, -23.389, -40.933), Vetor(28.375, 57.829, -161.195)));
        Else If(Ou(Comparar(Mapa Atual, ==, Mapa(Torre Lijiang)), Comparar(Mapa Atual, ==, Mapa(Torre Lijiang Ano Novo Lunar))));
            "\\"control > garden\\",\\"control > market\\",\\"garden > control\\",\\"garden > market\\",\\"market > control\\",\\"market > garden\\""
            Definir Variável Global(PortalNames, Divisão de String(String Personalizada("Garden0Night Market0Control Center0Night Market0Control Center0Garden"), Primeiro de(Nulo)));
            Definir Variável Global(PortalLoc, Matriz(Vetor(-2.815, 271, 295.373), Vetor(2.905, 271, 295.052), Vetor(5.788, 95.056, 135.298), Vetor(-5.343, 95.05, 134.638), Vetor(-2.738, False, -61.911), Vetor(5.043, False, -61.879)));
            Definir Variável Global(PortalDest, Matriz(Vetor(0.286, 94.292, 140.396), Vetor(0.584, -0.709, -54.469), Vetor(0.245, 270.292, 301.428), Vetor(0.773, -0.708, -54.361), Vetor(0.245, 270.292, 301.428), Vetor(0.286, 94.292, 140.396)));
        Else If(Comparar(Mapa Atual, ==, Mapa(Nepal)));
            "\\"vil > shrine\\",\\"vil > sanc\\", \\"shrine > vil\\",\\"shrine > sanc\\",#\\"sanc > vil\\",\\"sanc > shrine\\""
            Definir Variável Global(PortalNames, Divisão de String(String Personalizada("Shrine0Sanctum0Village0Sanctum0Village0Shrine"), Primeiro de(Nulo)));
            Definir Variável Global(PortalLoc, Matriz(Vetor(-194.732, -92.86, -3.802), Vetor(-194.585, -92.86, 4.187), Vetor(-33.165, 14, 5.212), Vetor(-33.058, 14, -5.55), Vetor(84.75, 129.008, -3.624), Vetor(84.534, 129, 4.032)));
            Definir Variável Global(PortalDest, Matriz(Vetor(-40.19, 13.292, -0.105), Vetor(78.43, 128.292, 0.149), Vetor(-190.54, -93.569, 0.122), Vetor(78.43, 128.292, 0.149), Vetor(-190.54, -93.569, 0.122), Vetor(-40.19, 13.292, -0.105)));
        Else If(Comparar(Mapa Atual, ==, Mapa(Oasis)));
            "\\"uni > garden\\",\\"uni > city\\",\\"garden > uni\\",\\"garden > city\\",\\"city > garden\\",\\"city > uni\\""
            Definir Variável Global(PortalNames, Divisão de String(String Personalizada("Gardens0City Center0University0City Center0Gardens0University"), Primeiro de(Nulo)));
            Definir Variável Global(PortalLoc, Matriz(Vetor(-211.137, 20, -5.084), Vetor(-211.346, 20, 5.029), Vetor(143.061, 8.377, -245.04), Vetor(139.333, 8.377, -249.964), Vetor(157.297, 12.522, 255.759), Vetor(151.452, 12.522, 261.099)));
            Definir Variável Global(PortalDest, Matriz(Vetor(134.366, 7.829, -240.53), Vetor(158.27, 11.814, 262.272), Vetor(-206.269, 19.292, 0.103), Vetor(158.283, 11.814, 262.283), Vetor(134.318, 7.829, -240.667), Vetor(-206.269, 19.292, 0.103)));
        Else If(Comparar(Mapa Atual, ==, Mapa(Península Antártica)));
            Definir Variável Global(PortalNames, Divisão de String(String Personalizada("labs0icebreaker0Sublevel0icebreaker0labs0Sublevel"), Primeiro de(Nulo)));
            Definir Variável Global(PortalLoc, Matriz(Vetor(280.66, -12.15, -223.65), Vetor(273.27, 42.74, 198.15), Vetor(266.58, 42.74, 198.17), Vetor(-58.29, -154, 63.03), Vetor(-58.36, -154, 56.47), Vetor(287.08, -12.15, -223.59)));
            Definir Variável Global(PortalDest, Matriz(Vetor(270, 42.7, 190.44), Vetor(284.07, -12.75, -216.15), Vetor(-53.51, -154.5, 60.08), Vetor(284.07, -12.75, -216.15), Vetor(270, 42.7, 190.44), Vetor(-53.51, -154.5, 60.08)));
        Else If(Comparar(Mapa Atual, ==, Mapa(Samoa)));
            Definir Variável Global(PortalNames, Divisão de String(String Personalizada("beach0volcano0downtown0volcano0beach0downtown"), Primeiro de(Nulo)));
            Definir Variável Global(PortalLoc, Matriz(Vetor(231.98, 7.23, -262.84), Vetor(236.78, 7.23, -262.75), Vetor(-327.59, 3.6, -108.69), Vetor(-332.71, 3.6, -108.59), Vetor(25.4, 341, 354.38), Vetor(30, 341, 354.34)));
            Definir Variável Global(PortalDest, Matriz(Vetor(-329.86, 3.05, -103.4), Vetor(27.59, 339.76, 348.77), Vetor(234.07, 6.12, -266.88), Vetor(27.59, 339.76, 348.77), Vetor(-329.86, 3.05, -103.4), Vetor(234.07, 6.12, -266.88)));
    }
}

regra ("Addon | Little destructo - fence breaker") {
    evento {
        Em andamento - Global;
    }
    ações {
        "Made by FishoFire version 1.0\\nwait to overwrite any from copy pastas"
        Esperar(0.032, Ignorar Condição);
        "first entry will act as index, rest is the points themselves"
        Definir Variável Global(MapVectorArray, Matriz(Nulo));
        "tdm/dm = first spawn points, the maps are not big so it just covers entire map. all teams defaults to team 1 spawn\\npush: payload and cp 0 are set but rest isnt. normal payload maps have more then 1 point.\\nrest of maps have up to 3 points"
        Modificar Variável Global(MapVectorArray, Juntar à Matriz, If-Then-Else(Comparar(Modo de jogo atual, ==, Modo de jogo(Capture a Bandeira)), Matriz(Posição da Bandeira(Equipe 1), Posição da Bandeira(Equipe 2)), If-Then-Else(Matriz Contém(Matriz(Modo de jogo(Combate até a Morte em Equipe), Modo de jogo(Combate até a Morte)), Modo de jogo atual), Primeiro de(Pontos de Ressurgimento(Todas as Equipes)), If-Then-Else(E(Primeiro de(Posição da Carga), Não(Somar(Posição do Objetivo(True), Posição do Objetivo(2)))), Posição da Carga, Matriz(Posição do Objetivo(False), Posição do Objetivo(True), Posição do Objetivo(2))))));
        "explode in a grid around the selected points"
        While(Comparar(Contagem de(Global.MapVectorArray), >, 1));
            Definir Variável Global no Índice(MapVectorArray, False, Nulo);
            While(Comparar(Primeiro de(Global.MapVectorArray), <, 256));
                Criar Projétil(Projétil Orbe, Nulo, Somar(Somar(Subtrair(Valor na Matriz(Global.MapVectorArray, True), Vetor(240, False, 240)), Multiplicar(Modular(Primeiro de(Global.MapVectorArray), 16), Multiplicar(30, Esquerda))), Multiplicar(Arredondar para Inteiro(Dividir(Primeiro de(Global.MapVectorArray), 16), Baixo), Multiplicar(30, Para a Frente))), Baixo, Ao Mundo, Cura, Equipe 1, 0, 0, 30, Explosão Boa, Som de Explosão, 1, 1, 0, 0, 0, 0);
                Modificar Variável Global no Índice(MapVectorArray, False, Adicionar, True);
                "use modulo to only wait every x orbs keep the 0 change the other number"
                If(Não(Modular(Primeiro de(Global.MapVectorArray), 3)));
                    Esperar(False, Ignorar Condição);
                Término;
            Término;
            Modificar Variável Global(MapVectorArray, Remover da Matriz por Índice, True);
        Término;
        "handle exceptions (looking at you new queen street)"
        Definir Variável Global(MapVectorArray, Matriz(Vetor(8.276, 4.113, 15.261), Vetor(-8.319, 2.624, 14.245), Vetor(0.006, 4.821, 18.513)));
        While(Contagem de(Global.MapVectorArray));
            "same as other projectile before"
            Criar Projétil(Projétil Orbe, Nulo, Primeiro de(Global.MapVectorArray), Baixo, Ao Mundo, Cura, Equipe 1, 0, 0, 30, Explosão Boa, Som de Explosão, 1, 1, 0, 0, 0, 0);
            Modificar Variável Global(MapVectorArray, Remover da Matriz por Índice, False);
            Esperar(False, Ignorar Condição);
        Término;
        Definir Variável Global(MapVectorArray, Nulo);
    }
}

regra ("Addon | Cache jump & crouch inputs for spectators") {
    evento {
        Jogador Entrou na Partida;
        Todas;
        Tudo;
    }
    ações {
        Esperar(False, Ignorar Condição);
        Definir Variável de Jogador(Jogador do Evento, cache_inputs, Vetor(É Botão Segurado(Jogador do Evento, Botão(Pular)), É Botão Segurado(Jogador do Evento, Botão(Agachar)), False));
        Gerar Loop;
    }
}

regra ("Addon | SUB Basic Map Validator") {
    evento {
        Sub-rotina;
        AddonCheckMap;
    }
    ações {
        Anular se(Comparar(Contagem de(Global.A), <=, 1));
        Criar Bot(Herói(Ana), If-Then-Else(Comparar(Número de Espaços(Equipe 1), <, Número de Espaços(Equipe 2)), Equipe 1, Equipe 2), -1, Primeiro de(Global.A), Nulo);
        Definir Variável Global(MsDestructo, Entidade Criada por Último);
        Desabilitar Colisão de Movimento com Ambiente(Global.MsDestructo, False);
        Definir Status(Global.MsDestructo, Nulo, Intangível, 999999999999);
        Definir como Invisível(Global.MsDestructo, Todos);
        Começar a Escalonar Jogador(Global.MsDestructo, 3.111111111111110, False);
        Definir Gravidade(Global.MsDestructo, 999999999999);
        "Not infinity incase dummy does not spawn"
        Esperar até(Surgiu(Global.MsDestructo), 16);
        For variável de jogador(Global.MsDestructo, checkpoint_current, 1, Contagem de(Global.A), True);
            If(E(Primeiro de(Posição Transitável Mais Próxima(Valor na Matriz(Global.A, (Global.MsDestructo).checkpoint_current))), Comparar(Distância entre(Valor na Matriz(Global.A, (Global.MsDestructo).checkpoint_current), Posição Transitável Mais Próxima(Valor na Matriz(Global.A, (Global.MsDestructo).checkpoint_current))), >, 1.4)));
                Começar a Forçar Posição do Jogador(Global.MsDestructo, Posição de Acerto do Lançamento de Raio(Somar(Valor na Matriz(Global.A, (Global.MsDestructo).checkpoint_current), Multiplicar(1.4, Cima)), Somar(Valor na Matriz(Global.A, (Global.MsDestructo).checkpoint_current), Multiplicar(-1.4, Cima)), Matriz Vazia, Matriz Vazia, False), True);
                Esperar(0.112, Ignorar Condição);
                Parar de Forçar Posição do Jogador(Global.MsDestructo);
                Esperar até(É No Chão(Global.MsDestructo), True);
                Ignorar se(E(É No Chão(Global.MsDestructo), Comparar(Distância entre(Global.MsDestructo, Valor na Matriz(Global.A, (Global.MsDestructo).checkpoint_current)), <=, 1.4)), 11);
                For variável de jogador(Global.MsDestructo, checkpoint_practice, 1.4, 1.2, -0.2);
                    Começar a Forçar Posição do Jogador(Global.MsDestructo, Somar(Valor na Matriz(Global.A, (Global.MsDestructo).checkpoint_current), Multiplicar(Cima, (Global.MsDestructo).checkpoint_practice)), True);
                    Esperar(0.112, Ignorar Condição);
                    Parar de Forçar Posição do Jogador(Global.MsDestructo);
                    Esperar até(É No Chão(Global.MsDestructo), True);
                    Ignorar se(E(É No Chão(Global.MsDestructo), Comparar(Distância entre(Global.MsDestructo, Valor na Matriz(Global.A, (Global.MsDestructo).checkpoint_current)), <=, 1.4)), 5);
                Término;
                Ativar gravação do Inspetor;
                Registrar no Inspetor(String Personalizada("Fail {0}", (Global.MsDestructo).checkpoint_current));
                Desativar gravação do Inspetor;
            Término;
            //lbl_MapChecker_nextCp:
        Término;
        Definir Variável de Jogador(Global.MsDestructo, editor_saveCache, Global.EditorOn);
        Definir Variável Global(EditorOn, Nulo);
        Ativar gravação do Inspetor;
        Registrar no Inspetor(String Personalizada("■ Map Check Complete ■"));
        Desativar gravação do Inspetor;
        Definir Variável Global(EditorOn, (Global.MsDestructo).editor_saveCache);
        Destruir Bot(Equipe de(Global.MsDestructo), Espaço de(Global.MsDestructo));
        Definir Variável Global(MsDestructo, Nulo);
    }
}

regra ("Addon | SUB 3rd Person Camera") {
    evento {
        Sub-rotina;
        Addon3rdPerson;
    }
    ações {
        If((Jogador do Evento).addon_toggle3rdPov);
            Iniciar Câmera(Jogador do Evento, Atualizar a Cada Quadro(Somar(Posição de Acerto do Lançamento de Raio(Somar(Multiplicar(0.5, Cima), Posição do Olho(Jogador do Evento)), Somar(Somar(Multiplicar(0.5, Cima), Posição do Olho(Jogador do Evento)), Multiplicar(-3.5, Direção Frontal de(Jogador do Evento))), Matriz Vazia, Matriz Vazia, False), Multiplicar(0.5, Direção Frontal de(Jogador do Evento)))), Atualizar a Cada Quadro(Somar(Multiplicar(0.5, Cima), Posição do Olho(Jogador do Evento))), False);
        Else;
            Parar Câmera(Jogador do Evento);
        Término;
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Map Data & Addon Settings Are On Page 2 - 地图数据和附加组件的设置在第2页 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("Ø Map Data - 数据录入 <---- INSERT HERE / 在这输入") {
    evento {
        Em andamento - Global;
    }
}

regra ("☞ Credits and Colors here - 作者代码HUD颜色 <---- INSERT HERE / 在这输入") {
    evento {
        Em andamento - Global;
    }
    ações {
        Esperar(False, Ignorar Condição);
        "Filling this in adds it to the inspector pasta after next restart.\\nYou can fill in again to overwrite.\\n修改的内容 在重新开始 比赛后生效\\n您可以反复 修改字符串 中的内容"
        Definir Variável Global(Name, String Personalizada("name here - 作者"));
        Definir Variável Global(Code, String Personalizada("code here - 代码"));
        "+++++  +++++  +++++  +++++  +++++  +++++\\ncolor customization below / 自定义 颜色(实体、HUD)\\n+++++  +++++  +++++  +++++  +++++  +++++\\n\\ncredit hud name   -   作者HUD"
        Definir Variável Global no Índice(ColorConfig, False, Cor(Violeta));
        "credit hud code   -   代码HUD"
        Definir Variável Global no Índice(ColorConfig, True, Cor(Azul-celeste));
        "dsc.gg/genjiparkour"
        Definir Variável Global no Índice(ColorConfig, 18, Cor(Azul-piscina));
        "server time hud   -   房间倒计时"
        Definir Variável Global no Índice(ColorConfig, 2, Cor(Vermelho));
        "time  hud   -   单关用时HUD"
        Definir Variável Global no Índice(ColorConfig, 3, Cor(Branco));
        "level hud   -   关卡HUD"
        Definir Variável Global no Índice(ColorConfig, 4, Cor(Branco));
        "command hud   -   指令HUD"
        Definir Variável Global no Índice(ColorConfig, 5, Cor(Branco));
        "command hud highlight   -   指令HUD高亮"
        Definir Variável Global no Índice(ColorConfig, 6, Cor(Verde));
        "bhop/climb available   -   小跳/爬墙未用HUD"
        Definir Variável Global no Índice(ColorConfig, 7, Cor(Verde));
        "bhop/climb used (cant be same as available)   -   小跳/爬墙已用HUD"
        Definir Variável Global no Índice(ColorConfig, 8, Cor(Vermelho));
        "current checkpoint ring   -   当前检查点光圈"
        Definir Variável Global no Índice(ColorConfig, 9, Cor(Azul-celeste));
        "next checkpoint ring   -   下一关检查点光圈"
        Definir Variável Global no Índice(ColorConfig, 10, Cor(Verde-limão));
        "next checkpoint light shaft   -   下一关检查点光柱"
        Definir Variável Global no Índice(ColorConfig, 11, Cor(Branco));
        "next checkpoint icon   -   下一关检查点图标"
        Definir Variável Global no Índice(ColorConfig, 12, Cor(Azul-celeste));
        "\\"come here\\" text   -   到这里来\\" 文本"
        Definir Variável Global no Índice(ColorConfig, 13, Cor(Branco));
        "kill orbs   -   击杀球"
        Definir Variável Global no Índice(ColorConfig, 14, Cor(Azul));
        "normal orbs   -   弹球"
        Definir Variável Global no Índice(ColorConfig, 15, Cor(Verde));
        "lock orbs (overwritten if its same as normal)\\n收集球 (与普通弹 球相同时将 自动覆写)"
        Definir Variável Global no Índice(ColorConfig, 16, Cor(Laranja));
        "portals   -   自定义 传送门"
        Definir Variável Global no Índice(ColorConfig, 17, Cor(Branco));
    }
}

regra ("Instructions for Depricated Rules (ban / portal / dash /ult) - 旧版编辑器中已弃用规则指引 (单关封禁 / 传送门 / 给刀给S)") {
    evento {
        Em andamento - Global;
    }
    ações {
        "The following rules should now be handled with the ingame editor\\n- Ban per checkpoint\\n- Dash/Ult per checkpoint\\n- Custom portals"
        Anular;
        "When updating old maps, these things should be added to your map data.\\nThis is done with the instructions below"
        Anular;
        "step 1) Open the old rule\\nstep 2) Select the variables and press copy\\n(do not select waits or workshop toggles, only select variables)\\nstep 3) Go to map data rule and paste this the variables"
        Anular;
        "以下规则现在 要用游戏内置 编辑器编辑\\n- 单关 封禁(卡小、蹭留等)\\n- 检查点给 刀给S\\n- 自定义 传送门"
        Anular;
        "当更新旧 图数据 时，以上 这些东西 应该放 到地图 数据里\\n以下是一 些更新旧 图数据 指引:"
        Anular;
        "步骤 1) 找到旧图 数据的 规则\\n步骤 2) 选中旧图 数据的 全局变 量并复制\\n(不要复制含 等待 地图工坊设置 的指令, 只要 全局变量 的数据)\\n步骤 3) 将全局变 量数据粘 贴到新版 编辑器的 地图数 据规则"
        Anular;
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Addons Settings & Data - 附加组件 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

regra ("Addon | Comp Mode instruction message - 竞赛模式指引消息 <---- INSERT HERE / 在这输入") {
    evento {
        Em andamento - Global;
    }
    ações {
        Esperar(0.4, Ignorar Condição);
        "Instructions that show when you start comp mode.\\nDue to the hud text limit, you there is 4 huds available.\\nIf you dont need a field just empty the textfield."
        Anular;
        "竞赛模式 指引消息\\n指引消息将 会在竞赛模 式开始时 显示\\n由于 hud 文本限制，你有 4 个hud可用\\n如果你不需 要一个字段 只是空文 本字段"
        Definir Variável Global(instructiontext, Divisão de String(String Personalizada("Change in Comp Mode instruction message hud 10Change in Comp Mode instruction message hud 20Change in Comp Mode instruction m{0}", String Personalizada("essage hud 30Change in Comp Mode instruction message hud 4")), Primeiro de(Nulo)));
    }
}

desabilitado regra ("Addon | Custom difficulty hud  - 自定义难度hud <---- INSERT HERE / 在这输入") {
    evento {
        Em andamento - Global;
    }
    ações {
        "1) workshop settings > difficulty > set to \\"dont display\\"\\n2) enable this rule\\n3) type your difficulty in the hud below"
        Esperar(2.5, Ignorar Condição);
        "1) 地图工坊设 置难度改为 “不显示”\\n2) 勾选此规则 点击上方的 开启/关闭 开启此规则\\n3) 修改下面的 创建hud文本 中的“enter custom difficulty here”"
        Criar Texto de HUD(Primeiro de(True), If-Then-Else(Último de(Global.Difficultyhud), If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("游戏测试"), String Personalizada("Playtest")), Matriz Vazia), String Personalizada("enter custom difficulty here"), Nulo, Topo, -173, Cor(Azul), Cor(Verde), Nulo, Visível para e String, Visibilidade-padrão);
    }
}

desabilitado regra ("Addon | Title Data - 标题数据 <---- EDIT ME / 在此处编辑") {
    evento {
        Em andamento - Global;
    }
    ações {
        "enable this rule and fill in the title data below.\\n启用此规则 并填写下面 的标题数据"
        Esperar(0.768, Ignorar Condição);
        "checkpoint number\\n每关数量"
        Definir Variável Global no Índice(TitleData, False, Matriz(Nulo, 10, 20, 30, 40, 50));
        "title\\n标题文本"
        Definir Variável Global no Índice(TitleData, True, Divisão de String(String Personalizada("Bunny0Jumper0Ninja0Pro0Expert0Master"), Primeiro de(Nulo)));
        "color\\n颜色"
        Definir Variável Global no Índice(TitleData, 2, Matriz(Cor(Verde-limão), Cor(Branco), Cor(Amarelo), Cor(Laranja), Cor(Roxo), Cor(Vermelho)));
    }
}

desabilitado regra ("Addon | Friend Title - 朋友称号 <---- DISPLAY MESSAGE HERE (ON PLAYER)") {
    evento {
        Jogador Entrou na Partida;
        Todas;
        Tudo;
    }
    ações {
        "\\"your nickname\\" your friends ingame name\\n\\"display title\\" fill in the custom title\\n修改字符串 \\"your nickname <-------\\" 为好友名字 区分大小写\\n修改字符串 \\"display title\\" 为好友头顶 显示的称号"
        Esperar até(Surgiu(Jogador do Evento), 999999999999);
        If(Comparar(String Personalizada("your nickname <-------"), ==, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia)));
            Mensagem Grande(Primeiro de(True), String Personalizada("Message to the whole room"));
            Criar Texto no Mundo(Primeiro de(Não((Jogador do Evento).toggle_invisible)), String Personalizada("display title"), Jogador do Evento, 1.5, Cortar nas Superfícies, Visível para Posição e String, Cor(Laranja), Visibilidade-padrão);
        Término;
        If(Comparar(String Personalizada("your nickname <-------"), ==, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia)));
            Mensagem Grande(Primeiro de(True), String Personalizada("Message to the whole room"));
            Criar Texto no Mundo(Primeiro de(Não((Jogador do Evento).toggle_invisible)), String Personalizada("display title"), Jogador do Evento, 1.5, Cortar nas Superfícies, Visível para Posição e String, Cor(Laranja), Visibilidade-padrão);
        Término;
        If(Comparar(String Personalizada("your nickname <-------"), ==, Divisão de String(Primeiro de(Jogador do Evento), Matriz Vazia)));
            Mensagem Grande(Primeiro de(True), String Personalizada("Message to the whole room"));
            Criar Texto no Mundo(Primeiro de(Não((Jogador do Evento).toggle_invisible)), String Personalizada("display title"), Jogador do Evento, 1.5, Cortar nas Superfícies, Visível para Posição e String, Cor(Laranja), Visibilidade-padrão);
    }
}

desabilitado regra ("Addon | Display Author Time - 展示世界纪录 <---- EDIT ME / 在此处编辑") {
    evento {
        Em andamento - Global;
    }
    ações {
        "type your entry in the textfield that says \\"name and time here\\"\\n在文本框 中输入“名称和时间”"
        Criar Texto de HUD(Primeiro de(True), Nulo, String Personalizada(" \\n{0} author time {0}", String de Ícone(Fogo)), String Personalizada("name and time here"), Direita, -142, Nulo, Cor(Rosa), Cor(Rosa), Visível para, Visibilidade-padrão);
    }
}

desabilitado regra ("Addon | HUD text for certain Checkpoints - 特定关卡显示的HUD文本 <---- EDIT ME / 在此处编辑") {
    evento {
        Em andamento - Global;
    }
    ações {
        "the example fill shows a text for cp 1 and cp 3\\n示例已填写 关卡1和3 的hud文本"
        Esperar(0.768, Ignorar Condição);
        "in CpHudText fill in text\\n修改字符串 “CpHudText” 为顶部显示 的hud文本"
        Definir Variável Global(CpHudText, Divisão de String(String Personalizada("text cp 10text cp 3"), Primeiro de(Nulo)));
        "in CpHudCp fill in the at wich to display\\n修改数组 “CpHudCp” 为hud文本 显示的关卡"
        Definir Variável Global(CpHudCp, Matriz(1, 3));
    }
}

desabilitado regra ("Addon | Inworld text for certain Checkpoints - 特定关卡显示的地图文本 <---- EDIT ME / 在此处编辑") {
    evento {
        Em andamento - Global;
    }
    ações {
        "the example fill shows a text for cp 1 and cp 3\\n示例已填写 关卡1和3 的地图文本"
        Esperar(0.768, Ignorar Condição);
        "in CpIwtText fill in text\\n修改字符串 “CpIwtText” 为关卡显示 的地图文本"
        Definir Variável Global(CpIwtText, Divisão de String(String Personalizada("text cp 10text cp 3"), Primeiro de(Nulo)));
        "in CpIwtCp fill in cp at wich to display\\n修改数组 “CpIwtCp” 为显示地图 文本的关卡"
        Definir Variável Global(CpIwtCp, Matriz(1, 3));
        "in CpIwtPos fill in the vector\\n修改数组 “CpIwtPos” 为地图文本 的矢量位置"
        Definir Variável Global(CpIwtPos, Matriz(Vetor(True, True, True), Vetor(True, True, True)));
        "color applies to all\\n选择应用到 所有地图文 本的颜色"
        Definir Variável Global(CpIwtColor, Cor(Verde-limão));
    }
}

desabilitado regra ("Addon | Hint text for certain Checkpoints - 特定关卡的提示文本 <---- EDIT ME / 在此处编辑") {
    evento {
        Em andamento - Global;
    }
    ações {
        "the example fill shows a text for cp 1 and cp 3\\n示例已填写 关卡1和3 的提示文本"
        Esperar(0.768, Ignorar Condição);
        "in HintText fill in text\\n修改字符串 “HintText” 为关卡显示 的提示文本"
        Definir Variável Global(HintText, Divisão de String(String Personalizada("text cp 10text cp 3"), Primeiro de(Nulo)));
        "in HintCp fill in the at wich to display\\n修改数组 “HintCp” 为提示文本 显示的关卡"
        Definir Variável Global(HintCp, Matriz(1, 3));
    }
}

desabilitado regra ("Addon | 3rd Person Camera Mode - 第三人称") {
    evento {
        Jogador Entrou na Partida;
        Todas;
        Tudo;
    }
    ações {
        "Default 1st person: False\\nDefault 3rd person: True"
        Definir Variável de Jogador(Jogador do Evento, addon_toggle3rdPov, True);
        Chamar sub-rotina(Addon3rdPerson);
    }
}

regra ("▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ Addons Skills - 附加组件技能 ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒") {
    evento {
        Em andamento - Global;
    }
}

desabilitado regra ("Addon | Stall Enhancer - 增强系統跳的判定") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        Surgiu(Jogador do Evento) == True;
        Velocidade Vertical de(Jogador do Evento) >= -0.2;
        Velocidade Vertical de(Jogador do Evento) <= 0.05;
        Velocidade Horizontal de(Jogador do Evento) <= 1.3;
        É no Ar(Jogador do Evento) == True;
        Global.EditorOn != False;
        (Jogador do Evento).editor_fly == False;
    }
    ações {
        Esperar(0.25, Anular Quando For Falso);
        Começar a Forçar Posição do Jogador(Jogador do Evento, Posição de(Jogador do Evento), False);
        Esperar até(Não(É Movimentando-se(Jogador do Evento)), 1);
        Parar de Forçar Posição do Jogador(Jogador do Evento);
        Definir Velocidade de Movimento(Jogador do Evento, False);
        Definir Gravidade(Jogador do Evento, False);
        "double jump catch"
        Esperar até(Ou(Ou(Ou(Ou(É Botão Segurado(Jogador do Evento, Botão(Recarregar)), (Jogador do Evento).editor_fly), É Morto(Jogador do Evento)), É Usando Habilidade 1(Jogador do Evento)), Comparar(Velocidade de(Jogador do Evento), >, 3)), 3);
        "wait(3)"
        Definir Gravidade(Jogador do Evento, 100);
        Definir Velocidade de Movimento(Jogador do Evento, 100);
        If(E(É Vivo(Jogador do Evento), Não(Ou((Jogador do Evento).editor_fly, É Botão Segurado(Jogador do Evento, Botão(Recarregar))))));
            Aplicar Impulso(Jogador do Evento, Cima, 10, Ao Mundo, Cancelar Deslocamento Contrário XYZ);
            Gerar Loop se a Condição for Verdadeira;
    }
}

desabilitado regra ("Addon | Fake Ledge Dash - 超级跳") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        "Version 2"
        É Usando Habilidade 1(Jogador do Evento) == True;
        Velocidade de(Jogador do Evento) < 45;
        Componente Z de(Aceleração de(Jogador do Evento)) > Nulo;
        Valor Absoluto(Subtrair(Velocidade Vertical de(Jogador do Evento), 7)) < 0.8;
    }
    ações {
        "Dash into a wall/edge\\nRelease wall/edge before dash ends"
        Definir Variável de Jogador(Jogador do Evento, addon_ledgeDash, Direção Frontal de(Jogador do Evento));
        "25 * 0.016"
        Esperar até(Não(É Usando Habilidade 1(Jogador do Evento)), True);
        If(É no Ar(Jogador do Evento));
            Aplicar Impulso(Jogador do Evento, (Jogador do Evento).addon_ledgeDash, 50, Ao Mundo, Cancelar Deslocamento Contrário XYZ);
    }
}

desabilitado regra ("Addon | Group up - Map Data") {
    evento {
        Em andamento - Global;
    }
    ações {
        "replace 777 with checkpoint number\\nreplace vector 0,0,0 with orb position"
        Criar Texto no Mundo(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), Comparar((Elemento da Matriz Atual).checkpoint_current, ==, 777)), String Personalizada("{0} {1} {0}", String de Ícone de Habilidade(Herói(Genji), Botão(Habilidade Suprema)), If-Then-Else(Comparar(String("Uff"), ==, String Personalizada("噢")), String Personalizada("待在这里"), String Personalizada("group up"))), Vetor(True, True, True), 1.5, Não Cortar, Visível para e String, Cor(Laranja), Visibilidade-padrão);
        "replace 777 with checkpoint number\\nreplace vector 0,0,0 with orb position\\n3.5 is the radius"
        Criar Efeito(Matriz Filtrada(Todos os Jogadores(Todas as Equipes), Comparar((Elemento da Matriz Atual).checkpoint_current, ==, 777)), Esfera, Cor(Laranja), Vetor(True, True, True), 3.5, Visível para);
    }
}

desabilitado regra ("Addon | Group Up") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        "replace 777 with checkpoint number"
        (Jogador do Evento).checkpoint_current == 777;
        É Vivo(Jogador do Evento) == True;
        É No Chão(Jogador do Evento) == False;
        (Jogador do Evento).toggle_invincible == False;
        "replace vector 0,0,0 with orb position\\n3.5 is the radius"
        Distância entre(Jogador do Evento, Vetor(True, True, True)) < 3.5;
    }
    ações {
        Mensagem Pequena(Jogador do Evento, String Personalizada("   stay in the bubble"));
        Esperar(True, Anular Quando For Falso);
        Mensagem Pequena(Jogador do Evento, String Personalizada("   9"));
        Esperar(True, Anular Quando For Falso);
        Mensagem Pequena(Jogador do Evento, String Personalizada("   8"));
        Esperar(True, Anular Quando For Falso);
        Mensagem Pequena(Jogador do Evento, String Personalizada("   7"));
        Esperar(True, Anular Quando For Falso);
        Mensagem Pequena(Jogador do Evento, String Personalizada("   6"));
        Esperar(True, Anular Quando For Falso);
        Mensagem Pequena(Jogador do Evento, String Personalizada("   5"));
        Esperar(True, Anular Quando For Falso);
        Mensagem Pequena(Jogador do Evento, String Personalizada("   4"));
        Esperar(True, Anular Quando For Falso);
        Mensagem Pequena(Jogador do Evento, String Personalizada("   3"));
        Esperar(True, Anular Quando For Falso);
        Mensagem Pequena(Jogador do Evento, String Personalizada("   2"));
        Esperar(True, Anular Quando For Falso);
        Mensagem Pequena(Jogador do Evento, String Personalizada("   1"));
        Esperar(True, Anular Quando For Falso);
        Começar a Forçar Posição do Jogador(Jogador do Evento, Somar(Valor na Matriz(Global.A, Somar((Jogador do Evento).checkpoint_current, True)), Multiplicar(0.1, Cima)), False);
        Definir Status(Jogador do Evento, Nulo, Enraizado, 0.3);
        Esperar(0.112, Ignorar Condição);
        Parar de Forçar Posição do Jogador(Jogador do Evento);
    }
}

desabilitado regra ("Addon | Custom checkpoint loading or resetting") {
    evento {
        Sub-rotina;
        AddonCustomLoadAndReset;
    }
    ações {
        "This subroutine activates on failing, arriving, resetting, skipping etc\\nexample: reset gravity and movespeed after being changed by custom orbs"
        Definir Gravidade(Jogador do Evento, 100);
        Definir Velocidade de Movimento(Jogador do Evento, 100);
    }
}

desabilitado regra ("Addon | Custom Orb Script") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Tudo;
    }
    condições {
        "Do not edit this condition !!!!!!!!!!!!!!!!!"
        (Jogador do Evento).cache_bounceTouched >= Nulo;
    }
    ações {
        "Note that the ID can change if you place or delete orbs infront of that orb.\\nAdd the desired ID numbers for the orb in the array\\nadd the script after it\\nyou can use the activateed sub above this rule to reset the effects"
        If(Matriz Contém(Matriz(1, 2), (Jogador do Evento).cache_bounceTouched));
            "example gravity (should be reset to 100 in AddonCustomLoadAndReset)"
            Definir Gravidade(Jogador do Evento, 25);
            Mensagem Pequena(Jogador do Evento, String Personalizada(" You Feel Light"));
            Esperar(2, Ignorar Condição);
            Definir Gravidade(Jogador do Evento, 100);
        Término;
        If(Matriz Contém(Matriz(3, 4), (Jogador do Evento).cache_bounceTouched));
            "example canceling primary makes double jump recover"
            Cancelar Ação Primária(Jogador do Evento);
            Definir Variável de Jogador(Jogador do Evento, skill_usedDouble, Nulo);
            Mensagem Pequena(Jogador do Evento, String Personalizada(" Double Jump Recovered"));
        Término;
        If(Matriz Contém(Matriz(5, 6), (Jogador do Evento).cache_bounceTouched));
            "example move speed"
            Definir Velocidade de Movimento(Jogador do Evento, 250);
            Mensagem Pequena(Jogador do Evento, String Personalizada(" Zooom"));
            Esperar(2, Ignorar Condição);
            Definir Velocidade de Movimento(Jogador do Evento, 100);
    }
}

desabilitado regra ("Addon | Fake Triple Jump - 假三段跳") {
    evento {
        Em andamento - Cada Jogador;
        Todas;
        Genji;
    }
    condições {
        "@Condition BanTriple == false"
        É No Chão(Jogador do Evento) == False;
        "Double cannot be used already"
        (Jogador do Evento).skill_usedDouble == False;
        "Don't activate on reset"
        É Botão Segurado(Jogador do Evento, Botão(Recarregar)) == False;
    }
    ações {
        "Enable checking double jump"
        Definir Variável de Jogador(Jogador do Evento, addon_enableDoubleChecks, True);
        Esperar(False, Ignorar Condição);
        Gerar Loop se a Condição for Verdadeira;
        Anular se(Ou((Jogador do Evento).skill_usedDouble, É Botão Segurado(Jogador do Evento, Botão(Recarregar))));
        "Input window to Triple"
        Esperar até(E(Está Pulando(Jogador do Evento), É Botão Segurado(Jogador do Evento, Botão(Pular))), 0.048);
        If(E(É Botão Segurado(Jogador do Evento, Botão(Pular)), Está Pulando(Jogador do Evento)));
            Aplicar Impulso(Jogador do Evento, Cima, 9, Ao Mundo, Cancelar Deslocamento Contrário XYZ);
        Else;
            Gerar Loop se a Condição for Verdadeira;
    }
}


`;
