# mobileSelect

这是一个基于vue3的移动端下拉选择组件,它兼容移动端和pc端，支持多选，单选，清空选项，自定义选项展示，无选项时展示。
样式和PC端的select 样式基本一致，但是样式的细节上做了一些优化，比如select的边框，select的选中项的背景色，select的选中项的边框，select的选中项的文字颜色等。

## Props

| Name               | Description          | Type                    | Required | Default |
| ------------------ | -------------------- | ----------------------- | -------- | ------- |
| size               | select的高度，       | `number`                | `false`  | 30      |
| modelValue/v-model | 绑定值               | `string、number、array` | `false`  | ——      |
| multiple           | 是否多选             | `boolean`               | `false`  | false   |
| clearable          | 是否可以清空选项     | `boolean`               | `false`  | false   |
| activeColor        | 下拉选项选择时的颜色 | `string`                | `false`  | #3875C6 |
| options            | select的下拉选项     | `array`                 | `false`  | []      |
| border             | select的是否有边框   | `boolean`               | `false`  | true    |

## Events

| Event Name | Description                              | Parameters   |
| ---------- | ---------------------------------------- | ------------ |
| change     | 选中值发生变化时触发                     | 目前的选中值 |
| clear      | 可清空的单选模式下用户点击清空按钮时触发 | ——           |

## Slots

| Event Name | Description        |
| ---------- | ------------------ |
| option     | 自定义下拉选项展示 |
| empty      | 无选项时的列表     |

## Example

import MobileSelect from 'mobile-select-mini'
import 'mobile-select-mini/dist/index.css'
app.component('MobileSelect', MobileSelect)
<template>
<MobileSelect v-model='type'></MobileSelect>
</template>
