// page/place/place.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 场地列表
    placeList:[],   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.data.userInfo);
    wx.cloud.callFunction({
      name: 'getPlace',
      data: {
      },
      success: res => {
        console.log('[云函数] [getPlace] ', res.result)
        if(res.result.errMsg=="collection.get:ok"){

          for(let i in res.result.data){
            res.result.data[i].type = "可预约";
            let userList = res.result.data[i].list.data;
            if(userList.length > 0){
              res.result.data[i].type = "已预约";
            }
          }

          this.setData({
            placeList : res.result.data
          })
        }
      },
      fail: err => {
        console.error('[云函数] [getPlace] 调用失败', err)
      }
    })
  },

  reservePlace:function(e){
    const my = this;
    wx.cloud.callFunction({
      name: 'reservePlace',
      data: {
        placeId:e.currentTarget.dataset.id
      },
      success: res => {
        console.log('[云函数] [reservePlace] ', res.result)
        wx.showToast({
          title: '预约成功',
          icon: 'success',
          duration: 2000,
          success:function(){
            my.onLoad();
          }
        })
      },
      fail: err => {
        console.error('[云函数] [getPlace] 调用失败', err)
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})