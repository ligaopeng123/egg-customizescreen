'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        const {STRING, UUID, TEXT, INTEGER, DATE, BOOLEAN} = Sequelize;
        await queryInterface.createTable('menus', {
            id: {type: INTEGER, primaryKey: true, autoIncrement: true},
            name: STRING(16),
            // 路由地址
            path: TEXT,
            // 菜单唯一代码 不可修改 动态生成
            type: STRING(64),
            // 父级ID 用于确定父级单位
            parent_id: STRING(64),
            // 从上到下拼接的id 用户快速查询
            code_link: STRING(1280),
            // 权限是否开启
            auth: BOOLEAN,
            created_at: DATE,
            updated_at: DATE,
        });
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    }
};
