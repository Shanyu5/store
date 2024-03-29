var template_virtualdata = $("input[name=_template_virtualdata]").val();
var template_showsales = $("input[name=_template_showsales]").val();
var curr_time = $("input[name=_curr_time]").val();

$(function() {
    //排序点击
    $(".goods_sort .item").on("click",function(){
       var sort = $(this).data("order"); //获取排序类型
       if(!sort){
           return false;
       }
       var sort_type = $(this).data("sort"); //获取类型
       if(sort_type == "DESC")
       {
           var sort_type_new = "ASC";
       }else{
           var sort_type_new = "DESC";
       }

        //移除其他已点击
        $(".goods_sort div").attr("class","item item-price");
        $(this).addClass(sort_type); 
        $(this).data("sort",sort_type_new);
        $('.goods_sort div').removeClass('on');
        $(this).addClass("on");
        $("input[name=_sort_type]").val(sort);
        $("input[name=_sort]").val(sort_type);
        get_goods();
    });
    if ($(".swiper-wrapper .content-slide").length > 1) {
        var swiper = new Swiper('.swiper-container', {
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
              return '<span class="' + className + '">' + (index + 1) + '</span>';
            },
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },
            mousewheel: true,
            keyboard: true,
            // loop:true,
        });
        $(".swiper-button-next").show();
        $(".swiper-button-prev").show();
    }  
    jQuery(function ($) {
        $(window).resize(function () {
            var width = $('#js-com-header-area').width();
            $('.touchslider-item a').css('width', width);
            $('.touchslider-viewport').css('height', 200 * (width / 640));
        }).resize();
    });

    if(template_virtualdata == 1){
        ka();
    }

    get_goods();
    $(".get_cat").on("click",function()
    {
        var cid = $(this).data("cid");
        var name = $(this).data("name");
        if($(this).hasClass("shop_active")){
            //return false;
        }
        $('.device .content-slide a').removeClass('shop_active');
        $("input[name=kw]").val("");
        $("input[name=_cid]").val(cid);
        $("input[name=_cidname]").val(name);
        get_goods();
        $(this).addClass('shop_active');
		history.replaceState({}, null, './?cid='+cid);
    });
    //点击搜索拦截
    $("#goods_search").submit(function(e){
      var km = $("input[name=kw]").val();
      if(km == "")
      {
          layer.msg("请输入关键词进行查询");
          return false;
      }
      $("input[name=_cid]").val("");
      $("input[name=_cidname]").val("");
    $(".catname_show").html("正在获取数据");
    $(".show_class").hide();
    $('.device .content-slide a').removeClass('shop_active');
      get_goods();
     document.activeElement.blur();
      return false;
    });
    
    if($.cookie('goods_list_style') == 'list'){
        $("#listblock").data("state","gongge");
        $("#listblock").removeClass("icon-sort");
        $("#listblock").addClass("icon-app");
        $("#goods-list-container").removeClass("block three");
    }
    
    /*点击切换风格*/
    $("#listblock").on("click",function(){
        var index = layer.msg('加载中', {
          icon: 16
          ,shade: 0.01
        });
        var attr = $(this).data("state");
        if(attr == 'gongge'){
            $(this).data("state","list");
            $(this).removeClass("icon-app");
            $(this).addClass("icon-sort");
            $("#goods-list-container").addClass("block three");
        }else{
            $(this).data("state","gongge");
            $(this).removeClass("icon-sort");
            $(this).addClass("icon-app");
            $("#goods-list-container").removeClass("block three");
        }
        //设置cookie
        var cookietime = new Date(); 
        cookietime.setTime(cookietime.getTime() + (86400));
        $.cookie('goods_list_style', attr, { expires: cookietime });
        layer.close(index);
    });
        
    //弹窗广告
    if( !$.cookie('op')){
        $('.tzgg').show();
        $.cookie('op', false, { expires: 1});
    }
    
        /**
     * 兼容iphone
     * @type {number | boolean | *}
     */
    var isIphoneX = window.devicePixelRatio && window.devicePixelRatio === 3 && window.screen.width === 375 && testUA('iPhone');

    if (isIphoneX && window.history.length <= 2) {
        // document.body.classList.add('fix-iphonex-bottom');
//        $(".fui-navbar,.cart-list,.fui-footer,.fui-content.navbar").addClass('iphonex')
        $(".fui-navbar").css("bottom", "0px");
    } else {
        $(".fui-navbar,.cart-list,.fui-footer,.fui-content.navbar").removeClass('iphonex');
    }
});

function ka() {
	setInterval("get_data()",6000);
}
function get_data() {
	$.ajax({
		type : "get",
		url : "./other/getdatashow.php",
		async: true,
		dataType : 'json',
		success : function(data) {
			if(data.code==1){
				$('#xn_text').text(data.text+" "+data.time+'前');
				$('#xn_text').fadeIn(1000);
				setTimeout("$('#xn_text').fadeOut(1000);",4000);
			}
		}
	});
}



function testUA(str) {
    return navigator.userAgent.indexOf(str) > -1
}

function load(text="加载中")
{
    var index = layer.msg(text, {
        icon: 16
        ,shade: 0.01
    });  
}

//获取商品
function get_goods(){
    $("#goods_list").remove();
    $(".flow_load").append("<div id=\"goods_list\" ></div>");
    layui.use(['flow'], function(){
        var flow = layui.flow;
        var cid  = $("input[name=_cid]").val();
        var name  = $("input[name=_cidname]").val();
        var kw = $("input[name=kw]").val();
        var sort_type = $("input[name=_sort_type]").val();
        var sort = $("input[name=_sort]").val();
        var mb = testUA('Safari')?180:100;
        var end = kw?"没有更多数据了":" ";
        limit = 9
        if(name != "")
        {
            load();
        }
        //写入数据
        $(".show_class").show();  
        flow.load({
                elem: '#goods_list' //流加载容器
                ,isAuto:true
                ,mb:mb
                ,isLazyimg:true
                ,end:end
                ,done: function(page, next){ //执行下一页的回调
                    var lis = [];
                    //以jQuery的Ajax请求为例，请求下一页数据（注意：page是从2开始返回）
                    $.ajax({
                    type : "post",
                    url : "./ajax.php?act=gettoolnew",
                    data : {page:page,limit:limit,cid:cid,kw:kw,sort_type:sort_type,sort:sort},
                    dataType : 'json',
                    success : function(res) {
							$(".tag_name").hide();
							$(".tag_name ul").html("");
                            //假设你的列表返回在data集合中
                            layui.each(res.data, function(index, item){
                                if(!item.shopimg){
                                    item.shopimg="./assets/store/picture/error_img.png"
                                }
                                if(item.show_tag){
                                    show_tag = item.show_tag;
                                }else{
                                    if((curr_time-(item.addtime)) <= 259200)
                                    {
                                        show_tag = "新款";
                                    }else{
                                        show_tag = "";
                                    }
                                }
                            //显示商品标签
                                show_tag_html = "";
                                if(show_tag){
                                    show_tag_html = '<div style="transform: rotate(-45deg);background-color: #FF0000;color:#FFFFFF;width: 100px;text-align: center;margin-top: 15px;margin-left: -27px;font-size: 14px;position: absolute;">'+show_tag+'</div>';
                                }
                                
                                if(!item.prices){
                                    show_tag_py='';
                                }
                                if(item.prices){
                                    show_tag_py = '<p style="font-size: 0.62rem;position:absolute;margin-left:28%;font-weight: 300;color:#ff5555;">该商品批发有优惠</p>';
                                }
                            //是否支持倍拍
                                if(item.multi == 1){
                                    beipai = ' | 可倍拍';
                                }else{
                                    beipai = '';
                                }
							//每份数量显示
                                if(item.value == 25 || item.value == 1 || item.value == 0){
                                    shuliang = '';
                                }else{
                                    shuliang = '<div style="line-height:0.7rem;height:0.7rem;color:#0000FF;font-size:0.6rem;margin-top: .2rem;">每份数量：'+item.value+'个'+beipai+''+show_tag_py+'</div>';
                                }
                            //显示库存数量
                                var shoukong = '';
                                var kucun = '';
                                if(item.is_stock_err == 1){
                                    shoukong = '<img  class="lazy" lay-src="./assets/store/picture/ysb.png" alt="" style="width:100%;top: 0;position: absolute;height:100%">';
                                }
                                
                                if(item.stock > 0){
                                    kucun = '<p class="" style="font-size: 0.62rem;position:absolute;margin-left:28%;font-weight: 300;color:#000000;">库存:'+item.stock+'份</p>';
                                }else if(item.stock == null){
                                    kucun = '<p class="" style="font-size: 0.62rem;position:absolute;margin-left:28%;font-weight: 300;color:#000000;">库存:充足</p>';
                                }
                                if(item.close == 1){
                                    kucun = '<p class="" style="font-size: 0.62rem;position:absolute;margin-left:28%;font-weight: 300;color:#000000;">库存:无货</p>';
                                }
								if(template_showsales == 1){
									sales = '<div style="border-radius: 4px 0 0 4px;text-align:center;padding: 1px;background-color: rgb(57, 61, 73,0.5);color: #FFFFFF;text-align: center;font-size: 10px;position: absolute;right: 1px;bottom: 1px;"><i class="layui-icon layui-icon-fire" style="font-size:10px;"></i>'+item.sales+'</div>';
								}
                            //购买按钮
                                if(item.price <=0){
                                    buy = '<span class="buy" style="color:#fff;background:#99cc31;position: absolute; right: 0;">领取</span>';
                                }else{
                                    buy = '<span class="buy" style="color:#fff;background:#1492fb;position: absolute; right: 0;">购买</span>';
                                }
                                if(item.stock == 0){
                                    buy = '<span class="buy" style="color:#fff;background:#ff0000;position: absolute; right: 0">缺货</span>';
                                }
								if(item.close == 1){
                                    buy = '<span class="buy" style="color:#fff;background:#ff0000;position: absolute; right: 0">已下架</span>';
                                }
								//html商品输出
								if(item.shopimg == 0){
								    lanmei_a = '<a class="fui-goods-item" title="'+item.name+'" href="javascript:void(0)">'
								    lanmei_b = ''
								    lanmei_c = '<div class="detail" style="height:unset;"><div class="name" style="color: #000000;"><center>'+item.name+'</center></div>'
								    lanmei_d = ''
								    lanmei_e = ''
								    lanmei_f = '</div></a>'
								}else {
								    lanmei_a = '<a class="fui-goods-item" title="'+item.name+'" href="./?mod=buy&tid='+item.tid+'">'
								    lanmei_b = '<div class="image">'+show_tag_html+'<img class="lazy" lay-src="'+item.shopimg+'" src="./assets/store/picture/loadimg.gif" alt="'+item.name+'">'+shoukong+'</div>'
								    lanmei_c = '<div class="detail" style="height:unset;"><div class="name" style="color: #000000;">'+item.name+'</div>'
								    lanmei_d = ''+shuliang+''
								    lanmei_e = '<div class="price" style="margin-top: 0.9rem;"><span class="minprice" style="color: #ff5555;font-size: 0.7rem">￥'+item.price+'</span>'+kucun+''+buy+'</div>'
								    lanmei_f = '</div></a>'
								}
								    html = ''+lanmei_a+''+lanmei_b+''+lanmei_c+''+lanmei_d+''+lanmei_e+''+lanmei_f+'';
                                lis.push(html);
                            });
                            if(name == "")
                            {
                                $(".catname_show").html('<font style="color:#ed414a;">--↓选好分类后往下划↓--</font>');
                            }else{
                                $(".catname_show").html('<font style="color:#ed414a;">--↓选好分类后往下划↓--</font>');
                            }
                            if(kw != ""){
                                $(".catname_show").html('<font style="color:#ed414a;">--↓选好分类后往下划↓--</font>');
                            }
                            layer.closeAll();
                            next(lis.join(''), page < res.pages);
                        },
                        error:function(data){
                            layer.msg("获取数据超时");
                            layer.close(index);
                            return false;
                        }
                });
                }
          });
        
    });
}

var audio_init = {
	changeClass: function (target,id) {
       	var className = $(target).attr('class');
       	var ids = document.getElementById(id);
       	(className == 'on')
           	? $(target).removeClass('on').addClass('off')
           	: $(target).removeClass('off').addClass('on');
       	(className == 'on')
           	? ids.pause()
           	: ids.play();
   	},
	play:function(){
		document.getElementById('media').play();
	}
}
if($('#audio-play').is(':visible')){
	audio_init.play();
}

/*layui.use(['util'], function(){
    var util = layui.util;
    //固定块客服
    util.fixbar({
        bar1: true
        ,bar2: true
        ,css: {right:8,bottom: '25%','z-index':1}
        ,bgcolor: '#393D49'
        ,click: function(type){
          if(type === 'bar1'){
            window.location.href = ("./?mod=kf");
          } else if(type === 'bar2') {
            window.location.href = ("./?mod=articlelist");
          }
        }
    });
});*/