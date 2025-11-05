import React, { useState } from 'react'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import "./Login.css"

interface User {
  id: number
  nickName: string
  email: string
}

const Register = () => {
  const [nickName, setNickName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const nav = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!nickName || !email) {
      setError('NickName y email son requeridos')
      return
    }

    try {
      const resp = await api.post<User>('/users', { nickName, email })
      setSuccess('Usuario creado. Podés iniciar sesión.')
      setTimeout(() => nav('/login'), 800)
    } catch (err: any) {
      console.error(err)
      const msg = err?.response?.data?.message || 'No se pudo crear el usuario'
      setError(msg)
    }
  }

  return (
    <div className='login-background'>
      <Container className='d-flex justify-content-center align-items-top'>
        <Card className="login-card p-4 shadow-lg">
          <Card.Body>
            <h3 className="mb-3">Registro</h3>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-2">
                <Form.Label>NickName</Form.Label>
                <Form.Control
                  value={nickName}
                  onChange={e => setNickName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </Form.Group>

              <Button type="submit">Registrar</Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
  </div>
  )
}

export default Register
