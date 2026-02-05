# 🚖 Sistema de Taxis - Guía de Inicio

Sistema completo de gestión de taxis con Backend (Express+Prisma) y Frontend (Vue 3).

## 📋 Requisitos Previos
- **Node.js** instalado.
- **PostgreSQL** instalado y corriendo en puerto 5432.
- Usuario Postgres: `postgres`
- Contraseña Postgres: `postgres26`

## 🚀 Instalación Rápida
He incluido un script automático para configurar todo.

1. Abre la carpeta `c:\arquitecturasss\taxi-system` en tu explorador de archivos.
2. Haz doble clic en **`setup.bat`**.
   - Esto instalará las dependencias.
   - Creará la base de datos `taxi_db`.
   - Ejecutará las migraciones.
   - Insertará datos de prueba.

## ▶️ Cómo Ejecutar
Necesitarás dos terminales abiertas:

**Terminal 1: Backend**
```bash
cd backend
npm start
```
> El servidor iniciará en http://localhost:3000

**Terminal 2: Frontend**
```bash
cd frontend
npm run dev
```
> La aplicación abrirá en http://localhost:5173

## 🧪 Pruebas
1. Abre http://localhost:5173
2. **Login Cliente**:
   - Email: `cliente@test.com`
   - Pass: `123456`
3. **Login Conductor** (en ventana incógnito):
   - Email: `conductor@test.com`
   - Pass: `123456`
4. Solicita un viaje con el cliente y verás cómo se asigna automáticamente al conductor.

## 📂 Estructura
- `backend/server.js`: Contiene toda la lógica (API, Auth, Patrones).
- `frontend/src/`: Código fuente de la interfaz Vue.
