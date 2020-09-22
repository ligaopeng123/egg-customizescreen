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
    async updateMenu(menu) {
        return await this.update(menu);
    }

    /**
     * 菜单删除
     * @param ID
     * @returns {Promise.<*>}
     */
    async deleteMenu(ID) {
        const delRows = await this.model.findOne({where: {id: ID}});
        if (delRows) {
            const values = await this.ctx.connector.organization.updateMenuIds(delRows.toJSON().menu_code);
        }
        return await this.delete(ID);
    }

    /**
     * 根据menu_id获取菜单项
     * @param ID menu_id
     * @returns {Promise.<void>}
     */
    async getMeunByMenuIds(ids) {
        // 一次查完 进行数据层面的组装 不再频繁操作数据库
        const list = await this.fetchList();
        const menus = list.data;
        const stats = {};
        const menusArr = [];
        for (let i = 0; i < ids.length; i++) {
            for (let j = 0; j < menus.length; j++) {
                const menu = menus[j].dataValues;
                if (!stats[ids[i]] && menu.menu_code === ids[i]) {
                    stats[ids[i]] = true;
                    menusArr.push(menu);
                    const halfItems = this.getMeunByParentsByID(menus, menu, []);
                    halfItems.forEach(item => {
                        if (!stats[item.menu_code]) menusArr.push(item);
                        stats[item.menu_code] = true;
                    });
                    break;
                }
            }
        }
        return menusArr;
    }

    /**
     * 关联数据获取
     * @param menus
     * @param menu
     * @param halfItems
     * @returns {*}
     */
    getMeunByParentsByID(menus, menu, halfItems = []) {
        const parent_id = menu.parent_id;
        if (parent_id) {
            for (let i = 0; i < menus.length; i++) {
                const menu = menus[i].dataValues;
                if (parent_id === menu.menu_code) {
                    halfItems.push(menu);
                    return this.getMeunByParentsByID(menus, menu, halfItems);
                }
            }
        }
        return halfItems;
    }

    /**
     * 查询所有菜单项
     * @param params
     * @returns {Promise.<{code: number, message: string, data: *}>}
     */
    async fetchList(params) {
        const menu = await this.model.findAll({});
        return {
            code: 0,
            message: '查询成功!',
            data: menu
        }
    }
}

module.exports = MenuConnector;

