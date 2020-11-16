'use strict';

module.exports = {
    Query: {
        // 查询事件表信息
        getDictionaryList(root, {params}, ctx) {
            return ctx.connector.dictionary.fetchList({params});
        },
        getDictionaryLists(root, params, ctx) {
            return ctx.connector.dictionary.fetchListAll(params);
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
        createDictionary(root, {dictionary}, ctx) {
            return ctx.connector.dictionary.createDictionary(dictionary);
        },
        /**
         * 更新oem配置数据
         * @returns {*|Promise}
         */
        updateDictionary(root, {dictionary}, ctx) {
            return ctx.connector.dictionary.updateDictionary(dictionary);
        },
        /**
         * 删除oem
         * @returns {*}
         */
        deleteDictionary(root, {ID}, ctx) {
            return ctx.connector.dictionary.deleteDictionary(ID);
        }
    },
};