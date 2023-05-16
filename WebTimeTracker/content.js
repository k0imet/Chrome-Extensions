window.onbeforeunload = function() {
    chrome.runtime.sendMessage({url: window.location.href, time: Date.now()}, response => {});
};
