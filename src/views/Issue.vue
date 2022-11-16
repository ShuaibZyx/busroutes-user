<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="我的留言" />
      <el-button type="primary" size="mini" @click="addIssueVisiable = true"
        >发起</el-button
      >
    </div>
    <div class="issue">
      <el-collapse accordion>
        <el-collapse-item
          :name="issue.issueId"
          v-for="(issue, index) in issueList"
          :key="issue.issueId"
          class="item"
        >
          <template slot="title">
            <div class="collapseHaeder">
              <span>
                <i
                  v-if="issue.state === 0"
                  class="el-icon-question"
                  style="font-size: 1.2em"
                />
                <i
                  v-else-if="issue.state === 1"
                  class="el-icon-s-comment"
                  style="color: #409eff; font-size: 1.2em"
                />
                <i
                  v-else
                  class="el-icon-success"
                  style="color: green; font-size: 1.2em"
                />
                {{ index + 1 }}. {{ issue.title }}</span
              >
              <span>{{ issue.createTime | dateFormat }}</span>
            </div>
          </template>
          <div class="content">
            <div class="title">
              <span style="font-size: 1em">留言内容:</span>
              <i
                v-if="issue.state === 0"
                class="el-icon-question"
                style="font-size: 1.2em"
              >
                等待处理</i
              >
              <i
                v-else-if="issue.state === 2"
                class="el-icon-success"
                style="color: green; font-size: 1.2em"
              >
                已完成
              </i>
              <el-button
                v-else
                type="primary"
                size="mini"
                icon="el-icon-s-comment"
                @click="$router.push('/message/' + issue.issueId)"
                >咨询客服</el-button
              >
            </div>
            <div class="ql-container ql-snow preview">
              <div class="ql-editor" v-html="issue.description" />
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 发起留言对话框 -->
    <el-dialog
      :visible.sync="addIssueVisiable"
      width="60%"
      :close-on-click-modal="false"
      @close="resetAddIssueForm"
      custom-class="addIssueDialog"
    >
      <div slot="title" class="icon_title">
        <i class="el-icon-plus" />
        <span> 发起留言</span>
      </div>
      <el-form
        :model="addIssueForm"
        label-width="auto"
        ref="addIssueFormRef"
        :rules="addIssueFormRules"
      >
        <el-form-item label="标题:" prop="title">
          <el-input
            v-model="addIssueForm.title"
            size="small"
            minlength="2"
            maxlength="100"
            clearable
            placeholder="标题"
          />
        </el-form-item>
        <el-form-item label="描述:">
          <vue-editor
            v-model="addIssueForm.description"
            :editorToolbar="customToolbar"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addIssueVisiable = false" size="small"
          >取 消</el-button
        >
        <el-button type="primary" @click="addIssue" size="small"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { VueEditor } from "vue2-editor";
import "../assets/css/quill.snow.css";
export default {
  name: "Issue",
  components: {
    VueEditor,
  },
  data() {
    return {
      //富文本编辑器配置项
      customToolbar: [
        [{ header: [false, 1, 2, 3, 4, 5, 6] }], //标题
        ["bold", "italic", "underline"], //加粗\斜体\下划线
        ["italic"], //斜体----也可以拆开来写，用于换位置顺序
        [{ align: "" }, { align: "center" }, { align: "right" }], //对齐
        [{ indent: "-1" }, { indent: "+1" }],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }], //有序无序列表
        [{ background: [] }, { color: [] }], //背景色
        ["image", "link"], //图片、链接
        ["strike"], //作废（文字中间一横）
        ["underline"],
        ["clean"], //清楚格式（所谓去掉背景色这些花里胡巧）
        ["code"], //代码
        ["code-block"], //代码块
        ["video"], //视频
        [{ size: ["small", false, "large", "huge"] }], //文字大小
      ],
      //当前用户发起的留言列表
      issueList: [],
      //创建留言对话框可见性
      addIssueVisiable: false,
      //创建留言所用表单
      addIssueForm: {
        createrId: "",
        title: "",
        description: "",
      },
      //创建留言表单验证
      addIssueFormRules: {
        title: [
          {
            required: true,
            message: "留言标题不可为空",
            trigger: "blur",
          },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    async getUserIssueById() {
      const { data: issueListRes } = await this.$axios.get(
        "issue/list/user/" + this.userInfo.userId
      );
      this.issueList = issueListRes.data;
    },

    //发表留言
    addIssue() {
      this.$refs.addIssueFormRef.validate(async (valid) => {
        if (!valid) return;
        this.addIssueForm.createrId = this.userInfo.userId;
        const { data: addIssueRes } = await this.$axios.post(
          "issue/create",
          this.addIssueForm
        );
        this.getUserIssueById();
        this.addIssueVisiable = false;
        this.$message({
          message: addIssueRes.msg,
          type: `${addIssueRes.code !== 200 ? "error" : "success"}`,
          center: true,
          showClose: true,
        });
      });
    },

    resetAddIssueForm() {
      this.$refs.addIssueFormRef.resetFields();
      Object.keys(this.addIssueForm).forEach(
        (key) => (this.addIssueForm[key] = "")
      );
    },
  },
  mounted() {
    this.getUserIssueById();
  },
};
</script>

<style lang="less">
.issue {
  .el-collapse-item__header {
    height: 80px;
    .collapseHaeder {
      width: 100%;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.2em;
    }
  }
  .el-collapse-item__content {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content {
    padding: 0 15px;
    width: 100%;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .preview {
      margin-top: 15px;
      width: 100%;
    }
    .title {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}

.addIssueDialog {
  border-radius: 10px !important;
  .icon_title {
    font-weight: bold;
    margin-top: 20px;
  }
}
</style>
