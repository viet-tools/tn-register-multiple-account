// https://trangnguyen.edu.vn/district/api/list/{province_id}

'use strict';

const fs = require("fs");
const axios = require("axios");
const provinces = require('./locations/provinces.json');

const init = async () => {
	let arr = [];
	for (const province of provinces) {
		const res = await axios.get(`https://trangnguyen.edu.vn/district/api/list/${province._id}`, { responseType: 'json' });
		const list = res.data.content;
		// arr = arr.concat(list);
		list.forEach(district => {
			arr.push({
				...district,
				province_id: province._id
			});
		});
	}
	console.log('GET district done:', arr.length);
	fs.writeFileSync("./locations/districts.json", JSON.stringify(arr));
};

init();