$('.menuList').click(function () {

    var elem = $(this).children('.adminMenuList');

    if(elem.is(':hidden')) {
        $('.adminMenuList').hide();
        elem.show();
    } else {
        elem.hide();
    }

});

$(document).ready(function () {

    function calculateGame() {

        var rateSize = $('[name = "rateSize"]').val();
        var userLimit = $('[name = "userLimit"]').val();
        var userWinners = $('[name = "userWinners"]').val();


        var fullSum = (rateSize * userLimit);
        var bank = (rateSize * userLimit) - (rateSize * userLimit) * 30 / 100 ;
        var percent = fullSum - bank;
        var bankWin = bank / userWinners;

        $('#fullSum').text(fullSum);
        $('#percent').text(percent);
        $('#bank').text(bank);
        $('#bankWin').text(bankWin);

    }

    calculateGame();
    $('#gameCreateForm').change(calculateGame);

});
