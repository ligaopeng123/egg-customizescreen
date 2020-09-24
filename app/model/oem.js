'use strict';
/**
 * oem模型
 * @param app
 * @returns {void|*|Model<any, any, TAttributes>}
 */
module.exports = (app) => {
    const {STRING, INTEGER, UUID, DATE, TEXT} = app.Sequelize;
    const Oem = app.model.define('oem', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        // 描述字段
        name: STRING(64),
        // 转换成对象的键值对
        key: STRING(64),
        // 父级ID 用于确定父级单位
        value: TEXT,
        // 数据类型 用作不同的输入不同的类型
        value_type: STRING(16),
        created_at: DATE,
        updated_at: DATE,
    });
    return Oem;
};
