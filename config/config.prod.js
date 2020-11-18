/* eslint valid-jsdoc: "off" */

'use strict';
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
    // add your user config here
    const userConfig = {
        sequelize: {
            "username": "nx_ylf",
            "password": "NX_ylf2020!",
            "host": "47.95.205.101",
            "database": "graphql",
            "dialect": "mysql",
        },
    }
    return {
        ...userConfig
    }
};
