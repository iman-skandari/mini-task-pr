import React from 'react'
import { Provider } from 'react-redux'
import store from './store/store'
import DataGrid from './components/DataGrid/DataGrid'

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <DataGrid />
      </div>
    </Provider>
  )
}

export default App
