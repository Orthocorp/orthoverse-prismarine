// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
const Jimp = require("jimp");

const components = {
  "female": {
    "body":  ["deep-gold.png", "deep-neutral.png", "pink.png", "warm-olive.png"],
    "eyes": ["female-blue.png", "female-green.png", "female-red.png", "female-brown.png", "female-hazel.png"],
    "gowns": ["enchantress-black.png", "enchantress-green.png", "enchantress-red.png", "enchantress-blue.png", "enchantress-orange.png", "enchantress-white.png", "enchantress-gray.png", "enchantress-purple.png"],
    "hair": ["none.png", "female-black-008.png", "female-light-brown-008.png", "female-blond-008.png", "female-red-008.png", "female-brown-008.png", "female-very-dark-brown-008.png", "female-gray-008.png", "female-white-008.png"]
  },
  "male": {
    "body":  ["deep-gold.png", "deep-neutral.png", "pink.png", "warm-olive.png"],
    "eyes": ["male-blue.png", "male-brown.png", "male-green.png", "male-hazel.png", "male-red.png"],
    "gowns": ["wizard-black.png", "wizard-gray.png", "wizard-orange.png", "wizard-red.png", "wizard-blue.png", "wizard-green.png", "wizard-purple.png", "wizard-white.png"],
    "hair": ["none.png", "male-black-009.png", "male-dark-brown-009.png", "male-red-009.png", "male-blond-009.png", "male-gray-009.png", "male-white-009.png", "male-brown-009.png", "male-light-brown-009.png"],
    "beard": ["none.png", "beard-003-black.png", "beard-005-black.png", "beard-009-black.png", "beard-003-blond.png", "beard-005-blond.png", "beard-009-blond.png", "beard-003-brown.png", "beard-005-brown.png", "beard-009-brown.png", "beard-003-dark-brown.png", "beard-005-dark-brown.png", "beard-009-dark-brown.png", "beard-003-gray.png", "beard-005-gray.png", "beard-009-gray.png", "beard-003-light-brown.png", "beard-005-light-brown.png", "beard-009-light-brown.png", "beard-003-red.png", "beard-005-red.png", "beard-009-red.png", "beard-003-white.png", "beard-005-white.png", "beard-009-white.png"]
  }
}


let count = 0;

async function main() {

  const f = components.female

  for (let body = 0; body < f.body.length; body++) {
    for (let eyes = 0; eyes < f.eyes.length; eyes++) {
      for (let gowns = 0; gowns < f.gowns.length; gowns++) {
        for (let hair = 0; hair < f.hair.length; hair++) {
          /* console.log('./components/female/body/' + f.body[body])
          console.log('./components/female/eyes/' + f.eyes[eyes])
          console.log('./components/female/gowns/' + f.gowns[gowns])
          console.log('./components/female/hair/' + f.hair[hair]) */
          process.stdout.write(".");
          const bodyPNG = await Jimp.read('./components/female/body/' + f.body[body]);
          const eyesPNG = await Jimp.read('./components/female/eyes/' + f.eyes[eyes]);
          const gownsPNG = await Jimp.read('./components/female/gowns/' + f.gowns[gowns]);
          const hairPNG = await Jimp.read('./components/female/hair/' + f.hair[hair]);
          

          const intA = await bodyPNG.composite(eyesPNG, 0, 0, {
                mode: Jimp.BLEND_SOURCE_OVER
              })
          
          const intB = await intA.composite(gownsPNG, 0, 0, {
                mode: Jimp.BLEND_SOURCE_OVER
              })

          const final = await intB.composite(hairPNG, 0, 0, {
                mode: Jimp.BLEND_SOURCE_OVER
              })
          final.write('./fml/' + count.toString() + ".png");
          await count++;
        }
      }
    }
  }

  console.log(count)
  const m = components.male

  for (let body = 0; body < m.body.length; body++) {
    for (let eyes = 0; eyes < m.eyes.length; eyes++) {
      for (let gowns = 0; gowns < m.gowns.length; gowns++) {
        for (let hair = 0; hair < m.hair.length; hair++) {
          for (let beard = 0; beard < m.beard.length; beard++) {
            process.stdout.write(".");
            const bodyPNG = await Jimp.read('./components/male/body/' + m.body[body]);
            const eyesPNG = await Jimp.read('./components/male/eyes/' + m.eyes[eyes]);
            const gownsPNG = await Jimp.read('./components/male/gowns/' + m.gowns[gowns]);
            const hairPNG = await Jimp.read('./components/male/hair/' + m.hair[hair]);
            const beardPNG = await Jimp.read('./components/male/beard/' + m.beard[beard]);         

            const intA = await bodyPNG.composite(eyesPNG, 0, 0, {
                  mode: Jimp.BLEND_SOURCE_OVER
                })
          
            const intB = await intA.composite(gownsPNG, 0, 0, {
                  mode: Jimp.BLEND_SOURCE_OVER
                })

            const intC = await intB.composite(hairPNG, 0, 0, {
                  mode: Jimp.BLEND_SOURCE_OVER
                })
 
            const final = await intC.composite(beardPNG, 0, 0, {
                  mode: Jimp.BLEND_SOURCE_OVER
                })
            final.write('./mle/' + count.toString() + ".png");
            await count++;
          }
        }
      }
    }
  }

  console.log(count++)

}

main();
