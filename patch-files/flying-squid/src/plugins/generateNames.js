const guestPrefix = [
 'Guest', 'Gast', // 'Invitado', 'Invite', 'Vieras', 'Ospite', 'Convivado', 'Gesuto'
]

const syllable1 = [
  // 'B','C','D','F','G','H','J','K','L','M','N', 'P', 'R', 'S', 'T', 'V',
  'Al', 'An', 'At', 'Aur', 'Aus', 'Ain', 'Aim',
  'Baf', 'Bar', 'Ber', 'Ben', 'Bif', 'Bil', 'Bom', 'Bris', 'Brok', 'Brun', 'Bur', 'Bor',
  'Cor', 'Car', 'Cer', 'Cil', 'Cir', 'Cin', 'Cud', 'Cal', 'Chan', 'Char', 'Chor', 'Chil',
  'Dag', 'Dar', 'Del', 'Dol', 'Dor', 'Draup', 'Duf', 'Dun', 'Dur', 'Dval', 'Dal', 'Dia',
  'Egg', 'Eik', 'Eil', 'Eit', 'Er', 'En',
  'Faf', 'Fain', 'Far', 'Fil', 'Fin', 'Fal', 'Fol', 'For', 'Freg', 'Frar', 'Frit', 'Frost', 'Ful', 'Fun', 'Frey',
  'Gan', 'Gal', 'Gin', 'Gloi', 'Goll', 'Grer', 'Grim', 'Gud', 'Gus',
  'Han', 'Har', 'Haug', 'Hep', 'Her', 'Hild', 'Het', 'Hot', 'Horn', 'Hor', 'Het', 'Hug',
  'Ir', 'Iv', 'Ian', 'In', 'Ich',
  'Jak', 'Jar', 'Jor', 'Jer', 'Jan', 'Jen', 
  'Kil', 'Kel', 'Kal', 'Kin', 'Ken', 'Kon', 'Kor', 'Kar', 'Ker', 'Keir',
  'Lit', 'Lof', 'Lon', 'Lin', 'Len', 'Lan', 'Lor', 'Lar', 'Ler', 'Lir',
  'Mit', 'Mot', 'Moin', 'Mon', 'Mot', 'Mun', 'Mer', 'Mor', 'Mon', 'Mol',
  'Nab', 'Naf', 'Nain', 'Nal', 'Nar', 'Nef', 'Nit', 'Nor', 'Nyr', 'Nyl',
  'Oin', 'Ol', 'Or', 'Ot', 'Og',
  'Pat', 'Pan', 'Par', 'Pel', 'Pren', 'Puck', 'Pen', 'Per', 'Pal',
  'Quin', 'Quid', 'Quen', 'Quel', 'Quor',
  'Rat', 'Reg', 'Rek', 'Ran', 'Rich', 'Rhon', 'Rhin',
  'Sin', 'Skav', 'Skir', 'Sut', 'Sven', 'Sol', 'Sal', 'Sel', 'Sor', 'Sar', 'Ser',
  'Thek', 'Tig', 'Thot', 'Thor', 'Thror', 'Thrain', 'Tut', 'Tel', 'Tal', 'Tol', 'Thur', 'Thun', 'Tag',
  'Un', 'Ur', 'Um', 'Uth',
  'Var', 'Veg', 'Vig', 'Vec', 'Veth', 'Ver', 'Vol', 'Vel',
  'Yng',
]
const syllable2 = [
 '', 'a', 'e', 'i', 'o', 'u',
 'ab', 'ac', 'ad', 'af', 'ag', 'ack', 'av', 'ar', 'as', 'at', 'an', 'am', 'al',
 'eb', 'ec', 'ed', 'ef', 'eg', 'eck', 'ev', 'er', 'es', 'et', 'en', 'em', 'el',
 'ib', 'ic', 'id', 'if', 'ig', 'ick', 'iv', 'ir', 'is', 'it', 'in', 'im', 'il',
 'ob', 'oc', 'od', 'of', 'og', 'ock', 'ov', 'or', 'os', 'ot', 'on', 'om', 'ol',
 'ub', 'uc', 'ud', 'uf', 'ug', 'uv', 'ur', 'us', 'ut', 'un', 'um', 'ul',
 'ay', 'ey', 'iy', 'oy' ,'uy'
]
const syllable3 = [

 '', 'a', 'e', 'i', 'o', 'u',
 'alf', 'ar', 'arn', 'ail',
 'bul', 'born', 'bon', 'ben', 'bal', 'bog', 'balf', 'bom', 'bia', 'bin', 'ber',
 'dalf', 'dri', 'dul', 'dial', 'diel', 'dom', 'dre', 'dar', 'dia', 'din', 'den', 'der', 'do', 'dor',
 'er', 'en', 'elf', 'ed', 'eng',
 'ful', 'fel', 'fil', 'fur', 'fer', 'fir', 'fial', 'fey', 'fin', 'fen',
 'ger', 'gor', 'gorn', 'gin', 'gen', 'gon', 'garn', 'gur', 'gar', 'gul', 'gel', 'gal',
 'her', 'hor', 'horn', 'hur',
 'i', 'isir', 'in', 'ish', 'ilf', 'ir',
 'lorn', 'lin', 'lane', 'lang', 'lob', 'ling', 'lad', 'lode', 'lave',
 'mir', 'mor', 'mar', 'mish', 'man', 'mode',
 'nir', 'nor', 'nar', 'nil', 'nol', 'nar', 'nalf', 'nolf', 'nelf', 'ne', 'na', 'nin', 'nen',
 'olf', 'or', 'on', 'om', 'og', 'ot',
 'rial', 'rif', 'rir', 're', 'ra', 'rin', 'ren',
 'sil', 'se', 'sa', 'sin', 'sen', 'sun', 'sith', 'so', 'ser', 'sor',
 'tor', 'ti', 'ter',  'tri', 'tin', 'ten', 'tur',
 'vi',  'vul', 'vir', 'ver', 've', 'va', 'vin', 'ven', 'vur',
 'ur', 'ul', 'ulf', 'un', 'u',
 'wir', 'wen', 'win', 'we', 'wan', 'wa', 'wur',
]



function getName (guest = false) {
  let a = syllable1[Math.floor(Math.random()*syllable1.length)]
  if (guest) {
    a = guestPrefix[Math.floor(Math.random()*guestPrefix.length)]
  }
  let b = syllable2[Math.floor(Math.random()*syllable2.length)]
  let c = ''
  if (a.length === 1) {
   while (c === '') { c = syllable3[Math.floor(Math.random()*syllable3.length)] }
  } else { c = syllable3[Math.floor(Math.random()*syllable3.length)] }
  if (b !== c[0]) {
    return a + b + c
  } else {
    return a + b
  }
}

module.exports={ getName }

