const https = require("https");
const fs = require("fs");
const path = require("path");

const out = path.join(process.cwd(), "public", "images");
fs.mkdirSync(out, { recursive: true });

const items = [
  { url: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=1600&q=80", file: "category-fruits.jpg" },
  { url: "https://images.unsplash.com/photo-1601039641847-7857b994d704?w=1600&q=80", file: "category-chips.jpg" },
  { url: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=1600&q=80", file: "category-powders.jpg" },
  { url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1600&q=80", file: "category-moringa.jpg" },
  { url: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=1800&q=80", file: "brand-basket.jpg" },
  { url: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=1800&q=80", file: "hero-fruits.jpg" },
  { url: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=1800&q=80", file: "about-ingredients.jpg" },
  { url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1800&q=80", file: "process-lab.jpg" },
  { url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1400&q=80", file: "product-abc.jpg" },
  { url: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1600&q=80", file: "hero-glow.jpg" },
];

function download(index) {
  if (index >= items.length) return;
  const item = items[index];
  const filePath = path.join(out, item.file);
  https
    .get(item.url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode !== 200) {
        console.error("fail", item.file, res.statusCode);
        res.resume();
        return download(index + 1);
      }
      const file = fs.createWriteStream(filePath);
      res.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log("ok", item.file);
        download(index + 1);
      });
    })
    .on("error", (err) => {
      console.error("err", item.file, err.message);
      download(index + 1);
    });
}

download(0);
