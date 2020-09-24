'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller} = app;
    // 文件上传
    router.post('/upload', controller.upload.index);
    // 用户登录
    router.post('/admin/login', controller.login.index);
    // 菜单信息
    router.post('/admin/menus', controller.menu.index);
    // 获取oem配置
    router.post('/admin/oem', controller.oem.index);
};
