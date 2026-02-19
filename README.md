# TaskFlow PRO 🌸

Aplicación de gestión de tareas con autenticación. Frontend en React + Vite, backend en Express + MongoDB.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | React 19, TypeScript, Tailwind CSS, Vite |
| Backend | Node.js, Express, MongoDB (Mongoose) |
| Auth | JWT + bcryptjs |

## Estructura

```
taskflow-pro/
├── pages/          ← Vistas de la app (React)
├── components/     ← Componentes reutilizables
├── server/         ← Backend Express
│   ├── models/     ← Esquemas Mongoose
│   ├── routes/     ← Rutas de la API
│   └── index.js    ← Servidor principal
└── vercel.json     ← Configuración de despliegue
```

## Desarrollo local

### 1. Clonar y configurar

```bash
# Frontend
npm install
cp .env.example .env.local   # Dejar VITE_API_URL vacío en dev

# Backend
cd server
npm install
cp .env.example .env         # Rellena MONGO_URI y JWT_SECRET
```

### 2. Arrancar

```bash
# Terminal 1 — Backend (puerto 5001)
cd server && node index.js

# Terminal 2 — Frontend (puerto 3000)
npm run dev
```

## Despliegue en Producción

### Backend → [Render](https://render.com) (gratuito)

1. Crea un **Web Service** en Render apuntando a la carpeta `/server`
2. Build command: `npm install`
3. Start command: `node index.js`
4. Variables de entorno:
   - `MONGO_URI` → tu URI de MongoDB Atlas
   - `JWT_SECRET` → un secreto largo y seguro
   - `PORT` → `5001`
5. Copia la URL pública (ej: `https://taskflow-api.onrender.com`)

### Frontend → [Vercel](https://vercel.com)

1. Importa el repositorio en Vercel
2. Framework: **Vite** (auto-detectado)
3. Variable de entorno:
   - `VITE_API_URL` → la URL de tu backend en Render (sin `/` al final)
4. Deploy ✨

## Variables de entorno

### Frontend (`.env.local`)
```env
VITE_API_URL=         # Vacío en dev, URL del backend en producción
```

### Backend (`server/.env`)
```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=secreto_seguro
PORT=5001
```
