window.onload = function () {
    makeTree();
}

function makeTree() {
    console.log(sessionStorage.getItem("structureTree"));
    let tree = JSON.parse( sessionStorage.getItem("structureTree"))  ;
    console.log(tree);

    let treeParams = JSON.parse('{' + sessionStorage.getItem("dataTree") + '}');
    treeMaker(tree, {
        id: 'tree',
        treeParams: treeParams,
        link_width: '4px',
        link_color: '#649B3F',
        card_click: function (element) {
            console.log(element);
        }
        
    });
}