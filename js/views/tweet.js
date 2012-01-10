define([
	'underscore',
	'backbone',
	'models/tweet',
	'text!templates/tweet.html',
	'jqueryTmpl'
], function (_, Backbone, TweetModel, tweetTemplate) {
	
	/*
	 * tweet view
	 * tweet template을 설정하고 render가 실행되면 this.el을 만들고 this를 리턴
	 * tweets view에서 tweet view를 만듬
	 */
	var TweetView = Backbone.View.extend({
		
		model: TweetModel,
		
		initialize: function () {
			
		},
		
		render: function () {
			
			var text = this.model.text,
				re = /((http|https):\/\/[\w?=&.\/-;#~%-]+(?![\w\s?&.\/;#~%"=-]*>))/g;
        	this.model.text = text.replace(re, '<a href="$1" target="_blank">$1</a>');
			
			var item = $.tmpl(tweetTemplate, this.model);
			this.el = item;
			
			return this;
		}
		
	});
	
	return TweetView;
	
});
