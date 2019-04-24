// https://trangnguyen.edu.vn/school/api/list/{district_id}

'use strict';

const fs = require("fs");
const axios = require("axios");
const districts = require('./data/districts.json');

const init = async () => {
	let arr = [];
	for (const district of districts) {
		const res = await axios.get(`https://trangnguyen.edu.vn/school/api/list/${district._id}`, { responseType: 'json' });
		const list = res.data.content;
		// arr = arr.concat(list);
		list.forEach(school => {
			arr.push({
				...school,
				district_id: district._id
			});
		});
	}
	console.log('GET school done:', arr.length);
	fs.writeFileSync("./data/schools.json", JSON.stringify(arr));
};

init();