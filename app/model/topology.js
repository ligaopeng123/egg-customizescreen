'use strict';
/**
 * 创建布局测服务 主要保存布局相关信息
 */
module.exports = (app) => {
    const {STRING, DATE, TEXT, UUID, UUIDV4} = app.Sequelize;
    const Topology = app.model.define('topology', {
        id: {
            type: UUID, primaryKey: true, defaultValue: UUIDV4  // autoIncrement: true  自增
        },
        name: {
            type: STRING(64), // autoIncrement: true  自增
        },
        view_id: STRING(64),
        info: {
            type: STRING(128), // autoIncrement: true  自增
        },
        value: {
            type: TEXT, // autoIncrement: true  自增
        },
        image: STRING(128), // 图片路径
        created_at: DATE,
        updated_at: DATE,
    });

    // {
    // freezeTableName: true, // 强制表名称等于模型名称
    // tableName: 'Employees', // 定义数据库表明
    // timestamps: false, // 是否启用时间戳
    // }

    // 添加关联关系 一对多 一字典信息可以对应多个目标
    Topology.associate = () => {
        // 关联组织结构
        app.model.Topology.belongsTo(app.model.Organization, {
            foreignKey: 'view_id',
            as: 'view',
            targetKey: 'organization_code', // 关联目标字段
            allowNull: false // 非前置 字段可为空;
        });
    }
    return Topology;
};
