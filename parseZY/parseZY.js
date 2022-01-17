const path = require('path');
const fs = require('fs-extra');

const filePath = path.resolve(__dirname, `./ZY.json`);
const file = fs.readFileSync(filePath, 'utf-8')

const resFlie = JSON.parse(file).sheets[`其他扣税凭证明细表（北京）`].validations
// console.log(Object.keys(resFlie))
fs.outputFile(`${__dirname}/一般纳税人/其他扣税凭证明细表（北京）.json`,JSON.stringify(resFlie))