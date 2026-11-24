
const express = require('express')
const router = express.Router()
const pool = require('../config/database')
const authMiddleware = require('../middleware/authMiddleware')

// GET all approved technicians
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        tp.user_id,
        tp.full_name,
        tp.professional_title,
        tp.phone,
        tp.location,
        tp.experience,
        tp.description,
        sc.name AS category
      FROM public.technician_profiles AS tp
      LEFT JOIN public.service_categories AS sc
        ON tp.category_id = sc.id
      WHERE tp.approval_status = 'approved'
      ORDER BY tp.created_at DESC
    `)

    res.json({
      success: true,
      count: result.rows.length,
      technicians: result.rows
    })
  } catch (error) {
    console.error('Fetch technicians error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to retrieve technicians.'
    })
  }
})

// REGISTER technician professional profile
router.post('/register', authMiddleware, async (req, res) => {
  try {
    const {
      fullName,
      professionalTitle,
      phone,
      category,
      location,
      experience,
      description
    } = req.body

    // Validate required fields
    if (
      !fullName?.trim() ||
      !professionalTitle?.trim() ||
      !phone?.trim() ||
      !category?.trim() ||
      !location?.trim() ||
      !experience?.trim() ||
      !description?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required professional details.'
      })
    }

    // Find the selected service category
    const categoryResult = await pool.query(
      `SELECT id, name
       FROM public.service_categories
       WHERE name = $1`,
      [category.trim()]
    )

    if (categoryResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid service category.'
      })
    }

    const selectedCategory = categoryResult.rows[0]

    // Save the technician profile
    const result = await pool.query(
      `INSERT INTO public.technician_profiles (
        user_id,
        full_name,
        professional_title,
        phone,
        category,
        location,
        experience,
        description,
        category_id,
        approval_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
      RETURNING
        user_id,
        full_name,
        professional_title,
        location,
        experience,
        description,
        approval_status`,
      [
        req.user.id,
        fullName.trim(),
        professionalTitle.trim(),
        phone.trim(),
        selectedCategory.name,
        location.trim(),
        experience.trim(),
        description.trim(),
        selectedCategory.id
      ]
    )

    res.status(201).json({
      success: true,
      message: 'Professional profile submitted successfully. Awaiting approval.',
      technician: result.rows[0]
    })

  } catch (error) {
    console.error('Technician registration error:', error.message)

    if (error.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'A technician profile already exists for this account.'
      })
    }

    res.status(500).json({
      success: false,
      message: 'Unable to create technician profile.'
    })
  }
})

module.exports = router
