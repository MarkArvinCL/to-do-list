// Add a list
app.post('/add-list', async (req, res) => {
  const { listtitle } = req.body;
  if (!listtitle) return res.status(400).json({ success: false, message: 'List title required' });

  try {
    const id = randomUUID();
    const status = 'pending';

    // Insert into database
    await pool.query(
      'INSERT INTO list (id, title, status) VALUES ($1, $2, $3)',
      [id, listtitle, status]
    );

    // Return the newly created list object
    const newList = { id, title: listtitle, status };

    res.status(201).json({ success: true, message: 'List added successfully', list: newList });
  } catch (err) {
    console.error('Failed to add list:', err);
    res.status(500).json({ success: false, message: 'Failed to add list' });
  }
});
