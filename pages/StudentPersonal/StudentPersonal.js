
Page({

  /**
   * 页面的初始数据
   */
  data: {

    info: [
      { title: "打卡记录" },
      { title: "帮助与反馈" },
      { title: "返回" }
    ],
    url: [
      "/pages/SubmitLog/SubmitLog",
      "/pages/Help/Help",
      "/pages/Student/Student"
    ],
    name: '',
    Id: '',
    Telephone: '',
    college: '',
    major: '',
    stuClass: '',
    Type: '',
  },
  TypeChange: function (e) {

    console.log(e)
    var bindex = parseInt(e.currentTarget.dataset.index);
    console.log(bindex);
    if (bindex == 3) {
      wx.navigateBack({
        delta: 1,
      })
    }
    else {
      wx.navigateTo({
        url: this.data.url[bindex],
        success: (res) => {
          const ChangeMsg = {
            "Id": this.data.Id,
            "name": this.data.name,
            "Telephone": this.data.Telephone,
            "Type": this.data.Type
          }
          var array = JSON.stringify(ChangeMsg);
          res.eventChannel.emit('acceptDataFromOpenerPage',
            { data: array })
        }
      })
    }
  },
  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {

      console.log(data);

      var json1 = JSON.parse(data.data);

      console.log("test1")
      this.setData({
        Id: json1['Id'],
        name: json1['name'],
        Telephone: json1['Telephone'],
        college: json1['college'],
        major: json1['major'],
        stuClass: json1['stuClass'],
        Type: json1['Type'],
      })
    })
  },


  itemClickEvent: function () {
    var that=this;
    wx.showActionSheet({
      itemList: ['更改密码', '更改手机', '其他'],
      success(res) {
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/ChangePwd/ChangePwd',
            success: (res) => {
              console.log('itemClickEvent');
              // 通过eventChannel向被打开页面传送数据
              const msg = {
                "Id": that.data.Id,
                "name": that.data.name,
                "pwd": that.data.pwd,
                "Type": that.data.Type
              }
              var array = JSON.stringify(msg);
              res.eventChannel.emit('acceptDataFromOpenerPage',
                { data: array })
            }
          })
        } else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: '/pages/ChangeTel/ChangeTel',
            success: (res) => {
              console.log('itemClickEvent');
              // 通过eventChannel向被打开页面传送数据
              const msg = {
                "Id": that.data.Id,
                "name": that.data.name,
                "Telephone": that.data.Telephone,
                "Type": that.data.Type
              }
              var array = JSON.stringify(msg);
              res.eventChannel.emit('acceptDataFromOpenerPage',
                { data: array })
            }
          })

        } else if (res.tapIndex == 2) {

        }
      },
      fail(res) {
        console.log(res.errMsg);
      }
    })

  },




})
