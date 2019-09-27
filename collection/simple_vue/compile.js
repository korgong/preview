function compileText(vm, node) {
    let reg = /\{\{(.*)\}\}/;
    if (reg.test(node.nodeValue)) {
        let vName = RegExp.$1;
        vName = vName.trim();
        new Watcher(vm, vName, node, 'text');
    }
}

function compileAttributes(vm, node) {
    [].slice.call(node.attributes).forEach(attr => {
        // acquire name of vue data in v-model
        let name = attr.nodeName;
        let vName;
        if (name === 'v-for') {
            let expression = attr.nodeValue;
            let itemName = expression.split('in')[0].replace(/\s/g, '');
            let arrayName = expression.split('in')[1].replace(/\s/g, '').split('.');
            let parentNode = node.parentNode;
            let startNode = document.createTextNode('');
            let endNode = document.createTextNode('');

            // 替换原始node
            // node.replaceChild(newnode,oldnode)
            parentNode.replaceChild(endNode, node);
            // node.insertBefore(newnode,existingnode)
            parentNode.insertBefore(startNode, endNode);

            let value = vm;
            //得到数组的值 可能是data.items.content = [1,2,3]
            arrayName.forEach(function (curVal) {
                value = value[curVal];
            });
            // delete the v-for command
            node.removeAttribute(name);
            // 有多少数组就创造多少节点
            value.forEach(function (item, index) {
                let cloneNode = node.cloneNode(true);
                parentNode.insertBefore(cloneNode, endNode);
                //forvm原型继承vm，并且增加两个属性
                let forVm = Object.create(vm);
                // 增加$index下标
                forVm.$index = index;
                // 绑定item作用域
                forVm[itemName] = item;
                // notice that: recursively compile Attribute
                compileAttributes(forVm, cloneNode);
            });
        }
        if (name === 'v-model') {
            vName = attr.nodeValue;
            let vNameArr = vName.split('.');
            node.addEventListener('input', function (e) {
                let value = vm;
                vNameArr.forEach((vName, index) => {
                    if (index !== vNameArr.length-1) {
                        value = value[vName];
                    } else {
                        value[vName] = e.target.value;
                    }
                });
            });
            node.removeAttribute(name);
            new Watcher(vm, vName, node, 'input');
        }
        if (name === 'v-click') {
            let code = attr.nodeValue;
            node.addEventListener('click', function () {
                eval(code);
            });
            node.removeAttribute(name);
        }
    });
    if (node.childNodes && node.childNodes.length) {
        compile(vm, node);
    }
}

function isTextNode(node) {
    return node.nodeType === 3;
}

/**
 * compile template
 * **/
function compile(vm, node) {
    let childNodes = node.childNodes;
    [].slice.call(childNodes).forEach(child => {
        if (isTextNode(child)) {
            compileText(vm, child);
        } else {
            compileAttributes(vm, child);
        }
    });
}
