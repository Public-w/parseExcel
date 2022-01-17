// import getCssSelector from 'css-selector-generator';
/**
 * @desc 递归遍历Dom
 */

const traversDom = (NODES) => {
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
        // console.log('node', node, node.childNodes)
        const bool = checkNode(node, false);
        //处理元素隐藏
        if (bool) {
            if(node.nodeName === 'DIV' && node.parentNode.nodeName === 'DIV' && node.parentNode.parentNode.parentNode.parentNode.nodeName === 'DIV') {
                const { colspan, rowspan } = node.attributes;
                tempStyle.height = node.offsetHeight;
                tempStyle.width = node.offsetWidth;
                tempStyle.colspan = colspan && colspan.nodeValue;
                tempStyle.rowspan = rowspan && rowspan.nodeValue;
                tempStyle = {
                    ...tempStyle,
                    ...getStyleAndAttrs(node)
                };
                tempMessage = {
                    ...tempMessage,
                    ...getTempMsg(node)
                };
                msgTree = getCssSelectorShort(node);
            }
            if(node.nodeName === 'DIV' && node.className === 'sGrid_header_text_div') {
                const { colspan, rowspan } = node.parentNode.attributes;
                tempStyle.height = node.parentNode.offsetHeight;
                tempStyle.width = node.parentNode.offsetWidth;
                tempStyle.colspan = colspan && colspan.nodeValue;
                tempStyle.rowspan = rowspan && rowspan.nodeValue;
                tempStyle = {
                    ...tempStyle,
                    ...getStyleAndAttrs(node.parentNode)
                };
                tempMessage = {
                    ...tempMessage,
                    ...getTempMsg(node)
                };
                msgTree = getCssSelectorShort(node);
            }
            if (node.nodeName === 'TD' && node.parentNode.parentNode.parentNode.parentNode.nodeName !== 'TD') {
                const { colspan, rowspan } = node.attributes;
                tempStyle.height = node.parentNode.childNodes.length === 1?(node.offsetHeight + 5) : (node.offsetHeight + 1);
                tempStyle.width = node.parentNode.childNodes.length === 1 ?(node.offsetWidth + 5) : (node.offsetWidth + 1);
                tempStyle.wordBreak = getComputedStyle(node, null).wordBreak;
                tempStyle.colspan = colspan && colspan.nodeValue;
                tempStyle.rowspan = rowspan && rowspan.nodeValue;
                if(node.className.indexOf('edit') !== -1) {
                    floatType = true
                } else {
                    floatType = false
                }
                tempStyle = {
                    ...tempStyle,
                    ...getStyleAndAttrs(node)
                };
                tempMessage = {
                    ...tempMessage,
                    ...getTempMsg(node)
                };
                msgTree = getCssSelectorShort(node);
            }
            if (node.nodeName === 'TH') {
                const { colspan, rowspan } = node.attributes;
                tempStyle.height = node.parentNode.childNodes.length === 1?(node.offsetHeight + 5) : (node.offsetHeight + 1);
                tempStyle.width = node.parentNode.childNodes.length === 1 ?(node.offsetWidth + 5) : (node.offsetWidth + 1);
                tempStyle.wordBreak = getComputedStyle(node, null).wordBreak;
                tempStyle.colspan = colspan && colspan.nodeValue;
                tempStyle.rowspan = rowspan && rowspan.nodeValue;
                tempStyle = {
                    ...tempStyle,
                    ...getStyleAndAttrs(node)
                };
                tempMessage = {
                    ...tempMessage,
                    ...getTempMsg(node)
                };
                msgTree = getCssSelectorShort(node);
            }
            if (node.nodeName === 'H1') {
                const { fontWeight, color, fontSize, font, textAlign } = getStyleAndAttrs(node);
                tempStyle.height = node.offsetHeight;
                tempStyle.width = node.offsetWidth;
                tempStyle = {
                    ...tempStyle,
                    fontWeight,
                    color,
                    fontSize,
                    font,
                    textAlign,
                };
                tempMessage = {
                    ...tempMessage,
                    ...getTempMsg(node)
                };
                msgTree = getCssSelectorShort(node);
            }
            if (node.nodeName === 'INPUT') {
                const { colspan, rowspan } = node.attributes;
                tempStyle.height = node.offsetHeight;
                tempStyle.width = node.offsetWidth;
                tempStyle.colspan = colspan && colspan.nodeValue;
                tempStyle.rowspan = rowspan && rowspan.nodeValue;
                tempStyle = {
                    ...tempStyle,
                    ...getStyleAndAttrs(node)
                };
                tempMessage = {
                    ...tempMessage,
                    ...getTempMsg(node)
                };
                msgTree = getCssSelectorShort(node);
            }
            if (node.nodeName === '#text') {
                const { fontWeight, color, fontSize, font, textAlign} = getStyleAndAttrs(node);
                if(node.parentNode.nodeName === 'LI') {
                    let spanWidth = ''
                    let spanHeight = ''
                    let span = document.createElement("span");
                    span.innerHTML = node.data
                    node.parentNode.appendChild(span)
                    spanWidth = span.offsetWidth
                    spanHeight = span.offsetHeight
                    tempStyle.height = spanHeight;
                    tempStyle.width = spanWidth;
                    tempStyle = {
                        ...tempStyle,
                        fontWeight,
                        color,
                        fontSize,
                        font,
                        textAlign,
                    };
                    tempMessage = {
                        ...tempMessage,
                        ...getTempMsg(node)
                    };
                    msgTree = getCssSelectorShort(node);
                    node.parentNode.removeChild(span)
                } else {
                    // tempStyle.height = node.offsetHeight || height;
                    // tempStyle.width = node.offsetWidth || width;
                    tempStyle = {
                        ...tempStyle,
                        fontWeight,
                        color,
                        fontSize,
                        font,
                        textAlign,
                    };
                    tempMessage = {
                        ...tempMessage,
                        ...getTempMsg(node)
                    };
                    msgTree = getCssSelectorShort(node);
                }              
            }
            const children = node.childNodes;
            // console.log('node', node, children)     
            if (children && children.length) {
                Array.from(children).forEach((child, index) => {
                    const nodeName = child.nodeName;
                    if(nodeName === 'TABLE' && node.nodeName === 'TD') {
                        traversChild(child);
                        return
                    }                        
                    if(nodeName === 'DIV' && (child.offsetHeight === 0 || child.offsetWidth === 0) || child.className === 'sGrid_header_border_div') {
                        return
                    }
                    if (nodeName === '#comment') {
                        //忽略注视
                        return;
                    }
                    if (['INPUT', 'SELECT', 'TEXTAREA',].includes(nodeName)) {
                        if (tempText) {
                            tempDoms.push(tempText);
                            tempText = '';
                        }
                        const boolean = checkNode(child, false);
                        if (boolean) {
                            const { fontWeight, color, fontSize, font, backgroundColor ,} = getStyleAndAttrs(child);
                            // console.log(child, child.offsetWidth)
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
                            // if(tempDoms.length > 0 && child.parentNode.nodeName === 'A'){
                            //     tempDoms.push(child);
                            // } else if(tempDoms.length === 0){
                            //     tempDoms.push(child);
                            // }
                            tempDoms.push(child);
                        }
                        return;
                    }
                    if (nodeName === '#text' || nodeName === 'BR') {
                        const { fontWeight, color, fontSize, font, textAlign } = getStyleAndAttrs(child);
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
                        return;
                    }
                    traversChild(child);                   
                });
            }
            else {
                if (['INPUT', 'SELECT', 'TEXTAREA'].includes(node.nodeName)) {
                    const xpath = readXPath(node);
                    node.xpath = xpath;
                    tempDoms.push(node);
                }
                if (node.nodeName === '#text' && node.nodeValue.trim() !== '') {
                    tempDoms.push(node.nodeValue);
                }
                if (node.nodeName === 'TD' || node.nodeName === 'TH' || (node.nodeName === 'DIV' && node.parentNode.parentNode.className === 'sGrid_data_div')) {
                    // console.log(node, node.childNodes,msgTree )
                    tempDoms.push('');
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
        console.log(NODE)
        // if(getComputedStyle(NODE, null).display === 'none') return
        traversChild(NODE);
        if (tempText) {
            tempDoms.push(tempText);
        }
        tempText = '';
        if (tempDoms.length >= 1) {
            // console.log(tempDoms)
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
                const switchDoms = tempDoms.map(dom => {
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
                    value: switchDoms.length === 1 ? switchDoms[0].value : switchDoms,
                    type: tempDoms.length === 1 ? (switchNodeType(tempDoms[0])) || 'TEXT' : 'MORE',
                    xpath: tempDoms[0] && tempDoms[0].xpath,
                    visibility: true,
                    title: switchDoms[0].title,
                    msgTree: msgTree,
                })
            }
        }
    });
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
        if (TEMPNODE.style.display === 'none' ||
            TEMPNODE.style.visibility === 'hidden' ||
            // TEMPNODE.style.position === 'absolute' ||
            display === 'none' ||
            visibility === 'hidden'
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
            let tag = el?.tagName ? el.tagName : el.parentNode.tagName, siblings;
            path.unshift(((el.id)) ? `#${el.id }` : (siblings = parent.children,
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
            let tag = el?.tagName ? el.tagName : el.parentNode.tagName, siblings;
        path.unshift(((el.id)) ? `#${el.id }` : (siblings = parent.children,
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

// import getCssSelector from 'css-selector-generator';
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
    }
    init() {
        console.log(`开始读取dom`);
        console.log('1111', document);
        this.traversIframe(document);
        console.log({
            source: {
                windowWidth: window.innerWidth,
            },
            data: this.data,
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
    traversIframe(root) {
        const self = this;
        this.root = root;
        this.prevForms = [];
        this.nextForms = [];
        const header = root.getElementsByClassName('NewTableHead');
        const sxheader = root.getElementsByClassName('tabGrid_title');
        const jsheader = root.getElementsByClassName('dbt');
        const iframes = root.getElementsByTagName('iframe');
        const tables = root.getElementsByTagName('table');
        // const colgroup = root.getElementsByTagName('col')
        const cqheader = root.getElementsByClassName('swordform-panel-title');
        const ahheader = root.getElementsByClassName('sbt-table-options');
        const sdheader = root.getElementsByClassName('titles');
        // const allInputs = root.getElementsByTagName('input');
        // this.allInputs = Array.from(allInputs);
        // console.log(tables)
        //安徽税表中间表格标题
        if(ahheader) {
            Array.from(ahheader).forEach((value,i)=> {
                const childNode = value.getElementsByClassName('sbt-title-text')
                self.header = [];
                const headerdoms = Array.from(childNode)
                if(headerdoms[0].innerHTML === ' ') return
                const tdDoms = traversDom(headerdoms);
                // if (self.tables.length) {
                    self.data.push({
                        table:[tdDoms.doms],
                        colgroup: ''
                    });
                    self.contrastData.push({
                        contrast:[tdDoms.contrast],
                    });
                // }
            })
        }
        //遍历sd表格头部标题
        Array.from(sdheader).forEach(header => {
            self.header = [];
            self.traversHeader(header);
            if (self.tables.length) {
                // self.data.unshift(self.tables);
                self.data.push({
                    table:self.tables,
                    colgroup: ''
                });
            }
            if (self.contrastTables.length) {
                self.contrastData.push({
                    contrast:self.contrastTables,
                });
            }
        });
        //遍历sx表格头部标题
        Array.from(sxheader).forEach(header => {
            self.header = [];
            self.traversHeader(header);
            if (self.tables.length) {
                // self.data.unshift(self.tables);
                self.data.push({
                    table:self.tables,
                    colgroup: ''
                });
            }
            if (self.contrastTables.length) {
                self.contrastData.push({
                    contrast:self.contrastTables,
                });
            }
        });
        //遍历表格头部标题
        Array.from(header).forEach(header => {
            self.header = [];
            self.traversHeader(header);
            if (self.tables.length) {
                // self.data.unshift(self.tables);
                self.data.push({
                    table:self.tables,
                    colgroup: ''
                });
            }
            if (self.contrastTables.length) {
                self.contrastData.push({
                    contrast:self.contrastTables,
                });
            }
            // }
        });
        if(cqheader) {
            Array.from(cqheader).forEach(header => {
                console.log(header)
                if(header.id === 'xjllbxxForm_panelTitle') {
                    const headerDom = Array.from(header.childNodes)
                    self.header = [];
                    if(headerDom.length !== 0) {
                        const tdDoms = traversDom(headerDom);
                        self.tables.unshift(tdDoms.doms);
                        self.contrastTables.unshift(tdDoms.contrast)
                        if (self.tables.length) {
                            self.data.push({
                                table:self.tables,
                                colgroup: ''
                            });
                        }
                        if (self.contrastTables.length) {
                            self.contrastData.push({
                                contrast:self.contrastTables,
                            });
                        }
                    }
                }
                if(header.id === 'lrbxxForm_panelTitle') {
                    const headerDom = Array.from(header.childNodes)
                    self.header = [];
                    if(headerDom.length !== 0) {
                        const tdDoms = traversDom(headerDom);
                        self.tables.unshift(tdDoms.doms);
                        self.contrastTables.unshift(tdDoms.contrast)
                        if (self.tables.length) {
                            self.data.push({
                                table:self.tables,
                                colgroup: ''
                            });
                        }
                        if (self.contrastTables.length) {
                            self.contrastData.push({
                                contrast:self.contrastTables,
                            });
                        }
                    }
                }
            }); 
        }
        //遍历js表格头部标题
        if(jsheader) {
            Array.from(jsheader).forEach(header => {
                const headerDom = Array.from(header.childNodes)
                // console.log(headerDom)
                self.header = [];
                if(headerDom.length !== 0) {
                    const tdDoms = traversDom(headerDom);
                    self.tables.push(tdDoms.doms);
                    self.contrastTables.unshift(tdDoms.contrast)
                    if (self.tables.length) {
                        // self.data.unshift(self.tables);
                        self.data.push({
                            table:self.tables,
                            colgroup: ''
                        });
                    }
                    if (self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
            }); 
        }
        // Array.from(header).forEach(header => {
        //     self.header = [];
        //     const moreTables = header.getElementsByTagName('table');
        //     console.log(moreTables, header, moreTables.length === 0)
        //     if (moreTables.length === 0) {
        //         self.traversHeader(header);
        //         console.log(self.tables.length)
        //         if (self.tables.length) {
        //             console.log(self.tables)
        //             self.data.push(self.tables);
        //         }
        //     }
        // });
        // this.allInputs = Array.from(allInputs)
        //遍历Table 同时会判断Table外出现的Input, 判断父节点是不是none
        Array.from(tables).forEach(table => {
            // console.log(table)
            self.tables = [];
            self.contrastTables = [];
            //table内部col标签
            const colgroup = table.getElementsByTagName('col')
            if(table.parentNode.id === 'outLookBarDiv') return
            if(getComputedStyle(table, null).display === 'none') {
                return
            }
            if(getComputedStyle(table.parentNode, null).display === 'none') {
                return
            }
            if (getComputedStyle(table, null).display !== 'none' &&  table.parentNode.nodeName !== 'DIV' && table.parentNode.nodeName !=='TD') {
                const moreTables = table.getElementsByTagName('table');
                console.log(1, table)
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    console.log(self.tables.length)
                    if (self.tables.length) {
                        // console.log(colgroup)
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if (getComputedStyle(table.parentNode, null).display !== 'none' &&  table.parentNode.parentNode.nodeName !== 'DIV' &&  table.parentNode.parentNode.nodeName !== 'BODY') {
                if(table.parentNode.nodeName === 'TD') return
                const moreTables = table.getElementsByTagName('table');
                console.log(1, table,moreTables, getComputedStyle(table, null).height)
                if(moreTables.length > 0) {
                    for(let i = 0;i<moreTables.length; i++) {
                        if(moreTables[i].parentNode.nodeName === 'TD') {
                            self.traversTable(table);
                            if (self.tables.length) {
                                self.data.push({
                                    table: self.tables,
                                    colgroup: colgroup.length ? colgroup.length: '',
                                    top: table.getBoundingClientRect().top
                                });
                            }
                            if(self.contrastTables.length) {
                                self.contrastData.push({
                                    contrast:self.contrastTables,
                                });
                            }
                            break
                        }
                    }
                }               
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if(table.parentNode?.nodeName === 'DIV' && getComputedStyle(table.parentNode, null).display !== 'none' && table.parentNode.parentNode?.nodeName === 'BODY') {
                if(table.parentNode.nodeName === 'TD') return
                const moreTables = table.getElementsByTagName('table');
                console.log(1, table, moreTables, getComputedStyle(table, null).height, getComputedStyle(table, null).height === '831px', table.parentNode.id, table.getBoundingClientRect())
                if(moreTables.length > 0) {
                    for(let i = 0;i<moreTables.length; i++) {
                        if(moreTables[i].parentNode.nodeName !== 'TD') {
                            if( table.parentNode.id === 'container') return
                            self.traversTable(moreTables[i]);
                            if (self.tables.length) {
                                self.data.push({
                                    table: self.tables,
                                    colgroup: colgroup.length ? colgroup.length: '',
                                    top: table.getBoundingClientRect().top
                                });
                            }
                            if(self.contrastTables.length) {
                                self.contrastData.push({
                                    contrast:self.contrastTables,
                                });
                            }
                            break
                        } else {
                            self.traversTable(table);
                            if (self.tables.length) {
                                self.data.push({
                                    table: self.tables,
                                    colgroup: colgroup.length ? colgroup.length: '',
                                    top: table.getBoundingClientRect().top
                                });
                            }
                            if(self.contrastTables.length) {
                                self.contrastData.push({
                                    contrast:self.contrastTables,
                                });
                            }
                            break
                        }
                    }
                }               
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if(table.parentNode?.parentNode?.nodeName === 'DIV' && getComputedStyle(table.parentNode?.parentNode, null).display !== 'none' && table.parentNode.parentNode?.parentNode?.nodeName === 'BODY') {
                console.log(1, table)
                if(table.parentNode.nodeName === 'TD') return
                const moreTables = table.getElementsByTagName('table');
                if(moreTables.length > 0) {
                    for(let i = 0;i<moreTables.length; i++) {
                        if(moreTables[i].parentNode.nodeName === 'TD') {
                            self.traversTable(table);
                            if (self.tables.length) {
                                self.data.push({
                                    table: self.tables,
                                    colgroup: colgroup.length ? colgroup.length: '',
                                    top: table.getBoundingClientRect().top
                                });
                            }
                            if(self.contrastTables.length) {
                                self.contrastData.push({
                                    contrast:self.contrastTables,
                                });
                            }
                            break
                        }
                    }
                }
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if(table.parentNode.parentNode?.parentNode?.nodeName === 'DIV' && getComputedStyle(table.parentNode.parentNode?.parentNode, null).display !== 'none' && table.parentNode.parentNode?.parentNode?.parentNode?.nodeName === 'BODY') {
                console.log(1, table)
                const moreTables = table.getElementsByTagName('table');
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if(table.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'DIV' && getComputedStyle(table.parentNode.parentNode.parentNode?.parentNode, null).display !== 'none' && table.parentNode.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'BODY') {
                console.log(1, table)
                const moreTables = table.getElementsByTagName('table');
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if(table.parentNode.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'DIV' && getComputedStyle(table.parentNode.parentNode.parentNode.parentNode?.parentNode, null).display !== 'none' && table.parentNode.parentNode.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'BODY' && getComputedStyle(table.parentNode.parentNode?.parentNode, null).display !== 'none') {
                console.log(1, table)
                const moreTables = table.getElementsByTagName('table');
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if(table.parentNode.parentNode.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'DIV' && getComputedStyle(table.parentNode.parentNode.parentNode.parentNode.parentNode?.parentNode, null).display !== 'none' && table.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'BODY') {
                const moreTables = table.getElementsByTagName('table');
                console.log(1, table, moreTables)
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if(table.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'DIV' && getComputedStyle(table.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode?.parentNode, null).display !== 'none') {
                // if(table.parentNode.id === 'BDA0610607_div') return
                console.log(1, table, table.parentNode.id, table.parentNode.id === 'BDA0610607_div')
                const moreTables = table.getElementsByTagName('table');
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if(table.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'TD' && getComputedStyle(table.parentNode.parentNode.parentNode?.parentNode, null).display !== 'none' && table.parentNode.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'TR' && getComputedStyle(table.parentNode?.parentNode, null).display !== 'none') {
                console.log(1, table)
                const moreTables = table.getElementsByTagName('table');
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if(table.parentNode.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'MAIN' && getComputedStyle(table.parentNode.parentNode.parentNode.parentNode?.parentNode, null).display !== 'none') {
                console.log(1)
                const moreTables = table.getElementsByTagName('table');
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if(table.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'FORM' && getComputedStyle(table.parentNode.parentNode?.parentNode, null).display !== 'none') {
                console.log(1)
                const moreTables = table.getElementsByTagName('table');
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if(table.parentNode.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'BODY' && getComputedStyle(table.parentNode.parentNode.parentNode?.parentNode, null).display !== 'none' && getComputedStyle(table.parentNode.parentNode?.parentNode, null).display !== 'none') {
                console.log(1, table)
                const moreTables = table.getElementsByTagName('table');
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if(table.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'MAIN' && getComputedStyle(table.parentNode.parentNode.parentNode?.parentNode, null).display !== 'none') {
                console.log(1)
                const moreTables = table.getElementsByTagName('table');
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
            if(table.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'DIV' && getComputedStyle(table.parentNode.parentNode.parentNode?.parentNode, null).display !== 'none' && table.parentNode.parentNode.parentNode.parentNode?.parentNode?.nodeName === 'FORM') {
                console.log(1)
                const moreTables = table.getElementsByTagName('table');
                if (moreTables.length === 0) {
                    self.traversTable(table);
                    if (self.tables.length) {
                        self.data.push({
                            table: self.tables,
                            colgroup: colgroup.length ? colgroup.length: '',
                            top: table.getBoundingClientRect().top
                        });
                    }
                    if(self.contrastTables.length) {
                        self.contrastData.push({
                            contrast:self.contrastTables,
                        });
                    }
                }
                return
            }
        });
        // self.traversPrevAndNextForm()
        
        //遍历Iframe
        Array.from(iframes).forEach((thisIframe) => {
            if(getComputedStyle(thisIframe.parentNode, null).display === 'none' || (getComputedStyle(thisIframe.parentNode, null).top.split('px')[0]) < 0 || (getComputedStyle(thisIframe.parentNode, null).left.split('px')[0]) < 0) return
            console.log(thisIframe.contentDocument)
            if(thisIframe.contentDocument !== null) {
              const root = thisIframe.contentDocument.getElementsByTagName('body')[0];
                //@ts-ignore
                root && self.traversIframe(root);  
            }           
        });
        //宁夏附表5处理
        const NXbigContent = document.getElementsByClassName('sGrid_div');
        Array.from(NXbigContent).forEach((bigcontent)=> {
            if(getComputedStyle(bigcontent.parentNode, null).display !== 'none') {
                const nxHDcontent = bigcontent.getElementsByClassName('sGrid_header_div');
                Array.from(nxHDcontent).forEach((content)=> {
                    if( getComputedStyle(content, null).display !== 'none' && getComputedStyle(content.parentNode, null).display !== 'none' && content.childNodes.length !== 0 && getComputedStyle(content.parentNode.parentNode?.parentNode.parentNode, null).display !== 'none' && content.nodeName !=='TABLE') {
                        if( content, getComputedStyle(content, null).height.split('px')[0] < 5) return
                        this.parseDiv(content)
                    } 
                })
                const nxcontent = bigcontent.getElementsByClassName('sGrid_data_row_div');
                Array.from(nxcontent).forEach(content=> {
                    if( getComputedStyle(content, null).display !== 'none' && getComputedStyle(content.parentNode.parentNode, null).display !== 'none' && content.childNodes.length !== 0 && getComputedStyle(content.parentNode.parentNode?.parentNode.parentNode, null).display !== 'none') {
                        this.parseDiv(content)
                    } 
                })
                const nxTYcontent = bigcontent.getElementsByClassName('sGrid_hj_row_div');
                Array.from(nxTYcontent).forEach(content=> {
                    if( getComputedStyle(content, null).display !== 'none' && getComputedStyle(content.parentNode.parentNode, null).display !== 'none' && content.childNodes.length !== 0 && getComputedStyle(content.parentNode.parentNode?.parentNode.parentNode, null).display !== 'none') {
                        this.parseDiv(content)
                    }   
                })
            }
        })
        
    }
    //处理div格式位置
    parseDiv(content) {
        const self = this
        const contentTop = content.getBoundingClientRect().top
        const allPosition = self.data.every((cnt,idx)=> {
            return contentTop > cnt.top
        })
        if(allPosition) {
            const contentDoms = traversDom(content.childNodes)
            self.data[self.data.length-1].table.push(contentDoms.doms)
            self.contrastData[self.contrastData.length-1].contrast.push(contentDoms.contrast)
        } else {
            self.data.forEach((cnt,idx)=> {
                if(idx > 0) {
                    if(cnt.top > contentTop) {
                        const contentDoms = traversDom(content.childNodes)
                        self.data[idx-1].table.push(contentDoms.doms)
                        self.contrastData[idx-1].contrast.push(contentDoms.contrast)
                    }
                } else {
                    if(cnt.top > contentTop) {
                        const contentDoms = traversDom(content.childNodes)
                        self.data[0].table.push(contentDoms.doms)
                        self.contrastData[0].contrast.push(contentDoms.contrast)
                    }
                }
            })
        }
    }

    traversHeader(NODE) {
        const self = this;
        //获取iframe下所有的input数量
        // const allInputs = self.allInputs;
        //获取表格里面的h1数量
        const tableHead = Array.from(NODE.getElementsByTagName('h1'));
        const tableHeadContent = Array.from(NODE.getElementsByTagName('li'));
        if (tableHead.length) {
            const tdDoms = traversDom(tableHead);
            self.tables.push(tdDoms.doms);
            self.contrastTables.push(tdDoms.contrast)
        }
        Array.from(tableHeadContent).forEach(header => {
            // console.log(header)
            if (header.getElementsByTagName('input').length === 0) {
                const tdDoms = traversDom(tableHeadContent);
                self.tables.push(tdDom.doms);
                self.contrastTables.push(tdDoms.contrast)
            }
            else {
                const TDDOMS = Array.from(header.getElementsByTagName('input'));
                // console.log(TDDOMS)
                const tdDoms = self.checkExtraForms(TDDOMS);
                // console.log(tdDoms)
                //@ts-ignore
                self.tables.push(...tdDoms);
            }
        });
    }
    traversTable(NODE) {
        // console.log('222222', NODE)
        const self = this;
        //获取iframe下所有的input数量
        // const allInputs = self.allInputs;
        // console.log(allInputs)
        //获取表格里面的input数量
        // const tableInputs = Array.from(NODE.getElementsByTagName('input'));
        // if(!tableInputs.length) {
        //     const TRDOMS = Array.from(NODE.getElementsByTagName('tr'));
        //     TRDOMS.forEach((trDom, index) => {
        //         if (checkNode(trDom, false)) {
        //             const TDDOMS = Array.from(trDom.getElementsByTagName('td'));
        //             //@ts-ignore
        //             const tdDoms = traversDom(TDDOMS);
        //             //@ts-ignore
        //             self.tables.push(tdDoms);
        //         }
        //     });
        // }
        // if (tableInputs.length) {
        // const filterTableInputIndex = allInputs.indexOf(tableInputs[0]);
        // self.prevForms = allInputs.slice(0, filterTableInputIndex);
        // self.nextForms = allInputs.slice(filterTableInputIndex, tableInputs.length - 1);
        // self.allInputs.splice(filterTableInputIndex, tableInputs.length - 1);
        const TRDOMS = Array.from(NODE.getElementsByTagName('tr'));
        TRDOMS.forEach((trDom, index) => {
            // console.log(trDom, getComputedStyle(trDom, null).display)
            if(getComputedStyle(trDom, null).display === 'none' || getComputedStyle(trDom.parentNode, null).display === 'none' || getComputedStyle(trDom.parentNode.parentNode.parentNode.parentNode, null).display === 'none') return
            if (checkNode(trDom, false)) {
                const TDDOMS = Array.from(trDom.getElementsByTagName('td'));
                //@ts-ignore
                const THDOM = Array.from(trDom.getElementsByTagName('th'));
                if (Array.from(trDom.childNodes).length === 0) {
                    const trDoms = traversDom(Array.from(trDom.childNodes));
                    self.tables.push(trDoms.doms);
                    self.contrastTables.push(trDoms.contrast)
                }
                if (THDOM.length !== 0 || TDDOMS.length !== 0) {
                    for(let i=0;i<trDom.childNodes.length;i++) {
                        if(trDom.childNodes[i].parentNode.parentNode.parentNode.parentNode.nodeName === 'TD') {
                            return
                        } else {
                            const thDom = traversDom(trDom.childNodes);
                            // console.log(trDom.childNodes, thDom)
                            self.tables.push(thDom.doms);
                            self.contrastTables.push(thDom.contrast)
                        }
                        break
                    }                    
                    
                }
                if( Array.from(trDom.childNodes).length === 1) {
                    Array.from(trDom.childNodes).forEach((v)=> {
                        if(v.nodeName !== 'TH' && v.nodeName !== 'TD') {
                           const trDoms = traversDom(Array.from(trDom.childNodes));
                            self.tables.push(trDoms.doms);
                            self.contrastTables.push(trDoms.contrast)
                        }
                    })
                }
            }
        });
        // }
    }
    
    checkExtraForms = (INPUTS) => {
        let thisNodes = [];
        const inputDoms = Array.from(INPUTS);
        const skipInput = [];
        const deepCheck = (NODES) => {
            NODES.forEach((input, index) => {
                if(input.parentNode.nodeName === 'SPAN') {
                    const parentInput = Array.from(input.parentNode.parentNode.childNodes);
                    if (skipInput.length === parentInput.length);
                    else {
                        if (skipInput.includes(input)) ;
                        else {
                            if(inputDoms.slice(index + 1, inputDoms.length).length>0) {
                                inputDoms.slice(index + 1, inputDoms.length).forEach(nextInput => {     
                                    if (parentInput.includes(nextInput)) {
                                        skipInput.push(nextInput);
                                    }
                                });
                                const tdDoms = traversDom(parentInput);
                                thisNodes.push(tdDoms);
                            }
                        }
                    }
                } else {
                    const parentInput = Array.from(input.parentNode.childNodes);
                    if (skipInput.length === parentInput.length);
                    else {
                        if (skipInput.includes(input)) ;
                        else {
                            inputDoms.slice(index + 1, inputDoms.length).forEach(nextInput => {
                                if (parentInput.includes(nextInput)) {
                                    skipInput.push(nextInput);
                                }
                            });
                            // console.log(parentInput)
                            const tdDoms = traversDom(parentInput);
                            thisNodes.push(tdDoms);
                        }
                    } 
                }
                
            });
        };
        deepCheck(inputDoms);
        return thisNodes;
    };
}

new ForDom().init();
