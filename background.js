const extendedMora = ['ゃ','ゅ','ょ'];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const result = {};

  // Generate the pitch accent types ourselves
  request.words.forEach(word => {
    if (word in pitchAccentData) {
      result[word] = pitchAccentData[word].map(data => {
        const hiragana = data[0];
        let pitch = data[1];

        const pitchPattern = hiragana.split('').map(char => ({ type: '', char }));

        if (pitch > 0) {
          for (let i = 1; i < pitch + 1 && i < pitchPattern.length; i ++) {
            if (~extendedMora.indexOf(pitchPattern[i].char)) {
              pitchPattern[i - 1].type = 'accent_plain';
              pitch += 1;
            }
          }
          pitchPattern[pitch - 1].type = 'accent_top';
        }

        const highUntil = pitch ? pitch - 1 : pitchPattern.length;
        for (let i = 1; i < highUntil; i ++) {
          pitchPattern[i].type = 'accent_plain';
        }

        return {
          data: [[pitchPattern]],
          header: ['word'],
        };
      });
    }
  });

  sendResponse(result);

  return true;
});
