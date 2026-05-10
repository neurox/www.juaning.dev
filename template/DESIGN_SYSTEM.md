# Guía de Estilo y Sistema de Diseño (HUD High-Availability)

Este documento define las reglas de diseño, patrones de UI y configuración necesaria para mantener la coherencia visual del proyecto. Está estructurado para que tanto desarrolladores humanos como agentes de IA puedan comprender y replicar la interfaz en cualquier entorno, incluyendo sitios estáticos generados por **Hugo**.

## 1. Filosofía de Diseño
El diseño sigue una estética "Architectural Minimalist" con inspiración en interfaces HUD (Heads-Up Display) y terminales. 
- **Modo Oscuro Profundo:** Reduce la fatiga visual de los ingenieros.
- **Glassmorphism Técnico:** Uso de desenfoques (`backdrop-blur`) y transparencias subtiles en lugar de sombras pesadas.
- **Micro-interacciones:** Animaciones fluidas al hacer hover en tarjetas y botones, usando transiciones suaves sin afectar el rendimiento de pintado de la página.

## 2. Tipografía
Se utiliza una estrategia de tres fuentes para diferenciar el contexto de la información:

1. **Geist (Sans-Serif):** Para encabezados (h1, h2, h3). Aporta un aspecto geométrico moderno.
2. **Inter (Sans-Serif):** Para el cuerpo del texto. Elegida por su alta legibilidad en pantallas densas.
3. **JetBrains Mono (Monospace):** Para etiquetas, metadatos, fechas, lenguajes de programación y logs. Refuerza la temática técnica (IDE/Terminal).

*Importación a través de Google Fonts:*
```css
@import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
```

## 3. Paleta de Colores

| Uso | Hex | Clase Tailwind (Aprox) | Descripción |
| :--- | :--- | :--- | :--- |
| **Fondo Principal** | `#0b0f15` | `bg-[#0b0f15]` | Fondo general del sitio, casi negro puro. |
| **Superficie/Glass** | `rgba(30,41,59,0.4)`| `bg-slate-800/40` | Fondos de las tarjetas de contenido. |
| **Bordes Estándar** | `rgba(255,255,255,0.1)`| `border-white/10` o `border-slate-700` | Separadores y contornos inactivos. |
| **Primario (Cyan)** | `#0ea5e9` | `text-cyan-500` `bg-cyan-500` | Color primario para acciones, enlaces y estados activos. |
| **Acento (Púrpura)** | `#8a2be2` | `text-[#8a2be2]` `bg-[#8a2be2]` | Utilizado para destacar iniciativas en despliegue o críticas. |
| **Texto Principal** | `#e2e8f0` | `text-slate-200` | Texto de alto contraste para encabezados. |
| **Texto Secundario** | `#94a3b8` | `text-slate-400` | Texto para descripciones y metadatos. |

## 4. Clases Utilitarias Clave (Compatibles con Tailwind v3 para Hugo)

Para asegurar la máxima compatibilidad con Hugo (Tailwind v3) y mantener un código semántico limpio en los templates HTML, se recomiendan los siguientes patrones:

### Tarjeta Glassmorphic (Glass Card)
```html
<div class="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
  <!-- Contenido -->
</div>
```

### Etiquetas/Tags de Tecnologías
```html
<span class="font-mono text-xs bg-slate-800/50 text-slate-300 px-2 py-1 rounded border border-white/5 flex items-center gap-1.5">
  <span class="w-2 h-2 rounded-full bg-cyan-500"></span> Kubernetes
</span>
```

### Item de Logbook
```html
<article class="p-4 bg-slate-800/30 border border-white/5 rounded-lg hover:border-cyan-500/50 transition-all cursor-pointer group">
  <div class="font-mono text-[12px] text-slate-400 mb-2 flex justify-between">
    <span>SYS.LOG // 2024.10.24</span>
    <span class="text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">&lt;read&gt;</span>
  </div>
  <h4 class="font-sans text-lg font-semibold text-slate-200 group-hover:text-cyan-500 transition-colors">Título del Log</h4>
</article>
```

## 5. Configuración Sugerida `tailwind.config.js` (Para el proyecto Hugo)

Si vas a portar este diseño a Hugo, utiliza este archivo `tailwind.config.js` en formato v3:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./layouts/**/*.html", "./content/**/*.md", "./content/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Geist', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        hud: {
          bg: '#0b0f15',
          cyan: '#0ea5e9',
          purple: '#8a2be2'
        }
      }
    },
  },
  plugins: [],
}
```

## 6. Rendimiento y Animaciones (Performance)
- **Transform & Opacity:** Limitar las animaciones hover y layout a propiedades de hardware acelerado (`transform: translate`, `opacity`). 
- **SVGs en línea:** Todos los iconos deben ser elementos `<svg>` directos en el DOM para evitar peticiones HTTP adicionales e incrementar la nota de Google PageSpeed.
- **Will-Change (Si es necesario):** Para transiciones de layout muy pesadas, pero en general las clases `transition-all duration-300` de Tailwind son suficientes.

---
*Fin del documento.*
