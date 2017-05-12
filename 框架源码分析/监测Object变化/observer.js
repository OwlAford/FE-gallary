class Observer {
  constructor (obj, cb) {
    if (Object.prototype.toString.call(obj) !== '[object Object]') {
      throw Error('The parameter sholud be an object')
    }
    this.cb = cb
    this.observe(obj)
  }

  observe (obj, path) {
    if (Object.prototype.toString.call(obj) === '[object Array]') {
      this.overrideArrayProto(obj, path)
    }

    Object.keys(obj).forEach(key => {
      let oldVal = obj[key]
      let pathArr = path && path.slice(0)
      pathArr ? pathArr.push(key) : pathArr = [key]

      Object.defineProperty(obj, key, {
        get: () => oldVal,
        set: newVal => {
          if (oldVal !== newVal) {
            let newValType = Object.prototype.toString.call(newVal)
            if (newValType === '[object Object]' ||  newValType === '[object Array]') {
              this.observe(newVal, pathArr)
            }
            this.cb(newVal, oldVal, pathArr)
            oldVal = newVal
          }
        }
      })

      let subObjType = Object.prototype.toString.call(obj[key])
      if (subObjType === '[object Object]' || subObjType === '[object Array]') {
        this.observe(obj[key], pathArr)
      }
    })
  }

  overrideArrayProto (array, path) {
    let originProto = Array.prototype
    let overrideProto = Object.create(Array.prototype)
    let self = this
    let result

    ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
      let oldArray = []
      Object.defineProperty(overrideProto, method, {
        value: function () {
          oldArray = this.slice(0)
          let arg = [].slice.apply(arguments)
          result = originProto[method].apply(this, arg)
          self.observe(this, path)
          self.cb(this, oldArray, path)
          return result
        },
        writable: true,
        enumerable: false,
        configurable: true
      })
    })
    array.__proto__ = overrideProto
  }

}

let data = {
  foo: 'I\'m Jim',
  bar: {
    arr: ['a', 'b', 'c'],
    name: 'bar'
  }
}

new Observer(data, function (newVal, oldVal, path) {
  console.log(newVal, oldVal, path)
})
