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
    fetch(keys) {
        const promises = this.ctx.app.model.Layout.findAll({
            where: {
                key: keys,
            }
        });
        return new Promise((resolve, reject) => {
            promises.then(res => {
                res.length ? resolve(res) : resolve([{}]);
            })
        })
    }

    /**
     * 查询所有
     * @returns {*}
     */
    async fetchList() {
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

    /**
     *
     * @param layoutItem
     * @returns {layoutItem}
     */
    async addItem(layoutItem) {
        await this.ctx.app.model.Layout.create(layoutItem);
        return this.fetchList()
    }
}

module.exports = LayoutConnector;

