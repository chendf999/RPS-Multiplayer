
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
| on player leave
-------------------------------------*/

window.onbeforeunload = function () {
	if(myname === player1 ){
		database.ref('p1').remove();
	} else if (myname === player2){
		database.ref('p2').remove();
	}
};

/*-------------------------------------
| on value change
-------------------------------------*/

database.ref().on('value', function(snapshot){

	var p1exists = snapshot.child('p1').exists();
	var p2exists = snapshot.child('p2').exists();

	if (p1exists && p2exists) {
		player1 = snapshot.val().p1.name;
		player2 = snapshot.val().p2.name;
		rps1 = snapshot.val().p1.rps;
		rps2 = snapshot.val().p2.rps;
		$('.join').hide();
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

	check_select();
});

function canjoin(){
	if (myname === player1 || myname === player2){
		$('.join').hide();
	} else {
		$('.join').show();
	}
}

function check_select(){
	if(rps1 !==0 && rps2 !==0){
		$('.player1 .panel, .player2 .panel').css('background-color', '#73b566');
		setTimeout(show_result, 500);
	} else if(rps1 !==0 && rps1 !== undefined) {
		$('.player1 .panel').css('background-color', '#73b566');
	} else if (rps2 !==0 && rps2 !== undefined){
		$('.player2 .panel').css('background-color', '#73b566');
	}
}

function show_result() {
	$('.panel').css('background-color', 'white');

	$('.player1 .panel').append('<img src="./assets/images/rps-' + rps1 + '.png">');
	$('.player2 .panel').append('<img src="./assets/images/rps-' + rps2 + '.png">');

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
	}, 3000);
}

/*-------------------------------------
| join game
-------------------------------------*/

$("#join-btn").on('click', function(){
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
	$('.join').hide();
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

$('#send-btn').on('click', function(){
	var new_message = $('#message-input').val();
	chat_messages.push(new_message);
	if(chat_messages.length > 4){
		chat_messages.splice(1,1);
	}
	database.ref().set({
		chat: chat_messages
	});
});


database.ref('chat').on('value', function(snapshot){
	chat_messages = snapshot.val();
	// console.log(chat_messages);
	print_chat();
});

function print_chat(){
	$('#control .chat-box').empty();
	for(var i=0; i<chat_messages.length; i++){
		$('#control .chat-box').prepend('<li class="list-group-item">' + chat_messages[i] + '</li>');
	}
}

// doc.ready closing
});
