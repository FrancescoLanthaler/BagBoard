import io
from os.path import basename
from pathlib import Path
from urllib.parse import urlparse

from js import File, Object, Uint8Array, document, window
from PIL import Image, ImageFilter
from pyodide.ffi import create_proxy, to_js

# The output size of each frame (or tile or Sprite) of the animation
OUTPUT_SIZE = (64, 64)


def giphy_media_url(url):
    # giphy.com/gifs/<slug>-<id> is an HTML page; the actual GIF lives on media.giphy.com
    parsed = urlparse(url)
    if parsed.netloc not in ("giphy.com", "www.giphy.com"):
        return url
    gif_id = parsed.path.rstrip("/").split("/")[-1].split("-")[-1]
    return f"https://media.giphy.com/media/{gif_id}/giphy.gif"


async def convert_gif(event):
    if event.target.files:
        upload = event.target.files.item(0)

    url = giphy_media_url(document.getElementById("gif-url").value.strip())
    if url:
        upload = await window.fetch(url)

    buff = Uint8Array.new(await upload.arrayBuffer())
    bytes_list = bytearray(buff)
    bytes_stream = io.BytesIO(bytes_list)
    gif_image = Image.open(bytes_stream)

    # Create PIL image from np array
    output_image = Image.new(
        "1", (OUTPUT_SIZE[0] * gif_image.n_frames, OUTPUT_SIZE[1]), 0
    )

    if url:
        filename = urlparse(url).path

    else:
        filename = upload.name

    output_filename = f"{Path(basename(filename)).stem}.bmp"

    for frame in range(0, gif_image.n_frames):
        gif_image.seek(frame)
        extracted_frame = gif_image.resize(OUTPUT_SIZE)
        position = (OUTPUT_SIZE[0] * frame, 0)
        output_image.paste(extracted_frame, position)

    output_image.save(output_filename)
    bytes = io.BytesIO()
    output_image.save(bytes, format="BMP", mode="1")

    image_file = File.new(
        [Uint8Array.new(bytes.getvalue())],
        output_filename,
        to_js({"type": "image/bmp"}, dict_converter=Object.fromEntries),
    )

    download_link = document.getElementById("download_link")
    download_link.href = window.URL.createObjectURL(image_file)
    download_link.download = output_filename

    display_image = document.getElementById("display_image")

    if url:
        display_image.src = url
    else:
        display_image.src = window.URL.createObjectURL(upload)

    # Show the download button
    download_link.classList.remove("download_hidden")

    # Output Code
    codestring = f"FRAMES = {gif_image.n_frames}\n"
    codestring += f'IMAGE_FILE = "/icons/{output_filename}"\n'

    document.getElementById("imagecode").innerText = codestring
    document.getElementById("anim_code").classList.remove("hidden")


convert_file = create_proxy(convert_gif)
document.getElementById("file-upload").addEventListener("change", convert_file)
document.getElementById("gif-url").addEventListener("input", convert_file)

if document.getElementById("gif-url").value:
    document.getElementById("gif-url").dispatchEvent(window.Event.new("input"))
elif document.getElementById("file-upload").files.length:
    document.getElementById("file-upload").dispatchEvent(window.Event.new("change"))
