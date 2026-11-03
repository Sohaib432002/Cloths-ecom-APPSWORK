import { StylistChat } from '@/app/components/stylist/StylistChat'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Personal Stylist',
  description: 'Get outfit recommendations from the Véora catalog using Llama 3.1 on Hugging Face.',
}

export default function StylistPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">In-house styling</p>
      <h1 className="mt-3 text-4xl font-black">Your personal stylist</h1>
      <p className="mt-4 max-w-2xl text-gray-600">
        This is not a generic chatbot. The stylist reads your occasion, maps it onto Véora
        inventory, and returns a wearable outfit you can add to cart immediately.
      </p>
      <div className="mt-8 rounded-3xl border bg-white p-5 shadow-sm sm:p-8">
        <StylistChat />
      </div>
    </div>
  )
}
