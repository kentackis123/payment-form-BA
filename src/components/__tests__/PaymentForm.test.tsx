import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import PaymentForm from '../PaymentForm'
import { MessageProvider } from '@/contexts/MessageContext'

// Mock i18next
vi.mock('react-i18next', () => ({
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
}))

// Mock the API functions
const mockMutate = vi.fn()
const mockValidateIban = vi.fn()

vi.mock('@/utils/api', () => ({
  validateIban: mockValidateIban,
  useSubmitPaymentMutation: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}))

// Mock antd message
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    message: {
      useMessage: () => [
        {
          error: vi.fn(),
          success: vi.fn(),
        },
        <div key="message-holder" />,
      ],
    },
  }
})

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <MessageProvider>{children}</MessageProvider>
    </QueryClientProvider>
  )
}

describe('PaymentForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockValidateIban.mockResolvedValue(true)
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

  it('has default payer account selected', () => {
    render(
      <TestWrapper>
        <PaymentForm />
      </TestWrapper>,
    )

    const payerAccountSelect = screen.getByDisplayValue(/LT307300010172619160/)
    expect(payerAccountSelect).toBeInTheDocument()
  })

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

  it('submits form with valid data', async () => {
    mockValidateIban.mockResolvedValue(true)

    render(
      <TestWrapper>
        <PaymentForm />
      </TestWrapper>,
    )

    // Fill out the form
    fireEvent.change(screen.getByLabelText('payee'), {
      target: { value: 'Test Payee' },
    })
    fireEvent.change(screen.getByLabelText('payeeAccount'), {
      target: { value: 'LT307300010172619164' },
    })
    fireEvent.change(screen.getByLabelText('amount'), {
      target: { value: '10.00' },
    })
    fireEvent.change(screen.getByLabelText('purpose'), {
      target: { value: 'Test purpose' },
    })

    await waitFor(() => {
      expect(mockValidateIban).toHaveBeenCalledWith('LT307300010172619164')
    })

    fireEvent.click(screen.getByRole('button', { name: 'submit' }))

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        payerAccount: '1',
        payee: 'Test Payee',
        payeeAccount: 'LT307300010172619164',
        amount: 10,
        purpose: 'Test purpose',
      })
    })
  })
})
