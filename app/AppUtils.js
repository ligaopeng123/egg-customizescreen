const AppUtils = module.exports = {
    /**
     * 添加code
     * @param options
     * @param code   0为成功， 其他均为失败 具体看下业务要求
     * @returns {*}
     */
    addCode(options, code) {
        return Object.assign(options, {code});
    },

    /**
     * 设置返回的格式
     * @param data
     * @returns {{data: *}}
     */
    setResponse(data, code) {
        if (code !== undefined) {
            return this.addCode(data, code);
        }
        return data;
    },

    /**
     * 设置分页查询参数
     */
    setListRequest() {

    },
    /**
     * 设置表格数据
     * @param list
     * @returns {*}
     */
    setListResponse(list) {
        // const data = list.rows.length ? list.rows.map(item => {
        //     return item.dataValues;
        // }) : [{}];
        return this.addCode({
            total: list.count,
            data: list.rows
        }, 0);
    },

    /**
     * 获取uuid方法 用于做唯一标识时使用
     * @param {number} len  id的长度  默认64位
     * @param {number} radix  数据基数你2 10 16等  默认62位全部正常字符
     * @returns {string}
     */
    uuid(len = 64, radix = 62) {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        const uuid = [];
        let i;
        radix = radix || chars.length;

        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            let r;

            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            // Fill in random data. At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },

    /**
     * 获取token
     * @param app
     */
    getToken(ctx) {
        const {app} = ctx;
        // 不需要鉴权的接口
        const csrf = app.config.security.csrf;

        const token = ctx.request.header[csrf.headerName]
            // 将第一个字母转大写
            || AppUtils.getQueryObjectByUrl(ctx.request.url)[`${csrf.headerName.charAt(0).toUpperCase()}${csrf.headerName.slice(1)}`];
        return token;
    },
    /**
     * 超时时间获取
     * @param app
     * @param token
     * @returns {boolean}  为true时则正常访问 为false时则超时
     */
    getTimeout(app, token) {
        // 解析token数据
        const {iat} = app.jwt.verify(token);
        const loginTime = new Date().getTime() - iat * 1000;
        const oneDay = 24 * 60 * 60 * 1000;
        return loginTime < oneDay;
    },
    /**
     * 根据URL获取传递的参数
     * @param url
     * @returns {{}}
     */
    getQueryObjectByUrl(url) {
        const _url = url === null ? window.location.href : url;
        const search = _url.substring(_url.lastIndexOf('?') + 1);
        const obj = {};
        const reg = /([^?&=]+)=([^?&=]*)/g;
        // [^?&=]+表示：除了？、&、=之外的一到多个字符
        // [^?&=]*表示：除了？、&、=之外的0到多个字符（任意多个）
        search.replace(reg, function (rs, $1, $2) {
            const name = decodeURIComponent($1);
            const val = String(decodeURIComponent($2));
            obj[name] = val;
            return rs;
        });
        return obj;
    }
};