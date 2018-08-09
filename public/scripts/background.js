var counter = 0;
function changeBG(){
    var imgs = [
        "url(https://static.photocdn.pt/images/articles/2017/04/28/iStock-516651882.jpg)",
        "url(http://davronengineering.com.au/wp-content/uploads/2016/12/landscape-1802337_1280-1024x577.jpg)",
        "url(https://wallup.net/wp-content/uploads/2015/12/258088-sunset-landscape-horizon.jpg)",
        "url(https://iso.500px.com/wp-content/uploads/2014/07/big-one.jpg)",
        "url(https://i.ytimg.com/vi/MLX2wLdHrYU/maxresdefault.jpg)",
       
      ]
    
    if(counter === imgs.length) counter = 0;
    $("body").css("background-image", imgs[counter]);

    counter++;
}
  
setInterval(changeBG, 2000);


