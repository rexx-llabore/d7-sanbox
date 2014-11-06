(function ($) {
  Drupal.behaviors.wordGame = {
    attach: function (context, settings) {
      
      /*
       * Display the next text or the input results
       */
      function displayNext () {
        if (wordList.length > 0) {
          
          // Display the first word and set position
          var wordObj = wordList.shift();
          
          // Set the position of the text
          if (wordObj['pos'] == 'r') {
            $('#word-container').addClass('text-right');
          }
          else {
            $('#word-container').addClass('text-left');
          }
          
          // Display the word
          $('#word', context).text(wordObj['word']);
          
          // Show the text again to the user.
          $('#word', context).show();
        }
        else {
          
          // Display user inputs on the screen.
          if (Object.keys(userInputs).length > 0) {
            for (var key in userInputs) {
              if ($.type(userInputs[key]) === 'string') {
                $('#word-result', context).append(key + ': ' + userInputs[key] + '</br>');
              }
            }
          }
          
          // Hide the user input links.
          $('#wordgame-links').hide();
          
          // Center the results
          $('#word-container', context).removeClass();
          $('#word-container', context).addClass('text-left');
          
          // Show the results
          $('#word-result-title', context).text('Results');
        }
      }
      
      /*
       * Hide the text from the user
       */
      function hideText () {
        
        // Hide the text after a specified time
        $('#word', context).hide();
      }
      
      /**
       *
       */
      function initializeTimer () {
        // Always clear the time out ID
        clearTimeout(timeoutID);
        
        timeoutID = setTimeout(hideText, 500);
      }
      
      var wordList = [
        {'word' : 'bob', 'pos' : 'r'},
        {'word' : 'test', 'pos' : 'r'},
        {'word' : 'happy', 'pos' : 'l'},
        {'word' : 'asdf', 'pos' : 'l'},
        {'word' : 'qwer', 'pos' : 'r'},
      ];
      var userInputs = [];
      var timeoutID;
      
      // Do something when the START link is clicked.
      $('#word-link-start', context).click(function (e) {
        
        initializeTimer();
        
        // Display the first word and set position
        var wordObj = wordList.shift();
        
        // Set the position of the text
        if (wordObj['pos'] == 'r') {
          $('#word-container').addClass('text-right');
        }
        else {
          $('#word-container').addClass('text-left');
        }
        
        // Display the word
        $('#word', context).text(wordObj['word']);
        
        $('#wordgame-container', context).show();
        $('#wordgame-container-start', context).hide();
      
        e.preventDefault();
      });
      
      
      // User clicks 'W'.
      $('#word-link', context).click(function (e) {
        
        initializeTimer();
        
        var currentWord = $('#word', context).html();
        userInputs[currentWord] = 'word';
        
        // Display the next text or the results.
        displayNext();
        
        e.preventDefault();
      });
      
      
      // User clicks 'N'.
      $('#non-word-link', context).click(function (e) {
        
        initializeTimer();
        
        var currentWord = $('#word', context).html();
        userInputs[currentWord] = 'non-word';
        
        // Display the next text or the results.
        displayNext();
        
        e.preventDefault();
      });
      
    }
  };
})(jQuery);

 