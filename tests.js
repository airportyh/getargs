var getArgs = require('./index')
var assert = require('chai').assert

test('basic', function(){
  var args = [1, 2]
  var result = getArgs(args, 'a,b')
  assert(result.a === 1)
  assert(result.b === 2)
  assert.deepEqual(result, getArgs(args, 'a, b'))
})

test.skip('not enough throws', function(){
  getArgs([1], 'a')
  assert.throws(function(){
    getArgs([], 'a')
  })
})

test('ignore extras many', function(){
  var args = [1, 2, 3, 4]
  var result = getArgs(args, 'a,b')
  assert(result.a === 1)
  assert(result.b === 2)
  assert(Object.keys(result) == 'a,b')
})

test('checks type', function(){
  var result = getArgs(['abc'], 'a:string')
  assert(result.a === 'abc')
  assert.throws(function(){
    getArgs([1], 'a:string')
  }, 'Expected a(pos 0) to be a string')
  getArgs([[]], 'a:Array')
  assert.throws(function(){
    getArgs([1], 'a:array')
  }, 'Expected a(pos 0) to be a array')
  getArgs([3], 'a:number')
  assert.throws(function(){
    getArgs(['a'], 'a:number')
  })
})

test('unknown type', function(){
  assert.throws(function(){
    getArgs(['abc'], 'a:blarg')
  }, 'Unknown type: blarg')
})

test('optional by type', function(){
  var result = getArgs([{name: 'bobby'}, function(){}], 
    '[user]:object,callback:function')
  assert(result.user.name === 'bobby')
  result = getArgs([function(){}], 
    '[user]:object,callback:function')
  assert(result.user === undefined)
  assert(result.callback instanceof Function)
})

test('optional last', function(){
  var result = getArgs([1], 'a,[b]')
  assert(result.a === 1)
  assert(result.b === undefined)
})

test('spread operator', function(){
  var result = getArgs([1, 2, 3, 4], 'a,...b')
  assert(result.b == '2,3,4')
})

