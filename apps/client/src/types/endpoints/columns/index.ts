export namespace Columns {
  export interface Column {
    id: string;
    name: string;
    position: number;
    boardId: string;
  }

  export namespace CreateColumn {
    export interface Request {
      boardId: string;
      name: string;
    }

    export type Response = Column;
  }

  export namespace GetColumns {
    export interface Request {
      boardId: string;
    }

    export type Response = Column[];
  }

  export namespace RenameColumn {
    export interface Request {
      id: string;
      name: string;
      position?: number;
    }

    export type Response = Column;
  }

  export namespace DeleteColumn {
    export interface Request {
      id: string;
    }
  }
}
