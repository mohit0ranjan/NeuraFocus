document.addEventListener('DOMContentLoaded', function() {
  const addButton = document.getElementById('addButton');
  const focusButton = document.getElementById('focusButton');
  const urlInput = document.getElementById('urlInput');

  addButton.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url) {
      chrome.storage.sync.get(['blocklist'], (result) => {
        const blocklist = result.blocklist || [];
        blocklist.push(url);
        chrome.storage.sync.set({ blocklist }, () => {
          alert(`URL '${url}' added to blocklist`);
          urlInput.value = '';
        });
      });
    } else {
      alert('Please enter a valid URL');
    }
  });

  focusButton.addEventListener('click', () => {
    chrome.storage.sync.get(['focusMode'], (result) => {
      const focusMode = !result.focusMode;
      chrome.storage.sync.set({ focusMode }, () => {
        focusButton.textContent = focusMode ? 'Stop Focus Mode' : 'Start Focus Mode';
        alert(focusMode ? 'Focus Mode Activated!' : 'Focus Mode Deactivated!');
      });
    });
  });

  chrome.storage.sync.get(['focusMode'], (result) => {
    focusButton.textContent = result.focusMode ? 'Stop Focus Mode' : 'Start Focus Mode';
  });
});
