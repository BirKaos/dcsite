// --- SİSTEM AYARLARI VE KURUCU HESABI ---
const FOUNDER_USER = "riche";
const FOUNDER_PASS = "richeLuna2026"; // Kurucu Şifresi

// Başlangıç Veritabanı Kurulumu
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
        { username: FOUNDER_USER, password: FOUNDER_PASS, role: "kurucu", hasNitro: true, avatar: "https://i.gifer.com/ZZ5H.gif", banner: "https://i.gifer.com/4V0b.gif" }
    ]));
}
if (!localStorage.getItem('servers')) {
    localStorage.setItem('servers', JSON.stringify([{ id: "srv-1", name: "LunaHub Resmi Topluluk", icon: "🌙", channels: ["genel-sohbet", "duyurular"], messages: [] }]));
}
if (!localStorage.getItem('friends')) {
    localStorage.setItem('friends', JSON.stringify(["riche"])); // Başlangıçta herkes kurucuya arkadaşlık atabilsin
}

// Giriş / Kayıt Ekranı Yönetimi
const title = document.getElementById('title');
const submitBtn = document.getElementById('submit-btn');
const toggleAuth = document.getElementById('toggle-auth');
const toggleP = document.getElementById('toggle-p');
let isLogin = true;

if (toggleAuth) {
    document.addEventListener('click', function(e) {
        if(e.target && e.target.id === 'toggle-auth') {
            isLogin = !isLogin;
            if (!isLogin) {
                title.innerText = "Hesap Oluştur";
                submitBtn.innerText = "Kayıt Ol";
                toggleP.innerHTML = "Zaten hesabın var mı? <span id='toggle-auth'>Giriş Yap</span>";
            } else {
                title.innerText = "Giriş Yap";
                submitBtn.innerText = "Giriş Yap";
                toggleP.innerHTML = "Hesabın yok mu? <span id='toggle-auth'>Kayıt Ol</span>";
            }
        }
    });
}

// Giriş ve Kayıt İşlemleri
const authForm = document.getElementById('auth-form');
if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value;
        let users = JSON.parse(localStorage.getItem('users'));

        if (!isLogin) {
            // KAYIT OLMA
            if (userInput.toLowerCase() === "riche") {
                alert("Bu kurucu adını kullanamazsınız!");
                return;
            }
            const userExists = users.find(u => u.username === userInput);
            if (userExists) { alert("Bu kullanıcı adı zaten alınmış!"); return; }

            users.push({ username: userInput, password: passwordInput, role: "user", hasNitro: false, avatar: "https://status.discordapp.com/static/images/logged_out_avatar.png", banner: "#2f3e4e" });
            localStorage.setItem('users', JSON.stringify(users));
            alert("Kayıt Başarılı! Giriş yapabilirsiniz.");
            location.reload();
        } else {
            // GİRİŞ YAPMA
            const user = users.find(u => u.username === userInput && u.password === passwordInput);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert(`Giriş Başarılı! Hoş geldin, ${user.username}`);
                loadMainInterface();
            } else {
                alert("Hatalı Kullanıcı Adı veya Şifre!");
            }
        }
    });
}

// --- ANA DISCORD / LUNAHUB SİSTEMİ ARAYÜZÜ ---
function loadMainInterface() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let nitroBadge = currentUser.hasNitro ? `<span style="background:#ff73fa; color:white; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:5px; font-weight:bold;">NİTRO</span>` : '';
    let founderBadge = currentUser.role === "kurucu" ? `<span style="background:#f1c40f; color:black; padding:2px 6px; border-radius:4px; font-size:10px; margin-left:5px; font-weight:bold;">KURUCU</span>` : '';

    document.body.innerHTML = `
    <div style="display: flex; width: 100vw; height: 100vh; background: #2f3136;">
        <!-- 1. SÜTUN: DISCORD SUNUCU LİSTESİ -->
        <div id="server-list" style="width: 70px; background: #202225; display: flex; flex-direction: column; align-items: center; padding-top: 15px; gap: 10px;">
            <div onclick="switchTab('friends-tab')" style="width: 48px; height: 48px; background: #5865F2; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 20px;" title="Arkadaşlar">👥</div>
            <div style="width: 32px; height: 2px; background: #36393f;"></div>
            <!-- Dinamik Sunucular Buraya Gelecek -->
            <div id="dynamic-servers" style="display:flex; flex-direction:column; gap:10px;"></div>
            <div onclick="createNewServerPrompt()" style="width: 48px; height: 48px; background: #36393f; color: #43b581; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 24px; font-weight: bold;" title="Sunucu Ekle">+</div>
        </div>

        <!-- 2. SÜTUN: KANALLAR VEYA ARKADAŞ LİSTESİ -->
        <div style="width: 240px; background: #2f3136; display: flex; flex-direction: column; justify-content: space-between; border-right: 1px solid #202225;">
            <div style="padding: 15px; background: #2f3136; font-weight: bold; border-bottom: 1px solid #202225; box-shadow: 0 1px 2px rgba(0,0,0,0.2);" id="sidebar-header">LunaHub Ana Sayfa</div>
            
            <!-- Dinamik Alt Liste (Kanallar veya Arkadaşlar) -->
            <div id="sidebar-content" style="flex: 1; padding: 10px; overflow-y: auto;"></div>

            <!-- Kullanıcı Alt Paneli (Discord Tarzı) -->
            <div style="padding: 10px; background: #292b2f; display: flex; align-items: center; justify-content: space-between;">
                <div style="display: flex; align-items: center; gap: 8px; cursor:pointer;" onclick="openProfileSettings()">
                    <img src="${currentUser.avatar}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;">
                    <div style="max-width: 110px; overflow: hidden;">
                        <div style="font-size: 13px; font-weight: bold; white-space: nowrap;">${currentUser.username}</div>
                        <div style="font-size: 11px; color: #b9bbbe;">#0001</div>
                    </div>
                </div>
                <div style="display:flex; gap:3px;">${founderBadge}${nitroBadge}</div>
            </div>
        </div>

        <!-- 3. SÜTUN: ANA CHAT / İÇERİK ALANI -->
        <div id="main-content" style="flex: 1; background: #36393f; display: flex; flex-direction: column;"></div>
    </div>
    `;
    
    // Varsayılan sekmeyi yükle
    switchTab('friends-tab');
    renderServers();
}

// --- SUNUCU KURMA VE DAVET SİSTEMİ ---
function renderServers() {
    const container = document.getElementById('dynamic-servers');
    if(!container) return;
    let servers = JSON.parse(localStorage.getItem('servers')) || [];
    container.innerHTML = servers.map(srv => `
        <div onclick="switchTab('server-${srv.id}')" style="width: 48px; height: 48px; background: #36393f; border-radius: 50%; display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 18px; font-weight: bold; transition:0.2s;" title="${srv.name}">
            ${srv.name.substring(0,2).toUpperCase()}
        </div>
    `).join('');
}

function createNewServerPrompt() {
    let serverName = prompt("Yeni Discord Sunucunuzun Adını Girin:");
    if (!serverName) return;
    let servers = JSON.parse(localStorage.getItem('servers')) || [];
    let newId = "srv-" + Date.now();
    servers.push({ id: newId, name: serverName, icon: "📁", channels: ["genel-sohbet", "duyurular", "kod-paylasim"], messages: [] });
    localStorage.setItem('servers', JSON.stringify(servers));
    renderServers();
    switchTab(`server-${newId}`);
}

// --- SEKME DEĞİŞTİRME MANTIĞI (ARKADAŞLAR / SUNUCULAR) ---
let currentActiveTab = 'friends-tab';
let currentActiveChannel = 'genel-sohbet';

function switchTab(tabId) {
    currentActiveTab = tabId;
    const sidebarHeader = document.getElementById('sidebar-header');
    const sidebarContent = document.getElementById('sidebar-content');
    const mainContent = document.getElementById('main-content');

    if (tabId === 'friends-tab') {
        sidebarHeader.innerText = "📍 Ana Sayfa";
        sidebarContent.innerHTML = `
            <div style="color: #8e9297; font-size: 12px; font-weight: bold; padding: 5px 10px;">DİREKT MESAJLAR</div>
            <div style="padding: 8px 10px; background: rgba(255,255,255,0.05); border-radius:4px; margin-top:5px; color:#fff;">🤖 Kurucu (riche)</div>
        `;
        
        // Arkadaşlık ve Nitro Sayfası
        let friends = JSON.parse(localStorage.getItem('friends')) || [];
        let friendsListHTML = friends.map(f => `<div style="padding:15px; background:#2f3136; border-radius:8px; display:flex; justify-content:space-between; align-items:center;"><span>👤 ${f}</span><span style="color:#43b581; font-size:13px;">● Çevrimiçi</span></div>`).join('');

        mainContent.innerHTML = `
            <div style="padding: 20px; border-bottom: 1px solid #202225; display: flex; gap: 20px; align-items: center;">
                <h3 style="font-size:16px;">👥 Arkadaşlar</h3>
                <button onclick="addFriendPrompt()" style="width:auto; padding: 6px 16px; background:#43b581; font-size:14px;">Arkadaş Ekle</button>
                <input type="text" id="nitro-code-input" placeholder="Nitro Kodu Gir (/lunahub2026)" style="margin:0; width:250px; padding:6px;">
                <button onclick="claimNitro()" style="width:auto; padding: 6px 16px; background:#ff73fa; font-size:14px;">Kodu Kullan</button>
            </div>
            <div style="padding: 20px; flex: 1; overflow-y: auto; display:flex; flex-direction:column; gap:10px;">
                <h4 style="color:#b9bbbe; font-size:12px;">TÜM ARKADAŞLAR (${friends.length})</h4>
                ${friendsListHTML}
            </div>
        `;
    } else if (tabId.startsWith('server-')) {
        let servers = JSON.parse(localStorage.getItem('servers')) || [];
        let srvId = tabId.replace('server-', '');
        let server = servers.find(s => s.id == srvId);
        
        if(!server) return;

        sidebarHeader.innerText = `👑 ${server.name}`;
        sidebarContent.innerHTML = `
            <div style="margin-bottom:10px;"><button onclick="alert('Davet Linki: https://lunahub.netlify.app/join/${server.id}')" style="background:#5865F2; padding:5px; font-size:12px;">Sunucu Davet Linki Oluştur</button></div>
            <div style="color: #8e9297; font-size: 12px; font-weight: bold; padding: 5px 10px;">METİN KANALLARI</div>
            ${server.channels.map(ch => `<div onclick="currentActiveChannel='${ch}'; switchTab('${tabId}')" style="padding: 6px 10px; border-radius:4px; cursor:pointer; background: ${currentActiveChannel === ch ? 'rgba(255,255,255,0.1)' : 'transparent'}; margin-top:2px; color:#b9bbbe;"># ${ch}</div>`).join('')}
        `;

        // Sunucu Mesajlaşma Alanı
        let currentMessages = server.messages || [];
        let filteredMsgs = currentMessages.filter(m => m.channel === currentActiveChannel);
        let msgsHTML = filteredMsgs.map(m => `
            <div style="display:flex; gap:10px; align-items:flex-start;">
                <img src="${m.avatar}" style="width:40px; height:40px; border-radius:50%; object-fit:cover;">
                <div>
                    <span style="font-weight:bold; font-size:14px; color:#fff;">${m.user}</span> <span style="font-size:10px; color:#72767d;">Bugün</span>
                    <div style="color:#dcddde; margin-top:4px; font-size:15px;">${m.text}</div>
                </div>
            </div>
        `).join('');

        mainContent.innerHTML = `
            <div style="padding: 15px; background: #36393f; font-weight:bold; border-bottom: 1px solid #202225;"># ${currentActiveChannel}</div>
            <div id="server-chat-box" style="flex:1; padding:20px; overflow-y:auto; display:flex; flex-direction:column; gap:15px;">${msgsHTML}</div>
            <div style="padding:20px; background:#36393f;">
                <div style="background:#40444b; border-radius:8px; padding:10px; display:flex;">
                    <input type="text" id="srv-msg-input" placeholder="#${currentActiveChannel} kanalına mesaj gönder" style="margin:0; background:transparent; border:none; flex:1; color:white;">
                    <button onclick="sendServerMessage('${server.id}')" style="width:auto; padding:0 20px; background:#5865F2;">Gönder</button>
                </div>
            </div>
        `;
        setTimeout(() => { let c = document.getElementById('server-chat-box'); if(c) c.scrollTop = c.scrollHeight; }, 50);
    }
}

// --- ARKADAŞ EKLEME SİSTEMİ ---
function addFriendPrompt() {
    let name = prompt("Eklemek istediğiniz arkadaşın kullanıcı adını yazın:");
    if(!name) return;
    let friends = JSON.parse(localStorage.getItem('friends')) || [];
    if(friends.includes(name)) { alert("Bu kişi zaten arkadaşınız!"); return; }
    friends.push(name);
    localStorage.setItem('friends', JSON.stringify(friends));
    switchTab('friends-tab');
}

// --- SUNUCUYA MESAJ GÖNDERME ---
function sendServerMessage(serverId) {
    const input = document.getElementById('srv-msg-input');
    if(!input || input.value.trim() === "") return;

    let servers = JSON.parse(localStorage.getItem('servers')) || [];
    let serverIndex = servers.findIndex(s => s.id === serverId);
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(serverIndex === -1) return;

    if(!servers[serverIndex].messages) servers[serverIndex].messages = [];
    
    servers[serverIndex].messages.push({
        user: currentUser.username,
        avatar: currentUser.avatar,
        channel: currentActiveChannel,
        text: input.value.trim()
    });

    localStorage.setItem('servers', JSON.stringify(servers));
    input.value = "";
    switchTab(`server-${serverId}`);
}

// --- GIF'Lİ PROFİL, BANNER VE NİTRO ALMA SİSTEMİ ---
function claimNitro() {
    const code = document.getElementById('nitro-code-input').value.trim();
    if (code === "/lunahub2026") {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let users = JSON.parse(localStorage.getItem('users'));
        
        currentUser.hasNitro = true;
        // Nitro alındığı için varsayılan olarak harika bir kurucu GIF'i verelim profil için
        currentUser.avatar = "https://i.gifer.com/ZZ5H.gif";
        currentUser.banner = "https://i.gifer.com/4V0b.gif";

        // Veritabanını güncelle
        let idx = users.findIndex(u => u.username === currentUser.username);
        users[idx] = currentUser;
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('users', JSON.stringify(users));

        alert("🎉 TEBRİKLER! /lunahub2026 Kodunu Kullandın Ve Klasik Nitro Profil Özellikleri Tanımlandı! Artık Profilinde GIF Kullanabilirsin.");
        loadMainInterface();
    } else {
        alert("Geçersiz Nitro Kodu!");
    }
}

function openProfileSettings() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser.hasNitro) {
        alert("Profilini değiştirmek ve GIF eklemek için öncelikle Nitro aktif etmelisin! Kodu kullan kısmına /lunahub2026 yaz.");
        return;
    }

    let newAvatar = prompt("GIF veya Resim Profil URL'si girin:", currentUser.avatar);
    let newBanner = prompt("GIF veya Resim Üst Banner URL'si girin:", currentUser.banner);

    if(newAvatar) currentUser.avatar = newAvatar;
    if(newBanner) currentUser.banner = newBanner;

    let users = JSON.parse(localStorage.getItem('users'));
    let idx = users.findIndex(u => u.username === currentUser.username);
    users[idx] = currentUser;

    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    localStorage.setItem('users', JSON.stringify(users));
    
    alert("Profil Özellikleri Başarıyla Güncellendi!");
    loadMainInterface();
            }
            
