import { useState, useRef } from 'react'

function FileUploader() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (selectedFile) => {
    setError(null)
    setResult(null)

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, DOC, DOCX, or TXT file')
      return
    }

    // Validate file size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB')
      return
    }

    setFile(selectedFile)
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze file')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the file')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setFile(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="max-w-5xl mx-auto animate-slideUp">
      <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50">
        {/* Upload Section */}
        <div className="p-8 sm:p-10 bg-gradient-to-br from-white via-purple-50/30 to-white">
          <label className="block text-lg sm:text-xl font-bold text-gray-900 mb-6">
            📤 Upload Document
          </label>

          {/* Drag and Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-3xl p-12 sm:p-16 text-center transition-all duration-300 ${dragActive
              ? 'border-blue-500 bg-blue-50/50 backdrop-blur-sm scale-105'
              : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/20'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              disabled={loading}
            />

            {!file ? (
              <div className="space-y-6">
                <div className="text-5xl">📁</div>
                <div>
                  <p className="text-lg sm:text-xl text-gray-700 mb-6 font-medium">
                    Drag and drop your file here, or
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95"
                  >
                    Browse Files
                  </button>
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  Supported: PDF, DOC, DOCX, TXT • Max 10MB
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto border-2 border-blue-200/50">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📄</span>
                        <p className="text-sm font-bold text-gray-900 truncate">{file.name}</p>
                      </div>
                      <p className="text-xs text-gray-500 font-medium">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={handleClear}
                      disabled={loading}
                      className="px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 disabled:opacity-50 hover:scale-110 active:scale-95"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 mx-auto"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Analyzing...
                    </span>
                  ) : (
                    'Analyze Document'
                  )}
                </button>
              </div>
            )}
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
          <div className="border-t-2 border-gray-200/50 p-8 sm:p-10 bg-gradient-to-br from-gray-50/50 via-white to-purple-50/30 animate-slideUp">
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

export default FileUploader

