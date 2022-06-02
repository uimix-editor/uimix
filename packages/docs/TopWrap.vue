<template>
  <top-page></top-page>
  <macaron-editor></macaron-editor>
</template>

<script>
export default {
  mounted() {
    import('./components.macaron')
    import('@macaron-app/editor/dist/webcomponent/main')
  }
}
</script>