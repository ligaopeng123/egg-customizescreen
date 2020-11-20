'use strict';

const Controller = require('egg').Controller;

class DownloadController extends Controller {
    async index() {
        const {ctx} = this;
        const body = await ctx.service.download.download();
        ctx.body = body;
    }
}

module.exports = DownloadController;
