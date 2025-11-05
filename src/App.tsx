import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import NavBar from './components/NavBar'
import Protected from './components/Protected'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PostDetail from './pages/PostDetail'
import CrearPost from './pages/CrearPost'
import Perfil from './pages/Perfil'

function App () {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Container className="py-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/post/:id" element={<PostDetail />} />
            <Route path="/perfil" element={<Protected><Perfil /></Protected>} />
            <Route path="/crearPost" element={<Protected><CrearPost /></Protected>} />
          </Routes>
        </Container>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
