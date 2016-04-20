var express = require('express');
var router = express.Router();

var superagent = require('superagent');
var url = require('url');
var cheerio = require('cheerio');

var index = 'http://m.byr.cn/';
var loginUrl = 'http://m.byr.cn/user/login/';
var auth = {
	id: 'foo',
	passwd: 'bar'
};
var auth1 = {
	id: 'Itach',
	passwd: 'zhx7758521'
};
var topTenArr = [];

/* GET home page. */
router.get('/', function(req, res, next) {
	superagent
	.post(loginUrl)
	.type('form')
	.send(auth1)
	.redirects(0)
	.end(function(err, sres) {
		var rawCookies = sres.headers['set-cookie'];
		var cookie = rawCookies[3].split(';')[0] + '; ' +
			rawCookies[4].split(';')[0] + '; ' +
			rawCookies[5].split(';')[0];

		/*console.log(cookie);
		console.log("text" + JSON.stringify(sres));
		console.log(rawCookies);*/

		superagent
		.get(index)
		.set("Cookie", cookie)
		.end(function(err, sres) {
			if (err) {
				return next(' getTopTenUrl' + err);
			}

			/*console.log(sres.text);*/
			var $ = cheerio.load(sres.text);
			/*var topTenArr = [];*/ // 十大数组:保存 url/title/newCommentsCount/lastCommentTime

			$("#m_main ul.slist li a").each(function(idx, elet) {
				var $text = $(elet).text();

				topTenArr.push({
					url: $(elet).attr('href'),
					title: $text.slice(0, $text.lastIndexOf('(')),
					newCommentsCount: $text.slice($text.lastIndexOf('(') + 1, $text.lastIndexOf(')'))
				});
			});
			console.log(topTenArr);
			for (var i in topTenArr) {
				console.log(topTenArr[i].title);
			};
		});
	});
  res.render('index', { title: '北邮人',
  content: topTenArr[0].url });
});

module.exports = router;
