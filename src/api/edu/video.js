import request from '@/utils/request'

function saveVideo(video) {
  return request({
    url: `/edu/video`,
    method: 'post',
    data: video
  })
}

function findVideoById(videoId) {
  return request({
    url: `/edu/video/${videoId}`,
    method: 'get'
  })
}

function updateVideo(video) {
  return request({
    url: `/edu/video`,
    method: 'put',
    data: video
  })
}

function deleteVideoById(videoId) {
  return request({
    url: `/edu/video/${videoId}`,
    method: 'delete'
  })
}

// 删除阿里云视频
function deleteVodById(videoId) {
  return request({
    url: `/vod/file/${videoId}`,
    method: 'delete'
  })
}

export default {
  saveVideo,
  findVideoById,
  updateVideo,
  deleteVideoById,
  deleteVodById
}
