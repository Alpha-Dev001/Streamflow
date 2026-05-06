import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

// Enhanced chat responses with more natural variations
const chatResponses = {
  // Greetings and Introductions
  greeting: [
    "Hello! I'm your StreamFlow assistant. How can I help you today?",
    "Hi there! I'm here to help with streaming, content discovery, account management, and technical support. What do you need?",
    "Welcome to StreamFlow! I can assist with streaming setup, audience growth, and platform features. How can I help?",
    "Hey! I'm your StreamFlow expert. Ready to help with streaming, troubleshooting, or account questions. What's on your mind?",
    "Hi! I'm doing great, thanks for asking! I'm here to help you with anything StreamFlow related. What can I assist you with?",
    "Hello! I'm here and ready to help. Whether you need streaming advice or technical support, I've got you covered. What would you like to know?"
  ],

  // Conversational responses
  howAreYou: [
    "I'm doing great, thanks for asking! I'm here to help you with anything StreamFlow related. What can I assist you with?",
    "I'm functioning perfectly and ready to help! I'm your dedicated StreamFlow assistant. What do you need help with today?",
    "Thanks for checking in! I'm here to help you succeed on StreamFlow. What can I do for you?",
    "I'm excellent! Always ready to help with streaming, account questions, or technical issues. What's on your mind?"
  ],

  farewell: [
    "Goodbye! Feel free to come back anytime if you need help with StreamFlow. Have a great day!",
    "See you later! I'm always here if you need streaming advice or technical support. Take care!",
    "Bye! Don't hesitate to reach out if you need help with your StreamFlow journey. Happy streaming!",
    "Take care! Remember I'm here 24/7 to help with any StreamFlow questions. See you soon!"
  ],

  // General system/platform inquiries
  system: [
    "StreamFlow is a comprehensive streaming platform that combines powerful broadcasting tools with community features. You can stream high-quality content, engage with your audience through live chat, and grow your channel with our analytics tools. What specific aspect would you like to explore?",
    "StreamFlow offers professional streaming capabilities with real-time interaction, content discovery, and monetization options. Our platform supports HD streaming, audience analytics, and community building tools. What would you like to know more about?",
    "StreamFlow is your all-in-one streaming solution! We provide live broadcasting tools, audience engagement features, content discovery algorithms, and comprehensive analytics. Whether you're a creator or viewer, there's something for everyone. What interests you most?"
  ],

  content: [
    "StreamFlow offers diverse content across gaming, creative arts, music, education, lifestyle, and entertainment categories. You can discover live streams, recorded content, highlights, and community posts. Our algorithm helps you find content tailored to your interests. What type of content are you looking for?",
    "On StreamFlow, you'll find everything from gaming streams and creative art sessions to music performances and educational content. Creators share live experiences, while viewers can interact through real-time chat and virtual gifts. What content categories interest you most?",
    "StreamFlow's content ecosystem includes live broadcasting, video-on-demand, highlight clips, and community posts. Creators can share their passions while building engaged communities. What kind of content would you like to explore or create?"
  ],

  live: [
    "Going live on StreamFlow is easy! Just ensure you have a good internet connection (5+ Mbps upload), test your camera and microphone, then click 'Start Streaming' from your dashboard. You can configure quality settings, add a title and tags, and engage with your audience through live chat. Would you like a step-by-step setup guide?",
    "Live streaming on StreamFlow supports HD quality up to 1080p60fps with real-time chat interaction. You'll need a modern browser, camera/mic permissions, and stable internet. Our platform provides analytics, audience tools, and monetization options. Are you looking to start your first stream or improve your current setup?",
    "StreamFlow's live streaming feature includes professional broadcasting tools, real-time audience engagement, and performance analytics. You can stream in various quality tiers, use custom overlays, and interact through live chat. What specific aspect of live streaming would you like help with?"
  ],

  video: [
    "StreamFlow supports both live streaming and video-on-demand content. You can broadcast live in HD quality, save your streams for later viewing, create highlight clips, and build a content library. Our platform handles video processing, transcoding, and delivery automatically. What type of video content are you interested in?",
    "Video on StreamFlow includes live broadcasting, recorded streams, highlight reels, and uploaded content. We support various resolutions from 480p to 4K, with adaptive bitrate for optimal viewing. Creators can manage their video library and analyze performance. Would you like to know more about streaming or video management?",
    "StreamFlow's video capabilities encompass live streaming, VOD hosting, clip creation, and content discovery. Our platform ensures smooth playback across devices with quality optimization. Whether you're creating or watching, we provide tools for the best video experience. What specific video feature interests you?"
  ],

  online: [
    "StreamFlow is an online platform accessible 24/7 from anywhere with internet connection. You can stream, watch content, and engage with the community anytime. Our cloud infrastructure ensures reliable service with minimal downtime. Is there something specific you'd like to do online right now?",
    "Being online with StreamFlow means access to live streams, content discovery, and community features anytime. Our platform works across browsers and devices, with mobile apps for on-the-go access. You can connect with creators and viewers globally. What would you like to do online today?",
    "StreamFlow's online presence includes live streaming, real-time chat, content browsing, and community interaction. Our platform ensures smooth performance with global CDN coverage. Whether you're streaming or viewing, you're part of our online community. How can I help you get started?"
  ],

  // Acknowledgment responses
  good: [
    "That's great to hear! I'm here to help make your StreamFlow experience even better. What would you like to work on today?",
    "Awesome! I'm glad things are going well. Is there anything specific about StreamFlow you'd like to explore or improve?",
    "Fantastic! I'm here to help you continue having a great experience. What StreamFlow features can I assist you with?",
    "Wonderful! I'm ready to help you with any streaming, account, or technical questions you might have. What's on your mind?"
  ],

  // Account Management
  account: [
    "To manage your account: Click your profile avatar in sidebar, select 'Account Settings', then update your information, privacy settings, and preferences. You can also view streaming history and analytics. What specific feature do you need help with?",
    "Account management includes profile customization, email/password management, two-factor authentication, privacy controls, notification preferences, and analytics. Access everything from your profile in sidebar. What would you like to configure?",
    "From your profile section, you can edit personal information, manage security settings, control content visibility, set schedules, configure monetization, and view analytics. What feature are you looking to modify?"
  ],
  registration: [
    "To register: Click 'Sign In' then 'Register', enter your email, choose a username (3-20 characters), create a strong password, agree to terms, verify your email, and complete your profile. You'll then have full access to all features!",
    "Join StreamFlow by registering with your email, choosing a unique username, creating a secure password, and verifying your email. After registration, you can immediately explore content or set up your first stream.",
    "Registration takes 2 minutes: Click Sign In → Register, provide email, choose username, set password, accept guidelines, verify email, and customize your profile. Link social media during setup for easier promotion."
  ],
  login: [
    "To sign in: Click 'Sign In' in the sidebar, enter your email/username and password, then click 'Sign In'. Complete 2FA if enabled. If you forgot your password, use 'Forgot Password'. We'll notify you of new logins via email.",
    "Login process: Enter email/username, input password, click Sign In, complete 2FA if enabled. Security features include login notifications, session management, and failed login tracking. For issues, try clearing cache or using password reset.",
    "Access your account by clicking Sign In, entering credentials, and completing 2FA if enabled. For security, enable two-factor authentication and use a unique password. If you have issues, check your connection or try a different browser."
  ],
  logout: [
    "To log out: Click your profile avatar, select 'Logout', and confirm. This ends your session on all devices. For security, always log out on shared computers. You can also manage sessions in Account Settings.",
    "Logout process: Click profile → Logout → Confirm. This ends all active sessions and clears cached data. For shared devices, always use logout instead of just closing the browser.",
    "Secure logout: Click profile → Logout → Confirm. This terminates your session, clears tokens, and logs out from all devices. Enable auto-logout after inactivity for additional security."
  ],

  // Streaming Features
  streaming: [
    "To start streaming: Test your internet (5+ Mbps upload), check camera/mic permissions, close unnecessary apps. Go to Dashboard → Start Streaming, select devices, configure quality settings (start with 720p30fps), add title/description, set tags, and click 'Go Live'. Monitor viewers and engage with chat during the stream.",
    "Streaming setup: Dashboard → Start Streaming → Device selection → Quality settings → Stream details → Go Live. Requirements: modern browser, camera/mic permissions, stable internet, decent computer. Use wired connection, close background apps, and start with 720p30fps for best results.",
    "Professional setup: Webcam (1080p preferred), USB microphone, good lighting, i5/Ryzen5+ computer, 10+ Mbps upload. Configure browser permissions, test quality settings, monitor audio levels, prepare SEO-friendly title and tags. Start streaming and engage your audience."
  ],
  streamSetup: [
    "Hardware requirements: Intel i5/AMD Ryzen5+, 8GB RAM (16GB recommended), 10+ Mbps upload, 720p+ camera, USB microphone. Software: Chrome 90+/Firefox 88+, disable ad-blockers, enable camera/mic permissions. Use Ethernet, close background apps, update drivers for best performance.",
    "Setup checklist: Test internet speed, update browser, verify permissions, test audio levels. Position camera at eye-level, use good lighting, place microphone 6-12 inches away. Close unnecessary apps, check CPU usage, update graphics drivers.",
    "Optimization tips: Use Ethernet for lower latency, configure QoS settings, enable browser hardware acceleration. Start with 720p30fps, monitor bitrate (2000-4000 Kbps), set audio to 128 Kbps. Add custom overlays and background music to enhance your stream."
  ],
  streamQuality: [
    "Quality tiers: Basic 480p30fps @ 1500 Kbps (slow internet), Standard 720p30fps @ 2500-3500 Kbps (balanced), High 1080p30fps @ 4000-6000 Kbps (best), Premium 1080p60fps @ 6000-8000 Kbps (smooth). Test internet at speedtest.net, upload should be 2x target bitrate. Adjust in Dashboard → Quality Settings.",
    "Resolution guide: 480p (1.5 Mbps), 720p (2.5-3.5 Mbps), 1080p (4-6 Mbps), 1440p (8-12 Mbps). Frame rate: 30fps standard, 60fps gaming/sports, 24fps cinematic. Audio: 128 Kbps standard, 192 Kbps high, 256 Kbps premium. Use wired Ethernet for best results.",
    "Quality troubleshooting: Buffering → lower bitrate, Pixelation → check internet, Audio sync → adjust settings, Lagging → reduce resolution. Use VBR for efficiency or CBR for stability. Monitor stats in dashboard and adjust based on performance. What quality issues are you experiencing?"
  ],
  audience: [
    "Audience growth strategy: Define your niche, create consistent schedule (3+ times/week), plan engaging content, use SEO titles/tags, create thumbnails. Use relevant tags, write descriptions, schedule in advance, promote on social media, collaborate with others. Engage with viewers, respond to chat, create community inside jokes.",
    "Growth tactics: Stream during peak hours (7-10 PM), use trending tags, create highlight clips, share on social media, participate in events. Long-term: develop unique style, build email list, create YouTube highlights, network with creators. Track concurrent viewers, chat engagement, new followers, watch time.",
    "Audience building: Diversify content with variety streams, special events, collaborations. Promote across platforms (Twitter, Instagram, TikTok, Reddit, Discord). Retain audience with consistent schedule, viewer recognition, exclusive content, community challenges. Review analytics to optimize performance."
  ],

  // Watching and Discovery
  joining: [
    "To find streams: Browse trending on Discover page, filter by category/language, sort by viewers, preview before joining.",
    "Viewing experience: Home page shows personalized recommendations and trending streams.",
    "Optimal viewing: Get algorithm recommendations, explore trending topics and categories."
  ],
  discover: [
    "Content discovery: Browse trending streams, new streams, categories (gaming, art, music), languages, and viewer count ranges.",
    "Advanced discovery: Explore categories like gaming, creative, lifestyle, educational, and entertainment.",
    "Discovery optimization: Access live streams, recorded content, highlights, clips, and community posts."
  ],
  chat: [
    "Live chat features: Real-time messaging, emoji support, mention other users (@username), send gifts, participate in polls.",
    "Chat customization: Custom colors, font size options, theme selection, chat filters, message history.",
    "Community building: Welcome messages for new viewers, regular viewer recognition, exclusive chat rooms, VIP benefits."
  ],

  // Technical Support
  technical: [
    "Quick fixes: Refresh browser (Ctrl+F5), clear cache and cookies, check internet connection, restart browser, try Chrome/Firefox. Streaming issues: camera not working → check permissions, audio problems → test microphone, lagging → lower quality, connection lost → check internet. Browser compatibility: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+. Disable ad-blockers, enable JavaScript.",
    "Common issues: Stream won't start (permissions/internet), poor video quality (bandwidth/encoding), audio sync problems, chat not working, mobile issues. Diagnostic tools: browser compatibility test, internet speed test, device capability check, permission verification. Support options: live chat, email tickets, community forums, video tutorials.",
    "Advanced solutions: Test upload speed (5+ Mbps), check ping (<50ms), try Ethernet connection, configure router QoS. Performance: monitor CPU usage (<80%), check RAM, update drivers, disable power saving. Browser issues: clear cache, disable extensions, update browser, check JavaScript. Mobile: update app, clear cache, check OS version."
  ],
  permissions: [
    "Camera permissions: Click lock icon in address bar, select 'Camera' → 'Allow', refresh page, test camera in Dashboard. Microphone: same process as camera, ensure no other apps use mic, check system volume. Notifications: allow for stream alerts, follower notifications, chat messages. Location: optional for content discovery. Troubleshooting: clear permissions, restart browser, check system settings.",
    "Permission types: Camera (essential), Microphone (essential), Notifications (recommended), Location (optional), Storage (for settings), Clipboard (for sharing). Setup: address bar lock icon → site settings → permissions → allow each required. Security: only allow on StreamFlow domain, review permissions regularly, revoke unused permissions.",
    "Detailed setup: Chrome: Settings → Privacy → Site Settings → Camera/Microphone. Firefox: Options → Privacy & Security → Permissions. Safari: Preferences → Websites → Camera/Microphone. Edge: Settings → Site permissions. System-level: Windows Privacy settings, macOS System Preferences, mobile app permissions. Troubleshooting: restart browser, clear site data."
  ],
  browser: [
    "Browser optimization: Chrome 90+ (best compatibility), Firefox 88+ (good alternative), Edge 90+ (Windows optimized), Safari14+ (macOS/iOS). Enable hardware acceleration, clear cache regularly, update to latest version, disable unnecessary extensions. Specific configurations: Chrome enable WebRTC, Firefox allow media autoplay, Edge use tracking prevention, Safari enable WebGL.",
    "Browser compatibility: Requires WebRTC support, WebSocket support, HTML5 video playback, Canvas support, LocalStorage. Optimization: hardware acceleration enabled, JavaScript enabled, cookies allowed, pop-up blockers disabled for StreamFlow, ad-blockers disabled. Performance: Chrome best overall, Firefox good privacy, Edge Windows optimization, Safari macOS integration.",
    "Browser setup: Requires WebRTC 1.0+, WebSocket API, MediaRecorder API, Canvas 2D/3D, LocalStorage, SessionStorage, IndexedDB. Performance tuning: enable GPU acceleration, configure memory settings, optimize network stack, enable HTTP/2. Security: enable HTTPS only, use secure cookies, implement CSP headers. Cross-platform sync: bookmarks, settings, extensions, history."
  ],
  mobile: [
    "Mobile experience: iOS 14+ (iPhone/iPad), Android 8+ (phones/tablets), Progressive Web App support. Mobile streaming: limited functionality, camera quality varies, audio quality good, high battery consumption, recommended for short streams. Mobile viewing: full feature support, chat participation, quality adjustment, full-screen mode, portrait/landscape support.",
    "Mobile capabilities: Watch streams in full quality, participate in live chat, follow/unfollow streamers, receive notifications, browse content discovery. Limitations: cannot start streams from mobile, limited camera quality, higher battery usage, smaller screen interface. Platform-specific: iOS Safari optimization, Android Chrome optimization.",
    "Mobile optimization: Performance metrics include battery usage monitoring, data consumption tracking, connection stability. Technical configuration: adaptive bitrate streaming, mobile-optimized codecs, progressive loading, touch gesture recognition. UI considerations: thumb-friendly controls, readable text sizes, high contrast modes, accessibility features."
  ],

  // Platform Features
  features: [
    "Streaming features: Live broadcasting (HD quality), real-time chat, viewer analytics, stream recording, multi-platform streaming, custom overlays. Social features: follow system, chat interaction, community building, emote support, gift/support options, collaborative streaming. Analytics: viewer demographics, engagement metrics, revenue tracking, performance analytics, growth insights.",
    "Platform capabilities: Instant live streaming, real-time audience interaction, content discovery algorithm, cross-platform accessibility, community building tools. Analytics suite: real-time viewer metrics, engagement tracking, revenue analytics, audience demographics, performance monitoring. Monetization: direct viewer support, subscription tiers, advertisement revenue, sponsorship marketplace.",
    "Feature breakdown: Entertainment features include live streaming, real-time chat, virtual gifts, emotes, mini-games, interactive polls. Business features: analytics dashboard, revenue tracking, audience insights, performance metrics, growth tools. Creative features: custom overlays, stream branding, chat customization, profile themes. Security: account protection, content moderation, privacy controls."
  ],
  dashboard: [
    "Main dashboard: Quick stream stats, recent activity overview, quick actions panel, performance metrics, revenue summary. Analytics section: viewer demographics, engagement metrics, content performance, growth trends, revenue analytics. Streaming controls: start/stop streaming, quality settings, camera/mic selection, stream title/description, category/tags.",
    "Dashboard navigation: Home tab with today's stats, quick actions, recent streams, upcoming schedule. Analytics tab with detailed metrics, custom date ranges, export options. Streaming tab with go live controls, device settings, quality configuration. Community tab with follower management, chat tools, moderation panel.",
    "Advanced features: Customization options with widget arrangement, theme selection, data visualization preferences. Advanced analytics: cohort analysis, retention curves, engagement funnels, revenue attribution. Technical tools: stream health monitoring, performance diagnostics, network quality analysis. Automation: scheduled streaming, automated moderation, smart notifications."
  ],
  profile: [
    "Profile customization: Username (unique 3-20 chars), profile picture (recommended 512x512), bio (max 500 characters), social media links, location (optional). Visual customization: profile banner, theme colors, custom background, profile layout, featured content. Profile statistics: follower count, total views, stream count, average viewers, engagement rate.",
    "Profile management: Personal branding with username strategy, profile picture optimization, bio writing tips, social media integration. Profile analytics: profile views, follower growth, engagement metrics, content performance, traffic sources. Customization options: theme selection, layout preferences, featured content arrangement, highlight reels.",
    "Profile optimization: Brand strategy with consistent visual identity, compelling bio, professional imagery, strategic social links. Performance tracking: profile conversion rates, follower growth velocity, engagement quality metrics, content reach analysis. Advanced customization: custom CSS (partners), interactive elements, dynamic content, personalized themes."
  ],

  // Help and Support
  help: [
    "Help center: Getting started with account creation, profile setup, first stream tutorial, dashboard navigation, community guidelines. Technical support: troubleshooting guides, browser optimization, permission setup, connectivity issues, device compatibility. Learning resources: video tutorials, written guides, best practices, community tips, expert advice.",
    "Support ecosystem: Quick help with in-app tutorials, contextual tooltips, guided setup process, interactive walkthroughs, video guides. Detailed resources: comprehensive documentation, best practice guides, technical specifications, community standards, platform policies. Troubleshooting: step-by-step guides, video solutions, community Q&A.",
    "Assistance program: Comprehensive training with new streamer onboarding, advanced techniques, monetization strategies, community building. Expert guidance: 1-on-1 coaching, group workshops, webinar series, case studies, industry insights. Technical services: setup assistance, performance optimization, custom integration, API support."
  ],
  guidelines: [
    "Community guidelines: Content standards include no illegal activities, respect copyright laws, age-appropriate content, no hate speech, no harassment. Behavior expectations: respectful interaction, constructive feedback, no spamming, authentic engagement, privacy respect. Safety protocols: personal information protection, reporting mechanisms, moderation processes.",
    "Community standards: Content policies with prohibited content list, copyright guidelines, age restrictions, violence/gore policies, hate speech prohibition. Interaction rules: respectful communication, no harassment guidelines, anti-spam policies, privacy protection. Safety measures: reporting procedures, moderation system, appeal processes.",
    "Governance framework: Content moderation with AI-powered filtering, human review process, community reporting, appeal mechanisms. Community health: mental health resources, anti-bullying measures, diversity inclusion, accessibility standards. Protection systems: minor safety protocols, personal data protection, financial security."
  ],
  safety: [
    "Security guide: Account security with strong passwords, two-factor authentication, login monitoring, session management, recovery options. Privacy protection: personal information control, data encryption, privacy settings, content visibility controls. Online safety: block/mute features, reporting tools, content filtering, age restrictions.",
    "Security measures: Account protection with password requirements, 2FA setup, login alerts, suspicious activity detection. Privacy controls: data minimization, encryption standards, privacy settings, third-party sharing controls. User safety: harassment prevention, bullying protection, threat detection, emergency reporting.",
    "Safety framework: Enterprise-level security with end-to-end encryption, zero-trust architecture, advanced threat detection. Privacy by design: data minimization principles, privacy impact assessments, user consent management. Comprehensive moderation: AI-powered detection, human oversight, contextual understanding."
  ],

  // Premium and Monetization
  premium: [
    "Premium features: Ad-free viewing, exclusive emotes, custom profile badges, priority support, advanced analytics, higher quality streams. Subscription tiers: Basic ($4.99/month), Pro ($9.99/month), Elite ($19.99/month), Enterprise (custom pricing). Creator tools: advanced analytics dashboard, custom overlays, priority transcoding, increased storage, API access.",
    "Premium ecosystem: Premium streaming with 4K quality support, 60fps streaming, multiple bitrate options, advanced encoding. Advanced analytics: real-time metrics, detailed demographics, engagement tracking, revenue analytics. Customization options: custom branding, advanced overlays, profile themes, chat customization.",
    "Premium solutions: Business intelligence with advanced analytics suite, competitive intelligence, market insights. Technical excellence: priority infrastructure, advanced encoding, global CDN, API access. Brand customization: white-label options, custom branding, advanced overlays. Revenue optimization: advanced monetization, revenue analytics, growth tools."
  ],
  monetization: [
    "Revenue streams: Viewer donations, monthly subscriptions, advertisement revenue, sponsorship deals, merchandise sales, content licensing. Subscription system: multiple tier options, custom benefits, exclusive content, early access, custom emotes. Donation features: one-time donations, recurring support, custom messages, goal tracking, donation alerts.",
    "Monetization ecosystem: Revenue analytics with real-time earnings, revenue breakdown, payout tracking, tax documentation. Subscription management: tier creation, benefit configuration, pricing strategy, subscriber analytics. Donation system: multiple payment methods, custom donation alerts, goal tracking, recurring donations.",
    "Monetization strategies: Diversified revenue with multiple income streams, risk mitigation, revenue optimization. Data-driven monetization: audience analytics, revenue attribution, performance optimization, A/B testing. Audience engagement: community building, loyalty programs, exclusive content, personalized offers."
  ],

  // Default and Fallback
  default: [
    "I'm your StreamFlow AI assistant! I can help with live streaming (setup, optimization, troubleshooting), content discovery (finding streams, recommendations), account management (registration, security, customization), technical support (browser issues, permissions, connectivity), analytics and growth (audience building, monetization), and safety & security.",
    "I'm your expert StreamFlow assistant with comprehensive knowledge across all platform features! Whether you're new to streaming (setup guides), growing your audience (engagement tactics), facing technical issues (troubleshooting, optimization), looking to monetize (revenue streams), managing your community (moderation), or analyzing performance (metrics), I'm here to provide detailed, actionable guidance.",
    "As your StreamFlow AI expert, I offer comprehensive assistance across the entire platform ecosystem: content creation (streaming setup, quality optimization), business development (audience growth, monetization), technical support (troubleshooting, optimization, security), community management (engagement, moderation), platform navigation (features, settings, best practices).",
    "I'm your dedicated StreamFlow expert with deep knowledge of all platform aspects! From technical streaming setup to audience growth strategies, from basic account management to advanced monetization tactics, I'm here to help you succeed. I can assist with: professional streaming setup and optimization, data-driven audience growth strategies, comprehensive monetization planning, and technical troubleshooting."
  ]
};

const getChatResponse = (userMessage) => {
  const message = userMessage.toLowerCase().trim();

  // Enhanced greeting detection with more patterns
  const greetingPatterns = [
    'hi', 'hello', 'hey', 'hy', 'greetings', 'welcome',
    'good morning', 'good afternoon', 'good evening',
    '^hi ', '^hello ', '^hey ', '^hy '
  ];

  if (greetingPatterns.some(pattern => {
    if (pattern.startsWith('^')) {
      return message.startsWith(pattern.substring(1));
    }
    return message.includes(pattern);
  })) {
    return chatResponses.greeting[Math.floor(Math.random() * chatResponses.greeting.length)];
  }

  // How are you detection
  const howAreYouPatterns = [
    'how are you', 'how are you doing', 'how you doing',
    'how are things', 'how is it going', 'how is everything'
  ];

  if (howAreYouPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.howAreYou[Math.floor(Math.random() * chatResponses.howAreYou.length)];
  }

  // Farewell detection
  const farewellPatterns = [
    'bye', 'goodbye', 'see you', 'see ya', 'later',
    'take care', 'farewell', 'cya', 'exit'
  ];

  if (farewellPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.farewell[Math.floor(Math.random() * chatResponses.farewell.length)];
  }

  // System/platform inquiries
  const systemPatterns = [
    'system', 'platform', 'what is streamflow', 'about streamflow',
    'streamflow platform', 'how does streamflow work'
  ];

  if (systemPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.system[Math.floor(Math.random() * chatResponses.system.length)];
  }

  // Content inquiries
  const contentPatterns = [
    'content', 'what content', 'type of content', 'content available',
    'what can i watch', 'what can i see', 'content on streamflow'
  ];

  if (contentPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.content[Math.floor(Math.random() * chatResponses.content.length)];
  }

  // Live streaming
  const livePatterns = [
    'live', 'live streaming', 'go live', 'start streaming',
    'how to stream', 'broadcast live', 'live broadcast'
  ];

  if (livePatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.live[Math.floor(Math.random() * chatResponses.live.length)];
  }

  // Video inquiries
  const videoPatterns = [
    'video', 'videos', 'recorded', 'vod', 'video on demand',
    'watch video', 'video content', 'video quality'
  ];

  if (videoPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.video[Math.floor(Math.random() * chatResponses.video.length)];
  }

  // Online/availability
  const onlinePatterns = [
    'online', 'available', 'access', 'connect', 'internet',
    'online platform', 'web access'
  ];

  if (onlinePatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.online[Math.floor(Math.random() * chatResponses.online.length)];
  }

  // Positive acknowledgments
  const goodPatterns = [
    'good', 'great', 'awesome', 'fantastic', 'excellent',
    'perfect', 'amazing', 'wonderful'
  ];

  if (goodPatterns.some(pattern => message.includes(pattern)) && message.length < 10) {
    return chatResponses.good[Math.floor(Math.random() * chatResponses.good.length)];
  }

  // Account Management
  if (message.includes('account') || message.includes('profile') || message.includes('settings') || message.includes('manage account')) {
    return chatResponses.account[Math.floor(Math.random() * chatResponses.account.length)];
  }

  if (message.includes('register') || message.includes('sign up') || message.includes('create account') || message.includes('new account') ||
    message.includes('join') || message.includes('get started')) {
    return chatResponses.registration[Math.floor(Math.random() * chatResponses.registration.length)];
  }

  if (message.includes('login') || message.includes('sign in') || message.includes('log in') || message.includes('access account')) {
    return chatResponses.login[Math.floor(Math.random() * chatResponses.login.length)];
  }

  if (message.includes('logout') || message.includes('log out') || message.includes('sign out') || message.includes('end session')) {
    return chatResponses.logout[Math.floor(Math.random() * chatResponses.logout.length)];
  }

  // Streaming Features
  if (message.includes('start stream') || message.includes('go live') || message.includes('broadcast') || message.includes('streaming') ||
    message.includes('how to stream') || message.includes('start broadcasting')) {
    return chatResponses.streaming[Math.floor(Math.random() * chatResponses.streaming.length)];
  }

  if (message.includes('setup') || message.includes('configure') || message.includes('prepare') || message.includes('stream setup') ||
    message.includes('get ready to stream')) {
    return chatResponses.streamSetup[Math.floor(Math.random() * chatResponses.streamSetup.length)];
  }

  if (message.includes('quality') || message.includes('resolution') || message.includes('bitrate') || message.includes('stream quality') ||
    message.includes('improve stream')) {
    return chatResponses.streamQuality[Math.floor(Math.random() * chatResponses.streamQuality.length)];
  }

  if (message.includes('audience') || message.includes('viewers') || message.includes('followers') || message.includes('grow') ||
    message.includes('popular') || message.includes('get more views')) {
    return chatResponses.audience[Math.floor(Math.random() * chatResponses.audience.length)];
  }

  // Watching and Discovery
  if (message.includes('join stream') || message.includes('watch') || message.includes('view') || message.includes('find stream') ||
    message.includes('how to watch')) {
    return chatResponses.joining[Math.floor(Math.random() * chatResponses.joining.length)];
  }

  if (message.includes('discover') || message.includes('explore') || message.includes('find content') || message.includes('browse') ||
    message.includes('what to watch')) {
    return chatResponses.discover[Math.floor(Math.random() * chatResponses.discover.length)];
  }

  if (message.includes('chat') || message.includes('message') || message.includes('talk') || message.includes('communicate') ||
    message.includes('live chat')) {
    return chatResponses.chat[Math.floor(Math.random() * chatResponses.chat.length)];
  }

  // Technical Support
  if (message.includes('technical') || message.includes('issue') || message.includes('problem') || message.includes('error') ||
    message.includes('broken') || message.includes('not working') || message.includes('troubleshoot')) {
    return chatResponses.technical[Math.floor(Math.random() * chatResponses.technical.length)];
  }

  if (message.includes('permission') || message.includes('allow') || message.includes('camera') || message.includes('microphone') ||
    message.includes('mic') || message.includes('access')) {
    return chatResponses.permissions[Math.floor(Math.random() * chatResponses.permissions.length)];
  }

  if (message.includes('browser') || message.includes('chrome') || message.includes('firefox') || message.includes('safari') ||
    message.includes('edge') || message.includes('compatible')) {
    return chatResponses.browser[Math.floor(Math.random() * chatResponses.browser.length)];
  }

  if (message.includes('mobile') || message.includes('phone') || message.includes('tablet') || message.includes('ios') ||
    message.includes('android')) {
    return chatResponses.mobile[Math.floor(Math.random() * chatResponses.mobile.length)];
  }

  // Platform Features
  if (message.includes('feature') || message.includes('what can') || message.includes('capabilities') || message.includes('platform') ||
    message.includes('what does') || message.includes('offer')) {
    return chatResponses.features[Math.floor(Math.random() * chatResponses.features.length)];
  }

  if (message.includes('dashboard') || message.includes('control panel') || message.includes('streaming dashboard') ||
    message.includes('my dashboard')) {
    return chatResponses.dashboard[Math.floor(Math.random() * chatResponses.dashboard.length)];
  }

  if (message.includes('profile') || message.includes('my profile') || message.includes('customize profile') ||
    message.includes('edit profile')) {
    return chatResponses.profile[Math.floor(Math.random() * chatResponses.profile.length)];
  }

  // Help and Support
  if (message.includes('help') || message.includes('how to') || message.includes('assist') || message.includes('support') ||
    message.includes('guide') || message.includes('tutorial')) {
    return chatResponses.help[Math.floor(Math.random() * chatResponses.help.length)];
  }

  if (message.includes('guideline') || message.includes('rule') || message.includes('community') || message.includes('behavior') ||
    message.includes('appropriate')) {
    return chatResponses.guidelines[Math.floor(Math.random() * chatResponses.guidelines.length)];
  }

  if (message.includes('safe') || message.includes('security') || message.includes('privacy') || message.includes('protect') ||
    message.includes('report')) {
    return chatResponses.safety[Math.floor(Math.random() * chatResponses.safety.length)];
  }

  // Premium and Monetization
  if (message.includes('premium') || message.includes('paid') || message.includes('pro') || message.includes('upgrade') ||
    message.includes('subscription')) {
    return chatResponses.premium[Math.floor(Math.random() * chatResponses.premium.length)];
  }

  if (message.includes('monetize') || message.includes('earn') || message.includes('money') || message.includes('donation') ||
    message.includes('income') || message.includes('revenue')) {
    return chatResponses.monetization[Math.floor(Math.random() * chatResponses.monetization.length)];
  }

  // Enhanced fallback with more helpful responses
  const fallbackResponses = [
    "I'm here to help! I can assist with streaming setup, account management, technical issues, content discovery, and platform features. What specific area would you like help with?",
    "I'd be happy to help you! I'm knowledgeable about live streaming, audience growth, monetization, technical troubleshooting, and all StreamFlow features. What can I help you with today?",
    "I'm your StreamFlow expert! Whether you need help with streaming setup, finding content, managing your account, or technical support, I'm here to assist. What would you like to know?",
    "Let me help you with StreamFlow! I can guide you through streaming setup, content discovery, account features, technical issues, and much more. What's on your mind?",
    "I'm here to make your StreamFlow experience better! Ask me anything about streaming, content, accounts, or technical support. How can I assist you today?"
  ];

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your StreamFlow assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate typing delay for better UX
    setTimeout(() => {
      const botResponse = getChatResponse(inputMessage);
      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-gray-800/30 via-gray-700/20 to-gray-600/15 backdrop-blur-xl border border-gray-500/40 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 group shadow-lg shadow-gray-900/20 shadow-white/10 shadow-blue-400/5"
          aria-label="Open chat"
        >
          <MessageCircle size={24} className="text-white drop-shadow-lg" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800/30 backdrop-blur-xl text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-gray-500/40 shadow-lg shadow-white/10">
            Chat with us
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] glass-card rounded-2xl flex flex-col overflow-hidden border border-gray-700">
          {/* Header */}
          <div className="glass-card border-b border-gray-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-800/30 rounded-full flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold">StreamFlow Assistant</h3>
                <p className="text-xs text-gray-400">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 transition-colors p-1 rounded-lg"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 glass-card rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={16} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${message.sender === 'user'
                    ? 'glass-card border border-gray-700 text-white'
                    : 'glass-card border border-gray-700 text-white'
                    }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${message.sender === 'user' ? 'text-gray-600' : 'text-gray-500'
                      }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 glass-card rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-gray-400" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 glass-card rounded-full flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div className="glass-card border border-gray-700 rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 glass-card border-t border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="glass-input flex-1"
                disabled={isTyping}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed p-2"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
