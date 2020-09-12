module.exports = {
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
    }
};