'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        const {STRING, DATE, TEXT, UUID, UUIDV4} = Sequelize;

        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('topologies', {
            id: {
                type: UUID, primaryKey: true, defaultValue: UUIDV4  // autoIncrement: true  自增
            },
            name: {
                type: STRING(64), // autoIncrement: true  自增
            },
            info: {
                type: STRING(128), // autoIncrement: true  自增
            },
            value: {
                type: TEXT, // autoIncrement: true  自增
            },
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
