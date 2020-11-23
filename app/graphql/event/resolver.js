'use strict';

module.exports = {
    Query: {
        // 查询事件表信息
        getEventsList(root, {params}, ctx) {
            return ctx.connector.event.fetchList({
                params,
                order: [['createTime', 'DESC']],
                attributes: ['id', 'deviceIp', 'deviceName', 'eventType', 'createTime', 'content']
            });
        },
        // 查询所有 不分页
        getEventsLists(root, {params}, ctx) {
            return ctx.connector.event.getEventsLists(params);
        }
    }
};