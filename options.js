// Handles the user's input to block a website URL

const fieldset = document.querySelector('fieldset');  // Get the fieldset element in the HTML

// After the user types a URL and saves it, forever load it visually when the page opens
window.onload = function() {
  const blockButtonIDs = ['blockButton1', 'blockButton2', 'blockButton3', 'blockButton4', 'blockButton5'];

  // Go through each button ID in the list
  blockButtonIDs.forEach((blockButtonID) => { 

    // Check if there's already a saved URL for this block button
    chrome.storage.sync.get([blockButtonID], function(result) {
      const savedURL = result[blockButtonID];  // Get the saved URL for the current block button

      // If a URL exists for this block button
      if (savedURL) { 

        // Link each button to its matching input field through mapping
        const inputIDMapping = { 
          blockButton1: 'inputBlock1',
          blockButton2: 'inputBlock2',
          blockButton3: 'inputBlock3',
          blockButton4: 'inputBlock4',
          blockButton5: 'inputBlock5'
        };

        const inputID = inputIDMapping[blockButtonID];  // Find input field that matches the clicked button
        const inputField = document.getElementById(inputID);  // Find the input field in the HTML

        if (inputField) {  // Check if the input field exists in the HTML
          inputField.value = savedURL;  // Show the saved URL in the input field to the user
        }
      }
    });
  });
};

// Store URL data in storage and send message to background to apply blocking
fieldset.addEventListener("click", (event) => { 

  // Listen to user clicks
  if (event.target.tagName === 'BUTTON') {  // Check if they clicked on button

    const blockID = event.target.id;  // Get the ID of which button was clicked

    // Link each button to its matching input field through mapping
    const inputIDMapping = {
      blockButton1: 'inputBlock1',
      blockButton2: 'inputBlock2',
      blockButton3: 'inputBlock3',
      blockButton4: 'inputBlock4',
      blockButton5: 'inputBlock5'
    };

    const inputID = inputIDMapping[blockID];  // Find input field that matches the clicked button

    if (inputID) {  // If the input was valid and one of the 5 buttons
      const input = document.getElementById(inputID);  // Find the input field in the HTML
      const newURL = input.value;  // Get the value of the input, what the user typed

      // Get the current URL stored for this block button
      chrome.storage.sync.get(blockID, function(result) {
        let oldURL;  // Create a variable to store the old URL

        // If it is the first time the user is entering a URL to block
        if (result[blockID] === undefined || result[blockID] === null) {
          oldURL = null;  // No previous URL exists
        } else {
          oldURL = result[blockID];  // The URL before this one is now the oldURL
        }

        // Save the new URL as "blockID" in chrome storage
        chrome.storage.sync.set({
          [blockID]: newURL, 
        }, function() {
          console.log('New URL saved:', newURL);
          console.log('Old URL was:', oldURL);

          // Send a message to background to apply the blocking rule for the new URL
          chrome.runtime.sendMessage({ action: 'setURLblock', blockedURL: newURL, blockID });
        });
      });
    } else {
      console.error('No input field found for this button');  // Error if no input field is found
    }
  }
});