@echo off
echo ==============================================
echo      TAXI SYSTEM SETUP - NO DOCKER
echo ==============================================

echo [1/5] Instalando dependencias Backend...
cd backend
call npm install
cd ..

echo [2/5] Instalando dependencias Frontend...
cd frontend
call npm install
cd ..

echo [3/5] Configurando Base de Datos...
echo Asegurate de que PostgreSQL este corriendo en el puerto 5432
echo Usuario: postgres
echo Contrasena: postgres26
echo.
echo Creando base de datos 'taxi_db'...
set PGPASSWORD=postgres26
psql -U postgres -c "CREATE DATABASE taxi_db;"

echo [4/5] Ejecutando Migraciones y Seed...
cd backend
call npx prisma migrate dev --name init
call node seed.js
cd ..

echo [5/5] Setup Completo!
echo.
echo Para iniciar el sistema:
echo 1. Abre una terminal y corre: cd backend ^& npm start
echo 2. Abre otra terminal y corre: cd frontend ^& npm run dev
echo.
pause
