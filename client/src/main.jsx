import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import App from './App.jsx'
import Home from './pages/home.jsx'
import Register from './pages/register.jsx'
import ListItem from './pages/list-items.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import './css/global.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/list/:id"
          element={
            <ProtectedRoute>
              <ListItem />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  </StrictMode>
)
