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
        this.separationSymbol = ',';
        this.model = this.ctx.app.model.Organization;
        this.name = `组织机构`;
    }

    async fetchList(params) {
        const organizations = await this.model.findAll({});
        // 返回数据处理
        const data = organizations.map(item => {
            return {
                ...item.dataValues,
                menu_ids: item.dataValues.menu_ids.split(this.separationSymbol)
                // item.dataValues.menu_ids: item.menu_ids // 前端下发的是数组 此处返回的也是数组
            }
        });

        return {
            code: 0,
            message: '查询成功!',
            data: data
        }
    }

    /**
     * 新增用户
     * @param user
     * @returns {Promise.<*>}
     */
    async createOrganization(organization) {
        // return await this.create(organization);
        const organization_code = AppUtils.uuid();
        const menu_ids = organization.menu_ids.join(this.separationSymbol); // 前端下发的是数组 此处做下转换
        const newOrgan = Object.assign({organization_code}, organization, {menu_ids});
        const cOrgan = await this.model.create(newOrgan);
        if (cOrgan.dataValues) {
            return {
                code: 0,
                message: `${cOrgan.dataValues.name}新增成功！`,
                ...cOrgan.dataValues
            };
        }
        return {
            code: 0,
            message: '新增成功'
        }
    }

    /**
     * 修改用户
     * @param user
     * @returns {Promise.<*>}
     */
    async updateOrganization(organization) {
        const menu_ids = organization.menu_ids.join(this.separationSymbol);
        const params = {...organization, menu_ids: menu_ids};
        return await this.update(params);
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

