var rhooks = require('../');

var Creature = function CreatureClass () {
  var self = this;
  return self;
} 

Creature.prototype.talk = function talk (opts, cb) {
  console.log('Creature.prototype.talk', opts);
  opts.text = "-talked-" + opts.text;
  cb(null, opts);
};

rhooks(Creature);

var creature = new Creature ();

creature.before('talk', function (data, next) {
  //console.log('creature.before.talk', data, next);
  data.text = "-before-talk-1" + data.text;
  next(null, data);
});

creature.before('talk', function (data, next) {
  //console.log('creature.before.talk', data, next);
  data.text = "-before-talk-2" + data.text;
  next(null, data);
});

creature.after('talk', function (data, next) {
  //console.log('creature.after.talk', data, 'ccc', next);
  data.text = "-after-talk-0" + data.text;
  next(null, data);
});

creature.after('talk', function (data, next) {
  //console.log('creature.after.talk', data, 'ccc', next);
  data.text = "-after-talk-1" + data.text;
  next(null, data);
});

creature.talk({ text: "hello there!" }, function (err, res){
  console.log(err, res);
});