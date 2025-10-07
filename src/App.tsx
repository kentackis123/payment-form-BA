import PaymentForm from '@/components/PaymentForm'
import LanguageSwitch from '@/components/LanguageSwitch'

function App() {
  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-end">
        <LanguageSwitch />
      </div>
      <PaymentForm />
    </div>
  )
}

export default App
