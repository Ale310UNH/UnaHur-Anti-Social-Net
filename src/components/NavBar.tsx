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
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">UnaHur Anti-Social Net</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {user && <Nav.Link as={Link} to="/create">Crear Post</Nav.Link>}
          </Nav>
          <Nav className="align-items-center">
            {user ? (
              <>
                <Nav.Link as={Link} to="/profile">{user.nickName || 'Perfil'}</Nav.Link>
                <Button variant="outline-secondary" size="sm" className="ms-2" onClick={doLogout}>Salir</Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Ingresar</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
