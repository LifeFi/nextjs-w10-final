import { NextApiRequest, NextApiResponse } from "next";

import db from "../../../libs/db";
import withHandler, { ResponseType } from "../../../libs/withHandler";
import { withApiSession } from "../../../libs/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const profile = await db.user.findUnique({
      where: { id: req.session.user?.id },
    });

    res.json({
      ok: true,
      profile,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    fn: handler,
  })
);
