const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test',{useNewUrlParser: true,
useUnifiedTopology: true
})

// 1 创建一个模型架构，设计数据结构和约束
const studentSchema = new mongoose.Schema({
	name: String,
	age: Number
})

// 2 通过mongoose.model() 将架构发布为一个模型（可以把模型认为是一个构造函数）
//   第一个参数就是给你的集合起一个名字，这个名字最好使用 帕斯卡命名法
//    例如你的集合命名 Students, 则这里就命名Student, 最终mongoose会自动帮你把Student转换为Students
//   第二个参数就是传递一个模型架构 
const Student = mongoose.model('Student', studentSchema)

// 3 通过操作模型去操作你的数据库
// 通过操作模型实例完成对数据库的操作
// 这里是保存实例数据对象
// const s1 = new Student({
// 	name: '回到',
// 	age: 25
// })
// s1.save((err, result) => {
// 	if (err) {
// 		throw err
// 	}
// 	console.log(result)
// })

// 查询
// Student.find((err, docs) => {
// 	if (err) {
// 		throw err
// 	}
// 	console.log(docs)
// })
Student.find({name: "回到"}, (err, docs)=> {
  if (err) {
  	throw err
  }
  console.log(docs)
})