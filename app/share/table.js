'use strict';

const DataLoader = require('dataloader');
const _ = require('lodash');
const {Op} = require('sequelize');
const AppUtils = require('../AppUtils');

class TableConnectorBase {
    constructor(ctx, app) {
        this.ctx = ctx;
        this.init();
        this.loader = new DataLoader(this.fetch.bind(this));
    }

    /**
     * 默认的模型 用于增删改查
     * 继承者需要重写改方法
     *
     * 默认model 为查询的模型
     * name 为默认的模型信息的前缀
     */
    init() {
        this.model = null;
        this.name = '';
    }

    /**
     * DataLoader缓存数据
     * @param ids
     * @returns {Promise.<*[]>}
     */
    fetch(names) {
        const users = this.model.findAll({
            where: {
                name: names,
            }
        });
        return new Promise((resolve, reject) => {
            users.then(res => {
                res.length ? resolve(res) : resolve([{}]);
            })
        })
    }

    /**
     * 查询多个信息
     * @param names
     * @returns {Promise.<Array.<V|Error>>|Promise<Array<Error | V>>}
     */
    fetchByIds(names) {
        return this.loader.loadMany(names);
    }

    /**
     * 查询所有
     * @returns {*}
     */
    fetchAll() {
        return this.model.findAll();
    }

    /**
     * 查询分页表格
     */
    async fetchList(params) {
        // 分页查询
        const list = await this.model.findAndCountAll({
            order: [
                ['created_at', 'DESC'], // DESC ACS
            ],
            // distinct: true, // 数据条数不对
            where: {
                name: {
                    [Op.like]: `%${params.name || ''}%`
                }
            },
            limit: params.pageSize,
            offset: (params.current - 1) * params.pageSize,
        });
        return new Promise((resolve, reject) => {
            resolve(AppUtils.setListResponse(list));
        })
    }

    /**
     * 查询单个
     * @param id
     * @returns {Promise<V> | Promise.<V>}
     */
    async fetchByName(name) {
        return this.loader.load(name);
    }

    /**
     * 创建数据
     * @param user
     * @returns {user}
     */
    async create(rows) {
        const newRow = await this.model.create(rows);
        if (newRow.dataValues) {
            return AppUtils.setResponse({
                message: `${rows.name}${this.name}新增成功！`
            }, 0);
        } else {
            return AppUtils.setResponse({
                message: `${rows.name}${this.name}新增失败！`
            }, 1);
        }
    }

    /**
     * 重名验证
     * @param user
     * @returns {*|{data: *}}
     */
    async repeatName(user) {
        const oldRows = await this.model.findOne({where: {name: user.name}});
        if (oldRows && oldRows.toJSON().name === user.name) {
            return AppUtils.setResponse({
                message: `${user.name}${this.name}已存在，请重新输入！`
            }, 1);
        }
    }

    /**
     * 更新用户
     * @param user
     */
    async update(rows) {
        const us = await this.model.update(_.pickBy(rows), {where: {id: rows.id}});
        if (us.length) {
            return AppUtils.setResponse({
                message: `${rows.name}${this.name}信息修改成功！`
            }, 0);
        } else {
            return AppUtils.setResponse({
                message: `${rows.name}${this.name}信息修改失败！`
            }, 1);
        }
    }

    /**
     * 删除用户
     */
    async delete(ID) {
        const delRows = await this.model.findOne({where: {id: ID}});
        if (delRows) {
            const cacheRows = delRows.toJSON();
            await delRows.destroy();
            return AppUtils.setResponse({
                message: `${cacheRows.name}删除成功!`,
            }, 0);
        } else {
            return AppUtils.setResponse({
                message: `${cacheRows.name}不存在，请检查后重试!`,
            }, 1);
        }
    }

    async setfindAllData(res) {
        return new Promise((resolve, reject) => {
            if (res.length) {
                resolve(0);
            }
            resolve(1);
        })
    }

    /**
     * 设置响应格式
     * @param options
     * @param code
     * @returns {*|{data: *}}
     */
    setResponse(options, code) {
        return AppUtils.setResponse(options, code);
    }
}

module.exports = TableConnectorBase;

