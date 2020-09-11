'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

class LoginService extends Service {
    /**
     * 登录入口
     * @returns {Promise.<*>}
     */
    async login() {
        const {ctx} = this;
        return await ctx.connector.user.login(ctx.request.body);
    }
}

module.exports = LoginService;
