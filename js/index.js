$("#login-button").click(function (event) {



});

$("#submit-button").click(function (event) {
	event.preventDefault();
	window.location = "/registration.html";
	//$('form').fadeOut(500);
	//$('.wrapper').addClass('form-success');
});

$("#signup-button").click(function (event) {
if (null==document.getElementById("email")){
	alert('Email ID is Empty');
	event.preventDefault();
}

if (null==document.getElementById("psw")){
	alert('Password is Empty');
	event.preventDefault();
}
});