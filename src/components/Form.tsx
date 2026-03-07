'use client'

// React Imports
import type { DetailedHTMLProps, FormHTMLAttributes } from 'react'

type Props = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>

const FormComponent = ({ onSubmit, ...rest }: Props) => {
  return <form {...rest} onSubmit={onSubmit ?? (e => e.preventDefault())} />
}

export default FormComponent
