/*

	ATA Node.js Motor
		Version 1.0
		By Mustafa ÖZVER
		2021

*/

if (!Infinity) var Infinity = 99999999999999999;

var E = function() { // fast exit
	process.reallyExit(0);
};

var LOGs___ = {};
process.on("unhandledRejection", function(err){
	console.log("Unhandled rejection:", err);
	LOGs___[(new Date()).getTime()] = err;
});

////////////////////////////////////////////////////////////////////////////////////////////////////

var varIDs = {};
var generate_ID = function() {
	var len = 16;
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
	while (true) {
		var text = "_";
		for (var i=0;i<len;i++) text += chars.charAt(Math.floor(chars.length*Math.random()));
		if (!varIDs[text]) {
			varIDs[text] = true;
			return text;
		}
	}
};

var newFunction = function(uCode) {
	var __DF = "__DF = function(){var Keys = arguments;try{" + uCode + ";}catch(e){console.log(e);}};__DF";
	try {
		return eval(__DF);
	} catch (e) {
		return function(){};
	}
};

var AddCon = function(ofun,oeval){
	var __DF = "__DF = " + (ofun+"").replace(/\}$/,oeval+"};__DF");
	try {
		return eval(__DF);
	} catch (e) {
		return ofun;
	}
};

var timerEval = async function(uCode,time=10) {
	var __DF = "__DF = async function(){" + uCode + ";};__DF";
	setTimeout(eval(__DF),time);
};

var FormatTime = function(oMsec) {
	function addzero(onum) {
		return onum > 9 ? (""+onum) : ("0"+onum);
	}
	var ftext = "";
	var totalcount = Math.floor(oMsec/1000);
	var sec = totalcount%60;
	
	totalcount = Math.floor(totalcount/60);
	var min = totalcount%60;
	
	totalcount = Math.floor(totalcount/60);
	var hour = totalcount%24;
	
	totalcount = Math.floor(totalcount/24);
	var day = totalcount%30;
	
	totalcount = Math.floor(totalcount/30);
	var month = totalcount%12;

	if (month > 0) return "[" + month + "-" + day + "] [" + addzero(hour) + ":" + addzero(min) + ":" + addzero(sec) + "]";
	else if (day > 0) return "[" + day + "] [" + addzero(hour) + ":" + addzero(min) + ":" + addzero(sec) + "]";
	else if (hour > 0) return "[" + addzero(hour) + ":" + addzero(min) + ":" + addzero(sec) + "]";
	else if (min > 0) return "[" + addzero(min) + ":" + addzero(sec) + "]";
	else return "[00:" + addzero(sec) + "]";
};

var waitUntil = async function(if_, eval_,time_=25) {
	var promise = new Promise(function(resolve, reject) {
		var f_temp = function() {
			if (eval(if_)) {
				delete f_temp;
				resolve();
			} else {
				setTimeout(f_temp,time_);
			}
		};
		f_temp();
	}).then(function() {
		return eval(eval_);
	});
	promise = await promise;
	return promise;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// ATA Setups

console.log(""
	+ "#######################################################################################################\n"
	+ "#                                                                                                     #\n" // 
	+ "#                        ######          #####################          ######                        #\n" // 
	+ "#                       ########         #####################         ########                       #\n" // 
	+ "#                      ###    ###                 ###                 ###    ###                      #\n" // 
	+ "#                     ###      ###                ###                ###      ###                     #\n" // 
	+ "#                    ##############               ###               ##############                    #\n" // 
	+ "#                   ################              ###              ################                   #\n" // 
	+ "#                  ###            ###             ###             ###            ###                  #\n" // 
	+ "#                 ###              ###            ###            ###              ###                 #\n" // 
	+ "#                ###                ###           ###           ###                ###                #\n" // 
	+ "#                                                                                                     #\n" // 
	+ "#######################################################################################################\n" //
);

var ATA = {};
ATA.loopTime = 1000;
ATA.StartTime = (new Date()).getTime();
ATA.lastActivite = ATA.StartTime;
ATA.Loops = [];
ATA.Setups = [];

ATA.Http = require("http");
ATA.V8 = require("v8");
ATA.Fs = require("fs");
ATA.Url = require("url");
ATA.axios = require("axios");
ATA.Express = require("express");
ATA.Socket = require("socket.io");
ATA.CP = require("child_process");
//ATA.AppJS = require("appjs");

ATA.Settings = {
	ID:"ATA_5_Server_" + generate_ID(),
	HTTP_PORT:Math.floor(100*Math.random() + 200),
	ROOT:""+__dirname+"\\ATA_MOTOR\\"
};

ATA.CheckSystem = function() { // Check system
	this.lastActivite = (new Date()).getTime();
	if (this.Setups.length > 0) {
		this.Setup();
		return;
	}
	this.Loop();
	this.timeoutCheck = setTimeout(function(){ATA.CheckSystem();},this.loopTime);
};

ATA.Setup = function() { // Setup function
	for (var i=0;i<this.Setups.length;i++) {
		try {
			this.Setups[i]();
		} catch (e) {
			console.warn(e,this.Setups[i],i);
		}
	}
	setInterval(function() {
		var time = (new Date()).getTime();
		if (ATA.lastActivite+ATA.loopTime*10 < time) {
			ATA.Loop();
			console.clear();
			console.warn("ATA is restarted.\n Because unexpected ATA had stopped.");
		}
	},this.loopTime*10);
	this.Setups = [];
	this.CheckSystem();
};

ATA.Loop = function() {
	var newdate = new Date();
	for (var i=0;i<this.Loops.length;i++) {
		try {
			this.Loops[i](newdate);
		} catch (e) {
			console.warn(e);
		}
	}
};

ATA.Setups.push(function(){
	ATA.V8.setFlagsFromString("--max-old-space-size=10000");
	//ATA.V8.setFlagsFromString("--harmony");
	//ATA.AppJS.serveFilesFrom(ATA.Settings.ROOT + "\\UI");
	ATA.Window = ATA.CP.spawn(ATA.Settings.ROOT + "tools\\GoogleChromePortable\\GoogleChromePortable.exe", ["--app=http://localhost:"+ATA.Settings.HTTP_PORT+"/"]);
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Server System

ATA.GenerateHttpAnswer = function(reqParameters,Resources) {
	var ___F_ans;
	var err = false;
	try {
		var code = Buffer.from(reqParameters.query.TODO, 'base64').toString();
		___F_ans = eval("try{var ___F_ans=("+code+");}catch(e){___F_ans=e};___F_ans");
	} catch (e) {
		___F_ans = e.message;
		err = true;
	}
	Resources.writeHead(200,{"Content-Type":"application/json"});
	try {
		Resources.write(JSON.stringify({
			ID: reqParameters.query.ID,
			Answer: ___F_ans,
			Error:err
		}));
	} catch (e) {
		Resources.write(JSON.stringify({
			ID: reqParameters.query.ID,
			Answer: e.message,
			Error:true
		}));
	}
	Resources.end();
};

ATA.Communication = {
	Settings:{
		ID:"ATA" + generate_ID(),
		SECRET:"ATA"+generate_ID()+generate_ID()+generate_ID(),
		ROOT:"ATA_MOTOR/UI/",
		PORT:ATA.Settings.HTTP_PORT,
		DOMAIN:"localhost",
		Version:new Date(2020,12,18), // year, month, day, hours, minutes, seconds, milliseconds
		SOCKET:{
			path: "/SOCKET",
			serveClient:false,
			// below are engine.IO options
			pingInterval:10000,
			pingTimeout:5000,
			cookie:false
		}
	},
	GenerateCodeForBrowser:function(){
		var code = "";
		code += "ATA.Settings.PORT=" + this.Settings.PORT + ";";
		code += "ATA.Settings.DOMAIN=\"" + this.Settings.DOMAIN + "\";";
		code += "ATA.Setup();";
		return code;
	},
	isReady:false,
	lastActivite:(new Date()).getTime(),
	APP:ATA.Express(),
	Setup:function(){
		this.APP.set("port",this.Settings.PORT);
		var bodyparser = require("body-parser");
		this.APP.use(bodyparser.json());
		this.APP.use(bodyparser.urlencoded({extended:true}));
		this.APP.use(bodyparser.json());
		this.APP.use(require("multer")().array());
		this.APP.use(require("cookie-parser")());
		this.APP.use(require("express-session")({secret:this.Settings.SECRET}));
		/*app.get("/JS", function(Request, Resources){
			Resources.sendFile(this.Settings.ROOT+"JS.js");
		});*/
		this.APP.get("/JS", function(Request, Resources){
			//var opts = ATA.Url.parse(Request.url, true);
			var mimeType = "text/html";
			Resources.writeHead(200,{"Content-Type":"text/javascript"});
			return Resources.end(ATA.Communication.GenerateCodeForBrowser());
		});
		this.APP.post("/", function(Request, Resources){
			ATA.GenerateHttpAnswer(Request,Resources);
			return;
		});
		this.APP.use("/static", ATA.Express.static("node_modules"));
		//this.APP.use('/0/*', require("serve-index")(this.Settings.ROOT));
		this.APP.use("/", ATA.Express.static(this.Settings.ROOT,{index:"index.html"}));
		this.APP.use("/*", ATA.Express.static(this.Settings.ROOT));
		this.APP.get("/*",function(Request, Resources){
			Resources.send("-", 404);
		});
		this.HTTP = ATA.Http.createServer(this.APP);
		this.IO = ATA.Socket(this.HTTP,this.Settings.SOCKET);
		this.HTTP.listen(this.Settings.PORT,function(){});
		this.IO.engine.generateId = function (Request) {
			return "SOCKET_" + generate_ID();
		};
		this.IO.on("connection",function(socket){
			socket.emit("0",ATA.Communication.Settings.ID);
			socket.join("STR0");
			socket.on("0",newFunction("ATA.Communication.SOCKET.Socket(\""+socket.id+"\");"));
		});
		console.log("PORT = " + this.Settings.PORT);
	},
	SOCKET:{
		Sockets:{},
		Socket:async function(socketid){
			//if () verify...
			ATA.Communication.IO.sockets.sockets.get(socketid).on("JOIN",newFunction("ATA.Communication.SOCKET.Join(\""+socketid+"\",Keys[0]);"));
			ATA.Communication.IO.sockets.sockets.get(socketid).emit("APPROVED");
			ATA.Communication.IO.sockets.sockets.get(socketid).join("STR1");
		},
		Join:function(socketid,name){
			this.Sockets[""+name] = {
				ROOT:ATA.Communication.IO.sockets.sockets.get(socketid),
				DATA:function(){},
			};
			//
				this.Sockets[""+name].DATA = function(){
					console.log(arguments);
				};
			//
			this.Sockets[""+name].ROOT.join("STR2");
			this.Sockets[""+name].ROOT.on("DATA",newFunction("ATA.Communication.SOCKET.Sockets[\""+name+"\"].DATA(\""+socketid+"\");"));
		},
		DATA:function(name,data){
			if (this.Sockets[""+name]) this.Sockets[""+name].ROOT.emit("DATA",data);
			ATA.Communication.IO.to(""+name).emit("DATA",data);
		}
	},
};

ATA.EvalInUI = function(){};
ATA.Setups.push(function(){
	ATA.Communication.Setup();
	ATA.EvalInUI = function(oCode,Args,oWho="STR2"){
		ATA.Communication.SOCKET.DATA(oWho,{TYPE:"EVAL",DATA:"("+oCode+")("+(Args?Args.map(function(x){return JSON.stringify(x)}):"")+");"});
	};
});

/*ATA.Loops.push(async function(){
	var basefolder = ATA.Settings.ROOT + "Strategies\\" + Strategy.Folder + "\\";
	ATA.Fs.readFile(basefolder + "ChangeableCodes.JS", function(err, data) {
		if (err) return;
		ATA.CHcodes = newFunction(";"+data+";");
	});
});*/

var DecodeObject = function(obj) {
	switch (typeof obj) {
		default:
		case "string":
			return JSON.stringify(obj);
		break;
		case "object":
			var keys = Object.keys(obj);
			var text = "{";
			for (var i=0;i<keys.length;i++) {
				text += JSON.stringify(keys[i]) + ":" + DecodeObject(obj[keys[i]]) + "";
				if (i < keys.length - 1) text += ",";
			}
			if (obj.constructor.name == "object") return text + "}";
			else return "Object.assign(new " + obj.constructor.name + "()," + text + "})";
		break;
		case "number":
			return obj;
		break;
		case "function":
			return obj+"";
		break;
		case "boolean":
			return obj+"";
		break;
	}
};

ATA.BackUp = {
	isReady:false,
	lastActivite:0,
	Period:1000, // 1 sec
	Settings:{
		Base_Folder:ATA.Settings.ROOT + "DATA\\",
		List:[]
	},
	Setup:function(){
		console.log("BackUp System is started.");
		this.Restore();
		ATA.Loops.push(function() {
			var time = (new Date()).getTime();
			if (ATA.BackUp.lastActivite+ATA.BackUp.Period*10 < time) ATA.BackUp.Loop();
		});
		this.Loop();
	},
	Loop:function(){
		for (var i=0;i<this.Settings.List.length;i++) this.BackUpObject(this.Settings.List[i]);
	},
	SaveData:function(oname){
		this.Settings.List.push(""+oname);
	},
	Save:function(){
		
	},
	BackUpObject:function(objName){
		var text = "" + objName + " = ";
		text += DecodeObject(eval(objName)) + ";";
		ATA.Fs.writeFile(this.Settings.Base_Folder + objName + ".js", text, "utf8", function(err,data) {});
		//ATA.Fs.readFile("server/config.properties", , );
	},
	Restore:function(){
		for (var i=0;i<this.Settings.List.length;i++){
			ATA.Fs.readFile(this.Settings.Base_Folder + this.Settings.List[i] +  + ".js", {encoding:"utf8"}, function(err,data) {
				if (err) return;
				eval(data);
			});
		}
	}
};

ATA.Setups.push(function(){
	//ATA.BackUp.SaveData("Trader.Organizer.Traders");
	setTimeout(function(){
		ATA.BackUp.Setup();
	},5000);
});

// Start the system
ATA.Setup();