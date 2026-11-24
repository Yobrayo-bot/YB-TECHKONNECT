
import { createInternalNeonAuth } from '@neondatabase/auth'
import { BetterAuthReactAdapter } from '@neondatabase/auth/react/adapters'

const neonAuth = createInternalNeonAuth(
  import.meta.env.VITE_NEON_AUTH_URL,
  {
    adapter: BetterAuthReactAdapter()
  }
)

export const authClient = neonAuth.adapter

export const getJWTToken = neonAuth.getJWTToken
