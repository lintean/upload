<template>
  <el-card :body-style="{ padding: '0px'}">
    <div class="cardImage"
    :style="styleCardImage"
    >
      <el-image
        :src="doc.thumbnail_url"
        fit="scale-down"
        alt="fileImage"
        style="width:100%;height: 100%;"
      >
      <!-- <div slot="error" class="image-slot">
        <i class="el-icon-picture-outline">加载失败 无法打开缩略图</i>
      </div> -->
      </el-image>
    </div>
    <div class="divider" style="margin: 0 0 5px 0;"></div>

    <div class="resCardName" @click="edit">
      <span
        class="nameText"
        v-show="!doc.isEditStatus"
      >{{doc.ext != null? doc.title + '.' + doc.ext: doc.title}}</span>
      <el-input
        ref="changeName"
        v-show="doc.isEditStatus"
        class="changeName"
        size="medium"
        v-model="doc.title"
        @keyup.enter.native.stop="enter"
        @blur.stop="changeName"
        @click.native.stop="getFocus"
      ></el-input>
    </div>
  </el-card>
</template>

<script>
import * as Api from "../api/api";
import * as DEFAULT from "../json/default";
import { Message } from "element-ui";

export default {
  name: "ResourceCard",
  //从doc传过来的三个值
  props: ["doc", "index","styleCardImage"],
  data() {
    return {
      fileEditMeta: {},
      docEditMeta: {},
      primaryName: "",
    };
  },
  watch: {
    editStatus(newOne, oldOne) {
      if (newOne) {
        let _this = this;
        setTimeout(function() {
          _this.$refs.changeName.focus();
          _this.primaryName = _this.doc.title;
        }, 1);
      }
    },
  },
  computed: {
    editStatus() {
      return this.doc.isEditStatus;
    }
  },
  methods: {
    edit() {
      if (!this.doc.isEditStatus && this.$parent.isIndexClicked(this.index)) {
        this.$parent.callChangeName();
      }
    },
    getFocus() {},
    enter() {
      this.$refs.changeName.blur();
    },
    //判断 改名对象
    changeName() {
      if (this.doc.type == "doc") {
        this.changeDocName();
      } else if (this.doc.type == "dir") {
        this.editResources();
      } else {
        this.changeFileName();
      }
    },

    editResources() {
      let _this = this;
      Api.editDirMeta(this.doc.id, this.doc.title)
        .then(res => {
          if (res.data.status === 200) {
            _this.changeSuccess();
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.changeError(err);
        });
    },
    changeDocName() {
      let _this = this;
      Api.getDocMeta(this.doc.id)
        .then(res => {
          if (res.data.status === 200) {
            _this.docEditMeta = res.data.data;
            _this.docEditMeta.title = _this.doc.title;
            _this.updateDocMeta();
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.changeError(err);
        });
    },
    changeFileName() {
      let _this = this;
      Api.getFileMeta(this.doc.id)
        .then(res => {
          if (res.data.status === 200) {
            _this.fileEditMeta = res.data.data;
            _this.fileEditMeta.title = _this.doc.title;
            _this.updateFileMeta();
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.changeError(err);
        });
    },
    updateFileMeta() {
      let _this = this;
      let temp = this.fileEditMeta;
      Api.editFileMeta(
        temp.id,
        temp.title,
        temp.desc,
        temp.categories,
        temp.tags
      )
        .then(res => {
          if (res.data.status === 200) {
            _this.changeSuccess();
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.changeError(err);
        });
    },
    updateDocMeta() {
      let _this = this;
      Api.editDocMeta(
        this.doc.id,
        this.docEditMeta.title,
        this.docEditMeta.desc
      )
        .then(res => {
          if (res.data.status === 200) {
            _this.changeSuccess();
          } else {
            Message.error(res.data.msg);
          }
        })
        .catch(err => {
          _this.changeError(err);
        });
    },
    changeSuccess() {
      Message.success("改名成功");
      this.$parent.stopEditNameByIndex(this.index);
    },
    changeError(err) {
      console.log(err);
      Message.error("改名失败 " + err.response.status);
      this.$parent.stopEditNameByIndex(this.index);
    }
  }
};
</script>

<style>
.changeName {
  width: 80%;
}
.cardImage {
  width: 150px;
  height: 150px;
  display: block;
  margin: 0 auto;
}
.resCardName {
  /* border: 1px solid rgb(76, 0, 255); */
  margin-top: 8%;
  text-align: center;
}
.nameText {
  font-size: 14px;
}
</style>
