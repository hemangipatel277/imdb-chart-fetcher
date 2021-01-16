var http = require('http');
var rp 	= require('request-promise');
const $ = require('cheerio');
//var url = 'https://www.imdb.com/india/top-rated-indian-movies/';
var base_url = "https://www.imdb.com";
var movies = [];



http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
debugger;
var query = require('url').parse(req.url,true).query;
if(query.link != undefined && typeof query.link != 'undefined') {
	var url = query.link;
}

if(url == undefined || url == 'undefined') {
	url = 'https://www.imdb.com/india/top-rated-indian-movies/';
}

rp(url)
  .then(function(html){
    //success!
    //console.log(html);
    //res.write($('.lister-list', html));
    //res.write(html);

	var movies_list = $('.lister-list', html).html();

   // res.write(movies_list);

    

	for(var i = 1; i < 6; i++)
	{
		var start_point = movies_list.indexOf('<span name="rk" data-value="'+i+'"></span>');
		var end_point   = movies_list.indexOf('data-recordmetrics="true"></div>', start_point);
		var length 		= end_point - start_point;
		var movie_html  = movies_list.substr(start_point, length);
var movie_detail_link = $(".secondaryInfo", movie_html).html();
		var moview_text = $(movie_html).text();

		var moview_arr  = moview_text.split("(");
		var movie_str   = moview_arr[0].trim();
		var movie_name 	= movie_str.substring(3);

		var other_details = moview_arr[1].split(")");
		var movie_release_year 	= other_details[0];

		var movie_extra_data 	= other_details[1].trim();
		var extra_data_arr 		= movie_extra_data.split(" ");
		var imdb_rating 		= extra_data_arr[0].trim();

		//res.write(movie_html);

		////////// Details Page
		var movie_detail_link = base_url + $('a', movie_html)[0].attribs.href;
		//res.write(movie_detail_link);

		////////// Now Get Details of movie
		var duration = "";
		var genre 	 = "";

		var movie_details = {};
		movie_details.movie_name = movie_name.trim();
		movie_details.release_year = movie_release_year;
		movie_details.imdb_rating = imdb_rating;
		movie_details.duration = duration;
		movie_details.genre = genre;
		movies.push(movie_details);

		fetch_movie_details(i, movie_detail_link);


		//var movie_name = $(movie_html).find('a:last').text();

		//res.write("movie name" + movie_name);
		if(i == 5) {
			break;	
		}
		
	}

	//res.write(JSON.stringify(movies));
	// console.log(JSON.stringify(movies));

    //res.end();
  })
  .catch(function(err){
    //handle error
  });

  function fetch_movie_details(index, detail_url)
  {
		rp(detail_url).then(function(details_html){
		//	res.write(details_html);

		

			var details_list = $(".title_wrapper .subtext", details_html).text();
			var details_arr  = details_list.split("|");

			var duration     = details_arr[1].trim();
			var genre 		 = details_arr[2].trim();
			genre			 = genre.replace(/(\r\n|\n|\r)/gm, "");

			//res.write("++" + i + "==" + duration + genre);

			movies[index-1].duration = duration;
			movies[index-1].genre = genre;

			if(index == 5) {
				res.write(JSON.stringify(movies));
				console.log(movies);
			}
		
		}).catch(function(err){
    		console.log(err);
  		});   
}

//res.write("Hemu");

  //res.end();

}).listen(3000);

