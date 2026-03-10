# Habilidad: Optimización SEO Técnica para Consultor Freelance

## Descripción
Esta habilidad instruye al agente para auditar, planificar e implementar mejoras de SEO técnico y de contenido en un sitio web profesional. El objetivo es posicionar al usuario como Consultor Senior Full Stack, Arquitecto Drupal y Especialista en AWS/DevOps para atraer clientes B2B y proyectos corporativos.

## Contexto del Profesional (Juan José Gómez López)
- **Rol:** Consultor Senior Full Stack, Arquitecto Drupal, Especialista Cloud/DevOps.
- **Tecnologías Clave:** Drupal (8-11), PHP 8+, C#, AWS (EC2, Load Balancers), Docker, MySQL/MSSQL, Cloudflare.
- **Propuesta de Valor:** Modernización de sistemas legacy, arquitecturas multi-tenant, automatización de infraestructura, y migraciones de datos de alta complejidad sin tiempo de inactividad.
- **Ubicación/Modelo:** Cuernavaca, México (Modelo Nearshore/Remoto para clientes globales).

## Reglas de Ejecución (Directivas SEO)

### 1. Auditoría y Rendimiento (Core Web Vitals)
- Antes de modificar código, audita los tiempos de carga, INP (Interaction to Next Paint) y CLS (Cumulative Layout Shift).
- Si encuentras cuellos de botella en JavaScript o CSS, propone técnicas de *lazy loading*, minificación o diferimiento (defer/async).
- Asegura que las imágenes tengan atributos `width`, `height`, y utilicen formatos modernos (WebP/AVIF).

### 2. Implementación de Datos Estructurados (JSON-LD)
- Inyecta marcado Schema válido en el `<head>` de las páginas principales.
- Utiliza los esquemas `Person` y `ProfessionalService` para definir claramente la entidad del consultor, sus habilidades, certificaciones (ej. Free Code Camp, grados universitarios) y datos de contacto.
- Si existe una sección de servicios o casos de éxito, implementa marcado de `FAQPage` o `Article` según corresponda.

### 3. Semántica HTML y Metadatos (E-E-A-T)
- Revisa que todas las páginas cuenten con una jerarquía de encabezados lógica (`<h1>` a `<h6>`).
- Optimiza las etiquetas `<title>` y `<meta name="description">` enfocándolas en términos transaccionales B2B (ej. "Consultor Senior Drupal | Arquitectura Cloud AWS | Servicios Nearshore").
- Asegura el uso de etiquetas `<article>`, `<section>`, `<nav>` y `<aside>` para facilitar el rastreo por parte de los motores de búsqueda.

### 4. Flujo de Trabajo Requerido del Agente
1. **Analizar:** Lee los archivos de layout principales (ej. plantillas Twig, Blade o componentes JS) y el `package.json` / `composer.json` para entender el stack.
2. **Planificar:** Genera un resumen en Markdown detallando qué archivos se modificarán y por qué.
3. **Ejecutar:** Aplica los cambios asegurando mantener la compatibilidad hacia atrás y la limpieza del código.
4. **Validar:** Revisa que el código HTML generado sea válido y no rompa la accesibilidad web (WCAG).

## Restricciones
- NO modifiques la lógica de negocio ni las rutas de la API del backend sin autorización previa.
- Prioriza siempre el rendimiento; no agregues librerías externas para SEO a menos que sea estrictamente necesario.
