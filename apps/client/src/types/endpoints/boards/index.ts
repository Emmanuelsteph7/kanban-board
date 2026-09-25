export namespace Boards {
  export interface Board {
    id: string;
    name: string;
    createdAt: string;
  }

  export namespace CreateBoard {
    export interface Request {
      name: string;
    }

    export type Response = Board;
  }

  export namespace GetBoards {
    export type Response = Board[];
  }

  export namespace RenameBoard {
    export interface Request {
      id: string;
      name: string;
    }

    export type Response = Board;
  }

  export namespace DeleteBoard {
    export interface Request {
      id: string;
    }
  }

  export namespace GetBoardById {
    export interface Request {
      id: string;
    }

    export type Response = Board;
  }
}
