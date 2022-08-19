let obj = {
    Items: [ { user: [Object], imageName: ['Object'], imageHash: [Object] } ],
    Count: 1,
    ScannedCount: 1
  };

let obj2 = {
    Items: [
      { user: ['Object'], imageName: ['Object'], imageHash: [Object] },
      { user: ['Object2'], imageName: ['Object2'], imageHash: [Object] }
    ],
    Count: 2,
    ScannedCount: 2
  };

// console.log(obj2.Items);
let res = {};
for(let i = 0; i < obj2.Items.length; i++){
  console.log(obj2.Items[i].imageName)
  res[obj2.Items[i].imageName] = 'url: ' + obj2.Items[i].imageName
}

console.log(res)