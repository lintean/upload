<template>
	<div id="app">
		<el-container v-if="!phone">
			<el-header style="height:60px; line-height: 60px; box-shadow: 0px 10px 6px 0 rgba(0,0,0,.05);">
				<el-image :src="require('./assets/logo.png')" style="height: 50px; width: 240px; padding: 5px 0; float: left;"></el-image>

				<div style="float: right; ">
					<el-button style="font-size: 18px; color: #303133;" type="text" icon="el-icon-user-solid" @click="loginData.visible = true">lintean</el-button>
					<el-button style="font-size: 18px; color: #303133;" type="text" icon="el-icon-switch-button" @click="registerData.visible = true">退出</el-button>
				</div>
			</el-header>

			<el-container v-if="!showDoc">
				<el-aside>
					<el-card shadow="always" class="sidebar">
						<el-button type="primary" style="margin: 10px 0;" @click="doc = !doc">新建文档</el-button>
						<el-select v-model="value" multiple filterable allow-create default-first-option placeholder="请输入文档名或标签">
							<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>

						<div class="divider" style="margin-top: 10px;"></div>

						<el-row style="margin-top: 10px; height: 36px; line-height: 36px;" v-for="(doc, index) in docList" :key="index">
							<el-col :offset="1" :span="3">
								<el-button style="padding: 5px" :type="doc.docIcon" icon="el-icon-document-checked" circle></el-button>
							</el-col>
							<el-col :offset="2" :span="8">
								<span style="font-size: 16px;">{{doc.docName}}</span>
							</el-col>
							<el-col :offset="0" :span="10">
								<span style="color: #909399; font-size: 16px;">by {{doc.docAuthor}}</span>
							</el-col>
						</el-row>
					</el-card>
				</el-aside>

				<el-main style="padding-top: 0;" v-if="!doc">
					<div style="text-align: left; height=70px; line-height: 70px;">
						<el-button @click="showDoc = !showDoc" type="info" style="margin: auto 0 auto 40px;" icon="el-icon-back" circle></el-button>
						<h2 style="display: inline-block; text-align: left; margin: 0 20px 0 20px;">智慧城市</h2>
						<time>2018年9月4日</time>
						<span style="color: #909399; margin-left: 10px;">由lintean创建</span>
						<div style="float:right">
							<el-button type="primary" @click="doc = !doc">编辑文档</el-button>
							<el-button type="danger">删除文档</el-button>
						</div>
					</div>

					<div class="divider"></div>

					<uploader :options="options" class="uploader-example">
						<uploader-unsupport></uploader-unsupport>
						<uploader-drop>
							<p>Drop files here to upload or</p>
							<div style="display: flex; justify-content: flex-start; margin: 10px 0;">
								<el-card v-for="(file, index) in fileList" :key="index" shadow="always" :body-style="{ padding: '0px'}" style="width: 250px; height: 260px; margin-left: 10px;">
									<el-image :src="file.fileImgUrl" fit="scale-down" alt="fileImage" class="image"></el-image>

									<div class="divider" style="margin: 0 0 5px 0;"></div>

									<div style="height: 50px; line-height: 50px;">
										<span style="font-size: 14px; height: 50px; line-height: 50px;">{{file.fileName}}</span>
										<el-dropdown @command="handleCommand" style="float: right; right: 10px;">
											<span class="el-dropdown-link">
												<i class="el-icon-edit"></i>
											</span>
											<el-dropdown-menu slot="dropdown">
												<el-dropdown-item :command="[index,0]">预览</el-dropdown-item>
												<el-dropdown-item :command="[index,1]">删除</el-dropdown-item>
												<el-dropdown-item :command="[index,2]">下载</el-dropdown-item>
											</el-dropdown-menu>
										</el-dropdown>
									</div>
								</el-card>
							</div>
							<uploader-btn>select files</uploader-btn>
						</uploader-drop>
						<uploader-list></uploader-list>
					</uploader>
				</el-main>

				<el-main style="padding-top: 0;" v-if="doc">
					<div style="text-align: left; height=70px; line-height: 70px;">
						<h2 style="display: inline-block; text-align: left; margin: 0 20px 0 50px;">主要元数据</h2>
						<span style="color: #909399; margin-left: 10px;">lintean正在编辑</span>
						<div style="float:right">
							<el-button type="primary" @click="doc = !doc">保存文档</el-button>
							<el-button @click="doc = !doc">取消编辑</el-button>
						</div>
					</div>

					<div class="divider"></div>

					<el-row style="margin-top: 10px;">
						<el-col :offset="1" :span="3">标题</el-col>
						<el-col :offset="2" :span="18">
							<el-input type="text" placeholder="文档的性质或类型" maxlength="10" show-word-limit>
							</el-input>
						</el-col>
					</el-row>
					<el-row style="margin-top: 10px;">
						<el-col :offset="1" :span="3">介绍</el-col>
						<el-col :offset="2" :span="18">
							<el-input type="textarea" placeholder="文档的简介" maxlength="150" show-word-limit rows="10">
							</el-input>
						</el-col>
					</el-row>
					<el-row style="margin-top: 10px;">
						<el-col :offset="1" :span="3">标签</el-col>
						<el-col :offset="2" :span="18">
							<el-input type="text" placeholder="请输入一个标签" maxlength="10" show-word-limit>
							</el-input>
						</el-col>
					</el-row>
				</el-main>
			</el-container>

			<el-main v-if="showDoc">
				<div style="margin-bottom: 10px; height: 50px;">
					<div style="float: left">
						<el-button type="primary" style="position: relative;" @click="doc = !doc">新建文档</el-button>
						<el-button>新建文件夹</el-button>
						<el-button-group style="margin-left: 10px;">
							<el-button>下载</el-button>
							<el-button>重命名</el-button>
							<el-button>删除</el-button>
						</el-button-group>
					</div>

					<el-select v-model="value" multiple filterable allow-create default-first-option placeholder="搜索你的资源" style="float: right;">
						<el-option v-for="item in option" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</div>
				<div class="light_divider"></div>
				<div style="display: flex; justify-content: flex-start; margin: 10px 0;">
					<el-card v-for="(doc, index) in docList" :key="index" shadow="always" :body-style="{ padding: '0px'}" style="width: 250px; height: 260px; margin-left: 10px;">
						<el-image :src="!doc.isDoc ? require('./assets/images/docCnt.png') : require('./assets/images/doc.png')" fit="scale-down"
						 alt="fileImage" class="image"></el-image>

						<div class="divider" style="margin: 0 0 5px 0;"></div>

						<div style="height: 50px; line-height: 50px;">
							<span style="font-size: 14px; height: 50px; line-height: 50px;" @click="showDoc = false">{{doc.docName}}</span>
						</div>
					</el-card>
				</div>
			</el-main>
		</el-container>

		<el-container v-if="phone">
			<el-header style="height:60px; line-height: 60px; box-shadow: 0px 10px 6px 0 rgba(0,0,0,.05);">
				<el-image :src="require('./assets/logo.png')" style="height: 30px; width: 145px; padding: 15px 0 15px 0; float: left;"></el-image>

				<el-dropdown style="float: right;">
					<span style="display: inline-block; font-size: 18px;">
						<i class="el-icon-user-solid"></i>
						lintean
					</span>

					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item :command="0">账户</el-dropdown-item>
						<el-dropdown-item :command="1">退出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-header>

			<el-main v-if="showDoc">
				<div>
					<el-button type="primary" plain @click="showDoc = false; doc = true;">新建</el-button>
					<el-button plain>搜索</el-button>
				</div>
				<div class="divider" style="margin-top: 10px;"></div>

				<el-card v-for="(doc, index) in docList" :key="index" shadow="always" :body-style="{ padding: '0px'}" style="line-height: 100px; padding: 0; margin-top: 10px;">
					<el-image :src="!doc.isDoc ? require('./assets/images/docCnt.png') : require('./assets/images/doc.png')" fit="scale-down"
					 alt="fileImage" style="height:80px; width:80px; float: left; padding: 10px;"></el-image>
					<span class="phoneText" :style="'max-width :' + phoneTextWt + 'px'" @click="showDoc = false">
						{{doc.docName}}</span>
					<el-dropdown style="float: right; margin-right: 10px">
						<span class="el-dropdown-link">
							<i class="el-icon-arrow-down"></i>
						</span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item :command="[index,0]">下载</el-dropdown-item>
							<el-dropdown-item :command="[index,1]">重命名</el-dropdown-item>
							<el-dropdown-item :command="[index,2]">删除</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</el-card>
			</el-main>

			<el-main ref="phoneCnt" v-if="!showDoc">
				<div>
					<el-button type="primary" @click="showDoc = !showDoc" plain>返回</el-button>
					<el-button plain>上传</el-button>
					<el-button plain @click="doc = !doc">编辑</el-button>
				</div>
				<div class="divider" style="margin-top: 10px;"></div>

				<div v-if="!doc">
					<el-card v-for="(file, index) in fileList" :key="index" shadow="always" :body-style="{ padding: '0px'}" style="line-height: 100px; padding: 0; margin-top: 10px;">
						<el-image :src="file.fileImgUrl" fit="scale-down" alt="fileImage" style="height:80px; width:80px; float: left; padding: 10px;"></el-image>
						<span class="phoneText" :style="'max-width :' + phoneTextWt + 'px'">
							{{file.fileName}}</span>
						<el-dropdown style="float: right; margin-right: 10px">
							<span class="el-dropdown-link">
								<i class="el-icon-arrow-down"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item :command="[index,0]">预览</el-dropdown-item>
								<el-dropdown-item :command="[index,1]">删除</el-dropdown-item>
								<el-dropdown-item :command="[index,2]">下载</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</el-card>
				</div>

				<div v-if="doc">
					<el-row style="margin-top: 10px;">
						<el-col :offset="1" :span="3">标题</el-col>
						<el-col :offset="2" :span="18">
							<el-input type="text" placeholder="文档的性质或类型" maxlength="10" show-word-limit>
							</el-input>
						</el-col>
					</el-row>
					<el-row style="margin-top: 10px;">
						<el-col :offset="1" :span="3">介绍</el-col>
						<el-col :offset="2" :span="18">
							<el-input type="textarea" placeholder="文档的简介" maxlength="150" show-word-limit rows="10">
							</el-input>
						</el-col>
					</el-row>
					<el-row style="margin-top: 10px;">
						<el-col :offset="1" :span="3">标签</el-col>
						<el-col :offset="2" :span="18">
							<el-input type="text" placeholder="请输入一个标签" maxlength="10" show-word-limit>
							</el-input>
						</el-col>
					</el-row>
					<el-row style="margin-top: 10px;">
						<el-button type="primary" @click="doc = false">保存</el-button>
						<el-button @click="doc = false">取消</el-button>
					</el-row>
				</div>
			</el-main>
		</el-container>


		<el-dialog :visible.sync="PdfVisible" width="80%" style="overflow-x: hidden;" :show-close="false">
			<ShowPdf :src="PdfOnShow" :page-count="count" style="height:auto; width: 100%; margin: 0 auto;"></ShowPdf>
		</el-dialog>

		<el-dialog :before-close="stateChange" :visible.sync="VideoVisible" width="80%" style="overflow-x: hidden;"
		 :show-close="false">
			<Video :src="VideoOnShow" :state="state" style="height:auto; width: 100%;"></Video>
		</el-dialog>

		<el-dialog title="登陆" :visible.sync="loginData.visible" width="400px" style="text-align: left;" >
			<el-image :src="require('./assets/logo.png')" style="height:40px; width: 193px; margin: 0 auto; display: block;"></el-image>
			<el-form label-position="right" label-width="80px" style="margin-right: 50px; margin-top: 30px" :model="loginData" :rules="loginData.rules">
				<el-form-item label="用户" prop="user">
					<el-input v-model="loginData.user"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pwd">
					<el-input v-model="loginData.pwd"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="loginData.visible = false">取 消</el-button>
				<el-button type="primary" @click="loginData.visible = false">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="注册" :visible.sync="registerData.visible" width="400px" style="text-align: left;">
			<el-image :src="require('./assets/logo.png')" style="height:40px; width: 193px; margin: 0 auto; display: block;"></el-image>
			<el-form label-position="right" label-width="80px" style="margin-right: 50px; margin-top: 30px" :model="registerData" :rules="registerData.rules">
				<el-form-item label="用户" prop="user">
					<el-input v-model="registerData.user"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pwd">
					<el-input v-model="registerData.pwd"></el-input>
				</el-form-item>
				<el-form-item label="确认" prop="pwdRp">
					<el-input v-model="registerData.pwdRp"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="registerData.visible = false">取 消</el-button>
				<el-button type="primary" @click="registerData.visible = false">确 定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import ShowPdf from './components/ShowPdf.vue'
	import Video from './components/Video.vue'

	export default {
		name: 'app',
		data() {
			return {
				// 手机端
				phone: true,
				phoneTextWt: 170,
				// pc文档界面
				showDoc: false,
				count: 7,
				state: 1,
				doc: false,
				VideoVisible: false,
				VideoOnShow: "",
				PdfVisible: false,
				PdfOnShow: "",
				options: {
					// https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
					target: 'http://localhost/upload.php',
					testChunks: false
				},
				fileList: [{
						fileName: "排课示例视频.mp4",
						fileImgUrl: require("./assets/images/1.png"),
						fileUrl: "http://localhost/1.mp4",
						fileType: 0
					},
					{
						fileName: "let it go.mp3",
						fileImgUrl: require("./assets/images/2.png"),
						fileUrl: "http://localhost/1.mp3",
						fileType: 0
					},
					{
						fileName: "安卓屏幕适配.pdf",
						fileImgUrl: require("./assets/images/3.png"),
						fileUrl: "http://localhost/1.pdf",
						fileType: 1
					},
					{
						fileName: "其他文件",
						fileImgUrl: require("./assets/images/4.png"),
						fileUrl: "",
						fileType: 2
					}
				],
				// 搜索
				option: [{
					value: 'HTML',
					label: 'HTML'
				}, {
					value: 'CSS',
					label: 'CSS'
				}, {
					value: 'JavaScript',
					label: 'JavaScript'
				}],
				value: [],
				docList: [{
						docName: "智慧城市",
						docIcon: "primary",
						docAuthor: "lintean",
						isDoc: false
					},
					{
						docName: "AuthProxy",
						docIcon: "success",
						docAuthor: "xinsane",
						isDoc: true
					},
					{
						docName: "WebIDE",
						docIcon: "warning",
						docAuthor: "koado",
						isDoc: true
					}
				],
				loginData: {
					visible: false,
					user: "",
					pwd: "",
					rules: {
						user: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						}],
						pwd: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						}]
					}
				},
				registerData: {
					visible: false,
					user: "",
					pwd: "",
					pwdRp: "",
					rules: {
						user: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						}],
						pwd: [{
							required: true,
							message: '请输入密码',
							trigger: 'blur'
						}],
						pwdRp: [{
							required: true,
							message: '请确认密码',
							trigger: 'blur'
						}]
					}
				}
			}
		},
		components: {
			ShowPdf,
			Video
		},
		mounted: function() {
			// 判断是否是手机访问
			this.phone = this.isPhone();
			// 移动端获取容器宽度
			if (this.phone) {
				this.phoneTextWt = document.documentElement.clientWidth - 200;
			}
		},
		methods: {
			handleCommand(command) {
				console.log('click on item ' + command[0] + command[1]);
				switch (command[1]) {
					case 0:
						{
							switch (this.fileList[command[0]].fileType) {
								case 0:
									{
										this.VideoOnShow = this.fileList[command[0]].fileUrl;
										this.VideoVisible = true;
										console.log('111');
										break;
									}
								case 1:
									{
										this.PdfOnShow = this.fileList[command[0]].fileUrl;
										this.PdfVisible = true;
										break;
									}
								case 2:
									{
										this.$alert('该文件无法预览', '提示', {
											confirmButtonText: '确定',
											callback: action => {
												this.$message({
													type: 'info',
													message: `action: ${ action }`
												});
											}
										});
										break;
									}
							}
							break;
						}
					case 1:
						{
							break;
						}
					case 2:
						{
							break;
						}
					default:
						{

						}

				}
			},
			stateChange(done) {
				this.state = 1 - this.state;
				this.VideoOnShow = "";
				done();
			},
			isPhone() {
				let flag = navigator.userAgent.match(
					/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
				)
				return flag;
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

	.divider {
		background-color: #DCDFE6;
		position: relative;
		display: block;
		height: 1px;
		width: 100%;
		margin: 0 0 12px 0;
	}

	.light_divider {
		background-color: rgba(220, 223, 230, 0.3);
		position: relative;
		display: block;
		height: 1px;
		width: 100%;
		margin: 0 0 12px 0;
	}

	.uploader-example {
		width: 880px;
		padding: 15px;
		margin: 0px auto 0;
		font-size: 12px;
		box-shadow: 0 0 10px rgba(0, 0, 0, .4);
	}

	.sidebar {
		padding: 15px;
		margin: 20px auto 0;
		font-size: 12px;
		box-shadow: 0 0 10px rgba(0, 0, 0, .4);
	}

	.uploader-example .uploader-btn {
		margin-right: 4px;
	}

	.uploader-example .uploader-list {
		max-height: 440px;
		overflow: auto;
		overflow-x: hidden;
		overflow-y: auto;
	}

	.phoneText {
		float: left;
		margin-left: 30px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.image {
		width: 202.5px;
		height: 202.5px;
		display: block;
	}

	body {
		position: relative;
		height: 80%;
		margin: 0;
	}

	html {
		position: relative;
	}
</style>
