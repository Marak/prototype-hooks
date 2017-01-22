var test = require("tap").test, hooks, Creature, larry;

test("load the prototype-hooks module", function (t) {
  hooks = require('../');
  t.equal(typeof hooks, 'function', 'required hooks object')
  t.pass('loaded prototype-hooks module');
  t.end();
});

test("apply hooks to prototype of existing class", function (t) {
  
  Creature = function (opts) {
    this.name = opts.name;
  };
  
  Creature.prototype.talk = function (data, cb) {
    cb(null, this.name + ' says ' + data.text);
  };

  Creature.prototype.errTalk = function (data, cb) {
    cb(new Error('talking error'));
  };


  hooks(Creature);

  t.equal(typeof Creature.prototype.before, 'function', 'found new Creature.prototype.before function');
  t.equal(typeof Creature.prototype.after, 'function', 'found new Creature.prototype.after function');

  t.equal(Array.isArray(Creature.prototype.talk.before), true, 'found before array');
  t.equal(Array.isArray(Creature.prototype.talk.after), true, 'found after array');

  t.equal(Creature.prototype.talk.before.length, 0, 'no items in before array');
  t.equal(Creature.prototype.talk.after.length, 0, 'no items in after array');

  t.pass('applied hooks to prototype');
  t.end();

});


test("attempt to add before and after hooks to Creature.talk", function (t) {

  larry = new Creature({ name: "Larry" });

  larry.before('talk', function(data, next) {
    data.text = data.text + "!";
    next(null, data);
  });

  larry.after('talk', function(text, next) {
    text = text + ' ... ';
    next(null, text);
  });
  
  t.equal(larry.talk.before.length, 1, '1 item in before array');
  t.equal(larry.talk.after.length, 1, '1 item in after array');
  t.end();
  
});

test("attempt to fire talk with basic before and after hooks", function (t) {

  larry.talk({ text: 'hi'}, function (err, result){
    t.error(err, 'did not error');
    t.equal(result, 'Larry says hi! ... ');
    t.pass('fired talk method');
    t.end();
  })
  
});

test("attempt to add error returning before hooks to Creature.talk", function (t) {

  larry.before('talk', function(data, next) {
    next(new Error('forced before error'));
  });
  
  larry.talk({ text: 'hi'}, function (err, result){
    console.log('eee', err, result)
    t.equal(typeof err, 'object', 'found error object');
    t.equal(err.message, 'forced before error');
    t.pass('errored on talk method');
    t.end();
  })
  
  
});

test("attempt to add error returning after hooks to Creature.talk", function (t) {

  var david = new Creature({ name: "David" });
  
  david.after('talk', function(text, next) {
    next(new Error(text.message + ' forced after error'));
  });
  
  
  david.talk({ text: 'hi'}, function (err, result){
    console.log('eee', err, result)
    t.equal(typeof err, 'object', 'found error object');
    t.equal(err.message, 'forced before error');
    t.pass('errored on talk method');
    t.end();
  })
  
});


test("return an in error in Creature.talk", function (t) {

  
  larry.after('talk', function(text, next) {
    next(new Error(text.message + ' forced after error'));
  });
  
  
  larry.errTalk({ text: 'hi'}, function (err, result){
    t.equal(typeof err, 'object', 'found error object');
    t.equal(err.message, 'talking error');
    t.pass('errored on talk method');
    t.end();
  })
  
  
});

