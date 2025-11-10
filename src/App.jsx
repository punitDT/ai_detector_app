import { useState } from 'react'
import TextDetector from './components/TextDetector'
import FileUploader from './components/FileUploader'
import TextHumanizer from './components/TextHumanizer'

function App() {
  const [activeTab, setActiveTab] = useState('text')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-100/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
                <span className="text-white font-bold text-xl">✨</span>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  AI Detector & Humanizer
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Detect and humanize AI-generated content</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/60 backdrop-blur-md rounded-full shadow-xl p-2 inline-flex border border-gray-200/50 gap-2">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-6 sm:px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${activeTab === 'text'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
            >
              <span className="text-lg">🔍</span>
              <span className="hidden sm:inline">Detect AI</span>
              <span className="sm:hidden">Detect</span>
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`px-6 sm:px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${activeTab === 'file'
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
            >
              <span className="text-lg">📄</span>
              <span className="hidden sm:inline">File Analysis</span>
              <span className="sm:hidden">File</span>
            </button>
            <button
              onClick={() => setActiveTab('humanize')}
              className={`px-6 sm:px-8 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${activeTab === 'humanize'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                }`}
            >
              <span className="text-lg">✨</span>
              <span className="hidden sm:inline">Humanize</span>
              <span className="sm:hidden">Humanize</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="transition-all duration-300 animate-fadeIn">
          {activeTab === 'text' && <TextDetector />}
          {activeTab === 'file' && <FileUploader />}
          {activeTab === 'humanize' && <TextHumanizer />}
        </div>

        {/* Features Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:border-blue-300/50 hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">🔍</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Fast Detection</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Get instant results with our advanced AI detection algorithms</p>
          </div>

          <div className="group bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:border-purple-300/50 hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">🎯</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Accurate Results</h3>
            <p className="text-gray-600 text-sm leading-relaxed">High precision detection powered by state-of-the-art models</p>
          </div>

          <div className="group bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:border-emerald-300/50 hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">✨</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Text Humanizer</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Convert AI-generated text to sound more natural and human-like</p>
          </div>

          <div className="group bg-white/60 backdrop-blur-md rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200/50 hover:border-orange-300/50 hover:scale-105 hover:-translate-y-2">
            <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">📄</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Multiple Formats</h3>
            <p className="text-gray-600 text-sm leading-relaxed">Support for text input and document file uploads</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-10 border-t border-gray-200/50 bg-white/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 text-sm font-medium">© 2025 AI Detector & Humanizer. Powered by advanced machine learning.</p>
          <p className="text-gray-500 text-xs mt-2">Built with modern web technologies for optimal performance</p>
        </div>
      </footer>
    </div>
  )
}

export default App
