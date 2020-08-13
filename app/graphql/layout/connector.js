'use strict';
const DataLoader = require('dataloader');

class LayoutConnector {
    constructor(ctx) {
        this.ctx = ctx;
        this.loader = new DataLoader(this.fetch.bind(this));
    }

    /**
     * DataLoader缓存数据
     * @param ids
     * @returns {Promise.<*[]>}
     */
    fetch(key) {
        return this.ctx.app.model.Layout.findAll({
            where: {
                key: key,
            },
        });
    }

    /**
     * 查询所有
     * @returns {*}
     */
    fetchList() {
        return this.ctx.app.model.Layout.findAll();
    }

    /**
     * 查询单个
     * @param key
     * @returns {Promise<V> | Promise.<V>}
     */
    fetchByKey(key) {
        return this.loader.load(key);
    }
}

module.exports = LayoutConnector;

