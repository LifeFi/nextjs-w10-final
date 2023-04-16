import { NextApiRequest, NextApiResponse } from "next";

import withHandler, { ResponseType } from "../../../libs/withHandler";
import { withApiSession } from "../../../libs/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  await req.session.destroy();

  return res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    fn: handler,
    isPrivate: false,
  })
);
