// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../lib/db";
import { withApiSession } from "../../../lib/withSession";
import withHandler from "../../../lib/withHandler";
const bcrypt = require("bcrypt");

type Data = {
  ok: boolean;
  [key: string]: any;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { username, password } = req.body;

  const foundUser = await db.user.findUnique({
    where: { username },
  });

  if (!foundUser) {
    return res.json({
      ok: false,
      error: "Invalid username",
    });
  }

  const match = await bcrypt.compare(password, foundUser.password);

  if (match) {
    req.session.user = {
      id: foundUser.id,
    };
    await req.session.save();

    return res.json({
      ok: true,
    });
  } else {
    return res.json({
      ok: false,
      error: "Invalid password",
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
