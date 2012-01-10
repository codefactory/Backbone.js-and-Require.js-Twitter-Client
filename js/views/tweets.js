define([
	'jquery',
	'underscore',
	'backbone',
	'text!templates/tweet.html',
	'views/tweet',
	'jqueryTmpl'
], function ($, _, Backbone, tweetTemplate, TweetView) {
	
	/*
	 * tweets view
	 * collection이 fetch되어 reset 이벤트가 발생하면 tweet view에 tweet model 데이터를 넣어서 view를 만들고 this.el에 append해서 화면에 출력함
	 */
	var TweetsView = Backbone.View.extend({
		
		// tweet들을 넣을 ul
		el: $('#result'),
		
		initialize: function () {
			_.bindAll(this, 'render');		// render 메서드는 어디서 실행되든 this가 이 view를 가리키게 설정
			this.model.bind('reset', this.render);		// collection이 fetch되면 render 메서드 실행되게 함
		},
		
		render: function () {
			var view = this,
				data = this.model.toJSON(),		// collection이 fetch된 데이터
				fragment = document.createDocumentFragment();	// append 할때 사용할 documentFragment
			
			// data에는 tweet 객체들이 들어 있음
			$(data).each(function (index, item) {
				if (item.text) {	// text가 있을때만 정상적인 트윗으로 생각함
					var tweetView = new TweetView({model: item});	// tweet view를 만듬
					fragment.appendChild(tweetView.render().el.get(0));		// fragment에 계속 넣음
				}
			});
			
			// each 반복이 끝나면 만들어진 fragment를 this.el에 넣음
			this.el.append(fragment.cloneNode(true));
			
			return this;
		}
		
	});
	
	return TweetsView;
	
});
