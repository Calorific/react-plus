import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { validator } from '../../../utils/validator.js'

const FormComponent = ({ children, validatorConfig, onSubmit, defaultData }) => {
  const [data, setData] = useState(defaultData || {})
  const [errors, setErrors] = useState({})

  const handleChange = useCallback((target) => {
    setData((prevState) => ({
      ...prevState,
      [target.name]: target.value
    }))
  }, [setData])
  const validate = useCallback((data) => {
    const errors = validator(data, validatorConfig)
    setErrors(errors)
    return Object.keys(errors).length === 0
  }, [validatorConfig, setErrors])

  const handleSubmit = e => {
    e.preventDefault()
    const isValid = validate(data)
    if (!isValid) return
    onSubmit(data)
  }

  useEffect(() => {
    if (Object.keys(data).length > 0)
      validate(data)
  }, [data])

  const handleKeyDown = useCallback(e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      const form = e.target.form
      const indexField = Array.prototype.indexOf.call(form, e.target)
      form.elements[indexField + 1].focus()
    }
  }, [])
  
  const isValid = Object.keys(errors).length === 0

  const clonedElements = React.Children.map(children, child => {
    const childType = typeof child.type
    let config = {}
    if (childType === 'object') {
      if (!child.props.name) throw new Error('Name property is required for field components')
      config = {
        ...child.props,
        onChange: handleChange,
        value: data[child.props.name] || '',
        error: errors[child.props.name],
        onKeyDown: handleKeyDown
      }
    } else if (childType === 'string') {
      if (child.type === 'button')
        if (child.props.type === 'submit' || !child.props.type)
          config = { ...child.props, disabled: !isValid }
    }
    return React.cloneElement(child, config)
  })

  return (
    <form onSubmit={handleSubmit}>
      {clonedElements}
    </form>
  )
}

FormComponent.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  validatorConfig: PropTypes.object,
  onSubmit: PropTypes.func,
  defaultData: PropTypes.object,
}
export default FormComponent