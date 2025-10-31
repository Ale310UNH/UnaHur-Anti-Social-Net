import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../api'
import { Card, Badge, Form, Button, ListGroup, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'

interface Tag { id: number; name: string }
interface Post { id: number; description: string; tags?: Tag[] }
interface Comment { id: number; content: string; User?: { id: number; nickName: string } }

const PostDetail: React.FC = () => {
  const { id } = useParams<{id:string}>()
  const { user } = useAuth()
  const [post, setPost] = useState<Post | null>(null)
  const [images, setImages] = useState<{url:string}[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    api.get<Post>(`/posts/${id}`).then(r => setPost(r.data)).catch(()=>{})
    api.get<{url:string}[]>(`/postimages/post/${id}`).then(r => setImages(r.data || [])).catch(()=>{})
    fetchComments()
  }, [id])

  const fetchComments = () => {
    api.get<Comment[]>(`/comments/post/${id}`)
      .then(r => setComments(r.data || []))
      .catch(()=>{})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!text) { setError('El comentario no puede estar vacío'); return }
    if (!user) { setError('No autorizado'); return }

    try {
      await api.post('/comments', { postId: id, userId: user.id, content: text })
      setText('')
      fetchComments()
    } catch {
      setError('Error al enviar comentario')
    }
  }

  if (!post) return <div>Cargando...</div>

  return (
    <Card>
      <Card.Body>
        <h3>Detalle de publicación</h3>
        <p>{post.description}</p>

        <div className="mb-2">
          {(post.tags || []).map(t => (
            <Badge key={t.id} bg="secondary" className="me-1">{t.name}</Badge>
          ))}
        </div>

        {images.length > 0 && (
          <div className="mb-3">
            {images.map((img, i) => (
              <img key={i} src={img.url} alt="" style={{maxWidth: '20%', marginBottom:8}} />
            ))}
          </div>
        )}

        <h5>Comentarios</h5>
        <ListGroup className="mb-3">
          {comments.map(c => (
            <ListGroup.Item key={c.id}>
              <strong>{c.User?.nickName || 'Usuario desconocido'}</strong>: {c.content}
            </ListGroup.Item>
          ))}
        </ListGroup>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-2">
            <Form.Control
              placeholder="Escribí tu comentario"
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </Form.Group>
          <Button type="submit">Enviar comentario</Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default PostDetail
