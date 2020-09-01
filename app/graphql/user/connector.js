'use strict';
const DataLoader = require('dataloader');
const _ = require('lodash');

class UserConnector {
    constructor(ctx) {
        this.ctx = ctx;
        this.loader = new DataLoader(this.fetch.bind(this));
    }

    /**
     * DataLoader缓存数据
     * @param ids
     * @returns {Promise.<*[]>}
     */
    fetch(names) {
        const users = this.ctx.app.model.User.findAll({
            where: {
                name: names,
            }
        });
        return new Promise((resolve, reject) => {
            users.then(res => {
                res.length ? resolve(res) : resolve([{}]);
            })
        })
    }

    /**
     * 查询多个用户信息
     * @param names
     * @returns {Promise.<Array.<V|Error>>|Promise<Array<Error | V>>}
     */
    fetchByIds(names) {
        return this.loader.loadMany(names);
    }

    /**
     * 查询所有
     * @returns {*}
     */
    fetchList() {
        return this.ctx.app.model.User.findAll();
    }

    /**
     * 查询单个
     * @param id
     * @returns {Promise<V> | Promise.<V>}
     */
    fetchByName(name) {
        return this.loader.load(name);
    }

    /**
     * 创建用户
     * @param user
     * @returns {user}
     */
    createUser(user) {
        return this.ctx.app.model.User.create(user);
    }

    /**
     * 更新用户
     * @param user
     */
    async updateUser(user) {
        await this.ctx.app.model.User.update(_.pickBy(user), {where: {id: user.id}});
        return await this.ctx.app.model.User.findOne({where: {id: user.id}});
    }

    /**
     * 删除用户
     */
    async deleteUser(user) {
        const delUser = await this.ctx.app.model.User.findOne({where: {id: user.id}});
        if (delUser) {
            const cacheUser = delUser.toJSON();
            delUser.destroy();
            return `${cacheUser.name}删除成功!`;
        } else {
            return `用户不存在，请检查后重试!`;
        }
    }
}

module.exports = UserConnector;

