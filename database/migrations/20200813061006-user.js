'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const {INTEGER, DATE, STRING} = Sequelize;

        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('users', {
            id: {type: INTEGER, primaryKey: true, autoIncrement: true},
            name: STRING(16),
            password: STRING(16),
            desc: STRING(128),
            organization_id: INTEGER,
            organization: STRING(128),
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
        await queryInterface.dropTable('users');
    }
};
