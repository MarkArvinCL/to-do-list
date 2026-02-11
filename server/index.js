import express from 'express';
import { pool } from './db.js';
import bcrypt from 'bcrypt';
import { hashpass } from './components/hash.js';
import session from 'express-session';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(session({
    secret: 'Pepet',
}));

app.get('/get-session', (req, res) => {
    if (req.session.user) {
        res.status(200).json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ success: false });
    }
});
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username });
        const user = await pool.query('SELECT * FROM user_accounts WHERE username=$1', [username]);
        console.log('User query returned rows:', user.rows.length);
        if (user.rows.length > 0) {
            const match = await bcrypt.compare(password, user.rows[0].password);
            console.log('Password match:', match);
            if (match) {
                req.session.user = {
                    id: user.rows[0].id,
                    name: user.rows[0].name,
                };
                return res.status(200).json({ success: true, message: 'Login successful', user: req.session.user });
            }
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
        return res.status(401).json({ success: false, message: 'User not found' });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.get('/get-list', async (req, res) => {
     const list = await pool.query('SELECT * FROM list');
     res.status(200).json({success:true, list: list.rows});
});

app.post('/add-list', async (req, res) => {
const {title, status} = req.body;

await pool.query('INSERT INTO list (title, status) VALUES ($1, $2)', [title, status]);
res.status(200).json({success:true, message:"List added successfully" });
});


app.post('/edit-list', async (req, res) => {
const {id, title, status} = req.body;

await pool.query('UPDATE list SET title=$2, status=$3 WHERE id=$1', [id, title, status]);
res.status(200).json({success:true, message:"List Updated Successfully" });
});

app.post('/delete-list', async(req, res) => {
const {id} = req.body;

await pool.query('DELETE FROM list WHERE id=$1', [id]);
res.status(200).json({success:true, message:"List Deleted successfully" });
});

app.post('/get-items', async(req, res) => {
const {listId} = req.body;
const items = await pool.query('SELECT * FROM items WHERE list_id=$1', [listId]);
res.status(200).json({success:true,items: items.rows});
});

app.post('/add-items', async(req, res) => {
const {listId ,desc, status} = req.body;

await pool.query('INSERT INTO items (list_id, description, status) VALUES ($1, $2, $3)', [listId,desc, status || "pending"]);
res.status(200).json({success:true, message:"Items added successfully" });
console.log(listId);
});

app.post('/edit-items', async(req, res) => {
const {id, desc} = req.body;
await pool.query('UPDATE items SET description=$2 WHERE id=$1', [id, desc]);
res.status(200).json({success:true, message:"ITEMS Updated Successfully" });

});

app.post('/delete-items', async(req, res) => {
const {id} = req.body;

await pool.query('DELETE FROM items WHERE id=$1', [id]);
res.status(200).json({success:true, message:"ITEMS Deleted successfully" });
});

app.post('/register', async(req, res) => {
    try {
        const {name, username, password, confirm} = req.body;
        if (password !== confirm) {
            return res.status(400).json({success: false, message: "Confirm password and password do not match"});
        }
        
        // Check if username already exists
        const existingUser = await pool.query('SELECT id FROM user_accounts WHERE username = $1', [username]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({success: false, message: "Username already exists"});
        }
        
        const salt = 10;
        const hash = await hashpass(password, salt);
        await pool.query('INSERT INTO user_accounts (name, username, password) VALUES ($1, $2, $3)', [name, username, hash]);
        res.status(200).json({success: true, message: "Registered successfully"});
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({success: false, message: 'Server error'});
    }
});



app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
    res.status(200).json({ success: true, message: "Logged out successfully" });  
    });
});

app.listen(PORT, () => {
console.log(`Server listening on port ${PORT}`);
});