'use strict';

module.exports = {
    Query: {
        // 查询单个布局配置
        getLayout(root, {key}, ctx) {
            return ctx.connector.layout.fetchByKey(key);
        },
        // 查询布局配置的list表
        getLayoutList(root, {id}, ctx) {
            return ctx.connector.layout.fetchList();
        }
    },
};

