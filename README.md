# Simple Website Blocker
#### Video Demo:  <https://www.youtube.com/watch?v=0jeqCE8irpQ>

## Resources:

- CSS
- HTML
- JavaScript
- json
- png

#### Description:

My project is a Google Chrome extension for simple website blocking, where the user can type a URL they want to block, and when they try to access it, they are redirected to a custom page provided by the extension. 

I chose this project because I believe procrastination and impulsive browsing are two common issues in today’s digital world. Throughout CS50, I was most interested in learning more about JavaScript. As someone who frequently uses Google Chrome extensions and has even explored some of their code out of curiosity in the past, the opportunity to build one myself felt like an exciting and practical way to combine these interests.

## manifest.json:

The manifest.json file is a standard and essential component for Google Chrome extensions, making it mandatory to include as the starting point of my program. In essence, it's the metadata file that helps tell Google Chrome how the extension works.

manifest_version: I used version 3 as it's the latest standard for Google Chrome extensions. It provides features such as declarativeNetRequest, which is essential for managing network requests.

version: 1.0.0 As the first release of the extension.

name and description: Both are simple and straightforward explanations for the extension's function.

permissions: The extension needs permission to use the declarativeNetRequest feature to block websites, and the storage feature to save user settings, such as blocked URLs. 

background: Manifest version 3 requires using service workers to access background JavaScript, and "service_worker": "background.js" is the standard approach to enable this.

host_permissions: Initially, I considered applying permissions to all protocols. However, for the finalized version of the project, I decided to restrict them to only HTTP and HTTPS protocols to focus the extension on standard web browsing, as other protocols may pose security issues.

web_accessible_resources: This allows the extension to access redirect.html for any matching HTTP or HTTPS URL, as specified in the conditions.

Icons and Action: I decided to add icons of different sizes to represent the extension. The 16x16 icon is used as the default icon in the Chrome toolbar and the Extensions page, while the other sizes are for various display contexts, such as the Extensions page and potentially the Web Store in the future.

## options.html , redirect.html and styles.css:

I wanted to give users the ability to choose which website URLs to block, so I designed a simple options page to make this work. The redirect page, on the other hand, is the page the user sees after they attempt to open a blocked URL maybe by accident or habit.

Both the options and redirect pages have similar designs, inspired by the CS50 Trivia problem set. The options page allows users to input and manage URLs they want to block, using simple HTML form elements, organized within "fieldset".

I chose to use the "fieldset" element in my form because it helps group the inputs and buttons for blocking websites together. It felt like a great way to organize the form visually and makes it easier to understand and work with in other parts of the project. The redirect page informs the user when they attempt to access a blocked website with a simple centered message. 

The CSS styles for both the options and redirect pages share common details like centered content and the white background, keeping the design simple yet effective.

## options.js

We finally get to the JavaScript. The JavaScript code here has two main tasks: storing the URL the user types in and saving the URL in Chrome's storage data to be used by the background script for blocking. This blocking can't be done directly here as the The background script is responsible for managing global events, like when a URL is blocked, ensuring the blocking works consistently even if the options page is closed.

Storing the user's URL is a design decision I made to ensure that the user sees the currently blocked URL in the button, even if they accidentally refresh the page.

When the options page is loaded, the script loops through each button to see if a URL has already been saved for blocking. If a saved URL is found, it is displayed when the user tries to open a blocked URL maybe by accident or habit.

Then, when the user clicks one of the block buttons, the script identifies the button clicked. It then checks the input field linked to the button to find the exact URL the user wants blocked, tracking it through the HTML. Finally, it captures the value of the input to handle it further. 

Before updating the URL, the script checks if a new URL has been entered by comparing it with the one already saved. If the two are the same, there is no update to avoid unnecessary changes. However, if the new URL is different, the saved URL is treated now as the "old URL" to keep track of the previous value. Basically, This process makes things more consistent and allows the script to handle updates in an organized and clean way. The new URL is then saved, replacing the old one, and a message is sent to the background script to apply the updated blocking rule.


## background.js

And then in background.js, we have all the logic behind how to actually redirect the pages after we receive what we need from options.js. This is done through using rules, which are basically  instructions that tell the extension what to do when certain URLs are accessed, like blocking or redirecting them. 

The idsToRemove part was added to make sure the extension starts fresh every time it loads. It prevents issues with old rules by using a large array to remove them, keeping everything clean, as I noticed during testing that the extension was having issues with properly updating the dynamic blocking rules due to leftover data from previous rules.

Next, the script listens for messages from other parts of the extension. This is important because the background script can globally handle events, such as when a message to block a URL comes in. It retrieves the URL and the button clicked. Instead of using many if statements, I redesigned the code to map each button to a simple number, making it easier to identify the rule for blocking the specific URL.

After that, the script uses rules to redirect the targeted URL with an HTML page provided by the extension anytime the website is accessed. The "main_frame" in this case refers to the primary web page or content that is loaded when visiting the site, ensuring that when the blocked URL is accessed, the redirection happens immediately for the main content.

If there’s already a blocked URL, the script removes the old rule before adding a new one for the new blocked site. If no rule is found, it just adds the new redirection rule for the URL the user wants to block.

## How to Launch the Extension
1. Download the files: [https://github.com/einn9/simple-website-blocker](https://github.com/einn9/simple-website-blocker)
2. Open Google Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" and click on "Load unpacked".
4. Select the folder of your project directory.
5. Your extension should now be installed and ready to be used!


## Potential Future Improvements

- **Flexible URL Management:** 

Instead of limiting the user to blocking exactly 5 URLs, one could potentially allow them to customize the number of blocks they need through their own choice. Alternatively, we could replace the current design with a single text box where users can enter multiple URLs, and maybe separate it by commas for example. This could be paired with a main list at the top of the page that shows all currently blocked URLs for better visibility and management.

- **Remove URL Feature:**

Creating a dedicated "remove URL" button to let users unblock specific URLs directly, in specific situations where they just want to remove URLs that are blocked without substituting them for new ones. 

- **Enhanced Page Design:**

Adding more detailed styling to the options and redirect pages could make for better user experience when using the extension.

## Documentation

https://stackoverflow.com/

https://developer.chrome.com/docs/extensions/

https://www.freecodecamp.org/

https://www.shiksha.com/

https://javascript.info/

https://css-tricks.com/


Thank you for everything CS50 - Daniel Furtado Rocha.