import Header from "../components/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function home() {
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${API_URL}/logout`);
            console.log(response.data);
            setSuccess(response.data?.message || "Logged out Successfully");
            setTimeout(() => navigate("/"), 1000);
        } catch (error) {
            console.error(
                "There was an error!",
                error.response?.data || error.message,
            );
            setError(
                error.response?.data?.message || error.message || "An error occurred",
            );
        }
    };

    const handleSubmit = async () => {
        try {
            let response;
            if (editingItem) {
                response = await axios.post(`${API_URL}/edit-list`, {
                    id: editingItem.id,
                    title,
                    status,
                });
                setSuccess(response.data?.message || "List Updated successfully");
            } else {
                response = await axios.post(`${API_URL}/add-list`, {
                    title,
                    status,
                });
                setSuccess(response.data?.message || "List Added successfully");
            }
            console.log(response.data);
            fetchList();
            setTitle("");
            setStatus("");
            setEditingItem(null);
            setShowForm(false);
            navigate("/home");
        } catch (error) {
            console.error(
                "There was an error!",
                error.response?.data || error.message,
            );
            setError(
                error.response?.data?.message || error.message || "An error occurred",
            );
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/delete-list`, { id });
            console.log(response.data);
            setSuccess(response.data?.message || "List Deleted successfully");
            fetchList();
        } catch (error) {
            console.error(
                "There was an error!",
                error.response?.data || error.message,
            );
            setError(
                error.response?.data?.message || error.message || "An error occurred",
            );
        }
    };

    const handleEdit = (item) => {
        setTitle(item.title);
        setStatus(item.status);
        setEditingItem(item);
        setShowForm(true);
    };

    const handleOpen = (item) => {
        navigate('/list-item', { state: { listId: item.id, listTitle: item.title } });
    };
    /*   const handleEditlist = async () => {
        try {
          const response = await axios.get(`${API_URL}/edit-list`, {
            title,
            stats,
          });
          setLists(response.data);
        } catch (error) {
          console.error(
            "There was an error!",
            error.response?.data || error.message,
          );
          alert(
            error.response?.data?.message || error.message || "An error occurred",
          );
        }
      }; */

    const fetchList = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-list`);
            console.log(response.data);
            setLists(response.data.list);
        } catch (error) {
            console.error(
                "There was an error!",
                error.response?.data || error.message,
            );
            setError(
                error.response?.data?.message || error.message || "An error occurred",
            );
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="p-6 relative z-10">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-white">My Tasks</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-2 rounded-xl transition-all shadow-lg shadow-teal-500/50 hover:shadow-xl active:scale-95 scale-100 hover:scale-105 font-medium"
                    >
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="bg-red-500/30 border border-red-400/30 text-red-200 text-sm mb-6 p-4 rounded-xl shadow-sm animate-pulse backdrop-blur">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/30 border border-green-400/30 text-green-200 text-sm mb-6 p-4 rounded-xl shadow-sm backdrop-blur">
                        {success}
                    </div>
                )}

                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-4xl shadow-2xl hover:shadow-2xl hover:border-white/30 transition-all duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Your Lists</h2>
                            <p className="text-slate-300 text-sm mt-1">Manage and organize your tasks effectively.</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white px-6 py-2 rounded-xl transition-all shadow-lg shadow-teal-500/50 active:scale-95 scale-100 hover:scale-105 font-semibold flex items-center gap-2"
                        >
                            <span className="text-xl leading-none">+</span> Add New List
                        </button>
                    </div>

                    {showForm && (
                        <div className="mb-10 p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-4xl animate-in fade-in slide-in-from-top-4 duration-300">
                            <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
                                {editingItem ? "✏️ Edit List" : "✨ Create New List"}
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-slate-200 uppercase">List Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-3 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-white/40 bg-white/10 backdrop-blur text-white placeholder-slate-300 transition-all hover:bg-white/15 hover:border-white/30 shadow-sm"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-2 text-slate-200 uppercase">Status</label>
                                    <div className="flex gap-2">
                                        {['Pending', 'In Progress', 'Completed'].map((statusOption) => (
                                            <button
                                                key={statusOption}
                                                onClick={() => setStatus(statusOption)}
                                                className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
                                                    status === statusOption
                                                        ? 'bg-linear-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/50'
                                                        : 'bg-white/10 text-slate-300 border border-white/20 hover:bg-white/15 hover:border-white/30'
                                                }`}
                                            >
                                                {statusOption}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingItem(null);
                                        setTitle("");
                                        setStatus("");
                                    }}
                                    className="px-6 py-3 bg-white/10 text-slate-200 hover:bg-white/20 border border-white/20 rounded-xl transition-all font-semibold hover:border-white/40"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="px-8 py-3 bg-linear-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 rounded-xl transition-all shadow-lg shadow-teal-500/50 font-bold active:scale-95 scale-100 hover:scale-105"
                                >
                                    {editingItem ? "Update Changes" : "Create List"}
                                </button>
                            </div>
                        </div>
                    )}

                    {lists.length === 0 ? (
                        <div className="text-center py-16 bg-white/5 rounded-2xl border-2 border-dashed border-white/20">
                            <svg className="w-16 h-16 mx-auto mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="text-slate-300 font-medium">No lists yet. Create your first list to get started!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {lists.map((item, index) => (
                                <div key={item.id || index} className="bg-white/5 backdrop-blur border border-white/20 rounded-2xl p-6 hover:bg-white/10 hover:border-white/30 transition-all duration-300 group hover:shadow-lg">
                                    <div className="flex items-start justify-between mb-4">
                                        <h3 className="text-lg font-bold text-white flex-1 pr-2">{item.title}</h3>
                                        <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </div>

                                    <div className="mb-6">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Completed' ? 'bg-green-500/30 text-green-200 border border-green-400/30' :
                                            item.status === 'In Progress' ? 'bg-blue-500/30 text-blue-200 border border-blue-400/30' :
                                                'bg-slate-500/30 text-slate-200 border border-slate-400/30'
                                            }`}>
                                            {item.status === 'Completed' && (
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            {item.status === 'In Progress' && (
                                                <svg className="w-3 h-3 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                            )}
                                            {item.status === 'Pending' && (
                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00-.293.707l-.707.707a1 1 0 101.414 1.414L9 9.414V6z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            {item.status}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleOpen(item)}
                                            className="flex-1 flex items-center justify-center gap-2 py-2 bg-linear-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-lg transition-all active:scale-90 shadow-lg shadow-teal-500/50 text-sm font-semibold"
                                            title="View details"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="p-2 bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20 rounded-lg transition-all active:scale-90 hover:border-white/40"
                                            title="Edit"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 bg-red-500/30 hover:bg-red-500/40 text-red-200 border border-red-400/30 rounded-lg transition-all active:scale-90 hover:border-red-400/50"
                                            title="Delete"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}

export default home;
