<template>
  <ElDialog
    :title="dialogTitle"
    :model-value="visible"
    @update:model-value="handleCancel"
    width="860px"
    align-center
    class="menu-dialog"
    @closed="handleClosed"
  >
    <ArtForm
      ref="formRef"
      v-model="form"
      :items="formItems"
      :rules="rules"
      :span="width > 640 ? 12 : 24"
      :gutter="20"
      label-width="120px"
      :show-reset="false"
      :show-submit="false"
    >
    </ArtForm>

    <template #footer>
      <span class="dialog-footer">
        <ElButton @click="handleCancel">取 消</ElButton>
        <ElButton type="primary" @click="handleSubmit">确 定</ElButton>
      </span>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormRules } from 'element-plus'
  import type { FormItem } from '@/components/core/forms/art-form/index.vue'
  import ArtForm from '@/components/core/forms/art-form/index.vue'
  import { useWindowSize } from '@vueuse/core'
  import UniversityFormData = Api.University.UniversityFormData

  const { width } = useWindowSize()

  interface Props {
    visible: boolean
    editData?: any
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit', data: UniversityFormData): void
  }

  const props = withDefaults(defineProps<Props>(), {
    visible: false
  })

  const emit = defineEmits<Emits>()

  const formRef = ref()
  const isEdit = ref(false)

  const form = reactive<UniversityFormData>({
    id: undefined,
    uName: '',
    mName: '',
    bMName: '',
    fMName: '',
    score2025: undefined,
    rank2025: undefined,
    score2024: undefined,
    rank2024: undefined,
    plan2026: undefined,
    plan2025: undefined,
    remark: '',
    sort: undefined,
    adPro: undefined,
    tag: ''
  })

  const rules = reactive<FormRules>({
    uName: [{ required: true, message: '请输入大学名', trigger: 'blur' }],
    mName: [{ required: true, message: '请输入专业名', trigger: 'blur' }]
  })

  /**
   * 表单项配置
   */
  const formItems = computed<FormItem[]>(() => {
    return [
      { label: '大学名', key: 'uName', type: 'input', props: { placeholder: '大学名' } },
      { label: '专业名', key: 'mName', type: 'input', props: { placeholder: '专业名' } },
      { label: '专业大类名', key: 'bMName', type: 'input', props: { placeholder: '专业大类名' } },
      { label: '一级专业名', key: 'fMName', type: 'input', props: { placeholder: '一级专业名' } },
      {
        label: '2025年分数线',
        key: 'score2025',
        type: 'number',
        props: { min: 1, max: 750, controlsPosition: 'right', style: { width: '100%' } }
      },
      {
        label: '2025年位次',
        key: 'rank2025',
        type: 'number',
        props: { min: 1, controlsPosition: 'right', style: { width: '100%' } }
      },
      {
        label: '2024年分数线',
        key: 'score2024',
        type: 'number',
        props: { min: 1, max: 750, controlsPosition: 'right', style: { width: '100%' } }
      },
      {
        label: '2024年位次',
        key: 'rank2024',
        type: 'number',
        props: { min: 1, controlsPosition: 'right', style: { width: '100%' } }
      },
      {
        label: '2026年招生计划',
        key: 'plan2026',
        type: 'number',
        props: { min: 0, controlsPosition: 'right', style: { width: '100%' } }
      },
      {
        label: '2025年招生计划',
        key: 'plan2025',
        type: 'number',
        props: { min: 0, controlsPosition: 'right', style: { width: '100%' } }
      },
      {
        label: '录取概率',
        key: 'adPro',
        type: 'number',
        props: {
          min: 0,
          controlsPosition: 'right',
          style: { width: '100%' },
          formatter: (value: number) => `${value / 100}%`
        }
      },
      {
        label: '标签',
        key: 'tag',
        type: 'select',
        options: [
          { label: '冲', value: '1' },
          { label: '稳', value: '2' },
          { label: '保', value: '3' },
          { label: '未标记', value: '-1' }
        ]
      },
      {
        label: '排序',
        key: 'sort',
        type: 'number',
        props: { min: 0, controlsPosition: 'right', style: { width: '100%' } }
      },
      { label: '备注', key: 'remark', type: 'input', props: { placeholder: '备注' }, span: 24 }
    ]
  })

  const dialogTitle = computed(() => {
    return isEdit.value ? `编辑志愿` : `新建志愿`
  })

  /**
   * 重置表单数据
   */
  const resetForm = (): void => {
    formRef.value?.reset()
  }

  /**
   * 加载表单数据（编辑模式）
   */
  const loadFormData = (): void => {
    if (!props.editData) return

    isEdit.value = true

    const row = props.editData
    Object.keys(form).forEach((key) => {
      if (key in row) {
        form[key as keyof typeof form] = row[key as keyof typeof row]
      }
    })
  }

  /**
   * 提交表单
   */
  const handleSubmit = async (): Promise<void> => {
    if (!formRef.value) return

    try {
      await formRef.value.validate()
      emit('submit', { ...form })
      handleCancel()
    } catch {
      ElMessage.error('表单校验失败，请检查输入')
    }
  }

  /**
   * 取消操作
   */
  const handleCancel = (): void => {
    emit('update:visible', false)
  }

  /**
   * 对话框关闭后的回调
   */
  const handleClosed = (): void => {
    resetForm()
    isEdit.value = false
  }

  /**
   * 监听对话框显示状态
   */
  watch(
    () => props.visible,
    (newVal) => {
      if (newVal) {
        nextTick(() => {
          if (props.editData) {
            loadFormData()
          }
        })
      }
    }
  )
</script>
