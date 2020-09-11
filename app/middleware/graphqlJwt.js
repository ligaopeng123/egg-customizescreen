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
        // 如果包含直接通过
        if (throughPath.includes(url)) {
            await next();
        } else {
            const token = ctx.request.header[csrf.headerName];

            // 如果token不存在 则返回 状态码为401
            if (!token) {
                ctx.status = 401;
                ctx.body = {
                    code: 401,
                    message: 'token失效或解析错误',
                    data: null
                }
            } else {

            }
        }
    };
}