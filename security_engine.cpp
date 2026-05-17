#include <iostream>
#include <string>

// LunaHub System Security Framework 2026
class LunaCoreSecurity {
public:
    std::string founderName = "riche";
    std::string systemStatus = "AKTIF";

    bool authenticateFounder(std::string name, std::string encryptedPass) {
        // C++ Şifre Kontrolü Çekirdeği
        if (name == founderName && encryptedPass == "richeLuna2026") {
            std::cout << "[GÜVENLİK]: Kurucu Riche Başarıyla Doğrulandı!" << std::endl;
            return true;
        }
        std::cout << "[UYARI]: Yetkisiz Erişim Denemesi Yapıldı!" << std::endl;
        return false;
    }
};

int main() {
    LunaCoreSecurity core;
    std::cout << "--- LunaHub C++ Core System Booted ---" << std::endl;
    std::cout << "Sistem Durumu: " << core.systemStatus << std::endl;
    
    // Kurucu Giriş Testi
    core.authenticateFounder("riche", "richeLuna2026");
    return 0;
}
