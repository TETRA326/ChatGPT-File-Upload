console.log("Content script loaded.");

// Create the button
const button = document.createElement('button');
button.innerText = '📂 Submit File';
button.style.backgroundColor = 'rgba(90, 90, 90, 0.3)';
button.style.color = 'white';
button.style.padding = '5px';
button.style.border = '1px solid #6b6458';
button.style.borderRadius = '4px';
button.style.margin = '5px';
button.style.width = '180px';

// Create a container div for centering
const containerDiv = document.createElement('div');
containerDiv.style.display = 'flex';
containerDiv.style.justifyContent = 'center';

// Append the button to the container div
containerDiv.appendChild(button);

// Function to inject the button
function injectButton() {
  // Find the target element
  const targetElement = document.querySelector("div.relative.flex.h-full.max-w-full.flex-1.overflow-hidden > div > main > div.absolute.bottom-0 > form > div > div:nth-child(1)");

  // Check if the button is already injected
  if (!targetElement.querySelector('button')) {
    // Insert the container div before the target element
    targetElement.parentNode.insertBefore(containerDiv, targetElement);
  }
}

// Call the injectButton function on page load
injectButton();

// Create a Mutation Observer
const observer = new MutationObserver(injectButton);

// Configure the observer to watch for changes in the target element
const config = { childList: true, subtree: true };
observer.observe(document.body, config);

// Add click event listener to the button
button.addEventListener('click', async () => {
  // Create the file input element
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt, .js, .py, .html, .css, .json, .csv';

  // Handle file selection
  fileInput.addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = async (e) => {
        const fileContent = e.target.result;
        const chunkSize = 15000;
        const chunks = [];

        // Split file content into chunks
        for (let i = 0; i < fileContent.length; i += chunkSize) {
          const chunk = fileContent.slice(i, i + chunkSize);
          chunks.push(chunk);
        }

        // Submit each chunk to the conversation
        for (let i = 0; i < chunks.length; i++) {
          const chunk = chunks[i];
          const part = i + 1;
          const filename = file.name;
          await submitConversation(chunk, part, filename);
        }
      };

      reader.readAsText(file);
    }
  });

  // Trigger file input click event
  fileInput.click();
});

// Submit conversation function
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector("textarea[tabindex='0']");
  const enterKeyEvent = new KeyboardEvent('keydown', {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
  textarea.dispatchEvent(enterKeyEvent);
}