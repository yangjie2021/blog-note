## **构建配置**

```shell
npm i vue vue-server-renderer express cross-env

npm i -D webpack webpack-cli webpack-merge webpack-node-externals @babel/core @babel/plugin-transform-runtime @babel/preset-env babel-loader css-loader url- loader file-loader rimraf vue-loader vue-template-compiler friendly-errors- webpack-plugin
```

## 生产依赖

| 包                  | 说明                                |
| ------------------- | ----------------------------------- |
| vue                 | Vue.js 核心库                       |
| vue-server-renderer | Vue 服务端渲染工具                  |
| express             | 基于 Node 的 Web 服务框架           |
| cross-env           | 通过 npm scripts 设置跨平台环境变量 |

## 开发依赖

| 包                                                           | 说明                                   |
| ------------------------------------------------------------ | -------------------------------------- |
| webpack                                                      | webpack 核心包                         |
| webpack-cli                                                  | webpack 的命令行工具                   |
| webpack-merge                                                | webpack 配置信息合并工具               |
| webpack-node-externals                                       | 排除 webpack 中的 Node 模块            |
| rimraf                                                       | 基于 Node 封装的一个跨平台 rm -rf 工具 |
| friendly-errors-webpack-plugin                               | 友好的 webpack 错误提示                |
| @babel/core<br />@babel/plugin-transform-runtime<br />@babel/preset-env<br />babel-loader | Babel 相关工具                         |
| vue-loader<br />vue-template-compiler                        | 处理 .vue 资源                         |
| file-loader                                                  | 处理字体资源                           |
| css-loader                                                   | 处理 CSS 资源                          |
| url-loader                                                   | 处理图片资源                           |





