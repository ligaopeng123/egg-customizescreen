'use strict';
/**
 * 组织关系模型organization
 * @param app
 * @returns {void|*|Model<any, any, TAttributes>}
 */
module.exports = (app) => {
    const {STRING, INTEGER, DATE, BOOLEAN} = app.Sequelize;
    const User = app.model.define('menu', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        name: STRING(16),
        // 菜单唯一代码 不可修改 动态生成
        menu_code: STRING(16),
        // 父级ID 用于确定父级单位
        parent_id: INTEGER,
        // 从上到下拼接的id 用户快速查询
        code_link: STRING(128),
        // 路由地址
        path: INTEGER,
        // 权限是否开启
        auth: BOOLEAN,
        created_at: DATE,
        updated_at: DATE,
    });
    return User;
};
