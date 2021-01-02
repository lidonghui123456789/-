
import express from "express"
import config from './config'
import fs from 'fs'
import path from 'path'
import nunjucks from 'nunjucks'
import advertRouter from './router/advert'
import indexRouter from './router/index'
import queryString from 'querystring'
import bodyParser from './middlewares/body-parser.js'
import errLog from './middlewares/error-log.js'


const app = express()

app.use('/node_modules', express.static(config.node_modules_path))
app.use('/public', express.static(config.public_path))
app.use('/demo/upload', express.static(config.uploadDir))

// 使用ejs模板引擎渲染页面
// app.set('views', config.viewPath)
// app.set('view engine', 'ejs')

// app.get('/', (req, res) => {
// 	res.render('index')
// })

// app.use('/public', stat(path.join(__dirname, 'public')))
// // 封装读取静态文件方法
// function stat(dirPath) {
// 	return (req, res, next) => {
// 		const filePath = path.join(dirPath, req.path)
// 		fs.readFile(filePath, (err, date) => {
// 			if (err) {
// 				return res.end('404 Not Found..')
// 			}
// 			res.end(date)
// 		})
// 	}
// }

// app.get('/a', function aaa(req, res, next) {
// 	try {
// 		const data = JSON.parse('{asd')
//         res.json(date)
// 	} catch {
// 		next(e)
// 	}
// })

// 这个中间件就是用来全局统一处理错误的
// app.use((err, req, res, next) => {
// 	const error_log = `
// =========================
// 错误名: ${err.name} 
// 错误消息: ${err.message}
// 错误堆栈: ${err.stack}
// 错误时间: ${new Date()}
// ==========================\n\n\n
// 	`
// 	fs.appendFile('./err_log.txt', error_log, err => {
// 		res.writeHead(500, {})
// 		res.end('500 服务器正忙, 请稍后重试')
// 	})
// })

// 使用nunjucks模板引擎渲染
// nunjucks 模板引擎没有对模板文件名的后缀做特定限制
// 如果文件名是a.html 则渲染的时候就需要传递a.html
// 如果文件名是a.nujs 则传递b.nujs
// nunjucks 模板引擎默认会缓存输出文件，所以每次修改完代码就重新启动，
// 这里为了开发方便，所以把缓存禁用掉，可以看到模板文件修改实时的变化 noCache: true
nunjucks.configure(config.viewPath, {
	autoescape: true,
	express: app,
	noCache: true
})

// 挂载解析表单POST请求体中间件
app.use(bodyParser)

// 挂载路由容器
app.use(advertRouter)
app.use(indexRouter)

app.use(errLog)
// app.use((req, res, next) => {
// 	res.end('404')
// })
app.listen(3000, () => {
	console.log("server is running at port 3000...")
})