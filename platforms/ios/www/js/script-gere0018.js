var prepareDelete = function(){
        console.log("Delete items");
        var deleteBtn = document.querySelectorAll('svg[data-icon-name="delete"]');
        for(var i=0;i<deleteBtn.length;i++){
            console.log("inside loop " + deleteBtn);
            var hammerDelete = new Hammer(deleteBtn[i]);
            hammerDelete.on("tap", handleDelete);
            }

}
var handleDelete = function(ev){
    console.log("handle Delete");
    var itemToDelete = ev.target;
     itemToDelete.parentElement.remove();

}

