<template>
  <div class="header">
    <div class="logo">
      <el-tooltip effect="light" content="不许点我!🥶" :enterable="false">
        <img
          src="../assets/icons/buswebicon.png"
          width="40px"
          @click="$router.push('/home')"
          style="cursor: pointer"
        />
      </el-tooltip>
      <span class="title">公交线路查询系统</span>
      <div class="operation">
        <el-tooltip
          v-if="$route.path !== '/index'"
          effect="light"
          content="主页"
          placement="top"
        >
          <el-button
            circle
            icon="el-icon-house"
            size="mini"
            @click="$router.push('/index')"
          />
        </el-tooltip>
        <el-tooltip v-if="$route.path !== '/issue'" effect="light" content="客服" placement="top">
          <el-button
            circle
            icon="el-icon-s-opportunity"
            size="mini"
            @click="$router.push('/issue')"
          />
        </el-tooltip>
      </div>
    </div>
    <div></div>
    <div class="userbox">
      <div class="city">
        <span v-if="userInfo.cityCode !== ''"
          >当前所在城市: {{ userInfo.cityCode | cityFormat }}</span
        >
        <el-tooltip
          v-if="userInfo.cityCode === '' && $route.path !== '/profile'"
          effect="light"
          content="点击前往更新"
          placement="top"
        >
          <el-link type="primary" @click="$router.push('/profile')">
            请在个人信息页面更新您的位置信息
          </el-link>
        </el-tooltip>
      </div>
      <div class="user">
        <span>{{ userInfo.nickname }}</span>

        <el-dropdown>
          <el-badge
            :is-dot="userUnreadNoticeCount > 0 || userUnCopeIssueCount > 0"
            type="danger"
          >
            <el-avatar size="medium" style="cursor: pointer">
              <el-image
                :src="
                  userInfo.avatarFile
                    ? userInfo.avatarFile?.fileUrl
                    : require('../assets/icons/man.png')
                "
              />
            </el-avatar>
          </el-badge>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="!$route.path.includes('/profile')">
              <span @click="$router.push('/profile')">个人信息</span>
            </el-dropdown-item>
            <el-dropdown-item v-if="$route.path !== '/index'">
              <span @click="$router.push('/index')">返回主页</span>
            </el-dropdown-item>
            <el-dropdown-item v-if="$route.path !== '/issue'">
              <span @click="$router.push('/issue')">我的留言</span>
              <el-badge
                :value="userUnCopeIssueCount"
                :hidden="userUnCopeIssueCount === 0"
                type="primary"
                :max="10"
              />
            </el-dropdown-item>
            <el-dropdown-item v-if="$route.path !== '/notice'">
              <span @click="$router.push('/notice')">网站公告</span>
              <el-badge
                :value="userUnreadNoticeCount"
                :hidden="userUnreadNoticeCount === 0"
                type="primary"
                :max="10"
              />
            </el-dropdown-item>
            <el-dropdown-item>
              <span @click="logout">退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      //当前用户对象
      userInfo: {},
      //用户未读公告数目
      userUnreadNoticeCount: 0,
      //用户未处理留言数目
      userUnCopeIssueCount: 0,
    };
  },
  methods: {
    //获取当前登录的用户信息
    async getUserInfoByToken() {
      const token = JSON.parse(window.sessionStorage.getItem("user_token"));
      const { data: userInfoRes } = await this.$axios.get(
        "user/info/token/" + token
      );
      this.userInfo = userInfoRes.data;
      this.$store.commit("setUserInfo", userInfoRes.data);
      this.getUserUnreadNoticeCount();
      this.getUserUnCopeIssueCount();
    },

    //获取用户未读的公告数目
    async getUserUnreadNoticeCount() {
      const { data: userUnreadNoticeCountRes } = await this.$axios.get(
        "noticeReads/user/UnreadCount/" + this.userInfo?.userId
      );
      this.userUnreadNoticeCount = parseInt(userUnreadNoticeCountRes.data);
    },

    //获取用户未处理完的留言数目
    async getUserUnCopeIssueCount() {
      const { data: userUnCopeIssueCountRes } = await this.$axios.get(
        "issue/user/UnCope/" + this.userInfo?.userId
      );
      this.userUnCopeIssueCount = parseInt(userUnCopeIssueCountRes.data);
    },

    //退出登录
    logout() {
      window.sessionStorage.removeItem("user_token");
      this.$cookies.remove("user_token");
      this.$router.push("/login");
      this.$message({
        message: "已退出登录",
        type: "success",
        center: true,
        showClose: true,
      });
    },
  },
  mounted() {
    this.getUserInfoByToken();
  },
};
</script>

<style lang="less">
.header {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  .logo {
    min-width: 300px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .title {
      margin-left: 10px;
      font-weight: bold;
    }
  }
  .userbox {
    min-width: 400px;
    width: 30%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .city {
      font-size: 0.7em;
    }
    .user {
      width: 25%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .operation {
    margin-left: 40px;
    .el-button {
      background-color: transparent;
    }
  }
}
</style>
