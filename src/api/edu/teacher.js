import request from '@/utils/request'

function getTeacherListPage(current, limit, teacherQuery) {
  return request({
    url: `/edu/teacher/pageTeacherCondition/${current}/${limit}`,
    method: 'post',
    data: teacherQuery // post等请求下该属性必须为data，否则后台接收为null
  })
}

function deleteTeacherById(id) {
  return request({
    url: `/edu/teacher/${id}`,
    method: 'delete',
    params: null
  })
}

function addTeacher(teacherParam) {
  return request({
    url: `/edu/teacher/addTeacher`,
    method: 'post',
    data: teacherParam
  })
}

function getTeacherById(id) {
  return request({
    url: `/edu/teacher/getTeacher/${id}`,
    method: 'get'
  })
}

function updateTeacherById(id, teacherParam) {
  return request({
    url: `/edu/teacher/updateTeacher/${id}`,
    method: 'put',
    data: teacherParam
  })
}

function getTeacherAllList() {
  return request({
    url: `/edu/teacher`,
    method: 'get'
  })
}

export default {
  getTeacherListPage,
  deleteTeacherById,
  addTeacher,
  getTeacherById,
  updateTeacherById,
  getTeacherAllList
}
