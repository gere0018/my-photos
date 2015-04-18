var appClass = function(){

    var pages = {};

    var siteNavigatorClass = function(){

        var numPages = 0;

        var init = function(){

            var pagesArray = document.querySelectorAll('[data-role="page"]');
            numPages = pagesArray.length;


            /* save pages into js object where the key is the same as the given page id*/
            for(var i=0; i< numPages; i++){
                pages[pagesArray[i].getAttribute("id")] = pagesArray[i];

                /* Each page contains a list view.
                Add tap/double tap event listeners to the corresponding list view */
                var listView = pagesArray[i].querySelector('ul[data-role="listview"]');

                /* Relate tap and double tap events to list view of contacts using hammer API */
                var listHammerManager = new Hammer(listView);

                listHammerManager.on("tap", handleSingleTap);
            }
            delete pagesArray; //Free the memory

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
            var activeModal = document.querySelector('[data-role="modal"].activePage');
            var currentPageId = activeModal.getAttribute("id");
            pages[currentPageId].classList.add("pt-page-moveToBottom");
            setTimeout(function(){
                pages[currentPageId].classList.remove("activePage");
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



        var handleSingleTap = function(ev){

            var currentPageId = document.URL.split("#")[1];
            console.log("Single tap event has been recognized inside page:"+currentPageId);

            /* Get which list item that has been tapped.*/
            var currentTarget = ev.target;
            var listItemId = currentTarget.getAttribute("data-ref");
            while(!listItemId){
                currentTarget = currentTarget.parentNode;
                listItemId = currentTarget.getAttribute("data-ref");
            }
            var listItem = currentTarget;

            /* Make sure that we find a valid list item */
            if(listItemId){
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

            }else{
                console.error("Failed to find valid list item id");
            }
        }

        //Deal with history API and switching divs
        var doPageTransition = function( srcPageId, destPageId,
                                         outClass, inClass,
                                         isHistoryPush){

            if(srcPageId == null){
                //home page first call, load all entries from people and occasion tables
                pages[destPageId].classList.add("activePage");
                pages[destPageId].classList.add("pt-page-fadeIn");

                svgIcons.prepareAnimation(destPageId); //destPageId has the same svg name "people"
                svgIcons.rotate(destPageId);

                setTimeout(function(){svgIcons.startAnimation(destPageId);}, 20);
                setTimeout(function(){
                    pages[destPageId].classList.remove("pt-page-fadeIn");

                }, 1000); /* 1sec is the animation duration. */
                history.replaceState(null, null, "#"+destPageId);

            }else{

                pages[destPageId].classList.add("activePage");
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
                    /* Remove activePage class and outClass from source page.
                    Exception case: when displaying modal window, make sure to keep source page in the background*/
                    pages[srcPageId].className = outClass?"":"activePage";
                    pages[destPageId].className = "activePage";

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

    var init = function(){
        document.addEventListener("deviceready", onDeviceReady, false);
        document.addEventListener("DOMContentLoaded", onPageLoaded, false);
    }

    var onDeviceReady = function(){
        console.log("Device is ready");
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
        }

        //add button and navigation listeners
        siteNavigator.init();

    }
};

var myPhotos = new appClass();
myPhotos.init();    

