'use strict';

const DataLoader = require('dataloader');
const _ = require('lodash');
const {Op} = require('sequelize');
const AppUtils = require('../../AppUtils');

class UserConnector {
    constructor(ctx, app) {
        this.ctx = ctx;
        this.loader = new DataLoader(this.fetch.bind(this));
    }

    /**
     * 登录处理
     * @param params
     * @returns {Promise}  {
     *                          message: '', 查询异常 返回错误信息
     *                       }
     *
     *                       {
     *                              username
     *                              message: '' ...  查询正常 返回查询结果
     *                         }
     */
    login(params) {
        const user = this.ctx.app.model.User.findAll({
            where: {
                name: params.username,
                password: params.password
            }
        });
        return new Promise((resolve, reject) => {
            user.then(res => {
                res.length ? resolve(AppUtils.setResponse({
                    username: res[0].dataValues.name,
                    message: `${res[0].dataValues.name}登录成功！`
                }, 0)) : resolve(AppUtils.setResponse({
                    message: '用户名或密码错误，请重新输入！'
                }, 1));
            })
        })
    }

    /**
     * DataLoader缓存数据
     * @param ids
     * @returns {Promise.<*[]>}
     */
    fetch(names) {
        const users = this.ctx.app.model.User.findAll({
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
     * 查询多个用户信息
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
        return this.ctx.app.model.User.findAll();
    }

    /**
     * 查询分页表格
     */
    async fetchList(params) {
        // 分页查询
        const list = await this.ctx.app.model.User.findAndCountAll({
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
    fetchByName(name) {
        return this.loader.load(name);
    }

    /**
     * 创建用户
     * @param user
     * @returns {user}
     */
    async createUser(user) {
        const us = await this.ctx.app.model.User.create(user);
        if (us.dataValues) {
            return AppUtils.setResponse({
                message: `${user.name}用户新增成功！`
            }, 0);
        } else {
            return AppUtils.setResponse({
                message: `${user.name}用户新增失败！`
            }, 1);
        }
    }

    /**
     * 更新用户
     * @param user
     */
    async updateUser(user) {
        const us = await this.ctx.app.model.User.update(_.pickBy(user), {where: {id: user.id}});
        if (us.length) {
            return AppUtils.setResponse({
                message: `${user.name}用户信息修改成功！`
            }, 0);
        } else {
            return AppUtils.setResponse({
                message: `${user.name}用户信息修改失败！`
            }, 1);
        }
    }

    /**
     * 删除用户
     */
    async deleteUser(ID) {
        const delUser = await this.ctx.app.model.User.findOne({where: {id: ID}});
        if (delUser) {
            const cacheUser = delUser.toJSON();
            delUser.destroy();
            return AppUtils.setResponse({
                message: `${cacheUser.name}删除成功!`,
            }, 0);
        } else {
            return AppUtils.setResponse({
                message: `${cacheUser.name}不存在，请检查后重试!`,
            }, 1);
        }
    }
}

module.exports = UserConnector;

