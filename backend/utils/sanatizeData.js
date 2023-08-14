// const returnData = originalData.map((item) => ({
//   name: item.name,
//   pic: item.pic,
//   _id: item._id,
// }));

exports.sanatizeData = function (data) {
  const returnData = data.map((item) => ({
    name: item.name,
    pic: item.pic,
    _id: item._id,
  }));
  return returnData;
};
