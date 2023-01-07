'use strict';

const Vec3 = require('vec3').Vec3;
const mcData = require('minecraft-data')('1.15.2')
const rand = require('random-seed')

const bh = 76 - 32 - 30 + 8 // + 15;

const gray = 0
const lightgray = 1
const cyan = 2
const purple = 3
const blue = 4
const brown =5
const green = 6
const red = 7
const black = 8
const white = 9
const orange = 10
const magenta = 11
const lightblue = 12
const yellow = 13
const lime = 14
const pink = 15

const diorite = mcData.blocksByName.diorite.id;
const andesite = mcData.blocksByName.polished_diorite.id;
const stone = mcData.blocksByName.stone_bricks.id;
const air = mcData.blocksByName.air.id;
const cobble = mcData.blocksByName.cobblestone.id;
const oak = mcData.blocksByName.oak_wood.id;
const water = mcData.blocksByName.water.id;
const concrete = mcData.blocksByName.gray_concrete.id;
const ladder = mcData.blocksByName.ladder.id;
const glass = mcData.blocksByName.glass.id;

function henge(chunk, level, seedRand, posX, posZ, chunkX, chunkZ) {
  const hengeColumns = [
    [14,0],[13,0],[11,1],[10,1],[8,2],[7,2],[5,4],
    [4,5],[2,7],[2,8],[1,10],[1,11],[0,13],[0,14]
  ];
  const hengeLintels = [
    [15,0],[12,0],[12,1],[9,1],[9,2],[6,2],[6,3],[5,3],
    [4,4],[3,5],[3,6],[2,6],[1,8],[1,9],[1,12],[0,12],[0,15]
  ];
  const hengeRocks = [
    [13,4],[10,5],[7,7],[5,10],[3,13],[14,11],[11,14]
  ];

  const dolmenColumnsN = [
    [14,8],[13,8],[10,9],[9,10],[8,12],[7,13],[6,15]
  ];
  const dolmenColumnsS = [
    [6,0],[6,2],[6,3]
  ];

  const dolmenLintelsN = [
    [15,8],[12,8]
  ];
  const dolmenLintelsS = [
    [6,1]
  ];

  const portal = [
    [15,0],[5,5],[4,4],[0,15]
  ]

  const cobble = mcData.blocksByName.stone.id;
  const stone = mcData.blocksByName.stone_bricks.id;
  let portblock = mcData.blocksByName.blue_concrete.id;
  if ((Math.abs(chunkX) < 128) && (Math.abs(chunkZ) < 128)) {
    portblock = mcData.blocksByName.green_concrete.id;
  }
  if ((Math.abs(chunkX) > 128) && (Math.abs(chunkZ) > 128)) {
    portblock = mcData.blocksByName.red_concrete.id;
  }

  function splurge(a, b) {

    for (let h=22; h < 27; h++) {
      for (let i=0; i < hengeColumns.length; i++) {
        const pos = new Vec3(
          Math.abs(a * 15 - hengeColumns[i][0]),
          h+bh,
          Math.abs(b * 15 - hengeColumns[i][1])
        );
        if (h === 26) { 
          chunk.setBlockType(pos, stone)
        } else {
          chunk.setBlockType(pos, cobble)
        }
      }
    }
    for (let i=0; i < portal.length; i++) {
      const pos = new Vec3(
        Math.abs(a * 15 - portal[i][0]),
        21+bh,
        Math.abs(b * 15 - portal[i][1])
      );
      chunk.setBlockType(pos, portblock)
    }
    for (let i=0; i < hengeLintels.length; i++) {
      const pos = new Vec3(
        Math.abs(a * 15 - hengeLintels[i][0]),
        26+bh,
        Math.abs(b * 15 - hengeLintels[i][1])
      );
      chunk.setBlockType(pos, stone)
    }

    for (let h = 22; h < 25; h++) {
      for (let i=0; i < hengeRocks.length; i++) {
        const pos = new Vec3(
          Math.abs(a * 15 - hengeRocks[i][0]),
          h+bh,
          Math.abs(b * 15 - hengeRocks[i][1])
        );
        chunk.setBlockType(pos, stone)
      }
    }

    if (b === 0) {
      for (let h=22; h < 28; h++) {
        for (let i=0; i < dolmenColumnsN.length; i++) {
          const pos = new Vec3(
            Math.abs(a * 15 - dolmenColumnsN[i][0]),
            h+bh,
            dolmenColumnsN[i][1]
          );
          if (h == 27) { 
            chunk.setBlockType(pos, stone)
          } else {
            chunk.setBlockType(pos, cobble)
          }
        }
      }
      for (let i=0; i < dolmenLintelsN.length; i++) { 
        const pos = new Vec3(
          Math.abs(a * 15 - dolmenLintelsN[i][0]),
          27+bh,
          dolmenLintelsN[i][1]
          );   
          chunk.setBlockType(pos, stone)
      }
    } else {
      for (let h = 22; h < 28; h++) {
        for (let i=0; i < dolmenColumnsS.length; i++) {
          const pos = new Vec3(
            Math.abs(a * 15 - dolmenColumnsS[i][0]),
            h+bh,
            dolmenColumnsS[i][1]
          );
          if (h == 27) { 
            chunk.setBlockType(pos, stone)
          } else {
            chunk.setBlockType(pos, cobble)
          }
        }
      }
      for (let i=0; i < dolmenLintelsS.length; i++) { 
        const pos = new Vec3(
          Math.abs(a * 15 - dolmenLintelsS[i][0]),
          27+bh,
          dolmenLintelsS[i][1]
          );   
          chunk.setBlockType(pos, stone)
      }
    }
  }

  if (((posX == 2) || (posX == 3)) &&
      ((posZ == 2) || (posZ == 3))) { splurge(posX - 2, posZ - 2) }
}

/*
     CASTLES
*/

// castle 1
function castle_1(chunk, level, seedRand, posX, posZ) {
  let pos
  const wall = [
    [15,13],[14,13],[13,13],[13,14],[13,15]
  ]

  // tower floor
  for (let x=13; x<16; x++) {
    for (let y=13; y<16; y++) {
      const pos = new Vec3(Math.abs((posX - 2) * 15 - x),level,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, cobble)
    } 
  }

  // walls
  for (let h=level + 1; h < level + 8; h++) {
    for (let i=0; i < wall.length; i++) {
        pos = new Vec3(
        Math.abs((posX - 2) * 15 - wall[i][0]),
        h,
        Math.abs((posZ - 2) * 15 - wall[i][1])
      );
      if (h == level + 7) {
        chunk.setBlockType(pos, oak)
      } else {
        chunk.setBlockType(pos, andesite)
      }
    }
  }
  for (let h=0; h<2; h++) {
      for (let x =12; x < 16; x++) {
          pos = new Vec3(
          Math.abs((posX - 2) * 15 - x),
          level + 7 + h,
          Math.abs((posZ - 2) * 15 - 12)
        );
        chunk.setBlockType(pos, andesite)
    }
    for (let y =13; y < 16; y++) {
          pos = new Vec3(
          Math.abs((posX - 2) * 15 - 12),
          level + 7 + h,
          Math.abs((posZ - 2) * 15 - y)
        );
        chunk.setBlockType(pos, andesite)
    }
  }
  pos = new Vec3(
    Math.abs((posX - 2) * 15 - 14),
    level + 8,
    Math.abs((posZ - 2) * 15 - 12)
  );
  chunk.setBlockType(pos, air)
  pos = new Vec3(
    Math.abs((posX - 2) * 15 - 12),
    level + 8,
    Math.abs((posZ - 2) * 15 - 14)
  );
  chunk.setBlockType(pos, air)

  switch (posX * 10 + posZ) {
  case 22:
    pos = new Vec3(14, level + 3, 15);
    // stairs
    chunk.setBlockType(pos.offset(0,0,0), oak);   
    chunk.setBlockType(pos.offset(0,1,-1), oak); 
    chunk.setBlockType(pos.offset(1,2,-1), oak); 
    chunk.setBlockType(pos.offset(0,4,0), oak); 
    chunk.setBlockType(pos.offset(1,4,0), oak); 
    break;
  case 32:
    pos = new Vec3(0, level + 6, 14);
    // stairs
    chunk.setBlockType(pos.offset(0,0,0), oak);   
    chunk.setBlockType(pos.offset(1,1,0), oak); 
    chunk.setBlockType(pos.offset(1,1,1), oak);
    chunk.setBlockType(pos.offset(0,1,1), oak);   
    break;
  case 23:
    pos = new Vec3(15, level + 1, 2);
    chunk.setBlockType(pos, air);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), stone);
    chunk.setBlockType(pos.offset(-1,0,0), stone);
    chunk.setBlockType(pos.offset(-1,1,0), stone);
    chunk.setBlockType(pos.offset(-1,2,0), stone);
    // stairs
    // chunk.setBlockType(pos.offset(0,-1,-1), oak);   
    chunk.setBlockType(pos.offset(-1,0,-1), oak); 
    chunk.setBlockType(pos.offset(-1,1,-2), oak);
    //floor
    chunk.setBlockType(pos.offset(0,6,-2), oak); 
    chunk.setBlockType(pos.offset(-1,6,-2), oak);
    chunk.setBlockType(pos.offset(-1,6,-1), oak); 
    chunk.setBlockType(pos.offset(0,6,-1), oak);
    break;
  case 33:
    pos = new Vec3(0, level + 1, 2);
    chunk.setBlockType(pos, air);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), stone);
    chunk.setBlockType(pos.offset(1,0,0), stone);
    chunk.setBlockType(pos.offset(1,1,0), stone);
    chunk.setBlockType(pos.offset(1,2,0), stone);
    //floor
    chunk.setBlockType(pos.offset(0,6,-2), oak); 
    chunk.setBlockType(pos.offset(1,6,-2), oak);
    chunk.setBlockType(pos.offset(1,6,-1), oak); 
    chunk.setBlockType(pos.offset(0,6,-1), oak);
    break;
  }

}

// castle 2
function castle_2(chunk, level, seedRand, posX, posZ) {
  // tower floor
  for (let x=7; x<16; x++) {
    for (let z=13; z<16; z++) {
      let pos = new Vec3(Math.abs((posX - 2) * 15 - x),level,Math.abs((posZ - 2) * 15 - z))
      chunk.setBlockType(pos, cobble)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level-1,Math.abs((posZ - 2) * 15 - z))
      chunk.setBlockType(pos, cobble)
    } 
  }

  let pos
  const wall = [
    [12,13],[11,13],[10,13],[12,14],[12,15],
    [9,13],[8,13],[7,13],[7,14],[7,15]
  ]

  const wall2 = [
    [15,13],[14,13],[13,13]
  ]


  for (let h=level + 1; h < level + 5; h++) {
    for (let i=0; i < wall2.length; i++) {
        pos = new Vec3(
        Math.abs((posX - 2) * 15 - wall2[i][0]),
        h,
        Math.abs((posZ - 2) * 15 - wall2[i][1])
      );
      chunk.setBlockType(pos, andesite)
    }
  }


  for (let h=level + 1; h < level + 8; h++) {
    for (let i=0; i < wall.length; i++) {
        pos = new Vec3(
        Math.abs((posX - 2) * 15 - wall[i][0]),
        h,
        Math.abs((posZ - 2) * 15 - wall[i][1])
      );
      if (h == level + 7) {
        chunk.setBlockType(pos, oak)
      } else {
        chunk.setBlockType(pos, andesite)
      }
    }
  }
  for (let h=0; h<2; h++) {
    for (let x =6; x < 14; x++) {
      pos = new Vec3(
        Math.abs((posX - 2) * 15 - x),
        level + 7 + h,
        Math.abs((posZ - 2) * 15 - 12)
      );
      chunk.setBlockType(pos, andesite)
    }
    for (let y =13; y < 16; y++) {
      pos = new Vec3(
        Math.abs((posX - 2) * 15 - 13),
        level + 7 + h,
        Math.abs((posZ - 2) * 15 - y)
      );
      chunk.setBlockType(pos, andesite)
      pos = new Vec3(
        Math.abs((posX - 2) * 15 - 6),
        level + 7 + h,
        Math.abs((posZ - 2) * 15 - y)
      );
      chunk.setBlockType(pos, andesite)
      }
    }
  pos = new Vec3(
      Math.abs((posX - 2) * 15 - 13),
      level + 8,
      Math.abs((posZ - 2) * 15 - 14)
  );
  chunk.setBlockType(pos, air)
  pos = new Vec3(
      Math.abs((posX - 2) * 15 - 11),
      level + 8,
      Math.abs((posZ - 2) * 15 - 12)
  );
  chunk.setBlockType(pos, air)
  pos = new Vec3(
      Math.abs((posX - 2) * 15 - 6),
      level + 8,
      Math.abs((posZ - 2) * 15 - 14)
  );
  chunk.setBlockType(pos, air)
   pos = new Vec3(
      Math.abs((posX - 2) * 15 - 8),
      level + 8,
      Math.abs((posZ - 2) * 15 - 12)
  );
  chunk.setBlockType(pos, air)

  pos = new Vec3(
      Math.abs((posX - 2) * 15 - 12),
      level + 1,
      Math.abs((posZ - 2) * 15 - 15)
  );
  chunk.setBlockType(pos, air)
   pos = new Vec3(
      Math.abs((posX - 2) * 15 - 12),
      level + 2,
      Math.abs((posZ - 2) * 15 - 15)
  );
  chunk.setBlockType(pos, air)

  switch (posX * 10 + posZ) {
  case 22:
    pos = new Vec3(15, level + 1, 16);
    chunk.setBlockType(pos.offset(-4,6,-1), oak);
    chunk.setBlockType(pos.offset(-5,6,-1), oak);
    chunk.setBlockType(pos.offset(-6,6,-1), oak);
    chunk.setBlockType(pos.offset(-4,6,-2), oak);
    chunk.setBlockType(pos.offset(-5,6,-2), oak);
    chunk.setBlockType(pos.offset(-6,6,-2), oak);
    chunk.setBlockType(pos.offset(-7,5,-1), oak);
    chunk.setBlockType(pos.offset(-7,6,-2), oak);

    break;
  case 32:
    pos = new Vec3(0, level + 1, 16);
    chunk.setBlockType(pos.offset(4,6,-1), oak);
    chunk.setBlockType(pos.offset(5,6,-1), oak);
    chunk.setBlockType(pos.offset(6,6,-1), oak);
    chunk.setBlockType(pos.offset(4,6,-2), oak);
    chunk.setBlockType(pos.offset(5,6,-2), oak);
    chunk.setBlockType(pos.offset(6,6,-2), oak);
    chunk.setBlockType(pos.offset(7,5,-1), oak);
    chunk.setBlockType(pos.offset(7,6,-2), oak);
    break;
  case 23:
    pos = new Vec3(15, level + 1, 2);
    chunk.setBlockType(pos, air);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), stone);
    chunk.setBlockType(pos.offset(-1,0,0), stone);
    chunk.setBlockType(pos.offset(-1,1,0), stone);
    chunk.setBlockType(pos.offset(-1,2,0), stone);

    chunk.setBlockType(pos.offset(-4,0,-1), oak);
    chunk.setBlockType(pos.offset(-5,1,-1), oak);
    chunk.setBlockType(pos.offset(-6,2,-1), oak);
    chunk.setBlockType(pos.offset(-7,3,-1), oak);
    chunk.setBlockType(pos.offset(-7,4,-2), oak);

    chunk.setBlockType(pos.offset(-4,6,-1), oak);
    chunk.setBlockType(pos.offset(-5,6,-1), oak);
    chunk.setBlockType(pos.offset(-6,6,-1), oak);
    chunk.setBlockType(pos.offset(-4,6,-2), oak);
    chunk.setBlockType(pos.offset(-5,6,-2), oak);
    chunk.setBlockType(pos.offset(-6,6,-2), oak);
    break;
  case 33:
    pos = new Vec3(0, level + 1, 2);
    chunk.setBlockType(pos, air);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), stone);
    chunk.setBlockType(pos.offset(1,0,0), stone);
    chunk.setBlockType(pos.offset(1,1,0), stone);
    chunk.setBlockType(pos.offset(1,2,0), stone);

    chunk.setBlockType(pos.offset(4,0,-1), oak);
    chunk.setBlockType(pos.offset(5,1,-1), oak);
    chunk.setBlockType(pos.offset(6,2,-1), oak);
    chunk.setBlockType(pos.offset(7,3,-1), oak);
    chunk.setBlockType(pos.offset(7,4,-2), oak);

    chunk.setBlockType(pos.offset(4,6,-1), oak);
    chunk.setBlockType(pos.offset(5,6,-1), oak);
    chunk.setBlockType(pos.offset(6,6,-1), oak);
 
    chunk.setBlockType(pos.offset(4,6,-2), oak);
    chunk.setBlockType(pos.offset(5,6,-2), oak);
    chunk.setBlockType(pos.offset(6,6,-2), oak);
    break;
  }

}

function castle_3(chunk, level, seedRand, posX, posZ) {
  let pos
  castle_2(chunk, level, seedRand, posX, posZ)

  // moat
  for (let x=6; x<16; x++) {
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level+1,Math.abs((posZ - 2) * 15 - 12))
      chunk.setBlockType(pos, air)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level,Math.abs((posZ - 2) * 15 - 12))
      chunk.setBlockType(pos, water)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level-1,Math.abs((posZ - 2) * 15 - 12))
      chunk.setBlockType(pos, water)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level+1,Math.abs((posZ - 2) * 15 - 11))
      chunk.setBlockType(pos, air)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level,Math.abs((posZ - 2) * 15 - 11))
      chunk.setBlockType(pos, water)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level-1,Math.abs((posZ - 2) * 15 - 11))
      chunk.setBlockType(pos, water)
  } 
  for (let y=11; y<16; y++) {
      pos = new Vec3(Math.abs((posX - 2) * 15 - 6),level+1,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, air)
      pos = new Vec3(Math.abs((posX - 2) * 15 - 6),level,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, water)
      pos = new Vec3(Math.abs((posX - 2) * 15 - 6),level-1,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, water)
      pos = new Vec3(Math.abs((posX - 2) * 15 - 5),level+1,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, air)
      pos = new Vec3(Math.abs((posX - 2) * 15 - 5),level,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, water)
      pos = new Vec3(Math.abs((posX - 2) * 15 - 5),level-1,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, water)
  } 
  switch (posX * 10 + posZ) {
  case 23:
    pos = new Vec3(15, level + 1, 2);
    chunk.setBlockType(pos, air);
    chunk.setBlockType(pos.offset(0,-1,1), oak);
    chunk.setBlockType(pos.offset(0,-1,2), oak);
    break;
  case 33:
    pos = new Vec3(0, level + 1, 2);
    chunk.setBlockType(pos, air);
    chunk.setBlockType(pos.offset(0,-1,1), oak);
    chunk.setBlockType(pos.offset(0,-1,2), oak);
    break;
  }
}




function castle_4(chunk, level, seedRand, posX, posZ) {
  castle_1(chunk, level, seedRand, posX, posZ)
  let pos;
  const mv = 5;
  const wall = [
    [12-5,7-5],[11-5,7-5],[10-5,7-5],[12-5,8-5],[12-5,9-5],
    [9-5,7-5],[8-5,7-5],[7-5,7-5],[7-5,8-5],[7-5,9-5],
    [12-5,12-5],[11-5,12-5],[10-5,12-5], [12-5,10-5],[12-5,11-5],
    [9-5,12-5],[8-5,12-5],[7-5,12-5], [7-5,10-5],[7-5,11-5]
  ]

  const wall2 = [
    [12,13],[11,12],[10,11],[9,10],[8,9],[7,8],
    [8,2],[9,2],[10,2],[11,2],[12,2],[13,2],[14,2],[15,2]
  ]

  function floorspace(chunk, level, seedRand, posX, posZ) {
    for (let x=2; x<16; x++) {
      for (let z=2; z<8; z++) {
        let pos = new Vec3(Math.abs((posX - 2) * 15 - x),level,Math.abs((posZ - 2) * 15 - z))
        chunk.setBlockType(pos, cobble)
        pos = new Vec3(Math.abs((posX - 2) * 15 - x),level-1,Math.abs((posZ - 2) * 15 - z))
        chunk.setBlockType(pos, cobble)
      } 
    }
    for (let x=7; x<16; x++) {
      for (let z=8; z<16; z++) {
        if ((x-z)+2 > 0) {
          let pos = new Vec3(Math.abs((posX - 2) * 15 - x),level,Math.abs((posZ - 2) * 15 - z))
          chunk.setBlockType(pos, cobble)
          pos = new Vec3(Math.abs((posX - 2) * 15 - x),level-1,Math.abs((posZ - 2) * 15 - z))
          chunk.setBlockType(pos, cobble)
        }
      } 
    }
  }

  function tower(chunk, level, seedRand, posX, posZ) {
    for (let h=level + 1; h < level + 5; h++) {
      for (let i=0; i < wall2.length; i++) {
          pos = new Vec3(
          Math.abs((posX - 2) * 15 - wall2[i][0]),
          h,
          Math.abs((posZ - 2) * 15 - wall2[i][1])
        );
        chunk.setBlockType(pos, andesite)
      }
    }
    for (let h=level + 1; h < level + 8; h++) {
      for (let i=0; i < wall.length; i++) {
          pos = new Vec3(
          Math.abs((posX - 2) * 15 - wall[i][0]),
          h,
          Math.abs((posZ - 2) * 15 - wall[i][1])
        );
        if (h == level + 7) {
          chunk.setBlockType(pos, oak)
        } else {
          chunk.setBlockType(pos, andesite)
        }
      }
    }
    for (let h=0; h<2; h++) {
      for (let x =6; x < 14; x++) {
        pos = new Vec3(
          Math.abs((posX - 2) * 15 - x + mv),
          level + 7 + h,
          Math.abs((posZ - 2) * 15 - 6 + mv)
        );
        chunk.setBlockType(pos, andesite)
        pos = new Vec3(
          Math.abs((posX - 2) * 15 - x + mv),
          level + 7 + h,
          Math.abs((posZ - 2) * 15 - 13 + mv)
        );
        chunk.setBlockType(pos, andesite)
      }

      for (let y =7; y < 13; y++) {
        pos = new Vec3(
          Math.abs((posX - 2) * 15 - 13 + mv),
          level + 7 + h,
          Math.abs((posZ - 2) * 15 - y + mv)
        );
        chunk.setBlockType(pos, andesite)
        pos = new Vec3(
          Math.abs((posX - 2) * 15 - 6 + mv),
          level + 7 + h,
          Math.abs((posZ - 2) * 15 - y + mv)
        );
        chunk.setBlockType(pos, andesite)
      }
    }
    pos = new Vec3(
      Math.abs((posX - 2) * 15 - 8 + mv),
      level + 8,
      Math.abs((posZ - 2) * 15 - 6 + mv)
    );
    chunk.setBlockType(pos, air)
     pos = new Vec3(
      Math.abs((posX - 2) * 15 - 8 + mv),
      level + 8,
      Math.abs((posZ - 2) * 15 - 13 + mv)
    );
    chunk.setBlockType(pos, air)
    pos = new Vec3(
      Math.abs((posX - 2) * 15 - 11 + mv),
      level + 8,
      Math.abs((posZ - 2) * 15 - 6 + mv)
    );
    chunk.setBlockType(pos, air)
    pos = new Vec3(
      Math.abs((posX - 2) * 15 - 11 + mv),
      level + 8,
      Math.abs((posZ - 2) * 15 - 13 + mv)
    );
    chunk.setBlockType(pos, air)
    pos = new Vec3(
      Math.abs((posX - 2) * 15 - 13 + mv),
      level + 8,
      Math.abs((posZ - 2) * 15 - 8 + mv)
    );
    chunk.setBlockType(pos, air)
    pos = new Vec3(
      Math.abs((posX - 2) * 15 - 6 + mv),
      level + 8,
      Math.abs((posZ - 2) * 15 - 8 + mv)
    );
    chunk.setBlockType(pos, air)
    pos = new Vec3(
      Math.abs((posX - 2) * 15 - 13 + mv),
      level + 8,
      Math.abs((posZ - 2) * 15 - 11 + mv)
    );
    chunk.setBlockType(pos, air)
    pos = new Vec3(
      Math.abs((posX - 2) * 15 - 6 + mv),
      level + 8,
      Math.abs((posZ - 2) * 15 - 11 + mv)
    );
    chunk.setBlockType(pos, air)
    pos = new Vec3(
      Math.abs((posX - 2) * 15 - 12 + mv),
      level + 1,
      Math.abs((posZ - 2) * 15 - 9 + mv)
    );
    chunk.setBlockType(pos, air)
      pos = new Vec3(
      Math.abs((posX - 2) * 15 - 12 + mv),
      level + 2,
      Math.abs((posZ - 2) * 15 - 9 + mv)
    );
    chunk.setBlockType(pos, air)
    pos = new Vec3(
      Math.abs((posX - 2) * 15 - 12 + mv),
      level + 1,
      Math.abs((posZ - 2) * 15 - 10 + mv)
    );
    chunk.setBlockType(pos, air)
    pos = new Vec3(
      Math.abs((posX - 2) * 15 - 12 + mv),
      level + 2,
      Math.abs((posZ - 2) * 15 - 10 + mv)
    );
    chunk.setBlockType(pos, air)
  }

  switch (posX * 10 + posZ) {
  case 22:
    floorspace(chunk, level, seedRand, posX, posZ);
    tower(chunk, level, seedRand, posX, posZ);
    pos = new Vec3(15-mv, level + 1, 16-mv);
    chunk.setBlockType(pos.offset(-4,6,-7), oak);
    chunk.setBlockType(pos.offset(-5,6,-7), oak);
    chunk.setBlockType(pos.offset(-6,6,-7), oak);
    chunk.setBlockType(pos.offset(-4,6,-8), oak);
    chunk.setBlockType(pos.offset(-5,6,-8), oak);
    chunk.setBlockType(pos.offset(-6,6,-8), oak);
    chunk.setBlockType(pos.offset(-7,5,-7), oak);
    chunk.setBlockType(pos.offset(-7,6,-8), oak);

    chunk.setBlockType(pos.offset(-4,0,-5), oak);
    chunk.setBlockType(pos.offset(-5,1,-5), oak);
    chunk.setBlockType(pos.offset(-6,2,-5), oak);
    chunk.setBlockType(pos.offset(-7,3,-5), oak);
    chunk.setBlockType(pos.offset(-7,4,-6), oak);
    chunk.setBlockType(pos.offset(-4,6,-5), oak);
    chunk.setBlockType(pos.offset(-5,6,-5), oak);
    chunk.setBlockType(pos.offset(-6,6,-5), oak);
    chunk.setBlockType(pos.offset(-4,6,-6), oak);
    chunk.setBlockType(pos.offset(-5,6,-6), oak);
    chunk.setBlockType(pos.offset(-6,6,-6), oak);
    pos = new Vec3(15, level + 1, 13);
    chunk.setBlockType(pos.offset(0,0,0), air);
    chunk.setBlockType(pos.offset(0,1,0), air);

    pos = new Vec3(4, level + 1, 7);
    chunk.setBlockType(pos.offset(0,2,0), stone);
    chunk.setBlockType(pos.offset(-1,2,0), stone);
    chunk.setBlockType(pos.offset(-1,0,0), stone);
    chunk.setBlockType(pos.offset(-1,1,0), stone);
    chunk.setBlockType(pos.offset(1,2,0), stone);
    chunk.setBlockType(pos.offset(2,2,0), stone);
    chunk.setBlockType(pos.offset(2,0,0), stone);
    chunk.setBlockType(pos.offset(2,1,0), stone);
    chunk.setBlockType(pos.offset(0,1,0), oak);
    chunk.setBlockType(pos.offset(0,0,0), oak);
    chunk.setBlockType(pos.offset(1,1,0), oak);
    chunk.setBlockType(pos.offset(1,0,0), oak);

    break;
  case 32:
    floorspace(chunk, level, seedRand, posX, posZ);
    tower(chunk, level, seedRand, posX, posZ);
    pos = new Vec3(0+mv, level + 1, 16-mv);
    chunk.setBlockType(pos.offset(4,6,-7), oak);
    chunk.setBlockType(pos.offset(5,6,-7), oak);
    chunk.setBlockType(pos.offset(6,6,-7), oak);
    chunk.setBlockType(pos.offset(4,6,-8), oak);
    chunk.setBlockType(pos.offset(5,6,-8), oak);
    chunk.setBlockType(pos.offset(6,6,-8), oak);
    chunk.setBlockType(pos.offset(7,5,-7), oak);
    chunk.setBlockType(pos.offset(7,6,-8), oak);

    chunk.setBlockType(pos.offset(4,0,-5), oak);
    chunk.setBlockType(pos.offset(5,1,-5), oak);
    chunk.setBlockType(pos.offset(6,2,-5), oak);
    chunk.setBlockType(pos.offset(7,3,-5), oak);
    chunk.setBlockType(pos.offset(7,4,-6), oak);
    chunk.setBlockType(pos.offset(4,6,-5), oak);
    chunk.setBlockType(pos.offset(5,6,-5), oak);
    chunk.setBlockType(pos.offset(6,6,-5), oak);
    chunk.setBlockType(pos.offset(4,6,-6), oak);
    chunk.setBlockType(pos.offset(5,6,-6), oak);
    chunk.setBlockType(pos.offset(6,6,-6), oak);
    pos = new Vec3(0, level + 1, 13);
    chunk.setBlockType(pos.offset(0,0,0), air);
    chunk.setBlockType(pos.offset(0,1,0), air);

    pos = new Vec3(11, level + 1, 7);
    chunk.setBlockType(pos.offset(0,2,0), stone);
    chunk.setBlockType(pos.offset(1,2,0), stone);
    chunk.setBlockType(pos.offset(1,0,0), stone);
    chunk.setBlockType(pos.offset(1,1,0), stone);
    chunk.setBlockType(pos.offset(-1,2,0), stone);
    chunk.setBlockType(pos.offset(-2,2,0), stone);
    chunk.setBlockType(pos.offset(-2,0,0), stone);
    chunk.setBlockType(pos.offset(-2,1,0), stone);
    chunk.setBlockType(pos.offset(0,1,0), oak);
    chunk.setBlockType(pos.offset(0,0,0), oak);
    chunk.setBlockType(pos.offset(-1,1,0), oak);
    chunk.setBlockType(pos.offset(-1,0,0), oak);
    break;
  }
}




function castle_5(chunk, level, seedRand, posX, posZ) {
  let pos

    // tower floor
  for (let x=7; x<16; x++) {
    for (let z=7; z<16; z++) {
      let pos = new Vec3(Math.abs((posX - 2) * 15 - x),level,Math.abs((posZ - 2) * 15 - z))
      chunk.setBlockType(pos, cobble)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level-1,Math.abs((posZ - 2) * 15 - z))
      chunk.setBlockType(pos, cobble)
    } 
  }

  const wall = [
    [12,7],[11,7],[10,7],[12,8],[12,9],
    [9,7],[8,7],[7,7],[7,8],[7,9],
    [12,12],[11,12],[10,12], [12,10],[12,11],
    [9,12],[8,12],[7,12], [7,10],[7,11]
  ]

  const wall2 = [
    [15,7],[14,7],[13,7],[7,15],[7,14],[7,13]
  ]


  for (let h=level + 1; h < level + 5; h++) {
    for (let i=0; i < wall2.length; i++) {
        pos = new Vec3(
        Math.abs((posX - 2) * 15 - wall2[i][0]),
        h,
        Math.abs((posZ - 2) * 15 - wall2[i][1])
      );
      chunk.setBlockType(pos, andesite)
    }
  }


  for (let h=level + 1; h < level + 8; h++) {
    for (let i=0; i < wall.length; i++) {
        pos = new Vec3(
        Math.abs((posX - 2) * 15 - wall[i][0]),
        h,
        Math.abs((posZ - 2) * 15 - wall[i][1])
      );
      if (h == level + 7) {
        chunk.setBlockType(pos, oak)
      } else {
        chunk.setBlockType(pos, andesite)
      }
    }
  }

  for (let h=0; h<2; h++) {
    for (let x =6; x < 14; x++) {
      pos = new Vec3(
        Math.abs((posX - 2) * 15 - x),
        level + 7 + h,
        Math.abs((posZ - 2) * 15 - 6)
      );
      chunk.setBlockType(pos, andesite)
      pos = new Vec3(
        Math.abs((posX - 2) * 15 - x),
        level + 7 + h,
        Math.abs((posZ - 2) * 15 - 13)
      );
      chunk.setBlockType(pos, andesite)
    }

    for (let y =7; y < 13; y++) {
      pos = new Vec3(
        Math.abs((posX - 2) * 15 - 13),
        level + 7 + h,
        Math.abs((posZ - 2) * 15 - y)
      );
      chunk.setBlockType(pos, andesite)
      pos = new Vec3(
        Math.abs((posX - 2) * 15 - 6),
        level + 7 + h,
        Math.abs((posZ - 2) * 15 - y)
      );
      chunk.setBlockType(pos, andesite)
      }
    }

   pos = new Vec3(
      Math.abs((posX - 2) * 15 - 8),
      level + 8,
      Math.abs((posZ - 2) * 15 - 6)
  );
  chunk.setBlockType(pos, air)
   pos = new Vec3(
      Math.abs((posX - 2) * 15 - 8),
      level + 8,
      Math.abs((posZ - 2) * 15 - 13)
  );
  chunk.setBlockType(pos, air)
  pos = new Vec3(
      Math.abs((posX - 2) * 15 - 11),
      level + 8,
      Math.abs((posZ - 2) * 15 - 6)
  );
  chunk.setBlockType(pos, air)
  pos = new Vec3(
      Math.abs((posX - 2) * 15 - 11),
      level + 8,
      Math.abs((posZ - 2) * 15 - 13)
  );
  chunk.setBlockType(pos, air)


  pos = new Vec3(
      Math.abs((posX - 2) * 15 - 13),
      level + 8,
      Math.abs((posZ - 2) * 15 - 8)
  );
  chunk.setBlockType(pos, air)
  pos = new Vec3(
      Math.abs((posX - 2) * 15 - 6),
      level + 8,
      Math.abs((posZ - 2) * 15 - 8)
  );
  chunk.setBlockType(pos, air)
  pos = new Vec3(
      Math.abs((posX - 2) * 15 - 13),
      level + 8,
      Math.abs((posZ - 2) * 15 - 11)
  );
  chunk.setBlockType(pos, air)
  pos = new Vec3(
      Math.abs((posX - 2) * 15 - 6),
      level + 8,
      Math.abs((posZ - 2) * 15 - 11)
  );
  chunk.setBlockType(pos, air)


  pos = new Vec3(
      Math.abs((posX - 2) * 15 - 12),
      level + 1,
      Math.abs((posZ - 2) * 15 - 9)
  );
  chunk.setBlockType(pos, air)
   pos = new Vec3(
      Math.abs((posX - 2) * 15 - 12),
      level + 2,
      Math.abs((posZ - 2) * 15 - 9)
  );
  chunk.setBlockType(pos, air)
  pos = new Vec3(
      Math.abs((posX - 2) * 15 - 12),
      level + 1,
      Math.abs((posZ - 2) * 15 - 10)
  );
  chunk.setBlockType(pos, air)
   pos = new Vec3(
      Math.abs((posX - 2) * 15 - 12),
      level + 2,
      Math.abs((posZ - 2) * 15 - 10)
  );
  chunk.setBlockType(pos, air)

  // moat
  for (let x=6; x<16; x++) {
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level+1,Math.abs((posZ - 2) * 15 - 6))
      chunk.setBlockType(pos, air)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level,Math.abs((posZ - 2) * 15 - 6))
      chunk.setBlockType(pos, water)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level-1,Math.abs((posZ - 2) * 15 - 6))
      chunk.setBlockType(pos, water)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level+1,Math.abs((posZ - 2) * 15 - 5))
      chunk.setBlockType(pos, air)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level,Math.abs((posZ - 2) * 15 - 5))
      chunk.setBlockType(pos, water)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level-1,Math.abs((posZ - 2) * 15 - 5))
      chunk.setBlockType(pos, water)
  } 
  for (let y=5; y<16; y++) {
      pos = new Vec3(Math.abs((posX - 2) * 15 - 6),level+1,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, air)
      pos = new Vec3(Math.abs((posX - 2) * 15 - 6),level,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, water)
      pos = new Vec3(Math.abs((posX - 2) * 15 - 6),level-1,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, water)
      pos = new Vec3(Math.abs((posX - 2) * 15 - 5),level+1,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, air)
      pos = new Vec3(Math.abs((posX - 2) * 15 - 5),level,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, water)
      pos = new Vec3(Math.abs((posX - 2) * 15 - 5),level-1,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, water)
  } 

  switch (posX * 10 + posZ) {
  case 22:
    pos = new Vec3(15, level + 1, 16);
    chunk.setBlockType(pos.offset(-4,6,-7), oak);
    chunk.setBlockType(pos.offset(-5,6,-7), oak);
    chunk.setBlockType(pos.offset(-6,6,-7), oak);
    chunk.setBlockType(pos.offset(-4,6,-8), oak);
    chunk.setBlockType(pos.offset(-5,6,-8), oak);
    chunk.setBlockType(pos.offset(-6,6,-8), oak);
    chunk.setBlockType(pos.offset(-7,5,-7), oak);
    chunk.setBlockType(pos.offset(-7,6,-8), oak);

    chunk.setBlockType(pos.offset(-4,0,-5), oak);
    chunk.setBlockType(pos.offset(-5,1,-5), oak);
    chunk.setBlockType(pos.offset(-6,2,-5), oak);
    chunk.setBlockType(pos.offset(-7,3,-5), oak);
    chunk.setBlockType(pos.offset(-7,4,-6), oak);
    chunk.setBlockType(pos.offset(-4,6,-5), oak);
    chunk.setBlockType(pos.offset(-5,6,-5), oak);
    chunk.setBlockType(pos.offset(-6,6,-5), oak);
    chunk.setBlockType(pos.offset(-4,6,-6), oak);
    chunk.setBlockType(pos.offset(-5,6,-6), oak);
    chunk.setBlockType(pos.offset(-6,6,-6), oak);

    break;
  case 32:
    pos = new Vec3(0, level + 1, 16);
    chunk.setBlockType(pos.offset(4,6,-7), oak);
    chunk.setBlockType(pos.offset(5,6,-7), oak);
    chunk.setBlockType(pos.offset(6,6,-7), oak);
    chunk.setBlockType(pos.offset(4,6,-8), oak);
    chunk.setBlockType(pos.offset(5,6,-8), oak);
    chunk.setBlockType(pos.offset(6,6,-8), oak);
    chunk.setBlockType(pos.offset(7,5,-7), oak);
    chunk.setBlockType(pos.offset(7,6,-8), oak);

    chunk.setBlockType(pos.offset(4,0,-5), oak);
    chunk.setBlockType(pos.offset(5,1,-5), oak);
    chunk.setBlockType(pos.offset(6,2,-5), oak);
    chunk.setBlockType(pos.offset(7,3,-5), oak);
    chunk.setBlockType(pos.offset(7,4,-6), oak);
    chunk.setBlockType(pos.offset(4,6,-5), oak);
    chunk.setBlockType(pos.offset(5,6,-5), oak);
    chunk.setBlockType(pos.offset(6,6,-5), oak);
    chunk.setBlockType(pos.offset(4,6,-6), oak);
    chunk.setBlockType(pos.offset(5,6,-6), oak);
    chunk.setBlockType(pos.offset(6,6,-6), oak);

    break;
  case 23:
    pos = new Vec3(15, level + 1, 8);
    chunk.setBlockType(pos, air);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), stone);
    chunk.setBlockType(pos.offset(-1,0,0), stone);
    chunk.setBlockType(pos.offset(-1,1,0), stone);
    chunk.setBlockType(pos.offset(-1,2,0), stone);

    chunk.setBlockType(pos.offset(-4,0,-1), oak);
    chunk.setBlockType(pos.offset(-5,1,-1), oak);
    chunk.setBlockType(pos.offset(-6,2,-1), oak);
    chunk.setBlockType(pos.offset(-7,3,-1), oak);
    chunk.setBlockType(pos.offset(-7,4,-2), oak);
    chunk.setBlockType(pos.offset(-4,6,-1), oak);
    chunk.setBlockType(pos.offset(-5,6,-1), oak);
    chunk.setBlockType(pos.offset(-6,6,-1), oak);
    chunk.setBlockType(pos.offset(-4,6,-2), oak);
    chunk.setBlockType(pos.offset(-5,6,-2), oak);
    chunk.setBlockType(pos.offset(-6,6,-2), oak);

    chunk.setBlockType(pos.offset(-4,6,-3), oak);
    chunk.setBlockType(pos.offset(-5,6,-3), oak);
    chunk.setBlockType(pos.offset(-6,6,-3), oak);
    chunk.setBlockType(pos.offset(-4,6,-4), oak);
    chunk.setBlockType(pos.offset(-5,6,-4), oak);
    chunk.setBlockType(pos.offset(-6,6,-4), oak);
    chunk.setBlockType(pos.offset(-7,5,-3), oak);
    chunk.setBlockType(pos.offset(-7,6,-4), oak);

    pos = new Vec3(15, level + 1, 8);
    chunk.setBlockType(pos, air);
    chunk.setBlockType(pos.offset(0,-1,1), oak);
    chunk.setBlockType(pos.offset(0,-1,2), oak);
    break;
  case 33:
    pos = new Vec3(0, level + 1, 8);
    chunk.setBlockType(pos, air);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), stone);
    chunk.setBlockType(pos.offset(1,0,0), stone);
    chunk.setBlockType(pos.offset(1,1,0), stone);
    chunk.setBlockType(pos.offset(1,2,0), stone);

    chunk.setBlockType(pos.offset(4,0,-1), oak);
    chunk.setBlockType(pos.offset(5,1,-1), oak);
    chunk.setBlockType(pos.offset(6,2,-1), oak);
    chunk.setBlockType(pos.offset(7,3,-1), oak);
    chunk.setBlockType(pos.offset(7,4,-2), oak);
    chunk.setBlockType(pos.offset(4,6,-1), oak);
    chunk.setBlockType(pos.offset(5,6,-1), oak);
    chunk.setBlockType(pos.offset(6,6,-1), oak);
    chunk.setBlockType(pos.offset(4,6,-2), oak);
    chunk.setBlockType(pos.offset(5,6,-2), oak);
    chunk.setBlockType(pos.offset(6,6,-2), oak);

    chunk.setBlockType(pos.offset(4,6,-3), oak);
    chunk.setBlockType(pos.offset(5,6,-3), oak);
    chunk.setBlockType(pos.offset(6,6,-3), oak);
    chunk.setBlockType(pos.offset(4,6,-4), oak);
    chunk.setBlockType(pos.offset(5,6,-4), oak);
    chunk.setBlockType(pos.offset(6,6,-4), oak);
    chunk.setBlockType(pos.offset(7,5,-3), oak);
    chunk.setBlockType(pos.offset(7,6,-4), oak);

    pos = new Vec3(0, level + 1, 8);
    chunk.setBlockType(pos, air);
    chunk.setBlockType(pos.offset(0,-1,1), oak);
    chunk.setBlockType(pos.offset(0,-1,2), oak);
    break;
  }

}

function castle_6(chunk, level, seedRand, posX, posZ) {
  let pos
  castle_5(chunk, level, seedRand, posX, posZ)
  // outer wall
  for (let x=1; x<16; x++) {
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level+3,Math.abs((posZ - 2) * 15 - 1))
      chunk.setBlockType(pos, andesite)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level+1,Math.abs((posZ - 2) * 15 - 1))
      chunk.setBlockType(pos, andesite)
      pos = new Vec3(Math.abs((posX - 2) * 15 - x),level+2,Math.abs((posZ - 2) * 15 - 1))
      chunk.setBlockType(pos, andesite)
      if (((x-1) % 2)===0) {
        pos = new Vec3(Math.abs((posX - 2) * 15 - x),level+4,Math.abs((posZ - 2) * 15 - 1))
        chunk.setBlockType(pos, andesite)
      }
  } 
  for (let y=1; y<16; y++) {
      pos = new Vec3(Math.abs((posX - 2) * 15 - 1),level+3,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, andesite)
      pos = new Vec3(Math.abs((posX - 2) * 15 - 1),level+1,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, andesite)
      pos = new Vec3(Math.abs((posX - 2) * 15 - 1),level+2,Math.abs((posZ - 2) * 15 - y))
      chunk.setBlockType(pos, andesite)
      if (((y-1) % 2)=== 0) {
        pos = new Vec3(Math.abs((posX - 2) * 15 - 1),level+4,Math.abs((posZ - 2) * 15 - y))
        chunk.setBlockType(pos, andesite)
      }
  } 

  switch (posX * 10 + posZ) {
  case 22:
    break;
  case 32:
    break;
  case 23:
    pos = new Vec3(15, level + 1, 14);
    chunk.setBlockType(pos, air);
    chunk.setBlockType(pos.offset(0,1,0), air);
    // chunk.setBlockType(pos.offset(0,2,0), stone);
    chunk.setBlockType(pos.offset(-1,0,0), stone);
    chunk.setBlockType(pos.offset(-1,1,0), stone);
    //chunk.setBlockType(pos.offset(-1,2,0), stone);
    break;
  case 33:
    pos = new Vec3(0, level + 1, 14);
    chunk.setBlockType(pos, air);
    chunk.setBlockType(pos.offset(0,1,0), air);
    //chunk.setBlockType(pos.offset(0,2,0), stone);
    chunk.setBlockType(pos.offset(1,0,0), stone);
    chunk.setBlockType(pos.offset(1,1,0), stone);
    //chunk.setBlockType(pos.offset(1,2,0), stone);
    break;
  }

}

function castle_7(chunk, level, seedRand, posX, posZ) {
  castle_6(chunk, level, seedRand, posX, posZ)
  let pos
  switch (posX * 10 + posZ) {
  case 22:
    break;
  case 32:
    break;
  case 23:
    for (let h=level-1; h<level+10; h++) {
      for (let x=1; x<4;x++) {
        for (let z=12; z<15;z++) {
          pos = new Vec3(x,h,z)
          if (h<=level) {
            chunk.setBlockType(pos, cobble);
          } else {chunk.setBlockType(pos, air);}
        }
      }
      for (let x=0; x<5;x++) {
        pos = new Vec3(x,h,15)
        chunk.setBlockType(pos, andesite);
        chunk.setBlockType(pos.offset(0,0,-4), andesite);
        pos = new Vec3(0,h,x+11)
        chunk.setBlockType(pos, andesite);
        chunk.setBlockType(pos.offset(4,0,0), andesite);
      }
    }
    pos = new Vec3(4,level,12);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), air);
    pos = new Vec3(0,level+9,15);
    chunk.setBlockType(pos.offset(1,0,0), air);
    chunk.setBlockType(pos.offset(3,0,0), air);
    chunk.setBlockType(pos.offset(0,0,-1), air);
    chunk.setBlockType(pos.offset(0,0,-3), air);
    chunk.setBlockType(pos.offset(1,0,-4), air);
    chunk.setBlockType(pos.offset(3,0,-4), air);
    chunk.setBlockType(pos.offset(4,0,-1), air);
    chunk.setBlockType(pos.offset(4,0,-3), air);
    pos = new Vec3(3, level +1, 13)
    chunk.setBlockType(pos.offset(0,0,0), oak);
    chunk.setBlockType(pos.offset(0,1,1), oak);
    chunk.setBlockType(pos.offset(-1,2,1), oak);
    chunk.setBlockType(pos.offset(-2,3,1), oak);
    chunk.setBlockType(pos.offset(-2,4,0), oak);
    chunk.setBlockType(pos.offset(-2,5,-1), oak);
    chunk.setBlockType(pos.offset(-1,6,-1), oak);
    chunk.setBlockType(pos.offset(0,7,-1), oak);
    chunk.setBlockType(pos.offset(0,7,0), oak);
    chunk.setBlockType(pos.offset(0,7,1), oak);
    chunk.setBlockType(pos.offset(-1,7,1), oak);

    break;
  case 33:
    break;
  }
}

//////////////////////
//
// Futuristic terrains
//
/////////////////////


function number(x, z, level, char, chunk) {
  const pos = new Vec3(x, level + 2, z)
  const small_font = [
    [1,1,1,1,0,1,1,0,1,1,0,1,1,1,1], //0
    [0,1,0,0,1,0,0,1,0,0,1,0,0,1,0], //1
    [1,1,1,0,0,1,1,1,1,1,0,0,1,1,1], //2
    [1,1,1,0,0,1,0,1,1,0,0,1,1,1,1], //3
    [1,0,1,1,0,1,1,1,1,0,0,1,0,0,1], //4
    [1,1,1,1,0,0,1,1,1,0,0,1,1,1,1], //5
    [1,1,1,1,0,0,1,1,1,1,0,1,1,1,1], //6
    [1,1,1,0,0,1,0,0,1,0,0,1,0,0,1], //7
    [1,1,1,1,0,1,1,1,1,1,0,1,1,1,1], //8
    [1,1,1,1,0,1,1,1,1,0,0,1,0,0,1], //9
    [1,1,1,1,0,1,1,1,1,1,0,1,1,0,1], //A
    [1,1,0,1,0,1,1,1,1,1,0,1,1,1,0], //B
    [1,1,1,1,0,0,1,0,0,1,0,0,1,1,1], //C
    [1,1,0,1,0,1,1,0,1,1,0,1,1,1,0], //D
    [1,1,1,1,0,0,1,1,0,1,0,0,1,1,1], //E
    [1,1,1,1,0,0,1,1,0,1,0,0,1,0,0], //F
  ]
  const charIx = parseInt(char, 16)
  for (let ty = 0; ty < 5; ty++) {
    for (let tx = 0; tx < 3; tx++) {
      if (small_font[charIx][tx + (3*ty)] === 1) {
        chunk.setBlockType(pos.offset(tx,4 - ty,0), concrete)
        chunk.setBlockData(pos.offset(tx,4 - ty,0), lightblue)
      }
    }
  }
}

function castle_9(chunk, level, seedRand, posX, posZ, tokenId) {
  let pos
  const wall = [
    [15,7,8],[14,7,8],[13,7,8],[12,7,8],[11,7,8],[10,7,7],[9,7,6],
    [9,8,6],[9,9,6],[9,10,6],[9,11,6],[9,12,6],[9,13,6],[9,14,6],[9,15,6]
  ]

  // walls
  wall.forEach(function(place) {

    for (let h=level + 1; h < level + place[2]; h++) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - place[0]),
        h,
        Math.abs((posZ - 4) * 15 - place[1])
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, gray)
    }
  });

  const roof = [
    [10,6],[11,7],[12,7],[13,7],[14,7],[15,7]
  ]

  // roof
  roof.forEach(function(place) {
    for (let z=8; z < 16; z++) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - place[0]),
        place[1] + level,
        Math.abs((posZ - 4) * 15 - z)
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, gray)
    }
  });

  const lights = [
    [9,9,3],[9,10,3],[9,12,3],[9,13,3],[9,15,3]
  ]
  lights.forEach(function(bulb) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - bulb[0]),
        bulb[2] + level,
        Math.abs((posZ - 4) * 15 - bulb[1])
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, red)  
  });

  switch (posX * 10 + posZ) {
  case 24:
    pos = new Vec3(15,level,7);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), air);
    break;
  case 34:
    pos = new Vec3(0,level,7);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), air);
    break;
  case 25:
    number(12,9,level, tokenId[2], chunk)
    break;
  case 35:
      number(1,9,level, tokenId[3], chunk)
    break;
  }
}

function castle_10(chunk, level, seedRand, posX, posZ, tokenId) {
  let pos
  const wall = [
    [15,2,8],[14,2,8],[13,2,8],[12,2,8],[11,2,8],[10,2,7],[9,2,6],
    [9,8,6],[9,9,6],[9,10,6],[9,11,6],[9,12,6],[9,13,6],[9,14,6],[9,15,6],
    [9,7,6],[9,6,6],[9,5,6],[9,4,6],[9,3,6]
  ]

  // walls
  wall.forEach(function(place) {

    for (let h=level + 1; h < level + place[2]; h++) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - place[0]),
        h,
        Math.abs((posZ - 4) * 15 - place[1])
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, gray)
    }
  });

  const roof = [
    [10,6],[11,7],[12,7],[13,7],[14,7],[15,7]
  ]

  // roof
  roof.forEach(function(place) {
    for (let z=3; z < 16; z++) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - place[0]),
        place[1] + level,
        Math.abs((posZ - 4) * 15 - z)
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, gray)
    }
  });

  const lights = [
    [9,9,3],[9,10,3],[9,12,3],[9,13,3],[9,15,3],[9,3,3],[9,4,3],[9,6,3],[9,7,3]
  ]
  lights.forEach(function(bulb) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - bulb[0]),
        bulb[2] + level,
        Math.abs((posZ - 4) * 15 - bulb[1])
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, red)  
  });

  switch (posX * 10 + posZ) {
  case 24:
    pos = new Vec3(15,level,2);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), air);
    break;
  case 34:
    pos = new Vec3(0,level,2);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), air);
    break;
  case 25:
    number(12,14,level, tokenId[2], chunk)
    break;
  case 35:
      number(1,14,level, tokenId[3], chunk)
    break;
  }
}

function castle_11(chunk, level, seedRand, posX, posZ, tokenId) {
  let pos
  const wall = [
    [15,2,8],[14,2,8],[13,2,8],[12,2,8],[11,2,8],[10,2,7],[9,2,6],
    [8,2,5],[7,2,4],[6,2,3],[5,2,2],[4,2,1]

  ]

  // walls
  wall.forEach(function(place) {

    for (let h=level + 1; h < level + place[2]; h++) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - place[0]),
        h,
        Math.abs((posZ - 4) * 15 - place[1])
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, gray)
    }
  });

  const roof = [
    [10,6],[11,7],[12,7],[13,7],[14,7],[15,7],
    [9,5],[8,4],[7,3],[6,2],[5,1],[4,0]
  ]

  // roof
  roof.forEach(function(place) {
    for (let z=3; z < 16; z++) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - place[0]),
        place[1] + level,
        Math.abs((posZ - 4) * 15 - z)
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, gray)
    }
  });

  const lights = [
    [9,9,5],[9,10,5],[9,12,5],[9,13,5],[9,15,5],[9,3,5],[9,4,5],[9,6,5],[9,7,5],
    [7,9,3],[7,10,3],[7,12,3],[7,13,3],[7,15,3],[7,3,3],[7,4,3],[7,6,3],[7,7,3]
  ]
  lights.forEach(function(bulb) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - bulb[0]),
        bulb[2] + level,
        Math.abs((posZ - 4) * 15 - bulb[1])
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, red)  
  });

  switch (posX * 10 + posZ) {
  case 24:
    pos = new Vec3(15,level,2);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), air);
    break;
  case 34:
    pos = new Vec3(0,level,2);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), air);
    break;
  case 25:
    number(12,14,level, tokenId[2], chunk)
    break;
  case 35:
      number(1,14,level, tokenId[3], chunk)
    break;
  }
}

function castle_12(chunk, level, seedRand, posX, posZ, tokenId) {
  let pos
  const wall = [
    [15,7,8],[14,7,8],[13,7,8],[12,7,8],[11,7,8],[10,7,8],[9,7,8],
    [8,7,8],[7,7,8],[6,7,8],[5,7,8],[4,7,7],
    [4,8,6],[4,9,6],[4,10,6],[4,11,6],[4,12,6],[4,13,6],[4,14,6],[4,15,6]
  ]

  // walls
  wall.forEach(function(place) {

    for (let h=level + 1; h < level + place[2]; h++) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - place[0]),
        h,
        Math.abs((posZ - 4) * 15 - place[1])
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, gray)
    }
  });

  const roof = [
    [10,7],[11,7],[12,7],[13,7],[14,7],[15,7],[9,7],[8,7],[7,7],[6,7],[5,7],[4,6],
  ]

  // roof
  roof.forEach(function(place) {
    for (let z=8; z < 16; z++) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - place[0]),
        place[1] + level,
        Math.abs((posZ - 4) * 15 - z)
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, gray)
    }
  });

  const lights = [
    [4,9,3],[4,10,3],[4,12,3],[4,13,3],[4,15,3],
    [8,10,7],[7,10,7],[6,10,7]
  ]
  lights.forEach(function(bulb) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - bulb[0]),
        bulb[2] + level,
        Math.abs((posZ - 4) * 15 - bulb[1])
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, red)  
  });

  const whitelights = [
    [8,13,7],[7,13,7],[6,13,7]
  ]
  whitelights.forEach(function(bulb) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - bulb[0]),
        bulb[2] + level,
        Math.abs((posZ - 4) * 15 - bulb[1])
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, white)  
  });

  switch (posX * 10 + posZ) {
  case 24:
    pos = new Vec3(15,level,7);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), air);

    chunk.setBlockType(pos.offset(-9,7,1), air); 
    chunk.setBlockType(pos.offset(-8,7,1), air); 
    chunk.setBlockType(pos.offset(-7,7,1), air);

    for (let i=0; i < 6; i++) {
      chunk.setBlockType(pos.offset(-9+i,6-i,1), concrete); 
      chunk.setBlockData(pos.offset(-9+i,6-i,1), gray);
    }

    break;
  case 34:
    pos = new Vec3(0,level,7);
    chunk.setBlockType(pos.offset(0,1,0), air);
    chunk.setBlockType(pos.offset(0,2,0), air);
    break;
  case 25:
    number(12,9,level, tokenId[2], chunk)
    break;
  case 35:
      number(1,9,level, tokenId[3], chunk)
    break;
  }
}

function rocket_base(chunk, level, posX, posZ, h) {
  // floor
  const theFloor = [
    [15,9,15],[14,9,15],[13,9,15],[12,9,15],
    [15,9,14],[14,9,14],[13,9,14],[12,9,14],
    [15,9,13],[14,9,13],[13,9,13],
    [15,9,12],[14,9,12]
  ]
  theFloor.forEach(function(bulb) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - bulb[0]),
        bulb[1] + level,
        Math.abs((posZ - 4) * 15 - bulb[2])
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, white)  
  });
  const fins = [
    [12,9,12],[12,10,12],
    [11,9,11],[11,8,11],
  ]
  fins.forEach(function(bulb) {
        const pos = new Vec3(
        Math.abs((posX - 2) * 15 - bulb[0]),
        bulb[1] + level,
        Math.abs((posZ - 4) * 15 - bulb[2])
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, red)  
  });
}

function rocket_cone(chunk, level, posX, posZ, h) {
  // floor
  let pos;
  const cone = [    
    [12,6,15],[12,6,14],[13,6,13],[15,6,12],[14,6,12],
    [13,6,15],[14,6,15],[15,6,15],[13,6,14],[14,6,14],[15,6,14],[14,6,13],[15,6,13],
    [12,7,15],[12,7,14],[13,7,13],[15,7,12],[14,7,12],
    [12,8,15],[12,8,14],[13,8,13],[15,8,12],[14,8,12],
    [12,9,15],[12,9,14],[13,9,13],[15,9,12],[14,9,12],
    [13,10,15],[13,10,14],[14,10,13],[15,10,13],
    [14,11,15],[14,11,14],[15,12,15],[15,11,14]
  ]
  cone.forEach(function(bulb) {
        pos = new Vec3(
        Math.abs((posX - 2) * 15 - bulb[0]),
        bulb[1] + level + h,
        Math.abs((posZ - 4) * 15 - bulb[2])
      );
      chunk.setBlockType(pos, concrete)
      chunk.setBlockData(pos, white)  
  });

  const window = [    
    [15,8,12],[12,8,15]
  ]
  window.forEach(function(bulb) {
        pos = new Vec3(
        Math.abs((posX - 2) * 15 - bulb[0]),
        bulb[1] + level + h,
        Math.abs((posZ - 4) * 15 - bulb[2])
      );
      chunk.setBlockType(pos, air) 
      // chunk.setBlockData(pos, cyan) 
  });

  if ((posX === 2) && (posZ == 4)) {
    pos = new Vec3(15,level + h + 6,13)
    chunk.setBlockType(pos, air)
    chunk.setBlockType(pos.offset(-1,0,0), air)
  }
}

function rocket_cylinder(chunk, level, posX, posZ, h) {
  let pos;
  const walls = [
    [12,4,15],
    [12,4,14],
    [13,4,13],
    [15,4,12],[14,4,12]
  ]
  for (let up = 0; up < h + 1; up++) {
    walls.forEach(function(bulb) {
          pos = new Vec3(
          Math.abs((posX - 2) * 15 - bulb[0]),
          bulb[1] + level + 6 + up,
          Math.abs((posZ - 4) * 15 - bulb[2])
        );
        chunk.setBlockType(pos, concrete)
        chunk.setBlockData(pos, white)  
    });
  }
  if ((posX === 2) && (posZ == 4)) {
    for (let up = 0; up < h + 5; up++) {
      pos = new Vec3(14,level + 6 + up + 4,13)
      chunk.setBlockType(pos, mcData.blocksByName.water.id)
      chunk.setBlockData(pos, 3)
    }
  }
}

function castle_13(chunk, level, seedRand, posX, posZ, tokenId) {
  const height = 4;
  castle_12(chunk, level, seedRand, posX, posZ, tokenId);
  rocket_base(chunk, level, posX, posZ)
  rocket_cone(chunk, level, posX, posZ, 5 + height)
  rocket_cylinder(chunk, level, posX, posZ, height)
  switch (posX * 10 + posZ) {
  case 24:
    const pos = new Vec3(15,level+8,11);
    chunk.setBlockType(pos.offset(0,2,1), air);
    chunk.setBlockType(pos.offset(0,3,1), air);

    chunk.setBlockType(pos.offset(0,0,0), concrete); 
    chunk.setBlockData(pos.offset(0,0,0), gray);

    break;
  case 34:
    break;
  case 25:
    number(12,9,level, tokenId[2], chunk)
    break;
  case 35:
      number(1,9,level, tokenId[3], chunk)
    break;
  }
}

function castle_14(chunk, level, seedRand, posX, posZ, tokenId) {
  const height = 8;
  castle_12(chunk, level, seedRand, posX, posZ, tokenId);
  rocket_base(chunk, level, posX, posZ)
  rocket_cone(chunk, level, posX, posZ, 5 + height)
  rocket_cylinder(chunk, level, posX, posZ, height)
  switch (posX * 10 + posZ) {
  case 24:
    const pos = new Vec3(15,level+8,11);
    chunk.setBlockType(pos.offset(0,2,1), air);
    chunk.setBlockType(pos.offset(0,3,1), air);

    chunk.setBlockType(pos.offset(0,0,0), concrete); 
    chunk.setBlockData(pos.offset(0,0,0), gray);

    break;
  case 34:
    break;
  case 25:
    number(12,9,level, tokenId[2], chunk)
    break;
  case 35:
      number(1,9,level, tokenId[3], chunk)
    break;
  }
}

function castle_15(chunk, level, seedRand, posX, posZ, tokenId) {
  const height = 12;
  castle_12(chunk, level, seedRand, posX, posZ, tokenId);
  rocket_base(chunk, level, posX, posZ)
  rocket_cone(chunk, level, posX, posZ, 5 + height)
  rocket_cylinder(chunk, level, posX, posZ, height)
  switch (posX * 10 + posZ) {
  case 24:
    const pos = new Vec3(15,level+8,11);
    chunk.setBlockType(pos.offset(0,2,1), air);
    chunk.setBlockType(pos.offset(0,3,1), air);

    chunk.setBlockType(pos.offset(0,0,0), concrete); 
    chunk.setBlockData(pos.offset(0,0,0), gray);

    break;
  case 34:
    break;
  case 25:
    number(12,9,level, tokenId[2], chunk)
    break;
  case 35:
      number(1,9,level, tokenId[3], chunk)
    break;
  }
}

module.exports = {
  henge, castle_1, castle_2, castle_3, castle_4, castle_5, castle_6, castle_7, castle_9, castle_10, castle_11, castle_12, castle_13, castle_14, castle_15
};
