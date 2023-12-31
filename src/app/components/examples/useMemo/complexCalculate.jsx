import React, { useEffect, useMemo, useState } from 'react'
import CardWrapper from '../../common/Card'
import SmallTitle from '../../common/typografy/smallTitle'

function factorial(n) {
  return n ? n * factorial(n - 1) : 1
}

const runFactorial = n => {
  console.log('run factorial')
  return factorial(n)
}

const ComplexCalculateExample = () => {
  const [value, setValue] = useState(50)
  const [otherState, setOtherState] = useState(false)
  const buttonColor = otherState ? 'primary' : 'secondary'

  useEffect(() => {
    console.log('render btn')
  }, [buttonColor])

  const fact = useMemo(() => runFactorial(value), [value])

  return (
    <>
      <CardWrapper>
        <SmallTitle>Кэширование сложных вычислений</SmallTitle>
        <p>Factorial of {value}: {fact}</p>
        <button className='btn btn-primary mx-2' onClick={() => setValue(t => t + 1)}>Increment</button>
        <button className='btn btn-primary mx-2' onClick={() => setValue(t => t - 1)}>Decrement</button>
      </CardWrapper>
      <CardWrapper>
        <SmallTitle>Зависимость от сторонних setState</SmallTitle>
        <button className={'btn ms-md-2 btn-' + buttonColor} onClick={() => setOtherState(prevState => !prevState)}>
          Change color
        </button>
      </CardWrapper>
    </>
  )
}

export default ComplexCalculateExample
