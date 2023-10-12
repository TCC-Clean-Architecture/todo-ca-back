import app from './configs/express'

const init = (): void => {
  app.listen(3000, () => {
    console.log('Server running')
  })
}

export default init
