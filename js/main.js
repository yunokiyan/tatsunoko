var rellax = new Rellax('.js-rellax');
var API_RANK = "https://script.google.com/macros/s/AKfycbyThDKNS2BPdBXFP9Q5oYg3iOWQFqtEcvxzWM49w62s_P6v3u0b/exec";
var API_COMMENT = "https://script.google.com/macros/s/AKfycbwDIV8Dft3RpEvoUYaut8zF87oYTRAoAUcGmXOxiKfh6r3qFk3k/exec";

var RANKS_HIGH = [];
var RANKS_LOW = [];
var COMMENT = [];

$(function() {
  var timeout = 1000;
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
  request_rank();
  request_comments();
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



/*======================================
リクエストと生成
======================================*/

// ランキング
function request_rank(){
	$.ajax({
		type: 'GET',
		url: API_RANK,
		dataType: 'jsonp',
		jsonpCallback: 'jsondata',
		success: function(json){
      $.each(json,function(i,val){
        if(val.rank<=20){
          (val.rank<=3)? RANKS_HIGH.push(val):RANKS_LOW.push(val);
        }
      });
      return_sort(RANKS_HIGH);
      return_sort(RANKS_LOW);
      
      var $high_rank = $(".top3");
      var $low_rank = $(".low_rank");

      $.each(RANKS_HIGH,function(i,val){
        var str = "";
        str += '<dl class="ranking">';
        str += '<dd>'+comma(val.count)+'票</dd>';
        str += '<dt>';
        str += '<h4>'+val.title+'</h4>';
        str += '<p>'+val.artist+'</p>';
        str += '</dt>';
        str += '</dl>';

        $high_rank.append(str);
      });

      $.each(RANKS_LOW,function(i,val){
        var str = "";
        str += '<dl class="ranking fade fade_off">';
        str += '<dt>';
        str += '<h4>'+val.title+'</h4>';
        str += '<p>'+val.artist+'</p>';
        str += '</dt>';
        str += '<dd>'+comma(val.count)+'票</dd>';
        str += '</dl>';

        $low_rank.append(str);
      });

    }
  })
}


// コメント
function request_comments(){
	$.ajax({
		type: 'GET',
		url: API_COMMENT,
		dataType: 'jsonp',
		jsonpCallback: 'jsondata',
		success: function(json){
      COMMENT = json;
      var $commentIn = $(".commentIn");
      
      $.each(COMMENT,function(i,val){
        var str = "";
        str += '<p class="fade fade_off">'+val.comment+'</p>';
        $commentIn.append(str);
      });
    }
  })
}


/*======================================
getter/setter
======================================*/

//　並び替え
function return_sort(v){
  return v.sort(function(a, b) {
    if (a.rank > b.rank) {
      return 1;
    } else {
      return -1;
    }
  });
};

// ゼロパディング
function padZero(v) {
  if (v < 10) {
    return "0" + v;
  } else {
    return v;
  }
}

// 3桁区切り
function comma(num) {
  return String(num).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
}