---
title: Instalar y habilitar acceso FTP en una instancia AWS EC2 con Linux Centos 7
description: "Te guiaré a través de la manera más rápida y fácil de configurar el acceso FTP
a una instancia EC2 con la distribución Centos 7 en AWS (Amazon Web Services)"
date: 2022-11-24
---

Te guiaré a través de la manera más rápida y fácil de configurar el acceso FTP
a una instancia EC2 con la distribución Centos 7 en AWS (Amazon Web Services),
vamos a usar VSFTPD(Very Secure FTP Daemon) asi que el primer paso es instalarlo.

<h2>Paso 1: Instala VSFTPD</h2>

1.1 Actualiza el administrador de paquetes:
{{< highlight zsh >}}
  sudo yum update
{{< /highlight >}}

1.2 Instala el software VSFTP:
{{< highlight zsh >}}
  sudo yum install vsftpd
{{< /highlight >}}

1.3 Inicia el servicio:
{{< highlight zsh >}}
  sudo systemctl start vsftpd
{{< /highlight >}}

1.4 Configura el servicio inicie automaticamente cuando cargue el servidor:
{{< highlight zsh >}}
  sudo systemctl enable vsftpd
{{< /highlight >}}

<h2>Paso 2: Crea un nuevo usuario FTP</h2>

2.1 El siguiente comando creara el nuevo usuario:
{{< highlight zsh >}}
  sudo adduser ftpuser
{{< /highlight >}}

2.2 Asigna un password para el usuario:
{{< highlight zsh >}}
  sudo passwd ftpuser
{{< /highlight >}}

2.3 Agrega el nuevo usuario la lista de usuarios de VSFTP:
{{< highlight zsh >}}
  echo "ftpuser" | sudo tee -a /etc/vsftpd/user_list
{{< /highlight >}}

<h2>Paso 3: Configura VSFTPD</h2>

3.1 Primero, crea una copia de respaldo del archivo de configuración:
{{< highlight zsh >}}
  sudo cp /etc/vsftpd/vsftpd.conf /etc/vsftpd/vsftpd.conf.default
{{< /highlight >}}

3.2 Abre el archivo de configuración con vim:
{{< highlight zsh >}}
  sudo vi /etc/vsftpd/vsftpd.conf
{{< /highlight >}}

3.3 Busca las siguientes variables en el archivo y actualizalas como se muestra a continuación:<br>
<strong>Nota:</strong> Es probable que algunas de las variables no existan, solo agregalas al final de archivo.
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

3.4 Reinicia el servicio:
{{< highlight zsh >}}
  sudo systemctl restart vsftpd
{{< /highlight >}}

<h2>Paso 4: Crea una carpeta para el nuevo usuario</h2>

4.1 Crea la carpeta dentro del directorio raiz del usuario:
{{< highlight zsh >}}
  sudo mkdir -p /home/ftpuser/ftp/upload
{{< /highlight >}}

4.2 Asigna los permsisos de acceso de la siguiente manera:
{{< highlight zsh >}}
  sudo chmod 550 /home/ftpuser/ftp
  sudo chmod 750 /home/ftpuser/ftp/upload
  sudo chown -R ftpuser: /home/ftpuser/ftp
{{< /highlight >}}

<h2>Solución de problemas:</h2>

<h3>Problema 1: Acceso denegado(Access Denied)</h3>
Por defecto, las instancias Linux EC2 de AWS solo admiten conexion por ssh con una llave privada,
esto significa que para conectarte debes de usar un comando como el siguiente:
{{< highlight zsh >}}
  ssh -i your-private-key.pem username@ec2_ip_address
{{< /highlight >}}

1.1 Edita el archivo sshd_config:
{{< highlight zsh >}}
  sudo vi /etc/ssh/sshd_config
{{< /highlight >}}

1.2 Agrega las siguientes lineas al final del archivo:
{{< highlight zsh >}}
  Match User ftpuser
    PasswordAuthentication yes
    ChrootDirectory /home/ftpuser/ftp
{{< /highlight >}}

1.3 Reinicia el servicio:
{{< highlight zsh >}}
  sudo service sshd restart
{{< /highlight >}}
