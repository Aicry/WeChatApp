import http from '../../utils/api.js';
import util from '../../utils/util.js'
let QQMapWX = require('../../libs/qqmap-wx-jssdk')
let qqmapsdk;
var app=getApp();
Page({
  
   /**
     * 页面的初始数据
     */
    data: {
        msg:'',
        userInfo:{},//接收用户信息，最后放到页面中显示
        province: '',
        city: '',
        latitude: '',
        longitude: '',
        total: 0,
        loc:'',
        disabled: true,
        locationStatusList: ["是", "否"],
        regionList: [],
        temList:["低于36℃","36~37.3℃","37.3~38℃","38℃以上"],
        statusList: ["正常", "密切接触者", "新冠感染患者", "医学隔离观察"],
        symptomList: ["正常", "发热", "干咳", "乏力", "其他症状"],
      
    },
    
     
    
      onLoad: function () {
        var userName = app.globalData.userId; 
        console.log(userName);
        qqmapsdk = new QQMapWX({
          key: '5XGBZ-YKSLX-ACG4J-TWH3A-EEMU6-43FXE' //这里自己的key秘钥进行填充
        });
       
      },

  

      getUserLocation: function () {
        let vm = this;
        wx.getSetting({
          success: (res) => {
            console.log(JSON.stringify(res))
            // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
            // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
            // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
            if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
              wx.showModal({
                title: '请求授权当前位置',
                content: '需要获取您的地理位置，请确认授权',
                success: function (res) {
                  if (res.cancel) {
                    wx.showToast({
                      title: '拒绝授权',
                      icon: 'none',
                      duration: 1000
                    })
                  } else if (res.confirm) {
                    wx.openSetting({
                      success: function (dataAu) {
                        if (dataAu.authSetting["scope.userLocation"] == true) {
                          wx.showToast({
                            title: '授权成功',
                            icon: 'success',
                            duration: 1000
                          })
                          //再次授权，调用wx.getLocation的API
                          vm.getLocation();
                        } else {
                          wx.showToast({
                            title: '授权失败',
                            icon: 'none',
                            duration: 1000
                          })
                        }
                      }
                    })
                  }
                }
              })
            } else if (res.authSetting['scope.userLocation'] == undefined) {
              //调用wx.getLocation的API
              vm.getLocation();
            }
            else {
              //调用wx.getLocation的API
              vm.getLocation();
            }
          }
        })
      },
      // 微信获得经纬度
      getLocation: function () {
        let vm = this;
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            console.log(JSON.stringify(res))
            var latitude = res.latitude
            var longitude = res.longitude
            var speed = res.speed
            var accuracy = res.accuracy;
            vm.getLocal(latitude, longitude)
          },
          fail: function (res) {
            console.log('fail' + JSON.stringify(res))
          }
        })
      },
      // 获取当前地理位置
      getLocal: function (latitude, longitude) {
        let vm = this;
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(JSON.stringify(res));
            let province = res.result.ad_info.province
            let city = res.result.ad_info.city

            vm.setData({
              province: province,
              city: city,
              latitude: latitude,
              longitude: longitude,
              loc:res.result.address,
            })
     
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            // console.log(res);
          }
        });
      },
    



    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        let modelInfo = wx.getSystemInfoSync();
        let menuInfo = wx.getMenuButtonBoundingClientRect();
        let top = menuInfo.top;
        let left = modelInfo.windowWidth - menuInfo.right;
        this.setData({
            header_style: `margin-top:${top}px;height:${menuInfo.height}px`
        })
    },

    bindPickerLocation(e) {

        this.setData({
            atSchool: this.data.locationStatusList[Number(e.detail.value)]
        })
    },
    temChange(e){
        this.setData({
            tem: this.data.temList[Number(e.detail.value)]
        })
    },
    
    
    radioStatusChange(e) {
        // console.log(e.detail.value)
    },

    checkedSymptom(e) {
        // console.log(e.detail.value)
    },

    

    checkedTerms(e) {
        this.setData({
            disabled: !e.detail.value.length
        })
    },

    formSubmit: function(e) {
        let {
            name,
            region,
            bodyTemp,
            status,
            other,
            symptom,
            otherInfo
        } = e.detail.value;
        const verify = [{
            value: name,
            text: "请输入姓名"
        }, {
            value: gender,
            text: "请选择性别"
        }, {
            value: phone,
            text: "请输入手机号"
        }, {
            value: region.length,
            text: "请选择所在地"
        }, {
            value: bodyTemp,
            text: "请输入体温"
        }, {
            value: status,
            text: "请选择状态"
        }]
        let isValue = verify.findIndex(ele => !ele.value);
        if (isValue != -1) {
            wx.showToast({
                title: verify[isValue].text,
                icon: 'none'
            })
        } else {
            this.putUsers(e.detail.value);
        }
    },

    putUsers(data) {
        let userInfo = wx.getStorageSync("userInfo");
        http.put(`users/${userInfo._id}`, data).then(res => {
            wx.setStorageSync('userInfo', res.data);

            http.post(`details`, Object.assign(data, {
                openid: res.data.openid,
                time: util.formatTime(new Date())
            })).then(ress => {
                if (ress.data.code == 0) {
                    wx.showToast({
                        title: ress.data.msg,
                        icon: 'none'
                    })
                }
            })
        })
    },

    creatGroup() {
        wx.showToast({
            title: '正在开发中',
            icon: 'none'
        })
    },

    toDetails() {
        wx.navigateTo({
            url: `/pages/list/index`
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
      this.setData({
        msg: getApp().globalData.userId,
      })
        let userInfo = wx.getStorageSync("userInfo");
        let {
            gender
        } = userInfo;
        if (userInfo) {
            http.get(`details?query={"where":{"openid":"${userInfo.openid}"}}`).then(res => {
                this.setData({
                    userInfo,
                    gender,
                    total: res.data.total
                })
            })
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: '健康打卡',
            path: `/pages/index/index`,
            imageUrl: '../../images/index.png'
        }
    }
})