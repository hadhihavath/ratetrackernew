import { useState, type FormEvent } from 'react'
import { useAppStore } from '@/stores/appStore'
import { Modal, ModalFooter } from '@/components/ui'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { alertsApi } from '@/api'
import toast from 'react-hot-toast'

export function PriceAlertModal() {
  const { selectedProduct } = useAppStore()
  const [isOpen, setIsOpen] = useState(false)
  const [targetPrice, setTargetPrice] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
    setTargetPrice('')
    setEmail('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedProduct || !targetPrice || !email) return

    setIsSubmitting(true)
    try {
      await alertsApi.createAlert({
        productId: selectedProduct.id,
        email,
        targetPrice: Number(targetPrice),
        userId: 'anonymous', // In production, get from auth context
      })
      toast.success('Price alert created successfully!', { icon: '🔔' })
      handleClose()
    } catch (error) {
      toast.error('Failed to create price alert')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Open modal when product is selected (for demo purposes)
  if (selectedProduct && !isOpen && targetPrice === '' && email === '') {
    setTargetPrice(String(Math.round(selectedProduct.bestPrice * 0.95)))
    setEmail('shameemkp@gmail.com')
    setIsOpen(true)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Set Price Drop Alert"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {selectedProduct && (
          <p id="alert-modal-product-name" className="text-sm text-text-secondary text-center">
            {selectedProduct.title}
          </p>
        )}

        <Input
          label="NOTIFY ME WHEN PRICE DROPS BELOW (₹)"
          type="number"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          placeholder="Enter target price"
          required
          inputMode="numeric"
        />

        <Input
          label="YOUR EMAIL OR WHATSAPP NUMBER"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="e.g. shameemkp@gmail.com"
          required
        />

        <ModalFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="flex-1"
          >
            Create Price Alert
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  )
}