/* eslint-disable no-undef */
$(function() {

    var editor = new MediumEditor('#post-body', {
        placeholder: {
            text: '',
            hideOnClick: true
        }
    });

    $('.publish-button').on('click', function(e) {
        e.preventDefault();
        const $this = this;

        var data = {
            title: $('#post-title').val(),
            body: $('#post-body').html()
        };

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: '/post/add'
        }).done(function(data) {
            console.log(data);
            $('.post-form p.error, .post-form p.success').remove();
            //console.log(data);
            if(!data.ok) {
                $('.post-form h2').after('<p class="error">' + data.error + '</p>');
                if(data.fields) {
                   data.fields.forEach(function(name) {
                       $($this).closest('form').find('#post-' + name).addClass('error');
                   })
                }
                return;
            }
            location.href = '/';
        })
    });
});
/* eslint-enable no-undef */