<template>
	<el-container>
		<el-header>
			<div class="input-cnt">
				<el-input placeholder="请输入内容" class="input-with-select" v-model="keyword">
					<el-dropdown slot="prepend">
						<el-button type="primary">
							文档<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>。。</el-dropdown-item>
							<el-dropdown-item>。。</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
					<el-button slot="append" icon="el-icon-search"></el-button>
				</el-input>
			</div>
		</el-header>
		<el-container>
			<el-main class="cnt_padding">
				<div class="selection_header">
					<el-row type="flex">
						<el-col :span="3">
							<span class="notication_padding">已选条件</span>
						</el-col>
						<el-col :span="21">
							<el-tag v-for="(option, index) in selectedOptions" :key="index" closable style="margin-left: 5px;" @close="handleClose(tag)">{{option}}</el-tag>
						</el-col>
					</el-row>
				</div>
				<section class="selection_cnt">
					<el-row type="flex" class="row_bottom_line">
						<el-col :span="3">
							<span class="notication_padding">类目选择</span>
						</el-col>
						<el-col :span="21">
							<el-checkbox-group v-model="checkedCtgr" class="selection">
								<el-checkbox v-for="(showCategory, index) in showCategories" :key="index" :label="showCategory" border size="medium"
								 style="margin-right: 10px;"></el-checkbox>
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
								<el-checkbox v-for="(showTag, index) in showCategories" :key="index" :label="showTag" border size="medium"
								 style="margin-right: 10px;"></el-checkbox>
							</el-checkbox-group>
							<el-input v-model="tag" placeholder="标签搜索框" size="medium" class="input"></el-input>
						</el-col>
					</el-row>

					<el-row type="flex" class="row_bottom_line">
						<el-col :span="3">
							<span class="notication_padding">文件后缀</span>
						</el-col>
						<el-col :span="21">
							<el-checkbox :indeterminate="isIndeterminate" v-model="allTypes" @change="handleCheckAllChange">全选</el-checkbox>
							<el-checkbox-group v-model="defaultTypes" @change="handleCheckedTypesChange" class="selection">
								<el-checkbox v-for="(type, index) in types" :label="type" :key="index"></el-checkbox>
							</el-checkbox-group>
						</el-col>
					</el-row>

					<el-row type="flex" class="row_bottom_line">
						<el-col :span="3">
							<span class="notication_padding">创建时间</span>
						</el-col>
						<el-col :span="21">
							<el-radio-group v-model="defaultCTime">
								<el-radio v-for="(ct, index) in CTimes" :key="index" :label="ct">{{ct}}</el-radio>
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
								<el-radio v-for="(et, index) in ETimes" :key="index" :label="et">{{et}}</el-radio>
							</el-radio-group>

							<el-date-picker v-model="ETime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
						</el-col>
					</el-row>
				</section>

				<section class="contain_cnt">
					<div style="display: flex; justify-content: flex-start;">
						<el-card @click.native="itemClicked" v-for="(item, index) in resultItems" :key="index" class="item">
							<el-image :src="require('./assets/images/doc.png')" fit="cover">
							</el-image>
							<span>{{item.name}}</span>
						</el-card>
					</div>
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
					 :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400"
					 style="text-align: center;">
					</el-pagination>
				</section>
			</el-main>
		</el-container>
	</el-container>
</template>

<script>
	const typeOptions = ['DOC', 'PPT', 'PDF', 'TXT', '自定义'];
	const timeOptions = ['全部', '三天内', '一周内', '一个月内', '三个月内', '一年内', '自定义'];

	export default {
		name: "search",
		data() {
			return {
				// header搜索栏
				searchType: [],
				keyword: '',
				// aside单多选
				types: typeOptions,
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
				showType: "图标",
				currentPage: 4,
				resultItems: [{
						name: '文件1'
					},
					{
						name: '文件1'
					},
					{
						name: '文件1'
					},
					{
						name: '文件1'
					},
					{
						name: '文件1'
					}
				],
				// 类目和标签搜索和展示
				category: '',
				tag: '',
				checkedCtgr: [],
				showCategories: ["XXXX", "AAAAA", "BBBBBBB", "CCCCCCC"],
				checkedTags: [],
				showTags: ["XXXX", "AAAAA", "BBBBBBB", "CCCCCCC"],
				// 已选条件展示
				selectedOptions: [
					"XXXXX",
					"AAAAA",
					"GGGGGGGGGG"
				]
			}
		},
		methods: {
			itemClicked() {
				alert("itemClicked");
			},
			handleCheckAllChange(value) {
				this.defaultTypes = value ? typeOptions : [];
				this.isIndeterminate = false;
			},
			handleCheckedTypesChange(value) {
				let checkedCount = value.length;
				this.allTypes = (checkedCount === this.types.length);
				this.isIndeterminate = (checkedCount > 0 && checkedCount < this.types.length);
			},
			handleSizeChange() {

			},
			handleCurrentChange() {

			},
			handleClose(tag) {
				this.selectedOptions.splice(this.selectedOptions.indexOf(tag), 1);
				// 还有一些单复选的处理
			},
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

	.selection_cnt {
		border: 1px solid #e8e8e8;
	}

	.input {
		display: inline-block;
		width: 150px !important;
		margin-left: 10px;
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
</style>
