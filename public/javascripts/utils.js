$(document).ready(function() {

	$("ul.nav li").each(function() {
		$(this).click(function() {
			$(this).toggleClass("active");
		});
	});

	if ($('div.alert').length > 0) {
		$(this).scrollTop($('div.alert').position().top);
	}

    // preventing event bubbling (hack to introduce bootstrap 3 for now)

    $('.predictBtn').click( function(){
        // flag counter for the two input fields
        var x=0;
        var matchForm = $(this).parent();
        matchForm.parent().find('.input-lg').each(function(){
            var score = $(this).val();
            if (score == '' || score < 0 || score == null || isNaN(score)){
                alert('Watch your input!');
                return false;
            }
            else{         
                 x++;
            }
             if (x==2)
               matchForm.submit();
        });

    return false;
    });



    $.preloadImages = function() {
    	  for (var i = 0; i < arguments.length; i++) {
    	    $("<img />").attr("src", arguments[i]);
    	  }
    	}

    //$.preloadImages("/images/BL2.png","/images/map.png");

    $('.changepassword').click( function(){
        if($('.pass').val()!=null && $('.repass').val()!=null && $('.pass').val()!='' && $('.pass').val()==$('.repass').val()){
        	return true;
        }
        //alert('Incorrect Password. Try again or Get to Predicting!');
        return false;
    });
    
});



