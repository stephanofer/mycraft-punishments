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

Editar \`.env\` con tus credenciales:

# Base de datos LiteBans
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=litebans
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña

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

---