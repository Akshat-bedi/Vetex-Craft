import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function crc32(buf) {
  let c = 0xffffffff;
  const table = [];
  for (let n = 0; n < 256; n++) {
    let c2 = n;
    for (let k = 0; k < 8; k++)
      c2 = c2 & 1 ? (0xedb88320 ^ (c2 >>> 1)) : c2 >>> 1;
    table[n] = c2;
  }
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type);
  const crcBuf = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcBuf));
  return Buffer.concat([len, t, data, crc]);
}

function makePng(size, pixelFn) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    for (let x = 0; x < size; x++) {
      const [r, g, b, a] = pixelFn(x, y);
      const i = y * (size * 4 + 1) + 1 + x * 4;
      raw[i] = r;
      raw[i + 1] = g;
      raw[i + 2] = b;
      raw[i + 3] = a;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const textures = {
  dirt: (x, y) => {
    const n = (x * 7 + y * 13) % 5;
    return n < 2 ? [86, 52, 30, 255] : [107, 66, 38, 255];
  },
  grass: (x, y) => {
    if (y < 4) {
      const n = (x + y) % 3;
      return n ? [61, 122, 46, 255] : [45, 95, 35, 255];
    }
    const n = (x * 5 + y) % 4;
    return n ? [107, 66, 38, 255] : [86, 52, 30, 255];
  },
  stone: (x, y) => {
    const n = (x * 3 + y * 5) % 6;
    const shades = [
      [122, 122, 122, 255],
      [108, 108, 108, 255],
      [135, 135, 135, 255],
    ];
    return shades[n % 3];
  },
  wood: (x, y) => {
    const ring = x % 4 === 0 || y % 4 === 0;
    return ring ? [101, 67, 33, 255] : [139, 90, 43, 255];
  },
  nether: (x, y) => {
    const n = (x + y * 2) % 4;
    const colors = [
      [107, 26, 26, 255],
      [80, 15, 15, 255],
      [140, 40, 40, 255],
      [60, 10, 10, 255],
    ];
    return colors[n];
  },
};

const dir = path.join(__dirname, "..", "public", "textures");
for (const [name, fn] of Object.entries(textures)) {
  fs.writeFileSync(path.join(dir, `${name}.png`), makePng(16, fn));
  console.log(`Wrote ${name}.png`);
}
