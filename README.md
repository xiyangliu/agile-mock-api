## 使用说明

此项目为可视化临时发布后台，可以为`agile-ui-suite`和`agile-ui-app`提供后台服务。

### 本地运行

安装依赖 `yarn install`

以dev模式运行 `npm run dev`

以prod模式运行 `npm run start`

访问地址 `http://localhost:5000`

### Docker运行

`docker-compose up agile-mock-api`

访问地址 `http://localhost:15000`

### API

上传图片 `POST /images/:appId image={image.jpg}`

发布应用 `POST /publish/:appId/:version`

查看发布文件 `GET /export`
