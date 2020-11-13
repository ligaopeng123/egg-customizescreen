'use strict';
/**
 * 创建布局测服务 主要保存布局相关信息
 */
module.exports = (app) => {
    const {STRING, UUID, UUIDV4, DATE, TEXT} = app.Sequelize;
    const Dictionary = app.model.define('dictionary', {
        // id属性
        id: {
            type: UUID, primaryKey: true, defaultValue: UUIDV4  // autoIncrement: true  自增
        },
        // 名称
        name: STRING(128),
        // 描述
        desc: STRING(128),
        // 值
        value: TEXT,
        // 类型
        type: STRING(32),
        created_at: DATE,
        updated_at: DATE,
    });
    return Dictionary;
};
