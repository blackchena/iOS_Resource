# Alfred NextAuth JWE Token Decrypter

一个Alfred工作流插件，专门用于解密NextAuth.js 5.0.0-beta.29版本的JWE (JSON Web Encryption) tokens。

## 功能特性

- 专门支持NextAuth.js 5.0.0-beta.29版本的JWE token解密
- 使用jose库进行安全的JWE解密
- 支持NextAuth.js使用的加密算法
- 显示解密后的session数据
- 处理JSON格式的session内容
- 提供详细的错误信息和调试支持

## 安装

1. 确保已安装Node.js (版本 >= 16)
2. 克隆或下载此仓库
3. 运行 `npm install` 安装依赖

## 使用方法

### 命令行使用

```bash
# 基本用法
node index.js <jwe_token> <AUTH_SECRET>

# 示例
node index.js "eyJhbGciOiJSU0EtT0FFUC0yNTYiLCJlbmMiOiJBMjU2R0NNIn0..." "your-auth-secret-here"

# 查看帮助
node index.js --help
```

### Alfred工作流使用

1. 在Alfred中输入JWE token
2. 插件会提示你提供AUTH_SECRET
3. 解密成功后会显示NextAuth session数据 按住cmd+l显示解密后的数据，按住cmd+c复制解密后的数据

## 参数说明

- **jwe_token**: NextAuth.js生成的JWE token字符串
- **AUTH_SECRET**: NextAuth.js配置中的AUTH_SECRET环境变量值

## 支持的NextAuth.js版本

- NextAuth.js 5.0.0-beta.29

## 输出格式

成功解密后，插件会显示：

1. **解密成功消息** - 包含算法和加密方式信息
2. **Session数据** - NextAuth.js的session对象内容
3. **保护头部信息** - JWE token的头部参数

## 错误处理

插件会处理以下错误情况：

- 无效的JWE token格式
- 错误的AUTH_SECRET
- NextAuth.js版本不兼容
- 解密失败
- 缺少必需参数

## 依赖

- `alfy` - Alfred工作流工具
- `jose` - JOSE标准实现库
- `lodash` - 工具库


## 许可证

MIT License 