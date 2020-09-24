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
        async getOemList(root, {}, ctx) {
            return ctx.connector.oem.fetchList();
        }
    },
    /**
     * 增删改模块
     */
    Mutation: {
        /**
         * 创建oem
         * @returns {*|user}
         */
        createOem(root, {oem}, ctx) {
            return ctx.connector.oem.createOem(oem);
        },
        /**
         * 更新oem配置数据
         * @returns {*|Promise}
         */
        updateOem(root, {oem}, ctx) {
            return ctx.connector.oem.updateOem(oem);
        },
        /**
         * 删除oem
         * @returns {*}
         */
        deleteOem(root, {ID}, ctx) {
            return ctx.connector.oem.deleteOem(ID);
        }
    },
};

