# Backlog

Backlog es una aplicación web que sirve como un catálogo personal de videojuegos pendientes, en curso y completados. Permite organizar tu biblioteca de juegos asignándoles prioridades, plataformas y notas o reviews.

## Features

*   Dashboard: Resumen con métricas del backlog, barra de progreso por estado y un selector para destacar el juego favorito o activo.
*   Catálogo de Videojuegos: Menu de tarjetas que incluye barra de búsqueda por título, filtros por estado de juego y ordenación por prioridad o nombre.
*   Gestión de Plataformas: Lista completa de plataformas de videojuegos para registrar aquellos sistemas que el usuario posea y vincularlos con juegos.
*   Soporte para Imagenes: Subida y almacenamiento local de portadas de juegos en la carpeta del servidor.

---

## Requerimientos

*   **Node.js**
*   **PostgreSQL**

## Pasos de Despliegue y Ejecución
### 1. Base de Datos (PostgreSQL)

1.  Crea una base de datos vacía llamada `backlog` dentro de PostgreSQL. Recomiendo usar Laragon con DBeaver.
2.  Ejecuta las consultas SQL contenidas en el archivo `backend/database.sql` para crear la estructura de tablas (`platforms` y `games`) e insertar los datos iniciales de placeholder.

### 2. Configuración del Backend

1.  Desde la terminal entra a la carpeta del backend para instalar las dependencias del servidor:
    ```bash
    cd backend
    npm install
    ```
2.  Crea un archivo `.env` en la raíz de la carpeta `backend` basándote en la plantilla `.env.dist`. Configura las credenciales locales de PostgreSQL:
    ```env
    DB_USER=usuario
    DB_HOST=localhost
    DB_DATABASE=backlog
    DB_PASSWORD=contraseña
    DB_PORT=5432
    PORT=5000
    ```
3.  Inicia el servidor en modo de desarrollo:
    ```bash
    npm run dev
    ```
    El servidor corre en `http://localhost:5000` por default.

### 3. Configuración del Frontend

1.  Desde la terminal entra a la carpeta del frontend para instalar las dependencias:
    ```bash
    cd frontend
    npm install
    ```
2.  Inicia el servidor local de Vite:
    ```bash
    npm run dev
    ```
    La app estará disponible en `http://localhost:5173` por default.

---

## Dependencias:

*   Backend: Node.js, Express, PG (PostgreSQL client), Multer, CORS, Dotenv.
*   Frontend: React (Vite), Tailwind CSS, DaisyUI, Lucide React, Axios.

## TO-DO:

*   Sustituir PostgreSQL por SQLite para uso personal más cómodo.
*   Empaquetar la aplicación utilizando Electron para uso en escritorio.