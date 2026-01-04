const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your-secret-key'; // In production, use env variable

app.use(cors());
app.use(bodyParser.json());

// Signup
app.post('/api/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run(`INSERT INTO users (name, email, password) VALUES (?, ?, ?)`, [name, email, hashedPassword], function(err) {
    if (err) {
      return res.status(400).json({ error: 'User already exists' });
    }
    res.status(201).json({ message: 'User created successfully' });
  });
});

// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
});

// Middleware to verify token (optional for invoices)
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Invoices CRUD
app.get('/api/invoices', (req, res) => {
  db.all(`SELECT * FROM invoices`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/invoices', (req, res) => {
  const { invoice_number, client_name, date, amount, status } = req.body;
  if (!invoice_number || !client_name || !date || !amount || !status) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(`INSERT INTO invoices (invoice_number, client_name, date, amount, status) VALUES (?, ?, ?, ?, ?)`,
    [invoice_number, client_name, date, amount, status], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

app.put('/api/invoices/:id', (req, res) => {
  const { id } = req.params;
  const { invoice_number, client_name, date, amount, status } = req.body;

  db.run(`UPDATE invoices SET invoice_number = ?, client_name = ?, date = ?, amount = ?, status = ? WHERE id = ?`,
    [invoice_number, client_name, date, amount, status, id], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ message: 'Invoice updated' });
  });
});

app.delete('/api/invoices/:id', (req, res) => {
  const { id } = req.params;

  db.run(`DELETE FROM invoices WHERE id = ?`, [id], function(err) {
    if (err) {
      return res.status(400).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});