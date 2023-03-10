# ts-mock-server

轻量级的Mock服务，复用typescript项目中的类型定义，快速创建Mock数据服务。

## 安装

```bash
npm i ts-mock-server
````

## 使用
### 1
mock.config.js
```javascript
const { resolve } = require('path');

module.exports = {
  port: 9876,
  dir: resolve(__dirname, './mock'),
  tsRoot: __dirname,
  template: {
    success: '{ "code": 0, "data": $data }',
    error: '{ "code": 9999, "message": $message }'
  }
}
```

```bash
ts-mock-server -c mock.config.js
```

### 2
```javascript
const { resolve } = require('path');
const tms = require('ts-mock-server');
tms.start({
  port: 9876,
  dir: resolve(__dirname, './mock'),
  tsRoot: __dirname,
  template: {
    success: '{ "code": 0, "data": $data }',
    error: '{ "code": 9999, "message": $message }'
  }
});
```

## 选项


+ `port`

  服务端口，默认为9876

+ `dir`

  mock定义目录

+ `tsRoot`

  tsconfig.json root

+ `template`

  响应模版

