import axios from 'axios'
import Qs from 'qs'

export const GET = "get";
export const POST = "post";
export const PUT = "put"

export const baseUrl = "http://localhost:31380";

// 用户相关
export const Login = (user, pwd) => {
	return new axios({
		url: baseUrl + '/sso/login/',
		transformRequest: [function(data) { //在请求之前对data传参进行格式转换
			data = Qs.stringify(data)
			return data
		}],
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'X-Requested-With': 'XMLHttpRequest'
		},
		data: {
			'username': user,
			'passwd': pwd
		},
		method: POST,
		withCredentials: true
	})
};

export const Logout = () => {
	return new axios({
		url: baseUrl + '/sso/logout/',
		method: GET,
		withCredentials: true
	})
};

export const getUser = () => {
	return new axios({
		url: baseUrl + '/sso/getInfo/',
		method: GET,
		withCredentials: true
	})
};

// 检索相关

// S1
export const Logout = (type, keyword, size) => {
	return new axios({
		url: baseUrl + '/search/suggestions?type=' + type + '&keyword=' + keyword + '&size=' + size,
		method: GET,
		withCredentials: true
	})
};

// S2
export const Logout = (keyword, tag_count, category_count) => {
	return new axios({
		url: baseUrl + '/search/top-associations?keyword=' + keyword + '&tag_count=' + tag_count + '&category_count=' + category_count,
		method: GET,
		withCredentials: true
	})
};

// S3
export const Login = (type, keyword, tags, categories, exts, time_zone, page, per_page) => {
	return new axios({
		url: baseUrl + '/search/results',
		transformRequest: [function(data) { //在请求之前对data传参进行格式转换
			data = Qs.stringify(data)
			return data
		}],
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'X-Requested-With': 'XMLHttpRequest'
		},
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
		method: POST,
		withCredentials: true
	})
};

// S4? 含义

// 管理资源相关

// 文件相关

// 群组相关