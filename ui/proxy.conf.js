const PROXY_CONFIG = {
  "**": {
    "target": "http://localhost:9000",
    "secure": false,
    "bypass": function (req) {
      if (req.headers.accept.indexOf("html") !== -1) {
        console.log("Skipping proxy for browser request.");
        return "/index.html";
      }
    },
    "/api": {
      "target": "http://localhost:9000",
      "secure": false
    }
  }
};

module.exports = PROXY_CONFIG;
