const express = require('express');
const app = express();
app.use(express.json());

let inventory = [
  { productId: 1, quantity: 50, reserved: 0 },
  { productId: 2, quantity: 100, reserved: 0 },
  { productId: 3, quantity: 200, reserved: 0 }
];

app.get('/:productId', (req, res) => {
  const item = inventory.find(i => i.productId === parseInt(req.params.productId));
  if (!item) return res.status(404).json({ error: 'Product not found in inventory' });
  res.json(item);
});

app.post('/reserve', (req, res) => {
  const { productId, quantity } = req.body;
  const item = inventory.find(i => i.productId === productId);
  
  if (!item) return res.status(404).json({ error: 'Product not found' });
  if (item.quantity - item.reserved < quantity) {
    return res.status(400).json({ error: 'Insufficient stock' });
  }
  
  item.reserved += quantity;
  res.json({ success: true, item });
});

app.post('/confirm', (req, res) => {
  const { productId, quantity } = req.body;
  const item = inventory.find(i => i.productId === productId);
  
  if (!item) return res.status(404).json({ error: 'Product not found' });
  
  item.quantity -= quantity;
  item.reserved -= quantity;
  res.json({ success: true, item });
});

app.post('/release', (req, res) => {
  const { productId, quantity } = req.body;
  const item = inventory.find(i => i.productId === productId);
  
  if (!item) return res.status(404).json({ error: 'Product not found' });
  
  item.reserved -= quantity;
  res.json({ success: true, item });
});

app.listen(3005, () => console.log('Inventory Service running on port 3005'));