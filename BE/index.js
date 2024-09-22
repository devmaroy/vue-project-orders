const express = require('express');
const cors = require('cors'); // Import cors package
const app = express();
const port = 3001;

app.use(express.json());

// Enable CORS for all origins
app.use(cors());

const usersRouter = require('./routes/users');
const ordersRouter = require('./routes/orders');

app.use('/api/users', usersRouter);
app.use('/api/orders', ordersRouter);

// API documentation route
app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome',
        availableEndpoints: {
            users: {
                listUsers: 'GET /api/users'
            },
            orders: {
                listOrders: 'GET /api/orders',
                createOrder: {
                    method: 'POST',
                    endpoint: '/api/orders',
                    description: 'Create a new order',
                    requestBody: {
                        items: [
                            { id: 106, product: 'Headphones', name: 'Noise-Cancelling Headphones', price: 150 }
                        ],
                        customerId: 3,
                        state: 'pending'
                    },
                    response: {
                        id: 4,
                        items: [
                            { id: 106, product: 'Headphones', name: 'Noise-Cancelling Headphones', price: 150 }
                        ],
                        customerId: 3,
                        state: 'pending'
                    }
                },
                updateOrder: {
                    method: 'PATCH',
                    endpoint: '/api/orders/:id',
                    description: 'Update the state of a specific order',
                    requestBody: {
                        state: 'shipped'
                    },
                    response: {
                        id: 1,
                        items: [
                            { id: 101, product: 'Laptop', name: 'Gaming Laptop', price: 1200 },
                            { id: 102, product: 'Mouse', name: 'Wireless Mouse', price: 50 }
                        ],
                        customerId: 1,
                        state: 'shipped'
                    }
                }
            }
        }
    });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
    console.log(`Mock API running on http://localhost:${port}`);
});
