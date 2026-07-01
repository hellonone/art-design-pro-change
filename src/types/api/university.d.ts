declare namespace Api {
  namespace University {
    type UniversityList = Api.Common.PaginatedResponse<Table>

    interface Table {
      id: string
      uName: string
      mName: string
      bMName: string
      fMName: string
      score2025: number
      rank2025: number
      score2024: number
      rank2024: number
      plan2026: number
      plan2025: number
      remark: string
      sort: string
      adPro: number
      tag: string
    }

    type QueryParams = Partial<
      Pick<
        Table,
        | 'uName'
        | 'mName'
        | 'score2024'
        | 'score2025'
        | 'plan2025'
        | 'plan2026'
        | 'remark'
        | 'rank2024'
        | 'rank2025'
        | 'tag'
      >
    >

    /** 用户搜索参数 */
    type SearchParams = Partial<Common.CommonSearchParams<QueryParams>>
  }
}
