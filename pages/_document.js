import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        <meta property="og:title" content="Planea tu viaje, Guías de viaje personalizadas" key="title"/>
        <meta name="description" content="Obtén recomendaciones personalizadas para tus próximas vacaciones con nuestras guías de viaje. Incluye atracciones, hoteles y restaurantes recomendados."/>
        <meta name="keywords" content="guías de viaje, recomendaciones, vacaciones, atracciones, hoteles, restaurantes"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
