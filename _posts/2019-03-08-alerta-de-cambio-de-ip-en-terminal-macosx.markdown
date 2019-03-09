---
layout: post
title:  "Alerta de cambio de IP en terminal MacOSX"
date:   2019-03-09 11:45:20 -0600
categories: ["terminal", "macosx", "programación"]
---

Esta semana estuve algo ocupado poniendome al tanto con mi equipo de trabajo, hay que acceder a servidores remotamente por lo que es muy importante saber siempre que sigo teniendo la misma ip publica, no tengo servicio de ip fija con mi proveedor de internet así que buscaba algo sencillo que me pudiera notificar si mi ip cambia.

Así que me puse a investigar cual seria la mejor manera, en mi trabajo utilizo bastante la terminal de línea de comandos así que un pequeño mensaje a la hora de abrir una ventana de terminal seria muy util.

Primero ejecutamos el siguiente comando para saber nuestra ip pública:

```bash
$ dig @resolver1.opendns.com ANY myip.opendns.com +short
```

A continuación vamos a abrir el archivo .bash_profile que debe de estar en la raíz de tu usuario, ejemplo: /Users/tu_nombre_de_usuario/.bash_profile

Se agrega el siguiente código, de preferencia hasta abajo, después de todo lo que ya tengas escrito en ese archivo.

```bash

ip="$(dig @resolver1.opendns.com ANY myip.opendns.com +short)"

if [[ "$ip" == "tu_ip_publica" ]] ; then
else
    echo "\033[0;31mLa IP publica cambio a $ip"
fi

```

Así es, lo único que hacemos es comparar la ip que tenemos actualmente con la ip que devuelva el comando, siempre que abramos una ventana de la terminal, si esta cambia nos mostrará un texto rojo con la nueva ip para poder modificar el código y avisar al administrador del servidor.
