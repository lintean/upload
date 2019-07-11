<template>
	<div>
		<uploader :options="options" class="uploader-example" ref="uploader">
			<uploader-unsupport></uploader-unsupport>
			<uploader-drop>
				<p>Drop files here to upload or</p>
				<div style="display: flex; justify-content: flex-start; margin: 10px 0;">
					<el-card v-for="(file, index) in fileList" :key="index" shadow="always" :body-style="{ padding: '0px'}" style="width: 250px; height: 300px; margin-left: 10px;">
						<el-image :src="file.fileImgUrl" fit="fill" alt="fileImage" class="image"></el-image>
						<div style="height: 50px; line-height: 50px;">
							<span style="font-size: 14px; height: 50px; line-height: 50px;">{{file.fileName}}</span>
							<el-dropdown @command="handleCommand" style="float: right; right: 10px;">
								<span class="el-dropdown-link">
									<i class="el-icon-edit"></i>
								</span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item :command="[index,0]">预览</el-dropdown-item>
									<el-dropdown-item :command="[index,1]">删除</el-dropdown-item>
									<el-dropdown-item :command="[index,2]">历史</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</div>
					</el-card>
				</div>

				<uploader-btn>select files</uploader-btn>
			</uploader-drop>
			<uploader-list></uploader-list>
		</uploader>

	</div>
</template>

<script>
	export default {
		name: 'app',
		data() {
			return {
				options: {
					// https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
					target: "",
					testChunks: false,
					simultaneousUploads: 1,
					singleFile: true
				},
				uploader: null,
				objectName: "",
				file_id: "",
				cur_id: "",
				currentUrl: "",
				fileList: [{
						fileName: "视频.mp4",
						fileImgUrl: "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
						fileUrl: "",
						fileType: ""
					},
					{
						fileName: "音乐.mp3",
						fileImgUrl: "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
						fileUrl: "",
						fileType: ""
					},
					{
						fileName: "pdf文档.pdf",
						fileImgUrl: "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
						fileUrl: "",
						fileType: ""
					},
					{
						fileName: "文件名",
						fileImgUrl: "https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png",
						fileUrl: "",
						fileType: ""
					}
				]
			}
		},
		mounted: function() {
			this.uploader = this.$refs.uploader.uploader;
			console.log(this.uploader);
			let _this = this;

			this.uploader.on("fileSuccess", function(rootFile, file, message, chunk) {
				console.log("fileSuccess");
				// 上传成功后更新meta
				let data = JSON.stringify({
					'title': file.file.name,
					'store_key': _this.objectName,
					'doc_id': _this.cur_id,
					'parentId': '',
					'ext': file.getExtension(),
					'creator': '',
					'size': ''
				})

				$.ajax({
					type: 'post',
					url: 'http://192.168.199.182:8080/v1/files/' + _this.file_id,
					data: data,
					contentType: 'application/json',
					success: function(datas) {
						console.log(datas)
					}
				})
			})

			this.uploader.on("fileAdded", function(file, event) {
				console.log("fileAdded");
				// 从服务器获取一个URL
				_this.policy(file.file, file.getExtension(), this.cur_id, (file, url) => {
					// _this.options.target = url;
					console.log(_this.uploader.opts.target);
					_this.uploader.opts.target = url;
					console.log(_this.uploader.opts.target);
					console.log(_this.uploader);

					let strings = url.split('/')
					_this.objectName = ""
					for (var i = 4; i < strings.length - 1; i++) {
						_this.objectName += strings[i] + '/'
					}
					_this.file_id = strings[strings.length - 1].split('?')[0]
					// 存储在oss里的key
					_this.objectName += _this.file_id;
				})
			})
		},
		components: {},
		computed: {},
		methods: {
			handleCommand(command) {
				console.log('click on item ' + command[0] + command[1]);
			},
			policy(file, ext, cur_id, cb) {
				var data = JSON.stringify({
					'ext': ext,
					'cur_id': cur_id
				})
				$.ajax({
					type: 'post',
					url: 'http://192.168.199.182:8080/v1/files/url',
					data: data,
					contentType: 'application/json',
					success: function(datas) {
						return cb(file, datas.data.url)
					}
				})

			},
			getUrl(file, chunk, flag) {
				console.log("Url:");
				console.log(this.currentUrl);
				return this.currentUrl;
			}
		}
	}
</script>

<style>
	.uploader-example {
		width: 880px;
		padding: 15px;
		margin: 40px auto 0;
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
		width: 250px;
		height: 250px;
		display: block;
	}
</style>
