const express = require('express')
const path = require('path');
const app = express()
const mysql = require('mysql2');
require('dotenv').config();
console.log(process.env.DB_HOST)
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

connection.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conexão com o banco de dados estabelecida!');

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )`;

    connection.query(createTableQuery, (err, results) => {
        if (err) {
            console.error('Erro ao criar a tabela:', err);
            return;
        }
        console.log('Tabela de usuários criada ou já existente!');
    });
});

app.get('/api/users', (req, res) => {
    const selectQuery = 'SELECT * FROM users';

    connection.query(selectQuery, (err, results) => {
        if (err) {
            console.error('Erro ao buscar usuários:', err);
            res.status(500).send('Erro ao buscar usuários no banco de dados');
            return;
        }
        console.log('Usuários encontrados:', results);
        res.status(200).json(results); // Envia os usuários como resposta em formato JSON
    });
});

app.get('/user/create', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/user', (req, res) => {
    const { name, email, password } = req.body;
    const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

    connection.query(insertQuery, [name, email, password], (err, results) => {
        if (err) {
            console.error('Erro ao inserir dados:', err);
            res.status(500).send('Erro ao inserir dados no banco de dados');
            return;
        }
        console.log('Dados inseridos com sucesso:', results);
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
});

app.listen(3000)