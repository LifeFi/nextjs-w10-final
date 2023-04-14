// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import withHandler from "../../../lib/withHandler";
import { withApiSession } from "../../../lib/withSession";
const bcrypt = require("bcrypt");

type Data = {
  ok: boolean;
  [key: string]: any;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { username, password, password2 } = req.body;

  if (password === password2) {
    const hash = await bcrypt.hash(password, 5);

    const createdUser = await db.user.create({
      data: {
        username,
        password: hash,
      },
    });

    req.session.user = {
      id: createdUser.id,
    };
    await req.session.save();

    return res.json({
      ok: true,
      user: createdUser,
    });
  } else {
    return res.json({
      ok: false,
      error: "Invalid confirm-password.",
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    fn: handler,
    isPrivate: false,
  })
);
