var main_layout = document.getElementsByClassName('layout')[0];
var google_news=document.getElementsByClassName("options")[0];
var search_button=document.getElementsByClassName("options")[1];
window.addEventListener('load', get_top_news);
//function to get everything about first page
function get_top_news(){
  var firstpage="";
  //making the google news button darker color and set the text color to white.
  google_news.classList.add("current");
  search_button.classList.remove("current");

  var xhttp = new XMLHttpRequest();
  xhttp.open("GET","/top_news",true);
  xhttp.send();
  xhttp.onreadystatechange = function(){
    if(this.status==200 && this.readyState==4){
      var data=JSON.parse(this.responseText);
      var top_headlines=data.top_headlines;
      firstpage+="<div class='row1'><div class='slideshow-container'>";
      for(var i=0;i<top_headlines.length;i++){
        var article=top_headlines[i];
        firstpage+="<div class='mySlides fade' onclick=open_news('"+article.url+"')><img src='"+article.urlToImage+"' style='width:100%'><div class='slide_text'><h2>"+article.title.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</h2><p>"+article.description.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</p></div></div>";
      }
      firstpage+="</div><div class='wordcloud'><div id='my_dataviz'></div></div></div><h1>CNN</h1><hr><div class='cards'>";
      var cnn_headlines=data.cnn_headlines;
      for(var i=0;i<cnn_headlines.length;i++){
        var article=cnn_headlines[i];
          firstpage+="<div class='card' onclick=open_news('"+article.url+"')><img src="+article.urlToImage+" style='width:100%'><div class='card-container'><h4><b>"+article.title.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</b></h4><p>"+article.description.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</p></div></div>";
      }
      firstpage+="</div><h1>Fox News</h1><hr><div class='cards'>";
      var fox_headlines=data.fox_headlines;
      for(var i=0;i<fox_headlines.length;i++){
        var article=fox_headlines[i];
        firstpage+="<div class='card' onclick=open_news('"+article.url+"')><img src="+article.urlToImage+" style='width:100%'><div class='card-container'><h4><b>"+article.title.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</b></h4><p>"+article.description.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</p></div></div>";
      }
      firstpage+="</div>";
      var myWords=data.frequent_words;
      main_layout.innerHTML=firstpage;
      
      //set the dimensions and margins of the graph
      var margin = {top: 5, right: 5, bottom: 5, left: 5},
      width = 285 - margin.left - margin.right,
      height = 245 - margin.top - margin.bottom;
        
      // append the svg object to the body of the page
      svg = d3.select("#my_dataviz").append("svg")
        .attr("width", "100%")
        .attr("height", "100%")
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
      // Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
      // Wordcloud features that are different from one word to the other must be here
      layout = d3.layout.cloud()
        .size([width, height])
        .words(myWords.map(function(d) { return {text: d.word, size:d.size}; }))
        .padding(5)        //space between words
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .fontSize(function(d) { return d.size; })      // font size of words
        .on("end", draw);
      layout.start();
      slideIndex=1;
      slides = document.getElementsByClassName("mySlides");
      showSlides();
    }
  }
}

//function to open the url in a new window
function open_news(url){
  var win = window.open(url, '_blank');
  win.focus();
}

//function for slideshow
function showSlides(){
    var i;
    if (slideIndex > slides.length) {
      slideIndex = 1
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    slides[slideIndex-1].style.display = "block";
    slideIndex++;
    stopping_variable=setTimeout(showSlides,2500);
}

// This function takes the output of 'layout' above and draw the words
// Wordcloud features that are THE SAME from one word to the other can be here
function draw(words) {
  svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("fill", "black")
        .attr("text-anchor", "middle")
        .style("font-family", "Impact, fantasy")
        .style("font-weight","bolder")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}

//function to get everything about second form page
function get_search_form(){
  clearTimeout(stopping_variable);
  google_news.classList.remove("current");
  search_button.classList.add("current");
  var secondpage="<div class='search-form'><form onsubmit='return false'>Keyword<span class='compulsory'>*</span><input class='keywords' type='text' required size='50'>From<span class='compulsory'>*</span><input type='date' required class='from_date'>To<span class='compulsory'>*</span><input type='date' required class='to_date'><br><label for='category'>Category</label><select class='category select-options'><option value='all'>all</option><option value='business'>business</option><option value='entertainment'>entertainment</option><option value='general'>general</option><option value='health'>health</option><option value='science'>science</option><option value='sports'>sports</option><option value='technology'>technology</option></select><label for='source'>Source</label><select class='srcs select-options'></select><br><button class='submit form-button' value='search' onclick=form_submit()>Search</button><button class='clear form-button' onclick='clear_data();' value='clear'>Clear</button></form></div><div class='search-results'></div>";
  main_layout.innerHTML=secondpage;

  //setting from date
  past=new Date();
  from_date = document.getElementsByClassName("from_date")[0];
  week_ago = past.getDate()-7;
  past.setDate(week_ago);
  from_date.value = past.getFullYear().toString() + '-' + (past.getMonth() + 1).toString().padStart(2, 0) + '-' + past.getDate().toString().padStart(2, 0);
  
  //setting to date
  today = new Date();
  to_date = document.getElementsByClassName("to_date")[0];
  to_date.value = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0);

  //changing source options based on category selected
  category_select=document.getElementsByClassName("category")[0];
  current_category=category_select.options[category_select.selectedIndex].value;
  set_source(current_category);
  category_select.addEventListener("change", function(){
    current_category=category_select.options[category_select.selectedIndex].value;
    set_source(current_category);
  });
  //on submit send the data to the flask file
  // submission=document.getElementsByClassName("submit")[0];
  // submission.addEventListener("click",function(){
  //   form_submit();
  // });
}

//change post to get in the end
//return only 10 sources from each category
function set_source(current){
  var xhttp = new XMLHttpRequest();
  xhttp.open('GET','/sources'+'?'+'current='+current,true);
  xhttp.send();
  xhttp.onreadystatechange = function(){
    if(this.status==200 && this.readyState==4){
      var data=JSON.parse(this.responseText);
      var sources=data.sources
      var src=document.getElementsByClassName("srcs")[0];
      while (src.firstChild) {
        src.removeChild(src.lastChild);
      }
      var first_option=document.createElement("option");
      first_option.text='all';
      first_option.value='all';
      src.appendChild(first_option);
      var count=0;
      for(var i=0;i<sources.length;i++){
        if(count>=10){
          break;
        }
        else{
          var myoption=document.createElement("option");
          myoption.text=sources[i].name;
          myoption.value=sources[i].id;
          src.appendChild(myoption);
          count+=1;
        }
      }
    }
  }
}

//clear the reusults printed
function clear_data(){
  /*document.getElementsByClassName("clear")[0].addEventListener("click",function(event){
    event.preventFocus();
  });*/
  document.getElementsByClassName("keywords")[0].value="";
  from_date.value = past.getFullYear().toString() + '-' + (past.getMonth() + 1).toString().padStart(2, 0) + '-' + past.getDate().toString().padStart(2, 0);
  to_date.value = today.getFullYear().toString() + '-' + (today.getMonth() + 1).toString().padStart(2, 0) + '-' + today.getDate().toString().padStart(2, 0);
  category_select.selectedIndex=0;
  current_category=category_select.options[category_select.selectedIndex].value;
  set_source(current_category);
  var result=document.getElementsByClassName("search-results")[0];
  result.innerHTML="";
}

function form_submit(){
  var url = "/search";
  var key=document.getElementsByClassName("keywords")[0].value;
  if(key=="" || key==null){
    return false;
  }
  var from=from_date.value;
  var to=to_date.value;
  if(from=="" || from==null){
    return false;
  }
  if(to=="" || to==null){
    return false;
  }
  if(from>to){
    alert("Incorrect Time");
    return false;
  }
  var cat=category_select.options[category_select.selectedIndex].value;
  var source=document.getElementsByClassName("srcs")[0];
  var sour=source.options[source.selectedIndex].value;

  var params = "key=".concat(key,"&from=",from,"&to=",to,"&category=",cat,"&source=",sour);
  var xhttp = new XMLHttpRequest();
  var sending=url.concat("?",params);
  xhttp.open('GET', sending, true);
  xhttp.send();
  xhttp.onreadystatechange = function(){
    if(this.status==200 && this.readyState==4){
      var data=JSON.parse(this.responseText);
      console.log(data);
      if(data.error){
        alert(data.error);
        return;
      }
      else{
        articles=data.data;
        var result=document.getElementsByClassName("search-results")[0];
        var output=""
        var number_of_articles=articles.length;
        if(number_of_articles==0){
          result.innerHTML="<p style='font-size:17px'>No results</p>"
        }
        else if(number_of_articles<=5){
          for(var i=0;i<articles.length;i++){
            var article=articles[i];
            var desc = article.description.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            output+="<div class='horizontal-card'><div class='small-card' onclick=expanded_card(this,"+i+")><div class='small-image'><img src='"+article.urlToImage+"'></div><div class='card-content'><h4>"+article.title.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</h4><p>"+truncate_string(desc)+"</p></div></div></div>";
          }
          result.innerHTML=output;
        }
        else{
          for(var i=0;i<5;i++){
            var article=articles[i];
            var desc = article.description.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            output+="<div class='horizontal-card'><div class='small-card' onclick=expanded_card(this,"+i+")><div class='small-image'><img src='"+article.urlToImage+"'></div><div class='card-content'><h4>"+article.title.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</h4><p>"+truncate_string(desc)+"</p></div></div></div>";
          }
          output+="<button class='show-more more-less' onclick=show_more_results()>Show More</button>"
          result.innerHTML=output;
        }
      }
    }
  }
}

function expanded_card(x,index){
  var date=articles[index].publishedAt;
  var date1=date.substring(5,7)+'/'+date.substring(8,10)+'/'+date.substring(0,4);
  var desc = articles[index].description.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  var big_card="<div class='small-image' style='padding:1%'><img src='"+articles[index].urlToImage+"'></div><div class='card-content' style='padding: 2% 1%;'><h4>"+articles[index].title.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</h4><p><b>Author: </b>"+articles[index].author.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</p><p><b>Source: </b>"+articles[index].source.name.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</p><p><b>Date: </b>"+date1+"</p><p>"+desc+"</p><p><a href="+articles[index].url+">See Original Post</a></p></div><div class='cross' onclick='collapsed_card(this,"+index+")' style='padding-right:1.5%'>&times;</div>";
  x.parentElement.innerHTML=big_card;
}

function collapsed_card(x,index){
  var desc = articles[index].description.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  var small_card="<div class='small-card' onclick=expanded_card(this,"+index+")><div class='small-image'><img src='"+articles[index].urlToImage+"'></div><div class='card-content'><h4>"+articles[index].title.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</h4><p>"+truncate_string(desc)+"</p></div></div>";
  x.parentElement.innerHTML=small_card;
}

function truncate_string(str){
  var width=446;
  var fs=13;
  var fc=1.91;
  var cpl = Math.floor(width / (fs / fc));
  //alert(cpl);
  str=str.substring(0,cpl+1);
  var n=str.lastIndexOf(' ');
  str=str.substring(0,n);
  str=str+'...';
  return str;
}

function show_more_results(){
  var btn=document.getElementsByClassName("show-more")[0];
  btn.style.display='none';
  var result=document.getElementsByClassName('search-results')[0];
  var output=result.innerHTML;
  for(var i=5;i<articles.length;i++){
    var article=articles[i];
    var desc = article.description.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    output+="<div class='horizontal-card'><div class='small-card' onclick=expanded_card(this,"+i+")><div class='small-image'><img src='"+article.urlToImage+"'></div><div class='card-content'><h4>"+article.title+"</h4><p>"+truncate_string(desc)+"</p></div></div></div>";
  }
  output+="<button class='show-less more-less' onclick=show_less_results()>Show Less</button>"
  result.innerHTML=output;
}

function show_less_results(){
  var result=document.getElementsByClassName('search-results')[0];
  var output="";
  for(var i=0;i<5;i++){
    var article=articles[i];
    var desc = article.description.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    output+="<div class='horizontal-card'><div class='small-card' onclick=expanded_card(this,"+i+")><div class='small-image'><img src='"+article.urlToImage+"' alt='Link not Found'></div><div class='card-content'><h4>"+article.title+"</h4><p>"+truncate_string(desc)+"</p></div></div></div>";
  }
  output+="<button class='show-more more-less' onclick=show_more_results()>Show More</button>"
  result.innerHTML=output;
}