'use strict';

const TableConnectorBase = require('../../share/table');
const AppUtils = require('../../AppUtils');

class DeviceConnector extends TableConnectorBase {
    constructor(ctx, app) {
        super(ctx, app);
    }

    /**
     * 初始化模型
     */
    init() {
        this.model = this.ctx.app.model.Device;
        this.name = `资产`;
    }

    /**
     * 关联查询
     */
    async relatedFetchList(params) {
        const list = await this.fetchList({
            params,
            include: [{
                model: this.ctx.app.model.Dictionary,
                as: 'options',
            }, {
                model: this.ctx.app.model.Organization,
                as: 'view',
            }]
        });
        return list
    }

    /**
     * 新增字典
     * @param user
     * @returns {Promise.<*>}
     */
    async createDevice(device) {
        return await this.create(device);
    }

    /**
     * 删除
     * @param ID
     * @returns {Promise.<*>}
     */
    async deleteDevice(ID) {
        return await this.delete(ID);
    }

    /**
     * 编辑列
     * @param Device
     * @returns {Promise.<void>}
     */
    async updateDevice(device) {
        return await this.update(device);
    }
}

module.exports = DeviceConnector;


