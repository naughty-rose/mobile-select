<template>
  <popper
    :show="showPopover"
    class="select-popover"
    :arrow="true"
    :offsetDistance="String(offset)"
    ref="select"
    v-click-outside:click-outside="handleClose"
  >
    <template #content>
      <div
        class="select-options"
        :style="{
          width: width + 'px',
        }"
      >
        <template v-if="options && options.length">
          <div
            v-for="(item, i) of options"
            class="select-item"
            :class="{
              'select-active': containValue(modelValue, item.value),
            }"
            :key="i"
            @click="handleSelect(item)"
          >
            <slot :option="item" name="option">{{ item.label }}</slot>
          </div>
        </template>
        <div v-else class="empty-data flex">
          <slot name="empty">暂无数据</slot>
        </div>
      </div>
    </template>
    <template #default>
      <div
        class="mobile-select flex"
        :class="{
          'select-input-active': showPopover,
          'select-input-border': !border,
        }"
        @click="handleShow"
        ref="selectEl"
      >
        <input
          type="text"
          :value="text"
          readonly
          autocomplete="off"
          class="select-input"
          :placeholder="placeholder"
        />
        <div
          class="icon-wrap flex"
          :class="{
            'icon-active': showPopover,
          }"
        >
          <svg
            v-if="!showClear"
            t="1741137235306"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2543"
            :width="iconSize"
            :height="iconSize"
          >
            <path
              d="M890.335 373.578c-12.576-12.416-32.801-12.353-45.248 0.193l-327.839 330.848-332.416-329.439c-12.576-12.447-32.801-12.353-45.281 0.193-12.447 12.576-12.353 32.832 0.193 45.281l353.312 350.112c0.544 0.544 1.247 0.673 1.792 1.183 0.127 0.127 0.16 0.287 0.287 0.416 6.239 6.176 14.4 9.28 22.528 9.28 8.224 0 16.48-3.169 22.72-9.471l350.112-353.312c12.48-12.58 12.385-32.835-0.16-45.284z"
              fill="currentColor"
              p-id="2544"
            ></path>
          </svg>
          <svg
            v-else
            @click="handleClear"
            t="1741159472813"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="4677"
            :width="iconSize"
            :height="iconSize"
          >
            <path
              d="M511.488511 972.851149c254.238434 0 460.33966-206.101227 460.339661-460.33966S765.726945 52.171828 511.488511 52.171828 51.148851 258.273055 51.148851 512.511489s206.101227 460.33966 460.33966 460.33966z m0 51.148851C229.00159 1024 0 794.99841 0 512.511489S229.00159 1.022977 511.488511 1.022977s511.488511 229.00159 511.488512 511.488512-229.00159 511.488511-511.488512 511.488511z"
              fill="currentColor"
              p-id="4678"
            ></path>
            <path
              d="M513.306342 478.160943l-162.755645-162.754621c-9.986302-9.987325-26.180028-9.987325-36.167352 0-9.987325 9.987325-9.987325 26.181051 0 36.168375l162.755644 162.754622-162.755644 162.754621c-9.987325 9.987325-9.987325 26.180028 0 36.167353 9.987325 9.987325 26.181051 9.987325 36.168375 0l162.754622-162.754622 162.754621 162.755645c9.987325 9.986302 26.180028 9.986302 36.167353 0 9.987325-9.988348 9.987325-26.181051 0-36.168376l-162.754622-162.755644 162.755645-162.753599c9.986302-9.987325 9.986302-26.181051 0-36.168375-9.988348-9.987325-26.181051-9.987325-36.168376 0l-162.755644 162.755644z"
              fill="currentColor"
              p-id="4679"
            ></path>
          </svg>
        </div>
      </div>
    </template>
  </popper>
</template>

<script setup lang="ts">
import ClickOutside from './click-outside.ts'
import Popper from 'vue3-popper'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

const vClickOutside = {
  ...ClickOutside,
}

interface Option {
  label: string | number
  value: string | number
}

interface Props {
  height: number
  size: number
  placeholder: string
  clearable: boolean
  options: Option[]
  multiple: boolean
  offset: number
  activeColor: string
  border: boolean
}

type val = string | number | Array<string | number> | undefined

defineOptions({
  name: 'VueSelect',
})

const props = withDefaults(defineProps<Props>(), {
  height: 40,
  size: 14,
  placeholder: '请选择',
  clearable: false,
  options: () => [],
  multiple: false,
  offset: 10,
  activeColor: '#3875C6',
  border: true,
})

// const props = defineProps({
//   height: {
//     type: Number,
//     default: 40,
//   },
//   size: {
//     type: Number,
//     default: 14,
//   },
//   placeholder: {
//     type: String,
//     default: '请选择',
//   },
//   clearable: {
//     type: Boolean,
//     default: false,
//   },
//   options: {
//     type: Array,
//     default: () => [],
//   },
//   multiple: {
//     type: Boolean,
//     default: false,
//   },
//   offset: {
//     type: Number,
//     default: 10,
//   },
//   activeColor: {
//     type: String,
//     default: '#409EFF',
//   },
// })

const emits = defineEmits(['change', 'clear'])

const selectEl = ref<null | HTMLElement>(null)
const select = ref<null | HTMLElement>(null)
const width = ref<number>(0)

const showPopover = ref(false)

const resizeObserver = new ResizeObserver((entries) => {
  for (const entry of entries) {
    if (entry.target === selectEl.value) {
      width.value = entry.contentRect.width
    }
  }
})

const handleClose = () => {
  showPopover.value = false
}
const handleShow = () => {
  showPopover.value = !showPopover.value
}

const modelValue = defineModel<val>()
const containValue = (targetArr: val, val: number | string) => {
  if (Array.isArray(targetArr)) {
    return targetArr.includes(val)
  } else {
    return targetArr === val
  }
}

onMounted(() => {
  resizeObserver.observe(selectEl.value as HTMLElement)
  if (props.multiple && !Array.isArray(modelValue.value)) {
    modelValue.value = []
  }
})
onBeforeUnmount(() => {
  resizeObserver.unobserve(selectEl.value as HTMLElement)
})

const text = computed(() => {
  if (props.multiple) {
    return props.options
      .filter((v: Option) => {
        return Array.isArray(modelValue.value) && modelValue.value.includes(v.value)
      })
      .map((item: Option) => item.label)
      .join(',')
  } else {
    return (
      props.options.find((v: Option) => {
        return v.value === modelValue.value
      })?.label || ''
    )
  }
})

const showClear = computed(() => {
  if (props.clearable) {
    if (props.multiple) {
      return modelValue.value && (modelValue.value as Array<string | number>).length > 0
    } else {
      return (
        modelValue.value !== null &&
        modelValue.value !== undefined &&
        props.options.find((v: Option) => v.value === modelValue.value)
      )
    }
  } else {
    return false
  }
})

const iconSize = computed(() => {
  return props.size + 2
})
const handleSelect = (item: Option) => {
  if (props.multiple) {
    if ((modelValue.value as Array<string | number>).includes(item.value)) {
      modelValue.value = (modelValue.value as Array<string | number>).filter((v) => {
        return item.value !== v
      })
    } else {
      modelValue.value = [...(modelValue.value as Array<string | number>), item.value]
    }
    emits('change', modelValue.value)
  } else {
    if (item.value !== modelValue.value) {
      modelValue.value = item.value
      emits('change', modelValue.value)
    }
    handleShow()
  }
}
const handleClear = () => {
  if (props.multiple) {
    if (modelValue.value && (modelValue.value as Array<string | number>).length > 0) {
      emits('change', [])
    }
    modelValue.value = []
  } else {
    if (modelValue.value !== undefined) {
      emits('change', undefined)
    }
    modelValue.value = undefined
  }
  emits('clear')
}
</script>

<style scoped>
.mobile-select {
  width: 100%;
  height: v-bind('props.height + "px"');
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0 15px;
}
.mobile-select .select-input {
  flex: 1;
  display: block;
  width: 100%;
  margin-right: 10px;
  font-size: v-bind('props.size + "px"');
  height: v-bind('props.height + "px"');
  line-height: v-bind('props.height + "px"');
  border: 0;
  box-sizing: border-box;
  outline: none;
  background: transparent;
}
.mobile-select .select-input::placeholder,
.icon-wrap {
  color: #c0c4cc;
}

.select-input-active {
  border-color: v-bind('props.activeColor');
}
div.mobile-select.select-input-border {
  border: 0;
}

.select-options {
  max-height: 300px;
  overflow: auto;
}

div.select-popover {
  display: block;
}

.text-placeholder {
  opacity: 0.5;
}

.empty-data {
  justify-content: center;
  height: 100%;
  color: var(--popper-theme-text-color);
  opacity: 0.5;
}
.select-item {
  height: v-bind('props.height + "px"');
  line-height: v-bind('props.height + "px"');
  font-size: v-bind('props.size*1.2 + "px"');
}
.select-active {
  font-weight: 600;
  color: v-bind('props.activeColor');
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.icon-wrap {
  justify-content: center;
  transform: rotate(0deg);
  transition: transform 0.3s;
}

.icon-active {
  transform: rotate(-180deg);
}

.flex {
  display: flex;
  align-items: center;
}
</style>
