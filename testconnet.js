import { createClient } from '@supabase/supabase-js'

// Replace with your actual values
const supabaseUrl = "https://rrgrghlvdtailyxiwjti.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyZ3JnaGx2ZHRhaWx5eGl3anRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyNjc1OTEsImV4cCI6MjA5MTg0MzU5MX0.C1P8m4iONxi7NRoSI08alJcbjCzoykpiOl-X8J6oq2Y"


const supabase = createClient(supabaseUrl, supabaseKey)

// Simple connection test
async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('trust_survey') // replace with an existing table
      .select('*')
      .limit(1)

    if (error) {
      console.error('Connection failed:', error.message)
    } else {
      console.log('Connection successful ✅')
      console.log('Sample data:', data)
    }
  } catch (err) {
    console.error('Unexpected error:', err.message)
  }
}

testConnection()