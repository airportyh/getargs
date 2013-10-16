var is = {
  'string': function(s){ return typeof s === 'string' },
  'function': function(f){ return typeof f === 'function' },
  'number': function(f){ return typeof f === 'number' },
  'array': Array.isArray || function(a){ return a instanceof Array },
  'object': function(o){ return typeof o === 'object' && o != null },
  'boolean': function(b){ return typeof b === 'boolean' }
}

function ArgSpec(str){
  var ret
  str = str.trim()
  var parts = str.split(':')
  if (parts.length > 1){
    ret = {
      name: parts[0],
      type: parts[1].split('|')
    }
  }else if (parts.length === 1){
    ret = {
      name: str
    }
  }else{
    throw new Error('Expected arg spec to be format name or name:type but was ' + str)
  }
  var m
  if (m = ret.name.match(/^\[(.+)\]$/)){
    ret.name = m[1]
    ret.optional = true
  }
  if (m = ret.name.match(/^\.\.\.(.+)$/)){
    ret.name = m[1]
    ret.spread = true
  }
  return ret
}

function typeMatches(spec, arg) {
  if (!spec.type) return true

  var match = false;

  var type = null;
  for (var i = 0; i<spec.type.length; i++ ) {
    type = spec.type[i];
    var fun = is[type.toLowerCase()]    
    if (!fun) {
      throw new Error('Unknown type: ' + spec.type)
    }    
    match = fun(arg);
    if (match) break;
  }
  
  return match;
}

module.exports = function getArgs(spec, args, target){
  var ret = target || {}
  spec = spec.split(',').map(function(s){
    s = ArgSpec(s);
    return s;
  })
  var minExpected = spec.filter(function(s){
    return !s.optional
  }).length
  var maxExpected = spec.length
  var argIdxOffset = 0
  var length = Math.max(spec.length, args.length)
  for (var i = 0; i < length; i++){
    var sp = spec[i]
    var argIdx = i + argIdxOffset
    if (argIdx >= args.length){
      if (argIdx < minExpected){
        throw new Error(
          'Not enough arguments, expected ' +
          minExpected + ', got ' + argIdx)
      }
      break
    }
    if (argIdx >= maxExpected){
      throw new Error('Too many arguments, expected ' + 
        maxExpected + ', got ' + (argIdx + 1))
    }
    var arg = args[argIdx]
    if (typeMatches(sp, arg)){
      if (sp.spread){
        ret[sp.name] = Array.prototype.slice.call(args, argIdx)
        break
      }else{
        ret[sp.name] = arg
      }
    }else if (sp.optional){
      argIdxOffset--
    }else{
      throw new Error('Expected ' + sp.name + 
        '(pos ' + i + ') to be a ' + sp.type.join(' or '))
    }
  }
  return ret
}
