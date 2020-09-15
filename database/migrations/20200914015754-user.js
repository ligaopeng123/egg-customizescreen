'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const {INTEGER, DATE, STRING} = Sequelize;
        // 获取表结构
    const fields = await queryInterface.describeTable('users');
      // 判断表结构是否存在
      if (!fields.hasOwnProperty('organization_id')) {
          return queryInterface.sequelize.transaction((t) => {
              return Promise.all([
                  queryInterface.addColumn('users', 'organization_id', {
                      type: INTEGER
                  }, {transaction: t})
              ])
          });
      }
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
