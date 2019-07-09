import axios from 'axios'
import Qs from 'qs'

export const GET = "get";
export const POST = "post";
export const PUT = "put"

export const baseUrl = "http://192.168.199.195:8080/v1";

// 用户相关
// U2
export const Login = (workno, password) => {
	return new axios({
		url: baseUrl + '/v1/login',
		data: {
			'workno': user,
			'password': password
		},
		method: POST
	})
};

// U3
export const getUser = () => {
	return new axios({
		url: baseUrl + ' /v1/users/current',
		method: GET
	})
};


// 检索相关

// S1
export const Suggestions = (type, keyword, size) => {
	return new axios({
		url: baseUrl + '/search/suggestions?type=' + type + '&keyword=' + keyword + '&size=' + size,
		method: GET
	})
};

// S2
export const Associations = (keyword, tag_count, category_count) => {
	return new axios({
		url: baseUrl + '/search/associations?keyword=' + keyword + '&tag_count=' + tag_count + '&category_count=' + category_count,
		method: GET
	})
};

// S3
export const Results = (type, keyword, tags, categories, exts, created_time, modified_time, time_zone, page, per_page) => {
	return new axios({
		url: baseUrl + '/search/results',
// 		transformRequest: [function(data) { //在请求之前对data传参进行格式转换
// 			data = Qs.stringify(data)
// 			return data
// 		}],
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'X-Requested-With': 'XMLHttpRequest'
// 		},
		data: {
			'type': type,
			'keyword': keyword,
			'tags': tags,
			'categories': categories,
			'exts': exts,
			'time_zone': time_zone,
			'page': page,
			'per_page': per_page
		},
		method: POST
	})
};

// S4
export const Tags = (keyword, size) => {
	return new axios({
		url: baseUrl + '/search/top-associations?keyword=' + keyword + '&size=' + size,
		method: GET
	})
};
export const Categories = (keyword, size) => {
	return new axios({
		url: baseUrl + '/search/top-associations?keyword=' + keyword + '&size=' + size,
		method: GET
	})
};

// 目录文档部分相关
// D5
export const getResources = (id) => {
	return new axios({
		url: baseUrl + '/v1/resources/' + id + '/slaves',
		method: GET
	})
};

// 文件相关

// 群组相关