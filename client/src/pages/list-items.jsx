import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

const API = "http://localhost:3000";

function ListItem() {
  const { id } = useParams(); // list_id
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch items for this list
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API}/items/${id}`, { withCredentials: true });
      setItems(res.data.items || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch items.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, [id]);

  // Add/Edit item
  const saveItem = async () => {
    if (!title.trim()) return setError("Item title cannot be empty.");

    setIsLoading(true);

    try {
      if (editItem) {
        // Edit existing item
        const res = await axios.post(`${API}/edit-item`, {
          id: editItem.id,
          title,
          status,
        }, { withCredentials: true });

        if (res.data.success) {
          fetchItems();
          setModalOpen(false);
          setTitle("");
          setStatus("pending");
          setEditItem(null);
          setError("");
        } else setError(res.data.message || "Failed to update item.");
      } else {
        // Add new item
        const res = await axios.post(`${API}/add-item`, {
          list_id: id,
          title,
          status,
        }, { withCredentials: true });

        if (res.data.success) {
          fetchItems();
          setModalOpen(false);
          setTitle("");
          setStatus("pending");
          setError("");
        } else setError(res.data.message || "Failed to add item.");
      }
    } catch (err) {
      console.error(err);
      setError(editItem ? "Failed to update item." : "Failed to add item.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete item
  const deleteItem = async (itemId) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await axios.post(`${API}/delete-item`, { id: itemId }, { withCredentials: true });
      if (res.data.success) fetchItems();
      else setError(res.data.message || "Failed to delete item.");
    } catch (err) {
      console.error(err);
      setError("Failed to delete item.");
    }
  };

  // Open edit modal
  const openEditModal = (item) => {
    setEditItem(item);
    setTitle(item.title);
    setStatus(item.status || "pending");
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 flex flex-col items-center">
      <h2 className="text-4xl font-bold text-white mb-8">List Items</h2>

      <button
        onClick={() => {
          setModalOpen(true);
          setEditItem(null);
          setTitle("");
          setStatus("pending");
        }}
        className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl mb-4"
      >
        <FiPlus /> Add New Item
      </button>

      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl mb-4"
      >
        Go Back
      </button>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg overflow-hidden">
        {items.length === 0 && (
          <p className="p-6 text-slate-300 text-center">No items yet. Click "Add New Item" to create one.</p>
        )}

        {items.map((item) => (
          <div key={item.id} className="p-4 border-b border-white/20 flex justify-between items-center hover:bg-white/10 transition">
            <span className="text-white">{item.title}</span>
            <span className={`text-sm font-medium ${item.status === "done" ? "text-green-400" : "text-yellow-400"}`}>
              {item.status}
            </span>
            <div className="flex gap-2">
              <button onClick={() => openEditModal(item)} className="text-white/70 hover:text-white transition">
                <FiEdit size={18} />
              </button>
              <button onClick={() => deleteItem(item.id)} className="text-red-400 hover:text-red-600 transition">
                <FiTrash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-md relative">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-white hover:text-red-400 transition">
              <IoClose size={24} />
            </button>

            <h2 className="text-2xl font-bold text-white mb-4">{editItem ? "Edit Item" : "Add New Item"}</h2>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter item title..."
              className="w-full px-4 py-3 rounded-lg bg-white/30 text-white placeholder-white/70 border border-white/20 mb-4 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-white/30 text-white border border-white/20 mb-4 focus:outline-none focus:ring-2 focus:ring-white/40 transition"
            >
              <option value="pending">Pending</option>
              <option value="done">Done</option>
            </select>

            <button
              onClick={saveItem}
              disabled={isLoading}
              className="w-full py-3 rounded-lg font-medium text-slate-900 bg-white/90 hover:bg-white transition disabled:opacity-60"
            >
              {isLoading ? (editItem ? "Updating..." : "Adding...") : (editItem ? "Update Item" : "Add Item")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListItem;
