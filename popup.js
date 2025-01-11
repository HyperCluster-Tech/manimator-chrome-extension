// Make sure the script runs after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Safely grab the button and status elements
  const launchButton = document.getElementById('launch-button');
  const statusEl = document.getElementById('status');

  // Bail early if elements are missing
  if (!launchButton) {
    console.error("Element with ID 'launch-button' not found.");
    return;
  }
  if (!statusEl) {
    console.error("Element with ID 'status' not found.");
    return;
  }

  // Add click event listener for launching Manimator
  launchButton.addEventListener('click', () => {
    // Hide any existing status messages
    statusEl.style.display = 'none';

    // Try-catch to handle runtime errors
    try {
      // Query for the active tab in the current window
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Check for Chrome runtime errors
        if (chrome.runtime.lastError) {
          console.error("chrome.runtime.lastError:", chrome.runtime.lastError.message);
          setStatusMessage(`Error: ${chrome.runtime.lastError.message}`, false);
          return;
        }

        // Check if any tabs were returned
        if (!tabs || tabs.length === 0) {
          console.error("No active tab found.");
          setStatusMessage("No active tab found.", false);
          return;
        }

        const activeTab = tabs[0];
        const tabUrl = activeTab.url || "";

        console.log("Current tab URL:", tabUrl);

        // Use a regex to match the arXiv ID from the URL
        // For example: https://arxiv.org/pdf/1234.56789.pdf or
        //             https://arxiv.org/abs/1234.56789v2
        const match = tabUrl.match(/arxiv\.org\/[^/]*\/([^/]+)/);

        if (match && match[1]) {
          // Keep the version part if present
          const arxivId = match[1];
          const manimatorUrl = `https://manimator.hypercluster.tech/pdf/${arxivId}`;

          console.log("Constructed Manimator URL:", manimatorUrl);

          // Open a new tab with the Manimator URL
          chrome.tabs.create({ url: manimatorUrl }, () => {
            // Check if there's an error creating the new tab
            if (chrome.runtime.lastError) {
              console.error("Error creating new tab:", chrome.runtime.lastError.message);
              setStatusMessage(`Could not open Manimator: ${chrome.runtime.lastError.message}`, false);
              return;
            }

            // Provide success feedback
            setStatusMessage("Visualization launched!", true);
          });
        } else {
          console.error("Could not extract arXiv ID from URL.");
          setStatusMessage("Not a valid arXiv URL.", false);
        }
      });
    } catch (err) {
      console.error("An unexpected error occurred:", err);
      setStatusMessage(`An unexpected error occurred: ${err.message}`, false);
    }
  });

  /**
   * Helper function to set status message
   * @param {string} msg - The message to display
   * @param {boolean} isSuccess - Whether it's a success message
   */
  function setStatusMessage(msg, isSuccess) {
    statusEl.textContent = msg;
    statusEl.className = isSuccess ? 'status success' : 'status';
    statusEl.style.display = 'block';
  }
});
///*Dr. Seth Dobrin 1Infinity Ventures & Qantm AI. Free for use under Creative Commons liscense contact seth@qantm.ai or seth@1infinity.vc *///
