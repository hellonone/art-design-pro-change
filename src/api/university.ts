import request from '@/utils/http'
import { BaseResponse } from '@/types'

// 获取用户列表
export function fetchPostUniversityList(params: Api.University.SearchParams) {
  return request.post<Api.University.UniversityList>({
    url: '/api/university/pageList',
    params
  })
}

export function removeUniversity(ids: number[]) {
  return request.post<BaseResponse<any>>({
    url: `/api/university/removeByIds`,
    data: ids
  })
}

export function addUniversity(data: Api.University.UniversityFormData) {
  return request.post<BaseResponse<any>>({
    url: `/api/university/add`,
    data
  })
}

export function updateUniversity(data: Api.University.UniversityFormData) {
  return request.post<BaseResponse<any>>({
    url: `/api/university/update`,
    data
  })
}
