'use strict';

const TableConnectorBase = require('../../share/table');

/**
 * Oem配置项
 */

class OemConnector extends TableConnectorBase {
    constructor(ctx, app) {
        super(ctx, app);
    }

    /**
     * 初始化模型
     */
    init() {
        this.model = this.ctx.app.model.Oem;
        this.name = `菜单`;
    }

    /**
     * 查询所有OEM配置项
     * @param params
     * @returns {Promise.<{code: number, message: string, data: *}>}
     */
    async fetchList() {
        const oem = await this.model.findAll({});
        return {
            code: 0,
            message: '查询成功!',
            data: oem
        }
    }

    /**
     * 获取OEM config
     * @returns {Promise.<{code: number, data}>}
     */
    async getOemConfig() {
        // 获取表格数据 结构为 {code, data}
        const list = await this.fetchList();
        //获取data数据
        const data = list.data;
        // 定义配置对象
        const config = {};
        // 给配置对象赋值
        data.forEach(item => {
            const v = item.toJSON();
            // 如果是json格式 此处做下转换
            config[v.key] = v.value_type === 'json' ? JSON.parse(v.value) : v.value
        });

        return {
            code: 0,
            message: '查询成功!',
            data: config
        }
    }

    /**
     * 新增菜单
     * @param user
     * @returns {Promise.<*>}
     */
    async createOem(oem) {
        const status = await this.repeatName(oem);
        if (status) return status;
        return await this.create(oem);
    }

    /**
     * 修改用户
     * @param user
     * @returns {Promise.<*>}
     */
    async updateOem(oem) {
        return await this.update(oem);
    }

    /**
     * 用户删除
     * @param ID
     * @returns {Promise.<*>}
     */
    async deleteOem(ID) {
        return await this.delete(ID);
    }
}

module.exports = OemConnector;

