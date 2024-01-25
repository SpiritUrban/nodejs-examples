import passport from "passport";
// import { log,  rand_str_long } from '../my_modules/stuff.js';
import { send, error, good } from "../../my_modules/lib.js";

const behavior = (req, res, next, err, user) => {
  res.cookie("token", user?.authToken, { maxAge: 900000, httpOnly: false });
  return err
    ? error("custom", req, res, 409, "Not logged!")
    // : send(user, req, res, "User logged!");
    : res.send(`<script>  localStorage.setItem('token', "${user?.authToken}"); window.location.pathname='/profile'; </script>`);
};


// err
//   ? next(err)
//   : user
//   ? req.logIn(user, (err) => {
//       return err ? next(err) : send(user, req, res, "User logged!");
//     })
//   : error("custom", req, res, 409, "Not logged!");

export default {
  // Здесь мы проверяем, передаем данные о пользователе в функцию верификации, котоую мы определили выше.
  // Вообще, passport.authenticate() вызывает метод req.logIn автоматически, здесь же я указал это явно. Это добавляет удобство в отладке. Например, можно вставить сюда console.log(), чтобы посмотреть, что происходит...
  // При удачной авторизации данные пользователя будут храниться в req.user

  logout: (req, res) => {
    req.logout();
    good("ok", req, res, "You are logged out!");
  },

  //
  // local
  //
  login: (req, res, next) => {
    passport.authenticate("local", (err, user) =>
      behavior(req, res, next, err, user)
    )(req, res, next);
  },

  //
  // google
  //
  loginGoogle: (req, res, next) => {
    passport.authenticate("google", (err, user) =>
      behavior(req, res, next, err, user)
    )(req, res, next);
  },

  loginFacebook: (req, res, next) => {
    passport.authenticate("facebook", (err, user) =>
      behavior(req, res, next, err, user)
    )(req, res, next);
  },
};
