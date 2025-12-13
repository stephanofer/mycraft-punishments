# Mycraft Punishments

Sistema de visualización de sanciones para servidores de Minecraft con LiteBans. Construido con **Astro**, **Tailwind CSS** y **mysql2**.

![Mycraft Punishments](https://img.shields.io/badge/Astro-5.16-purple)
![Tailwind](https://img.shields.io/badge/Tailwind-4.x-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Vista Previa

![Vista previa de Mycraft Punishments](/public/images/preview.png)

## Características

- **Totalmente responsive** para móviles y tablets
- **Búsqueda avanzada** por nombre de jugador o UUID
- **Paginación inteligente** para miles de sanciones
- **Perfiles de jugadores** con historial completo
- **Perfiles de staff** con sanciones emitidas
- **Skins de Minecraft** con soporte para SkinRestorer
- **Rendimiento optimizado** con connection pooling
- **SSR** para SEO y tiempos de carga rápidos

## Tipos de Sanciones

- **Baneos** - Sanciones permanentes o temporales
- **Silencios** - Restricciones de chat
- **Expulsiones** - Kicks instantáneos
- **Advertencias** - Avisos formales

## Inicio Rápido

### Requisitos Previos

- Node.js 18+ 
- pnpm (recomendado) o npm
- Base de datos MySQL/MariaDB con LiteBans

### Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone https://github.com/mycraft/mycraft-punishments.git
cd mycraft-punishments
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
pnpm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env
\`\`\`

Editar \`.env\` con tus credenciales:
\`\`\`env
# Base de datos LiteBans
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=litebans
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña

# Sitio
SITE_NAME=Mycraft Network
SITE_URL=https://bans.tuservidor.com

### Producción

\`\`\`bash
pnpm build
pnpm preview # Para probar el build
node ./dist/server/entry.mjs # Para producción
\`\`\`


## Personalización

### Tema de Colores

Edita \`src/lib/theme.ts\` para personalizar los colores:

\`\`\`typescript
export const theme = {
  primary: '#a855f7',    // Púrpura principal
  accent: '#8b5cf6',     // Púrpura acento
  ban: '#ef4444',        // Rojo para baneos
  mute: '#eab308',       // Amarillo para silencios
  kick: '#3b82f6',       // Azul para expulsiones
  warning: '#f97316',    // Naranja para advertencias
};
\`\`\`

## API Endpoints

### GET /api/search
Buscar un jugador por nombre o UUID.

## Base de Datos

Compatible con la estructura de tablas de **LiteBans**:

- \`litebans_bans\` - Baneos
- \`litebans_mutes\` - Silencios
- \`litebans_kicks\` - Expulsiones
- \`litebans_warnings\` - Advertencias
- \`litebans_history\` - Historial de nombres

## Skins de Jugadores

Por defecto usa [Crafty.gg](https://render.crafty.gg/) para renderizar skins.

## Licencia

MIT - Libre para uso personal y comercial.

---