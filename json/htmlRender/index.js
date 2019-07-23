// VNode html2json

// String of html to node
// node2json
// json2node
// canRender and record the last width and height. And upgrade it
// upgrade to record the id of the last node then clearPrev


function Render (opts) {
    this.json = this.getJsonByString(opts.htmlString);
}

Render.prototype = {
    /**
     *json2node render json with specified with and height
     * @param size
     * @returns {*}
     */
    render: function (size) {
        if (!this.json) {
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
        this.jsonDuplicate = JSON.parse(JSON.stringify(this.json));
        this.size = size;
        this.params = {
            stop: false
        };
        this.json2node(this.content, this.json.children, this.params);
        if (!this.params.stop) {
            this.jsonDuplicate = null;
        }
        let renderedHtml = this.content.innerHTML;
        this.json = this.jsonDuplicate;
        return renderedHtml;
    },
    /**
     * complete render
     * remove previous nodes under root node. if the current node is text, update the node when completing render.
     * @param currentJson
     */
    end: function (currentJson) {
        if (currentJson.nodeType === 3) {
            let certainJson = this.findCertainJson(currentJson.id, this.jsonDuplicate);
            certainJson.nodeValue = currentJson.nodeValue;
        }
        this.clearPrev(currentJson, this.jsonDuplicate);
    },
    /**
     * revert htmlString to node. then node2json
     * @param htmlString
     * @returns {{children: Array, id: string}}
     */
    getJsonByString: function (htmlString) {
        let json = {
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
        // node2json and update json
        this.getJson(json.children, fragment, 'root');
        fragment.parentNode.removeChild(fragment);
        return json;
    },
    /**
     * update json from parentNode
     * @param jsonChildren
     * @param parentNode
     * @param jsonId
     */
    getJson: function (jsonChildren, parentNode, jsonId) {
        let me = this;
        let childNodes = parentNode.childNodes;
        if (!childNodes.length) return;

        [].slice.call(childNodes).forEach(function (child) {
            let json = {
                id: 'VNode_' + Math.random().toString(36).substr(2),
                tagName: '',
                attrs: {},
                nodeType: '',
                nodeValue: '',
                children: [],
                parentVnodeId: jsonId || 'root'
            };
            let attributes = child.attributes;

            // update the attributes in json
            if (Utils.isElementNode(child)) {
                json.nodeType = 1;
                json.tagName = child.tagName.toLocaleLowerCase();
            } else if (Utils.isTextNode(child)) {
                json.nodeType = 3;
                json.nodeValue = child.nodeValue.split('');
            } else {
                return;
            }

            if (attributes) {
                for (let i = 0; i < attributes.length; i++) {
                    let attr = attributes[i].nodeName;
                    // todo here
                    let val = attributes[i].nodeValue;

                    json.attrs[attr] = val;
                }
            }

            jsonChildren.push(json);
            // if the child is an element, continue this operation
            if (Utils.isElementNode(child)) {
                me.getJson(json.children, child, json.id);
            }
        });
    },
    /**
     * clear the previous nodes under the parent node
     * @param child
     * @param root
     */
    clearPrev: function (child, root) {
        let parentNode = this.findCertainJson(child.parentVnodeId, root);
        if (!parentNode) return;
        let childId = child.id;
        let children = parentNode.children;

        for (let i = 0; i < children.length; i++) {
            if (children[i].id !== childId) {
                children.splice(i, 1);
                i--;
            } else {
                break;
            }
        }

        this.clearPrev(parentNode, root);
    },
    /**
     * find certain json by nodeId
     * @param nodeId
     * @param node
     * @returns {*}
     */
    findCertainJson: function (nodeId, node) {
        if (nodeId === node.id) {
            return node;
        }
        for (let i = 0; i < node.children.length; i++) {
            let result = this.findCertainJson(nodeId, node.children[i]);

            if (result) {
                return result;
            }
        }
        return null;
    },
    /**
     * revert json to node
     * @param parentNode 父节点
     * @param jsonChildren  要渲染的json数据(array)
     * @param params  是否暂停
     * 将数组转为dom
     */
    json2node: function (parentNode, jsonChildren, params) {

        if (!jsonChildren.length || params.stop) {
            return;
        }

        let currentJson = jsonChildren.shift();

        if (currentJson.nodeType === 1) {
            let node = document.createElement(currentJson.tagName);

            for (let attr in currentJson.attrs) {
                node.setAttribute(attr, currentJson.attrs[attr]);
            }

            let pass = this.canRender({
                type: 'tag',
                value: node,
                parentNode: parentNode,
                currentJson: currentJson
            });
            if (!pass) {
                return;
            }

            if (currentJson.children.length) {
                this.json2node(node, currentJson.children, params);
            }
        } else {
            this.renderText(parentNode, currentJson, params);
        }

        this.json2node(parentNode, jsonChildren, params);
    },
    /**
     * does value can be rendered into parentNode
     * @param type
     * @param value
     * @param parentNode
     * @param currentJson
     * @returns {boolean}
     */
    canRender: function ({type, value, parentNode, currentJson}) {
        let me = this;
        if (type === 'tag' || type === 'text') {
            parentNode.appendChild(value);

            let contentHeight = parseFloat(Utils.getStyle(me.content, 'height'));
            let overflow = contentHeight > me.size.height;

            if (overflow) {
                me.params.stop = true;
                this.end(currentJson);
                parentNode.removeChild(value);
            }
            return !overflow;
        } else {
            return false;
        }
    },
    /**
     * render json of text type
     * @param parentNode
     * @param currentJson
     * @param params
     */
    renderText: function (parentNode, currentJson, params) {
        if (!currentJson.nodeValue.length || params.stop) {
            return;
        }
        let willRenderTxt = currentJson.nodeValue[0];
        let willRenderNode = document.createTextNode(willRenderTxt);
        let pass = this.canRender({
            type: 'text',
            value: willRenderNode,
            parentNode: parentNode,
            currentJson: currentJson
        });
        if (!pass) {
            return;
        }

        // 将插入成功的文字从currentJson上取出
        currentJson.nodeValue.shift();
        this.renderText(parentNode, currentJson, params);
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
            if(i==='opacity')
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
