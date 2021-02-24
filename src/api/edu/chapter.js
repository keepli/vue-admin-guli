import request from '@/utils/request'

function findChapterAndVideo(courseId) {
  return request({
    url: `/edu/chapter/video/${courseId}`,
    method: 'get'
  })
}

function saveChapter(chapter) {
  return request({
    url: `/edu/chapter`,
    method: 'post',
    data: chapter
  })
}

function updateChapter(chapter) {
  return request({
    url: `/edu/chapter`,
    method: 'put',
    data: chapter
  })
}

function findChapterById(chapterId) {
  return request({
    url: `/edu/chapter/${chapterId}`,
    method: 'get'
  })
}

function deleteChapterById(chapterId) {
  return request({
    url: `/edu/chapter/${chapterId}`,
    method: 'delete'
  })
}

export default {
  findChapterAndVideo,
  saveChapter,
  updateChapter,
  findChapterById,
  deleteChapterById
}
