// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../libs/db";
import withHandler, { ResponseType } from "../../../libs/withHandler";
import { withApiSession } from "../../../libs/withSession";
const bcrypt = require("bcrypt");

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { username, password, password2 } = req.body;

  if (password !== password2) {
    return res.json({
      ok: false,
      error: "Invalid confirm-password.",
    });
  }

  const isExistUsername = Boolean(
    await db.user.findUnique({ where: { username } })
  );

  if (isExistUsername) {
    return res.json({
      ok: false,
      error: "username exists",
    });
  }

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
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    fn: handler,
    isPrivate: false,
  })
);
