'use strict';

const Service = require('egg').Service;
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const child_process = require('child_process');
const iconv = require('iconv-lite');

class UploadService extends Service {
    /**
     * 数据缓存
     * @type {{}}
     * @private
     */
    getCache(key) {
        return (this.app.__cache || {})[key];
    }

    setCache(key, value) {
        if (!this.app.__cache) {
            this.app.__cache = {};
        }
        this.app.__cache[key] = value;
    }

    /**
     * 上传入口
     * @returns {Promise.<*>}
     */
    async upload() {
        const {ctx} = this;
        /**
         * 获取参数
         */
        const params = ctx.request.body;
        console.log(this.app.__cache)
        /**
         * 异步上传 动态获取数据
         */
        if (params.path && params.type === 'async') {
            // uploading 上传中
            // reloading 转换中
            // finished 完成 通知web下载
            if (this.getCache(params.path)) return Object.assign({path: this.getCache(params.path)}, {status: 'finished'});
            return Object.assign({path: params.path}, {status: 'uploading'});
        }

        // 获取 steam
        const stream = await ctx.getFileStream();
        /**
         * 文件路径
         */
        const {uplaodBasePath, filename, filePath, name, PDFtoPPT} = this.setFlieByStream(stream);
        /**
         * 检验md5
         */
        const {status, flieBuffer, data} = await this.checkMd5(stream, {filePath, name});
        /**
         * 如果找到md5 则直接将信息返回 不再重新生成资源
         */
        if (status === 'found') {
            return await this.createResponse(stream, data.path, PDFtoPPT);
        } else {
            /**
             * 生成文件目录
             */
            const {targetPath} = this.createUploadPath({uplaodBasePath, filename});
            /**
             * 图片信息写入
             */
            await this.writeFile({path: targetPath, file: flieBuffer});
            /**
             * 数据插入数据库
             */
            await this.createMD5(data);
            /**
             * 数据返回
             */
            return await this.createResponse(stream, data.path, PDFtoPPT);
        }
    }

    /**
     * 文件写入
     * @param path
     * @param file
     * @returns {Promise}
     */
    async writeFile({path, file}) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, file, function (err) {
                if (err) reject(err);
                resolve('successed')
            });
        })
    }

    /**
     * 是否是转换格式
     * @param filePath
     * @returns {Promise}
     * @constructor
     */
    async PDFtoPPT(filePath) {
        const basePath = path.resolve('./');
        const pythonPath = path.join(basePath, './PDFtoPPT/index.py');
        let __path = '';
        return new Promise((resolve, reject) => {
            child_process.exec(`python ${pythonPath}` + ` ${path.join(basePath, filePath)}`,
                {encoding: 'buffer'}, function (error, stdout, stderr) {
                    if (error) {
                        console.log('error------------')
                        console.log(iconv.decode(error, 'cp936'))
                    }
                    if (stdout) {
                        // finish:
                        console.log('stdout------------');
                        const info = iconv.decode(stdout, 'cp936');
                        if (info.includes('finish:')) {
                            __path = info.split('finish:');
                            resolve({
                                basePath,
                                path: __path[__path.length - 1].trim().replace(basePath, '').replace(/\\/g, '\/')
                            });
                        }
                    }
                    if (stderr) {
                        console.log('stderr-----------')
                        const info = iconv.decode(stdout, 'cp936');
                        console.log(info.includes('finish:'))
                        if (info.includes('finish:')) {
                            __path = info.split('finish:');
                            resolve({
                                basePath,
                                path: __path[__path.length - 1].trim().replace(basePath, '').replace(/\\/g, '\/')
                            });
                        }
                    }
                });
        })
    }

    /**
     * 创建响应
     * @param stream
     * @param filePath
     * @returns {*}
     */
    async createResponse(stream, filePath, PDFtoPPT = false) {
        if (PDFtoPPT) {
            this.PDFtoPPT(filePath).then(res => {
                this.setCache(filePath, res.path);
            });
        }
        return {path: filePath};
    }

    /**
     * 检验md5
     * @param stream
     * @param fileInfo
     * @returns {Promise}
     */
    async checkMd5(stream, fileInfo) {
        const {ctx} = this;
        const {filePath, name} = fileInfo;
        /**
         * 生成md5 然后先查询根据md5查询数据库
         * 如果数据库存在 将值拿到直接返回 不在创建文件
         * 如果值不存在 则创建文件后 再把路径返回
         */
        return new Promise((resolve, reject) => {
            const fsHash = crypto.createHash('md5');
            /**
             * 保存流数据 后续用于写入
             */
            let flieBuffer;
            stream.on('data', function (d) {
                flieBuffer ? flieBuffer = Buffer.concat([flieBuffer, d]) : flieBuffer = d;
                fsHash.update(d);
            });
            stream.on('end', function () {
                const md5 = fsHash.digest('hex');
                // 根据md5查询 是否存在
                ctx.connector.upload.fetchByMd5(md5).then(res => {
                    // 存在该资源 编辑状态为found 然后返回
                    if (res.dataValues) {
                        resolve({
                            data: res.dataValues,
                            status: 'found'
                        })
                        //  不存在 则在数据库中创建该条资源 并将资源写入 标记状态为create
                    } else {
                        resolve({
                            status: 'create',
                            flieBuffer: flieBuffer,
                            data: {
                                md5,
                                name,
                                path: filePath
                            }
                        })
                    }
                })
            });
        });
    }

    /**
     * 生成md5
     */
    async createMD5(data) {
        const {ctx} = this;
        /**
         * 生成md5 然后先查询根据md5查询数据库
         * 如果数据库存在 将值拿到直接返回 不在创建文件
         * 如果值不存在 则创建文件后 再把路径返回
         */
        return new Promise((resolve, reject) => {
            ctx.connector.upload.createMd5(data).then(res => {
                resolve({
                    status: data
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
        const targetPath = path.join(this.config.baseDir, uplaodBasePath, filename);
        return {
            targetPath
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
            name: stream.filename,
            PDFtoPPT: stream.fields.PDFtoPPT
        }
    }
}

module.exports = UploadService;
