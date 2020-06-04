function home_page() {
    var side = document.getElementById('side');
    var google_news = side.childNodes[1];
    var search = side.childNodes[3];
    google_news.setAttribute('id', 'this_page_button');
    search.setAttribute('id', 'other_page_button');


    var body = document.getElementById('body');
    while (body.hasChildNodes()) {
        body.removeChild(body.firstChild);
    }

    var banner = document.createElement("div");
    banner.setAttribute("id", "banner");
    body.appendChild(banner);

    load_carousel();

    var cloud = document.createElement("div");
    cloud.setAttribute("id", "cloud");
    banner.appendChild(cloud);
    load_cloud();

    var cnn = document.createElement("div");
    cnn.setAttribute("id", "cnn");
    body.appendChild(cnn);
    load_cnn();

    var fox = document.createElement("div");
    fox.setAttribute("id", "fox");
    body.appendChild(fox);
    load_fox();
}

function load_carousel() {
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", '/headline',false);
    xmlhttp.send();
    jsonObj = JSON.parse(xmlhttp.responseText);
    var articles = jsonObj.articles;
    // var article = articles[1];

    var banner = document.getElementById('banner');

    var a = document.createElement('a');
    // a.setAttribute('href', article.url);
    banner.appendChild(a);

    var carousel = document.createElement('div');
    carousel.setAttribute('id', 'carousel');
    // carousel.setAttribute('style',  'background-image:url(\"' + article.image + '\"); background-size:cover;');
    a.appendChild(carousel);

    var carousel_text = document.createElement('div');
    carousel_text.setAttribute('id', 'carousel_text');
    carousel.appendChild(carousel_text);

    var carousel_title = document.createElement('div');
    carousel_title.setAttribute('id', 'carousel_title');
    // carousel_title.innerText = article.title;
    carousel_text.appendChild(carousel_title);

    var p = document.createElement('p');
    // p.innerText = article.description;
    carousel_text.appendChild(p);

    change_img(articles, 0, a, carousel, carousel_title, p)
}

function change_img(articles, i, a, carousel, carousel_title, p) {
    var article = articles[i % 5];
    a.setAttribute('href', article.url);
    carousel.setAttribute('style',  'background-image:url(\"' + article.image + '\"); background-size:cover;');
    carousel_title.innerText = article.title;
    p.innerText = article.description;
    setTimeout(function () {
        change_img(articles, i + 1, a, carousel, carousel_title, p);
    }, 3000);
}

function load_cloud() {
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", '/word_cloud',false);
    xmlhttp.send();
    jsonObj = JSON.parse(xmlhttp.responseText);

    var myWords = jsonObj.words;

    var layout = d3.layout.cloud()
        .size([265, 225])
        .words(myWords.map(function(d) {
          return {text: d.word, size: d.size};
        }))
        .padding(5)
        .spiral("archimedean")
        .rotate(function() { return ~~(Math.random() * 4) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size * 10; })
        .on("end", draw);

    layout.start();

    function draw(words) {
      d3.select("#cloud").append("svg")
          .attr("width", layout.size()[0])
          .attr("height", layout.size()[1])
        .append("g")
          .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
    }
}

function load_cnn() {
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", '/cnn',false);
    xmlhttp.send();
    jsonObj = JSON.parse(xmlhttp.responseText);
    var articles = jsonObj.articles;

    var cnn = document.getElementById('cnn');
    cnn.innerText = 'CNN';

    var hr = document.createElement('div');
    hr.setAttribute('class', 'hr_line');
    cnn.appendChild(hr);

    for (var i = 0; i < 4; i++) {
        var article = articles[i];

        var a = document.createElement('a');
        a.setAttribute('href', article.url);
        cnn.appendChild(a);

        var cnn_card = document.createElement('div');
        cnn_card.setAttribute('class', 'cnn_card');
        a.appendChild(cnn_card);

        var cnn_card_image = document.createElement('div');
        cnn_card_image.setAttribute('class', 'cnn_card_image');
        cnn_card.appendChild(cnn_card_image);

        var img = document.createElement('img');
        img.setAttribute('src', article.image);
        cnn_card_image.appendChild(img);

        var h6 = document.createElement('h6');
        h6.innerText = article.title;
        cnn_card.appendChild(h6);

        var p = document.createElement('p');
        p.innerText = article.description;
        cnn_card.appendChild(p);
    }

    var most_height = 0;
    var cnn_cards = document.getElementsByClassName('cnn_card');
    for (var i = 0; i < 4; i++) {
        var height = parseInt(window.getComputedStyle(cnn_cards[i]).height);
        if (height > most_height) {
            most_height = height;
        }
    }
    for (var i = 0; i < 4; i++) {
        cnn_cards[i].style.height = most_height.toString() + 'px';
    }
}

function load_fox() {
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", '/fox_news',false);
    xmlhttp.send();
    jsonObj = JSON.parse(xmlhttp.responseText);
    var articles = jsonObj.articles;

    var fox = document.getElementById('fox');
    fox.innerText = 'Fox News';

    var hr = document.createElement('div');
    hr.setAttribute('class', 'hr_line');
    fox.appendChild(hr);

    for (var i = 0; i < 4; i++) {
        var article = articles[i];

        var a = document.createElement('a');
        a.setAttribute('href', article.url);
        fox.appendChild(a);

        var fox_card = document.createElement('div');
        fox_card.setAttribute('class', 'fox_card');
        a.appendChild(fox_card);

        var fox_card_image = document.createElement('div');
        fox_card_image.setAttribute('class', 'fox_card_image');
        fox_card.appendChild(fox_card_image);

        var img = document.createElement('img');
        img.setAttribute('src', article.image);
        fox_card_image.appendChild(img);

        var h6 = document.createElement('h6');
        h6.innerText = article.title;
        fox_card.appendChild(h6);

        var p = document.createElement('p');
        p.innerText = article.description;
        fox_card.appendChild(p);
    }

    var most_height = 0;
    var fox_cards = document.getElementsByClassName('fox_card');
    for (var i = 0; i < 4; i++) {
        var height = parseInt(window.getComputedStyle(fox_cards[i]).height);
        if (height > most_height) {
            most_height = height;
        }
    }
    for (var i = 0; i < 4; i++) {
        fox_cards[i].style.height = most_height.toString() + 'px';
    }
}

function search_page() {
    var side = document.getElementById('side');
    var google_news = side.childNodes[1];
    var search = side.childNodes[3];
    google_news.setAttribute('id', 'other_page_button');
    search.setAttribute('id', 'this_page_button');

    var body = document.getElementById('body');
    while (body.hasChildNodes()) {
        body.removeChild(body.firstChild);
    }

    var input = document.createElement('div');
    input.setAttribute('id', 'input');
    body.appendChild(input);
    load_input();
}

function load_input() {
    var input = document.getElementById('input');

    var form = document.createElement('form');
    form.setAttribute('onsubmit',
        'return search(this.keyword.value, ' +
        'this.from_date.value, ' +
        'this.to_date.value, ' +
        'this.source.options.item(this.source.selectedIndex).value)');
    form.setAttribute('id', 'search_form');
    input.appendChild(form);

    var input_first_line = document.createElement('div');
    input_first_line.setAttribute('id', 'input_first_line');
    form.appendChild(input_first_line);

    var keyword_text = document.createTextNode('Keyword ');
    input_first_line.appendChild(keyword_text);

    var keyword_star = document.createElement('text');
    keyword_star.setAttribute('style', 'color: red');
    keyword_star.innerText = '*';
    input_first_line.appendChild(keyword_star);

    var keyword_input = document.createElement('input');
    keyword_input.setAttribute('style', 'width: 90px');
    keyword_input.setAttribute('type', 'text');
    keyword_input.setAttribute('name', 'keyword');
    // keyword_input.setAttribute('onkeyup', 'keyword_empty(this, this.value)');
    keyword_input.setAttribute('required', 'true');
    input_first_line.appendChild(keyword_input);

    // keyword_empty(keyword_input, keyword_input.value);

    var from_text = document.createTextNode('From ');
    input_first_line.appendChild(from_text);

    var from_star = document.createElement('text');
    from_star.setAttribute('style', 'color: red');
    from_star.innerText = '*';
    input_first_line.appendChild(from_star);

    var from_input = document.createElement('input');
    from_input.setAttribute('style', 'width: 115px');
    from_input.setAttribute('type', 'date');
    from_input.setAttribute('name', 'from_date');
    from_input.setAttribute('required', 'true');
    input_first_line.appendChild(from_input);

    var to_text = document.createTextNode('To ');
    input_first_line.appendChild(to_text);

    var to_star = document.createElement('text');
    to_star.setAttribute('style', 'color: red');
    to_star.innerText = '*';
    input_first_line.appendChild(to_star);

    var to_input = document.createElement('input');
    to_input.setAttribute('style', 'width: 115px');
    to_input.setAttribute('type', 'date');
    to_input.setAttribute('name', 'to_date');
    to_input.setAttribute('required', 'true');
    input_first_line.appendChild(to_input);

    default_date();

    var input_second_line = document.createElement('div');
    input_second_line.setAttribute('id', 'input_second_line');
    form.appendChild(input_second_line);

    var category_text = document.createTextNode('Category');
    input_second_line.appendChild(category_text);

    var category_select = document.createElement('select');
    category_select.setAttribute('onchange', 'load_source(this.value)');
    category_select.setAttribute('name', 'category');
    input_second_line.appendChild(category_select);

    var category_all = document.createElement('option');
    category_all.setAttribute('value', 'all');
    category_all.innerText = 'all';
    category_select.appendChild(category_all);

    var category_business = document.createElement('option');
    category_business.setAttribute('value', 'business');
    category_business.innerText = 'business';
    category_select.appendChild(category_business);

    var category_entertainment = document.createElement('option');
    category_entertainment.setAttribute('value', 'entertainment');
    category_entertainment.innerText = 'entertainment';
    category_select.appendChild(category_entertainment);

    var category_general = document.createElement('option');
    category_general.setAttribute('value', 'general');
    category_general.innerText = 'general';
    category_select.appendChild(category_general);

    var category_health = document.createElement('option');
    category_health.setAttribute('value', 'health');
    category_health.innerText = 'health';
    category_select.appendChild(category_health);

    var category_science = document.createElement('option');
    category_science.setAttribute('value', 'science');
    category_science.innerText = 'science';
    category_select.appendChild(category_science);

    var category_sports = document.createElement('option');
    category_sports.setAttribute('value', 'sports');
    category_sports.innerText = 'sports';
    category_select.appendChild(category_sports);

    var category_technology = document.createElement('option');
    category_technology.setAttribute('value', 'technology');
    category_technology.innerText = 'technology';
    category_select.appendChild(category_technology);

    var source_text = document.createTextNode('Source');
    input_second_line.appendChild(source_text);

    var source_select = document.createElement('select');
    source_select.setAttribute('name', 'source');
    input_second_line.appendChild(source_select);

    load_source('all');

    var input_third_line = document.createElement('div');
    input_third_line.setAttribute('id', 'input_third_line');
    form.appendChild(input_third_line);

    var submit_button = document.createElement('button');
    submit_button.setAttribute('type', 'submit');
    submit_button.innerText = 'Search';
    input_third_line.appendChild(submit_button);

    var clear_button = document.createElement('button');
    // clear_button.setAttribute('type', 'reset');
    clear_button.setAttribute('onclick', 'clear_input()');
    clear_button.innerText = 'Clear';
    input_third_line.appendChild(clear_button);
}

function load_source(category) {
    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", '/source/' + category ,false);
    xmlhttp.send();
    jsonObj = JSON.parse(xmlhttp.responseText);
    var sources = jsonObj.sources;

    var source_select = document.getElementsByName('source')[0];
    for (var i = source_select.options.length - 1; i >= 0; i--) {
        source_select.options.remove(i);
    }

    var source_all = document.createElement('option');
    source_all.setAttribute('value', 'all');
    source_all.innerText = 'all';
    source_select.appendChild(source_all);

    for (var i = 0; i < sources.length; i++) {
        var source = sources[i];
        var source_option = document.createElement('option');
        source_option.setAttribute('value', source.id);
        source_option.innerText = source.name;
        source_select.appendChild(source_option);
    }

}

function keyword_empty(input, value) {
    if (value == '') {
        input.setAttribute('style', 'width: 90px; border: 1px red solid');
    }
    else {
        input.setAttribute('style', 'width: 90px; border: none');
    }
}

function default_date() {
    var to_date, from_date;
    if (save_to_date == null) {
        to_date = new Date();
    }
    else {
        to_date = save_to_date;
    }
    document.getElementsByName('to_date')[0].valueAsDate = to_date;
    if (save_from_date == null) {
        from_date = new Date();
        from_date.setDate(from_date.getDate() - 7);
    }
    else {
        from_date = save_from_date;
    }
    document.getElementsByName('from_date')[0].valueAsDate = from_date;
}

var search_result = '';
var save_to_date = null;
var save_from_date = null;

function search(keyword, from_date, to_date, source) {
    if (!check_date(from_date, to_date)) {
        alert('Incorrect time');
        return false;
    }

    var xmlhttp=new XMLHttpRequest();
    xmlhttp.open("GET", '/query?keyword=' + keyword + '&from_date=' + from_date + '&to_date=' + to_date + '&source=' + source ,false);
    xmlhttp.send();
    jsonObj = JSON.parse(xmlhttp.responseText);

    if (jsonObj.hasOwnProperty('error')) {
        alert(jsonObj['error']);
        return false;
    }

    search_result = jsonObj.articles;

    if (search_result.length == 0) {
        show_no_result();
        return false;
    }


    var num_result = search_result.length;
    var show_num = num_result > 5 ? 5 : num_result;

    var body = document.getElementById('body');

    if (document.getElementById('result')) {
        body.removeChild(document.getElementById('result'));
    }

    var result = document.createElement('div');
    result.setAttribute('id', 'result');
    body.appendChild(result);

    for (var i = 0; i < show_num; i++) {
        var article = search_result[i];

        var result_item = document.createElement('div');
        result_item.setAttribute('class', 'result_item');
        result_item.setAttribute('onclick', 'show_detail(this)');
        result_item.setAttribute('id', 'result_item_' + i);
        result.appendChild(result_item);

        var img_container = document.createElement('div');
        img_container.setAttribute('class', 'img_container');
        result_item.appendChild(img_container);

        var img = document.createElement('img');
        img.setAttribute('src', article.image);
        img_container.appendChild(img);

        var text = document.createElement('div');
        text.setAttribute('class', 'text');
        result_item.appendChild(text);

        var h6 = document.createElement('h6');
        h6.innerText = article.title;
        text.appendChild(h6);

        var p = document.createElement('p');
        var description = '';
        if (article.description.length > 60) {
            description = article.description.substr(0, 60) + '...';
        }
        else {
            description = article.description;
        }
        p.innerText = description;
        text.appendChild(p);
    }

    if (num_result > 5) {
        var show_more_button = document.createElement('button');
        show_more_button.setAttribute('onclick', 'show_more()');
        show_more_button.innerText = 'Show More';
        result.appendChild(show_more_button);
    }

    return false;
}

function show_detail(item) {
    var id = item.id;
    var index = parseInt(id[12]);

    var article = search_result[index];

    while (item.hasChildNodes()) {
        item.removeChild(item.firstChild);
    }

    item.setAttribute('class', 'detail_item');

    var img_container = document.createElement('div');
    img_container.setAttribute('class', 'img_container');
    item.appendChild(img_container);

    var img = document.createElement('img');
    img.setAttribute('src', article.image);
    img_container.appendChild(img);

    var text = document.createElement('div');
    text.setAttribute('class', 'text');
    item.appendChild(text);

    var title = document.createElement('h6');
    title.innerText = article.title;
    text.appendChild(title);

    var author = document.createElement('p');
    author.innerHTML = '<b>Author: <\/b>' + article.author;
    text.appendChild(author);

    var source = document.createElement('p');
    source.innerHTML = '<b>Source: <\/b>' + article.source;
    text.appendChild(source);

    var date = document.createElement('p');
    var date_str = article.date.substr(5, 2) + '/' +
        article.date.substr(8, 2) + '/' +
        article.date.substr(0,4);
    date.innerHTML = '<b>Date: <\/b>' + date_str;
    text.appendChild(date);

    var description = document.createElement('p');
    description.innerText = article.description;
    text.appendChild(description);

    var link = document.createElement('p');
    text.appendChild(link);

    var a = document.createElement('a');
    a.setAttribute('href', article.link_to_original_post);
    a.innerText = 'See Original Post';
    link.appendChild(a);

    var close_botton = document.createElement('div');
    close_botton.setAttribute('class', 'close_button');
    close_botton.setAttribute('onmousedown', 'close_detail(this.parentElement)');
    close_botton.innerHTML = '&times';
    item.appendChild(close_botton);
}

function close_detail(item) {
    var id = item.id;
    var index = parseInt(id[12]);

    var article = search_result[index];

    while (item.hasChildNodes()) {
        item.removeChild(item.firstChild);
    }

    item.setAttribute('class', 'result_item');

    var img_container = document.createElement('div');
    img_container.setAttribute('class', 'img_container');
    item.appendChild(img_container);

    var img = document.createElement('img');
    img.setAttribute('src', article.image);
    img_container.appendChild(img);

    var text = document.createElement('div');
    text.setAttribute('class', 'text');
    item.appendChild(text);

    var h6 = document.createElement('h6');
    h6.innerText = article.title;
    text.appendChild(h6);

    var p = document.createElement('p');
    var description = '';
    if (article.description.length > 60) {
        description = article.description.substr(0, 60) + '...';
    }
    else {
        description = article.description;
    }
    p.innerText = description;
    text.appendChild(p);
}

function show_more() {
    var result = document.getElementById('result');
    var button = result.childNodes[5];

    for (var i = 5; i < search_result.length; i++) {
        var article = search_result[i];

        var result_item = document.createElement('div');
        result_item.setAttribute('class', 'result_item');
        result_item.setAttribute('onclick', 'show_detail(this)');
        result_item.setAttribute('id', 'result_item_' + i);
        result.insertBefore(result_item, button);

        var img_container = document.createElement('div');
        img_container.setAttribute('class', 'img_container');
        result_item.appendChild(img_container);

        var img = document.createElement('img');
        img.setAttribute('src', article.image);
        img_container.appendChild(img);

        var text = document.createElement('div');
        text.setAttribute('class', 'text');
        result_item.appendChild(text);

        var h6 = document.createElement('h6');
        h6.innerText = article.title;
        text.appendChild(h6);

        var p = document.createElement('p');
        var description = '';
        if (article.description.length > 60) {
            description = article.description.substr(0, 60) + '...';
        }
        else {
            description = article.description;
        }
        p.innerText = description;
        text.appendChild(p);
    }

    button.innerText = 'Show Less';
    button.setAttribute('onclick', 'show_less()');
}

function show_less() {
    var result = document.getElementById('result');
    var result_items = result.childNodes;

    for (var i = result_items.length - 1; i > 4; i--) {
        result.removeChild(result_items[i]);
    }

    var show_more_button = document.createElement('button');
    show_more_button.setAttribute('onclick', 'show_more()');
    show_more_button.innerText = 'Show More';
    result.appendChild(show_more_button);
}

function clear_input() {
    search_page();
}

function check_date(from, to) {
    var from_year = parseInt(from.substr(0, 4));
    var from_month = parseInt(from.substr(5, 2));
    var from_day = parseInt(from.substr(8,2));

    var to_year = parseInt(to.substr(0, 4));
    var to_month = parseInt(to.substr(5, 2));
    var to_day = parseInt(to.substr(8, 2));

    if (from_year > to_year) {
        return false;
    }
    else if (from_year == to_year) {
        if (from_month > to_month) {
            return false;
        }
        else if (from_month == to_month) {
            if (from_day > to_day) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }
    else {
        return true;
    }
}

function show_no_result() {
    var body = document.getElementById('body');

    if (document.getElementById('result')) {
        body.removeChild(document.getElementById('result'));
    }

    var result = document.createElement('div');
    result.setAttribute('id', 'result');
    body.appendChild(result);

    result.innerHTML = '<p style="text-align: center; font-size: 90%">No results</p>';
}
