const path = require('path')
const fs = require('fs-extra')
const puppeteer = require('puppeteer');

function allAreas() {
  const prefix = './textHtml/'
  const areas = fs.readdirSync(path.resolve(__dirname, prefix))
  const filepaths = []
  for (let i = 0; i < areas.length; i++) {
    const areaName = areas[i]
    if (!areaName.endsWith('.html')) {
      continue;
    }
    const filepath = prefix+areaName
    filepaths.push(filepath)
  }
  return filepaths
}

const htmlTest = async (filePath, done)=> {
  const structureBuffer = fs.readFileSync(path.resolve(__dirname, filePath.replace('.html', '.json')))
  let browser = await puppeteer.launch({
    executablePath: puppeteer.executablePath(),
    defaultViewport: {width: 1200, height: 1000},
    headless: false,
    devtools: true,
    //浏览器忽略证书错
    ignoreHTTPSErrors: true,
    args: [
      //开放跨域
      '--no-sandbox',
      '--disable-setuid-sandbox',
      //忽略同源策略
      '--disable-web-security',
      //全屏
      '--start-fullscreen',
      '--disable-features=IsolateOrigins,site-per-process',
      //窗口最大化
      '--start-maximized',
      '--window-size=1200,1000',
      // '–single-process', // 单进程运行
      // '–disable-gpu' // GPU硬件加速
    ],
  });
  const page = await browser.newPage();
  const filepath = path.resolve(__dirname, `./${filePath}`)
  await page.goto(filepath, { waitUntil: 'domcontentloaded', });
  const code = fs.readFileSync(
    path.resolve(
      __dirname,
      `../parseHtml.txt`
    ),
    'utf-8'
  );
  await page.exposeFunction('initBundle', () => {
    return code;
  });
  const result =await page.evaluate(async () => {
    //@ts-ignore
    const code = await initBundle();
    eval(code);
    //@ts-ignore
    return window.tableDoms;
  });
  const htmltable = result.contrastData
  const structure = JSON.parse(structureBuffer)
  try {
    for (let r = 0; r < htmltable.length; r++) {
      const tableNode = htmltable[r];
      for (let c = 0; c < tableNode.length; c++) {
        const nodeValue = tableNode[c].path;
        const value  = structure[r][c].path
        if(nodeValue && value ) {
          expect(value).toEqual(nodeValue)
        }
      }
    }
    await done();
    await browser.close();
  } catch (error) {
    await done(error)
    await browser.close();
  }
}

describe('lines to table', () => {
  const filepaths = allAreas();
  for (let i = 0; i < filepaths.length; i++) {
    it('table made of lines has the same structure of table in html'+filepaths[i], (done) => {
      htmlTest(filepaths[i], done)
    })
  }
})
