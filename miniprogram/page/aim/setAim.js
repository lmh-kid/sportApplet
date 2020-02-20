// page/aim/setAim.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputNumber:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getInputMsg:function(e){
    this.setData({
      inputNumber: e.detail.value
    })
    console.log(this.data.inputNumber);
  },

  showTopTips: function () {
    if (this.data.inputNumber!=""){
      wx.showToast({
        title: '设置中!',
        icon: 'loading',
        duration: 3000,

      });
      wx.cloud.callFunction({
        name: 'addAim',
        data: {
          tid: app.getTeamId(),
          aimNumber: this.data.inputNumber
        },
        success: res => {
          console.log('[云函数] [addAim] ', res.result)
          if (res.result.errMsg == "collection.add:ok"){
            wx.showToast({
              title: '设置成功!',
              icon: 'success',
              duration: 1500,
              complete:function(){
                console.log("返回");
                wx.navigateBack();
              }
            });
          }else{
            wx.showToast({
              title: '设置失败!',
              icon: 'none',
              duration: 3000
            });
          }
        },
        fail: err => {
          wx.showToast({
            title: '设置失败!',
            icon: 'none',
            duration: 3000
          });
        }
      })
    }else{
      wx.showToast({
        title: '请输入目标分数!',
        icon: 'none',
        duration: 3000
      });
    }
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