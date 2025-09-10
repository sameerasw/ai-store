require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const db = require('./src/db');
const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const offerRoutes = require('./src/routes/offers');
const orderRoutes = require('./src/routes/orders');
const chatRoutes = require('./src/routes/chat');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: ['http://localhost:5173'], credentials: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'ai-store-backend' });
});

app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/offers', offerRoutes);
app.use('/orders', orderRoutes);
app.use('/chat', chatRoutes);

// Ensure DB initialized before listen
const { init } = require('./src/db');
init().then(() => {
  app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
}).catch((err) => {
  console.error('Failed to initialize database', err);
  process.exit(1);
});
