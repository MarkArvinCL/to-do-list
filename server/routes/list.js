import express from "express";
import pool from "../db.js";

const router = express.Router();

/* READ ALL LISTS */
router.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM list ORDER BY title");
  res.json(rows);
});

/* CREATE LIST */
router.post("/", async (req, res) => {
  const { title } = req.body;
  await pool.query(
    "INSERT INTO list (title, status) VALUES ($1, 'active')",
    [title]
  );
  res.json({ message: "List created" });
});

/* UPDATE LIST */
router.put("/:id", async (req, res) => {
  const { title, status } = req.body;
  await pool.query(
    "UPDATE list SET title=$1, status=$2 WHERE id=$3",
    [title, status, req.params.id]
  );
  res.json({ message: "List updated" });
});

/* DELETE LIST */
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM list WHERE id=$1", [req.params.id]);
  res.json({ message: "List deleted" });
});

export default router;
