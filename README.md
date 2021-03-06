Backbone.js와 Require.js를 사용해서 만든 간단한 Twitter Client입니다.
데모는 http://codefactory.kr/examples/backbone-twitter-client 에서 보실 수 있습니다.

다음과 같은 기능을 가지고 있습니다.

1. OAuth로 트위터 로그인 - twitteroauth 라이브러리 사용(https://github.com/abraham/twitteroauth)
2. 자신의 홈 타임라인 보기
3. 트윗 검색

소스코드가 좀 많이 안좋지만 혹시라도 참고하실 분은 아무런 제약없이 사용하셔도 됩니다.

사용하실 때에는 다음의 사항을 상황에 맞게 고쳐주십시오

1. index.html에 callback_url=http://codefactory.kr/examples/backbone-twitter-client 라는 부분이 있습니다. 여기에서  http://codefactory.kr/examples/backbone-twitter-client를 수정해 주십시오. 예를 들어, 소스코드를 올려놓은 url이 http://aaa.com/test 이시라면 callback_url=http://aaa.com/test/index.html 로 바꿔주시면 됩니다.
2. /API/config.php의 내용을 바꿔주십시오 CONSUMER_KEY와 CONSUMER_SECRET은 트위터에서 발급받으신 것으로 바꿔주시면 됩니다. OAUTH_CALLBACK은 1번과 같은 방법으로, url이 http://aaa.com/test 이시라면 http://aaa.com/test/API/api.php?mode=login_complete 로 바꿔주시면 됩니다.

[참고] API 디렉토리가 https://github.com/abraham/twitteroauth 에서 다운로드 받은 twitteroauth 라이브러리입니다. 저는 라이브러리 파일은 수정하지 않고 config.php 안의 값만 수정하여 사용하고, 제가 필요한 기능들은 api.php 을 따로 만들어서 사용하고 있습니다. 그래서 디렉토리 내에 있는 config.php와 twitteroauth 디렉토리를 제외한 다른 파일들은 지우셔도 됩니다.
