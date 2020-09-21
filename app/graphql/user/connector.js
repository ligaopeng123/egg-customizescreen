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
        const user = this.model.findAll({
            where: {
                name: params.username,
                password: params.password
            }
        });
        return new Promise((resolve, reject) => {
            user.then(res => {
                this.setfindOneData(res).then((res) => {
                    const {code, data} = res;
                    if (code === 0) {
                        // 获取菜单
                        resolve(this.setResponse({
                            username: data.name,
                            message: `${data.name}登录成功！`
                        }, code))

                    } else {
                        resolve(this.setResponse({
                            message: '用户名或密码错误，请重新输入！'
                        }, code))
                    }
                });
            })
        })
    }

    /**
     * 根据用户信息 获取到菜单信息
     */
    async getMenusByUser(username) {
        const user = await this.model.findOne({
            where: {
                name: username,
            }
        });
        const {organization_id} = user.toJSON();
        const menus = await this.ctx.connector.organization.getMenusByRrganizationId(organization_id);
        return menus;
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

