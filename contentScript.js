// Function to decode the Caesar cipher with support for digits
function caesarShiftDecode(str, shift = 3) {
    return str
        .split('')
        .map(char => {
            const code = char.charCodeAt(0);

            // Uppercase letters (A-Z)
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 - shift + 26) % 26) + 65);
            }

            // Lowercase letters (a-z)
            else if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 - shift + 26) % 26) + 97);
            }

            // Digits (0-9)
            else if (code >= 48 && code <= 57) {
                return String.fromCharCode(((code - 48 - shift + 10) % 10) + 48);
            }

            // Non-alphabetic and non-digit characters remain unchanged
            return char;
        })
        .join('');
}

// Function to replace the username in text nodes and <a> tags
function replaceUsername(username) {
    if (!username) {
        return;
    }

    const regex = new RegExp(`${username}`, 'g');

    // Function to process a node's text content
    function processTextNode(node) {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.includes(`${username}`)) {
            node.nodeValue = node.nodeValue.replace(regex, '[deleted]');
        }
    }

    // Process the entire document body
    function processAll() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
        while (walker.nextNode()) {
            processTextNode(walker.currentNode);
        }
    }

    // Initial processing of the document
    processAll();

    // Observe changes to the DOM for dynamically added content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    // Process newly added text nodes
                    const innerWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
                    while (innerWalker.nextNode()) {
                        processTextNode(innerWalker.currentNode);
                    }

                } else if (node.nodeType === Node.TEXT_NODE) {
                    processTextNode(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Retrieve the encoded username from storage, decode it, and replace occurrences
chrome.storage.sync.get(['redditUsername'], result => {
    const encoded = result.redditUsername;
    if (encoded) {
        const decodedUsername = caesarShiftDecode(encoded, 3);
        replaceUsername(decodedUsername);
    }
});
