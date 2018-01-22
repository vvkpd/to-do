const parse = require('querystring').parse;

let redirect = function(path){
  this.statusCode = 302;
  this.setHeader('location',path);
  this.end();
};

let invoke = function(req,res){
  let handler = this._handlers[req.method][req.url];
  if(handler)
  handler(req,res);
}
const initialize = function(){
  this._handlers = {GET:{},POST:{}};
  this._preprocess = [];
  this._postprocess = [];
};
const get = function(url,handler){
  this._handlers.GET[url] = handler;
}
const post = function(url,handler){
  this._handlers.POST[url] = handler;
};
const use = function(handler){
  this._preprocess.push(handler);
};
const postProcess = function(handler){
  this._postprocess.push(handler);
};
let urlIsOneOf = function(urls){
  return urls.includes(this.url);
}

const runMiddleware = function(processor,req,res){
  processor.forEach(middleware=>{
    if(res.finished) return;
    middleware(req,res);
  });
  return ;
}

const main = function(req,res){
  res.redirect = redirect.bind(res);
  req.urlIsOneOf = urlIsOneOf.bind(req);
  req.cookies = parse(req.headers.cookie||'','; ','=');
  let content="";
  req.on('data',data=>content+=data.toString())
  req.on('end',()=>{
    req.body = parse(content);
    content="";
    runMiddleware(this._preprocess,req,res);
    if(res.finished) return;
    invoke.call(this,req,res);
    if(res.finished) return;
    runMiddleware(this._postprocess,req,res);
    if (!res.finished)
    resourceNotFound(req,res);
  });
};

const resourceNotFound = function(req,res){
  res.statusCode = 404;
  res.setHeader('Content-Type','text/plain');
  res.write('File Not Found');
  res.end();
}

let create = ()=>{
  let rh = (req,res)=>{
    main.call(rh,req,res)
  };
  initialize.call(rh);
  rh.get = get;
  rh.post = post;
  rh.use = use;
  rh.postProcess = postProcess;
  return rh;
}
exports.create = create;
