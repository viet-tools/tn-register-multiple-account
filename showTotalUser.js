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
	const res = await axios.get("https://trangnguyen.edu.vn");
	const html = res.data;
	const span = $(html).find('span.num-format');
	console.log('Total:', span.text());
};

init();