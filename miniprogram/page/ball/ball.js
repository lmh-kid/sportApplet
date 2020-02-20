// page/ball/ball.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 117.0587146300,
    latitude: 39.2387682200, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },
  startRun: function (e) {
    if (app.data.userInfo == null) {
      wx.showModal({
        title: '您还未登录',
        content: '请登录后在进行该操作',
        confirmText: "确定",
        success: function (res) {
          wx.switchTab({
            url: './my/myCenter',
          })
        }
      })
      return;
    }
    // 获取用户地址授权状态
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userLocation']) {
          wx.redirectTo({
            url: "../run/ballGame",
          })
        } else {
          wx.showModal({
            title: '位置授权',
            content: '请授权位置服务，否则部分功能可能无法使用',
            confirmText: "前往授权",
            cancelText: "取消",
            success: function (res) {
              console.log(res);
              if (res.confirm) {
                console.log('用户点击主操作')
                wx.openSetting();
              } else {
                console.log('用户点击辅助操作')
              }
            }
          });
        }
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