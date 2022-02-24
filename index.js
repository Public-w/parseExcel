
const excel = require('./util')
const path = require('path');
const fs = require('fs-extra');
const XLSX = require('xlsx')
const excelPath = path.resolve(__dirname, `./excel/henan.xls`);

// 获取
const options = {
  defval: '',
  header: 1
}
const workOptions = {
  cellStyles: true
}
const work = XLSX.readFile(excelPath, workOptions)
fs.outputFile(`${__dirname}/__excel__/work.json`,JSON.stringify(work));

function formatResult(data) {
  const sheets = data.Sheets;
  const sheetItem = Object.keys(sheets);
  let sheetArr = [];
  let last = []
  sheetItem.forEach((item) => {
    let sheetJson = XLSX.utils.sheet_to_json(sheets[item],options);
    fs.outputFile(`${__dirname}/__excel__/sheetJson.json`,JSON.stringify(sheetJson));
    formatItemMerge(sheets[item], sheetJson);
    sheetArr.push({
      name: item,
      list: sheetJson
    })
    last = excel.parseExcel(sheetArr[0].list, sheets[item])
  });
  fs.outputFile(`${__dirname}/__excel__/sheet.json`,JSON.stringify(sheetArr));
  // const last = excel.parseExcel(sheetArr[0].list, )
  // console.log(last)
  return last
}

// 格式化Item合并数据
function formatItemMerge(sheetItem, data) {
  const merges = sheetItem['!merges'] || [];
  merges.forEach((el) => {
    // console.log(el)
    const start = el.s;
    const end = el.e;
    // 处理行合并数据
    if (start.r === end.r) {
      const item = data[start.r][start.c];
      for (let index = start.c; index <= end.c; index++) {
        data[start.r][index] = item;
      }
    }
    // 处理列合并数据
    if (start.c === end.c) {
      const item = data[start.r][start.c];
      for (let index = start.r; index <= end.r; index++) {
        data[index][start.c] = item;
      }
    }
    // 处理行列合并数据
    if(start.c !== end.c && start.r !== end.r) {
      const item = data[start.r][start.c];
      for (let Cindex = start.c; Cindex <= end.c; Cindex++) {
        for (let Rindex = start.r; Rindex <= end.r; Rindex++) {
          data[Rindex][Cindex] = item;
        }
      }
    }
  });
}
fs.outputFile(`${__dirname}/__excel__/res.json`,JSON.stringify(formatResult(work)));

