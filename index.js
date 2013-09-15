var is = require('is-type')

function ArgSpec(str){
  var ret
  str = str.trim()
  var parts = str.split(':')
  if (parts.length > 1){
    ret = {
      name: parts[0],
      type: parts[1]
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

function typeMatches(spec, arg){
  if (!spec.type) return true
  var fun = is[spec.type.toLowerCase()]
  if (!fun){
    throw new Error('Unknown type: ' + spec.type)
  }
  return fun(arg)
}

module.exports = function getArgs(args, spec){
  var ret = {}
  spec = spec.split(',').map(function(s){
    return ArgSpec(s)
  })
  var argIdxOffset = 0
  for (var i = 0; i < spec.length; i++){
    var sp = spec[i]
    var argIdx = i + argIdxOffset
    if (argIdx >= args.length){
      break
    }
    var arg = args[argIdx]
    if (typeMatches(sp, arg)){
      if (sp.spread){
        ret[sp.name] = Array.prototype.slice.call(args, i)
        break
      }else{
        ret[sp.name] = arg
      }
    }else if (sp.optional){
      argIdxOffset--
    }else{
      throw new Error('Expected ' + sp.name + 
        '(pos ' + i + ') to be a ' + sp.type)
    }
  }
  return ret
}