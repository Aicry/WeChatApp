import http from '../../utils/api.js';
import util from '../../utils/util.js'
const app = getApp()
var inputTimeout = null;
Page({
    /**
     * 页面的初始数据
     */
    data: {
     college:'',
     students:[],
     studentList:[],
     studentList_search:[],
     items: [],
     index: "",
     inputShowed: false,
     focus:true,
     searchText: ""
    },

    onLoad: function () {
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
          console.log(data);
          this.setData({
            college:data.data
          })
          this.change();
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
    change:function(e){
    const promise= http.post("GetStudents",this.data.college);     
    promise.then(res => {
    console.log(res.data);
    this.setData({
        items:res.data,
        students:res.data.students,
        studentList:res.data.students
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
      itemList: ['更改密码','更改手机','拨打电话','删除学生','今日报送'],
      success(res) {
        const msg = {
          "Id": item.Id,
          "name": item.name,
          "pwd":item.pwd,
          "Telephone": item.Telephone,
          "Type": '学生'
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
        } else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: '/pages/ChangeTel/ChangeTel',
            success: (res) => {
              res.eventChannel.emit('acceptDataFromOpenerPage',
                { data: array })
            }
          })

        } else if (res.tapIndex == 2 ) {
          wx.makePhoneCall({
            phoneNumber: item.Telephone,
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
    var studentList_search = [];
    var studentList = this.data.studentList;
    var searchText = this.data.searchText;

    if (this.data.searchText.length > 0){
      //本地搜索，比较姓名、拼音....
      for (var i in studentList){
        if (studentList[i].name.indexOf(searchText) != -1 
          || searchText.indexOf(studentList[i].name) != -1
          || studentList[i].major.indexOf(searchText) != -1
          || searchText.indexOf(studentList[i].major) != -1
          || studentList[i].stuClass.indexOf(searchText) != -1
          || searchText.indexOf(studentList[i].stuClass) != -1
          || studentList[i].Id.indexOf(searchText) != -1
          || searchText.indexOf(studentList[i].Id) != -1){
            studentList_search.push(studentList[i]);
        }
      }
      if (studentList_search.length == 0){
        app.toastSuccess('无匹配结果');
      }
    }

    //搜索结果
    this.setData({
      studentList_search: studentList_search,
    });

    console.log('this.data.studentList_search',studentList_search)
    
    //一些处理
    if (inputTimeout != null){
      clearTimeout(inputTimeout);
      inputTimeout = null;
    }
  },


  initStudentList: function () {

    let studentList = this.data.studentList

 
    this.setData({
      studentList: studentList,
      searchFocus: false,
      searchText: '',
      studentList_search: [],
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
   
   