// Edit a list (title and/or status)
app.post('/edit-list', async (req, res) => {
  const { id, listtitle, status } = req.body;

  if (!id || (!listtitle && !status)) {
    return res.status(400).json({ success: false, message: 'List ID and at least one field required' });
  }

  try {
    // Build dynamic query based on which fields are provided
    const fields = [];
    const values = [];
    let counter = 1;

    if (listtitle) {
      fields.push(`title=$${counter}`);
      values.push(listtitle);
      counter++;
    }

    if (status) {
      fields.push(`status=$${counter}`);
      values.push(status);
      counter++;
    }

    const query = `UPDATE list SET ${fields.join(', ')} WHERE id=$${counter}`;
    values.push(id);

    await pool.query(query, values);

    res.status(200).json({ success: true, message: 'List updated successfully' });
  } catch (err) {
    console.error('Failed to update list:', err);
    res.status(500).json({ success: false, message: 'Failed to update list' });
  }
});
