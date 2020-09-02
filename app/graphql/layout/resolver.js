'use strict';

module.exports = {
    Query:{
        // 查询单个布局配置
        getLayout(root, {key}, ctx) {
            return ctx.connector.layout.fetchByKey(key);
        },
        // 查询布局配置的list表
        getLayoutList(root, {id}, ctx) {
            return ctx.connector.layout.fetchList();
        }
    },
    /**
     * 数据变更
     */
    Mutation: {
        createLayoutItem(root, {layoutItem}, ctx) {
            return ctx.connector.layout.addItem(layoutItem);
        }
    }
};