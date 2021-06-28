var rellax = new Rellax('.js-rellax');
var API_RANK = "https://script.google.com/macros/s/AKfycbyw1fZwRPEAvlqMxsE6U1BVzl-zsbEXJkJ7HRas7SaooNE2xg/exec";
var API_COMMENT = "https://script.google.com/macros/s/AKfycbwDIV8Dft3RpEvoUYaut8zF87oYTRAoAUcGmXOxiKfh6r3qFk3k/exec";

var RANKING = [];
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
      jQuery.extend(true, RANKING, json)
      json = return_sort(json);
      //console.log(json);
      $.each(json,function(i,val){
        // if(i<20&&val.rank<=20){
        //   (i<3)? RANKS_HIGH.push(val):RANKS_LOW.push(val);
        // }

        var str = "";
        str += '<dd>'+comma(val.count)+'票</dd>';
        str += '<dt>';
        str += '<span>'+(i+1)+'位</span>'
        str += '<h4>'+val.title+'</h4>';
        str += '<p>'+val.artist+'</p>';
        str += '</dt>';

        var $dl = $("<dl>").addClass("ranking").append(str).on("click",function(){
          if(val.url.length > 0) open( val.url, "_blank" );
        });

        if(i<10){
          $(".top3").append($dl);
          if(!val.status) $(".top3").hide();
        }else if(i<20){
          $(".top20").append($dl);
          if(!val.status) $(".top20").hide();
        }else{
          $(".top30").append($dl);
          if(!val.status) $(".top30").hide();
        }

      });
      
      // var $high_rank = $(".top3");
      // var $low_rank = $(".low_rank");


      // $.each(RANKS_HIGH,function(i,val){
      //   var str = "";
      //   str += '<dd>'+comma(val.count)+'票</dd>';
      //   str += '<dt>';
      //   str += '<h4>'+val.title+'</h4>';
      //   str += '<p>'+val.artist+'</p>';
      //   str += '</dt>';

      //   var $dl = $("<dl>").addClass("ranking").append(str).on("click",function(){
      //     if(val.url.length > 0) open( val.url, "_blank" );
      //   });

      //   $high_rank.append($dl);
      // });

      // $.each(RANKS_LOW,function(i,val){
      //   var str = "";
      //   str += '<dt>';
      //   str += '<h4>'+val.title+'</h4>';
      //   str += '<p>'+val.artist+'</p>';
      //   str += '</dt>';
      //   str += '<dd>'+comma(val.count)+'票</dd>';

      //   var $dl = $("<dl>").addClass("ranking fade fade_off").append(str).on("click",function(){
      //     open( val.url, "_blank" ) ;
      //   });

      //   $low_rank.append($dl);
      // });
      request_comments();
      request_form();
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
        if(val.number==0){
          $("#comment").hide();
          return false;
        }
        var str = "";
        str += '<p class="fade fade_off">'+val.comment+'</p>';
        $commentIn.append(str);
      });
    }
  })
}


// フォーム
function request_form(){
  var canAjax = true;
  var item = "";
  $.each(RANKING,function(i,val){
    if(i==0) item += '<option value=""></option>';
    item += '<option value="'+val.title+'">'+val.title+'</option>';
  });

  $("#songlist01,#songlist02,#songlist03").html(item);
  $("#songlist01,#songlist02,#songlist03").flexselect();
  $("#songlist01_flexselect,#songlist02_flexselect,#songlist03_flexselect").val("").attr("placeholder","曲を選択・入力してください");

  $("#songlist01_flexselect,#songlist02_flexselect,#songlist03_flexselect").css({
      "width":"100%",
      "border":"1px solid rgba(20,20,20,.2)",
      "padding":"15px"
    }
  );

  $('#voteform').submit(function (event) {
    var sl01 = $("#songlist01_flexselect").val();
    var sl02 = $("#songlist02_flexselect").val();
    var sl03 = $("#songlist03_flexselect").val();
    event.preventDefault();
    if (sl01 == "" || sl02 == "" || sl03 == "") {
      alert("楽曲を選択してください。");
      return;
    }
    var $form = $(this);
    if (!canAjax) {
      console.log('通信中');
      return;
    }
    canAjax = false;
    $.ajax({
      url: $form.attr('action'),
      type: $form.attr('method'),
      data: $form.serialize()
    })
      .done(function (item) {
        if (item == 0) {
          if (!alert("投票ありがとうございました！")) {
            location.reload();
          }
        } else if (item == 1) {
          alert("投票は１日１回までです。");
        } else {
          alert("投票内容にエラーがあります。");
        }
      })
      .fail(function () {
        console.log("falt");
      }).always(function () {
        canAjax = true;
      });
  });
}

/*======================================
getter/setter
======================================*/

//　並び替え
function return_sort(v){
  return v.sort(function(a, b) {
    if (a.count < b.count) {
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