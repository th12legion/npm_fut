var https = require("https");

//------------ Работа со строками ------------
var str_cap = function(str) {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
//------------ Работа со строками ------------

//------------ Работа со объектами ------------
var jparse = function(str, show_error = false){
    let ready_obj = null;
    try{
        ready_obj = JSON.parse(str);
    }catch(e){
        if(show_error===true){
            console.log("Warning:", e);
        }
    }

    return ready_obj;
}

var check_obj_keys =  function(object, keys){
	for(let i=0; i<keys.length; i++){
		if(typeof object[keys[i]]=="undefined"){
			return false;
		}
	}
	
	return true;
}
//------------ Работа со объектами ------------

//------------ Работа со временем ------------
var get_unix = function(){
	return Math.round(new Date().getTime()/1000);
}
//------------ Работа со временем ------------

//------------ Работа с задержками ------------
var sleep = async function(sec = 1){
    return new Promise(function(resolve, reject){
        setTimeout(function(){
            resolve();
        },sec*1000);
    });
}

var beep = async function(){
    //return true;
    return new Promise((resolve, reject) => {
        setTimeout(function(){
            resolve(true);
        },1);
    });
}
//------------ Работа с задержками ------------

//------------ Работа с запросами ------------
var send_request = async function(params){
	params = (typeof params=="undefined")?{}:params;
	let defalt_params = {"host": null, "path": "", "method": "GET", "headers": null, "time": 2.5, "show_error": false, "data": ""};
	
	for(let key in defalt_params){
		if(typeof params[key]=="undefined"){
			params[key] = defalt_params[key];
		}
	}
	
	let {host, path, method, headers, time, data} = params;
	
	if(host===null){
		return null;
	}
	
    return new Promise((resolve, reject) => {
        const options = {
            hostname: host,
            port: 443,
            path: path,
            method: method,
            headers: headers
        }
        
        const req = https.request(options, (res) => {
            let body = "";
            res.on("data", data => {
                body += data;
            });
            
            res.on("end", async function() {
                body = body.trim();
                resolve(body);
            }); 
            
            res.on('error', (error) => {
                resolve(null);
            })
        });
        
        req.on('error', (error) => {
            if(params["show_error"]===true){
                console.log("Warning:", error);
            }
            resolve(null);
        });
		
		req.setTimeout(time*1000, () => {
            if(params["show_error"]===true){
                console.log("Warning:", "Обрыв соеденения по таймауту");
            }
            req.abort();
        });

        if (method=="POST"){
            req.write(data);
        }
        
        req.end()
    });
}
//------------ Работа с запросами ------------

//------------ Дополнительные утилиты ------------
var rand_int = function (min, max) {
	let rand = min - 0.5 + Math.random() * (max - min + 1);
	return Math.round(rand);
}
//------------ Дополнительные утилиты ------------

module.exports = {
    "str_cap":str_cap,

    "jparse": jparse,
    "check_obj_keys": check_obj_keys,
    
    "get_unix": get_unix,
	
    "sleep": sleep,
    "beep": beep, 

    "send_request": send_request,
    
    "rand_int": rand_int
};