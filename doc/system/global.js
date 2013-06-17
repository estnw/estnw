function init() {
	
	var cRollovers = getElementsByClassName(document, 'IMG', 'rollover');
	var oImg = null;
	for(var i=0; i<cRollovers.length; i++) {
		// dont attach events to the active image
		if(cRollovers[i].src.indexOf("_on.") != -1) continue;

		// cache over states
		oImg = getImageProps(cRollovers[i]);
		window[oImg.sImg + "_on"] = new Image();
		window[oImg.sImg + "_on"].src = oImg.sPath + oImg.sImg + "_on" + oImg.sExt;
		
		//attach events
		cRollovers[i].onmouseover = function() { mouseOver(this) }
		cRollovers[i].onmouseout = function() { mouseOut(this) }
	}
}

function mouseOver(obj) {
	var props = getImageProps(obj);
	if(props.sImg.indexOf('_on') == -1) obj.src = props.sPath + props.sImg + '_on' + props.sExt;
}

function mouseOut(obj) {
	var props = getImageProps(obj);
	if(props.sImg.indexOf('_on') != -1) obj.src = props.sPath + props.sImg.replace('_on', '') + props.sExt;
}

function getImageProps(obj) {
	var oImg = new Object();
		oImg.sPath = obj.src.substring( 0, obj.src.lastIndexOf('/') +1 );
		oImg.sImg = obj.src.substring(obj.src.lastIndexOf('/') +1, obj.src.lastIndexOf('.'));
		oImg.sExt = (obj.src.indexOf('.jpg') !=-1) ? '.jpg' : '.gif';
	return oImg;
}

function getRootPath() {
	return window.location.protocol + "//" + window.location.host;
}

function getOverState(obj) {
	var reExt = /(.gif|.jpg)$/;
	return obj.src.replace(reExt, '_on$1')
}

function writeSWF(url, width, height) {
	document.write('<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,19,0" width="' + width + '" height="' + height + '" title="">');
	document.write('<param name="movie" value="../../js/' + url + '">');
	document.write('<param name="quality" value="high">');
	document.write('<param name="wmode" value="transparent">');
	document.write('<embed src="../../js/' + url + '" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" width="' + width + '" height="' + height + '" wmode="transparent"></embed>');
	document.write('</object>');	
}

var newWin = null;
function openWin(url, w, h) {
	var props = "width=" + w + ",height=" + h + ",toolbar=no,menubar=no,personalbar=no,copyhistory=no,resizable=yes,scrollbars=yes";
	var handle = "oNewWin";
	if(newWin && !newWin.closed) {
		newWin.focus();
	}
	newWin = window.open(url, handle, props);
}

addEvent(window, 'load', init);

/*
    Written by Jonathan Snook, http://www.snook.ca/jonathan
    Add-ons by Robert Nyman, http://www.robertnyman.com
*/

function getElementsByClassName(oElm, strTagName, strClassName){
    var arrElements = (strTagName == "*" && oElm.all)? oElm.all : oElm.getElementsByTagName(strTagName);
    var arrReturnElements = new Array();
    strClassName = strClassName.replace(/\-/g, "\\-");
    var oRegExp = new RegExp("(^|\\s)" + strClassName + "(\\s|$)");
    var oElement;
    for(var i=0; i<arrElements.length; i++){
        oElement = arrElements[i];      
        if(oRegExp.test(oElement.className)){
            arrReturnElements.push(oElement);
        }   
    }
    return (arrReturnElements)
}

// written by Dean Edwards, 2005
// with input from Tino Zijdel

// http://dean.edwards.name/weblog/2005/10/add-event/

function addEvent(element, type, handler) {
	// assign each event handler a unique ID
	if (!handler.$$guid) handler.$$guid = addEvent.guid++;
	// create a hash table of event types for the element
	if (!element.events) element.events = {};
	// create a hash table of event handlers for each element/event pair
	var handlers = element.events[type];
	if (!handlers) {
		handlers = element.events[type] = {};
		// store the existing event handler (if there is one)
		if (element["on" + type]) {
			handlers[0] = element["on" + type];
		}
	}
	// store the event handler in the hash table
	handlers[handler.$$guid] = handler;
	// assign a global event handler to do all the work
	element["on" + type] = handleEvent;
};
// a counter used to create unique IDs
addEvent.guid = 1;

function removeEvent(element, type, handler) {
	// delete the event handler from the hash table
	if (element.events && element.events[type]) {
		delete element.events[type][handler.$$guid];
	}
};

function handleEvent(event) {
	var returnValue = true;
	// grab the event object (IE uses a global event object)
	event = event || fixEvent(window.event);
	// get a reference to the hash table of event handlers
	var handlers = this.events[event.type];
	// execute each event handler
	for (var i in handlers) {
		this.$$handleEvent = handlers[i];
		if (this.$$handleEvent(event) === false) {
			returnValue = false;
		}
	}
	return returnValue;
};

function fixEvent(event) {
	// add W3C standard event methods
	event.preventDefault = fixEvent.preventDefault;
	event.stopPropagation = fixEvent.stopPropagation;
	return event;
};
fixEvent.preventDefault = function() {
	this.returnValue = false;
};
fixEvent.stopPropagation = function() {
	this.cancelBubble = true;
};