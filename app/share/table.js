'use strict';

const DataLoader = require('dataloader');
const _ = require('lodash');
const {Op} = require('sequelize');
const AppUtils = require('../AppUtils');
const fs = require('fs');
const path = require('path');

class TableConnectorBase {
    constructor(ctx, app) {
        this.ctx = ctx;
        this.init();
        this.loader = new DataLoader(this.fetch.bind(this));
    }

    /**
     * 默认的模型 用于增删改查
     * 继承者需要重写改方法
     *
     * 默认model 为查询的模型
     * name 为默认的模型信息的前缀
     */
    init() {
        this.model = null;
        this.name = '';
    }

    /**
     * DataLoader缓存数据
     * @param ids
     * @returns {Promise.<*[]>}
     */
    fetch(names) {
        const users = this.model.findAll({
            where: {
                name: names,
            }
        });
        return new Promise((resolve, reject) => {
            users.then(res => {
                res.length ? resolve(res) : resolve([{}]);
            })
        })
    }

    /**
     * 查询多个信息
     * @param names
     * @returns {Promise.<Array.<V|Error>>|Promise<Array<Error | V>>}
     */
    fetchByIds(names) {
        return this.loader.loadMany(names);
    }

    /**
     * 查询所有
     * @returns {*}
     */
    fetchAll() {
        return this.model.findAll();
    }

    /**
     * 查询分页表格
     */
    async fetchList(params) {
        // 分页查询
        const list = await this.model.findAndCountAll({
            order: [
                ['created_at', 'DESC'], // DESC ACS
            ],
            // distinct: true, // 数据条数不对
            where: {
                name: {
                    [Op.like]: `%${params.name || ''}%`
                }
            },
            limit: params.pageSize,
            offset: (params.current - 1) * params.pageSize,
        });
        return new Promise((resolve, reject) => {
            resolve(AppUtils.setListResponse(list));
        })
    }

    /**
     * 不分页查询
     * @param params
     */
    async fetchListAll(params) {
        let _where;
        if (params) {
            for (let key in params) {
                !_where ? _where = {} : null;
                /**
                 * id精确查询 其他模糊查询
                 */
                if (key === 'id') {
                    _where[key] = params[key]
                } else {
                    _where[key] = {
                        [Op.like]: `%${params[key] || ''}%`
                    }
                }
            }
        }
        const sequelizeParams = {
            order: [
                ['created_at', 'DESC'], // DESC ACS
            ],
            // distinct: true, // 数据条数不对
        };

        if (_where) {
            sequelizeParams.where = _where;
        }
        const data = await this.model.findAll(sequelizeParams);
        return {
            code: 0,
            message: '查询成功!',
            data: data
        }
    }

    /**
     * 查询单个
     * @param id
     * @returns {Promise<V> | Promise.<V>}
     */
    async fetchByName(name) {
        return this.loader.load(name);
    }

    /**
     * 创建数据
     * @param user
     * @returns {user}
     */
    async create(rows) {
        const newRow = await this.model.create(rows);
        return await this.ceateResponse(newRow);
    }

    /**
     * 将base64 转换成图片
     * @param image
     * @returns {Promise}
     */
    async createImageByBase64(image) {
        return new Promise((resolve, reject) => {
            if (image && image.startsWith('data:image')) {
                // 相对图片路径
                const fileFath = path.join('/upload', '/img');
                // 文件名称
                const fileName = `/${Date.now()}-thumbnail.png`;
                // 绝对图片路径
                const imgPath = path.join(this.ctx.app.baseDir, fileFath);
                // 写入路径
                const filePath = path.join(imgPath, fileName);
                /**
                 * 去掉前缀
                 */
                const base64 = image.replace(/^data:image\/\w+;base64,/, '');
                //把base64码转成buffer对象，
                const dataBuffer = new Buffer(base64, 'base64');
                if (!fs.existsSync(imgPath)) fs.mkdirSync(imgPath);
                fs.writeFile(filePath, dataBuffer, function (err) {
                    resolve({
                        code: 0,
                        message: '上传成功',
                        data: path.join(fileFath, fileName)
                    });
                });
            } else {
                resolve({
                    code: 1,
                    message: '上传失败',
                    data: image
                });
            }
        })
    }

    /**
     * 图片删除
     * @param fileFath
     * @returns {Promise}
     */
    async deleteImageByFliePath(fileFath) {
        return new Promise((resolve, reject) => {
            const imgPath = path.join(this.ctx.app.baseDir, fileFath);
            try {
                /**
                 * @des 判断文件或文件夹是否存在
                 */
                if (fs.existsSync(imgPath)) {
                    fs.unlinkSync(imgPath);
                    resolve(AppUtils.setResponse({
                        message: `删除成功`
                    }, 0));
                } else {
                    resolve(AppUtils.setResponse({
                        message: `文件不存在`
                    }, 1));
                }
            } catch (error) {
                resolve(AppUtils.setResponse({
                    message: error
                }, 1));
            }
        });
    }

    /**
     * 新建成功后的响应
     * @param rows
     * @returns {Promise.<void>}
     */
    async ceateResponse(rows) {
        if (rows.dataValues) {
            return AppUtils.setResponse({
                message: `${rows.dataValues.name}${this.name}新增成功！`
            }, 0);
        } else {
            return AppUtils.setResponse({
                message: `${rows.dataValues.name}${this.name}新增失败！`
            }, 1);
        }
    }

    /**
     * 重名验证
     * @param user
     * @returns {*|{data: *}}
     */
    async repeatName(rows) {
        const oldRows = await this.model.findOne({where: {name: rows.name}});
        if (oldRows && oldRows.toJSON().name === rows.name) {
            return AppUtils.setResponse({
                message: `${rows.name}${this.name}已存在，请重新输入！`
            }, 1);
        }
    }

    /**
     * 更新用户
     * @param user
     */
    async update(rows) {
        const us = await this.model.update(_.pickBy(rows), {where: {id: rows.id}});
        if (us.length) {
            return AppUtils.setResponse({
                message: `${rows.name}${this.name}信息修改成功！`
            }, 0);
        } else {
            return AppUtils.setResponse({
                message: `${rows.name}${this.name}信息修改失败！`
            }, 1);
        }
    }

    /**
     * 删除用户
     */
    async delete(ID) {
        const delRows = await this.model.findOne({where: {id: ID}});
        if (delRows) {
            const cacheRows = delRows.toJSON();
            await delRows.destroy();
            return AppUtils.setResponse({
                message: `${cacheRows.name}删除成功!`,
                data: cacheRows
            }, 0);
        } else {
            return AppUtils.setResponse({
                message: `${cacheRows.name}不存在，请检查后重试!`,
            }, 1);
        }
    }

    /**
     * 判断查询是否成功
     * @param res
     * @returns {Promise}
     */
    async setfindOneData(res) {
        return new Promise((resolve, reject) => {
            if (res.length) {
                resolve({
                    code: 0,
                    data: res[0].dataValues
                });
            }
            resolve(1, res);
        })
    }

    /**
     * 设置响应格式
     * @param options
     * @param code
     * @returns {*|{data: *}}
     */
    setResponse(options, code) {
        return AppUtils.setResponse(options, code);
    }
}

module.exports = TableConnectorBase;

