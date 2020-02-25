let menus = [{
    "icon": "dashboard",
    "title": "Dashboard",
    "src": "/dashboard",
    "key": "dashboard",
    "subMenu": [],
    "url": "/dashboard",
    "parentId": 0,
    "name": "Dashboard",
    "parentIds": "0",
    "roles": "USER,ADMIN",
    "sort": 6,
    "id": 1,
    "gmtCreate": 57600000,
    "gmtModified": 1551436574000
}, {
    "icon": "appstore",
    "title": "Service Management",
    "src": "/#/application",
    "key": "serviceMgmt",
    "subMenu": [{
        "icon": "project",
        "title": "Projects",
        "src": "/application",
        "key": "Project",
        "subMenu": [],
        "url": "/application",
        "parentId": 5,
        "name": "Projects",
        "parentIds": "0",
        "roles": "ADMIN",
        "sort": 2,
        "id": 27,
        "gmtCreate": 1551897211000,
        "gmtModified": 1555681712000
    }, {
        "icon": "euro",
        "title": "Applications",
        "src": "/application",
        "key": "appAccept",
        "subMenu": [],
        "url": "/application",
        "parentId": 5,
        "name": "Applications",
        "parentIds": "0",
        "roles": "ADMIN",
        "sort": 1,
        "id": 16,
        "gmtCreate": 57600000,
        "gmtModified": 1555681655000
    }, {
        "icon": "gateway",
        "title": "Service Registry",
        "src": "/registerCenterMgmt",
        "key": "registerCenterMgmt",
        "subMenu": [],
        "url": "/registerCenterMgmt",
        "parentId": 5,
        "name": "Service Registry",
        "parentIds": "0",
        "roles": "ADMIN",
        "sort": 0,
        "id": 31,
        "gmtCreate": 1554322400000,
        "gmtModified": 1555681682000
    }],
    "url": "/#/application",
    "parentId": 0,
    "name": "Service Management",
    "parentIds": "0",
    "roles": "USER,ADMIN",
    "sort": 5,
    "id": 5,
    "gmtCreate": 57600000,
    "gmtModified": 1551432843000
}, {
    "icon": "hdd",
    "title": "Application Management",
    "src": "/#",
    "key": "projectMgmt",
    "subMenu": [{
        "icon": "deployment-unit",
        "title": "Service Catalog",
        "src": "/application",
        "key": "serviceManage",
        "subMenu": [],
        "url": "/application",
        "parentId": 2,
        "name": "Service Catalog",
        "parentIds": "0",
        "roles": "USER,ADMIN",
        "sort": 5,
        "id": 24,
        "gmtCreate": 1550776870000,
        "gmtModified": 1555681746000
    }, {
        "icon": "ant-design",
        "title": "Service Instances",
        "src": "/application",
        "key": "list",
        "subMenu": [],
        "url": "/application",
        "parentId": 2,
        "name": "Service Instances",
        "parentIds": "0",
        "roles": "USER,ADMIN",
        "sort": 3,
        "id": 26,
        "gmtCreate": 57600000,
        "gmtModified": 1555681822000
    }],
    "url": "/#",
    "parentId": 0,
    "name": "Application Management",
    "parentIds": "0",
    "roles": "USER,ADMIN",
    "sort": 1,
    "id": 2,
    "gmtCreate": 57600000,
    "gmtModified": 1554322372000
}, {
    "icon": "setting",
    "title": "System Admin",
    "src": "",
    "key": "sys",
    "subMenu": [{
        "icon": "profile",
        "title": "Menus",
        "src": "/OSManage",
        "key": "menuManage",
        "subMenu": [],
        "url": "/OSManage",
        "parentId": 12,
        "name": "Menus",
        "parentIds": "0",
        "roles": "USER,ADMIN",
        "sort": 1,
        "id": 13,
        "gmtCreate": 57600000,
        "gmtModified": 1544421864000
    }, {
        "icon": "user",
        "title": "Users",
        "src": "/userMgmt",
        "key": "userMgmt",
        "subMenu": [],
        "url": "/userMgmt",
        "parentId": 12,
        "name": "Users",
        "parentIds": "0",
        "roles": "USER,ADMIN",
        "sort": 0,
        "id": 28,
        "gmtCreate": 1551897353000,
        "gmtModified": 1554332032000
    }, {
        "icon": "appstore",
        "title": "Data Dictionary",
        "src": "/remoteConfig",
        "key": "remoteConfig",
        "subMenu": [],
        "url": "/remoteConfig",
        "parentId": 12,
        "name": "Data Dictionary",
        "parentIds": "0",
        "roles": "ADMIN",
        "sort": 0,
        "id": 30,
        "gmtCreate": 1552417828000,
        "gmtModified": 1552417828000
    }],
    "url": "",
    "parentId": 0,
    "name": "System Admin",
    "parentIds": "0",
    "roles": "ADMIN",
    "sort": 1,
    "id": 12,
    "gmtCreate": 57600000,
    "gmtModified": 1544422555000
}];

let hashMenu = {};
function flatData(menus) {
    menus.forEach((menu) => {
        hashMenu[menu.key] = menu;
        if (menu.subMenu.length > 0) {
            flatData(menu.subMenu);
        }
    });
}

let result = flatData(menus);
console.log('result', result);
