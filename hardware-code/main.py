import time
import board
import busio
import digitalio
import usb_hid
import displayio
import rotaryio
import adafruit_displayio_ssd1306
import adafruit_imageload
from adafruit_mcp230xx.mcp23017 import MCP23017
from adafruit_hid.keyboard import Keyboard
from adafruit_hid.keyboard_layout_us import KeyboardLayoutUS
from adafruit_hid.keycode import Keycode
from adafruit_hid.consumer_control import ConsumerControl
from adafruit_hid.consumer_control_code import ConsumerControlCode

displayio.release_displays()


## CONFIGURATION ##
# Keys
keys_pressed = [
    Keycode.TWO,
    Keycode.THREE,
    Keycode.A,
    Keycode.FOUR,
    Keycode.FIVE,
    Keycode.SIX,
    Keycode.B,
    Keycode.SEVEN,
    Keycode.EIGHT,
    Keycode.NINE,
    Keycode.C,
    Keycode.PERIOD,
    Keycode.ZERO,
    Keycode.ENTER,
    Keycode.D,
]
rotary_pressed = ConsumerControlCode.PLAY_PAUSE

# Animation
FRAMES = 9
IMAGE_FILE = "/icons/icon_9_frames.bmp"

## END CONFIGURATION ##

# Create I2C things
i2c = busio.I2C(board.SCL, board.SDA)
display_bus = displayio.I2CDisplay(i2c, device_address=0x3C)
display = adafruit_displayio_ssd1306.SSD1306(display_bus, width=128, height=64)
mcp = MCP23017(i2c)
encoder = rotaryio.IncrementalEncoder(board.D0, board.D1)

# Rotary Encoder Button
button = digitalio.DigitalInOut(board.D2)
button.direction = digitalio.Direction.INPUT
button.pull = digitalio.Pull.UP
button_state = None
last_position = encoder.position


# Array of key objects
keypress_pins = [mcp.get_pin(i) for i in range(2, 16)] + [mcp.get_pin(0)]
key_pin_array = []

time.sleep(1)  # Sleep for a bit to avoid a race condition on some systems

# Create a keyboard object
keyboard = Keyboard(usb_hid.devices)
consumer = ConsumerControl(usb_hid.devices)
keyboard_layout = KeyboardLayoutUS(keyboard)

# Make all pin objects inputs with pullups
for pin in keypress_pins:
    pin.direction = digitalio.Direction.INPUT
    pin.pull = digitalio.Pull.UP
    key_pin_array.append(pin)

# Initialize key states to False
key_state = [False] * len(key_pin_array)


FRAME_SIZE = (64, 64)
group = displayio.Group()
bits, colors = adafruit_imageload.load(
    IMAGE_FILE, bitmap=displayio.Bitmap, palette=displayio.Palette
)
colors[0], colors[1] = colors[1], colors[0]  # Swap black and white

grid = displayio.TileGrid(
    bits,
    pixel_shader=colors,
    width=1,
    height=1,
    tile_height=FRAME_SIZE[1],
    tile_width=FRAME_SIZE[0],
    default_tile=0,
    x=32,
    y=0,
)

group.append(grid)
display.show(group)

framerate = 0
frame = 0

CHANGING_VOLUME = False
timer_volume = 0

print("Waiting for key pin...")
while True:
    # Rotary Encoder
    current_position = encoder.position
    position_change = current_position - last_position

    if position_change > 0:
        CHANGING_VOLUME = True
        timer_volume = time.monotonic()
        for _ in range(position_change):
            consumer.send(ConsumerControlCode.VOLUME_INCREMENT)
    elif position_change < 0:
        CHANGING_VOLUME = True
        for _ in range(-position_change):
            consumer.send(ConsumerControlCode.VOLUME_DECREMENT)

    last_position = current_position
    if CHANGING_VOLUME and (timer_volume + 1) < time.monotonic():
        CHANGING_VOLUME = False
        print("Volume change ended.")

    if not button.value and button_state is None:
        button_state = "pressed"
    if button.value and button_state == "pressed":
        print("Button pressed.")
        consumer.send(rotary_pressed)
        button_state = None

    # Keyboard

    if not CHANGING_VOLUME:
        for i, key_pin in enumerate(key_pin_array):
            if not key_pin.value:
                if not key_state[i]:  # Has the key not been pressed yet for this pin?
                    key_state[i] = True  # Set key state to pressed
                    print("Pin #%d is grounded." % i)

                    key = keys_pressed[i]
                    if isinstance(key, str):
                        keyboard_layout.write(key)
                    else:
                        keyboard.press(key)
                        keyboard.release_all()

            else:  # If it's not grounded
                key_state[i] = False  # Reset key state when ungrounded

    # Display
    if not CHANGING_VOLUME:
        if (framerate + 0.1) < time.monotonic():
            grid[0] = frame
            frame += 1
            framerate = time.monotonic()
            if frame > FRAMES - 1:
                frame = 0
