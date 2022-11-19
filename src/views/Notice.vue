<template>
  <el-card shadow="never">
    <div slot="header" class="cardHeader">
      <el-page-header @back="$router.back()" content="公告记录" />
      <el-button
        type="primary"
        size="mini"
        @click="viewAll"
        :disabled="viewAllBtn"
        >全部已读</el-button
      >
    </div>
    <div class="noticeList">
      <el-collapse accordion>
        <el-collapse-item
          :name="notice.info?.noticeId"
          v-for="(notice, index) in noticeList"
          :key="notice.info?.noticeId"
          class="notice"
        >
          <template slot="title">
            <div
              :class="{
                collapseHaeder_unRead: !notice.state,
                collapseHaeder_read: notice.state,
              }"
            >
              <span>{{ index + 1 }}. {{ notice.info?.title }}</span>
              <span v-if="notice.state">已读</span>
              <span>{{ notice.info?.updateTime | dateFormat }}</span>
            </div>
          </template>
          <div class="content">
            <div class="title">
              <span> {{ notice.info?.title }}</span>
              <el-button
                v-if="!notice.state"
                type="primary"
                size="mini"
                @click="userView(notice)"
                >已 阅</el-button
              >
            </div>
            <div class="ql-container ql-snow preview">
              <div class="ql-editor" v-html="notice.info?.content" />
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </el-card>
</template>

<script>
import "../assets/css/quill.snow.css";
export default {
  name: "Notice",
  data() {
    return {
      //公告记录列表
      noticeList: [],
      //全部已读是否可用
      viewAllBtn: true,
    };
  },
  computed: {
    //当前用户对象
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    //获得已发布且与用户有关的网站公告
    async getNoticePublishedByUserId() {
      const { data: noticeListRes } = await this.$axios.get(
        "notice/list/published/" + this.userInfo.userId
      );
      if (noticeListRes.code === 200) {
        this.noticeList = noticeListRes.data;
        for (let i = 0; i < noticeListRes.data?.length; i++) {
          if (!noticeListRes.data[i].state) this.viewAllBtn = false;
        }
      }
    },

    //用户阅读公告
    async userView(notice) {
      await this.$axios.post("noticeReads/userView", {
        noticeId: notice.info.noticeId,
        userId: this.userInfo.userId,
      });
      notice.state = true;
    },

    //全部已读
    async viewAll() {
      const { data: viewAllRes } = await this.$axios.put(
        "noticeReads/userViewAll/" + this.userInfo.userId
      );
      this.getNoticePublishedByUserId();
      this.$message({
        message: viewAllRes.msg,
        type: `${viewAllRes.code !== 200 ? "error" : "success"}`,
        center: true,
        showClose: true,
      });
    },
  },
  mounted() {
    this.getNoticePublishedByUserId();
  },
};
</script>

<style lang="less">
.noticeList {
  .el-collapse-item__header {
    height: 80px;
    .collapseHaeder_unRead {
      color: #409eff;
      width: 100%;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 1.2em;
    }
    .collapseHaeder_read {
      color: #909399;
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
</style>
