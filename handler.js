var exec = require("child_process").exec;
// querystring 只是一个解析 特定字符串的方法
// 查询字符串 'foo=bar&abc=xyz&abc=123' 会被解析为：
// querystring.parse(postData)
// {
//   foo: 'bar',
//   abc: ['xyz', '123']
// }
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

//handler设计为 【将服务器“传递”给内容】
//正如其名，handler用于异步处理每个来临的请求
var handler = {
  home(response) {
    // var content = "empty";
    // //该操作为非阻塞异步操作，避免阻塞后继续执行同步操作可能导致提前返回
    // exec("ls -lah", function (error, stdout, stderr) {
    //   content = stdout;
    //   console.log("home----");
    //   response.writeHead(200, { "Content-Type": "text/plain" });
    //   response.write(content);
    //   response.end();
    // });
    console.log("home----");
    var body = '<html>' +
      '<head>' +
      '<meta http-equiv="Content-Type" content="text/html; ' +
      'charset=UTF-8" />' +
      '</head>' +
      '<body>' +
      // textarea 表单action 与 method指定目标
      '<form action="/about" method="post">' +
      '<textarea name="text" rows="20" cols="60"></textarea>' +
      '<input type="submit" value="Submit text" />' +
      '</form>' +
      // 图片上传
      '<form action="/upload" enctype="multipart/form-data" ' +
      'method="post">' +
      '<input type="text" name="title"><br>' +
      '<input type="file" name="upload" multiple="multiple"><br>' +
      '<input type="submit" value="Upload">' +
      '</form>' +

      '</body>' +
      '</html>';

    response.writeHead(200, { "Content-Type": "html" });
    response.write(body);
    response.end();
  },

  about(response, request) {
    console.log('about----');
    //已知request，想要获取主体内容（如表单信息）时，由于在连接回调中传入的 request 对象是一个流，故必须监听要处理的主体内容按数据块处理。
    // express下可以直接 req.body.somedata
    //参考 http://nodejs.cn/learn/get-http-request-body-data-using-nodejs
    var postData = '';
    request.on('data', chunk => {
      console.log(`可用的数据块: ${chunk}`);
      postData += chunk;
    })
    request.on('end', () => {
      response.writeHead(200, { "Content-Type": "text/plain" });
      response.write("You've sent the text: " + querystring.parse(postData).text);
      response.end();
    })
  },

  upload(response, request) {
    console.log('upload----');
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function (err, fields, files) {
      console.log("parsing done");
      fs.renameSync(files.upload.path, "/tmp/p.png");
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write("received image:<br/>");
      response.write("<img src='/show' />");
      response.end();
    });
  },

  show(response) {
    console.log('show----');
    //图片地址硬编码
    fs.readFile("./tmp/p.png", "binary", function (error, file) {
      if (error) {
        response.writeHead(500, { "Content-Type": "text/plain" });
        response.write(error + "\n");
        response.end();
      } else {
        response.writeHead(200, { "Content-Type": "image/png" });
        response.write(file, "binary");
        response.end();
      }
    })
  }



}

exports.handler = handler;
