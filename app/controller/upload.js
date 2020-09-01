'use strict';

const Controller = require('egg').Controller;

class UploadController extends Controller {
    async index() {
        const {ctx} = this;
        ctx.body = await ctx.service.upload.upload();
    }
}

module.exports = UploadController;
