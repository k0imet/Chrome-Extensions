let urlToTime = {};

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        urlToTime[changeInfo.url] = Date.now();
        sendToGitHub(urlToTime);
    }
});

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        urlToTime[tab.url] = Date.now();
        sendToGitHub(urlToTime);
    });
});

function sendToGitHub(data) {
    const githubToken = 'github_pat_';  // Replace this with your GitHub personal access token
    const repo = 'k0imet/test';  // Replace with your account and repository
    const filename = 'data.json';  // Replace with your filename
    const content = btoa(JSON.stringify(data));  // Convert data to base64
    const url = `https://api.github.com/repos/${repo}/contents/${filename}`;

    fetch(url, {
        headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json',
        },
        method: 'PUT',
        body: JSON.stringify({
            message: 'Update tracking data',
            content: content,
        })
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch((error) => console.error('Error:', error));
}
