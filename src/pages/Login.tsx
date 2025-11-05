import React, { useState } from 'react'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useAuth } from '../contexts/AuthContext'
import "./Login.css"

interface User {
  id: number
  nickName: string
  email?: string
}

const Login = () => {
  const [nickName, setNickName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { login } = useAuth()
  const nav = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const resp = await api.get<User[]>('/users')
      const found = resp.data.find(u => u.nickName === nickName)

      if (!found) {
        setError('Usuario no encontrado')
        return
      }

      if (password !== '123456') {
        setError('Contraseña inválida')
        return
      }

      login(found)
      nav('/')
    } catch (err) {
      console.error(err)
      setError('Error al conectar con la API')
    }
  }

  return (
    <div className='login-background'>
      <Container className='d-flex justify-content-center align-items-top'>
        <Card className="login-card p-4 shadow-lg">
          <Card.Body>
            <h3 className="mb-3 justify-content-center">Ingresar</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label>NickName</Form.Label>
                <Form.Control 
                  value={nickName} 
                  onChange={e => setNickName(e.target.value)} 
                  required />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <Form.Text>La contraseña fija para este TP es <strong>123456</strong></Form.Text>
              </Form.Group>

              <Button type="submit">Ingresar</Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  )
}

export default Login
