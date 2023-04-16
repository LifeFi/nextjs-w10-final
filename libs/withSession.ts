import { withIronSessionApiRoute } from "iron-session/next";

declare module "iron-session" {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const COOKIE_PASSWORD = "dgQyMbSstAQWT4NtDqkmRnzMKvNuKQ2PBGmNYWMt";

const cookieOptions = {
  cookieName: "twitterminiclonesession",
  password: process.env.COOKIE_PASSWORD! || COOKIE_PASSWORD,
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}
