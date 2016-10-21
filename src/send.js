import request from 'request'
const DNSPOD_API_BASE = 'https://dnsapi.cn'

const parseUrl = (url) => {
    return DNSPOD_API_BASE + url
}

export default function send(httpReq, form) {
    let method = httpReq.method.toLowerCase()
    return new Promise((resolve, reject) => {
        try {
            let url = parseUrl(httpReq.url)
            let startTime = new Date().getTime()
            console.log('sending:', url)
            request[method]({url, form}, function(error, resp, body) {
                let headers = resp.headers
                if (!error) {
                    resolve({body, headers})
                } else {
                    reject(error)
                }
                console.log('send success:', url, new Date().getTime() - startTime + 'ms')
            })
        } catch (e) {
            reject(e)
        }
    })
}

