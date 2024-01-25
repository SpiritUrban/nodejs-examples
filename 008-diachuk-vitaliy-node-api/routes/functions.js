import { log } from "high-level";
import { User } from "../models/index.js";

const free = (req, res, next) => {
    req.guardFlag = true;
    next();
};

const admin = (req, res, next) => {
    if (req?.user?.role == 'admin') req.guardFlag = true;
    next();
};

const self = (req, res, next) => {
    if (!req.user) next();
    if (req.method == 'GET' && (req.user._id == req.query._id)) req.guardFlag = true;
    if (req.method == 'GET' && (req.user.email == req.query.email)) req.guardFlag = true;
    if (req.method == 'GET' && (req.user._id == req.params.id)) req.guardFlag = true;
    if (req.method == 'PUT' && (req.user._id == req.body._id)) req.guardFlag = true;
    next();
};

const finishGuard = (req, res, next) => {
    if (req.guardFlag) next()
    else res.json({ ok: false, msg: 'You do not have access!' });
};

async function mediator(req, res, next) {
    if (!req.guardFlag) return;
    const DTO = await this.go(req, res);
    res.json(DTO);
};

const sessionForBack = async (req, res, next) => {
    try {
      // log("----req.headers", req.headers);
      // log(chalk.dim('BEFORE !!!!!:', req.url));
      // log(chalk.dim('Token:', req.headers.token));
      // log(chalk.dim('body:'), req.body);
      let user = null;
      if (req.headers.token)
        user = await User.findOne({ authToken: req.headers?.token });
      if (user) {
        req.user = user;
        req.user.password = null;
        req.user.emailToken = null;
      };
      // const fakeUser = await User.find({})[0]
      // res.json(fakeUser);
      // res.json(req.user);
      // log('Connected User: ', req.user);
      next();
    } catch (error) {
      log(error);
      res.sendStatus(500);
    };
  };

const sessionForFront =  async (req, res) => {
    try {
      // log("USER: ", req.user);
      // log("SESSION: ", req.session);
      // log("REQ id: ", req._id, req.sessionID);
      //   log('user in session:', req.user)
      return res.json({ ok: true, user: req.user });
      // const fakeUser = await User.find({})[0]
      req.user.password = null;
      req.user.email_token = null;
      // res.json(fakeUser);
      res.json(req.user);
    } catch (error) {
      res.sendStatus(500);
    }
  }  

export { free, admin, self, finishGuard, mediator, sessionForBack, sessionForFront }