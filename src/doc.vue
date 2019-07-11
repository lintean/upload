<template>
	<div id="cnt">
		<el-container v-if="!phone">
			<el-header style="height:60px; line-height: 60px; box-shadow: 0px 10px 6px 0 rgba(0,0,0,.05);">
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

			<!-- 			<el-container v-if="!showDoc">
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
			</el-container> -->

			<el-main v-if="showDoc">
				<div style="height: 50px;">
					<div style="float: left" v-if="!isCurrentFileLayout">
						<el-button type="primary" style="position: relative;" @click="newResources('doc')">新建文档</el-button>
						<el-button @click="newResources('dir')">新建文件夹</el-button>
						<el-button-group style="margin-left: 10px;" v-show="currentItemClicked != -1 && currentItemClicked != 0">
							<el-button @click="changeNameVisible = true">重命名</el-button>
							<el-button @click="resourceDelete">删除</el-button>
							<el-button @click="openMeta">属性</el-button>
							<el-button>权限和群组</el-button>
						</el-button-group>
					</div>
					<div style="float: left" v-if="isCurrentFileLayout">
						<el-button type="primary" style="position: relative;" @click="uploadVisiable = true">上传文件</el-button>
						<el-button-group style="margin-left: 10px;" v-show="currentItemClicked != -1 && currentItemClicked != 0">
							<el-button @click="downloadFile">下载</el-button>
							<el-button @click="changeNameVisible = true">重命名</el-button>
							<el-button @click="deleteFile">删除</el-button>
							<el-button @click="openMeta">属性</el-button>
							<el-button>历史版本</el-button>
						</el-button-group>
					</div>

					<el-autocomplete :fetch-suggestions="getKeyword" @select="turnToSearch" v-model="keyword" placeholder="搜索你的资源"
					 style="float: right;">
					</el-autocomplete>
				</div>
				<div>
					<el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb_route">
						<el-breadcrumb-item v-for="(document, index) in path" :key="index" @click="turnToPast(index)">{{document.title}}</el-breadcrumb-item>
					</el-breadcrumb>
				</div>
				<div class="light_divider"></div>
				<div style="display: flex; justify-content: flex-start; margin: 10px 0; flex-wrap: wrap;">
					<el-card v-for="(doc, index) in docList" :key="index" shadow="always" @click.native="itemClicked(index)"
					 :body-style="{ padding: '0px'}" @dblclick.native="itemDBClicked(index)" :class="currentItemClicked == index? 'document_card item_clicked' : 'document_card'">
						<el-image :src="doc.thumbnail" fit="scale-down" alt="fileImage" class="image"></el-image>

						<div class="divider" style="margin: 0 0 5px 0;"></div>

						<div style="height: 50px; line-height: 50px;">
							<span style="font-size: 14px; height: 50px; line-height: 50px;">{{doc.title}}</span>
						</div>
					</el-card>
				</div>
			</el-main>
		</el-container>

		<!-- <el-container v-if="phone">
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
		</el-container> -->


		<!-- 		<el-dialog :visible.sync="PdfVisible" width="80%" style="overflow-x: hidden;" :show-close="false">
			<ShowPdf :src="PdfOnShow" :page-count="count" style="height:auto; width: 100%; margin: 0 auto;"></ShowPdf>
		</el-dialog>

		<el-dialog :before-close="stateChange" :visible.sync="VideoVisible" width="80%" style="overflow-x: hidden;"
		 :show-close="false">
			<Video :src="VideoOnShow" :state="state" style="height:auto; width: 100%;"></Video>
		</el-dialog> -->

		<el-dialog title="登陆" :visible.sync="loginData.visible" width="400px" style="text-align: left;">
			<el-image :src="require('./assets/logo.png')" style="height:40px; width: 193px; margin: 0 auto; display: block;"></el-image>
			<el-form label-position="right" label-width="80px" style="margin-right: 50px; margin-top: 30px" :model="loginData"
			 :rules="loginData.rules">
				<el-form-item label="工号" prop="user">
					<el-input v-model="loginData.user"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="pwd">
					<el-input v-model="loginData.pwd"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="loginData.visible = false">取 消</el-button>
				<el-button type="primary" @click="login">确 定</el-button>
			</div>
		</el-dialog>

		<el-dialog title="注册" :visible.sync="registerData.visible" width="400px" style="text-align: left;">
			<el-image :src="require('./assets/logo.png')" style="height:40px; width: 193px; margin: 0 auto; display: block;"></el-image>
			<el-form label-position="right" label-width="80px" style="margin-right: 50px; margin-top: 30px" :model="registerData"
			 :rules="registerData.rules">
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

		<!-- 查看群组 -->
		<a-drawer width=520 :closable="false" @close="groupDrawer.groupVisible = false" :visible="groupDrawer.groupVisible">
			<!-- 下拉框：操作 -->
			<div slot="title">
				<span>查看群组</span>
				<el-dropdown style="position: absolute; top: 10px; right: 10px;" @command="operateGroup">
					<el-button size="small">操作</el-button>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item command=0>添加群组</el-dropdown-item>
						<el-dropdown-item command=1>删除群组</el-dropdown-item>
						<el-dropdown-item command=2>新建群组</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>

			<div style="border-bottom: #e8e8e8 1px solid;">
				<el-row style="height: 120px; border-top: #e8e8e8 1px solid; cursor: pointer; padding: 10px;" v-for="(group, index) in groupList"
				 :key="index" @click.native="showGroupUser">
					<el-col :span="14" style="height: 100px">
						<h3>{{group.groupInfo.group_name}}</h3>
						<span style="color:rgba(0, 0, 0, 0.45); text-overflow: ellipsis; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 3; overflow: hidden;">
							{{group.groupInfo.group_desc}}
						</span>
					</el-col>
					<el-col :offset="2" :span="8" style="height: 100px; line-height: 100px; text-align: right;">
						<span>{{permissionMap[group.permission]}}</span>
					</el-col>

					<el-button v-show="isDeleteScene" plain circle icon="el-icon-close" type="danger" style="position: absolute; right: 0px; top: 2px;"
					 size="mini" @click="deleteGroup(index)"></el-button>
				</el-row>
			</div>


			<!-- 群组列表 含群组名、群组简介、权限选择器、删除button（隐藏）、点击进入群组中的用户 -->

			<!-- 查看群组中的用户(查看群组元数组) -->
			<a-drawer width=420 :closable="false" @close="groupDrawer.groupUserVisible = false" :visible="groupDrawer.groupUserVisible">

				<div slot="title">
					<span>群组信息</span>
					<el-dropdown style="position: absolute; top: 10px; right: 10px;" @command="operateGroupMeta">
						<el-button size="small">操作</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command=0>新增用户</el-dropdown-item>
							<el-dropdown-item command=1>删除用户</el-dropdown-item>
							<el-dropdown-item command=2>编辑信息</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>

				<el-row style="margin-top: 10px;">
					<el-col :offset="1" :span="5" style="text-align: right;">群组名：</el-col>
					<el-col :offset="2" :span="16">
						<span>{{docMeta.title}}</span>
					</el-col>
				</el-row>
				<!-- 			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">创建者：</el-col>
				<el-col :offset="2" :span="16">
					<span>{{docMeta.creator}}</span>
				</el-col>
			</el-row> -->
				<el-row style="margin-top: 10px;">
					<el-col :offset="1" :span="5" style="text-align: right;">创建时间：</el-col>
					<el-col :offset="2" :span="16">
						<span>{{docMeta.created_time}}</span>
					</el-col>
				</el-row>
				<el-row style="margin-top: 10px;">
					<el-col :offset="1" :span="5" style="text-align: right;">简介：</el-col>
					<el-col :offset="2" :span="16">
						<span>{{docMeta.desc}}</span>
					</el-col>
				</el-row>
				<el-row style="margin-top: 10px;">
					<el-col :offset="1" :span="5" style="text-align: right;">用户列表：</el-col>
					<el-col :offset="2" :span="16">
						<el-tag :closable="isDeleteGroupUserScene" @close="deleteGroupUser(index)" v-for="(groupUser, index) in groupUserList"
						 :key="index" style="margin-right: 10px;">{{groupUser.username}}</el-tag>
					</el-col>
				</el-row>

				<!-- 修改群组元数据 -->
				<a-drawer title="编辑群组信息" width=320 :closable="false" @close="groupDrawer.groupMetaVisible = false" :visible="groupDrawer.groupMetaVisible">
					<el-row style="margin-top: 10px;">
						<el-col :offset="1" :span="5" style="text-align: right;">群组名：</el-col>
						<el-col :offset="2" :span="16">
							<el-input type="text" v-model="fileEditMeta.desc" size="small">
							</el-input>
						</el-col>
					</el-row>
					<el-row style="margin-top: 10px;">
						<el-col :offset="1" :span="5" style="text-align: right;">简介：</el-col>
						<el-col :offset="2" :span="16">
							<el-input type="textarea" :rows="8" show-word-limit v-model="fileEditMeta.desc" size="small">
							</el-input>
						</el-col>
					</el-row>
				</a-drawer>

				<!-- 新增用户 -->
				<a-drawer title="新增用户" width=320 :closable="false" @close="groupDrawer.addUserVisible = false" :visible="groupDrawer.addUserVisible">
					<el-input></el-input>
				</a-drawer>
			</a-drawer>

			<!-- 添加群组 -->
			<a-drawer title="添加群组" width=320 :closable="false" @close="groupDrawer.addGroupVisible = false" :visible="groupDrawer.addGroupVisible">
				<el-input></el-input>
			</a-drawer>

			<!-- 新建群组 -->
			<a-drawer title="新增群组" width=320 :closable="false" @close="groupDrawer.newGroupVisible = false" :visible="groupDrawer.newGroupVisible">
				<el-row style="margin-top: 10px;">
					<el-col :offset="1" :span="5" style="text-align: right;">群组名：</el-col>
					<el-col :offset="2" :span="16">
						<el-input type="text" v-model="fileEditMeta.desc" size="small">
						</el-input>
					</el-col>
				</el-row>
				<el-row style="margin-top: 10px;">
					<el-col :offset="1" :span="5" style="text-align: right;">简介：</el-col>
					<el-col :offset="2" :span="16">
						<el-input type="textarea" :rows="8" show-word-limit v-model="fileEditMeta.desc" size="small">
						</el-input>
					</el-col>
				</el-row>
			</a-drawer>

		</a-drawer>

		<!-- 文档meta -->
		<a-drawer width=420 :closable="false" @close="docMetaVisible = false" :visible="docMetaVisible">
			<div slot="title">
				<span>文档属性</span>
				<el-button style="position: absolute; top: 10px; right: 10px;" size="small" @click="docEditMetaVisible = true" type="primary">修改信息</el-button>
			</div>
			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">文档名：</el-col>
				<el-col :offset="2" :span="16">
					<span>{{docMeta.title}}</span>
				</el-col>
			</el-row>
			<!-- 			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">创建者：</el-col>
				<el-col :offset="2" :span="16">
					<span>{{docMeta.creator}}</span>
				</el-col>
			</el-row> -->
			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">创建时间：</el-col>
				<el-col :offset="2" :span="16">
					<span>{{docMeta.created_time}}</span>
				</el-col>
			</el-row>
			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">修改时间：</el-col>
				<el-col :offset="2" :span="16">
					<span>{{docMeta.modified_time}}</span>
				</el-col>
			</el-row>
			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">简介：</el-col>
				<el-col :offset="2" :span="16">
					<span>{{docMeta.desc}}</span>
				</el-col>
			</el-row>

			<!-- 文档meta修改 -->
			<a-drawer width=420 :closable="false" @close="docEditMetaVisible = false" :visible="docEditMetaVisible">
				<div slot="title">
					<span>修改文档信息</span>
					<el-button style="position: absolute; top: 10px; right: 10px;" size="small" @click="updateDocMeta" type="primary">保存修改</el-button>
				</div>
				<el-row style="margin-top: 10px;">
					<el-col :offset="1" :span="5" style="text-align: right;">文档名：</el-col>
					<el-col :offset="2" :span="16">
						<el-input type="text" v-model="docEditMeta.title" size="small">
						</el-input>
					</el-col>
				</el-row>
				<el-row style="margin-top: 10px;">
					<el-col :offset="1" :span="5" style="text-align: right;">简介：</el-col>
					<el-col :offset="2" :span="16">
						<el-input type="textarea" :rows="5" show-word-limit v-model="docEditMeta.desc" size="small">
						</el-input>
					</el-col>
				</el-row>
			</a-drawer>

		</a-drawer>

		<!-- 目录meta -->
		<a-drawer title="目录属性" width=420 :closable="false" @close="dirMetaVisible = false" :visible="dirMetaVisible">
			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">目录名：</el-col>
				<el-col :offset="2" :span="16">
					<span>{{currentItemClicked != -1 ? docList[currentItemClicked].title: ""}}</span>
				</el-col>
			</el-row>
			<!-- 			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">创建者：</el-col>
				<el-col :offset="2" :span="16">
					<el-input type="textarea" :rows="5" show-word-limit v-model="docEditMeta.desc" size="small">
					</el-input>
				</el-col>
			</el-row> -->
			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">创建时间：</el-col>
				<el-col :offset="2" :span="16">
					<span>{{currentItemClicked != -1 ? docList[currentItemClicked].created_time: ""}}</span>
				</el-col>
			</el-row>
		</a-drawer>

		<!-- 文件meta -->
		<a-drawer width=420 :closable="false" @close="fileMetaVisible = false" :visible="fileMetaVisible">
			<div slot="title">
				<span>文件属性</span>
				<el-button style="position: absolute; top: 10px; right: 10px;" size="small" @click="fileEditMetaVisible = true"
				 type="primary">修改信息</el-button>
			</div>

			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">文件名：</el-col>
				<el-col :offset="2" :span="16">
					<span>{{fileMeta.title + '.' + fileMeta.ext}}</span>
				</el-col>
			</el-row>
			<!-- 			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">创建者：</el-col>
				<el-col :offset="2" :span="16">
					<span>{{docList[currentItemClicked].created_time}}</span>
				</el-col>
			</el-row> -->
			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">创建时间：</el-col>
				<el-col :offset="2" :span="16">
					<span>{{fileMeta.created_time}}</span>
				</el-col>
			</el-row>
			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">修改时间：</el-col>
				<el-col :offset="2" :span="16">
					<span>{{fileMeta.modified_time}}</span>
				</el-col>
			</el-row>
			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">类目：</el-col>
				<el-col :offset="2" :span="16">
					<el-tag v-for="(fc, index) in fileCategories" :key="index" type="success" style="margin-right: 5px;">{{fc.title}}</el-tag>
				</el-col>
			</el-row>
			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">标签：</el-col>
				<el-col :offset="2" :span="16">
					<el-tag v-for="(ft, index) in fileTags" :key="index" type="primary" style="margin-right: 5px;">{{ft.title}}</el-tag>
				</el-col>
			</el-row>
			<el-row style="margin-top: 10px;">
				<el-col :offset="1" :span="5" style="text-align: right;">简介：</el-col>
				<el-col :offset="2" :span="16">
					<span>{{fileMeta.desc}}</span>
				</el-col>
			</el-row>

			<!-- 文件meta修改 -->
			<a-drawer width=420 :closable="false" @close="fileEditMetaVisible = false" :visible="fileEditMetaVisible">
				<div slot="title">
					<span>修改文件信息</span>
					<el-button style="position: absolute; top: 10px; right: 10px;" size="small" @click="updateFileMeta" type="primary">保存修改</el-button>
				</div>
				<el-row style="margin-top: 10px;">
					<el-col :offset="1" :span="5" style="text-align: right;">文件名：</el-col>
					<el-col :offset="2" :span="16">
						<el-input type="text" v-model="fileEditMeta.title" size="small">
						</el-input>
					</el-col>
				</el-row>
				<el-row style="margin-top: 10px;">
					<el-col :offset="1" :span="5" style="text-align: right;">简介：</el-col>
					<el-col :offset="2" :span="16">
						<el-input type="textarea" :rows="5" show-word-limit v-model="fileEditMeta.desc" size="small">
						</el-input>
					</el-col>
				</el-row>
			</a-drawer>

		</a-drawer>

		<!-- 文件历史版本 暂不做-->

		<!-- 修改名称 -->
		<a-drawer title="修改名称" width=420 :closable="false" @close="changeName" :visible="changeNameVisible">
			<el-input v-model="currentName" type="text"></el-input>
		</a-drawer>

		<!-- 文件上传 -->
		<a-drawer title="上传文件" width=420 :closable="false" @close="uploadVisiable = false" :visible="uploadVisiable">
			<el-upload style="text-align: center;" drag :action="url" :on-success="afterUpload" :before-upload="beforeUpload"
			 :http-request="uploadFile">
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
			</el-upload>
		</a-drawer>

	</div>
</template>

<script>
	// 	import ShowPdf from './components/ShowPdf.vue'
	// 	import Video from './components/Video.vue'
	import * as Api from './api/api'

	const files = [{
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
	];
	const docs = [{
			"id": "573d9b62-9e07-430c-b2a0-4825fbccc785", // 资源id
			"title": "七月例会", // 资源名称
			"thumbnail": "", //缩略图
			"resource_type": "doc", // 资源类型
			"creator": "", // 创建者id
			"created_time": "2019-07-01 09:21:28" // 创建时间
		},
		{
			"id": "573d9b62-9e07-430c-b2a0-4825fbccc785", // 资源id
			"title": "七月例会", // 资源名称
			"thumbnail": "", //缩略图
			"resource_type": "dir", // 资源类型
			"creator": "", // 创建者id
			"created_time": "2019-07-01 09:21:28" // 创建时间
		},
		{
			"id": "573d9b62-9e07-430c-b2a0-4825fbccc785", // 资源id
			"title": "七月例会", // 资源名称
			"thumbnail": "", //缩略图
			"resource_type": "dir", // 资源类型
			"creator": "", // 创建者id
			"created_time": "2019-07-01 09:21:28" // 创建时间
		}
	];
	const fm = {
		"id": "image_10432347",
		"title": "算法",
		"desc": "《算法(英文版•第4版)》作为算法领域经典的参考书，全面介绍了关于算法和数据结构的必备知识，并特别针对排序、搜索、图处理和字符串处理进行了论述。第4版具体给出了每位程序员应知应会的50个算法，提供了实际代码，而且这些Java代码实现采用了模块化的编程风格，读者可以方便地加以改造。本书配套网站提供了本书内容的摘要及更多的代码实现、测试数据、练习、教学课件等资源。《算法(英文版•第4版)》适合用作大学教材或从业者的参考书。",
		"creator": "green",
		"doc_id": "1",
		"type": "image",
		"ext": "jpg",
		"size": 1024,
		"categories": [
			0,
			1,
			6
		],
		"tags": [
			6,
			133,
			137,
			2552,
			2697,
			2998,
			22409,
			24310
		],
		"store_key": "http://douban-test.oss-cn-beijing.aliyuncs.com/img/10432347.jpeg",
		"thumbnail": "http://douban-test.oss-cn-beijing.aliyuncs.com/img/10432347.jpeg",
		"derived_files": [],
		"created_time": "2017-07-01 21:34:16",
		"modified_time": "2017-07-06 21:34:16",
		"version": 0,
		"original_id": "10432347",
		"parent_id": null
	}
	const tg = [{
			"id": 137,
			"title": "算法",
			"desc": "......"
		},
		{
			"id": 2998,
			"title": "计算机",
			"desc": "......"
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
	const gl = [{
		"permission": "100",
		"groupInfo": {
			"group_id": "75895fa6-9054-49cf-8db2-08312f1766d8",
			"group_name": "巴萨球迷",
			"group_desc": "巴萨是最菜的",
			"creator_id": "e1f5f562-2e96-4b3e-a6ff-e3f953c5b368",
			"created_at": "2019-07-09T17:05:39.321+0000",
			"personal": 0
		}
	}, {
		"permission": "100",
		"groupInfo": {
			"group_id": "75895fa6-9054-49cf-8db2-08312f1766d8",
			"group_name": "巴萨球迷",
			"group_desc": "巴萨是最菜的",
			"creator_id": "e1f5f562-2e96-4b3e-a6ff-e3f953c5b368",
			"created_at": "2019-07-09T17:05:39.321+0000",
			"personal": 0
		}
	}, {
		"permission": "100",
		"groupInfo": {
			"group_id": "75895fa6-9054-49cf-8db2-08312f1766d8",
			"group_name": "巴萨球迷",
			"group_desc": "巴萨是最菜的",
			"creator_id": "e1f5f562-2e96-4b3e-a6ff-e3f953c5b368",
			"created_at": "2019-07-09T17:05:39.321+0000",
			"personal": 0
		}
	}, {
		"permission": "100",
		"groupInfo": {
			"group_id": "75895fa6-9054-49cf-8db2-08312f1766d8",
			"group_name": "巴萨球迷",
			"group_desc": "巴萨是最菜的",
			"creator_id": "e1f5f562-2e96-4b3e-a6ff-e3f953c5b368",
			"created_at": "2019-07-09T17:05:39.321+0000",
			"personal": 0
		}
	}]
	const pm = {
		'100': "可读",
		'010': "可写",
		'110': "可读可写"
	}
	const ml = [{
			"user_id": "e1f5f562-2e96-4b3e-a6ff-e3f953c5b368",
			"work_no": "0001",
			"username": "张三"
		},
		{
			"user_id": "e1f5f562-2e96-4b3e-a6ff-e3f953c5b368",
			"work_no": "0001",
			"username": "铠锋"
		},
		{
			"user_id": "e1f5f562-2e96-4b3e-a6ff-e3f953c5b368",
			"work_no": "0001",
			"username": "张三"
		}
	]

	export default {
		name: 'Doc',
		data() {
			return {
				// 注册
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
				},
				// 登陆
				loginData: {
					visible: false,
					logoutVisible: false,
					isLogin: false,
					currentUserName: "lintean",
					currentUserNo: "",
					currentUserEmail: "",
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
				// pc文档界面
				showDoc: true,
				count: 7,
				state: 1,
				doc: false,
				VideoVisible: false,
				VideoOnShow: "",
				PdfVisible: false,
				PdfOnShow: "",
				options: {
					target: 'http://localhost/upload.php',
					testChunks: false
				},
				// 搜索
				keyword: "",

				// 上部

				// 当前路径
				// 中部
				path: [{
						id: '',
						title: 'root'
					},
					{
						id: '',
						title: '当前目录'
					}
				],
				// 下部
				// 点击交互
				currentItemClicked: -1,

				fileList: files,
				docList: docs,

				currentResourceId: "",
				clickedResourceId: "",
				currentResourceName: "",
				isCurrentFileLayout: true,

				// 外部
				// 上传
				uploadVisiable: false,
				url: "",
				objectName: "",
				file_id: "",
				fileExtension: "",

				// 文档meta
				docMetaVisible: false,
				docEditMetaVisible: false,
				docMeta: {
					"id": "1",
					"title": "code",
					"desc": "代码仓库",
					"creator": "green",
					"files": [
						"1",
						"2",
						"ABC"
					],
					"meta_state": 1,
					"created_time": "2019-07-05 23:09:00",
					"modified_time": "2019-07-05 23:10:00"
				},
				docEditMeta: {
					"title": "code",
					"desc": "代码仓库"
				},

				// 目录meta
				dirMetaVisible: false,

				// 文件meta
				fileMetaVisible: false,
				fileEditMetaVisible: false,
				fileMeta: fm,
				fileEditMeta: fm,
				fileCategories: tg,
				fileTags: tg,

				// 修改名称
				changeNameVisible: false,
				currentName: "",

				// 群组信息
				groupDrawer: {
					groupVisible: false,
					groupUserVisible: false,
					groupMetaVisible: false,
					newGroupVisible: false,
					addGroupVisible: false,
					addUserVisible: false
				},
				groupList: gl,
				isCurrentOwner: 1,
				permissionMap: pm,
				isDeleteScene: false,
				groupUserList: ml,
				isDeleteGroupUserScene: false,


				// 手机端
				phone: true,
				phoneTextWt: 170,
			}
		},
		components: {
			// 			ShowPdf,
			// 			Video
		},
		mounted: function() {
			// 判断是否是手机访问
			this.phone = this.isPhone();
			// 移动端获取容器宽度
			if (this.phone) {
				this.phoneTextWt = document.documentElement.clientWidth - 200;
			}

			let _this = this;
			Api.getUser().then(
				res => {
					if (res.data.status === 200) {
						_this.recordLoginData(res);

						console.log(res);
						// _this.getResources();
					} else {
						_this.loginData.visible = true;
					}
				}).catch(err => {
				console.log(err);
			});
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
			},
			recordLoginData(res) {
				let _this = this;
				// 登陆信息
				_this.loginData.currentUserName = res.data.data.userInfo.username;
				_this.loginData.currentUserNo = res.data.data.userInfo.work_no;
				_this.loginData.currentUserEmail = res.data.data.userInfo.email;
				_this.loginData.isLogin = true;

				// 目录信息
				_this.currentResourceId = res.data.data.resource_id;
				_this.clickedResourceId = res.data.data.resource_id;
				_this.currentResourceName = res.data.data.resource_name;

				_this.path.splice(0, _this.path.length);
				for (let i = res.data.data.master_dirs.length - 1; i >= 0; --i) {
					_this.path.push({
						id: res.data.data.master_dirs[i].resource_id,
						title: res.data.data.master_dirs[i].resource_name,
					})
				}
				_this.path.push({
					id: res.data.data.resource_id,
					title: res.data.data.resource_name,
				})
			},
			login() {
				let _this = this;
				console.log(this.loginData.user);
				console.log(this.loginData.pwd);

				Api.Login(this.loginData.user, this.loginData.pwd).then(
					res => {
						if (res.data.status === 200) {
							_this.recordLoginData(res);
							_this.loginData.visible = false;
							_this.getResources();
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			getResources() {
				let _this = this;
				Api.getResources(this.clickedResourceId).then(
					res => {

						if (res.data.status === 200) {
							if (res.data.data == null) res.data.data = [];
							console.log(_this.docList);

							let target;
							let parent_id;

							let parent_name = _this.currentResourceName;
							let isBack = (_this.currentItemClicked == 0);
							let isFirst = (_this.currentItemClicked == -1);
							if (isFirst) target = {
								id: _this.currentResourceId,
								title: _this.currentResourceName
							};
							else target = _this.docList[_this.currentItemClicked]

							if (isFirst) parent_id = _this.path[_this.path.length - 2].id;
							else parent_id = _this.currentResourceId;

							// 更新当前目录状态
							_this.currentResourceId = (_this.currentItemClicked != -1 ? _this.docList[_this.currentItemClicked].id :
								_this.currentResourceId);
							if (isBack) _this.currentResourceName = _this.path[_this.path.length - 1].title;
							else _this.currentResourceName = (_this.currentItemClicked != -1 ? _this.docList[_this.currentItemClicked].title :
								_this.currentResourceName);
							_this.isCurrentFileLayout = (_this.currentItemClicked != -1 ? !(_this.docList[_this.currentItemClicked].resource_type ==
								"dir") : false);

							// 更新资源列表
							_this.docList.splice(0, _this.docList.length);

							// 更新路径和返回上一级入口
							if (isBack) {
								console.log("Back");
								// 返回上一级
								_this.path.pop();
								if (_this.path.length > 1) {
									_this.docList.push({
										"title": "返回",
										"thumbnail": require("./assets/back.png"),
										"resource_type": "dir",
										"id": _this.path[_this.path.length - 2].id
									})
								}
							} else {
								console.log("Front");
								if (!isFirst) _this.path.push(target);
								_this.docList.push({
									"title": "返回",
									"thumbnail": require("./assets/back.png"),
									"resource_type": "dir",
									"id": parent_id
								})
							}

							for (let i = 0; i < res.data.data.length; ++i) {
								if (res.data.data[i].thumbnail == "./assets/images/docCnt.png") res.data.data[i].thumbnail = require(
									"./assets/images/docCnt.png");
								if (res.data.data[i].thumbnail == "./assets/images/doc.png") res.data.data[i].thumbnail = require(
									"./assets/images/doc.png");
							}
							_this.docList = _this.docList.concat(res.data.data);

							// 初始化点击
							_this.currentItemClicked = -1;
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			itemClicked(i) {
				if (i != this.currentItemClicked) {
					this.currentItemClicked = i;
				} else {
					this.currentItemClicked = -1;
				}
			},
			itemDBClicked(index) {
				console.log(1);
				this.currentItemClicked = index;
				this.clickedResourceId = this.docList[index].id;
				this.getResources();
			},
			// 上传函数
			afterUpload(response, file, fileList) {
				let _this = this;
				// 上传成功后更新meta
				let data = JSON.stringify({
					'title': file.name.substring(0, file.name.lastIndexOf(".")),
					'store_key': _this.objectName,
					'doc_id': _this.currentResourceId,
					'parentId': '',
					'ext': _this.fileExtension,
					'creator': _this.loginData.currentUserNo,
					'size': Math.floor(file.size.toFixed(1))
				})

				$.ajax({
					type: 'post',
					url: 'http://39.108.210.48:8089/v1/files/' + _this.file_id.substring(0, _this.file_id.lastIndexOf(".")),
					data: data,
					contentType: 'application/json',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					success: function(datas) {
						_this.currentItemClicked = -1;
						_this.getResources();
					}
				})
			},
			beforeUpload(file) {
				let _this = this;
				_this.fileExtension = file.name.split('.')[file.name.split('.').length - 1]

				// 从服务器获取一个URL
				this.policy(file);
			},
			policy(file) {
				let _this = this;
				var data = JSON.stringify({
					'ext': this.fileExtension,
					'cur_id': this.currentResourceId
				})
				$.ajax({
					type: 'post',
					url: 'http://39.108.210.48:8089/v1/files/url',
					data: data,
					async: false,
					contentType: 'application/json',
					xhrFields: {
						withCredentials: true
					},
					crossDomain: true,
					success: function(datas) {
						_this.url = datas.data.url;
						let strings = _this.url.split('/')
						_this.objectName = ""
						for (var i = 4; i < strings.length - 1; i++) {
							_this.objectName += strings[i] + '/'
						}
						_this.file_id = strings[strings.length - 1].split('?')[0]
						// 存储在oss里的key
						_this.objectName += _this.file_id;
					}
				})
			},
			uploadFile(params) {
				let file = params.file;

				let xhr = new XMLHttpRequest()
				xhr.upload.addEventListener("progress", function(evt) {
					var percentComplete = Math.round(evt.loaded * 100 / evt.total);
					params.onProgress({
						percent: percentComplete
					});
				}, false)
				xhr.open('PUT', this.url, true)
				xhr.send(file)
				xhr.onload = () => {
					if (xhr.status == 200) {
						params.onSuccess("上传成功");
					}
				}
			},
			downloadFile() {
				Api.Download(this.docList[this.currentItemClicked]).then(
					res => {
						let blob = new Blob([res.data], {
							type: ""
						});
						let obUrl = URL.createObjectURL(blob);
						window.location.href = obUrl;
					}).catch(err => {
					console.log(err);
				});
			},
			// 打开各种meta信息
			openMeta() {
				if (this.isCurrentFileLayout) {
					this.fileMetaVisible = true;
					this.getFileMeta();
				} else if (this.docList[this.currentItemClicked].resource_type == "dir") {
					this.dirMetaVisible = true;
				} else {
					this.docMetaVisible = true;
					this.getDocMeta();
				}
			},
			updateDocMeta() {
				let _this = this;
				Api.editResourceMeta(this.docList[this.currentItemClicked].id, this.docEditMeta.title, this.docEditMeta.desc).then(
					res => {
						if (res.data.status === 200) {
							_this.docMeta = _this.docEditMeta;
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			getDocMeta() {
				let _this = this;
				Api.getResourceMeta(this.docList[this.currentItemClicked].id).then(
					res => {
						if (res.data.status === 200) {
							_this.docMeta = res.data.data;
							_this.docEditMeta = res.data.data;
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			getFileMeta() {
				let _this = this;
				Api.getFileMeta(this.docList[this.currentItemClicked].id).then(
					res => {
						if (res.data.status === 200) {
							_this.fileMeta = res.data.data;
							_this.fileEditMeta = res.data.data;
							_this.getFileCategories();
							_this.getFileTags();
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			updateFileMeta() {
				let _this = this;
				let temp = this.fileEditMeta;
				Api.editFileMeta(temp.id, temp.title, temp.desc, temp.categories, temp.tags).then(
					res => {
						if (res.data.status === 200) {
							_this.fileMeta = res.data.data;
							_this.fileEditMeta = res.data.data;
							_this.getFileCategories();
							_this.getFileTags();
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			getFileCategories() {
				let _this = this;
				Api.getFileCategories(this.docList[this.currentItemClicked].id).then(
					res => {
						if (res.data.status === 200) {
							_this.fileCategories = res.data.data;
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			getFileTags() {
				let _this = this;
				Api.getFileTags(this.docList[this.currentItemClicked].id).then(
					res => {
						if (res.data.status === 200) {
							_this.fileTags = res.data.data;
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			newResources(type) {
				let _this = this;
				Api.newResources(type, this.currentResourceId).then(
					res => {
						if (res.data.status === 200) {
							let temp = res.data.data;
							_this.docList.push({
								"created_time": temp.created_at,
								"thumbnail": require(temp.thumbnail),
								"creator": temp.creator_id,
								"resource_type": temp.resource_type,
								"id": temp.resource_id,
								"title": temp.resource_name
							});
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			resourceDelete() {
				let _this = this;
				Api.deleteResources(this.docList[this.currentItemClicked].id).then(
					res => {
						if (res.data.status === 200) {
							_this.currentItemClicked = -1;
							_this.getResources();
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			deleteFile() {
				let _this = this;
				Api.deleteFile(this.docList[this.currentItemClicked].id).then(
					res => {
						if (res.data.status === 200) {
							_this.currentItemClicked = -1;
							_this.getResources();
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			changeName() {
				if (this.isCurrentFileLayout) {
					this.changeFileName();
				} else if (this.docList[this.currentItemClicked].resource_type == "dir") {
					this.editResources();
				} else {
					this.changeDocName();
				}
				this.changeNameVisible = false;
			},
			editResources() {
				let _this = this;
				Api.editResources(this.docList[this.currentItemClicked].id).then(
					res => {
						if (res.data.status === 200) {
							_this.docList[_this.currentItemClicked].title = _this.currentName;
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			changeDocName() {
				let _this = this;
				Api.getResourceMeta(this.docList[this.currentItemClicked].id).then(
					res => {
						if (res.data.status === 200) {
							_this.docEditMeta = res.data.data;
							_this.docEditMeta.title = _this.currentName;
							_this.updateDocMeta();
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			changeFileName() {
				let _this = this;
				Api.getFileMeta(this.docList[this.currentItemClicked].id).then(
					res => {
						if (res.data.status === 200) {
							_this.fileEditMeta = res.data.data;
							_this.fileEditMeta.title = _this.currentName;
							_this.updateFileMeta();
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			getKeyword(keyword, cb) {
				let _this = this;
				Api.Suggestions('all', this.keyword, 10).then(
					res => {
						if (res.data.status === 200) {
							// 数组清空
							let searchSuggestions = [];
							for (let i = 0; i < res.data.data.length; ++i) {
								let temp = {
									value: res.data.data[i]
								};
								searchSuggestions.push(temp);
							}
							cb(searchSuggestions);
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			turnToSearch(item) {
				this.$router.push({
					path: '/search',
					query: {
						keyword: item.value,
						resourceId: this.currentResourceId
					}
				})
			},
			turnToPast(index) {
				let temp = path[index];
				// 目录信息
				this.currentResourceId = temp.id;
				this.currentResourceName = temp.title;

				for (let i = index + 1; i < path.length; ++i) {
					this.path.pop();
				}

				this.getResources();
			},
			logout() {
				let _this = this;
				Api.Logout().then(
					res => {
						if (res.data.status === 200) {
							_this.loginData.isLogin = false;
							_this.docList.splice(0, _this.docList.length);
							_this.loginData.visible = true;
						} else {
							alert(res.data.msg);
						}
					}).catch(err => {
					console.log(err);
				});
			},
			operateGroup(command) {
				switch (command) {
					case "0":
						this.groupDrawer.addGroupVisible = true;
						break;

					case "1":
						this.isDeleteScene = !this.isDeleteScene;
						break;

					case "2":
						this.groupDrawer.newGroupVisible = true;
						break;

				}
			},
			operateGroupMeta(command) {
				switch (command) {
					case "0":
						this.groupDrawer.addUserVisible = true;
						break;

					case "1":
						this.isDeleteGroupUserScene = !this.isDeleteGroupUserScene;
						break;

					case "2":
						this.groupDrawer.groupMetaVisible = true;
						break;

				}
			},
			addGroup() {

			},
			deleteGroup() {

			},
			newGroup() {

			},
			showGroupUser() {
				this.groupDrawer.groupUserVisible = true;
			},
			deleteGroupUser(index) {
				this.groupUserList.splice(index, 1);
			}
		}
	}
</script>

<style>
	#cnt {
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
		margin: 0 auto;
	}

	.breadcrumb_route {
		font-weight: bold;
		cursor: pointer;
		margin-bottom: 10px;
		margin-left: 10px;
	}

	.breadcrumb_route :hover {
		color: rgb(64, 158, 655);
	}

	.document_card {
		width: 202.5px;
		height: 260px;
		margin-left: 10px;
		cursor: pointer;
	}

	.document_card :hover {
		border: 1px solid #f1f5fa;
		border-radius: 5px;
		background: #f1f5fa;
	}

	.item_clicked {
		border: 2px solid #90d8ff !important;
		border-radius: 5px !important;
		background: #f1f5fa !important;
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
