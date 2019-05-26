<template>
	<div>
		<uploader :options="options" class="uploader-example">
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
		name: 'Upload',
		data() {
			return {
				options: {
					// https://github.com/simple-uploader/Uploader/tree/develop/samples/Node.js
					target: '//localhost:3000/upload',
					testChunks: false
				},
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
		components: {},
		computed: {},
		methods: {
			handleCommand(command) {
				console.log('click on item ' + command[0] + command[1]);
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
