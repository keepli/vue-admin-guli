<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="active" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">
      <!-- 步骤一 -->
      <div v-if="active==1">
        <el-form-item label="课程标题">
          <el-input v-model="courseParam.title" placeholder=""/>
        </el-form-item>

        <!-- 所属分类 TODO -->
        <el-form-item label="课程分类">
          <!-- 一级分类 -->
          <el-select
            v-model="courseParam.subjectParentId"
            placeholder="一级分类"
            @change="getSubjectChildren">
            <el-option
              v-for="subject in subjectList"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"/>
          </el-select>
          <!-- 二级分类 -->
          <el-select
            v-model="courseParam.subjectId"
            placeholder="二级分类">
            <el-option
              v-for="subject in children"
              :key="subject.id"
              :label="subject.title"
              :value="subject.id"/>
          </el-select>
        </el-form-item>

        <!-- 课程讲师 -->
        <el-form-item label="课程讲师">
          <el-select
            v-model="courseParam.teacherId"
            placeholder="请选择">
            <el-option
              v-for="teacher in teacherList"
              :key="teacher.id"
              :label="teacher.name"
              :value="teacher.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="总课时">
          <el-input-number :min="0" v-model="courseParam.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="next">下一步</el-button>
        </el-form-item>
      </div>

      <!-- 步骤二 -->
      <div v-if="active==2">
        <!-- 课程简介 TODO -->
        <el-form-item label="课程简介">
          <tinymce :height="300" v-model="courseParam.description"/>
        </el-form-item>

        <!-- 课程封面 -->
        <el-form-item label="课程封面">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/oss/file/upload'"
            class="avatar-uploader">
            <img v-if="courseParam.cover" :src="courseParam.cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>

        <el-form-item label="课程价格">
          <el-input-number :min="0" v-model="courseParam.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
        </el-form-item>

        <el-form-item>
          <el-button @click="back">上一步</el-button>
          <el-button type="primary" @click="next">下一步</el-button>
        </el-form-item>
      </div>

      <!-- 步骤三 -->
      <div v-if="active==3">
        <el-form-item>
          <el-button @click="back">上一步</el-button>
          <el-button type="primary" @click="next">发布</el-button>
        </el-form-item>
      </div>

    </el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import teacher from '@/api/edu/teacher'
import subject from '@/api/edu/subject'

import Tinymce from '@/components/Tinymce' // 引入富文本组件

export default {
  // 注册富文本组件
  components: { Tinymce },
  data() {
    return {
      active: 1,
      courseParam: {
        teacherId: '',
        subjectId: '',
        subjectParentId: '',
        title: '',
        price: 0,
        lessonNum: 0,
        cover: '',
        description: ''
      },
      teacherList: [],
      subjectList: [],
      children: [],
      dialogVisible: true,
      BASE_API: process.env.BASE_API // 获取基础路由路径
    }
  },
  // 监听路由变化进行初始化
  watch: {
    $route(to, form) {
      this.init()
    }
  },
  created() {
    if (this.$route.params.id) {
      course.findCourseById(this.$route.params.id)
        .then(response => {
          this.courseParam = response.data.course
          teacher.getTeacherById(this.courseParam.teacherId)
            .then(response => {
              const teachers = new Array(response.data.teacher)
              this.teacherList = teachers
            })
          subject.findSubjectById(this.courseParam.subjectParentId)
            .then(response => {
              const subjects = new Array(response.data.subject)
              this.subjectList = subjects
            })
          subject.findSubjectById(this.courseParam.subjectId)
            .then(response => {
              const subjects = new Array(response.data.subject)
              this.children = subjects
            })
        })
    }
    this.getTeacherAllList()
    this.getParentSubjectList()
  },
  methods: {
    // 初始化
    init() {
      this.courseParam = { price: 0, lessonNum: 0 }
      this.teacherList = []
      this.subjectList = []
      this.children = []
    },
    // 上传封面之后调用的方法
    handleAvatarSuccess(res, file) {
      console.log(res)// 上传响应
      console.log(URL.createObjectURL(file.raw))// base64编码
      this.courseParam.cover = res.data.url
    },
    // 上传封面之前调用的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 获取所有讲师
    getTeacherAllList() {
      teacher.getTeacherAllList()
        .then(response => {
          this.teacherList = response.data.list
        })
    },
    // 获取所有一级分类
    getParentSubjectList() {
      subject.findParentSubject()
        .then(response => {
          this.subjectList = response.data.list
        })
    },
    // 获取二级分类，使用onchange事件，当值改变时触发，vue中封装了该事件，会将value值传过来
    getSubjectChildren(pid) {
      subject.findChildrenSubject(pid)
        .then(response => {
          // this.subjectList.children = response.data.list // 不能双向绑定
          this.courseParam.subjectId = '' // 解决小bug
          this.children = response.data.list
        })
    },
    // 下一步
    next() {
      if (this.active++ > 2) {
        // 判断是修改还是保存
        if (this.$route.params.id) {
          course.updateCourse(this.courseParam)
            .then(response => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
              this.$router.push({ path: `/course/list` })
            })
        } else {
          course.saveCourse(this.courseParam)
            .then(response => {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
              const courseId = response.data.id
              this.$router.push({ path: `/course/chapter/${courseId}` })
            })
        }
      }
    },
    // 上一步
    back() {
      if (this.active-- < 2) this.active = 1
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

