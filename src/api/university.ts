import request from '@/utils/http'

// 获取用户列表
export function fetchPostUniversityList(params: Api.University.SearchParams) {
  return request.post<Api.University.UniversityList>({
    url: '/api/university/pageList',
    params
  })
}
