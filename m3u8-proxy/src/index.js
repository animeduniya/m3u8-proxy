
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: '*',
    allowMethods: ['GET', 'OPTIONS'],
  })
)

app.all('*', async (c) => {
  const targetUrl = c.req.query('url')
  if (!targetUrl) {
    return c.text('Missing target URL', 400)
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'GET', // Force GET for m3u8 requests
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https:skyanime.site',
      },
    })

    const newHeaders = new Headers(response.headers)
    newHeaders.set('Access-Control-Allow-Origin', '*')
    newHeaders.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
    newHeaders.set('Access-Control-Allow-Headers', '*')

    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    })
  } catch (e) {
    return c.text('Fetch error: ' + e.toString(), 500)
  }
})

export default app
