# Examen Final Modulo 4 - Carrito de compras

Proyecto realizado por `Sergio Omar Sandy Cordova`, `Israel Rodrigo Rocha` y `Carmen Veronica Rodriguez`, esta realizado con typeorm y la base de datos de postgres
Para ejecutar el proyecto, tendra que ejecutar los siguientes comandos:

### Paso 1:
```bash
 npm install
```
### Paso 2:

```bash
npm run start:prod
```

## Variables de entorno

`PORT` - 'define el puerto de la API'
`DATABASE_HOST` - define el host de la base de datos
`DATABASE_USER` - define el usuario de la base de datos
`DATABASE_PASSWORD` - define el password de la base de datos
`DATABASE_PORT` - define el puerto de la base de datos
`DATABASE_NAME` - define el nombre de la base de datos

`JWT_EXPIRES_IN` - define el tiempo de expiracion del token

## Estructura de los ids de la Base de datos

Son las estructuras de los ids principales a tomar en cuenta para las pruebas

### Products
`id -  integer`
### Users
`id - uuid`