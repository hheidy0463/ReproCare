interface StepperProps {
  steps: string[]
  currentStep: number
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                index < currentStep
                  ? 'bg-blue-600 text-white'
                  : index === currentStep
                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-600'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`mt-2 text-sm ${
                index === currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-16 h-1 mx-2 ${
                index < currentStep ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

