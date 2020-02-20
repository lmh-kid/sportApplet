// page/run/ballGame.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 117.0587146300,
    latitude: 39.2387682200, 
    loadingMap: false,
    pause: "",  //跑步暂停
    number: 3,    // 开始动画
    showDialog: false,
    polygon: [{
      points: [
      ],
      strokeColor: "#18bc93",
      fillColor:"#18bc93",
      strokeWidth: 2,
    }  
    ],

    //绘制页面数据
    showGrade: "0",  //分数
    showUseTime: "00:00:00", //所用时间
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
    });
    this.getL = setInterval(res=>{
      wx.getLocation({
        type: 'gcj02',
        success: res => {
          if (getDistance(res.latitude, res.longitude, this.data.latitude, this.data.longitude)>500){
            clearInterval(this.getL)
            wx.showModal({
              title: '运动状态异常',
              content: "检测到您的运动状态异常，已停止本次运动",
              confirmText: "结束",
              cancelText: "返回",
              success: res => {
                if (res.confirm) {
                  wx.switchTab({
                    url: '../my/myCenter',
                  })
                } else {
                  wx.switchTab({
                    url: '../my/myCenter',
                  })
                }
              }
            });
          }
          this.setData({
            latitude: res.latitude,
            longitude: res.longitude
          })
        }
      });
    },30000);
    
    this.time = {
      hours: 0,
      minutes: 0,
      second: 0,
    }
    this.getBallPlace();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 计秒
    let numberFlag = setInterval(res => {
      this.data.number -= 1;

      if (this.data.number == 0) {
        this.setData({
          loadingMap: true
        })
        clearInterval(numberFlag);
        this.startRun();
      } else {
        this.setData({
          number: this.data.number
        })
      }
    }, 1000);

  },

  // 获取球场信息列表
  getBallPlace:function(){

  },

  // 开始运动
  startRun: function () {
    // 时间计数器
    this.timeOut = setInterval(res => {
      this.time.second++;
      if (this.time.second >= 60) {
        this.time.second -= 60
        this.time.minutes += 1;
        if (this.time.minutes >= 60) {
          this.time.minutes -= 60
          this.time.hours += 1;
        }
      }
      // 显示时间

      if (this.time.hours < 10) {
        this.data.showUseTime = "0" + this.time.hours + ":";
      } else {
        this.data.showUseTime = this.time.hours + ":";
      }
      if (this.time.minutes < 10) {
        this.data.showUseTime += "0" + this.time.minutes + ":";
      } else {
        this.data.showUseTime += this.time.minutes + ":";
      }
      if (this.time.second < 10) {
        this.data.showUseTime += "0" + this.time.second;
      } else {
        this.data.showUseTime += this.time.second;
      }
      let allSecond = this.time.hours * 3600 + this.time.minutes * 60 + this.time.second;
      let speed = this.data.mileage / allSecond
      // 放置数据
      this.setData({
        showUseTime: this.data.showUseTime,
        showGrade: parseInt(this.time.hours * 2 + this.time.minutes/30)
      })

    }, 1000);
  },

  // 是否结束
  pauseRun: function () {

    // 暂停计数器
    clearInterval(this.timeOut);
    clearInterval(this.getL)
    
    // 弹出结束提醒
    wx.showModal({
      title: '结束运动',
      content: "您是否要结束当前运动",
      confirmText: "结束",
      cancelText: "取消",
      success: res => {
        if (res.confirm) {
          console.log('用户点击主操作')
          wx.showLoading({
            title: '上传数据中',
          });
          // 进行上传数据操作
          wx.cloud.callFunction({
            name: 'addHistory',
            data: {
              sportType: "ball",
              grade: this.data.showGrade
            },
            success: res => {
              console.log('[云函数] [addHistory] ', res.result)
              if (res.result.errMsg == "collection.add:ok") {
                this.openDialog();
                wx.hideLoading();
              } else {
                wx.hideLoading();
                wx.showToast({
                  title: '上传失败!',
                  icon: 'none',
                  duration: 3000
                });
              }
            },
            fail: err => {
              wx.hideLoading();
              wx.showToast({
                title: '上传失败!',
                icon: 'none',
                duration: 3000
              });
            }
          })

        } else {
          this.startRun();
        }
      }
    });
  },


  // 打开结束
  openDialog: function () {
    this.setData({
      istrue: true
    })
  },
  // 确认结束
  closeDialog: function () {
    this.setData({
      istrue: false
    })
    wx.switchTab({
      url: '../my/myCenter',
    })
  }
})

// 计算距离
function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s * 1000;
}