import 'babel-polyfill'
import 'isomorphic-fetch'

console.log('hello world!')

const reqURL = `http://${window.location.host}/inmanage/IM01005.do`

const date = new Date()
let params = {
  headers: {
    type: 'K',
    'Accept': 'application/json',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    encry: '0',
    channel: 'AT',
    // transId: '',
    // channelFlow: '',
    // transCode: 'IM01005',
    // channelDate: `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`,
    // channelTime: `${date.getHours()}${date.getMinutes()}${date.getSeconds()}`,
    // iCIFID: '',
    // eCIFID: ''
  },
  dataType: 'JSON',
  method: 'post',
  crossDomain: true
}

const doRequest = (url, req) => {
  return fetch(url, req).then(response => response.json().then(json => ({ json, response })))
    .then(({ json, response }) => {
      if (!response.ok) {
        return Promise.reject(json)
      }
      return json
  })
}

doRequest(reqURL, params).then(json => {
  console.log(json)
}).catch(json => {
  alert('请求失败！')
})
