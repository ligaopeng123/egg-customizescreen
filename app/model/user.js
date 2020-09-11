'use strict';

module.exports = (app) => {
    const {STRING, INTEGER, DATE} = app.Sequelize;
    const User = app.model.define('user', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        name: STRING(16),
        password: STRING(16),
        desc: STRING(128),
        organization: STRING(128),
        created_at: DATE,
        updated_at: DATE,
    });
    return User;
};
