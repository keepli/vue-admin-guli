<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacherParam.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacherParam.sort" :min="0" :max="10" controls-position="right" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacherParam.level" clearable placeholder="请选择">
          <!--
            数据类型一定要和取出的json中的一致，否则没法回填
            因此，这里value使用动态绑定的值，保证其数据类型是number
          -->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacherParam.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacherParam.intro" :rows="10" type="textarea"/>
      </el-form-item>

      <!-- 讲师头像：TODO -->
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacherParam.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/oss/file/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// 引入调用teacher.js文件
import teacher from '@/api/edu/teacher'

// 引入文件上传的两个组件
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: {
    ImageCropper, // 变量名不能变，因为这是组件名image-cropper
    PanThumb // 对应组件名pan-thumb
  },
  data() {
    return {
      teacherParam: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      saveBtnDisabled: false, // 保存按钮是否禁用
      imagecropperShow: false, // 上传弹框组件是否显示
      imagecropperKey: 0, // 上传组件key的值，唯一标识
      BASE_API: process.env.BASE_API // 获取基础路由路径
    }
  },
  // 监听，如果路由发生变化则执行清空方法
  watch: {
    $route(to, form) {
      console.log(this.$route)
      console.log(this.$router)
      this.init()
    }
  },
  // 在页面渲染之前根据判断是否有id来加载信息
  // 需要注意的是，该created只执行一次，会造成修改时候的数据在保存时显示，需要使用监听
  created() {
    if (this.$route.params.id) {
      const teacherId = this.$route.params.id
      this.getInfo(teacherId)
    }
  },
  methods: {
    // 添加或修改讲师方法
    saveOrUpdate() {
      this.saveBtnDisabled = true // 添加成功后禁用保存按钮
      if (this.$route.params.id) {
        const teacherId = this.$route.params.id
        this.updateData(teacherId)
      } else {
        this.saveData()
      }
    },
    // 添加讲师方法
    saveData() {
      teacher.addTeacher(this.teacherParam)
        .then(response => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.$router.push({ path: `/teacher/list` })
        })
    },
    // 修改讲师
    updateData(id) {
      teacher.updateTeacherById(id, this.teacherParam)
        .then(response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          // 修改成功跳转页面
          this.$router.push({ path: '/teacher/list' })
        })
    },
    // 根据id查询讲师
    getInfo(id) {
      teacher.getTeacherById(id)
        .then(response => {
          this.teacherParam = response.data.teacher
        })
    },
    // 清空旧参数方法
    init() {
      this.teacherParam = {}
    },
    // 关闭上传弹框
    close() {
      this.imagecropperShow = false
      this.imagecropperKey++ // 解决上传成功之后需要关闭弹窗才能更换文件
    },
    // 上传成功的方法
    // data是通过子组件发送过来的事件所携带的信息，就是后端的R对象
    cropSuccess(data) {
      this.teacherParam.avatar = data.url
      this.imagecropperShow = false // 关闭上传弹框
      this.imagecropperKey++
    }

  }
}
</script>
