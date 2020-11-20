'use strict';

const AppUtils = require('../AppUtils');
const Service = require('egg').Service;

class DownloadService extends Service {
    /**
     * 登录入口
     * @returns {Promise.<*>}
     */
    async download() {
        const {ctx} = this;
        const connector = ctx.connector;
        const {options, params} = ctx.request.body;
        const {fn, tableKey} = options;
        if (fn && tableKey && connector[tableKey] && connector[tableKey][fn]) {
            const table = await connector[tableKey][fn](params);
            return AppUtils.createExcel({ctx, options, data: table.data});
        }
        return {}
    }
}


module.exports = DownloadService;
