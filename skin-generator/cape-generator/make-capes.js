// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
const Jimp = require("jimp");
const fs = require("fs");

let count = 0;

async function main() {
  const path = '../../../orthoverse-offline/heraldry/escutcheons/'
  let files = fs.readdirSync(path);
  
  for (i = 0; i < files.length; i++) {

    const template = await Jimp.read('./cape_template.png');
    const shieldPNG = await Jimp.read(path + files[i])
    shieldPNG.resize(10, 17);
    const final = await template.composite(shieldPNG, 0, 0, {
      mode: Jimp.BLEND_SOURCE_OVER
    });

    final.write('./capes/' + files[i].slice(0,-4) + '-cape.png')
  }
}

main();
