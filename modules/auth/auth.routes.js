const Joi = require("joi");
module.exports = db => {
  const authControllers = require("./auth.controller")(db);
  return [
    {
      path: "/api/auth/signup",
      method: "POST",
      handler: authControllers.signup
    },
    {
      path: "/api/auth/signin",
      method: "POST",
      handler: authControllers.signin
    }
    // {
    //   path: "/api/auth/signinemail",
    //   method: "POST",
    //   handler: authControllers.signinemail
    // }
  ];
};
