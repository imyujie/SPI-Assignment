# MY HOMEWORK

一个用于作业发布、提交及批改的网站。用 NodeJS 实现，数据库采用 MongoDB。

## HOW TO BUILD

```bash
npm install
grunt build
```

## HOW TO RUN

### 直接运行编译后的文件

1. 安装 MongoDB
2. 在命令行运行 `grunt server`
3. 如果没有自动打开浏览器，输入 `localhost:9000` 可以访问

### 编译后再运行

1. 安装 MongoDB
2. 命令行运行 `grunt`
3. 命令行运行 `grunt server`
4. 如果没有自动打开浏览器，输入 `localhost:9000` 可以访问

## DEPENDENCIES

1. Node v0.10.x
2. ExpressJS v4.12
3. Mongoose
4. Semantic UI

## ATTENTION

由于时间比较仓促，文件结构设计有待提高，表单验证并不完善，但功能基本实现，界面整体友好美观。