const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/products', require('./routes/products'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/config', require('./routes/config'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Geewhy Designs catalog running at http://localhost:${PORT}`);
});
