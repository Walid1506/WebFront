<template>
  <!-- Mascotte FitTrack : un singe. « fete » : il fait coucou et dit le mot de la bulle ; « repos » : yeux fermés, il somnole -->
  <svg class="mascot" :class="`mood-${mood}`" viewBox="0 0 200 212" xmlns="http://www.w3.org/2000/svg" role="img" :aria-label="mood === 'repos' ? 'Singe mascotte qui se repose' : 'Singe mascotte qui te félicite'">
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

      <!-- Bras droit : levé pour faire coucou (fête) ou posé sur le ventre (repos) -->
      <g v-if="mood === 'fete'" class="paw">
        <path d="M128 146 L156 106" stroke="#3E2412" stroke-width="17" stroke-linecap="round" />
        <path d="M128 146 L156 106" stroke="#8A5A34" stroke-width="11" stroke-linecap="round" />
        <circle cx="158" cy="100" r="11" fill="#F4D2A8" stroke="#3E2412" stroke-width="3.5" />
      </g>
      <g v-else>
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

        <!-- Yeux : ouverts (clignent) ou fermés -->
        <template v-if="mood === 'fete'">
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
        <g :key="talkKey" class="mouth" :class="{ talking }">
          <path d="M88 105 Q100 123 112 105 Q100 110 88 105 Z" fill="#6B2323" stroke="#3E2412" stroke-width="2" stroke-linejoin="round" />
          <ellipse cx="100" cy="114" rx="5.5" ry="3.5" fill="#F28B98" />
        </g>
      </g>

      <!-- Fête : étincelles autour de la main -->
      <template v-if="mood === 'fete'">
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
defineProps({
  mood: { type: String, default: 'fete' },
  // Bouche qui s'ouvre et se ferme quelques fois : le singe « dit » le texte de la bulle
  talking: { type: Boolean, default: true },
  // Change à chaque nouvelle phrase : l'animation de la bouche repart
  talkKey: { type: [Number, String], default: 0 }
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
  .mascot, .mascot-bob, .tail, .paw, .eye, .mouth.talking, .spark, .z { animation: none; }
  .z { opacity: 1; }
}
</style>
