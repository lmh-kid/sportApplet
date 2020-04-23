// 云函数入口文件
const cloud = require('wx-server-sdk')


// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const article = db.collection('article');

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  // 第一种情况为添加，第二种为查询
  if(event.title){
    return await article.add({
      // data 字段表示需新增的 JSON 数据
      data: {
        title: event.title,
        body: event.body,
        openid: wxContext.OPENID
      }
    })
  }else{
    return await article.where({
      openid:wxContext.OPENID
    }).get();
  }
}