import http from '../../utils/api.js';
import util from '../../utils/util.js'
const app = getApp()
var inputTimeout = null;
Page({
    /**
     * 页面的初始数据
     */
    data: {
     admins:[],
     adminList:[],
     adminList_search:[],
     items: [],
     index: "",
     inputShowed: false,
     focus:true,
     searchText: ""
    },

    onLoad: function () {
           
         this.change();
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
    change:function(e){
   
    const promise= http.post("AdminManage",this.data.college);     
    promise.then(res => {
    console.log(res.data);
    this.setData({
        items:res.data,
        admins:res.data.admins,
        adminList:res.data.admins
    })
    })
   },
  
   itemClickEvent: function (e) {
   console.log('itemClickEvent e', e); 

    var item = e.detail.item ? e.detail.item : e.currentTarget.dataset.item;
    console.log(item);
    this.itemClick(item);

  },
   itemClick: function (item){
    wx.showActionSheet({
      itemList: ['更改密码','删除管理员'],
      success(res) {
        const msg = {
          "Id": item.Id,
          "name": item.name,
          "pwd":item.pwd,
          "Type": '管理员'
        }
        var array = JSON.stringify(msg);
        if (res.tapIndex == 0) {
          wx.navigateTo({
            url: '/pages/ChangePwd/ChangePwd',
            success: (res) => {      
              res.eventChannel.emit('acceptDataFromOpenerPage',
                { data: array })
            }
          })
        } 
      },
      fail(res) {
        console.log(res.errMsg);
      }
    })

  },

   //开始搜索
  searchSubmit: function (e) {
    console.log('searchSubmit e', e);
    var adminList_search = [];
    var adminList = this.data.adminList;
    var searchText = this.data.searchText;

    if (this.data.searchText.length > 0){
      //本地搜索，比较姓名、拼音....
      for (var i in adminList){
        if (adminList[i].name.indexOf(searchText) != -1 
          || searchText.indexOf(adminList[i].name) != -1
          || adminList[i].college.indexOf(searchText) != -1
          || searchText.indexOf(adminList[i].college) != -1
          || adminList[i].Id.indexOf(searchText) != -1
          || searchText.indexOf(adminList[i].Id) != -1){
            adminList_search.push(adminList[i]);
        }
      }
      if (adminList_search.length == 0){
        app.toastSuccess('无匹配结果');
      }
    }

    //搜索结果
    this.setData({
      adminList_search: adminList_search,
    });

    console.log('this.data.adminList_search',adminList_search)
    
    //一些处理
    if (inputTimeout != null){
      clearTimeout(inputTimeout);
      inputTimeout = null;
    }
  },


  initadminList: function () {

    let adminList = this.data.adminList

 
    this.setData({
      adminList: adminList,
      searchFocus: false,
      searchText: '',
      adminList_search: [],
    })

  

    wx.stopPullDownRefresh()
  },
   
  



    //搜索内容输入变化
    searchTextInput: function (e) {
      //console.log('searchTextInput e', e);
      this.setData({
        searchText: e.detail.value,
      });
      
      //即时搜索
      if (inputTimeout == null){
        var that = this;
        inputTimeout = setTimeout(function () {
          that.searchSubmit(e);
        }, 1000);
      }
    },
  showInput: function () {
    this.setData({
        inputShowed: true
    });
},
hideInput: function () {
    this.setData({
      searchText: "",
      inputShowed: false
    });
},
clearInput: function () {
    this.setData({
      searchText: ""
    });
},

})
   
   