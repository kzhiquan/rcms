
/**
 * Module dependencies.
 */

//require('./consolehide');

/*************************************** our parent process ***************************************/
//以下代码用于维持进程，当子进程退出时，5秒后自动重新开启进程。
/*if(process.argv.length>1) {//这个if肯定会成立，其作用是为了把内部的变量的作用范围和外部分离开来，避免冲突
    var newArgv = [];//
    var ifChild = false;
    process.argv.forEach(function (val, index, array) {
        if(val=='-run_in_child') {
            ifChild = true;
        }
        else if(index>0)newArgv.push(val);//第0个元素是命令/程序路径
    });
    if(!ifChild) {
        newArgv.push('-run_in_child');//子进程需要一个命令标志：run_in_child
        start();
        function start()
        {
            //console.dir(newArgv);
            console.log('master process is running.');
            var cp = require('child_process').spawn(process.argv[0], newArgv);
            cp.stdout.pipe(process.stdout);
            cp.stderr.pipe(process.stderr);
            cp.on('exit', function (code)
            {
                if(code==0){
                    //正常退出进程
                    process.exit(0);
                    return;
                }
                //可以在此添加进程意外退出的处理逻辑
                delete(cp);
                console.log('child process exited with code ' + code);
                setTimeout(start,5000);
            });
        }
        return;
    }
}
//维持进程代码结束*/

//your code hero...
//你的主程序从这里开始
/***************************************  our child process *********************************/
var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var flash = require('connect-flash');
var app = express();

var log = require('./setting').log;

app.engine('.html', require('ejs').__express);
app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(flash());

    app.use(function(req, res, next){    //give the view data.
        res.locals.staff = req.session.staff;

        var success = req.flash('success');
        res.locals.success = success.length ? success : null;

        var error = req.flash('error');
        res.locals.error = error.length ? error : null;
        next();
    });

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
