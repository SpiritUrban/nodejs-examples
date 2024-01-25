import passport from "passport";
import session from "express-session";
import mongoose from "mongoose";
var db = mongoose.connection;
import MongoStore from 'connect-mongo'

//
// session n passport
//
export default function (app) {
  app.use(
    session({
      secret: "my_precious",
      name: "cookie_name",
      // store: sessionStore, // connect-mongo session store
      //   store: MongoStore.create({ mongoUrl: 'mongodb://localhost/session' }),
      proxy: true,
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());
}
