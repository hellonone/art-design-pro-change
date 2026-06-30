import { defineStore } from 'pinia'
import { ref } from 'vue'

export const userCacheStore = defineStore(
  'userCacheStore',
  () => {
    const savedUsername = ref('')
    const savedPassword = ref('')
    const isRemember = ref(true)

    const getSavedUsername = () => savedUsername.value

    const setSavedUsername = (user: string) => {
      savedUsername.value = user
    }

    const getIsRemember = () => isRemember.value

    const getSavedPassword = () => savedPassword.value

    const setSavedPassword = (password: string) => {
      savedPassword.value = password
    }

    const setIsRemember = (value: boolean) => {
      isRemember.value = value
    }
    return {
      savedUsername,
      savedPassword,
      isRemember,
      getSavedUsername,
      setSavedUsername,
      getSavedPassword,
      setSavedPassword,
      getIsRemember,
      setIsRemember
    }
  },
  {
    persist: {
      key: 'cacheKay',
      storage: localStorage
    }
  }
)
