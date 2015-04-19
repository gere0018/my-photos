var appClass = function(){

    var pages = {};
    var links = {};
    var uuid = 0 ;
    var customAajax = {};

    var serverConnection = function(id){
        var deviceId = encodeURIComponent(id);
        console.log("device id = "+ id);

        var req;

        var createAJAXObj = function () {
            try {
                console.log("chrome/ios ajax request");
                return new XMLHttpRequest();
            } catch (er1) {
                try {
                    return new ActiveXObject("Msxml3.XMLHTTP");
                } catch (er2) {
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                    } catch (er3) {
                        try {
                            return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                        } catch (er4) {
                            try {
                                return new ActiveXObject("Msxml2.XMLHTTP");
                            } catch (er5) {
                                try {
                                    return new ActiveXObject("Microsoft.XMLHTTP");
                                } catch (er6) {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }

        var sendRequest = function (url, callback, postData) {
            req = createAJAXObj(), method = (postData) ? "POST" : "GET";
            if (!req) {
                return;
            }

            /* Make sure to use asynchronous ajax call by setting last paramerter to true. */
            req.open(method, url, true);
            //req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
            if (postData) {
                req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            }
            req.onreadystatechange = function () {
                if (req.readyState !== 4) {
                    return;
                }
                if (req.status !== 200 && req.status !== 304) {
                    return;
                }
                callback(req);
            }
            req.send(postData);
        }

        var list = function(ipaddress){

            /* http://faculty.edumedia.ca/griffis/mad9022/final-w15/*/
            var url = "http://"+ipaddress+":8888/mad9022/final-w15/list.php?dev=" + deviceId;

            sendRequest(url, photosGridview.create, null);

        }

        var save = function(){

        }

        var get = function(){

        }

        var remove = function(){

        }

        return {
            list: list,
            save: save,
            get: get,
            remove:remove
        }
    }

// function imgReturned(xhr){
//     var json = JSON.parse(xhr.responseText);
//     alert(json.id);
//     var img = document.createElement("img");
//     img.src = json.data;
//     var w = img.width;
//     var h = img.height;

//     //now load the image into the canvas
//     var c = document.getElementById("c");
//     var ctx = c.getContext("2d");
//     c.width = w;
//     c.height = h;
//     c.style.width = w + "px";
//     c.style.height = h + "px";

//     ctx.drawImage(img, 0, 0);
// }

    var gridviewClass = function(){

        var handleDelete = function(ev){
            console.log(ev.target);
            var itemToDelete = ev.target;
            // itemToDelete.parentElement.remove();
        }

        var create = function(xhr){
            var json = JSON.parse(xhr.responseText);
            console.log(json);

            var gridview = document.querySelector('[data-role= "gridView"]');
            var gridviewContent = "";

            /*      <li data-ref="4" class="col-4">
                       <p> text - 4</p>
                        <img src="http://www.entropiaplanets.com/w/images/thumb/e/eb/Moblist_thumb_Warlock.png/180px-Moblist_thumb_Warlock.png">
                        <svg data-icon-name="delete" viewBox="0 0 400 400"></svg>
                    </li>
            */
            for (var i=0; i< json["thumbnails"].length;i++){
                gridviewContent += '<li data-ref="'+json["thumbnails"][i].id +'" class="col-4">';
                gridviewContent += '<img src="'+json["thumbnails"][i].data+'"/>';
                gridviewContent += '<svg data-icon-name="delete" viewBox="0 0 400 400"></svg></li>';
            }

            gridview.innerHTML = gridviewContent;
            /* load delete buttons in the corresponding svg tags. */
            /* add hammer listener for delete svg tags. */
            // setTimeout(function(){
                var deleteButtonsArray = document.querySelectorAll('svg[data-icon-name="delete"]');
                console.log(deleteButtonsArray.length);
                for(var i=0;i<deleteButtonsArray.length;i++){
                    svgIcons.load(deleteButtonsArray[i], "data-icon-name");
                    // var deleteBtnHammerManager = new Hammer(deleteButtonsArray[i]);
                    // deleteBtnHammerManager.on("tap", handleDelete);
                }
            // }, 100);

        }

        var remove = function(){

        }

        var append = function(){

        }

        return{
            create: create,
            remove: remove,
            append: append
        }
    }


    var siteNavigatorClass = function(){

        var numPages = 0;
        var numLinks = 0;

        var init = function(){

            var pagesArray = document.querySelectorAll('[data-role="page"]');
            numPages = pagesArray.length;


            /* save pages into js object where the key is the same as the given page id*/
            for(var i=0; i< numPages; i++){
                pages[pagesArray[i].getAttribute("id")] = pagesArray[i];
            }
            delete pagesArray; //Free the memory


            var gridView = pages["viewPhotos"].querySelector('ul[data-role="gridView"]');

            /* Relate tap and double tap events to list view of contacts using hammer API */
            var gridHammerManager = new Hammer(gridView);

            gridHammerManager.on("tap", handleSingleTapGridview);

            /* add listener for the main navigation tabs.*/
            var linksArray = document.querySelectorAll('[data-role="pagelink"]');
            numLinks = linksArray.length;
            for(var i=0; i< linksArray.length; i++){
                /* Get href attribute and remove hashtag (first character in string value) using
            substr method.*/
                var key = linksArray[i].getAttribute("href").substr(1);
                links[key] = linksArray[i];
                var tabHammerManager = new Hammer(linksArray[i]);
                tabHammerManager.on('tap', handleSingleTapLink);
            }
            delete linksArray; //Free the memory

            /* Add modal to the pages array to be capable of applying page transitions for modal windows as well. */
            var modalsArray = document.querySelectorAll('[data-role="modal"]');
            var numModals = modalsArray.length;
            for(var i=0; i< numModals; i++){
                pages[modalsArray[i].getAttribute("id")] = modalsArray[i];

                /* Each modal window contains cancel and save button. Add corresponding listeners */
                var cancelBtn = modalsArray[i].querySelector('input[value="CANCEL"]');
                var cancelBtnHammerManager = new Hammer(cancelBtn);
                cancelBtnHammerManager.on('tap', handleCancelTap);

                var saveBtn = modalsArray[i].querySelector('input[value="SAVE"]');
                var saveBtnHammerManager = new Hammer(saveBtn);
                saveBtnHammerManager.on('tap', handleSaveTap);

            }
            delete modalsArray; //Free the memory

            doPageTransition(null, "viewPhotos");

            var backBtnsArray = document.querySelectorAll('svg[data-icon-name="back"]');
            for(var i=0; i<backBtnsArray.length; i++){
                var backBtnHammerManager = new Hammer(backBtnsArray[i]);
                backBtnHammerManager.on('tap', handleBackButton);
            }
        }

        var handleSingleTapLink = function(ev){
            ev.preventDefault();
            /* Get which link item that has been tapped.*/
            var currentTarget = ev.target;
            var linkHref = currentTarget.getAttribute("href");
            while(!linkHref){
                currentTarget = currentTarget.parentNode;
                linkHref = currentTarget.getAttribute("href");
            }
            var destLink = currentTarget;

            if(destLink){
                var destPageId = linkHref.split("#")[1];
                var currentPageId = document.URL.split("#")[1];

                if(destPageId != currentPageId){
                    var outClass = "pt-page-scaleDown";
                    var inClass = "pt-page-scaleUp";

                    doPageTransition(currentPageId,destPageId,outClass,inClass,true);
                }
            }
        }

        var handleCancelTap = function(ev){

            var currentPageId = document.URL.split("#")[1];
            switch(currentPageId){
                case "viewPhotos":
                    break;
                case "takePhoto":
                    break;
                default:
                    /*Do nothing*/
            }

            removeModalWindow();
        }

        var removeModalWindow = function(){
            var destPageId = document.URL.split("#")[1];
            var activeModal = document.querySelector('[data-role="modal"].active-page');
            var currentPageId = activeModal.getAttribute("id");
            pages[currentPageId].classList.add("pt-page-moveToBottom");
            setTimeout(function(){
                pages[currentPageId].classList.remove("active-page");
                pages[currentPageId].classList.remove("pt-page-moveToBottom");
            }, 600);
        }

        var handleSaveTap = function(ev){
            /* prevent page from reloading*/
            ev.preventDefault();

            var currentPageId = document.URL.split("#")[1];
            switch(currentPageId){
                case "takePhoto":

                default:
                    /* Do nothing*/
            }
            removeModalWindow();
        }

        var handleSingleTapGridview = function(ev){

            var currentPageId = document.URL.split("#")[1];
            console.log("Single tap event has been recognized on grid");

            /* Get which list item that has been tapped.*/
            var currentTarget = ev.target;

            /*Get HTML type of the tapped element. */
            var htmlType = currentTarget.nodeName;

            var gridItemId = currentTarget.getAttribute("data-ref");
            while(!gridItemId){
                currentTarget = currentTarget.parentNode;
                gridItemId = currentTarget.getAttribute("data-ref");
            }

            // var gridItemId = currentTarget;
            switch(htmlType){
                case "LI":
                    /* This matches tapping on margin between two list items, so
                       Do nothing, user must clicked on img or delete svg icon.*/
                    console.log("li is tapped");
                    break;
                case "IMG":
                    /* TODO: open detailed view modal.*/
                    /* TODO: get the bigger image from database.*/
                    console.log("image tag is tapped, enlarge the image");
                    break;
                default: // for any part of the svg icon.
                    console.log("svg or part of it is tapped, delete item");
                    break;
            }

            // /* Make sure that we find a valid list item */
            // if(gridItemId){

            //     /* TODO: Delete image from database.*/

            //     /* Delete item from grid view.*/

            //     var outClass = "pt-page-scaleDown";
            //     var inClass = "pt-page-scaleUp";

            //     // doPageTransition(currentPageId,destPageId,outClass,inClass,true);

            // }else{
            //     console.error("Failed to find valid grid item id");
            // }
        }

        //Deal with history API and switching divs
        var doPageTransition = function( srcPageId, destPageId,
                                         outClass, inClass,
                                         isHistoryPush){

            if(srcPageId == null){
                //home page first call, load all entries from people and occasion tables
                pages[destPageId].classList.add("active-page");
                pages[destPageId].classList.add("pt-page-fadeIn");

                svgIcons.prepareAnimation(destPageId);

                setTimeout(function(){svgIcons.startAnimation(destPageId);}, 20);
                setTimeout(function(){
                    pages[destPageId].classList.remove("pt-page-fadeIn");

                }, 1000); /* 1sec is the animation duration. */
                history.replaceState(null, null, "#"+destPageId);

            }else{

                links[srcPageId].classList.remove("active-link");
                links[destPageId].classList.add("active-link");

                pages[destPageId].classList.add("active-page");
                pages[srcPageId].className  += " "+outClass;
                pages[destPageId].className += " "+inClass;

                if(("gifts-per-person" == destPageId) ||
                    ("gifts-per-occasion" == destPageId)){

                    var mainSvgIcon = "gift";
                }else{
                    var mainSvgIcon = destPageId;
                }

                svgIcons.prepareAnimation(mainSvgIcon);

                /* Get current styles for the destination page.*/
                var style = window.getComputedStyle(pages[destPageId], null);

                /* Get animation duration ( in millisecond )for the destination page.
                Remove last character which is 's' then parse the number*/
                var animationDuration = parseFloat(style.webkitAnimationDuration.slice(0,-1))* 1000;
                /* Get animation delay ( in millisecond ) for the destination page.*/
                var animationDelay = parseFloat(style.webkitAnimationDelay.slice(0,-1))* 1000;

                setTimeout(function(){
                    /* Remove active-page class and outClass from source page.
                    Exception case: when displaying modal window, make sure to keep source page in the background*/
                    pages[srcPageId].className = outClass?"":"active-page";
                    pages[destPageId].className = "active-page";

                    svgIcons.rotate(destPageId);
                    svgIcons.startAnimation(mainSvgIcon);

                }, animationDuration + animationDelay); /* 0.6sec is the animation duration. */

                if (true === isHistoryPush)
                    history.pushState(null, null, "#" + destPageId);
                else if(false === isHistoryPush)
                    history.replaceState(null, null, "#"+destPageId);
            }/* else srcPageId is not null*/

            // currentPageId = destPageId;
            /* after loading any page, make sure to scroll to the top of this page. */
            setTimeout(function(){window.scrollTo(0,0);}, 10);
        }

        //Listener for the popstate event to handle the back button
        var handleBackButton = function (ev){
            ev.preventDefault();
            var currentPageId = document.URL.split("#")[1];

            switch (currentPageId){
                case "viewPhotos":
                    break;
                case "takePhoto":
                    break;
                default:
                    /*Do nothing*/
            }
            var outClass = "pt-page-scaleDown";
            var inClass = "pt-page-scaleUp";

            doPageTransition(currentPageId,destPageId,outClass,inClass,true);
        }

        return {
                    init : init
        }
    };

    var svgIcons = new svgClass();
    var siteNavigator = new siteNavigatorClass();
    var photosGridview = new gridviewClass();

    var init = function(){
        document.addEventListener("deviceready", onDeviceReady, false);
        document.addEventListener("DOMContentLoaded", onPageLoaded, false);
    }

    var onDeviceReady = function(){
        console.log("Device is ready");
        uuid = device.uuid;
        console.log(uuid);

        customAajax = new serverConnection(234234);

        /* load all thumbnail images from server using ajax*/
        customAajax.list("10.70.184.237");

        /* TODO: add camera preparation code. */
    }

    var onPageLoaded = function(){
        console.log("Page is loaded");

        svgIcons.init();


        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
            console.debug("Running application from device");
            /* Do nothing. */
        } else {
            console.debug("Running application from desktop browser");

            customAajax = new serverConnection(234234);

            /* load all thumbnail images from server using ajax*/
            customAajax.list("localhost");

        }

        //add button and navigation listeners
        siteNavigator.init();
    }

    return {
        init: init
    }
};

var myPhotos = new appClass();
myPhotos.init();    

