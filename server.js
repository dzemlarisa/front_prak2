const express = require('express');
const { nanoid } = require('nanoid');

const app = express();
const port = 3000;

let products = [
    {id: nanoid(6), name: 'Кокакола', category: 'Напитки', description: 'Напиток безалкагольный сильногазированный', price: 200, count: 100},
    {id: nanoid(6), name: 'Мармеладки Фансы', category: 'Сладости', description: 'Жевательный мармелад с кислой посыпкой', price: 150, count: 55},
    {id: nanoid(6), name: 'Сок апельсиновый', category: 'Напитки', description: 'Фруктовый сок с мякотью', price: 100, count: 150},
    {id: nanoid(6), name: 'Помидоры черри', category: 'Овощи', description: '24 штуки в упаковке. Страна производства: Азербайджан', price: 300, count: 60},
    {id: nanoid(6), name: 'Огурцы', category: 'Овощи', description: 'Огурец премиальный хрустящий 1 штука', price: 350, count: 45},
    {id: nanoid(6), name: 'Крупа гречневая', category: 'Крупы', description: 'Ядрица 250г', price: 50, count: 1000},
    {id: nanoid(6), name: 'Яблоки', category: 'Фрукты', description: 'Сорт: Белый налив', price: 155, count: 30},
    {id: nanoid(6), name: 'Жвачка', category: 'Сладости', description: 'Жевательная резинка "Турбо"', price: 1, count: 200},
    {id: nanoid(6), name: 'Бананы', category: 'Фрукты', description: 'Бананы спелые. Страна производства: Египет', price: 250, count: 40},
    {id: nanoid(6), name: 'Крупа рисовая', category: 'Крупы', description: 'Белый длиннозерный рис для плова', price: 60, count: 5},
];

// Middleware для парсинга JSON
app.use(express.json());

// Middleware для CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    
    // Обработка preflight запросов
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    
    next();
}); 

// Middleware для логирования запросов
app.use((req, res, next) => {
    res.on('finish', () => {
        console.log(`[${new Date().toISOString()}] [${req.method}] ${res.statusCode} ${req.path}`);
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            console.log('Body:', req.body);
        }
    });
    next();
});

// Функция-помощник для получения товара из списка
function findProductOr404(id, res) {
    const product = products.find(p => p.id == id);
    if (!product) {
        res.status(404).json({ error: "Product not found" });
        return null;
    }
    return product;
}

app.get('/api/products', (req, res) => {
    res.json(products);
});

app.get('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;
    
    res.json(product);
});

app.post('/api/products', (req, res) => {
    const { name, category, description, price, count } = req.body;

    const newProduct = {
        id: nanoid(6),
        name: name.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Number(price),
        count: Number(count)
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.patch('/api/products/:id', (req, res) => {
    const id = req.params.id;
    const product = findProductOr404(id, res);
    if (!product) return;

    // Нельзя PATCH без полей
    if (req.body?.name === undefined && req.body?.category === undefined && req.body?.description === undefined && req.body?.price === undefined && req.body?.count === undefined) {
        return res.status(400).json({
            error: "Nothing to update",
        });
    }

    const { name, category, description, price, count } = req.body;

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ message: 'Стоимость должна быть положительным числом' });
    }

    if (name !== undefined) product.name = name.trim();
    if (category !== undefined) product.category = category.trim(); 
    if (description !== undefined) product.description = description.trim();
    if (price !== undefined) product.price = price;
    if (count !== undefined) {
        if (typeof count !== 'number' || count < 0) {
            return res.status(400).json({ message: 'Количество должно быть положительным числом' });
        }
        product.count = count;
    }

    res.json(product);
});

app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;
    
    const exists = products.some(p => p.id == id);
    if (!exists) return res.status(404).json({ error: "Product not found" });

    products = products.filter(p => p.id != id);
    
    // Правильнее 204 без тела
    res.status(204).send();
});

// 404 для всех остальных маршрутов
app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
});

// Глобальный обработчик ошибок (чтобы сервер не падал)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});