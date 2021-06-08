var rellax = new Rellax('.js-rellax');

$(function() {

  var timeout = 0;

  setTimeout(function(){
    $(".loader").hide();
    var i = 0;
    var canvas = setInterval(function(){
      $("#projector").css("opacity",i/100);
      i++
      if(i==100){
        clearInterval(canvas);
        setTimeout(function(){
          $("#wrapper").addClass("fade_on");
        },timeout/2)
      }
    },5);
  },timeout);

  fade_on();

});


function fade_on(){
  $(window).scroll(function (){
    $(".fade").each(function(i){
      var imgPos = $(this).offset().top;
      var scroll = $(window).scrollTop();
      var windowHeight = $(window).height();
      if (scroll > imgPos - windowHeight + windowHeight/5){
        $(this).addClass("fade_on");
      } else {
        $(this).removeClass("fade_on");
      }
    });
  });
}