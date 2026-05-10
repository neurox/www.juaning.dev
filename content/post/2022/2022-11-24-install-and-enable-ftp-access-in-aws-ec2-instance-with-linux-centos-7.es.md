---
title: "Configuración de Acceso FTP Seguro en AWS EC2 (CentOS 7)"
seoTitle: "Configurar VSFTPD en AWS EC2 CentOS 7 | Juan Gómez"
description: "Una guía profesional para instalar y endurecer VSFTPD en instancias de AWS EC2 con CentOS 7 para transferencias de datos controladas en infraestructuras heredadas."
date: 2022-11-24
categories: ["DevOps", "Cloud"]
tags: ["AWS", "EC2", "CentOS", "VSFTPD", "Infraestructura"]
icon: "terminal"
---

La gestión de infraestructuras en la nube heredadas a menudo requiere equilibrar los protocolos de seguridad modernos con las necesidades tradicionales de transferencia de datos. Si bien **SFTP** (SSH File Transfer Protocol) es el estándar de la industria para transferencias seguras, ciertos flujos de trabajo empresariales o integraciones legacy aún requieren un entorno **FTP** robusto.

Esta guía detalla el proceso de instalación y configuración de **VSFTPD** (Very Secure FTP Daemon) en una instancia de AWS EC2 con Linux CentOS 7.

> **⚠️ Nota de Seguridad:** El protocolo FTP estándar transmite datos en texto plano. Para entornos de producción, recomiendo encarecidamente utilizar **SFTP** o configurar **FTPS** (FTP sobre SSL). Esta guía se centra en la configuración base para entornos controlados.

---

## 1. Instalación de VSFTPD

El primer paso es instalar el demonio y asegurar que se inicialice correctamente dentro del gestor de servicios del sistema.

```zsh
# Actualizar el gestor de paquetes e instalar vsftpd
sudo yum update -y
sudo yum install vsftpd -y

# Habilitar e iniciar el servicio
sudo systemctl start vsftpd
sudo systemctl enable vsftpd
```

## 2. Gestión de Usuarios y Seguridad

Crear un usuario dedicado y restringido es esencial para mantener el principio de menor privilegio.

```zsh
# Crear un usuario FTP dedicado
sudo adduser ftpuser
sudo passwd ftpuser

# Añadir a la lista de usuarios permitidos
echo "ftpuser" | sudo tee -a /etc/vsftpd/user_list
```

## 3. Ajuste de Configuración

Debemos modificar el archivo `vsftpd.conf` para imponer reglas de acceso estrictas, incluyendo "jaulas" `chroot` para evitar que los usuarios naveguen fuera de sus directorios de inicio.

```zsh
# Editar /etc/vsftpd/vsftpd.conf y actualizar lo siguiente:
anonymous_enable=NO
local_enable=YES
write_enable=YES
chroot_local_user=YES
allow_writeable_chroot=YES
userlist_enable=YES
userlist_file=/etc/vsftpd/user_list
userlist_deny=NO
```

Después de modificar la configuración, reinicia el servicio:
```zsh
sudo systemctl restart vsftpd
```

## 4. Estructura de Directorios y Permisos

Establece un entorno de carga estructurado para el usuario:

```zsh
sudo mkdir -p /home/ftpuser/ftp/upload
sudo chmod -R 755 /home/ftpuser/ftp
sudo chown -R ftpuser: /home/ftpuser/ftp
```

## 5. Habilitar Autenticación por Contraseña vía SSH

En las instancias estándar de AWS EC2, la autenticación por contraseña suele estar deshabilitada en favor de las llaves SSH. Si tu flujo de trabajo FTP requiere acceso basado en contraseña, debes configurar una regla específica en `sshd_config`.

```ssh
# Añadir al final de /etc/ssh/sshd_config
Match User ftpuser
  PasswordAuthentication yes
  ChrootDirectory /home/ftpuser/ftp
```

Reinicia el servicio SSH para aplicar los cambios:
```zsh
sudo service sshd restart
```

---

## Conclusión

Al seguir estos pasos, has establecido una puerta de enlace FTP funcional en tu infraestructura de AWS. Para una seguridad de nivel empresarial, considera complementar esto con reglas de Grupos de Seguridad de AWS para restringir el acceso a rangos de IP específicos.

> **¿Necesitas modernizar tu infraestructura en la nube?**
> Como especialista en DevOps, ayudo a las empresas a transicionar de protocolos de transferencia heredados a una automatización segura y nativa de la nube. [Conectemos](https://juaning.dev/es/contacto/) para blindar tu entorno AWS.
