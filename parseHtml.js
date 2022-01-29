// import getCssSelector from 'css-selector-generator';
/**
 * @desc 递归遍历Dom
 */

 const traversDom = (NODES, parentNode) => {
  let doms = [];
  let contrast = []
  let tempText = '';
  let tempDoms = [];
  let tempStyle = {};
  let tempMessage = {};
  let msgTree = '';
  let floatType = false
  //拿到Form元素和文字
  const traversChild = (node) => {
      // tempDoms = [];
      const bool = checkNode(node);
      //处理元素隐藏
      if (bool) {
        // tempStyle = {};
        tempMessage = {};
        msgTree = '';
        floatType = false
          const children = node.childNodes;    
          if (children && children.length) {
              Array.from(children).forEach((child, index) => {
                //   console.log('child', NODES, node)
                  const nodeName = child.nodeName;
                  if(nodeName === 'TABLE' && node.nodeName === 'TD') {
                      traversChild(child);
                      return
                  }                        
                  if (nodeName === '#comment') {
                      //忽略注视
                      return;
                  }
                  if (['INPUT', 'SELECT', 'TEXTAREA',].includes(nodeName)) {
                    tempStyle = {
                        ...tempStyle,
                        ...getStyleAndAttrs(node)
                    };
                    tempMessage = {
                        ...tempMessage,
                        ...getTempMsg(node)
                    };
                    msgTree = getCssSelectorShort(node);
                      if (tempText) {
                          tempDoms.push(tempText);
                          tempText = '';
                      }
                      const boolean = checkNode(child, false);
                      if (boolean) {
                          const { fontWeight, color, fontSize, font, backgroundColor ,} = getStyleAndAttrs(child);
                          tempStyle = {
                              ...tempStyle,
                              fontWeight,
                              color,
                              fontSize,
                              font,
                          };
                          // if()
                          tempMessage = {
                              ...tempMessage,
                              ...getTempMsg(node)
                          };
                          msgTree = getCssSelectorShort(child);
                          if (backgroundColor !== 'rgba(0, 0, 0, 0)') {
                              tempStyle.backgroundColor = backgroundColor;
                          }
                          const xpath = readXPath(child);
                          window.a = xpath;
                          xpathToDom(xpath);
                          tempDoms.push(child);
                      }
                      return;
                  }
                  if (nodeName === '#text' || nodeName === 'BR') {
                        tempMessage = {
                            ...tempMessage,
                            ...getTempMsg(node)
                        };
                      const { fontWeight, color, fontSize, font, textAlign } = getStyleAndAttrs(child);
                        // const maxNode = document.getElementsByTagName('body')
                        // const style = getComputedStyle(node, null);
                        // const width = Number(style.width.split('px')[0]);
                        // const maxWidth = Number(getComputedStyle(maxNode[0], null).width.split('px')[0])
                        // if(width > maxWidth-10) {
                        //     const { colspan, rowspan } = node.attributes;
                        //     tempStyle.height = node.offsetHeight;
                        //     tempStyle.width = node.offsetWidth;
                        //     tempStyle.colspan = colspan && colspan.nodeValue;
                        //     tempStyle.rowspan = rowspan && rowspan.nodeValue;
                        // } 
                      tempStyle = {
                          ...tempStyle,
                          fontWeight,
                          color,
                          fontSize,
                          font,
                          textAlign
                      };
                      tempMessage = {
                          ...tempMessage,
                          ...getTempMsg(node),
                      };
                      msgTree = getCssSelectorShort(node);
                      const checkValue = nodeName !== 'BR' ? child.nodeValue.trim() : '';
                      if (checkValue && checkValue !== '') {
                          tempText += checkValue;
                      } 
                      // console.log(node,tempText)
                      if(checkValue === '' && node.childNodes.length === 1) {
                          tempDoms.push(checkValue)
                      }
                    //   console.log(tempStyle, child, node)
                      return;
                  }
                  traversChild(child);                   
              });
          }
          else {
            tempStyle = {
                ...tempStyle,
                ...getStyleAndAttrs(node)
            };
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(node.nodeName)) {
                // console.log(node)
                const xpath = readXPath(node);
                node.xpath = xpath;
                tempDoms.push(node);
            } else
            if (node.nodeName === '#text' && node.nodeValue.trim() !== '') {
                console.log(node)
                tempDoms.push(node.nodeValue);
            } else {
                if(node.nodeType === 1) {
                    const nodeStyle = getComputedStyle(node, null)
                    const nodeWidth = nodeStyle.width
                    if(nodeWidth === 'auto' 
                    || nodeWidth ==='15px' 
                    || nodeWidth === '5px'
                    || nodeWidth ==='9px') return
                    tempDoms.push('');
                }
                if(node.nodeType === 3) {
                    console.log(node);
                    const nodeStyle = getComputedStyle(node.parentNode, null)
                    const nodeWidth = nodeStyle.width
                    if(nodeWidth === 'auto' 
                    || nodeWidth ==='15px' 
                    || nodeWidth ==='5px'
                    || nodeWidth ==='9px') return
                    tempDoms.push('');
                } else {
                    const nodeStyle = getComputedStyle(node, null)
                    const nodeWidth = nodeStyle.width
                    if(nodeWidth === 'auto' 
                    || nodeWidth ==='15px' 
                    || nodeWidth ==='5px'
                    || nodeWidth ==='9px') return
                    // console.log(node)
                    tempDoms.push('');
                }
            }
          }
      }
  };
  NODES.forEach((NODE) => {
      tempDoms = [];
      tempStyle = {};
      tempMessage = {};
      msgTree = '';
      floatType = false
      const bool = checkNode(NODE);
      if(bool) {
        if(NODE.nodeType === 8) return
        if(NODE.nodeType === 3) {
            tempStyle.height = NODE.parentNode.offsetHeight;
            tempStyle.width = NODE.parentNode.offsetWidth;
            // console.log(NODE.parentNode, NODE.parentNode.childNodes);
            if(NODE.parentNode.childNodes.length === 1) {
                traversChild(NODE.parentNode)
            }
        } else {
            tempStyle.height = NODE.offsetHeight;
            tempStyle.width = NODE.offsetWidth;
            // console.log(NODE.parentNode, NODE.parentNode.childNodes);
            traversChild(NODE)
        }
      }
    //   console.log(tempStyle, tempDoms, NODE, NODE.parentNode)
      if (tempText) {
          tempDoms.push(tempText);
      }
      tempText = '';
      if (tempDoms.length >= 1) {
          //处理radio的情况 radio进行合并
          if (tempDoms.filter(dom => dom.type === 'radio').length) {
              const tempVals = switchRadio(tempDoms);
              doms.push({
                  type: 'RADIO',
                  style: tempStyle,
                  value: tempVals,
                  visibility: !!tempVals.length
              });
          }
          else {
              const switchDoms = tempDoms.map((dom, domIndex) => {
                  return {
                      type: switchNodeType(dom) || 'TEXT',
                      value: ['INPUT', 'SELECT', 'TEXTAREA'].includes(dom.nodeName) ? getFormValue(dom) : dom,
                      style: {
                          ...tempStyle,
                          rowspan: '',
                          colspan: '',
                      },
                      visibility: checkNode(dom, false, true),
                      title: checkTitle(NODE),
                      msg: { ...tempMessage },
                      msgTree: msgTree,
                      floatType: floatType
                  };
              });
              doms.push({
                  value: switchDoms.length === 1 ? switchDoms[0].value : switchDoms,
                  type: tempDoms.length === 1 ? (switchNodeType(tempDoms[0])) || 'TEXT' : 'MORE',
                  xpath: tempDoms[0] && tempDoms[0].xpath,
                  style: tempStyle,
                  visibility: true,
                  title: switchDoms[0].title,
                  msg: tempMessage,
                  msgTree: msgTree,
                  floatType: floatType
              });
              contrast.push({
                  msgTree: msgTree,
              })
          }
      }
  });
  tempStyle = {};
  return {
      doms, contrast
  };
};
/**
* @desc input类型再次解析
*/
const switchNodeType = (NODE) => {
  if (NODE.nodeName === 'INPUT') {
      switch (NODE.type) {
          case 'text':
              return 'INPUT';
          case 'checkbox':
              return 'CHECKBOX';
          case 'radio':
              return 'RADIO';
      }
  }
  else {
      return NODE.nodeName;
  }
};
/**
* @desc radio解析
*/
const switchRadio = (NODES) => {
  const len = NODES.length;
  const isNodeType = NODES[0].nodeType;
  const values = [];
  for (let i = 0; i < len - 1; i += 2) {
      let temp = {};
      if (checkNode((isNodeType ? NODES[i] : NODES[i + 1]), false, false) && len % 2 === 1) {
          if (i === 0) {
              temp.value = '';
              //TODO 要验证下这个label
              temp.label = NODES[i];
              values.push(temp);
          }
          else if (i % 2 == 1) {
              temp.value = NODES[i].value;
              //TODO 要验证下这个label
              temp.label = NODES[i + 1];
              values.push(temp);
          }
      }
      else {
          temp.value = isNodeType ? NODES[i].value : NODES[i + 1].value;
          //TODO 要验证下这个label
          temp.label = isNodeType ? NODES[i + 1] : NODES[i];
          values.push(temp);
      }
  }
  return values;
};
/**
* @desc 检测元素是否含有隐藏属性
* @param NODE dom元素
* @param isCheckParent 是否检测父级元素
* @param isCheckVisible 是否检测absolute属性
*/
const checkNode = (NODE, isCheckParent, isCheckVisible) => {
  if (NODE.nodeName === undefined || NODE.nodeName === '#text' || NODE.nodeName === '#comment') {
      return true;
  }
  //是否是表单元素
  //@ts-ignore
  const nodeType = NODE.nodeType;
  const isForm = ['INPUT', 'SELECT', 'TEXTAREA'].includes(nodeType);
  const attributes = NODE.attributes;
  const attributesKeys = Reflect.ownKeys(attributes);
  //表单元素检测type属性
  let isHidden = isForm ? attributesKeys.filter(attrKey => {
      //@ts-ignore
      const { nodeValue } = attributes[attrKey];
      return nodeValue === 'hidden';
  }).length : false;
  const traversParent = (TEMPNODE) => {
      const style = getComputedStyle(TEMPNODE, null);
      const display = style.display;
      const position = style.position;
      const visibility = style.visibility;
      const height = style.height
      const width = style.width
      if (TEMPNODE.style.display === 'none' ||
          TEMPNODE.style.visibility === 'hidden' ||
          // TEMPNODE.style.position === 'absolute' ||
          display === 'none' ||
          visibility === 'hidden' || 
          height === '0px' || 
          width === '0px' || 
          TEMPNODE.getBoundingClientRect().x<0
      // position === 'absolute'
      ) {
          isHidden = true;
      }
      else {
          //不需要往上递归父级
          if (isCheckParent && TEMPNODE.nodeName !== 'BODY' && TEMPNODE.parentNode) {
              traversParent(TEMPNODE.parentNode);
          }
      }
      // absolute属性暂时不放开
      if (isCheckVisible) {
          if (TEMPNODE.style.position === 'absolute' || position === 'absolute') {
              isHidden = true;
          }
      }
  };
  traversParent(NODE);
  return !Boolean(isHidden);
};
/**
* @desc 获取元素的样式和属性
*/
const getStyleAndAttrs = (NODE) => {
  const isText = NODE.nodeName === '#text';
  const cssStyle = getComputedStyle(isText ? NODE.parentNode : NODE, null);
  //内联样式
  const style = isText ? NODE.parentNode.style : NODE.style;
  return ['font', 'fontWeight', 'color', 'fontSize', 'backgroundColor', 'textAlign',].reduce((prev, next) => {
      // if(next === 'width' || next === 'height') {
      //     prev[next] = +(style[next].split('px')[0] || cssStyle[next].split('px')[0]);
      // } else {
          prev[next] = style[next] || cssStyle[next];  
      // }
      return prev;
  }, {});
};
/**
* @desc 获取表单的值
*/
const getFormValue = (NODE) => {
  let nodeName = NODE.nodeName;
  switch (nodeName) {
      case 'INPUT':
          return NODE.value;
      case 'SELECT':
          //@ts-ignore
          return Array.from(NODE).map(child => ({ value: child.value, label: child.label }));
  }
};
/**
* @desc获取xpath
*/
const readXPath = (element) => {
  if (element.id !== "") { //判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
      return `//*[@id='${element.id}']`;
  }
  //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
  if (element == document.body) { //递归到body处，结束递归
      return '/html/' + element.tagName.toLowerCase();
  }
  var ix = 1, //在nodelist中的位置，且每次点击初始化
  siblings = element.parentNode.childNodes; //同级的子元素
  for (var i = 0, l = siblings.length; i < l; i++) {
      var sibling = siblings[i];
      //如果这个元素是siblings数组中的元素，则执行递归操作
      if (sibling == element) {
          return readXPath(element.parentNode) + '/' + element.tagName.toLowerCase() + '[' + (ix) + ']';
          //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
      }
      else if (sibling.nodeType == 1 && sibling.tagName == element.tagName) {
          ix++;
      }
  }
};
/**
* @desc 判断是否为标题
*/
const checkTitle = (NODE) => {
  // console.log(NODE.nodeName)
  if(NODE.parentNode.id === 'lrbxxForm_panelTitle' || NODE.parentNode.id === 'xjllbxxForm_panelTitle') {
      return true
  }
  if (NODE.nodeName === "H1") {
      return true;
  }
  else {
      return false;
  }
};
/**
* @desc 获取元素的节点信息
*/
const getTempMsg = (NODE) => {
  const childNode = NODE.childNodes
  let nodeMsg = {};
  if(NODE.nodeName === 'DIV') {
      const msg =  NODE.attributes;
      if (msg !== undefined) {
          for (let key in msg) {
              if (msg.hasOwnProperty(key)) {
                  const { name, value } = msg[key];
                  if((name === 'readonly' && !value) || (name === 'disable' && !value)) {
                      nodeMsg[name] = true;
                      const newname = 'div'+name
                      nodeMsg[newname] = true;
                  } else {
                      if(name === 'readonly' || name === 'disable') {
                          nodeMsg[name] = true;
                          const newname = 'div'+name
                          nodeMsg[newname] = value;
                      } else {
                          nodeMsg[name] = value;
                      }
                  }                     
                  nodeMsg = {
                      ...nodeMsg,
                  };
              }
              if(!msg.hasOwnProperty('readonly') && (!msg.hasOwnProperty('disable'))) {
                  nodeMsg['divreadonly'] = true;
                  nodeMsg['divdisable'] = true;
              }
          }
      }
  }
  Array.from(childNode).forEach((child) => {
      if(child.nodeName === 'INPUT') {
          const msg =  child.attributes;
          if (msg !== undefined) {
              for (let key in msg) {
                  if (msg.hasOwnProperty(key)) {
                      const { name, value } = msg[key];
                      if((name === 'readonly' && !value) || (name === 'disable' && !value)) {
                          nodeMsg[name] = true;
                      } else {
                          nodeMsg[name] = value;
                      }                     
                      nodeMsg = {
                          ...nodeMsg,
                      };
                  }
              }
          }
      } 
  })
  return nodeMsg;
};
/**
* @desc 获取元素的节点dom数信息
*/
const getCssSelectorShort = (el) => {
    let path = [], parent;
    while (parent = el.parentNode) {
        // let tag = el.tagName ? el.tagName : el.parentNode.tagName, siblings;
        if(el.tagName !== 'DIV') {
            // let tag = el?.tagName ? el.tagName : el.childNodes.tagName, siblings;
            // path.unshift(((el.id)) ? `#${el.id }`: el.className ? (el.getAttribute('name') ? `${tag}[name=${el.getAttribute('name')}].${el.className.replace(/\s+/g, '.').replace(/[.]$/,'')}` : `.${el.className.replace(/\s+/g, '.').replace(/[.]$/,'')}`) : (siblings = parent.children,
            //     [].filter.call(siblings, sibling => sibling.tagName === tag).length === 1 ? tag : (el.childNodes.length !== 0 ) ? `${tag}:nth-child(${1 + [].indexOf.call(siblings, el)})` :
            //     tag));
            
            // let tag = el?.tagName ? el.tagName : el.parentNode.tagName, siblings;
            // path.unshift(((el.id)) ? parseId(el.id) : (siblings = parent.children,
            //     [].filter.call(siblings, sibling => sibling.tagName === tag).length === 1 ? tag : ((parent.childNodes.length !== 0 ) ? `${tag}:nth-child(${1 + [].indexOf.call(siblings, el)})` :
            //     tag)));
            // if(parent.tagName === 'HTML') break
            // el = parent;

            let tag = el?.tagName ? el.tagName : el.parentNode.tagName, siblings;
            path.unshift((siblings = parent.children,
                [].filter.call(siblings, sibling => sibling.tagName === tag).length === 1 ? tag : ((parent.childNodes.length !== 0 ) ? `${tag}:nth-child(${1 + [].indexOf.call(siblings, el)})` :
                tag)));
            if(parent.tagName === 'HTML') break
            el = parent;

            // console.log(document.querySelectorAll(path))
        } else {
            // let tag = el?.childNodes.tagName ? el.childNodes.tagName : el.tagName, siblings;           
            // path.unshift(((el.id)) ? `#${el.id }`: el.className ? (el.getAttribute('name') ? `${tag}[name=${el.getAttribute('name')}].${el.className.replace(/\s+/g, '.').replace(/[.]$/,'')}` : `.${el.className.replace(/\s+/g, '.').replace(/[.]$/,'')}`) : (siblings = parent.children,
            //     [].filter.call(siblings, sibling => sibling.tagName === tag).length === 1 ? tag : (el.childNodes.length !== 0 ) ? `${tag}:nth-child(${1 + [].indexOf.call(siblings, el)})` :
            //     tag));

        //     let tag = el?.tagName ? el.tagName : el.parentNode.tagName, siblings;
        // path.unshift(((el.id)) ? parseId(el.id) : (siblings = parent.children,
        //     [].filter.call(siblings, sibling => sibling.tagName === tag).length === 1 ? tag : (parent.childNodes.length !== 0 ) ? `${tag}:nth-child(${1 + [].indexOf.call(siblings, el)})` :
        //     tag));
        //     el = parent;
        //     if(parent.parentNode.tagName === 'HTML') break

        let tag = el?.tagName ? el.tagName : el.parentNode.tagName, siblings;
        path.unshift((siblings = parent.children,
            [].filter.call(siblings, sibling => sibling.tagName === tag).length === 1 ? tag : (parent.childNodes.length !== 0 ) ? `${tag}:nth-child(${1 + [].indexOf.call(siblings, el)})` :
            tag));
            el = parent;
            if(parent.parentNode.tagName === 'HTML') break
        }
        
    }
    if(path.includes(undefined)) {
        path.forEach((v, i) => {
            if( v=== undefined) {
                path.splice(i, 1)
            }
        })
    }
    return `${path.join(' > ')}`;
};

const xpathToDom = (xpath) => {
  //xpath转化为jspath
  const result = document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null);
  return result.iterateNext();
};

//判断表格行数最长
const maxNodeLength = (node)=> {
    if(node.nodeName === 'BODY' || node.nodeName === 'HTML') return
    if(node.parentNode.nodeName === 'BODY') {
        return Number(getComputedStyle(node, null).width.split('px')[0])
    } else {
        return maxNodeLength(node.parentNode)
    }
}
//判断当前dom节点子节点是否含有最长元素
const checkNowNode = (node)=> {
    const maxNode = maxNodeLength(node)
    const childNodes = node.childNodes
    const allWidth = Array.from(childNodes).map((child)=> {
        if(child.nodeType === 1) {
            const childStyle = getComputedStyle(child, null);
            const childWidth = Number(childStyle.width.split('px')[0]);
            return childWidth
        }
    })
    return allWidth.filter((width)=>width).some((value)=> maxNode-10 <=value)
}

  //判断元素是否是最外层
 const checkNodeWidth = (node)=> {
	//  console.log(node.parentNode)
    // return node
    const bodyNode = document.getElementsByTagName('body')
    const maxNode = maxNodeLength(node)
    if(maxNode<800) return 
    const style = getComputedStyle(node, null);
    const width = Number(style.width.split('px')[0]);
    const height = Number(style.height.split('px')[0]);
    const maxWidth = Number(getComputedStyle(bodyNode[0], null).width.split('px')[0])
    if(maxWidth-5 > maxNode) {
        if(maxNode-160 < width && height<200) {
            if(node.nodeName !== 'BODY') {
              if(!checkNowNode(node)) {
                // console.log(node, node.childNodes);
                return node
              }
            }
        } else {
            if (node.nodeName !== 'BODY' && node.parentNode) {
                return checkNodeWidth(node.parentNode);
            }
        }
    } else {
        if(maxNode-20 < width && height<200) {
            if(node.nodeName !== 'BODY') {
                if(!checkNowNode(node)) {
                    return node
                }
            }
          } else {
            if (node.nodeName !== 'BODY' && node.parentNode) {
              return checkNodeWidth(node.parentNode);
            }
        }
    }
  }
  //判断元素是否隐藏
  const checkNodeIs=(node)=> {
    const style = getComputedStyle(node, null);
    const display = style.display;
    const visibility = style.visibility;
    if (node.style.display === 'none' ||
      node.style.visibility === 'hidden' ||
        display === 'none' ||
        visibility === 'hidden'
    ) {
        return true
    }
    else {
      if (node.nodeName !== 'BODY' && node.parentNode) {
        return false
      }
    }
  }

  //判断节点是否重复
  const diffDom=(dom, allDom)=> {
    let diff = false
    allDom.forEach((cnt)=> {
    //   if(cnt.node === dom.node && cnt.place === dom.place) {
    //     diff = false
    //   } else {
    //     diff = true
    //   }
      if(cnt.place === dom.place || cnt.node === dom.node) {
        diff = false
      } else {
        diff = true
      }
    })
    return diff
  }
class DomTree {
  formTypes;
  inputs;
  hasTable;
  prevForms;
  nextForms;
  allInputs;
  tables;
  data;
  root;
}
class ForDom extends DomTree {
  constructor() {
      super();
      this.inputs = [];
      // 遍历过程中是否出现Table元素
      this.hasTable = false;
      this.tables = [];
      //采集到的数据
      this.data = [];
      //采集对比数据
      this.contrastData = []
      this.contrastTables = [];
      //每个Iframe的根元素
      this.root = null;
      //Table元素前出现的form元素
      this.prevForms = [];
      //Table元素后出现的form元素
      this.nextForms = [];
      this.formTypes = ['INPUT', 'SELECT', 'TEXTAREA'];
      this.parents = []
  }
  init() {
      console.log(`开始读取dom`);
      console.log('1111', document);
      this.traversIframe(document);
      console.log({
          source: {
              windowWidth: window.innerWidth,
          },
          data: [{table:this.data}],
            // data: this.data,
          contrastData: this.contrastData
          // table: this.tables
      });
      window.tableDoms = {
          source: {
              windowWidth: window.innerWidth,
          },
          data: this.data,
          contrastData: this.contrastData
      };
      console.log(`结束读取dom`);
  }
  //遍历body下所有元素，过滤
  traversAllDom(body) {
    Array.from(body).forEach((child)=> {
      if(child.nodeName === 'SCRIPT' || child.nodeName === 'LINK' ||　!checkNode(child)) return
        if(!checkNode(child)) return
        if(child.hasChildNodes()){    
            var sonnodes = child.childNodes;
            this.traversAllDom(sonnodes);
        } else {
            if(
                child.parentNode.nodeName === 'BODY' || 
                child.parentNode.nodeName === 'BODY' || 
                child.parentNode.nodeName === 'COL'  || 
                child.parentNode.nodeName === 'COLGROUP'
            ) return
            const prevNode = checkNodeWidth(child.parentNode)
            // console.log(child, child.parentNode);
            if(!prevNode || prevNode.nodeName === 'COLGROUP') return
            const prevNodePlace =  prevNode.getBoundingClientRect().top
            const prev = {
                node: prevNode,
                place: prevNodePlace
            }
            if(diffDom(prev, this.parents)) {
                // console.log(prev, prevNode, prevNode.childNodes);
                const doms = traversDom(prevNode.childNodes, prevNode)
                this.data.push(doms.doms)
                    const filterContrast = doms.contrast.map((item)=> {
                        return {
                            index: doms.contrast.length,
                            path: item.msgTree
                        }
                    })
                this.contrastData.push(filterContrast)
            }
            this.parents.push({
                node: prevNode,
                place: prevNodePlace
            })
        }
    })
  }
  traversIframe(root) {
      const self = this;
      this.root = root;
      this.prevForms = [];
      this.nextForms = [];
      const iframes = root.getElementsByTagName('iframe');
      const tables = root.getElementsByTagName('table');
      const body = root.getElementsByTagName('body');
      self.traversAllDom(body)
  };
}

new ForDom().init();
