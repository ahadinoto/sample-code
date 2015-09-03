$(document).ready(function() {
    var form = $('form'),
        name = $('#member-name'),
        email = $('#member-email'),
        action = 'http://dev.api.in2nite.com/v2/partnership_register',
        overlay = $('#overlay'),
        onProgress = false,
        errorDiv = function($message) {
            form.addClass('error');
            return '<p class="error-msg"><a href="#" title="Close" class="close">Close - </a>' + $message + '</p>'
        },
        showPopup = function(id) {
            overlay.show();
            $('#popup-' + id).show();
        },
        closePopup = function(id) {
            overlay.hide();
            $('#' + id).hide();
            $('body').scrollTo({
                top: 0,
                left: 0
            }, 800);
        },
        validateEmail = function (email){
            var pattern = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            return pattern.test(email);
        };


    form.submit(function(event) {
        var message = '',
            partner = $('#partner-terms:checked'),
            general = $('#general-terms:checked'),
            params = $(this).serialize();

        event.preventDefault();

        if(onProgress === true) {
            return '';
        }

        onProgress = true;

        form.removeClass('error');
        $('.error-msg').remove();

        if(name.val() == '') {
            message += 'Invalid name. ';
        }

        validate = validateEmail(email.val());

        if(email.val() == '' || validate == false) {
            message += 'Invalid email address. ';
        }

        if(general.size() < 1) {
            message += 'You have to checked IN2NITE\'s Privacy Policy and Terms of Use. ';
        }

        if(partner.size() < 1) {
            message += 'You have to checked BDO Terms of Use. ';
        }

        if(message != '') {
            form.find('fieldset').before(errorDiv(message));
            onProgress = false;
        } else {
            $.post(action, params).success(function(data) {
                if(data.success == true) {
                    // Open popup
                    window.location = 'thankyou.php';
                } else {
                    // Clear form
                    document.getElementsByTagName("form")[0].reset();
                    form.find('fieldset').before(errorDiv(data.message.toString()));
                }
                onProgress = false;
            });
        }
    });

    $('form').on('click', '.close', function(){
        $('.error-msg').remove();
    });

    $('a[rel="popup"]').click(function(event){
        event.preventDefault();
        var id = $(this).attr('id');
        showPopup(id);
    });

    $('.close-popup').click(function(event){
        $('.popup').find('section').scrollTop(0);
        event.preventDefault();
        var id = $(this).parent().parent().attr('id');
        closePopup(id);
    });

    // Scroll to content
    $(".popup").on("click", ".lc-index li > a", function(event) {
        event.preventDefault();
        $(".popup > section").scrollTo($(this).attr("href"), 800);
    });

    $(".popup").on("click", ".back-to-top", function(event) {
        event.preventDefault();
        $(".popup > section").scrollTo({
            top: 0,
            left: 0
        }, 800);
    });

    $("#thankyou #wrapper-inner").css( "min-height", $(window).innerHeight() - 115 );

    if ( $(window).innerWidth() < 768 ) {
        $(".popup").css( "height", $(window).innerHeight() );
        $(".popup section").css( "height", ( $(window).innerHeight() - ( $(window).innerHeight() * 0.15 ) ) - $(".popup header").innerHeight() );
    };

});

$(window).resize(function() {
    $("#thankyou #wrapper-inner").css( "min-height", $(window).innerHeight() - 115 );
    if ( $(window).innerWidth() < 768 ) {
        $(".popup").css( "height", $(window).innerHeight() );
        $(".popup section").css( "height", ( $(window).innerHeight() - ( $(window).innerHeight() * 0.15 ) ) - $(".popup header").innerHeight() );
    };
});