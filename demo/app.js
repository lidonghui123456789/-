const express = require('express')
const nunjucks = require('nunjucks')
const formidable = require('formidable') 
const fs = require('fs')

const app = express()

// 用nunjucks模板引擎
// nunjucks.configure({autoescape: true, 
//  express: app, noCache: true
// })

// 用ejs模板引擎
app.set('views', 'views')
app.set('view engine', 'ejs')

app.get('/', (req, res, next) => {
	res.render('index')
})

app.post('/', (req, res, next) => {
	const form = new formidable.IncomingForm()

	// 指定上传路径
	form.uploadDir = './upload'
	// 保持原来的扩展名
	form.keepExtensions = true
    // err 就是可能发生的错误对象
    // fields 就是普通的表单字段
    // files 就是文件内容数据信息
	form.parse(req, (err, fields, files) => {
		if (err) {
			throw err
		}
		console.log(files)
		res.end('success')
	})
})

app.listen(3000, () => {
	console.log('running....')
})
