'use strict';

const DataLoader = require('dataloader');
const _ = require('lodash');
const AppUtils = require('../../AppUtils');
const {Op} = require('sequelize');

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
                    username: res[0].dataValues.name,
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
    async fetchList({params}) {
        // 分页查询
        const list = await this.ctx.app.model.User.findAndCountAll({
            order: [
                ['created_at', 'DESC'],
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
    createUser(user) {
        return this.ctx.app.model.User.create(user);
    }

    /**
     * 更新用户
     * @param user
     */
    async updateUser(user) {
        await this.ctx.app.model.User.update(_.pickBy(user), {where: {id: user.id}});
        return await this.ctx.app.model.User.findOne({where: {id: user.id}});
    }

    /**
     * 删除用户
     */
    async deleteUser(user) {
        const delUser = await this.ctx.app.model.User.findOne({where: {id: user.id}});
        if (delUser) {
            const cacheUser = delUser.toJSON();
            delUser.destroy();
            return `${cacheUser.name}删除成功!`;
        } else {
            return `用户不存在，请检查后重试!`;
        }
    }
}

module.exports = UserConnector;

