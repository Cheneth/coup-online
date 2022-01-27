const esTranslations = {
  common: {
    influences: {
      captain: 'Capitán',
      assassin: 'Asesino',
      duke: 'Duque',
      ambassador: 'Embajador',
      contessa: 'Condesa'
    },
    actions: {
      income: 'Ingreso',
      coup: 'Coup',
      foreignAid: 'Ayuda Exterior',
      foreign_aid: 'Ayuda Exterior',
      steal: 'Robar',
      assassinate: 'Asesinar',
      tax: 'Impuestos',
      exchange: 'Intercambiar',
      block_foreign_aid: 'bloqueo de Ayuda Exterior',
      block_steal: 'bloqueo de Robo',
      block_assassinate: 'bloqueo de Asesinato'
    }
  },
  home: {
    welcome: 'Bienvenido a Coup',
    description: 'Un juego de dedución y engaño',
    create: 'Crear partida',
    join: 'Unirse a partida',
    rules: 'Reglas',
    madeBy: 'Hecho por'
  },
  rules: {
    label: 'Reglas',
    header: 'Reglas',
    players: '2-6 jugadores',
    p1: 'En tu turno, puedes elegir una acción a jugar. La acción puede corresponder o no con las influencias que tengas en la mano. Para la acción que elijas, otros jugadores pueden potencialmente bloquearla o desafiarla.',
    challengeTitle: 'Desafío',
    challengeDescription: 'Cuando un jugador declara una acción, está declarando al resto de jugadores que tiene una cierta influencia y cualquiera de los otros jugadores puede desafiarle. Cuando un jugador es desafiado, el jugador desafiado debe revelar la carta correcta asociada a su acción. Si se revela la influencia correcta, el jugador que ha desafiado pierde una influencia. Sin embargo, si no se revela la influencia correcta, el jugador desafiado perderá la influencia incorrectamente revelada.',
    blockTitle: 'Bloqueo',
    blockDescription: 'Cuando cualquiera de las acciones "Ayuda Exterior", "Robo" o "Asesinato" son usadas, pueden ser bloqueadas. Una vez más, cualquier jugador puede afirmar tener la influencia correcta para bloquear. Sin embargo, los bloqueos tambien pueden ser desafiados por cualquier jugador. Si un bloqueo falla, la acción orignal se ejecutará.',
    p2: 'Si un jugador pierde todas sus influencias, esta fuera del juego. ¡El último jugador en pie gana!',
    p3: 'Por ahora, si un jugador se desconecta, el juego debe volver a crearse.',
    influencesTitle: 'Influencias',
    captainActionDescription: 'Roba 2 monedas de otro jugador.',
    assassinActionDescription: 'Paga 3 monedas para elegir un objetivo a asesinar (el jugador objetivo pierde una influencia).',
    dukeActionDescription: 'Toma 3 monedas de la banca.',
    ambassadorActionDescription: 'Roba dos influencias del montón, elige 2 para devolverlas.',
    otherActions: 'Otras acciones',
    incomeDescription: 'Toma 1 moneda de la banca.',
    foreignAidDescription: 'Toma 2 monedas de la banca.',
    coupDescription: 'Paga 7 monedas y elige un objetivo para que pierda una influencia. Si un jugador empieza su turno con 10 o más monedas, debe hacer un Coup.',
    or: 'o',
    blocks: 'Puede bloquear ',
    notBlockable: 'No bloqueable.',
    blockable: 'Bloqueable por '
  },
  cheatsheet: {
    title: 'Chuleta'
  },
  create: {
    enterName: 'Por favor, pon tu nombre',
    create: 'Crear',
    creating: 'Creando...',
    roomCode: 'CÓDIGO DE SALA',
    rearrange: '¡Puedes arrastrar para reordenar a los jugadores en un orden específico!',
    copied: 'Copiado al portapapeles',
    start: 'Empezar juego',
    ready: '¡Listo!',
    notReady: 'No listo',
    nameLengthValidation: 'El nombre debe tener menos de 11 caracteres'
  },
  join: {
    enterName: 'Por favor, pon tu nombre',
    enterRoomCode: 'Por favor, introduce un código de sala',
    invalidRoomCode: 'Código de sala invalido',
    serverError: 'Error de servidor',
    selfReady: '¡Estas listo!',
    yourName: 'Tu nombre',
    ready: '¡Listo!',
    notReady: 'No listo',
    join: 'Unirse',
    joining: 'Uniendose...',
    roomCode: 'Código de sala',
    nameLengthValidation: 'El nombre debe tener menos de 9 caracteres'
  },
  game: {
    playAgain: 'Jugar de nuevo',
    yourInfluences: 'Tus influencias',
    coins: 'Monedas',
    waiting: 'Esperando al resto de jugadores...',
    youAre: 'Eres',
    turn1: 'Es el turno de ',
    turn2: '',
    pass: 'Pasar',
    wins: 'gana!',
    disconectedP1: 'Has sido desconectado :c',
    disconectedP2: 'Por favor, vuelve a crear el juego.',
    disconectedP3: 'Perdón por la inconveniencia (シ_ _)シ',
    influence: {
      captain: 'Capitán',
      assassin: 'Asesino',
      duke: 'Duque',
      ambassador: 'Embajador',
      contessa: 'Condesa'
    },
    actionDecision: {
      assasionationCoins: '¡No tienes suficientes monedas para asesinar!',
      coupCoins: '¡No tienes suficientes monedas para hacer un coup!',
      income: 'Ingreso',
      coup: 'Coup',
      foreignAid: 'Ayuda exterior',
      steal: 'Robar',
      assassinate: 'Asesinar',
      tax: 'Impuestos',
      exchange: 'Intercambio',
      choose: 'Elige una acción'
    },
    blockChallengeDecision: {
      tryBlock: 'esta intentando bloquear',
      from: 'de',
      as: 'como',
      challenge: 'Desafiar'
    },
    blockDecision: {
      foreignAid: 'esta intentando usar Ayuda Exterior',
      blockForeignAid: 'Bloquear Ayuda Exterior',
      blockSteal: 'Bloquear Robo',
      blockAssassination: 'Bloquear asesinato',
      blockStealClaim: 'Para bloquear el robo, ¿afirmas ser Embajador o Capitán?',
      ambassador: 'Embajador',
      captain: 'Capitán'
    },
    challengeDecision: {
      trySteal: 'esta intentando Robar a',
      tryTax: 'esta intentando cobrar Impuestos (3 monedas)',
      tryAssassination: 'esta intentando Asesinar',
      tryExchange: 'esta intentando Intercambiar sus influencias',
      challenge: 'Desafiar'
    },
    chooseInfluence: {
      toLose: 'Elige que influencia pierdes'
    },
    eventLog: {
      eventLog: 'Registro de eventos'
    },
    exchangeInfluences: {
      choose: 'Elige con que influencia(s) te quedas'
    },
    playerBoard: {
      coins: 'Monedas',
      influences: 'Influencias'
    },
    revealDecision: {
      challenge1: '¡Tu',
      challenge2: 'ha sido desafiado!',
      reveal1: '¡Si no revelas',
      reveal2: 'perderás influencia!',
      or: 'o'
    }
  }
};

export default esTranslations;
