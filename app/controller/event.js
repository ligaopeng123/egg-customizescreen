'use strict';

const Controller = require('egg').Controller;

class ReceiveEventSocketController extends Controller {
    async index() {
        const {ctx, app} = this;
        /**
         * 事件发送的信息 使用广播形式发送
         */
        app.io.of('/').emit('event', ctx.request.body);
        ctx.body = {
            code: 0,
            message: 'Successfully received!'
        }
    }
}

module.exports = ReceiveEventSocketController;
