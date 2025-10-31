import React, { useEffect, useState } from 'react'
import { Card, Button, Row, Col, Badge, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { api } from '../api'

interface Tag {
  id: number
  name: string
}

interface Post {
  id: number
  description: string
  commentsCount?: number
  tagIds?: number[]
  tags?: Tag[] // opcional si la API devuelve objetos completos
}

const Home= () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    fetchPosts()
    fetchTags()
  }, [])

  const fetchPosts = async () => {
    try {
      const resp = await api.get('/posts')
      // Asegurarse de que description sea string
      const safePosts = resp.data.map((p: any) => ({
        ...p,
        description: typeof p.description === 'string' ? p.description : JSON.stringify(p.description),
      }))
      setPosts(safePosts)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchTags = async () => {
    try {
      const resp = await api.get('/tags')
      setTags(resp.data || [])
    } catch (err) {
      console.error(err)
    }
  }

  // Filtrar posts según el nombre de la etiqueta
  const filtered = filter
    ? posts.filter(p => (p.tags || []).some(t => t.name === filter))
    : posts

  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <h2>Bienvenidos a UnaHur</h2>
          <p>La red social anti-social. Explora publicaciones y comenta.</p>
        </Card.Body>
      </Card>

      <Form.Group className="mb-3" style={{maxWidth: 400}}>
        <Form.Label>Filtrar por etiqueta (bonus)</Form.Label>
        <Form.Select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">-- Todas --</option>
          {tags.map(t => (
            <option key={t.id} value={t.name}>{t.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Row xs={1} md={2} lg={3} className="g-3">
        {filtered.map(post => (
          <Col key={post.id}>
            <Card>
              <Card.Body>
                <Card.Text style={{minHeight: 60}}>
                  {post.description}
                </Card.Text>
                <div className="mb-2">
                  {(post.tags || []).slice(0,3).map(t => (
                    <Badge className="me-1" bg="secondary" key={t.id}>
                      {t.name}
                    </Badge>
                  ))}
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small>{post.commentsCount ? `${post.commentsCount} comments` : ''}</small>
                  <Link to={`/post/${post.id}`}>
                    <Button size="sm">Ver más</Button>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Home
