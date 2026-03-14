# Navigation Sound Setup

## Instructions

To add the "Fahhh" sound to your navigation buttons:

1. **Download the sound file:**
   - Go to: https://www.myinstants.com/en/instant/fahhh-42300/
   - Click "Download MP3" button
   - Save the file as `nav-sound.mp3`

2. **Add the file to this directory:**
   - Place the downloaded `nav-sound.mp3` file in this folder: `public/src/assets/audio/`

3. **The sound will automatically work:**
   - The JavaScript is already configured to play this sound when navigation buttons are clicked
   - If the file is not found, it will use a fallback beep sound

## Alternative Method

If you prefer a different sound:

1. Replace `nav-sound.mp3` with your preferred audio file
2. Make sure the file is named `nav-sound.mp3` or update the path in `script.js`

## Volume Control

You can adjust the volume by modifying the `navSound.volume` value in `script.js` (currently set to 0.3).
