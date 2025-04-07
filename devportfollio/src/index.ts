import { Elysia } from 'elysia'
import { html } from '@elysiajs/html'
import { staticPlugin } from '@elysiajs/static'
import { createClient } from '@libsql/client'

// Database configuration
const db = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN
})

// Initialize app with plugins
const app = new Elysia()
  .use(html())
  .use(staticPlugin({
    assets: 'public',
    prefix: '/public'
  }))
  // Serve main index.html from root directory
  .get('/', () => Bun.file('./index.html'))
  // API endpoints
  .post('/api/profile', async ({ body, set }) => {
    try {
      // TODO: Implement profile validation
      const profile = body as any
      
      // TODO: Save profile to database
      // await db.execute('INSERT INTO profiles (...) VALUES (...)', [...])
      
      return { success: true, data: profile }
    } catch (error) {
      set.status = 500
      return { 
        success: false, 
        error: 'Failed to save profile' 
      }
    }
  })
  // Error handling
  .onError(({ code, error, set }) => {
    set.status = code === 'NOT_FOUND' ? 404 : 500
    return { 
      success: false, 
      error: error.message 
    }
  })
  .listen(3000)

console.log(`🎯 CheckMate.io is running at http://localhost:${app.server?.port}`)
