
import http from '../../utils/api.js';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        Id: '', 
        pwd:'' ,
        name:'',
        submitdays:'',
        college:'',
        major:'',
        stuClass:'',
        Type:'',
        TypeList:["学生", "管理员","超级管理员"],
    },

    onLoad: function () {
      var date = new Date();
     date=date.toString();
     console.log(date);
    },
    idInput :function (e) { 
        this.setData({ 
          Id:e.detail.value ,
        }) 
         
        

      }, 
    // 获取输入密码 
      passwordInput :function (e) { 
        this.setData({ 
          pwd:e.detail.value 
        })   }, 

    
        TypeChange:function(e){
          this.setData({ 
            Type:e.detail.value 
          })
        },
    // 登录 
      login: function () { 

        if(this.data.Id.length == 0 || this.data.pwd.length == 0||this.data.Type.length==0){ 
          wx.showToast({   
            title: '请输入用户信息',   
            icon: 'error',   
            duration: 1000   
          })   
          
    }else { 
      console.log("test1");
        const loginMes={
          "Id" : this.data.Id,
          "pwd" : this.data.pwd
        }
        var array = JSON.stringify(loginMes);


        var loginType = "";
        var url=``;
        if(this.data.Type=="学生"){loginType='StudentLogin';url=`/pages/Student/Student`}
        if(this.data.Type=="管理员"){loginType='AdminLogin';url=`/pages/Admin/Admin`}
        if(this.data.Type=="超级管理员"){loginType='SuperAdminLogin';url=`/pages/SuperAdmin/SuperAdmin`}
        const promise= http.post(loginType,array);     
        promise.then(res => {
        console.log(res.data);

        if(res.data!='fail'){
          this.setData({
            name:res.data.name,
            submitdays:res.data.submitdays,
            college:res.data.college,
            major:res.data.major,
            stuClass:res.data.stuClass,
            Type:this.data.Type
        })
          wx.navigateTo({
            url: url,  
            success: (res) => {
              res.eventChannel.emit('acceptDataFromOpenerPage',
                  {data: this.data})
          }
        })
        }
        else {
          wx.showToast({
            title: '账号或密码错误',
            icon: 'error',
            duration: 1000,
          })
         
      }
    })
    
     
        }   
      } ,

    register: function(){
      wx.navigateTo({
        url: `/pages/register/register`,
       
        success: (res) => {
            
          console.log('test');
          // 通过eventChannel向被打开页面传送数据
          res.eventChannel.emit('acceptDataFromOpenerPage',
              {data: this.data.name})
      }

    })
    },

   


 
})