# Docker 介绍与使用文档

## 目录

1. [简介](#简介)
2. [安装](#安装)
3. [核心概念](#核心概念)
4. [常用命令](#常用命令)
5. [Dockerfile](#dockerfile)
6. [Docker Compose](#docker-compose)
7. [数据管理](#数据管理)
8. [网络](#网络)
9. [FAQ](#faq)
10. [注意事项](#注意事项)
11. [参考资料](#参考资料)

---

## 简介

Docker 是一个开源的容器化平台，允许开发者将应用及其依赖打包到一个轻量级、可移植的容器中，实现"一次构建，到处运行"。

### Docker vs 虚拟机

| 特性 | Docker 容器 | 虚拟机 |
|------|------------|--------|
| 启动速度 | 秒级 | 分钟级 |
| 资源占用 | MB 级 | GB 级 |
| 隔离级别 | 进程级 | 系统级 |
| 性能 | 接近原生 | 有损耗 |
| 镜像大小 | 通常 < 500MB | 通常 > 1GB |

> 出处：[Docker 官方文档 - What is a container?](https://docs.docker.com/get-started/overview/)

---

## 安装

### macOS

```bash
# 方式一：官网下载 Docker Desktop
# https://docs.docker.com/desktop/install/mac-install/

# 方式二：Homebrew 安装
brew install --cask docker
```

### Linux (Ubuntu/Debian)

```bash
# 卸载旧版本
sudo apt-get remove docker docker-engine docker.io containerd runc

# 设置仓库
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg lsb-release

# 添加 Docker 官方 GPG key
sudo mkdir -m 0755 -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# 设置仓库源
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 安装 Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

> 出处：[Docker 官方安装文档](https://docs.docker.com/engine/install/ubuntu/)

### Windows

下载 Docker Desktop for Windows：https://docs.docker.com/desktop/install/windows-install/

> 需要启用 WSL 2 或 Hyper-V。

### 验证安装

```bash
docker --version
docker run hello-world
```

### 配置镜像加速（国内用户）

编辑 `~/.docker/daemon.json`（Docker Desktop 可在设置中配置）：

```json
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://docker.mirrors.ustc.edu.cn"
  ]
}
```

> 出处：[Docker 中国镜像加速](https://docs.docker.com/registry/recipes/mirror/)


---

## 核心概念

### 镜像（Image）

镜像是一个只读模板，包含运行应用所需的代码、运行时、库、环境变量和配置文件。镜像采用分层存储（Union FS），每一层都是只读的。

### 容器（Container）

容器是镜像的运行实例。可以被创建、启动、停止、删除。容器之间相互隔离，每个容器有自己的文件系统、网络和进程空间。

### 仓库（Registry）

存储和分发镜像的服务。Docker Hub（https://hub.docker.com）是默认的公共仓库。

> 出处：[Docker 官方文档 - Docker objects](https://docs.docker.com/get-started/overview/#docker-objects)

---

## 常用命令

### 镜像操作

```bash
# 搜索镜像
docker search nginx

# 拉取镜像
docker pull nginx:latest

# 查看本地镜像
docker images

# 删除镜像
docker rmi nginx:latest

# 构建镜像
docker build -t myapp:1.0 .

# 给镜像打标签
docker tag myapp:1.0 myregistry/myapp:1.0

# 推送镜像
docker push myregistry/myapp:1.0

# 查看镜像历史（各层信息）
docker history nginx:latest

# 导出/导入镜像
docker save -o nginx.tar nginx:latest
docker load -i nginx.tar
```

### 容器操作

```bash
# 运行容器
docker run -d --name mynginx -p 8080:80 nginx:latest

# 参数说明：
#   -d          后台运行
#   --name      指定容器名
#   -p 8080:80  端口映射（宿主机:容器）
#   -v          挂载卷
#   -e          设置环境变量
#   --rm        容器停止后自动删除
#   -it         交互式终端

# 查看运行中的容器
docker ps

# 查看所有容器（含已停止）
docker ps -a

# 停止/启动/重启容器
docker stop mynginx
docker start mynginx
docker restart mynginx

# 进入运行中的容器
docker exec -it mynginx /bin/bash

# 查看容器日志
docker logs -f mynginx          # -f 实时跟踪
docker logs --tail 100 mynginx  # 最后100行

# 查看容器资源使用
docker stats

# 查看容器详细信息
docker inspect mynginx

# 复制文件
docker cp mynginx:/etc/nginx/nginx.conf ./nginx.conf
docker cp ./index.html mynginx:/usr/share/nginx/html/

# 删除容器
docker rm mynginx
docker rm -f mynginx  # 强制删除运行中的容器

# 清理所有已停止的容器
docker container prune
```

### 系统管理

```bash
# 查看 Docker 系统信息
docker info

# 查看磁盘使用
docker system df

# 清理未使用的资源（镜像、容器、网络、缓存）
docker system prune -a

# 查看实时事件
docker events
```

> 出处：[Docker CLI Reference](https://docs.docker.com/reference/cli/docker/)


---

## Dockerfile

Dockerfile 是用于构建镜像的文本文件，包含一系列指令。

### 常用指令

| 指令 | 说明 | 示例 |
|------|------|------|
| `FROM` | 基础镜像 | `FROM node:18-alpine` |
| `WORKDIR` | 工作目录 | `WORKDIR /app` |
| `COPY` | 复制文件 | `COPY . .` |
| `ADD` | 复制文件（支持URL和解压） | `ADD app.tar.gz /app` |
| `RUN` | 构建时执行命令 | `RUN npm install` |
| `CMD` | 容器启动命令 | `CMD ["node", "app.js"]` |
| `ENTRYPOINT` | 入口点 | `ENTRYPOINT ["docker-entrypoint.sh"]` |
| `ENV` | 环境变量 | `ENV NODE_ENV=production` |
| `ARG` | 构建参数 | `ARG VERSION=1.0` |
| `EXPOSE` | 声明端口 | `EXPOSE 3000` |
| `VOLUME` | 挂载点 | `VOLUME ["/data"]` |
| `USER` | 运行用户 | `USER node` |
| `HEALTHCHECK` | 健康检查 | `HEALTHCHECK CMD curl -f http://localhost/` |

### 示例：Node.js 应用

```dockerfile
# 多阶段构建
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
EXPOSE 3000
USER node
CMD ["node", "server.js"]
```

### 示例：Python 应用

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8000"]
```

### Dockerfile 最佳实践

1. **使用多阶段构建**减小镜像体积
2. **合并 RUN 指令**减少镜像层数
3. **将不常变动的层放前面**利用缓存
4. **使用 `.dockerignore`** 排除不需要的文件
5. **不要以 root 用户运行**应用
6. **使用具体版本标签**而非 `latest`

`.dockerignore` 示例：

```
node_modules
.git
.env
*.log
Dockerfile
docker-compose.yml
```

> 出处：[Dockerfile reference](https://docs.docker.com/reference/dockerfile/)  
> 出处：[Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

---

## Docker Compose

Docker Compose 用于定义和运行多容器应用，通过 `docker-compose.yml` 文件配置服务。

### 基本结构

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=db
    depends_on:
      - db
      - redis
    volumes:
      - ./src:/app/src
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### 常用命令

```bash
# 启动所有服务（后台）
docker compose up -d

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f web

# 停止所有服务
docker compose down

# 停止并删除数据卷
docker compose down -v

# 重新构建并启动
docker compose up -d --build

# 扩缩容
docker compose up -d --scale web=3

# 进入某个服务容器
docker compose exec web sh
```

### 实战示例：Nginx + Node.js + MySQL

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app

  app:
    build: ./app
    environment:
      - DB_HOST=mysql
      - DB_PORT=3306
    depends_on:
      mysql:
        condition: service_healthy

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: mydb
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 3

volumes:
  mysql_data:
```

> 出处：[Docker Compose 官方文档](https://docs.docker.com/compose/)  
> 出处：[Compose file reference](https://docs.docker.com/compose/compose-file/)

---

## 数据管理

### Volume（数据卷）

```bash
# 创建数据卷
docker volume create mydata

# 查看数据卷
docker volume ls
docker volume inspect mydata

# 使用数据卷
docker run -d -v mydata:/app/data nginx

# 删除数据卷
docker volume rm mydata
docker volume prune  # 清理未使用的卷
```

### Bind Mount（绑定挂载）

```bash
# 将宿主机目录挂载到容器
docker run -d -v $(pwd)/data:/app/data nginx

# 只读挂载
docker run -d -v $(pwd)/config:/app/config:ro nginx
```

> 出处：[Manage data in Docker](https://docs.docker.com/storage/)

---

## 网络

### 网络类型

| 类型 | 说明 |
|------|------|
| `bridge` | 默认网络，容器间通过 IP 通信 |
| `host` | 共享宿主机网络 |
| `none` | 无网络 |
| `overlay` | 跨主机通信（Swarm） |

### 常用操作

```bash
# 创建自定义网络
docker network create mynet

# 运行容器并加入网络
docker run -d --network mynet --name app1 nginx

# 同一网络内容器可通过容器名互相访问
docker run -it --network mynet alpine ping app1

# 查看网络
docker network ls
docker network inspect mynet

# 删除网络
docker network rm mynet
```

> 出处：[Docker Networking](https://docs.docker.com/network/)


---

## FAQ

### 1. docker run 和 docker exec 的区别？

- `docker run`：基于镜像创建并启动一个**新容器**
- `docker exec`：在**已运行的容器**中执行命令

```bash
docker run -it ubuntu bash      # 创建新容器并进入
docker exec -it mycontainer bash # 进入已有容器
```

### 2. CMD 和 ENTRYPOINT 的区别？

| | CMD | ENTRYPOINT |
|---|---|---|
| 用途 | 提供默认命令，可被覆盖 | 定义容器入口，不易被覆盖 |
| 覆盖方式 | `docker run image <cmd>` | `docker run --entrypoint <cmd>` |
| 组合使用 | 作为 ENTRYPOINT 的默认参数 | 固定执行的命令 |

```dockerfile
# 组合使用示例
ENTRYPOINT ["python"]
CMD ["app.py"]
# docker run myimage         → python app.py
# docker run myimage test.py → python test.py
```

> 出处：[Understand how CMD and ENTRYPOINT interact](https://docs.docker.com/reference/dockerfile/#understand-how-cmd-and-entrypoint-interact)

### 3. COPY 和 ADD 的区别？

- `COPY`：仅复制本地文件到镜像
- `ADD`：额外支持 URL 下载和自动解压 tar 包

**推荐优先使用 `COPY`**，语义更明确。

> 出处：[ADD or COPY](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#add-or-copy)

### 4. 如何减小镜像体积？

1. 使用 Alpine 基础镜像（`node:18-alpine` 而非 `node:18`）
2. 多阶段构建，只保留运行时需要的文件
3. 合并 RUN 指令并清理缓存：
   ```dockerfile
   RUN apt-get update && apt-get install -y \
       package1 package2 \
       && rm -rf /var/lib/apt/lists/*
   ```
4. 使用 `.dockerignore` 排除无关文件
5. 使用 `docker image prune` 清理悬空镜像

### 5. 容器如何访问宿主机服务？

```bash
# Docker Desktop (macOS/Windows)
# 使用特殊 DNS: host.docker.internal
curl http://host.docker.internal:3000

# Linux
docker run --add-host=host.docker.internal:host-gateway ...
# 或使用 host 网络模式
docker run --network host ...
```

> 出处：[Docker Desktop networking - I want to connect from a container to a service on the host](https://docs.docker.com/desktop/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host)

### 6. 如何查看容器内的文件系统变更？

```bash
docker diff <container_id>
# A = 新增, C = 修改, D = 删除
```

### 7. 如何限制容器资源？

```bash
# 限制内存
docker run -m 512m nginx

# 限制 CPU
docker run --cpus=1.5 nginx

# 组合限制
docker run -m 1g --cpus=2 --memory-swap=2g nginx
```

### 8. 如何处理时区问题？

```dockerfile
# Dockerfile 中设置
ENV TZ=Asia/Shanghai
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
```

或运行时挂载：

```bash
docker run -v /etc/localtime:/etc/localtime:ro -e TZ=Asia/Shanghai nginx
```

### 9. docker compose up 和 docker compose run 的区别？

- `docker compose up`：启动 compose 文件中定义的所有（或指定）服务
- `docker compose run`：针对某个服务运行一次性命令，不会启动依赖服务的端口映射

### 10. 如何调试构建失败的镜像？

```bash
# 方法一：使用 --target 停在某个阶段
docker build --target builder -t debug .

# 方法二：查看构建缓存中的中间层
docker build --no-cache -t myapp . 2>&1 | tee build.log

# 方法三：进入构建失败前的最后一层
# (BuildKit 模式下需要 --progress=plain)
DOCKER_BUILDKIT=0 docker build -t myapp .
# 然后 docker run -it <last_successful_layer_id> sh
```

---

## 注意事项

### 安全相关

1. **不要以 root 运行容器进程**
   ```dockerfile
   RUN addgroup -S appgroup && adduser -S appuser -G appgroup
   USER appuser
   ```

2. **不要在镜像中存储敏感信息**（密码、密钥等），使用环境变量或 Docker Secrets

3. **定期更新基础镜像**，修复安全漏洞
   ```bash
   docker pull node:18-alpine  # 拉取最新补丁版本
   ```

4. **使用只读文件系统**（如果应用允许）
   ```bash
   docker run --read-only --tmpfs /tmp nginx
   ```

5. **扫描镜像漏洞**
   ```bash
   docker scout cves myimage:latest
   ```

> 出处：[Docker Security Best Practices](https://docs.docker.com/develop/security-best-practices/)

### 性能相关

1. **避免在容器内写入大量数据到容器层**，使用 Volume
2. **合理设置日志驱动和大小限制**，防止日志撑满磁盘：
   ```json
   {
     "log-driver": "json-file",
     "log-opts": {
       "max-size": "10m",
       "max-file": "3"
     }
   }
   ```
3. **生产环境不要使用 `docker compose up`**，建议使用 Kubernetes 或 Docker Swarm 编排

### 开发相关

1. **开发环境使用 bind mount 实现热更新**，生产环境使用 COPY
2. **使用 `docker compose watch`**（Compose 2.22+）实现文件变更自动同步
3. **多阶段构建分离开发和生产依赖**
4. **使用 health check** 确保服务就绪后再接收流量

### 存储相关

1. **定期清理无用资源**
   ```bash
   docker system prune -a --volumes
   ```
2. **数据卷备份**
   ```bash
   docker run --rm -v mydata:/data -v $(pwd):/backup alpine \
     tar czf /backup/mydata_backup.tar.gz -C /data .
   ```
3. **不要依赖容器内存储持久化数据**，容器删除后数据丢失

### 网络相关

1. **使用自定义网络**而非默认 bridge，自定义网络支持容器名 DNS 解析
2. **生产环境注意端口暴露范围**，避免 `0.0.0.0` 暴露到公网：
   ```bash
   # 仅本机访问
   docker run -p 127.0.0.1:8080:80 nginx
   ```

### 常见坑

1. **Alpine 镜像的 DNS 问题**：某些网络环境下 musl libc 的 DNS 解析可能异常，可尝试添加 `--dns 8.8.8.8`
2. **文件权限问题**：容器内用户 UID 与宿主机不同导致挂载目录权限不对，需统一 UID
3. **PID 1 信号处理**：容器内 PID 1 进程不会接收默认信号处理，使用 `tini` 或 `--init`：
   ```bash
   docker run --init myapp
   ```
4. **构建缓存失效**：`COPY . .` 会因任何文件变动导致后续所有层缓存失效，应先 COPY 依赖文件
5. **Docker Desktop 资源限制**：macOS/Windows 上 Docker Desktop 默认内存限制较低，大型项目需在设置中调整

> 出处：[Docker development best practices](https://docs.docker.com/develop/dev-best-practices/)

---

## 参考资料

- [Docker 官方文档](https://docs.docker.com/)
- [Docker Hub](https://hub.docker.com/)
- [Dockerfile Reference](https://docs.docker.com/reference/dockerfile/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [Docker Security](https://docs.docker.com/engine/security/)
- [Docker CLI Reference](https://docs.docker.com/reference/cli/docker/)
- [Play with Docker（在线实验环境）](https://labs.play-with-docker.com/)
- [Docker 从入门到实践（中文）](https://yeasy.gitbook.io/docker_practice/)

