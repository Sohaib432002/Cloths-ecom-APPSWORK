import { jsonOk } from '@/lib/http'
import { getHuggingFaceConfig } from '@/lib/env'

export async function GET() {
  const { token, model } = getHuggingFaceConfig()
  return jsonOk({
    ok: true,
    service: 'SHOP.CO API',
    huggingface: {
      configured: Boolean(token),
      model,
    },
  })
}
