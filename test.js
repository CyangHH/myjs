/**
 * 【Cyang JS简易框架】
 * 
 * <EventUtil 事件相关> 、<CookieUtil cookie操作>、<createXHR 创建XHR对象>、<SubCookieUtil 子cookie操作>
 *
 * @date     2017-04-14
 * 
 * @author   Cyang
 */

var Cyang = Cyang || {};
/**
 * @class EventUtil
 * 用来处理不同浏览器事件的兼容性问题
 * 
 * @method  addHandler      绑定事件
 * @param     {element}
 * @param     {type}
 * @param     {handler}
 * @returns   void
 * 
 * @method  removeHandler  	移除事件
 * @param     {element}
 * @param     {type}
 * @param     {handler}
 * @returns   void
 * 
 * @method  getEvent
 * @param     {event}
 * @returns   event
 * 
 * @method  getTarget
 * @param     {event}
 * @returns   target
 * 
 * @method  preventDefault	取消默认事件
 * @param     {event}
 * @returns   void
 *
 * @method  stopPropagation 停止事件传播
 * @param     {event}
 * @returns   void
 * 
 * @method  getRelatedTarget 鼠标移入移出事件
 * @param     {event}
 * @returns   {element}
 * @date     2017-04-16
 */
Cyang.EventUtil =
	{
		addHandler: function (element, type, handler) {
			if (element.addEventListener) {
				element.addEventListener(type, handler, false);
			}
			else if (element.attachEvent) {
				element.attachEvent("on" + type, handler);
			}
			else {
				element["on" + type] = handler;
			}
		},

		removeHandler: function (element, type, handler) {
			if (element.removeEventListener) {
				element.removeEventListener(type, handler, false);
			}
			else if (element.detachEvent) {
				element.detachEvent("on" + type, handler);
			}
			else {
				element["on" + type] = null;
			}
		},
		getEvent: function (event) {
			return event ? event : window.event;
		},
		getTarget: function (event) {
			return event.target || event.srcElement;
		},
		preventDefault: function (event) {
			if (event.preventDefault) {
				event.preventDefault();
			} else {
				event.returnValue = false;
			}
		},
		stopPropagation: function (event) {
			if (event.stopPropagation) {
				event.stopPropagation();
			} else {
				event.cancelBubble = true;
			}
		},
		getRelatedTarget: function (event) {
			if (event.relatedTarget) {
				return event.relatedTarget;
			} else if (event.toElement) {
				return event.toElement;
			} else if (event.fromElement) {
				return event.fromElement;
			} else {
				return null;
			}
		}
	};
/**
 * @class ClipboardEdit
 * 处理剪切板浏览器兼容性问题
 * 
 * @method  getCharCode
 * @param     {event}
 * @returns   {Number}   keyCode
 * 
 * @method  getClipboardText
 * @param     {event}
 * @returns   {string} clipboardData
 * 
 * @method  setClipboardText
 * @param     {event}
 * @param     {string}
 * @returns   {string}  clipboardData
 * @date     2017-04-16
 */
Cyang.ClipboardEdit = {
	getCharCode: function (event) {
		if (typeof event.charCode == "number") {
			return event.charCode;
		} else {
			return event.keyCode;
		}
	},
	//访问剪切板
	getClipboardText: function (event) {
		var clipboardData = (event.clipboardData || window.clipboardData);
		return clipboardData.getData("text");
	},
	setClipboardText: function (event, value) {
		if (event.clipboardData) {
			return event.clipboardData.setData("text/plain", value);
		} else if (window.clipboardData) {
			return window.clipboardData.setData("text", value);
		}
	}
};
/**
 * @class TextEdit
 * 处理getInnerText浏览器兼容性问题
 * 
 * @method getInnerText
 * @param    {element}   
 * @returns  {string}  textContent
 *  
 * @method setInnerText
 * @param    {element}   
 * @param    {string}   text
 * @returns  {string}   textContent
 *
 * @date     2017-04-16
 */
Cyang.TextEdit = {
	getInnerText: function (element) {
		return (typeof element.textContent == "string") ? element.textContent : element.innerText;
	},
	setInnerText: function (element, text) {
		if (typeof element.textContent == "string") {
			element.textContent = text;
		} else {
			elemnet.innerText = text;
		}
	}

};
/**
 * @class ajax
 * ajax请求 
 * createXHR方法为惰性载入
 * @method get
 * @param    {string}    type
 * @param    {string}    url         
 * @param    {string}  data 
 * @param    {function}  callback       
 * @returns  {function}  callback(JSON)   

 * @date     2017-04-16
 */
Cyang.ajax = function (type, url, data, callback) {
	var createXHR = function () {
		if (typeof XMLHttpRequest != "undefined") {
			arguments.callee = function () {
				return new XMLHttpRequest();
			}
		}
		else if (typeof ActiveXObject != "undefined") {
			arguments.callee = function () {
				if (typeof arguments.callee.activeXString != "string") {
					var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0", "MSXML2.XMLHttp"];
					for (var i = 0, len = versions.length; i < len; i++) {
						try {
							var XHR = new ActiveXObject(versions[i]);
							arguments.callee.activeXString = versions[i];
							return XHR;
						}
						catch (ex) {
							//错误捕获后 处理
						}
					}
				}
				return new ActiveXObject(arguments.callee.activeXString);
			};
		}
		else {
			arguments.callee = function () {
				throw new Error("No XHR object available");
			}
		}
		return arguments.callee();
	};
	var XHR = createXHR();
	XHR.onreadystatechange = function () {
		if (this.readyState == 4) {
			if (this.status >= 200 && this.status < 300 || this.status == 304) {
				return callback(JSON.parse(this.responseText));
			} else {
				//请求GG了
			}
		}
	};
	if (type.toLowerCase() === "get") {
		XHR.open('get', url + data, true);
		XHR.send(null);
	}
	else {
		XHR.open("post", url, true);
		XHR.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		XHR.send(data);
	}
}
/**
 * @class serialize
 * ajax POST表单序列化
 * @method  serialize
 * @param    {obj}    form      
 * @returns  {array}  form   

 * @date     2017-05-1
 */
Cyang.serialize = function (form) {
	var parts = new Array();
	var field = null;
	for (var i = 0, len = form.elements.length; i < len; i++) {
		field = form.elements[i];
		switch (field.type) {
			case "select-one":
			case "select-multipe":
				for (var j = 0, optLen = field.options.length; j < optLen; j++) {
					var option = field.options[j];

					if (option.selected) {
						var optValue = "";
						if (option.hasAttribute) {
							optValue = (option.hasAttribute("value") ? option.value : option.text);
						}
						else {
							optValue = (option.attributes["value"].specified ? option.value : option.text);
						}
						parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(optValue));
					}
				}
				break;
			case undefined:
			case "file":
			case "submit":
			case "reset":
			case "button":
				break;
			case "radio":
			case "checkbox":
				if (!field.checked) {
					break;
				}
			default:
				parts.push(encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value));
		}
	}
	return parts.join("&");
}
/**
 * @class CookieUtil
 * 普通Cookie操作函数
 *
 * @method get
 * @param  	 {string}  name
 * @returns  {string}  cookieValue
 * 
 * @method set
 * @param    {string}  name
 * @param 	 {string}  value
 * @param    {string}  expires
 * @param    {string}  path
 * @param    {string}  domain
 * @param    {string}  secure
 * @returns  {string}  cookie
 * 
 * @method unset
 * @param    {string}  name
 * @param 	 {string}  value
 * @param    {string}  domain
 * @param    {string}  secure
 * @returns  void
 * @date     2017-04-13
 */
Cyang.CookieUtil = {
	get: function (name) {
		var cookieName = encodeURIComponent(name) + "=",
			cookieStart = document.cookie.indexOf(cookieName),
			cookieValue = null;
		if (cookieStart > -1) {
			var cookieEnd = document.cookie.indexOf(";", cookieStart)
			if (cookieEnd == -1) {
				cookieEnd = document.cookie.length;
			}
			cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
		}
		return cookieValue;
	},
	set: function (name, value, expires, path, domain, secure) {
		var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value);
		if (expires instanceof Date) {
			cookieText += ";expires=" + expires.toGMTstring();
		}
		if (path) {
			cookieText += ";path=" + path;
		}
		if (domain) {
			cookieText += ";domain=" + domain;
		}
		if (secure) {
			cookieText += ";secure";
		}
		document.cookie = cookieText;
	},
	unset: function (name, path, domain, secure) {
		this.set(name, "", new Date(0), path, domain, secure);
	}
};

/**
 * @class SubCookieUtil
 * 子Cookie操作函数
 * MD太长了 参考上面的
 *
 * @date     2017-04-13
 */
Cyang.SubCookieUtil = {
	get: function (name, subName) {
		var subCookies = this.getAll(name);
		if (subCookies) {
			return subCookies[subName];
		} else {
			return null;
		}
	},
	getAll: function (name) {
		var cookieName = encodeURIComponent(name) + "=",
			cookieStart = document.cookie.indexOf(cookieName),
			cookieValue = null,
			result = {};
		if (cookieStart > -1) {
			var cookieEnd = document.cookie.indexOf(";", cookieStart)
			if (cookieEnd == -1) {
				cookieEnd = document.cookie.length;
			}
			cookieValue = document.cookie.substring(cookieStart + cookieName.length, cookieEnd);
			if (cookieValue.length > 0) {
				var subCookies = cookieValue.split("&");
				for (var i = 0, len = subCookies.length; i < len; i++) {
					var parts = subCookies[i].split("=");
					result[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
				}
				return result;
			}
		}
		return null;
	},
	set: function (name, subName, value, expires, path, domain, secure) {
		var subCookies = this.getAll(name) || {};
		subCookies[subName] = value;
		this.setAll(name, subCookies, expires, path, domain, secure);
	},
	setAll: function (name, subCookies, expires, path, domain, secure) {
		var cookieText = encodeURIComponent(name) + "=";
		var subcookiesParts = new Array();
		for (var subName in subCookies) {
			if (subName.length > 0 && subCookies.hasOwnProperty(subName)) {
				subcookiesParts.push(encodeURIComponent(subName) + "=" + encodeURIComponent(subCookies[subName]));
			}
		}
		if (subcookiesParts.length > 0) {
			cookieText += subcookiesParts.join("&");
			if (expires instanceof Date) {
				cookieText += ";expires=" + expires.toGMTstring();
			}
			if (path) {
				cookieText += ";path=" + path;
			}
			if (domain) {
				cookieText += ";domain=" + domain;
			}
			if (secure) {
				cookieText += ";secure";
			}
		} else {
			cookieText += ";expires=" + (new Date(0)).toGMTString();
		}
		document.cookie = cookieText;
	},
	unset: function (name, subName, path, domain, secure) {
		var subCookies = this.getAll(name);
		if (subCookies) {
			delete subCookies[subName];
			this.setAll(name, subCookies, null, path, domain, secure);
		}
	},
	unsetAll: function (name, path, domain, secure) {
		this.setAll(name, null, new Date(0), path, domain, secure);
	}
};

/**
 * 通用动画处理函数
 * @method hold
 * 用来处理隐藏动画 
 *
 * @param    {string}   id    元素ID  
 * @param    {number}   step  步进
 * @param    {number} 	max   最大范围	
 * @param    {number}   time  间隔 
 * @returns  void
 *
 * @date     2017-04-12
 */
/*function hold(id, step, max, time) {
	setTimeout(fun(), time);
	var fun = function () {
		var div = document.getElementById(id);
		var left = parseInt(div.style.left) + step;
		div.style.left = left + "px";
		if (left < max) {
			setTimeout(arguments.callee, time);
		}
	}

}*/

//<框架代码结束 自定义代码开始>
//等到文档全部载入后 
//lonin页面登陆JS
Cyang.admin_login = function () {
    var id_form1 = document.getElementById("form1");
    if (id_form1 == undefined)
        return;
    Cyang.EventUtil.addHandler(id_form1, "submit", function (event) {
        event = Cyang.EventUtil.getEvent(event);
        Cyang.EventUtil.preventDefault(event);
        var inputs = document.getElementsByTagName("input");
        for (var i = 0, j = inputs.length; i < j; i++) {
            if (inputs[i].name == "username" || inputs[i].name == "password") {
                if (inputs[i].value == "") {

                    if (inputs[i].name == "username") {
                        alert("请输入账号");
                    }
                    else {
                        alert("请输入密码");
                    }
                    inputs[i].focus();
                    return;
                }
            }
        }
        Cyang.ajax("post", id_form1.action, Cyang.serialize(id_form1), function (call) {
            if (call.status == "200") {
                location.search = "?controller=admin&method=index";
            }
            else {
                alert("登陆失败");
                location.reload();
            }
        });
    });

}
//load方法 根据页面URL，自动载入相关方法。请注意URL，如果URL地址重写过，请修改匹配正则！
Cyang.load = function () {
    var reg_c = /controller=(\w+)(&|$)/gi; //controller的正则
    var res_c = reg_c.exec(location.search);
    switch (res_c[1]) {
        case 'admin': Cyang.admin_common(); break;
    }
    var reg_m = /method=(\w+)(&|$)/gi; //method的正则
    var res_m = reg_m.exec(location.search);
    switch (res_c[1] + '_' + res_m[1]) {
        case 'admin_newsadd': Cyang.admin_newsadd(); break;
        case 'admin_newslist': Cyang.admin_newslist(); break;
        case 'admin_login': Cyang.admin_login(); break;
    }
}

Cyang.EventUtil.addHandler(window, "load", function () {
    Cyang.load();
});
