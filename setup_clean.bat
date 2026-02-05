@echo off
echo ==============================================
echo      TAXI SYSTEM CLEAN SETUP
echo ==============================================

echo [1/4] Configurando Variables de Entorno...
echo DATABASE_URL="postgresql://postgres:postgres26@localhost:5432/taxi_clean_db" > backend\.env
echo JWT_SECRET="secretkey2026" >> backend\.env

echo [2/4] Creando Base de Datos 'taxi_clean_db'...
set PGPASSWORD=postgres26
psql -U postgres -c "DROP DATABASE IF EXISTS taxi_clean_db;"
psql -U postgres -c "CREATE DATABASE taxi_clean_db;"

echo [3/4] Instalando Dependencias y Migrando...
cd backend
call npm install
echo Ejecutando migraciones de Prisma...
call npx prisma migrate dev --name init_clean

echo [4/4] Sembrando Datos de Prueba...
call node seed.js

echo.
echo ==============================================
echo      SETUP COMPLETADO
echo ==============================================
echo.
pause
