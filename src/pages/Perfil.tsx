import React, { useEffect, useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../api'
import { Card, Button, ListGroup, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import '../Perfil.css'

interface Tag { id: number; name: string }
interface Post {
  id: number
  description: string
  commentsCount?: number
  tags?: Tag[]
  imagenes?: string[]
}

const Perfil = () => {
  const { user, logout } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null) 
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Cargar publicaciones e imagen de perfil
  useEffect(() => {
    if (!user) return

    // Cargar publicaciones con imágenes
    api.get<Post[]>(`/posts?userId=${user.id}`)
      .then(async r => {
        const posts = r.data || []
        const publicacionesConImagenes = await Promise.all(
          posts.map(async p => {
            try {
              const res = await api.get(`/postimages/post/${p.id}`)
              const urls = (res.data || []).map((img: any) => img.url)
              return { ...p, imagenes: urls }
            } catch {
              return { ...p, imagenes: [] }
            }
          })
        )
        setPosts(publicacionesConImagenes)
      })
      .catch(() => {})

    // Cargar foto guardada del localStorage (solo si user.id existe)
    if (user?.id) {
      const fotoGuardada = localStorage.getItem(`fotoPerfil-${user.id}`)
      if (fotoGuardada) setFotoPerfil(fotoGuardada)
    }
  }, [user])

  if (!user) return <div>No autorizado</div>

  const avatarUrl =
    fotoPerfil ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user.nickName || 'Usuario'
    )}&background=random&color=fff&size=128`

  // 🔹 Manejar nueva imagen
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (event) => {
    const img = document.createElement('img'); 

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Redimensionar manteniendo proporciones
      const maxSize = 300;
      let width = img.width;
      let height = img.height;
      if (width > height) {
        if (width > maxSize) {
          height *= maxSize / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width *= maxSize / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      // Convertir a base64 comprimido (JPEG con calidad 80 %)
      const archivoFoto = canvas.toDataURL('image/jpeg', 0.8);

      // Guardar en el estado y en localStorage
      setFotoPerfil(archivoFoto);
      localStorage.setItem(`fotoPerfil-${user.id}`, archivoFoto);
    };

    img.src = event.target?.result as string;
  };

  reader.readAsDataURL(file);
};
  // 🔹 Quitar foto
  const quitarFoto = () => {
    setFotoPerfil(null)
    localStorage.removeItem(`fotoPerfil-${user.id}`)
  }

  const elegirFoto = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="perfil-container">
      <Card className="perfil-card text-center mx-auto">
        <Card.Body>
          <div className="d-flex flex-column align-items-center">
            <Image
              src={avatarUrl}
              roundedCircle
              width={120}
              height={120}
              className="perfil-avatar mb-3"
              alt="Foto de perfil"
            />

            <h4 className="perfil-nombre">{user.nickName}</h4>
            <small className="perfil-email">{user.email}</small>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />

            <div className="d-flex gap-2 mb-3">
              <Button
                className="btn-agregar-foto"
                size="sm"
                onClick={elegirFoto}
              >
                {fotoPerfil ? 'Cambiar foto' : 'Agregar foto de perfil'}
              </Button>

              {fotoPerfil && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="btn-quitar-foto"
                  onClick={quitarFoto}
                >
                  Quitar foto
                </Button>
              )}
            </div>

            <Button variant="outline-danger" onClick={logout} className="btn-cerrar-sesion">
              Cerrar sesión
            </Button>
          </div>
        </Card.Body>
      </Card>

      <div className="publicaciones-container mx-auto">
        <h5 className="titulo-publicaciones">Mis publicaciones</h5>
        <ListGroup>
          {posts.map(pub => (
            <ListGroup.Item key={pub.id} className="publicacion-item d-flex flex-column">
              <div>{pub.description}</div>
              {pub.imagenes && pub.imagenes.length > 0 && (
                <div className="contenedor-imagenes">
                  {pub.imagenes.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Imagen de publicación ${pub.id}`}
                      className="imagen-publicacion"
                    />
                  ))}
                </div>
              )}
              <div>
                <small className="me-2 text-muted">
                  {pub.commentsCount ? `${pub.commentsCount} comentarios` : ''}
                </small>
                <Link to={`/post/${pub.id}`}>
                  <Button size="sm" className="btn-ver-mas">
                    Ver más
                  </Button>
                </Link>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  )
}

export default Perfil