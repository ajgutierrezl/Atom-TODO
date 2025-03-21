# Guía de Despliegue a Firebase

Esta guía proporciona instrucciones paso a paso para desplegar la aplicación Atom TODO en Firebase Hosting y Functions.

## Requisitos previos

1. Tener una cuenta de Google y Firebase
2. Tener instalado Node.js y npm
3. Tener instalada la CLI de Firebase

## Instalación de Firebase CLI

Si aún no tienes instalada la CLI de Firebase, puedes instalarla globalmente con:

```bash
npm install -g firebase-tools
```

## Paso 1: Iniciar sesión en Firebase

Ejecuta el siguiente comando para iniciar sesión en tu cuenta de Firebase:

```bash
firebase login
```

## Paso 2: Configurar el proyecto Firebase (si no lo has hecho antes)

Si es la primera vez que despliegas la aplicación, debes inicializar el proyecto:

```bash
firebase init
```

Selecciona las opciones:
- Hosting
- Functions
- Usa un proyecto existente (si ya tienes uno) o crea uno nuevo

## Paso 3: Compilar la aplicación

### Compilar el frontend (Angular)

```bash
cd todo-app
npm run build
```

### Compilar el backend (Express)

```bash
cd backend
npm run build
```

## Paso 4: Desplegar a Firebase

Puedes desplegar toda la aplicación con:

```bash
firebase deploy
```

O desplegar componentes específicos:

```bash
# Solo el frontend
firebase deploy --only hosting

# Solo el backend (funciones)
firebase deploy --only functions
```

## Paso 5: Verificar el despliegue

Una vez completado el despliegue, Firebase proporcionará URLs para acceder a tu aplicación. Típicamente será algo como:

- Frontend: https://tu-proyecto-id.web.app
- Backend: https://us-central1-tu-proyecto-id.cloudfunctions.net/api

## Usando los scripts de despliegue

También puedes usar los scripts de despliegue que hemos configurado:

```bash
# Desplegar solo el frontend
cd todo-app
npm run deploy

# Desplegar solo el backend
cd backend
npm run deploy
```

## Solución de problemas comunes

### Error "Error: Failed to get Firebase project"
Asegúrate de que has iniciado sesión correctamente y que tienes acceso al proyecto.

### Error en el despliegue de funciones
Verifica que tu plan de Firebase admite funciones (Blaze o superior).

### Problemas CORS
Verifica la configuración CORS en tu backend para permitir solicitudes desde el dominio de Firebase Hosting.

### Variables de entorno
Configura las variables de entorno necesarias para producción usando Firebase Functions Config:

```bash
firebase functions:config:set environment.production=true
```

## Mantenimiento

Para actualizar tu aplicación, simplemente haz cambios en el código, compila de nuevo y despliega siguiendo los pasos anteriores. 