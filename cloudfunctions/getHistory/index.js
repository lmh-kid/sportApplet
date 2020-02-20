// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const todos = db.collection('history')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  try {

    if(event.historyId){
      return  await todos.where({
        _id: event.historyId
      }).get()
    }else{
      return await todos.where({
        openId: wxContext.OPENID
      }).orderBy('endTime', 'desc').get()
    }


   

  } catch (e) {
    return e;
  }
}