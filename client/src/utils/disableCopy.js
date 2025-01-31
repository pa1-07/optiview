export const disableCopy = () => {
  // Disable specific shortcuts (e.g., Ctrl+C)
  const blockedKeys = ["c"];
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && blockedKeys.includes(e.key.toLowerCase())) {
      e.preventDefault(); // Block the action
      alert("Copy action is disabled. Please respect content privacy."); // Show alert for Ctrl+C
    }
  });

  // Prevent right-click
  // document.addEventListener("contextmenu", (e) => {
  //   e.preventDefault();
  //   console.log("Right-click is disabled.");
  // });

  // Prevent drag and drop
  document.addEventListener("dragstart", (e) => {
    e.preventDefault();
    console.log("Drag and drop is disabled.");
  });

  // Prevent text selection
  // document.addEventListener("selectstart", (e) => {
  //   e.preventDefault();
  //   console.log("Text selection is disabled.");
  // });

  // Intercept clipboard copy and clear clipboard content
  document.addEventListener("copy", (e) => {
    e.preventDefault();
    navigator.clipboard.writeText("").catch(() => {
      console.error("Failed to clear clipboard content.");
    });
    alert("Copy action is disabled. Clipboard content has been cleared."); // Alert for manual copying
    console.log("Copy action blocked and clipboard cleared.");
  });

  console.log("All copy-related actions are disabled.");

};
