<template>
  <!-- Mascotte FitTrack : un singe. « fete » : il fait coucou (un bisou en thème Sakura) et dit le mot de la bulle ; « repos » : yeux fermés, il somnole -->
  <svg class="mascot" :class="`mood-${mood}`" viewBox="0 0 200 212" xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="label">
    <g class="mascot-bob">
      <!-- Ombre -->
      <ellipse cx="100" cy="203" rx="60" ry="7" fill="#000" opacity="0.28" />

      <!-- Queue enroulée -->
      <g class="tail">
        <path d="M134 184 C 172 188, 186 156, 170 136 C 160 124, 142 132, 148 146 C 152 155, 164 152, 164 144" fill="none" stroke="#3E2412" stroke-width="16" stroke-linecap="round" />
        <path d="M134 184 C 172 188, 186 156, 170 136 C 160 124, 142 132, 148 146 C 152 155, 164 152, 164 144" fill="none" stroke="#8A5A34" stroke-width="10" stroke-linecap="round" />
      </g>

      <!-- Corps -->
      <path d="M60 194 Q56 140 100 128 Q144 140 140 194 Z" fill="#8A5A34" stroke="#3E2412" stroke-width="3.5" stroke-linejoin="round" />
      <ellipse cx="100" cy="170" rx="26" ry="22" fill="#F4D2A8" />

      <!-- Pieds -->
      <ellipse cx="80" cy="195" rx="15" ry="8" fill="#F4D2A8" stroke="#3E2412" stroke-width="3.5" />
      <ellipse cx="120" cy="195" rx="15" ry="8" fill="#F4D2A8" stroke="#3E2412" stroke-width="3.5" />

      <!-- Bras gauche le long du corps -->
      <path d="M70 146 Q56 164 70 182" fill="none" stroke="#3E2412" stroke-width="16" stroke-linecap="round" />
      <path d="M70 146 Q56 164 70 182" fill="none" stroke="#8A5A34" stroke-width="10" stroke-linecap="round" />
      <circle cx="71" cy="184" r="8" fill="#F4D2A8" stroke="#3E2412" stroke-width="3" />

      <!-- Bras droit : levé pour faire coucou (fête) ou posé sur le ventre (repos). Le bisou le dessine après la tête -->
      <g v-if="waving" class="paw">
        <path d="M128 146 L156 106" stroke="#3E2412" stroke-width="17" stroke-linecap="round" />
        <path d="M128 146 L156 106" stroke="#8A5A34" stroke-width="11" stroke-linecap="round" />
        <circle cx="158" cy="100" r="11" fill="#F4D2A8" stroke="#3E2412" stroke-width="3.5" />
      </g>
      <g v-else-if="!kissing">
        <path d="M130 146 Q144 166 118 172" fill="none" stroke="#3E2412" stroke-width="16" stroke-linecap="round" />
        <path d="M130 146 Q144 166 118 172" fill="none" stroke="#8A5A34" stroke-width="10" stroke-linecap="round" />
        <circle cx="115" cy="172" r="8" fill="#F4D2A8" stroke="#3E2412" stroke-width="3" />
      </g>

      <!-- Tête -->
      <g class="head">
        <circle cx="46" cy="84" r="19" fill="#8A5A34" stroke="#3E2412" stroke-width="3.5" />
        <circle cx="46" cy="84" r="11" fill="#F4D2A8" />
        <circle cx="154" cy="84" r="19" fill="#8A5A34" stroke="#3E2412" stroke-width="3.5" />
        <circle cx="154" cy="84" r="11" fill="#F4D2A8" />

        <ellipse cx="100" cy="80" rx="52" ry="48" fill="#8A5A34" stroke="#3E2412" stroke-width="3.5" />
        <path d="M97 34 C 94 22, 109 20, 109 29 C 109 35, 101 36, 101 30" fill="none" stroke="#3E2412" stroke-width="3" stroke-linecap="round" />

        <!-- Visage clair (deux cercles autour des yeux + museau) -->
        <circle cx="84" cy="78" r="22" fill="#F4D2A8" />
        <circle cx="116" cy="78" r="22" fill="#F4D2A8" />
        <ellipse cx="100" cy="104" rx="36" ry="24" fill="#F4D2A8" />

        <!-- Yeux : ouverts (clignent), clin d'œil (bisou) ou fermés -->
        <template v-if="kissing">
          <ellipse cx="86" cy="80" rx="8.5" ry="10.5" fill="#241510" />
          <circle cx="89" cy="76" r="3.2" fill="#fff" />
          <circle cx="83.5" cy="84.5" r="1.5" fill="#fff" />
          <path d="M106 82 Q114 74 122 82" fill="none" stroke="#241510" stroke-width="3.6" stroke-linecap="round" />
        </template>
        <template v-else-if="waving">
          <g class="eye">
            <ellipse cx="86" cy="80" rx="8.5" ry="10.5" fill="#241510" />
            <circle cx="89" cy="76" r="3.2" fill="#fff" />
            <circle cx="83.5" cy="84.5" r="1.5" fill="#fff" />
          </g>
          <g class="eye">
            <ellipse cx="114" cy="80" rx="8.5" ry="10.5" fill="#241510" />
            <circle cx="117" cy="76" r="3.2" fill="#fff" />
            <circle cx="111.5" cy="84.5" r="1.5" fill="#fff" />
          </g>
        </template>
        <path v-else d="M78 81 Q86 88 94 81 M106 81 Q114 88 122 81" fill="none" stroke="#241510" stroke-width="3.2" stroke-linecap="round" />

        <ellipse cx="72" cy="100" rx="8" ry="5" fill="#F4978E" opacity="0.55" />
        <ellipse cx="128" cy="100" rx="8" ry="5" fill="#F4978E" opacity="0.55" />

        <!-- Narines et bouche (elle bouge quand le singe parle) -->
        <ellipse cx="95" cy="97" rx="2.4" ry="1.7" fill="#6E4424" />
        <ellipse cx="105" cy="97" rx="2.4" ry="1.7" fill="#6E4424" />
        <ellipse v-if="kissing" class="pucker" cx="102" cy="110" rx="7" ry="6" fill="#F28B98" stroke="#6B2323" stroke-width="2.4" />
        <g v-else :key="talkKey" class="mouth" :class="{ talking }">
          <path d="M88 105 Q100 123 112 105 Q100 110 88 105 Z" fill="#6B2323" stroke="#3E2412" stroke-width="2" stroke-linejoin="round" />
          <ellipse cx="100" cy="114" rx="5.5" ry="3.5" fill="#F28B98" />
        </g>
      </g>

      <!-- Bisou (thème Sakura) : la main part de la bouche et envoie des cœurs -->
      <template v-if="kissing">
        <g class="kiss-paw">
          <path d="M128 148 Q152 136 128 116" fill="none" stroke="#3E2412" stroke-width="16" stroke-linecap="round" />
          <path d="M128 148 Q152 136 128 116" fill="none" stroke="#8A5A34" stroke-width="10" stroke-linecap="round" />
          <circle cx="125" cy="111" r="10" fill="#F4D2A8" stroke="#3E2412" stroke-width="3.5" />
        </g>
        <g transform="translate(138 88)"><path class="heart h1" d="M0 3 C -3 -3 -11 -1 -10 5 C -9 10 -4 13 0 17 C 4 13 9 10 10 5 C 11 -1 3 -3 0 3 Z" fill="#FF5FA2" /></g>
        <g transform="translate(152 104)"><path class="heart h2" d="M0 2 C -2 -2 -7 -1 -7 3 C -6 7 -3 9 0 12 C 3 9 6 7 7 3 C 7 -1 2 -2 0 2 Z" fill="#FF8FB1" /></g>
        <g transform="translate(128 76)"><path class="heart h3" d="M0 2 C -2 -2 -7 -1 -7 3 C -6 7 -3 9 0 12 C 3 9 6 7 7 3 C 7 -1 2 -2 0 2 Z" fill="#FFC2D6" /></g>
      </template>

      <!-- Fête : étincelles autour de la main -->
      <template v-else-if="waving">
        <path class="spark s1" d="M180 68 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#FFD166" />
        <path class="spark s2" d="M142 58 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#fff" />
        <path class="spark s3" d="M186 112 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#FF8FB1" />
      </template>
      <!-- Repos : petits « z » qui s'envolent -->
      <g v-else class="zzz" fill="#C7D2FE" font-family="system-ui, sans-serif" font-weight="900">
        <text class="z z1" x="146" y="52" font-size="16">z</text>
        <text class="z z2" x="158" y="38" font-size="20">z</text>
        <text class="z z3" x="172" y="22" font-size="24">Z</text>
      </g>
    </g>
  </svg>
</template>

<script setup>
const props = defineProps({
  mood: { type: String, default: 'fete' },
  // Bouche qui s'ouvre et se ferme quelques fois : le singe « dit » le texte de la bulle
  talking: { type: Boolean, default: true },
  // Change à chaque nouvelle phrase : l'animation de la bouche repart
  talkKey: { type: [Number, String], default: 0 }
})

const { themeId } = useTheme()
const kissing = computed(() => props.mood === 'fete' && themeId.value === 'sakura')
const waving = computed(() => props.mood === 'fete' && !kissing.value)
const label = computed(() => {
  if (props.mood === 'repos') return 'Singe mascotte qui se repose'
  return kissing.value ? 'Singe mascotte qui t\'envoie un bisou' : 'Singe mascotte qui te félicite'
})
</script>

<style scoped>
.mascot { overflow: visible; animation: mascot-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both; }
.mascot-bob { animation: mascot-bob 2.4s ease-in-out 0.9s infinite; }
.mood-repos .mascot-bob { animation-duration: 3.6s; }
.tail { transform-box: view-box; transform-origin: 134px 184px; animation: tail-wag 1.3s ease-in-out infinite alternate; }
.mood-repos .tail { animation-duration: 2.6s; }
.paw { transform-box: view-box; transform-origin: 128px 146px; animation: paw-wave 0.45s ease-in-out infinite alternate; }
.eye { transform-box: fill-box; transform-origin: center; animation: blink 3.6s ease-in-out 1.2s infinite; }
.mouth { transform-box: fill-box; transform-origin: 50% 0; transform: scaleY(0.55); }
.mood-repos .mouth { transform: scaleY(0.3); }
.mouth.talking { animation: talk 0.26s ease-in-out 0.45s 8 alternate backwards; }
.spark { transform-box: fill-box; transform-origin: center; animation: twinkle 1.4s ease-in-out infinite; }
.s2 { animation-delay: 0.45s; }
.s3 { animation-delay: 0.9s; }
.z { opacity: 0; animation: float-z 3s ease-in-out infinite; }
.z2 { animation-delay: 1s; }
.z3 { animation-delay: 2s; }
.kiss-paw { transform-box: view-box; transform-origin: 128px 148px; animation: kiss-throw 2.6s ease-in-out 0.9s infinite; }
.pucker { transform-box: fill-box; transform-origin: center; animation: pucker 2.6s ease-in-out 0.9s infinite; }
.heart { opacity: 0; transform-box: fill-box; transform-origin: center; animation: heart-float 2.6s ease-out 0.9s infinite; }
.h1 { --heart-x: 14px; --heart-y: -58px; }
.h2 { --heart-x: 26px; --heart-y: -38px; animation-delay: 1.15s; }
.h3 { --heart-x: 2px; --heart-y: -48px; animation-delay: 1.4s; }

@keyframes kiss-throw {
  0%, 30%, 100% { transform: rotate(0deg); }
  48%, 62% { transform: rotate(34deg); }
}
@keyframes pucker {
  0%, 100% { transform: scale(1); }
  26% { transform: scale(0.8); }
  42% { transform: scale(1.25); }
  60% { transform: scale(1); }
}
@keyframes heart-float {
  0%, 36% { opacity: 0; transform: translate(0, 0) scale(0.4); }
  50% { opacity: 1; transform: translate(calc(var(--heart-x) * 0.3), calc(var(--heart-y) * 0.3)) scale(1); }
  100% { opacity: 0; transform: translate(var(--heart-x), var(--heart-y)) scale(1.15) rotate(10deg); }
}

@keyframes mascot-pop {
  from { opacity: 0; transform: translateY(40px) scale(0.6); }
  to { opacity: 1; transform: none; }
}
@keyframes mascot-bob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
@keyframes tail-wag {
  from { transform: rotate(-7deg); }
  to { transform: rotate(9deg); }
}
@keyframes paw-wave {
  from { transform: rotate(6deg); }
  to { transform: rotate(-18deg); }
}
@keyframes blink {
  0%, 90%, 100% { transform: scaleY(1); }
  94% { transform: scaleY(0.1); }
}
@keyframes talk {
  from { transform: scaleY(0.2); }
  to { transform: scaleY(1); }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.6) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.1) rotate(20deg); }
}
@keyframes float-z {
  0% { opacity: 0; transform: translate(0, 6px); }
  30% { opacity: 1; }
  100% { opacity: 0; transform: translate(10px, -14px); }
}

@media (prefers-reduced-motion: reduce) {
  .mascot, .mascot-bob, .tail, .paw, .eye, .mouth.talking, .spark, .z, .kiss-paw, .pucker, .heart { animation: none; }
  .z, .heart { opacity: 1; }
}
</style>
