
const fs = require('fs-extra');
const pointList = [{ left: 20, top: 10 }, { left: 200, top: 100 }, { left: 150, top: 30 }];
const beginTime = new Date().getTime();
const randomNum = function (minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
};
function fingerData(pointList, a, debounce) {
  var objList = [];
  pointList.map((item, index) => {
    const nextItem = pointList[index + 1];
    const nowDate = objList[objList.length - 1] ? objList[objList.length - 1].nowDate + randomNum(11, 30) : new Date().getTime() + randomNum(11, 30);
    objList.push(
        {
            clientX: item.left,
            clientY: item.top,
            beginTime,
            nowDate
        }
    )

    if (nextItem) {
        const x = nextItem.left - item.left;
        const y = nextItem.top - item.top;
        let statrX = 0;
        let statrY = 0;
        if (x > 0) {
            // 向右
            if (y > 0) {
                // 向下
                let v0 = 0
                let v = 0
                while (statrX <= x || statrY <= y) {
                    if (statrX + item.left >= nextItem.left) {
                        // statrX = statrX - 1
                        if((statrX + item.left)*(debounce) >= nextItem.left) {
                          v0 = v
                          v = v0 + (-a*2) * 1
                          statrX += ((v + 0.5*(-a*2)))
                        } else {
                          v0 = v
                          v = v0 + (-a) * 1
                          statrX += (v + 0.5*(-a))
                        }
                    } else {
                        // statrX = statrX + Math.floor(Math.random() * 6)
                        if(statrX + item.left < nextItem.left*(debounce)) {
                          v0 = v
                          v = v0 + (a*2) * 1
                          statrX += (v+ 0.5*(a*2))
                        } else {
                          v0 = v
                          v = v0 + (a) * 1
                          statrX += (v + 0.5*(a))
                        }
                    }
                    if (statrY + item.top >= nextItem.top) {
                        // statrY = statrY - 1
                        if((statrY + item.top)*(debounce) >= nextItem.top) {
                          v0 = v
                          v = v0 + (-a*2) * 1
                          statrY += (v + 0.5*(-a*2))
                        } else {
                          v0 = v
                          v = v0 + (-a) * 1
                          statrY += (v + 0.5*(-a))
                        }
                    } else {
                        // statrY = statrY + Math.floor(Math.random() * 6)
                        if(statrY + item.top < nextItem.top*(debounce)) {
                          v0 = v
                          v = v0 + (a*2) * 1
                          statrY += v+0.5*(a*2)
                        } else {
                          v0 = v
                          v = v0 + (a) * 1
                          statrY += v+0.5*(a)
                        }
                    }
                    objList.push(
                        {
                            clientX: item.left + statrX,
                            clientY: item.top + statrY,
                            beginTime,
                            nowDate: objList[objList.length - 1] ? objList[objList.length - 1].nowDate + randomNum(11, 30) : new Date().getTime() + randomNum(11, 30)
                        }
                    )
                }

            } else {
                // 向上
                let v0 = 0
                let v = 0
                while (statrX <= x || statrY <= Math.abs(y)) {
                    if (statrX + item.left >= nextItem.left) {
                        // statrX = statrX - 1
                        if((statrX + item.left)*(debounce) >= nextItem.left) {
                          v0 = v
                          v = v0 + (-a*2) * 1
                          statrX += v + 0.5*(-a*2)
                        } else {
                          v0 = v
                          v = v0 + (-a) * 1
                          statrX += v + 0.5*(-a)
                        }
                    } else {
                        // statrX = statrX + Math.floor(Math.random() * 6)
                        if(statrX + item.left < nextItem.left*(debounce)) {
                          v0 = v
                          v = v0 + (a*2) * 1
                          statrX += v+ 0.5*(a*2)
                        } else {
                          v0 = v
                          v = v0 + (a) * 1
                          statrX += v + 0.5*(a)
                        }
                    }
                    if (item.top - statrY <= nextItem.top) {
                        // statrY = statrY - 1
                        if(statrY + item.top <= nextItem.top*(debounce)) {
                          v0 = v
                          v = v0 + (-a*2) * 1
                          statrY += v+0.5*(-a*2)
                        } else {
                          v0 = v
                          v = v0 + (-a) * 1
                          statrY += v+0.5*(-a)
                        }
                    } else {
                        // statrY = statrY + Math.floor(Math.random() * 6)
                        if((statrY + item.top)*(debounce) >= nextItem.top) {
                          v0 = v
                          v = v0 + (a*2) * 1
                          statrY += v + 0.5*(a*2)
                        } else {
                          v0 = v
                          v = v0 + (a) * 1
                          statrY += v + 0.5*(a)
                        }
                    }
                    objList.push(
                        {
                            clientX: item.left + statrX,
                            clientY: item.top - statrY,
                            beginTime,
                            nowDate: objList[objList.length - 1] ? objList[objList.length - 1].nowDate + randomNum(11, 30) : new Date().getTime() + randomNum(11, 30)
                        }
                    )
                }
            }
        } else {
            // 向左
            if (y > 0) {
                // 向下
                let v0 = 0
                let v = 0
                while (statrX <= Math.abs(x) || statrY <= y) {
                    if (statrX + item.left <= nextItem.left) {
                        // statrX = statrX - 1
                        if(statrX + item.left <= nextItem.left*(debounce)) {
                          v0 = v
                          v = v0 + (-a*2) * 1
                          statrX += v+ 0.5*(-a*2)
                        } else {
                          v0 = v
                          v = v0 + (-a) * 1
                          statrX += v + 0.5*(-a)
                        }
                    } else {
                        // statrX = statrX + Math.floor(Math.random() * 6)
                        if((statrX + item.left)*(debounce) > nextItem.left) {
                          v0 = v
                          v = v0 + (a*2) * 1
                          statrX += v+ 0.5*(a*2)
                        } else {
                          v0 = v
                          v = v0 + (a) * 1
                          statrX += v + 0.5*(a)
                        }
                    }
                    if (statrY + item.top >= nextItem.top) {
                        // statrY = statrY - 1
                        if((statrY + item.top)*(debounce) >= nextItem.top) {
                          v0 = v
                          v = v0 + (-a*2) * 1
                          statrY += v + 0.5*(-a*2)
                        } else {
                          v0 = v
                          v = v0 + (-a) * 1
                          statrY += v + 0.5*(-a)
                        }
                    } else {
                        // statrY = statrY + Math.floor(Math.random() * 6)
                        if((statrY + item.top)*(debounce) <= nextItem.top) {
                          v0 = v
                          v = v0 + (a*2) * 1
                          statrY += v+0.5*(a*2)
                        } else {
                          v0 = v
                          v = v0 + (a) * 1
                          statrY += v+0.5*(a)
                        }
                    }
                    objList.push(
                        {
                            clientX: item.left - statrX,
                            clientY: item.top + statrY,
                            beginTime,
                            nowDate: objList[objList.length - 1] ? objList[objList.length - 1].nowDate + randomNum(11, 30) : new Date().getTime() + randomNum(11, 30)
                        }
                    )
                }
            } else {
                // 向上
                let v0 = 0
                let v = 0
                while (statrX <= Math.abs(x) || statrY <= Math.abs(y)) {
                    if (statrX + item.left <= nextItem.left) {
                        // statrX = statrX - 1
                        if(statrX + item.left < nextItem.left*(debounce)) {
                          v0 = v
                          v = v0 + (-a*2) * 1
                          statrX += v+ 0.5*(-a*2)
                        } else {
                          v0 = v
                          v = v0 + (-a) * 1
                          statrX += v + 0.5*(-a)
                        }
                    } else {
                        // statrX = statrX + Math.floor(Math.random() * 6)
                        if((statrX + item.left)*(debounce) > nextItem.left) {
                          v0 = v
                          v = v0 + (a*2) * 1
                          statrX += v+ 0.5*(a*2)
                        } else {
                          v0 = v
                          v = v0 + (a) * 1
                          statrX += v + 0.5*(a)
                        }
                    }
                    if (item.top - statrY <= nextItem.top) {
                        // statrY = statrY - 1
                        if((item.top - statrY)*(debounce) <= nextItem.top) {
                          v0 = v
                          v = v0 + (-a*2) * 1
                          statrY += v+0.5*(-a*2)
                        } else {
                          v0 = v
                          v = v0 + (-a) * 1
                          statrY += v+0.5*(-a)
                        }
                    } else {
                        // statrY = statrY + Math.floor(Math.random() * 6)
                        if((item.top - statrY)*(debounce) < nextItem.top) {
                          v0 = v
                          v = v0 + (a*2) * 1
                          statrY += v+0.5*(a*2)
                        } else {
                          v0 = v
                          v = v0 + (a) * 1
                          statrY += v+0.5*(a)
                        }
                    }
                    objList.push(
                        {
                            clientX: item.left - statrX,
                            clientY: item.top - statrY,
                            beginTime,
                            nowDate: objList[objList.length - 1] ? objList[objList.length - 1].nowDate + randomNum(11, 30) : new Date().getTime() + randomNum(11, 30)
                        }
                    )
                }
            }
        }
    }
  })
  return objList.map(item=> {
    return{
      clientX: Math.ceil(item.clientX),
      clientY: Math.ceil(item.clientY),
      beginTime: item.beginTime,
      nowDate: item.nowDate
    }
  })
}

fs.outputFile(`${__dirname}/__excel__/finger.json`,JSON.stringify(fingerData(pointList, 1.5, 2/3)));

