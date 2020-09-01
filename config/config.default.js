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
            dialect: 'mysql',
            database: 'graphql', // 数据库名称
            host: 'localhost',
            port: '3306',
            username: 'root',
            password: 'root',
        },
        proxyworker: {
            port: 10086,
        },
        // 是否加载开发者工具 graphiql, 默认开启。路由同 router 字段。使用浏览器打开该可见。
        graphiql: true,
        // 路径 建议命名为graphql
        router: '/graphql',
        middleware: ['graphql'], // 添加中间件拦截请求
        // graphQL 路由前的拦截器
        onPreGraphQL: function* (ctx) {},
        // 开发工具 graphiQL 路由前的拦截器，建议用于做权限操作(如只提供开发者使用)
        onPreGraphiQL: function* (ctx) {},
        security: {
            csrf: {
                ignore: () => true,
            },
        }
    };
    /**
     * 静态资源配置
     * @type {{}}
     */
    const staticConfig = {
        static : {
            prefix: '/upload/',
            dir: path.join(appInfo.baseDir, 'upload'),
        }
    }

    return {
        ...config,
        ...userConfig,
        ...staticConfig
    };
};
