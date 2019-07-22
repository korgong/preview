// VNode html2json

// String of html to node
// node2json
// json2node
// canRender and record the last width and height. And upgrade it
// upgrade to record the id of the last node then clearPrev


function Render (opts) {
    this.VNode = this.getJsonByString(opts.htmlString);
}

Render.prototype = {
    /**
     *
     * @param size
     * @returns {*}
     * json2node 得到指定宽高的node字符串数据
     */
    render: function (size) {
        if (!this.VNode) {
            return '';
        }

        let renderStage = document.createElement('div');

        renderStage.id = 'render-stage';
        renderStage.innerHTML = '<div class="box-inner"></div>';
        Utils.css(renderStage, {
            width: size.width + 'px',
            height: size.height + 'px',
            position: 'absolute',
            overflow: 'hidden',
            left: -1000 + 'px',
            top: '-1000px'
        });
        document.body.appendChild(renderStage);
        this.box = renderStage;
        this.content = Utils.GetByClass(renderStage, 'box-inner')[0];
        this.overflowVNode = JSON.parse(JSON.stringify(this.VNode));
        this.size = size;
        this.params = {
            stop: false
        };
        this.json2node(this.content, this.VNode.children, this.params);
        if (!this.params.stop) {
            this.overflowVNode = null;
        }
        let renderedHtml = this.content.innerHTML;
        // this.box.parentNode.removeChild(this.box);
        this.VNode = this.overflowVNode;
        return renderedHtml;
    },
    end: function (virtualDom) {
        if (virtualDom.nodeType === 3) {
            let VNode = this.findVNode(virtualDom.id, this.overflowVNode);
            VNode.nodeValue = virtualDom.nodeValue;
        }
        this.clearPrev(virtualDom, this.overflowVNode);
    },
    /**
     * revert htmlString to node. the node2json
     * @param htmlString
     * @returns {{children: Array, id: string}}
     */
    getJsonByString: function (htmlString) {
        let virtualDom = {
            id: 'root',
            children: []
        };

        let fragment = document.createElement('div');
        fragment.id = 'fragment';
        Utils.css({
            'display': 'none'
        });
        fragment.innerHTML = htmlString;
        document.body.appendChild(fragment);
        // node2json and update virtualDom
        this.getJson(virtualDom.children, fragment, 'root');
        fragment.parentNode.removeChild(fragment);
        return virtualDom;
    },
    getJson: function (virtualDom, parentNode, virtualDomId) {
        let me = this;
        let childNodes = parentNode.childNodes;
        if (!childNodes.length) return;

        [].slice.call(childNodes).forEach(function (child) {
            let node = {
                id: 'VNode_' + Math.random().toString(36).substr(2),
                tagName: '',
                attrs: {},
                nodeType: '',
                nodeValue: '',
                children: [],
                parentVnodeId: virtualDomId || 'root'
            };
            let attributes = child.attributes;

            // update the attributes in node
            if (Utils.isElementNode(child)) {
                node.nodeType = 1;
                node.tagName = child.tagName.toLocaleLowerCase();
            } else if (Utils.isTextNode(child)) {
                node.nodeType = 3;
                node.nodeValue = child.nodeValue.split('');
            } else {
                return;
            }

            if (attributes) {
                for (let i = 0; i < attributes.length; i++) {
                    let attr = attributes[i].nodeName;
                    let val = attributes[i].nodeValue;

                    node.attrs[attr] = val;
                }
            }

            virtualDom.push(node);
            // if the child is an element, continue this operation
            if (Utils.isElementNode(child)) {
                me.getJson(node.children, child, node.id);
            }
        });
    },
    /**
     * clear the previous nodes under the parent node
     * @param child
     * @param root
     */
    clearPrev: function (child, root) {
        // vNode: renderObj.virtualDom,
        // overflow: true
        let parentNode = this.findVNode(child.parentVnodeId, root);
        if (!parentNode) return;
        let childId = child.id;
        let children = parentNode.children;

        for (let i = 0; i < children.length; i++) {
            if (children[i].id != childId) {
                children.splice(i, 1);
                i--;
            } else {
                break;
            }
        }

        this.clearPrev(parentNode, root);
    },
    findVNode: function (nodeId, node) {
        if (nodeId == node.id) {
            return node;
        }
        for (let i = 0; i < node.children.length; i++) {
            let result = this.findVNode(nodeId, node.children[i]);

            if (result) {
                return result;
            }
        }

        return null;
    },
    /**
     *
     * @param parent 父节点
     * @param virtualDom  要渲染的json数据(array)
     * @param params  是否暂停
     * 将数组转为dom
     */
    json2node: function (parent, virtualDom, params) {

        if (!virtualDom.length || params.stop) {
            return;
        }

        let currentVirtualDom = virtualDom.shift();

        if (currentVirtualDom.nodeType === 1) {
            let node = document.createElement(currentVirtualDom.tagName);

            for (let attr in currentVirtualDom.attrs) {
                node.setAttribute(attr, currentVirtualDom.attrs[attr]);
            }

            let pass = this.canRender({
                type: 'tag',
                value: node,
                parent: parent,
                virtualDom: currentVirtualDom
            });
            if (!pass) {
                return;
            }

            if (currentVirtualDom.children.length) {
                this.json2node(node, currentVirtualDom.children, params);
            }
        } else {
            this.renderText(parent, currentVirtualDom, params);
        }

        this.json2node(parent, virtualDom, params);
    },
    canRender: function ({type, value, parent, virtualDom}) {
        let me = this;

        // todo what does it work？
        if (me.params.stop) {
            return true;
        }

        if (type === 'tag' || type === 'text') {
            parent.appendChild(value);

            let contentHeight = parseFloat(Utils.getStyle(me.content, 'height'));
            let overflow = contentHeight > me.size.height;

            if (overflow) {
                me.params.stop = true;
                this.end(virtualDom);
                parent.removeChild(value);
            }
            return !overflow;
        } else {
            return false;
        }
    },
    renderText: function (parent, currentVirtualDom, params) {
        if (!currentVirtualDom.nodeValue.length || params.stop) {
            return;
        }
        let willRenderTxt = currentVirtualDom.nodeValue[0];
        let willRenderNode = document.createTextNode(willRenderTxt);
        let pass = this.canRender({
            type: 'text',
            value: willRenderNode,
            parent: parent,
            virtualDom: currentVirtualDom
        });
        if (!pass) {
            return;
        }

        // 将插入成功的文字从virtualDom上取出
        currentVirtualDom.nodeValue.shift();
        this.renderText(parent, currentVirtualDom, params);
    }
};

let Utils = {
    isElementNode: function(node) {
        return node.nodeType === 1;
    },
    isTextNode: function(node) {
        return node.nodeType === 3;
    },
    css: function(obj, name) {
        for(let i in name){
            if(i=='opacity')
            {
                obj.style.filter='alpha(opacity:'+name[i]+')';
                obj.style.opacity=name[i]/100;
            }
            else
            {
                obj.style[i]=name[i];
            }
        }
    },
    GetByClass: function(obj, sName){
        if(obj.getElementsByClassName){
            return obj.getElementsByClassName(sName);
        }else{
            let arr = [ ];
            let re = new RegExp('(^|\\s)'+sName+'(\\s|$)');
            let aEle = obj.getElementsByTagName('*');

            for(let i=0; i<aEle.length; i++){
                if(re.test(aEle[i].className)){
                    arr.push(aEle[i]);
                }
            }

            return arr;
        }
    },
    getStyle: function (obj, name) {
        if(obj.currentStyle)
		{
			return obj.currentStyle[name];
		}
		else
		{
			return getComputedStyle(obj, false)[name];
		}
    }
};


window.Render = Render;
