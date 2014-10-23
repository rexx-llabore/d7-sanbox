(function ($) {
  Drupal.behaviors.wordGame = {
    attach: function (context, settings) {
      
      /*
       * Display the next text or the input results
       */
      function displayNext () {
        if (wordList.length > 0) {
            
          // Display the next word on the list.
          $('#word', context).text(wordList.shift());
        }
        else {
          
          // Hide the user input links.
          $('#wordgame-links').hide();
          
          // Clear it first before appending.
          $('#word', context).html('');
          
          // Display user inputs on the screen.
          if (Object.keys(userInputs).length > 0) {
            for (var key in userInputs) {
              if ($.type(userInputs[key]) === 'string') {
                $('#word', context).append(key + ': ' + userInputs[key] + '</br>');
              }
            }
          }
        }
      }
      
      var wordList = [
        'bob',
        'test',
        'happy',
        'asdf',
        'qwer'
      ];
      var userInputs = [];
      
      // Do something when the start link is clicked.
      $('#word-link-start', context).click(function (e) {
        
        // Display the first word.
        $('#word', context).text(wordList.shift());
        
        $('#wordgame-container', context).show();
        $('#wordgame-container-start', context).hide();
      
        e.preventDefault();
      });
      
      
      // User clicks 'W'.
      $('#word-link', context).click(function (e) {
        
        var currentWord = $('#word', context).html();
        userInputs[currentWord] = 'word';
        
        // Display the next text or the results.
        displayNext();
        
        e.preventDefault();
      });
      
      
      // User clicks 'N'.
      $('#non-word-link', context).click(function (e) {
        
        var currentWord = $('#word', context).html();
        userInputs[currentWord] = 'non-word';
        
        // Display the next text or the results.
        displayNext();
        
        e.preventDefault();
      });
      
    }
  };
})(jQuery);

 