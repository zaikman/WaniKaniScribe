var innerText = document.body.innerText;

function replaceText(node, oldChar, newChar)
{
  var current = node.nodeValue;
  var replaced = current.replace(oldChar, newChar);
  node.nodeValue = replaced;
}

function traverse(node, oldChar, newChar)
{
  var children = node.childNodes;
  var childLen = children.length;
  for(var i = 0; i < childLen; i++)
  {
    var child = children.item(i);
    if(child.nodeType == 3)//or if(child instanceof Text)
      replaceText(child, oldChar, newChar);
    else
      traverse(child, oldChar, newChar);
  }
}

chrome.storage.sync.get("api_key", function(data) {
	var api_key = data.api_key;
	console.log(api_key);
	var xhr = new XMLHttpRequest();
	xhr.onload = function () {
	    var json = xhr.responseText;
	    json = JSON.parse(json);

	    if (json.error) {
	        console.log("error processing API request");
	        console.log(json.error.message);
	    } else {
	    	// Build up a list of all known kanji
	    	var knownKanji = {};
	    	console.log("Known kanji: " + json.requested_information.length);
	    	for (var i = 0; i < json.requested_information.length; ++i)
	    	{
	    		//console.log(json.requested_information[i].character);
	    		//knownKanji.push(json.requested_information[i].character);
	    		knownKanji[json.requested_information[i].character] = true;

	    		traverse(document.body, json.requested_information[i].character, "Z");
	    	}


	    	/*
	    	for (var i = 0; i < innerText.length; ++i)
	    	{
	    		if (knownKanji[innerText[i]] != undefined)
	    		{
	    			innerText[i] = 'Z';
	    			console.log("contains " + innerText[i]);
	    		}
	    	}
	    	*/

	    	document.body.innerText = innerText;
	    }
	};
	var url = "http://www.wanikani.com/api/v1.1/user/" + encodeURIComponent(api_key) + "/kanji";
	xhr.open("GET", url);
	xhr.send();
});