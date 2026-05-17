// Eski hatalı LocalStorage verilerini tamamen temizleyip sıfırlayalım
if(!localStorage.getItem('sys_init_2026')) {
    localStorage.clear();
    localStorage.setItem('sys_init_2026', 'true');
}

const FOUNDER_USER = "riche";

// Hafızayı taze ve hatasız başlatalım
let users = JSON.parse(localStorage.getItem('users')) || [];
if (users.length === 0) {
    users.push({ 
        username: FOUNDER_USER, 
        password: "any", // Bypass olduğu için fark etmeyecek
        email: "arapsabunuhamlatan@gmail.com", 
        role: "kurucu", 
        hasNitro: true, 
        avatar: "https://i.gifer.com/ZZ5H.gif", 
        banner: "https://i.gifer.com/4V0b.gif", 
        joinDate: "17 Mayıs 2026" 
    });
    localStorage.setItem('users', JSON.stringify(users));
}

if (!localStorage.getItem('servers')) {
    localStorage.setItem('servers', JSON.stringify([{ id: "srv-1", name: "LunaHub Topluluk", channels: ["genel-sohbet", "duyurular"], messages: [] }]));
}
if (!localStorage.getItem('friends')) {
    localStorage.setItem('friends', JSON.stringify(["riche", "Ahmet", "LunaBot"]));
}

let isLoginMode = true;
let isCaptchaChecked = false;

// --- GARANTİLİ TIKLAMA DİNLEYİCİSİ ---
document.body.addEventListener('click', function(e) {
    
    // Captcha Kutusu Tıklaması
    if (e.target && (e.target.id === 'captcha-btn' || e.target.closest('#captcha-btn'))) {
        const cBtn = document.getElementById('captcha-btn');
        isCaptchaChecked = !isCaptchaChecked;
        if (cBtn) cBtn.classList.toggle('checked', isCaptchaChecked);
    }

    // Hesap Oluştur / Giriş Yap Link Geçişi (Kesin tetikleyici)
    if (e.target && e.target.id === 'switch-auth') {
        e.preventDefault();
        isLoginMode = !isLoginMode;
        
        const formTitle = document.getElementById('form-title');
        const formDesc = document.getElementById('form-desc');
        const submitBtn = document.getElementById('submit-btn');
        const authSubtitle = document.getElementById('auth-subtitle');
        const toggleContainer = document.getElementById('toggle-container');
        const userLabel = document.getElementById('user-label');
        const usernameInput = document.getElementById('username');

        if (isLoginMode) {
            if(formTitle) formTitle.innerText = "Giriş yap";
            if(formDesc) formDesc.innerText = "Hesabına giriş yap ve sohbete katıl";
            if(submitBtn) submitBtn.innerText = "→ Giriş Yap";
            if(authSubtitle) authSubtitle.innerText = "Tekrar hoş geldin!";
            if(userLabel) userLabel.innerText = "E-Posta Adresi veya Kullanıcı Adı";
            if(usernameInput) usernameInput.placeholder = "ornek@email.com veya kullanıcı adı";
            if(toggleContainer) toggleContainer.innerHTML = 'Hesabın yok mu? <button class="toggle-link" id="switch-auth">Hesap oluştur</button>';
        } else {
            if(formTitle) formTitle.innerText = "Hesap oluştur";
            if(formDesc) formDesc.innerText = "Sohbete katılmak için ilk adımı at";
            if(submitBtn) submitBtn.innerText = "✓ Kayıt Ol";
            if(authSubtitle) authSubtitle.innerText = "Aramıza Katıl!";
            if(userLabel) userLabel.innerText = "Kullanıcı Adı Belirleyin";
            if(usernameInput) usernameInput.placeholder = "Kullanıcı adınızı yazın";
            if(toggleContainer) toggleContainer.innerHTML = 'Zaten hesabın var mı? <button class="toggle-link" id="switch-auth">Giriş yap</button>';
        }
    }
});

// --- FORM GÖNDERME (KAYIT VE GİRİŞ) ---
document.getElementById('auth-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (!isCaptchaChecked) {
        alert("Lütfen robot olmadığınızı doğrulayın (Kutucuğa tıklayın).");
        return;
    }
    
    const userInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value;
    let localUsers = JSON.parse(localStorage.getItem('users')) || [];

    // 🔥 KESİN KURUCU BYPASS (Şifre ne olursa olsun "riche" yazarsan direkt girer!)
    if (userInput.toLowerCase() === "riche") {
        let founder = { 
            username: "riche", 
            email: "arapsabunuhamlatan@gmail.com", 
            role: "kurucu", 
            hasNitro: true, 
            avatar: "https://i.gifer.com/ZZ5H.gif", 
            banner: "https://i.gifer.com/4V0b.gif", 
            joinDate: "17 Mayıs 2026" 
        };
        localStorage.setItem('currentUser', JSON.stringify(founder));
        alert("Hoş geldin Kurucu Riche! Sistem başarıyla yüklendi.");
        loadMainApp();
        return;
    }

    if (isLoginMode) {
        // Normal kullanıcı girişi
        const user = localUsers.find(u => (u.username === userInput || u.email === userInput) && u.password === passwordInput);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            loadMainApp();
        } else {
            alert("Hatalı Kullanıcı Adı veya Şifre!");
        }
    } else {
        // Yeni kayıt açma modu
        const userExists = localUsers.find(u => u.username.toLowerCase() === userInput.toLowerCase());
        if (userExists) {
            alert("Bu kullanıcı adı zaten alınmış!");
            return;
        }

        let newUser = { 
            username: userInput, 
            email: userInput.includes('@') ? userInput : userInput + "@luna.com", 
            password: passwordInput, 
            role: "user", 
            hasNitro: false, 
            avatar: "https://status.discordapp.com/static/images/logged_out_avatar.png", 
            banner: "#252836", 
            joinDate: "17 Mayıs 2026" 
        };
        
        localUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(localUsers));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        alert("Hesap başarıyla oluşturuldu!");
        loadMainApp();
    }
});

// --- DISCORD / LUNAHUB SOHBET ARAYÜZÜ ---
let activeTab = 'sohbet'; 
let activeChannel = 'genel-sohbet';

function loadMainApp() {
    renderMainLayout();
}

function renderMainLayout() {
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(!currentUser) return;
    
    document.body.innerHTML = `
    <div style="display: flex; flex-direction: column; width: 100vw; height: 100vh; background-color: #12141c;">
        <div id="app-body" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; margin-bottom: 60px;"></div>
        <div style="position: fixed; bottom: 0; left: 0; right: 0; height: 60px; background-color: #1c1e28; border-top: 1px solid #282a36; display: flex; justify-content: space-around; align-items: center; z-index: 9999;">
            <div onclick="switchNavigation('anasayfa')" style="text-align:center; cursor:pointer; color: ${activeTab==='anasayfa' ? '#00e5bc':'#9aa0a6'};">
                <div style="font-size:20px;">🏠</div><div style="font-size:10px;">An Sayfa</div>
            </div>
            <div onclick="switchNavigation('mesajlar')" style="text-align:center; cursor:pointer; color: ${activeTab==='mesajlar' ? '#00e5bc':'#9aa0a6'};">
                <div style="font-size:20px;">💬</div><div style="font-size:10px;">Mesajlar</div>
            </div>
            <div onclick="switchNavigation('sohbet')" style="text-align:center; cursor:pointer; color: ${activeTab==='sohbet' ? '#00e5bc':'#9aa0a6'};">
                <div style="font-size:20px;">🌐</div><div style="font-size:10px;">Sohbet</div>
            </div>
            <div onclick="switchNavigation('arkadaslar')" style="text-align:center; cursor:pointer; color: ${activeTab==='arkadaslar' ? '#00e5bc':'#9aa0a6'};">
                <div style="font-size:20px;">👥</div><div style="font-size:10px;">Arkadaşlar</div>
            </div>
            <div onclick="switchNavigation('ayarlar')" style="text-align:center; cursor:pointer; color: ${activeTab==='ayarlar' ? '#00e5bc':'#9aa0a6'};">
                <div style="font-size:20px;">⚙️</div><div style="font-size:10px;">Ayarlar</div>
            </div>
        </div>
    </div>
    `;
    renderTabContent();
}

function switchNavigation(tabName) {
    activeTab = tabName;
    renderMainLayout();
}

function renderTabContent() {
    const body = document.getElementById('app-body');
    if(!body) return;
    
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let friends = JSON.parse(localStorage.getItem('friends')) || [];
    let servers = JSON.parse(localStorage.getItem('servers')) || [];

    if (activeTab === 'sohbet') {
        let server = servers[0]; 
        let channelMessages = server.messages ? server.messages.filter(m => m.channel === activeChannel) : [];
        
        body.innerHTML = `
            <div style="padding: 16px; background: #1c1e28; border-bottom: 1px solid #282a36; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-weight:700; font-size:18px;">👑 ${server.name} (#${activeChannel})</span>
                <button onclick="createNewChannelPrompt()" style="background:#252836; color:#00e5bc; border:1px solid #2f3345; padding:6px 12px; border-radius:6px; cursor:pointer; font-size:12px;">+ Kanal Aç</button>
            </div>
            <div style="display:flex; gap:8px; padding:10px 16px; background:#12141c; overflow-x:auto; border-bottom:1px solid #1c1e28;">
                ${server.channels.map(ch => `
                    <span onclick="activeChannel='${ch}'; renderTabContent();" style="padding:6px 12px; border-radius:20px; font-size:13px; cursor:pointer; background:${activeChannel===ch ? '#00e5bc':'#1c1e28'}; color:${activeChannel===ch ? '#12141c':'#9aa0a6'}; font-weight:bold;"># ${ch}</span>
                `).join('')}
            </div>
            <div id="chat-stream" style="flex:1; padding:16px; overflow-y:auto; display:flex; flex-direction:column; gap:16px;">
                ${channelMessages.map(m => `
                    <div style="display:flex; gap:12px; align-items:flex-start;">
                        <img src="${m.avatar}" style="width:38px; height:38px; border-radius:50%; object-fit:cover; border: 1px solid #00e5bc;">
                        <div>
                            <span style="font-weight:700; font-size:14px; color:#fff;">${m.user}</span>
                            <div style="color:#d1d2d6; margin-top:4px; font-size:14px;">${m.text}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div style="padding:12px 16px; background:#1c1e28;">
                <div style="background:#252836; border-radius:10px; padding:8px 12px; display:flex; align-items:center; border: 1px solid #2f3345;">
                    <input type="text" id="msg-input" placeholder="#${activeChannel} odasına yaz..." style="background:transparent; border:none; flex:1; color:white; padding:4px; outline:none;">
                    <button onclick="sendGlobalMessage()" style="background:#00e5bc; color:#12141c; padding:6px 16px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Gönder</button>
                </div>
            </div>
        `;
    } else if (activeTab === 'ayarlar') {
        body.innerHTML = `
            <div style="padding: 16px; background:#1c1e28; border-bottom:1px solid #282a36; font-weight:700; font-size:18px;">⚙️ Kullanıcı Ayarları</div>
            <div style="padding:20px;">
                <h3>Hoş geldin, ${currentUser.username}</h3>
                <button onclick="localStorage.removeItem('currentUser'); location.reload();" style="background:#ff4d4d; color:white; border:none; padding:12px; border-radius:10px; font-weight:bold; cursor:pointer; width:100%; margin-top:20px;">Çıkış Yap</button>
            </div>
        `;
    }
}

function sendGlobalMessage() {
    const input = document.getElementById('msg-input');
    if(!input || input.value.trim() === "") return;
    let servers = JSON.parse(localStorage.getItem('servers'));
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));
    servers[0].messages.push({ user: currentUser.username, avatar: currentUser.avatar, channel: activeChannel, text: input.value.trim() });
    localStorage.setItem('servers', JSON.stringify(servers));
    input.value = "";
    renderTabContent();
}

if(localStorage.getItem('currentUser')) { loadMainApp(); }

