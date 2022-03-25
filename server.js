const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const app = express();
connectDB()
/// Init Middleware

// app.use(cors(corsOptions));
app.use(cors())
app.use(express.json({extended: false}))
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
//   });

app.get('/',(req,res) => res.send('API Running'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));



const PORT = process.env.PORT || 8000

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));