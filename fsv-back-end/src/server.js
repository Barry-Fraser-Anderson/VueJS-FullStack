import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// const database = 'mongodb://127.0.0.1:27017?directConnection=true';
const DATABASE = 'mongodb+srv://barryanderson:<PASSWORD>@cluster0.iiobiwd.mongodb.net/vue-db';
const database = DATABASE.replace('<PASSWORD>', '471WxFVa97n4QHOU');
export let cartItems = [];

const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/images', express.static(path.join(__dirname, '../assets')));
app.use(express.static(path.join(__dirname)));

// Get all products
app.get('/api/products', async (req, res) => {
  const client = await MongoClient.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db('vue-db');
  const products = await db.collection('products').find({}).toArray();
  res.status(200).json(products);
  client.close();
});

// Get a product
app.get('/api/products/:productId', async (req, res) => {
  const { productId } = req.params;
  const client = await MongoClient.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db('vue-db');
  const product = await db.collection('products').findOne({ id: productId });
  if (product) {
    res.status(200).json(product);
  } else {
    res.status(404).json('Product not found');
  }
  client.close();
});

// List cart items
app.get('/api/users/:userId/cart', async (req, res) => {
  const { userId } = req.params;
  const client = await MongoClient.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db('vue-db');
  const user = await db.collection('users').findOne({ id: userId });
  if (!user) return res.status(400).json('User not found');
  const products = await db.collection('products').find({}).toArray();
  const cartItemIds = user.cartItems;
  const cartItems = cartItemIds.map(id => products.find(product => product.id === id));
  res.status(200).json(cartItems);
  client.close();
});

// Add an item to the cart
app.post('/api/users/:userId/cart', async (req, res) => {
  const { userId } = req.params;
  const { productId } = req.params;
  const client = await MongoClient.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db('vue-db');
  await db.collection('users').updateOne({ id: userId }, { $addToSet: { cartItems: productId } });
  const user = await db.collection('users').findOne({ id: userId });
  if (!user) return res.status(400).json('User not found');
  const cartItemIds = user.cartItems;
  const products = await db.collection('products').find({}).toArray();
  const cartItems = cartItemIds.map(id => products.find(product => product.id === id));
  res.status(200).json(cartItems);
  client.close();
});

// Delete an item from the cart
app.delete('/api/users/:userId/cart/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  const client = await MongoClient.connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db('vue-db');
  await db.collection('users').updateOne({ id: userId }, { $pull: { cartItems: productId } });
  const user = await db.collection('users').findOne({ id: userId });
  const products = await db.collection('products').find({}).toArray();
  const cartItemIds = user.cartItems;
  const cartItems = cartItemIds.map(id => {
    products.find(product => product.id === id);
  });
  cartItems = cartItems.filter(product => product.id !== productId);
  res.status(200).json(cartItems);
  client.close();
});

app.listen(8000, () => {
  console.log('Server is listening on port 8000');
});
