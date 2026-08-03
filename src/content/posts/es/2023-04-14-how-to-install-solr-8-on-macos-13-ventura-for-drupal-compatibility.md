---
title: "Instalación de Solr 8 en macOS Ventura: Guía para Ingenieros Drupal"
seoTitle: "Instalar Solr 8 en macOS Ventura para Compatibilidad con Drupal | Juan Gómez"
description: "Resuelve problemas de compatibilidad de esquemas entre Drupal y Solr 9 instalando Solr 8 en macOS Ventura. Una guía profesional para la paridad en entornos de desarrollo."
date: 2023-04-14
categories: ["Drupal", "Desarrollo"]
tags: ["Solr", "macOS", "Search API", "Drupal 10"]
icon: "terminal"
---

Al construir plataformas Drupal de nivel empresarial, mantener la paridad entre el desarrollo local y los entornos de producción es crítico. A menudo, las versiones más recientes disponibles a través de gestores de paquetes como Homebrew (como Solr 9) introducen cambios disruptivos o incompatibilidades de esquema con el ecosistema actual de **Drupal Search API**.

Para los desarrolladores que necesitan compatibilidad con **Solr 8** en macOS 13 Ventura, esta guía proporciona un camino de instalación estructurado y profesional.

## El Desafío de Compatibilidad

A partir de macOS Ventura, el paquete por defecto de Homebrew para Solr se ha movido a la versión 9.x. Sin embargo, muchos despliegues empresariales de Drupal todavía dependen del esquema de Solr 8.x para su estabilidad. Ejecutar versiones desajustadas puede provocar errores de indexación y resultados de búsqueda inconsistentes.

---

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
1.  **Homebrew** (El gestor de paquetes de macOS).
2.  **Java 8** (Requerido para la estabilidad de Solr 8).

## Paso 1: Instalar Java 8 vía Homebrew

Solr 8 tiene una fuerte dependencia de Java 8. Para evitar conflictos de versiones, utilizamos el tap de `adoptopenjdk`:

```zsh
brew install --cask adoptopenjdk/openjdk/adoptopenjdk8
```

## Paso 2: Configurar JAVA_HOME

Para asegurar que Solr utilice la JVM correcta, debemos encontrar y exportar la ruta de `JAVA_HOME`.

Verifica la ruta de instalación:
```zsh
/usr/libexec/java_home -v 1.8
```

Añade lo siguiente a tu perfil de shell (`.zshrc` o `.bash_profile`):
```zsh
# Reemplaza con la ruta encontrada arriba
export JAVA_HOME="/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home"
source ~/.zshrc
```

## Paso 3: Instalación Manual de Solr 8

Dado que Homebrew prioriza la versión 9, realizaremos una instalación manual en un directorio `/opt` dedicado para un mejor control.

1.  **Descarga:** Obtén los binarios heredados del [Archivo de Apache Solr 8](https://archive.apache.org/dist/lucene/solr/8.9.0/).
2.  **Extraer y Mover:**
    ```zsh
    tar xzf solr-8.9.0.tgz
    sudo mv solr-8.9.0 /opt/solr
    ```

## Paso 4: Integración en el Path del Sistema

Añade el binario de Solr al PATH de tu sistema para permitir el acceso global a los comandos:

```zsh
export PATH=$PATH:/opt/solr/bin
source ~/.zshrc
```

## Paso 5: Automatización con un Launch Daemon

Para una configuración local profesional, Solr debería ejecutarse como un servicio en segundo plano que persista tras los reinicios. Logramos esto usando una configuración `plist` de macOS.

### Crear el LaunchAgent

Crea el archivo `~/Library/LaunchAgents/org.apache.solr.plist` con la siguiente definición:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>org.apache.solr</string>
    <key>ProgramArguments</key>
    <array>
        <string>/opt/solr/bin/solr</string>
        <string>start</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
    <key>StandardErrorPath</key>
    <string>/opt/solr/logs/solr.log</string>
    <key>StandardOutPath</key>
    <string>/opt/solr/logs/solr.log</string>
    <key>WorkingDirectory</key>
    <string>/opt/solr</string>
</dict>
</plist>
```

### Cargar el Servicio

```zsh
launchctl load ~/Library/LaunchAgents/org.apache.solr.plist
```

---

## Verificación

Navega a [http://localhost:8983/solr/](http://localhost:8983/solr/) para acceder al Panel de Administración de Solr. Ahora tienes un entorno estable y automatizado de Solr 8 listo para el desarrollo empresarial con Drupal.

> **¿Tienes problemas de rendimiento en tus búsquedas?**
> La optimización de núcleos de Solr y esquemas de búsqueda es una parte crítica de mis servicios de arquitectura de backend. [Conectemos](https://juaning.dev/es/contacto/) para ajustar tu infraestructura de búsqueda empresarial.