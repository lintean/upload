import axios from 'axios'
import Qs from 'qs'

export const GET = "get";
export const POST = "post";
export const PUT = "put"
export const PATCH = "patch"
export const DELETE = "delete"

axios.defaults.withCredentials = true;

// export const baseUrl = "http://192.168.43.211:8089/v1";
// export const baseUrl = "http://192.168.43.211:8080/v1";
export const baseUrl = "http://39.108.210.48:8089/v1";

// 用户相关
// U2
export const Login = (work_no, password) => {
	return new axios({
		url: baseUrl + '/login',
		data: {
			'work_no': work_no,
			'password': password
		},
		method: POST
	})
};

// U3
export const getUser = () => {
	return new axios({
		url: baseUrl + '/users/current',
		method: GET
	})
};

// U4
export const Logout = () => {
	return new axios({
		url: baseUrl + '/users/logout',
		method: POST
	})
};

// U5
export const getGroupOfUser = (user_id) => {
	return new axios({
		url: baseUrl + '/v1/users/' + user_id + '/groups',
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
		url: baseUrl + '/search/associations?keyword=' + keyword + '&tag_count=' + tag_count + '&category_count=' +
			category_count,
		method: GET
	})
};

// S3
export const Results = (type, keyword, tags, categories, exts, created_time, modified_time, time_zone, page, per_page) => {
	return new axios({
		url: baseUrl + '/search/results',
		data: {
			'type': type,
			'keyword': keyword,
			'tags': tags,
			'categories': categories,
			'exts': exts,
			'created_time': created_time,
			'modified_time': modified_time,
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
		url: baseUrl + '/search/tags?keyword=' + keyword + '&size=' + size,
		method: GET
	})
};
export const Categories = (keyword, size) => {
	return new axios({
		url: baseUrl + '/search/categories?keyword=' + keyword + '&size=' + size,
		method: GET
	})
};

// 资源类型: dir doc
// 目录文档部分相关
// D1
export const newResources = (type, cur_id) => {
	return new axios({
		url: baseUrl + '/resources/',
		data: {
			'type': type,
			'cur_id': cur_id
		},
		method: POST,
		withCredentials: true
	})
};

// D3
export const editResources = (resource_id, dir_name) => {
	return new axios({
		url: baseUrl + '/resources/' + resource_id,
		data: {
			'dir_name': dir_name
		},
		method: PUT
	})
};

// D4
export const deleteResources = (resource_id) => {
	return new axios({
		url: baseUrl + '/resources/' + resource_id,
		method: DELETE
	})
};

// D5
export const getResources = (id) => {
	return new axios({
		url: baseUrl + '/resources/' + id + '/slaves',
		method: GET
	})
};

// D6
export const getResourceMeta = (doc_id) => {
	return new axios({
		url: baseUrl + '/docs/' + doc_id,
		method: GET
	})
};

// D7
export const editResourceMeta = (doc_id, title, desc) => {
	return new axios({
		url: baseUrl + '/docs/' + doc_id,
		data: {
			'title': title,
			'desc': desc
		},
		method: PATCH
	})
};

// 文件相关
// F6
export const deleteFile = (file_id) => {
	return new axios({
		url: baseUrl + '/files',
		data: {
			"file_id": [
				file_id
			]
		},
		method: DELETE
	})
};

// F7
export const Download = (file_id) => {
	return new axios({
		url: baseUrl + '/files/' + file_id + '/download?1sdfsdfsdfsdf',
		method: GET,
		responseType: 'arraybuffer'
	})
};

// F9
export const getFileMeta = (file_id) => {
	return new axios({
		url: baseUrl + '/files/' + file_id,
		method: GET
	})
};

// F10
export const editFileMeta = (file_id, title, desc, categories, tags) => {
	return new axios({
		url: baseUrl + '/files/' + file_id,
		data: {
			'title': title,
			'desc': desc,
			'categories': categories,
			'tags': tags
		},
		method: PATCH
	})
};



// F16
export const getFileCategories = (file_id) => {
	return new axios({
		url: baseUrl + '/files/' + file_id + '/categories',
		method: GET
	})
};

export const getFileTags = (file_id) => {
	return new axios({
		url: baseUrl + '/files/' + file_id + '/tags',
		method: GET
	})
};

// 群组相关
// G1
export const newGroup = (group_name, group_desc) => {
	return new axios({
		url: baseUrl + '/groups/',
		data: {
			'group_name': group_name,
			'group_desc': group_desc
		},
		method: POST
	})
};

// G2
export const getGroupMeta = (group_id) => {
	return new axios({
		url: baseUrl + '/groups/' + group_id,
		method: GET
	})
};

// G3
export const updateGroupMeta = (group_id, group_name, group_desc) => {
	return new axios({
		url: baseUrl + '/groups/' + group_id,
		data: {
			'group_name': group_name,
			'group_desc': group_desc
		},
		method: PUT
	})
};

// G4
export const deleteGroup = (group_id) => {
	return new axios({
		url: baseUrl + '/groups/' + group_id,
		method: DELETE
	})
};

// G5
export const addUserToGroup = (group_id, usersIdList) => {
	return new axios({
		url: baseUrl + '/groups/' + group_id + '/members',
		data: {
			'usersIdList': usersIdList
		},
		method: POST
	})
};

// G6
export const getUserOfGroup = (group_id) => {
	return new axios({
		url: baseUrl + '/groups/' + group_id + '/members',
		method: GET
	})
};

// G7
export const deleteUserOfGroup = (group_id, member_id) => {
	return new axios({
		url: baseUrl + '/groups/' + group_id + '/members/' + member_id,
		method: DELETE
	})
};

// 权限部分
// P1
export const addPermission = (resource_id, permission, groupsIdList) => {
	return new axios({
		url: baseUrl + '/resources/' + resource_id + '/permissions',
		data: {
			'permission': permission,
			'groupsIdList': groupsIdList
		},
		method: POST
	})
};

// P2
export const deletePermission = (resource_id, group_id) => {
	return new axios({
		url: baseUrl + '/resources/' + resource_id + '/permissions',
		data: {
			'group_id': group_id
		},
		method: DELETE
	})
};

// P3
export const getGroupOfResourceHadPermission = (resource_id) => {
	return new axios({
		url: baseUrl + '/resources/' + resource_id + '/authgroups',
		method: GET
	})
};

// P4 获取群组具有操作权限的所有资源信息 暂时不用
