<template>
	<div>
		<el-container v-if="!phone">
			<el-header>
				<div class="input-cnt">
					<el-autocomplete placeholder="请输入内容" class="input-with-select" v-model="keyword" style="width: 100%;"
					 :fetch-suggestions="querySearchAsync" @select="handleSelect">

						<el-dropdown slot="prepend" @command="dropdownClick">
							<el-button type="primary">
								{{typeOnshow}}<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for="(searchType, index) in searchTypes" :key="index" :command="searchType">{{searchType.value}}</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<el-button slot="append" icon="el-icon-search" @click="search"></el-button>
					</el-autocomplete>
				</div>
			</el-header>
			<el-container>
				<el-main class="cnt_padding">
					<!-- 					<div class="selection_header">
						<el-row type="flex">
							<el-col :span="3">
								<span class="notication_padding">已选条件</span>
							</el-col>
							<el-col :span="21">
								<el-tag v-for="(option, index) in selectedOptions" :key="index" closable style="margin-left: 5px;" @close="handleClose(tag)">{{option}}</el-tag>
							</el-col>
						</el-row>
					</div> -->
					<section class="selection_cnt">
						<el-row type="flex" class="row_bottom_line">
							<el-col :span="3">
								<span class="notication_padding">类目选择</span>
							</el-col>
							<el-col :span="21">
								<el-checkbox-group v-model="checkedCtgr" class="selection">
									<el-checkbox v-for="(showCategory, index) in showCategories" :key="index" :label="showCategory.id" border size="medium"
									 style="margin-right: 10px; margin-bottom: 10px;">{{showCategory.title}}</el-checkbox>
								</el-checkbox-group>
								<el-input v-model="category" placeholder="类目搜索框" size="medium" class="input"></el-input>
							</el-col>
						</el-row>

						<el-row type="flex" class="row_bottom_line">
							<el-col :span="3">
								<span class="notication_padding">标签选择</span>
							</el-col>
							<el-col :span="21">
								<el-checkbox-group v-model="checkedTags" class="selection">
									<el-checkbox v-for="(showTag, index) in showTags" :key="index" :label="showTag.id" border size="medium"
									 style="margin-right: 10px; margin-bottom: 10px;">{{showTag.title}}</el-checkbox>
								</el-checkbox-group>
								<el-input v-model="tag" placeholder="标签搜索框" size="medium" class="input"></el-input>
							</el-col>
						</el-row>

						<el-row type="flex" class="row_bottom_line">
							<el-col :span="3">
								<span class="notication_padding">文件后缀</span>
							</el-col>
							<el-col :span="21">
								<el-checkbox :indeterminate="isIndeterminate" style="margin-bottom: 10px;" v-model="allTypes" @change="handleCheckAllChange">全选</el-checkbox>
								<el-checkbox-group v-model="defaultTypes" @change="handleCheckedTypesChange" class="selection">
									<el-checkbox v-for="(type, index) in types" :label="type.key" :key="index" style="margin-bottom: 10px;"></el-checkbox>
								</el-checkbox-group>
							</el-col>
						</el-row>

						<el-row type="flex" class="row_bottom_line">
							<el-col :span="3">
								<span class="notication_padding">创建时间</span>
							</el-col>
							<el-col :span="21">
								<el-radio-group v-model="defaultCTime">
									<el-radio v-for="(ct, index) in CTimes" :key="index" :label="ct.key" style="margin-bottom: 10px;"></el-radio>
								</el-radio-group>

								<el-date-picker v-model="CTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
								</el-date-picker>
							</el-col>
						</el-row>

						<el-row type="flex" class="row_top_line">
							<el-col :span="3">
								<span class="notication_padding">修改时间</span>
							</el-col>
							<el-col :span="21">
								<el-radio-group v-model="defaultETime">
									<el-radio v-for="(et, index) in ETimes" :key="index" :label="et.key" style="margin-bottom: 10px;"></el-radio>
								</el-radio-group>

								<el-date-picker v-model="ETime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
								</el-date-picker>
							</el-col>
						</el-row>
					</section>

					<section class="contain_cnt">
						<div style="display: flex; justify-content: flex-start; flex-wrap: wrap;">
							<el-card @click.native="itemClicked" v-for="(item, index) in resultItems" :key="index" class="item">
								<el-image :src="item.thumbnail" fit="cover">
								</el-image>
								<span>{{item.title}}</span>
							</el-card>
						</div>
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
						 :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="sizes, prev, pager, next" :total="400" style="text-align: center;">
						</el-pagination>
					</section>
				</el-main>
			</el-container>
		</el-container>

		<el-container v-if="phone">
			<el-header>
				<div class="input-cnt-phone">
					<el-autocomplete placeholder="请输入内容" size="small" class="input-with-select" v-model="keyword" style="width: 100%;"
					 :fetch-suggestions="querySearchAsync" @select="handleSelect">
					
						<el-dropdown slot="prepend" @command="dropdownClick">
							<el-button type="primary">
								{{typeOnshow}}<i class="el-icon-arrow-down el-icon--right"></i>
							</el-button>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item v-for="(searchType, index) in searchTypes" :key="index" :command="searchType">{{searchType.value}}</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<el-button slot="append" icon="el-icon-search" @click="test"></el-button>
					</el-autocomplete>
				</div>
			</el-header>
			<el-main class="cnt_padding">
				<div style="height: 35px">
					<el-button @click="phoneSVisible = true" icon="el-icon-set-up el-icon--right" type="primary" size="small" style="float: right;">筛选条件</el-button>
					<h2>搜索结果</h2>
				</div>
				<div class="dd"></div>

				<section>
					<div style="display: flex; justify-content: flex-start; flex-wrap: wrap;">
						<el-card @click.native="itemClicked" v-for="(item, index) in resultItems" :key="index" class="item_phone">
							<el-image :src="item.thumbnail" fit="cover">
							</el-image>
							<span>{{item.title}}</span>
						</el-card>
					</div>
					<el-pagination small @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
					 :page-size="10" layout="prev, pager, next" :total="400" style="text-align: center;">
					</el-pagination>
					
				</section>
			</el-main>
		</el-container>

		<!-- 筛选条件抽屉 -->
		<a-drawer placement="right" :closable="false" @close="phoneSVisible = false" :visible="phoneSVisible">

			<el-collapse v-model="activeNames">
				<el-collapse-item title="类目" name="类目">
					<el-checkbox-group v-model="checkedCtgr" class="checkbox_group_phone">
						<el-checkbox v-for="(showCategory, index) in showCategories" :key="index" :label="showCategory.id" border size="medium"
						 class="checkbox_phone">{{showCategory.title}}</el-checkbox>
					</el-checkbox-group>
					<el-input v-model="category" placeholder="类目搜索框" size="medium" class="input"></el-input>
				</el-collapse-item>
				<el-collapse-item title="标签" name="标签">
					<el-checkbox-group v-model="checkedTags" class="checkbox_group_phone">
						<el-checkbox v-for="(showTag, index) in showCategories" :key="index" :label="showTag.id" border 
						size="medium" class="checkbox_phone">{{showTag.title}}</el-checkbox>
					</el-checkbox-group>
					<el-input v-model="tag" placeholder="标签搜索框" size="medium" class="input"></el-input>
				</el-collapse-item>
				<el-collapse-item title="文件后缀" name="文件后缀">
					<el-checkbox :indeterminate="isIndeterminate" class="checkbox_phone" border v-model="allTypes" @change="handleCheckAllChange">全选</el-checkbox>
					<el-checkbox-group v-model="defaultTypes" @change="handleCheckedTypesChange" class="checkbox_group_phone">
						<el-checkbox v-for="(type, index) in types" border :label="type.key" :key="index" class="checkbox_phone"></el-checkbox>
					</el-checkbox-group>
				</el-collapse-item>
				<el-collapse-item title="创建时间" name="创建时间">
					<el-radio-group v-model="defaultCTime" class="checkbox_group_phone">
						<el-radio v-for="(ct, index) in CTimes" border :key="index" :label="ct.key" class="checkbox_phone"></el-radio>
					</el-radio-group>

					<el-date-picker v-model="CTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-collapse-item>
				<el-collapse-item title="修改时间" name="修改时间">
					<el-radio-group v-model="defaultETime" class="checkbox_group_phone">
						<el-radio v-for="(et, index) in ETimes" border :key="index" :label="et.key" class="checkbox_phone"></el-radio>
					</el-radio-group>

					<el-date-picker v-model="ETime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
					</el-date-picker>
				</el-collapse-item>
			</el-collapse>
		</a-drawer>
	</div>
</template>

<script>
	import * as Api from './api/api'

	const extOptions = [{
			"key": "jpg",
			"doc_count": 50
		},
		{
			"key": "png",
			"doc_count": 30
		},
		{
			"key": "gif",
			"doc_count": 20
		}
	];
	const timeOptions = [{
			"key": "全部",
			"doc_count": 100
		},
		{
			"key": "三天内",
			"doc_count": 6
		},
		{
			"key": "一周内",
			"doc_count": 15
		},
		{
			"key": "一个月内",
			"doc_count": 23
		},
		{
			"key": "三个月内",
			"doc_count": 25
		},
		{
			"key": "半年内",
			"doc_count": 27
		},
		{
			"key": "一年内",
			"doc_count": 50
		},
		{
			"key": "一年前",
			"doc_count": 50
		}
	];
	const typeOptions = [{
		value: '全部',
		command: 'all'
	}, {
		value: '图片',
		command: 'image'
	}, {
		value: '文档',
		command: 'doc'
	}, {
		value: '视频',
		command: 'video'
	}, {
		value: '音频',
		command: 'audio'
	}, {
		value: '其他文件',
		command: 'others'
	}];
	const cate = [{
			"id": 6,
			"title": "科技"
		},
		{
			"id": 1,
			"title": "文学"
		},
		{
			"id": 2,
			"title": "流行"
		},
		{
			"id": 3,
			"title": "文化"
		},
		{
			"id": 4,
			"title": "生活"
		},
		{
			"id": 5,
			"title": "经管"
		}
	];
	const tg = [{
			"id": 137,
			"title": "算法"
		},
		{
			"id": 2998,
			"title": "计算机"
		},
		{
			"id": 2697,
			"title": "计算机科学"
		},
		{
			"id": 66,
			"title": "哲学"
		},
		{
			"id": 133,
			"title": "编程"
		}
	]

	export default {
		name: "app",
		data() {
			return {
				// 手机端
				phone: true,

				// header搜索栏
				searchType: [],
				keyword: '',
				searchSuggestions: [],
				searchTypes: typeOptions,
				typeOnshow: '全部',
				typeCommand: 'all',

				// 后缀名时间单多选
				types: extOptions,
				isIndeterminate: false,
				allTypes: true,
				defaultTypes: [],
				CTimes: timeOptions,
				ETimes: timeOptions,
				defaultCTime: '全部',
				defaultETime: '全部',
				// 自定义时间
				CTime: '',
				ETime: '',
				// 结果展示
				resultItems: [{
						title: '文件1',
						thumbnail: "http://douban-test.oss-cn-beijing.aliyuncs.com/img/10432347.jpeg"
					},
					{
						title: '文件1',
						thumbnail: "http://douban-test.oss-cn-beijing.aliyuncs.com/img/10432347.jpeg"
					},
					{
						title: '文件1',
						thumbnail: "http://douban-test.oss-cn-beijing.aliyuncs.com/img/10432347.jpeg"
					},
					{
						title: '文件1',
						thumbnail: "http://douban-test.oss-cn-beijing.aliyuncs.com/img/10432347.jpeg"
					},
					{
						title: '文件1',
						thumbnail: "http://douban-test.oss-cn-beijing.aliyuncs.com/img/10432347.jpeg"
					}
				],
				// 类目和标签搜索和展示
				category: '',
				tag: '',
				checkedCtgr: [],
				showCategories: cate,
				checkedTags: [],
				showTags: tg,
				// 已选条件展示（废弃
				selectedOptions: [
					"XXXXX",
					"AAAAA",
					"GGGGGGGGGG"
				],
				// 分页
				currentPage: 1,
				currentPageSize: 10,

				// 以下是手机端参数
				// 筛选条件抽屉
				phoneSVisible: false,
				activeNames: ['类目', '标签']
			}
		},
		mounted: function() {
			// 判断是否是手机访问
			this.phone = this.isPhone();
			// 移动端获取容器宽度
			if (this.phone) {
				// 暂时不用
			}
		},
		methods: {
			itemClicked() {
				alert("itemClicked");
			},
			handleCheckAllChange(value) {
				this.defaultTypes = value ? extOptions : [];
				this.isIndeterminate = false;
			},
			handleCheckedTypesChange(value) {
				let checkedCount = value.length;
				this.allTypes = (checkedCount === this.types.length);
				this.isIndeterminate = (checkedCount > 0 && checkedCount < this.types.length);
			},
			handleSizeChange(val) {
				this.currentPageSize = val;
				this.search();
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.search();
			},
			isPhone() {
				let flag = navigator.userAgent.match(
					/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
				)
				return flag;
			},
			// 搜索部分
			querySearchAsync(queryString, cb) {
				// cb(results);网络请求部分
				let _this = this;
				Api.Suggestions(this.typeCommand, this.keyword, 10).then(
					res => {
						if (res.data.status === 200) {
							// 数组清空
							_this.searchSuggestions.splice(0, _this.searchSuggestions.length);
							for (let i = 0; i < res.data.data.length; ++i) {
								let temp = {
									value: res.data.data[i]
								};
								_this.searchSuggestions.push(temp);
							}
							cb(_this.searchSuggestions);
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			handleSelect(item) {
				// 点击后处理
				this.keyword = item.value;
				this.search();
			},
			search() {
				// 点击后处理
				let _this = this;
				let exts;
				if (this.allTypes) exts = ['all'];
				else exts = this.defaultTypes;

				
				let created_time = {
					from: this.changeTime(this.CTime[0]),
					to: this.changeTime(this.CTime[1])
				};
				let modified_time = {
					from: this.changeTime(this.ETime[0]),
					to: this.changeTime(this.ETime[1])
				};

				Api.Results(this.typeCommand, this.keyword, this.checkedTags, this.checkedCtgr, exts, created_time, modified_time,
					"+8", this.currentPage, this.currentPageSize).then(
					res => {
						if (res.data.status === 200) {
							// 结果数组
							_this.resultItems.splice(0, _this.resultItems.length);
							_this.resultItems = res.data.data.result;

							// 后缀名数组更新
							_this.types.splice(0, _this.types.length);
							_this.defaultTypes.splice(0, _this.defaultTypes.length);
							_this.isIndeterminate = false;
							_this.allTypes = true;
							_this.types = res.data.data.group_by_ext.slice(1);

							// 创建时间数组更新
							_this.CTimes.splice(0, _this.CTimes.length);
							_this.defaultCTime = ""
							_this.CTimes = res.data.data.group_by_created_time;

							// 修改时间数组更新
							_this.ETimes.splice(0, _this.ETimes.length);
							_this.defaultETime = "";
							_this.ETimes = res.data.data.group_by_modified_time;

							// 获取类目和标签
							Api.Associations(this.keyword, 5, 5).then(
								res => {
									if (res.data.status === 200) {
										// 类目数组清空
										_this.showCategories.splice(0, _this.showCategories.length);
										_this.checkedCtgr.splice(0, _this.checkedCtgr.length);
										_this.showCategories = res.data.data.categories;

										// 标签数组清空
										_this.checkedTags.splice(0, _this.checkedTags.length);
										_this.showTags.splice(0, _this.showTags.length);
										_this.showTags = res.data.data.tags;
									} else {
										alert(res.data.msg);
									}
								}).catch(err => {
								console.log(err);
							});

						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			// 下拉框选择
			dropdownClick(searchType) {
				this.typeOnshow = searchType.value;
				this.typeCommand = searchType.command;
			},
			test() {

			},
			changeTime(dt) {
				if (dt == null) return;
				return [
					[dt.getFullYear(), dt.getMonth() + 1, dt.getDate()].join('-'),
					[dt.getHours(), dt.getMinutes(), dt.getSeconds()].join(':')
				].join(' ').replace(/(?=\b\d\b)/g, '0');
			}
		},
	}
</script>

<style>
	.input-with-select .el-input-group__prepend {
		background-color: #fff;
	}

	.input-cnt {
		width: 60%;
		margin: 10px auto 0 auto;
	}

	.input-cnt-phone {
		width: 100%;
		margin: 10px auto 0 auto;
	}

	.el-select .el-input {
		width: 130px;
	}

	.block {
		display: block !important;
	}

	.marT {
		margin-top: 20px;
		padding: 10px;
		padding-left: 50px;
	}

	.line {
		border: #303133 1px solid;
		padding: 10px;
		margin-top: 10px;
	}

	.line_pure {
		border: #303133 1px solid;
	}

	.item {
		width: 120px;
		display: inline-block;
		margin: 10px;
		cursor: pointer;
		text-align: center;
	}

	.item_phone {
		width: 46%;
		display: inline-block;
		margin: 2%;
		cursor: pointer;
		text-align: center;
	}

	.selection_cnt {
		border: 1px solid #e8e8e8;
	}

	.input {
		display: inline-block;
		width: 150px !important;
	}

	.selection {
		display: inline-block !important;
	}

	.cnt_padding {
		padding-left: 5% !important;
		padding-right: 5% !important;
	}

	.notication_padding {
		padding-left: 10%;
	}

	.row_bottom_line {
		border-bottom: 1px dashed #e8e8e8;
		padding-top: 10px;
		padding-bottom: 10px;
		margin-bottom: 10px;
	}

	.row_top_line {
		padding-top: 10px;
		padding-bottom: 10px;
	}

	.selection_header {
		margin-bottom: 20px;
	}

	.contain_cnt {
		margin-top: 20px;
	}

	.checkbox_phone {
		margin: 0 10px 5px 10px !important;
	}

	.checkbox_group_phone {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.ant-drawer-body {
		padding: 12px !important;
	}

	.dd {
		display: block;
		height: 1px;
		width: 100%;
		margin: 10px 0;
		background-color: #DCDFE6;
		position: relative;
		box-sizing: border-box;
	}
</style>
