import React, { useEffect, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { api } from '../api'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import './CrearPost.css'

interface Tag {
  id: number
  name: string
}

//Creamos el post
const CrearPost = () => {
  const [description, setDescription] = useState('')
  const [imgUrls, setImgUrls] = useState<string[]>([''])
  const [tags, setTags] = useState<Tag[]>([])
  const [seleccionTags, setSeleccionTags] = useState<number[]>([])
  const [error, setError] = useState('')
  const { user } = useAuth()
  const nav = useNavigate()

  // Traer etiquetas
  useEffect(() => {
    api.get('/tags')
      .then(r => setTags(r.data || []))
      .catch(() => {})
  }, [])

  // Manejo de imágenes
  const handleImgChange = (i:number, v:string) => {
    const copy = [...imgUrls]; copy[i] = v; setImgUrls(copy)
  }
  const agregarCampoImagen = () => setImgUrls([...imgUrls, ''])

  // Manejo de selección de tags
  const elegirTag = (id:number) => {
    setSeleccionTags(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id])
  }

  // Submit
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!description) { setError('La descripción es obligatoria'); return }
    if (!user) { setError('Usuario no autorizado'); return }

    try {
      // Crear post con tagIds
      const postResp = await api.post('/posts', { description, userId: user.id, tagIds: seleccionTags })
      const postId = postResp.data.id

      // Crear imágenes
      const validarImgs = imgUrls.map(s=>s.trim()).filter(Boolean)
      for (const url of validarImgs) {
        await api.post('/postimages', { url, postId })
      }

      nav('/perfil')
    } catch (err:any) {
      console.error(err)
      setError('Error al crear la publicación')
    }
  }

  return (
    <div className="crear-post-container">
    <Card className="crear-post-card shadow">
      <Card.Body>
        <h3 className="titulo-post mb-3">🌿 Crear nueva publicación</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          {/* Descripción */}
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={e=>setDescription(e.target.value)}
              className="input-area"
            />
          </Form.Group>

          {/* Imágenes */}
          <Form.Label>Imágenes (URLs)</Form.Label>
          {imgUrls.map((u,i) => (
            <Form.Group key={i} className="mb-2">
              <Form.Control
                value={u}
                onChange={e=>handleImgChange(i, e.target.value)}
                placeholder="https://..."
                className="input-imagen"
              />
            </Form.Group>
          ))}
          <Button
              variant="outline-success"
              size="sm"
              onClick={agregarCampoImagen}
              className="mb-3"
            >
              ➕ Agregar otra imagen
            </Button>

          {/* Etiquetas */}
          <Form.Group className="mb-3">
            <Form.Label>Etiquetas</Form.Label>
            <div className="etiquetas-container">
              {tags.map(t => (
                <Button
                  key={t.id}
                  variant={seleccionTags.includes(t.id) ? 'primary' : 'outline-primary'}
                  size="sm"
                  className="me-1 mb-1 etiqueta-boton"
                  onClick={()=>elegirTag(t.id)}
                >
                  {t.name}
                </Button>
              ))}
            </div>
          </Form.Group>

           <div className="d-flex justify-content-center">
              <Button type="submit" className="boton-crear">
                🌸 Crear publicación
              </Button>
            </div>
        </Form>
      </Card.Body>
    </Card>
    </div>
  )
}

export default CrearPost
