<template>
  <main class="px-4 py-4 text-center">
    <Toolbar />
    <router-view v-slot="{ Component }">
      <transition>
        <keep-alive exclude="signal">
          <component :is="Component"></component>
        </keep-alive>
      </transition>
    </router-view>
  </main>
</template>
