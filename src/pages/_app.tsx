import type { AppProps } from 'next/app';

/**
 * Mui Theme
 */
import { ThemeProvider } from '@mui/material/styles';
import { muiTheme } from '../styles/theme';

/**
 * FontAwesome
 */
import {
  config as FontAwesomeConfig,
  library,
} from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';

/**
 * Theme cache provider
 */
import { CacheProvider } from '@emotion/react';
import Head from 'next/head';
import { CssBaseline } from '@mui/material';
import cache from '../styles/cache';
import { useEffect } from 'react';

FontAwesomeConfig.autoAddCss = false;
library.add(fas);
library.add(far);
library.add(fab);

export default function App({ Component, pageProps}: AppProps) {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  return (
    <CacheProvider value={cache}>
      <Head>
        <meta content="initial-scale=1.0, width=device-width" name="viewport" />
        <link href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          as="style"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;600;700;800&display=swap"
          // @ts-ignore
          onLoad="this.onload=null;this.rel='stylesheet'"
          rel="preload"
        />
        <title>Online Code Practice System</title>
      </Head>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </CacheProvider>
  );
}
