const enTranslations = {
  common: {
    influences: {
      captain: 'Captain',
      assassin: 'Assassin',
      duke: 'Duke',
      ambassador: 'Ambassador',
      contessa: 'Contessa'
    },
    actions: {
      income: 'Income',
      coup: 'Coup',
      foreignAid: 'Foreign Aid',
      foreign_aid: 'Foreign Aid',
      steal: 'Steal',
      assassinate: 'Assassinate',
      tax: 'Tax',
      exchange: 'Exchange',
      block_foreign_aid: 'block Foreign Aid',
      block_steal: 'block Steal',
      block_assassinate: 'block Assassinate'
    }
  },
  home: {
    welcome: 'Welcome to Coup',
    description: 'A game of deduction and deception',
    create: 'Create Game',
    join: 'Join Game',
    madeBy: 'Made by'
  },
  rules: {
    label: 'Rules',
    header: 'Rules',
    players: '2-6 players',
    p1: 'On your turn, you may choose an action to play. The action you choose may or may not correspond to the influences that you possess. For the action that you choose, other players may potentially block or challenge it.',
    challengeTitle: 'Challenge',
    challengeDescription: 'When a player declares an action they are declaring to the rest of the players that they have a certain influence, and any other player can challenge it. When a player is challenged, the challenged player must reveal the correct influence associated with their action. If they reveal the correct influence, the challenger player will lose an influence. However, if they fail to reveal the correct influence the challenged player will lose their incorrectly revealed influence.',
    blockTitle: 'Block',
    blockDescription: 'When the any of the actions "Foreign Aid", "Steal", and "Assasinate" are used, they can be blocked. Once again, any player can claim to have the correct influence to block. However, blocks can also be challenged by any player. If a block fails, the original action will take place.',
    p2: 'If a player loses all their influences, they are out of the game. The last player standing wins!',
    p3: 'At this time, if a player disconnects, the game must be recreated.',
    influencesTitle: 'Influences',
    captainActionDescription: 'Steal 2 coins from a target.',
    assassinActionDescription: 'Pay 3 coins to choose a target to assassinate (target loses an influence).',
    dukeActionDescription: 'Collect 3 coins from the treasury.',
    ambassadorActionDescription: 'Draw 2 influences into your hand and pick any 2 influences to put back.',
    otherActions: 'Other Actions',
    incomeDescription: 'Collect 1 coins from the treasury.',
    foreignAidDescription: 'Collect 2 coins from the treasury.',
    coupDescription: 'Pay 7 coins and choose a target to lose an influence. If a player starts their turn with 10 or more coins, they must Coup.',
    or: 'or',
    blocks: 'Can block ',
    notBlockable: 'Not blockable.',
    blockable: 'Blockable by '
  },
  cheatsheet: {
    title: 'Cheat Sheet'
  },
  create: {
    enterName: 'Please enter your name',
    create: 'Create',
    creating: 'Creating...',
    roomCode: 'ROOM CODE',
    rearrange: 'You can drag to re-arrange the players in a specific turn order!',
    copied: 'Copied to clipboard',
    start: 'Start Game',
    ready: 'Ready!',
    notReady: 'Not ready',
    nameLengthValidation: 'Name must be less than 11 characteres'
  },
  join: {
    enterName: 'Please enter a name',
    enterRoomCode: 'Please enter a room code',
    invalidRoomCode: 'Invalid room code',
    serverError: 'Server error',
    selfReady: 'You are ready!',
    yourName: 'Your Name',
    ready: 'Ready!',
    notReady: 'Not ready',
    join: 'Join',
    joining: 'Joining...',
    roomCode: 'Room Code',
    nameLengthValidation: 'Name must be less than 9 characteres'
  },
  game: {
    playAgain: 'Play Again',
    yourInfluences: 'Your Influences',
    coins: 'Coins',
    waiting: 'Waiting for other players...',
    youAre: 'You are',
    turn1: 'It is',
    turn2: '\'s turn',
    pass: 'Pass',
    wins: 'Wins!',
    disconectedP1: 'You have been disconnected :c',
    disconectedP2: 'Please recreate the game.',
    disconectedP3: 'Sorry for the inconvenience (シ_ _)シ',
    actionDecision: {
      assasionationCoins: 'Not enough coins to assassinate!',
      coupCoins: 'Not enough coins to coup!',
      income: 'Income',
      coup: 'Coup',
      foreignAid: 'Foreign Aid',
      steal: 'Steal',
      assassinate: 'Assassinate',
      tax: 'Tax',
      exchange: 'Exchange',
      choose: 'Choose an action'
    },
    blockChallengeDecision: {
      tryBlock: 'is trying to block',
      from: 'from',
      as: 'as',
      challenge: 'Challenge'
    },
    blockDecision: {
      foreignAid: 'is trying to use Foreign Aid',
      blockForeignAid: 'Block Foreign Aid',
      blockSteal: 'Block Steal',
      blockAssassination: 'Block Assassination',
      blockStealClaim: 'To block steal, do you claim Ambassador or Captain?',
      ambassador: 'Ambassador',
      captain: 'Captain'
    },
    challengeDecision: {
      trySteal: 'is trying to Steal from',
      tryTax: 'is trying to collect Tax (3 coins)',
      tryAssassination: 'is trying to Assassinate',
      tryExchange: 'is trying to Exchange their influences',
      challenge: 'Challenge'
    },
    chooseInfluence: {
      toLose: 'Choose an influence to lose'
    },
    eventLog: {
      eventLog: 'Event Log'
    },
    exchangeInfluences: {
      choose: 'Choose which influence(s) to keep'
    },
    playerBoard: {
      coins: 'Coins',
      influences: 'Influences'
    },
    revealDecision: {
      challenge1: 'Your',
      challenge2: 'has been challenged!',
      reveal1: 'If you don\'t reveal',
      reveal2: 'you\'ll lose influence!',
      or: 'or'
    }
  }
};

export default enTranslations;
