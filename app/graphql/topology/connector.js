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
        this.model = this.ctx.app.model.Topology;
        this.name = `拓扑`;
    }

    /**
     * 查询所有Topology配置项
     * @param params
     * @returns {Promise.<{code: number, message: string, data: *}>}
     */
    async fetchList(params) {
        const Topology = await this.fetchListAll({
            params, include: [{
                model: this.ctx.app.model.Organization,
                as: 'view',
            }]
        });
        return Topology
    }

    async fetchScreen(params) {
        const Topology = await this.fetchListAll({params});
        return {
            code: 0,
            message: '查询成功!',
            data: Topology.data[0]
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
        const imgData = await this.createImageByBase64(topology.image);
        return await this.create(Object.assign(topology, {image: imgData.data}));
    }

    /**
     * 修改用户
     * @param user
     * @returns {Promise.<*>}
     */
    async updateTopology(topology) {
        const imgData = await this.createImageByBase64(topology.image);
        return await this.update(Object.assign(topology, {image: imgData.data}));
    }

    /**
     * 用户删除
     * @param ID
     * @returns {Promise.<*>}
     */
    async deleteTopology(ID) {
        const response = await this.delete(ID);
        await this.deleteImageByFliePath(response.data.image);
        return await response;
    }
}

module.exports = TopologyConnector;

