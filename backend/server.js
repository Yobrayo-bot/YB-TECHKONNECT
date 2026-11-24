
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const app = express()

const technicianRoutes = require('./routes/technicians')
const adminRoutes = require('./routes/admin')

// Middleware
app.use(cors({
  origin: 'https://shiny-meme-97j46xj99rg6cpxr9-5173.app.github.dev',
    credentials: true
    }))

    app.use(express.json())

    // API Routes
    app.use('/api/technicians', technicianRoutes)
    app.use('/api/admin', adminRoutes)

    // Welcome route
    app.get('/', (req, res) => {
      res.send('YB TECHKONNECT API is running!')
      })

      // Server port
      const PORT = process.env.PORT || 5000

      // Start server
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
        })
        