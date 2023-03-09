function startAlarm() {
    chrome.runtime.sendMessage('start', (response) => {});
}

function stopAlarm() {
    chrome.runtime.sendMessage('stop', (response) => {});
}

document.getElementById('startAlarm').onclick = startAlarm;
document.getElementById('stopAlarm').onclick = stopAlarm;