import request from '@/utils/request'

function saveCourse(courseQuery) {
  return request({
    url: `/edu/course`,
    method: 'post',
    data: courseQuery
  })
}

function getTeacherListPage(current, limit, courseQuery) {
  return request({
    url: `/edu/course/condition/${current}/${limit}`,
    method: 'post',
    data: courseQuery
  })
}

function findCourseById(courseId) {
  return request({
    url: `/edu/course/${courseId}`,
    method: 'get'
  })
}

function updateCourse(courseParam) {
  return request({
    url: `/edu/course`,
    method: 'put',
    data: courseParam
  })
}

function deleteCourseById(courseId) {
  return request({
    url: `/edu/course/${courseId}`,
    method: 'delete'
  })
}

export default {
  saveCourse,
  getTeacherListPage,
  findCourseById,
  updateCourse,
  deleteCourseById
}
