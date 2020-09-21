'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

class MenuService extends Service {
    /**
     * 登录入口
     * @returns {Promise.<*>}
     */
    async getMenusByUser(username) {
        const {ctx, app} = this;
        // const csrf = app.config.security.csrf;
        const menus = await ctx.connector.user.getMenusByUser(username);
        return {
            code: 0,
            data: menus
        };
    }
}

module.exports = MenuService;
