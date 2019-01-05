;(function(){ // Final page transition code
         
            var animation = false,
            animationstring = 'animation',
            keyframeprefix = '',
            domPrefixes = 'Webkit Moz O ms Khtml'.split(' '),
            pfx = '',
            elm = document.createElement('div');
             
            if( elm.style.animationName !== undefined ) { animation = true; } 
             
            if( animation === false ) {
                for( var i = 0; i < domPrefixes.length; i++ ) {
                    if( elm.style[ domPrefixes[i] + 'AnimationName' ] !== undefined ) {
                        pfx = domPrefixes[ i ];
                        animationstring = pfx + 'Animation';
                        keyframeprefix = '-' + pfx.toLowerCase() + '-';
                        animation = true;
                        break;
                    }
                }
            }
             
            var minloadingtime = 100
            var maxloadingtime = 3000
             
            var startTime = new Date()
            var elapsedTime
            var dismissonloadfunc, maxloadingtimer
             
            if(document.getElementById('pageloader') != null){
            if (animation && document.documentElement && document.documentElement.classList){
                document.documentElement.classList.add('hidescrollbar')
                
                window.addEventListener('load', dismissonloadfunc = function(){ // when page loads
                    clearTimeout(maxloadingtimer) // cancel dismissal of transition after maxloadingtime time
                    elapsedTime = new Date() - startTime // get time elapsed once page has loaded
                    var hidepageloadertimer = (elapsedTime > minloadingtime)? 0 : minloadingtime - elapsedTime
                     
                    setTimeout(function(){
                        document.getElementById('pageloader').classList.add('dimissloader') // dismiss transition
                    }, hidepageloadertimer)
                     
                    setTimeout(function(){
                        document.documentElement.classList.remove('hidescrollbar')
                    }, hidepageloadertimer + 100) // 100 is the duration of the fade out effect
                 
                }, false)
                 
                maxloadingtimer = setTimeout(function(){ // force dismissal of page transition after maxloadingtime time
                    window.removeEventListener('load', dismissonloadfunc, false) // cancel onload event function call
                        document.getElementById('pageloader').classList.add('dimissloader') // dismiss transition
                     
                    setTimeout(function(){
                        document.documentElement.classList.remove('hidescrollbar')
                    }, 100) // 100 is the duration of the fade out effect
                }, maxloadingtime)
             
             
            }
            else{
                document.getElementById('pageloader').style.display = 'none'
            }
            }
         
        })();