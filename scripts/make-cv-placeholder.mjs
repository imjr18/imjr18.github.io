// Emits a valid minimal placeholder public/cv.pdf with correct xref offsets.
// Replace with Jawahar's real CV before launch (plan §7, blocking input 1).
import { writeFileSync } from "node:fs";

const objs = [
  `<</Type/Catalog/Pages 2 0 R>>`,
  `<</Type/Pages/Kids[3 0 R]/Count 1>>`,
  `<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Resources<</Font<</F1 5 0 R>>>>/Contents 4 0 R>>`,
  null, // 4: contents stream, filled below
  `<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>`,
];

const text = `BT /F1 24 Tf 72 700 Td (Jawahar Ranganathan) Tj ET
BT /F1 13 Tf 72 670 Td (Placeholder CV - replace public/cv.pdf with the real document.) Tj ET
BT /F1 11 Tf 72 645 Td (CS + Economics, BITS Pilani Goa. imjr18.github.io) Tj ET`;
objs[3] = `<</Length ${text.length}>>\nstream\n${text}\nendstream`;

let pdf = "%PDF-1.4\n";
const offsets = [];
objs.forEach((body, i) => {
  offsets[i] = pdf.length;
  pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
});
const xrefStart = pdf.length;
pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
offsets.forEach((off) => {
  pdf += `${String(off).padStart(10, "0")} 00000 n \n`;
});
pdf += `trailer\n<</Size ${objs.length + 1}/Root 1 0 R>>\nstartxref\n${xrefStart}\n%%EOF`;

writeFileSync(new URL("../public/cv.pdf", import.meta.url), pdf, "latin1");
console.log("wrote public/cv.pdf", pdf.length, "bytes");
