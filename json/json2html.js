var json = [
    {
        "tag":"h3",
        "id":"table-head",
        "class":"table-head",
        "html":"Top 3 Coders in India"
    },
    {
        "tag":"table",
        "id":"sample-table",
        "class":"table-class",
        "border":"1",
        "_child":[
            {
                "tag":"tr",
                "_child":[
                    {
                        "tag":"th",
                        "html":"Rank"
                    },
                    {
                        "tag":"th",
                        "html":"Full Name"
                    },
                    {
                        "tag":"th",
                        "html":"City"
                    }
                ]
            },
            {
                "tag":"tr",
                "_child":[
                    {
                        "tag":"td",
                        "html":"1"
                    },
                    {
                        "tag":"td",
                        "html":"Vinod Selvin"
                    },
                    {
                        "tag":"td",
                        "html":"Mumbai"
                    }
                ]
            },
            {
                "tag":"tr",
                "_child":[
                    {
                        "tag":"td",
                        "html":"2"
                    },
                    {
                        "tag":"td",
                        "html":"Manoj Selvin"
                    },
                    {
                        "tag":"td",
                        "html":"Bangalore"
                    }
                ]
            },
            {
                "tag":"tr",
                "_child":[
                    {
                        "tag":"td",
                        "html":"3"
                    },
                    {
                        "tag":"td",
                        "html":"Binson Selvin"
                    },
                    {
                        "tag":"td",
                        "html":"Tirunelveli"
                    }
                ]
            },
        ]
    }
];

/**
 * json2dom
 * @param json
 * @param parent
 * @returns dom
 */
function parseDom(json, parent) {
    // 遍历传入的json数组
    for (var attr in json) {
        var tagName = json[attr].tag;
        var rootDom = document.createElement(tagName);
        delete json[attr].tag;
        var rootElement = json[attr];
        // 遍历根对象的属性
        for (var rootAttr in rootElement) {
            if (rootAttr === 'html') {
                var text = document.createTextNode(rootElement[rootAttr]);
                rootDom.appendChild(text);
            } else if (rootAttr === '_child') {
                parseDom(rootElement[rootAttr], rootDom);
            } else {
                rootDom.setAttribute(rootAttr, rootElement[rootAttr]);
            }
        }
        parent.appendChild(rootDom);
    }

    // 返回结果
    return parent;
}

var dom = parseDom(json, document.createElement('div'));
document.write(dom.outerHTML);