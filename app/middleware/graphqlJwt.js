/**
 * token鉴权 中间件
 * @param options
 * @param app
 * @returns {graphqlJwt}
 */
module.exports = (options, app) => {
    return async function graphql(ctx, next) {
        // 当前请求的路径
        const url = ctx.url;
        // 不需要鉴权的接口
        const csrf = app.config.security.csrf;
        const throughPath = csrf.throughPath;
        /**
         * 设置token超时 或者 失效
         */
        const setTokenInvalid = () => {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                message: 'token失效或解析错误',
                data: null
            }
        };
        // 如果包含直接通过
        if (throughPath.includes(url)) {
            await next();
        } else {
            const token = ctx.request.header[csrf.headerName];
            // 如果token不存在 则返回 状态码为401
            if (!token) {
                setTokenInvalid();
            } else {
                // 解析token数据
                const {iat} = app.jwt.verify(token);
                const loginTime = new Date().getTime() - iat * 1000;
                const oneDay = 24 * 60 * 60 * 1000;
                if (loginTime > oneDay) {
                    setTokenInvalid();
                } else {
                    await next();
                }
            }
        }
    }
}