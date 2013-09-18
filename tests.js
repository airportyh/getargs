var getArgs = require('./index')
var assert = require('chai').assert

test('basic', function(){
  var args = [1, 2]
  var result = getArgs('a,b', args)
  assert(result.a === 1)
  assert(result.b === 2)
  assert.deepEqual(result, getArgs('a, b', args))
})

test.skip('not enough throws', function(){
  getArgs('a', [1])
  assert.throws(function(){
    getArgs('a', [])
  })
})

test('ignore extras many', function(){
  var args = [1, 2, 3, 4]
  var result = getArgs('a,b', args)
  assert(result.a === 1)
  assert(result.b === 2)
  assert(Object.keys(result) == 'a,b')
})

test('checks type', function(){
  var result = getArgs('a:string', ['abc'])
  assert(result.a === 'abc')
  assert.throws(function(){
    getArgs('a:string', [1])
  }, 'Expected a(pos 0) to be a string')
  getArgs('a:Array', [[]])
  assert.throws(function(){
    getArgs('a:array', [1])
  }, 'Expected a(pos 0) to be a array')
  getArgs('a:number', [3])
  assert.throws(function(){
    getArgs('a:number', ['a'])
  }, 'Expected a(pos 0) to be a number')
})

test('unknown type', function(){
  assert.throws(function(){
    getArgs('a:blarg', ['abc'])
  }, 'Unknown type: blarg')
})

test('optional by type', function(){
  var result = getArgs(
    '[user]:object,callback:function',
    [{name: 'bobby'}, function(){}])
  assert(result.user.name === 'bobby')
  result = getArgs(
    '[user]:object,callback:function',
    [function(){}])
  assert(result.user === undefined)
  assert(result.callback instanceof Function)
})

test('optional last', function(){
  var result = getArgs('a,[b]', [1])
  assert(result.a === 1)
  assert(result.b === undefined)
})

test('spread operator', function(){
  var result = getArgs('a,...b', [1, 2, 3, 4])
  assert(result.b == '2,3,4')
})

