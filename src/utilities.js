export const roomIdGenerator = (roomPairs) => {
  let id = Math.floor(Math.random() * 900000) + 100000;
  while (id in Object.keys(roomPairs)) {
    id = Math.floor(Math.random() * 900000) + 100000;
  }
  return id;
}

export const rolesGenerator = (roomType) => {
  let standard6 = ["黄烟烟", "药不然", "木户加奈", "老朝奉", "许愿", "方震"];
  let standard7 = ["黄烟烟", "药不然", "木户加奈", "老朝奉", "许愿", "方震", "郑国渠"];
  let standard8 = ["黄烟烟", "药不然", "木户加奈", "老朝奉", "许愿", "方震", "郑国渠", "姬云浮"];
  let res;

  switch (roomType) {
    case 6:
      res = standard6.slice();
      for (let i = 5; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = res[i];
        res[i] = res[j];
        res[j] = temp;
      };
      break;
    case 7:
      res = standard7.slice();
      for (let i = 6; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = res[i];
        res[i] = res[j];
        res[j] = temp;
      };
      break;
    case 8:
      res = standard8.slice();
      for (let i = 7; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = res[i];
        res[i] = res[j];
        res[j] = temp;
      };
      break;
    default:
      console.log('unknown room type for roles generator')
  }

  return res;
}

export const zodiacGenerator = () => {
  const dummyArr = [true, true, false, false];
  const res = {
    1: shuffleArray(dummyArr),
    2: shuffleArray(dummyArr),
    3: shuffleArray(dummyArr)
  }
  console.log(res)
  return res
  // return shuffleArray(dummyArr).concat(shuffleArray(dummyArr)).concat(shuffleArray(dummyArr));
}

const shuffleArray = (array) => {
  let res = array.slice();
  for (let i = array.length-1; i>0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = res[i];
    res[i] = res[j];
    res[j] = temp;
  }
  return res;
}

export const chipResGenerator = (roomType) => {
  switch (roomType) {
    case 6:
      return {
          0: {
            0: [0,0,0,0],
            1: [0,0,0,0],
            2: [0,0,0,0],
            3: [0,0,0,0],
            4: [0,0,0,0],
            5: [0,0,0,0],
          },
          1: {
            0: [0,0,0,0],
            1: [0,0,0,0],
            2: [0,0,0,0],
            3: [0,0,0,0],
            4: [0,0,0,0],
            5: [0,0,0,0],
          },
          2: {
            0: [0,0,0,0],
            1: [0,0,0,0],
            2: [0,0,0,0],
            3: [0,0,0,0],
            4: [0,0,0,0],
            5: [0,0,0,0],
          }
      }
    case 7:
      return {
        0: {
          0: [0,0,0,0],
          1: [0,0,0,0],
          2: [0,0,0,0],
          3: [0,0,0,0],
          4: [0,0,0,0],
          5: [0,0,0,0],
          6: [0,0,0,0]
        },
        1: {
          0: [0,0,0,0],
          1: [0,0,0,0],
          2: [0,0,0,0],
          3: [0,0,0,0],
          4: [0,0,0,0],
          5: [0,0,0,0],
          6: [0,0,0,0]
        },
        2: {
          0: [0,0,0,0],
          1: [0,0,0,0],
          2: [0,0,0,0],
          3: [0,0,0,0],
          4: [0,0,0,0],
          5: [0,0,0,0],
          6: [0,0,0,0]
        }
      }
    case 8:
      return {
        0: {
          0: [0,0,0,0],
          1: [0,0,0,0],
          2: [0,0,0,0],
          3: [0,0,0,0],
          4: [0,0,0,0],
          5: [0,0,0,0],
          6: [0,0,0,0],
          7: [0,0,0,0]
        },
        1: {
          0: [0,0,0,0],
          1: [0,0,0,0],
          2: [0,0,0,0],
          3: [0,0,0,0],
          4: [0,0,0,0],
          5: [0,0,0,0],
          6: [0,0,0,0],
          7: [0,0,0,0]
        },
        2: {
          0: [0,0,0,0],
          1: [0,0,0,0],
          2: [0,0,0,0],
          3: [0,0,0,0],
          4: [0,0,0,0],
          5: [0,0,0,0],
          6: [0,0,0,0],
          7: [0,0,0,0]
        }
      }
    default:
      return {}
  }
}
