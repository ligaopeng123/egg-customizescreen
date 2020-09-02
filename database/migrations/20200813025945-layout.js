'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const { INTEGER, DATE, STRING } = Sequelize;
      await queryInterface.createTable('layouts', {
          id: { type: INTEGER, primaryKey: true, autoIncrement: true },
          key: STRING(128),
          name: STRING(128),
          remark: STRING(128),
          content: STRING(10000),
          thumbnail: STRING(1000),
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
    await queryInterface.dropTable('layouts');
  }
};
