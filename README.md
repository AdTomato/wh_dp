
# 目录结构

```
entries 入口项目
|——admin 后台管理
|——mobile 移动端门户
|——portal PC端门户
modules 业务模块
```

# 设置私服

`npm set registry http://nexus.h3yun.com:8888/repository/npm-all/`

# 安装依赖

1. 设置私服，如已设置请跳过
2. 在项目根目录执行命令安装所有依赖`npm run installs`

# 启动

1. 安装依赖，如已安装请跳过
2. 在项目根目录分别执行命令启动项目：管理后台`npm run admin`，移动端`npm run mobile`，PC端`npm run portal`

# 编译

1. 安装依赖，如已安装请跳过
2. 在项目根目录分别执行命令启动编译：管理后台`npm run build-admin`，移动端`npm run build-mobile`，PC端`npm run build-portal`


# 本地开发npm依赖包

运行：
``` javascript
  npm run package
```
将在当前项目的 `modules` 目录遍历 `@cloudpivot` 目录下所有文件夹，并视为 `npm` 依赖包进行本地软链接，便于本地开发。

** 进行软链接的目录下必须建立 `package.json` 文件, 并且名称格式为：@cloudpivot/{name} **

``` json
  "name": "@cloudpivot/{name}",
  "version": "1.13.0",
```