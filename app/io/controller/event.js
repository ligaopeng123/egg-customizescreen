'use strict';

module.exports = app => {
    class Controller extends app.Controller {
        async index() {
            const message = this.ctx.args[0];
            // const say = await this.ctx.service.user.say();
            this.ctx.socket.emit('event', message);
        }
    }
    return Controller;
};