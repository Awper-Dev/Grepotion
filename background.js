// --- Service Worker ---
// Periodically activates content scripts and manages queue

import Queue from "./queue.js";

let ids = [
    "building_main_main", // Senaat
    "building_main_hide", // Grot
    "building_main_lumber", // Houthakker
    "building_main_stoner", // Steengroeve
    "building_main_ironer", // Zilvermijn
    "building_main_market", // Marktplaats
    "building_main_docks", // Haven
    "building_main_barracks", // Kazerne
    "building_main_wall", // Muur
    "building_main_storage", // Pakhuis
    "building_main_farm", // Boerderij
    "building_main_academy", // Academie
    "building_main_temple" // Tempel
]

let activatedTab = null;
let queue = new Queue();

// The alarm somehow gets automatically created...
// Make sure there's nothing going on already
chrome.alarms.clearAll();
chrome.alarms.getAll((alarms) => console.log(alarms));

// Save the grepolis tab once the icon is clicked
chrome.action.onClicked.addListener((tab) => {
    activatedTab = tab;
})

// Listen for alarm. Periodically check whether there is space in the queue
chrome.alarms.onAlarm.addListener((alarm) => {
    console.log("[Grepotion] Polling... " + alarm.name);

    if (activatedTab) {
        chrome.scripting.executeScript({
            target: {tabId: activatedTab.id},
            files: ['scripts/content.js']
        });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // Register a new building onto the queue
    if (message.startsWith("register")) {
        let buildingName = message.substring(10, message.length);
        tryRegisterBuilding(buildingName);

        return sendResponse("ok");
    }

    // Return the top item of the queue to the content script
    if (message === 'get-next') {
        sendResponse(returnNextBuilding());
        return;
    }

    if (message === 'start') {
        handleFunctionalityStart();

        return sendResponse("ok");
    }

    if (message === 'stop') {
        chrome.alarms.clear("queue_poll");

        return sendResponse("ok");
    }
})

function handleFunctionalityStart() {
    console.log("starting");

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        var current = tabs[0];
        activatedTab = current;
    });

    chrome.alarms.create("queue_poll", {
        "periodInMinutes": 1
    });
}

function tryRegisterBuilding(name) {
    let internalName = "building_main_" + buildingName;

    if (ids.includes(internalName)) {
        queue.enqueue(internalName);
    }
}

function returnNextBuilding() {
    if (queue.isEmpty) {
        return null;
    }

    return queue.dequeue();
}



