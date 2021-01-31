'use strict';
/**
 * 创建布局测服务 主要保存布局相关信息
 */
module.exports = (app) => {
    const {STRING, DATE, TEXT} = app.Sequelize;
    const Event = app.model.define('event', {
        id: {type: TEXT, primaryKey: true}, //  autoIncrement: true
        deviceIp: {
            type: STRING(128),
            field: 'deviceIp'
        },
        deviceName: {
            type: STRING(128),
            field: 'deviceName'
        },
        eventType: {
            type: STRING(128),
            field: 'eventType'
        },
        content: TEXT,
        createTime: {
            type: DATE,
            field: 'createTime'
        },
    }, {
        timestamps: false
    });
    return Event;
};
