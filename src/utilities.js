export const roomIdGenerator = (roomPairs) => {
  let id = Math.floor(Math.random() * 900000) + 100000;
  while (id in Object.keys(roomPairs)) {
    id = Math.floor(Math.random() * 900000) + 100000;
  }
  return id;
}

export const rolesGenerator = (roomType) => {
  let standard6 = ["黄烟烟", "药不然", "木户加奈", "老朝奉", "许愿", "方震"];
  let standard8 = ["黄烟烟", "药不然", "木户加奈", "老朝奉", "许愿", "方震", "郑国渠", "姬云浮"];
  let res;

  switch (roomType) {
    case '普通6人':
      res = standard6.slice();
      for (let i = 5; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = res[i];
        res[i] = res[j];
        res[j] = temp;
      };
      break;
    case '普通8人':
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

export const randomSelectOne = (len) => {
  return Math.floor(Math.random() * len);
}
