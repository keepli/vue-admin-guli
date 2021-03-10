import request from '@/utils/request'

// 生成某天的统计数据
function createStatisticsDaily(day) {
  return request({
    url: `/sta/daily/${day}`,
    method: 'put'
  })
}

// 条件查询统计数据
function getStatisticsDailyByCondition(StatisticsDailyQuery) {
  return request({
    url: `/sta/daily/condition`,
    method: 'post',
    data: StatisticsDailyQuery
  })
}

export default {
  createStatisticsDaily,
  getStatisticsDailyByCondition
}
