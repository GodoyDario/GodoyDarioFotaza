# APP FOTAZA 

Es una aplicacion donde usuarios pueden subir imagenes, valorizar, comentar, denunciar.

## Guia de uso
 - Instale las dependencias con `npm install` 
 - Copiar `.evn` a `.evn.example`
 - en terminal escribir `npm run db:init`, `npm run db:seed` y por ultimo `npm run dev`



 ## Usuario de prueba
 - Servidor corriendo en http://localhost:3000
 - Usuario: Admin
 - Constraseña: admin123
 

 ## Problemas encontrados y soluciones

### 1. ES Modules vs CommonJS
Al iniciar el proyecto tenía `"type": "module"` en el `package.json` lo que causaba errores con Sequelize y otros paquetes. Se resolvió eliminando esa línea y usando CommonJS (`require`).

### 2. Imágenes en el servidor
Inicialmente las imágenes se guardaban en la carpeta `public/uploads` del servidor. Se migró a Cloudinary para que las imágenes persistan en producción y no dependan del sistema de archivos del servidor.

### 3. Sesiones en PostgreSQL
Se configuró `connect-session-sequelize` para guardar las sesiones en la base de datos usando `sessionStore.sync()` para crear la tabla automáticamente.

