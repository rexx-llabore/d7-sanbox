(function ($) {
  Drupal.behaviors.wordGame = {
    attach: function (context, settings) {
      
      var wordList = [
        'bob',
        'test',
        'happy',
        'asdf',
        'qwer'
      ];
      var interval;
      var userInputs = [];
      
      $('#word-link-start', context).click(function (e) {
        $('#word', context).text(wordList.shift());
        $('#wordgame-container', context).show();
        $('#wordgame-container-start', context).hide();
        
        
        interval = setInterval(function () {
          if (wordList.length > 0) {
            
            // Display the next word on the list.
            $('#word', context).text(wordList.shift());
            
            // Show the links again so users.
            $('#wordgame-links', context).show('slow');
          }
          else {            
            $('#wordgame-links').hide('slow');
            
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
            clearInterval(interval);
          }
        }, 3000);
        
        e.preventDefault();
      });
      
      
      // User clicks 'W'.
      $('#word-link', context).click(function () {
        
        var currentWord = $('#word', context).html();
        userInputs[currentWord] = 'word';
        
        // Hide the links when user has chosen an answer.
        $('#wordgame-links', context).hide('slow');
      });
      
      // User clicks 'N'.
      $('#non-word-link', context).click(function () {
        
        var currentWord = $('#word', context).html();
        userInputs[currentWord] = 'non-word';
        
        // Hide the links when user has chosen an answer.
        $('#wordgame-links', context).hide('slow');
      });
      
    }
  };
})(jQuery);

 