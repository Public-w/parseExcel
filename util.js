
function filter (data,) {
  return data.map((res, index)=> {
    const nuldata = res.map((n,i)=>{
        return {
          value: n,
          index: i
        }

    })
    return nuldata
  })
}
const parseData = (filterData) => {
  return filterData.map((data,dataIndex)=> {
    return data.map((cnt, cntIndex)=> {
      let height = 30
      let width = 100
      return {
        type: 'TEXT',
        value: cnt.value,
        style: {
          height: height,
          width: width,
        }
      }
    })
  })
}
exports.parseExcel = function(listData, sheetItem) {
  const filterData = filter(listData)
  const lastData = parseData(filterData)
  const mergeData = mergeDatas(lastData, sheetItem)
  return mergeData
  return {
    source: {
      windowWidth: 1920
    },
    data:[
      {
        table: mergeData
      }
    ]
  }
}

const mergeDatas = (data, sheetItem) => {
  const merges = sheetItem['!merges'] || [];
  for (let index = 0; index < merges.length; index++) {
    const start = merges[index].s;
    const end = merges[index].e;
    const startRow =  start.r
    const endRow =  end.r
    const startCol =  start.c
    const endCol =  end.c
    let height = 30
    let width = 100
    let value ={}
    value = {
      type: 'TEXT',
      value: data[startRow][startCol]?.value,
      style: {
        height: height*((endRow - startRow) +1),
        width: width*((endCol-startCol)+1),
      }
    }
    for (let Rindex = startRow; Rindex <= endRow; Rindex++) {
      for (let Cindex = startCol; Cindex <= endCol; Cindex++) {
        delete data[Rindex][Cindex]
      }
    }
    data[startRow].splice(startCol, 1, value)     
  }
  const fildata = data.filter((fil)=> fil.length !== 0)
  return fildata.map((cnt)=>{
    return cnt.filter((deleteNull)=>deleteNull)
  })
}
