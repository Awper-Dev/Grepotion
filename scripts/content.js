// --- Content Script ---
// Has access to the game DOM


// Setup content script to be ready to schedule buildings

chrome.runtime.sendMessage('getQueueArray', (queue) => {
    if (queue) {
        if (queue.length != 0) {
            let first = queue[0];

            // Go to city view
            let cityButton = document.querySelector("div.city_overview");
            cityButton.click();

            // Go to main view
            let mainButton = document.querySelector("#building_main_area_main");
            mainButton.click();

            // Check for not possible button
            let notPossibleId = "building_main_not_possible_button_" + first.split("_")[2];
            let notPossible = document.querySelector("#" + notPossibleId);

            if (notPossible) {
                return;
            } 

            let buildButton = document.querySelector("#" + first + " a.build_up");


            // Check queue!
            buildButton.click();
            chrome.runtime.sendMessage('buildingScheduled', (resp) => {});
        }
    }
});