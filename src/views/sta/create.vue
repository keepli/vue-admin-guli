`<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker
          v-model="day"
          type="date"
          placeholder="选择要统计的日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>

      <el-button
        :disabled="btnDisabled"
        type="primary"
        @click="create()">生成</el-button>
    </el-form>
  </div>
</template>
<script>
import sta from '@/api/sta/index'

export default {

  data() {
    return {
      day: ''
    }
  },
  methods: {
    // 获取
    create() {
      sta.createStatisticsDaily(this.day)
        .then(response => {
          this.$message({
            message: '生成统计数据成功',
            type: 'success'
          })
          // 路由跳转
          this.$router.push({ path: `/statistics/daily/chart` })
        })
    }
  }
}
</script>
