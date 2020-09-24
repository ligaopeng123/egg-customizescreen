'use strict';

const Service = require('egg').Service;

class OemService extends Service {
    /**
     * 登录入口
     * @returns {Promise.<*>}
     */
    async getOemConfig(username) {
        const {ctx} = this;
        const config = await ctx.connector.oem.getOemConfig();
        return config;
    }
}

module.exports = OemService;
