const { Pool } = require('pg');
require('dotenv').config();

// Default Supabase connection string from environment or provided credentials
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || 
  "postgresql://postgres.pcudkqaqknoglnoqcxhs:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres";

const pool = new Pool({
  connectionString: connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

// Helper for executing queries
const query = (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query
};
