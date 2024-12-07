// Handles dynamic URL blocking rules for the extension

// Clear all dynamic rules at the start of the script
const idsToRemove = [];  // Create an empty array to store the rule IDs to remove

// Loop through numbers 1 to 1000 and store them in an array
for (let i = 1; i <= 1000; i++) {  
    idsToRemove.push(i);  // Add each rule ID to the array
}

// Use the array to remove old rules consistently
chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: idsToRemove  // Remove the old rules using the generated array of IDs
});

// Listen to messages sent through the extension
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

    // If the user has clicked to block a URL
    if (message.action === 'setURLblock') {

        const blockedURL = message.blockedURL;  // Get the URL the user wants to block
        const blockID = message.blockID;  // Get the ID of the block button clicked

        // Link each block button to a simple number through mapping
        const ruleIDMapping = {
            blockButton1: 1,
            blockButton2: 2,
            blockButton3: 3,
            blockButton4: 4,
            blockButton5: 5
        };

        // Set the rule ID based on the button clicked, or default to 0 if not a valid button
        const ruleID = ruleIDMapping[blockID] || 0;  // Get the corresponding rule ID

        // Get the list of active blocking rules
        chrome.declarativeNetRequest.getDynamicRules({}, function(rules) {

            // Check if there is already a blocked URL
            let existingRule = null;  // Assume there's no rule for the blocked URL initially
            for (let i = 0; i < rules.length; i++) {  // Go through all active rules
                if (rules[i].id === ruleID) {  // If a rule with the same ID is found
                    existingRule = rules[i];  // Save the matching rule to update it later
                    break;  // Stop checking further once a match is found
                }
            }

            // Create a new rule to redirect the newly blocked website
            const rule = {
                action: {
                    type: "redirect",
                    redirect: { extensionPath: "/redirect.html" }  // Define the redirect path
                },
                condition: {
                    urlFilter: blockedURL,  // URL to be blocked
                    resourceTypes: ["main_frame"]  // Apply the rule to the main frame
                },
                id: ruleID  // Set the rule ID
            };

            // If there is an old block in place, remove it before adding the new one
            if (existingRule) {
                chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: [ruleID]  // Remove the existing rule before adding the new one
                }, function() {
                    console.log(`Old URL removed, new blocked website: ${blockedURL}`);
                    // Add the new redirection block
                    chrome.declarativeNetRequest.updateDynamicRules({
                        addRules: [rule]
                    });
                });
            } else {
                // No existing rule, just add the new redirection block
                chrome.declarativeNetRequest.updateDynamicRules({
                    addRules: [rule]
                }, function() {
                    console.log(`New blocked website: ${blockedURL}`);
                });
            }
        });
    }
});