var getArgs = require('./index')

function ajax(url, opts, callback){
  var args = getArgs(
    'url:string|array,[opts]:object,[callback]:function',
    arguments)
  console.log(JSON.stringify(args, null, '  '))
}

ajax()
ajax('/submit')
ajax(['/submit'])
ajax('/submit', {method: 'POST', params: {foo: 'bar'}}, function(dat){

})
