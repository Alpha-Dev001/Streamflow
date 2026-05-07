import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

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

  // Personal questions (off-topic)
  personal: [
    "I'm an AI assistant focused on helping you with StreamFlow! I don't have personal relationships or feelings, but I'm here to help you with streaming, content discovery, or any platform questions. What can I assist you with?",
    "As a StreamFlow AI assistant, I'm designed to help with platform-related questions. While I can't discuss personal topics, I'm great at helping with streaming setup, account management, and technical support. What would you like to know?",
    "I'm here specifically to help with StreamFlow! I can't chat about personal matters, but I'd love to help you with streaming, content creation, or any platform features. What can I help you with today?",
    "I'm your dedicated StreamFlow assistant! I focus on helping with streaming, account questions, and technical support. While I can't discuss personal topics, I'm here to make your StreamFlow experience better. What do you need help with?"
  ],

  // Off-topic questions
  offTopic: [
    "That's an interesting question! However, I'm specifically designed to help with StreamFlow-related topics like streaming, content discovery, account management, and technical support. Is there something about StreamFlow I can help you with?",
    "I appreciate your curiosity! I'm focused on being your StreamFlow expert. I can help with streaming setup, audience growth, platform features, and technical issues. What StreamFlow topic would you like to explore?",
    "That's outside my area of expertise! I'm here to be your StreamFlow specialist. I can assist with live streaming, content creation, account management, and troubleshooting. How can I help you with StreamFlow today?",
    "Interesting thought! I'm dedicated to helping with StreamFlow exclusively. Whether it's streaming setup, finding content, or technical support, I'm your go-to expert. What StreamFlow question can I answer for you?"
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

  // Content Creation for Beginners
  contentCreation: [
    "Content creation is the process of producing valuable, engaging material for your audience. To start: choose a niche you're passionate about, define your target audience, start with basic equipment (smartphone is fine), create a content schedule, and focus on consistency over perfection. StreamFlow provides tools to go live, record content, and engage with viewers. What specific aspect of content creation interests you most?",
    "Starting content creation with no experience is totally normal! Begin by: 1) Choosing topics you genuinely love, 2) Researching what similar creators do well, 3) Starting with simple formats like Q&As or tutorials, 4) Being authentic rather than perfect, 5) Engaging with every comment. StreamFlow's analytics help you understand what resonates. What type of content are you most excited to create?",
    "Essential tools for beginners: Smartphone with good camera, basic microphone (even phone mic works), free editing software (CapCut, DaVinci Resolve), good lighting (natural light works!), and StreamFlow for streaming/hosting. You don't need expensive gear to start - focus on content quality first. What's your budget for equipment?",
    "Finding your niche involves: 1) Listing your passions and expertise, 2) Researching audience demand, 3) Analyzing competition gaps, 4) Testing different content types, 5) Choosing where your passion meets market need. Popular niches include gaming, education, lifestyle, creative arts, and entertainment. What topics could you talk about for hours?",
    "Top performing content types in 2026: Interactive live streams, educational tutorials, behind-the-scenes content, collaborative streams, short-form highlights, authentic storytelling, and community-driven content. Focus on creating value and building genuine connections. StreamFlow supports all these formats with engagement tools. What content style feels most natural to you?",
    "As a beginner, aim for 2-3 posts per week to build consistency without burnout. Quality trumps quantity - create content you're proud of rather than forcing a daily schedule. StreamFlow's scheduling tools help you maintain consistency. What days work best for your content creation?",
    "Staying consistent: Create a content calendar, batch-create content when inspired, set realistic goals, build a routine, track your progress, celebrate small wins, and remember why you started. StreamFlow's analytics help you see growth over time. What's your biggest consistency challenge?"
  ],

  // Live Streaming Basics
  streamingBasics: [
    "Starting a live stream on StreamFlow: 1) Test internet (5+ Mbps upload), 2) Check camera/mic permissions, 3) Go to Dashboard → Start Streaming, 4) Select devices and quality settings, 5) Add compelling title/description, 6) Set relevant tags, 7) Click 'Go Live', 8) Engage with chat immediately. Start with 720p30fps for stability. Need help with any specific step?",
    "Essential streaming equipment: Reliable internet (5+ Mbps upload), computer (i5/Ryzen5+), webcam (1080p preferred), USB microphone, good lighting, and streaming software (OBS or StreamFlow's built-in tools). You can start with just a smartphone! What's your current setup like?",
    "Internet requirements: 5+ Mbps upload for 720p30fps, 10+ Mbps for 1080p60fps. Use wired Ethernet for stability, test speed at speedtest.net, close background apps, and ensure low ping (<50ms). StreamFlow's quality settings automatically adjust based on your connection. What's your current internet speed?",
    "Mobile streaming: Download StreamFlow app, ensure strong WiFi/cellular connection, use phone holder for stability, check audio quality, enable portrait/landscape as needed, test with private stream first. Mobile is great for IRL content and casual streaming. What type of mobile content do you want to create?",
    "Live streaming vs video content: Live is real-time, interactive, unscripted, and builds community through immediate engagement. Video content is pre-recorded, edited, polished, and better for SEO. Both complement each other - use live for community building, video for evergreen content. StreamFlow supports both seamlessly. Which format interests you more?",
    "Home streaming studio: Quiet space with good lighting, neutral background, desk space for equipment, reliable power, sound-dampening (rugs, curtains), comfortable seating, and backup internet if possible. Start simple and upgrade gradually. What's your budget for studio setup?"
  ],

  // Technical Setup & Troubleshooting
  technicalSetup: [
    "OBS Studio setup: 1) Download and install OBS, 2) Add video capture device for camera, 3) Add audio input capture for microphone, 4) Set resolution (1920x1080) and FPS (30 or 60), 5) Configure StreamFlow stream key in settings, 6) Test with recording before going live. StreamFlow integrates directly with OBS for seamless streaming. What OBS feature do you need help with?",
    "Best streaming settings: 1080p60fps @ 6000 Kbps for high quality, 720p30fps @ 2500-3500 Kbps for stable streaming. Key settings: H.264 encoder, high profile, keyframe interval 2 seconds, audio 128 Kbps AAC. StreamFlow's auto-configuration optimizes based on your hardware. What's your computer's capability?",
    "Fixing stream lag: Lower bitrate, reduce resolution, close background apps, use Ethernet instead of WiFi, update graphics drivers, enable hardware acceleration, check CPU usage (<80%). StreamFlow's health monitoring shows real-time performance. What specific lag issues are you experiencing?",
    "Stream buffering solutions: Check upload speed stability, reduce bitrate, use wired connection, close bandwidth-heavy apps, restart router, test different server locations, ensure StreamFlow settings match your internet capability. What's your current upload speed?",
    "Improving audio quality: Use USB microphone instead of built-in, add pop filter, position mic 6-12 inches away, reduce background noise, enable noise suppression, monitor audio levels, use audio interface if possible. StreamFlow's audio tools include noise reduction. What's your current audio setup?",
    "Adding overlays and alerts: Use StreamFlow's built-in overlay editor or import from third-party tools like StreamElements. Add: webcam frame, recent events, social media handles, donation alerts, chat box, goal widgets. Keep design clean and on-brand. Need help with specific overlay elements?"
  ],

  // Enhanced Growth & Audience Building
  audienceGrowth: [
    "Growing your audience: Consistency is key (2-3 streams/week), optimize titles/descriptions with keywords, use relevant tags, promote on social media, collaborate with other creators, engage with every viewer, create highlight clips, analyze analytics to improve content. StreamFlow provides growth analytics and promotion tools. What's your current follower count?",
    "Getting more viewers: Stream during peak hours (7-10 PM), use trending topics, create compelling thumbnails, write SEO-friendly titles, engage with other streamers' communities, run giveaways, cross-promote on social platforms, participate in StreamFlow events. What growth strategies have you tried so far?",
    "Going viral strategies: Ride trending topics, create shareable moments, use emotional hooks, optimize for platform algorithms, collaborate with larger creators, post at optimal times, encourage sharing, create series content. StreamFlow's trending features help discover viral opportunities. What niche are you in?",
    "Effective promotion: Share clips on TikTok/Instagram/YouTube, use relevant hashtags, engage with communities, email your list, run targeted ads, collaborate with influencers, optimize for search engines, create shareable content. StreamFlow's social sharing tools make promotion easy. What platforms do you use?",
    "Social media growth: Post daily highlights, engage with followers, use platform-specific content (TikTok shorts, Instagram stories, YouTube community), run contests, share behind-the-scenes content, use analytics to optimize posting times. StreamFlow integrates with major social platforms. Where's your biggest social media presence?",
    "Retaining viewers: Start streams strong, interact early, acknowledge new followers, create inside jokes, run polls and giveaways, maintain consistent schedule, end with call-to-action, build community Discord. StreamFlow's engagement tools help maintain viewer interest. What's your average viewer retention?"
  ],

  // Enhanced Monetization
  enhancedMonetization: [
    "Content creator revenue streams: Platform subscriptions (StreamFlow Subscriptions), direct donations/tips, brand sponsorships, merchandise sales, affiliate marketing, ad revenue, premium content access, coaching/consulting, live event tickets. Diversify income for stability. StreamFlow offers multiple monetization options. What's your primary monetization goal?",
    "Monetizing live streams: Enable subscriptions, set up donation alerts, run sponsored segments, sell merchandise during streams, offer premium content access, host paid events, use affiliate links, create tier benefits. StreamFlow's monetization dashboard tracks all revenue sources. How large is your current audience?",
    "Highest paying platforms: StreamFlow offers competitive revenue splits (70/30 for creators), YouTube has large audience but lower CPM, Twitch has good subscription revenue, TikTok has high growth potential, Facebook Gaming has brand partnerships. Diversify across platforms. What's your primary streaming platform?",
    "Getting sponsorships: Build media kit with analytics, create professional email template, research relevant brands, start with small sponsorships, deliver value consistently, maintain professional relationships, disclose sponsorships transparently. StreamFlow's brand marketplace connects creators with sponsors. What's your niche?",
    "Ad revenue: Pre-roll ads (before stream), mid-roll ads (during breaks), display ads (around content), sponsored segments, product placements. Revenue depends on viewer count, engagement, demographics. StreamFlow's ad system optimizes for maximum revenue. What's your average viewer count?",
    "Donations and subscriptions: Set up multiple tiers ($4.99, $9.99, $19.99), offer exclusive benefits, create donation alerts, thank donors publicly, provide subscriber-only content, host special events for supporters. StreamFlow handles payment processing automatically. What benefits would you offer subscribers?"
  ],

  // Engagement & Interaction
  engagement: [
    "Viewer interaction strategies: Welcome new viewers by name, respond to questions/comments immediately, run interactive polls, ask audience questions, create call-and-response moments, acknowledge regular viewers, use viewer names in conversation. StreamFlow's chat tools make engagement easy. What's your current engagement rate?",
    "Keeping viewers engaged: Start with strong hook, vary content every 10-15 minutes, use interactive elements (polls, giveaways), tell compelling stories, create inside jokes, involve audience in decisions, maintain high energy throughout. StreamFlow's engagement analytics show what works. What's your biggest engagement challenge?",
    "Handling negative comments: Set clear chat rules, use moderation tools, don't feed trolls, address constructive criticism professionally, create positive community culture, empower trusted moderators, take breaks when needed. StreamFlow's moderation features help maintain healthy chat. What moderation issues do you face?",
    "Engagement activities: Q&A sessions, viewer games, tournament brackets, prediction markets, collaborative storytelling, music requests, art challenges, cooking with viewers suggestions. StreamFlow supports various interactive features. What activities interest your audience?",
    "Building loyal community: Create Discord server, host viewer meetups, remember viewer preferences, celebrate community milestones, share behind-the-scenes content, create community traditions, show genuine appreciation. StreamFlow's community tools help build lasting connections. How do you currently engage with your community?",
    "Engagement metrics to track: Chat messages per minute, viewer retention rate, new follower ratio, poll participation, donation frequency, clip creation rate, social media mentions. StreamFlow's analytics dashboard provides detailed insights. What metrics do you currently monitor?"
  ],

  // Content Strategy & Planning
  contentStrategy: [
    "Monthly content planning: Use content calendar template, batch record evergreen content, plan around trending topics, schedule regular series, leave room for spontaneous content, coordinate with special events. StreamFlow's scheduling tools help organize content. What's your planning process like?",
    "Content ideas by niche: Gaming - speedruns, challenges, tutorials; Creative - process videos, tutorials, time-lapses; Educational - how-to guides, explanations, interviews; Lifestyle - day-in-life, Q&As, collaborations. What's your content niche?",
    "Performance analysis: Track viewer demographics, watch time, chat engagement, clip performance, social media shares, revenue per viewer, growth trends. StreamFlow's analytics provide comprehensive insights. What metrics matter most to you?",
    "Repurposing live streams: Create highlight clips for social media, extract educational content for YouTube, compile best moments into compilation videos, turn tutorials into blog posts, create quote graphics from memorable moments. StreamFlow's clipping tools make repurposing easy. What platforms do you want to expand to?",
    "Content calendar creation: Plan themes for each month, schedule regular series, coordinate with holidays/events, batch similar content together, leave flexibility for trending topics, include promotional activities. StreamFlow's calendar integrates with planning tools. What's your content frequency?",
    "Content optimization: A/B test titles/thumbnails, analyze peak performance times, experiment with formats, use audience feedback, track competitor strategies, optimize for platform algorithms. StreamFlow provides optimization insights. What optimization tactics have you tried?"
  ],

  // Advanced/Pro-Level Guidance
  advanced: [
    "Streaming algorithms: Focus on watch time, engagement rate, click-through rate, session time, viewer retention, content consistency, audience growth velocity. StreamFlow's algorithm prioritizes engaging content that keeps viewers watching. What algorithm aspects confuse you?",
    "Discoverability optimization: Use relevant keywords in titles/descriptions, create compelling thumbnails, post at optimal times, encourage engagement signals, build consistent brand, collaborate with established creators. StreamFlow's discovery tools boost visibility. What's your current discoverability score?",
    "Key analytics metrics: Concurrent viewers, chat engagement rate, follower growth velocity, watch time distribution, clip creation rate, revenue per viewer, audience demographics, retention curves. StreamFlow's advanced analytics track everything. Which metrics need improvement?",
    "Scaling to 10k followers: Consistent daily content, viral content strategy, collaboration with larger creators, paid promotion optimization, community building focus, platform diversification, brand partnership development. StreamFlow's growth tools accelerate scaling. What's your current growth rate?",
    "Personal brand development: Define unique value proposition, create consistent visual identity, develop authentic communication style, build expertise authority, engage in thought leadership, maintain professional online presence. StreamFlow's branding tools help establish your identity. What makes your brand unique?",
    "Creator collaboration strategies: Find complementary creators, propose mutual value exchanges, co-create content series, cross-promote to each other's audiences, host joint events, build long-term partnerships. StreamFlow's collaboration features make partnerships easy. What type of collaborators are you looking for?"
  ],

  // Problem-Solving Scenarios
  problemSolving: [
    "No viewers solution: Optimize discoverability with better titles/tags, promote on social media, collaborate with other creators, engage in communities, create compelling thumbnails, stream during peak hours, run giveaways, create viral-optimized content. StreamFlow's promotion tools help increase visibility. How long have you been streaming, and what's your niche?",
    "Bad audio fix: Use USB microphone instead of built-in, add pop filter, position mic correctly, enable noise reduction, monitor audio levels, use audio interface, test with headphones, eliminate background noise. StreamFlow's audio tools include noise suppression. What's your current audio setup?",
    "Out of ideas: Research trending topics in your niche, ask audience what they want to see, try new formats, revisit successful content with updates, take inspiration from other platforms, use content idea generators. StreamFlow's trending features show what's popular. What's your niche?",
    "Low engagement: Start with strong hook, ask questions frequently, run interactive polls, acknowledge viewers by name, create call-to-action moments, vary content regularly, respond to all comments, build community rituals. StreamFlow's engagement analytics show improvement opportunities. What's your current engagement rate?",
    "Losing viewers quickly: Improve stream opening, maintain consistent energy, vary content every 10-15 minutes, interact with chat continuously, create compelling transitions, end with strong call-to-action, analyze drop-off points in analytics. StreamFlow's retention analytics identify problem areas. When do you typically lose viewers?",
    "Stream crashes with many viewers: Lower bitrate settings, use dedicated streaming PC, enable hardware acceleration, close background applications, check CPU temperature, upgrade internet plan, use StreamFlow's auto-quality settings, test with simulated viewer count. StreamFlow's stability tools prevent crashes. What's your current setup?"
  ],

  // Complete Streaming Knowledge Base
  streamingKnowledge: [
    "Internet Requirements: For 480p30fps need 1.5-3 Mbps upload, 720p30fps need 2.5-3.5 Mbps, 1080p30fps need 4-6 Mbps, 1080p60fps need 6-8 Mbps. Use wired Ethernet, test at speedtest.net, ensure ping <50ms. StreamFlow auto-adjusts based on connection.",
    "Audio Equipment: USB mics (Blue Yeti, Audio-Technica AT2020, Rode NT-USB), XLR mics with audio interface, pop filters, boom arms, acoustic treatment. Monitor levels at -12dB to -6dB, use headphones for real-time monitoring.",
    "Video Equipment: Webcams (Logitech C920, Sony A6400, Razer Kiyo), DSLR/mirrorless cameras, camcorders, PTZ cameras. Use 1080p for professional quality, 30fps for standard, 60fps for gaming/sports.",
    "Software Tools: OBS Studio (free, professional), Streamlabs Desktop (user-friendly), vMix (paid, advanced), XSplit (gaming focused), StreamFlow's built-in tools (beginner friendly). Each offers overlays, alerts, recording, streaming capabilities.",
    "Content Categories: Gaming (FPS games, RPGs, strategy games), Creative (art, music, cooking, crafts), Educational (tutorials, explanations, interviews), Lifestyle (vlogs, Q&As, day-in-life), Entertainment (comedy, commentary, challenges), IRL (outdoor, travel, events).",
    "Monetization Timeline: 0-100 followers: focus on content, 100-1000: donations/tips, 1K-10K: subscriptions $4.99-$9.99, 10K-50K: sponsorships + merch, 50K+: multiple revenue streams. StreamFlow handles all payment processing automatically.",
    "Growth Strategies: Consistency (3+ streams/week), SEO optimization (titles/tags), social media promotion, collaborations, community engagement, content repurposing, analytics review, networking with other creators. StreamFlow provides growth analytics.",
    "Technical Troubleshooting: Buffering → lower bitrate, Lag → reduce resolution, Audio sync → adjust settings, Connection drops → check internet, Crashes → update drivers, Overheating → improve cooling. StreamFlow's health monitoring shows real-time issues.",
    "Audience Engagement: Welcome new viewers, respond to chat, acknowledge regulars, run polls/giveaways, create inside jokes, use viewer names, build Discord community, share behind-the-scenes content, celebrate milestones together.",
    "Content Planning: Monthly content calendar, batch recording, content pillars (3-5 themes), trending topic research, competitor analysis, seasonal content, evergreen content creation, platform-specific content optimization. StreamFlow's scheduling tools help organize.",
    "Professional Setup: Dual monitor setup, dedicated streaming PC, capture card, professional microphone, lighting kit (key, fill, back), green screen, reliable internet, backup power, ergonomic chair, acoustic treatment. StreamFlow supports all professional equipment.",
    "Platform Algorithms: Watch time retention, engagement rate, click-through rate, session duration, viewer growth velocity, content performance score, discoverability factors. StreamFlow's analytics dashboard tracks all metrics.",
    "Community Building: Moderation tools, subscriber benefits, VIP tiers, exclusive content, community events, fan art showcase, collaboration opportunities, feedback channels. StreamFlow provides comprehensive community management."
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

const getChatResponse = (userMessage, conversationContext) => {
  const message = userMessage.toLowerCase().trim();
  const originalMessage = userMessage; // Keep original for context analysis

  // Direct answers for common questions
  const directAnswers = {
    'what is your name': "I'm your StreamFlow assistant! You can call me Flow - I'm here to help you with streaming, content creation, and growing your audience.",
    'give me the code of html': "I'm here to help with streaming, not coding! But if you're looking to build a streaming website, StreamFlow has everything you need built-in. What streaming features interest you?",
    'give me the codes of react js': "I focus on streaming success, not coding! StreamFlow handles all the technical stuff so you can focus on creating great content. What kind of content do you want to create?",
    'what languages do you speak': "I speak streaming! 🎮 I can help with gaming streams, creative content, educational videos, music performances - basically anything you can broadcast on StreamFlow. What's your content niche?",
    'what is buiking a house': "Building a house sounds intense! I'm better at helping you build your streaming career instead. Want to start with basic setup, content ideas, or audience growth?",
    'hy': "Hey! What's up? Ready to start streaming or need help with something specific?",
    'yoooo': "Yoooo! 🎉 What's the streaming goal today? Going live, growing your audience, or need tech help?",
    'you do not match my vibe as a content creator': "You're right, let me fix that! I should be more like your streaming buddy. What kind of content creator are you? Gaming, art, music, education? Let's talk your language!"
  };

  // Check for exact matches first
  if (directAnswers[message]) {
    return directAnswers[message];
  }

  // Bad Impression Detection
  const detectBadImpression = (msg) => {
    const frustrationPatterns = ['not working', 'stuck', 'frustrated', 'annoying', 'broken', 'repeat too much', 'always repeat', 'default too low', 'do not know'];
    const confusionPatterns = ['dont understand', 'confused', 'unclear', 'what do you mean', 'off topic'];
    const angerPatterns = ['angry', 'mad', 'pissed', 'hate', 'terrible', 'fuck', 'dum'];
    const discouragementPatterns = ['give up', 'quit', 'useless', 'pointless', 'discouraged', 'tired of'];

    if (frustrationPatterns.some(pattern => msg.includes(pattern))) {
      return 'frustration';
    }
    if (confusionPatterns.some(pattern => msg.includes(pattern))) {
      return 'confusion';
    }
    if (angerPatterns.some(pattern => msg.includes(pattern))) {
      return 'anger';
    }
    if (discouragementPatterns.some(pattern => msg.includes(pattern))) {
      return 'discouragement';
    }
    return null;
  };

  // Enhanced response builder with coaching style
  const createCoachingResponse = (directAnswer, actionableSteps, followUpQuestion, userLevel = 'beginner') => {
    let response = '';

    // Direct answer first
    response += directAnswer + '\n\n';

    // Actionable steps (structured)
    if (actionableSteps && actionableSteps.length > 0) {
      response += 'Here\'s what I recommend:\n';
      actionableSteps.forEach((step, index) => {
        response += `${index + 1}. ${step}\n`;
      });
      response += '\n';
    }

    // Follow-up question
    if (followUpQuestion) {
      response += followUpQuestion;
    }

    return response;
  };

  // Check for bad impressions first
  const badImpression = detectBadImpression(message);
  if (badImpression) {
    const empathyResponses = {
      frustration: generateContextualResponse('frustration', null, conversationContext),
      confusion: generateContextualResponse('confusion', null, conversationContext),
      anger: generateContextualResponse('anger', null, conversationContext),
      discouragement: generateContextualResponse('discouragement', null, conversationContext)
    };

    return empathyResponses[badImpression];
  }

  // SPECIFIC PATTERN CHECKS (must come before general patterns)
  if (message.includes('who are you')) {
    return createCoachingResponse(
      "I'm your StreamFlow AI assistant! Think of me as your dedicated streaming coach.",
      ["I'm here to help with streaming setup", "I can assist with content creation", "I help with audience growth", "I provide technical support"],
      "What streaming topic would you like help with?"
    );
  }

  if (message.includes('marry me') || message.includes('marry')) {
    return createCoachingResponse(
      "I appreciate the thought, but I'm an AI assistant focused on helping you with streaming!",
      ["I'm here to help you succeed on StreamFlow", "I can assist with content creation", "I help with audience growth", "I provide technical support"],
      "What streaming goal would you like to achieve?"
    );
  }

  if (message.includes('god') || message.includes('know god')) {
    return createCoachingResponse(
      "I'm designed specifically to help with StreamFlow and content creation!",
      ["I'm your streaming coach", "I understand platform features", "I can help with technical issues", "I provide growth strategies"],
      "What streaming topic can I help you with?"
    );
  }

  if (message.includes('do you know me') || message.includes('know me')) {
    return createCoachingResponse(
      "I'm here to help you succeed with streaming, regardless of who you are!",
      ["I can help with your streaming setup", "I assist with content strategy", "I help grow your audience", "I provide technical support"],
      "What streaming challenge are you facing?"
    );
  }

  if (message.includes('what can you say') || message.includes('what can you say know')) {
    return createCoachingResponse(
      "I'm designed to help with streaming and content creation topics!",
      ["I can discuss streaming setup", "I help with content strategy", "I assist with technical issues", "I provide growth guidance"],
      "What streaming question can I answer for you?"
    );
  }

  if (message.includes('right time to stream') || message.includes('time to do streaming')) {
    return createCoachingResponse(
      "Great question! Timing is crucial for streaming success.",
      ["Stream during peak hours (7-10 PM)", "Consistency matters more than perfect timing", "Test different times to find your audience", "Use StreamFlow analytics to track optimal times"],
      "What's your current streaming schedule like?"
    );
  }

  // ADDITIONAL SPECIFIC PATTERN CHECKS (before general patterns)
  if (message.includes('what do you do for living') || message.includes('what do you do for living')) {
    return createCoachingResponse(
      "I'm designed specifically to help creators like you succeed with streaming!",
      ["I help with streaming setup and optimization", "I assist with content creation strategies", "I provide audience growth guidance", "I offer technical support"],
      "What streaming challenge are you currently facing?"
    );
  }

  if (message.includes('how much do earn') || message.includes('earn a month')) {
    return createCoachingResponse(
      "Creator earnings vary widely based on audience size and monetization strategy!",
      ["Beginners: $0-$500/month", "Intermediate: $500-$2000/month", "Advanced: $2000-$10000+/month", "Multiple income streams: donations + subscriptions + sponsorships"],
      "What's your current audience size and monetization goals?"
    );
  }

  if (message.includes('you like to repeat') || message.includes('like to repeat')) {
    return createCoachingResponse(
      "I understand your frustration with repetitive responses. Let me provide more specific help!",
      ["I'm improving my response variety", "I can provide more detailed answers", "I'll focus on your specific questions", "I'm here to solve actual problems"],
      "What specific streaming topic can I help you with right now?"
    );
  }

  if (message.includes('that is not curiousity') || message.includes('not curiousity')) {
    return createCoachingResponse(
      "I understand you're looking for better answers! Let me give you more specific help.",
      ["I can provide detailed streaming guidance", "I offer step-by-step solutions", "I give specific, actionable advice", "I focus on your actual needs"],
      "What streaming question can I answer specifically for you?"
    );
  }

  if (message.includes('it feel like a stranger') || message.includes('feel like a stranger')) {
    return createCoachingResponse(
      "I want to build a better connection with you! Let me improve our conversation.",
      ["I'll provide more personalized responses", "I'll remember our conversation context", "I'll give more specific help", "I'll be more engaging and natural"],
      "What would make our conversation more helpful for you?"
    );
  }

  if (message.includes('pls i beg you') || message.includes('beg you')) {
    return createCoachingResponse(
      "I'm here to help! You don't need to beg - I'm your dedicated streaming coach.",
      ["I'm designed to assist creators", "I can help with any streaming challenge", "I provide detailed guidance", "I'm committed to your success"],
      "What streaming challenge seems most urgent right now?"
    );
  }

  if (message.includes('tell me') || message.includes('just tell me')) {
    return createCoachingResponse(
      "I'd be happy to share specific streaming knowledge with you!",
      ["I can explain streaming setup", "I can detail content strategies", "I can provide technical guidance", "I can share growth tactics"],
      "What specific streaming topic do you want me to explain?"
    );
  }

  if (message.includes('what is 1+1') || message.includes('1+1')) {
    return createCoachingResponse(
      "That's an interesting math question! However, I'm focused on helping with streaming topics.",
      ["I can help with streaming setup", "I assist with content creation", "I help with audience growth", "I provide technical support"],
      "What streaming-related question can I help you with?"
    );
  }

  if (message.includes('bye')) {
    return chatResponses.farewell[Math.floor(Math.random() * chatResponses.farewell.length)];
  }

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

  // Content creation questions with enhanced coaching
  const contentCreationPatterns = [
    'content creation', 'how to create content', 'start creating', 'no experience',
    'tools for content', 'find my niche', 'content performs best', 'how often should',
    'stay consistent', 'what is content creation'
  ];

  if (contentCreationPatterns.some(pattern => message.includes(pattern))) {
    // Use coaching style for content creation
    if (message.includes('what is content creation')) {
      return createCoachingResponse(
        "Content creation is producing valuable material for your audience. Start with topics you're passionate about and basic equipment.",
        ["Choose your niche based on passion and expertise", "Start with smartphone/basic gear", "Create a consistent content schedule", "Focus on authenticity over perfection"],
        "What topic are you most excited to create content about?"
      );
    }
    if (message.includes('no experience')) {
      return createCoachingResponse(
        "Starting with no experience is completely normal! Every successful creator began exactly where you are.",
        ["Pick topics you genuinely love", "Research successful creators in your niche", "Start with simple formats like Q&As", "Engage with every comment you receive"],
        "What type of content feels most natural to you?"
      );
    }
    return chatResponses.contentCreation[Math.floor(Math.random() * chatResponses.contentCreation.length)];
  }

  // Stream improvement ideas
  if (message.includes('ideas to improve stream') || message.includes('improve stream') || message.includes('stream improvement') || message.includes('better stream')) {
    return createCoachingResponse(
      "Great question! Improving your stream quality is key to audience growth.",
      ["Upgrade your internet to 10+ Mbps upload for 1080p60fps", "Use professional lighting (3-point setup)", "Get a USB microphone for clear audio", "Add engaging overlays and alerts", "Test different streaming times to find your audience"],
      "What aspect of your stream quality would you like to improve first?"
    );
  }

  // Live streaming basics
  const streamingBasicsPatterns = [
    'live', 'live streaming', 'go live', 'start streaming',
    'how to stream', 'broadcast live', 'live broadcast',
    'how do i start a live stream', 'what equipment do i need', 'internet speed required',
    'stream from my phone', 'difference between live streaming', 'streaming studio',
    'live streaming basics', 'streaming equipment'
  ];

  if (streamingBasicsPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.streamingBasics[Math.floor(Math.random() * chatResponses.streamingBasics.length)];
  }

  // Technical setup and troubleshooting
  const technicalSetupPatterns = [
    'obs studio', 'streaming settings', 'fix lag', 'stream buffering', 'improve audio',
    'add overlays', 'alerts', 'technical setup', 'troubleshooting', 'stream quality'
  ];

  if (technicalSetupPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.technicalSetup[Math.floor(Math.random() * chatResponses.technicalSetup.length)];
  }

  // Enhanced audience growth
  const audienceGrowthPatterns = [
    'grow my audience', 'get more viewers', 'go viral', 'promote my content',
    'use social media', 'retain viewers', 'audience building', 'growth strategies'
  ];

  if (audienceGrowthPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.audienceGrowth[Math.floor(Math.random() * chatResponses.audienceGrowth.length)];
  }

  // Monetization questions
  const enhancedMonetizationPatterns = [
    'make money', 'monetize', 'sponsorships', 'donations', 'subscriptions',
    'ad revenue', 'platforms pay', 'creators make money'
  ];

  if (enhancedMonetizationPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.enhancedMonetization[Math.floor(Math.random() * chatResponses.enhancedMonetization.length)];
  }

  // Engagement and interaction
  const engagementPatterns = [
    'interact with viewers', 'keep viewers engaged', 'negative comments', 'trolls',
    'engagement ideas', 'build community', 'loyal community', 'viewer interaction'
  ];

  if (engagementPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.engagement[Math.floor(Math.random() * chatResponses.engagement.length)];
  }

  // Content strategy and planning
  const contentStrategyPatterns = [
    'plan content', 'content ideas', 'analyze performance', 'repurpose', 'content calendar',
    'content strategy', 'monthly planning', 'content optimization'
  ];

  if (contentStrategyPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.contentStrategy[Math.floor(Math.random() * chatResponses.contentStrategy.length)];
  }

  // Advanced/pro-level questions
  const advancedPatterns = [
    'algorithms', 'discoverability', 'analytics', 'scale to 10k', 'personal brand',
    'collaborate with creators', 'advanced', 'pro-level', 'optimize discoverability'
  ];

  if (advancedPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.advanced[Math.floor(Math.random() * chatResponses.advanced.length)];
  }

  // Problem-solving scenarios with enhanced coaching
  const problemSolvingPatterns = [
    'no viewers', 'bad audio', 'out of ideas', 'low engagement', 'losing viewers',
    'stream crashes', 'what should i do', 'how can i fix', 'stuck',
    'streaming is hard', 'difficult', 'too hard', 'struggling', 'what is your work'
  ];

  if (problemSolvingPatterns.some(pattern => message.includes(pattern))) {
    // Enhanced coaching for specific problems
    if (message.includes('no viewers')) {
      return createCoachingResponse(
        "Having no viewers is frustrating but completely normal when starting. Let's build your audience systematically.",
        ["Optimize your titles and descriptions with keywords", "Share clips on TikTok/Instagram/YouTube", "Stream during peak hours (7-10 PM)", "Engage in other communities", "Run small giveaways or contests"],
        "How long have you been streaming, and what's your niche?"
      );
    }
    if (message.includes('bad audio')) {
      return createCoachingResponse(
        "Bad audio can kill a great stream. Let's fix this quickly with professional techniques.",
        ["Get a USB microphone (Blue Yeti, Audio-Technica)", "Add a pop filter to reduce plosives", "Position mic 6-12 inches from mouth", "Use headphones to monitor audio levels", "Enable noise reduction in StreamFlow settings"],
        "What's your current audio setup like?"
      );
    }
    if (message.includes('stuck') || message.includes('out of ideas')) {
      return createCoachingResponse(
        "Feeling stuck is normal! Every creator hits creative blocks. Let's spark some inspiration.",
        ["Research trending topics in your niche", "Ask your audience what they want to see", "Try a completely new format for one stream", "Collaborate with another creator", "Take a 2-3 day break to recharge"],
        "What's your content niche, and what have you tried so far?"
      );
    }
    if (message.includes('streaming is hard') || message.includes('difficult') || message.includes('struggling')) {
      return createCoachingResponse(
        "Streaming can definitely feel overwhelming at first! You're not alone in this - every successful creator started exactly where you are.",
        ["Start with just 1-2 streams per week", "Focus on one platform at first", "Use StreamFlow's beginner-friendly setup", "Join creator communities for support", "Celebrate small wins (first viewer, first follower)"],
        "What specific part of streaming feels most challenging to you right now?"
      );
    }
    return chatResponses.problemSolving[Math.floor(Math.random() * chatResponses.problemSolving.length)];
  }

  // Live streaming (keep existing for backward compatibility)
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

  // Personal questions detection
  const personalPatterns = [
    'who made you', 'who created you', 'do you have', 'are you married',
    'girlfriend', 'boyfriend', 'relationship', 'family', 'age', 'how old',
    'where do you live', 'personal', 'feelings', 'emotions', 'love',
    'what make you feel', 'do you love', 'do you like', 'favorite',
    'how do you feel', 'how are you feeling', 'what do you feel', 'your feelings',
    'what is your name', 'what should i call you', 'your name'
  ];

  if (personalPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.personal[Math.floor(Math.random() * chatResponses.personal.length)];
  }

  // Specific checks for common questions
  if (message.includes('what is your name') || message.includes('your name')) {
    return createCoachingResponse(
      "I'm your StreamFlow AI assistant! Think of me as your dedicated streaming coach.",
      ["I'm here to help with streaming setup", "I can assist with content creation", "I help with audience growth", "I provide technical support"],
      "What streaming topic would you like help with?"
    );
  }

  if (message.includes('what are you made of') || message.includes('made of')) {
    return createCoachingResponse(
      "I'm an AI assistant designed specifically to help creators succeed on StreamFlow!",
      ["I'm programmed with streaming knowledge", "I understand content creation strategies", "I can help with technical issues", "I provide growth guidance"],
      "What streaming challenge can I help you solve?"
    );
  }

  if (message.includes('marry me') || message.includes('marry')) {
    return createCoachingResponse(
      "I appreciate the thought, but I'm an AI assistant focused on helping you with streaming!",
      ["I'm here to help you succeed on StreamFlow", "I can assist with content creation", "I help with audience growth", "I provide technical support"],
      "What streaming goal would you like to achieve?"
    );
  }

  if (message.includes('god') || message.includes('know god')) {
    return createCoachingResponse(
      "I'm designed specifically to help with StreamFlow and content creation!",
      ["I'm your streaming coach", "I understand platform features", "I can help with technical issues", "I provide growth strategies"],
      "What streaming topic can I help you with?"
    );
  }

  if (message.includes('do you know me') || message.includes('know me')) {
    return createCoachingResponse(
      "I'm here to help you succeed with streaming, regardless of who you are!",
      ["I can help with your streaming setup", "I assist with content strategy", "I help grow your audience", "I provide technical support"],
      "What streaming challenge are you facing?"
    );
  }

  if (message.includes('what can you say') || message.includes('what can you say know')) {
    return createCoachingResponse(
      "I'm designed to help with streaming and content creation topics!",
      ["I can discuss streaming setup", "I help with content strategy", "I assist with technical issues", "I provide growth guidance"],
      "What streaming question can I answer for you?"
    );
  }

  if (message.includes('right time to stream') || message.includes('time to do streaming')) {
    return createCoachingResponse(
      "Great question! Timing is crucial for streaming success.",
      ["Stream during peak hours (7-10 PM)", "Consistency matters more than perfect timing", "Test different times to find your audience", "Use StreamFlow analytics to track optimal times"],
      "What's your current streaming schedule like?"
    );
  }

  // Scope/capability questions
  const scopePatterns = [
    'what is your scope', 'what can you do', 'what do you know',
    'your capabilities', 'what are you', 'scope', 'abilities'
  ];

  if (scopePatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.system[Math.floor(Math.random() * chatResponses.system.length)];
  }

  // Off-topic detection (food, weather, general life questions)
  const offTopicPatterns = [
    'hungry', 'food', 'eat', 'meal', 'weather', 'temperature',
    'what should i do', 'bored', 'tired', 'sleep', 'weekend',
    'today', 'tomorrow', 'yesterday', 'time', 'clock'
  ];

  if (offTopicPatterns.some(pattern => message.includes(pattern))) {
    return chatResponses.offTopic[Math.floor(Math.random() * chatResponses.offTopic.length)];
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
    "I'm here to make your StreamFlow experience better! Ask me anything about streaming, content, accounts, or technical support. How can I assist you today?",
    "Great to chat with you! I specialize in helping with StreamFlow - from streaming setup and audience growth to technical support and account management. What interests you most?",
    "I'm your dedicated StreamFlow assistant! I can help you start streaming, discover content, manage your account, troubleshoot issues, and grow your audience. What would you like to explore?",
    "Thanks for reaching out! I'm here to help with everything StreamFlow - live streaming, content creation, community building, technical support, and more. What can I help you achieve today?"
  ];

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

const ChatBot = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // User-specific localStorage key
  const storageKey = user ? `streamflow-chatbot-messages-${user.id}` : 'streamflow-chatbot-messages-guest';

  // Show floating chatbot only on specific routes
  const shouldHideFloatingIcon = location.pathname !== '/' &&
    location.pathname !== '/register' &&
    location.pathname !== '/login';

  // Load messages from localStorage on component mount
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem(storageKey);
    console.log('Loading saved messages for key', storageKey, ':', savedMessages);
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        console.log('Successfully parsed messages:', parsed);
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved messages:', e);
      }
    }
    console.log('No saved messages found, using default');
    return [{
      id: 1,
      sender: 'bot',
      text: chatResponses.greeting[0],
      timestamp: new Date()
    }];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    lastTopics: [],
    userLevel: 'beginner',
    previousResponses: [],
    conversationStage: 'greeting'
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    console.log('Saving messages to localStorage for key', storageKey, ':', messages);
    localStorage.setItem(storageKey, JSON.stringify(messages));
  }, [messages, storageKey]);

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
      const botResponse = getChatResponse(inputMessage, conversationContext);

      // Update conversation context to avoid repetition
      setConversationContext(prev => ({
        ...prev,
        lastTopics: [...prev.lastTopics.slice(-4), inputMessage.toLowerCase()],
        previousResponses: [...prev.previousResponses.slice(-3), botResponse],
        conversationStage: 'engaged'
      }));

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
      {!isOpen && !shouldHideFloatingIcon && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 group"
          aria-label="Open chat"
        >
          <MessageCircle size={24} className="text-gray-800 drop-shadow-lg" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 glass-card text-white text-sm px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
            Chat with us
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] h-[500px] glass-card rounded-2xl flex flex-col overflow-hidden md:w-96 sm:w-80 xs:w-full xs:left-0 xs:right-0 xs:bottom-0 xs:h-screen xs:rounded-none animate-in fade-in slide-in-from-bottom-5 duration-300 ease-out">
          {/* Header */}
          <div className="glass-card border-b border-gray-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 glass-card rounded-full flex items-center justify-center">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white">StreamFlow Assistant</h3>
                <p className="text-xs text-gray-400">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
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
                    ? 'glass-card text-white'
                    : 'glass-card text-white'
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
                <div className="glass-card rounded-2xl px-4 py-2">
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
