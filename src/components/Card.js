import React from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Card, CardContent} from '@material-ui/core'

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    marginTop: 60
  },
  card: {
    margin: 'auto',
    maxWidth: 700
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
})

export default function CardSheet(props) {
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>{props.children}</CardContent>
      </Card>
    </div>
  )
}
