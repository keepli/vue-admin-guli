import request from '@/utils/request'

function findAllSubject() {
  return request({
    url: `/edu/subject/`,
    method: 'get'
  })
}

function findParentSubject() {
  return request({
    url: `/edu/subject/parent`,
    method: 'get'
  })
}

function findChildrenSubject(pid) {
  return request({
    url: `/edu/subject/children/${pid}`,
    method: 'get'
  })
}

function findSubjectById(id) {
  return request({
    url: `/edu/subject/${id}`,
    method: 'get'
  })
}

export default {
  findAllSubject,
  findParentSubject,
  findChildrenSubject,
  findSubjectById
}
