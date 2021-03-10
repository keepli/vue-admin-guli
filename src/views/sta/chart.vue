`<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item>
        <el-select v-model="statisticsDailyQuery.condition" clearable placeholder="请选择">
          <el-option label="学员登录数统计" value="login_num"/>
          <el-option label="学员注册数统计" value="register_num"/>
          <el-option label="课程播放数统计" value="video_view_num"/>
          <el-option label="每日课程数统计" value="course_num"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="statisticsDailyQuery.begin"
          type="date"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="statisticsDailyQuery.end"
          type="date"
          placeholder="选择截止日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-button
        :disabled="btnDisabled"
        type="primary"
        icon="el-icon-search"
        @click="getChartList()">查询</el-button>
    </el-form>

    <div class="chart-container">
      <div id="chart" class="chart" style="height:500px;width:100%" />
    </div>
  </div>
</template>
<script>
import sta from '@/api/sta/index'
import * as echarts from 'echarts'

export default {

  data() {
    return {
      statisticsDailyQuery: {},
      btnDisabled: false,
      // 指定图表的配置项和数据
      option: {
        // x轴是类目轴（离散数据）,必须通过data设置类目数据
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        // y轴是数据轴（连续数据）
        yAxis: {
          type: 'value'
        },
        // 系列列表。每个系列通过 type 决定自己的图表类型
        series: [{
          // 系列中的数据内容数组
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          // 折线图
          type: 'line'
        }]
      }
    }
  },
  methods: {
    // 获取
    getChartList() {
      sta.getStatisticsDailyByCondition(this.statisticsDailyQuery)
        .then(response => {
          const dataCalculatedList = response.data.dataCalculatedList
          this.option.xAxis.data = dataCalculatedList
          this.option.series[0].data = response.data.conditionList
          console.log('获取数据完成')
          if (dataCalculatedList.length === 0 || dataCalculatedList == null) {
            this.$notify.info({
              title: '提示',
              message: '该时间段内暂无统计数据！'
            })
          }

          // 设置图表参数
          this.setChart()
        })
    },
    // 设置图表参数
    setChart() {
      // 基于准备好的dom，初始化echarts实例
      this.chart = echarts.init(document.getElementById('chart'))
      // console.log(this.option)
      this.chart.setOption(this.option)
    }
  }
}
</script>
