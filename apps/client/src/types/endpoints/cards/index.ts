export namespace Cards {
  export interface Card {
    id: string;
    title: string;
    description: string;
    position: number;
    columnId: string;
    updatedAt: string;
  }

  export namespace CreateCard {
    export interface Request {
      columnId: string;
      title: string;
      description: string;
    }

    export type Response = Card;
  }

  export namespace UpdateCard {
    export interface Request {
      id: string;
      columnId: string;
      title: string;
      description: string;
      position?: number;
    }

    export type Response = Card;
  }

  export namespace DeleteCard {
    export interface Request {
      id: string;
    }
  }
}
