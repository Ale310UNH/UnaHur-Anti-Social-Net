import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const NavBar = () => {
  const { user, logout } = useAuth()
  const nav = useNavigate()

  const doLogout = () => {
    logout()
    nav('/login')
  }

  return (
    <Navbar expand="lg"  style={{
        background: 'linear-gradient(135deg, #b2ebf2, #a5d6a7)',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        padding: '0.6rem 1rem'
      }}>
      <Container>
        <Navbar.Brand as={Link} to="/" style={{
            color: '#00695c',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            textShadow: '0 1px 1px rgba(255,255,255,0.5)',
          }}>🌸 UnaHur Anti-Social Net</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={{
                color: '#004d40',
                fontWeight: 500,
              }}>Home</Nav.Link>
            {user && <Nav.Link as={Link} to="/crearPost" style={{
                  color: '#004d40',
                  fontWeight: 500,
                }}>Crear Post</Nav.Link>}
          </Nav>
          <Nav className="align-items-center">
            {user ? (
              <>
                <Nav.Link as={Link} to="/perfil" style={{
                    color: '#004d40',
                    fontWeight: 500,
                  }}>{user.nickName || 'Perfil'}</Nav.Link>
                <Button variant="outline-secondary" size="sm" className="ms-2" style={{
                    borderColor: '#00796b',
                    color: '#00796b',
                    fontWeight: 500,
                    borderRadius: '20px',
                    transition: 'all 0.2s ease',
                  }} onClick={doLogout}>Salir</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login"style={{
                    color: '#004d40',
                    fontWeight: 500,
                  }} >Ingresar</Nav.Link>
                <Nav.Link as={Link} to="/register"  style={{
                    color: '#004d40',
                    fontWeight: 500,
                  }}>Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
