
Page({
    data: {
        item:'',
       },
    onLoad: function(){
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
          console.log(data);
          this.setData({
            item:data.data
          })
         
        })
    }
});