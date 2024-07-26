chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ focusMode: false, blocklist: [] }, () => {
    console.log('NeuraFocus initialized');
  });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync' && (changes.focusMode || changes.blocklist)) {
    chrome.storage.sync.get(['focusMode', 'blocklist'], (result) => {
      const focusMode = result.focusMode;
      const blocklist = result.blocklist || [];
      const rules = blocklist.map((url, index) => ({
        id: index + 1,
        priority: 1,
        action: { type: 'block' },
        condition: { urlFilter: url }
      }));

      if (focusMode) {
        chrome.declarativeNetRequest.updateDynamicRules({
          addRules: rules,
          removeRuleIds: []
        }, () => {
          console.log('Blocklist rules updated:', rules);
        });
      } else {
        chrome.declarativeNetRequest.updateDynamicRules({
          addRules: [],
          removeRuleIds: rules.map((rule) => rule.id)
        }, () => {
          console.log('Blocklist rules removed:', rules);
        });
      }
    });
  }
});
