import express from "express";
const router = express.Router();
import { authCon, productsCon, replenishmentsCon, newPostCon, usersCon, ordersCon, settingsCon, privatbankCon, authPassportCon } from "../controllers/index.js";
import { free, admin, self, finishGuard, mediator, sessionForBack, sessionForFront } from './functions.js'

router.get("/api", (req, res) => res.end('Abstract-API'));
router.all("*", sessionForBack);
router.get("/api/v1/session/user", sessionForFront);

[
  // auth
  { path: "/api/v1/auth/register", method: "post", controller: authCon.Register, guard: [free], },
  // users
  { path: "/api/v1/users", method: "get", controller: usersCon.Get, guard: [admin, self], },
  { path: "/api/v1/users", method: "post", controller: usersCon.Post, guard: [admin], },
  { path: "/api/v1/users", method: "put", controller: usersCon.Edit, guard: [admin, self], },
  { path: "/api/v1/users/:id", method: "delete", controller: usersCon.Delete, guard: [admin], },
  { path: "/api/v1/users/file-names/:id", method: "get", controller: usersCon.GetFileNames, guard: [admin, self], },
  // products
  { path: "/api/v1/products", method: "get", controller: productsCon.Get, guard: [free], },
  { path: "/api/v1/products", method: "post", controller: productsCon.Post, guard: [admin], },
  { path: "/api/v1/products", method: "put", controller: productsCon.Edit, guard: [admin], },
  { path: "/api/v1/products/:id", method: "delete", controller: productsCon.Delete, guard: [admin], },
  { path: "/api/v1/products/file-names/:id", method: "get", controller: productsCon.GetFileNames, },
  // app settings
  { path: "/api/v1/settings", method: "get", controller: settingsCon.Get, guard: [free], },
  { path: "/api/v1/settings", method: "put", controller: settingsCon.Edit, guard: [admin], },
  // orders
  { path: "/api/v1/orders", method: "get", controller: ordersCon.Get, guard: [admin, self], },
  { path: "/api/v1/orders", method: "post", controller: ordersCon.Post, guard: [free], },
  { path: "/api/v1/orders", method: "put", controller: ordersCon.Edit, guard: [admin], },
  { path: "/api/v1/orders/:id", method: "delete", controller: ordersCon.Delete, guard: [admin], },
  // replenishments
  { path: "/api/v1/replenishments", method: "get", controller: replenishmentsCon.Get, guard: [admin], },
  { path: "/api/v1/replenishments", method: "post", controller: replenishmentsCon.Post, guard: [admin], },
  { path: "/api/v1/replenishments", method: "put", controller: replenishmentsCon.Edit, guard: [admin], },
  { path: "/api/v1/replenishments/:id", method: "delete", controller: replenishmentsCon.Delete, guard: [admin], },
  // new-post
  { path: "/api/v1/new-post/tracking", method: "get", controller: newPostCon.GetTracking, guard: [admin, self], },
  // privat payment
  { path: "/api/v1/privatbank/confirm", method: "post", controller: privatbankCon.ConfirmPost, guard: [free], },
].forEach(
  /* *** *** *** *** *** it is like - router.post('/register', mediator.bind(new RegisterController())); *** *** *** *** *** */
  (item) => router[item.method](item.path, ...(item.guard ? item.guard : []), finishGuard, mediator.bind(new item.controller()))
);


///////////////////////////////////////////////////////
//                   local strategy                  //
///////////////////////////////////////////////////////
router.post("/api/v1/auth/login", authPassportCon.login);
router.get("/api/v1/auth/logout", authPassportCon.logout);
router.post("/api/v1/auth/logout", authPassportCon.logout);
///////////////////////////////////////////////////////
//                      OAuth                        //
///////////////////////////////////////////////////////
import passport from "passport";
const successRedirect = "/profile";
const failureRedirect = "/auth";
const redirects = { successRedirect, failureRedirect };
// google
router.get("/api/v1/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/api/v1/auth/google/callback", authPassportCon.loginGoogle);
// facebook
router.get("/api/v1/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }), (req, res) => { });
router.get("/api/v1/auth/facebook/callback", authPassportCon.loginFacebook);
// twitter
router.get("/auth/twitter", passport.authenticate("twitter"), (req, res) => { });
router.get("/auth/twitter/callback", passport.authenticate("twitter", redirects), (req, res) => { });
// github
router.get("/api/auth/github", passport.authenticate("github"), (req, res) => { });
router.get("/auth/github/callback", passport.authenticate("github", redirects), (req, res) => { });
// instagram
router.get("/auth/instagram", passport.authenticate("instagram"), (req, res) => { });
router.get("/auth/instagram/callback", passport.authenticate("instagram", redirects), (req, res) => { });

export default router;
