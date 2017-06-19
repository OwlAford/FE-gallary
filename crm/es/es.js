const a = {
  foo: 'hello'
}

const fn = () => console.log('foo')

const { c, d } = { c: 1, d: 2 }

const b = Object.assign({}, a, {
  bar: 'world',
  fn
})

console.log(b)
console.log(c)
console.log(d)