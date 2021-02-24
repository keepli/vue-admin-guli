<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />

    <!-- lazy属性可以进行懒加载，如果没有lazy属性父节点图标会不显示 -->
    <el-tree
      ref="tree"
      :data="data"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      lazy
      @node-click="clickNode"
    />

  </div>
</template>

<script>
// 引入路由文件
import subject from '@/api/edu/subject'

export default {

  data() {
    return {
      filterText: '',
      data: [{
        // id: '',
        // title: '',
        // children: []
      }],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  created() {
    this.getAllParentSubject()
  },

  methods: {
    // 过滤查询方法
    filterNode(value, data) {
      if (!value) return true
      return data.title.toLowerCase().indexOf(value) !== -1
    },
    getAllParentSubject() {
      // 注释的为一次性将数据库的数据查出，对数据库不友好（注意在使用该方法是需去掉lazy属性，否则子节点数据不能显示）
      // subject.findAllSubject()
      //   .then(response => {
      //     this.data = response.data.list
      //   })
      subject.findParentSubject()
        .then(response => {
          this.data = response.data.list
        })
    },

    // 节点被点击是触发的事件（有三个默认参数）
    clickNode(parentNode) {
      // console.log(parentNode)

      // 防止每次点击的时候都会发送请求，所以需要进行判断
      // 第一次点击parentNode.children为null，而!null转为布尔值为true，所以第一次点击肯定会执行
      // 第二次点击parentNode.children如果没数据则为空数组，而![]转为布尔值为false，之后点击都不会执行
      // console.log(parentNode.children)
      const pid = parentNode.id
      if (!parentNode.children) {
        subject.findChildrenSubject(pid)
          .then(response => {
            parentNode.children = response.data.list // 为被点击的节点查询子节点并赋值
          })
      }
    }

  }
}
</script>

