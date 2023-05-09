---
title: Instalar y habilitar acceso FTP en una instancia AWS EC2 con Linux Centos 7
description: "Te guiaré a través de la manera más rápida y fácil de configurar el acceso FTP
a una instancia EC2 con la distribución Centos 7 en AWS (Amazon Web Services)"
slug: "instalar-y-habilitar-acceso-ftp-en-una-instancia-aws-ec2-con-linux-centos-7"
date: 2022-11-24
---

Te guiaré a través de la manera más rápida y fácil de configurar el acceso FTP
a una instancia EC2 con la distribución Centos 7 en AWS (Amazon Web Services),
vamos a usar VSFTPD (Very Secure FTP Daemon) así que el primer paso es instalarlo.

<h2>Instalación y configuración de VSFTPD</h2>

<h3>Paso 1: Instala VSFTPD</h3>

1. Actualiza el administrador de paquetes:
{{< highlight zsh >}}
sudo yum update
{{< /highlight >}}

2. Instala el software VSFTP:
{{< highlight zsh >}}
sudo yum install vsftpd
{{< /highlight >}}

3. Iniciar el servicio:
{{< highlight zsh >}}
sudo systemctl start vsftpd
{{< /highlight >}}

4. Configura el servicio inicie automáticamente cuando cargue el servidor:
{{< highlight zsh >}}
sudo systemctl enable vsftpd
{{< /highlight >}}

<h2>Creación de usuarios y configuración de permisos</h2>

<h3>Paso 2: Crea un nuevo usuario FTP</h3>

1. El siguiente comando crea el nuevo usuario:
{{< highlight zsh >}}
sudo adduser ftpuser
{{< /highlight >}}

2. Asigna un password para el usuario:
{{< highlight zsh >}}
sudo passwd ftpuser
{{< /highlight >}}

3. Agrega el nuevo usuario la lista de usuarios de VSFTP:
{{< highlight zsh >}}
echo "ftpuser" | sudo tee -a /etc/vsftpd/user_list
{{< /highlight >}}

<h3>Paso 3: Configura VSFTPD</h3>

1. Primero, crea una copia de respaldo del archivo de configuración:
{{< highlight zsh >}}
sudo cp /etc/vsftpd/vsftpd.conf /etc/vsftpd/vsftpd.conf.default
{{< /highlight >}}

2. Abre el archivo de configuración con vim:
{{< highlight zsh >}}
sudo vi /etc/vsftpd/vsftpd.conf
{{< /highlight >}}

3. Busca las siguientes variables en el archivo y actualízalas como se muestra a continuación:<br>
Nota: Es probable que algunas de las variables no existan, solo agrégalas al final de archivo.
{{< highlight zsh >}}
anonymous_enable=NO
local_enable=YES
write_enable=YES
chroot_local_user=YES
allow_writeable_chroot=YES
userlist_enable=YES
userlist_file=/etc/vsftpd/user_list
userlist_deny=NO
{{< /highlight >}}

4. Reiniciar el servicio:
{{< highlight zsh >}}
sudo systemctl restart vsftpd
{{< /highlight >}}

<h3>Paso 4: Crea una carpeta para el nuevo usuario</h3>

1. Crea la carpeta dentro del directorio raíz del usuario:
{{< highlight zsh >}}
sudo mkdir -p /home/ftpuser/ftp/upload
{{< /highlight >}}

2. Asigna los permisos de acceso de la siguiente manera:
{{< highlight zsh >}}
sudo chmod -R 755 /home/ftpuser/ftp
sudo chown -R ftpuser: /home/ftpuser/ftp
{{< /highlight >}}

<h2>Habilitar la autenticación por contraseña para el usuario FTP</h2>

<h3>Paso 5: Habilitar la autenticación por contraseña en SSH para el usuario FTP</h3>

1. Edita el archivo sshd_config:
{{< highlight zsh >}}
sudo vi /etc/ssh/sshd_config
{{< /highlight >}}

2. Agrega las siguientes líneas al final del archivo:
{{< highlight zsh >}}
Match User ftpuser
  PasswordAuthentication yes
  ChrootDirectory /home/ftpuser/ftp
{{< /highlight >}}

3. Reiniciar el servicio:
{{< highlight zsh >}}
sudo service sshd restart
{{< /highlight >}}
