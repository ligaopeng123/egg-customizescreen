'use strict';

const TableConnector = require('../../share/table');

class UserConnector extends TableConnector {
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

    async createUser(user) {
        const status = await this.repeatName(user);
        if (status) return status;
        return await this.create(user);
    }

    async updateUser(user) {
        return await this.update(user);
    }

    async deleteUser(ID) {
        return await this.delete(ID);
    }
}

module.exports = UserConnector;

