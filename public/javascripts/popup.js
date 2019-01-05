
var shade = document.getElementById("shade");
var shadelight = document.getElementById("shade-light");

  var checkedtext = "Do you want to mark this reagent as insufficient?";
  var uncheckedtext = "Do you want to mark this reagent as replenished and in sufficient quantities?";
  var checkedtextfull = "Have you fulfilled this order?";
  var uncheckedtextfull = "Do you want to revert this order fulfillment?";
  var reagenttext = "Reagent";
  var vendortext = "Vendor";
  var catalognumbertext = "Catalog Number";
  var ownertext = "Owner";
  var requestortext = "Requestor";
  var labtext = "Lab";
  var ordertext = "You are about to order ";

  console.log("lib: " +  MYLIBRARY.getLang(0));

$.getJSON("/javascripts/lang/" + MYLIBRARY.getLang(0) + ".json", function(json) {
        //console.log(json);
        console.log(json["popup.order"]);// access the first object of the array
        checkedtext = json["popup.cancel.insufficient"];
        uncheckedtext = json["popup.cancel.replenish"];
        checkedtextfull = json["popup.fulfill.order"];
        uncheckedtextfull = json["popup.fulfill.revert"];
        reagenttext = json["popup.reagent"];
        vendortext = json["popup.vendor"];
        catalognumbertext = json["popup.catalog"];
        ownertext = json["popup.owner"];
        requestortext = json["popup.requestor"];
        labtext = json["popup.lab"];
        ordertext = json["popup.order"];
    });

$('html').click(function() {
  /*$('#nameform:visible').hide();
  if($('#nameform:hidden')){
    $('#name:hidden').show();
    $('#changename:visible').hide();
    $('#pencilname:hidden').show();
  }*/
 /* $('#nameform').size()
  if($('#nameform') && $('#nameform').){
    alert();
  }*/
});

$('.cancel').click(function() {
  var cancel = $(this);
  var checked = cancel.is(':checked');
  console.log("checked is: " + checked);
  console.debug(checked);
  var orderText = document.getElementById("orderText");
  var langText = document.getElementById("langText").innerHTML;
  //var checkedtext = "Do you want to mark this reagent as insufficient?";
  //var uncheckedtext = "Do you want to mark this reagent as replenished and in sufficient quantities?";
  var desc = "";
  console.log("lang is " + langText );

  var agentnode = cancel.closest('div').next('.agentid');
  var labnode = agentnode.next('.labid');
  var vendornode = labnode.next('.vendorid');
  
  var catalognode = vendornode.next('.catalogid');
  var owneremailnode = catalognode.next('.owneremailid');
  var requestornode = owneremailnode.next('.requestorid');
  var selfnode = requestornode.next('.selfid');

  var agentval = agentnode.val();
  //var labval = labnode.val();
  var owneremailval = owneremailnode.val();
  var vendorval = vendornode.val();
  var catalogval = catalognode.val();

  var requestorval = "";
  var selfval = "";


  console.log("agent: " + agentval);
  console.log("owneremailval: " + owneremailval);
  console.log("vendorval: " + vendorval);
  console.log("catalogval: " + catalogval);
  console.log("requestorval: " + requestorval);

  desc += "<br/><b>" + reagenttext + ":</b> " + agentval;
   desc += "<br/><b>" + vendortext + ":</b> " + vendorval;
   desc += "<br/><b>" + catalognumbertext + ":</b> " + catalogval;
   desc += "<br/><b>" + ownertext + ":</b> " + owneremailval;
      if(selfnode.length > 0){
    selfval = selfnode.val();
  }  
   if(requestornode.length > 0 && selfval == "self"){
    requestorval = requestornode.val();
    desc += "<br/><b>" + requestortext + ":</b> " + requestorval;
  }  
   var displaycheckedtext = checkedtext + desc;
   var displayuncheckedtext = uncheckedtext + desc;

  /*if(langText == "fr"){
    checkedtext = "Voulez-vous marquer ce réactif comme insuffisant?";
   uncheckedtext = "Voulez-vous marquer ce réactif comme réapprovisioné et en quantité suffisante?";
  desc = "<br/><b>Réactif:</b> " + agentval;
   desc += "<br/><b>Vendeur:</b> " + vendorval;
   desc += "<br/><b>Numéro de Catalogue:</b> " + catalogval;
   desc += "<br/><b>Proprio:</b> " + owneremailval;
  if(requestorval != ""){
    desc += "<br/><b>Demandeur:</b> " + requestorval;
  }
   checkedtext += desc;
   uncheckedtext += desc;
  }

  if(langText == "se"){
    checkedtext = "Önskar du att markera denna agens som otillräcklig?";
   uncheckedtext = "Önskar du att markera denna agens som fyllt på och i tillräckligt antal?";
  desc = "<br/><b>Agens:</b> " + agentval;
   desc += "<br/><b>Försäljare:</b> " + vendorval;
   desc += "<br/><b>Katalog:</b> " + catalogval;
   desc += "<br/><b>Ägare:</b> " + owneremailval;
  if(requestorval != ""){
    desc += "<br/><b>Requestor:</b> " + requestorval;
  }
   checkedtext += desc;
   uncheckedtext += desc;
  }*/
  console.log("displaycheckedtext is " + displaycheckedtext );
  console.log("displayuncheckedtext is " + displayuncheckedtext );
  if(checked){
    orderText.innerHTML = displaycheckedtext;
  } else {
    orderText.innerHTML = displayuncheckedtext;
  }
  var pop = document.getElementById("ios-light");
  pop.style.display = "block";
  var shade = document.getElementById("shade");
  shade.style.display = "block";

  actionorder.onclick = function(){
  var parenttr = cancel.closest('tr');
  var currentbackgroundColor = parenttr.css('backgroundColor');
  
  console.log("currentbackgroundColor: " + currentbackgroundColor);
  if(currentbackgroundColor == 'rgb(255, 255, 255)'){
    parenttr.css('background-color', 'rgba(138, 109, 59, 0.66)');
  } else {
    parenttr.css('background-color', 'rgb(255, 255, 255');
  }
  cancel.closest('form').submit();
}

  actioncancel.onclick = function(){
    if(checked){
      cancel.prop('checked', false);
    } else {
      cancel.prop('checked', true);
    }
    iosLightExit();
}

});

$('.fulfill').click(function() {
  var fulfill = $(this);
  var checked = fulfill.is(':checked');
  var orderText = document.getElementById("orderText");
  var langText = document.getElementById("langText").innerHTML;
  var desc = "";
  //var checkedtext = "Have you fulfilled this order?";
  //var uncheckedtext = "Do you want to revert this order fulfillment?";

  var agentnode = fulfill.closest('div').next('.agentid');
  var labnode = agentnode.next('.labid');
  var owneremailnode = labnode.next('.owneremailid');
  var vendornode = owneremailnode.next('.vendorid');
  var catalognode = vendornode.next('.catalogid');
  var requestornode = catalognode.next('.requestorid');

  console.log("lang is " + langText );
  console.log("fulfill reagenttext: " + reagenttext);

  var agentval = agentnode.val();
  var labval = labnode.val();
  var owneremailval = owneremailnode.val();
  var vendorval = vendornode.val();
  var catalogval = catalognode.val();
  var requestorval = requestornode.val();

  console.log("agent: " + agentval);
  console.log("labval: " + labval);
  console.log("owneremailval: " + owneremailval);
  console.log("vendorval: " + vendorval);
  console.log("catalogval: " + catalogval);
  console.log("requestorval: " + requestorval);
  console.log("checkedtextfull0: " + checkedtextfull);
  console.log("uncheckedtextfull0: " + uncheckedtextfull);

  desc += "<br/><b>" + reagenttext + ":</b> " + agentval;
   desc += "<br/><b>" + vendortext + ":</b> " + vendorval;
   desc += "<br/><b>" + catalognumbertext + ":</b> " + catalogval;
   desc += "<br/><b>" + ownertext + ":</b> " + owneremailval;
   desc += "<br/><b>" + requestortext + ":</b> " + requestorval;
   desc += "<br/><b>" + labtext + ":</b> " + labval;
   var displaycheckedtextfull = checkedtextfull + desc;
   var displayuncheckedtextfull = uncheckedtextfull + desc;
   console.log("checkedtextfull1: " + displaycheckedtextfull);
   console.log("uncheckedtextfull1: " + displayuncheckedtextfull);

  /*if(langText == "fr"){
    checkedtext = "Avez-vous rempli cette commande de réactif?";
   uncheckedtext = "Voulez-vous marquer cette commande de réactif comme non-remplie?";
   desc = "<br/><b>Réactif:</b> " + agentval;
   desc += "<br/><b>Vendeur:</b> " + vendorval;
   desc += "<br/><b>Numéro de Catalogue:</b> " + catalogval;
   desc += "<br/><b>Proprio:</b> " + owneremailval;
   desc += "<br/><b>Demandeur:</b> " + requestorval;
   desc += "<br/><b>Labo:</b> " + labval;
   checkedtext += desc;
   uncheckedtext += desc;
  }

  if(langText == "se"){
    checkedtext = "Har du fullgjort denna beställning? ";
   uncheckedtext = "Önskar du att återvända denna beställningsuppfyllelse?";
   desc = "<br/><b>Agens:</b> " + agentval;
   desc += "<br/><b>Försäljare:</b> " + vendorval;
   desc += "<br/><b>Katalog:</b> " + catalogval;
   desc += "<br/><b>Ägare:</b> " + owneremailval;
   desc += "<br/><b>Requestor:</b> " + requestorval;
   desc += "<br/><b>Labo:</b> " + labval;
   checkedtext += desc;
   uncheckedtext += desc;
  }*/
  console.log("checkedtext is " + displaycheckedtextfull );
  console.log("uncheckedtext is " + displayuncheckedtextfull );



  if(checked){
    orderText.innerHTML = displaycheckedtextfull;
  } else {
    orderText.innerHTML = displayuncheckedtextfull;
  }
  var pop = document.getElementById("ios-light");
  pop.style.display = "block";
  var shade = document.getElementById("shade");
  shade.style.display = "block";

  actionorder.onclick = function(){
  var parenttr = fulfill.closest('tr');
  var currentbackgroundColor = parenttr.css('backgroundColor');
  
  console.log("currentbackgroundColor: " + currentbackgroundColor);
  if(currentbackgroundColor == 'rgb(255, 255, 255)'){
    parenttr.css('background-color', 'rgba(138, 109, 59, 0.66)');
  } else {
    parenttr.css('background-color', 'rgb(255, 255, 255');
  }
  fulfill.closest('form').submit();
}

  actioncancel.onclick = function(){
    if(checked){
      fulfill.prop('checked', false);
    } else {
      fulfill.prop('checked', true);
    }
    iosLightExit();
}

});

function materialLight(){
  var pop = document.getElementById("material-light");
  pop.style.display = "block";
  shade.style.display = "block";
}
function pencilname(){
  var nameform = $('#changename input[id="valuedetail"]'); //document.getElementById("nameform");
  var divname = document.getElementById("name");
  var changename = document.getElementById("changename");
  var pencilname = document.getElementById("pencilname");
  var checkname = document.getElementById("checkname");

  nameform.show();
  //nameform.style.display = 'block';
  divname.style.display = 'none';
  changename.style.display = 'block';
  pencilname.style.display = 'none';
  checkname.style.display = 'block';

  var p = changename.parentNode.nextSibling;
  p.className += " fixmarginaccount";
  //p.style.marginTop = "-23px";
}

function updatenameform(){
  var nameform = $('#changename input[id="valuedetail"]'); //document.getElementById("nameform");
  var divname = document.getElementById("name");
  var changename = document.getElementById("changename");
  var pencilname = document.getElementById("pencilname");
  var checkname = document.getElementById("checkname");
  nameform.hide();
  divname.style.display = 'initial';
  changename.style.display = 'none';
  pencilname.style.display = 'initial';
  checkname.style.display = 'none';

  var valentered = nameform.val().trim();
  var current = $('#name').html().trim();
  if(valentered && valentered!="" && current != valentered){ 
    $('#changename').submit();
  }

  var p = changename.parentNode.nextSibling;
  p.className = "accountdetail accountdetailRowMargin";

}


function pencilsurname(){
  var surnameform = $('#changesurname input[id="valuedetail"]'); //document.getElementById("surnameform");
  var divsurname = document.getElementById("surname");
  var changesurname = document.getElementById("changesurname");
  var pencilsurname = document.getElementById("pencilsurname");
  var checksurname = document.getElementById("checksurname");
  surnameform.show();
  divsurname.style.display = 'none';
  changesurname.style.display = 'block';
  pencilsurname.style.display = 'none';
  checksurname.style.display = 'block';
  var p = changesurname.parentNode.nextSibling;
  p.className += " fixmarginaccount";
}

function updatesurnameform(){
  var surnameform = $('#changesurname input[id="valuedetail"]'); // document.getElementById("surnameform");
  var divsurname = document.getElementById("surname");
  var changesurname = document.getElementById("changesurname");
  var pencilsurname = document.getElementById("pencilsurname");
  var checksurname = document.getElementById("checksurname");
  surnameform.hide();
  divsurname.style.display = 'initial';
  changesurname.style.display = 'none';
  pencilsurname.style.display = 'initial';
  checksurname.style.display = 'none';

  var valentered = surnameform.val().trim();
  var current = $('#surname').html().trim();
  if(valentered && valentered!="" && current != valentered){ 
    $('#changesurname').submit();
  }

  var p = changesurname.parentNode.nextSibling;
  p.className = "accountdetail accountdetailRowMargin";

}

function penciltel(){
  var telform = $('#changetel input[id="valuedetail"]'); //document.getElementById("telform");
  var divtel = document.getElementById("tel");
  var changetel = document.getElementById("changetel");
  var penciltel = document.getElementById("penciltel");
  var checktel = document.getElementById("checktel");
  telform.show();
  divtel.style.display = 'none';
  changetel.style.display = 'block';
  penciltel.style.display = 'none';
  checktel.style.display = 'block';
  var p = changetel.parentNode.nextSibling;
  p.className += " fixmarginaccount";
}

function updatetelform(){
  var telform = $('#changetel input[id="valuedetail"]'); //document.getElementById("telform");
  var divtel = document.getElementById("tel");
  var changetel = document.getElementById("changetel");
  var penciltel = document.getElementById("penciltel");
  var checktel = document.getElementById("checktel");
  telform.hide();
  divtel.style.display = 'initial';
  changetel.style.display = 'none';
  penciltel.style.display = 'initial';
  checktel.style.display = 'none';

  var valentered = telform.val().trim();
  var currenttel = $('#tel').html().trim();
  if(valentered && valentered!="" && currenttel != valentered){ 
    $('#changetel').submit();
  }
  var p = changetel.parentNode.nextSibling;
  p.className = "accountdetail accountdetailRowMargin";
}

function iosLight(){
  var pop = document.getElementById("ios-light");
  pop.style.display = "block";
  shade.style.display = "block";
}
function iosLight(agent,vendor,catalognumber,reqemail,location,category,qty,lab,browserlang,ownerlang){
  var actionorder = document.getElementById("actionorder");
  var orderText = document.getElementById("orderText");
  var emailform = document.getElementById("emailform");
  var agentform = document.getElementById("agentform");
  var vendorform = document.getElementById("vendorform");
  var catalogform = document.getElementById("catalogform");
  var locationform = document.getElementById("locationform");
  var categoryform = document.getElementById("categoryform");
  var qtyform = document.getElementById("qtyform");
  var labform = document.getElementById("labform");
  var langform = document.getElementById("langform");

  emailform.value = reqemail;
  agentform.value = agent;
  vendorform.value = vendor;
  catalogform.value = catalognumber;
  locationform.value = location;
  categoryform.value = category;
  langform.value = ownerlang;

  console.log("owner language is: " + ownerlang);
  console.log("browser language is: " + browserlang);

  qtyform.value = qty;
  labform.value = lab;
  var trans = ordertext + "<br/><b>" + reagenttext + ":</b> " + agent + "<br/><b>" + vendortext + ":</b> "+vendor+"<br/><b>" + catalognumbertext + ":</b> "+catalognumber;
  /*if(browserlang == "fr"){
    trans = "Vous êtes sur le point de commander <br/>Réactif: " + agent + "<br/>Vendeur: "+vendor+"<br/>Catalogue: "+catalognumber;
  }
  if(browserlang == "se"){
    trans = "Du ska just att beställa <br/>Agens: " + agent + "<br/>Försäljare: "+vendor+"<br/>Katalog: "+catalognumber;
  }*/
  orderText.innerHTML = trans;
  var pop = document.getElementById("ios-light");
  pop.style.display = "block";
  var shade = document.getElementById("shade");
  shade.style.display = "block";
  actionorder.onclick = function(){iosLightOrder(reqemail)};
}

function iosLightOrder(email){
  console.log("TODO - ordering: " + email);
  document.getElementById("orders").submit();
}
function iosDark(){
  var pop = document.getElementById("ios-dark");
  pop.style.display = "block";
  shade.style.display = "block";
}
function modernLight(){
  var pop = document.getElementById("modern-light");
  pop.style.display = "block";
  shadelight.style.display = "block";
}
function modernDark(){
  var pop = document.getElementById("modern-dark");
  pop.style.display = "block";
  shade.style.display = "block";
}
function iosLightExit(){
  var pop = document.getElementById("ios-light");
  pop.style.display = "none";
  shade.style.display = "none";
}
function modernExit(){
  var pop = document.getElementById("modern-light");
  pop.style.display = "none";
  shadelight.style.display = "none";
}
function modernDarkExit(){
  var pop = document.getElementById("modern-dark");
  pop.style.display = "none";
  shade.style.display = "none";
}
function iosDarkExit(){
  var pop = document.getElementById("ios-dark");
  pop.style.display = "none";
  shade.style.display = "none";
}
function materialLightAnime(){
  var pop = document.getElementById("material-light-anime");
  var head = document.getElementById("head-anime");
  var text = document.getElementById("text-anime");
  pop.style.display = "block";
  shade.style.display = "block";
  setTimeout(function() {
    pop.style.width = "40%";
    pop.style.height = "auto";
    pop.style.borderRadius = "2px";
  }, 800);
  setTimeout(function() {
    head.style.marginTop = "0px";
    head.style.opacity = "0.8";
  }, 1200);
  setTimeout(function() {
    text.style.marginTop = "-12px";
    text.style.opacity = "1.0";
  }, 1800);
}
function materialDarkAnime(){
  var pop = document.getElementById("material-dark-anime");
  var head = document.getElementById("head-anime-dark");
  var text = document.getElementById("text-anime-dark");
  pop.style.display = "block";
  shade.style.display = "block";
  setTimeout(function() {
    pop.style.width = "40%";
    pop.style.height = "auto";
    pop.style.borderRadius = "2px";
  }, 800);
  setTimeout(function() {
    head.style.marginTop = "0px";
    head.style.opacity = "0.8";
  }, 1200);
  setTimeout(function() {
    text.style.marginTop = "-12px";
    text.style.opacity = "1.0";
  }, 1800);
}
function exitLightAnime(){
  var pop = document.getElementById("material-light-anime");
  var head = document.getElementById("head-anime");
  var text = document.getElementById("text-anime");
  pop.style.width = "20px";
  pop.style.height = "20px";
  pop.style.borderRadius = "100%";
  shade.style.display = "none";
  setTimeout(function(){
    pop.style.display = "none";  }, 600);
    head.style.opacity = "0.0";
    head.style.marginTop = "40px";
    text.style.opacity = "0.0";
    text.style.marginTop = "20px";
}
function exitDarkAnime(){
  var pop = document.getElementById("material-dark-anime");
  var head = document.getElementById("head-anime-dark");
  var text = document.getElementById("text-anime-dark");
  pop.style.width = "20px";
  pop.style.height = "20px";
  pop.style.borderRadius = "100%";
  shade.style.display = "none";
  setTimeout(function(){
    pop.style.display = "none";  }, 600);
    head.style.opacity = "0.0";
    head.style.marginTop = "40px";
    text.style.opacity = "0.0";
    text.style.marginTop = "20px";
}
function modernLightAnime(){
  var pop = document.getElementById("modern-light-anime");
  var head = document.getElementById("modernlight-head");
  var text = document.getElementById("modernlight-text");
  pop.style.display = "block";
  shadelight.style.display = "block";
  setTimeout(function() {
    //pop.style.transform ="translate3d(0px ,0px ,0px)";
    pop.style.top = "40%";
    pop.style.opacity = "1.0";
    head.style.top = "-120px";
}, 800);
  setTimeout(function() {
    head.style.top = "-120px";
  }, 1000);
  setTimeout(function() {
    text.style.top = "-140px";
  }, 1000);

}
function modernDarkAnime(){
  var pop = document.getElementById("modern-dark-anime");
  var head = document.getElementById("moderndark-head");
  var text = document.getElementById("moderndark-text");
  pop.style.display = "block";
  shade.style.display = "block";
  setTimeout(function() {
    //pop.style.transform ="translate3d(0px ,0px ,0px)";
    pop.style.top = "40%";
    pop.style.opacity = "1.0";
    head.style.top = "-120px";
}, 800);
  setTimeout(function() {
    head.style.top = "-120px";
  }, 1000);
  setTimeout(function() {
    text.style.top = "-140px";
  }, 1000);

}
function modernlightanimatedExit(){
  var pop = document.getElementById("modern-light-anime");
  var head = document.getElementById("modernlight-head");
  var text = document.getElementById("modernlight-text");
  pop.style.top = "60%";
  pop.style.opacity = "0.0";
  head.style.top = "-60px";
  setTimeout(function() {
    //pop.style.transform ="translate3d(0px ,0px ,0px)";
    shadelight.style.display = "none";
    pop.style.display = "none";

}, 800);
  setTimeout(function() {

  }, 1000);
  setTimeout(function() {
  }, 1200);

}
function moderndarkanimatedExit(){
  var pop = document.getElementById("modern-dark-anime");
  var head = document.getElementById("moderndark-head");
  var text = document.getElementById("moderndark-text");
  pop.style.top = "60%";
  pop.style.opacity = "0.0";
  head.style.top = "-60px";
  setTimeout(function() {
    //pop.style.transform ="translate3d(0px ,0px ,0px)";
    shade.style.display = "none";
    pop.style.display = "none";

}, 800);
  setTimeout(function() {

  }, 1000);
  setTimeout(function() {
  }, 1200);

}
function Exit(){
  var pop = document.getElementById("material-light");
  pop.style.display = "none";
  shade.style.display = "none";
}
function materialDark(){
  var pop = document.getElementById("material-dark");
  pop.style.display = "block";
  shade.style.display = "block";
}
function exitDark(){
  var pop = document.getElementById("material-dark");
  pop.style.display = "none";
  shade.style.display = "none";
}

function About(){
  var v =document.getElementById("aboutpage");
  v.style.display= "block";
}
function aboutExit(){
  var v =document.getElementById("aboutpage");
  v.style.display= "none";
}