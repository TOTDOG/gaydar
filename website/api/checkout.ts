import { checkBotId } from 'botid/server'
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const verification = await checkBotId()

  if (verification.isBot) {
    return res.status(403).json({ error: 'Bot detected' })
  }

  // your real logic...
  res.status(200).json({ success: true })
}