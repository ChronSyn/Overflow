if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

function extractDomain(url) {
    var domain;
    //find & remove protocol (http, ftp, etc.) and get domain
    if (url.indexOf("://") > -1) {
        domain = url.split('/')[2];
    }
    else {
        domain = url.split('/')[0];
    }

    //find & remove port number
    domain = domain.split(':')[0];

    return domain;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.message	==	"BLSite"){
		chrome.tabs.query({
			active			:	true,
			currentWindow	:	true
		}, function(tabs){
			//var blacklistedSites	=	[];
			chrome.storage.local.get('blacklistedSites', function(result){
				console.log(result);
				var blacklistedSites	=	result;
				blacklistedSites.sites	=	[];
				blacklistedSites.sites.push(extractDomain(tabs[0].url));
				chrome.storage.local.set({"blacklistedSites": blacklistedSites});
			});
			//console.log(tabs[0]);
			chrome.tabs.executeScript(tabs[0].id, {file: "libs/jquery-1.12.4.js"}, function() {
					
				var code =	'$("body").children().each(function(){'+
									'if ($(this).css("z-index") < $("body").css("z-index")){'+
										'$(this).css("z-index","-999999999");'+
									'}'+
							'});';
				chrome.tabs.executeScript(tabs[0].id, {code:code});
				
				var code2 = '$("body").css({"overflow-y" : "scroll"})';
				chrome.tabs.executeScript(tabs[0].id, {code:code2});
			});
			
			sendResponse({response	:	extractDomain(tabs[0].url) + " has been blacklisted!"});
		});
	};
	
	if (request.message	==	"WLSite"){
		chrome.tabs.query({
			active			:	true,
			currentWindow	:	true
		}, function(tabs){
			//var blacklistedSites	=	[];
			chrome.storage.local.get('blacklistedSites', function(result){
				var thisIndex = result.blacklistedSites.sites.indexOf(tabs[0].url);
				result.blacklistedSites.sites.splice(thisIndex, 1);
				chrome.storage.local.set({"blacklistedSites": result});
			});
			sendResponse({response	:	extractDomain(tabs[0].url) + " has been whitelisted!"});
		});
	};
	
	if (request.message	==	"ListCheck"){
		console.log(request.message);
		chrome.tabs.query({
			active			:	true,
			currentWindow	:	true
		}, function(tabs){
			console.log(extractDomain(tabs[0].url));
			//var blacklistedSites	=	[];
			chrome.storage.local.get('blacklistedSites', function(result){
				var thisIndex = result.blacklistedSites.sites.indexOf(extractDomain(tabs[0].url));
				if (thisIndex >= 0){
					chrome.runtime.sendMessage({isBlacklisted	:	true});
				} else {
					chrome.runtime.sendMessage({isBlacklisted	:	false});
				}
			});
			
		});
	}
	
});

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
	if (changeInfo.status == 'complete' && tab.active) {
		var blacklistedSites	=	[];
		chrome.storage.local.get('blacklistedSites', function(result){
			if (extractDomain(tab.url).indexOf(result.blacklistedSites.sites) > -1){
				console.log("Website in blacklist, attempting to fix...");
				chrome.runtime.sendMessage({isBlacklisted	:	true});
				
				chrome.tabs.executeScript(tabId, {file: "libs/jquery-1.12.4.js"}, function() {
					
					var code =	'$("body").children().each(function(){'+
										'if ($(this).css("z-index") < $("body").css("z-index")){'+
											'$(this).css("z-index","-999999999");'+
										'}'+
								'});';
					chrome.tabs.executeScript(tabId, {code:code});
					
					var code2 = '$("body").css({"overflow-y" : "scroll"})';
					chrome.tabs.executeScript(tabId, {code:code2});
				});
				
			} else {
				console.log("Not in list");
				chrome.runtime.sendMessage({isBlacklisted	:	false});
			}
		});		
	}
});