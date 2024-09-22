const express = require("express");
const router = express.Router();

// In-memory storage for orders
let orders = [
  {
    id: 1,
    items: [
      { id: 101, product: "Laptop", name: "Gaming Laptop", price: 1200 },
      { id: 102, product: "Mouse", name: "Wireless Mouse", price: 50 },
    ],
    customerId: 1,
    state: "pending",
  },
  {
    id: 2,
    items: [
      { id: 103, product: "Smartphone", name: "Latest Smartphone", price: 800 },
    ],
    customerId: 2,
    state: "shipped",
  },
  {
    id: 3,
    items: [
      {
        id: 104,
        product: "Tablet",
        name: "High-Resolution Tablet",
        price: 300,
      },
      { id: 105, product: "Keyboard", name: "Mechanical Keyboard", price: 100 },
    ],
    customerId: 1,
    state: "delivered",
  },
];

// Get all orders
router.get("/", (req, res) => {
  res.json(orders);
});

// Create a new order
router.post("/", (req, res) => {
  const { items, customerId, state } = req.body;

  if (!items || !Array.isArray(items) || !customerId || !state) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const newOrder = {
    id: orders.length ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
    items,
    customerId,
    state,
  };

  orders.push(newOrder);
  res.status(201).json(newOrder);
});

// Update order state
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { state } = req.body;

  const order = orders.find((order) => order.id === parseInt(id));

  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (state) {
    order.state = state;
  }

  res.json(order);
});

module.exports = router;
