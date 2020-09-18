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
        this.model = this.ctx.app.model.Organization;
        this.name = `组织机构`;
    }

    async fetchList(params) {
        const organization = await this.model.findAll({});
        return {
            code: 0,
            message: '查询成功!',
            data: organization
        }
    }
    /**
     * 新增用户
     * @param user
     * @returns {Promise.<*>}
     */
    async createOrganization(organization) {
        return await this.create(organization);
    }

    /**
     * 修改用户
     * @param user
     * @returns {Promise.<*>}
     */
    async updateOrganization(organization) {
        return await this.update(organization);
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

