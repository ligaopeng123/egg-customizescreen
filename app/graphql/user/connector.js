'use strict';

const TableConnectorBase = require('../../share/table');
const AppUtils = require('../../AppUtils');

class UserConnector extends TableConnectorBase {
    constructor(ctx, app) {
        super(ctx, app);
    }

    /**
     * 初始化模型
     */
    init() {
        this.model = this.ctx.app.model.User;
        this.name = `用户`;
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
    async login(params) {
        const user = this.ctx.app.model.User.findAll({
            where: {
                name: params.username,
                password: params.password
            }
        });
        return new Promise((resolve, reject) => {
            user.then(res => {
                this.setfindAllData(res).then(code => {
                    code === 0 ? resolve(this.setResponse({
                        username: res[0].dataValues.name,
                        message: `${res[0].dataValues.name}登录成功！`
                    }, code)) : resolve(this.setResponse({
                        message: '用户名或密码错误，请重新输入！'
                    }, code));
                });

            })
        })
    }

    /**
     * 新增用户
     * @param user
     * @returns {Promise.<*>}
     */
    async createUser(user) {
        const status = await this.repeatName(user);
        if (status) return status;
        return await this.create(user);
    }

    /**
     * 修改用户
     * @param user
     * @returns {Promise.<*>}
     */
    async updateUser(user) {
        return await this.update(user);
    }

    /**
     * 用户删除
     * @param ID
     * @returns {Promise.<*>}
     */
    async deleteUser(ID) {
        return await this.delete(ID);
    }
}

module.exports = UserConnector;

