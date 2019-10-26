import React, {useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Grid, Divider, Typography, Button} from '@material-ui/core'
import Select from 'react-select'

import productsData from '../data/products.json'
import {Card, TextField, Notification, LinearProgress} from '../components'

const useStyles = makeStyles({
  root: {
    paddingBottom: 300,
    '&:last-child': {
      paddingBottom: 300
    }
  }
})

function Home() {
  const classes = useStyles()
  const initialData = [{sku: '', description: '', unitOfMeasure: ''}]
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState(initialData)
  const [snackbar, setSnackbar] = useState({status: false})
  const [values, setValues] = useState({
    inputSku: '',
    name: '',
    email: '',
    phone: '',
    deliverToName: '',
    deliverTo: '',
    deliverToStreet: '',
    deliverToCity: '',
    deliverToState: '',
    deliverToPostalCode: '',
    deliverToCountry: '',
    deliverToEmail: '',
    nameBill: 'Sodimac S.A',
    deliverToBill: 'PAGOS SODIMAC pagos@sodimac.cl',
    streetBill: 'Pdte Eduardo Frei Montalva 3092',
    cityBill: 'Santiago',
    stateBill: 'CL',
    postalCodeBill: '8640195',
    countryBill: 'Chile',
    carrierCode: 'FEDE',
    carrierName: 'FEDEX EXPRESS CHILE SPA.',
    carrierId: '76754296-8',
    carrierPhone: '',
    carrierContactName: 'Esteban Miranda',
    carrierContactEmail: 'esmiranda@falabella.cl'
  })

  const handleClick = async event => {
    event.preventDefault()
    setLoading(true)
    const outputData = {
      values,
      products: products.reduce((acc, next) => {
        acc.push({
          ...next,
          totalAmount: (next.price * parseInt(next.quantity)).toFixed(1) //here Math.round()
        })
        return acc
      }, [])
    }

    await fetch('https://fn-sodimac-uploadsftp.azurewebsites.net/api/ParseHandler', {
      method: 'POST',
      body: JSON.stringify(outputData)
    })
    setLoading(false)
    setSnackbar({status: true, message: 'Archivo cargado', type: 'success'})
  }

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setValues({...values, [name]: value})
  }

  const handleAddProduct = event => {
    event.preventDefault()
    setProducts(prevState => [...prevState, ...initialData])
  }

  const handleChangeProduct = (product, index) => {
    setProducts(prevState => {
      const newState = [...prevState]
      newState[index] = {
        ...newState[index],
        ...product
      }
      return newState
    })
  }

  const handleChangeQuantity = (event, index) => {
    const name = event.target.name
    const value = event.target.value
    setProducts(prevState => {
      const newState = [...prevState]
      newState[index] = {
        ...newState[index],
        [name]: value
      }
      return newState
    })
  }

  const handleCloseSnackbar = () => {
    setSnackbar({...snackbar, status: false})
  }

  const mapInputs = () => {
    return products.map((data, index) => {
      return (
        <Grid key={index} container spacing={3}>
          <Grid item md={6}>
            <div className="mt-3">
              <Select
                options={productsData}
                onChange={product => handleChangeProduct(product, index)}
                name={values.inputSku}
              />
            </div>
          </Grid>
          <Grid item md={6}>
            <TextField
              id="quantity"
              name="quantity"
              className="input-width"
              label="Cantidad"
              onChange={e => handleChangeQuantity(e, index)}
            />
          </Grid>
        </Grid>
      )
    })
  }

  console.log(loading)
  return (
    <>
      {loading && <LinearProgress />}
      <Grid container item xs={12} sm>
        <Card className={classes.root}>
          <div className="text-center">
            <Typography gutterBottom variant="h4">
              Generador XML
            </Typography>
          </div>
          <form className="mt-3">
            <Typography variant="subtitle2">Datos:</Typography>
            <TextField id="name" label="Nombre" name="name" onChange={handleChange} />
            <TextField
              id="email"
              label="Email"
              name="email"
              onChange={handleChange}
              disabled={true}
            />
            <TextField
              id="phone"
              label="Teléfono"
              name="phone"
              onChange={handleChange}
              disabled={true}
            />
            <div className="mt-3">
              <Divider variant="middle" />
            </div>
            <Typography variant="subtitle2">Enviar a:</Typography>
            <TextField
              id="name"
              name="deliverToName"
              label="Nombre"
              onChange={handleChange}
              value={values.deliverToName}
            />
            <TextField
              id="deliverTo"
              name="deliverTo"
              label="Entregar a"
              onChange={handleChange}
              value={values.deliverTo}
            />
            <TextField
              id="street"
              name="deliverToStreet"
              label="Dirección"
              onChange={handleChange}
              value={values.deliverToStreet}
            />
            <TextField
              id="city"
              name="deliverToCity"
              label="Ciudad"
              onChange={handleChange}
              value={values.deliverToCity}
            />
            <TextField
              id="state"
              name="deliverToState"
              label="Estado"
              onChange={handleChange}
              value={values.deliverToState}
            />
            <TextField
              id="postalCode"
              name="deliverToPostalCode"
              label="Código Postal"
              onChange={handleChange}
              value={values.deliverToPostalCode}
            />
            <TextField
              id="country"
              name="deliverToCountry"
              label="País"
              onChange={handleChange}
              value={values.deliverToCountry}
            />
            <TextField
              id="email"
              name="deliverToEmail"
              label="Email"
              onChange={handleChange}
              value={values.deliverToEmail}
            />
            <div className="mt-3">
              <Divider variant="middle" />
            </div>
            <Typography variant="subtitle2">Cobrar a:</Typography>
            <TextField
              id="nameBill"
              name="nameBill"
              label="Nombre"
              onChange={handleChange}
              value={values.nameBill}
              disabled={true}
            />
            <TextField
              id="deliverToBill"
              name="deliverToBill"
              label="Entregado por"
              onChange={handleChange}
              value={values.deliverToBill}
              disabled={true}
            />
            <TextField
              id="streetBill"
              name="streetBill"
              label="Dirección"
              onChange={handleChange}
              value={values.streetBill}
              disabled={true}
            />
            <TextField
              id="cityBill"
              name="cityBill"
              label="Ciudad"
              onChange={handleChange}
              value={values.cityBill}
              disabled={true}
            />
            <TextField
              id="stateBill"
              name="stateBill"
              label="Estado"
              onChange={handleChange}
              value={values.stateBill}
              disabled={true}
            />
            <TextField
              id="postalCodeBill"
              name="postalCodeBill"
              label="Código Postal"
              onChange={handleChange}
              value={values.postalCodeBill}
              disabled={true}
            />
            <TextField
              id="countryBill"
              name="countryBill"
              label="País"
              onChange={handleChange}
              value={values.countryBill}
              disabled={true}
            />
            <div className="mt-3">
              <Divider variant="middle" />
            </div>
            <Typography variant="subtitle2">Carrier:</Typography>
            <TextField
              id="carrierCode"
              name="carrierCode"
              label="Código de carrier"
              onChange={handleChange}
              value={values.carrierCode}
              disabled={true}
            />
            <TextField
              id="carrierName"
              name="carrierName"
              label="Nombre de carrier"
              onChange={handleChange}
              value={values.carrierName}
              disabled={true}
            />
            <TextField
              id="carrierId"
              name="carrierId"
              label="Id carrier"
              onChange={handleChange}
              value={values.carrierId}
              disabled={true}
            />
            <TextField
              id="carrierPhone"
              name="carrierPhone"
              label="Teléfono carrier"
              onChange={handleChange}
              value={values.carrierPhone}
              disabled={true}
            />
            <TextField
              id="carrierContactName"
              name="carrierContactName"
              label="Nombre de contacto"
              onChange={handleChange}
              value={values.carrierContactName}
              disabled={true}
            />
            <TextField
              id="carrierContactEmail"
              name="carrierContactEmail"
              label="Email de contacto"
              onChange={handleChange}
              value={values.carrierContactEmail}
              disabled={true}
            />
            <div className="mt-3">
              <Divider variant="middle" />
            </div>
            <Typography variant="subtitle2">Productos:</Typography>
            <Button variant="contained" color="primary" onClick={event => handleAddProduct(event)}>
              Agregar Producto
            </Button>
            {mapInputs(products)}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              onClick={event => handleClick(event)}
            >
              {loading ? 'Subiendo archivo' : ' Generar XML'}
            </Button>
          </form>
        </Card>
      </Grid>
      <Notification
        open={snackbar.status}
        handleClose={handleCloseSnackbar}
        message={snackbar.message}
        type={snackbar.type}
      />
    </>
  )
}
export default Home
