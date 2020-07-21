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

//Step 2 - define the function to make the api call; shopkeeper goes to warehouse to get shoe
function getTemplateModulesDataFromApi(queryTarget) {

    //Step 2a - create the url
    const url = `https://dog.ceo/api/breed/${queryTarget}/images/random`;
    console.log(url);
    // Step 2b - make the api call using the URL, dataType (JSON or JSONP), type (GET or POST)
    fetch(url)

    //Step 2c - success scenario (call the function to display the results)
    .then(response => {
            if (response.ok) {
                return response.json();
            }
            // DISPLAY ERRORS if the server connection works but the json data is broken
            throw new Error(response.statusText);
        })
        .then(responseJson => displayTemplateModulesSearchData(responseJson))

    // Step 2d - failure scenario  (DISPLAY ERRORS if the server connection fails)
    .catch(err => {
        console.log(err);
    });
};


//Step 3 - display the results; sales process
function displayTemplateModulesSearchData(responseJson) {

    //Step 3a - console.log the results
    console.log(responseJson);

    //Step 3b - if there are no results show errors (DISPLAY ERRORS if the server connection works and the json data is valid, but there are no resutls)
    if (responseJson.length == 0) {

        //show an alert
        alert("No results");
    }

    //Step 3c - if there are results, create an HTML results variable
    else {
        let htmlOutput = "";

        //Step 3d - populate the htmlOutut variable with all the relevant data
        for (let i = 0; i < responseJson.length; i++) {
            htmlOutput +=`
                <h3> ${responseJson[i].name}</h3><br />
                <p>- ${responseJson[i].population}</p>
                <p>- ${responseJson[i].capital}</p>
                <p>- ${responseJson[i].region}</p>
            `;
        }

        //Step 3e - send the content of HTML results variable to the HTML
        $('.js-search-results').html(htmlOutput);
    }
}











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

