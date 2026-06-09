import type { IncomingMessage, ServerResponse } from 'node:http'
import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models'
const DEFAULT_GEMINI_MODEL = 'gemini-3.5-flash'

function geminiDevApi(): Plugin {
  return {
    name: 'gemini-dev-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '')
      const apiKey = env.GEMINI_API_KEY ?? env.VITE_GEMINI_API_KEY
      const defaultModel = env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL

      server.middlewares.use('/api/agent-response', (req, res) => {
        void handleAgentResponse(req, res, apiKey, defaultModel)
      })
    },
  }
}

async function handleAgentResponse(
  req: IncomingMessage,
  res: ServerResponse,
  apiKey: string | undefined,
  defaultModel: string,
) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' })
    return
  }

  if (!apiKey) {
    sendJson(res, 500, { error: 'Missing GEMINI_API_KEY in .env' })
    return
  }

  try {
    const body = await readJson(req)
    const { model, requestBody } = prepareGeminiRequest(body, defaultModel)
    const upstream = await fetch(`${GEMINI_BASE_URL}/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify(requestBody),
    })

    const data = await upstream.json().catch(() => ({ error: upstream.statusText }))
    sendJson(res, upstream.status, data)
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Unable to contact Gemini',
    })
  }
}

function prepareGeminiRequest(body: unknown, defaultModel: string) {
  if (!isObject(body)) {
    throw new Error('Invalid Gemini request body')
  }

  const { model, ...requestBody } = body
  const selectedModel = typeof model === 'string' && model.trim() ? model.trim() : defaultModel

  if (!/^[A-Za-z0-9._-]+$/.test(selectedModel)) {
    throw new Error('Invalid Gemini model name')
  }

  return { model: selectedModel, requestBody }
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = ''

    req.setEncoding('utf8')
    req.on('data', (chunk: string) => {
      body += chunk
      if (body.length > 100_000) {
        reject(new Error('Request body too large'))
        req.destroy()
      }
    })
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {})
      } catch {
        reject(new Error('Invalid JSON request body'))
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), geminiDevApi()],
})
