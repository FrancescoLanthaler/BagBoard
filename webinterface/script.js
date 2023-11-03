// Get DOM elements
const keys = document.querySelectorAll('.key_value');
const rotary = document.querySelector('.rotary');
const button = document.getElementById('generate');
const code = document.getElementById('keycode');
const clearButton = document.getElementById('clear-button');

// Clear button click event
clearButton.addEventListener('click', () => {
    document.getElementById('file-upload-pillow').value = '';
});

// Define keyboard keys and media keys
const keyboard_keys = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'ONE',
    'TWO',
    'THREE',
    'FOUR',
    'FIVE',
    'SIX',
    'SEVEN',
    'EIGHT',
    'NINE',
    'ZERO',
    'ENTER',
    'RETURN',
    'ESCAPE',
    'BACKSPACE',
    'TAB',
    'SPACEBAR',
    'SPACE',
    'MINUS',
    'EQUALS',
    'LEFT_BRACKET',
    'RIGHT_BRACKET',
    'BACKSLASH',
    'POUND',
    'SEMICOLON',
    'QUOTE',
    'GRAVE_ACCENT',
    'COMMA',
    'PERIOD',
    'FORWARD_SLASH',
    'CAPS_LOCK',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'PRINT_SCREEN',
    'SCROLL_LOCK',
    'PAUSE',
    'INSERT',
    'HOME',
    'PAGE_UP',
    'DELETE',
    'END',
    'PAGE_DOWN',
    'RIGHT_ARROW',
    'LEFT_ARROW',
    'DOWN_ARROW',
    'UP_ARROW',
    'KEYPAD_NUMLOCK',
    'KEYPAD_FORWARD_SLASH',
    'KEYPAD_ASTERISK',
    'KEYPAD_MINUS',
    'KEYPAD_PLUS',
    'KEYPAD_ENTER',
    'KEYPAD_ONE',
    'KEYPAD_TWO',
    'KEYPAD_THREE',
    'KEYPAD_FOUR',
    'KEYPAD_FIVE',
    'KEYPAD_SIX',
    'KEYPAD_SEVEN',
    'KEYPAD_EIGHT',
    'KEYPAD_NINE',
    'KEYPAD_ZERO',
    'KEYPAD_PERIOD',
    'KEYPAD_BACKSLASH',
    'APPLICATION',
    'POWER',
    'KEYPAD_EQUALS',
    'F13',
    'F14',
    'F15',
    'F16',
    'F17',
    'F18',
    'F19',
    'F20',
    'F21',
    'F22',
    'F23',
    'F24',
    'LEFT_CONTROL',
    'CONTROL',
    'LEFT_SHIFT',
    'SHIFT',
    'LEFT_ALT',
    'ALT',
    'OPTION',
    'LEFT_GUI',
    'GUI',
    'WINDOWS',
    'COMMAND',
    'RIGHT_CONTROL',
    'RIGHT_SHIFT',
    'RIGHT_ALT',
    'RIGHT_GUI',
    'Custom'
];

const mediaKeys = [
    'Custom',
    'RECORD',
    'FAST_FORWARD',
    'REWIND',
    'SCAN_NEXT_TRACK',
    'SCAN_PREVIOUS_TRACK',
    'STOP',
    'EJECT',
    'PLAY_PAUSE',
    'MUTE',
    'VOLUME_DECREMENT',
    'VOLUME_INCREMENT',
    'BRIGHTNESS_DECREMENT',
    'BRIGHTNESS_INCREMENT'

];

// Event listener for each key
keys.forEach(key => {
    key.addEventListener('click', () => {
        const currentValue = key.textContent;
        const isMediaKey = mediaKeys.includes(currentValue);

        const dropdown = document.createElement('select');
        const optgroup = document.createElement('optgroup');
        optgroup.label = isMediaKey ? 'Media Keys' : 'Keyboard Keys';

        const keyArray = isMediaKey ? mediaKeys : keyboard_keys;

        keyArray.forEach((keyValue, i) => {
            const option = document.createElement('option');
            option.value = keyValue;
            option.text = keyValue;
            dropdown.add(option);

            if (currentValue === keyValue) {
                dropdown.selectedIndex = i;
            }
        });

        dropdown.addEventListener('change', () => {
            key.textContent = dropdown.value;
            dropdown.parentNode.replaceChild(key, dropdown);
        });

        key.parentNode.replaceChild(dropdown, key);
    });
});

// Rotary click event
rotary.addEventListener('click', () => {
    const currentValue = rotary.textContent;
    const dropdown = document.createElement('select');

    mediaKeys.forEach((keyValue, i) => {
        const option = document.createElement('option');
        option.value = keyValue;
        option.text = keyValue;
        dropdown.add(option);

        if (currentValue === keyValue) {
            dropdown.selectedIndex = i;
        }
    });

    dropdown.addEventListener('change', () => {
        rotary.textContent = dropdown.value;
        dropdown.parentNode.replaceChild(rotary, dropdown);
    });

    rotary.parentNode.replaceChild(dropdown, rotary);
});

// Button click event
button.addEventListener('click', () => {
    let script = 'keys_pressed = [';
    keys.forEach((key, index) => {
        const keyText = key.textContent;
        const isMediaKey = mediaKeys.includes(keyText);
        const keyType = isMediaKey ? 'ConsumerControlCode.' : 'Keycode.';
        script += keyType + keyText;

        if (index !== keys.length - 1) {
            script += ', ';
        }
    });

    script = script.replace(/,([^,]*)$/, '$1');
    script += ']<br>';
    script += 'rotary_pressed = ConsumerControlCode.' + rotary.textContent + '\n';
    code.innerHTML = script;
    document.getElementById('key_code').classList.remove('hidden');
});

