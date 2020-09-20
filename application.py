from flask import Flask, request
from newsapi import NewsApiClient
import json
from collections import Counter

# EB looks for an 'application' callable by default.
application = Flask(__name__, static_url_path='')

newsapi=NewsApiClient(api_key='edd3548193ab4c0e8cbfe20242e4ab47')

@application.route('/')
@application.route('/index')
def index():
    return application.send_static_file('index.html')

@application.route('/top_news')
def get_headlines():
    #getting 30 top headlines 
    top_headlines = newsapi.get_top_headlines(page_size=30)
    first_page_data=dict()
    first_page_data["top_headlines"]=[]
    first_page_data["cnn_headlines"]=[]
    first_page_data["fox_headlines"]=[]
    first_page_data["frequent_words"]=[]

    stop_file=open('stopwords_en.txt', 'r')
    list_stopwords=list(stop_file)
    list_stopwords=set([item.rstrip("\n") for item in list_stopwords])

    articles=top_headlines["articles"]
    count=0

    frequency=dict()
    for article in articles:
        temp=article["title"].split(" ")
        for word in temp:
            if word not in list_stopwords:
                if word in frequency:
                    frequency[word]+=1
                else:
                    frequency[word]=1
        if count<5:   
            if article["source"]!="" and article["author"]!="" and article["description"]!="" and article["title"]!="" and article["url"]!="" and article["urlToImage"]!="" and article["publishedAt"]!="" and article["source"]!=None and article["author"]!=None and article["description"]!=None and article["title"]!=None and article["url"]!=None and article["urlToImage"]!=None and article["publishedAt"]!=None and article["source"]["name"]!="" and article["source"]["name"]!=None and article["source"]["name"]!="null" and article["source"]!={} and article["source"]!="null" and article["author"]!="null" and article["description"]!="null" and article["title"]!="null" and article["url"]!="null" and article["urlToImage"]!="null" and article["publishedAt"]!="null":
                first_page_data["top_headlines"].append(article)
                count+=1   
    
    top_frequent=Counter(frequency)
    top_frequent_words=top_frequent.most_common(30)
    top=[]
    for item in top_frequent_words:
        top.append({'word':item[0],'size':item[1]*8})
    top_frequent_words=top
    #print(top_frequent_words)
    first_page_data["frequent_words"]=top_frequent_words

    #getting 30 top headlines from cnn news
    cnn_headlines = newsapi.get_top_headlines(sources='cnn', page_size=30)

    articles=cnn_headlines["articles"]
    count=0
    for article in articles:
        if count>=4:
            break   
        if article["source"]!="" and article["author"]!="" and article["description"]!="" and article["title"]!="" and article["url"]!="" and article["urlToImage"]!="" and article["publishedAt"]!="" and article["source"]!=None and article["author"]!=None and article["description"]!=None and article["title"]!=None and article["url"]!=None and article["urlToImage"]!=None and article["publishedAt"]!=None and article["source"]["name"]!="" and article["source"]["name"]!=None and article["source"]["name"]!="null" and article["source"]!={} and article["source"]!="null" and article["author"]!="null" and article["description"]!="null" and article["title"]!="null" and article["url"]!="null" and article["urlToImage"]!="null" and article["publishedAt"]!="null":
            first_page_data["cnn_headlines"].append(article)
            count+=1


    #getting 30 top headlines from fox news
    fox_headlines = newsapi.get_top_headlines(sources='fox-news', page_size=30)
    
    articles=fox_headlines["articles"]
    count=0
    for article in articles:
        if count>=4:
            break   
        if article["source"]!="" and article["author"]!="" and article["description"]!="" and article["title"]!="" and article["url"]!="" and article["urlToImage"]!="" and article["publishedAt"]!="" and article["source"]!=None and article["author"]!=None and article["description"]!=None and article["title"]!=None and article["url"]!=None and article["urlToImage"]!=None and article["publishedAt"]!=None and article["source"]["name"]!="" and article["source"]["name"]!=None and article["source"]["name"]!="null" and article["source"]!={} and article["source"]!="null" and article["author"]!="null" and article["description"]!="null" and article["title"]!="null" and article["url"]!="null" and article["urlToImage"]!="null" and article["publishedAt"]!="null":
            first_page_data["fox_headlines"].append(article)
            count+=1

    #print(first_page_data)
    first_page_data=json.dumps(first_page_data)
    print("Data sent")
    return first_page_data

@application.route('/sources')
def get_sources():
    if request.method == 'GET':
        received_category=request.args.get('current')
    #getting all the sources the belong to a particular category
    if received_category=='all':
        sources = newsapi.get_sources(language='en',country='us')
    else:
        sources = newsapi.get_sources(category=received_category,language='en',country='us')
    sources=json.dumps(sources)
    return sources    

@application.route('/search')
def get_search_results():
    if request.method=='GET':
        q=request.args.get('key')
        from_param=request.args.get('from')
        to=request.args.get('to')
        language='en'
        #category=request.args.get('category')
        sources=request.args.get('source')
        try:
            output={'data':[]}
            if sources=='all':
                output_data=newsapi.get_everything(q=q,from_param=from_param,to=to,language=language,sort_by="publishedAt",page_size=30)
            else:
                output_data=newsapi.get_everything(q=q,from_param=from_param,to=to,language=language,sources=sources,sort_by="publishedAt",page_size=30)
            
            articles=output_data["articles"]
            count=0
            for article in articles:   
                if count>=15:
                    break
                if article["source"]!="" and article["author"]!="" and article["description"]!="" and article["title"]!="" and article["url"]!="" and article["urlToImage"]!="" and article["publishedAt"]!="" and article["source"]!=None and article["author"]!=None and article["description"]!=None and article["title"]!=None and article["url"]!=None and article["urlToImage"]!=None and article["publishedAt"]!=None and article["source"]["name"]!="" and article["source"]["name"]!=None and article["source"]["name"]!="null" and article["source"]!={} and article["source"]!="null" and article["author"]!="null" and article["description"]!="null" and article["title"]!="null" and article["url"]!="null" and article["urlToImage"]!="null" and article["publishedAt"]!="null":
                    output["data"].append(article)
                    count+=1
            output=json.dumps(output)
            return output
        except Exception as e:
            output=dict()
            print(e)
            output["error"]=e.get_exception()['message']
            return json.dumps(output)
    
# run the app.
if __name__ == "__main__":
    # Setting debug to True enables debug output.
    application.debug = True
    application.run()