function router(pathname, handler, response, request) {
  console.log("About to route a request for " + pathname);
  if (typeof handler[pathname] === 'function') {
    return handler[pathname](response, request);
  } else {
    console.log("404 for " + pathname);
    response.writeHead(200, { "Content-Type": "text/plain" });
    response.write("404 not found");
    response.end();
  }
}

exports.router = router;