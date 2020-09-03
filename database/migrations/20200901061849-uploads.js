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
      await queryInterface.createTable('uploads', {
          id: { type: INTEGER, primaryKey: true, autoIncrement: true },
          md5: STRING(32),
          name: STRING(32),
          path: STRING(128),
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
    await queryInterface.dropTable('uploads');
  }
};
