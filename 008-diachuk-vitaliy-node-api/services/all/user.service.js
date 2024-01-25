import { log, randomString } from "high-level";
import { User } from "../../models/index.js";
import cryptoService from "./crypto.service.js";
import { pause } from '../../my_modules/stuff.js';
import SETTINGS from '../../SETTINGS.js';

// DB set admin roles!!!
const setAdminRoles = async () => {
  try {
    await pause(5000);
    SETTINGS.ADMINS.forEach(async (email) => {
      // log('Set ADMIN role for: ', email);
      await User.findOneAndUpdate({ email }, { role: 'admin' });
    });
  } catch (error) {
    log(error);
  }
};
setAdminRoles()

class UserService {
  constructor() { }

  refresh = async (strategy, profile, user) => {
    // 1. update token
    const authToken = randomString(4);
    const avatar = profile.photos[0] ? profile.photos[0].value : '';
    if (strategy == "google") {
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          authToken,
          avatar
        }
      );
    };
    if (strategy == "facebook") {
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          authToken,
          avatar
        }
      );
    };
    const userUpdated = await User.findOne({ _id: user._id });
    return userUpdated
  }

  //
  // createOrUpdateUser(strategy, profile, done)
  //
  createOrUpdateUser = async (strategy, profile, done) => {
    var user = null;
    if (strategy == "google") {
      const email = profile.emails[0].value; // email - for connection all by email
      user = await User.findOneAndUpdate(
        { email },
        {
          google: {
            id: profile.id,
            userName: profile.displayName,
            email,
          },
        }
      );
    }
    if (strategy == "facebook") {
      const email = profile.emails[0] ? profile.emails[0].value : "";
      user = await User.findOneAndUpdate(
        { email },
        {
          facebook: {
            id: profile.id,
            userName: profile.displayName,
            email,
          },
        }
      );
    }
    // log(" !!! createOrUpdateUser !!!", user);
    if (!user) this.createUser(strategy, profile, done);
    else done(null, user);
  };

  //
  // createUser(strategy, profile, done)
  //
  createUser = async (strategy, profile, done) => {
    const password = 345345346; //randomString(1);
    const newUser = { username: profile.displayName, password };
    if (strategy == "google") {
      const email = profile.emails[0].value;
      newUser.email = email;
      newUser.google = {
        id: profile.id,
        username: profile.displayName,
        email,
      };
    }
    if (strategy == "facebook") {
      const email = profile.emails[0] ? profile.emails[0].value : "";
      newUser.email = email;
      newUser.facebook = {
        id: profile.id,
        username: profile.displayName,
        email,
      };
    }
    const user = await this.add(newUser);
    log("BEFORE LAST DONE: ", newUser);
    await setAdminRoles()
    done(null, user);
  };


  // getAll = async (q = {}) => await User.find(q);
  // getByAssToken = async (ass_token) => await User.findOne({ ass_token });
  getOne = async (q) => await User.findOne(q);

  async get(query) {
    log('!!!!! query before transformation', query)
    // 1
    try {
      let multiple = [];
      multiple = query.multiple ? JSON.parse(query.multiple) : [];
      multiple.forEach(item => query[item.key] = { $in: item.value });

      let multipleOr = [];
      multipleOr = query.multipleOr ? JSON.parse(query.multipleOr) : [];
      if (multipleOr.length > 0) {
        query.$or = []
        multipleOr.forEach(item => query.$or.push({ [item.key]: item.value[0] }));
      }
    } catch (error) {
      log('Error in user.service: Can not parse multiple json ');
      log(error);
    }
    log('!!!!! query after transformation', query);
    // 2
    const list = await User
      .find(query)
      .sort({ _id: -1 })
      .skip(query.skip)
      .limit(query.limit);

    const sampleLength = await User
      .find(query)
      .count()
    // log('COUNT::::', count)
    return { ok: true, list, sampleLength };
  }


  async add(msg) {
    // log('MSG in ADD:', msg)
    // log('cryptoService in ADD:', cryptoService)

    try {
      const userByEmail = await this.getOne({ email: msg.email });
      if (userByEmail) return { ok: false, msg: "Email already exists!" };
      const userByUsername = await User.findOne({ username: msg.username }); // User already exists  ?
      if (userByUsername) return { ok: false, msg: "User already exists!" };
      // do
      const userInfo = {
        role: msg.role || "user",
        name: msg.name || msg.firstName + " " + msg.lastName,
        phone: msg.phone,
        language: msg.language || "en",
        room: msg.room,
        username: msg.username,
        email: msg.email,
        openPassword: msg.openPassword,
        password: cryptoService.hash(msg.password + ""),
        emailToken: randomString(4),
        authToken: randomString(4),
        assToken: randomString(4),
        wallets: {
          USD: {
            balance: 0,
          },
        },
        facebook: {
          id: "",
          token: "",
          email: "",
          username: "",
        },
        google: {
          id: "",
          token: "",
          email: "",
          username: "",
        },
        active: false,
        emailVerif: false,
        phoneVerif: false,
      };
      const user = await this.create(userInfo);

      return user;

      try {
        mail.sendMailVerification(u._id);
      } catch (error) {
        // ...................................... send mail for verification
        log(
          "Mails again not working! (file: controllers/users/create-new-user)"
        );
      }

      return { ok: true };
    } catch (error) {
      log("Error in user service!", error).place();
      return { ok: false, msg: "Error in user service!", error };
    }
  }

  create = async (o) => await new User(o).save();

  delAll = async () => await User.deleteMany({});

  findOneAndUpdate = async (query, data) =>
    await User.findOneAndUpdate(query, data);

  async edit(o) {
    await User.findByIdAndUpdate({ _id: o._id }, o);
    return { ok: true, document: o };
  }

  async delete(_id) {
    await this.remove(_id);
    return { ok: true };
  }

  async remove(_id) {
    await User.findOneAndRemove({ _id });
  }

  // async edit(_id, msg) {
  //   let edit = {}; // ......................................................... edit obj
  //   const isArray = msg instanceof Array; // ............................. must be array
  //   if (isArray) msg.forEach((el) => (edit[el.key] = el.newValue)); // ...... build edit obj
  //   await User.findOneAndUpdate({ _id }, edit); // .............................. update
  //   return { ok: true };
  // }

  async fake() {
    return JSON.parse(`{
            "wallets": {
            "USD": {
                "balance": 0
            }
            },
            "facebook": {
            "id": "",
            "token": "",
            "email": "",
            "username": ""
            },
            "google": {
            "id": "",
            "token": "",
            "email": "",
            "username": ""
            },
            "isLogged": true,
            "purchases_made": [],
            "saved_numbers": [],
            "linked_users": [],
            "_id": "5e72314405de434144dca5be",
            "username": "testUser",
            "email": "shadespiritenator@gmail.com",
            "email_token": "077q6b76v9vwqtaryepfjbseao0fdprrj7chg22dlhj",
            "password": "cd2a9a2e8d3572113b95e3b60bf626a77899ec6b",
            "phone_pin": 730901,
            "link_pin": 272749,
            "active": false,
            "email_verif": false,
            "phone_verif": false,
            "ever_cha": "7645e520-6925-11ea-977c-578729c8c9f9",
            "ever_sec": "4c04539621e9baec7e8651059293a71573409788",
            "last_login": "2020-03-18T14:33:40.735Z",
            "last_appeal": "2020-03-18T14:33:40.736Z",
            "__v": 0
        }`);
  }
}

export default new UserService();
