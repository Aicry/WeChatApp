// let baseUrl = `https://wxapp.geekreading.cn/api/`;
let baseUrl = `http://192.168.1.112:8000/`;

function getHeader() {
    if (wx.getStorageSync('Token')) {
        return {
            'content-type': 'application/json',
            'token': wx.getStorageSync('Token')
        }
    } else {
        return {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'

          //  'content-type': 'application/json'
        }
    }
}

function getPromise(url, data, method) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${baseUrl}${url}`,
            header: getHeader(),
            method: method,
            data: data,
            success: function(res) {
                resolve(res)
            },
            fail: function(err) {
                reject(err)
            }
        })
    })
}
const http = {
    get: function(url, data = {}) {
        return getPromise(url, data, 'GET')
    },
    post: function(url, data = {}) {
        return getPromise(url, data, 'POST')
    },
    put: function(url, data = {}) {
        return getPromise(url, data, 'PUT')
    },
    delete: function(url, data = {}) {
        return getPromise(url, data, 'DELETE')
    }
}

export default http;