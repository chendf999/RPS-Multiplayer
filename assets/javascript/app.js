
$(document).ready(function(){

// firebase.initializeApp(config);
var database = firebase.database();

var noplayer = 'No one :-(';
var myname = sessionStorage.getItem('myname');

var player1;
var player2;
var rps1;
var rps2;

var chat_messages = [];

/*-------------------------------------
| on user leave
-------------------------------------*/

window.onbeforeunload = function () {
	if(myname === player1 ){
		database.ref('p1').remove();
	} else if (myname === player2){
		database.ref('p2').remove();
	}
};

/*-------------------------------------
| initial setup
-------------------------------------*/

database.ref().on('value', function(snapshot){

	var p1exists = snapshot.child('p1').exists();
	var p2exists = snapshot.child('p2').exists();

	if (p1exists && p2exists) {
		player1 = snapshot.val().p1.name;
		player2 = snapshot.val().p2.name;
		rps1 = snapshot.val().p1.rps;
		rps2 = snapshot.val().p2.rps;
		$('#enter-name').hide();
	}
	else if (p1exists && !p2exists) {
		player1 = snapshot.val().p1.name;
		player2 = noplayer;
		rps1 = snapshot.val().p1.rps;
		rps2 = 0;
		canjoin();
	}
	else if (!p1exists && p2exists) {
		player1 = noplayer;
		player2 = snapshot.val().p2.name;
		rps1 = 0;
		rps2 = snapshot.val().p2.rps;
		canjoin();
	} else {
		player1 = noplayer;
		player2 = noplayer;
		rps1 = 0;
		rpa2 = 0;
		canjoin();
	}

	$('.player1 h2').html(player1);
	$('.player2 h2').html(player2);

	if(rps1 !==0 && rps2 !==0){
		show_result();
	}
});

function canjoin(){
	if (myname === player1 || myname === player2){
		$('#enter-name').hide();
	} else {
		$('#enter-name').show();
	}
}

function show_result() {
	$('.player1 .panel').html('<h2>' + rps1 + '</h2>');
	$('.player2 .panel').html('<h2>' + rps2 + '</h2>');

	if (rps1 === rps2) {
		$('.result .panel').html('<h2>Tie!</h2>');
	} else if ((rps1 === 'r' && rps2 === 's') || (rps1 === 'p' && rps2 === 'r') || (rps1 === 's' && rps2 === 'p')){
		$('.result .panel').html('<h2>' + player1 + ' wins!</h2>');
	} else {
		$('.result .panel').html('<h2>' + player2 + ' wins!</h2>');
	}

	setTimeout(function(){
		database.ref().update({
			p1: {
				name: player1,
				rps: 0
			},
			p2: {
				name: player2,
				rps: 0
			}
		});
		$('.panel').empty();
	}, 2000);
}

/*-------------------------------------
| enter your name
-------------------------------------*/

$("#enter-btn").on('click', function(){
	myname = $('#name-input').val();

	if (player1 === noplayer) {
		player1 = myname;

		database.ref().update({
			p1: {
				name: player1,
				rps: rps1
			}
		});
	}
	else if (player2 === noplayer) {
		player2 = myname;

		database.ref().update({
			p2: {
				name: player2,
				rps: rps2
			},
		});
	}

	sessionStorage.setItem('myname', myname);
	$('#enter-name').hide();
});

/*-------------------------------------
| select
-------------------------------------*/

$('#control .hand').on('click', function(){
	if(myname === player1){
		rps1 = $(this).attr('data');
		database.ref().update({
			p1: {
				name: player1,
				rps: rps1
			}
		});
	} else if (myname === player2){
		rps2 = $(this).attr('data');
		database.ref().update({
			p2: {
				name: player2,
				rps: rps2
			}
		});
	}
});

/*-------------------------------------
| chat function
-------------------------------------*/

database.ref('chat').on('child_added', function(snapshot){
	$('#chat .chat-box').prepend('<li class="list-group-item">' + snapshot.val().message + '</li>');
});


$('#send-btn').on('click', function(){
	var new_message = $('#message').val()
	database.ref('chat').push({
		message: new_message
	});
});


// doc.ready closing
});
