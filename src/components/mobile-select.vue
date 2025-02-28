<template>
  <popper
    :show="showPopover"
    class="select-popover"
    :arrow="true"
    :offsetDistance="String(offset)"
    ref="select"
    v-click-outside="handleClose"
  >
    <template #content>
      <div
        class="select-options"
        :style="{
          width: width + 'px',
        }"
      >
        <div v-if="options && options.length">
          <div
            v-for="(item, i) of options"
            class="select-item"
            :class="{
              'select-active': containValue(modelValue, item.value),
            }"
            :key="i"
            @click="handleSelect(item)"
          >
            <slot :option="item">{{ item.label }}</slot>
          </div>
        </div>
        <div v-else class="empty-data">
          <slot name="empty">暂无数据</slot>
        </div>
      </div>
    </template>
    <template #default>
      <div
        class="base-select"
        :class="{
          'select-input-active': showPopover,
        }"
        @click="handleShow"
        ref="selectEl"
      >
        <div class="select-input">
          <div v-if="[undefined, null, ''].includes(modelValue)" class="text-placeholder">
            {{ placeholder }}
          </div>
          <div v-else-if="modelValue && modelValue.length" class="ellipsis">
            {{ text }}
          </div>
          <div v-else class="ellipsis">{{ text }}</div>
        </div>
        <van-icon :name="showPopover ? 'arrow-up' : 'arrow-down'" />
      </div>
    </template>
  </popper>
</template>

<script setup>
import Popper from 'vue3-popper'
import { ref, computed, defineModel, defineOptions } from 'vue'

defineOptions({
  name: 'MobileSelect',
})

const props = defineProps({
  placeholder: {
    type: String,
    default: '请选择',
  },
  options: {
    type: Array,
    default: () => [],
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  valueKey: {
    type: String,
    default: 'value',
  },
  offset: {
    type: Number,
    default: 10,
  },
  activeColor: {
    type: String,
    default: '#409EFF',
  },
  divider: {
    type: String,
    default: '/',
  },
})

const emits = defineEmits(['change', 'update:modelValue'])

const selectEl = ref(null)
const select = ref(null)

const showPopover = ref(false)

const handleClose = () => {
  showPopover.value = false
}
const handleShow = () => {
  showPopover.value = !showPopover.value
}

const width = computed(() => {
  return selectEl.value ? selectEl.value.clientWidth - props.offset * 2 : 0
})

const modelValue = defineModel({
  type: [String, Number, Array, undefined],
  default: undefined,
})
const isObject = (val) => val !== null && typeof val === 'object'

const containValue = (targetArr, val) => {
  const target = props.multiple ? targetArr : [targetArr]
  if (isObject(val)) {
    return target.some((v) => v[props.valueKey] === val[props.valueKey])
  } else {
    return target.includes(val)
  }
}

const text = computed(() => {
  if (props.multiple) {
    return props.options
      .filter((v) => {
        return containValue(modelValue.value, v.value)
      })
      .map((item) => item.label)
      .join(props.divider)
  } else {
    return (
      props.options.find((v) => {
        if (isObject(v.value)) {
          return v.value[props.valueKey] === modelValue.value[props.valueKey]
        } else {
          return v.value === modelValue.value
        }
      })?.label || ''
    )
  }
})

const handleSelect = (item) => {
  const bool = isObject(item.value)
  if (props.multiple) {
    if (containValue(modelValue.value, item.value)) {
      modelValue.value = modelValue.value.filter((v) => {
        if (bool) {
          return v[props.valueKey] !== item.value[props.valueKey]
        } else {
          return v !== item.value
        }
      })
    } else {
      modelValue.value = [...modelValue.value, item.value]
    }
    emits('change', modelValue.value)
  } else {
    if (!containValue(modelValue.value, item.value)) {
      modelValue.value = item.value
      emits('change', modelValue.value)
    }
    handleShow()
  }
}
</script>

<style scoped>
.base-select {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 0 15px;
  transform: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
}
.select-input {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 10px;
}

.select-input-active {
  border-color: v-bind('props.activeColor');
}

.select-options {
  min-height: 200px;
  max-height: 320px;
  height: 260px;
  overflow: auto;
}

div.select-popover {
  display: block;
}

.text-placeholder {
  opacity: 0.5;
}

.empty-data {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--popper-theme-text-color);
  opacity: 0.5;
}
.select-item {
  height: 50px;
  line-height: 50px;
  font-size: 25px;
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
</style>
