<template>
  <div class="index">
    <el-card shadow="never" class="search">
      <div class="key">
        <div class="input">
          <el-input
            placeholder="请输入内容"
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
          <el-form :model="sectionForm" :inline="true">
            <el-form-item>
              <el-input
                v-model="sectionForm.start"
                placeholder="起始地"
                size="small"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="sectionForm.end"
                placeholder="目的地"
                size="small"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini">查询</el-button>
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
          v-if="searchRouteList.length > 0"
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
        </el-table>
        <el-result v-else title="暂无查询结果🥶">
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
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      searchRouteList: [],
      searchKey: "",
      sectionForm: {
        start: "",
        end: "",
      },
    };
  },
  computed: {
    //当前用户对象
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    async searchRoutes() {
      const { data: searchRes } = await this.$axios.get(
        "route/search/" + this.searchKey,
        {
          params: {
            cityCode: this.userInfo?.cityCode,
          },
        }
      );
      this.searchRouteList = searchRes.data;
      console.log(searchRes);
    },
  },
  mounted() {},
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
</style>
