import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:3000";
const ListContext = createContext();

export function useLists() {
  return useContext(ListContext);
}

export function ListProvider({ children }) {
  const [lists, setLists] = useState([]);
  const [error, setError] = useState("");

  const fetchLists = async () => {
    try {
      const res = await axios.get(`${API}/get-lists`, { withCredentials: true });
      if (res.data.success) setLists(res.data.lists || []);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch lists.");
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <ListContext.Provider value={{ lists, setLists, error, fetchLists }}>
      {children}
    </ListContext.Provider>
  );
}
