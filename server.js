const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');
const { type } = require('os');


const URL = 'http://localhost:3000/';
const URL_API = 'http://localhost:3000/api/';

app.use(express.static('public'));
app.use(bodyParser.json());

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'play'
});


const read = page => {
    let pageHtml = fs.readFileSync(`./html/${page}.html`, 'utf8');

    pageHtml = pageHtml.replaceAll('{{URL}}', URL);
    pageHtml = pageHtml.replaceAll('{{URL_API}}', URL_API);

    return pageHtml;
}


app.get('/', (req, res) => {
    res.send(read('games'));
});

app.get('/genres', (req, res) => {
    res.send(read('genres'));
});

app.get('/api/genres', (req, res) => {
    const sql = 'SELECT * FROM genres';

    con.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.send(result);
    });
});

app.get('/api/games', (req, res) => {
    const sql = `
        SELECT games.id, games.title, age, genre_id, genres.title AS genre
        FROM games
        LEFT JOIN genres 
        ON games.genre_id = genres.id
    `;

    con.query(sql, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.send(result);
    });
});


app.post('/api/genres', (req, res) => {
    
    const sql = `
        INSERT INTO genres
        (title) 
        VALUES (?)
    `;

    con.query(sql, [req.body.title], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.status(201).send({
            success: true,
            id: result.insertId
        });
    });
});

app.post('/api/games', (req, res) => {

    const sql = `
        INSERT INTO games
        (title, age, genre_id)
        VALUES (?, ?, ?)
    `;

    con.query(sql, [req.body.title, req.body.age, req.body.genre_id], (err, result) => {
        if (err) {
            res.status(500).send({
                err,
                msg: {
                    text: 'Error creating new game',
                    type: 'danger'
                }
            });
            return;
        }
        res.status(201).send({
            success: true,
            id: result.insertId,
            msg: {
                text: 'New game created',
                type: 'success'
            }
        });
    });

    
});

app.put('/api/genres/:id', (req, res) => {

    const sql = `
        UPDATE genres
        SET title = ?
        WHERE id = ?
    `;

    con.query(sql, [req.body.title, req.params.id], (err, result) => {
        if (err) {
            res.status
            (500).send(err);
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send({
                success: false,
                message: 'Genre not found'
            });
            return;
        }

        res.send({
            success: true
        });
    });
});

app.put('/api/games/:id', (req, res) => {
    const sql = `
        UPDATE games
        SET title = ?, age = ?, genre_id = ?
        WHERE id = ?
    `;

    con.query(sql, [req.body.title, req.body.age, req.body.genre_id, req.params.id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send({
                success: false,
                message: 'Game not found'
            });
            return;
        }

        res.send({
            success: true,
            msg: {
                text: 'Game updated',
                type: 'success'
            }
        });
    });
});

app.delete('/api/genres/:id', (req, res) => {
    const sql = `
        DELETE FROM genres
        WHERE id = ?
    `;

    con.query(sql, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send({
                success: false,
                message: 'Genre not found'
            });
            return;
        }

        res.send({
            success: true
        });
    });

});

app.delete('/api/games/:id', (req, res) => {
    const sql = `
        DELETE FROM games
        WHERE id = ?
    `;

    con.query(sql, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send({
                success: false,
                message: 'Game not found'
            });
            return;
        }

        res.send({
            success: true,
            msg: {
                text: 'Game deleted',
                type: 'info'
            }
        });
    });

});
            

con.connect(err => {
    if (err) {
        console.log('Klaida prisijungiant prie DB');
        return;
    }
    console.log('Prisijungimas prie DB buvo sėkmingas');
});



// Start server

const port = 3000;
app.listen(port, () => {
    console.log(`Serveris Play APP pasiruošęs ir laukia ant ${port} porto!`);
});