'use strict';

// Code by Webdevtrick ( https://webdevtrick.com )
$('.tabs .tab').click(function () {
    if ($(this).hasClass('signin')) {
        $('.tabs .tab').removeClass('active');
        $(this).addClass('active');
        $('.cont').hide();
        $('.signin-cont').show();
    }
    if ($(this).hasClass('signup')) {
        $('.tabs .tab').removeClass('active');
        $(this).addClass('active');
        $('.cont').hide();
        $('.signup-cont').show();
    }
});
$('.container .bg').mousemove(function (e) {
    var amountMovedX = (e.pageX * -1 / 30);
    var amountMovedY = (e.pageY * -1 / 9);
    $(this).css('background-position', amountMovedX + 'px ' + amountMovedY + 'px');
});

//jQuery Display functions

//Show login in landing page

function sectionDisplay() {
    $('#home-section').show();
    $('#get-started-section').hide();
    $('#dashboard-section').hide();
    $('#play-game-section').hide();
    $('#site-nav').hide();

};


//Get Started entries








/*--- Step 3 - Using functions ---*/

$(document).ready(function () {


    /*--- Hide sections on load ---*/
    // $('#home-section').show();
    // $('#get-started-section').hide();
    // $('#dashboard-section').hide();
    // $('#play-game-section').hide();


    //form trigger - login
    $('.login-form').submit(function (event) {
        event.preventDefault();
        console.log('login-button-clicked')
        //login as a user
        // $('#get-started-section').show();
        // $('#home-section').hide();
        // $('#dashboard-section').hide();
        // $('#play-game-section').hide();
    });

    //form trigger - register
    $('.register-form').submit(function (event) {
        event.preventDefault();
        console.log('register-button-clicked')
    });

    //form trigger - goal-statement-form
    $('.goal-statement-form').submit(function (event) {
        event.preventDefault();
        console.log('goal-statement-button-clicked')

    });

    //form trigger- game form 


    $('.game-form').submit(function (event) {
        event.preventDefault();
        console.log('game-form-button-clicked')

    });

});
