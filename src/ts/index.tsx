import React from 'react'
import { createRoot } from 'react-dom/client'

import App from 'ts/components/app'

import 'css/config.scss'
import 'css/null.scss'
import 'css/global.scss'

import 'ts/renderer-manager'

const root = createRoot(document.querySelector('#app'))
root.render(<App />)
