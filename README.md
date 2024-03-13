# BagBoard

A cool macropad with an easy interface to allow you to change the keybinds to whatever you want!


## Get started:
First of all you will need the pcb and all the components.
Then you will need to install the libs and the main.py code.

### In the Web Interface:
https://bagboard.francescolanthaler.com/

#### Change Keypad Layout:
Inside the web interface you can reassign each Key to a specific value. 
If you want a key to output a string just use the *custom* option

To change the Layout then copy the code from the interface and replace the one in *main.py*

```python
keys_pressed = [Keycode.TWO, Keycode.A, Keycode.A, Keycode.FOUR, Keycode.FIVE, Keycode.SIX, Keycode.B, Keycode.SEVEN, Keycode.EIGHT, Keycode.NINE, Keycode.C, Keycode.PERIOD, Keycode.ZERO, Keycode.ENTER, Keycode.D]
rotary_pressed = ConsumerControlCode.PLAY_PAUSE
```

#### Change Animation:
To change the Gif just download one from any website or use a URL (has to be a "drawing" and it works best if black and white).
Then upload them to the site and when downloading it put it into the icons folder.

In the main.py change the file name and number of frame to the new ones:

```python
FRAMES = 9
IMAGE_FILE = "/icons/FILENAMEHERE.bmp".format(0)
```


## License:

Copyright 2024 Francesco Lanthaler
This project includes code from libraries that are licensed under various open-source licenses. 



