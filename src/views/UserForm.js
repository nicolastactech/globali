import React, { useState, useEffect } from 'react'
import {
  Grid,
  Divider,
  Typography,
  Button,
  CircularProgress,
  Select,
  MenuItem
} from '@material-ui/core'

import productsData from '../data/products.json'
import { Card, TextField, Notification, LinearProgress } from '../components'

function UserForm() {
  const initialData = [
    {
      sku: '',
      value: '',
      price: '',
      brand: '',
      label: '',
      quantity: '',
      description: '',
      unitOfMeasure: ''
    }
  ]
  const [loading, setLoading] = useState(false)
  const [loadingZipCode, setLoadingZipCode] = useState(false)
  const [products, setProducts] = useState(initialData)
  const [snackbar, setSnackbar] = useState({ status: false })

  const initialValues = {
    name: '',
    email: '',
    phone: '',
    deliverToName: '',
    deliverTo: '',
    deliverToStreet: '',
    orderId: '',
    deliverToCity: '',
    deliverToState: '',
    deliverToPostalCode: '',
    deliverToCountry: '',
    deliverToEmail: '',
    nameBill: 'Sodimac S.A',
    deliverToBill: 'PAGOS SODIMAC pagos@sodimac.cl',
    streetBill: '',
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
  }
  const [values, setValues] = useState(initialValues)

  const handleClick = async event => {
    event.preventDefault()
    setLoading(true)
    const outputData = {
      values,
      products: products.reduce((acc, next) => {
        acc.push({
          ...next,
          totalAmount: (next.price * parseInt(next.quantity)).toFixed(2) //here Math.round()
        })
        return acc
      }, [])
    }

    await fetch(`${process.env.REACT_APP_FUNCTION_APP}/xmlBuilder`, {
      method: 'POST',
      body: JSON.stringify(outputData)
    })
    setLoading(false)
    setSnackbar({ status: true, message: 'Archivo cargado', type: 'success' })
    setValues(initialValues)
    setProducts([{ sku: '', description: '', unitOfMeasure: '', quantity: '' }])
  }

  const handleChange = event => {
    const name = event.target.name
    const value = event.target.value
    setValues({ ...values, [name]: value })
  }

  const handleAddProduct = event => {
    event.preventDefault()
    setProducts(prevState => [...prevState, ...initialData])
  }

  const handleChangeProduct = (event, index) => {
    const sku = event.target.value
    const findSku = productsData.find(product => product.sku === sku)

    setProducts([...products, findSku])

    console.log('Seleccionado', products[index])
    console.log('Numero', index)
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

  useEffect(() => {
    if (products.length === 0) {
      setProducts([
        {
          sku: '',
          description: '',
          unitOfMeasure: '',
          quantity: ''
        }
      ])
    }
  }, [products])

  const handleRemoveProduct = (event, index) => {
    event.preventDefault()
    const productSelected = products[index]
    setProducts(products.filter(product => product !== productSelected))
  }

  const hasData = text => {
    if (text.length > 0) {
      return true
    } else {
      return false
    }
  }

  const handleFetchZipcode = async () => {
    setLoadingZipCode(true)
    const { deliverToStreet, deliverToCountry } = values

    if (hasData(deliverToStreet) && hasData(deliverToCountry)) {
      const response = await fetch(
        `${process.env.REACT_APP_FUNCTION_APP}/zipCode`,
        {
          method: 'POST',
          body: JSON.stringify({
            address: deliverToStreet,
            country: deliverToCountry
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const { zipcode } = await response.json()
      setValues({ ...values, deliverToPostalCode: zipcode })
      setLoadingZipCode(false)
    } else {
      setSnackbar({
        status: true,
        message: 'Necesitas completar los campos',
        type: 'warning'
      })
      setLoadingZipCode(false)
    }
  }

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, status: false })

  const mapInputs = () => {
    return products.map((data, index) => {
      return (
        <Grid key={data.sku + 1} container spacing={3}>
          <Grid item md={5}>
            <div className="mt-3">
              <Select
                value={data.sku}
                onChange={event => handleChangeProduct(event, index)}
              >
                {productsData.map(item => {
                  return (
                    <MenuItem key={item.sku} value={item.sku}>
                      {item.sku}
                    </MenuItem>
                  )
                })}
              </Select>
            </div>
          </Grid>
          <Grid item md={4}>
            <TextField
              id="quantity"
              name="quantity"
              className="input-width"
              label="Cantidad"
              value={data.quantity}
              onChange={e => handleChangeQuantity(e, index)}
            />
          </Grid>
          <Grid item md={3}>
            <div className="mt-3">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={event => handleRemoveProduct(event, index)}
              >
                Quitar
              </Button>
            </div>
          </Grid>
        </Grid>
      )
    })
  }

  return (
    <>
      {loading && <LinearProgress />}
      <Grid container item xs={12} sm>
        <Card>
          <div className="text-center">
            <Typography gutterBottom variant="h4">
              Generador XML
            </Typography>
          </div>
          <form className="mt-3">
            <Typography variant="subtitle2">Datos:</Typography>
            <TextField
              id="name"
              label="Nombre"
              name="name"
              onChange={handleChange}
            />
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
            <Typography variant="subtitle2">Datos de orden:</Typography>
            <TextField
              id="orderId"
              label="Orden Id de Sodimac"
              name="orderId"
              onChange={handleChange}
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
              disabled={true}
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
            <Button
              onClick={handleFetchZipcode}
              variant="contained"
              disabled={loadingZipCode}
              color="primary"
            >
              {loadingZipCode ? (
                <CircularProgress size={20} />
              ) : (
                'Obtener código postal'
              )}
            </Button>
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
            <div className="mt-3">
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddProduct}
              >
                Agregar Producto
              </Button>
            </div>
            {mapInputs(products)}
            <div className="mt-3">
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                onClick={handleClick}
              >
                {loading ? 'Subiendo archivo' : ' Generar XML'}
              </Button>
            </div>
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

export default UserForm
