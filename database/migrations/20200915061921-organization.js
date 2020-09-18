'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        const {STRING, INTEGER, DATE, BOOLEAN, TEXT} = Sequelize;
        await queryInterface.createTable('organizations', {
            id: {type: INTEGER, primaryKey: true, autoIncrement: true},
            name: STRING(16),
            // 组织机构唯一代码 不可修改
            organization_code: STRING(64),
            // 父级ID 用于确定父级单位
            parent_id: STRING(64),
            // 从上到下拼接的id 用户快速查询
            code_link: STRING(1280),
            // 菜单code 用户关联权限
            menu_ids: TEXT,
            // 邮政编码 补充信息
            postal_code: INTEGER,
            // 经度
            lon: STRING(8),
            // 纬度
            lat: STRING(8),
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
