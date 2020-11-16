'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const {STRING, TEXT, UUID, UUIDV4, DATE} = Sequelize;
      await queryInterface.createTable('devices', {
          // id属性
          id: {
              type: UUID, primaryKey: true, defaultValue: UUIDV4  // autoIncrement: true  自增
          },
          // 名称
          name: STRING(128),
          // 描述
          desc: STRING(128),
          // ip配置
          device_ip: STRING(128),
          // 资产类型
          device_type: STRING(32),
          // 在线状态
          online_status: STRING(8),
          // 依赖配置
          config: TEXT,
          // 定制参数
          options: TEXT,
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
