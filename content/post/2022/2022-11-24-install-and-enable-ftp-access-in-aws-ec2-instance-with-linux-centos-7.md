---
title: "Configuring Secure FTP Access on AWS EC2 (CentOS 7)"
seoTitle: "Setup VSFTPD on AWS EC2 CentOS 7 | Juan Gómez"
description: "A professional guide to installing and hardening VSFTPD on AWS EC2 CentOS 7 instances for controlled legacy data transfers."
date: 2022-11-24
categories: ["DevOps", "Cloud"]
tags: ["AWS", "EC2", "CentOS", "VSFTPD", "Infrastructure"]
icon: "terminal"
---

Managing legacy cloud infrastructure often requires balancing modern security protocols with traditional data transfer needs. While **SFTP** (SSH File Transfer Protocol) is the industry standard for secure transfers, certain enterprise workflows or legacy integrations still necessitate a hardened **FTP** environment.

This guide details the process of installing and configuring **VSFTPD** (Very Secure FTP Daemon) on an AWS EC2 instance running Linux CentOS 7.

> **⚠️ Security Note:** Standard FTP transmits data in plain text. For production environments, I strongly recommend utilizing **SFTP** or configuring **FTPS** (FTP over SSL). This guide focuses on the base configuration for controlled environments.

---

## 1. VSFTPD Installation

The first step is to install the daemon and ensure it initializes correctly within the system's service manager.

```zsh
# Update package manager and install vsftpd
sudo yum update -y
sudo yum install vsftpd -y

# Enable and start the service
sudo systemctl start vsftpd
sudo systemctl enable vsftpd
```

## 2. User Management & Hardening

Creating a dedicated, restricted user is essential for maintaining the principle of least privilege.

```zsh
# Create a dedicated FTP user
sudo adduser ftpuser
sudo passwd ftpuser

# Add to the allowed user list
echo "ftpuser" | sudo tee -a /etc/vsftpd/user_list
```

## 3. Configuration Tuning

We must modify the `vsftpd.conf` file to enforce strict access rules, including `chroot` jails to prevent users from navigating outside their home directories.

```zsh
# Edit /etc/vsftpd/vsftpd.conf and update the following:
anonymous_enable=NO
local_enable=YES
write_enable=YES
chroot_local_user=YES
allow_writeable_chroot=YES
userlist_enable=YES
userlist_file=/etc/vsftpd/user_list
userlist_deny=NO
```

After modifying the configuration, restart the service:
```zsh
sudo systemctl restart vsftpd
```

## 4. Directory Structure & Permissions

Establish a structured upload environment for the user:

```zsh
sudo mkdir -p /home/ftpuser/ftp/upload
sudo chmod -R 755 /home/ftpuser/ftp
sudo chown -R ftpuser: /home/ftpuser/ftp
```

## 5. Enabling Password Authentication via SSH

In standard AWS EC2 instances, password authentication is often disabled in favor of SSH keys. If your FTP workflow requires password-based access, you must configure a specific match rule in `sshd_config`.

```ssh
# Add to the end of /etc/ssh/sshd_config
Match User ftpuser
  PasswordAuthentication yes
  ChrootDirectory /home/ftpuser/ftp
```

Restart the SSH service to apply changes:
```zsh
sudo service sshd restart
```

---

## Conclusion

By following these steps, you have established a functional FTP gateway on your AWS infrastructure. For enterprise-grade security, consider layering this with AWS Security Group rules to restrict access to specific IP ranges.

> **Need to modernize your Cloud Infrastructure?**
> As a DevOps specialist, I help companies transition from legacy transfer protocols to secure, cloud-native automation. [Let's connect](https://juaning.dev/contact) to harden your AWS environment.
