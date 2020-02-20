// page/group/creatGroup.js
const app = getApp(); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grouplist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getGroupList();
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

  creatGroup:function(){
    app.data.userInfo["flag"] = 0;
    wx.showLoading({
      title: '创建队伍中',
    })
    wx.cloud.callFunction({
      name: 'creatGroup',
      data: {
        tid: app.getTeamId(),
        gameType:"run",
        userInfo:app.data.userInfo
      },
      success: res => {
        wx.hideLoading();
        console.log('[云函数] [creatGroup] ', res.result)
        if (res.result.errMsg == "collection.add:ok") {
          wx.redirectTo({
            url: './group?groupId=' + res.result._id + "&type=main",
          })
        }
      },
      fail: err => {
        wx.hideLoading();
        console.error('[云函数] [addAim] 调用失败', err)
      }
    })
  },

  addGroup:function(e){
    app.data.userInfo["flag"] = 0;
    wx.cloud.callFunction({
      name: 'addGroupUser',
      data: {
        tid: app.getTeamId(),
        groupId: e.target.dataset.id,
        userInfo: app.data.userInfo
      },
      success: res => {
        console.log('[云函数] [addGroup] ', res.result)
        if (res.result.errMsg == "collection.add:ok") {
          wx.redirectTo({
            url: './group?groupId=' + e.target.dataset.id+"&type=add",
          })
        }
      },
      fail: err => {
        console.error('[云函数] [addAim] 调用失败', err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  getGroupList:function(){
    wx.cloud.callFunction({
      name: 'getGroupList',
      data: {
        tid: app.getTeamId(),
      },
      success: res => {
        console.log('[云函数] [getGroupList] ', res.result)
        this.setData({
          grouplist: res.result.data
        })
      },
      fail: err => {
        console.error('[云函数] [addAim] 调用失败', err)
      }
    })
  },

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
    console.log("下拉")
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