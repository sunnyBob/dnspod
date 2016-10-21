import 'babel-polyfill'
import Koa from 'koa'
import serve from 'koa-static'
import convert from 'koa-convert'
import bodyParser from 'koa-bodyparser'
import send from './send'

const app = new Koa()


app.use(convert(serve('static')))

app.use(bodyParser())

app.use(async (ctx, next) => {
    try {
        let resp = await send(ctx.req, ctx.request.body)
        for (let key in resp.headers) {
            ctx.set(key, resp.headers[key])
        }
        ctx.body = resp.body
    } catch (e) {
        ctx.body = e
    }
})

//catch uncaughtException
process.on ('uncaughtException', function(err){ 
    console.log('uncaughtException: '+err)
})

app.listen(8088)

