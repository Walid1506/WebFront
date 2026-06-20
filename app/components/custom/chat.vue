<template>
  <div class="fixed inset-0 z-[400] flex flex-col" :style="{ backgroundColor: theme.bg }">

    <!-- Header -->
    <div class="flex items-center gap-3 px-4 py-4 border-b border-white/[0.08] backdrop-blur-xl shrink-0" :style="{ backgroundColor: bgAlpha(theme.bg, 0.92) }">
      <button @click="$emit('close')" class="p-2 rounded-xl bg-white/[0.06] text-slate-400 hover:text-white transition shrink-0">
        <UIcon name="i-heroicons-arrow-left" class="text-xl" />
      </button>
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

            <div class="max-w-[75%] flex flex-col gap-0.5" :class="isMine(msg) ? 'items-end' : 'items-start'">
              <!-- Image -->
              <div v-if="msg.media_url" class="rounded-[18px] overflow-hidden border border-white/[0.08] cursor-pointer"
                :class="isMine(msg) ? 'rounded-tr-sm' : 'rounded-tl-sm'"
                @click="viewImage = msg.media_url">
                <img :src="msg.media_url" class="max-w-[220px] max-h-[300px] object-cover block" />
              </div>

              <!-- Texte -->
              <div v-if="msg.content" class="px-4 py-2.5 rounded-[18px] text-sm font-medium leading-relaxed"
                :class="[
                  isMine(msg)
                    ? 'bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-white rounded-tr-sm'
                    : 'bg-white/[0.08] border border-white/[0.08] text-white rounded-tl-sm'
                ]">
                {{ msg.content }}
              </div>

              <span class="text-[10px] text-slate-700 font-bold px-1">{{ formatTime(msg.created_at) }}</span>
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

    <!-- Input -->
    <div class="shrink-0 px-3 py-3 border-t border-white/[0.08] backdrop-blur-xl" :style="{ backgroundColor: bgAlpha(theme.bg, 0.92) }">
      <div class="flex items-end gap-2">
        <!-- Photo -->
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="sendPhoto" />
        <button @click="fileInput?.click()"
          class="w-10 h-10 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center shrink-0 active:scale-90 transition-all">
          <UIcon name="i-heroicons-photo" class="text-slate-400 text-lg" />
        </button>

        <!-- Texte -->
        <div class="flex-1 bg-white/[0.06] border border-white/[0.08] rounded-[20px] px-4 py-2.5 flex items-end gap-2 min-h-[44px]">
          <textarea ref="textareaEl" v-model="newMessage" @keydown.enter.exact.prevent="sendMessage"
            rows="1" placeholder="Message..."
            class="flex-1 bg-transparent text-white text-sm outline-none resize-none placeholder:text-slate-700 leading-relaxed max-h-32"
            @input="autoResize" />
        </div>

        <!-- Envoyer -->
        <button @click="sendMessage" :disabled="!newMessage.trim() || sending"
          class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 active:scale-90 transition-all"
          :class="newMessage.trim() ? 'bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] shadow-lg shadow-[color:var(--accent-solid)]/15' : 'bg-white/[0.04] border border-white/[0.06]'">
          <UIcon name="i-heroicons-paper-airplane" class="text-white text-lg" :class="newMessage.trim() ? '' : 'text-slate-700'" />
        </button>
      </div>
    </div>

    <!-- Viewer image plein écran -->
    <Transition name="fade">
      <div v-if="viewImage" class="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center" @click="viewImage = null">
        <button class="absolute top-5 right-5 p-2 text-white/50 hover:text-white transition">
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
defineEmits(['close'])

const supabase = useSupabaseClient()
const { isOnline } = usePresence()
const config = useRuntimeConfig()

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
let currentUserId = null
let currentUsername = ''
let channel = null

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  currentUserId = user.id

  const { data: profile } = await supabase.from('profiles').select('username, last_seen').eq('id', props.friendId).maybeSingle()
  if (profile?.last_seen) lastSeen.value = formatLastSeen(profile.last_seen)

  const { data: myProfile } = await supabase.from('profiles').select('username').eq('id', user.id).maybeSingle()
  currentUsername = myProfile?.username || user.email?.split('@')[0] || 'Quelqu\'un'

  await fetchMessages()
  await markRead()
  subscribeRealtime()
  scrollToBottom()
})

onUnmounted(() => { channel?.unsubscribe() })

async function fetchMessages() {
  loading.value = true
  const { data } = await supabase.from('messages')
    .select('*')
    .or(`and(sender_id.eq.${currentUserId},receiver_id.eq.${props.friendId}),and(sender_id.eq.${props.friendId},receiver_id.eq.${currentUserId})`)
    .order('created_at', { ascending: true })
  messages.value = data || []
  loading.value = false
}

async function markRead() {
  await supabase.from('messages').update({ read: true })
    .eq('sender_id', props.friendId).eq('receiver_id', currentUserId).eq('read', false)
}

function subscribeRealtime() {
  channel = supabase.channel(`chat-${[currentUserId, props.friendId].sort().join('-')}`)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'messages',
      filter: `receiver_id=eq.${currentUserId}`
    }, async payload => {
      if (payload.new.sender_id === props.friendId) {
        messages.value.push(payload.new)
        await markRead()
        scrollToBottom()
      }
    })
    .subscribe()
}

async function sendMessage() {
  const content = newMessage.value.trim()
  if (!content || sending.value) return
  sending.value = true
  newMessage.value = ''
  if (textareaEl.value) textareaEl.value.style.height = 'auto'

  const { data } = await supabase.from('messages').insert({
    sender_id: currentUserId,
    receiver_id: props.friendId,
    content
  }).select().single()

  if (data) {
    messages.value.push(data)
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
  if (uploadError) { sendingPhoto.value = false; return }

  const { data: { publicUrl } } = supabase.storage.from('chat-photos').getPublicUrl(path)

  const { data } = await supabase.from('messages').insert({
    sender_id: currentUserId,
    receiver_id: props.friendId,
    media_url: publicUrl
  }).select().single()

  if (data) {
    messages.value.push(data)
    scrollToBottom()
    triggerPush({ receiver_id: props.friendId, content: null, media_url: publicUrl })
  }
  sendingPhoto.value = false
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesEl.value) messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  })
}

function isMine(msg) { return msg.sender_id === currentUserId }

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
</style>
