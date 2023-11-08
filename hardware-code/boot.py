import board
import digitalio
import storage
import usb_cdc, usb_hid, usb_midi

# Implement a button to allow code editing
code_button = digitalio.DigitalInOut(board.D2)  # Rotay encoder button
code_button.direction = digitalio.Direction.INPUT
code_button.pull = digitalio.Pull.UP

if code_button.value:
    usb_cdc.disable()
    storage.disable_usb_drive()
    usb_hid.enable(boot_device=1)
    usb_midi.disable()

code_button.deinit()
