import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const PORT = 5000
app.use(bodyParser.json())
app.use(express.json())
app.use(cors())

// GET /add-stock-to-warehouse
app.post('/add-stock-to-warehouse', (req, res) => {
  const {
    quantity,
    product_size,
    warehouse_current_capacity,
    warehouse_max_capacity,
  } = req.body
  console.log('REQ BODY: ', req.body)
  if (
    !('quantity' in req.body) ||
    !('product_size' in req.body) ||
    !('warehouse_current_capacity' in req.body) ||
    !('warehouse_max_capacity' in req.body)
  ) {
    return res.status(400).json({ error: 'One or more fields missing.' })
  }

  const containerSize = quantity * product_size
  const isAvailableCapacity =
    containerSize <= warehouse_max_capacity - warehouse_current_capacity
  const updatedCurrentCapacity = isAvailableCapacity
    ? warehouse_current_capacity + containerSize
    : warehouse_current_capacity

  if (!isAvailableCapacity) {
    return res.status(200).json({ isAvailableCapacity: false })
  }

  return res
    .status(200)
    .json({ isAvailableCapacity, containerSize, updatedCurrentCapacity })
})

// POST /update-warehouse-capacity
app.post('/update-warehouse-capacity', (req, res) => {
  const { current_capacity, container_size } = req.body
  if (!('current_capacity' in req.body) || !('container_size' in req.body)) {
    return res.status(400).json({ error: 'One or more fields missing.' })
  }

  const updatedCapacity = current_capacity - container_size

  return res.status(200).json({ updated_current_capacity: updatedCapacity })
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`ThornWebAPI listening on PORT ${PORT}!`)
})
