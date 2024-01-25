import { log, } from 'high-level';
import chalk from 'chalk';

class Controller {

    constructor(set) {
        Object.assign(this, set);
        this.conName = `${this.name}Controller.${this.constructor.name}`;
        if (!this.successMsg) this.successMsg = `Success operation with ${this.essence}`;
        if (!this.unSuccessMsg) this.unSuccessMsg = `Cannot ${this.constructor.name} ${this.essence}!`;
    }

    get successDTO() {
        return {
            code: '200',
            result: this.result,
            ok: true,
            success: true,
            msg: 'Good :)',
            msg2: this.successMsg,
            from: 'send Universal'
        }
    }

    get unSuccessDTO() {
        return {
            code: '200',
            result: this.result,
            ok: false,
            success: false,
            msg: 'Not good :(',
            msg2: this.unSuccessMsg,
            from: 'send Universal'
        }
    }

    get errorDTO() {
        return {
            code: '500',
            status: '',
            err: this.err?.toString(),
            success: false,
            msg: 'Error in ' + this.req.url,
            msg2: this.errMsg,
            from: 'error Universal'
        }
    }

    get errMsg() {
        return `Error! ${this.unSuccessMsg}`;
    }

    async go(req, res) {
        this.req = req;
        this.res = res;
        try {
            log(chalk.green.inverse.bold(`Controller: `), chalk.green.bold(this.conName), this.req.body);
            this.result = await this.do();
            return this.fork();
        } catch (e) {
            this.err = e;
            log(e);
            return this.errorDTO
        };
    }

    fork = _ => this.result.ok ? this.successDTO : this.unSuccessDTO

};

export default Controller;