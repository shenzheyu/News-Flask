from flask import Flask, jsonify, request
from newsapi import NewsApiClient
import re

from newsapi.newsapi_exception import NewsAPIException

app = Flask(__name__)

API_KEY = '426c4b696b114be8aa3e4bd9cf3c6d87'


@app.route('/')
def get_html():
    return app.send_static_file('index.html')


@app.route('/script.js')
def get_js():
    return app.send_static_file('script.js')


@app.route('/style.css')
def get_css():
    return app.send_static_file('style.css')


@app.route('/word_cloud')
def get_word_cloud():
    # get the top 30 articles
    newsapi = NewsApiClient(api_key=API_KEY)
    top_headlines = newsapi.get_top_headlines(language='en',
                                              country='us',
                                              page_size=30)
    # get the words of title
    words = []
    for article in top_headlines['articles']:
        headline = article['title']
        words.extend(headline.split())

    # load the stop words
    stop_words = []
    with open('stopwords_en.txt', 'r') as f:
        for word in f.readlines():
            stop_words.append(word.strip('\n'))

    # get the word frequency dictionary, sort it and return the top 30
    frequency_dic = {}
    for word in set(words):
        if word.lower() in stop_words:
            continue
        if not bool(re.search('[a-zA-Z]', word)):
            continue
        frequency_dic[word] = words.count(word)
    top_30 = sorted(frequency_dic.items(), key=lambda item: item[1], reverse=True)[:30]
    res = []
    for item in top_30:
        res.append({'word': item[0], 'size': item[1]})
    return jsonify({'words': res})


@app.route('/headline')
def get_headline():
    newsapi = NewsApiClient(api_key=API_KEY)
    top_headlines = newsapi.get_top_headlines(language='en',
                                              country='us',
                                              page_size=30)
    res = []
    for article in top_headlines['articles']:
        if len(res) == 5:
            break
        if has_all_key(article):
            res.append({'image': article['urlToImage'],
                        'title': article['title'],
                        'description': article['description'],
                        'url': article['url']})
    return jsonify({'articles': res})


@app.route('/cnn')
def get_cnn():
    newsapi = NewsApiClient(api_key=API_KEY)
    top_headlines = newsapi.get_top_headlines(sources='cnn',
                                              language='en',
                                              page_size=30)
    res = []
    for article in top_headlines['articles']:
        if len(res) == 4:
            break
        if has_all_key(article):
            res.append({'image': article['urlToImage'],
                        'title': article['title'],
                        'description': article['description'],
                        'url': article['url']})
    return jsonify({'articles': res})


@app.route('/fox_news')
def get_fox_news():
    newsapi = NewsApiClient(api_key=API_KEY)
    top_headlines = newsapi.get_top_headlines(sources='fox-news',
                                              language='en',
                                              page_size=30)
    res = []
    for article in top_headlines['articles']:
        if len(res) == 4:
            break
        if has_all_key(article):
            res.append({'image': article['urlToImage'],
                        'title': article['title'],
                        'description': article['description'],
                        'url': article['url']})
    return jsonify({'articles': res})


def has_all_key(article):
    if 'author' not in article:
        return False
    else:
        if article['author'] == '' or article['author'] is None:
            return False
    if 'description' not in article:
        return False
    else:
        if article['description'] == '' or article['description'] is None:
            return False
    if 'title' not in article:
        return False
    else:
        if article['title'] == '' or article['title'] is None:
            return False
    if 'url' not in article:
        return False
    else:
        if article['url'] == '' or article['url'] is None:
            return False
    if 'urlToImage' not in article:
        return False
    else:
        if article['urlToImage'] == '' or article['urlToImage'] is None:
            return False
    if 'publishedAt' not in article:
        return False
    else:
        if article['publishedAt'] == '' or article['publishedAt'] is None:
            return False
    if 'source' not in article:
        return False
    if 'id' not in article['source']:
        return False
    else:
        if article['source']['id'] == '' or article['source']['id'] is None:
            return False
    if 'name' not in article['source']:
        return False
    else:
        if article['source']['name'] == '' or article['source']['name'] is None:
            return False
    return True


@app.route('/query')
def search():
    try:
        requests = request.args
        keyword = requests['keyword']
        from_date = requests['from_date']
        to_date = requests['to_date']
        source = requests['source']

        if keyword == 'all':
            keyword = None
        if source == 'all':
            source = None

        newsapi = NewsApiClient(api_key=API_KEY)
        result = newsapi.get_everything(q=keyword,
                                        sources=source,
                                        from_param=from_date,
                                        to=to_date,
                                        language='en',
                                        page_size=30,
                                        sort_by='publishedAt')

        res = []
        for article in result['articles']:
            if len(res) == 10:
                break
            if has_all_key(article):
                res.append({'image': article['urlToImage'],
                            'title': article['title'],
                            'description': article['description'],
                            'author': article['author'],
                            'source': article['source']['name'],
                            'date': article['publishedAt'],
                            'link_to_original_post': article['url']})

        return jsonify({'articles': res})

    except NewsAPIException as e:
        return jsonify({'error': e.get_message()})



@app.route('/source/<string:category>')
def get_source(category):
    if category == 'all':
        category = None
    else:
        category = category.lower()

    newsapi = NewsApiClient(api_key=API_KEY)
    result = newsapi.get_sources(category=category,
                                 language='en',
                                 country='us')

    res = []
    for source in result['sources']:
        res.append({'id': source['id'], 'name': source['name']})
    return jsonify({'sources': res})


if __name__ == '__main__':
    app.run(debug=True)
