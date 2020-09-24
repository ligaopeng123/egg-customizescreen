'use strict';

const Controller = require('egg').Controller;

class MenuController extends Controller {
    async index() {
        const {ctx, app} = this;
        const {username, iat} = app.jwt.verify(ctx.request.header.authorization);
        const body = await ctx.service.menu.getMenusByUser(username);
        ctx.body = body;
    }
}

module.exports = MenuController;
