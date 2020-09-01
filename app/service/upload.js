'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require("fs");
const crypto = require('crypto');
const sendToWormhole = require('stream-wormhole');
const awaitStreamReady = require('await-stream-ready').write;

class UploadService extends Service {
    async upload() {
        const {ctx} = this;
        // console.log(ctx.connector.upload)
        // 获取 steam
        const stream = await ctx.getFileStream();

        /**
         * 文件路径
         */
        const {uplaodBasePath, filename, filePath, name} = this.setFlieByStream(stream);
        /**
         * 检验md5
         */
        const data = await this.createMD5(stream, {uplaodBasePath, filename, filePath, name});
        const status = data.status;
        // 数据库里面的文件路径
        const _path = data.path;
        if (status === 'found') {
            return this.createResponse(stream, _path);
        } else {
            /**
             * 生成文件目录
             */
            const {target} = this.createUploadPath({uplaodBasePath, filename});
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
            return this.createResponse(stream, _path);
        }
    }

    /**
     * 创建响应
     * @param stream
     * @param filePath
     * @returns {*}
     */
    createResponse(stream, filePath) {
        return Object.assign({}, stream.fields, {path: filePath});
    }

    /**
     * 生成md5
     */
    async createMD5(stream, fileInfo) {
        const {ctx} = this;
        const {filePath, name} = fileInfo;
        const fsHash = crypto.createHash('md5');
        /**
         * 生成md5 然后先查询根据md5查询数据库
         * 如果数据库存在 将值拿到直接返回 不在创建文件
         * 如果值不存在 则创建文件后 再把路径返回
         */
        return new Promise((resolve, reject) => {
            stream.on('data', function (d) {
                fsHash.update(d);
            });
            stream.on('end', function () {
                const md5 = fsHash.digest('hex');
                // 根据md5查询 是否存在
                ctx.connector.upload.fetchByMd5(md5).then(res => {
                    // 存在该资源 编辑状态为found 然后返回
                    if (res.dataValues) {
                        resolve({
                            ...res.dataValues,
                            status: 'found'
                        })
                    //  不存在 则在数据库中创建该条资源 并将资源写入 标记状态为create
                    } else {
                        ctx.connector.upload.createMd5({
                            md5,
                            name,
                            path: filePath
                        }).then(res => {
                            resolve({
                                ...res.dataValues,
                                status: 'create'
                            })
                        });
                    }
                })
            });
        });
    }

    /***
     * 创建最终的文件夹 及文件名称
     * @param filename
     * @param uplaodBasePath
     * @returns {{target: string}}
     */
    createUploadPath({filename, uplaodBasePath}) {
        // 没有文件则创建文件目录
        const filePath = path.join(this.config.baseDir, uplaodBasePath);
        if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);
        // 生成写入路径
        const target = path.join(this.config.baseDir, uplaodBasePath, filename);
        return {
            target
        }
    }

    /**
     * 设置文件路径和文件名称
     * @param stream
     * @returns {{uplaodBasePath: string, filename: string}}
     */
    setFlieByStream(stream) {
        // 额外的路径
        const _path = stream.fields.path || '';
        const actionPath = _path ? _path + '/' : 'upload/';
        // 上传基础目录
        const uplaodBasePath = ('upload/' + actionPath).replace(/\/\//g, '/');
        // 生成文件名
        const filename = Date.now() + '_' + stream.filename;
        // 返回文件路径
        const filePath = `/${uplaodBasePath}${filename}`.replace(/\\/g, '/');
        return {
            uplaodBasePath,
            filename,
            filePath,
            name: stream.filename
        }
    }
}

module.exports = UploadService;
