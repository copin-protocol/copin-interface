const delay = (time: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(2)
    }, time)
  })
}

export default delay
