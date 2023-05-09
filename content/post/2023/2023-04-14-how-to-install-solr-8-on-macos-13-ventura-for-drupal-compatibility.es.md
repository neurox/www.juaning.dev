---
title: Cómo instalar Solr 8 en macOS 13 Ventura para compatibilidad con Drupal.
description: "Si estás usando Drupal y necesitas instalar Solr para la funcionalidad de búsqueda,
puedes encontrar problemas de compatibilidad con la última versión de Solr disponible a través de Homebrew.
El esquema de Solr 9 aún no es compatible con Drupal, por lo que necesitarás instalar Solr 8 en su lugar. En esta guía,
te guiaré a través del proceso de instalación de Solr 8 en macOS 13 Ventura."
slug: "como-instalar-solr-8-en-macos-13-ventura-para-compatibilidad-con-drupal"
date: 2023-04-14
---

<p>Como quizás hayas notado, la versión de Solr incluida en la última versión de Homebrew es la 9 y
su esquema aún no es compatible con Drupal. Te mostraré cómo obtener la versión 8 de Solr, que sí es
compatible con Drupal.</p>

<h2>Requisitos</h2>

1. Homebrew
2. Java 8

<h2>Paso 1: Instalar Java 8 usando Homebrew</h2>
<p>Si aún no has instalado Homebrew, puedes encontrar las instrucciones de instalación en <a href="https://brew.sh/" target="_blank">https://brew.sh/</a>.
Después de instalar Homebrew, abre la Terminal y ejecuta el siguiente comando para instalar Java 8:</p>
{{< highlight zsh >}}
brew install --cask adoptopenjdk/openjdk/adoptopenjdk8
{{< /highlight >}}

<h2>Paso 2: Encuentra la ruta de instalación de Java 8</h2>
<p>Para encontrar la ruta del Java 8 instalado, ejecuta este comando en la Terminal:</p>
{{< highlight zsh >}}
/usr/libexec/java_home -v 1.8
{{< /highlight >}}

<p>Toma nota de la salida, que debería ser algo como /Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home.</p>
<h2>Paso 3: Establecer la variable de entorno JAVA_HOME</h2>
<p>Para establecer la variable de entorno JAVA_HOME, abre tu archivo de perfil de shell (p. ej., ~/.bash_profile, ~/.bashrc o ~/.zshrc)
en un editor de texto y agrega la siguiente línea, reemplazando /ruta/al/java8 con la ruta que encontraste en el paso 2:</p>
{{< highlight zsh >}}
export JAVA_HOME="/ruta/al/java8"
{{< /highlight >}}

<p>Por ejemplo, si la ruta del paso 2 fue /Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home,
la línea que debes agregar a tu perfil de shell es:</p>
{{< highlight zsh >}}
export JAVA_HOME="/Library/Java/JavaVirtualMachines/adoptopenjdk-8.jdk/Contents/Home"
{{< /highlight >}}

<p>Guarda el archivo y cierra el editor de texto.</p>
<h2>Paso 4: Aplicar cambios</h2>
<p>Ejecuta el siguiente comando para aplicar los cambios en la sesión actual:</p>
{{< highlight zsh >}}
source ~/.zshrc
{{< /highlight >}}

<h2>Paso 5: Verificar la versión de Java</h2>
<p>Verifica que estés usando la versión correcta de Java ejecutando:</p>
{{< highlight zsh >}}
java -version
{{< /highlight >}}

<h2>Paso 6: Descargar Solr 8</h2>
<p>Dirígete al <a href="https://archive.apache.org/dist/lucene/solr/8.9.0/" target="_blank">archivo de Apache Solr 8</a>
y descarga el archivo .tgz para esa versión.</p>
<p>Extrae el archivo descargado:
Abre la Terminal y navega hasta el directorio donde se encuentra el archivo .tgz descargado. Extrae el contenido usando el siguiente comando:</p>
{{< highlight zsh >}}
tar xzf solr-8.9.0.tgz
{{< /highlight >}}

<p>Reemplaza solr-8.9.0.tgz con el nombre del archivo .tgz descargado.</p>
<p>Mueve el directorio extraído a la ubicación deseada: Puedes mover el directorio extraído a la ubicación que prefieras.
Por ejemplo, puedes moverlo al directorio /opt:</p>
{{< highlight zsh >}}
sudo mv solr-8.9.0 /opt/solr
{{< /highlight >}}

<h2>Paso 7: Configurar variables de entorno</h2>
<p>Agrega el binario de Solr a la ruta PATH de tu sistema agregando la siguiente línea a tu perfil de shell (p. ej., ~/.bash_profile, ~/.bashrc o ~/.zshrc):</p>
{{< highlight zsh >}}
export PATH=$PATH:/opt/solr/bin
{{< /highlight >}}

<p>Guarda el archivo y luego ejecuta source ~/.bash_profile, source ~/.bashrc o source ~/.zshrc (dependiendo de cuál archivo editaste) para aplicar los cambios inmediatamente.
<h2>Paso 8: Iniciar Solr</h2>
<p>Ejecuta el siguiente comando en la Terminal para iniciar Solr:</p>
{{< highlight zsh >}}
solr start
{{< /highlight >}}

<h2>Paso 9: Verificar la instalación de Solr</h2>
<p>Comprueba que Solr esté ejecutándose abriendo un navegador web y navegando a <a href="http://localhost:8983/solr/" target="_blank">http://localhost:8983/solr/</a>.
Deberías ver el panel de administración de Solr.</p>
<h2>Paso 10: Crear un Launch Daemon</h2>
<p>Ahora que Solr está instalado, tendrás que iniciarlo cada vez que reinicies el ordenador. Para evitar eso, vamos a crear
un Launch Daemon que lanzará el servicio Solr automáticamente.</p>
<h3>Crear un archivo plist</h3>
<p>Crea un nuevo archivo llamado org.apache.solr.plist utilizando un editor de texto como nano o vim, y agrega el siguiente contenido:</p>

{{< highlight xml >}}
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
{{< /highlight >}}

<h3>Mover el archivo plist a la carpeta LaunchAgents</h3>
<p>Copia el archivo org.apache.solr.plist en la carpeta ~/Library/LaunchAgents/:</p>
{{< highlight zsh >}}
cp org.apache.solr.plist ~/Library/LaunchAgents/
{{< /highlight >}}

<h3>Cargar el agente de lanzamiento</h3>
<p>Carga el archivo plist en launchd:</p>
{{< highlight zsh >}}
launchctl load ~/Library/LaunchAgents/org.apache.solr.plist
{{< /highlight >}}

<p>Ahora, Solr debería iniciarse automáticamente cada vez que inicies sesión en tu cuenta de usuario.
Si deseas detener Solr de iniciarse automáticamente, puedes deshabilitar el archivo plist:</p>
{{< highlight zsh >}}
launchctl unload ~/Library/LaunchAgents/org.apache.solr.plist
{{< /highlight >}}