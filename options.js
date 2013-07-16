// Copyright (c) 2012, Derek Guenther
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0

// Saves options to Chrome Sync.
function save_options() {
    var key_field = document.getElementById("api_key");
    var api_key = key_field.value;

    // Clear the storage so we don't persist old data.
    chrome.storage.sync.remove("api_key", function() {

        // Clear our local cached data
        chrome.storage.local.clear();

        // Test out the new api key.
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            var json = xhr.responseText;
            json = JSON.parse(json);

            if (json.error) {
                // If there's an error, update the badge.
                chrome.browserAction.setBadgeText({text:"!"});
                // Also, notify the user.
                var status = document.getElementById("status");
                status.innerHTML = "Sorry, that API key isn't valid. Please try again!";
                setTimeout(function() {
                  status.innerHTML = "";
                }, 4000);
            } else {
                // Store the api key in Chrome Sync.
                chrome.storage.sync.set({"api_key": api_key}, function() {

                    // Update status to let user know options were saved.
                    var status = document.getElementById("status");
                    status.innerHTML = "Your options have been saved. Thanks, " + String(json.user_information.username) + "!";
                    setTimeout(function() {
                    status.innerHTML = "";
                    }, 4000);
                });
            }
        };
        var url = "http://www.wanikani.com/api/v1.1/user/" + encodeURIComponent(api_key) + "/study-queue";
        xhr.open("GET", url);
        xhr.send();

    });
}

// Restore all options to their form elements.
function restore_options() {
  restore_api_key();
}

// Restore API key text box.
function restore_api_key() {
    chrome.storage.sync.get("api_key", function(data) {
        var api_key = data.api_key;
        // If no API key is stored, leave the text box blank.
        // We don't set a default value for the API key because it must be set
        // for the extension to work.
        if (!api_key) {
            return;
        }
        var key_field = document.getElementById("api_key");
        key_field.value = api_key;
    });
}

function bind_save() {
    document.querySelector('#save').addEventListener('click', save_options);
}

document.addEventListener('DOMContentLoaded', restore_options);
document.addEventListener('DOMContentLoaded', bind_save);