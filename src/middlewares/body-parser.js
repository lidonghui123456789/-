// 将字符串转成对象。说白了其实就是把url上带的参数串转成数组对象
import queryString from 'querystring'

export default(req, res, next) => {
	// req.headers 可以拿到当前请求的请求报文头信息
	//  toLowerCase()方法把字符中的所有字母全部转换为小写
	if (req.method.toLowerCase() === 'get') {
		return next() 
	}
	// 如果是普通表单POST,则咱们自己处理 application/x-www-form-urlencoded
	// 如果是有文件的表单POST，则咱们不处理
	if (req.headers['content-type'].startsWith('multipart/form-data')) {
      return next()
	}	
	let data = ''
	req.on('data', chunk => {
		data += chunk
	})
	req.on('end', () => {
		// 将字符串转成对象。说白了其实就是把url上带的参数串转成数组对象
		req.body = queryString.parse(data)
		next()
	})
}