'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        const {INTEGER, DATE, STRING, TEXT} = Sequelize;

        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('oems', {
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
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('oems');
    }
};
