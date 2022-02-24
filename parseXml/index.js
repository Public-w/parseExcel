const path = require('path');
const fs = require('fs-extra');
// const xml2js = require('xml2js');

// let xml = "<root>Hello xml2js!</root>"
// xml2js.parseString(xml, function (err, result) {
//   console.log(result);
//   // {root: "Hello xml2js!"}
// });

var parseString = require('xml2js').parseString;
const xmlPath = path.resolve(__dirname, `./xml/text.xml`);
var xmlString = fs.readFileSync(xmlPath, 'utf8');
parseString(xmlString, function (err, result) {
  if(result) {
    // fs.outputFile(`${__dirname}/res.json`,JSON.stringify(result));
  }
});

const getGrird = (sheet)=> {
  let key
  sheet.forEach((value)=> {
    const allkeys = Object.keys(value)
    allkeys.forEach((v, idx)=> {
      if(idx === 1) {
        key = v
      }
    })
  })
  return key
}
const jsonPath = path.resolve(__dirname, `./res.json`);
var json = fs.readFileSync(jsonPath, 'utf8');
let lastJson = JSON.parse(json)
const allSheet = lastJson.taxML.zzsybsbSbbdxxVO
const jsonKey = allSheet.map((sheet, sheetIndex)=> {
  const allkeys = Object.keys(sheet)
  allkeys.map((key, index)=> {
    sheet[key].map((keyValue, keyValueIdx)=> {
      const allkeyValues = Object.keys(keyValue)
      // console.log(keyValue, key)
      allkeyValues.map((keyV, index)=> {
        keyValue[keyV].map((Value, ValueIdx)=> {
        })
      })
    })
  })
})