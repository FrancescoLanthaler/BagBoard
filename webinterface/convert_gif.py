from js import document, console, Uint8Array, window, File
from pyodide.ffi import create_proxy
import asyncio
import io

from PIL import Image, ImageFilter
from os import listdir


OUTPUT_SIZE = (64,64) # The output size of each frame (or tile or Sprite) of the animation
MONOCHROME = True # Do you want the output file to be b/w?

async def _upload_change_and_show(e):
    #Get the first file from uploaded files

    if e.target.files:
        file_list = e.target.files
        first_item = file_list.item(0)

    url = document.getElementById("gif-url").value
    if url:
        first_item = await window.fetch(url)
    else:
        first_item = first_item

    #Get the data from the files arrayBuffer as an array of unsigned bytes
    array_buf = Uint8Array.new(await first_item.arrayBuffer())

    #BytesIO wants a bytes-like object, so convert to bytearray first
    bytes_list = bytearray(array_buf)
    my_bytes = io.BytesIO(bytes_list)
    gif = Image.open(my_bytes)

    #Create PIL image from np array
    for file in listdir():
        # print(f"Size: {gif.size}")
        # print(f"Frames: {gif.n_frames}")

        if MONOCHROME:
            output = Image.new("1", (OUTPUT_SIZE[0] * gif.n_frames, OUTPUT_SIZE[1]), 0)
        else:
            output = Image.new("RGB", (OUTPUT_SIZE[0] * gif.n_frames, OUTPUT_SIZE[1]))

        output_filename = f"icon_{gif.n_frames}_frames.bmp"

        for frame in range(0,gif.n_frames):
            gif.seek(frame)
            extracted_frame = gif.resize(OUTPUT_SIZE)
            position = (OUTPUT_SIZE[0]*frame, 0)
            output.paste(extracted_frame, position)

        if not MONOCHROME:
            output = output.convert("P", colors = 8)
        output.save(output_filename)


    #Log some of the image data for testing
    # console.log(f"{gif.format= } {gif.width= } {gif.height= }")
    # console.log(f"{gif.n_frames= } {gif.is_animated= } {gif.info= }")

    #Convert Pillow object array back into File type that createObjectURL will take
    my_stream = io.BytesIO()
    output.save(my_stream, format="BMP", mode="1") # Set mode to "1" for monochrome BMP
    #Create a JS File object with our data and the proper mime type
    image_file = File.new([Uint8Array.new(my_stream.getvalue())], output_filename, {type: "image/bmp"})

    download_link = document.getElementById("download_link")
    download_link.href = window.URL.createObjectURL(image_file)
    download_link.download = output_filename  # Set the 'download' attribute

    display = document.getElementById("display_image")

    if url:
        display.src = url
    else:
        display.src = window.URL.createObjectURL(first_item)

    # Show the download button
    download_link.classList.remove("download_hidden")

    # Output Code

    codestring = f"FRAMES = {gif.n_frames}\n"
    codestring += f"IMAGE_FILE = \"/icons/{output_filename}\".format(0)\n"

    document.getElementById("imagecode").innerText = codestring
    document.getElementById("anim_code").classList.remove("hidden")

# Run image processing code above whenever file is uploaded    
upload_file = create_proxy(_upload_change_and_show)
document.getElementById("file-upload-pillow").addEventListener("change", upload_file)
document.getElementById("gif-url").addEventListener("input", upload_file)