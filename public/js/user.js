$('#show_sessions').click(function () {

    if($(this).attr('data') == 'show') {

        $('.last_sessions').hide();
        $('.sessions_all').show();
        $(this).attr({'data': 'hide'});
        $(this).text('Скрыть');

    } else if($(this).attr('data') == 'hide') {

        $('.last_sessions').show();
        $('.sessions_all').hide();
        $(this).attr({'data': 'show'});
        $(this).text('Показать');

    }

});
