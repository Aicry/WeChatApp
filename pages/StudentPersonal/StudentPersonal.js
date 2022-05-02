
Page({

  /**
   * 页面的初始数据
   */
  data: {

    info: [
      { title: "更改密码" },
      { title: "打卡记录" },
      { title: "帮助与反馈" },
      { title: "返回" }
    ],
    name: '',
    Id: '',
    college: '',
    major: '',
    stuClass: '',
    Type: ''
  },
  TypeChange: function (e) {
    console.log(e.detail.value );
    wx.navigateTo({
      url: `/pages/ChangeMsg/ChangeMsg`,
      success: (res) => {
        const ChangeMsg = {
          "Id": this.data.Id,
          "name": this.data.name,
          "Type": this.data.Type
        }
        var array = JSON.stringify(ChangeMsg);
        res.eventChannel.emit('acceptDataFromOpenerPage',
          { data: array })
      }
    })
  },
  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {

      console.log(data);

      var json1 = JSON.parse(data.data);

      console.log("test1")
      this.setData({
        Id:json1['Id'],
        name:json1['name'],
        college:json1['college'],
        major:json1['major'],
        stuClass:json1['stuClass'],
        Type:json1['Type'],
      })
    })
  },



})
