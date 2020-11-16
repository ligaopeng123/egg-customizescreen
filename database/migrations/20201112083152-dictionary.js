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
        await queryInterface.createTable('dictionaries', {
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
