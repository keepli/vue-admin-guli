<template>
  <div class="app-container">
    <!-- 条件查询表单 -->
    <!-- :inline为true表示在一行中显示 value-format可以指定时间格式（底层会转为string类型） -->
    <el-form :inline="true" :model="teacherQuery" class="demo-form-inline">
      <el-form-item >
        <el-input v-model="teacherQuery.name" placeholder="讲师姓名"/>
      </el-form-item>
      <el-form-item >
        <el-select v-model="teacherQuery.level" placeholder="讲师头衔">
          <el-option label="高级讲师" value="1"/>
          <el-option label="首席讲师" value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item >
        <el-date-picker v-model="teacherQuery.begin" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" placeholder="查询开始时间" />
      </el-form-item>
      <el-form-item >
        <el-date-picker v-model="teacherQuery.end" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" placeholder="查询结束时间"/>
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

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column prop="levelStr" label="头衔" width="80">
        <!-- 用来没有使用VO时的转换 -->
        <!-- <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template> -->
      </el-table-column>

      <el-table-column prop="intro" label="资历" />

      <el-table-column prop="gmtModified" label="修改时间" width="160"/>

      <el-table-column prop="sort" label="排序" width="60" />

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
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
// 引入调用teacher.js文件
import teacher from '@/api/edu/teacher'

export default {
  // 写核心代码位置
  data() { // 定义变量和初始值
    return {
      listLoading: true, // 开启加载小图标

      list: null, // 查询之后接口返回集合
      page: 1, // 当前页
      limit: 5, // 每页记录数
      total: 0, // 总记录数
      teacherQuery: {
        // 以下属性不写也没关系
        name: '',
        level: '',
        begin: '',
        end: ''
      } // 条件封装对象
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
      /* if (isNaN(page)) {
        page = 1
      } */
      // this.page = parseInt(page)
      this.page = page
      teacher.getTeacherListPage(this.page, this.limit, this.teacherQuery)
        .then(response => {
          this.listLoading = false
          this.list = response.data.rows
          this.total = response.data.total
          // console.log(this.list)
        })
    },
    // 根据id删除讲师
    removeDataById(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除路由
        teacher.deleteTeacherById(id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList(this.page) // 删除成功后重新获取讲师列表
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 根据条件分页查询
    pageConditionQuery() {
      this.getList(this.page, this.limit, this.teacherQuery)
    },
    resetData() {
      this.teacherQuery = {}
      this.getList()
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
