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
            return ctx.connector.organization.fetchList({params});
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
        createOrganization(root, {organization}, ctx) {
            return ctx.connector.organization.createOrganization(organization);
        },
        /**
         * 更新用户数据
         * @returns {*|Promise}
         */
        updateOrganization(root, {organization}, ctx) {
            return ctx.connector.organization.updateOrganization(organization);
        },
        /**
         * 删除用户
         * @returns {*}
         */
        deleteOrganization(root, {ID}, ctx) {
            return ctx.connector.organization.deleteOrganization(ID);
        }
    },
};

