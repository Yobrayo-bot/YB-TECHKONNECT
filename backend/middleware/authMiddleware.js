
let jwks

async function getJWKS() {
  if (!jwks) {
    const { createRemoteJWKSet } = await import('jose')

    jwks = createRemoteJWKSet(
      new URL(process.env.NEON_AUTH_JWKS_URL)
    )
  }

  return jwks
}

async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      })
    }

    const token = authHeader.substring(7)

    const { jwtVerify } = await import('jose')

    const { payload } = await jwtVerify(
      token,
      await getJWKS(),
      {
        issuer: new URL(
          process.env.NEON_AUTH_BASE_URL
        ).origin
      }
    )

    if (!payload.sub) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication token.'
      })
    }

    req.user = {
      id: payload.sub,
      email: payload.email
    }

    next()

  } catch (error) {
    console.error('Authentication error:', error.message)

    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token.'
    })
  }
}

module.exports = authMiddleware
