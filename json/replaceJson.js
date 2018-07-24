var json = {
    "t": "div",
    "style": [],
    "blockNum": 1,
    "c": [
        {
            "t": "p",
            "r": [],
            "c": [
                {
                    "t": "obj",
                    "datatype": "page",
                    "r": [
                        "ext_display_fullscreen"
                    ],
                    "data": [
                        {
                            "t": "p",
                            "style": {
                                "indent": "0em",
                                "text-align": "center"
                            },
                            "r": [],
                            "c": [
                                {
                                    "t": "obj",
                                    "datatype": "textbox",
                                    "style": {
                                        "y": "137",
                                        "w": "114",
                                        "text-align": "center",
                                        "padding-left": "13",
                                        "padding-right": "13",
                                        "padding-top": "10",
                                        "padding-bottom": "20",
                                        "background-image": "bg1.png",
                                        "display": "anchor"
                                    },
                                    "r": [],
                                    "data": [
                                        {
                                            "t": "p",
                                            "style": {
                                                "indent": "0em",
                                                "font-size": "44",
                                                "text-color": "#2A2A2A",
                                                "line-height": "100%"
                                            },
                                            "r": [],
                                            "c": "木心诗选",
                                            "frontflag": "title"
                                        }
                                    ]
                                },
                                {
                                    "t": "obj",
                                    "datatype": "textbox",
                                    "style": {
                                        "y": "285",
                                        "w": "114",
                                        "text-align": "center",
                                        "display": "anchor"
                                    },
                                    "r": [],
                                    "data": [
                                        {
                                            "t": "p",
                                            "style": {
                                                "indent": "0em",
                                                "font-size": "12",
                                                "text-align": "right",
                                                "line-height": "100%"
                                            },
                                            "r": [],
                                            "c": [
                                                {
                                                    "t": "span",
                                                    "c": "木心",
                                                    "frontflag": "author"
                                                },
                                                {
                                                    "t": "img",
                                                    "w": "10",
                                                    "h": "10",
                                                    "src": "label.png"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "t": "obj",
                                    "datatype": "textbox",
                                    "style": {
                                        "y": "90%",
                                        "w": "100%",
                                        "text-align": "center",
                                        "display": "anchor"
                                    },
                                    "r": [],
                                    "data": [
                                        {
                                            "t": "p",
                                            "style": {
                                                "indent": "0em",
                                                "font-size": "13",
                                                "text-align": "center"
                                            },
                                            "r": [],
                                            "c": [
                                                {
                                                    "t": "span",
                                                    "style": {
                                                        "text-color": "#7F7F7F"
                                                    },
                                                    "r": [],
                                                    "c": "北京联合出版社",
                                                    "frontflag": "publisher"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};

var bookinfo = {
    title: '替换的书名',
    author: '替换的作者',
    publisher: '替换的出版社'
};
function replaceContent ( json , bookinfo) {

    if (typeof json.c == 'string' && json.frontflag) {
        json.c = bookinfo[json.frontflag];
        return;
    }

    if (json.c && json.c.length > 0) {
        for (var i = 0; i< json.c.length; i++) {
            replaceContent(json.c[i], bookinfo);
        }
    }
    if (json.data && json.data[0]) {
        replaceContent(json.data[0], bookinfo);
    }
}

replaceContent(json, bookinfo);

console.log(JSON.stringify(json));