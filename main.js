// --- SİSTEM AYARLARI VE KURUCU HESABI SİSTEMİ ---
const FOUNDER_USER = "riche";
const FOUNDER_PASS = "richeLuna2026";

// Tarayıcı hafızasını ilklendirme (Local Storage)
if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
        { username: FOUNDER_USER, password: FOUNDER_PASS, email: "arapsabunuhamlatan@gmail.com", role: "kurucu", hasNitro: true, avatar: "https://i.gifer.com/ZZ5H.gif", banner: "https://i.gifer.com/4V0b.gif", joinDate: "17 Mayıs 2026" }
    ]));
}
if (!localStorage.getItem('servers')) {
    localStorage.setItem('servers', JSON.stringify([{ id: "srv-1", name: "LunaHub Topluluk", channels: ["genel-sohbet", "duyurular"], messages: [] }]));
}
if (!localStorage.getItem('friends')) {
    localStorage.setItem('friends', JSON.stringify(["riche", "Ahmet", "LunaBot"]));
}

// Global Durum Takip Değişkenleri
let isLoginMode = true;
let isCaptchaChecked = false;

// --- KİLİTLENMEYİ ÖNLEYEN GLOBAL TIKLAMA DİNLEYİCİSİ ---
document.addEventListener('click', function(e) {
    
    // 1. reCAPTCHA Kutusuna Tıklanma Kontrolü
    if (e.target && (e.target.id === 'captcha-btn' || e.target.closest('#captcha-btn'))) {
        const cBtn = document.getElementById('captcha-btn');
        isCaptchaChecked = !isCaptchaChecked;
        if (cBtn) {
            cBtn.classList.toggle('checked', isCaptchaChecked);
        }
    }

    // 2. "Hesap Oluştur" / "Giriş Yap" Linkine Tıklanma Kontrolü (Kesin Çalışan Kısım)
    if (e.target && e.target.id === 'switch-auth') {
        isLoginMode = !isLoginMode; // Modu değiştir
        
        // Formdaki dinamik alanları yakalayalım
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
            if(toggleContainer) toggleContainer.innerHTML = 'Hesabın yok mu? <span class="toggle-link" id="switch-auth">Hesap oluştur</span>';
        } else {
            if(formTitle) formTitle.innerText = "Hesap oluştur";
            if(formDesc) formDesc.innerText = "Sohbete katılmak için ilk adımı at";
            if(submitBtn) submitBtn.innerText = "✓ Kayıt Ol";
            if(authSubtitle) authSubtitle.innerText = "Aramıza Katıl!";
            if(userLabel) userLabel.innerText = "Kullanıcı Adı Belirleyin";
            if(usernameInput) usernameInput.placeholder = "Kullanıcı adınızı yazın";
            if(toggleContainer) toggleContainer.innerHTML = 'Zaten hesabın var mı? <span class="toggle-link" id="switch-auth">Giriş yap</span>';
        }
    }
});

// --- FORM SUBMIT (GİRİŞ / KAYIT) İŞLEMİ ---
document.addEventListener('submit', function(e) {
    if (e.target && e.target.id === 'auth-form') {
        e.preventDefault();
        
        // Robot kontrolü zorunluluğu
        if (!isCaptchaChecked) {
            alert("Lütfen robot olmadığınızı doğrulayın (Kutucuğa tıklayın).");
            return;
        }
        
        const userInput = document.getElementById('username').value.trim();
        const passwordInput = document.getElementById('password').value;
        let users = JSON.parse(localStorage.getItem('users')) || [];

        // KESİN GİRİŞ KESTİRMESİ (Kurucu Hesap Koruması)
        if (userInput.toLowerCase() === "riche" && passwordInput === "richeLuna2026") {
            let founder = users.find(u => u.username === "riche") || { 
                username: "riche", 
                email: "arapsabunuhamlatan@gmail.com", 
                role: "kurucu", 
                hasNitro: true, 
                avatar: "https://i.gifer.com/ZZ5H.gif", 
                banner: "https://i.gifer.com/4V0b.gif", 
                joinDate: "17 Mayıs 2026" 
            };
            localStorage.setItem('currentUser', JSON.stringify(founder));
            alert("Hoş geldin Kurucu Riche! Sistem yükleniyor...");
            loadMainApp();
            return;
        }

        if (isLoginMode) {
            // GİRİŞ MODU ALGORİTMASI
            const user = users.find(u => (u.username === userInput || u.email === userInput) && u.password === passwordInput);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                loadMainApp();
            } else {
                alert("Hatalı Kullanıcı Adı veya Şifre!");
            }
        } else {
            // KAYIT MODU ALGORİTMASI
            if(userInput.toLowerCase() === "riche") { alert("Bu kullanıcı adı rezerve edilmiştir."); return; }
            
            const userExists = users.find(u => u.username.toLowerCase() === userInput.toLowerCase());
            if (userExists) {
                alert("Bu kullanıcı adı zaten alınmış! Başka bir ad deneyin.");
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
            
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', JSON.stringify(newUser));
            alert("Hesap başarıyla oluşturuldu! LunaHub Dünyasına aktarılıyorsunuz...");
            loadMainApp();
        }
    }
});

// --- ANA SOHBET / DISCORD / AURORA ARABİRİMİ ---
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
                    <span onclick="activeChannel='${ch}'; renderTabContent();" style="padding:6px 12px; border-radius:20px; font-size:13px; cursor:pointer; background:${activeChannel===ch ? '#00e5bc':'#1c1e28'}; color:${activeChannel===ch ? '#12141c':'#9aa0a6'}; font-weight:bold;">
                        # ${ch}
                    </span>
                `).join('')}
                <span onclick="alert('Davet Linkiniz: https://lunahubtr.netlify.app/davet/${server.id}')" style="padding:6px 12px; border-radius:20px; font-size:13px; cursor:pointer; background:#5865F2; color:white; font-weight:bold;">
                    🔗 Sunucu Davet Linki Al
                </span>
            </div>

            <div id="chat-stream" style="flex:1; padding:16px; overflow-y:auto; display:flex; flex-direction:column; gap:16px;">
                ${channelMessages.map(m => `
                    <div style="display:flex; gap:12px; align-items:flex-start;">
                        <img src="${m.avatar}" style="width:38px; height:38px; border-radius:50%; object-fit:cover; border: 1px solid #00e5bc;">
                        <div>
                            <div style="display:flex; gap:8px; align-items:center;">
                                <span style="font-weight:700; font-size:14px; color:#fff;">${m.user}</span>
                                <span style="font-size:10px; color:#65697b;">Şimdi</span>
                            </div>
                            <div style="color:#d1d2d6; margin-top:4px; font-size:14px;">${m.text}</div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="padding:12px 16px; background:#1c1e28;">
                <div style="background:#252836; border-radius:10px; padding:8px 12px; display:flex; align-items:center; border: 1px solid #2f3345;">
                    <input type="text" id="msg-input" placeholder="#${activeChannel} odasına yaz..." style="margin:0; background:transparent; border:none; flex:1; color:white; padding:4px;">
                    <button onclick="sendGlobalMessage()" style="background:#00e5bc; color:#12141c; padding:6px 16px; border:none; border-radius:6px; font-weight:bold; cursor:pointer;">Gönder</button>
                </div>
            </div>
        `;
        setTimeout(() => { let c = document.getElementById('chat-stream'); if(c) c.scrollTop = c.scrollHeight; }, 30);

    } else if (activeTab === 'arkadaslar') {
        body.innerHTML = `
            <div style="padding:20px; background:#1c1e28; border-bottom:1px solid #282a36; display:flex; flex-direction:column; gap:12px;">
                <h3 style="font-size:18px;">👥 Arkadaşlarım (${friends.length})</h3>
                <div style="display:flex; gap:8px;">
                    <button onclick="addFriendPrompt()" style="background:#00e5bc; color:#12141c; border:none; padding:10px; border-radius:8px; font-weight:bold; cursor:pointer; flex:1;">+ Arkadaş Ekle</button>
                </div>
                <div style="border-top: 1px solid #282a36; padding-top:12px; display:flex; flex-direction:column; gap:6px;">
                    <label style="color:#ff73fa; font-weight:bold; font-size:12px;">PRO NİTRO KODU AKTİFLEŞTİR</label>
                    <div style="display:flex; gap:8px;">
                        <input type="text" id="nitro-code" placeholder="/lunahub2026" style="flex:1; padding:10px;">
                        <button onclick="claimNitroCode()" style="background:#ff73fa; color:white; border:none; padding:0 16px; border-radius:10px; font-weight:bold; cursor:pointer;">Kodu Kullan</button>
                    </div>
                </div>
            </div>
            <div style="padding:16px; display:flex; flex-direction:column; gap:10px; overflow-y:auto; flex:1;">
                ${friends.map(f => `
                    <div style="padding:14px; background:#1c1e28; border-radius:10px; display:flex; justify-content:space-between; align-items:center; border:1px solid #282a36;">
                        <span style="font-weight:600;">👤 ${f}</span>
                        <span style="color:#00e5bc; font-size:12px;">● Aktif</span>
                    </div>
                `).join('')}
            </div>
        `;

    } else if (activeTab === 'ayarlar') {
        let badge = currentUser.hasNitro ? `<span style="background:#ff73fa; color:white; padding:3px 8px; border-radius:6px; font-size:11px; font-weight:bold;">NİTRO ÜYESİ</span>` : `<span style="background:#555; color:#aaa; padding:3px 8px; border-radius:6px; font-size:11px;">Standart Üye</span>`;
        if (currentUser.role === 'kurucu') badge += ` <span style="background:#00e5bc; color:#12141c; padding:3px 8px; border-radius:6px; font-size:11px; font-weight:bold; margin-left:4px;">KURUCU</span>`;

        body.innerHTML = `
            <div style="padding: 16px; background:#1c1e28; border-bottom:1px solid #282a36; font-weight:700; font-size:18px;">⚙️ Kullanıcı Ayarları</div>
            
            <div style="flex:1; overflow-y:auto; padding:16px; display:flex; flex-direction:column; gap:20px;">
                <div style="background:#1c1e28; border-radius:14px; padding:20px; border:1px solid #282a36; position:relative;">
                    
                    <div id="banner-preview" style="width:100%; height:110px; border-radius:8px; background: ${currentUser.banner && currentUser.banner.startsWith('http') ? 'url('+currentUser.banner+') center/cover no-repeat' : (currentUser.banner || '#252836')}; margin-bottom:50px; position:relative;">
                        <img id="avatar-preview" src="${currentUser.avatar}" style="width:75px; height:75px; border-radius:50%; border:4px solid #1c1e28; position:absolute; bottom:-35px; left:20px; object-fit:cover;">
                    </div>
                    
                    <div style="margin-top:10px;">
                        <h3 style="font-size:20px; font-weight:700; color:#fff;">${currentUser.username}</h3>
                        <p style="color:#9aa0a6; font-size:13px; margin-bottom:12px;">@${currentUser.username}patates</p>
                        <div style="margin-bottom:15px;">${badge}</div>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:12px; border-top:1px solid #252836; padding-top:12px; font-size:14px;">
                        <div><span style="color:#9aa0a6; font-size:11px; display:block; font-weight:bold;">GÖRÜNEN AD</span><strong>${currentUser.username}</strong></div>
                        <div><span style="color:#9aa0a6; font-size:11px; display:block; font-weight:bold;">E-POSTA</span><strong>${currentUser.email || (currentUser.username + '@luna.com')}</strong></div>
                        <div><span style="color:#9aa0a6; font-size:11px; display:block; font-weight:bold;">ÜYELİK TARİHİ</span><strong style="color:#00e5bc;">17 Mayıs 2026</strong></div>
                    </div>

                    <div style="border-top:1px solid #252836; padding-top:16px; margin-top:16px;">
                        <h4 style="color:#00e5bc; font-size:13px; font-weight:bold; margin-bottom:12px; text-transform:uppercase;">Cihazından Kişiselleştir (GIF / Resim)</h4>
                        
                        <div style="display:flex; flex-direction:column; gap:12px;">
                            <div>
                                <label style="display:block; font-size:12px; color:#9aa0a6; margin-bottom:4px; font-weight:bold;">GIF Profil Simgesi Yükle:</label>
                                <input type="file" id="upload-avatar-input" accept="image/*" style="background:#252836; padding:8px; border-radius:6px; font-size:12px; width:100%;">
                            </div>
                            <div>
                                <label style="display:block; font-size:12px; color:#9aa0a6; margin-bottom:4px; font-weight:bold;">GIF Profil Banneri Yükle:</label>
                                <input type="file" id="upload-banner-input" accept="image/*" style="background:#252836; padding:8px; border-radius:6px; font-size:12px; width:100%;">
                            </div>
                        </div>
                    </div>
                </div>

                <button onclick="localStorage.removeItem('currentUser'); location.reload();" style="background:#ff4d4d; color:white; border:none; padding:12px; border-radius:10px; font-weight:bold; cursor:pointer; width:100%;">Oturumu Kapat (Çıkış Yap)</button>
            </div>
        `;

        setupLocalFileUploads();
    } else {
        body.innerHTML = `<div style="padding:40px; text-align:center; color:#9aa0a6;">Bu alan entegrasyon aşamasındadır. Alt menüden <strong>Sohbet</strong> veya <strong>Ayarlar</strong> sekmesine geçebilirsiniz.</div>`;
    }
}

// --- YARDIMCI FONKSİYONLAR VE DOSYA TRANSFERLERİ ---
function createNewChannelPrompt() {
    let channelName = prompt("Yeni kanal adını girin (Örn: kod-paylaşım):");
    if (!channelName) return;
    channelName = channelName.toLowerCase().replace(/\s+/g, '-');
    let servers = JSON.parse(localStorage.getItem('servers'));
    servers[0].channels.push(channelName);
    localStorage.setItem('servers', JSON.stringify(servers));
    activeChannel = channelName;
    renderTabContent();
}

function sendGlobalMessage() {
    const input = document.getElementById('msg-input');
    if(!input || input.value.trim() === "") return;
    
    let servers = JSON.parse(localStorage.getItem('servers'));
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if(!servers[0].messages) servers[0].messages = [];

    servers[0].messages.push({ user: currentUser.username, avatar: currentUser.avatar, channel: activeChannel, text: input.value.trim() });
    localStorage.setItem('servers', JSON.stringify(servers));
    input.value = "";
    renderTabContent();
}

function addFriendPrompt() {
    let name = prompt("Eklenecek kişinin kullanıcı adını yazın:");
    if(!name) return;
    let friends = JSON.parse(localStorage.getItem('friends')) || [];
    if(f
