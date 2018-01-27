var fs = require('fs');
var Path = require('path');
var xlsx = require("node-xlsx");
// function read_excel(excel_name){
//     var filePath=excel_name; //要读取的xls
//     var sheet_id=2; //读取第2个表
//     var row_start=3; //从第3行开始读取
//     var tempStr='';
//     try{
//         var oXL = new ActiveXObject("Excel.application"); //创建Excel.Application对象
//     }catch(err)
//     {
//         alert(err);
//     }
//     var oWB = oXL.Workbooks.open(filePath);
//     oWB.worksheets(sheet_id).select();
//     var oSheet = oWB.ActiveSheet;
//     var colcount=oXL.Worksheets(sheet_id).UsedRange.Cells.Rows.Count ;
//     for(var i=row_start;i<=colcount;i++){
//         if (typeof(oSheet.Cells(i,8).value)=='date'){ //处理第8列部分单元格内容是日期格式时的读取问题
//             d= new Date(oSheet.Cells(i,8).value);
//             temp_time=d.getFullYear()+"-"+(d.getMonth() + 1)+"-"+d.getDate();
//         }
//         else
//             temp_time=$.trim(oSheet.Cells(i,7).value.toString());
//         tempStr+=($.trim(oSheet.Cells(i,2).value)+" "+$.trim(oSheet.Cells(i,4).value)+" "+$.trim(oSheet.Cells(i,6).value.toString())+" "+temp_time+"\n");
//         //读取第2、4、6、8列内容
//     }
//     return tempStr; //返回
//     oXL.Quit();
//     CollectGarbage();
// }
var cnt = 0;
var sn_list = [];
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
                }
            });
        });


        /*
        for (var idx in entires) {
            var fullPath = Path.join(dirPath, entires[idx]);        
            fs.stat(fullPath, function (err, stats) {
                k--;
                console.log(this);
                if (stats && stats.isFile()) {
                    // console.log(fullPath);
                    result[entires[idx]] = read_excel(fullPath);
                    onEnd(k);
                }
            })
        }*/
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
                sn_list.push(device_info[i][index]);
                console.log(device_info[i][index]);
            }
        }
    }

    
    return sn_list;
}

function deviceKeyInvalid(device_key) {
    var exp = /^[A-Za-z0-9_\-\}\{]{12}$/;
    return !exp.test(device_key);
}
// walkDir("/home/vincent/Desktop/ipk/outfactory/zowee/20171104")

module.exports = walkDir;
//  walkDir("/home/vincent/Desktop/ipk/outfactory/Giec_201709/20171102")
// if (deviceKeyInvalid('_EOk7xh_7608')) {
//     console.log("true")
// }
// else{
//     console.log("false")


// }