getargs
=======

Simple utility for parsing/processing variable length argument lists for Javascript functions; also verifies argument types and argument list length.

## Install

Bower - `bower install getargs`; NPM - `npm install getargs`.

## Usage

    var getArgs = require('getargs')

    function ajax(/* url:string|array, [options]:object, callback:function */){
      var args = getArgs('url:string|array, [options]:object, callback:function', arguments)

      console.log('url is', args.url)
      console.log('options is optionally', args.options)
      console.log('callback', args.callback)
    }

## Argument Spec Syntax

The argument spec is a comma delimited string of individual specs, which look like

    argname:type

You can specify multiple types by using |

    argname:type|type|type

* `argname` is the name of the argument, and can be called anything
* `type` is an optional basic Javascript type. Currently these are supported
  * `string`
  * `boolean`
  * `number`
  * `object`
  * `function`
  * `array`

### Optional Arguments

To denote optional arguments, you'd surround `argname` with square brackets `[]`.

### Type Verification

getArgs will throw if the arguments have the wrong types

    var args = getArgs('url:string', [1])
    // Error: Expected url(pos 0) to be a string

### Argument List Length Verification

getArgs will throw if there are too many or too few arguments

    > getArgs('a,b', [1])
    Error: Not enough arguments, expected 2, got 1
    > getArgs('a,b', [1,1])
    { a: 1, b: 1 }
    > getArgs('a,b', [1,1,1])
    Error: Too many arguments, expected 2, got 3

### Spread Operator

You can mimick ES6's spread operator

    var args = getArgs('first,...rest', [1,2,3,4])
    console.log(args.first) // 1
    console.log(args.rest)  // [2,3,4]

### Set properties on an object

If you pass an object as its third argument, it will set the arguments as properties on that object.

    getArgs('a,b,c', arguments, this)
    // Now you can access the arguments by
    // this.a, this.b, and this.c
    
