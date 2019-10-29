import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles'
import App from './App'

const theme = createMuiTheme({
  overrides: {
    MuiCardContent: {
      root: {
        paddingBottom: 300,
        '&:last-child': {
          paddingBottom: 300
        }
      }
    }
  }
})

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  document.getElementById('root')
)
