`<template>
  <div class="app-container">
    <div class="btn">
      <el-row>
        <el-button type="text" @click="openAddChapter">新增章节</el-button>
      </el-row>
    </div>

    <el-collapse accordion>

      <el-collapse-item v-for="chapter in chapterVideoList" :key="chapter.id" :disabled="false">
        <template slot="title">
          <span style="font-size:20px">{{ chapter.title }}</span>
          <span class="cv">
            <el-button type="text" class="chapterBtn" @click="openAddVideo($event,chapter.id)">添加小节</el-button>
            <el-button type="text" class="chapterBtn" @click="openEditChatper($event,chapter.id)">编辑章节</el-button>
            <el-button type="text" class="chapterBtn" @click="removeChapter($event,chapter.id)">删除章节</el-button>
          </span>
        </template>
        <div v-for="video in chapter.children" :key="video.id">
          <li>
            <span style="font-size:16px">{{ video.title }}</span>
            <span class="cv">
              <el-button type="text" class="videoBtn" @click="openAddVideo(video.id)">添加视频</el-button>
              <el-button type="text" class="videoBtn" @click="openEditVideo(video.id)">编辑小节</el-button>
              <el-button type="text" class="videoBtn" @click="removeVideo(video.id)">删除小节</el-button>
            </span>
          </li>
        </div>
      </el-collapse-item>

    </el-collapse>

    <!-- 添加或修改小节弹框 -->
    <el-dialog :visible.sync="videoFormVisible" title="填写小节信息">
      <el-form :model="video">
        <el-form-item :label-width="formLabelWidth" label="小节标题">
          <el-input v-model="video.title" autocomplete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="小节排序">
          <el-input-number v-model="video.sort" :min="video.sort" controls-position="right" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="是否免费">
          <el-radio-group v-model="video.isFree" size="medium">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="0">付费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :before-upload="beforeVodUpload"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/vod/file/upload'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="videoFormVisible = false">取 消</el-button>
        <!-- TODO：addVideo未完成 -->
        <el-button v-show="addVidoFlag" type="primary" @click="addVideo(chapter.id)">确 定</el-button>
        <el-button v-show="!addVidoFlag" :disabled="!videoBtn" type="primary" @click="updateVideo">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改章节弹框 -->
    <el-dialog :visible.sync="chapterFormVisible" title="填写章节信息">
      <el-form :model="chapter">
        <el-form-item :label-width="formLabelWidth" label="章节标题">
          <el-input v-model="chapter.title" autocomplete="off"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="章节排序">
          <el-input-number v-model="chapter.sort" :min="chapter.sort" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="chapterFormVisible = false">取 消</el-button>
        <el-button v-show="addChapterFlag" type="primary" @click="addChapter">确 定</el-button>
        <el-button v-show="!addChapterFlag" type="primary" @click="updateChapter">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'

export default {

  data() {
    return {
      chapterId: '', // 每个章节的唯一id
      addChapterFlag: true,
      addVidoFlag: true,
      chapterFormVisible: false,
      videoFormVisible: false,
      videoBtn: true, // 编辑小节时视频没上传完之前禁用确认按钮
      formLabelWidth: '120px',
      chapter: {
        title: '',
        sort: 0
      },
      video: {
        title: '',
        sort: 0,
        isFree: 0
      },
      chapterVideoList: [],
      fileList: [], // 视频列表
      BASE_API: process.env.BASE_API // 获取基础路由路径
    }
  },
  created() {
    this.reloadChapter()
  },
  methods: {
    // 上传视频之前调用方法
    beforeVodUpload() {
      this.videoBtn = false// 禁用确认按钮
    },
    // 上传成功回调方法
    handleVodUploadSuccess(response, file, fileList) {
      // 上传视频id赋值
      this.video.videoSourceId = response.data.videoSourceId
      // 上传视频名称赋值
      this.video.videoOriginalName = file.name
      // 解除确认按钮禁用状态
      this.videoBtn = true
    },
    // 删除视频之前调用方法
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定删除 ${file.name}？`)
    },
    // 确认删除视频调用的方法
    handleVodRemove() {
      video.deleteVodById(this.video.videoSourceId)
        .then(response => {
          // 清空阿里视频相关信息
          this.video.videoSourceId = ''
          this.video.videoOriginalName = ''
          video.updateVideo(this.video)
            .then(response => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
        })
    },
    // 添加章节
    addChapter() {
      chapter.saveChapter(this.chapter)
        .then(response => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.chapterFormVisible = false
          // location.reload() // 刷新页面
          this.reloadChapter()
        })
    },
    // 修改章节
    updateChapter() {
      chapter.updateChapter(this.chapter)
        .then(response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.chapterFormVisible = false
          // location.reload() // 刷新页面
          this.reloadChapter()
        })
    },
    // 删除章节
    removeChapter(event, chapterId) {
      event.stopPropagation() // 关闭子组件被点击时触发父组件的点击事件
      this.$confirm('是否删除章节?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除路由
        chapter.deleteChapterById(chapterId)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.reloadChapter()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 添加小节
    addVideo() {
      // console.log(this.chapterId)
      this.video.chapterId = this.chapterId
      video.saveVideo(this.video)
        .then(response => {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
          this.videoFormVisible = false
          // location.reload() // 刷新页面
          this.reloadChapter()
        })
    },
    // 修改小节
    updateVideo() {
      video.updateVideo(this.video)
        .then(response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.videoFormVisible = false
          this.reloadChapter()
        })
    },
    // 删除小节
    removeVideo(videoId) {
      this.$confirm('是否删除小节?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调用删除路由
        video.deleteVideoById(videoId)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.reloadChapter()
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 打开添加小节弹框
    openAddVideo(event, chapterId) {
      // console.log(event)
      event.stopPropagation() // 关闭子组件被点击时触发父组件的点击事件
      this.video = { title: '', sort: 0 } // 初始化
      const courseId = this.$route.params.id
      this.video.courseId = courseId // 为小节设置courseId值
      this.chapterId = chapterId // 获取循环中的chapterId
      this.videoFormVisible = true
      this.fileList = [] // 清空上传文件列表
    },
    // 打开编辑章节表单
    openEditChatper(event, chapterId) {
      event.stopPropagation() // 关闭子组件被点击时触发父组件的点击事件
      chapter.findChapterById(chapterId) // 根据章节id获取章节信息回显
        .then(response => {
          this.chapter = response.data.chapter
          this.addChapterFlag = false
          this.chapterFormVisible = true
        })
    },
    // 打开添加章节表单
    openAddChapter() {
      this.chapter = { title: '', sort: 0 } // 初始化
      const courseId = this.$route.params.id
      this.chapter.courseId = courseId // 为章节设置courseId值
      this.addChapterFlag = true
      this.chapterFormVisible = true
    },
    // 打开编辑小节表单
    openEditVideo(videoId) {
      this.fileList = [] // 清空上传文件列表
      this.videoBtn = true
      video.findVideoById(videoId)
        .then(response => {
          this.video = response.data.video
          this.addVidoFlag = false
          this.videoFormVisible = true
          const fileName = this.video.videoOriginalName
          if (fileName && fileName !== null) {
            this.fileList = [{ name: this.video.videoOriginalName }] // 添加上传文件列表
          }
        })
      console.log(this.fileList)
    },
    // 重新获取章节数据
    reloadChapter() {
      const courseId = this.$route.params.id
      this.chapter.courseId = courseId // 为章节设置courseId值
      this.video.courseId = courseId // 为小节设置courseId值
      chapter.findChapterAndVideo(courseId)
        .then(response => {
          this.chapterVideoList = response.data.list
        })
    }
  }
}
</script>
<style scoped>
/* .btn {
  position: absolute;
  left: 45%;
  top: 45%;
} */
.cv{
  position:absolute;
  right:50px;
}
.videoBtn{
  font-size: 10px;
}
.chapterBtn{
    font-size: 14px;
}
</style>
