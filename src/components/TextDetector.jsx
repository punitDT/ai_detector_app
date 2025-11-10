import { useState } from 'react'

function TextDetector() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('http://localhost:8000/api/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze text')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the text')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setText('')
    setResult(null)
    setError(null)
  }

  const getScoreColor = (score) => {
    if (score >= 0.7) return 'text-red-600'
    if (score >= 0.4) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getScoreBgColor = (score) => {
    if (score >= 0.7) return 'bg-red-50 border-red-200'
    if (score >= 0.4) return 'bg-yellow-50 border-yellow-200'
    return 'bg-green-50 border-green-200'
  }

  const getScoreLabel = (score) => {
    if (score >= 0.7) return 'Likely AI-Generated'
    if (score >= 0.4) return 'Possibly AI-Generated'
    return 'Likely Human-Written'
  }

  const getSentenceHighlight = (likelihood) => {
    if (likelihood === 'High') return 'bg-red-100 border-l-4 border-red-500'
    if (likelihood === 'Medium') return 'bg-yellow-100 border-l-4 border-yellow-500'
    return 'bg-green-100 border-l-4 border-green-500'
  }

  const getLikelihoodBadge = (likelihood) => {
    if (likelihood === 'High') return 'bg-red-500 text-white'
    if (likelihood === 'Medium') return 'bg-yellow-500 text-white'
    return 'bg-green-500 text-white'
  }

  return (
    <div className="max-w-5xl mx-auto animate-slideUp">
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
        {/* Input Section */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-white via-blue-50/30 to-white">
          <label htmlFor="text-input" className="block text-lg sm:text-xl font-bold text-gray-900 mb-4">
            📝 Enter Text to Analyze
          </label>
          <div className="relative">
            <textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste or type the text you want to analyze for AI-generated content..."
              className="w-full h-64 px-5 py-4 border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-300 text-gray-700 bg-white/80 backdrop-blur-sm font-mono text-sm leading-relaxed placeholder-gray-400"
              disabled={loading}
            />
            {loading && (
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse pointer-events-none"></div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-4">
            <span className="text-sm font-medium text-gray-500">
              <span className="text-blue-600 font-bold">{text.length}</span> characters
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
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="flex-1 sm:flex-none px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Analyzing...
                  </span>
                ) : (
                  'Analyze Text'
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
        {result && (
          <div className="border-t-2 border-gray-200/50 p-8 sm:p-10 bg-gradient-to-br from-gray-50/50 via-white to-blue-50/30 animate-slideUp">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8">
              📊 Analysis Results
            </h3>

            {/* Overall Result Card */}
            {result.overall && (
              <div className={`p-6 sm:p-8 rounded-3xl border-2 mb-8 backdrop-blur-sm transition-all duration-500 ${getScoreBgColor(result.overall.score)}`}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="text-center sm:text-left">
                    <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Overall Result</p>
                    <p className={`text-2xl sm:text-3xl font-bold ${getScoreColor(result.overall.score)}`}>
                      {result.overall.label}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Confidence Score</p>
                    <p className={`text-3xl sm:text-4xl font-bold ${getScoreColor(result.overall.score)}`}>
                      {(result.overall.score * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">AI Likelihood</p>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${getLikelihoodBadge(result.overall.ai_likelihood)}`}>
                      {result.overall.ai_likelihood}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-300/50 rounded-full h-3 overflow-hidden mt-6">
                  <div
                    className={`h-full transition-all duration-1000 ease-out rounded-full ${result.overall.score >= 0.7
                      ? 'bg-gradient-to-r from-red-500 to-red-600'
                      : result.overall.score >= 0.4
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                        : 'bg-gradient-to-r from-green-500 to-green-600'
                      }`}
                    style={{ width: `${result.overall.score * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Sentence-by-Sentence Analysis */}
            {result.sentences && result.sentences.length > 0 && (
              <div className="mt-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4">
                  🔎 Sentence-by-Sentence Analysis
                </h4>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {result.sentences.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-2xl border-l-4 transition-all duration-300 hover:shadow-lg hover:scale-102 backdrop-blur-sm ${getSentenceHighlight(item.ai_likelihood)}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm text-gray-800 flex-1 leading-relaxed">{item.sentence}</p>
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getLikelihoodBadge(item.ai_likelihood)}`}>
                            {item.ai_likelihood}
                          </span>
                          <span className={`text-sm font-bold ${getScoreColor(item.score)}`}>
                            {(item.score * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Interpretation Guide */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-green-50/80 backdrop-blur-sm rounded-2xl border-2 border-green-200/50 hover:border-green-300 transition-all duration-300">
                <p className="font-bold text-green-900 text-sm mb-1">✓ Low Score</p>
                <p className="text-xs text-green-700 leading-relaxed">Human-written content</p>
              </div>
              <div className="p-5 bg-yellow-50/80 backdrop-blur-sm rounded-2xl border-2 border-yellow-200/50 hover:border-yellow-300 transition-all duration-300">
                <p className="font-bold text-yellow-900 text-sm mb-1">⚠ Medium Score</p>
                <p className="text-xs text-yellow-700 leading-relaxed">AI-assisted content</p>
              </div>
              <div className="p-5 bg-red-50/80 backdrop-blur-sm rounded-2xl border-2 border-red-200/50 hover:border-red-300 transition-all duration-300">
                <p className="font-bold text-red-900 text-sm mb-1">✗ High Score</p>
                <p className="text-xs text-red-700 leading-relaxed">AI-generated content</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TextDetector

