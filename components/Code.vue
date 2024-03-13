<script lang="ts" setup>
import { HomeAssistantService } from "~/api/homeAssistant.service";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const code1 = ref<number>();
const code2 = ref<number>();
const code3 = ref<number>();
const code4 = ref<number>();
const colorTips = ref<string>();
const stateClass = ref<string>();

const isRedOpened = ref<boolean>(false);
const isBlueOpened = ref<boolean>(false);
const isGreenOpened = ref<boolean>(false);
const showGift = ref<boolean>(false);
const isShaking = ref<boolean>(false);
const beepAudio = ref();
const eveLaughtAudio = ref();
const wallEEveAudio = ref();
const $code1 = ref(null);
const $code2 = ref(null);
const $code3 = ref(null);
const $code4 = ref(null);
const $submit = ref(null);
const $wallE = ref(null);
const $eve = ref(null);

const fullCodeLength = computed(() => {
  // keep only the filled inputs (0 is a valid number)
  return [code1.value, code2.value, code3.value, code4.value].filter((v) => v !== undefined).length;
});

onMounted(() => {
  $code1.value.focus()
  eveLaughtAudio.value = new Audio('/sounds/eve_laught.mp3');
  wallEEveAudio.value = new Audio('/sounds/wall-e-eveeee.mp3');
  beepAudio.value = new Audio('/sounds/beep.mp3');
})

const typingEffect = (text: string, speed: number, reverse: boolean = false) => {
  const textLength = reverse
      ? colorTips.value?.length ?? 0
      : text.length ?? 0;

  return new Promise((resolve) => {
    let i = 0;
    const interval = setInterval(() => {
      if (reverse) {
        colorTips.value = colorTips.value?.slice(0, textLength - i);
      } else {
        colorTips.value = text.slice(0, i);
      }
      i++;
      if (i > textLength) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
};

// on code change
watch(fullCodeLength, (length) => {
  $wallE.value.style.left = `${length * 20}px`;
  $eve.value.style.right = `-${length * 8}px`;
  if (length === 4) {
    wallEEveAudio.value.play();
    isShaking.value = true;
  } else {
    isShaking.value = false;
  }
});


const onCodeKeyup = (e, nextCode) => {
  beepAudio.value.play();

  if (e.target.value !== '') {
    if (nextCode) {
      nextCode.focus();
    }
  }
}

const codeRed = '2111';
const codeBlue = '0824';
const codeGreen = '1903';

const colorTipsRed = "Dans la couleur de la passion et des cœurs entrelacés, tu trouveras un contenant pour nos souvenirs les plus précieux.";
const colorTipsBlue = "Sous un ciel serein et dans la teinte de la concentration, découvre l'outil qui t'accompagnera dans ta quête de savoir."; // @todo
const colorTipsGreen = "Sur le chemin verdoyant de l'existence, cherche celui qui veille sur tes échanges et protège chaque souvenir partagé."; // @todo

const onSubmit = async () => {
  typingEffect('', 15, true);
  showGift.value = false;
  stateClass.value = 'loading'
  eveLaughtAudio.value.play();

  switch ([code1.value, code2.value, code3.value, code4.value].join('')) {
    case codeRed:
      // 🔴
      HomeAssistantService.triggerEvent('gift_loading_success');
      await wait(11000)
      stateClass.value = 'success'
      typingEffect(colorTipsRed, 50);
      await wait(6500)
      showGift.value = true
      break;
    case codeBlue:
      // 🔵
      HomeAssistantService.triggerEvent('gift_loading_success');
      await wait(11000)
      stateClass.value = 'success'
      typingEffect(colorTipsBlue, 50);
      await wait(5000) // @todo
      showGift.value = true
      break;
    case codeGreen:
      // 🟢
      HomeAssistantService.triggerEvent('gift_loading_success');
      await wait(11000)
      stateClass.value = 'success'
      typingEffect(colorTipsGreen, 50);
      await wait(5000) // @todo
      showGift.value = true
      break;
    default:
      // invalid code
      HomeAssistantService.triggerEvent('gift_loading_fail');
      await wait(11000)
      stateClass.value = 'fail'

      // focus on the first input
      $code1.value.focus();
      break;
  }
};

const onChooseGift = async (openingCode: string, color: string) => {
  if (openingCode !== [code1.value, code2.value, code3.value, code4.value].join('')) {
    console.log('❌')
    HomeAssistantService.triggerEvent('gift_chest_opening_fail');
    await wait(8000);
    // @todo fail
    return;
  }
  console.log('✅')
  HomeAssistantService.triggerEvent(`gift_chest_opening_success_${color}`);
  await wait(10000);
  color === 'red'
      ? isRedOpened.value = true
      : color === 'blue'
          ? isBlueOpened.value = true
          : isGreenOpened.value = true;

  await wait(1000);
  showGift.value = false;
  code1.value = undefined;
  code2.value = undefined;
  code3.value = undefined;
  code4.value = undefined;
  stateClass.value = '';
};
</script>

<template>
  <div class="flex justify-center">
    <img
        ref="$wallE"
        src="~/assets/images/wall-e.png"
        class="h-32 relative transition-all duration-1000 ease-out z-10 left-0"
        :class="{ shaking: isShaking }"
    />
    <img
        ref="$eve"
        src="~/assets/images/eve.png"
        class="h-24 relative transition-all duration-1000 ease-out right-0"
    />
  </div>

  <form>
    <div class="flex justify-center mb-4 mt-4" :class="stateClass">
      <input
        v-on:keyup="onCodeKeyup($event, $code2)"
        v-model.number="code1"
        ref="$code1"
        type="number"
        inputmode="decimal"
        class="code-item"
        min="0"
        max="9"
      />
      <input
        v-on:keyup="onCodeKeyup($event, $code3)"
        v-model.number="code2"
        ref="$code2"
        type="number"
        inputmode="decimal"
        class="code-item"
        min="0"
        max="9"
      />
      <input
        v-on:keyup="onCodeKeyup($event, $code4)"
        v-model.number="code3"
        ref="$code3"
        type="number"
        inputmode="decimal"
        class="code-item"
        min="0"
        max="9"
      />
      <input
        v-on:keyup="onCodeKeyup($event, $submit)"
        v-model.number="code4"
        ref="$code4"
        type="number"
        inputmode="decimal"
        class="code-item"
        min="0"
        max="9"
      />
      <button
          @click.prevent="onSubmit"
          ref="$submit"
          type="submit"
          class="code-submit bg-gray-500 text-white px-4 rounded-md"
      >
        <span class="loader" />
        <img class="key" src="~/assets/icons/key.svg">
      </button>
    </div>

    <!-- Indice Couleur -->
    <p class="font-serif italic text-center w-4/5 mx-auto">
      {{colorTips}}
    </p>

    <div class="gift-list flex justify-center mt-10">
      <TransitionGroup name="fade">
        <Gift v-if="showGift || isRedOpened" :class="{ opened: isRedOpened }" @click.prevent="onChooseGift(codeRed, 'red')" color="red" />
        <Gift v-if="showGift || isBlueOpened" :class="{ opened: isBlueOpened }" @click.prevent="onChooseGift(codeBlue, 'blue')" color="blue" class="mx-10"  />
        <Gift v-if="showGift || isGreenOpened" :class="{ opened: isGreenOpened }" @click.prevent="onChooseGift(codeGreen, 'green')" color="green" />
      </TransitionGroup>
    </div>

  </form>
</template>

<style scoped>
.code-item {
  @apply w-14 h-14 text-4xl text-center bg-gray-100 rounded-md border-b-4 border-gray-500;
  @apply text-gray-500 font-bold text-center;
  @apply transition-all duration-700 ease-in-out;
}
.code-item:not(:last-child) {
  @apply mr-2;
}
.code-submit {
  @apply transition-all duration-700 ease-in-out;
  @apply w-14 h-14;
  @apply relative;
}

.loader, .key {
  position: absolute;
  top: 16px;
  left: 16px;
  @apply transition-all duration-700 ease-in-out;
}

.loader {
  opacity: 0;
  top: 3px;
  left: 1px;
}

.fail .code-item {
  @apply bg-red-100 border-red-500 text-red-500;
}

.fail .code-submit {
  @apply bg-red-500;
}

.success .code-item {
  @apply bg-green-100 border-green-500 text-green-500;
}

.success .code-submit {
  @apply bg-green-500;
}

.loading .code-item {
  @apply bg-gray-100 border-gray-200 text-gray-200;
}

.loading .code-submit {
  @apply bg-blue-500;
}

.loading .loader {
  opacity: 1;
}

.loading .key {
  opacity: 0;
}

.shaking {
  animation: shaking 0.15s infinite;
}

.opened :deep(.btn), .opened :deep(.lock) {
  opacity: 0;
}

@keyframes shaking {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(1px, 1px) rotate(1deg); }
  50% { transform: translate(0, 0) rotate(0); }
  75% { transform: translate(-1px, 1px) rotate(-1deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 1.5s ease-in-out;
  transform: translateY(0);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

/* Loader */
.loader {
  width: 24px;
  height: 24px;
  border: 5px dotted #FFF;
  border-radius: 50%;
  display: inline-block;
  position: relative;
  box-sizing: border-box;
  animation: rotation 2s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
