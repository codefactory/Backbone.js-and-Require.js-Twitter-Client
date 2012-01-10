/*
 * sessionStorage.user_id, sessionStorage.screen_name 이 있으면
 * 로그인 상태이며 html 태그의 class에 login을 추가함 - 이 클래스로 초기화면에 로그인 버튼 출력유무 결정됨
 */
if (sessionStorage.user_id && sessionStorage.screen_name) {
	var className = document.documentElement.className;
	className += ' login';
	document.documentElement.className = className;
}
