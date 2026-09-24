export namespace Auth {
  export namespace Login {
    export interface Request {
      email: string;
      password: string;
    }

    export interface Response {
      token: string;
    }
  }

  export namespace Signup {
    export interface Request {
      email: string;
      password: string;
    }

    export interface Response {
      token: string;
    }
  }
}
