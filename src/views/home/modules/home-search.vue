<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    search-type="advanced"
    @search="handleSearch"
  >
  </ArtSearchBar>
</template>

<script setup lang="ts">
  interface Props {
    modelValue: Api.University.QueryParams
  }

  interface Emits {
    (e: 'update:modelValue', value: Api.University.QueryParams): void

    (e: 'search', params: Api.University.SearchParams): void

    (e: 'reset'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 表单数据双向绑定
  const searchBarRef = ref()
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  // 校验规则
  const rules = {
    // userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
  }

  // 动态 options
  const tagOptions = [
    { label: '冲', value: '1' },
    { label: '稳', value: '2' },
    { label: '保', value: '3' },
    { label: '未标记', value: '-1' }
  ]

  // 表单配置
  const formItems = computed(() => [
    {
      label: '大学名',
      key: 'uName',
      type: 'input',
      placeholder: '请输入大学名',
      clearable: true
    },
    {
      label: '专业名',
      key: 'mName',
      type: 'input',
      placeholder: '请输入专业名',
      clearable: true
    },
    {
      label: '标记',
      key: 'tag',
      type: 'select',
      props: {
        placeholder: '请选择标记',
        options: tagOptions
      }
    },
    {
      label: '分数大于',
      key: 'score2024',
      type: 'number',
      clearable: true
    },
    {
      label: '分数小于',
      key: 'score2025',
      type: 'number',
      clearable: true
    },
    {
      label: '位次大于',
      key: 'rank2025',
      type: 'number',
      clearable: true
    },
    {
      label: '位次小于',
      key: 'rank2024',
      type: 'number',
      clearable: true
    }
  ])

  // 事件
  function handleReset() {
    console.log('重置表单')
    emit('reset')
  }

  async function handleSearch(params: Api.University.SearchParams) {
    await searchBarRef.value.validate()
    emit('search', params)
    console.log('表单数据', params)
  }
</script>
