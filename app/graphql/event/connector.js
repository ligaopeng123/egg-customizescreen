'use strict';

const TableConnectorBase = require('../../share/table');
const AppUtils = require('../../AppUtils');

class EventConnector extends TableConnectorBase {
    constructor(ctx, app) {
        super(ctx, app);
    }

    /**
     * 初始化模型
     */
    init() {
        this.model = this.ctx.app.model.Event;
        this.name = `事件`;
    }

    /**
     * 查询所有
     * @param params
     * @returns {Promise.<*>}
     */
    async getEventsLists(params) {
        return await this.fetchListAll({
            params,
            order: [['createTime', 'DESC']],
            attributes: ['id', 'deviceIp', 'deviceName', 'eventType', 'createTime', 'content']
        });
    }
}

module.exports = EventConnector;


