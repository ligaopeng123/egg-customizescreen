'use strict';
/**
 * 创建布局测服务 主要保存布局相关信息
 */
const Dictionary = require('./dictionary');
module.exports = (app) => {
    const {STRING, UUID, UUIDV4, DATE, TEXT} = app.Sequelize;
    const Device = app.model.define('device', {
        // id属性
        id: {
            type: UUID, primaryKey: true, defaultValue: UUIDV4  // autoIncrement: true  自增
        },
        // 组织结构ID
        view_id: STRING(64),
        // 名称
        name: STRING(128),
        // 描述
        desc: STRING(128),
        // ip配置
        device_ip: STRING(128),
        // 资产类型
        device_type: STRING(32),
        // 在线状态
        online_status: STRING(8),
        // 依赖配置
        config: TEXT,
        // 定制参数
        options_id: STRING(64),
        created_at: DATE,
        updated_at: DATE,
    });
    // 添加关联关系 一对多 一字典信息可以对应多个目标
    Device.associate = () => {
        // 关联字典
        app.model.Device.belongsTo(app.model.Dictionary, {
            foreignKey: 'options_id',
            as: 'options',
            targetKey: 'id', // 关联目标字段
            allowNull: false // 非前置 字段可为空;
        });
        // 关联组织结构
        app.model.Device.belongsTo(app.model.Organization, {
            foreignKey: 'view_id',
            as: 'view',
            targetKey: 'organization_code', // 关联目标字段
            allowNull: false // 非前置 字段可为空;
        });
    }
    return Device;
};
