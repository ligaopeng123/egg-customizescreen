'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;
    router.post('/upload', controller.upload.index);
    router.post('/admin/login', controller.login.index);
};
