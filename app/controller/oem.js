'use strict';

const Controller = require('egg').Controller;

class OemController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = await ctx.service.oem.getOemConfig();
  }
}

module.exports = OemController;
