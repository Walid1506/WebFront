<template>
  <!-- Mascotte FitTrack : un chat roux qui fait coucou et « dit » le mot de la bulle -->
  <svg class="cat" viewBox="0 0 200 212" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Chat mascotte qui te félicite">
    <g class="cat-bob">
      <!-- Ombre -->
      <ellipse cx="100" cy="203" rx="60" ry="7" fill="#000" opacity="0.28" />

      <!-- Queue -->
      <g class="tail">
        <path d="M136 190 C 178 190, 192 152, 174 124 C 166 112, 152 114, 157 127" fill="none" stroke="#7A3E17" stroke-width="23" stroke-linecap="round" />
        <path d="M136 190 C 178 190, 192 152, 174 124 C 166 112, 152 114, 157 127" fill="none" stroke="#F4A259" stroke-width="16" stroke-linecap="round" />
        <path d="M174 124 C 166 112, 152 114, 157 127" fill="none" stroke="#D9782F" stroke-width="16" stroke-linecap="round" />
      </g>

      <!-- Corps -->
      <path d="M58 194 Q54 138 100 126 Q146 138 142 194 Z" fill="#F4A259" stroke="#7A3E17" stroke-width="3.5" stroke-linejoin="round" />
      <ellipse cx="100" cy="168" rx="25" ry="23" fill="#FFE8CC" />
      <path d="M68 152 q6 4 4 12 M132 152 q-6 4 -4 12" fill="none" stroke="#D9782F" stroke-width="4" stroke-linecap="round" />

      <!-- Pattes du bas -->
      <ellipse cx="82" cy="194" rx="14" ry="8.5" fill="#FFE8CC" stroke="#7A3E17" stroke-width="3.5" />
      <ellipse cx="118" cy="194" rx="14" ry="8.5" fill="#FFE8CC" stroke="#7A3E17" stroke-width="3.5" />

      <!-- Patte levée qui fait coucou -->
      <g class="paw">
        <path d="M126 148 L154 108" stroke="#7A3E17" stroke-width="24" stroke-linecap="round" />
        <path d="M126 148 L154 108" stroke="#F4A259" stroke-width="17" stroke-linecap="round" />
        <circle cx="156" cy="102" r="13" fill="#FFE8CC" stroke="#7A3E17" stroke-width="3.5" />
        <ellipse cx="156" cy="106" rx="5" ry="4" fill="#F59EB0" />
        <circle cx="149.5" cy="98" r="2.4" fill="#F59EB0" />
        <circle cx="156" cy="95.5" r="2.4" fill="#F59EB0" />
        <circle cx="162.5" cy="98" r="2.4" fill="#F59EB0" />
      </g>

      <!-- Tête -->
      <g class="head">
        <path d="M54 66 L61 16 L99 46 Z" fill="#F4A259" stroke="#7A3E17" stroke-width="3.5" stroke-linejoin="round" />
        <path d="M63 57 L66.5 30 L88 47 Z" fill="#F59EB0" />
        <path d="M146 66 L139 16 L101 46 Z" fill="#F4A259" stroke="#7A3E17" stroke-width="3.5" stroke-linejoin="round" />
        <path d="M137 57 L133.5 30 L112 47 Z" fill="#F59EB0" />

        <ellipse cx="100" cy="83" rx="58" ry="48" fill="#F4A259" stroke="#7A3E17" stroke-width="3.5" />
        <path d="M100 37 v11 M87 39.5 l2.5 9 M113 39.5 l-2.5 9" stroke="#D9782F" stroke-width="4.5" stroke-linecap="round" />

        <ellipse cx="100" cy="102" rx="25" ry="16" fill="#FFE8CC" />

        <!-- Yeux (clignent) -->
        <g class="eye">
          <ellipse cx="76" cy="80" rx="10" ry="12.5" fill="#2B1B12" />
          <circle cx="79.5" cy="75" r="4" fill="#fff" />
          <circle cx="72.5" cy="85.5" r="1.8" fill="#fff" />
        </g>
        <g class="eye">
          <ellipse cx="124" cy="80" rx="10" ry="12.5" fill="#2B1B12" />
          <circle cx="127.5" cy="75" r="4" fill="#fff" />
          <circle cx="120.5" cy="85.5" r="1.8" fill="#fff" />
        </g>

        <ellipse cx="59" cy="99" rx="9" ry="5.5" fill="#FF7D98" opacity="0.45" />
        <ellipse cx="141" cy="99" rx="9" ry="5.5" fill="#FF7D98" opacity="0.45" />

        <!-- Moustaches -->
        <path d="M60 99 L30 92 M60 105 L28 107 M140 99 L170 92 M140 105 L172 107" stroke="#7A3E17" stroke-width="2.2" stroke-linecap="round" opacity="0.55" />

        <!-- Nez et bouche ouverte (elle bouge quand le chat parle) -->
        <path d="M93.5 92 Q100 88 106.5 92 Q103.5 98.5 100 99.5 Q96.5 98.5 93.5 92 Z" fill="#F59EB0" stroke="#7A3E17" stroke-width="2" stroke-linejoin="round" />
        <g class="mouth" :class="{ talking }">
          <path d="M91 104.5 Q100 123 109 104.5 Q100 108.5 91 104.5 Z" fill="#6B2323" stroke="#7A3E17" stroke-width="2" stroke-linejoin="round" />
          <ellipse cx="100" cy="114" rx="5.5" ry="3.6" fill="#F59EB0" />
        </g>
        <path d="M100 99.5 Q100 104.5 94 105.5 M100 99.5 Q100 104.5 106 105.5" fill="none" stroke="#7A3E17" stroke-width="2.2" stroke-linecap="round" />
      </g>

      <!-- Étincelles de fête autour de la patte -->
      <path class="spark s1" d="M178 70 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 Z" fill="#FFD166" />
      <path class="spark s2" d="M140 60 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#fff" />
      <path class="spark s3" d="M186 112 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z" fill="#FF8FB1" />
    </g>
  </svg>
</template>

<script setup>
defineProps({
  // Bouche qui s'ouvre et se ferme quelques fois à l'apparition : le chat « dit » le mot
  talking: { type: Boolean, default: true }
})
</script>

<style scoped>
.cat { overflow: visible; animation: cat-pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both; }
.cat-bob { animation: cat-bob 2.4s ease-in-out 0.9s infinite; }
.tail { transform-box: view-box; transform-origin: 136px 190px; animation: tail-wag 1.3s ease-in-out infinite alternate; }
.paw { transform-box: view-box; transform-origin: 126px 148px; animation: paw-wave 0.45s ease-in-out infinite alternate; }
.eye { transform-box: fill-box; transform-origin: center; animation: blink 3.6s ease-in-out 1.2s infinite; }
.mouth { transform-box: fill-box; transform-origin: 50% 0; transform: scaleY(0.55); }
.mouth.talking { animation: talk 0.26s ease-in-out 0.45s 8 alternate backwards; }
.spark { transform-box: fill-box; transform-origin: center; animation: twinkle 1.4s ease-in-out infinite; }
.s2 { animation-delay: 0.45s; }
.s3 { animation-delay: 0.9s; }

@keyframes cat-pop {
  from { opacity: 0; transform: translateY(40px) scale(0.6); }
  to { opacity: 1; transform: none; }
}
@keyframes cat-bob {
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
  from { transform: scaleY(0.25); }
  to { transform: scaleY(1); }
}
@keyframes twinkle {
  0%, 100% { opacity: 0.2; transform: scale(0.6) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.1) rotate(20deg); }
}

@media (prefers-reduced-motion: reduce) {
  .cat, .cat-bob, .tail, .paw, .eye, .mouth.talking, .spark { animation: none; }
}
</style>
