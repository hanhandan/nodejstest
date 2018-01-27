var fs = require('fs');
var Path = require('path');
var xlsx = require("node-xlsx");
var cnt = 0;
var MAX_KEY_LEN=12;
var miner_list = [];
var http_prefix="http://account.onethingpcs.com/b?d="
var crypto=require('crypto');  


function rand_data_create(callback)
{
    　　var $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    　　var maxPos = $chars.length;
    　　var pwd = '';
    　　for (i = 0; i < MAX_KEY_LEN-4; i++) {
    　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　}
        callback(null,pwd);
    　　return pwd;
}

function caculate_key(device_sn,mac_address,rkey){
    rand_data_create(function(err,data){
        var device_id=http_prefix+data+device_sn.substr(-4);
        console.log(mac_address+','+device_sn+','+device_id+','+rkey);

        // console.log(data);
    })
}

function walkDir(dirPath, callback) {
    var result = {};
    var k = 0;
    var onEnd = function () {
        if (k === 0) {
            callback(null, result);
        }
    };
    fs.readdir(dirPath, function (err, entires) {
        if(err) {
            console.error(err);
            return;
           }
        // console.log("entires : "+typeof(entires));
        k = entires.length;
        entires.forEach(function(filename, i) {
            var path = Path.join(dirPath, filename);
            // console.log(filename);
            fs.stat(path, function(err, stats) {
                if (stats && stats.isFile()) {
                    result[filename] = read_excel(path);
                }
                if (k === i+1) {
                    callback(null, result);
                    // console.log(result[filename])
                }
            });
        });
    });
}


function read_excel(filename) {
    var list = xlsx.parse(filename);
    var device_info = list[0].data
    cnt += device_info.length - 1;
    // console.log(device_info.length);
    // console.log(cnt);
    if ("条码" === device_info[0][1]) {
        index = 1;
    }
    else {
        if ("sn" === device_info[0][1] || "当前批号" === device_info[0][1])
            index = 1;
        else
            index = 2;
    }
    
    for (var i in device_info) {
        if (i > 0) {
            if (typeof (device_info[i][index]) == 'undefined')
                continue;
                
            if (device_info[i][index].substr(0, 2) == 'OC' || device_info[i][index].substr(0, 2) == 'OE' ||device_info[i][index].substr(0, 2) == 'OD' ) {
                onedata=[]
                onedata.push(device_info[i][0]);
                onedata.push(device_info[i][1]);
                onedata.push(device_info[i][2]);
                // miner_list.push(onedata)
                caculate_key(device_info[i][1],device_info[i][0],device_info[i][2])
            }
        }
    }

    return miner_list;
}

function deviceKeyInvalid(device_key) {
    var exp = /^[A-Za-z0-9_\-\}\{]{12}$/;
    return !exp.test(device_key);
}

walkDir("/home/vincent/Desktop/ipk/outputfactory/refactory/20180126",function(err,data){

})
// module.exports = walkDir;
// create_refatory_data();