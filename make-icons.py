from PIL import Image, ImageOps
from pathlib import Path

root = Path.home() / "load-app" / "android"
source = root / "icon-source.jpg"
res = root / "app/src/main/res"

im = Image.open(source).convert("RGB")

sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}

for folder, size in sizes.items():
    target = res / folder
    target.mkdir(parents=True, exist_ok=True)

    # Keep the full image visible; fit it inside a square.
    square = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    fitted = ImageOps.contain(im, (int(size * 0.78), int(size * 0.78)),
                              method=Image.Resampling.LANCZOS).convert("RGBA")
    square.alpha_composite(fitted, ((size - fitted.width) // 2,
                                    (size - fitted.height) // 2))

    # Standard and round launcher icons
    square.convert("RGB").save(target / "ic_launcher.png")
    square.convert("RGB").save(target / "ic_launcher_round.png")

    # Transparent adaptive foreground
    foreground = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    foreground.alpha_composite(fitted, ((size - fitted.width) // 2,
                                        (size - fitted.height) // 2))
    foreground.save(target / "ic_launcher_foreground.png")

print("Icons regenerated with full image visible.")
