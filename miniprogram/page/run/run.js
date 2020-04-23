// page/run/run.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 117.0587146300,
    latitude: 39.2387682200, 
    loadingMap:false,
    pause:"",  //跑步暂停
    number:3,
    showDialog: false,
    polyline: [{
      points: [
        
      ],
      color: "#18bc93",
      width: 2,
    }],
    //绘制页面数据
    mileage:0.00, //已跑里程
    showMileage:"0.00",
    speed:"0",  //速度
    showGrade:"0",  //分数
    showUseTime:"00:00:00", //所用时间
    nowType:true,  // 状态是否显示i，修复结束按钮挡住弹出框问题
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
    console.log("进入跑步地图" , options)
    if(options.groupId){
      this.groupId = options.groupId;
      this.type = options.type;
    }
    this.time = {
      hours:0,
      minutes:0,
      second:0,
    }
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
  // 开始运动
  startRun:function(){
    // 位置距离计数器
    this.data.pruse = setInterval(res=>{
      wx.getLocation({
        type: 'gcj02',
        success: res => {
          this.data.polyline[0].points.push({
            longitude: res.longitude,
            latitude: res.latitude
          })
          let array = this.data.polyline[0].points;
          let mileage = 0;
          if(array.length>=2){
            mileage = getDistance(array[array.length - 2].latitude, array[array.length - 2].longitude, res.latitude, res.longitude)
          }
          this.data.mileage = parseFloat(this.data.mileage) + parseFloat(mileage);
          console.log("总里程：", this.data.mileage, "两点距离：", mileage);
          this.setData({
            polyline: this.data.polyline,
            showMileage: (this.data.mileage/1000).toFixed(2)
          })
        }
      })
    },3000);
    
    // 时间计数器
    this.timeOut = setInterval(res =>{
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
      
      if (this.time.hours<10){
        this.data.showUseTime = "0" + this.time.hours+":";
      }else{
        this.data.showUseTime = this.time.hours+":";
      }
      if (this.time.minutes < 10) {
        this.data.showUseTime += "0" + this.time.minutes + ":";
      } else {
        this.data.showUseTime += this.time.minutes + ":";
      }
      if (this.time.second < 10) {
        this.data.showUseTime += "0" + this.time.second ;
      } else {
        this.data.showUseTime += this.time.second;
      }
      let allSecond = this.time.hours * 3600 + this.time.minutes * 60 + this.time.second;
      let speed = this.data.mileage / allSecond
      // 放置数据
      this.setData({
        showUseTime: this.data.showUseTime,
        speed:speed.toFixed(2),
        showGrade: parseInt(this.data.showMileage/2)
      })

    },1000);
  },
  // 是否结束
  pauseRun:function(){

    // 暂停计数器
    clearInterval(this.data.pruse);
    clearInterval(this.timeOut);

    // 弹出结束提醒
    wx.showModal({
      title: '结束运动',
      content:"您是否要结束当前运动",
      confirmText: "结束",
      cancelText: "取消",
      success: res=> {
        if (res.confirm) {
          console.log('用户点击主操作')
          wx.showLoading({
            title: '上传数据中',
          });
          // 进行上传数据操作
          wx.cloud.callFunction({
            name: 'addHistory',
            data: {
              sportType: this.groupId?"grun":"run",
              tid: app.getTeamId(),
              grade: this.data.showGrade,
              locationArray: this.data.polyline[0].points
            },
            success: res => {
              console.log('[云函数] [addHistory] ', res.result)
              if (res.result.errMsg == "collection.add:ok") {
                if(this.groupId){
                  if(this.type == "add"){
                    wx.cloud.callFunction({
                      name: 'updateUsers',
                      data: {
                        groupId: this.groupId,
                        historyId: res.result._id,
                        flag: 2
                      },
                      success: res => {
                        this.setData({
                          nowType:false
                        });
                        this.openDialog();
                      }
                    });
                  }else{
                    wx.cloud.callFunction({
                      name: 'updateCaptain',
                      data: {
                        groupId:this.groupId,
                        historyId: res.result._id,
                        flag:2
                      },
                      success: res => {
                        this.setData({
                          nowType:false
                        });
                        this.openDialog();
                      }
                    });
                  }
                }else{
                  this.setData({
                    nowType:false
                  });
                  this.openDialog();
                }
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


  // 结束
  openDialog: function () {
    this.setData({
      istrue: true
    })
  },

  closeDialog:function(){
    this.setData({
      istrue: false
    })
    if (this.groupId) {
      wx.redirectTo({
        url: '../groupRes/groupRes?groupId=' + this.groupId + "&type=" + this.type,
      })
    } else {
      wx.switchTab({
        url: '../my/myCenter',
      })
    }
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