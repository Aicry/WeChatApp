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
    submitResult: '',
    name: '',
    Id: '',
    temperature: '',
    inSchool: '',
    inCity: '',
    healthy: '',
    personType: '',
    relative: '',
    note: '',
    latitude: '',
    longitude: '',
    submitdays: '',
    submitDate:'',
    address: '',
    disabled: false,

    Status: ["是", "否"],
    healthyStatus: ["正常", "异常"],
    temList: ["低于36℃", "36~37.3℃", "37.3~38℃", "38℃以上"],
    personTypeList: ["否", "确诊患者", "疑似患者", "可能感染的发热患者", "密切接触者"],
    Telephone:'',
    college:'',
    major:'',
    stuClass:'',
    Type:''
  },



  onLoad: function () {
    qqmapsdk = new QQMapWX({
      key: '5XGBZ-YKSLX-ACG4J-TWH3A-EEMU6-43FXE' //这里自己的key秘钥进行填充
    });
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      console.log(data);
      this.setData({
        name: data.data.name,
        Id: data.data.Id,
        Telephone:data.data.Telephone,
        college:data.data.college,
        major:data.data.major,
        stuClass:data.data.stuClass,
        submitdays:data.data.submitdays,
        submitDate:data.data.submitDate,
        Type:data.data.Type
      })

    })
    console.log()


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

  addressChange(e) {
    this.getUserLocation();
    this.setData({
      address: e.detail.value
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
      healthy: e.detail.value
    })
  },
  personTypeChange(e) {
    this.setData({
      personType: e.detail.value
    })
  },
  relativeChange(e) {
    this.setData({
      relative: e.detail.value
    })
  },
  noteChange(e) {
    this.setData({
      note: e.detail.value
    })

  },


  checkedTerms(e) {
    if(this.data.submitResult!='success'){
    this.setData({
      disabled: !e.detail.value.length
    })
  }
  },

 
  checkedSubmintMsg:function () {
    if(this.data.address==''||this.data.inSchool==''||this.data.inCity==''||this.data.temperature==''||this.data.healthy==''||this.data.personType==''||this.data.relative==''||this.data.Id==''){
      wx.showToast({
        title: '填报信息不全',
        icon: 'error',
        duration: 1000,
      })
    }
    else{
    const submintMsg = {
      "Id": this.data.Id,
      "address": this.data.address,
      "inSchool": this.data.inSchool,
      "inCity": this.data.inCity,
      "temperature": this.data.temperature,
      "healthy": this.data.healthy,
      "personType": this.data.personType,
      "relative": this.data.relative,
      "note": this.data.note,
      "date": util.getDate()
    }
    var array = JSON.stringify(submintMsg);
    const promise = http.post('Submit', array);
    promise.then(res => {
      console.log(res.data);
      this.setData({
        submitResult: res.data
      })
      if (this.data.submitResult == 'success') {
        console.log("success");
        wx.showToast({
          title: '报送成功',
          icon: 'success',
          duration: 1000,
        })
        
        this.setData({
          submitdays:String(parseInt(this.data.submitdays)+1),
          disabled:true
        })
      }
      else if (this.data.submitResult == 'Duplicate') {
        console.log("Duplicate");
        wx.showToast({
          title: '今日已报送',
          icon: 'error',
          duration: 1000,
        })
      }
        else{
        wx.showToast({
          title: '请检查信息',
          icon: 'error',
          duration: 1000,
        })
      }
    })

  }
  },
  formSubmit: function (e) {
   
    this.checkedSubmintMsg();



  },

  creatGroup() {
    wx.showToast({
      title: '正在开发中',
      icon: 'none'
    })
  },

  toDetails() {
    wx.navigateTo({
      url:`/pages/StudentPersonal/StudentPersonal`,
     
      success: (res) => {
          
        console.log('test');
        // 通过eventChannel向被打开页面传送数据
        const StudentMsg = {
          "Id": this.data.Id,
          "name": this.data.name,
          "Telephone":this.data.Telephone,
          "college": this.data.college,
          "major": this.data.major,
          "stuClass": this.data.stuClass,
          "Type": this.data.Type
        }
        var array = JSON.stringify(StudentMsg);
        res.eventChannel.emit('acceptDataFromOpenerPage',
            {data: array})
    }

  })
    
  },

  onShareAppMessage: function () {
    return {
      title: '健康打卡',
      path: `/pages/index/index`,
      imageUrl: '../../images/index.png'
    }
  }
})

