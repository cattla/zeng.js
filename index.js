var zeng = {
  emit: function () {
    var params = Array.prototype.slice.call(arguments)
    var name = params[0]
    var args = params.slice(1)
    var arr = []
    args.forEach(function (item) {
      var str = ''
      switch (typeof item) {
        case 'string':
          str = '_string_:' + item
          break
        case 'number':
          str = '_number_:' + item
          break
        case 'object':
          str = '_object_:' + JSON.stringify(item)
          break
        case 'boolean':
          str = '_boolean_:' + (item ? 'true' : 'false')
          break
        case 'undefined':
          str = '_undefined_:undefined'
          break
      }
      arr.push(str)
    })
    window.localStorage.setItem('_zeng_' + name, JSON.stringify(arr))
  },
  on: function (name, fn) {
    window.addEventListener('storage', function (s) {
      if (s.key === '_zeng_' + name) {
        var params = JSON.parse(s.newValue)
        var arr = []
        params.forEach(function (item) {
          var type = item.slice(0, item.indexOf(':'))
          var val = item.slice(item.indexOf(':') + 1)
          switch (type) {
            case '_string_':
              val = val + ''
              break
            case '_number_':
              val = +val
              break
            case '_object_':
              val = JSON.parse(val)
              break
            case '_boolean_':
              val === 'true' ? (val = true) : (val = false)
              break
            case '_undefined_':
              val = undefined
              break
          }
          arr.push(val)
        })
        fn && fn.apply(null, arr)
        window.localStorage.removeItem(s.key)
      }
    }, false)
  }
}
export default zeng