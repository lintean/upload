<template>
	<div id="app">
		<el-container>
			<el-aside style="width: 180px !important;">
				<a-menu :selectedKeys="selectedKeys" :defaultOpenKeys="['sub1']" mode="inline" theme="dark" :inlineCollapsed="collapsed"
				 style="height: 100%; text-align: left; position: fixed; width: 180px" @click="changeRoute">
					<a-menu-item key="1" disabled>
						<a-icon type="user" />
						<span>个人信息</span>
					</a-menu-item>
					<a-sub-menu key="sub1">
						<span slot="title">
							<a-icon type="file-text" /><span>文档管理</span></span>
						<a-menu-item key="2">个人文档</a-menu-item>
						<a-menu-item key="3" disabled>部门文档</a-menu-item>
					</a-sub-menu>
					<a-menu-item key="4">
						<a-icon type="file-search" />
						<span>文档检索</span>
					</a-menu-item>
				</a-menu>
			</el-aside>

			<el-container>
				<el-header style="height:60px; line-height: 60px; box-shadow: 0px 5px 6px 0 rgba(0,0,0,.05);">
					<el-image :src="require('./assets/logo.png')" style="height: 50px; width: 240px; padding: 5px 0; float: left;"></el-image>

					<div style="float: right; " v-if="(loginData.isLogin)">
						<el-popover trigger="hover" placement="bottom" width=150>
							<p>欢迎使用 {{loginData.currentUserName}}</p>
							<el-button @click="logout" style="float: right;">注销</el-button>
							<el-button slot="reference" style="font-size: 18px; color: #303133;" type="text" icon="el-icon-user-solid">{{loginData.currentUserName}}</el-button>
						</el-popover>
					</div>

					<div style="float: right; " v-if="(!loginData.isLogin)">
						<el-button style="font-size: 16px;" size="small" type="danger" @click="loginData.visible = true">登陆</el-button>
					</div>
				</el-header>

				<el-main :style="{minHeight: screenHeight - 120 + 'px'}" class="init">
					<router-view></router-view>
				</el-main>
				<el-footer style="height: 60px; line-height: 60px; box-shadow: 0px -5px 6px 0px rgba(0,0,0,.05);">
					{{footerText}}
				</el-footer>
			</el-container>

		</el-container>

		<el-dialog title="登陆" :visible.sync="loginData.visible" width="400px" style="text-align: left;">
			<el-image :src="require('./assets/logo.png')" style="height:40px; width: 193px; margin: 0 auto; display: block;"></el-image>
			<el-form label-position="right" label-width="80px" style="margin-right: 50px; margin-top: 30px" :model="loginData"
			 :rules="loginData.rules">
				<el-form-item label="工号" prop="user">
					<el-input v-model="loginData.user"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pwd">
					<el-input v-model="loginData.pwd" show-password></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button @click="loginData.visible = false">取 消</el-button>
				<el-button type="primary" @click="login">确 定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import * as Api from './api/api'
	import * as DEFAULT from "./json/default"

	export default {
		name: 'app',
		data() {
			return {
				// 手机端 还未完成
				phone: false,
				screenHeight: 0,
				// 注册 已废弃
				// 登陆
				loginData: {
					visible: false,
					logoutVisible: false,
					isLogin: false,
					currentUserName: "lintean",
					currentUserNo: "",
					currentUserId: "",
					currentUserEmail: "",
					user: "",
					pwd: "",
					rules: {
						user: [{
							required: true,
							message: '请输入工号',
							trigger: 'blur'
						}],
						pwd: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						}]
					}
				},

				// 页脚内容
				footerText: "华喜科技 @2019",

				// 侧边栏
				collapsed: false,
				selectedKeys: ["2"]
			}
		},
		mounted: function() {
			// 判断是否是手机访问
			this.phone = this.isPhone();

			// 获取屏幕高度
			this.screenHeight = document.documentElement.clientHeight;

			let _this = this;
			Api.getUser().then(
				res => {
					if (res.data.status === 200) {
						_this.recordLoginData(res);
					} else {
						_this.loginData.visible = true;
					}
				}).catch(err => {
				_this.loginData.visible = true;
				_this.changeError(err);
			});

			this.changeKeys(window.location.hash);
		},
		watch: {
			$route(to, from) {
				this.changeKeys(window.location.hash);
			}
		},
		methods: {
			isPhone() {
				let flag = navigator.userAgent.match(
					/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
				)
				return flag;
			},
			recordLoginData(res) {
				let _this = this;
				// 登陆信息
				_this.loginData.currentUserName = res.data.data.userInfo.username;
				_this.loginData.currentUserNo = res.data.data.userInfo.work_no;
				_this.loginData.currentUserEmail = res.data.data.userInfo.email;
				_this.loginData.isLogin = true;

				// 目录信息
				this.$store.commit({
					"type": "setCurrentResourceBackup",
					"currentResourceBackup": {
						type: "dir",
						id: res.data.data.resource_id
					}
				})

				// 初始化面包屑的路径
				let path = [];
				for (let i = res.data.data.master_dirs.length - 1; i >= 0; --i) {
					path.push({
						id: res.data.data.master_dirs[i].id,
						title: res.data.data.master_dirs[i].title,
						type: "dir"
					})
				}
				path.push({
					id: res.data.data.resource_id,
					title: res.data.data.resource_name,
				})

				this.$store.commit({
					"type": "setPathBackup",
					"pathBackup": path
				})
				this.$root.eventHub.$emit('login');
			},
			login() {
				let _this = this;
				Api.Login(this.loginData.user, this.loginData.pwd).then(
					res => {
						if (res.data.status === 200) {
							_this.recordLoginData(res);
							_this.loginData.visible = false;
						} else {
							_this.$message.error(res.data.msg);
						}
					}).catch(err => {
					_this.changeError(err);
				});
			},
			logout() {
				let _this = this;
				Api.Logout().then(
					res => {
						if (res.data.status === 200) {
							_this.loginData.isLogin = false;
							_this.loginData.visible = true;
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					_this.changeError(err);
				});
			},
			// 侧边栏
			changeRoute(e) {
				switch (e.key) {
					case "1":
						{
							break;
						}
					case "2":
						{
							console.log("toDoc");
							this.$router.push({
								path: '/doc',
							})
							break;
						}
					case "3":
						{
							console.log("toDoc");
							this.$router.push({
								path: '/doc',
							})
							break;
						}
					case "4":
						{
							console.log("toSearch");
							this.$router.push({
								path: '/search'
							})
							break;
						}
				}
			},
			changeKeys(hash) {
				console.log(hash);
				if (hash == '#/doc') this.selectedKeys = ["2"];
				if (hash == '#/search') this.selectedKeys = ["4"];
			},
			changeError(err) {
				console.log(err);
				this.$message.warning(DEFAULT.defaultNetwordError);
				this.$parent.stopEditNameByIndex(this.index);
			}
		}
	}
</script>

<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		text-align: center;
		color: #2c3e50;
	}

	.init {
		margin: 0;
		padding: 0 !important;
		position: relative;
		display: block !important;
		background-color: rgba(0, 0, 0, 0.008)
	}
</style>
