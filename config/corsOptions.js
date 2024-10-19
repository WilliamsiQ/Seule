const allowedOrigin = require("./allowedOrigins");
const corsOptions = {
  origin: (origin, callback) => {
    //if origin(client platform i.e google.com) is  in the allowed list or  origin( is define) then allow access to server else dont
    if (allowedOrigin.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("not allowed by cors "));
    }
  },
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
