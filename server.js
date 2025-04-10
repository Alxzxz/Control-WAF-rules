require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.static('.')); // Añadir esta línea para servir archivos desde la raíz

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/waf-rules')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const ruleRouter = require('./routes/rules');
app.use('/api/rules', ruleRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
