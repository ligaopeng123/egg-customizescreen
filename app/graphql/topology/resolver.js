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
        async getTopologyList(root, {}, ctx) {
            return ctx.connector.topology.fetchList();
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
        createTopology(root, {topology}, ctx) {
            return ctx.connector.topology.createOem(topology);
        },
        /**
         * 更新oem配置数据
         * @returns {*|Promise}
         */
        updateTopology(root, {topology}, ctx) {
            return ctx.connector.topology.updateOem(topology);
        },
        /**
         * 删除oem
         * @returns {*}
         */
        deleteTopology(root, {ID}, ctx) {
            return ctx.connector.topology.deleteOem(ID);
        }
    },
};

