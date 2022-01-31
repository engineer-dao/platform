import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { utils } from "ethers";

const cors = Cors({
    methods: ["GET", "HEAD"],
});

type Data = {
    message: string;
};

function runMiddleware(
    req: NextApiRequest,
    res: NextApiResponse<Data>,
    fn: any
) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
            if (result instanceof Error) {
                return reject(result);
            }

            return resolve(result);
        });
    });
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    await runMiddleware(req, res, cors);

    const { sig, address, message } = req?.body || {};

    const _address = utils.verifyMessage(message, sig);

    if (address === _address) {
        res.status(200).json({ message: "Success" });
    } else {
        res.status(403).json({ message: "Invalid message for address" });
    }
}
