import express from "express"
import Advert from "../models/advert"
import formidable from 'formidable'
import confing from '../config.js'
import { basename } from 'path'

// 创建一个路由容器，将所有的路由中间件挂载给路由容器
const router = express.Router()

router.get('/advert', (req, res, next) => {
	// 分页加载有两种，1 服务端同步刷新渲染，这种方法便于搜索引擎，seo爬虫找到，
	// 一般用到商品，2 客户端异步无刷新渲染ajax方法，不利于爬虫，搜索引擎查到，一般做评论
	// 
	// 整页page 把字符串转换为数值类型的十进制
	const page = Number.parseInt(req.query.page, 10)
	// .skip(2)是跳转第2条数据，不包括第二条数据，.limit(5)查看前5条数据，.exec是结束运行
	const pageSize = 5
	Advert
	.find()
	.skip((page - 1) * pageSize)
	.limit(pageSize)
	.exec((err, adverts) => {
		if (err) {
			return next(err)
		}
		// count可以获取到总的数据记录
		Advert.count((err, count) => {
			if (err) {
				return next(err)
			}
			//Math.ceil()方法是向上取整例如5.2就取6
			const totalPage = Math.ceil(count / pageSize ) //总页面 = 总记录数 / 每页显示大小
			res.render('advert_list.html', {adverts, totalPage, page})
		})
	})
})
router.get('/advert/add', (req, res, next) => {
	res.render('advert_add.html')
})

router.post('/advert/add', (req, res, next) => {
	// 1 接收表单提交的数据
	// const body = req.body
	const form = new formidable.IncomingForm()
   form.uploadDir = './demo/upload' //配置formidable文件上传接收路径
    form.keepExtensions = true //配置保持文件原始的扩展名
    // fields 就是接收到的表单中的普通数据字段
    // files 就是表单中图片或文件上传的一些文件信息，例如文件大小，上传时间
	form.parse(req, (err, fields, files) => {
		if (err) {
			return next(err)
		}
        const body = fields
      
      // 在这里把files中的图片处理一下
      // 就是在body中添加一个 image值就是图片上传来的路径
       // body.image = basename(files.image.path)
    body.image = basename(files.image.path)
       // 2 操作数据库
  const advert = new Advert({
  	title: body.title,
  	image: body.image,
  	link: body.link,
  	start_time: body.start_time,
  	end_time: body.end_time,
  })

  // 添加数据
	advert.save((err, result) => {
		if (err) {
			return next(err)
		}
		res.json({
			err_code: 0
		})
	})
	})
})

// 查询全部内容
router.get('/advert/list', (req, res, next) => {
	Advert.find((err, docs) => {
		if (err) {
			return next(err)
		}
		res.json({
			err_code: 0,
		  result: docs
		})
	})
})
// 根据id查询（/advert/one/:advertId 是一个模糊匹配路径）
// 可以匹配/advert/one/*的路径
// 例如：/advert/one/1  /advert/one/adv
// 但是 /advert/one 或者 /advert/one/1/a是不行的
// 至于 advertId 是自己起的一个名字，可以在处理函数中通过 req.params来进行获取
router.get('/advert/one/:advertId', (req, res, next) => {
	Advert.findById(req.params.advertId, (err, result) => {
		if (err) {
			return next(err)
		}
		res.json({
			err_code: 0,
			result: result
		})
	})
})

// 先查询后更新数据
router.post('/advert/edit', (req, res, next) => {
	Advert.findById(req.body.id, (err, advert) => {
		if (err) {
			return next(err)
		}
		const body = req.body

		advert.title = body.title
    advert.image = body.image
    advert.link = body.link
    advert.start_time = body.start_time
    advert.end_time = body.end_time
    advert.last_modified = Date.now()
// 这里的 save 因为内部有一个 _id 所以这里是不会新增数据的，而是更新已有的数据
    advert.save((err, result) => {
    	if (err) {
    		return next(err)
    	}
    	res.json({
    		err_code: 0
    	})
    })
	})
})

// 删除
router.get('/advert/remove/:advertId', (req, res, next) => {
	Advert.remove({_id: req.params.advertId}, err => {
		if (err) {
			return next(err)
		}
		res.json({
			err_code: 0
		})
	})
})
export default router