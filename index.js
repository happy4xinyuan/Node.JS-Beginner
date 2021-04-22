var router = require("./router");
var server = require("./server");
var handler = require("./handler");

var handlerMap = {};
handlerMap["/"] = handler.handler.home;
handlerMap["/home"] = handler.handler.home;
handlerMap["/about"] = handler.handler.about;
handlerMap["/upload"] = handler.handler.upload;
handlerMap["/show"] = handler.handler.show;

server.start(router.router, handlerMap);