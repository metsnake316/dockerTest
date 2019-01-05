$(document).ready(function() {
    $.preloadImages = function() {
    	  for (var i = 0; i < arguments.length; i++) {
    	    $("<img />").attr("src", arguments[i]);
    	  }
    	}

    //$.preloadImages("/images/BL2.png","/images/map.png","/images/Algeria_flag.png","/images/Argentina_flag.png","/images/England_flag.png","/images/Brazil_flag.png","/images/Ecuador_flag.png","/images/Cameroon_flag.png","/images/Chile_flag.png","/images/Colombia_flag.png","/images/Ivory Coast_flag.png","/images/Ghana_flag.png","/images/Nigeria_flag.png","/images/Australia_flag.png","/images/Iran_flag.png","/images/Japan_flag.png","/images/South Korea_flag.png","/images/Belgium_flag.png","/images/Bosnia and Herzegovina_flag.png","/images/Croatia_flag.png","/images/Uruguay_flag.png","/images/France_flag.png","/images/Germany_flag.png","/images/Greece_flag.png","/images/Italy_flag.png","/images/Netherlands_flag.png","/images/Portugal_flag.png","/images/Russia_flag.png","/images/Spain_flag.png","/images/Switzerland_flag.png","/images/Costa Rica_flag.png","/images/Honduras_flag.png","/images/Mexico_flag.png","/images/United States_flag.png");
    
    $.preloadImages("/images/yoke4.png","/images/add.png","/images/envelope_email.png","/images/en0.png","/images/fr0.png","/images/bouee3.png","/images/movarrow2.gif","/images/logo_one_bottle_L_2.png","/images/logo_one_bottle_R_2.png","/images/yoke5.png","/images/logo_one_bottle_L_3.png","/images/bouee6.png","/images/house0.png","/images/card.jpg","/images/card2_0.jpg","/images/card3_0.png");

});



