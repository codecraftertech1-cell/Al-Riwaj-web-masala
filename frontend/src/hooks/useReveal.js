import { useEffect } from 'react'

export default function useReveal(deps = []) {
  useEffect(() => {
    // Immediately make all reveal elements visible
    const items = document.querySelectorAll('.reveal')
    items.forEach((item) => {
      item.classList.add('is-visible')
    })
  }, deps)
}
