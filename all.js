const xlsx = require('node-xlsx')
const path = require('path');
const fs = require('fs-extra');
const excelPath = path.resolve(__dirname, `./excel/all.xlsx`);

const res = xlsx.parse(excelPath)
//处理null
const lastData = res.map((content)=> {
  return content.data.map((cnt)=> {
    return cnt.filter((fil)=>fil)
  })
})
//处理空格
const fil = lastData.map((content)=> {
  return content.map((cnt)=> {
    return cnt.map((flD)=> {
      if(typeof flD === 'number') {
        return flD
      } else {
        return repSign(flD.replace(/\s*/g,""))
      }
    }
    )
  })
})

//中英文字符替换
function repSign(s) {
	s = s.replace(/([\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b])/g,function(u,v,w,x) {
    const sign = {
      '（': '(',
      '）': ')',

    }
		return sign[u] ? sign[u] : u;
	});
	return s;
}

//处理文字出现次数
const numberData = fil.map((num, numIndex)=> {
  let strNum = 0
  let hasIndex = []
  return num.map((cnt, cntIndex)=> {
    return cnt.map((file)=>{
      strNum=0
      hasIndex = []
      for (let index = 0; index < fil.length; index++) {
        for (let idx = 0; idx < num.length; idx++) {
          if(fil[index][idx]) {
            if(fil[index][idx].includes(file)) {
              strNum = strNum+1
            }
            if(idx === cntIndex) {
              if(!fil[index][idx].includes(file)) {
                hasIndex.push(res[index].name + '-' + '主表')
              }
            }
          }
        }
      }
      return {
        value: file,
        number: strNum,
        index: hasIndex
      }
    })
  })
})


fs.outputFile(`${__dirname}/__excel__/all.json`,JSON.stringify(numberData));