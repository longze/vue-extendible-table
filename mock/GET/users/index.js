module.exports = function (params, req) {

    var page1 = [
        {
            id: 1,
            name: 'jerry',
            age: 1,
            mood: 1
        },
        {
            id: 2,
            name: 'tom1',
            age: 3,
            mood: 2
        },
        {
            id: 3,
            name: 'tom2',
            age: 3,
            mood: 2
        }
    ];

    var page2 = [
        {
            id: 4,
            name: '2 丫',
            age: 1,
            mood: 1
        },
        {
            id: 5,
            name: 'tom3',
            age: 3,
            mood: 2
        },
        {
            id: 6,
            name: 'tom4',
            age: 3,
            mood: 2
        }
    ];

    var page;
    if (params.currentPage == 1) {
        page = page1;
    }
    else {
        page = page2;
    }
    return {
        "code": 200,
        "msg": "",
        "data": {
            "list": page,
            "total": 50
        }
    };
};
