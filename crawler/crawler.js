var superagent = require('superagent');
url = require('url'),
	cheerio = require('cheerio'),
	http = require("http");

var Config = require('./config');

superagent
	.post(Config.url.login)
	.type('form')
	.send(Config.auth)
	.redirects(0)
	.end(function(err, sres) {
		var rawCookies = sres.headers['set-cookie'];
		var cookie = rawCookies[3].split(';')[0] + '; ' +
			rawCookies[4].split(';')[0] + '; ' +
			rawCookies[5].split(';')[0];

		superagent
			.get(Config.url.section)
			.set("Cookie", cookie)
			.end(function(err, sres) {
				if (err) {
					return next(' getTopTenUrl' + err);
				}

				/*console.log(sres.text);*/
				var $ = cheerio.load(sres.text);
				var sectionArr = []; // 分区目录数组:保存 url/section

				$("#m_main ul.slist li a:nth-child(2)").each(function(idx, elet) {
					var $text = $(elet).text();
					sectionArr.push({
						url: $(elet).attr('href'),
						title: $text
					});
				});
				/*console.log(sectionArr);*/

				/*遍历分区目录*/
				for (var i in sectionArr) {
					/*console.log(sectionArr[i].url + ":" + sectionArr[i].title);*/
					var sectionUrl = sectionArr[i].url;
					var sectionTitle = sectionArr[i].title;
					/*console.log(Config.url.index + sectionUrl);*/

					superagent
						.get(Config.url.index + sectionUrl)
						.set("Cookie", cookie)
						.end(function(err, sres) {
							if (err) {
								return next(' getTopTenUrl' + err);
							}

							var $ = cheerio.load(sres.text);
							var borderArr = []; // 板块目录数组:保存 url/section

							$("#m_main ul.slist li a:nth-child(2)").each(function(idx, elet) {
								var $text = $(elet).text();
								borderArr.push({
									url: $(elet).attr('href'),
									title: $text
								});
							});
							console.log(borderArr);

						})
				};

			});
	});