var svgClass = function(){

        var init = function(){
            /* Load all svg images and set their tap event listeners. */
            var svgElementsArray = document.querySelectorAll("svg[data-icon-name]");
            for(var i=0; i<svgElementsArray.length; i++){
                var svgElement = svgElementsArray[i];
                load(svgElement,"data-icon-name");
            }
        }

        var load = function(svgElement,dataAttributeName){
            /* Get a reference to the embedded svg tag in the HTML document using Snap SVG*/
            var snapCanvas = Snap( svgElement );

            /* SVG tag must have a custom data set whose value matches SVG file name */
            var iconNameDataSet = svgElement.getAttribute(dataAttributeName);

            /* Load SVG group content into HTML doc through snap svg library.
            Note that JS Closure must have been used because load method is asynchronous
            and snap svg canvas must be locked to load the vector graphic inside svg
            element correctly.*/
            Snap.load( "svg/"+iconNameDataSet+".svg", (function (myCanvas) {
                return function(fragment){
                    var group = fragment.select( 'g' );
                    myCanvas.append( group );
                }
            })(snapCanvas));
        }

        var loadForSelfDrawing = function(svgElement,dataAttributeName){
            /* Get a reference to the embedded svg tag in the HTML document using Snap SVG*/
            var snapCanvas = Snap( svgElement );

            /* SVG tag must have a custom data set whose value matches SVG file name */
            var iconNameDataSet = svgElement.getAttribute("data-icon-animate");

            /* Load SVG group content into HTML doc through snap svg library.
            Note that JS Closure must have been used because load method is asynchronous
            and snap svg canvas must be locked to load the vector graphic inside svg
            element correctly.*/
            Snap.load( "svg/"+iconNameDataSet+".svg", (function (myCanvas) {
                return function(fragment){
                    var group = fragment.select( 'g' );

                    var paths = fragment.selectAll("path");

                    for(var i=0; i< paths.length; i++){
                        var path = paths[i];

                        var length = path.getTotalLength();

                        path.attr({ "transition":"none",
                                    "WebkitTransition": "none",
                                    "strokeDasharray" : length + ' ' + length,
                                    "strokeDashoffset": length
                                  });
                    }

                    myCanvas.append( group );
                } // return function
            })(snapCanvas)); //snap.load function
        }

        /* prepare svg animations that should happen in every page. */
        var prepareAnimation = function(svgName){
            switch(svgName){
                case "people":
                    var svgPeople = document.querySelector('svg[data-icon-name="people"]');
                    svgPeople.classList.add("hide");
                    break;
                case "occasions":
                    var svgOccasions = document.querySelector('svg[data-icon-name="occasions"]');
                    svgOccasions.classList.add("hide");
                    break;
                case "gift":
                // case "gifts-per-person":
                    /* load special gift svgs whose path will be animated at run-time. */
                    svgElementsArray = document.querySelectorAll('svg[data-icon-animate="gift"]');
                    for(var i=0; i<svgElementsArray.length; i++){
                        var svgElement = svgElementsArray[i];

                        loadForSelfDrawing(svgElement,"data-icon-animate");
                    } // for loop

                    break;
                case "checkmark":

                    /* load  checkmark svgs whose path will be animated at run-time. */
                    var svgElementsArray = document.querySelectorAll('svg[data-icon-animate="checkmark"].unchecked');
                    for(var i=0; i<svgElementsArray.length; i++){
                        var svgElement = svgElementsArray[i];
                        loadForSelfDrawing(svgElement,"data-icon-animate");
                    }

                    /* load checkmark svg that needn't any self-drawing*/
                    var svgElementsArray = document.querySelectorAll('svg[data-icon-animate="checkmark"].checked');
                    for(var i=0; i<svgElementsArray.length; i++){
                        var svgElement = svgElementsArray[i];
                        load(svgElement,"data-icon-animate");
                    }

                    break;
            }
        }

        /* start svg animations that should happen in every page. */
        var startAnimation = function(svgName){
            switch(svgName){
                case "people":
                    var svgPeople = document.querySelector('svg[data-icon-name="people"]');
                    svgPeople.classList.add("show");

                    var leftPerson = document.querySelector('#left-person');
                    var rightPerson = document.querySelector('#right-person');
                    leftPerson.classList.add("pt-page-moveFromTop");
                    rightPerson.classList.add("pt-page-moveFromBottom");

                    setTimeout(function(){
                        svgPeople.classList.remove("hide");
                        svgPeople.classList.remove("show");

                        leftPerson.classList.remove("pt-page-moveFromTop");
                        rightPerson.classList.remove("pt-page-moveFromBottom");
                    }, 600);
                    break;

                case "occasions":
                    var svgOccasions = document.querySelector('svg[data-icon-name="occasions"]');
                    svgOccasions.classList.add("show");

                    var ballonStrings = document.querySelectorAll('.string');
                    for(var i=0; i<ballonStrings.length; i++)
                        ballonStrings[i].classList.add("pt-page-moveFromBottom");
                    var ballonUpperParts = document.querySelectorAll('.ballon-upper');
                    for(var i=0; i<ballonUpperParts.length; i++)
                        ballonUpperParts[i].classList.add("pt-page-moveFromTop");

                    setTimeout(function(){
                        svgOccasions.classList.remove("hide");
                        svgOccasions.classList.remove("show");

                        for(var i=0; i<ballonStrings.length; i++)
                            ballonStrings[i].classList.remove("pt-page-moveFromBottom");
                        for(var i=0; i<ballonUpperParts.length; i++)
                            ballonUpperParts[i].classList.remove("pt-page-moveFromTop");
                    }, 600);
                    break;

                case "gift":
                     var svgGiftsArray = document.querySelectorAll('svg[data-icon-animate="gift"]');
                     for(var i=0; i< svgGiftsArray.length; i++){
                        var svgGift = svgGiftsArray[i];
                         /* Set fill/stroke colors after ending animation. */
                         fireAnimation(svgGift, 2000 ,"hsl(69,54%,21%)", "#FFFFFF");
                     }

                    break;
            }
        }

        var fireAnimation = function(svgTag, duration, fillColor, strokeColor){
            var paths = svgTag.querySelectorAll('path');
            for(var i=0; i< paths.length; i++){
                var path = paths[i];

                // Trigger a layout so styles are calculated & the browser
                // picks up the starting position before animating
                path.getBoundingClientRect();
                // Define our transition
                path.style.transition = path.style.WebkitTransition =
                    'stroke-dashoffset 2s ease-in-out';
                // Go!
                path.style.strokeDashoffset = '0';

                changePathColors(path, duration, fillColor, strokeColor)();
            }
        }

        function changePathColors(myPath, duration, fillColor, strokeColor){
            return function(){
                    setTimeout(function(){
                        myPath.style.fill= fillColor;
                        myPath.style.stroke = strokeColor;

                        /* This is corner case for gifts icon*/
                        if(("middle-vertical" == myPath.getAttribute("id")) ||
                                 ("top-horizontal"  == myPath.getAttribute("id")) ){
                                myPath.style.strokeWidth = "5.953";
                        }
                    },duration);
            };
        }

        var rotate = function(pageId){
//            var addBtn  = pages[pageId].querySelector('svg[data-icon-name="add"]');
//            var backBtn = pages[pageId].querySelector('svg[data-icon-name="back"]');
//            if(addBtn){
//                addBtn.classList.add("rotate");
//                setTimeout(function(){addBtn.classList.remove("rotate");}, 600);
//            }
//
//            if(backBtn){
//                backBtn.classList.add("rotate");
//                setTimeout(function(){backBtn.classList.remove("rotate");}, 600);
//            }
        }

        return{
                init: init,
                prepareAnimation: prepareAnimation,
                rotate: rotate,
                startAnimation: startAnimation,
                fireAnimation: fireAnimation,
                loadForSelfDrawing: loadForSelfDrawing,
                load: load
        }
    };
