"""Regenerate the browser icons in public/ from the master logo.

    python scripts/make-favicons.py

The logo is a wide lockup: a line-art fish next to the EUROFISK wordmark. A tab icon is
16-32px, where the wordmark is unreadable, so the icons use the fish alone. The two
overlap horizontally, so the fish cannot be cropped out with a rectangle — the mark is
separated by connected-component labelling instead, dropping every glyph that sits on the
wordmark's baseline band.

Two things were tried and rejected, so they are not worth retrying:
  - Dilating the strokes for the 16px icon: it closes the gaps and turns into a blob.
  - Filling the outline into a solid silhouette: the fill closes the mouth, and the fish
    reads as a comma.
"""

import numpy as np
from PIL import Image
from scipy import ndimage

SOURCE = "src/imports/eurofisk-logo-transparent.png"
OUT = "public"
# --primary from src/styles/theme.css. The logo is thin blue line-art: on a white tab
# strip it nearly disappears and on a dark one it vanishes, so the icon inverts it onto
# the brand blue, which holds up against either.
PRIMARY = (26, 91, 170, 255)
# y-range of the wordmark's baseline in the source image.
TEXT_BAND = (500, 760)


def fish_mark() -> Image.Image:
    """The fish, alone, as a square alpha mask."""
    source = Image.open(SOURCE).convert("RGBA")
    alpha = np.array(source.getchannel("A"))
    labels, count = ndimage.label(alpha > 40, structure=np.ones((3, 3)))
    boxes = ndimage.find_objects(labels)
    areas = ndimage.sum(np.ones_like(labels), labels, range(1, count + 1))

    fish_id = int(np.argmax(areas)) + 1  # the outer fish outline is the largest stroke
    fish_y, fish_x = boxes[fish_id - 1]

    keep = np.zeros_like(labels, dtype=bool)
    for index, (ys, xs) in enumerate(boxes, start=1):
        inside = (
            xs.start >= fish_x.start and xs.stop <= fish_x.stop
            and ys.start >= fish_y.start and ys.stop <= fish_y.stop
        )
        # "E" and "U" fall inside the fish's bounding box; the fish's own gill and fin
        # detail does not sit on the wordmark baseline, which is what separates them.
        on_baseline = ys.start >= TEXT_BAND[0] and ys.stop <= TEXT_BAND[1]
        if index == fish_id or (inside and not on_baseline):
            keep |= labels == index

    cropped = Image.fromarray(np.where(keep, alpha, 0).astype(np.uint8)[fish_y, fish_x], "L")
    side = max(cropped.size)
    square = Image.new("L", (side, side), 0)
    square.paste(cropped, ((side - cropped.size[0]) // 2, (side - cropped.size[1]) // 2))
    return square


def tile(mark: Image.Image, size: int) -> Image.Image:
    pad = max(1, round(size * 0.10))
    inner = size - pad * 2
    out = Image.new("RGBA", (size, size), PRIMARY)
    glyph = Image.new("RGBA", (inner, inner), (255, 255, 255, 0))
    glyph.putalpha(mark.resize((inner, inner), Image.LANCZOS))
    out.alpha_composite(glyph, (pad, pad))
    return out


def main() -> None:
    mark = fish_mark()
    tile(mark, 32).save(f"{OUT}/favicon-32.png", optimize=True)
    tile(mark, 180).save(f"{OUT}/apple-touch-icon.png", optimize=True)
    # Browsers request /favicon.ico without being told to, and some bookmark and history
    # surfaces look for nothing else.
    tile(mark, 256).save(f"{OUT}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
    print("wrote favicon-32.png, apple-touch-icon.png, favicon.ico")


if __name__ == "__main__":
    main()
