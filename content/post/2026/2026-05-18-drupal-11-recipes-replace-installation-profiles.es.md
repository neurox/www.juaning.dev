---
title: "Cambio Arquitectónico: Reemplazando Perfiles de Instalación con Recetas en Drupal 11"
seoTitle: "Recetas de Drupal 11 vs Perfiles de Instalación: Arquitectura Multisitio Empresarial | Juan Gómez"
description: "Cómo las Recetas (Recipes) de Drupal 11 están reemplazando los perfiles de instalación monolíticos para un despliegue componible y estandarizado en ecosistemas multisitio empresariales."
date: "2026-05-18"
categories: ["Drupal", "Arquitectura"]
tags: ["Drupal 11", "Recipes", "Perfiles de Instalación", "Multisitio", "Composer"]
icon: "terminal"
url: "/es/post/2026/recetas-drupal-11-reemplazan-perfiles-instalacion/"
---

Durante años, los equipos empresariales de Drupal han enfrentado una disyuntiva incómoda. Los **Perfiles de Instalación** -- esos archivos `*.profile` monolíticos empaquetados con módulos personalizados, configuración hardcodeada y lógica de instalador -- eran la única forma confiable de estandarizar una plataforma en docenas de sitios. Funcionaban, pero se fosilizaban. Cada ajuste por división significaba un fork. Cada fork significaba una carga de mantenimiento que crecía cuadráticamente con el número de inquilinos.

Drupal 11 cambia esta ecuación. Con las **Recetas (Recipes)** estabilizadas en el núcleo a partir del ciclo de lanzamiento 11.x, ahora tenemos una alternativa componible que transforma fundamentalmente la forma en que aprovisionamos y escalamos plataformas empresariales. Este artículo explora las implicaciones arquitectónicas para ecosistemas multisitio de gran escala que atienden a docenas de divisiones.

## El Problema con los Perfiles de Instalación Monolíticos

Consideremos un escenario empresarial típico: un holding con 15 divisiones operativas, cada una requiriendo un sitio Drupal con funcionalidad base compartida (SSO, gobierno de contenido, gestión de medios) más conjuntos de funciones específicos por división (flujos de trabajo personalizados, modelos de contenido específicos del dominio, sistemas integrados de negocio).

Con los Perfiles de Instalación, la arquitectura típicamente colapsa en uno de dos patrones igualmente dolorosos:

**Patrón A: El Perfil "Todo Incluido"**
Un perfil único conteniendo cada funcionalidad posible, controlada por permisos y configuración. Simple de desplegar -- un perfil para gobernarlos a todos -- pero cada sitio paga el impuesto de rendimiento y complejidad por funcionalidades que no utiliza. Las actualizaciones requieren pruebas de regresión coordinadas en todas las divisiones.

**Patrón B: Forks del Perfil Base**
Cada división mantiene su propio perfil heredando de uno base. Flexible, pero la cadena de herencia rápidamente se convierte en una pesadilla de dependencias. Una actualización de seguridad al perfil base debe propagarse a 15 forks, cada uno con sus propios conflictos y sobrescrituras. Drush PM y Composer luchan por resolver estos grafos de dependencias anidados.

Ambos patrones comparten una causa raíz: **los Perfiles de Instalación son artefactos de todo-o-nada.** Empaquetan módulos, configuración y lógica de instalación en una unidad atómica que no puede ser fácilmente compuesta, reordenada o aplicada selectivamente después de la instalación inicial del sitio.

## Recetas de Drupal 11: Una Alternativa Componible

Las Recetas resuelven esto desacoplando las preocupaciones que los Perfiles de Instalación forzaban a estar juntas. Una Receta es un paquete reutilizable y declarativo que puede:

- Instalar módulos y temas
- Importar configuración
- Ejecutar PHP arbitrario durante la aplicación
- Declarar dependencias de otras Recetas
- Ser aplicada a un sitio existente -- no solo durante la instalación

Este último punto es transformador para flujos de trabajo empresariales. Ya no estás bloqueado por decisiones tomadas en el momento de `drush site:install`. Una Receta puede aplicarse incrementalmente a medida que los requisitos de negocio evolucionan, habilitando un enfoque genuinamente iterativo para la estandarización de la plataforma.

Veamos un ejemplo concreto para nuestro escenario del holding.

### Receta de Infraestructura Base

```yaml
# recipes/base-infrastructure/recipe.yml
name: "Infraestructura Base"
description: "SSO central, auditoría y gestión de medios para todas las divisiones"
type: Recipe

install:
  - acquia_connector
  - samlauth
  - automated_cron
  - media
  - media_library

config:
  actions:
    system.site:
      simpleConfig:
        page.front: "/node/1"
    samlauth.settings:
      simpleConfig:
        sp_entity_id: "https://sso.internal.example.com"
        idp_url: "https://idp.example.com/saml2"
```

### Receta de Flujos de Trabajo por División

```yaml
# recipes/division-rh-flujos/recipe.yml
name: "Flujos de Trabajo RH"
description: "Flujos de contenido personalizados e integración para división de RH"
type: Recipe

dependencies:
  - recipes/base-infrastructure

install:
  - workflows
  - content_moderation
  - views_bulk_operations

config:
  actions:
    workflows.workflow.editorial:
      create:
        id: editorial
        label: "Editorial RH"
        type: content_moderation
        type_settings:
          states:
            draft:
              label: Borrador
            review:
              label: En Revisión
            published:
              label: Publicado
          transitions:
            submit_for_review:
              from: [draft]
              to: review
            approve:
              from: [review]
              to: published
```

Cada Receta declara sus dependencias explícitamente. Al aplicarse, Drupal resuelve el grafo de dependencias y aplica las Recetas en orden topológico, asegurando que la infraestructura base esté en su lugar antes de que las capas específicas de cada división se añadan encima.

## Aprovisionamiento a Escala: Flujo de Trabajo Multisitio

Para una plataforma empresarial, el flujo de aprovisionamiento cambia de "clonar un perfil de instalación y personalizar" a "aplicar un conjunto curado de Recetas." Así es como funciona en la práctica:

```bash
# Paso 1: Instalar una instancia mínima de Drupal 11
composer create-project drupal/recommended-project plataforma-divisiones
cd plataforma-divisiones

# Paso 2: Agregar tu repositorio de Recetas
composer config repositories.recipes vcs https://github.com/ejemplo/recipes.git
composer require ejemplo/recipes:^1.0

# Paso 3: Aprovisionar cada sitio divisional
# División A -- configuración estándar
drush site:install minimal --yes
drush recipe recipes/base-infrastructure
drush recipe recipes/division-publicacion-contenido

# División B -- RH, con recetas adicionales de flujo de trabajo
drush site:install minimal --yes
drush recipe recipes/base-infrastructure
drush recipe recipes/division-rh-flujos
drush recipe recipes/division-portal-contratacion

# División C -- huella mínima (micrositio público)
drush site:install minimal --yes
drush recipe recipes/base-infrastructure
drush recipe recipes/micrositio-publico
```

Note lo que está ausente: no hay un fork de distribución monolítica, no hay una cadena de herencia frágil, y no hay un compromiso inicial con cada funcionalidad que una división podría eventualmente necesitar. Cada división comienza desde la misma base mínima y añade exactamente las Recetas que requiere.

## Integración con CI/CD

En un flujo de trabajo GitOps, las Recetas se integran naturalmente con tu pipeline de despliegue. Considera una matriz de GitHub Actions que valida cada combinación de Recetas en uso en tu ecosistema:

```yaml
jobs:
  validacion-recetas:
    strategy:
      matrix:
        conjunto-recetas:
          - "base-infrastructure division-publicacion-contenido"
          - "base-infrastructure division-rh-flujos division-portal-contratacion"
          - "base-infrastructure micrositio-publico"
    steps:
      - uses: actions/checkout@v4
      - name: Validar composición de recetas
        run: |
          ddev drush site:install minimal --yes
          for recipe in ${{ matrix.conjunto-recetas }}; do
            ddev drush recipe recipes/$recipe
          done
          ddev drush core:status
```

Cada celda en la matriz valida que la composición de Recetas se instala limpiamente, la configuración se importa sin errores, y no surgen conflictos de dependencias. Las composiciones fallidas bloquean el pipeline antes de llegar a producción.

## Ventajas Operativas

El cambio de Perfiles de Instalación a Recetas produce beneficios operativos medibles para equipos empresariales:

**Ciclos de Vida Independientes.** Los módulos de infraestructura base pueden actualizarse independientemente de las funcionalidades específicas de cada división. Un parche al módulo de autenticación SAML no requiere revalidar los flujos de trabajo de RH o el portal de contratación.

**Adopción Gradual.** Las Recetas pueden aplicarse a sitios productivos existentes. Puedes migrar un sitio legacy basado en perfil de instalación pieza por pieza, extrayendo funcionalidades en Recetas incrementalmente, en lugar de planificar una migración riesgosa de tipo "big-bang".

**Reducción de Superficie de Pruebas.** Cada Receta puede probarse de forma aislada y en composiciones conocidas. La matriz de pruebas es combinatorial a través de tus composiciones activas, no exponencial a través de todas las interacciones de funcionalidades posibles.

**Especialización de Roles.** El equipo de plataforma es dueño de la Receta de infraestructura base. Los equipos de cada división son dueños de sus Recetas específicas de dominio. El grafo de dependencias proporciona un contrato claro entre equipos, eliminando los costos de coordinación de un perfil monolítico compartido.

## Estrategia de Migración para Perfiles de Instalación Existentes

Si estás gestionando una plataforma Drupal 7 o 10 legacy con un perfil de instalación personalizado hoy, la ruta de migración a Recetas es deliberada pero alcanzable:

1. **Audita tu perfil.** Descomponlo en límites funcionales lógicos. Cada límite se convierte en una Receta candidata.
2. **Identifica infraestructura compartida.** SSO, medios, analítica y gobierno deben convertirse en tu Receta base.
3. **Extrae incrementalmente.** Construye cada Receta contra una instalación `minimal` de Drupal 11. Valida que funcione de forma aislada.
4. **Compon en staging.** Aplica Recetas en grupos que coincidan con tu configuración multisitio actual. Compara la configuración resultante contra tus sitios legacy.
5. **Despliega gradualmente.** Aplica la Receta base primero en todos los sitios, luego añade Recetas específicas de división. La capacidad de aplicar Recetas a sitios en ejecución significa que puedes iterar sin ventanas de mantenimiento.

## Cuándo los Perfiles de Instalación Aún Tienen Sentido

Para ser precisos: las Recetas no obsoletan los Perfiles de Instalación por completo. Si estás distribuyendo un producto independiente -- por ejemplo, una distribución Drupal para universidades u organizaciones sin fines de lucro -- un perfil de instalación bien elaborado aún proporciona una experiencia de paquete único que es más simple para los usuarios finales. Las Recetas sobresalen en entornos donde controlas el pipeline de despliegue y necesitas componibilidad sobre simplicidad de empaquetado.

## Conclusión Arquitectónica

La estabilización de las Recetas de Drupal en 2026 no es simplemente una nueva funcionalidad -- es un cambio arquitectónico en cómo pensamos sobre el aprovisionamiento de plataformas. Los Perfiles de Instalación optimizaban para el problema de **empaquetado**: cómo enviar una experiencia Drupal completa en un solo artefacto. Las Recetas optimizan para el problema de **composición**: cómo ensamblar conjuntos de funcionalidades estandarizados, probables y mantenidos independientemente a través de un ecosistema heterogéneo.

Para equipos empresariales gestionando plataformas multisitio a escala, la elección es clara. Las Recetas reducen el impuesto de coordinación, eliminan el ciclo de mantenimiento de forks, y traen los mismos principios de componibilidad que transformaron la arquitectura de microservicios al mundo del aprovisionamiento de sitios Drupal.
