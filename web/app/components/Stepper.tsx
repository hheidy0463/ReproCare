interface StepperProps {
  steps: string[]
  currentStep: number
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center mb-12">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 shadow-sm ${
                index < currentStep
                  ? 'bg-blue-600 text-white shadow-md scale-105'
                  : index === currentStep
                  ? 'bg-white text-blue-600 border-[3px] border-blue-600 shadow-lg scale-110 ring-4 ring-blue-100'
                  : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
              }`}
            >
              {index < currentStep ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span
              className={`mt-3 text-sm font-medium transition-colors ${
                index === currentStep 
                  ? 'text-blue-600' 
                  : index < currentStep
                  ? 'text-gray-700'
                  : 'text-gray-400'
              }`}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-20 h-1 mx-3 rounded-full transition-all duration-300 ${
                index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

