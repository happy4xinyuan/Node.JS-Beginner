var http = require('http');
var url = require('url');

function start(router, handler) {
  var onRequest = function (request, response) {
    //处理url
    var pathname = url.parse(request.url).pathname;
    console.log("Receive request from" + pathname);

    // //处理大规模表单数据可以监听data事件（在没有express下，应该如此
    // var postData = '';
    // request.setEncoding("utf8");
    // request.addListener("data", function (postDataChunk) {
    //   postData += postDataChunk;
    //   console.log("Received POST data chunk '" + postDataChunk + "'.");
    // })
    // //当所有data收集完毕后再交由路由处理
    // request.addListener("end", function () {
    //   router(pathname, handler, response, postData);
    // })

    router(pathname, handler, response, request);

  }

  var server = http.createServer(onRequest);
  server.listen(8888);

  console.log("Server has started.");
}



exports.start = start;