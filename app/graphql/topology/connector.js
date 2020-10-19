'use strict';

const TableConnectorBase = require('../../share/table');

/**
 * 拓扑配置项
 */

class TopologyConnector extends TableConnectorBase {
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
     * 查询所有Topology配置项
     * @param params
     * @returns {Promise.<{code: number, message: string, data: *}>}
     */
    async fetchList() {
        const Topology = await this.model.findAll({});
        return {
            code: 0,
            message: '查询成功!',
            data: Topology
        }
    }

    /**
     * 获取Topology config
     * @returns {Promise.<{code: number, data}>}
     */
    async getTopologyConfig() {
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
    async createTopology(topology) {
        const status = await this.repeatName(topology);
        if (status) return status;
        return await this.create(topology);
    }

    /**
     * 修改用户
     * @param user
     * @returns {Promise.<*>}
     */
    async updateTopology(topology) {
        return await this.update(topology);
    }

    /**
     * 用户删除
     * @param ID
     * @returns {Promise.<*>}
     */
    async deleteTopology(ID) {
        return await this.delete(ID);
    }
}

module.exports = TopologyConnector;
