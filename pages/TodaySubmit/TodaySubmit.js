import http from '../../utils/api.js';
import util from '../../utils/util.js';
const app = getApp();
var inputTimeout = null;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    college: '',
    items: [],
    record: [],
    SubmitLogs_search: [],
    index: "",
    activeIndex: 0,
    content: '今日填报信息',
    tabs: [
      {
        id: 1,
        tabName: '今日填报信息'
      }, {
        id: 2,
        tabName: '健康异常学生'
      }, {
        id: 3,
        tabName: '离校学生'
      }, {
        id: 4,
        tabName: '离开城市学生'
      }, {
        id: 5,
        tabName: '其他'
      }
    ],
  },

  chooserecord: function (e) {
    var checkid = e.currentTarget.dataset.index;
    console.log(checkid);
    wx.navigateTo({
      url: '',
      success: (res) => {
        var array = JSON.stringify(this.data.items[checkid]);
        res.eventChannel.emit('acceptDataFromOpenerPage',
          { data: array })
      }

    })

  },
  onLoad: function () {
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      console.log(data);
      this.setData({
        college: data.data
      })
    })
    this.TodaySubmit();
    var vm = this;
    wx.getSystemInfo({
      success: (res) => {
        vm.setData({
          deviceWidth: res.windowWidth,
          deviceHeight: res.windowHeight
        });
      }
    });

  },
  TodaySubmit: function (e) {

    const loginMes = {
      "date": util.getDate(),
      "college": this.data.college
    }
    var array = JSON.stringify(loginMes);

    const promise = http.post("TodaySubmit", array);
    promise.then(res => {
      console.log(res.data);
      this.setData({
        items: res.data.todaySubmitLogs,
        SubmitLogs_search: res.data.todaySubmitLogs
      })

    })
  },
  changeTab: function (e) {
    this.setData({
      activeIndex: e.currentTarget.dataset.index,
      content: e.currentTarget.dataset.name
    })
    this.getMore();
  },
  getMore: function () {
    if (inputTimeout == null) {
      var that = this;
      inputTimeout = setTimeout(function () {
        that.searchSubmit();
      }, 100);
    }
  },


  searchSubmit: function () {
    var SubmitLogs_search = [];
    var items = this.data.items;
    var content = this.data.content;
    if (content == '今日填报信息') {
      SubmitLogs_search = items;
    }
    else if (content == '健康异常学生') {
      var searchText = '异常';
      for (var i in items) {
        if (searchText.indexOf(items[i].dailySubmitMsg.healthy) != -1
        ) {
          SubmitLogs_search.push(items[i]);
        }
      }
    }
    else if (content == '离校学生') {
      var searchText = '否';
      for (var i in items) {
        if (searchText.indexOf(items[i].dailySubmitMsg.inSchool) != -1
        ) {
          SubmitLogs_search.push(items[i]);
        }
      }
    }
    else if (content == '离开城市学生') {
      var searchText = '否';
      for (var i in items) {
        if (searchText.indexOf(items[i].dailySubmitMsg.inCity) != -1
        ) {
          SubmitLogs_search.push(items[i]);
        }
      }
    }

    if (SubmitLogs_search.length == 0) {
      app.toastSuccess('无信息');
    }
    this.setData({
      SubmitLogs_search: SubmitLogs_search,
    });

    console.log('this.data.SubmitLogs_search', SubmitLogs_search)

    //一些处理
    if (inputTimeout != null) {
      clearTimeout(inputTimeout);
      inputTimeout = null;
    }
  },
  itemClickEvent: function (e) {
    console.log('itemClickEvent e', e);

    var item = e.detail.item ? e.detail.item : e.currentTarget.dataset.item;
    console.log(item);
    this.itemClick(item);

  },
  itemClick: function (item) {
    wx.showActionSheet({
      itemList: ['报送详情', '拨打电话', '上报系统'],
      success(res) {

        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/StudentDetails/StudentDetails',
            success: (res) => {      
              var array = JSON.stringify(item);
              res.eventChannel.emit('acceptDataFromOpenerPage',
                { data: array })
            }
          })
        } else if (res.tapIndex == 1) {
          wx.makePhoneCall({
            phoneNumber: item.studentMsg.Telephone,
          })
        } else if (res.tapIndex == 2) {
          var array = JSON.stringify(item);
          const promise = http.post("AbnormalMessage", array);
          promise.then(res => {
            console.log(res.data);
            if (res.data == 'success') {
              console.log("success");
              wx.showToast({
                title: '上报成功',
                icon: 'success',
                duration: 1000,
              })
            }
           else if (res.data == 'fail') {
              console.log("success");
              wx.showToast({
                title: '上报失败',
                icon: 'error',
                duration: 1000,
              })
            }
          })
        }
      },
      fail(res) {
        console.log(res.errMsg);
      }
    })

  },


})

