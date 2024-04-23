// index.js
const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path'); // Import the path module

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodejs_auth'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
// Serve login page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Signup Route
// app.post('/signup', (req, res) => {
//     console.log(req.body); // Log the request body
//     const { username, email, password } = req.body;
//     // const hashedPassword = bcrypt.hashSync(password, 10);
//     const user = { username, email, password: password };
//     db.query('INSERT INTO users SET ?', user, (err, result) => {
//         if (err) {
//             res.status(500).json({ message: 'Signup failed' });
//         } else {
//             res.status(200).json({ message: 'Signup successful' });
//         }
//     });
// });

// Signup Route
// Signup Route
// app.post('/signup', (req, res) => {
//     const { username, email, password } = req.body;
//     console.log(req.body);
//     // Check if any required field is missing or empty
//     if (!username || !email || !password) {
//         return res.status(400).json({ message: 'Username, email, and password are required' });
//     }
    
//     // Proceed with inserting data into the database
//     const user = { username, email, password };
//     db.query('INSERT INTO users SET ?', user, (err, result) => {
//         if (err) {
//             console.error(err); // Log any database errors for debugging
//             res.status(500).json({ message: 'Signup failed' });
//         } else {
//             console.log('User signed up successfully:', result); // Log successful signup for debugging
//             res.status(200).json({ message: 'Signup successful' });
//         }
//     });
// });


// const bcrypt = require('bcrypt');

app.post('/signup', (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body);

    // Check if any required field is missing or empty
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    // Hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Password hashing failed' });
        }

        // Proceed with inserting data into the database
        const user = { username, email, password: hashedPassword };
        db.query('INSERT INTO users SET ?', user, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Signup failed' });
            }
            console.log('User signed up successfully:', result);
            res.status(200).json({ message: 'Signup successful' });
        });
    });
});



// Login Route
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', email, (err, results) => {
        if (err) {
            res.status(500).json({ message: 'Login failed' });
        } else {
            if (results.length > 0) {
                const user = results[0];
                if (bcrypt.compareSync(password, user.password)) {
                    res.status(200).json({ message: 'Login successful' });
                } else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
