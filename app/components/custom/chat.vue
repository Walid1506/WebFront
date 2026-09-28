<template>
  <div class="fixed inset-0 z-[400] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] flex flex-col" :style="{ backgroundColor: theme.bg }">

    <!-- Header -->
    <div class="flex items-center gap-3 px-4 py-4 border-b border-white/[0.08] backdrop-blur-xl shrink-0" :style="{ backgroundColor: bgAlpha(theme.bg, 0.92) }">
      <button @click="$emit('close')" class="p-2 rounded-xl bg-white/[0.06] text-slate-400 hover:text-white transition shrink-0">
        <UIcon name="i-heroicons-arrow-left" class="text-xl" />
      </button>
      <button @click="$emit('open-profile')" class="flex items-center gap-3 flex-1 min-w-0 text-left active:opacity-70 transition-opacity">
        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--accent-from)] to-[var(--accent-to)] p-[2px] shrink-0">
          <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center" :style="{ backgroundColor: theme.bg }">
            <img v-if="friend.avatar_url" :src="friend.avatar_url" class="w-full h-full object-cover" />
            <span v-else class="text-white font-black">{{ friend.username?.charAt(0).toUpperCase() }}</span>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white font-black truncate">{{ friend.username }}</p>
          <p class="text-xs font-bold" :class="isOnline(props.friendId) ? 'text-emerald-400' : 'text-slate-500'">
            {{ isOnline(props.friendId) ? 'En ligne' : (lastSeen ? `Vu ${lastSeen}` : 'Hors ligne') }}
          </p>
        </div>
        <UIcon name="i-heroicons-chevron-right" class="text-slate-700 text-sm shrink-0" />
      </button>
    </div>

    <!-- Messages -->
    <div ref="messagesEl" class="flex-1 overflow-y-auto p-4 space-y-2">
      <div v-if="loading" class="flex justify-center pt-8">
        <div class="w-6 h-6 rounded-full border-2 animate-spin" style="border-color: color-mix(in srgb, var(--accent-solid) 25%, transparent); border-top-color: var(--accent-solid)"></div>
      </div>

      <div v-else-if="messages.length === 0" class="flex flex-col items-center justify-center h-full gap-3 opacity-40">
        <UIcon name="i-heroicons-chat-bubble-left-right" class="text-5xl text-slate-600" />
        <p class="text-slate-500 font-black text-sm">Dis bonjour à {{ friend.username }} !</p>
      </div>

      <template v-else>
        <div v-for="(msg, i) in messages" :key="msg.id">
          <!-- Séparateur de date -->
          <div v-if="showDateSep(i)" class="flex items-center gap-3 my-3">
            <div class="flex-1 h-px bg-white/[0.06]"></div>
            <span class="text-[10px] font-black text-slate-600 uppercase tracking-wider">{{ formatDateSep(msg.created_at) }}</span>
            <div class="flex-1 h-px bg-white/[0.06]"></div>
          </div>

          <!-- Bulle -->
          <div class="flex gap-2" :class="isMine(msg) ? 'flex-row-reverse' : 'flex-row'">
            <!-- Avatar (messages reçus) -->
            <div v-if="!isMine(msg)" class="w-7 h-7 rounded-full bg-gradient-to-tr from-[var(--accent-from)] to-[var(--accent-to)] p-[1.5px] shrink-0 self-end">
              <div class="w-full h-full rounded-full overflow-hidden flex items-center justify-center" :style="{ backgroundColor: theme.bg }">
                <img v-if="friend.avatar_url" :src="friend.avatar_url" class="w-full h-full object-cover" />
                <span v-else class="text-white font-black text-[9px]">{{ friend.username?.charAt(0).toUpperCase() }}</span>
              </div>
            </div>

            <!-- Appui long (ou clic droit) sur un de ses messages : le modifier ou le supprimer -->
            <div
              class="max-w-[75%] flex flex-col gap-0.5"
              :class="isMine(msg) ? 'items-end msg-press' : 'items-start'"
              v-on="isMine(msg) ? pressHandlers(msg) : {}"
            >
              <!-- Audio -->
              <div v-if="msg.media_url && isAudioMsg(msg.media_url)"
                class="rounded-[18px] overflow-hidden border border-white/[0.08] p-2"
                :class="isMine(msg) ? 'rounded-tr-sm' : 'rounded-tl-sm'">
                <audio :src="msg.media_url" controls class="h-9 max-w-[220px]" style="filter: invert(0.8)" />
              </div>

              <!-- Image -->
              <div v-else-if="msg.media_url" class="rounded-[18px] overflow-hidden border border-white/[0.08] cursor-pointer"
                :class="isMine(msg) ? 'rounded-tr-sm' : 'rounded-tl-sm'"
                @click="openImage(msg.media_url)">
                <img :src="msg.media_url" class="max-w-[220px] max-h-[300px] object-cover block" loading="lazy" />
              </div>

              <!-- Texte -->
              <div v-if="msg.content" class="px-4 py-2.5 rounded-[18px] text-sm font-medium leading-relaxed"
                :class="isMine(msg)
                  ? 'bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-white rounded-tr-sm'
                  : 'bg-white/[0.08] border border-white/[0.08] text-white rounded-tl-sm'">
                {{ msg.content }}
              </div>

              <!-- Heure + accusé de réception (mes messages seulement) -->
              <div class="flex items-center gap-1 px-1" :class="isMine(msg) ? 'flex-row-reverse' : ''">
                <span class="text-[10px] text-slate-700 font-bold">{{ formatTime(msg.created_at) }}</span>
                <span v-if="msg.edited_at" class="text-[10px] text-slate-600 font-bold">modifié</span>
                <!-- Accusé de réception -->
                <span v-if="isMine(msg)" class="text-[10px] font-black flex items-center gap-0.5 transition-colors duration-300"
                  :style="{ color: msg.read ? 'var(--accent-solid)' : 'rgba(100,116,139,0.6)' }">
                  <UIcon v-if="msg.read" name="i-heroicons-eye" class="text-xs" />
                  <template v-else>
                    <UIcon name="i-heroicons-check" class="text-xs -mr-1" />
                    <UIcon name="i-heroicons-check" class="text-xs" />
                  </template>
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Indicateur envoi photo -->
      <div v-if="sendingPhoto" class="flex flex-row-reverse gap-2">
        <div class="bg-white/[0.06] rounded-[18px] rounded-tr-sm p-3 flex items-center gap-2">
          <div class="w-4 h-4 rounded-full border-2 animate-spin" style="border-color: color-mix(in srgb, var(--accent-solid) 25%, transparent); border-top-color: var(--accent-solid)"></div>
          <span class="text-slate-500 text-xs font-black">Envoi...</span>
        </div>
      </div>
    </div>

    <!-- Indicateur enregistrement vocal -->
    <Transition name="fade">
      <div v-if="isRecording" class="shrink-0 px-4 py-3 border-t border-white/[0.08] flex items-center gap-3" :style="{ backgroundColor: bgAlpha(theme.bg, 0.92) }">
        <div class="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
        <span class="text-red-400 font-black text-sm flex-1">Enregistrement... {{ recordingDuration }}s</span>
        <button @click="cancelRecording" class="p-2 text-slate-500 hover:text-white transition">
          <UIcon name="i-heroicons-x-mark" class="text-lg" />
        </button>
        <button @click="stopRecording" class="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center active:scale-90 transition-all">
          <UIcon name="i-heroicons-stop" class="text-red-400 text-lg" />
        </button>
      </div>
    </Transition>

    <!-- Input -->
    <div v-if="!isRecording" class="shrink-0 px-3 py-3 border-t border-white/[0.08] backdrop-blur-xl" :style="{ backgroundColor: bgAlpha(theme.bg, 0.92) }">
      <!-- Modification d'un message : son texte est dans la barre, ✓ pour valider -->
      <div v-if="editingMsg" class="flex items-center gap-2 px-1 pb-2">
        <UIcon name="i-heroicons-pencil-square" class="text-base shrink-0" :style="{ color: 'var(--accent-solid)' }" />
        <div class="flex-1 min-w-0">
          <p class="text-xs font-black" :style="{ color: 'var(--accent-solid)' }">Modifier le message</p>
          <p class="text-xs text-slate-500 truncate">{{ editingMsg.content }}</p>
        </div>
        <button @click="cancelEdit" class="p-1.5 text-slate-500 hover:text-white transition shrink-0" aria-label="Annuler la modification">
          <UIcon name="i-heroicons-x-mark" class="text-lg" />
        </button>
      </div>
      <div class="flex items-end gap-2">
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="sendPhoto" />
        <button v-if="!editingMsg" @click="fileInput?.click()"
          class="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 active:scale-90 transition-all">
          <UIcon name="i-heroicons-photo" class="text-slate-400 text-lg" />
        </button>
        <div class="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-[20px] px-4 py-2.5 flex items-end gap-2 min-h-[44px]">
          <textarea ref="textareaEl" v-model="newMessage" @keydown.enter.exact.prevent="editingMsg ? saveEdit() : sendMessage()"
            rows="1" placeholder="Message..."
            class="flex-1 bg-transparent text-white text-sm outline-none resize-none placeholder:text-slate-700 leading-relaxed max-h-32"
            @input="autoResize" />
        </div>
        <!-- Valider la modification, envoyer ou micro -->
        <button v-if="editingMsg" @click="saveEdit" :disabled="sending || !newMessage.trim()" aria-label="Enregistrer la modification"
          class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 active:scale-90 transition-all bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] disabled:opacity-40">
          <UIcon name="i-heroicons-check" class="text-white text-lg" />
        </button>
        <button v-else-if="newMessage.trim()" @click="sendMessage" :disabled="sending"
          class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 active:scale-90 transition-all bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] shadow-lg shadow-[color:var(--accent-solid)]/15">
          <UIcon name="i-heroicons-paper-airplane" class="text-white text-lg" />
        </button>
        <button v-else @click="startRecording"
          class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 active:scale-90 transition-all bg-white/[0.06] border border-white/[0.08]">
          <UIcon name="i-heroicons-microphone" class="text-slate-400 text-lg" />
        </button>
      </div>
    </div>

    <!-- Actions sur un de ses messages -->
    <Transition name="sheet">
      <div v-if="actionMsg" class="fixed inset-0 z-[450] flex items-end justify-center bg-black/50" @click.self="closeActions">
        <div class="sheet-panel w-full max-w-lg rounded-t-[28px] border-t border-white/[0.08] px-4 pt-4 pb-[max(20px,env(safe-area-inset-bottom))] space-y-2" :style="{ backgroundColor: bgAlpha(theme.bg, 0.98) }">
          <p class="text-slate-500 text-sm font-bold px-2 pb-1 truncate">{{ messagePreview(actionMsg) }}</p>
          <button v-if="actionMsg.content && !actionMsg.media_url" @click="startEdit"
            class="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/[0.06] text-white font-black text-sm active:scale-[0.98] transition-transform">
            <UIcon name="i-heroicons-pencil-square" class="text-lg" />
            Modifier
          </button>
          <button @click="confirmDelete ? deleteMessage() : (confirmDelete = true)"
            class="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black text-sm active:scale-[0.98] transition-all"
            :class="confirmDelete ? 'bg-red-500 text-white' : 'bg-red-500/10 text-red-400'">
            <UIcon name="i-heroicons-trash" class="text-lg" />
            {{ confirmDelete ? 'Supprimer pour tout le monde' : 'Supprimer' }}
          </button>
          <button @click="closeActions" class="w-full py-3 rounded-2xl text-slate-400 font-black text-sm">Annuler</button>
        </div>
      </div>
    </Transition>

    <!-- Viewer image plein écran -->
    <Transition name="fade">
      <div v-if="viewImage" class="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center" @click="viewImage = null">
        <button class="absolute top-[calc(1.25rem+env(safe-area-inset-top))] right-5 p-2 text-white/50 hover:text-white transition">
          <UIcon name="i-heroicons-x-mark" class="text-2xl" />
        </button>
        <img :src="viewImage" class="max-w-full max-h-full object-contain rounded-2xl" @click.stop />
      </div>
    </Transition>
  </div>
</template>

<script setup>
const { theme } = useTheme()
function bgAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

const props = defineProps({
  friend: { type: Object, required: true },
  friendId: { type: String, required: true }
})
defineEmits(['close', 'open-profile'])

const supabase = useSupabaseClient()
const { isOnline } = usePresence()

const messages = ref([])
const newMessage = ref('')
const loading = ref(true)
const sending = ref(false)
const sendingPhoto = ref(false)
const lastSeen = ref('')
const viewImage = ref(null)
const messagesEl = ref(null)
const fileInput = ref(null)
const textareaEl = ref(null)
const isRecording = ref(false)
const recordingDuration = ref(0)
let currentUserId = null
let currentUsername = ''
let channel = null
let mediaRecorder = null
let recordingStream = null
let audioChunks = []
let recordingTimer = null
let recordingMimeType = 'audio/webm'

// Actions sur ses propres messages (appui long) : modification et suppression
const actionMsg = ref(null)
const confirmDelete = ref(false)
const editingMsg = ref(null)
let pressTimer = null
let pressStart = null
let suppressClick = false

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  currentUserId = user.id

  const [{ data: profile }, { data: myProfile }] = await Promise.all([
    supabase.from('profiles').select('username, last_seen').eq('id', props.friendId).maybeSingle(),
    supabase.from('profiles').select('username').eq('id', user.id).maybeSingle(),
  ])

  if (profile?.last_seen) lastSeen.value = formatLastSeen(profile.last_seen)
  currentUsername = myProfile?.username || user.email?.split('@')[0] || 'Quelqu\'un'

  await fetchMessages()
  await markRead()
  subscribeRealtime()
  scrollToBottom()
  document.addEventListener('visibilitychange', onVisibilityChange)
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
  channel?.unsubscribe()
  cancelRecording()
})

// Le temps réel ne rejoue pas les messages reçus pendant une coupure (app en arrière-plan sur iOS) :
// on recharge la conversation au retour et à chaque (re)connexion du canal
async function catchUp() {
  await fetchMessages()
  await markRead()
  scrollToBottom()
}

function onVisibilityChange() {
  if (!document.hidden && currentUserId) catchUp()
}

function addMessage(message) {
  if (!messages.value.some(m => m.id === message.id)) messages.value.push(message)
}

async function fetchMessages() {
  const startedAt = Date.now()
  const { data, error } = await supabase.from('messages')
    .select('*')
    .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${props.friendId}),and(sender_id.eq.${props.friendId},receiver_id.eq.${currentUserId})`)
    .order('created_at', { ascending: true })
  loading.value = false
  if (error) {
    console.error('Erreur fetchMessages:', error)
    return
  }
  // Messages arrivés pendant le chargement gardés ; les autres absents de la réponse ont été supprimés
  const ids = new Set(data.map(m => m.id))
  const arrivedMeanwhile = messages.value.filter(m => !ids.has(m.id) && new Date(m.created_at).getTime() > startedAt - 5000)
  messages.value = [...data, ...arrivedMeanwhile]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
}

async function markRead() {
  await supabase.from('messages').update({ read: true })
    .eq('sender_id', props.friendId).eq('receiver_id', currentUserId).eq('read', false)
}

function subscribeRealtime() {
  channel = supabase.channel(`chat-${[currentUserId, props.friendId].sort().join('-')}`)
    // Nouveaux messages reçus
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'messages',
      filter: `receiver_id=eq.${currentUserId}`
    }, async payload => {
      if (payload.new.sender_id === props.friendId) {
        addMessage(payload.new)
        await markRead()
        scrollToBottom()
      }
    })
    // Mes messages passent à "lu" (l'ami a ouvert le chat)
    .on('postgres_changes', {
      event: 'UPDATE', schema: 'public', table: 'messages',
      filter: `sender_id=eq.${currentUserId}`
    }, payload => replaceMessage(payload.new))
    // L'ami a modifié un de ses messages
    .on('postgres_changes', {
      event: 'UPDATE', schema: 'public', table: 'messages',
      filter: `receiver_id=eq.${currentUserId}`
    }, payload => replaceMessage(payload.new))
    // Message supprimé (la suppression ne transmet que l'identifiant)
    .on('postgres_changes', {
      event: 'DELETE', schema: 'public', table: 'messages'
    }, payload => removeMessage(payload.old?.id))
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') catchUp()
    })
}

async function sendMessage() {
  const content = newMessage.value.trim()
  if (!content || sending.value) return
  sending.value = true
  newMessage.value = ''
  if (textareaEl.value) textareaEl.value.style.height = 'auto'

  const { data, error } = await supabase.from('messages').insert({
    sender_id: currentUserId,
    receiver_id: props.friendId,
    content,
    read: false
  }).select().single()

  if (error) {
    console.error('Erreur envoi message:', error)
    if (!newMessage.value) newMessage.value = content
    alert("Message non envoyé. Vérifie ta connexion et réessaie.")
  } else if (data) {
    addMessage(data)
    scrollToBottom()
    triggerPush({ receiver_id: props.friendId, content, media_url: null })
  }
  sending.value = false
}

async function sendPhoto(event) {
  const file = event.target.files?.[0]
  if (!file) return
  sendingPhoto.value = true
  event.target.value = ''

  const ext = file.name.split('.').pop()
  const path = `${currentUserId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage.from('chat-photos').upload(path, file)
  if (uploadError) { sendingPhoto.value = false; alert(`Photo non envoyée : ${uploadError.message}`); return }

  const { data: { publicUrl } } = supabase.storage.from('chat-photos').getPublicUrl(path)

  const { data } = await supabase.from('messages').insert({
    sender_id: currentUserId,
    receiver_id: props.friendId,
    media_url: publicUrl,
    read: false
  }).select().single()

  if (data) {
    addMessage(data)
    scrollToBottom()
    triggerPush({ receiver_id: props.friendId, content: null, media_url: publicUrl })
  }
  sendingPhoto.value = false
}

function replaceMessage(message) {
  const idx = messages.value.findIndex(m => m.id === message.id)
  if (idx !== -1) messages.value[idx] = { ...messages.value[idx], ...message }
}

function removeMessage(id) {
  if (!id) return
  messages.value = messages.value.filter(m => m.id !== id)
  if (editingMsg.value?.id === id) cancelEdit()
}

// Appui long (ou clic droit) sur un de ses messages : feuille « Modifier / Supprimer »
function pressHandlers(msg) {
  return {
    pointerdown: e => startPress(e, msg),
    pointermove: movePress,
    pointerup: cancelPress,
    pointercancel: cancelPress,
    pointerleave: cancelPress,
    contextmenu: (e) => {
      e.preventDefault()
      openActions(msg)
    }
  }
}

function startPress(e, msg) {
  cancelPress()
  pressStart = { x: e.clientX, y: e.clientY }
  pressTimer = setTimeout(() => openActions(msg), 450)
}

// Le doigt bouge : c'est un défilement, pas un appui long
function movePress(e) {
  if (pressStart && Math.hypot(e.clientX - pressStart.x, e.clientY - pressStart.y) > 10) cancelPress()
}

function cancelPress() {
  clearTimeout(pressTimer)
  pressTimer = null
  pressStart = null
}

function openActions(msg) {
  cancelPress()
  // Le relâchement après l'appui long ne doit pas ouvrir la photo en grand
  suppressClick = true
  setTimeout(() => { suppressClick = false }, 500)
  confirmDelete.value = false
  actionMsg.value = msg
}

function closeActions() {
  actionMsg.value = null
  confirmDelete.value = false
}

function openImage(url) {
  if (!suppressClick) viewImage.value = url
}

function messagePreview(msg) {
  if (msg.content) return msg.content
  return isAudioMsg(msg.media_url) ? '🎤 Message vocal' : '📷 Photo'
}

function startEdit() {
  const msg = actionMsg.value
  closeActions()
  if (!msg) return
  editingMsg.value = msg
  newMessage.value = msg.content
  nextTick(() => {
    if (!textareaEl.value) return
    textareaEl.value.focus()
    autoResize({ target: textareaEl.value })
  })
}

function cancelEdit() {
  editingMsg.value = null
  newMessage.value = ''
  if (textareaEl.value) textareaEl.value.style.height = 'auto'
}

async function saveEdit() {
  const msg = editingMsg.value
  const content = newMessage.value.trim()
  if (!msg || !content || sending.value) return
  if (content === msg.content) return cancelEdit()

  sending.value = true
  const { data, error } = await supabase.from('messages')
    .update({ content, edited_at: new Date().toISOString() })
    .eq('id', msg.id).eq('sender_id', currentUserId)
    .select().maybeSingle()
  sending.value = false

  // Aucune ligne renvoyée : la modification a été refusée
  if (error || !data) {
    console.error('Erreur modification message :', error)
    alert("Le message n'a pas pu être modifié. Vérifie ta connexion et réessaie.")
    return
  }
  replaceMessage(data)
  cancelEdit()
}

async function deleteMessage() {
  const msg = actionMsg.value
  closeActions()
  if (!msg) return

  const { data, error } = await supabase.from('messages')
    .delete().eq('id', msg.id).eq('sender_id', currentUserId).select('id')
  if (error || !data?.length) {
    console.error('Erreur suppression message :', error)
    alert("Le message n'a pas pu être supprimé. Vérifie ta connexion et réessaie.")
    return
  }
  removeMessage(msg.id)
  if (msg.media_url) removeMediaFile(msg.media_url)
}

// Photo ou vocal d'un message supprimé : fichier retiré du stockage (sans bloquer si ce n'est pas permis)
function removeMediaFile(url) {
  const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/)
  if (match) supabase.storage.from(match[1]).remove([decodeURIComponent(match[2])])
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  })
}

function isMine(msg) { return msg.sender_id === currentUserId }

function isAudioMsg(url) {
  return url?.includes('chat-audio') || url?.endsWith('.webm') || url?.endsWith('.m4a') || url?.endsWith('.ogg')
}

function getSupportedMimeType() {
  const candidates = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/ogg']
  for (const t of candidates) { if (MediaRecorder.isTypeSupported(t)) return t }
  return ''
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    recordingStream = stream
    audioChunks = []
    const mimeType = getSupportedMimeType()
    recordingMimeType = mimeType || 'audio/webm'
    const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {})
    mr.ondataavailable = (e) => { if (e.data.size > 0) audioChunks.push(e.data) }
    mr.onstop = () => {
      releaseMicrophone()
      uploadAudio()
    }
    mediaRecorder = mr
    mr.start(100)
    isRecording.value = true
    recordingDuration.value = 0
    recordingTimer = setInterval(() => recordingDuration.value++, 1000)
  } catch {
    alert('Microphone non disponible ou refusé.')
  }
}

function stopRecording() {
  if (mediaRecorder && isRecording.value) {
    if (recordingTimer) clearInterval(recordingTimer)
    isRecording.value = false
    mediaRecorder.stop()
    mediaRecorder = null
  }
}

function releaseMicrophone() {
  recordingStream?.getTracks().forEach(t => t.stop())
  recordingStream = null
}

function cancelRecording() {
  if (mediaRecorder) {
    mediaRecorder.ondataavailable = null
    mediaRecorder.onstop = null
    if (mediaRecorder.state !== 'inactive') mediaRecorder.stop()
    mediaRecorder = null
  }
  releaseMicrophone()
  if (recordingTimer) clearInterval(recordingTimer)
  isRecording.value = false
  audioChunks = []
}

async function uploadAudio() {
  if (audioChunks.length === 0) return
  const blob = new Blob(audioChunks, { type: recordingMimeType })
  if (blob.size < 100) return
  sendingPhoto.value = true
  const ext = recordingMimeType.includes('mp4') ? 'm4a' : recordingMimeType.includes('ogg') ? 'ogg' : 'webm'
  const path = `${currentUserId}/${Date.now()}.${ext}`
  const { error } = await supabase.storage.from('chat-audio').upload(path, blob, { contentType: recordingMimeType })
  if (error) {
    sendingPhoto.value = false
    alert(`Vocal non envoyé : ${error.message}`)
    return
  }
  const { data: { publicUrl } } = supabase.storage.from('chat-audio').getPublicUrl(path)
  const { data } = await supabase.from('messages').insert({
    sender_id: currentUserId,
    receiver_id: props.friendId,
    media_url: publicUrl,
    read: false
  }).select().single()
  if (data) {
    addMessage(data)
    scrollToBottom()
    triggerPush({ receiver_id: props.friendId, content: '🎤 Message vocal', media_url: publicUrl })
  }
  sendingPhoto.value = false
}

function autoResize(e) {
  e.target.style.height = 'auto'
  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px'
}

async function triggerPush({ receiver_id, content, media_url }) {
  try {
    const supabaseUrl = useSupabaseClient().supabaseUrl
    await fetch(`${supabaseUrl}/functions/v1/send-push`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}` },
      body: JSON.stringify({ receiver_id, sender_username: currentUsername, content, media_url })
    })
  } catch {}
}

function formatLastSeen(ts) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 60000)
  if (diff < 1) return 'à l\'instant'
  if (diff < 60) return `il y a ${diff} min`
  const h = Math.floor(diff / 60)
  if (h < 24) return `il y a ${h}h`
  return `il y a ${Math.floor(h / 24)}j`
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

function formatDateSep(ts) {
  const d = new Date(ts)
  const today = new Date()
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return "Aujourd'hui"
  if (d.toDateString() === yesterday.toDateString()) return 'Hier'
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
}

function showDateSep(i) {
  if (i === 0) return true
  const prev = new Date(messages.value[i - 1].created_at)
  const curr = new Date(messages.value[i].created_at)
  return prev.toDateString() !== curr.toDateString()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* Appui long sur ses messages : pas de sélection de texte ni de menu iOS (« Copier », « Enregistrer l'image ») */
.msg-press, .msg-press * { -webkit-touch-callout: none; -webkit-user-select: none; user-select: none; }

.sheet-enter-active, .sheet-leave-active { transition: opacity 0.3s ease; }
.sheet-enter-active .sheet-panel, .sheet-leave-active .sheet-panel { transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from .sheet-panel, .sheet-leave-to .sheet-panel { transform: translateY(100%); }
</style>
