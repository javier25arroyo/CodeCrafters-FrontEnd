# Política de Seguridad

## 🔒 Versiones Soportadas

Actualmente damos soporte de seguridad a las siguientes versiones de Mentana:

| Versión | Soporte |
| ------- | ------ |
| 1.0.x   | ✅ |
| < 1.0   | ❌ |

## 🚨 Reportar una Vulnerabilidad

La seguridad de nuestros usuarios es una prioridad. Si descubres una vulnerabilidad de seguridad, por favor ayúdanos a resolverla de manera responsable.

### Proceso de Reporte

1. **NO** publiques la vulnerabilidad públicamente
2. Envía un reporte detallado a través de:
   - **Email**: javier25arojas@gmail.com
   - **Issue privado**: Crea un issue marcado como "Security" en el repositorio

### Información a Incluir

Por favor incluye la siguiente información en tu reporte:

- **Descripción**: Descripción detallada de la vulnerabilidad
- **Pasos para reproducir**: Instrucciones paso a paso para reproducir el issue
- **Impacto**: Descripción del posible impacto de la vulnerabilidad
- **Versión afectada**: Versión específica donde encontraste la vulnerabilidad
- **Evidencia**: Screenshots, logs, o cualquier evidencia adicional

### Qué Esperar

- **Confirmación**: Recibirás una confirmación dentro de 48 horas
- **Análisis inicial**: Evaluación inicial dentro de 7 días
- **Actualizaciones**: Te mantendremos informado del progreso
- **Resolución**: Trabajaremos para resolver la vulnerabilidad lo antes posible
- **Divulgación**: Coordinaremos la divulgación pública después de la corrección

## 🛡️ Medidas de Seguridad Implementadas

### Autenticación y Autorización
- Autenticación JWT con tokens de acceso y refresh
- Integración con Google OAuth 2.0
- Validación de roles y permisos por endpoint
- Protección de rutas mediante guards de Angular
- Gestión segura de sesiones

### Protección de Datos
- Validación de entrada en frontend y backend
- Sanitización de datos de usuario
- Protección contra inyección XSS
- Encriptación de contraseñas con salt
- Transmisión segura de datos (HTTPS)

### Comunicación
- Interceptores HTTP para manejo seguro de requests
- Configuración de CORS apropiada
- Uso de proxy para desarrollo seguro
- Comunicación WebSocket segura (WSS)

### Frontend
- Validación estricta de formularios
- Protección contra CSRF
- Sanitización de contenido dinámico
- Manejo seguro de errores sin exposición de información sensible

## 🔐 Mejores Prácticas para Desarrolladores

### Desarrollo Seguro
- Nunca commits credenciales o API keys
- Usa variables de entorno para configuración sensible
- Implementa validación tanto en frontend como backend
- Mantén las dependencias actualizadas
- Revisa el código antes de hacer merge

### Manejo de Datos Sensibles
- No logs información personal identificable (PII)
- Usa HTTPS en todos los entornos
- Implementa rate limiting apropiado
- Valida y sanitiza todas las entradas de usuario

### Configuración de Entornos
- Usa configuraciones diferentes para desarrollo/producción
- Restringe acceso a entornos de producción
- Mantén backups seguros y encriptados
- Implementa monitoreo de seguridad

## 📋 Checklist de Seguridad

### Para Nuevas Funcionalidades
- [ ] Validación de entrada implementada
- [ ] Autorización apropiada verificada
- [ ] Manejo de errores que no exponga información sensible
- [ ] Tests de seguridad incluidos
- [ ] Documentación de seguridad actualizada

### Para Despliegues
- [ ] Variables de entorno configuradas correctamente
- [ ] HTTPS habilitado
- [ ] Configuración de CORS verificada
- [ ] Logs de seguridad configurados
- [ ] Monitoreo de seguridad activo

## 🚨 Tipos de Vulnerabilidades que Reportar

### Críticas
- Ejecución remota de código
- Inyección SQL
- Bypass de autenticación
- Escalación de privilegios
- Exposición de datos sensibles

### Altas
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Inyección de comandos
- Deserialización insegura
- Vulnerabilidades de autorización

### Medias/Bajas
- Divulgación de información
- Configuraciones inseguras
- Problemas de validación
- Vulnerabilidades de denegación de servicio

## 🔧 Herramientas de Seguridad

### Análisis Estático
- TSLint/ESLint con reglas de seguridad
- Dependabot para dependencias vulnerables
- SonarQube para análisis de código

### Testing
- Pruebas de penetración regulares
- Análisis de dependencias vulnerables
- Tests automatizados de seguridad

## 📞 Contacto

Para consultas relacionadas con seguridad:
- **Email**: javier25arojas@gmail.com
- **Equipo de Desarrollo**: CodeCrafters Team

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Angular Security Best Practices](https://angular.io/guide/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Última actualización**: Enero 2025

Gracias por ayudarnos a mantener Mentana segura para todos nuestros usuarios. 🛡️