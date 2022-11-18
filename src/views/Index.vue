<template>
  <div class="index">
    <el-card shadow="never" class="search">
      <div class="key">
        <div class="input">
          <el-input
            placeholder="请输入标志性地名"
            size="medium"
            v-model="searchKey"
            @keyup.enter.native="searchRoutes"
            :disabled="userInfo.cityCode === ''"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              size="small"
              class="icon"
              @click="searchRoutes"
              :disabled="userInfo.cityCode === ''"
            />
          </el-input>
        </div>
        <div class="section">
          <el-form
            :model="sectionForm"
            :inline="true"
            :rules="rules"
            ref="form"
          >
            <el-form-item>
              <el-input
                v-model="sectionForm.start"
                placeholder="起始地"
                clearable
                size="small"
              />
            </el-form-item>
            <el-form-item prop="end">
              <el-input
                v-model="sectionForm.end"
                placeholder="目的地"
                clearable
                size="small"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="mini"
                :disabled="userInfo.cityCode === ''"
                @click="searchSection"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>

    <el-card shadow="never" class="routes">
      <div v-if="$route.path === '/index'">
        <el-table
          :data="searchRouteList"
          fit
          v-if="searchRouteList?.length > 0"
          border
          stripe
          :highlight-current-row="true"
        >
          <el-table-column type="index" width="50" align="center" />
          <el-table-column label="线路公交" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="medium"
                @click="$router.push('/busroute/' + scope.row.routeId)"
                >{{ scope.row.bus.busName }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="花费" align="center">
            <template v-slot="scope"> {{ scope.row.cost }}元 </template>
          </el-table-column>
          <el-table-column label="运行时间" align="center">
            <template v-slot="scope">
              <span style="color: #409eff">{{ scope.row.timeRange }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发车间隔" align="center">
            <template v-slot="scope">
              {{ scope.row.busInterval }}分钟
            </template>
          </el-table-column>
          <el-table-column label="夜间行车/环线行驶" align="center">
            <template v-slot="scope">
              <el-tooltip
                v-if="scope.row.isCircle"
                effect="light"
                content="环线"
                placement="top"
              >
                <el-image
                  :src="require('../assets/icons/circle.png')"
                  style="width: 20px; margin: 5px; cursor: pointer"
                />
              </el-tooltip>
              <el-tooltip
                v-if="scope.row.isNight"
                effect="light"
                content="夜间行车"
                placement="top"
              >
                <el-image
                  :src="require('../assets/icons/night.png')"
                  style="width: 20px; margin: 5px; cursor: pointer"
                />
              </el-tooltip>
              <span v-if="!scope.row.isNight && !scope.row.isCircle"
                >不符合</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-link
                type="primary"
                @click="$router.push('/busroute/' + scope.row.routeId)"
                >查看详情</el-link
              >
            </template>
          </el-table-column>
        </el-table>
        <el-result v-else title="暂无查询结果 快去搜索吧⭐">
          <template slot="icon">
            <el-image
              :src="require('../assets/images/bob.jpg')"
              style="overflow: hidden; border-radius: 10px; width: 40%"
            />
          </template>
        </el-result>
      </div>
      <div v-else class="routeBox">
        <router-view />
      </div>
    </el-card>

    <!-- 最新公告Dialog -->
    <el-dialog
      :visible.sync="needRead"
      width="60%"
      :close-on-click-modal="false"
      custom-class="latestNotice"
    >
      <div slot="title" class="icon_title">
        <i class="el-icon-news" />
        <span> 网站最新公告</span>
      </div>
      <div class="notice">
        <span class="title">{{ latestNotice?.title }}</span>
        <div class="ql-container ql-snow">
          <div class="ql-editor" v-html="latestNotice?.content" />
        </div>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="userView" size="small"
          >已 阅</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import "../assets/css/quill.snow.css";
export default {
  name: "Index",
  data() {
    return {
      //搜索结果列表
      searchRouteList: [],
      //搜索关键字
      searchKey: "",
      //区域搜索表单
      sectionForm: {
        start: "",
        end: "",
      },
      //区域搜索验证规则
      rules: {
        end: [
          {
            required: true,
            message: "目的地不可为空",
            trigger: "blur",
          },
        ],
      },
      //网站最新公告dialog可见性(用户是否需要阅读)
      needRead: false,
      //网站最新公告信息
      latestNotice: {},
    };
  },
  computed: {
    //当前用户对象
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    //关键词搜索
    async searchRoutes() {
      if (this.searchKey === "") return;
      const { data: searchRes } = await this.$axios.get(
        "route/search/" + this.searchKey,
        {
          params: {
            cityCode: this.userInfo?.cityCode,
          },
        }
      );
      if (searchRes.data === null || searchRes.data?.length === 0) {
        this.$message({
          message: "暂无附近站点线路信息",
          type: "warning",
          center: true,
          showClose: true,
        });
        return;
      }
      this.searchRouteList = searchRes.data;
      this.$message({
        message: "查询成功",
        type: "success",
        center: true,
        showClose: true,
      });
    },

    //区域搜素
    searchSection() {
      this.$refs.form.validate(async (valid) => {
        if (!valid) return;
        const { data: searchSectionRes } = await this.$axios.get(
          "route/search/section",
          {
            params: {
              cityCode: this.userInfo?.cityCode,
              start: this.sectionForm.start,
              end: this.sectionForm.end,
            },
          }
        );
        if (
          searchSectionRes.data === null ||
          searchSectionRes.data?.length === 0
        ) {
          this.$message({
            message: "暂无附近站点线路信息",
            type: "warning",
            center: true,
            showClose: true,
          });
          return;
        }
        this.searchRouteList = searchSectionRes.data;
        this.$message({
          message: "查询成功",
          type: "success",
          center: true,
          showClose: true,
        });
      });
    },

    //获取网站最新公告
    async getLatestNotice() {
      const { data: latestNoticeRes } = await this.$axios.get(
        "notice/info/new/" + this.userInfo.userId
      );
      if (latestNoticeRes.data) {
        this.latestNotice = latestNoticeRes.data?.latestNotice;
        this.needRead = !latestNoticeRes.data?.state;
      }
    },

    //用户阅读公告
    async userView() {
      await this.$axios.post("noticeReads/userView", {
        noticeId: this.latestNotice.noticeId,
        userId: this.userInfo.userId,
      });
      this.needRead = false;
    },
  },
  mounted() {
    this.getLatestNotice();
  },
};
</script>

<style lang="less">
.index {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  .search {
    margin: 10px 0;
    width: 100%;
    height: 25%;
    display: flex;
    flex-direction: row;
    align-items: center;
    .el-card__body {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;
      .key {
        width: 100%;
        height: 100%;
        margin: 0 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        .input {
          width: 40%;
        }
        .el-form-item {
          margin-bottom: 0px;
        }
        .el-input__inner {
          text-align: center;
        }
      }
    }
  }
  .routes {
    width: 100%;
    height: 70%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}

.latestNotice {
  border-radius: 10px !important;
  .icon_title {
    font-weight: bold;
    margin-top: 20px;
  }
  .notice {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title {
      margin-bottom: 10px;
      font-family: 楷体;
      font-size: 1.4em;
      font-weight: bolder;
    }
  }
}
</style>
