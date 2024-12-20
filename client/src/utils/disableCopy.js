export const disableCopy = () => {
    // Disable specific shortcuts
    document.addEventListener("keydown", (e) => {
      if (
        e.ctrlKey &&
        (e.key === "c" || e.key === "p" || e.key === "s") // Allow F12 and inspect
      ) {
        e.preventDefault();
        alert("Copy, Print, and Save are disabled.");
      }
    });
  };
  