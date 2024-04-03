export default interface IHandler {
  code: "UNKNOWN" | "VALIDATION" | "NOT_FOUND" | "PARSE" | "INTERNAL_SERVER_ERROR" | "INVALID_COOKIE_SIGNATURE";
  error: Readonly<Error>;
  request: Request
  set: {
    headers: {
        [header: string]: string;
    } & {
        ['Set-Cookie']?: string | string[];
    };
    status?: number;
    redirect?: string;
}
}
