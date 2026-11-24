const pool = require('../config/database')

async function adminMiddleware(req, res, next) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.'
      })
    }

    const result = await pool.query(
      `SELECT user_id
       FROM public.admin_users
       WHERE user_id = $1
       LIMIT 1`,
      [req.user.id]
    )

    if (result.rows.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Administrator access denied.'
      })
    }

    next()
  } catch (error) {
    console.error('Admin authorization error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Unable to verify administrator access.'
    })
  }
}

module.exports = adminMiddleware