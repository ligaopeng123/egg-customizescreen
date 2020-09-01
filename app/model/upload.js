'use strict';

module.exports = (app) => {
    const {STRING, INTEGER, DATE} = app.Sequelize;
    const Upload = app.model.define('upload', {
        id: {type: INTEGER, primaryKey: true, autoIncrement: true},
        md5: STRING(32),
        name: STRING(32),
        path: STRING(128),
        created_at: DATE,
        updated_at: DATE,
    });
    return Upload;
};
