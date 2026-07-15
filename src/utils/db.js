// Simulated LocalStorage Database for Personal Link Hub

const DEFAULT_PROFILES = {
  creative_mind: {
    name: "Dilnoza Olimova",
    bio: "UI/UX Designer | Digital Artist | Visual Storyteller. Ranglar va shakllar orqali his-tuyg'ularni tasvirlayman.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
    socials: {
      instagram: "https://instagram.com",
      telegram: "https://t.me",
      linkedin: "https://linkedin.com",
      youtube: "https://youtube.com",
      github: ""
    },
    links: [
      { id: "link-1", title: "Mening Portfoliom (Behance)", url: "https://behance.net", icon: "Palette", active: true },
      { id: "link-2", title: "Yangi Dizayn Kursi (YouTube)", url: "https://youtube.com", icon: "Play", active: true },
      { id: "link-3", title: "Maslahat olish uchun Telegram", url: "https://t.me", icon: "MessageCircle", active: true },
      { id: "link-4", title: "Dizayn Materiallari to'plami", url: "https://drive.google.com", icon: "Download", active: true }
    ],
    theme: "neon-sunset",
    customBg: "",
    seoTitle: "Dilnoza Olimova | Shaxsiy Portfolio & Havolalar",
    seoDescription: "UI/UX dizayner Dilnoza Olimovaning barcha foydali havolalari va portfoliolariga shu yerdan o'ting."
  },
  tech_guru: {
    name: "Rustam Qodirov",
    bio: "Software Engineer & Tech Creator. Coding, Tech & AI. Har kuni dasturlash va sun'iy intellekt bo'yicha qiziqarli postlar ulashaman!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
    socials: {
      instagram: "",
      telegram: "https://t.me",
      linkedin: "https://linkedin.com",
      youtube: "https://youtube.com",
      github: "https://github.com"
    },
    links: [
      { id: "link-1", title: "Mening GitHub Repozitoriylarim", url: "https://github.com", icon: "Github", active: true },
      { id: "link-2", title: "Bepul Dasturlash Darslari", url: "https://youtube.com", icon: "Tv", active: true },
      { id: "link-3", title: "Telegram Kanalim (Tech Postlar)", url: "https://t.me", icon: "Send", active: true },
      { id: "link-4", title: "Mening Shaxsiy Blogim", url: "https://medium.com", icon: "FileText", active: true },
      { id: "link-5", title: "Ish bo'yicha bog'lanish (Resume)", url: "https://linkedin.com", icon: "Mail", active: true }
    ],
    theme: "glass-dark",
    customBg: "",
    seoTitle: "Rustam Qodirov | Dasturlash va AI Havolalari",
    seoDescription: "Rustam Qodirovning dasturlash darslari, kodlari va shaxsiy havolalari portali."
  }
};

const DEFAULT_USERS = {
  creative_mind: { username: "creative_mind", email: "dilnoza@example.com", password: "password123" },
  tech_guru: { username: "tech_guru", email: "rustam@example.com", password: "password123" }
};

const DEFAULT_ANALYTICS = {
  creative_mind: {
    views: 342,
    clicks: { "link-1": 156, "link-2": 98, "link-3": 44, "link-4": 23 }
  },
  tech_guru: {
    views: 618,
    clicks: { "link-1": 289, "link-2": 194, "link-3": 112, "link-4": 42, "link-5": 21 }
  }
};

// Initialize DB structure
const initDB = () => {
  if (!localStorage.getItem("linkhub_users")) {
    localStorage.setItem("linkhub_users", JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem("linkhub_profiles")) {
    localStorage.setItem("linkhub_profiles", JSON.stringify(DEFAULT_PROFILES));
  }
  if (!localStorage.getItem("linkhub_analytics")) {
    localStorage.setItem("linkhub_analytics", JSON.stringify(DEFAULT_ANALYTICS));
  }
};

initDB();

export const db = {
  // Authentication
  register: (username, email, password) => {
    initDB();
    const users = JSON.parse(localStorage.getItem("linkhub_users") || "{}");
    const normalizedUsername = username.toLowerCase().trim();
    
    if (users[normalizedUsername]) {
      return { success: false, message: "Ushbu foydalanuvchi nomi band. Boshqasini tanlang." };
    }
    
    // Create User
    users[normalizedUsername] = { username: normalizedUsername, email, password };
    localStorage.setItem("linkhub_users", JSON.stringify(users));
    
    // Create Profile
    const profiles = JSON.parse(localStorage.getItem("linkhub_profiles") || "{}");
    profiles[normalizedUsername] = {
      name: username,
      bio: "Mening shaxsiy havolalar portalimga xush kelibsiz!",
      avatar: "",
      socials: { instagram: "", telegram: "", linkedin: "", youtube: "", github: "" },
      links: [],
      theme: "glass-dark",
      customBg: "",
      seoTitle: `${username} | Personal Link Hub`,
      seoDescription: `${username}ning shaxsiy sahifasi va havolalari.`
    };
    localStorage.setItem("linkhub_profiles", JSON.stringify(profiles));
    
    // Create Analytics
    const analytics = JSON.parse(localStorage.getItem("linkhub_analytics") || "{}");
    analytics[normalizedUsername] = { views: 0, clicks: {} };
    localStorage.setItem("linkhub_analytics", JSON.stringify(analytics));
    
    return { success: true, user: users[normalizedUsername] };
  },

  login: (username, password) => {
    initDB();
    const users = JSON.parse(localStorage.getItem("linkhub_users") || "{}");
    const normalizedUsername = username.toLowerCase().trim();
    const user = users[normalizedUsername];
    
    if (!user || user.password !== password) {
      return { success: false, message: "Foydalanuvchi nomi yoki parol xato." };
    }
    
    return { success: true, user };
  },

  // Profile Management
  getProfile: (username) => {
    initDB();
    const profiles = JSON.parse(localStorage.getItem("linkhub_profiles") || "{}");
    const normalizedUsername = username.toLowerCase().trim();
    return profiles[normalizedUsername] || null;
  },

  updateProfile: (username, updatedData) => {
    initDB();
    const profiles = JSON.parse(localStorage.getItem("linkhub_profiles") || "{}");
    const normalizedUsername = username.toLowerCase().trim();
    
    if (!profiles[normalizedUsername]) {
      return { success: false, message: "Profil topilmadi." };
    }
    
    profiles[normalizedUsername] = {
      ...profiles[normalizedUsername],
      ...updatedData
    };
    localStorage.setItem("linkhub_profiles", JSON.stringify(profiles));
    return { success: true, profile: profiles[normalizedUsername] };
  },

  // Analytics
  trackView: (username) => {
    initDB();
    const analytics = JSON.parse(localStorage.getItem("linkhub_analytics") || "{}");
    const normalizedUsername = username.toLowerCase().trim();
    
    if (!analytics[normalizedUsername]) {
      analytics[normalizedUsername] = { views: 0, clicks: {} };
    }
    
    // Add simple duplicate check using sessionStorage to avoid multiple views in a single session
    const viewedKey = `viewed_${normalizedUsername}`;
    if (!sessionStorage.getItem(viewedKey)) {
      analytics[normalizedUsername].views += 1;
      localStorage.setItem("linkhub_analytics", JSON.stringify(analytics));
      sessionStorage.setItem(viewedKey, "true");
    }
  },

  trackClick: (username, linkId) => {
    initDB();
    const analytics = JSON.parse(localStorage.getItem("linkhub_analytics") || "{}");
    const normalizedUsername = username.toLowerCase().trim();
    
    if (!analytics[normalizedUsername]) {
      analytics[normalizedUsername] = { views: 0, clicks: {} };
    }
    if (!analytics[normalizedUsername].clicks) {
      analytics[normalizedUsername].clicks = {};
    }
    
    analytics[normalizedUsername].clicks[linkId] = (analytics[normalizedUsername].clicks[linkId] || 0) + 1;
    localStorage.setItem("linkhub_analytics", JSON.stringify(analytics));
  },

  getAnalytics: (username) => {
    initDB();
    const analytics = JSON.parse(localStorage.getItem("linkhub_analytics") || "{}");
    const normalizedUsername = username.toLowerCase().trim();
    return analytics[normalizedUsername] || { views: 0, clicks: {} };
  },

  // Helper to list all public profiles for home page listing
  getPublicProfiles: () => {
    initDB();
    const profiles = JSON.parse(localStorage.getItem("linkhub_profiles") || "{}");
    return Object.keys(profiles).map(username => ({
      username,
      name: profiles[username].name,
      bio: profiles[username].bio,
      avatar: profiles[username].avatar,
      theme: profiles[username].theme
    }));
  }
};
