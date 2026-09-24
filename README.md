# enanos-app

App móvil con Expo (React Native) para gestionar enanos. Se comunica con [enanos-backend](../enanos-backend) mediante fetch.

## Requisitos

- Node.js 18+
- Expo Go instalado en el celular (SDK 57)

## Instalación

```bash
npm install
```

## Configurar la URL del backend

Editá `src/config.ts` según dónde corra el backend:

```ts
// Simulador iOS o navegador web
export const API_BASE_URL = 'http://localhost:3001';

// Emulador Android
export const API_BASE_URL = 'http://10.0.2.2:3001';

// Dispositivo físico (reemplazá con tu IP local)
export const API_BASE_URL = 'http://192.168.X.X:3001';
```

## Correr la app

```bash
npm start
```

Escaneá el QR con Expo Go o presioná `w` para abrir en el navegador.

## Funcionalidades

- Listar enanos con foto y animación
- Crear enano con nombre y edad
- Eliminar enano
