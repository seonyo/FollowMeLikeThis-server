const express = require('express')
const cors = require('cors')
const mysql = require('mysql2')
const app = express()

const port = 3000

app.use(express.json());
app.use(cors());

const pool = mysql.createPool({
    host : 'localhost',
    user : 'root',
    password : '990327',
    database : 'follow_me_like_this'
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
    let {id} = req.params;
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
    let {user_id, user_pw, user_name} = req.body;
    pool.query('INSERT INTO user (user_id, user_pw, user_name) VALUES (?,?,?)', [user_id, user_name, user_pw], (err, result => {
        if(err){
            console.error(err.message);
            res.status(500).json({ message : 'post/user에서 오류 발생'});
        } else {
            res.status(200).json({result})
        }
    }))
})

app.post('/login', (req, res) => {
    let {user_name} = req.body;
    pool.query('SELECT * FROM user WHERE user_id = ?', [user_name], (err, result) => {
        if(err){
            console.error(err.message);
            res.status(500).json({ message : 'post/login에서 오류 발생'});
        } else {
            res.status(200).json({result})
        }
    })
})


app.listen(port, () => {
    console.log(`Example app listeing on port ${port}`)
})