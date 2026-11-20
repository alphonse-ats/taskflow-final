# TaskFlow 

Aplicación web full-stack con Node.js, Express y MongoDB para gestión de tareas con autenticación JWT y roles.

## Funcionalidades
- Registro y login con JWT (cookies HttpOnly)
- CRUD completo de tareas
- Roles: `user` (gestiona sus tareas) y `admin` (ve y gestiona todas)
- Vistas dinámicas con EJS + layout + partials
- Validación con express-validator
- Paginación
- Helmet para seguridad

## Tecnologías
Node.js 24 LTS, Express, MongoDB, Mongoose, JWT, bcryptjs, EJS, express-validator, helmet, method-override

## Enlace en producción
🔗 https://taskflow-tuapp.onrender.com

## Usuarios de prueba
- Admin: `admin@taskflow.com` / `admin1234`

## Instalación local
1. `npm install`
2. Crear `.env` con `MONGO_URI`, `JWT_SECRET`, `PORT`
3. `npm run seed` (opcional)
4. `npm run dev`
5. Abrir http://localhost:3000