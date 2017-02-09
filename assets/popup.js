window.onload = function() {
	chrome.runtime.sendMessage({message	:	"ListCheck"}, function(response){
		if (msg.isBlacklisted	=== false){
			$("#blacklistSite").show();
			$("#whitelistSite").hide();
		} else {
			$("#blacklistSite").hide();
			$("#whitelistSite").show();
		}
	});
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	//document.body.innerHTML	=	document.body.innerHTML + "<br>"+msg;
	
	if (msg.isBlacklisted	=== false){
		$("#blacklistSite").show();
		$("#whitelistSite").hide();
	} else {
		$("#blacklistSite").hide();
		$("#whitelistSite").show();
	}
	
});


document.addEventListener('DOMContentLoaded', function(){
	document.getElementById("blacklistSite").addEventListener("click", blacklistOnClick);
	document.getElementById("whitelistSite").addEventListener("click", whitelistOnClick);
});

function blacklistOnClick(){
	chrome.runtime.sendMessage({message	:	"BLSite"}, function(response){
		$("#blacklistSite").hide();
		$("#whitelistSite").show();
	});
}

function whitelistOnClick(){
	chrome.runtime.sendMessage({message	:	"WLSite"}, function(response){
		$("#blacklistSite").show();
		$("#whitelistSite").hide();
	});
}