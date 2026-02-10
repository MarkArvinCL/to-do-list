const express = require('express')
const router = express.Router()

// Get all todos
router.get('/', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const sql = 'SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC'
  req.db.query(sql, [req.session.user.id], (err, result) => {
    if (err) return res.status(500).json(err)
    res.json(result)
  })
})

// Add todo
router.post('/', (req, res) => {
  const { title, description } = req.body
  const userId = req.session.user.id

  const sql = 'INSERT INTO todos (user_id, title, description) VALUES (?, ?, ?)'
  req.db.query(sql, [userId, title, description], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ success: true })
  })
})

// Update todo
router.put('/:id', (req, res) => {
  const { title, description } = req.body

  const sql = 'UPDATE todos SET title=?, description=? WHERE id=?'
  req.db.query(sql, [title, description, req.params.id], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ success: true })
  })
})

// Delete todo
router.delete('/:id', (req, res) => {
  const sql = 'DELETE FROM todos WHERE id=?'
  req.db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json(err)
    res.json({ success: true })
  })
})

module.exports = router
