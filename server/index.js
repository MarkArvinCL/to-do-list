// index.js
import express from 'express';
import session from 'express-session';
import { pool } from './db.js';
import { randomUUID } from 'crypto';
import { hashPassword, comparePassword } from './components/hash.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecretkey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true } // secure: true in production with HTTPS
}));

// --- Test Route ---
app.get('/', (req, res) => res.send('Server is working!'));

// --- Auth Routes ---
app.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match' });
  }

  try {
    const hashedPassword = await hashPassword(password);
    const id = randomUUID();

    await pool.query(
      'INSERT INTO user_accounts (id, email, password, name) VALUES ($1, $2, $3, $4)',
      [id, email, hashedPassword, name]
    );

    return res.status(201).json({ success: true, message: 'Registration successful' });

  } catch (err) {
    console.error('Registration error:', err);

    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    return res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  let { email, password } = req.body;
  email = typeof email === 'string' ? email.trim() : '';
  password = typeof password === 'string' ? password : '';

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM user_accounts WHERE email=$1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = result.rows[0];
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    req.session.user = { id: user.id, name: user.name, email: user.email };

    return res.status(200).json({ success: true, message: 'Login successful', user: req.session.user });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// --- Session & Logout ---
app.get('/get-session', (req, res) => {
  if (req.session.user) return res.status(200).json({ success: true, session: true, user: req.session.user });
  res.status(200).json({ success: true, session: false });
});

app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
    res.clearCookie('connect.sid');
    res.status(200).json({ success: true, message: 'Logout successful' });
  });
});

// --- List Routes ---
// GET all lists
app.get('/get-lists', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM list ORDER BY title ASC');
    res.status(200).json({ success: true, lists: result.rows });
  } catch (err) {
    console.error('Get lists error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch lists' });
  }
});

// ADD list
app.post('/add-list', async (req, res) => {
  const { listtitle, status } = req.body;
  if (!listtitle) return res.status(400).json({ success: false, message: 'List title required' });

  try {
    const id = randomUUID();
    await pool.query('INSERT INTO list (id, title, status) VALUES ($1, $2, $3)', [id, listtitle, status || 'pending']);
    res.status(201).json({ success: true, message: 'List added successfully', id });
  } catch (err) {
    console.error('Add list error:', err);
    res.status(500).json({ success: false, message: 'Failed to add list' });
  }
});

// UPDATE list
app.put('/update-list/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;

  if (!title || !status) return res.status(400).json({ success: false, message: 'All fields required' });

  try {
    await pool.query('UPDATE list SET title=$1, status=$2 WHERE id=$3', [title, status, id]);
    res.json({ success: true, message: 'List updated successfully' });
  } catch (err) {
    console.error('Update list error:', err);
    res.status(500).json({ success: false, message: 'Failed to update list' });
  }
});

// DELETE list
app.delete('/delete-list/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM list WHERE id=$1', [id]);
    res.json({ success: true, message: 'List deleted successfully' });
  } catch (err) {
    console.error('Delete list error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete list' });
  }
});

// --- Items Routes ---
// GET items by list
app.get('/items/:listId', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM items WHERE list_id=$1', [req.params.listId]);
    res.status(200).json({ success: true, items: rows });
  } catch (err) {
    console.error('Get items error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch items' });
  }
});

// ADD item
app.post('/add-item', async (req, res) => {
  const { list_id, title, status } = req.body;
  if (!list_id || !title) return res.status(400).json({ success: false, message: 'List ID and title required' });

  try {
    const id = randomUUID();
    const itemStatus = status || 'pending';

    await pool.query('INSERT INTO items (id, list_id, description, status) VALUES ($1, $2, $3, $4)',
      [id, list_id, title, itemStatus]);

    res.status(201).json({ success: true, message: 'Item added successfully', item: { id, list_id, description: title, status: itemStatus } });
  } catch (err) {
    console.error('Add item error:', err);
    res.status(500).json({ success: false, message: 'Failed to add item' });
  }
});

// UPDATE item
app.put('/update-item/:id', async (req, res) => {
  const { id } = req.params;
  const { title, status } = req.body;

  if (!title && !status) return res.status(400).json({ success: false, message: 'At least one field required' });

  try {
    if (title && status) await pool.query('UPDATE items SET description=$2, status=$3 WHERE id=$1', [id, title, status]);
    else if (title) await pool.query('UPDATE items SET description=$2 WHERE id=$1', [id, title]);
    else if (status) await pool.query('UPDATE items SET status=$2 WHERE id=$1', [id, status]);

    res.status(200).json({ success: true, message: 'Item updated successfully' });
  } catch (err) {
    console.error('Update item error:', err);
    res.status(500).json({ success: false, message: 'Failed to update item' });
  }
});

// DELETE item
app.delete('/delete-item/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ success: false, message: 'Item ID required' });

  try {
    await pool.query('DELETE FROM items WHERE id=$1', [id]);
    res.status(200).json({ success: true, message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Delete item error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete item' });
  }
});

// --- Start Server ---
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
