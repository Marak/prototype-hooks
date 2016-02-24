module['exports'] = function bindHooks (Resource) {

  var arrObj = Object.getOwnPropertyNames(Resource.prototype);
  for ( var funcKey in arrObj ) {
     // console.log(arrObj[funcKey], Resource.prototype[arrObj[funcKey]]);
     var og = Resource.prototype[arrObj[funcKey]];
     var localMethod = arrObj[funcKey]; 
     (function(og, localMethod){
       Resource.prototype[localMethod] = function _wrap () {
         var args = Array.prototype.slice.call(arguments);
         // todo: beforeAll hooks
         var self = this;
         beforeHooks(Resource.prototype[localMethod], args[0], function(){
           var _cb = args[1];
           og.call(self, args[0], function (err, d) {
             afterHooks(Resource.prototype[localMethod], d, args[1]);
           })
         })
       }
     })(og, localMethod);
     Resource.prototype[localMethod].before = [];
     Resource.prototype[localMethod].after = [];
  }

  Resource.prototype.methods = {};

  Resource.prototype.before = function (localMethod, cb) {
    Resource.prototype[localMethod].before.unshift(cb);
  };

  Resource.prototype.after = function (localMethod, cb) {
    Resource.prototype[localMethod].after.push(cb);
  };

  return Resource;
};

function beforeHooks(fn, data, cb) {
  var hooks;
  var self = this;
  if (Array.isArray(fn.before) && fn.before.length > 0) {
    hooks = fn.before.slice();
    function iter() {
      var hook = hooks.pop();
      hook.call(self, data, function (err, r) {
        if (err) {
          return cb(err);
        }
        data = r;
        if (hooks.length > 0) {
          iter();
        }
        else {
          cb(null, data[0]);
        }
      });
    }
    iter();
  }
  else {
    return cb(null);
  }
}

function afterHooks(fn, data, cb) {
  cb = cb || function noop(){};
  var hooks;
  if (Array.isArray(fn.after) && fn.after.length > 0) {
    hooks = fn.after.slice();
    function iter() {
      var hook = hooks.shift();
      hook(data, function (err, d) {
        if (err) {
          return cb(err);
        }
        data = d;
        if (hooks.length > 0) {
          iter();
        }
        else {
          return cb(null, data);
        }
      });
    }
    iter();
  }
  else {
    cb(null, data);
  }
}