import { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiEdit, FiTrash2 } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const API = "http://localhost:3000";

function Home() {
  const [lists, setLists] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("pending");
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState(null);

  // Fetch all lists
  const fetchLists = async () => {
    try {
      const res = await axios.get(`${API}/get-lists`, { withCredentials: true });
      if (res.data.success) setLists(res.data.lists || []);
    } catch {
      setError("Failed to fetch lists");
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  // Add new list
  const addList = async () => {
    if (!title.trim()) return setError("Title required");

    try {
      const res = await axios.post(
        `${API}/add-list`,
        { title, status },
        { withCredentials: true }
      );

      if (res.data.success) {
        fetchLists();
        setModalOpen(false);
        setTitle("");
        setStatus("pending");
        setError("");
      } else setError(res.data.message || "Failed to add list");
    } catch (err) {
      console.error(err);
      setError("Failed to add list");
    }
  };

  // Open edit modal
  const openEdit = (list) => {
    setEditId(list.id);
    setTitle(list.title);
    setStatus(list.status);
    setEditModal(true);
  };

  // Update list
  const updateList = async () => {
    try {
      const res = await axios.put(
        `${API}/update-list/${editId}`,
        { title, status },
        { withCredentials: true }
      );

      if (res.data.success) {
        fetchLists();
        setEditModal(false);
        setTitle("");
        setStatus("pending");
        setError("");
      } else setError(res.data.message || "Failed to update list");
    } catch (err) {
      console.error(err);
      setError("Failed to update list");
    }
  };

  // Delete list
  const deleteList = async (id) => {
    if (!confirm("Are you sure you want to delete this list?")) return;

    try {
      const res = await axios.delete(`${API}/delete-list/${id}`, { withCredentials: true });
      if (res.data.success) fetchLists();
      else setError(res.data.message || "Failed to delete list");
    } catch (err) {
      console.error(err);
      setError("Failed to delete list");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">Your To-Do Lists</h1>

      <button
        onClick={() => setModalOpen(true)}
        className="flex gap-2 items-center bg-white/20 px-4 py-2 rounded-xl mb-4"
      >
        <FiPlus /> Add List
      </button>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      <div className="mt-4 w-full max-w-3xl">
        {lists.length === 0 ? (
          <p className="text-center text-slate-300 p-4">No lists yet. Click "Add List" to create one.</p>
        ) : (
          lists.map((list) => (
            <Link
              to={`/list/${list.id}`}
              key={list.id}
              className="flex justify-between items-center bg-white/10 p-4 mb-2 rounded-xl hover:bg-white/20 transition"
            >
              <div>
                <p className="font-semibold">{list.title}</p>
                <p className="text-sm text-slate-300">{list.status}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    openEdit(list);
                  }}
                >
                  <FiEdit />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    deleteList(list.id);
                  }}
                >
                  <FiTrash2 />
                </button>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* ADD MODAL */}
      {modalOpen && (
        <Modal
          title="Add List"
          onClose={() => setModalOpen(false)}
          onSave={addList}
          setTitle={setTitle}
          setStatus={setStatus}
          titleValue={title}
          statusValue={status}
        />
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <Modal
          title="Edit List"
          onClose={() => setEditModal(false)}
          onSave={updateList}
          setTitle={setTitle}
          setStatus={setStatus}
          titleValue={title}
          statusValue={status}
        />
      )}
    </div>
  );
}

const Modal = ({ title, onClose, onSave, setTitle, setStatus, titleValue, statusValue }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-slate-800 p-6 rounded-xl w-96 relative">
      <button onClick={onClose} className="absolute right-4 top-4">
        <IoClose />
      </button>

      <h2 className="text-2xl mb-4">{title}</h2>

      <input
        value={titleValue}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 mb-3 rounded text-black"
        placeholder="Title"
      />

      <select
        value={statusValue}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full p-2 mb-4 rounded text-black"
      >
        <option value="pending">Pending</option>
        <option value="done">Done</option>
      </select>

      <button onClick={onSave} className="w-full py-2 rounded bg-white text-black">
        Save
      </button>
    </div>
  </div>
);

export default Home;
