'use strict';

/**
 * socket发送处理
 */
const {getTimeout, getToken} = require('../../AppUtils');

module.exports = (app) => {
    return async (ctx, next) => {
        const token = getToken(ctx);
        console.log(!token, !getTimeout(app, token))
        if (!token || !getTimeout(app, token)) {
            return;
        }
        /**
         * 没有token信息
         */
        console.log( ctx.packet);

        await next();
    };
};
