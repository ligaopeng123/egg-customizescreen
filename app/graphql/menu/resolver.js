'use strict';

module.exports = {
    /**
     * 查询模块
     */
    Query: {
        /**
         * 获取组织表
         * @param root
         * @param params
         * @param ctx
         * @returns {Promise.<Promise|*>}
         */
        async getMenuList(root, {params}, ctx) {
            return ctx.connector.menu.fetchList(params);
        }
    },
    /**
     * 增删改模块
     */
    Mutation: {
        /**
         * 创建菜单
         * @returns {*|user}
         */
        createMenu(root, {user}, ctx) {
            return ctx.connector.user.createUser(user);
        },
        /**
         * 更新菜单数据
         * @returns {*|Promise}
         */
        updateMenu(root, {user}, ctx) {
            return ctx.connector.user.updateUser(user);
        },
        /**
         * 删除菜单
         * @returns {*}
         */
        deleteMenu(root, {ID}, ctx) {
            return ctx.connector.user.deleteUser(ID);
        }
    },
};

