# App Face Recognition

Um aplicativo de reconhecimento facial com detecção de liveness para autenticação segura.

## 📋 Requisitos

- Node.js e npm
- Python 3.7+
- Android Studio (para desenvolvimento Android)
- Dispositivo Android físico ou emulador
- Dispositivo Bluetooth compatível

## 🚀 Instalação

### Frontend (React Native)

1. Clone o repositório:
   ```bash
   git clone https://github.com/PauloV-hub/App-React.git
   cd App-React
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o aplicativo no Android:
   ```bash
   npm run android
   ```

### Backend (Python/FastAPI)

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

3. Execute o servidor:
   ```bash
   python -m uvicorn yolo_detect:app --reload --host 0.0.0.0
   ```

## 📱 Como Usar

### Configuração Inicial:
- Certifique-se de que o servidor backend esteja em execução
- Ative o Bluetooth no seu dispositivo

### Reconhecimento Facial:
- Conecte um dispositivo Bluetooth compatível ao aplicativo
- Posicione o rosto dentro do círculo oval na câmera
- Aguarde alguns segundos para que a foto seja capturada automaticamente
- O sistema processará a imagem e realizará o reconhecimento facial
- Os resultados serão exibidos na tela

### Verificação de Liveness:
- O sistema utiliza tecnologia avançada para detectar se é um rosto real ou uma foto/vídeo
- Mantenha uma expressão natural durante o escaneamento para melhores resultados

## 🧪 Tecnologias Utilizadas

- **Frontend:** React Native
- **Backend:** Python, FastAPI
- **Processamento de Imagem:** YOLO, TensorFlow
- **Comunicação:** API REST, Bluetooth

## ⚠️ Solução de Problemas

- **Erro de conexão Bluetooth:** Verifique se o dispositivo Bluetooth está ligado e próximo
- **Falha no reconhecimento facial:** Garanta boa iluminação e posicione o rosto adequadamente
- **Erro no backend:** Verifique se todas as dependências foram instaladas corretamente e se o servidor está em execução
