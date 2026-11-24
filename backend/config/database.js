
const { Pool } = require('pg')

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

// Export the connection pool
module.exports = pool
