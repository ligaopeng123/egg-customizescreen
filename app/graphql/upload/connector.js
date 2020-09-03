'use strict';
const DataLoader = require('dataloader');

class UploadConnector {
    constructor(ctx) {
        this.ctx = ctx;
        this.loader = new DataLoader(this.fetch.bind(this));
    }

    /**
     * DataLoader缓存数据
     * @param ids
     * @returns {Promise.<*[]>}
     */
    async fetch(md5s) {
        const promises = this.ctx.app.model.Upload.findAll({
            where: {
                md5: md5s
            }
        });
        return new Promise((resolve, reject) => {
            promises.then(res => {
                res.length ? resolve(res) : resolve([{}]);
            })
        })
    }

    /**
     * 查询单个
     * @param id
     * @returns {Promise<V> | Promise.<V>}
     */
    fetchByMd5(md5) {
        // this.loader.load(md5).then(res => {
        //     console.log(res)
        // })
        return this.loader.load(md5);
    }

    /**
     * 创建用户
     * @param user
     * @returns {user}
     */
    createMd5(fileInfo) {
        return this.ctx.app.model.Upload.create(fileInfo);
    }

    /**
     * 删除用户
     */
    async deleteMd5(file) {
        const delUser = await this.ctx.app.model.Upload.findOne({where: {id: file.id}});
        if (delUser) {
            const cacheUser = delUser.toJSON();
            delUser.destroy();
            return `${cacheUser.name}删除成功!`;
        } else {
            return `用户不存在，请检查后重试!`;
        }
    }
}

module
    .exports = UploadConnector;

