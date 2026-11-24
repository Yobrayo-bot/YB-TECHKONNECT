const express = require('express')
const router = express.Router()

const pool = require('../config/database')
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')

// Protect every admin route
router.use(authMiddleware)
router.use(adminMiddleware)

// GET all technician applications
router.get('/technicians', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        tp.user_id,
        tp.full_name,
        tp.professional_title,
        tp.phone,
        tp.category,
        tp.location,
        tp.experience,
        tp.description,
        tp.approval_status,
        tp.created_at
      FROM public.technician_profiles AS tp
      ORDER BY tp.created_at DESC
    `)

    res.json({
      success: true,
      count: result.rows.length,
      technicians: result.rows
    })
  } catch (error) {
    console.error('Admin fetch error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to retrieve technician applications.'
    })
  }
})

// APPROVE technician
router.patch('/technicians/:userId/approve', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE public.technician_profiles
       SET approval_status = 'approved',
           updated_at = NOW()
       WHERE user_id = $1
       RETURNING user_id, full_name, approval_status`,
      [req.params.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found.'
      })
    }

    res.json({
      success: true,
      message: 'Technician approved successfully.',
      technician: result.rows[0]
    })
  } catch (error) {
    console.error('Approval error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to approve technician.'
    })
  }
})

// REJECT technician
router.patch('/technicians/:userId/reject', async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE public.technician_profiles
       SET approval_status = 'rejected',
           updated_at = NOW()
       WHERE user_id = $1
       RETURNING user_id, full_name, approval_status`,
      [req.params.userId]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Technician not found.'
      })
    }

    res.json({
      success: true,
      message: 'Technician rejected successfully.',
      technician: result.rows[0]
    })
  } catch (error) {
    console.error('Rejection error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to reject technician.'
    })
  }
})

module.exports = router