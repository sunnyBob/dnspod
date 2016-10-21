# 使用

So Easy!

```
1. 进入项目根目录
2. 安装项目依赖，运行 `npm install`，因为在天朝这，这里有点慢，如果嫌慢可以先安装 cnpm ，然后运行： `cnpm install`
3. 启动服务 `npm start`
```

## API 代理服务说明

访问的地址为：

```
http://localhost:8088/
```

### 举例

DNSPOD 获取API版本号为 https://dnsapi.cn/Info.Version, 那么要发送的地址为：http://localhost:8088/Info.Version

## 静态文件服务说明

在 static 目录自由放置静态文件，放置的文件目录和 url 对应

### 举例

* 放置的文件为 test.html, 那么访问的路径为 http://localhost:8088/test.html
* 放置的文件为 js/app.js，那么访问的路径为 http://localhost:8088/js/app.js

下面给开发同学看的，前端同学可忽略

# 开发

## 启动脚本

```
supervisor -- -r 'babel-register' src/app.js
```

# 构建

```
babel src -d dist
```
# dns_
