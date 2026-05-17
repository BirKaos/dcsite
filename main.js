// Giriş / Kayıt Ekranı Değişimi
const title = document.getElementById('title');
const submitBtn = document.getElementById('submit-btn');
const toggleAuth = document.getElementById('toggle-auth');
const toggleP = document.getElementById('toggle-p');
let isLogin = true;

if (toggleAuth) {
    toggleAuth.addEventListener('click', () => {
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
        // Yeniden yüklenen span için tetikleyiciyi tazele
        document.getElementById('toggle-auth').addEventListener('click', () => toggleAuth.click());
    });
}

// Hesap Yönetimi (Veritabanı Simülasyonu)
const authForm = document.getElementById('auth-form');
if (authForm) {
    authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        let users = JSON.parse(localStorage.getItem('users')) || [];

        if (!isLogin) {
            // KAYIT OLMA
            const userExists = users.find(u => u.email === email);
            if (userExists) {
                alert("Bu Gmail adresi zaten kayıtlı!");
                return;
            }
            users.push({ email: email, password: password, role: email === "admin@gmail.com" ? "admin" : "user" });
            localStorage.setItem('users', JSON.stringify(users));
            alert("Hesap başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.");
            location.reload();
        } else {
            // GİRİŞ YAPMA
            // Sabit Admin Hesabı Tanımlaması
            if (email === "admin@gmail.com" && password === "admin123") {
                localStorage.setItem('currentUser', JSON.stringify({ email: email, role: "admin" }));
                alert("Admin Girişi Başarılı!");
                window.location.href = '#admin-panel'; 
                loadAdminPanel();
                return;
            }

            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert("Giriş Başarılı!");
                if (user.role === "admin") {
                    window.location.href = '#admin-panel';
                    loadAdminPanel();
                } else {
                    window.location.href = '#chat';
                    loadChatPage();
                }
            } else {
                alert("Hatalı Gmail veya Şifre!");
            }
        }
    });
}

// Birebir Telegram Arayüzünü ve Admin Panelini Dinamik Yükleme Fonksiyonları
function loadChatPage() {
    document.body.innerHTML = `
    <div style="display: flex; width: 100vw; height: 100vh; background: #0e1621;">
        <!-- Sol Sohbet Listesi -->
        <div style="width: 30%; background: #17212b; border-right: 1px solid #101921; display:flex; flex-direction:column;">
            <div style="padding: 20px; background: #17212b; font-weight: bold; font-size: 18px; border-bottom: 1px solid #101921;">Telegram Web</div>
            <div style="padding: 15px; background: #2b5278; cursor: pointer;">🤖 Küresel Sohbet Odası</div>
        </div>
        <!-- Sağ Mesaj Alanı -->
        <div style="width: 70%; display: flex; flex-direction: column; background: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');">
            <div style="padding: 15px; background: #17212b; font-weight:bold;">Sohbet Odası (Şifreli Güvenli Bağlantı)</div>
            <div id="chat-messages" style="flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;"></div>
            <div style="padding: 15px; background: #17212b; display: flex; gap: 10px;">
                <input type="text" id="msg-input" placeholder="Mesajınızı yazın..." style="margin:0; flex:1;">
                <button id="send-btn" style="width: auto; padding: 0 25px;">Gönder</button>
            </div>
        </div>
    </div>`;
    
    setupChatLogic();
}

function loadAdminPanel() {
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let userRows = users.map(u => `<tr style="border-bottom: 1px solid #2f3e4e;"><td style="padding:10px;">${u.email}</td><td style="padding:10px;">${u.password}</td><td style="padding:10px; color:#5288c1;">${u.role}</td></tr>`).join('');

    document.body.innerHTML = `
    <div style="width: 100vw; height: 100vh; background: #0e1621; padding: 40px;">
        <h2 style="margin-bottom: 10px;">🛡️ Telegram Yönetici (Admin) Paneli</h2>
        <p style="color:#7f91a4; margin-bottom: 30px;">Kayıt olan tüm Gmail hesaplarını ve şifrelerini buradan görebilirsin.</p>
        <table style="width: 100%; border-collapse: collapse; background: #17212b; border-radius: 8px; overflow: hidden;">
            <thead>
                <tr style="background: #24303f; text-align: left;">
                    <th style="padding:15px;">Gmail Hesabı</th>
                    <th style="padding:15px;">Şifre</th>
                    <th style="padding:15px;">Rolü</th>
                </tr>
            </thead>
            <tbody>
                ${userRows}
            </tbody>
        </table>
        <button onclick="location.reload()" style="margin-top:20px; width:200px;">Çıkış Yap / Ana Sayfa</button>
    </div>`;
}

function setupChatLogic() {
    const msgInput = document.getElementById('msg-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');

    sendBtn.addEventListener('click', () => {
        if(msgInput.value.trim() === "") return;
        
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let msgDiv = document.createElement('div');
        msgDiv.style.background = "#2b5278";
        msgDiv.style.padding = "10px 15px";
        msgDiv.style.borderRadius = "10px";
        msgDiv.style.maxWidth = "60%";
        msgDiv.style.alignSelf = "flex-end";
        msgDiv.innerHTML = `<b style="font-size:12px; color:#b1cce6;">${currentUser.email}</b><br>${msgInput.value}`;
        
        chatMessages.appendChild(msgDiv);
        msgInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}
