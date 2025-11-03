import React, { useEffect, useState } from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { api } from '../api'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

interface Tag {
  id: number
  name: string
}

const CrearPost = () => {
  const [description, setDescription] = useState('')
  const [imgUrls, setImgUrls] = useState<string[]>([''])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<number[]>([])
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
  const addImgField = () => setImgUrls([...imgUrls, ''])

  // Manejo de selección de tags
  const toggleTag = (id:number) => {
    setSelectedTags(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev, id])
  }

  // Submit
  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!description) { setError('La descripción es obligatoria'); return }
    if (!user) { setError('Usuario no autorizado'); return }

    try {
      // Crear post con tagIds
      const postResp = await api.post('/posts', { description, userId: user.id, tagIds: selectedTags })
      const postId = postResp.data.id

      // Crear imágenes
      const validImgs = imgUrls.map(s=>s.trim()).filter(Boolean)
      for (const url of validImgs) {
        await api.post('/postimages', { url, postId })
      }

      nav('/profile')
    } catch (err:any) {
      console.error(err)
      setError('Error al crear la publicación')
    }
  }

  return (
    <Card className="mx-auto" style={{maxWidth:800}}>
      <Card.Body>
        <h3>Crear nueva publicación</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          {/* Descripción */}
          <Form.Group className="mb-2">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={e=>setDescription(e.target.value)}
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
              />
            </Form.Group>
          ))}
          <Button variant="link" onClick={addImgField}>Agregar otro campo de imagen</Button>

          {/* Etiquetas */}
          <Form.Group className="mb-3">
            <Form.Label>Etiquetas</Form.Label>
            <div>
              {tags.map(t => (
                <Button
                  key={t.id}
                  variant={selectedTags.includes(t.id) ? 'primary' : 'outline-primary'}
                  size="sm"
                  className="me-1 mb-1"
                  onClick={()=>toggleTag(t.id)}
                >
                  {t.name}
                </Button>
              ))}
            </div>
          </Form.Group>

          <Button type="submit">Crear</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default CrearPost
