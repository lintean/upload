<template>
	<div id="app">
		<el-container>
			<el-header style="height:50px">

				<el-button style="font-size: 18px; color: #303133; float: right; margin-left: 20px; margin-right: 80px;" type="text"
				 icon="el-icon-switch-button">退出</el-button>
				<el-button style="font-size: 18px; color: #303133; float: right;" type="text" icon="el-icon-user-solid">lintean</el-button>
				<div class="divider" style="margin-top: 10px; float: right; width: 80%;"></div>

			</el-header>
			<el-container>
				<el-aside>
					<el-card shadow="always" class="sidebar">
						<el-button type="primary" style="margin: 10px 0;">新建文档</el-button>
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
					<div style="text-align: left; height=30px; line-height: 30px;">
						<h2 style="display: inline-block; text-align: left; margin-left: 50px; margin-right: 20px;">智慧城市</h2>
						<time>2018年9月4日</time>
						<span style="color: #909399; margin-left: 10px;">由lintean创建</span>
						<el-button type="primary" style="margin-left: 343px;" @click="doc = !doc">编辑文档</el-button>
						<el-button type="danger" style="margin-left: 10px;">删除文档</el-button>
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
					<div style="text-align: left; height=30px; line-height: 30px;">
						<h2 style="display: inline-block; text-align: left; margin-left: 50px; margin-right: 20px;">主要元数据</h2>
						<span style="color: #909399; margin-left: 10px;">lintean正在编辑</span>
						<el-button type="primary" style="margin-left: 520px;" @click="doc = !doc">保存文档</el-button>
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

		</el-container>


		<el-dialog :visible.sync="PdfVisible" width="80%" style="overflow-x: hidden;" :show-close="false">
			<ShowPdf :src="PdfOnShow" :page-count="count" style="height:auto; width: 100%; margin: 0 auto;"></ShowPdf>
		</el-dialog>

		<el-dialog :before-close="stateChange" :visible.sync="VideoVisible" width="80%" style="overflow-x: hidden;" :show-close="false">
			<Video :src="VideoOnShow" :state="state" style="height:auto; width: 100%;"></Video>
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
						fileImgUrl: "http://localhost/1.png",
						fileUrl: "http://localhost/1.mp4",
						fileType: 0
					},
					{
						fileName: "let it go.mp3",
						fileImgUrl: "http://localhost/2.png",
						fileUrl: "http://localhost/1.mp3",
						fileType: 0
					},
					{
						fileName: "安卓屏幕适配.pdf",
						fileImgUrl: "http://localhost/3.png",
						fileUrl: "http://localhost/1.pdf",
						fileType: 1
					},
					{
						fileName: "其他文件",
						fileImgUrl: "http://localhost/4.png",
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
						docAuthor: "lintean"
					},
					{
						docName: "AuthProxy",
						docIcon: "success",
						docAuthor: "xinsane"
					},
					{
						docName: "WebIDE",
						docIcon: "warning",
						docAuthor: "koado"
					}
				]
			}
		},
		components: {
			ShowPdf,
			Video
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
		margin-top: 10px;
	}

	.divider {
		background-color: #DCDFE6;
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

	.image {
		width: 202.5px;
		height: 202.5px;
		display: block;
	}

	body {
		position: relative;
		height: 80%;
	}

	html {
		position: relative;
	}
</style>
