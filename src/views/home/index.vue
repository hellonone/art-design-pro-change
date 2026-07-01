<template>
  <div class="user-page art-full-height">
    <!-- 搜索栏 -->
    <HomeSearch v-model="searchForm" @search="handleSearch" @reset="resetSearchParams"></HomeSearch>

    <ElCard class="art-table-card">
      <!-- 表格头部 -->
      <ArtTableHeader v-model:columns="columnChecks" :loading="loading" @refresh="refreshData">
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" v-ripple>新增大学</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        :mobile-config="mobileConfig"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>

      <!-- 用户弹窗 -->
      <HomeDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :user-data="currentUserData"
        @submit="handleDialogSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { ACCOUNT_TABLE_DATA } from '@/mock/temp/formData'
  import { useTable } from '@/hooks/core/useTable'

  import { ElTag, ElMessageBox } from 'element-plus'
  import { DialogType } from '@/types'
  import HomeSearch from '@views/home/modules/home-search.vue'
  import HomeDialog from '@views/home/modules/home-dialog.vue'
  import { fetchPostUniversityList } from '@/api/university'

  defineOptions({ name: 'Home' })

  type UniversityTable = Api.University.Table

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)
  const currentUserData = ref<Partial<UniversityTable>>({})

  // 选中行
  const selectedRows = ref<UniversityTable[]>([])

  // 搜索表单
  const searchForm = ref({
    uName: undefined,
    mName: undefined,
    score2024: undefined,
    score2025: undefined,
    plan2025: undefined,
    plan2026: undefined,
    remark: undefined,
    rank2024: undefined,
    rank2025: undefined,
    tag: undefined
  })

  // 用户状态配置
  const TAG_CONFIG = {
    '1': { type: 'danger' as const, text: '冲' },
    '2': { type: 'primary' as const, text: '稳' },
    '3': { type: 'success' as const, text: '保' }
  } as const

  const getTagConfig = (tag: string) => {
    return (
      TAG_CONFIG[tag as keyof typeof TAG_CONFIG] || {
        type: 'info' as const,
        text: '未标记'
      }
    )
  }

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    mobileConfig,
    getData,
    replaceSearchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    // 核心配置
    core: {
      apiFn: fetchPostUniversityList,
      apiParams: {
        current: 1,
        size: 200,
        query: {
          ...searchForm.value
        }
      },
      // 自定义分页字段映射，未设置时将使用全局配置 tableConfig.ts 中的 paginationKey
      // paginationKey: {
      //   current: 'pageNum',
      //   size: 'pageSize'
      // },
      mobileConfig: {
        header: {
          columns: ['tag', 'uName']
        },
        list: {
          columns: ['fMName', 'mName', 'score', 'rank', 'plan', 'remark', 'adPro']
        },
        footer: {
          columns: ['operation']
        }
      },
      columnsFactory: () => [
        { type: 'selection' }, // 勾选列
        { type: 'index', width: 60, label: '序号' }, // 序号
        {
          prop: 'uName',
          label: '大学名',
          width: 200
        },
        {
          prop: 'fMName',
          label: '一级专业',
          sortable: true,
          width: 150
        },
        {
          prop: 'mName',
          label: '专业',
          sortable: true,
          width: 150
        },
        {
          prop: 'score',
          label: '分数线',
          align: 'center',
          children: [
            { prop: 'score2025', label: '2025', sortable: true, width: 100 },
            { prop: 'score2024', label: '2024', sortable: true, width: 100 }
          ]
        },
        {
          prop: 'rank',
          label: '位次',
          align: 'center',
          children: [
            { prop: 'rank2025', label: '2025', sortable: true, width: 100 },
            { prop: 'rank2024', label: '2024', sortable: true, width: 100 }
          ]
        },
        {
          prop: 'plan',
          label: '招生计划',
          align: 'center',
          children: [
            { prop: 'plan2026', label: '2026', sortable: true, width: 100 },
            { prop: 'rank2024', label: '2025', sortable: true, width: 100 }
          ]
        },
        {
          prop: 'remark',
          label: '备注',
          sortable: true
        },
        {
          prop: 'adPro',
          label: '录取概率',
          width: 120,
          sortable: true,
          formatter: (row) => {
            const n: number = row.adPro / 10
            return n + '%'
          }
        },
        {
          prop: 'tag',
          label: '标记',
          sortable: true,
          width: 100,
          formatter: (row) => {
            const tagConfig = getTagConfig(row.tag)
            return h(ElTag, { type: tagConfig.type }, () => tagConfig.text)
          }
        },
        {
          prop: 'operation',
          label: '操作',
          width: 120,
          fixed: 'right', // 固定列
          formatter: (row) =>
            h('div', [
              h(ArtButtonTable, {
                type: 'edit',
                onClick: () => showDialog('edit', row)
              }),
              h(ArtButtonTable, {
                type: 'delete',
                onClick: () => deleteUser(row)
              })
            ])
        }
      ]
    },
    // 数据处理
    transform: {
      // 数据转换器 - 替换头像
      dataTransformer: (records) => {
        // 类型守卫检查
        if (!Array.isArray(records)) {
          console.warn('数据转换器: 期望数组类型，实际收到:', typeof records)
          return []
        }

        // 使用本地头像替换接口返回的头像
        return records.map((item, index: number) => {
          return {
            ...item,
            avatar: ACCOUNT_TABLE_DATA[index % ACCOUNT_TABLE_DATA.length].avatar
          }
        })
      }
    }
  })

  /**
   * 搜索处理
   * @param params 参数
   */
  const handleSearch = (params: Api.University.SearchParams) => {
    replaceSearchParams(params)
    getData()
  }

  /**
   * 显示用户弹窗
   */
  const showDialog = (type: DialogType, row?: UniversityTable): void => {
    console.log('打开弹窗:', { type, row })
    dialogType.value = type
    currentUserData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  /**
   * 删除用户
   */
  const deleteUser = (row: UniversityTable): void => {
    console.log('删除用户:', row)
    ElMessageBox.confirm(`确定要注销该用户吗？`, '注销用户', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    }).then(() => {
      ElMessage.success('注销成功')
    })
  }

  /**
   * 处理弹窗提交事件
   */
  const handleDialogSubmit = async () => {
    try {
      dialogVisible.value = false
      currentUserData.value = {}
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  /**
   * 处理表格行选择变化
   */
  const handleSelectionChange = (selection: UniversityTable[]): void => {
    selectedRows.value = selection
    console.log('选中行数据:', selectedRows.value)
  }
</script>
