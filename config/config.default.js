/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = exports = {};

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1597113719568_2666';

    // add your user config here
    const userConfig = {
        myAppName: 'egg-customizescreen',
        sequelize: {
            // username: 'root',
            // password: 'root',
            // host: '127.0.0.1',
            "username": "nx_ylf",
            "password": "NX_ylf2020!",
            "host": "47.95.205.101",
            dialect: 'mysql',
            database: 'graphql', // 数据库名称
            port: '3306'
        },
        proxyworker: {
            port: 10086,
        },
        // 是否加载开发者工具 graphql, 默认开启。路由同 router 字段。使用浏览器打开该可见。
        graphiql: false, // onPreGraphQL要执行 graphiql需要设置为false
        // graphql相关配置
        graphql: {
            // 路径 建议命名为graphql
            router: '/graphql',
            // graphQL 路由前的拦截器
            onPreGraphQL: async (ctx) => {

            },
            // 开发工具 graphiQL 路由前的拦截器，建议用于做权限操作(如只提供开发者使用)
            onPreGraphiQL: function* (ctx, next) {
            },
        },
        // 配置 gzip 中间件的配置
        gzip: {
            threshold: 1024, // 小于 1k 的响应体不压缩
        },
        // 权限相关配置
        security: {
            /**
             * 接口拦截配置
             */
            csrf: {
                headerName: 'authorization', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
                // match: '/graphql', // 只想开启针对某一路径
                // 放行的接口路径
                throughPath: ['/admin/login', '/admin/logout', '/admin/oem', '/upload', '/receive'], // upload需要鉴权 此处先加上
                secret: 'admin,login', // 配置的秘钥
                ignore: ctx => ['/admin/login', '/admin/logout'],
                // enable: false,
                // ignoreJSON: true, // // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
                // domainWhiteList: ['http://localhost:8080'],//允许访问接口的白名单
            },
        }
    };

    // 添加中间件 用于拦截请求等处理
    const middleware = userConfig.graphiql ? ['graphql', 'gzip'] : ['graphqlJwt', 'gzip'];
    /**
     * 静态资源配置
     * @type {{}}
     */
    const staticConfig = {
        static: {
            prefix: '/upload/',
            dir: path.join(appInfo.baseDir, 'upload'),
        }
    };
    // 设置超时时间 主要用于上传的状态 后续优化下 做分片上传
    config.httpclient = {
        httpAgent: {
            timeout: 7200000,
        },
    };
    return {
        ...config,
        ...userConfig,
        ...staticConfig,
        // 中間件配置
        middleware: middleware,
        multipart: {
            fileSize: '100mb',
            mode: 'stream',
            fileExtensions: ['.pdf', '.PDF']
        },
        // 请求长度限制
        bodyParser: {
            jsonLimit: '10mb',
            formLimit: '10mb',
        },
        io: {
            namespace: {
                '/': {
                    connectionMiddleware: ['auth'], // 入口鉴权
                    packetMiddleware: ['packet'], // 出口处理
                },
                '/event': {
                    connectionMiddleware: ['auth'],
                    packetMiddleware: ['packet'],
                },
            },
        }
    }
};
