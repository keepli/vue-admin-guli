<template>
  <div class="app-container">
    <!-- 条件查询表单 -->
    <!-- :inline为true表示在一行中显示 value-format可以指定时间格式（底层会转为string类型） -->
    <el-form :inline="true" :model="courseQuery" class="demo-form-inline">
      <el-form-item >
        <el-input v-model="courseQuery.title" placeholder="课程标题"/>
      </el-form-item>
      <el-form-item >
        <el-select v-model="courseQuery.status" placeholder="课程状态">
          <el-option label="已发布" value="Normal"/>
          <el-option label="未发布" value="Draft"/>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-date-picker v-model="courseQuery.begin" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" placeholder="查询开始时间" />
      </el-form-item>
      <el-form-item >
        <el-date-picker v-model="courseQuery.end" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" placeholder="查询结束时间"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="pageConditionQuery">查询</el-button>
        <el-button type="warning" @click="resetData">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <!-- v-loading和element-loading-text属性是显示正在加载的动画，当v-loading为true时开启 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="title" label="标题" width="180" />

      <el-table-column prop="price" label="价格" width="80"/>

      <el-table-column prop="lessonNum" label="总课时" width="80"/>

      <el-table-column prop="buyCount" label="销售数量" width="80"/>

      <el-table-column prop="viewCount" label="浏览数量" width="80"/>

      <el-table-column prop="statusStr" label="课程状态" width="80"/>

      <el-table-column prop="gmtModified" label="修改时间" width="160"/>

      <!-- TODO：未修改 -->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeCourseById(scope.row.id)">删除</el-button>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-plus">章节小节信息</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <div class="block">
      <el-pagination
        :total="total"
        :current-page="page"
        :page-sizes="[5, 6, 30, 40, 50, 100]"
        :page-size="limit"
        background
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="getList"/>
    </div>
  </div>
</template>
<script>
import course from '@/api/edu/course'

export default {
  data() { // 定义变量和初始值
    return {
      listLoading: true, // 开启加载小图标

      list: null, // 查询之后接口返回集合
      page: 1, // 当前页
      limit: 5, // 每页记录数
      total: 0, // 总记录数
      courseQuery: {

      }
    }
  },
  created() { // 页面渲染之前执行，一般调用methods定义的方法
    // 调用
    this.getList()
  },
  methods: {
    // 每页显示条目数改变调用的方法
    handleSizeChange(limit) {
      // console.log(limit)
      this.limit = limit
      this.getList(this.page)
    },
    // 讲师列表的方法
    getList(page = 1) {
      this.page = page
      course.getTeacherListPage(this.page, this.limit, this.courseQuery)
        .then(response => {
          this.listLoading = false
          this.list = response.data.list
          this.total = response.data.total
          // console.log(this.list)
        })
    },
    // 根据条件分页查询
    pageConditionQuery() {
      this.getList(this.page, this.limit, this.courseQuery)
    },
    resetData() {
      this.courseQuery = {}
      this.getList()
    },
    // 删除课程
    removeCourseById(courseId) {
      this.$confirm('是否删除课程?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        course.deleteCourseById(courseId)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style>
/* 设置分页样式 */
.block {
  padding: 30px 0;
  text-align: center;
}
</style>
