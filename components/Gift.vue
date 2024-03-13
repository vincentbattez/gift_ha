<script lang="ts" setup>

defineProps<{
  color: "blue" | "red" | "green"
  code: string
}>()


</script>

<template>
  <div class="flex align-center justify-center">
    <div class="relative">
      <button
        class="btn p-2 bg-gray-200 absolute w-[145%] h-[145%] flex justify-center items-center rounded-full"
        :class="`btn--${color}`"
      >
        <div class="lock flex item-center justify-center">
          <img src="~assets/icons/lock.svg" class="w-4">
        </div>
      </button>
      <div class="gift-icon" :class="`gift-icon--${color}`"/>
    </div>
  </div>
</template>

<style scoped>
.btn {
  transform: translateX(-50%) translateY(-50%);
  left: 50%;
  top: 50%;
  @apply transition-all duration-1000 ease-out;
}
.btn--red {
  background-color: rgba(230,140,140,0.6);
}
.btn--red .lock {
  background-color: #E95050;
}
.btn--blue {
  background-color: rgb(0, 87, 216, 0.6);
}
.btn--blue .lock {
  background-color: #0057D8;
}
.btn--green {
  background-color: rgba(160,225,155,0.6);
}
.btn--green .lock {
  background-color: #6de072;
}
.gift-icon {
  width: 76px;
  height: 76px;
  display: inline-block;
  background: url('/icons/gift_red.svg') no-repeat 100% center;
}
.gift-icon--red {
  background: url('/icons/gift_red.svg') no-repeat 100% center;
}
.gift-icon--blue {
  background: url('/icons/gift_blue.svg') no-repeat 100% center;
}
.gift-icon--green {
  background: url('/icons/gift_green.svg') no-repeat 100% center;
}
.lock {
  @apply transition-all duration-1000 ease-out;
  width: 4rem;
  height: 4rem;
  border-radius: 100%;
  position: absolute;
  transform: translateX(-50%) translateY(-50%);
  left: 50%;
  top: 50%;
}
</style>
