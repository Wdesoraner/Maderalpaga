window.onload = function () {
    makeTree();
}

function makeTree() {
    let tree = {
        1: {
            2: '',
            3: {
                6: '',
                7: '',
            },
            4: '',
            5: ''
        }
    };

    let treeParams = {
        1: { trad: 'JavaScript' },
        2: { trad: 'jQuery' },
        3: { trad: 'React' },
        4: { trad: 'Angular' },
        5: { trad: 'Vue.js' },
        6: { trad: 'ReactJS' },
        7: { trad: 'React Native' }
    };

    treeMaker(tree, {
        id: 'tree',
        treeParams: treeParams,
        link_width: '4px',
        link_color: '#2199e8',
        card_click: function (element) {
            console.log(element);
        }
        
    });
}