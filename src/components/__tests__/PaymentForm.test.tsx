import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PaymentForm from '../PaymentForm'

// Mock modules first
vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, options?: any) => {
        if (options) {
          return key.replace(
            /{{(\w+)}}/g,
            (match, prop) => options[prop] || match,
          )
        }
        return key
      },
      i18n: { language: 'en' },
    }),
    initReactI18next: {
      type: '3rdParty',
      init: vi.fn(),
    },
  }
})

vi.mock('i18next', () => ({
  default: {
    use: vi.fn().mockReturnThis(),
    init: vi.fn().mockResolvedValue({}),
    changeLanguage: vi.fn(),
    t: (key: string) => key,
    language: 'en',
  },
}))

vi.mock('@/utils/api')

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('PaymentForm', () => {
  beforeEach(async () => {
    vi.clearAllMocks()

    // Setup mocks after clearing
    const { validateIban, useSubmitPaymentMutation } = await import(
      '@/utils/api'
    )
    vi.mocked(validateIban).mockResolvedValue(true)
    vi.mocked(useSubmitPaymentMutation).mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
    })
  })

  it('renders all form fields', () => {
    render(
      <TestWrapper>
        <PaymentForm />
      </TestWrapper>,
    )

    expect(screen.getByText('paymentForm')).toBeInTheDocument()
    expect(screen.getByLabelText('payerAccount')).toBeInTheDocument()
    expect(screen.getByLabelText('payee')).toBeInTheDocument()
    expect(screen.getByLabelText('payeeAccount')).toBeInTheDocument()
    expect(screen.getByLabelText('amount')).toBeInTheDocument()
    expect(screen.getByLabelText('purpose')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'submit' })).toBeInTheDocument()
  })

  // TODO update with additional checks
  it('validates required fields', async () => {
    render(
      <TestWrapper>
        <PaymentForm />
      </TestWrapper>,
    )

    const submitButton = screen.getByRole('button', { name: 'submit' })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getAllByText('required')).toHaveLength(4)
    })
  })
})
