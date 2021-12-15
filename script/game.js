$(document).ready(function() {

    $("#game_screen").hide()
    $("#words").hide()
    $("#win_screen").hide("fast")
    $("#lose_screen").hide("fast")
    var wordList = {
            words: [{
                name: "house",
                hint: "single property vancouver real estate"
            }, {
                name: "snow",
                hint: "falls during winter time"
            }, {
                name: "dragon",
                hint: "mythical fire-breathing creature"
            }, {
                name: "snows",
                hint: "falls during winter time"
            }]
        }
        //green to red hex codes
    const bg_colors = ["#69B34C", "#ACB334", "#FAB733", "#FF8E15", "#FF4E11", "#FF0D0D"]
    var selected_word = ""
    var word_length
    var generated_number
    var number_of_incorrect_guesses = 0
    var counter = 0
    var timeout
    let animation;
    var guessedLetters = []
    const NUMBER_OF_GUESSES_ALLOWED = 6


    const divs = document.querySelectorAll('.reset_button');
    //event listeners
    divs.forEach(el => el.addEventListener('click', function() {
        reset()
    }));

    play.addEventListener('click', function() {
        $("#start_screen").hide("slow");
        $("#words").show("slow")

        //get word from wordList of selected length
        var button1 = "<button id='word_one'>Four</div>"
        var button2 = "<button id='word_two'>Five</div>"
        var button3 = "<button id='word_three'>Six</div>"

        //show word length choices
        $("#choice1").append(button1)
        $("#choice2").append(button2)
        $("#choice3").append(button3)

    });
    choice1.addEventListener('click', function() {
        word_length = 4;
        $("#words").hide("slow", generateWord())
    });
    choice2.addEventListener('click', function() {
        word_length = 5;
        $("#words").hide("slow", generateWord())
    });
    choice3.addEventListener('click', function() {
        word_length = 6;
        $("#words").hide("slow", generateWord())
    });

    function updateNumberOfGuessesUsedUI() {
        $("#word_length").html("Word Length: " + selected_word.length + " Number of Incorrect guesses: " + number_of_incorrect_guesses)
    }

    function play_game() {
        $("#game_screen").show("slow")

        //generate guessing blocks based on word
        for (let i = 0; i < selected_word.length; i++) {
            var block = document.createElement("div")
            block.innerHTML = ""
            $("#guessing_blocks").append(block)
        }

        $("#word_length").html("Word Length: " + selected_word.length + " Number of Incorrect Guesses: " + number_of_incorrect_guesses)
        $("#word_hint").html("Hint: " + wordList.words[generated_number].hint)
        $("#guessing_blocks").css("display", "flex");
        $("#letter_holder").css("display", "flex");
        $("#words").css("display", "flex");

        var image = document.createElement("img")
        image.src = "../images/" + number_of_incorrect_guesses + ".png"
        image.alt = "hangman_image " + number_of_incorrect_guesses
        $("#hangman").append(image)
        generateGuessingLetters()
    }

    function generateWord() {
        //generate word based on selected word length 

        generated_number = Math.floor(Math.random() * wordList.words.length)

        selected_word = ""
        while (selected_word == "") {
            if (wordList.words[generated_number].name.length == word_length) {
                selected_word = wordList.words[generated_number].name
                break;
            }
            generated_number = Math.floor(Math.random() * wordList.words.length)
        }
        play_game()
    }

    function generateGuessingLetters() {
        var buttonTemplate
        for (let i = 97; i <= 122; i++) {
            letter = String.fromCharCode(i);
            buttonTemplate = document.createElement("button")
            buttonTemplate.innerHTML = letter
            buttonTemplate.addEventListener('click', function() {
                guessLetter(this.innerHTML)
            })
            $("#letter_holder").append(buttonTemplate)
        }
    }


    function SetImageSrc() {
        timeout = setTimeout(function() {
            if (counter == NUMBER_OF_GUESSES_ALLOWED) {
                counter = 0
            }
            counter++

            $("#hangman").children()[0].src = "../images/" + counter + ".png"
            $("#hangman").children()[0].alt = "hangman_image " + counter
            animation = requestAnimationFrame(SetImageSrc)
        }, 200)
    }

    function updateGuessedLettersUI() {
        var html_template = "<p>Letters Guessed: "
        for (let i = 0; i < guessedLetters.length; i++) {
            html_template += guessedLetters[i] + " "
        }
        html_template += "</p>"
        $("#guessed_letters").html(html_template)
    }

    function changeBGColor() {
        $("#game").css("background-color", bg_colors[number_of_incorrect_guesses])
    }

    function guessLetter(letter) {
        guessedLetters.push(letter)
        updateGuessedLettersUI()
            //check if letter in the selected word
        if (selected_word.includes(letter)) {
            for (let i = 0; i < selected_word.length; i++) {
                if (selected_word.charAt(i) == letter) {
                    $("#guessing_blocks").children()[i].innerHTML = letter

                }
            }
        } else {
            number_of_incorrect_guesses++;
            updateNumberOfGuessesUsedUI()
            changeBGColor()
            if (number_of_incorrect_guesses == 5) {

                animation = requestAnimationFrame(SetImageSrc);
            } else {
                $("#hangman").children()[0].src = "../images/" + number_of_incorrect_guesses + ".png"
                $("#hangman").children()[0].alt = "hangman_image " + number_of_incorrect_guesses
            }


        }

        //lose condition
        if (number_of_incorrect_guesses == NUMBER_OF_GUESSES_ALLOWED) {
            $("#game_screen").hide("slow")
            $("#lose_screen").css("display", "flex")
            $("#lose_screen").show("slow")
        }

        //win condition
        if (checkIfAllGuessed()) {
            $("#game_screen").hide("slow")
            $("#win_screen").css("display", "flex")
            $("#win_screen").show("slow")
        }
    }

    function checkIfAllGuessed() {
        var checker = true;
        for (let i = 0; i < $("#guessing_blocks").children().length; i++) {
            if ($("#guessing_blocks").children()[i].innerHTML == "") {
                checker = false;
                break;
            }
        }
        return checker
    }

    function reset() {
        selected_word = ""
        word_length
        generated_number
        number_of_incorrect_guesses = 0
        changeBGColor()
        guessedLetters = []
        updateGuessedLettersUI()
        clearTimeout(timeout)
        $("#game_screen").hide("slow")
        $("#words").hide("slow")
        $("#choice1").empty()
        $("#choice2").empty()
        $("#choice3").empty()
        $("#hangman").empty()
        $("#guessing_blocks").empty()
        $("#letter_holder").empty()
        $("#win_screen").hide()
        $("#lose_screen").hide()
        $("#start_screen").show("slow")
    }

});