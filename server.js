const express = require('express')

const PORT = 8000;

const app = express();
const productRoutes = require('./routes/product.routes');
const mongoose = require('mongoose');

mongoose.connect('')

app.use('/api/products', productRoutes);

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello");
})

app.use((error, req, res, next) => {
  res.status(500).json({message: error.message});
});

app.listen(PORT);
console.log(`Running on port ${PORT}`);

module.exports = app;