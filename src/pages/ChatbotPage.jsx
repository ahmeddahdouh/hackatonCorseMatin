import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Settings, Trash2, Download, Sparkles, Bot, User, AlertCircle, X } from 'lucide-react';
import { sendMessageToMistral, setMistralApiKey, isMistralConfigured, generatePlanSummary } from '../services/mistralService';

const ChatbotPage = ({ onBack }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Bonjour ! Je suis votre assistant Plan Média Corse Matin.

Je peux vous aider à :
- 📊 Créer un plan média personnalisé
- 💰 Optimiser votre budget publicitaire  
- 🎯 Cibler la bonne audience
- 📈 Estimer vos KPIs (reach, impressions, CPM)

**Pour commencer, parlez-moi de votre client :**
- Quel est son secteur d'activité ?
- Quel budget a-t-il prévu ?
- Quels sont ses objectifs de communication ?`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [apiKey, setApiKeyInput] = useState('');
  const [customContext, setCustomContext] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll automatique vers le bas
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Vérifier si la clé API est configurée
    if (!isMistralConfigured()) {
      setShowSettings(true);
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user', content: inputValue.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputValue('');
    setError(null);
    setIsLoading(true);

    try {
      const response = await sendMessageToMistral(
        newMessages.filter(m => m.role !== 'system'),
        customContext
      );
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (err) {
      setError(err.message);
      // Retirer le message utilisateur en cas d'erreur
      setMessages(messages);
      setInputValue(userMessage.content);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      setMistralApiKey(apiKey.trim());
      setShowSettings(false);
      setError(null);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer la conversation ?')) {
      setMessages([{
        role: 'assistant',
        content: `👋 Conversation réinitialisée ! Comment puis-je vous aider avec votre plan média ?`
      }]);
    }
  };

  const handleExportPlan = async () => {
    setIsLoading(true);
    try {
      const plan = await generatePlanSummary(messages);
      if (plan) {
        const dataStr = JSON.stringify(plan, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `plan-media-chatbot-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        setError('Impossible de générer le résumé du plan');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content) => {
    // Convertir le markdown basique en HTML
    return content
      .split('\n')
      .map((line, i) => {
        // Titres
        if (line.startsWith('###')) {
          return <h3 key={i} className="font-bold text-lg mt-3 mb-1">{line.replace('###', '').trim()}</h3>;
        }
        if (line.startsWith('##')) {
          return <h2 key={i} className="font-bold text-xl mt-4 mb-2">{line.replace('##', '').trim()}</h2>;
        }
        if (line.startsWith('#')) {
          return <h1 key={i} className="font-bold text-2xl mt-4 mb-2">{line.replace('#', '').trim()}</h1>;
        }
        // Listes
        if (line.startsWith('- ') || line.startsWith('• ')) {
          return <li key={i} className="ml-4">{line.substring(2)}</li>;
        }
        // Gras
        let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Italique
        formattedLine = formattedLine.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        if (line.trim() === '') {
          return <br key={i} />;
        }
        return <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: formattedLine }} />;
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-md border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-corse-rouge hover:text-red-700 font-semibold transition"
              >
                <ArrowLeft size={20} />
                Retour
              </button>
              <div className="h-8 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-corse-rouge to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Bot className="text-white" size={24} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-corse-noir">Assistant Plan Média</h1>
                  <p className="text-xs text-corse-gris-light">Powered by Mistral AI</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPlan}
                disabled={isLoading || messages.length < 3}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg transition text-sm font-medium"
                title="Exporter le plan média"
              >
                <Download size={16} />
                Exporter
              </button>
              <button
                onClick={handleClearChat}
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition text-sm font-medium"
                title="Effacer la conversation"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition text-sm font-medium"
                title="Paramètres"
              >
                <Settings size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-8 h-8 bg-gradient-to-br from-corse-rouge to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                  <Sparkles className="text-white" size={16} />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.role === 'user'
                    ? 'bg-corse-rouge text-white'
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <div className={`text-sm ${message.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                  {formatMessage(message.content)}
                </div>
              </div>
              {message.role === 'user' && (
                <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                  <User className="text-white" size={16} />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-corse-rouge to-red-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow">
                <Sparkles className="text-white animate-pulse" size={16} />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-corse-rouge rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-corse-rouge rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-corse-rouge rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm text-gray-500">Réflexion en cours...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-4xl mx-auto px-4 pb-2">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
            <AlertCircle className="text-red-500 flex-shrink-0" size={18} />
            <p className="text-red-700 text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Posez votre question sur le plan média..."
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-corse-rouge focus:outline-none transition resize-none"
                rows={1}
                disabled={isLoading || !isMistralConfigured()}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || !isMistralConfigured()}
              className="px-6 py-3 bg-gradient-to-r from-corse-rouge to-red-600 hover:from-red-700 hover:to-red-800 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-xl transition flex items-center gap-2 font-semibold shadow-lg"
            >
              <Send size={18} />
              Envoyer
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Appuyez sur Entrée pour envoyer • Shift+Entrée pour un saut de ligne
          </p>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-corse-noir flex items-center gap-2">
                  <Settings size={24} />
                  Configuration
                </h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* API Key */}
              <div>
                <label className="block text-sm font-semibold text-corse-noir mb-2">
                  🔑 Clé API Mistral *
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Entrez votre clé API Mistral"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-corse-rouge focus:outline-none transition"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Obtenez votre clé sur <a href="https://console.mistral.ai/" target="_blank" rel="noopener noreferrer" className="text-corse-rouge hover:underline">console.mistral.ai</a>
                </p>
                {isMistralConfigured() && (
                  <p className="text-xs text-green-600 mt-1">✓ Une clé API est déjà configurée</p>
                )}
              </div>

              {/* Custom Context */}
              <div>
                <label className="block text-sm font-semibold text-corse-noir mb-2">
                  📝 Contexte additionnel (optionnel)
                </label>
                <textarea
                  value={customContext}
                  onChange={(e) => setCustomContext(e.target.value)}
                  placeholder="Ajoutez des informations spécifiques (client, offres spéciales, promotions...)"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-corse-rouge focus:outline-none transition resize-none"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ces informations seront ajoutées au contexte métier Corse Matin
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveApiKey}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-corse-rouge to-red-600 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition font-semibold"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotPage;
