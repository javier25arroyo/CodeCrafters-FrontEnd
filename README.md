# Mentana - Plataforma Cognitiva para Adultos Mayores

[![Angular](https://img.shields.io/badge/Angular-17.3-red)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-20.11.1-green)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Mentana es una plataforma web interactiva diseñada específicamente para adultos mayores, enfocada en el entrenamiento cognitivo a través de juegos educativos y herramientas de bienestar digital.

## 🎯 Descripción del Proyecto

Mentana ofrece una experiencia accesible y amigable para que los adultos mayores puedan:
- 🧠 Ejercitar su mente con juegos cognitivos especializados
- 💡 Recibir consejos diarios de bienestar y salud mental
- ♿ Interactuar con una interfaz diseñada para la accesibilidad
- 💬 Enviar sugerencias para mejorar la plataforma
- 👥 Conectar con cuidadores y familiares (funcionalidad para cuidadores)

## 🚀 Características Principales

### Para Usuarios
- **Dashboard Personalizado**: Interfaz principal con acceso a todas las funcionalidades
- **Galería de Juegos**: Variedad de juegos cognitivos incluyendo:
  - 🔍 Sopa de letras
  - 🧩 Rompecabezas
  - 🔢 Juego de secuencia numérica
  - 🃏 Juego de memoria con cartas
  - 📝 Crucigrama
  - ♛ Ajedrez (con modo vs computadora)
  - 🎵 Juego de memoria musical
  - 📅 Juego de línea de tiempo
- **Consejos Diarios**: Tips de bienestar que se actualizan automáticamente
- **Perfil de Usuario**: Gestión de información personal y estadísticas
- **Sistema de Logros**: Reconocimiento del progreso y logros obtenidos
- **Sistema de Sugerencias**: Canal directo para feedback con los administradores

### Para Administradores
- **Panel de Administración**: Control total de la plataforma
- **Gestión de Usuarios**: Administración completa de cuentas de usuario
- **Gestión de Sugerencias**: Revisión y respuesta a sugerencias de usuarios
- **Estadísticas y Analytics**: Monitoreo del uso de la plataforma

### Para Cuidadores
- **Dashboard de Cuidador**: Vista especializada para supervisar el progreso
- **Estadísticas de Pacientes**: Seguimiento del rendimiento cognitivo
- **Reportes de Actividad**: Informes detallados de la actividad del usuario

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Framework**: Angular 17.3
- **Lenguaje**: TypeScript 5.4.2
- **Estilos**: SCSS, Bootstrap 5, Angular Material
- **Autenticación**: JWT, Google OAuth (@abacritt/angularx-social-login)
- **UI Components**: Angular Material, ng-bootstrap
- **Comunicación en Tiempo Real**: STOMP.js, SockJS
- **Animaciones**: Angular Animations

### Herramientas de Desarrollo
- **Testing**: Jasmine, Karma
- **Build Tool**: Angular CLI 17.3.7
- **Package Manager**: npm

## 📋 Prerrequisitos

- **Node.js**: versión 20.11.1
- **npm**: última versión estable
- **Angular CLI**: versión 17.3.7

## 🔧 Instalación y Configuración

1. **Configurar la versión de Node.js**:
```bash
nvm install 20.11.1
nvm use 20.11.1
```

2. **Clonar el repositorio**:
```bash
git clone <repository-url>
cd CodeCrafters-FrontEnd
```

3. **Instalar dependencias**:
```bash
npm install
```

4. **Instalar Angular CLI globalmente** (si no está instalado):
```bash
npm install -g @angular/cli@17.3.7
```

5. **Configurar el proxy** (opcional):
   - El proyecto incluye `proxy.conf.json` para desarrollo local
   - Asegúrate de que las URLs del backend sean correctas

## 🚀 Ejecución

### Desarrollo
```bash
npm start
# o
ng serve --proxy-config proxy.conf.json
```
La aplicación estará disponible en `http://localhost:4200`

### Construcción para Producción
```bash
npm run build
# o
ng build --configuration production
```

### Ejecutar Tests
```bash
npm test
# o
ng test
```

### Modo Watch (desarrollo continuo)
```bash
npm run watch
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/          # Componentes reutilizables
│   ├── pages/              # Páginas principales
│   │   ├── games/          # Juegos cognitivos
│   │   ├── auth/           # Autenticación
│   │   ├── dashboard/      # Dashboards por rol
│   │   └── admin/          # Funcionalidades de admin
│   ├── services/           # Servicios de Angular
│   ├── guards/             # Guardias de ruta
│   ├── interceptors/       # Interceptores HTTP
│   └── interfaces/         # Interfaces TypeScript
├── assets/                 # Recursos estáticos
├── environments/           # Configuraciones de entorno
└── styles.scss            # Estilos globales
```

## 🎮 Juegos Disponibles

1. **Sopa de Letras**: Busca palabras ocultas en una grilla
2. **Rompecabezas**: Arma imágenes divididas en piezas
3. **Secuencia Numérica**: Memoriza y reproduce secuencias
4. **Memoria de Cartas**: Encuentra pares de cartas idénticas
5. **Crucigrama**: Resuelve crucigramas temáticos
6. **Ajedrez**: Juega contra la computadora con diferentes niveles
7. **Memoria Musical**: Reproduce secuencias de notas musicales
8. **Línea de Tiempo**: Ordena eventos cronológicamente

## 🔐 Autenticación

La plataforma soporta múltiples métodos de autenticación:
- Registro/Login tradicional con email y contraseña
- Autenticación con Google OAuth
- Recuperación de contraseña
- Gestión de sesiones con JWT

## 🎨 Accesibilidad

Mentana está diseñada con los principios de accesibilidad web en mente:
- Contraste de colores optimizado
- Navegación por teclado
- Texto alternativo para imágenes
- Tamaños de fuente ajustables
- Interfaz intuitiva y clara

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 🔒 Seguridad

Para reportar vulnerabilidades de seguridad, por favor consulta nuestro archivo [SECURITY.md](SECURITY.md).

## 👥 Equipo de Desarrollo

Desarrollado por el equipo CodeCrafters como parte del Proyecto 3.

## 📞 Soporte

Si tienes preguntas o necesitas ayuda:
- Crea un issue en el repositorio
- Contacta al equipo de desarrollo

---

**Mentana** - Entrenamiento cognitivo accesible para adultos mayores 🧠✨
