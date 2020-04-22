// 云函数入口文件
const cloud = require('wx-server-sdk')

// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
const place = db.collection('place');
const reservePlace = db.collection('reservePlace');


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  let places = place.where({}).get();
  // let 

  return places;
}