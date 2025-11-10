import { useState } from 'react'
import { BASE_URL } from '../config'

function TextHumanizer() {
  const [text, setText] = useState('')
  const [humanizedText, setHumanizedText] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleHumanize = async () => {
    if (!text.trim()) {
      setError('Please enter some text to humanize')
      return
    }

    setLoading(true)
    setError(null)
    setHumanizedText(null)

    try {
      const response = await fetch(`${BASE_URL}/api/humanize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to humanize text')
      }

      const data = await response.json()
      setHumanizedText(data)
    } catch (err) {
      setError(err.message || 'An error occurred while humanizing the text')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setText('')
    setHumanizedText(null)
    setError(null)
    setCopied(false)
  }

  const handleCopyToClipboard = () => {
    if (humanizedText?.humanized_text) {
      navigator.clipboard.writeText(humanizedText.humanized_text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleCopyOriginal = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-5xl mx-auto animate-slideUp">
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
        {/* Input Section */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-white via-emerald-50/30 to-white">
          <label htmlFor="text-input" className="block text-lg sm:text-xl font-bold text-gray-900 mb-4">
            ✨ Enter Text to Humanize
          </label>
          <div className="relative">
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type the AI-generated text you want to humanize..."
              className="w-full h-64 px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none transition-all duration-300 text-gray-700 bg-white/80 backdrop-blur-sm font-mono text-sm leading-relaxed placeholder-gray-400"
              disabled={loading}
            />
            {loading && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 animate-pulse pointer-events-none"></div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-4">
            <span className="text-sm font-medium text-gray-500">
              <span className="text-emerald-600 font-bold">{text.length}</span> characters
            </span>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleClear}
                disabled={loading || !text}
                className="flex-1 sm:flex-none px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:shadow-md"
              >
                Clear
              </button>
              <button
                onClick={handleHumanize}
                disabled={loading || !text.trim()}
                className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Humanizing...
                  </span>
                ) : (
                  'Humanize Text'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-8 mb-8 p-5 bg-red-50/80 backdrop-blur-sm border-2 border-red-200/50 rounded-2xl animate-slideUp">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <p className="text-red-800 font-medium text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Results Section */}
        {humanizedText && (
          <div className="border-t-2 border-gray-200/50 p-8 sm:p-10 bg-gradient-to-br from-gray-50/50 via-white to-emerald-50/30 animate-slideUp">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
              📝 Humanized Text
            </h3>

            {/* Comparison View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Original Text Card */}
              <div className="bg-white/70 backdrop-blur-md rounded-3xl border-2 border-gray-300/50 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-gray-900">📄 Original Text</h4>
                  <button
                    onClick={handleCopyOriginal}
                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-300 hover:scale-110 active:scale-95"
                    title="Copy original text"
                  >
                    📋
                  </button>
                </div>
                <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 max-h-64 overflow-y-auto border border-gray-200/50">
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-mono">
                    {text}
                  </p>
                </div>
              </div>

              {/* Humanized Text Card */}
              <div className="bg-white/70 backdrop-blur-md rounded-3xl border-2 border-emerald-300/50 p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-emerald-900">✨ Humanized Text</h4>
                  <button
                    onClick={handleCopyToClipboard}
                    className={`p-2 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 ${copied
                      ? 'bg-emerald-200 text-emerald-700'
                      : 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700'
                      }`}
                    title="Copy humanized text"
                  >
                    {copied ? '✓' : '📋'}
                  </button>
                </div>
                <div className="bg-emerald-50/80 backdrop-blur-sm rounded-2xl p-4 max-h-64 overflow-y-auto border border-emerald-200/50">
                  <p className="text-sm text-emerald-900 leading-relaxed whitespace-pre-wrap font-mono">
                    {humanizedText.humanized_text}
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics */}
            {humanizedText.stats && (
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-blue-50/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-blue-200/50 hover:border-blue-300 transition-all duration-300">
                  <p className="text-xs font-bold text-blue-600 mb-2 uppercase tracking-wide">Original Length</p>
                  <p className="text-2xl font-bold text-blue-900">{humanizedText.stats.original_length}</p>
                </div>
                <div className="bg-emerald-50/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-emerald-200/50 hover:border-emerald-300 transition-all duration-300">
                  <p className="text-xs font-bold text-emerald-600 mb-2 uppercase tracking-wide">Humanized Length</p>
                  <p className="text-2xl font-bold text-emerald-900">{humanizedText.stats.humanized_length}</p>
                </div>
                <div className="bg-purple-50/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-purple-200/50 hover:border-purple-300 transition-all duration-300">
                  <p className="text-xs font-bold text-purple-600 mb-2 uppercase tracking-wide">Words Changed</p>
                  <p className="text-2xl font-bold text-purple-900">{humanizedText.stats.words_changed || 'N/A'}</p>
                </div>
                <div className="bg-orange-50/80 backdrop-blur-sm rounded-2xl p-5 border-2 border-orange-200/50 hover:border-orange-300 transition-all duration-300">
                  <p className="text-xs font-bold text-orange-600 mb-2 uppercase tracking-wide">Improvement</p>
                  <p className="text-2xl font-bold text-orange-900">{humanizedText.stats.improvement || 'N/A'}</p>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50/80 to-cyan-50/80 backdrop-blur-sm border-2 border-blue-200/50 rounded-2xl hover:border-blue-300 transition-all duration-300">
              <div className="flex items-start gap-4">
                <span className="text-3xl flex-shrink-0">💡</span>
                <div>
                  <p className="font-bold text-blue-900 mb-1">Pro Tip</p>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    The humanized text has been processed to sound more natural and human-like while maintaining the original meaning and context.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TextHumanizer

