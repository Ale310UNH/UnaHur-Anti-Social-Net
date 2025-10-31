import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../api'
import { Card, Button, ListGroup, Badge } from 'react-bootstrap'
import { Link } from 'react-router-dom'

interface Tag { id: number; name: string }
interface Post {
  id: number
  description: string
  commentsCount?: number
  tags?: Tag[]
}

const Profile = () => {
  const { user, logout } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    if (!user) return
    api.get<Post[]>(`/posts?userId=${user.id}`)
      .then(r => setPosts(r.data || []))
      .catch(()=>{})
  }, [user])

  if (!user) return <div>No autorizado</div>

  return (
    <div>
      <Card className="mb-3">
        <Card.Body>
          <h3>Perfil</h3>
          <p><strong>{user.nickName}</strong></p>
          <Button variant="outline-danger" onClick={logout}>Cerrar sesión</Button>
        </Card.Body>
      </Card>

      <h4>Mis publicaciones</h4>
      <ListGroup>
        {posts.map(p => (
          <ListGroup.Item key={p.id} className="d-flex justify-content-between align-items-center">
            <div>{p.description}</div>
            <div>
              <small className="me-2">{p.commentsCount ? `${p.commentsCount} comments` : ''}</small>
              <Link to={`/post/${p.id}`}>
                <Button size="sm">Ver más</Button>
              </Link>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}

export default Profile
