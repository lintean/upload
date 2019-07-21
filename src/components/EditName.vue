<template>
	<a-drawer title="修改名称" width=420 :closable="false" @close="changeName" :visible="changeNameVisible">
		<el-input v-model="currentName" type="text"></el-input>
	</a-drawer>
</template>

<script>
	// 功能转移到ResourceCard，已弃用
	import {
		mapState
	} from 'vuex'
	import * as DEFAULT from "../json/default"

	export default {
		name: "EditName",
		data() {
			return {
				// 修改名称
				currentName: "",
			}
		},
		computed: {
			...mapState([
				'clickedItemId',
				'changeNameVisible',
				'clickedItemType'
			])
		},
		methods: {
			changeName() {
				if (this.clickedItemType == "file") {
					this.changeFileName();
				} else if (this.clickedItemType == "dir") {
					this.editResources();
				} else {
					this.changeDocName();
				}

				this.$store.commit({
					type: "changeNameH"
				})
			},
			editResources() {
				let _this = this;
				Api.editResources(this.clickedItemId, this.currentName).then(
					res => {
						if (res.data.status === 200) {
							_this.docList[_this.currentItemClicked].title = _this.currentName;
							_this.$parent.itemDBClicked(-1);
						} else {
							_this.$message.error(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
					_this.$message.warning(DEFAULT.defaultNetwordError);
				});
			},
			changeDocName() {
				let _this = this;
				Api.getResourceMeta(this.clickedItemId).then(
					res => {
						if (res.data.status === 200) {
							_this.docEditMeta = res.data.data;
							_this.docEditMeta.title = _this.currentName;
							_this.updateDocMeta();
						} else {
							_this.$message.error(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
					_this.$message.warning(DEFAULT.defaultNetwordError);
				});
			},
			changeFileName() {
				let _this = this;
				Api.getFileMeta(this.clickedItemId).then(
					res => {
						if (res.data.status === 200) {
							_this.fileEditMeta = res.data.data;
							_this.fileEditMeta.title = _this.currentName;
							_this.updateFileMeta();
						} else {
							_this.$message.error(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
					_this.$message.warning(DEFAULT.defaultNetwordError);
				});
			},
			updateFileMeta() {
				let _this = this;
				let temp = this.fileEditMeta;
				Api.editFileMeta(temp.id, temp.title, temp.desc, temp.categories, temp.tags).then(
					res => {
						if (res.data.status === 200) {
							_this.fileMeta = JSON.parse(JSON.stringify(_this.fileEditMeta));
							_this.$parent.itemDBClicked(-1);
							_this.fileEditMetaVisible = false;
						} else {
							_this.$message.error(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
					_this.$message.warning(DEFAULT.defaultNetwordError);
				});
			},
			updateDocMeta() {
				let _this = this;
				Api.editResourceMeta(this.clickedItemId, this.docEditMeta.title, this.docEditMeta.desc).then(
					res => {
						if (res.data.status === 200) {
							_this.docMeta = _this.docEditMeta;
							_this.$parent.itemDBClicked(-1);
						} else {
							_this.$message.error(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
					_this.$message.warning(DEFAULT.defaultNetwordError);
				});
			},
		}
	}
</script>

<style>
</style>
