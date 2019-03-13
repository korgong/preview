function Render (opts) {
    // virtualDom
    // var virtualDom = {
    //     id: 'root',
    //     children: []
    // };
    this.VNode = _proto.createVirtualDom(opts.htmlString);
    // this.overflowVNode = null;
}

var _proto = {
    render: function (size) {
        if (!this.VNode) {
            return '';
        }

        var stageName = 'renderStage_' + Math.random().toString(36).substr(2);
        $('.render-stage').remove();
        $('body').append('<div id="'+ stageName +'" class="render-stage"><div class="box-inner"></div></div>');
        this.box = $('#'+stageName).css({
            width: size.width + 'px',
            height: size.height + 'px',
            position: 'absolute',
            overflow: 'hidden',
            left: -10000 + 'px',
            top: 0,
            'z-index': 10,
            'box-shadow': '0 0 15px 0 rgba(0, 0, 0, .2)',
            'background': '#fff'
        });
        this.content = this.box.find('.box-inner');
        this.overflowVNode = JSON.parse(JSON.stringify(this.VNode));
        this.params = {
            stop: false
        };
        this.virtualDomRender(this.content.get(0), this.VNode.children, this.params);
        if (!this.params.stop) {
            this.overflowVNode = null;
        }
        var rendedHtml = this.content.html();
        this.box.remove();
        this.VNode = this.overflowVNode;

        return rendedHtml;
    },
    createVirtualDom: function (htmlString) {
        var virtualDom = {
            id: 'root',
            children: []
        };

        $('#fragment').remove();
        $('body').append('<div id="fragment" style="display: none;">'+ htmlString +'</div>');

        this.create(virtualDom.children, $('#fragment').get(0), 'root');
        $('#fragment').remove();
        return virtualDom;
    },
    create: function (virtualDom, parentNode, virtualDomId) {
        var me = this;
        var childNodes = parentNode.childNodes;
        if (!childNodes.length) return;

        [].slice.call(childNodes).forEach(function (child) {
            var node = {
                id: 'vNode_' + Math.random().toString(36).substr(2),
                tagName: '',
                attrs: {},
                nodeType: '',
                nodeValue: '',
                nodeValueRended: [],
                children: [],
                rended: false,
                parentVnodeId: virtualDomId || 'root'
            };
            var attributes = child.attributes;

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
                for (var i = 0; i < attributes.length; i++) {
                    var attr = attributes[i].nodeName;
                    var val = attributes[i].nodeValue;

                    node.attrs[attr] = val;
                }
            }

            if (Utils.isElementNode(child)) {
                me.create(node.children, child, node.id);
            }

            virtualDom.push(node);
        });
    },
    clearPrev: function (child, root) {
        var parentNode = this.findVNode(child.parentVnodeId, root);
        if (!parentNode) return;
        var childId = child.id;
        var children = parentNode.children;

        for (var i = 0; i < children.length; i++) {
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
        for (var i = 0; i < node.children.length; i++) {
            var result = this.findVNode(nodeId, node.children[i]);

            if (result) {
                return result;
            }
        }

        return null;
    },
    virtualDomRender: function (parent, virtualDom, params) {
        if (!virtualDom.length || params.stop) {
            return;
        };

        var currentVirtualDom = virtualDom.shift();

        if (currentVirtualDom.nodeType === 1) {
            var node = document.createElement(currentVirtualDom.tagName);

            for (var attr in currentVirtualDom.attrs) {
                node.setAttribute(attr, currentVirtualDom.attrs[attr]);
            }

            var pass = this.canRender({
                type: 'tag',
                value: node,
                parent: parent,
                virtualDom: currentVirtualDom
            });
            if (!pass) {
                return;
            };

            if (currentVirtualDom.children.length) {
                this.virtualDomRender(node, currentVirtualDom.children, params);
            }
        } else {
            this.renderText(parent, currentVirtualDom, params);
        }

        this.virtualDomRender(parent, virtualDom, params);
    },
    canRender: function (renderObj) {
        var me = this;

        if (me.params.stop) {
            return true;
        }

        if (renderObj.type === 'tag' || renderObj.type === 'text') {
            renderObj.parent.appendChild(renderObj.value);
            var overflow = me.content.height() > me.box.height();

            if (overflow) {
                me.params.stop = true;
                this.end({
                    vNode: renderObj.virtualDom,
                    overflow: true
                });
                renderObj.parent.removeChild(renderObj.value);
            }
            return overflow? false: true;
        } else {
            return false;
        }
    },
    end: function (params) {
        // 回手掏，从此vnode向上找，把之前的分叉树全干掉
        if (params.vNode.nodeType == 3) {
            var VNode = this.findVNode(params.vNode.id, this.overflowVNode);

            VNode.nodeValue = params.vNode.nodeValue;
        }
        this.clearPrev(params.vNode, this.overflowVNode);
    },
    renderText: function (parent, currentVirtualDom, params) {
        if (!currentVirtualDom.nodeValue.length || params.stop) {
            return;
        };
        var willRenderTxt = currentVirtualDom.nodeValue[0];
        var willRenderNode = document.createTextNode(willRenderTxt);
        var pass = this.canRender({
            type: 'text',
            value: willRenderNode,
            parent: parent,
            virtualDom: currentVirtualDom,
            rendedText: currentVirtualDom.nodeValueRended
        });
        if (!pass) {
            return;
        };

        currentVirtualDom.nodeValueRended.push(currentVirtualDom.nodeValue.shift());
        this.renderText(parent, currentVirtualDom, params);
    }
}

Render.prototype = _proto;

var Utils = {
    isElementNode: function(node) {
        return node.nodeType === 1;
    },
    isTextNode: function(node) {
        return node.nodeType === 3;
    }
};

window.Render = Render;
