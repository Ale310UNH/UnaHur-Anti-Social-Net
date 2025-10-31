import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PostDetail from './pages/PostDetail'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'

const Protected: React.FC<{children: JSX.Element}> = ({ children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}

const App: React.FC = () => {
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
            <Route path="/profile" element={<Protected><Profile /></Protected>} />
            <Route path="/create" element={<Protected><CreatePost /></Protected>} />
          </Routes>
        </Container>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
