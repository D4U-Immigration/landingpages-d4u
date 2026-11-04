// Gera versões menores das fotos das LPs (srcset) a partir dos JPG originais em public/assets/lp/{lp}/.
// Uso: npm run images   (só cria o que estiver faltando ou desatualizado)
//  - fotos de seção: {nome}-640.webp e {nome}-960.webp (só larguras menores que a original)
//  - fundo do hero:  hero-bg-800.webp (versão leve para o celular)
import { readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = 'public/assets/lp';
const SKIP = /^(og-|cta-final)/;

const jobs = [];
for (const lp of readdirSync(ROOT)) {
  const dir = join(ROOT, lp);
  if (!statSync(dir).isDirectory()) continue;
  for (const file of readdirSync(dir)) {
    const m = file.match(/^(.+)\.jpg$/);
    if (!m || SKIP.test(file) || /-\d+$/.test(m[1])) continue;
    const name = m[1];
    const widths = name === 'hero-bg' ? [[800, 55]] : [[640, 70], [960, 70]];
    for (const [w, quality] of widths) jobs.push({ src: join(dir, file), out: join(dir, `${name}-${w}.webp`), w, quality });
  }
}

let made = 0;
for (const j of jobs) {
  if (existsSync(j.out) && statSync(j.out).mtimeMs >= statSync(j.src).mtimeMs) continue;
  const { width } = await sharp(j.src).metadata();
  if (width <= j.w) continue; // a original já é desse tamanho ou menor: o srcset usa a própria

  await sharp(j.src).resize({ width: j.w, withoutEnlargement: true }).webp({ quality: j.quality }).toFile(j.out);
  made++;
  console.log('criado', j.out);
}
console.log(`${made} imagem(ns) gerada(s), ${jobs.length - made} já atualizada(s).`);
