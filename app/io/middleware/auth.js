'use strict';

/**
 * socket连接鉴权
 */
const {getTimeout, getToken} = require('../../AppUtils');

module.exports = (app) => {
    return async (ctx, next) => {
        /**
         * 没有token信息
         */
        const token = getToken(ctx);
        if (!token) {
            ctx.socket.disconnect();
            ctx.body = {
                code: 404,
                message: '请重新登录!'
            };
            return;
        }
        if (!getTimeout(app, token)) {
            ctx.socket.disconnect();
            ctx.body = {
                code: 404,
                message: '登录超时,请重新登录!'
            };
            return;
        }
        await next();
    };
};
