module.exports = {
	// baseUrl: '/tool/',
	publicPath: './',
	configureWebpack: {
		devServer: {
			proxy: {
				'*': {
					target: 'http://39.108.210.48:8089', //设置你调用的接口域名和端口号 别忘了加http
					// target: 'http://39.108.210.48:8089',
					changeOrigin: true, //这里设置是否跨域
					secure: false,
					onProxyRes: function(proxyRes, req, res) {
						var cookies = proxyRes.headers['Set-Cookie'];
						var cookieRegex = /Path=\/cooco-admin/i;
						//修改cookie Path
						if (cookies) {
							var newCookie = cookies.map(function(cookie) {
								if (cookieRegex.test(cookie)) {
									return cookie.replace(cookieRegex, 'Path=/');
								}
								return cookie;
							});
							//修改cookie path
							delete proxyRes.headers['Set-Cookie'];
							proxyRes.headers['Set-Cookie'] = newCookie;
						}
					}
				}
			}
		}
	},
}