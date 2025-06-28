import React from 'react'
import DashboardProvider from './provider'

function dashboardLayout({children}) {
  return (
      <div>
          <DashboardProvider>
              {children}
          </DashboardProvider>
      </div>
  )
}

export default dashboardLayout
