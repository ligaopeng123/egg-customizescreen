'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const {router, controller, io} = app;
    // 消息接收
    router.post('/receive/event', controller.event.index);
    // 文件上传
    router.post('/upload', controller.upload.index);
    // 文件下载
    router.post('/download', controller.download.index);
    // 用户登录
    router.post('/admin/login', controller.login.index);
    // 菜单信息
    router.post('/admin/menus', controller.menu.index);
    // 获取oem配置
    router.post('/admin/oem', controller.oem.index);
    // socket.io  socket连接  事件连接
    // app.io.of('/')
    io.route('event', io.controller.event.index);
    // app.io.of('/chat')
    io.of('/event').route('event', io.controller.event.index);
};
