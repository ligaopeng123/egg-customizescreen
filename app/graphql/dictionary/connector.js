'use strict';

const TableConnectorBase = require('../../share/table');
const AppUtils = require('../../AppUtils');

class DictionaryConnector extends TableConnectorBase {
    constructor(ctx, app) {
        super(ctx, app);
    }

    /**
     * 初始化模型
     */
    init() {
        this.model = this.ctx.app.model.Dictionary;
        this.name = `字典`;
    }

    /**
     * 新增字典
     * @param user
     * @returns {Promise.<*>}
     */
    async createDictionary(dictionary) {
        return await this.create(dictionary);
    }

    /**
     * 删除
     * @param ID
     * @returns {Promise.<*>}
     */
    async deleteDictionary(ID) {
        return await this.delete(ID);
    }

    /**
     * 编辑列
     * @param dictionary
     * @returns {Promise.<void>}
     */
    async updateDictionary(dictionary) {
        return await this.update(dictionary);
    }
}

module.exports = DictionaryConnector;
