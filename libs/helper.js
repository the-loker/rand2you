
module.exports = {

    isObjectId: function (data) {

        let regex = new RegExp("^[0-9a-fA-F]{24}$");

        if (!regex.test(data)) {

            return false;

        }

        return true;
    },

    slugGeneration: function (str) {

        var data = '';

        str = str.toLowerCase();

        var replace = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'e', 'ж': 'zh',
            'з': 'z', 'и': 'i', 'й': 'j', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
            'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h',
            'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh', 'ъ': '-',
            'ы': 'y', 'ь': '-', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };

        for (var i = 0; i < str.length; i++) {
            if (/[а-яё]/.test(str.charAt(i))) { // заменяем символы на русском
                data += replace[str.charAt(i)];
            } else if (/[a-z0-9]/.test(str.charAt(i))) { // символы на анг. оставляем как есть
                data += str.charAt(i);
            } else {
                if (data.slice(-1) !== '-') data += '-'; // прочие символы заменяем на space
            }
        }

        return data;

    }

};