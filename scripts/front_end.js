// Query queue and set

fetchAndSetQueue();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "buildingScheduled") {
        console.log("reduce queue");
        popQueueString();
    }
});

function startAlarm() {
    chrome.runtime.sendMessage('start', (response) => {});
}

function stopAlarm() {
    chrome.runtime.sendMessage('stop', (response) => {});
}

function fetchAndSetQueue() {
    chrome.runtime.sendMessage('getQueueArray', (queue) => {
        let queueElement = document.getElementById("queue-string");

        queueElement.innerText = parseQueueArray(queue);
    })
}

function scheduleBuilding(name) {
    chrome.runtime.sendMessage(name, (response) => {
        if (response === 'ok') {
            addToQueueString(name);
        }
    })
}

function addToQueueString(name) {
    let queue = document.getElementById("queue-string");
    let current = queue.innerText;

    if (current === "Empty!") {
        queue.innerText = name;
        return;
    }

    queue.innerText = current + "->" + name;
}

function popQueueString() {
    let queue = document.getElementById("queue-string");
    let current = queue.innerText;

    let split = current.split("->");

    if (split.length == 1) {
        queue.innerText = "Empty!";
        return;
    }

    let slice = split.slice(1);

    queue.innerText = parseQueueArray(slice);
}

function parseQueueArray(queue) {
    if (queue.length == 0) {
        return "Empty!";
    }

    return queue.map((element) => element.substring(14)).join("->");
}

document.getElementById('emptyQueue').onclick = () => {
    let queue = document.getElementById("queue-string");

    queue.innerText = "Empty!";
    chrome.runtime.sendMessage("emptyQueue", (response) => {})
}

document.getElementById('startAlarm').onclick = startAlarm;
document.getElementById('stopAlarm').onclick = stopAlarm;

document.getElementById('main').onclick = () => scheduleBuilding("main");
document.getElementById('hide').onclick = () => scheduleBuilding("hide");
document.getElementById('lumber').onclick = () => scheduleBuilding("lumber");
document.getElementById('stoner').onclick = () => scheduleBuilding("stoner");
document.getElementById('ironer').onclick = () => scheduleBuilding("ironer");
document.getElementById('market').onclick = () => scheduleBuilding("market");
document.getElementById('docks').onclick = () => scheduleBuilding("docks");
document.getElementById('barracks').onclick = () => scheduleBuilding("barracks");
document.getElementById('wall').onclick = () => scheduleBuilding("wall");
document.getElementById('storage').onclick = () => scheduleBuilding("storage");
document.getElementById('farm').onclick = () => scheduleBuilding("farm");
document.getElementById('academy').onclick = () => scheduleBuilding("academy");
document.getElementById('temple').onclick = () => scheduleBuilding("temple");