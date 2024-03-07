const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const port = 1245;
const client = redis.createClient();

const listProducts = [
    { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
    { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
    { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
    { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const getItemById = id => listProducts.find(product => product.itemId === id);

const reserveStockById = async (itemId, stock) => {
    await setAsync(`item.${itemId}`, stock);
};

const getCurrentReservedStockById = async itemId => {
    const stock = await getAsync(`item.${itemId}`);
    return stock ? parseInt(stock) : 0;
};

app.get('/list_products', (req, res) => {
    res.json(listProducts);
});

app.get('/list_products/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const product = getItemById(parseInt(itemId));
    if (!product) {
        res.json({ status: 'Product not found' });
        return;
    }
    const currentQuantity = await getCurrentReservedStockById(itemId);
    res.json({ ...product, currentQuantity });
});

app.get('/reserve_product/:itemId', async (req, res) => {
    const { itemId } = req.params;
    const product = getItemById(parseInt(itemId));
    if (!product) {
        res.json({ status: 'Product not found' });
        return;
    }
    const currentQuantity = await getCurrentReservedStockById(itemId);
    if (currentQuantity <= 0) {
        res.json({ status: 'Not enough stock available', itemId });
        return;
    }
    await reserveStockById(itemId, currentQuantity - 1);
    res.json({ status: 'Reservation confirmed', itemId });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
