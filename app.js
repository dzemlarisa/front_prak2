const express = require('express');
const app = express();
const port = 3000;

let products = [
    {id: 1, name: 'Кокакола', price: 200},
    {id: 2, name: 'Мармеладки Фансы', price: 150},
    {id: 3, name: 'Чипсы малосольные огурчики', price: 300},
];

let nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

app.use(express.json());

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

app.get('/', (req, res) => {
	res.send('Главная страница');
});

app.get('/products', (req, res) => {
	res.json(products);
});

app.get('/products/:id', (req, res) => {
    const product = products.find(p => p.id == req.params.id);
    
    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }
    
	res.json(product);
});

app.post('/products', (req, res) => {
	const { name, price } = req.body;

    if (!name || price === undefined) {
        return res.status(400).json({ message: 'Необходимо указать название и стоимость товара' });
    }

    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({ message: 'Стоимость должна быть положительным числом' });
    }

    let newId;
    if (products.length === 0) {
        newId = 1; 
    } else {
        const ids = products.map(p => p.id);
        newId = nextId++;
    }

    const newProduct = {
        id: newId,
        name,
        price
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

app.patch('/products/:id', (req, res) => {
	const product = products.find(p => p.id == req.params.id);
    
    if (!product) {
        return res.status(404).json({ message: 'Товар не найден' });
    }

    const { name, price } = req.body;

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
        return res.status(400).json({ message: 'Стоимость должна быть положительным числом' });
    }

    if (name !== undefined) product.name = name;
    if (price !== undefined) product.price = price;

    res.json(product);
});

app.delete('/products/:id', (req, res) => {
    const productIndex = products.findIndex(p => p.id == req.params.id);
    
    if (productIndex === -1) {
        return res.status(404).json({ message: 'Товар не найден' });
    }

    products = products.filter(p => p.id != req.params.id);
	res.json({ message: 'Товар успешно удален' });
});

app.listen(port, () => {
	console.log(`Сервер запущен на http://localhost:${port}`);
	console.log('Доступные endpoints:');
	console.log('GET    /products          - получить все товары');
	console.log('GET    /products/:id      - получить товар по id');
	console.log('POST   /products          - добавить новый товар');
	console.log('PATCH  /products/:id      - обновить товар');
	console.log('DELETE /products/:id      - удалить товар');
});