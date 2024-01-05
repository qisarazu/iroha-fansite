import type { NextApiRequest, NextApiResponse } from 'next';

import { responseError } from '../../../lib/api/response-error';
import { getActivities } from '../../../services/activities/server';

async function handleGet(_: NextApiRequest, res: NextApiResponse) {
  const activities = await getActivities({ status: ['ACTIVE'], within: true });

  return res.status(200).json({ data: activities });
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET': {
        return handleGet(req, res);
      }
    }
  } catch (error) {
    responseError(res, error);
  }
}
