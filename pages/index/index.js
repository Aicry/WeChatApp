import http from '../../utils/api.js';
import util from '../../utils/util.js'
let QQMapWX = require('../../libs/qqmap-wx-jssdk')
let qqmapsdk;
var app = getApp();
Page({

  /**
    * 页面的初始数据
    */
  data: {
    userName: '',
    userId: '',
    temperature: '',
    inSchool: '',
    inCity: '',
    health: '',
    personStatus: '',
    ralative: '',
    describeMsg: '',
    latitude: '',
    longitude: '',
    total: 0,
    address: '',
    disabled: true,
    Status: ["是", "否"],
    healthyStatus: ["正常", "异常"],
    temList: ["低于36℃", "36~37.3℃", "37.3~38℃", "38℃以上"],
    statusList: ["否", "确诊患者", "疑似患者", "可能感染的发热患者", "密切接触者"],

  },



  onLoad: function () {
    qqmapsdk = new QQMapWX({
      key: '5XGBZ-YKSLX-ACG4J-TWH3A-EEMU6-43FXE' //这里自己的key秘钥进行填充
    });
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      console.log(data);
      this.setData({
        userName: data.data.userName,
        userId: data.data.id
      })

    })

    this.getUserLocation();

  },



  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
        console.log(JSON.stringify(res))
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
  getLocation: function () {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        vm.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  getLocal: function (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        console.log(JSON.stringify(res));
        vm.setData({
          latitude: latitude,
          longitude: longitude,
          address: res.result.address,
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
  onReady: function () {
    let modelInfo = wx.getSystemInfoSync();
    let menuInfo = wx.getMenuButtonBoundingClientRect();
    let top = menuInfo.top;
    let left = modelInfo.windowWidth - menuInfo.right;
    this.setData({
      header_style: `margin-top:${top}px;height:${menuInfo.height}px`
    })
  },


  temChange(e) {
    this.setData({
      temperature: this.data.temList[Number(e.detail.value)]
    })
  },
  inSchoolChange(e) {

    this.setData({
      inSchool: e.detail.value
    })
  },

  inCityhange(e) {
    this.setData({
      inCity: e.detail.value
    })
  },
  healthyChange(e) {
    this.setData({
      health: e.detail.value
    })
  },
  personStatusChange(e) {
    this.setData({
      personStatus: e.detail.value
    })
  },
  ralativeChange(e) {
    this.setData({
      ralative: e.detail.value
    })
  },
  describeMsgChange(e) {
    this.setData({
      describeMsg: e.detail.value
    })

  },


  checkedTerms(e) {
    this.setData({
      disabled: !e.detail.value.length
    })
  },

  formSubmit: function (e) {
    let {
      address,
      inSchool,
      inCity,
      temperature,
      health,
      personStatus,
      ralative,
    } = e.detail.value;
    const verify = [
      {
        value: address.length==0,
        text: "定位出错"
      },

      {
        value: inSchool,
        text: "请选择是否在校"
      },

      {
        value: inCity,
        text: "请选择是否离开学校所在城市"
      }, 

      {
        value: temperature,
        text: "请输入体温"
      },

      {
        value: health,
        text: "请选择健康状况"
      },

      {
        value: personStatus,
        text: "请选择是否被确认为四类人员"
      }, 

      {
        value: ralative,
        text: "请选择主要亲属是否确诊"
      },
    ]

    let isValue = verify.findIndex(ele => !ele.value);
    if (isValue != -1) {
      wx.showToast({
        title: verify[isValue].text,
        icon: 'none'
      })
    } else {
         console.log("提交测试")
    }
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
    return {
      title: '健康打卡',
      path: `/pages/index/index`,
      imageUrl: '../../images/index.png'
    }
  }
})