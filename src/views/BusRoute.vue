<template>
  <el-card shadow="never" class="card">
    <!-- 线路信息展示框 -->
    <div class="routeInfo">
      <el-descriptions :column="3" title="线路详情" :colon="false">
        <template slot="extra">
          <el-button type="text" size="medium" @click="$router.back()"
            >返回</el-button
          >
        </template>
        <el-descriptions-item label="线路公交:">
          {{ route.bus?.busName }}({{ route.bus?.type | busTypeFormat }})
        </el-descriptions-item>
        <el-descriptions-item label="价格:">
          {{ route.cost }}元
        </el-descriptions-item>
        <el-descriptions-item label="发车时间:">
          {{ route.timeRange }} (间隔: {{ route.busInterval }}分钟一次)
        </el-descriptions-item>
        <el-descriptions-item :span="3">
          <div class="routeBrief">
            <el-image
              :src="require('../assets/icons/bus-right.png')"
              style="width: 50px"
            />
            <span style="margin: 0 15px"
              >{{ route.startNode?.currentStation.stationName }}-{{
                route.endNode?.currentStation.stationName
              }}</span
            >
            <el-switch v-model="isShow" active-text="详细线路图" />
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- 节点展示框 -->
    <div v-if="isShow">
      <!-- 总框 -->
      <div
        v-for="(routeNodeList, i) in route?.routeNodeList"
        :key="i"
        class="busRoute"
      >
        <!-- 行框 -->
        <div
          :class="{
            busRouteLeft: i % 2 === 0,
            busRouteRight: i % 2 !== 0,
          }"
        >
          <!-- 节点框 -->
          <div
            class="node"
            v-for="(node, index) in routeNodeList"
            :key="node.routeNodeId"
          >
            <!-- 站点框 -->
            <div class="station">
              <!-- 站点图标 -->
              <div class="icon">
                <!-- 始发站点图标 -->
                <el-image
                  v-if="node.sequence === route.startSequence"
                  :src="require('../assets/icons/startstation.png')"
                  style="width: 45px"
                />
                <!-- 终点站点图标 -->
                <el-image
                  v-else-if="node.sequence === route.endSequence"
                  :src="require('../assets/icons/endstation.png')"
                  style="width: 45px"
                />
                <!-- 普通站点图标 -->
                <el-image
                  v-else
                  :src="require('../assets/icons/station.png')"
                  style="width: 45px"
                />
              </div>
              <!-- 站点名称 -->
              <span class="stationName">{{
                node.currentStation.stationName
              }}</span>
            </div>
            <!-- 普通距离框 -->
            <div
              class="lineBox"
              v-if="node.sequence !== route.endSequence && index + 1 < 8"
            >
              <span class="distance">{{ node.distance }}米</span>
              <div class="line">
                <el-image
                  :src="require('../assets/icons/black-line-hor.png')"
                />
              </div>
            </div>
            <!-- 右末尾距离框 -->
            <div
              class="lineBox"
              v-if="
                node.sequence !== route.endSequence &&
                index + 1 === 8 &&
                i % 2 === 0
              "
            >
              <span class="distance">{{ node.distance }}米</span>
              <div class="line">
                <el-image
                  :src="require('../assets/icons/black-angle-right.png')"
                />
              </div>
            </div>
            <!-- 左末尾距离框 -->
            <div
              class="lineBox"
              v-if="
                node.sequence !== route.endSequence &&
                index + 1 === 8 &&
                i % 2 !== 0
              "
            >
              <span class="distance">{{ node.distance }}米</span>
              <div class="line">
                <el-image
                  :src="require('../assets/icons/black-angle-left.png')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: "BusRoute",
  data() {
    return {
      route: {},
      //是否显示详细节点信息
      isShow: true,
    };
  },
  computed: {
    routeId() {
      return this.$route.params.routeId;
    },
  },
  methods: {
    async getRoute() {
      const { data: routeRes } = await this.$axios.get(
        "route/info/" + this.routeId
      );
      var routeNodeList = routeRes.data.routeNodeList;
      for (let i = 0; i < routeNodeList.length; i++) {
        if (routeRes.data.startSequence === routeNodeList[i].sequence) {
          routeRes.data.startNode = routeNodeList[i];
        }
        if (routeRes.data.endSequence === routeNodeList[i].sequence) {
          routeRes.data.endNode = routeNodeList[i];
        }
      }
      var des = [];
      for (let i = 0; i < routeNodeList.length / 8; i++) {
        var arr = [];
        for (let j = 0; j < 8 && i * 8 + j < routeNodeList.length; j++) {
          arr.push(routeNodeList[i * 8 + j]);
        }
        des.push(arr);
      }
      routeRes.data.routeNodeList = des;
      this.route = routeRes.data;
      console.log(this.route);
    },
  },
  mounted() {
    this.getRoute();
  },
};
</script>

<style lang="less">
.card {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .el-card__header {
    width: 100%;
  }
  .routeInfo {
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .routeBrief {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
  }
  .el-card__body {
    width: 95%;
    padding: 5px;
  }
  .busRoute {
    display: flex;
    justify-content: center;
    .busRouteLeft {
      min-width: 1000px;
      width: 100%;
      padding: 10px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      align-items: flex-start;
      .node {
        height: 5em;
        width: 11%;
        margin: 5px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: flex-start;
        .station {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 5px;
          }
          .stationName {
            max-width: 5em;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8em;
            font-family: 楷体;
            font-weight: bold;
            text-align: center;
          }
        }
        .lineBox {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .distance {
            font-size: 0.5em;
            text-align: center;
          }
        }
      }
    }
    .busRouteRight {
      min-width: 1000px;
      width: 100%;
      padding: 10px;
      display: flex;
      flex-direction: row-reverse;
      flex-wrap: wrap;
      justify-content: center;
      align-items: flex-start;
      .node {
        height: 5em;
        width: 11%;
        margin: 5px;
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        align-items: flex-start;
        .station {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
          .icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 5px;
          }
          .stationName {
            max-width: 5em;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.8em;
            font-family: 楷体;
            font-weight: bold;
            text-align: center;
          }
        }
        .lineBox {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .distance {
            font-size: 0.5em;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
