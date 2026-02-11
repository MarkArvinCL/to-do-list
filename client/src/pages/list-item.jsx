import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function ListItem() {
    const location = useLocation();
    const navigate = useNavigate();
    const { listId, listTitle } = location.state || {};
    const containerRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [desc, setDesc] = useState("");
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editDesc, setEditDesc] = useState("");
    const [itemStatus, setItemStatus] = useState("pending");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [addingItem, setAddingItem] = useState(false);

    const handleMouseMove = (e) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }
    };

    const fetchItems = async () => {
        try {
            const response = await axios.post(`${API_URL}/get-items`, { listId });
            setItems(response.data.items);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const handleAddItem = async () => {
        if (!desc.trim()) {
            setError("Please enter a description");
            return;
        }

        setAddingItem(true);
        setError("");
        try {
            const response = await axios.post(`${API_URL}/add-items`, { listId, desc, status: itemStatus });
            setDesc("");
            setItemStatus("pending");
            setError("");
            setSuccess("Item added successfully");
            fetchItems();
        } catch (error) {
            console.error("Error adding item:", error);
            setError(error.response?.data?.message || "Error adding item");
        } finally {
            setAddingItem(false);
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item.id);
        setEditDesc(item.description);
    };

    const handleSaveEdit = async () => {
        if (!editDesc.trim()) {
            setError("Description cannot be empty");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/edit-items`, { id: editingItem, desc: editDesc });
            setEditingItem(null);
            setError("");
            setSuccess("Item updated successfully");
            fetchItems();
        } catch (error) {
            console.error("Error updating item:", error);
            setError(error.response?.data?.message || "Error updating item");
        }
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setEditDesc("");
    };

    const handleDeleteItem = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/delete-items`, { id });
            setError("");
            setSuccess("Item deleted successfully");
            fetchItems();
        } catch (error) {
            console.error("Error deleting item:", error);
            setError(error.response?.data?.message || "Error deleting item");
        }
    };

    useEffect(() => {
        if (listId) {
            fetchItems();
        }
    }, [listId]);

    if (!listId) {
        return (
            <div 
                ref={containerRef}
                onMouseMove={handleMouseMove}
                className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden"
            >
                {/* Animated background orbs */}
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
                <div 
                    className="absolute w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
                    style={{
                        top: `${mousePos.y - 192}px`,
                        left: `${mousePos.x - 192}px`,
                        transition: "all 0.3s ease-out",
                        pointerEvents: "none"
                    }}
                ></div>

                <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full border border-white/20 relative z-10">
                    <svg className="w-12 h-12 mx-auto mb-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-slate-100 mb-6 font-medium">No list selected. Please choose a list from the home page.</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full px-6 py-3 bg-linear-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/50 rounded-xl transition-all shadow-lg font-bold active:scale-95"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden"
        >
            {/* Animated background orbs */}
            <div className="absolute -top-40 -left-40 w-80 h-80 bg-teal-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
            <div 
                className="absolute w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"
                style={{
                    top: `${mousePos.y - 192}px`,
                    left: `${mousePos.x - 192}px`,
                    transition: "all 0.3s ease-out",
                    pointerEvents: "none"
                }}
            ></div>

            <div className="relative z-10 p-6 max-w-6xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/home')}
                        className="bg-white/10 backdrop-blur-xl border border-white/20 text-teal-400 hover:bg-white/20 px-6 py-2 rounded-xl transition-all shadow-lg hover:shadow-teal-500/20 active:scale-95 font-semibold flex items-center gap-2 mb-6"
                    >
                        <span>←</span> Back
                    </button>
                    <div>
                        <h1 className="text-4xl font-extrabold text-white">{listTitle}</h1>
                        <p className="text-slate-300/70 text-sm mt-1 font-medium">Manage your items for this list</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/20 backdrop-blur-xl border border-red-500/50 text-red-200 text-sm mb-6 p-4 rounded-xl shadow-lg animate-pulse">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/20 backdrop-blur-xl border border-green-500/50 text-green-200 text-sm mb-6 p-4 rounded-xl shadow-lg">
                        {success}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Add Item Section */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl">
                        <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                            <svg className="w-6 h-6 text-teal-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.5 1.5H5.75A2.25 2.25 0 0 0 3.5 3.75v12.5A2.25 2.25 0 0 0 5.75 18.5h8.5a2.25 2.25 0 0 0 2.25-2.25V10" strokeWidth={0} />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6v8m-4-4h8" stroke="currentColor" strokeWidth={2} />
                            </svg>
                            Add New Task
                        </h2>
                        <div className="grid grid-cols-1 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-100 uppercase">Description</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/10 text-white placeholder-slate-400 transition-all font-medium"
                                    value={desc}
                                    placeholder="Enter task description..."
                                    onChange={(e) => {
                                        setDesc(e.target.value);
                                        if (error) setError("");
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-slate-100 uppercase">Status</label>
                                <div className="flex gap-2">
                                    {['pending', 'in-progress', 'completed'].map((statusOption) => (
                                        <button
                                            key={statusOption}
                                            onClick={() => setItemStatus(statusOption)}
                                            className={`flex-1 px-4 py-3 rounded-xl transition-all font-semibold capitalize ${
                                                itemStatus === statusOption
                                                    ? 'bg-linear-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/50'
                                                    : 'bg-white/10 text-slate-300 border border-white/20 hover:bg-white/20'
                                            }`}
                                        >
                                            {statusOption.replace('-', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleAddItem}
                            disabled={addingItem}
                            className="w-full py-4 bg-linear-to-r from-teal-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-teal-500/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg font-bold text-lg active:scale-[0.98]"
                        >
                            {addingItem ? 'Adding to list...' : 'Add Task to List'}
                        </button>
                    </div>

                    {/* Items Section */}
                    <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Tasks ({items.length})</h2>
                            <div className="h-1 flex-1 mx-4 bg-white/10 rounded-full"></div>
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-12 bg-white/5 rounded-2xl border-2 border-dashed border-white/20">
                                <svg className="w-12 h-12 mx-auto mb-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-slate-300 font-medium">No tasks yet. Ready to start?</p>
                            </div>
                        ) : (
                            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                                {items.map((item) => (
                                    <div key={item.id} className="bg-white/10 border border-white/20 p-4 rounded-xl hover:bg-white/20 transition-all group border-l-4 border-l-teal-400">
                                        {editingItem === item.id ? (
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    value={editDesc}
                                                    onChange={(e) => setEditDesc(e.target.value)}
                                                    className="w-full px-4 py-2 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/10 text-white"
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={handleSaveEdit}
                                                        className="flex-1 px-4 py-2 bg-linear-to-r from-teal-500 to-cyan-500 text-white rounded-lg font-bold transition-all hover:shadow-lg"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="px-4 py-2 bg-white/10 text-slate-300 hover:bg-white/20 rounded-lg font-bold transition-all border border-white/20"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-base font-medium mb-2 ${item.status === 'completed' ? 'text-slate-400 line-through' : 'text-white'}`}>
                                                        {item.description}
                                                    </p>
                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${item.status === 'completed' ? 'bg-green-500/30 text-green-200 border border-green-500/50' :
                                                        item.status === 'in-progress' ? 'bg-blue-500/30 text-blue-200 border border-blue-500/50' :
                                                            'bg-slate-500/30 text-slate-200 border border-slate-500/50'
                                                        }`}>
                                                        {item.status === 'completed' && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                                        {item.status === 'in-progress' && <svg className="w-3 h-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                                                        {item.status === 'pending' && <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                    <button
                                                        onClick={() => handleEditClick(item)}
                                                        className="p-2 bg-teal-500/20 text-teal-300 hover:bg-teal-500/40 rounded-lg transition-all border border-teal-500/30"
                                                        title="Edit Task"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="p-2 bg-red-500/20 text-red-300 hover:bg-red-500/40 rounded-lg transition-all border border-red-500/30"
                                                        title="Delete Task"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListItem;
