'use strict';

module.exports = (app) => {
    const {STRING, INTEGER, DATE} = app.Sequelize;

    const User = app.model.define('user', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        name: STRING(16),
        password: STRING(16),
        created_at: DATE,
        updated_at: DATE,
    });
    // User.create({
    //     name: 'alice123',
    //     password: '666666',
    //     created_at: new Date(),
    //     updated_at: new Date(),
    // });
    return User;
};
