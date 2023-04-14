import { NextApiRequest, NextApiResponse } from "next";

import db from "../../../lib/db";
import withHandler, { ResponseType } from "../../../lib/withHandler";
import { withApiSession } from "../../../lib//withSession";

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
