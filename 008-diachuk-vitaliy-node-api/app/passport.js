// .env
import dotenv from "dotenv";
const level = "../";
import SETTINGS from "../SETTINGS.js";
import { log, rand_str_long } from "../my_modules/stuff.js";
import { cryptoService, userService } from "../services/index.js";
import moment from "moment";
import passport from "passport";
import passportLocal from "passport-local";
const LocalStrategy = passportLocal.Strategy;
import passportFacebook from "passport-facebook";
const FacebookStrategy = passportFacebook.Strategy;
// var TwitterStrategy = require('passport-twitter').Strategy;
// var GithubStrategy = require('passport-github2').Strategy;
import passportGoogleOauth20 from "passport-google-oauth20";
const GoogleStrategy = passportGoogleOauth20.Strategy;
// var InstagramStrategy = require('passport-instagram').Strategy;

//
// serialize and deserialize
//
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((_id, done) => {
  userService.getOne(_id, (err, user) => {
    !err ? done(null, user) : done(err, null);
  });
});

//
// LocalStrategy
//
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // 1. update token
        const authToken = rand_str_long();
        const user = await userService.findOneAndUpdate(
          { email },
          { authToken }
        );
        user ? (user.authToken = authToken) : "";

        // 2. set auto logout time for admins, update last login time
        const isAdmin = SETTINGS.ADMIN_ROLES.some((role) => role == user.role); // ..................... boolean
        const now = moment();
        const last_login = moment().toDate();
        const shouldLogout = moment(now)
          .add(
            SETTINGS.ADMIN_SESSION_DURATION.AMOUNT,
            SETTINGS.ADMIN_SESSION_DURATION.UNITS
          )
          .toDate();
        const update = { last_login };
        if (isAdmin) update.shouldLogout = shouldLogout;
        if (!isAdmin) update.shouldLogout = "";

        // 3. update
        await userService.findOneAndUpdate({ email }, update);

        // 4. next
        const passwordHash = cryptoService.hash(password + "");
        return user
          ? passwordHash === user.password
            ? done(null, user)
            : done(null, false, { message: "Incorrect password." })
          : done(null, false, { message: "Incorrect email." });
      } catch (err) {
        log("!!! Some error in LocalStrategy !!!");
        done(err);
      }
    }
  )
);

//
// GoogleStrategy
//
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "934270439598-o88rj5fq6473ai6lr95jb4a82aqt0he2.apps.googleusercontent.com", // process.env.GP_ID, //'706111676047-g5j86f7ipga7ant19ii0shaltrooac36.apps.googleusercontent.com',
      clientSecret: "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", // process.env.GP_KEY, //'IdHthb-IWhRRyGtl1K5dNd38',
      // callbackURL: "https://localhost/api/v1/auth/google/callback", // process.env.GP_CLB, //'http://r4.okm.pub:3600/auth/google/callback'
      callbackURL: "https://ibanan.pp.ua/api/v1/auth/google/callback", // process.env.GP_CLB, //'http://r4.okm.pub:3600/auth/google/callback'
      
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        log("google profile: ", profile);
        let user = await userService.getOne({ "google.id": profile.id });
        if (user) {
          const userUpdated = await userService.refresh("google", profile, user);

          log('userUpdated:::::', userUpdated)
          done(null, userUpdated);
        } else userService.createOrUpdateUser("google", profile, done);
      } catch (error) {
        log(error);
      }
    }
  )
);

//
// FacebookStrategy
//
passport.use(
  new FacebookStrategy(
    {
      clientID: "1123954151816643", //process.env.FB_ID, // '455174914848353',
      clientSecret: "1bc4eb36f67ef0413ab13a84ff55b883", //process.env.FB_KEY, //'30a983716bd55cf5f36e1626fe3b20b8',
      callbackURL: "https://localhost/api/v1/auth/facebook/callback", //process.env.FB_CLB, // 'http://r4.okm.pub:3600/auth/facebook/callback'
      // callbackURL: "https://134.249.153.7/api/v1/auth/facebook/callback", //process.env.FB_CLB, // 'http://r4.okm.pub:3600/auth/facebook/callback'
      profileFields: [
        "id",
        "displayName",
        "link",
        "emails",
        "name",
        "picture.type(large)",
      ],
      // passReqToCallback : true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        log("facebook profile: ", profile);
        let user = await userService.getOne({ "facebook.id": profile.id });
        if (user) {
          const userUpdated = await userService.refresh("facebook", profile, user);
          done(null, userUpdated);
        } else userService.createOrUpdateUser("facebook", profile, done);
      } catch (error) {
        log(error);
      }
    }
  )
);

// passport.use(new TwitterStrategy({
//     consumerKey: 'get_your_own',
//     consumerSecret: 'get_your_own',
//     callbackURL: "http://127.0.0.1:3600/auth/twitter/callback"
// },
//     function (accessToken, refreshToken, profile, done) {
//         User.findOne({ oauthID: profile.id }, function (err, user) {
//             if (err) {
//                 console.log(err); // handle errors!
//             }
//             if (!err && user !== null) {
//                 done(null, user);
//             } else {
//                 user = new User({
//                     oauthID: profile.id,
//                     name: profile.displayName,
//                     created: Date.now()
//                 });
//                 user.save(function (err) {
//                     if (err) {
//                         console.log(err); // handle errors!
//                     } else {
//                         console.log("saving user ...");
//                         done(null, user);
//                     }
//                 });
//             }
//         });
//     }
// ));

// passport.use(new GithubStrategy({
//     clientID: 'get_your_own',
//     clientSecret: 'get_your_own',
//     callbackURL: "http://127.0.0.1:3600/auth/github/callback"
// },
//     function (accessToken, refreshToken, profile, done) {
//         User.findOne({ oauthID: profile.id }, function (err, user) {
//             if (err) {
//                 console.log(err); // handle errors!
//             }
//             if (!err && user !== null) {
//                 done(null, user);
//             } else {
//                 user = new User({
//                     oauthID: profile.id,
//                     name: profile.displayName,
//                     created: Date.now()
//                 });
//                 user.save(function (err) {
//                     if (err) {
//                         console.log(err); // handle errors!
//                     } else {
//                         console.log("saving user ...");
//                         done(null, user);
//                     }
//                 });
//             }
//         });
//     }
// ));

// passport.use(new InstagramStrategy({
//     clientID: 'get_your_own',
//     clientSecret: 'get_your_own',
//     callbackURL: 'http://127.0.0.1:3600/auth/instagram/callback'
// },
//     function (accessToken, refreshToken, profile, done) {
//         User.findOne({ oauthID: profile.id }, function (err, user) {
//             if (err) {
//                 console.log(err); // handle errors!
//             }
//             if (!err && user !== null) {
//                 done(null, user);
//             } else {
//                 user = new User({
//                     oauthID: profile.id,
//                     name: profile.displayName,
//                     created: Date.now()
//                 });
//                 user.save(function (err) {
//                     if (err) {
//                         console.log(err); // handle errors!
//                     } else {
//                         console.log("saving user ...");
//                         done(null, user);
//                     }
//                 });
//             }
//         });
//     }
// )
// );

export default null;
