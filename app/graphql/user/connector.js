'use strict';
const DataLoader = require('dataloader');

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
            },
        });
        return users;
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
}

module.exports = UserConnector;

