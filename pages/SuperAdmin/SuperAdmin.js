
Page({

    /**
     * 页面的初始数据
     */
    data: {
  
      info: [
        { title: "学生管理" },
        { title: "管理员管理" },   
        { title: "异常报送信息" },    
       
      ],
      url:[
        "/pages/StudentManage/StudentManage",
        "/pages/AdminManage/AdminManage",
        "/pages/AbnormalMsg/AbnormalMsg"
      ],
      name: '',
      Id: '',
      college: '',
      Type: '',
    },
    TypeChange: function (e) {
      
        console.log(e)
        var bindex = parseInt(e.currentTarget.dataset.index);
        console.log(bindex);
        wx.navigateTo({
        url:this.data.url[bindex],
        success: (res) => {
          res.eventChannel.emit('acceptDataFromOpenerPage',
            { data: this.data.college })
        }
      })
    
    },
    onLoad: function () {
      const eventChannel = this.getOpenerEventChannel();
      eventChannel.on('acceptDataFromOpenerPage', (data) => {
        console.log(data); 
        this.setData({
          Id:data.data.Id,
          name:data.data.name,
          college:data.data.college,
          Type:data.data.Type,
        })
      })
    },
  
  
  
  
  
    
  })
  