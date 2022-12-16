---
title: Install and enable FTP access in AWS EC2 instance with Linux Centos 7
description: "I'll guide you trough the fastest and easiest way to setup FTP access to an AWS(Amazon Web Services)
EC2 Linux instance with Centos 7 distribution"
date: 2022-11-24
---

I'll guide you trough the fastest and easiest way to setup FTP access to an AWS(Amazon Web Services)
EC2 Linux instance with Centos 7 distribution, we are going to use VSFTPD(Very Secure FTP Daemon) so the first
step is to install it.

<h2>Step 1: Install VSFTPD</h2>

1.1 Update the package manager:
{{< highlight zsh >}}
  sudo yum update
{{< /highlight >}}

1.2 Install VSFTP software:
{{< highlight zsh >}}
  sudo yum install vsftpd
{{< /highlight >}}

1.3 Start the service:
{{< highlight zsh >}}
  sudo systemctl start vsftpd
{{< /highlight >}}

1.4 Set the service to auto launch when the system boot:
{{< highlight zsh >}}
  sudo systemctl enable vsftpd
{{< /highlight >}}

<h2>Step 2: Create a new FTP user</h2>

2.1 The following command will create a new user:
{{< highlight zsh >}}
  sudo adduser ftpuser
{{< /highlight >}}

2.2 Set a password for the new user:
{{< highlight zsh >}}
  sudo passwd ftpuser
{{< /highlight >}}

2.3 Add the new user to the VSFTP userlist:
{{< highlight zsh >}}
  echo "ftpuser" | sudo tee -a /etc/vsftpd/user_list
{{< /highlight >}}


<h2>Step 3: Configure VSFTPD</h2>

3.1 First, create a backup copy of the configuration file:
{{< highlight zsh >}}
  sudo cp /etc/vsftpd/vsftpd.conf /etc/vsftpd/vsftpd.conf.default
{{< /highlight >}}

3.2 Open the configuration file with vim:
{{< highlight zsh >}}
  sudo vi /etc/vsftpd/vsftpd.conf
{{< /highlight >}}

3.3 Look for the following variables and update as below:<br>
<strong>Note:</strong> some of the variables could not exist, just add the line at the end of the file
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

3.4 Restart the service:
{{< highlight zsh >}}
  sudo systemctl restart vsftpd
{{< /highlight >}}

<h2>Step 4: Create a directory for the new user</h2>

4.1 Create the directory inside the user root location:
{{< highlight zsh >}}
  sudo mkdir -p /home/ftpuser/ftp/upload
{{< /highlight >}}

4.2 Set permissions to the new directories:
{{< highlight zsh >}}
  sudo chmod 550 /home/ftpuser/ftp
  sudo chmod 750 /home/ftpuser/ftp/upload
  sudo chown -R ftpuser: /home/ftpuser/ftp
{{< /highlight >}}

<h2>Troubleshooting:</h2>

<h3>Issue 1: Access Denied</h3>
By default, AWS EC2 Linux instances just allows conections with a private key, this means that
in order to connect trough ssh to the instance you need to use the following command:
{{< highlight zsh >}}
  ssh -i your-private-key.pem username@ec2_ip_address
{{< /highlight >}}

1.1 Edit the sshd_config file:
{{< highlight zsh >}}
  sudo vi /etc/ssh/sshd_config
{{< /highlight >}}

1.2 Add the following lines to the end of the file:
{{< highlight zsh >}}
  Match User ftpuser
    PasswordAuthentication yes
    ChrootDirectory /home/ftpuser/ftp
{{< /highlight >}}

1.3 Restart the service:
{{< highlight zsh >}}
  sudo service sshd restart
{{< /highlight >}}
