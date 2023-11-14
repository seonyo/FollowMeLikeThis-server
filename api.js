require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const app = express()

const port = 3000

app.use(express.json());
app.use(cors());


console.log(process.env.DB_HOST);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

//db 연결 여부
pool.getConnection((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.message);
    } else {
        console.log('Database connected successfully');
    }
});


app.get('/user', (req, res) => {
    pool.query('SELECT * FROM user', (err, result) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'get/user에서 오류 발생' });
        } else {
            res.status(200).json(result);
        }
    });
});

app.get('/user/:id', (req, res) => {
    let { id } = req.params;
    pool.query('SELECT * FROM user WHERE id = ?', id, (err, result) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'get/user/id에서 오류 발생' });
        } else {
            res.status(200).json(result);
        }
    })
})

app.post('/user', (req, res) => {
    let { user_id, user_pw, user_name } = req.body;
    pool.query('SELECT * from user where user_id = ?', user_id, (err, result) => {
        if (result.length > 0) {
            res.status(404).json({ result: "중복된 아이디 값이 있습니다" })
        }
        else {
            pool.query('INSERT INTO user (user_id, user_pw, user_name) VALUES (?,?,?)', [user_id, user_pw, user_name], (err, result => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ message: 'post/user에서 오류 발생' });
                } else {
                    res.status(200).json({ result })
                }
            }))
        }
    })
})

app.post('/login', (req, res) => {
    let { user_id, user_pw } = req.body;
    pool.query ('SELECT * FROM user WHERE user_id = ? AND user_pw = ?', [user_id, user_pw], (err, result) => {
        if (result.length === 1) {
            pool.query('SELECT * FROM user WHERE user_id = ?', [user_id], (err, result) => {
                if (err) {
                    console.error(err.message);
                    res.status(500).json({ message: 'post/login에서 오류 발생' });
                } else {
                    res.status(200).json({ result })
                }
            })
        }
        else {
            res.status(404).json({message : '아이디 혹은 회원가입이 일치하지 않습니다'})
        }
    })
})

app.get('/content', (req, res) => {
    pool.query('SELECT * FROM content', (err, result) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'post/login에서 오류 발생' });
        } else {
            res.status(200).json({ result })
        }
    })
})

app.get('/content/:id', (req, res) => {
    let { id } = req.params;
    pool.query('SELECT * FROM content WHERE id = ?', id, (err, result) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'post/login에서 오류 발생' });
        } else {
            res.status(200).json({ result })
        }
    })
})

app.post('/content', (req, res) => {
    let { user_name, content_name, content_number } = req.body;
    pool.query('INSERT INTO content (user_name, date, content_name, content_number) VALUES (?,?,DATE_FORMAT(NOW(), "%Y-%m-%d"),?)',
        [user_name, content_name, content_number],
        (err, result) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ message: 'post/login에서 오류 발생' });
            } else {
                res.status(200).json({ result })
            }
        }
    )
})

app.listen(port, () => {
    console.log(`Example app listeing on port ${port}`)
})