// page/article/writeArticle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    body:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  setTitle:function(e){
    this.setData({
      title:e.detail.value
    })
  },
  setBody:function(e){
    this.setData({
      body:e.detail.value
    })
  },
  addArticle:function(){
    wx.cloud.callFunction({
      name: 'article',
      data: {
        title:this.data.title,
        body:this.data.body
      },
      success: res => {
        console.log('[云函数] [article] ', res.result)
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000,
          success:function(){
            wx.navigateBack({
              url:'./article'
            })
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