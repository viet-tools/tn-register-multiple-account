/**
 * code by: viet-tools
 */

'use strict';

const fs = require("fs");
const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

const $ = require("jquery")(window);

const init = async () => {
	const res = await axios.get("https://trangnguyen.edu.vn/dang-ky");
	const html = res.data;
	const options = $(html).find('#ddl_province option');
	const arr = [];
	for(let i = 0; i < options.length; i++) {
		const option = $(options[i]);
		const _id = parseInt(option.attr('value'));
		if (_id > 0) {
			arr.push({
				_id,
				name: option.text()
			});
		}
	};
	console.log('GET province done:', arr.length);
	fs.writeFileSync("./data/provinces.json", JSON.stringify(arr));
};

init();

// in browser https://trangnguyen.edu.vn/dang-ky
// var options = $('#ddl_province').find('option');
// arr = [];
// for(i=0;i<options.length;i++) {
// 	var option = $(options[i]);
// 	var _id = parseInt(option.attr('value'));
// 	if(_id > 0) {
// 		arr.push({
// 			_id,
// 			name: option.text()
// 		});
// 	}
// };
// JSON.stringify(arr);