import React, { useEffect, useState } from 'react'
import { Card, Button, Form, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { api } from '../api'
import './Home.css'

interface Tag {
  id: number
  name: string
}

interface Image {
  id: number
  url: string
  postId: number
}

interface Post {
  id: number
  description: string
  User?: {
    id: number
    nickName: string
  }
  Tags?: Tag[]
  images?: Image[]
}

const Home = () => {
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

      // Traer imágenes
      const postsWithImages = await Promise.all(
        resp.data.map(async (post: Post) => {
          try {
            const imgResp = await api.get(`/postimages/post/${post.id}`)
            return {
              ...post,
              images: imgResp.data || []
            }
          } catch {
            return { ...post, images: [] }
          }
        })
      )

      setPosts(postsWithImages.reverse())
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

  const filtered = filter
    ? posts.filter(p => (p.Tags || []).some(t => t.name === filter))
    : posts

  return (
    <div className="home-container">
      <Card className="mb-3">
        <Card.Body>
          <h2>Bienvenidos a UnaHur</h2>
          <p>La red social anti-social. Explora publicaciones y comenta.</p>
        </Card.Body>
      </Card>

      <Form.Group className="mb-3">
        <Form.Label>Filtrar por etiqueta</Form.Label>
        <Form.Select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">-- Todas --</option>
          {tags.map(t => (
            <option key={t.id} value={t.name}>
              {t.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      
        {filtered.map(post => (
            <Card key={post.id} className="mb-4 shadow-sm">
              {/* Mostrar imágenes del post */}
              {post.images && post.images.length > 0 && (
                <div style={{ padding: "10%", display: 'flex', overflowX: 'auto', justifyContent: 'center'}}>
                  {post.images.map(img => (
                    <Card.Img
                      key={img.id}
                      variant="top"
                      src={img.url}
                      alt="Imagen de la publicación"
                      style={{
                        maxHeight: '400px',
                        width: '100%',
                        objectFit: 'cover',
                        marginRight: '4px',
                        
                      }}
                    />
                  ))}
                </div>
              )}

          <Card.Body>
            <Card.Title>
              {post.User?.nickName || 'Usuario desconocido'}
            </Card.Title>

            <Card.Text>{post.description}</Card.Text>

            <div className="mb-2">
              {(post.Tags || []).slice(0, 3).map(t => (
                <Badge className="me-1" bg="secondary" key={t.id}>
                  {t.name}
                </Badge>
              ))}
            </div>

            <div className="d-flex justify-content-end align-items-center">
              <Link to={`/post/${post.id}`}>
                <Button size="sm">Ver más</Button>
              </Link>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  )
}

export default Home