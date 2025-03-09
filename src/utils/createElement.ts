import { createElement } from 'react'

export const printContent = (value: any) => {
  if (process.env.NODE_ENV === 'development') {
    const data = JSON.stringify(value, null, 2)
    return createElement('pre', null, data)
  }
}

