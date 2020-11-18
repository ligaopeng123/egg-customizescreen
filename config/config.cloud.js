/* eslint valid-jsdoc: "off" */

'use strict';
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    // add your user config here
    const userConfig = {
        sequelize: {
            "username": "root",
            "password": "cy-tech.net@123",
            "database": "graphql",
            "host": "192.168.1.87",
            "dialect": "mysql",
        },
    }
    return {
        ...userConfig
    }
};
