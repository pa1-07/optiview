const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const url = process.env.MONGODB_URI

const connectDb = () => {
  mongoose.connect(url)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
}

module.exports = connectDb
  