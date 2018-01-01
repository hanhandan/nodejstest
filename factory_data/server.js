/**
 * 模块依赖
 */
var express = require('express')
,mysql=require('mysql')
,config=require('./config')

var db = mysql.createClient(config);




/**
 * 创建应用
 */

 app = express.createServer();

 /**
  * 配置应用
  */
app.set('view engine','jade');
app.set('views',__dirname + '/views');
app.set('view options',{ layout:false});

/**
 * 首页路由
 */

 app.get('/',function(req,res,next){
     res.render('index');
 })

 /**
  * 创建商品路由
  */

app.post('/create',function(req,res,next){
});

/**
 * 查看商品路由
 */

app.get('/item/:id',function(req,res,next){
    res.render('item');
})

/**
 * 
 */
app.post('/item/:id/review',function(req,res,next){

})


/**
 * 监听
 */

 app.listen(3020,function(){
     console.log(' - listening on http://*.3020');
     console.log("views:  "+__dirname);
 })

