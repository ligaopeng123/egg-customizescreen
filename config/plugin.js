'use strict';

/** @type Egg.EggPlugin */
module.exports = {
    // had enabled by egg
    // static: {
    //   enable: true,
    // }
    // 数据库连接
    sequelize: {
        enable: true,
        package: 'egg-sequelize',
    },
    // graphql连接
    graphql: {
        enable: true,
        package: 'egg-graphql',
    },
    // 数据验证
    validate: {
        package: 'egg-validate',
    },
    // 权限token管理
    jwt: {
        enable: true,
        package: "egg-jwt"
    },
    cors: {
        enable: true,
        package: 'egg-cors',
    },
    // socket
    io: {
        enable: true,
        package: 'egg-socket.io',
    }
};
