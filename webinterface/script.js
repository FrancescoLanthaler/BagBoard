// Get all the keys on the keyboard
const keys = document.querySelectorAll('.key_value');
const rotary = document.querySelector('.rotary');
const button = document.getElementById('generate');
const code = document.getElementById('keycode');

const clearButton = document.getElementById('clear-button');
clearButton.addEventListener('click', clearUpload);

// Your existing clearUpload function
function clearUpload() {
    const file = document.getElementById('file-upload-pillow');
    file.value = '';
}

// Add an event listener to each key
keys.forEach(key => {
    key.addEventListener('click', () => {
        // Get the current value of the key
        const currentValue = key.textContent;
        console.log(currentValue)
        // Create a dropdown list with the new values for the key
        const dropdown = document.createElement('select');
        const optgroupKeys = document.createElement('optgroup');
        optgroupKeys.label = "Keyboard Keys";
        dropdown.add(optgroupKeys);
        for (let i = 0; i < keyboard_keys.length; i++) {
            const option = document.createElement('option');
            option.value = keyboard_keys[i];
            option.text = keyboard_keys[i];
            dropdown.add(option);
            if (currentValue === keyboard_keys[i]) {
                dropdown.selectedIndex = i;
            }
        }
        const optgroup = document.createElement('optgroup');
        optgroup.label = "Media Keys";
        dropdown.add(optgroup);
        for (let i = 0; i < mediaKeys.length; i++) {
            const option = document.createElement('option');
            option.value = mediaKeys[i];
            option.text = mediaKeys[i];
            dropdown.add(option);
            if (currentValue === mediaKeys[i]) {
                dropdown.selectedIndex = i;
            }
        }


        // Replace the key with the dropdown list
        key.parentNode.replaceChild(dropdown, key);

        // Add an event listener to the dropdown list
        dropdown.addEventListener('change', () => {
            console.log(dropdown.value)
            if (dropdown.value === 'Custom') { // Use strict comparison (===)
                // Replace the dropdown with a text field
                const textField = document.createElement('input');
                textField.type = 'text';
                textField.value = 'Enter custom command';
                textField.id = 'input1';
                dropdown.parentNode.replaceChild(textField, dropdown);
                textField.focus();


                textField.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter') {
                        // Replace the text field with the updated key
                        textField.blur();
                    }
                });
                // Add an event listener to the text field
                textField.addEventListener('blur', () => {
                    // Replace the text field with the updated key
                    key.textContent = textField.value;
                    textField.parentNode.replaceChild(key, textField);
                });
            } else {
                // Replace the dropdown with the updated key
                key.textContent = dropdown.value;
                dropdown.parentNode.replaceChild(key, dropdown);
            }
        });
    });
});

rotary.addEventListener('click', () => {
    // Get the current value of the key
    const currentValue = rotary.textContent;
    console.log(currentValue)
    // Create a dropdown list with the new values for the key
    const dropdown = document.createElement('select');
    for (let i = 0; i < mediaKeys.length; i++) {
        const option = document.createElement('option');
        option.value = mediaKeys[i];
        option.text = mediaKeys[i];
        dropdown.add(option);
        if (currentValue === mediaKeys[i]) {
            dropdown.selectedIndex = i;
        }
    }

    // Replace the key with the dropdown list
    rotary.parentNode.replaceChild(dropdown, rotary);

    // Add an event listener to the dropdown list
    dropdown.addEventListener('change', () => {
        // Update the value of the key with the selected value from the dropdown list
        rotary.textContent = dropdown.value;

        // Replace the dropdown list with the updated key
        dropdown.parentNode.replaceChild(rotary, dropdown);
    });
});



button.addEventListener('click', () => {
    let script = "keys_pressed = [";
    keys.forEach((key, index) => {
        if (keyboard_keys.includes(key.textContent)) {
            script += "Keycode." + key.textContent;
        }
        else if (mediaKeys.includes(key.textContent)) {
            script += "ConsumerControlCode." + key.textContent;
        }

        else {
            script += '"' + key.textContent + '"';
        }
        if (index !== keys.length - 1) {
            script += ", ";
        }
    });
    script = script.replace(/,([^,]*)$/, '$1'); // remove last comma and space
    script += "]<br>";
    script += "rotary_pressed = ConsumerControlCode." + rotary.textContent + "\n";
    code.innerHTML = script;
    document.getElementById("key_code").classList.remove("hidden")
});


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

