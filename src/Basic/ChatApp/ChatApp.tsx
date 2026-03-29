import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./ChatApp.module.css";
import { 
  Plus, 
  Mic, 
  Smile, 
  Send,
  X,
  FileText,
  Image as ImageIcon,
  Headphones,
  User as UserIcon,
  BarChart2,
  Sticker,
  Trash2,
  Pause,
  Play,
  ArrowLeft,
  MessageCircle,
  Pin,
  Star,
  MoreVertical,
  Paperclip,
  Check,
  CheckCheck,
  Search,
  Info,
  Reply,
  Copy,
  Forward,
  Pencil,
  CheckSquare,
  Calendar,
  UserPlus,
  BellOff,
  History,
  Heart,
  List,
  LogOut
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { io, Socket } from "socket.io-client";
import { useJobitoAuth } from "../../context/AuthContext";
// import EmojiPicker from "emoji-picker-react"; // TEMPORARILY DISABLED

const s = styles as Record<string, string>;

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// ─── Real-time Wave Visualizer (Canvas) ──────────────────────────────
interface RealWaveVisualizerProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  blobScale: number;
}

const RealWaveVisualizer: React.FC<RealWaveVisualizerProps> = ({ canvasRef, blobScale }) => (
  <div className={s.visualizerWrapper}>
    <motion.div 
      className={s.recorderBlob} 
      animate={{ scale: blobScale }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    />
    <canvas ref={canvasRef} className={s.visualizerCanvas} width={300} height={40} />
  </div>
);

// ─── Voice Message ──────────────────────────────────────────────────────────
interface VoiceMessageProps {
  duration: string | number;
  avatar?: string | null;
  audioUrl?: string;
  senderName?: string;
  timestamp?: string;
  isOutgoing?: boolean;
}

const VoiceMessage: React.FC<VoiceMessageProps> = ({ duration, avatar, audioUrl, senderName, timestamp, isOutgoing }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  return (
    <div className={s.voiceMessageWhatsApp}>
      {!isOutgoing && <span className={s.voiceSenderName}>{senderName || 'Contact'}</span>}
      
      <div className={s.voiceMainContent}>
        <button className={s.voicePlayBtn} onClick={togglePlay}>
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>

        <div className={s.voiceWaveformArea}>
          <div className={s.voiceWaveformBars}>
            <div className={s.voiceBarDot} />
            <div className={s.voiceBarDot} />
            {[...Array(18)].map((_, i) => (
              <div 
                key={i} 
                className={`${s.voiceBarNormal} ${progress > (i / 18) * 100 ? s.active : ''}`} 
                style={{ height: `${Math.random() * 12 + 6}px` }} 
              />
            ))}
            <div className={s.voiceBarDot} />
            <div className={s.voiceBarDot} />
          </div>
          <div className={s.voiceProgressDot} style={{ left: `${progress}%` }} />
        </div>

        <div className={s.voiceAvatarRight}>
          <img src={getAvatarUrl(avatar) || "https://i.pravatar.cc/150?u=default"} className={s.voiceLargeAvatar} alt="" />
          <div className={s.voiceMicBadge}><Mic size={12} fill="currentColor" /></div>
        </div>

        <div className={s.voiceContextArrow}>
           <Search size={14} style={{transform: 'rotate(90deg)', opacity: 0.5}} />
        </div>
      </div>

      <div className={s.voiceMetaRow}>
        <span className={s.voiceDuration}>{isPlaying ? formatTime(audioRef.current?.currentTime || 0) : duration}</span>
        <span className={s.voiceTime}>{timestamp}</span>
      </div>

      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={getAvatarUrl(audioUrl)} 
          onTimeUpdate={handleTimeUpdate}
          onEnded={() => { setIsPlaying(false); setProgress(0); }} 
        />
      )}
    </div>
  );
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatMessageTime(date: string | Date | undefined) {
  if (!date) return ''; // fallback
  const d = new Date(date);
  if (isNaN(d.getTime())) return ''; // valid date check
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();
}

function formatTimeRelative(date: string | Date | undefined) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const oneMin = 60 * 1000;
  const oneHour = 60 * oneMin;
  const oneDay = 24 * oneHour;

  if (diff < oneMin) return 'just now';
  if (diff < oneHour) return `${Math.floor(diff / oneMin)} mins ago`;
  if (diff < oneDay) {
    const hours = Math.floor(diff / oneHour);
    if (hours === 1) return '1 hour ago';
    return `${hours} hours ago`;
  }
  if (diff < 2 * oneDay) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
}

function getAvatarUrl(path: string | undefined | null) {
  if (!path) return undefined;
  if (path.startsWith("http") || path.startsWith("data:")) return path;
  return `${API}${path.startsWith("/") ? "" : "/"}${path}`;
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

interface ChatContact {
  oderId: string;
  name: string;
  avatar: string | null;
  email: string;
  lastMessage: string;
  lastTime: string;
  senderId: string;
  unreadCount: number;
}

interface MessageItem {
  _id: string;
  senderId: string;
  recipientId: string;
  message?: string;
  type: string;
  audioUrl?: string;
  duration?: number;
  isRead: boolean;
  clientId?: string;
  createdAt: string;
}

interface UserSearchResult {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  email: string;
}

// ─── Main Component ─────────────────────────────────────────────────────────
interface ChatAppProps {
  setShowHeader?: (value: boolean) => void;
}

const ChatApp: React.FC<ChatAppProps> = ({ setShowHeader }) => {
  const { user, apiFetch } = useJobitoAuth();
  const myUserId = user?.id || '';

  // State
  const [chats, setChats] = useState<ChatContact[]>([]);
  const [activeChat, setActiveChat] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [showSearchSidebar, setShowSearchSidebar] = useState(false);
  const [sidebarSearchQuery, setSidebarSearchQuery] = useState("");
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [newChatQuery, setNewChatQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [blobScale, setBlobScale] = useState(1);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const shouldSendRef = useRef(false);

  // Audio Context & Analyser Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Refs
  const areaRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const chatSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeChatRef = useRef<ChatContact | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [fileCaption, setFileCaption] = useState("");

  // Message context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; msgId: string; isMe: boolean; msgText: string } | null>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep ref in sync with state
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  // ─── Header visibility ────────────────────────────────────────────────
  useEffect(() => {
    if (setShowHeader) {
      setShowHeader(true);
      return () => setShowHeader(true);
    }
  }, [setShowHeader]);

  // ─── Browser Error Capture ──────────────────────────────────────────
  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      console.error("GLOBAL ERROR DETECTED:", e.message, e.filename, e.lineno);
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // ─── Socket.IO Setup ──────────────────────────────────────────────────
  useEffect(() => {
    if (!myUserId) return;
    console.log("🔌 Initializing Socket Connection for:", myUserId);

    const socket = io(API, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🔌 WebSocket connected:', socket.id);
      socket.emit('join_user', { userId: myUserId });
    });

    socket.on('new_p2p_message', (msg: MessageItem) => {
      const currentChat = activeChatRef.current;
      const isRelevant = currentChat && (
        (msg.senderId === myUserId && msg.recipientId === currentChat.oderId) ||
        (msg.senderId === currentChat.oderId && msg.recipientId === myUserId)
      );

      if (isRelevant) {
        setMessages(prev => {
          // 1. Exact match by real ID (already persisted)
          if (prev.find(m => m._id === msg._id)) return prev;

          // 2. ClientId-based replacement (The robust way)
          if (msg.clientId) {
            const tempMatch = prev.find(m => m.clientId === msg.clientId);
            if (tempMatch) {
              return prev.map(m => m.clientId === msg.clientId ? msg : m);
            }
          }

          // 3. Prevent duplication based on text/sender (Fallback if clientId is missing on old msg)
          if (msg.senderId === myUserId && msg.type === 'text') {
             const contentMatch = prev.find(m => 
               m._id.startsWith('temp_') && 
               (m.message?.trim() || '') === (msg.message?.trim() || '')
             );
             if (contentMatch) {
               return prev.map(m => m._id === contentMatch._id ? msg : m);
             }
          }

          // 4. Default append
          return [...prev, msg];
        });
      }

      // Refresh chat list (sidebar) for last message/time updates
      loadChats();
    });

    socket.on('messages_read', (payload: { readBy: string }) => {
      if (activeChatRef.current && payload.readBy === activeChatRef.current.oderId) {
        setMessages(prev => prev.map(m => ({ ...m, isRead: true })));
      }
      loadChats(); // Refresh unread counts in sidebar
    });

    return () => {
      socket.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myUserId]);

  // ─── Load Chats ───────────────────────────────────────────────────────
  const loadChats = useCallback(async () => {
    if (!myUserId) return;
    try {
      const res = await apiFetch(`${API}/chat/my-chats/${myUserId}`);
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (err) {
      console.error('Failed to load chats:', err);
    } finally {
      setLoading(false);
    }
  }, [myUserId, apiFetch]);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  // ─── Load Messages ────────────────────────────────────────────────────
  const loadMessages = useCallback(async (otherId: string) => {
    if (!myUserId) return;
    setMessagesLoading(true);
    try {
      const res = await apiFetch(`${API}/chat/p2p/history?userId=${myUserId}&otherId=${otherId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setMessagesLoading(false);
    }
  }, [myUserId, apiFetch]);

  // ─── Mark as read ─────────────────────────────────────────────────────
  const markRead = useCallback(async (otherId: string) => {
    if (!myUserId) return;
    try {
      await apiFetch(`${API}/chat/p2p/read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: myUserId, otherId }),
      });
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  }, [myUserId, apiFetch]);

  // ─── Select Chat ──────────────────────────────────────────────────────
  const selectChat = useCallback((chat: ChatContact) => {
    setActiveChat(chat);
    setMobileChatOpen(true);
    loadMessages(chat.oderId);
    markRead(chat.oderId);
    // Update local unread count
    setChats(prev => prev.map(c => c.oderId === chat.oderId ? { ...c, unreadCount: 0 } : c));
  }, [loadMessages, markRead]);

  // ─── Auto-scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    if (areaRef.current) {
      areaRef.current.scrollTop = areaRef.current.scrollHeight;
    }
  }, [messages]);

  // ─── Send Text Message ────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!inputText.trim() || !activeChat || !myUserId) return;
    
    const content = inputText.trim();
    setInputText("");

    const clientId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Optimistic update
    const tempMsg: MessageItem = {
      _id: clientId, // Use clientId as temp _id
      clientId: clientId,
      senderId: myUserId,
      recipientId: activeChat.oderId,
      message: content,
      type: 'text',
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const res = await apiFetch(`${API}/chat/p2p`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: myUserId,
          recipientId: activeChat.oderId,
          content,
          type: 'text',
          clientId: clientId
        }),
      });
      if (res.ok) {
        // We rely on the socket listener (new_p2p_message) 
        // to replace our 'temp' message with the real one from the server.
        loadChats(); 
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  // ─── File Uploads (Images/Documents) ──────────────────────────────────
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setShowAttachMenu(false);

    // Create preview
    if (file.type.startsWith('image/')) {
      setFilePreviewUrl(URL.createObjectURL(file));
    } else {
      setFilePreviewUrl(null);
    }
  };

  const confirmFileUpload = async () => {
    if (!selectedFile || !activeChat || !myUserId) return;

    setUploadingFile(true);

    const isImage = selectedFile.type.startsWith('image/');
    const type = isImage ? 'image' : 'file';

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${API}/chat/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData,
      });
      const { url } = await response.json();

      // Send the file message
      const res = await apiFetch(`${API}/chat/p2p`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: myUserId,
          recipientId: activeChat.oderId,
          content: url, // Message text stores the URL for files
          type,
        }),
      });

      if (res.ok) {
        // We DON'T setMessages here manually anymore. 
        // The server will emit new_p2p_message via socket, 
        // and our socket listener will add it to the list.
        
        // If there's a caption, send it as a separate text message
        if (fileCaption.trim() !== '') {
          const capRes = await apiFetch(`${API}/chat/p2p`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              senderId: myUserId,
              recipientId: activeChat.oderId,
              content: fileCaption.trim(), 
              type: 'text',
            }),
          });
          if (capRes.ok) {
             // Successfully sent caption
          }
        }
        
        loadChats(); // Refresh chat list
      }
    } catch (err) {
      console.error('Failed to upload file:', err);
    } finally {
      setUploadingFile(false);
      setSelectedFile(null);
      setFilePreviewUrl(null);
      setFileCaption("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const cancelFileUpload = () => {
    setSelectedFile(null);
    setFilePreviewUrl(null);
    setFileCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Voice Recording ─────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 1. Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      // 2. Setup Web Audio API for Visualizer
      const AudioCtx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
      if (!AudioCtx) {
        console.warn("Audio Context not supported");
      } else {
        const audioCtx = new AudioCtx();
        const analyser = audioCtx.createAnalyser();
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 256;
        
        audioCtxRef.current = audioCtx;
        analyserRef.current = analyser;

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        // 3. Setup Drawing Loop
        const draw = () => {
          if (!analyserRef.current || !canvasRef.current) return;
          animationFrameRef.current = requestAnimationFrame(draw);
          
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Calculate volume for blob scaling
          let sum = 0;
          for(let i=0; i<bufferLength; i++) sum += dataArray[i];
          const average = sum / bufferLength;
          setBlobScale(1 + (average / 120));

          // Draw Waveform on Canvas
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          const barWidth = (canvas.width / bufferLength) * 2;
          let x = 0;

          for(let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * canvas.height;
            const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
            gradient.addColorStop(0, '#3b82f6');
            gradient.addColorStop(1, '#60a5fa');
            ctx.fillStyle = gradient;
            ctx.fillRect(x, canvas.height - barHeight, barWidth - 1, barHeight);
            x += barWidth;
          }
        };
        draw();
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        if (shouldSendRef.current && activeChatRef.current) {
          const clientId = `temp_${Date.now()}_voice`;
          const durationSeconds = recordingTime;

          // Optimistic update for voice
          const tempVoice: MessageItem = {
            _id: clientId,
            clientId,
            senderId: myUserId!,
            recipientId: activeChatRef.current.oderId,
            type: 'voice',
            audioUrl: URL.createObjectURL(audioBlob), // Local preview for immediate feedback
            duration: durationSeconds,
            isRead: false,
            createdAt: new Date().toISOString()
          };
          setMessages(prev => [...prev, tempVoice]);

          const formData = new FormData();
          formData.append('file', audioBlob, 'voice.webm');
          formData.append('senderId', myUserId);
          formData.append('recipientId', activeChatRef.current.oderId);
          formData.append('duration', durationSeconds.toString());
          formData.append('clientId', clientId);

          try {
             await apiFetch(`${API}/chat/upload-audio`, {
              method: 'POST',
              body: formData,
            });
            // Reliability: Rely on new_p2p_message socket event to replace temp message.
            loadChats();
          } catch (err) {
            console.error("Failed to upload audio:", err);
            // Error handling: removing the temp message might be better if it failed,
            // but for now, we'll keep the logic consistent.
          }
        }
      };

      mediaRecorder.start();
      draw(); // Start visualization
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Please allow microphone access to record.");
    }
  };

  const stopRecording = (send: boolean = true) => {
    shouldSendRef.current = send;
    
    // Stop MediaRecorder
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }

    // Stop Visualization
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (audioCtxRef.current) audioCtxRef.current.close();
    
    audioCtxRef.current = null;
    analyserRef.current = null;
    setBlobScale(1);

    if (timerRef.current) window.clearInterval(timerRef.current);
    setIsRecording(false);
  };

  // ─── Search Users for New Chat ────────────────────────────────────────
  const searchUsers = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchingUsers(true);
    try {
      const res = await apiFetch(`${API}/chat/search-users?q=${encodeURIComponent(query)}&currentUserId=${myUserId}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.error('Failed to search users:', err);
    } finally {
      setSearchingUsers(false);
    }
  }, [myUserId, apiFetch]);

  useEffect(() => {
    if (chatSearchTimerRef.current) clearTimeout(chatSearchTimerRef.current);
    chatSearchTimerRef.current = setTimeout(() => {
      searchUsers(newChatQuery);
    }, 300);
    return () => { if (chatSearchTimerRef.current) clearTimeout(chatSearchTimerRef.current); };
  }, [newChatQuery, searchUsers]);

  const startChatWithUser = (selectedUser: UserSearchResult) => {
    const newContact: ChatContact = {
      oderId: selectedUser.userId,
      name: selectedUser.fullName,
      avatar: selectedUser.avatarUrl,
      email: selectedUser.email,
      lastMessage: '',
      lastTime: new Date().toISOString(),
      senderId: myUserId,
      unreadCount: 0,
    };
    
    // Check if already exists
    const exists = chats.find(c => c.oderId === selectedUser.userId);
    if (exists) {
      selectChat(exists);
    } else {
      setChats(prev => [newContact, ...prev]);
      selectChat(newContact);
    }
    setShowNewChatModal(false);
    setNewChatQuery("");
    setSearchResults([]);
  };

  // ─── Message Context Menu ────────────────────────────────────────────
  const handleMessageContextMenu = (e: React.MouseEvent, msg: MessageItem, isMe: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    const x = e.clientX;
    const y = e.clientY;
    setContextMenu({ x, y, msgId: msg._id, isMe, msgText: msg.message || '' });
  };

  const handleMessageTouchStart = (msg: MessageItem, isMe: boolean) => {
    longPressTimer.current = setTimeout(() => {
      // Use center of screen for mobile
      setContextMenu({ x: window.innerWidth / 2 - 140, y: window.innerHeight / 2 - 200, msgId: msg._id, isMe, msgText: msg.message || '' });
    }, 500);
  };

  const handleMessageTouchEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  const closeContextMenu = () => setContextMenu(null);

  const handleCopyMessage = () => {
    if (contextMenu?.msgText) {
      navigator.clipboard.writeText(contextMenu.msgText);
    }
    closeContextMenu();
  };

  const handleDeleteMessage = async () => {
    if (!contextMenu) return;
    const msgId = contextMenu.msgId;
    closeContextMenu();
    // Optimistic delete
    setMessages(prev => prev.filter(m => m._id !== msgId));
    try {
      await apiFetch(`${API}/chat/p2p/${msgId}`, { method: 'DELETE' });
      loadChats();
    } catch (err) {
      console.error('Failed to delete message:', err);
      // Reload messages on failure
      if (activeChat) loadMessages(activeChat.oderId);
    }
  };

  const handleReactToMessage = (emoji: string) => {
    // TODO: implement reaction API
    console.log('React with', emoji, 'to', contextMenu?.msgId);
    closeContextMenu();
  };

  // ─── Filter chats by sidebar search ───────────────────────────────────
  const filteredChats = chats.filter(c => 
    (c.name || '').toLowerCase().includes((sidebarSearchQuery || '').toLowerCase()) ||
    (c.email || '').toLowerCase().includes((sidebarSearchQuery || '').toLowerCase())
  );

  // ─── No user? ─────────────────────────────────────────────────────────
  if (!myUserId) {
    return (
      <div className={s.chatContainer}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#667781', fontSize: '18px' }}>
          <MessageCircle size={24} style={{ marginRight: 10 }} /> Please login to use the chat
        </div>
      </div>
    );
  }

  return (
    <div className={s.chatContainer} onClick={() => {
      setShowAttachMenu(false);
      setShowHeaderMenu(false);
      closeContextMenu();
    }}>
      <div className={s.contentWrapper}>
        {/* ─── Sidebar ─────────────────────────────────────────────────── */}
        <aside className={`${s.sidebar} ${mobileChatOpen ? s.sidebarHiddenMobile : ''}`}>
          <header style={{display:'flex', justifyContent:'space-between', padding:'20px 16px 0', alignItems:'center'}}>
            <h2 style={{fontSize: 20, fontWeight: 700, margin: 0}}>Messages</h2>
            <Plus size={20} style={{cursor: 'pointer', color: '#6b7280'}} onClick={() => setShowNewChatModal(true)} />
          </header>
          
          <div className={s.searchSection}>
            <div className={s.searchContainer}>
              <Search size={18} className={s.searchIcon} />
              <input 
                type="text" 
                placeholder="Search messages" 
                value={sidebarSearchQuery}
                onChange={e => setSidebarSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className={s.chatList}>
            {loading ? (
              <div className={s.loadingState}>
                <div className={s.loadingPulse} />
                <div className={s.loadingPulse} />
                <div className={s.loadingPulse} />
              </div>
            ) : filteredChats.length === 0 ? (
              <div className={s.emptyChats}>
                <MessageCircle size={48} color="#d1d7db" />
                <p>No conversations yet</p>
                <button className={s.newChatBtn} onClick={() => setShowNewChatModal(true)}>
                  <Plus size={16} /> Start a new chat
                </button>
              </div>
            ) : (
              filteredChats.map(chat => (
                <div 
                  key={chat.oderId} 
                  className={`${s.chatItem} ${activeChat?.oderId === chat.oderId ? s.active : ""}`} 
                  onClick={() => selectChat(chat)}
                >
                  {chat.avatar ? (
                    <img src={getAvatarUrl(chat.avatar)} alt="" className={s.avatar} />
                  ) : (
                    <div className={s.avatarPlaceholder}>
                      {getInitials(chat.name)}
                    </div>
                  )}
                  <div className={s.chatDetails}>
                    <div className={s.chatTop}>
                      <span className={s.chatName}>
                        {chat.name}
                        {chat.unreadCount > 0 && <span className={s.unreadDot} />}
                      </span>
                      <span className={s.chatTime}>{formatTimeRelative(chat.lastTime)}</span>
                    </div>
                    <div className={s.chatBottom}>
                      <span className={s.lastMessage}>
                        {chat.lastMessage || 'Start a conversation'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* ─── Main Chat Area ──────────────────────────────────────────── */}
        <main className={`${s.main} ${mobileChatOpen ? s.mainVisibleMobile : ''}`}>
          {activeChat ? (
            <>
              <div className={s.mainBackground} />
              <header className={s.mainHeader}>
                <div className={s.headerLeft}>
                  <ArrowLeft size={24} className={s.backArrow} onClick={() => setMobileChatOpen(false)} style={{cursor:'pointer'}} />
                  {activeChat.avatar ? (
                    <img src={getAvatarUrl(activeChat.avatar)} alt="" className={s.headerAvatar} style={{width: 36, height: 36}} />
                  ) : (
                    <div className={s.avatarPlaceholder} style={{width: 36, height: 36, fontSize: 13}}>
                      {getInitials(activeChat.name)}
                    </div>
                  )}
                  <div className={s.headerInfo}>
                    <h3 style={{display:'flex', alignItems:'center', gap: 6}}>{activeChat?.name}</h3>
                    <p>{activeChat?.email || 'Online'}</p>
                  </div>
                </div>
                <div className={s.headerActions}>
                  <Pin size={18} style={{cursor: 'pointer'}} />
                  <Star size={18} style={{cursor: 'pointer'}} />
                  <MoreVertical size={18} onClick={(e) => { e.stopPropagation(); setShowHeaderMenu(!showHeaderMenu); }} style={{cursor: 'pointer'}} />
                </div>

                <AnimatePresence>
                  {showHeaderMenu && (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`${s.dropdownMenu} ${s.headerDropdown}`}>
                       <div className={s.menuItem}><div className={s.menuIcon}><UserPlus size={18} /></div>Add member</div>
                       <div className={s.menuItem}><div className={s.menuIcon}><Info size={18} /></div>Contact info</div>
                       <div className={s.menuItem}><div className={s.menuIcon}><CheckSquare size={18} /></div>Select messages</div>
                       <div className={s.menuItem}><div className={s.menuIcon}><BellOff size={18} /></div>Mute notifications</div>
                       <div className={s.menuItem}><div className={s.menuIcon}><History size={18} /></div>Disappearing messages</div>
                       <div className={s.menuItem}><div className={s.menuIcon}><Heart size={18} /></div>Add to favourites</div>
                       <div className={s.menuItem}><div className={s.menuIcon}><List size={18} /></div>Add to list</div>
                       <div className={s.menuItem}><div className={s.menuIcon}><LogOut size={18} /></div>Close chat</div>
                       <div className={s.menuItem}><div className={s.menuIcon}><Trash2 size={18} /></div>Clear chat</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </header>

              <div className={s.messagesArea} ref={areaRef}>
                {messagesLoading ? (
                  <div className={s.messagesLoadingState}>
                    <div className={s.spinner} />
                    <span>Loading messages...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className={s.emptyMessages}>
                    <div className={s.emptyMessagesIcon}>🔐</div>
                    <h4>End-to-end encrypted</h4>
                    <p>Messages are secured. Start by saying hello!</p>
                  </div>
                ) : (
                  <>
                    <div className={s.chatBeginning}>
                       {activeChat.avatar ? (
                         <img src={getAvatarUrl(activeChat.avatar)} alt="" className={s.chatBeginningAvatar} />
                       ) : (
                         <div className={s.avatarPlaceholder} style={{width: 80, height: 80, fontSize: 30}}>{getInitials(activeChat.name)}</div>
                       )}
                       <h2>{activeChat?.name}</h2>
                       <p className={s.subtitle}>{activeChat?.email}</p>
                       <p className={s.notice}>This is the very beginning of your direct message with <strong>{activeChat?.name}</strong></p>
                    </div>
                    <div className={s.dateSeparator}><span className={s.dateTag}>Today</span></div>
                    
                    <div className={s.messagesListAnchor}>
                      {messages.map((msg) => {
                        const isMe = msg.senderId === myUserId;
                        return (
                          <div 
                            key={msg._id} 
                            className={`${s.messageRow} ${isMe ? s.outgoing : s.incoming}`}
                          >
                            {!isMe && (
                              activeChat?.avatar ? (
                                <img src={getAvatarUrl(activeChat.avatar)} alt="" className={s.messageAvatar} />
                              ) : (
                                <div className={s.messageAvatarPlaceholder}>{getInitials(activeChat?.name || "?")}</div>
                              )
                            )}
                            
                            <div className={s.messageMeta}>
                              <div className={s.bubble}
                                onContextMenu={(e) => handleMessageContextMenu(e, msg, isMe)}
                                onTouchStart={() => handleMessageTouchStart(msg, isMe)}
                                onTouchEnd={handleMessageTouchEnd}
                                onTouchMove={handleMessageTouchEnd}
                              >
                                {!isMe && msg.type !== 'voice' && <span className={s.voiceSenderName} style={{marginBottom: 4, display: 'block'}}>{activeChat?.name}</span>}
                                {msg.type === 'voice' ? (
                                  <VoiceMessage 
                                    duration={msg.duration ? formatTime(msg.duration) : '0:00'} 
                                    avatar={isMe ? user?.avatar : activeChat?.avatar} 
                                    audioUrl={msg.audioUrl} 
                                    senderName={isMe ? "You" : (activeChat?.name || "Contact")}
                                    timestamp={formatMessageTime(msg.createdAt)}
                                    isOutgoing={isMe}
                                  />
                                ) : msg.type === 'image' ? (
                                  <div style={{ padding: '2px' }}>
                                    <img src={getAvatarUrl(msg.message)} alt="Chat attachment" style={{ maxWidth: '100%', borderRadius: '12px', maxHeight: '350px', objectFit: 'contain', display: 'block' }} />
                                  </div>
                                ) : msg.type === 'file' ? (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', backgroundColor: 'rgba(0,0,0,0.04)', borderRadius: '12px' }}>
                                    <div style={{width: 40, height: 40, borderRadius: '8px', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
                                      <FileText size={20} color="#3b82f6" />
                                    </div>
                                    <div style={{display:'flex', flexDirection:'column', gap: 2}}>
                                       <a href={getAvatarUrl(msg.message)} target="_blank" rel="noreferrer" style={{ color: isMe ? '#fff' : '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: 500, wordBreak: 'break-all' }}>
                                         View Document
                                       </a>
                                       <span style={{fontSize: 11, opacity: 0.7}}>{msg.message?.split('/').pop()?.slice(-20)}</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className={s.bubbleContent}>{msg.message}</div>
                                )}
                                
                                {msg.type !== 'voice' && (
                                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4}}>
                                    <span className={s.msgTime} style={{marginTop: 0}}>{formatMessageTime(msg.createdAt)}</span>
                                    {isMe && (msg.isRead ? <CheckCheck size={14} color="#ffffff" style={{opacity: 0.9}} /> : <Check size={14} color="#ffffff" style={{opacity: 0.7}} />)}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {isMe && (
                              user?.avatar ? (
                                <img src={getAvatarUrl(user.avatar)} alt="" className={s.messageAvatar} />
                              ) : (
                                <div className={s.messageAvatarPlaceholder}>{getInitials(user?.name || "Me")}</div>
                              )
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* ─── Message Context Menu ───────────────────────────────── */}
              <AnimatePresence>
                {contextMenu && (
                  <motion.div
                    className={s.contextMenuOverlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeContextMenu}
                  >
                    <motion.div
                      className={s.contextMenuContainer}
                      style={{ top: contextMenu.y, left: contextMenu.x }}
                      initial={{ opacity: 0, scale: 0.85, y: -8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: -8 }}
                      transition={{ duration: 0.15 }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Emoji reactions bar */}
                      <div className={s.contextReactions}>
                        {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
                          <button
                            key={emoji}
                            className={s.reactionBtn}
                            onClick={() => handleReactToMessage(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                        <button className={s.reactionBtnPlus} onClick={() => handleReactToMessage('+')}>
                          <Plus size={18} />
                        </button>
                      </div>
                      {/* Menu items */}
                      <div className={s.contextMenuItems}>
                        <div className={s.contextMenuItem} onClick={closeContextMenu}>
                          <Info size={18} /><span>Message info</span>
                        </div>
                        <div className={s.contextMenuItem} onClick={closeContextMenu}>
                          <Reply size={18} /><span>Reply</span>
                        </div>
                        <div className={s.contextMenuItem} onClick={handleCopyMessage}>
                          <Copy size={18} /><span>Copy</span>
                        </div>
                        <div className={s.contextMenuItem} onClick={closeContextMenu}>
                          <Forward size={18} /><span>Forward</span>
                        </div>
                        <div className={s.contextMenuItem} onClick={closeContextMenu}>
                          <Pin size={18} /><span>Pin</span>
                        </div>
                        <div className={s.contextMenuItem} onClick={closeContextMenu}>
                          <Star size={18} /><span>Star</span>
                        </div>
                        {contextMenu.isMe && (
                          <div className={s.contextMenuItem} onClick={closeContextMenu}>
                            <Pencil size={18} /><span>Edit</span>
                          </div>
                        )}
                        <div className={s.contextMenuItem} onClick={closeContextMenu}>
                          <CheckSquare size={18} /><span>Select</span>
                        </div>
                        <div className={`${s.contextMenuItem} ${s.contextMenuDanger}`} onClick={handleDeleteMessage}>
                          <Trash2 size={18} /><span>Delete</span>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <footer className={s.footer} style={{position: 'relative'}}>
                {isRecording ? (
                  <div className={s.inputBar} style={{width: '100%', display: 'flex', alignItems: 'center', gap: 15}}>
                     <Trash2 className={s.footerIcon} size={20} onClick={() => stopRecording(false)} style={{color: '#ef4444'}} />
                     <div style={{width: 10, height: 10, borderRadius: '50%', backgroundColor: '#ef4444', animation: 'pulse 1s infinite alternate'}} />
                     <div style={{fontWeight: 500}}>{formatTime(recordingTime)}</div>
                     <RealWaveVisualizer canvasRef={canvasRef} blobScale={blobScale} />
                  </div>
                ) : (
                  <>
                    <div className={s.inputBar}>
                      <Paperclip size={20} className={s.footerIcon} onClick={(e) => { e.stopPropagation(); setShowAttachMenu(!showAttachMenu); setShowEmojiPicker(false); }} />
                      <AnimatePresence>
                        {showAttachMenu && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className={s.dropdownMenu} style={{bottom: 70, left: 40}}>
                             <div className={s.menuItem} onClick={() => fileInputRef.current?.click()}><FileText color="#7f66ff" size={18} /> Document</div>
                             <div className={s.menuItem} onClick={() => fileInputRef.current?.click()}><ImageIcon color="#007bfc" size={18} /> Photos & videos</div>
                             <div className={s.menuItem}><ImageIcon color="#ff2e74" size={18} /> Camera</div>
                             <div className={s.menuItem}><Headphones color="#ff7f35" size={18} /> Audio</div>
                             <div className={s.menuItem}><UserIcon color="#009de2" size={18} /> Contact</div>
                             <div className={s.menuItem}><BarChart2 color="#ffbc38" size={18} /> Poll</div>
                             <div className={s.menuItem}><Sticker color="#00c0cb" size={18} /> New sticker</div>
                             <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <input 
                        type="text" 
                        placeholder={uploadingFile ? "Uploading..." : "Reply message"} 
                        value={inputText} 
                        onChange={(e) => setInputText(e.target.value)} 
                        onKeyDown={(e) => e.key === "Enter" && !uploadingFile && sendMessage()} 
                        disabled={uploadingFile}
                      />
                      <div style={{ position: 'relative' }}>
                        <Smile size={20} className={s.footerIcon} onClick={(e) => { e.stopPropagation(); setShowEmojiPicker(p => !p); setShowAttachMenu(false); }} />
                        {/* EmojiPicker Temporarily Disabled */}
                      </div>
                    </div>
                  </>
                )}
                
                <button className={s.sendBtn} onClick={() => {
                  if (isRecording) stopRecording(true);
                  else if (inputText.trim()) sendMessage();
                  else startRecording();
                }}>
                  {isRecording || inputText.trim() ? <Send size={20} /> : <Mic size={20} />}
                </button>
              </footer>
            </>
          ) : (
            // No chat selected
            <div className={s.noChatSelected}>
              <div className={s.noChatIcon}>
                <MessageCircle size={80} strokeWidth={1} color="#d1d7db" />
              </div>
              <h2>Jobito Chat</h2>
              <p>Send and receive messages with other users. <br/> Select a conversation or start a new one.</p>
              <button className={s.newChatBtn} onClick={() => setShowNewChatModal(true)}>
                <Plus size={18} /> New Chat
              </button>
            </div>
          )}
          
          {/* ─── File Preview Overlay ────────────────────────────────────── */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div 
                className={s.filePreviewOverlay}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <header className={s.previewHeader}>
                  <X size={26} className={s.previewCloseIcon} onClick={cancelFileUpload} />
                  <span className={s.previewFileName}>{selectedFile.name}</span>
                </header>
                
                <div className={s.previewContent}>
                  {filePreviewUrl ? (
                    <img src={filePreviewUrl} alt="Preview" className={s.previewImage} />
                  ) : (
                    <div className={s.previewNoImage}>
                      <FileText size={80} color="#8696a0" />
                      <p>No preview available</p>
                      <span>{(selectedFile.size / 1024).toFixed(2)} KB - {selectedFile.type || 'Document'}</span>
                    </div>
                  )}
                </div>

                <div className={s.previewFooter}>
                  <div className={s.previewInputWrapper}>
                    <input 
                      type="text" 
                      placeholder="Type a message" 
                      value={fileCaption} 
                      onChange={(e) => setFileCaption(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && confirmFileUpload()}
                    />
                  </div>
                  
                  <div className={s.previewSendArea}>
                    <div className={s.previewThumb}>
                       {filePreviewUrl ? (
                         <img src={filePreviewUrl} alt="thumb" />
                       ) : (
                         <FileText size={20} color="#ffffff" />
                       )}
                    </div>
                    
                    <button 
                      className={s.previewSendBtn} 
                      onClick={confirmFileUpload}
                      disabled={uploadingFile}
                    >
                      {uploadingFile ? <div className={s.spinnerSmall} /> : <Send size={24} color="#ffffff" />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </main>

        {/* ─── Search Messages Sidebar ─────────────────────────────────── */}
        <AnimatePresence>
          {showSearchSidebar && (
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "tween" }} className={s.searchSidebar}>
              <header className={s.searchSidebarHeader}>
                 <X size={20} onClick={() => setShowSearchSidebar(false)} style={{cursor: 'pointer'}} />
                 <h3>Search messages</h3>
              </header>
              <div className={s.searchSidebarContent}>
                 <div className={s.searchSidebarInputArea}>
                    <Calendar size={20} className={s.footerIcon} />
                    <div className={s.sidebarSearchInputBox}>
                       <Search size={16} className={s.searchIcon} />
                       <input type="text" placeholder="Search" />
                    </div>
                 </div>
                 <div className={s.searchEmptyState}>Search for messages within {activeChat?.name || 'this chat'}.</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ─── New Chat Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {showNewChatModal && (
          <motion.div 
            className={s.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowNewChatModal(false)}
          >
            <motion.div 
              className={s.newChatModal}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
            >
              <header className={s.modalHeader}>
                <div className={s.backIcon} onClick={() => setShowNewChatModal(false)}>
                  <ArrowLeft size={20} />
                </div>
                <h3>New Chat</h3>
              </header>
              <div className={s.modalSearch}>
                <div className={s.modalSearchBox}>
                  <Search size={18} />
                  <input 
                    type="text" 
                    placeholder="Search users by name or email..." 
                    value={newChatQuery}
                    onChange={e => setNewChatQuery(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <div className={s.modalResults}>
                {searchingUsers ? (
                  <div className={s.modalLoading}><div className={s.spinner} /></div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(u => (
                    <div key={u.userId} className={s.userSearchItem} onClick={() => startChatWithUser(u)}>
                      {u.avatarUrl ? (
                        <img src={getAvatarUrl(u.avatarUrl)} alt="" className={s.avatar} />
                      ) : (
                        <div className={s.avatarPlaceholder}>{getInitials(u.fullName)}</div>
                      )}
                      <div className={s.userSearchInfo}>
                        <span className={s.userSearchName}>{u.fullName}</span>
                        <span className={s.userSearchEmail}>{u.email}</span>
                      </div>
                    </div>
                  ))
                ) : newChatQuery.length >= 2 ? (
                  <div className={s.modalEmpty}>No users found</div>
                ) : (
                  <div className={s.modalEmpty}>Type at least 2 characters to search</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatApp;
