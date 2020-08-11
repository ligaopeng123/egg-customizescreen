'use strict';

module.exports = (app) => {
    const {STRING} = app.Sequelize;

    const User = app.model.define('user', {
        name: STRING(30),
        password: STRING(32),
    });
    // User.create({
    //     name: 'alice123',
    //     password: '666666',
    //     created_at: new Date(),
    //     updated_at: new Date(),
    // });
    return User;
};
