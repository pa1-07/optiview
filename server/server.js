const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors(
    {
        origin: ['https://optiview-server.onrender.com','http://localhost:3000']  // Replace with your front-end's domain
      }
));
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sheets', require('./routes/sheetRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
