function caesarShift(str, shift = 3) {
    return str
        .split('')
        .map(char => {
            const code = char.charCodeAt(0);

            // Uppercase letters (A-Z)
            if (code >= 65 && code <= 90) {
                return String.fromCharCode(((code - 65 + shift) % 26) + 65);
            }

            // Lowercase letters (a-z)
            else if (code >= 97 && code <= 122) {
                return String.fromCharCode(((code - 97 + shift) % 26) + 97);
            }

            // Digits (0-9)
            else if (code >= 48 && code <= 57) {
                return String.fromCharCode(((code - 48 + shift) % 10) + 48);
            }

            // Non-alphabetic and non-digit characters remain unchanged
            return char;
        })
        .join('');
}

document.getElementById('saveBtn').addEventListener('click', () => {
    const username = document.getElementById('username').value.trim();
    if (username) {
        const encodedUsername = caesarShift(username, 3);
        chrome.storage.sync.set({ redditUsername: encodedUsername }, () => {
            document.getElementById('status').textContent = 'Username saved!';
            setTimeout(() => {
                document.getElementById('status').textContent = '';
            }, 2000);
        });
    }
});
