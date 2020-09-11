'use strict';

module.exports = {
    /**
     * 查询模块
     */
    Query: {
        login(root, params, ctx) {
            return ctx.connector.user.login(params);
        },
        // 查询单个用户
        getUser(root, {name}, ctx) {
            return ctx.connector.user.fetchByName(name);
        },
        /**
         * 关联查询
         * @returns {Promise}
         */
        related(root, {name}, ctx) {
            return new Promise((resolve, reject) => {
                ctx.connector.user.fetchByName(name).then(res => {
                    res.dataValues.layout = ({key}) => {
                        return ctx.connector.layout.fetchByKey(key)
                    };
                    resolve(res.dataValues);
                });
            })
        },
        // // 查询多个用户
        // users(root, {name}, ctx) {
        //     return ctx.connector.user.fetchByIds(id);
        // },
        // 查询所有用户
        async getUserList(root, params, ctx) {
            return ctx.connector.user.fetchList(params);
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
        createUser(root, user, ctx) {
            return ctx.connector.user.createUser(user);
        },
        /**
         * 更新用户数据
         * @returns {*|Promise}
         */
        updateUser(root, user, ctx) {
            return ctx.connector.user.updateUser(user);
        },
        /**
         * 删除用户
         * @returns {*}
         */
        deleteUser(root, user, ctx) {
            return ctx.connector.user.deleteUser(user);
        }
    },
};

