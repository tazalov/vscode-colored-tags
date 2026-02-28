<script setup>
import { ref } from 'vue'
const message = ref('Dev example doc')
</script>

<template>
  <h1>{{ message }}</h1>
  <div>
        <section class="test">
            <!-- VUE comment -->
            <article id="root">
                <p>Some content</p>
            </article>
            <img/><br/>
            <br/>
        </section>
    </div>
</template>