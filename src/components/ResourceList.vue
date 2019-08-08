<template>
  <div>
    <el-row class="list-row">
      <el-col :span="1" style="text-align: left;">
        <span>&emsp;</span>
      </el-col>
      <el-col :span="1">
        <div class="resour-image">
          <el-image
            :src="doc.thumbnail_url"
            fit="scale-down"
            alt="fileImage"
            style="width:100%;height: 100%;"
          >
            <div slot="error">
              <img src="../assets/images/imageF.svg" alt="加载失败" style="width:100%;height: 100%;" />
            </div>
          </el-image>
        </div>
      </el-col>
      <el-col :span="4" style="text-align: left;">
        <span class="resCardName" @click="edit">
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
        </span>
      </el-col>
      <!-- <el-col :span="6"  :offset='6'  style="text-align: left;">
        <span>&emsp;</span>
      </el-col> -->
      
      <el-col v-if="doc.created_time==undefined" :span="3" :offset="9" style="text-align: left;">
        <span></span>
      </el-col>
      <el-col v-if="doc.created_time!=undefined" :span="3" :offset="9"  style="text-align: left;">
        <span>{{doc.created_time.substr(0,16)}}</span>
      </el-col>

      <el-col v-if="doc.modified_time==undefined" :span="3" style="text-align: left;">
        <span></span>
      </el-col>
      <el-col v-if="doc.modified_time!=undefined" :span="3" style="text-align: left;">
        <span>{{doc.modified_time.substr(0,16)}}</span>
      </el-col>

      <el-col :span="2" style="text-align: left;">
        <span>{{formatSize(doc.size)}}</span>
      </el-col>
      <el-col :span="1" style="text-align: left;">
        <span>&emsp;</span>
      </el-col>
    </el-row>

    <div class="divider" style="margin: 0 0 5px 0;"></div>
  </div>
</template>

<script>
import * as Api from "../api/api";
import * as DEFAULT from "../json/default";
import { Message } from "element-ui";

export default {
  name: "ResourceList",
  //从doc传过来的三个值
  props: ["doc", "index", "styleCardImage"],
  data() {
    return {
      fileEditMeta: {},
      docEditMeta: {},
      primaryName: ""
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
    }
  },
  //   mounted: function() {
  //     console.log(this.doc);
  //   },
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
    },

    /**
     * 格式化文件大小, 输出成带单位的字符串
     * @param {Number} size 文件大小
     * @param {Number} [pointLength=2] 精确到的小数点数。
     * @param {Array} [units=[ 'B', 'K', 'M', 'G', 'TB' ]] 单位数组。从字节，到千字节，一直往上指定。
     *    如果单位数组里面只指定了到了K(千字节)，同时文件大小大于M, 此方法的输出将还是显示成多少K.
     */
    formatSize(size, pointLength, units) {
      // console.log(size);
      if (size == undefined) {
        return;
      }
      var unit;
      units = units || ["B", "K", "M", "G", "TB"];
      while ((unit = units.shift()) && size > 1024) {
        size = size / 1024;
      }
      return (
        (unit === "B"
          ? size
          : size.toFixed(pointLength === undefined ? 2 : pointLength)) + unit
      );
    }
  }
};
</script>

<style>
.list-row {
  height: 40px;
  width: 100%;
  padding: 10px;
  overflow: hidden;
  /* border: 1px solid rgb(255, 145, 0, 0.555) */
}
.resour-image {
  width: 30px;
  height: 30px;
}
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
  /*  margin-top: 8%; */
  /* text-align: left; */
}
.nameText {
  font-size: 14px;
}
</style>
