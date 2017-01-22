# prototype-hooks

Adds `before` and `after` hooks to any JavaScript protoype chain.

## Installation

```
npm install --save prototype-hooks
```

## Features

  - Adds `.before()` hook for all existing prototype methods
  - Adds `.after` hook for all existing prototype methods
  - Quickly enables Apsect-oriented Programming [AOP](https://en.wikipedia.org/wiki/Aspect-oriented_programming) patterns for JavaScript

## Example Usage

```
  var hooks = require('protoype-hooks');
 
  var Creature = function (opts) {
    this.name = opts.name;
  };
  
  Creature.prototype.talk = function (data, cb) {
    cb(null, this.name + ' says ' + data.text);
  };
  
  hooks(Creature);
  
  var larry = new Creature({ name: "Larry" });

  larry.before('talk', function(data, next) {
    data.text = data.text + "!";
    next(null, data);
  });

  larry.after('talk', function(text, next) {
    text = text + ' ... ';
    next(null, text);
  });
  
  larry.talk({ text: 'hi'}, function (err, result){
    console.log(err, result);
    // outputs: 'Larry says hi! ... '
  })

```