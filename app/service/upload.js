'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require("fs");
const sendToWormhole = require('stream-wormhole');
const awaitStreamReady = require('await-stream-ready').write;

class UploadService extends Service {
    async upload() {
        const {ctx} = this;
        // 获取 steam
        const stream = await ctx.getFileStream();
        // 额外的路径
        const _path = stream.fields.path || '';
        const actionPath = _path ? _path + '/' : 'upload/';
        // 上传基础目录
        const uplaodBasePath = ('upload/' + actionPath).replace(/\/\//g, '/');
        // 生成文件名
        const _filename = Date.now() + '_' + stream.filename;
        // 没有文件则创建文件目录
        const filePath = path.join(this.config.baseDir, uplaodBasePath);
        if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);
        // 生成写入路径
        const target = path.join(this.config.baseDir, uplaodBasePath, _filename);

        // 写入流
        const writeStream = fs.createWriteStream(target);
        try {
            // 写入文件
            await awaitStreamReady(stream.pipe(writeStream));
        } catch (err) {
            // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
            await sendToWormhole(stream);
            throw err;
        }
        return Object.assign({}, stream.fields, {path: `/${uplaodBasePath}${_filename}`.replace(/\\/g, '/')});
    }
}

module.exports = UploadService;
