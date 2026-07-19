import fs from "node:fs";
import path from "node:path";

const files = [
  "src/content/html/trophies.html",
  "src/content/html/2020-pictures.html",
];

const publicDir = path.resolve("public");

function fullFromSrc(src) {
  return src.replace(/-\d+x\d+(\.[a-zA-Z0-9]+)$/, "$1");
}

function fileExists(webPath) {
  const local = path.join(publicDir, webPath.replace(/^\//, "").replace(/\//g, path.sep));
  try {
    return fs.statSync(local).size > 500;
  } catch {
    return false;
  }
}

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  const beforePageLinks = (html.match(/href=['"]\/(?!uploads\/)[^'"]+\/['"]/g) || []).length;

  // Rewrite any <a href="..."><img ... src="/uploads/...">
  html = html.replace(
    /<a\s+href=(['"])([^'"]*)\1(\s[^>]*)?>(\s*)<img\b([^>]*?\bsrc=(['"])(\/uploads\/[^'"]+)\6)([^>]*)>/gi,
    (match, q, href, aRest = "", ws, imgBeforeSrc, sq, src, imgAfter) => {
      let target = fullFromSrc(src);
      if (!fileExists(target)) {
        // Prefer medium size if present in srcset-like siblings isn't available; use thumb
        target = fileExists(src) ? src : target;
      }
      return `<a href=${q}${target}${q}${aRest || ""}>${ws}<img${imgBeforeSrc}${imgAfter}>`;
    },
  );

  // Also catch single-quoted gallery style: <a href='/slug/'><img ... src="...">
  // (covered above with flexible quotes)

  // Upgrade any remaining /uploads/...-150x150.jpg hrefs to full size when file exists
  html = html.replace(/href=(['"])(\/uploads\/[^'"]+)-(\d+x\d+)(\.[a-zA-Z0-9]+)\1/g, (m, q, base, size, ext) => {
    const full = `${base}${ext}`;
    if (fileExists(full)) return `href=${q}${full}${q}`;
    return m;
  });

  fs.writeFileSync(file, html, "utf8");
  const afterPageLinks = (html.match(/href=['"]\/(?!uploads\/)[^'"]+\/['"]/g) || []).length;
  const fullHrefs = (html.match(/href=['"]\/uploads\/[^'"]+\.(?:jpg|jpeg|png|gif|webp)['"]/gi) || []).filter(
    (h) => !/-\d+x\d+\./.test(h),
  ).length;
  console.log(`${file}: page-links ${beforePageLinks} -> ${afterPageLinks}, full-image hrefs ~${fullHrefs}`);

  const sample = html.match(/href=['"][^'"]*bass0015[^'"]*['"]/);
  if (sample) console.log("  bass0015:", sample[0]);
}
