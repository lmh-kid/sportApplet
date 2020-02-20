// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
const group = db.collection('group')
const guser = db.collection('guser')

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  console.log("开始", event.groupId);

  try {
    let mainUser = await group.where({
      _id: event.groupId
    }).get();

    let otherUser = await guser.where({
      groupId: event.groupId
    }).get();


    let res = Promise.all([mainUser, otherUser])

  
    return res

  } catch (e) {
    return e;
  }
}