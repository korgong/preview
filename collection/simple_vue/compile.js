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
    });
    if (node.childNodes && node.childNodes.length) {
        compile(vm, node);
    }
}

function isTextNode(node) {
    return node.nodeType === 3;
}


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
