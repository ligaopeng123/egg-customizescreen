'use strict';

module.exports = {
    /**
     * 查询模块
     */
    Query: {
        // 查询单个用户
        getUploadMd5(root, {md5}, ctx) {
            return ctx.connector.upload.fetchByMd5(md5);
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
        createUploadMd5(root, user, ctx) {
            return ctx.connector.upload.createMd5(user);
        },
        /**
         * 删除用户
         * @returns {*}
         */
        deleteUploadMd5(root, user, ctx) {
            return ctx.connector.upload.deleteMd5(user);
        }
    },
};

