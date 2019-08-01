<template>
  <div style="padding: 24px;margin-top:120px;margin-bottom:60px" @click="stopEditName">
    <div
      style="position: fixed;top: 60px;width: 80%;background-color: white;box-shadow: 0px 5px 6px 0 rgba(0,0,0,.05);"
    >
      <div style="height: 50px;">
        <!-- 目录和文档的操作 -->
        <div style="float: left" v-if="!isCurrentFileLayout">
          <el-button icon="el-icon-tickets" @click.stop="newResource('dir')">新建目录</el-button>
          <el-button
          icon="el-icon-folder-add"
            type="primary"
            style="position: relative;"
            @click.stop="newResource('doc')"
          >新建文档</el-button>
          <el-button-group style="margin-left: 10px;" v-show="currentItemClicked > 0">
            <el-button @click.stop="callChangeName">重命名</el-button>
            <el-button @click.stop="resourceDelete">删除</el-button>
            <el-button @click.stop="openMeta">属性</el-button>
            <el-button @click.stop="callGroup">权限和群组</el-button>
          </el-button-group>
        </div>
        <!-- 文件的操作 -->
        <div style="float: left" v-if="isCurrentFileLayout">
          <el-button type="primary" style="position: relative;" @click.stop="callUpload" icon="el-icon-document-add">上传</el-button>
          <el-button-group style="margin-left: 10px;" v-show="currentItemClicked > 0">
            <el-button @click.stop="downloadFile">下载</el-button>
            <el-button @click.stop="callChangeName">重命名</el-button>
            <el-button @click.stop="deleteFile">删除</el-button>
            <el-button @click.stop="openMeta">属性</el-button>
            <el-button>历史版本</el-button>
          </el-button-group>
        </div>

        <div style="float: right;">
          <el-autocomplete
            :fetch-suggestions="getKeyword"
            @select="turnToSearch"
            @keyup.native.enter.stop="turnToSearchByKeyword"
            v-model="keyword"
            placeholder="搜索你的资源"
          >
            <el-button type="primary" @click.stop="turnToSearchByKeyword" slot="append">搜索</el-button>
          </el-autocomplete>
        </div>
      </div>
      <!-- 显示面包屑（路径） -->
      <div style="height: 40px;">
        <el-breadcrumb
          separator-class="el-icon-arrow-right"
          class="breadcrumb_route"
          style="float: left; "
        >
          <el-breadcrumb-item
            v-for="(document, index) in path"
            :key="index"
            @click.native.stop="turnToPast(index)"
          >{{document.title}}</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 刷新按钮 -->
        <div style="float: right;">
          <el-button
            style="font-size: 16px;"
            size="mini"
            type="success"
            icon="el-icon-refresh"
            @click="refreshResource"
            round
          >刷新</el-button>
        </div>

        <!-- 图标大小 -->
        <div style="float: right;  margin-right:2%">
          <el-dropdown @command="chooseSize">
            <el-button size="mini">
              图标大小
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="small">小图标</el-dropdown-item>
              <el-dropdown-item command="medium">中图标</el-dropdown-item>
              <el-dropdown-item command="big">大图标</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>

        <!-- 排列方式 -->
            <div style="float: right;  margin-right:2%">
          <el-dropdown>
            <el-button size="mini">
              排列方式
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item disabled>修改日期</el-dropdown-item>
              <el-dropdown-item disabled>名字</el-dropdown-item>
              <el-dropdown-item disabled>默认</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
    <div class="light_divider"></div>
    <!-- 显示目录和文档 -->
    <div
      v-loading="cardLoading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="加载中 请稍后"
      style="display: flex; justify-content: flex-start; margin: 10px 0; flex-wrap: wrap;"
    >
      <resource-card
        v-for="(doc, index) in docList"
        :key="index"
        shadow="always"
        @click.native.stop="clickReady && itemClicked(index)"
        @dblclick.native.stop="clickReady && itemDBClicked(index)"
        class="document_card"
        :class="{'item_clicked': currentItemClicked === index, 'dc': !doc.isEditStatus}"
        :doc="doc"
        :index="index"
        :styleCardImage="styleCardImages"
        :style="styleObject"
      ></resource-card>
    </div>

    <!-- 查看群组 -->
    <group-and-permission></group-and-permission>

    <!-- 文档meta -->
    <doc-meta :clickedItemId="currentItemClicked > 0 ? docList[currentItemClicked].id: ''"></doc-meta>

    <!-- 文件meta -->
    <file-meta :clickedItemId="currentItemClicked > 0 ? docList[currentItemClicked].id: ''"></file-meta>

    <!-- 目录meta -->
    <dir-meta :dirMeta="currentItemClicked > 0 ? docList[currentItemClicked]: dirMetaInit"></dir-meta>

    <!-- 文件历史版本 暂不做-->

    <!-- 文件上传 -->
    <upload :currentResourceId="currentResource.id"></upload>
  </div>
</template>

<script>
import * as Api from "../api/api";
import * as Download from "../util/download";

import { mapState } from "vuex";
import ResourceCard from "../components/ResourceCard.vue";
import GroupNPermission from "../components/GroupNPermission.vue";
import DocMeta from "../components/DocMeta.vue";
import DirMeta from "../components/DirMeta.vue";
import FileMeta from "../components/FileMeta.vue";
import Upload from "../components/upload.vue";
import * as DEFAULT from "../json/default";
import { Message, Loading } from "element-ui";

// click dblclick 冲突计时器
var time = null;

export default {
  name: "Doc",
  data() {
    return {
      // 中部
      // 搜索
      keyword: "",
      // 当前路径
      path: [],

      // 下部
      // 点击交互
      currentItemClicked: -1,
      // 点击限制 防止后端响应太慢 出现返回数据的顺序错误
      // 但是这个会导致 后端响应慢时 其一直为真假 用户体验很差
      // 目前注释掉赋值为假语句 使其一直为真
      clickReady: true,

      // 当前目录信息
      docList: DEFAULT.docs,
      currentResource: DEFAULT.defaultResource,
      isCurrentFileLayout: false,

      // 登陆信息
      currentUserId: "",

      // 外部
      dirMetaInit: DEFAULT.dirMetaI,
      // 文件下载
      downloadUrl: "",
      downloadName: "",
      //文件点击后的loading动画
      cardLoading: false,

      // 设置图标大小的
      cardSize: "",
      styleCardImages: {
        width: "150px",
        height: "150px"
      },
      styleObject: {
        width: "151px",
        height: "195px"
      }
    };
  },
  computed: {
    ...mapState(["pathBackup", "currentResourceBackup"])
  },
  //用的自定义组件
  components: {
    "resource-card": ResourceCard,
    "group-and-permission": GroupNPermission,
    "doc-meta": DocMeta,
    "dir-meta": DirMeta,
    "file-meta": FileMeta,
    upload: Upload
  },
  created: function() {
    let _this = this;
    this.$root.eventHub.$on("login", () => {
      this.currentResource.id = this.currentResourceBackup.id;
      this.path = this.pathBackup;
      this.itemDBClicked(-1);
    });
  },
  mounted: function() {
    // console.log("mounted: ",this.$store.state.idOfThePathJust)
    // console.log("mounted: ",this.$store.state.typeOfThePathJust)

    if (
      this.currentResourceBackup != null &&
      this.$store.state.idOfThePathJust != null
    ) {
      //设置 当前页面资源的id 用vuex可以避免初始化问题
      this.currentResource.id = this.$store.state.idOfThePathJust;
      this.currentResource.type = this.$store.state.typeOfThePathJust;
    }
    if (this.currentResource.id != null) {
      this.path = this.pathBackup;
      this.itemDBClicked(-1);
      // this.refreshResource();
    }
  },

  methods: {
    itemClicked(i) {
      clearTimeout(time); //首先清除计时器
      time = setTimeout(() => {
        console.log("单击 " + i);
        if (i != this.currentItemClicked) {
          this.currentItemClicked = i;
        } else {
          this.currentItemClicked = -1;
        }
      }, 300); //大概时间300ms
    },
    itemDBClicked(index) {
      if (index > 0 && this.isCurrentFileLayout) {
        // console.log(index, "  ", this.docList[index].id);

        window.open(
          "http://" +
            window.location.host +
            window.location.pathname +
            "singleFile.html#/?fileId=" +
            this.docList[index].id
        );
        return;
      }
      clearTimeout(time); //清除
      console.log("双击", index);
      // this.clickReady = false;
      this.currentItemClicked = index;

      // 根据id刷新当前目录
      if (index == -1) this.refreshResource();
      // 返回上一级目录
      else if (this.path.length != 1 && index == 0) this.backToUpper();
      // 打开点击的目录
      else this.goToNext();
    },
    refreshResource() {
      // console.log("refreshResource");
      // 渲染图标card大小
      this.chooseSize(this.$store.state.whatSizeCard);
      // console.log(this.$store.state.whatSizeCard);
      this.cardLoading = true;

      // console.log("refreshResource", this.currentResource.id);

      let _this = this;
      Api.getResources(this.currentResource.type, this.currentResource.id)
        .then(res => {
          if (res.data.status === 200) {
            if (res.data.data == null) res.data.data = [];
            // 更新当前目录状态 （不需要更新

            // 更新资源列表
            _this.docList.splice(0, _this.docList.length);

            // 返回上一级入口
            // 根目录没有返回
            if (_this.path.length > 1) {
              _this.docList.push({
                title: "返回",
                thumbnail_url: require("../assets/images/back.png"),
                type: "dir",
                id: _this.path[_this.path.length - 2].id,
                isEditStatus: false
              });
            }

            // 处理结果(统一部分)
            _this.handleResource(res);
          } else {
            _this.handleError(err);
            Message.warning(res.data.status);
          }
        })
        .catch(err => {
          // _this.handleError(err);
          Message.error("刷新失败 " + err.response.status);
        });
    },

    backToUpper() {
      // console.log("backToUpper()", this.docList[this.currentItemClicked].id);
      let _this = this;
      //加载动画
      this.cardLoading = true;

      Api.getResources(
        this.docList[this.currentItemClicked].type,
        this.docList[this.currentItemClicked].id
      )
        .then(res => {
          if (res.data.status === 200) {
            if (res.data.data == null) res.data.data = [];
            // 更新当前目录状态
            _this.isCurrentFileLayout = false;
            _this.currentResource = this.docList[this.currentItemClicked];

            // 更新路径
            _this.path.pop();

            //更新 这个很low的id 用于 从其他页面返回后 还能到达跳转到之前的界面
            this.$store.commit(
              "setIdOfThePathJust",
              this.docList[this.currentItemClicked].id
            );
            this.$store.commit(
              "setTypeOfThePathJust",
              this.docList[this.currentItemClicked].type
            );

            // 更新资源列表
            _this.docList.splice(0, _this.docList.length);

            // 返回上一级入口
            // 根目录没有返回
            if (_this.path.length > 1) {
              _this.docList.push({
                title: "返回",
                thumbnail_url: require("../assets/images/back.png"),
                type: "dir",
                id: _this.path[_this.path.length - 2].id,
                isEditStatus: false
              });
            }
            // 处理结果(统一部分)
            _this.handleResource(res);
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          // _this.handleError(err);
          Message.error("操作失败 请先登陆或刷新");
        });
    },
    goToNext() {
      let _this = this;
      this.cardLoading = true;

      // console.log("goToNext", this.docList[this.currentItemClicked].id);
      Api.getResources(
        this.docList[this.currentItemClicked].type,
        this.docList[this.currentItemClicked].id
      )
        .then(res => {
          if (res.data.status === 200) {
            if (res.data.data == null) res.data.data = [];
            let parent_id = _this.currentResource.id;
            // 更新当前目录状态
            _this.isCurrentFileLayout =
              _this.docList[_this.currentItemClicked].type == "doc";
            _this.currentResource = this.docList[this.currentItemClicked];

            //更新 这个很low的id 用于 从其他页面返回后 还能到达跳转到之前的界面
            this.$store.commit(
              "setIdOfThePathJust",
              this.docList[this.currentItemClicked].id
            );
            this.$store.commit(
              "setTypeOfThePathJust",
              this.docList[this.currentItemClicked].type
            );

            // 更新路径
            _this.path.push(_this.docList[_this.currentItemClicked]);

            // 更新资源列表
            _this.docList.splice(0, _this.docList.length);

            // 返回上一级入口
            // 根目录没有返回
            _this.docList.push({
              title: "返回",
              thumbnail_url: require("../assets/images/back.png"),
              type: "dir",
              id: parent_id,
              isEditStatus: false
            });

            // 处理结果(统一部分)
            _this.handleResource(res);
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          if (err.response.status == 403) {
            Message.error("您没有权限 无法打开 ");
            this.cardLoading = false;
          } else {
            // console.log("goToNext")
            Message.error("操作失败 请先登陆或刷新");
            // _this.handleError(err);
          }
        });
    },

    //分配图片的函数
    handleResource(res) {
      // console.log(res.data.data);
      for (let i = 0; i < res.data.data.length; ++i) {
        // console.log(i,res.data.data[i].thumbnail_url);

        if (res.data.data[i].thumbnail == "./assets/images/docCnt.png")
          res.data.data[
            i
          ].thumbnail_url = require("../assets/images/docCnt.png");
        if (res.data.data[i].thumbnail == "./assets/images/doc.png")
          res.data.data[i].thumbnail_url = require("../assets/images/doc.png");
        if (res.data.data[i].thumbnail_url == null) {
          Message.warning("缩略图生成中");
          res.data.data[i].thumbnail_url = require("../assets/images/file.png");
        }
        if (res.data.data[i].thumbnail_url == "default") {
          res.data.data[i].thumbnail_url = require("../assets/images/file.png");
        }
        res.data.data[i].isEditStatus = false;
      }

      this.docList = this.docList.concat(res.data.data);

      //结束loading动画
      this.cardLoading = false;
      // 初始化点击
      this.currentItemClicked = -1;
      this.clickReady = true;

      // console.log(this.docList);
      // this.chooseSize(this.cardSize);
    },
    downloadFile() {
      let _this = this;
      Api.Download(this.docList[this.currentItemClicked].id)
        .then(res => {
          if (res.data.status === 200) {
            let notify = _this.$notify({
              title: "后台下载",
              message: "文件后台下载中，下载时间受网络影响，请耐心等候",
              type: "info",
              duration: 0
            });

            Download.download(
              res.data.data.url,
              _this.docList[_this.currentItemClicked].title +
                "." +
                _this.docList[_this.currentItemClicked].ext,
              () => {
                notify.close();

                setTimeout(function() {
                  _this.$notify({
                    title: "下载",
                    message: "文件下载完成",
                    type: "success"
                  });
                }, 500);
              }
            );
          }
        })
        .catch(err => {
          console.log("downloadFile");

          _this.handleError(err);
        });
    },
    // 打开各种meta信息
    openMeta() {
      // console.log(this.docList[this.currentItemClicked]);
      //docList里面 没有了resource_type 只有type
      if (this.isCurrentFileLayout) {
        this.$store.commit("fileMetaV");
      } else if (this.docList[this.currentItemClicked].type == "dir") {
        this.$store.commit("dirMetaV");
      } else {
        this.$store.commit("docMetaV");
      }
    },
    newResource(type) {
      let _this = this;
      Api.newResource(type, this.currentResource.id)
        .then(res => {
          if (res.data.status === 200) {
            let temp = res.data.data;
            let image;
            if (type == "doc") image = require("../assets/images/doc.png");
            if (type == "dir") image = require("../assets/images/docCnt.png");
            _this.docList.push({
              created_time: temp.created_at,
              thumbnail_url: image,
              creator: temp.creator_id,
              resource_type: temp.resource_type,
              id: temp.resource_id,
              title: temp.resource_name
            });
            Message.success("新建成功");
            //刷新资源界面
            _this.refreshResource();
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          // console.log("newResource");

          _this.handleError(err);
        });
    },
    resourceDelete() {
      let _this = this;
      this.$alert("此操作将永久删除该资源, 是否继续?", "删除资源", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // callback: (action, instance) => {
          Api.deleteResource(
            _this.docList[_this.currentItemClicked].type,
            _this.docList[_this.currentItemClicked].id
          ).then(res => {
            if (res.data.status === 200) {
              _this.docList.splice(_this.currentItemClicked, 1);
              _this.currentItemClicked = -1;
              //   console.log("删除成功");
              Message.success("删除成功");
            } else {
              // Message.error(res.data.msg);
              Message.warning("删除失败 后台无法连接");
              //   console.log(4);
            }
          });
          // .catch(err => {
          //   _this.handleError(err);
          // 	console.log(5);

          // });
          // }
        })
        .catch(() => {
          Message.warning("取消删除");
        });
    },
    deleteFile() {
      let _this = this;
      this.$alert("此操作将永久删除该资源, 是否继续?", "删除资源", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // callback: (action, instance) => {
          Api.deleteFile(_this.docList[_this.currentItemClicked].id).then(
            res => {
              if (res.data.status === 200) {
                _this.docList.splice(_this.currentItemClicked, 1);
                Message.success("删除成功");
              } else {
                Message.warning("删除失败 后台无法连接");
              }
            }
          );
          // .catch(err => {
          //   _this.handleError(err);
          // });
          // }
        })
        .catch(() => {
          Message.warning("取消删除");
        });
    },
    getKeyword(keyword, cb) {
      let _this = this;
      Api.Suggestions("all", this.keyword, 10)
        .then(res => {
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
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          console.log("getKeyword");

          _this.handleError(err);
        });
    },
    turnToSearch(item) {
      this.$router.push({
        path: "/search",
        query: {
          keyword: item.value,
          resourceId: this.currentResource.id
        }
      });
    },
    turnToSearchByKeyword() {
      this.$router.push({
        path: "/search",
        query: {
          keyword: this.keyword,
          resourceId: this.currentResource.id
        }
      });
    },
    turnToPast(index) {
      //如果是路径的最后一个  啥也不动
      if (index == this.path.length - 1) return;
      let temp = this.path[index];
      // 目录信息
      this.currentResource.id = temp.id;
      this.currentResource.title = temp.title;
      this.currentResource.type = "dir";
      // this.currentResource.type = this.$store.state.typeOfThePathJust;

      let length = this.path.length;
      for (let i = index + 1; i < length; ++i) {
        this.path.pop();
      }

      this.itemDBClicked(-1);
    },
    callGroup() {
      this.$store.commit({
        type: "groupV"
      });
    },
    callChangeName() {
      console.log("callChangeName");
      if (this.currentItemClicked != -1)
        this.docList[this.currentItemClicked].isEditStatus = true;
    },
    stopEditName() {
      this.stopEditNameByIndex(this.currentItemClicked);
    },
    stopEditNameByIndex(index) {
      console.log("stopEditName");
      if (index != -1) this.docList[index].isEditStatus = false;
    },
    isIndexClicked(index) {
      return index == this.currentItemClicked;
    },
    callUpload() {
      this.$store.commit("uploadV");
    },
    handleError(err) {
      console.log(err);
      Message.warning(DEFAULT.defaultNetwordError);
    },

    chooseSize(command) {
      this.$store.commit("setwhatSizeCard", command);
      // this.cardSize = command;
      if (command === "small") {
        this.styleObject.width = "101px";
        this.styleObject.height = "140px";
        this.styleCardImages.width = "101px";
        this.styleCardImages.height = "101px";
      } else if (command === "medium") {
        this.styleObject.width = "151px";
        this.styleObject.height = "195px";
        this.styleCardImages.width = "150px";
        this.styleCardImages.height = "150px";
      } else if (command === "big") {
        this.styleObject.width = "202.5px";
        this.styleObject.height = "260px";
        this.styleCardImages.width = "202px";
        this.styleCardImages.height = "202px";
      }
    }
  }
};
</script>

<style>
.divider {
  background-color: #dcdfe6;
  /* position: relative; */
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
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}

.sidebar {
  padding: 15px;
  margin: 20px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
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
/* 卡片 */
.document_card {
  width: 150px;
  height: 195px;
  max-height: 260px;
  margin-right: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

.dc :hover {
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
