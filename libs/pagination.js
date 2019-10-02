function first(path, page) {

    if (page == 1) {

        return '<li><a class="disabled">&laquo;</a></li>';

    } else {

        return '<li><a href="' + path + '1">&laquo;</a></li>';

    }

}

function last(path, page, pages) {

    if (page == pages) {

        return '<li><a class="disabled">&raquo;</a></li>';

    } else {

        return '<li><a href="' + path + pages + '">&raquo;</a></li>';

    }

}

module.exports = (path, page, pages) => {

    var pagination = '<ul id="pagination">';

    pagination += first(path, page);

    var i = (Number(page) > 5 ? Number(page) - 4 : 1);

    if (i !== 1) {

        pagination += '<li><a class="disabled">...</a></li>';

    }

    for (; i <= (Number(page) + 4) && i <= pages; i++) {

        if (i == page) {

            pagination += '<li><a class="current">'+ i +'</a></li>';

        } else {

            pagination += '<li><a href="'+ path + i +'">'+ i +'</a></li>';

        }

        if (i == Number(page) + 4 && i < pages) {

            pagination += '<li><a class="disabled">...</a></li>';

        }

    }

    pagination += last(path, page, pages);

    pagination += '</ul>';

    return pagination;

};