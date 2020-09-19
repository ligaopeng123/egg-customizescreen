'use strict';

const {Op} = require('sequelize');
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
                menu_ids: JSON.parse(item.dataValues.menu_ids)
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
        const menu_ids = JSON.stringify(organization.menu_ids); // 前端下发的是数组 此处做下转换
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
        const menu_ids = JSON.stringify(organization.menu_ids);
        const params = {...organization, menu_ids: menu_ids};
        return await this.update(params);
    }

    /**
     * 更新menu_ids列
     * @param rows
     * @returns {Promise.<void>}
     */
    async updateMenuIds(code) {
        const organizations = await this.model.findAll({
            where: {
                menu_ids: {
                    [Op.like]: `%${code}%`
                }
            }
        });
        return new Promise((resolve, reject) => {
            const dataPromiseArr = [];
            // Promise.all
            organizations.forEach((item) => {
                dataPromiseArr.push(this.updateMenuId(item, code));
            })
            Promise.all(dataPromiseArr).then((values) => {
                resolve(values);
            });
        });
    }

    /**
     * 更新menuid 单个的 等整个组织树都更新完 就返回
     * @param rows
     * @param code
     * @returns {Promise.<*>}
     */
    async updateMenuId(rows, code) {
        const menu_ids = JSON.parse(rows.dataValues.menu_ids);
        const {halfKey, treeKey} = menu_ids;
        halfKey.splice(this.findIndex(halfKey, code), 1);
        treeKey.splice(this.findIndex(halfKey, code), 1);
        const obj = {
            id: rows.dataValues.id,
            menu_ids: {
                halfKey: halfKey,
                treeKey: treeKey
            }
        };
        return await this.updateOrganization(obj);
    }

    /**
     * 获取数组下标 相同的值更新
     * @param arr
     * @param code
     */
    findIndex(arr, code) {
        return arr.findIndex((item) => {
            return item === code;
        });
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

