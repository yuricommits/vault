import { auth } from "./auth";

export const middleware = auth;

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
