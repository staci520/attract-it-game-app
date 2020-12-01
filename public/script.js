'use strict';
const apiURL = "http://localhost:8000/api"

let TOKEN_KEY = "a"

// animation on landing page Wrap every letter in a span
var textWrapper = document.querySelector('.magic .letters');
textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline({ loop: false })
    .add({
        targets: '.magic .letter',
        translateY: ["1.1em", 0],
        translateZ: 0,
        duration: 750,

        delay: (el, i) => 50 * i
    }).add({
        targets: '.magic',
        opacity: 100,
        duration: 1000,

        easing: "easeOutExpo",
        // easing: "easeInOutSine",
        delay: 1000,

    });

//token service
function saveAuthToken(token) {
    window.sessionStorage.setItem(TOKEN_KEY, token)
}
function getAuthToken() {
    return window.sessionStorage.getItem(TOKEN_KEY)
}
function getCurrentLoggedInUser() {
    return window.sessionStorage.getItem('user_id')
}
function clearAuthToken() {
    window.sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.clear();
}
function hasAuthToken() {
    return !!getAuthToken()
}
function makeBasicAuthToken(userName, password) {
    return window.btoa(`${userName}:${password}`)
}
function saveUserId(userId) {
    return window.sessionStorage.setItem('user_id', userId);
}
function getUserId(user_id) {
    return window.sessionStorage.getItem('user_id', user_id)
}
function logOutClick() {
    //console.log('Logging out')
    clearAuthToken()
    getUserId = (id) => { }

    window.location = '/'
}

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
//returns empty string if the email is NOT valid
function validateEmail(inputEmail) {
    let outputEmail = inputEmail;
    //basic email validation
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!inputEmail.match(mailformat)) {
        outputEmail = ""
    }
    return outputEmail
}
//returns empty string if the username is NOT valid
function validateUsername(inputUsername) {
    let outputUsername = inputUsername;
    // only lowercase and uppercase letters and dash
    let userformat = /^[a-zA-Z\-]+$/;
    if (!inputUsername.match(userformat)) {
        outputUsername = ""
    }
    return outputUsername
}
//returns empty string if the password is NOT valid
function validatePassword(inputPassword) {
    let outputPassword = inputPassword;
    // at least one number, one lowercase and one uppercase letter
    // at least eight characters that are letters, numbers or the underscore
    let passwordformat = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/;
    if (!inputPassword.match(passwordformat)) {
        outputPassword = ""
    }
    return outputPassword
}

// how to use
// console.log(validateEmail("hey@gmail.com"));
// console.log(validateUsername("Abcde-fg"));
// console.log(validatePassword("Ab1234_6"));

//Show login in landing page

function sectionDisplay() {
    $('.login-only').show()
    $('#home-section').show();
    $('#get-started-section').hide();
    $('#dashboard-section').hide();
    $('#play-game-section').hide();
    $('#site-nav').hide();
};

//Step 2 - define the function to make the api call; shopkeeper goes to warehouse to get shoe
function getTemplateModulesDataFromApi(currentGameId) {

    //Step 2a - create the url
    const url = `${apiURL}/template-modules`;
    //console.log(url);
    // Step 2b - make the api call using the URL, dataType (JSON or JSONP), type (GET or POST)
    fetch(url)

        //Step 2c - success scenario (call the function to display the results)
        .then(responseBinary => {
            //console.log(responseBinary)
            return responseBinary.json();
            // if (responseBinary.ok) {
            //     return responseBinary.json();
            // }
            // // DISPLAY ERRORS if the server connection works but the json data is broken
            // throw new Error(responseBinary.statusText);
        })
        .then(responseJson => {
            //console.log(responseJson)
            displayTemplateModulesSearchData(responseJson, currentGameId)
        })

        // Step 2d - failure scenario  (DISPLAY ERRORS if the server connection fails)
        .catch(err => {
            console.log(err);
        });
};

//Get current game module status based on current game ID and template modules ID
function getGameModulesStatus(currentGameId, templateModuleId) {
    //console.log(currentGameId)
    //Step 2a - create the url
    const url = `${apiURL}/game-modules`;
    // console.log(url);
    // Step 2b - make the api call using the URL, dataType (JSON or JSONP), type (GET or POST)
    fetch(url)

        //Step 2c - success scenario (call the function to display the results)
        .then(responseBinary => {
            // console.log(responseBinary)
            return responseBinary.json();
            // if (responseBinary.ok) {
            //     return responseBinary.json();
            // }
            // // DISPLAY ERRORS if the server connection works but the json data is broken
            // throw new Error(responseBinary.statusText);
        })
        .then(responseJson => {
            console.log(responseJson, templateModuleId)
            //look thru all existing game modules
            for (let i = 0; i < responseJson.length; i++) {
                console.log(currentGameId, " == ", responseJson[i].game_id, " testing ", responseJson[i].template_modules_id, " == ", templateModuleId)

                if ((currentGameId == responseJson[i].game_id) && (responseJson[i].template_modules_id == templateModuleId)) {
                    console.log("true")
                    displayGameModulesStatus(1, templateModuleId)
                    //console.log(templateModuleId, responseJson[i].notes)
                    $("#FormControlTextarea" + templateModuleId).text(responseJson[i].notes)
                }
                else {
                    //console.log("false")
                    displayGameModulesStatus(0, templateModuleId)
                }
            }
        })
        // Step 2d - failure scenario  (DISPLAY ERRORS if the server connection fails)
        .catch(err => {
            console.log(err);
        });
};

//Display custom icon based on game module status  //ICONS NEED TO BE FIXED TO RETAIN STATUS
function displayGameModulesStatus(currentGameModulesStatus, templateModuleId) {
    //icon status gets overwritten even if status is not changed -- TO DO MARIUS
    //by default, show the icon for status 0
    let iconHtmlOutput = "<p>-</p>"
    //if status is 1, change the icon to edit
    if (currentGameModulesStatus == 0) {
        iconHtmlOutput = "<p><i class='fas fa-edit'></i></p>"
    }

    else if (currentGameModulesStatus == 1) {
        iconHtmlOutput = "<p><i class='fas fa-check-square'></i></p>"
    }
    //display the icon to the dom
    $("#heading" + templateModuleId).find(".complete-status").html(iconHtmlOutput)
}





function setGameGoalStatementByUserId(userInput, userId) {

    //Step 2a - create the url
    const url = `${apiURL}/games`;
    //console.log(url);

    let payload = {

        "user_id": userId,
        "goal": userInput,
        "start_time": Date.now(),
        "end_time": 0,
        "status": 0
    }

    // Step 2b - make the api call using the URL, dataType (JSON or JSONP), type (GET or POST)
    fetch(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

        //Step 2c - success scenario (call the function to display the results)
        .then(responseBinary => {
            if (responseBinary.ok) {
                return responseBinary.json();
            }
            // DISPLAY ERRORS if the server connection works but the json data is broken
            throw new Error(responseBinary.statusText);
        })
        .then(responseJson => {
            // console.log(responseJson)
            // console.log(responseJson.id)
            getTemplateModulesDataFromApi(responseJson.id)
            // displayTemplateModulesSearchData(responseJson)
        })
        //.then(responseJson => console.log(responseJson))

        // Step 2d - failure scenario  (DISPLAY ERRORS if the server connection fails)
        .catch(err => {
            console.log(err);
        });
};


//Step 3 - display the results; sales process
function displayTemplateModulesSearchData(responseJson, currentGameId) {

    //Step 3a - console.log the results
    //console.log(responseJson);

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
            htmlOutput += `
                    <div class="card">
                        <div class="card-header row" id="heading${responseJson[i].id}" style="background-color: #${responseJson[i].title_color}"> 
                            <div class="mb-0 col-sm-3 col-md-6">
                                <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${responseJson[i].id}"
                                    aria-expanded="false" aria-controls="collapse${responseJson[i].id}">
                                    <h3>${responseJson[i].id}: ${responseJson[i].title}</h3>
                                </button>
                            </div>
                            <div class="col-sm-3 col-md-6 complete-status">
                            <p><i class='fas fa-edit'></i></p>
                            </div>
                        </div>
                        <div id="collapse${responseJson[i].id}" class="collapse" aria-labelledby="heading${responseJson[i].id}" data-parent="#accordion">
                            <div class="card-body">
                                <p class="card-text">${responseJson[i].description}</p>
                                <form class="game-form">
                                    <div class="form-group shadow-textarea">
                                        <label for="FormControlTextarea"></label>
                                        <textarea class="lg-textarea form-control z-depth-1" id="FormControlTextarea${responseJson[i].id}" rows="12" placeholder="Insights..."></textarea>
                                            <input type="hidden" class="template-module-id" value="${responseJson[i].id}">
                                            <input type="hidden" class="current-game-id" value="${currentGameId}">
                                    </div>
                                    <div class="button-container">
                                        <input type="submit" class="submit-button-container btn btn-info" value="Add Session">
                                    </div>
                            </div>
                            </form>
                        </div>
                    </div>
            `;
            getGameModulesStatus(currentGameId, responseJson[i].id)
        }

        //Step 3e - send the content of HTML results variable to the HTML
        $('#accordion').html(htmlOutput);
    }
}

/*--- Step 3 - Using functions ---*/

$(document).ready(function () {


    /*--- Hide sections on load ---*/
    // $('#home-section').show();
    // $('#get-started-section').hide();
    // $('#dashboard-section').hide();
    // $('#play-game-section').hide();

    //if user is not logged in, display login page
    if (!getAuthToken()) {
        $('#home-section').show()
        $('#get-started-page').hide()
        $('#dashboard-section').hide()
        $('#play-game-section').hide()
        $('.login-only').hide()
    }


    //form trigger - login
    $('.login-form').submit(function (event) {
        event.preventDefault();
        // console.log('login-button-clicked')


        let loginUserName = $("#email-signin").val()
        // console.log(loginUserName)
        let loginPassword = $("#password-signin").val()
        //console.log(loginPassword)

        if (validateEmail(loginUserName) == "") {
            alert("Invalid username")
        }

        if (validatePassword(loginPassword) == "") {
            alert("Invalid password. Password must contain at least eight characters that are letters, numbers or the underscore")
        }

        let payload = { user_name: loginUserName, password: loginPassword }

        fetch(`http://localhost:8000/api/auth/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(payload),

        })

            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                // DISPLAY ERRORS if the server connection works but the json data is broken
                throw new Error(response.statusText);
            })
            .then(responseJson => {
                //console.log(responseJson)
                saveAuthToken(responseJson.authToken)
                saveUserId(responseJson.userId)
                //delete the line below -- used only for testing
                // $("#show-logged-in-userid").text(getAuthToken())
                $('.login-only').show()
                $('#home-section').hide()
                $('#get-started-page').show()
                $('#dashboard-section').show()
                $('#play-game-section').show()
            })

            .catch(err => {
                console.log('error:', err)
            })


        //login as a user
        // $('#get-started-section').show();
        // $('#home-section').hide();
        // $('#dashboard-section').hide();
        // $('#play-game-section').hide();
    });

    //form trigger - register
    $('.register-form').submit(function (event) {
        event.preventDefault();
        // console.log('register-button-clicked')
        let registerUserName = $("#email-signup").val()
        // console.log(registerUserName)
        let registerPassword = $("#password-signup").val()
        // console.log(registerPassword)


        if (validateEmail(registerUserName) == "") {
            alert("Invalid username")
        }

        if (validatePassword(registerPassword) == "") {
            alert("Invalid password. Password must contain at least eight characters that are letters, numbers or the underscore")
        }

        let payload = { user_name: registerUserName, password: registerPassword }
        //console.log(payload)

        fetch(`http://localhost:8000/api/users`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(payload),

        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                // DISPLAY ERRORS if the server connection works but the json data is broken
                throw new Error(response.statusText);
            })
            .then(responseJson => {
                //console.log(responseJson)
                saveAuthToken(responseJson.authToken)
                saveUserId(responseJson.userId)
                //delete the line below -- used only for testing
                // $("#show-logged-in-userid").text(getAuthToken())
                $('.login-only').show()
                $('#home-section').hide()
                $('#get-started-page').show()
                $('#dashboard-section').show()
                $('#play-game-section').show()
            })

            .catch(err => {
                console.log('error:', err)
            })
    });

    //form trigger - logout

    $(document).on('click', '#logout', function (event) {
        event.preventDefault();
        logOutClick();
    });


    //form trigger - a-statement-form
    $('.goal-statement-form').submit(function (event) {
        event.preventDefault();
        //console.log('goal-statement-button-clicked')
        let userInput = $("#goalStatementText").val()
        //console.log(userInput)

        let userId = getUserId(getCurrentLoggedInUser())
        //console.log(userId)

        if (userInput == "") {
            alert("Please set your goal statement")
        }
        else {
            setGameGoalStatementByUserId(userInput, userId)
        }
    });

    //form trigger- game form 

    $(".accordion").on("click", '.submit-button-container', function (event) {
        event.preventDefault();
        //console.log('game-form-button-clicked')
        let textareaUserInput = $(this).closest("form").find(".lg-textarea").val()
        let currentGameIdUserInput = $(this).closest("form").find(".current-game-id").val()

        let moduleIdUserInput = $(this).closest("form").find(".template-module-id").val()
        console.log(textareaUserInput, moduleIdUserInput, currentGameIdUserInput);
        //Step 2a - create the url
        const url = `${apiURL}/game-modules`;
        //console.log(url);

        let payload = {
            "game_id": currentGameIdUserInput,
            "template_modules_id": moduleIdUserInput,
            "notes": textareaUserInput,
            "status": 1
        }

        // Step 2b - make the api call using the URL, dataType (JSON or JSONP), type (GET or POST)
        fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: JSON.stringify(payload),
        })

            //Step 2c - success scenario (call the function to display the results)
            .then(responseBinary => {
                if (responseBinary.ok) {
                    return responseBinary.json();
                }
                // DISPLAY ERRORS if the server connection works but the json data is broken
                throw new Error(responseBinary.statusText);
            })
            .then(responseJson => {
                console.log(responseJson)
                getTemplateModulesDataFromApi(currentGameIdUserInput)
            })

            // Step 2d - failure scenario  (DISPLAY ERRORS if the server connection fails)
            .catch(err => {
                console.log(err);
            });
    });

});

