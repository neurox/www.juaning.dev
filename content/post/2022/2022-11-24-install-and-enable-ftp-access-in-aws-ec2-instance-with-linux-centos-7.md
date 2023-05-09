---
title: Install and enable FTP access on an AWS EC2 instance with Linux CentOS 7
description: "I'll guide you through the quickest and easiest way to set up FTP
access on an EC2 instance with CentOS 7 distribution on AWS (Amazon Web Services)"
date: 2022-11-24
---

I'll guide you through the quickest and easiest way to set up FTP
access on an EC2 instance with CentOS 7 distribution on AWS (Amazon Web Services).
We're going to use VSFTPD (Very Secure FTP Daemon), so the first step is to install it.

<h2>VSFTPD Installation and Configuration</h2>

<h3>Step 1: Install VSFTPD</h3>

1. Update the package manager:
{{< highlight zsh >}}
sudo yum update
{{< /highlight >}}

2. Install the VSFTP software:
{{< highlight zsh >}}
sudo yum install vsftpd
{{< /highlight >}}

3. Start the service:
{{< highlight zsh >}}
sudo systemctl start vsftpd
{{< /highlight >}}

4. Configure the service to start automatically when the server loads:
{{< highlight zsh >}}
sudo systemctl enable vsftpd
{{< /highlight >}}

<h2>User Creation and Permission Configuration</h2>

<h3>Step 2: Create a new FTP user</h3>

1. The following command creates the new user:
{{< highlight zsh >}}
sudo adduser ftpuser
{{< /highlight >}}

2. Assign a password for the user:
{{< highlight zsh >}}
sudo passwd ftpuser
{{< /highlight >}}

3. Add the new user to the VSFTP user list:
{{< highlight zsh >}}
echo "ftpuser" | sudo tee -a /etc/vsftpd/user_list
{{< /highlight >}}


<h3>Step 3: Configure VSFTPD</h3>

1. First, create a backup copy of the configuration file:
{{< highlight zsh >}}
sudo cp /etc/vsftpd/vsftpd.conf /etc/vsftpd/vsftpd.conf.default
{{< /highlight >}}

2. Open the configuration file with vim:
{{< highlight zsh >}}
sudo vi /etc/vsftpd/vsftpd.conf
{{< /highlight >}}

3. Look for the following variables in the file and update them as shown below:<br>
Note: Some variables may not exist, just add them at the end of the file.
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

4. Restart the service:
{{< highlight zsh >}}
sudo systemctl restart vsftpd
{{< /highlight >}}

<h3>Step 4: Create a folder for the new user</h3>

1. Create the folder within the user's root directory:
{{< highlight zsh >}}
sudo mkdir -p /home/ftpuser/ftp/upload
{{< /highlight >}}

2. Set the access permissions as follows:
{{< highlight zsh >}}
sudo chmod -R 755 /home/ftpuser/ftp
sudo chown -R ftpuser: /home/ftpuser/ftp
{{< /highlight >}}

<h2>Enable Password Authentication for the FTP User</h2>

<h3>Step 5: Enable Password Authentication in SSH for the FTP User</h3>

1. Edit the sshd_config file:
{{< highlight zsh >}}
sudo vi /etc/ssh/sshd_config
{{< /highlight >}}

2. Add the following lines at the end of the file:
{{< highlight zsh >}}
Match User ftpuser
  PasswordAuthentication yes
  ChrootDirectory /home/ftpuser/ftp
{{< /highlight >}}

3. Restart the service:
{{< highlight zsh >}}
sudo service sshd restart
{{< /highlight >}}
