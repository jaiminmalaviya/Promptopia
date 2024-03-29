import '@styles/globals.css'
import Nav from '@components/Nav'
import Provider from '@components/Provider'
import { Toaster } from 'react-hot-toast'

export const metadata = {
    title: 'Promptopia',
    description: 'Discover & Share AI Prompts',
}

const RootLayout = ({ children }) => {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/assets/images/logo.svg" />
            </head>
            <body>
                <Provider>
                    <div className="main">
                        <div className="gradient"></div>
                    </div>

                    <main className="app">
                        <Nav />
                        <Toaster
                            position="bottom-right"
                            reverseOrder={true}
                            toastOptions={{
                                // Define default options
                                className: '',
                                duration: 3000,
                                style: {
                                    borderRadius: '10px',
                                    background: '#333',
                                    color: '#fff',
                                },
                            }}
                        />
                        {children}
                    </main>
                </Provider>
            </body>
        </html>
    )
}

export default RootLayout
