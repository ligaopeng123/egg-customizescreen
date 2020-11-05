'use strict';

module.exports = {
    Query:{
        // 查询事件表信息
        getEventsList(root, {params}, ctx) {
            return ctx.connector.event.fetchList(params, 'createTime');
        }
    }
};