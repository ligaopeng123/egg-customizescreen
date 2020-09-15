'use strict';

const TableConnectorBase = require('../../share/table');
const AppUtils = require('../../AppUtils');

class MenuConnector extends TableConnectorBase {
    constructor(ctx, app) {
        super(ctx, app);
    }

    /**
     * 初始化模型
     */
    init() {
        this.model = this.ctx.app.model.Menu;
        this.name = `菜单`;
    }

    /**
     * 新增菜单
     * @param user
     * @returns {Promise.<*>}
     */
    async createMenu(menu) {
        const menu_code = AppUtils.uuid();
        const newMenu = Object.assign({menu_code}, menu);
        const cMenu = await this.model.create(newMenu);
        if (cMenu.dataValues) {
            return {
                code: 0,
                message: `${cMenu.dataValues.name}新增成功！`,
                ...cMenu.dataValues
            };
        }
    }

    /**
     * 修改菜单
     * @param user
     * @returns {Promise.<*>}
     */
    async updateMenu(user) {
        return await this.update(user);
    }

    /**
     * 菜单删除
     * @param ID
     * @returns {Promise.<*>}
     */
    async deleteMenu(ID) {
        return await this.delete(ID);
    }

    /**
     * 查询所有菜单项
     * @param params
     * @returns {Promise.<{code: number, message: string, data: *}>}
     */
    async fetchList(params) {
        const menu = await this.model.findAll({})
        return {
            code: 0,
            message: '查询成功!',
            data: menu
        }
    }
}

module.exports = MenuConnector;

