<template>
  <a-drawer title="上传文件" width="400" :closable="false" @close="close" :visible="uploadVisiable">
    <el-upload
      style="text-align: center;"
      drag
      :action="url"
      :on-success="afterUpload"
      :before-upload="beforeUpload"
      :http-request="uploadFile"
      :limit=1
    >
      <i class="el-icon-upload"></i>
      <div>
        将文件拖到此处，或
        <span class="em">点击上传</span>
      </div>
    </el-upload>
  </a-drawer>
</template>

<script>
import { mapState } from "vuex";
import * as Api from "../api/api";
import * as DEFAULT from "../json/default";


export default {
  name: "Upload",
  computed: {
    ...mapState(["uploadVisiable"])
  },
  props: ["currentResourceId"],
  data() {
    return {
      // 上传
      url: "",
      objectName: "",
      file_id: "",
      fileExtension: "",
      currentUserId: ""
    };
  },
  methods: {
   

    // 上传文件之前的钩子，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
    beforeUpload(file) {
      let _this = this;
      _this.fileExtension = file.name.split(".")[
        file.name.split(".").length - 1
      ];

      // 从服务器获取一个URL
      this.policy(file);
    },

      // 从服务器获取一个URL
    policy(file) {
      let _this = this;
      var data = JSON.stringify({
        ext: this.fileExtension,
        cur_id: this.currentResourceId
      });
      $.ajax({
        type: "post",
        // url: 'http://192.168.43.211:8089/v1/files/url',
        // url: 'http://39.108.210.48:8089/v1/files/url',
        url: Api.baseUrl + "/files/url",
        data: data,
        async: false,
        contentType: "application/json",
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        success: function(datas) {
          _this.url = datas.data.url;
          _this.currentUserId = datas.data.creator;

          let strings = _this.url.split("/");
          _this.objectName = "";
          for (var i = 4; i < strings.length - 1; i++) {
            _this.objectName += strings[i] + "/";
          }
          _this.file_id = strings[strings.length - 1].split("?")[0];
          // 存储在oss里的key
          _this.objectName += _this.file_id;
        }
      });
    },

    //覆盖默认的上传行为，可以自定义上传的实现
    uploadFile(params) {
          // console.log("uploadFile ",params);
      let file = params.file;
      let _this = this;
      let xhr = new XMLHttpRequest();
      // 监听上传进度 中间函数计算已经上传的进度 大小/总量
      //
      xhr.upload.addEventListener(
        "progress",
        function(evt) {
          var percentComplete = Math.round((evt.loaded * 100) / evt.total);
          if(percentComplete>50){
            percentComplete-=2;
          }
          params.onProgress({
            //减少1 永不显示100% 避免后端响应太慢产生100%误会 
            percent: percentComplete
          });
        },
        false
      );
      xhr.open("PUT", this.url, true);
      xhr.send(file);
      xhr.onload = () => {
        if (xhr.status == 200) {
          // console.log("uploadFile ",xhr.status);
          // 调用afterUpload
          params.onSuccess("上传成功");
        }
      };
    },
     //  文件上传成功时的钩子
    afterUpload(response, file, fileList) {
      // // console.log("afterUpload:1 ",response);
      // console.log("afterUpload:2 ",file);

      let _this = this;
      // 上传成功后更新meta
      let data = JSON.stringify({
        title: file.name.substring(0, file.name.lastIndexOf(".")),
        store_key: _this.objectName,
        doc_id: _this.currentResourceId,
        parentId: "",
        ext: _this.fileExtension,
        creator: _this.currentUserId,
        size: Math.floor(file.size.toFixed(1))
      });

      $.ajax({
        type: "post",
        // url: 'http://192.168.43.211:8089/v1/files/' + _this.file_id.substring(0, _this.file_id.lastIndexOf(".")),
        // url: 'http://39.108.210.48:8089/v1/files/' + _this.file_id.substring(0, _this.file_id.lastIndexOf(".")),
        url:
          Api.baseUrl +
          "/files/" +
          _this.file_id.substring(0, _this.file_id.lastIndexOf(".")),
        data: data,
        contentType: "application/json",
        xhrFields: {
          withCredentials: true
        },
        crossDomain: true,
        //关闭上传组件显示
        success: function(datas) {
          _this.$parent.itemDBClicked(-1);
          setTimeout(function() {
            _this.close();
          }, 500);
        }
      });
    },
    close() {
      this.$store.commit({
        type: "uploadH"
      });
    }
  }
};
</script>

<style>
.em {
  color: #409eff;
  font-style: normal;
}
</style>
