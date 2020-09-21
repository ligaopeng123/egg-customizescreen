'use strict';

const Controller = require('egg').Controller;

class LoginController extends Controller {
    async index() {
        const {ctx, app} = this;
        const body = await ctx.service.login.login();
        // 判断name 是否存在
        const username = body.username;
        if (username) {
            // csrf配置
            const csrf = app.config.security.csrf;
            // // 生成token
            const token = app.jwt.sign({
                'username': username, //需要存储的 token 数据
            });
            const Authorization = {};
            Authorization[csrf.headerName] = token;
            //设置headers
            ctx.set(Authorization)
            // // 返回信息
            Object.assign(body, {token});
            ctx.body = body;
        } else {
            ctx.body = body;
        }
    }
}

module.exports = LoginController;
