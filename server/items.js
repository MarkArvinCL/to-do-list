import express from "express";
import pool from "../db.js";

const router = express.Router();

/* READ ITEMS BY LIST */
router.get("/:listId", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM items WHERE list_id=$1",
    [req.params.listId]
  );
  res.json(rows);
});

/* CREATE ITEM */
router.post("/", async (req, res) => {
  const { list_id, description } = req.body;
  await pool.query(
    "INSERT INTO items (list_id, description, status) VALUES ($1,$2,'pending')",
    [list_id, description]
  );
  res.json({ message: "Item added" });
});

/* UPDATE ITEM */
router.put("/:id", async (req, res) => {
  const { description, status } = req.body;
  await pool.query(
    "UPDATE items SET description=$1, status=$2 WHERE id=$3",
    [description, status, req.params.id]
  );
  res.json({ message: "Item updated" });
});

/* DELETE ITEM */
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM items WHERE id=$1", [req.params.id]);
  res.json({ message: "Item deleted" });
});

export default router;
