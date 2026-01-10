# 通过github把网站部署到云服务器

## 创建专用部署用户

### 创建用户

```bash
sudo useradd -m -s /bin/bash deployer
```

### 设置目录权限

```bash
# 创建部署目录
sudo mkdir -p /var/www/jw-blog

# 设置所有权
sudo chown -R deployer:www-data /var/www/jw-blog

# 设置权限
sudo chmod -R 775 /var/www/jw-blog
```

## 在服务器上安装Nginx

```bash
# SSH 登录到你的云服务器
ssh root@你的服务器IP

# 安装 Nginx
apt update && apt install -y nginx

# 创建网站目录
mkdir -p /var/www/jw-blog

# 设置权限
sudo chown -R deployer:www-data /var/www/jw-blog/
```

## 配置Nginx

创建Nginx配置文件：

```bash
vim /etc/nginx/sites-available/jw-blog
```

写入以下内容（替换 你的域名）：

```
server {
    listen 80;
    server_name www.jw-world.cloud jw-world.cloud;
    return 301 https://$server_name$request_uri;  # HTTP 重定向到 HTTPS
}

server {
    listen 443 ssl http2;
    server_name www.jw-world.cloud jw-world.cloud;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    root /var/www/jw-blog;  # 与 GitHub Actions 的 REMOTE_TARGET 一致
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 缓存静态资源
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

启用配置：

```
ln -s /etc/nginx/sites-available/jw-blog /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

## 在Github配置Secrets

这个是供`.github/workflows/deploy.yaml`使用的

进入你的 GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret

添加以下 4 个 Secrets：

| Secret 名称       | 值                          |
| --------------- | -------------------------- |
| SSH_PRIVATE_KEY | 你的 SSH 私钥（见下方获取方法）         |
| REMOTE_HOST     | 云服务器 IP（如 123.45.67.89）    |
| REMOTE_USER     | SSH 用户名（通常是 root）          |
| REMOTE_PORT     | SSH 端口（通常是 22）             |
| REMOTE_TARGET   | 网站目录路径（如 /var/www/jw-blog） |

## 获取SSH私钥

为部署专门生成新密钥

```bash
# 生成新密钥
ssh-keygen -t rsa -b 4096 -m PEM -C "github-deploy" -f ~/.ssh/github_deploy_pem -N ""

# 查看私钥（添加到 GitHub Secrets）
cat ~/.ssh/github_deploy_pem

# 查看公钥（添加到服务器）
cat ~/.ssh/github_deploy_pem.pub
```

然后把**公钥**添加到云服务器：

```bash
# 创建 .ssh 目录
sudo mkdir -p /home/deployer/.ssh
sudo chown deployer:deployer /home/deployer/.ssh
sudo chmod 700 /home/deployer/.ssh

# 添加公钥
echo '...' | sudo tee /home/deployer/.ssh/authorized_keys

sudo chown deployer:deployer /home/deployer/.ssh/authorized_keys
sudo chmod 600 /home/deployer/.ssh/authorized_keys
```