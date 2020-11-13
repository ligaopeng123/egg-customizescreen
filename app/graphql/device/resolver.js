'use strict';

module.exports = {
    Query: {
        // 查询事件表信息
        getDeviceList(root, {params}, ctx) {
            return ctx.connector.device.relatedFetchList(params);
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
        createDevice(root, {device}, ctx) {
            return ctx.connector.device.createDevice(device);
        },
        /**
         * 更新oem配置数据
         * @returns {*|Promise}
         */
        updateDevice(root, {device}, ctx) {
            return ctx.connector.device.updateDevice(device);
        },
        /**
         * 删除oem
         * @returns {*}
         */
        deleteDevice(root, {ID}, ctx) {
            return ctx.connector.device.deleteDevice(ID);
        }
    },
};