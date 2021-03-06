'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        const {STRING, UUID, TEXT, INTEGER, DATE, BOOLEAN, UUIDV4} = Sequelize;
        await queryInterface.changeColumn('organizations', 'organization_code', {
            // 菜单唯一代码 不可修改 动态生成
            type: STRING(64),
        });
        await queryInterface.changeColumn('organizations', 'menu_ids', {
            // 菜单唯一代码 不可修改 动态生成
            type: TEXT,
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
