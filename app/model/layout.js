'use strict';
/**
 * 创建布局测服务 主要保存布局相关信息
 */
module.exports = (app) => {
    const { STRING, INTEGER, DATE } = app.Sequelize;
    const Layout = app.model.define('layout', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: STRING(128),
        key: STRING(128),
        content: STRING(1000),
        created_at: DATE,
        updated_at: DATE,
    });
    return Layout;
};
