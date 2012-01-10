// configure paths
require.config({
	paths: {
		jquery: 'libs/jquery/jquery-1.7.1',
		jqueryTmpl: 'libs/jquery/jquery.tmpl',
		underscore: 'libs/underscore/underscore',
		backbone: 'libs/backbone/backbone-optamd3-min',
		text: 'libs/require/text'
	}
});

require([
	'jquery',
	'underscore',
	'backbone',
	'router',
	'libs/jquery/jquery.textshadow',
	'libs/spin'
], function ($, _, Backbone, AppRouter) {
	
	/*
	 * 기본 준비
	 */
		// ajax 요청 중인지 나타냄
		var requesting;
		
		// ajax spinner
		$.ajaxSetup({
			beforeSend: function () {
				if ($('#ajax_spinner').length) {
					$('#ajax_spinner').show();
				} else {
					var spinner = new Spinner().spin(document.body);
					spinner.el.id = 'ajax_spinner';
				}
				
				requesting = true;
			},
			complete: function () {
				$('#ajax_spinner').hide();
				
				requesting = false;
			}
		});
		
		// screen_name 표시
		$('#user').find('span.screen_name').text(sessionStorage.screen_name);
	
	
	/*
	 * app 실행
	 */
		var appRouter = new AppRouter;
		Backbone.history.start();
	
	/*
	 * 이벤트 핸들러 등록
	 */
		// 프로필 이미지에 마우스 올렸을 때 자기소개 말풍선 띄움
		$('#timeline').on('mouseenter', '#result a.img', function () {
			var tooltip = $(this).closest('li').find('div.tooltip');
			
			if (tooltip.text()) {
				tooltip.css({
					opacity: 1,
					zIndex: 1
				});
			}
		});
		$('#timeline').on('mouseleave', '#result a.img', function () {
			$(this).closest('li').find('div.tooltip').css({
				opacity: 0,
				zIndex: -1
			});
		});
		
		// 검색
		$('#search_form').on('submit', function (e) {
			e.preventDefault();
			
			if (!$('#search_txt').val()) {
				alert('검색어를 입력해주세요');
				$('#search_txt').focus();
				return;
			}
			
			appRouter.navigate('!/search/' + $('#search_txt').val(), true);
		});
		
		// unlimited scroll
		$(window).on('scroll', function () {
			var self = $(this);
			
			// scroll이 바닥에 닿으면 트윗 요청
			if (document.documentElement.scrollHeight - self.scrollTop() == self.outerHeight()) {
				if (!requesting) {	// IE에서 스크롤 바닥에 닿으면 두 번 실행되는 것을 막기 위해 ajax 요청 중이 아닐 때만 실행
					appRouter.loadTweets(++(appRouter.fetchOptions.data.page), appRouter.mode);
				}
			}
		});
		
		// 홈 타임라인 보기
		$('#view_home_timeline').on('click', function () {
			appRouter.navigate('!/' + sessionStorage.screen_name, true);
		});
		
		// 로그아웃
		$('#logout').on('click', function () {
			delete sessionStorage.screen_name;
			delete sessionStorage.user_id;
			
			location = './';
		});
		
	
	/*
	 * IE fix polyfills
	 */
		// 로그인 버튼 클릭
		$('#login_btn').on('click', function () {
			location = $(this).parent().attr('href');
		});
	
		// css text-shadow
		if (!Modernizr.textshadow) {
			$('#header').find('h1').textshadow('0 1px 1px white');
		}
	
});
