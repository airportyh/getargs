var getArgs = require('./index')

function ajax(url, opts, callback){
  var args = getArgs(arguments, 
    'url:string,[opts]:object,[callback]:function')
  console.log(JSON.stringify(args, null, '  '))
}

ajax()
ajax('/submit')
ajax('/submit', {method: 'POST', params: {foo: 'bar'}}, function(dat){

})