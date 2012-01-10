<?php
session_start();
require_once('twitteroauth/twitteroauth.php');
require_once('config.php');

/*
 * 	- Case -
 * 
 * 	login_request: 로그인 요청
 * 	login_complete: 로그인 완료, sessionStorage에 user_id, screen_name 저장
 * 	logout: 로그아웃, sessionStorage 비움
 * 	home_timeline: 홈타임라인 얻기
 * 
 */

switch($_GET['mode'])
{
	case "login_request":
		
		$_SESSION['callback_url'] = $_GET['callback_url'];
		
		/* Build TwitterOAuth object with client credentials. */
		$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET);
		 
		/* Get temporary credentials. */
		$request_token = $connection->getRequestToken(OAUTH_CALLBACK);
		
		/* Save temporary credentials to session. */
		$_SESSION['oauth_token'] = $token = $request_token['oauth_token'];
		$_SESSION['oauth_token_secret'] = $request_token['oauth_token_secret'];
		 
		/* If last connection failed don't display authorization link. */
		switch ($connection->http_code) {
			case 200:
		    	/* Build authorize URL and redirect user to Twitter. */
		    	$url = $connection->getAuthorizeURL($token);
		    	header('Location: ' . $url); 
		    	break;
		  	default:
		    	/* Show notification if something went wrong. */
		    	echo 'Could not connect to Twitter. Refresh the page or try again later.';
		}
		
		break;
		
	case "login_complete":
		
		/* If the oauth_token is old redirect to the connect page. */
		if (isset($_REQUEST['oauth_token']) && $_SESSION['oauth_token'] !== $_REQUEST['oauth_token']) {
		  	$_SESSION['oauth_status'] = 'oldtoken';
		  	header('Location: ./api.php?mode=logout');
		}
		
		/* Create TwitteroAuth object with app key/secret and token key/secret from default phase */
		$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $_SESSION['oauth_token'], $_SESSION['oauth_token_secret']);
		
		/* Request access tokens from twitter */
		$access_token = $connection->getAccessToken($_REQUEST['oauth_verifier']);
		
		/* Save the access tokens. Normally these would be saved in a database for future use. */
		$_SESSION['access_token'] = $access_token;
		
		/* Remove no longer needed request tokens */
		unset($_SESSION['oauth_token']);
		unset($_SESSION['oauth_token_secret']);
		
		/* If HTTP response is 200 continue otherwise send to connect page to retry */
		if (200 == $connection->http_code) {
		  	/* The user has been verified and the access tokens can be saved for future use */
		  	$_SESSION['status'] = 'verified';
		  
		  	/* Get user access tokens out of the session. */
			$access_token = $_SESSION['access_token'];
			
			/* Create a TwitterOauth object with consumer/user tokens. */
			$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
			
			/* If method is set change API call made. Test is called by default. */
			$content = $connection->get('account/verify_credentials');
			
			// sessionStorage에 저장하고 callback_url로 이동
			echo "<script>
					sessionStorage.user_id = '$content->id_str';
					sessionStorage.screen_name = '$content->screen_name';
					location = '$_SESSION[callback_url]';
				</script>";
		} else {
		  	/* Save HTTP status for error dialog on connnect page.*/
		  	header('Location: ./api.php?mode=logout');
		}
		
		break;
		
	case "logout":
		
		if (!empty($_GET['callback_url']))
		{
			$_SESSION['callback_url'] = $_GET['callback_url'];
		}
		
		$callback_url = $_SESSION['callback_url'];
		
		session_destroy();
		
		// sessionStorage 비우고 callback_url로 이동
		echo "<script>
				if (sessionStorage && sessionStorage.user_id) {
					delete sessionStorage.user_id;
				}
				if (sessionStorage && sessionStorage.screen_name) {
					delete sessionStorage.screen_name;
				}";
		if (!empty($callback_url))
		{
			echo "location = '$callback_url'";
		}
		else
		{
			echo "history.back()";
		}
		echo "</script>";
		
		break;
		
	case "home_timeline":
		
		/* Get user access tokens out of the session. */
		$access_token = $_SESSION['access_token'];
		
		/* Create a TwitterOauth object with consumer/user tokens. */
		$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
		
		/* If method is set change API call made. Test is called by default. */
		$options = array('page' => $_GET['page']);
		$content = $connection->get('statuses/home_timeline', $options);
		
		echo json_encode($content);
		
		break;
		
	case "search":
		
		/* If method is set change API call made. Test is called by default. */
		$options = array('page' => $_GET['page'], 'q' => $_GET['q'], 'rpp' => 20);
		$url = 'http://search.twitter.com/search.json?q='.urlencode($_GET['q']).'&rpp=20&page='.$_GET['page'];
		
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
		$contents = curl_exec($ch);
		curl_close($ch);
		
		$contents = json_decode($contents, true);
		
		echo json_encode($contents['results']);
		
		break;
}
