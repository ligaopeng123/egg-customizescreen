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
        async getOrganizationList(root, {params}, ctx) {
            return ctx.connector.organization.fetchList(params);
        }
    },
    /**
     * 增删改模块
     */
    Mutation: {
        /**
         * 创建用户
         * @returns {*|user}
         */
        createOrganization(root, {user}, ctx) {
            return ctx.connector.user.createUser(user);
        },
        /**
         * 更新用户数据
         * @returns {*|Promise}
         */
        updateOrganization(root, {user}, ctx) {
            return ctx.connector.user.updateUser(user);
        },
        /**
         * 删除用户
         * @returns {*}
         */
        deleteOrganization(root, {ID}, ctx) {
            return ctx.connector.user.deleteUser(ID);
        }
    },
};

