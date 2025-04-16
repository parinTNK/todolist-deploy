import pkg from 'pg'
import dotenv from 'dotenv'

dotenv.config()
const { Pool } = pkg

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
})

const connectDB = async () => {
    try {
        await pool.connect()
        console.log('Connected to database')
    } catch (err) {
        console.error('Error connecting to database', err)
        process.exit(1)
    }
}

export default connectDB