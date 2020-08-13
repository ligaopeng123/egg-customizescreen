'use strict';

module.exports = {
    Query: {
        // 查询单个用户
        user(root, {name}, ctx) {
            return ctx.connector.user.fetchByName(name);
        },
        // // 查询多个用户
        // users(root, {name}, ctx) {
        //     return ctx.connector.user.fetchByIds(id);
        // },
        // 查询所有用户
        userList(root, {name}, ctx) {
            return ctx.connector.user.fetchList();
        }
    },
};

