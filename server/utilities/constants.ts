export enum CardNames {
    DUKE = "duke",
    ASSASSIN = "assassin",
    CAPTAIN = "captain",
    AMBASSADOR = "ambassador",
    CONTESSA = "contessa",
};

interface CardAction {
    cardName: string;
    action(): void;
}

export enum ActionNames {
    INCOME = "income",
    FOREIGN_AID = "foreign_aid",
    COUP = "coup",
    TAX = "tax",
    ASSASSINATE = "assassinate",
    EXCHANGE = "exchange",
    STEAL = "steal"
}

interface ActionProperties {
    influence: CardNames | "all";
    blockableBy: CardNames[];
    isChallengeable: boolean;
    moneyDelta: number;
}

export const Actions: Record<ActionNames, ActionProperties> = {
    [ActionNames.INCOME]: {
        influence: "all",
        blockableBy: [],
        isChallengeable: false,
        moneyDelta: 1
    },
    [ActionNames.FOREIGN_AID]: {
        influence: "all",
        blockableBy: [CardNames.DUKE],
        isChallengeable: false,
        moneyDelta: 2
    },
    [ActionNames.COUP]: {
        influence: "all",
        blockableBy: [],
        isChallengeable: false,
        moneyDelta: -7
    },
    [ActionNames.TAX]: {
        influence: CardNames.DUKE,
        blockableBy: [],
        isChallengeable: true,
        moneyDelta: 3
    },
    [ActionNames.ASSASSINATE]: {
        influence: CardNames.ASSASSIN,
        blockableBy: [CardNames.CONTESSA],
        isChallengeable: true,
        moneyDelta: -3
    },
    [ActionNames.EXCHANGE]: {
        influence: CardNames.AMBASSADOR,
        blockableBy: [],
        isChallengeable: true,
        moneyDelta: 0
    },
    [ActionNames.STEAL]: {
        influence: CardNames.CAPTAIN,
        blockableBy: [CardNames.AMBASSADOR, CardNames.AMBASSADOR],
        isChallengeable: true,
        moneyDelta: 2 // EDGE CASE: if victim only has 1 or 0 coins
    }
};

enum CounterActionNames {
    BLOCK_FOREIGN_AID = "block_foreign_aid",
    BLOCK_STEAL = "block_steal",
    BLOCK_ASSASINATE = "block_assassinate"
}

interface CounterActionProperties {
    influences: CardNames[];
}

export const CounterActions: Record<CounterActionNames, CounterActionProperties> = {
    [CounterActionNames.BLOCK_FOREIGN_AID]: {
        influences: [CardNames.DUKE],
    },
    [CounterActionNames.BLOCK_STEAL]: {
        influences: [CardNames.AMBASSADOR, CardNames.CAPTAIN]
    },
    [CounterActionNames.BLOCK_ASSASINATE]: {
        influences: [CardNames.CONTESSA]
    },
};