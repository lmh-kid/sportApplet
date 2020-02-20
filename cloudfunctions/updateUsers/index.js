// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const _ = db.command
const todo = db.collection('guser')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  try {
    return await todo.where({
      groupId: event.groupId,
      openId: wxContext.OPENID
    }).update({
      data: {
        "userInfo.history": event.history,
        "userInfo.flag": event.flag
      },
    })

  } catch (e) {
    return e;
  }
}