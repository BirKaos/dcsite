#include <iostream>
#include <string>
#include <vector>

// Telegram Clone - Mesaj Güvenliği ve Şifreleme Motoru
class SecurityEngine {
private:
    char secureKey = 'K'; // Şifreleme anahtarı

public:
    // Mesajı şifreleyen C++ fonksiyonu
    std::string encryptMessage(std::string message) {
        std::string encrypted = message;
        for (size_t i = 0; i < message.size(); i++) {
            encrypted[i] = message[i] ^ secureKey; // XOR Şifreleme
        }
        return encrypted;
    }

    // Şifrelenmiş mesajı çözen C++ fonksiyonu
    std::string decryptMessage(std::string encryptedMessage) {
        return encryptMessage(encryptedMessage); // XOR simetrik olduğu için aynı işlem çözer
    }
};

int main() {
    SecurityEngine engine;
    
    std::string testMessage = "Selam, bu Telegram klonundan gonderilen gizli bir mesajdir.";
    
    // İşlemleri Başlat
    std::string encrypted = engine.encryptMessage(testMessage);
    std::string decrypted = engine.decryptMessage(encrypted);
    
    std::cout << "--- Telegram Core C++ Security Engine ---" << std::endl;
    std::cout << "Orjinal Mesaj: " << testMessage << std::endl;
    std::cout << "Sifrelenmiş Veri: " << encrypted << std::endl;
    std::cout << "Cozulmus Veri: " << decrypted << std::endl;
    
    return 0;
}
