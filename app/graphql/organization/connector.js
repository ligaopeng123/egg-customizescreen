'use strict';

const TableConnectorBase = require('../../share/table');
const AppUtils = require('../../AppUtils');

class OrganizationConnector extends TableConnectorBase {
    constructor(ctx, app) {
        super(ctx, app);
    }

    /**
     * 初始化模型
     */
    init() {
        this.model = this.ctx.app.model.User;
        this.name = `用户`;
    }

    /**
     * 新增用户
     * @param user
     * @returns {Promise.<*>}
     */
    async createOrganization(user) {
        const status = await this.repeatName(user);
        if (status) return status;
        return await this.create(user);
    }

    /**
     * 修改用户
     * @param user
     * @returns {Promise.<*>}
     */
    async updateOrganization(user) {
        return await this.update(user);
    }

    /**
     * 用户删除
     * @param ID
     * @returns {Promise.<*>}
     */
    async deleteOrganization(ID) {
        return await this.delete(ID);
    }
}

module.exports = OrganizationConnector;

