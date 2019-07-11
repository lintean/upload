import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import Doc from '../doc'
import Search from '../pages/search'

Vue.use(Router)

export default new Router({
// 	mode: "history",
// 	base: '/tool/',
	routes: [{
			path: '/',
			name: 'app',
			component: App
		},
		{
			path: '/doc',
			name: 'doc',
			component: Doc
		},
		{ //需要跳转的页面
			path: '/search',
			name: 'search',
			component: Search
		}
	]
})
