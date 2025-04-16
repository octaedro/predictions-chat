import { PredictionForm } from './components/prediction-form'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-800 sm:text-5xl mb-4 tracking-tight">
            Predictions
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Ask any question and get an AI-powered prediction
          </p>
        </div>
        <PredictionForm />
      </div>
    </main>
  )
} 