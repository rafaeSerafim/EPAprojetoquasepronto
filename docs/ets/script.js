// Variáveis globais para o chat
const chatHistory = document.getElementById('chatHistory');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');
const typingIndicator = document.getElementById('typingIndicator');
const backButton = document.getElementById('backButton');

// ** URL do Avatar do Bot (Pequeno) e Grande **
const BOT_AVATAR_URL = "./images/isaacEt.jpg"; 

// --- Funções de UI ---

// Função para rolar o histórico até o final
function scrollToBottom() {
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Helper function para criar a bolha de mensagem
function createBubble(isUser, text) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add(
        'p-3', 
        'text-sm', 
        (isUser ? 'user-bubble' : 'bot-bubble'),
    );
    messageBubble.textContent = text;
    return messageBubble;
}

// Adiciona uma bolha de chat
function addMessage(role, text) {
    const isUser = role === 'user';
    
    // 1. Main container (controla alinhamento e margem)
    const messageContainer = document.createElement('div');
    messageContainer.classList.add('flex', 'mb-3', (isUser ? 'justify-end' : 'justify-start'));

    // 2. Content wrapper (controla o limite de largura para a mensagem completa)
    const contentWrapper = document.createElement('div');
    // Aplica a restrição de largura máxima aqui
    contentWrapper.classList.add('max-w-xs', 'sm:max-w-md');

    if (isUser) {
        // USUÁRIO: Apenas a bolha dentro do contentWrapper
        const messageBubble = createBubble(true, text);
        contentWrapper.appendChild(messageBubble);

    } else {
        // BOT: Imagem + Bolha
        contentWrapper.classList.add('flex', 'items-start', 'space-x-3');
        
        // a. Imagem do Avatar
        const avatar = document.createElement('img');
        avatar.src = BOT_AVATAR_URL; 
        avatar.alt = 'Avatar do ET Zyrac';
        // w-8 h-8 é 32x32px
        avatar.classList.add('w-8', 'h-8', 'rounded-full', 'flex-shrink-0', 'mt-1', 'object-cover', 'border-2', 'border-[#7a6cf6]');
        // Adiciona fallback para o avatar pequeno
        avatar.onerror = function() {
            this.onerror = null;
            this.src = 'https://placehold.co/32x32/7a6cf6/000000?text=Z';
        };
        contentWrapper.appendChild(avatar);

        // b. Bolha
        const messageBubble = createBubble(false, text);
        contentWrapper.appendChild(messageBubble);
    }
    
    messageContainer.appendChild(contentWrapper);
    chatHistory.appendChild(messageContainer);
}

// --- Função de Simulação de Resposta (Placeholder) ---
async function getSimulatedResponse(query) {
    // Simula o tempo de processamento da API
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    return `Sua mensagem: "${query}". Interface pronta! Minha amiga API irá processar isso quando estiver conectada.`;
}


// --- Função de Envio Principal ---
async function handleSend() {
    const query = userInput.value.trim();
    if (query === '') return;

    // 1. Limpa o input e desabilita a interface
    userInput.value = '';
    sendButton.disabled = true;
    userInput.disabled = true;

    // 2. Adiciona a mensagem do usuário ao histórico
    addMessage('user', query); 
    scrollToBottom();

    try {
        // 3. Mostra o indicador de digitação
        typingIndicator.classList.remove('hidden');
        scrollToBottom();

        // 4. Obtém a resposta SIMULADA (Ponto de conexão para a API real)
        const botResponse = await getSimulatedResponse(query);

        // 5. Adiciona a resposta do bot
        typingIndicator.classList.add('hidden');
        addMessage('model', botResponse);

    } catch (error) {
        console.error("Erro na simulação:", error);
        typingIndicator.classList.add('hidden');
        addMessage('model', "Erro: O sistema Zyrac encontrou uma anomalia temporal. Tente novamente.");
    } finally {
        // 6. Restaura a interface
        sendButton.disabled = false;
        userInput.disabled = false;
        userInput.focus();
        scrollToBottom();
    }
}

// --- Inicialização ---

document.addEventListener('DOMContentLoaded', () => {
    // Mensagem de Boas-vindas
    addMessage('model', 'Saudações, sou Zyrac. Fui enviado para te ajudar a explorar os mistérios do universo. Sobre o que você gostaria de conversar hoje?');
    
    // Eventos
    sendButton.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !sendButton.disabled) {
            handleSend();
        }
    });

    // Lógica do botão Voltar (simula o retorno à página anterior)
    backButton.addEventListener('click', () => {
        window.history.back(); 
    });

    scrollToBottom();
    userInput.focus();
});
