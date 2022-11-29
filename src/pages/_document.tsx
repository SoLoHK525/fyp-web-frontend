import * as React from 'react';

import createEmotionServer from '@emotion/server/create-instance';
import { ServerStyleSheets } from '@mui/styles';
import Document, { DocumentContext } from 'next/document';

import cache from '../styles/cache';

const { extractCritical } = createEmotionServer(cache);

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    // Styled Component
    const sheets = new ServerStyleSheets();
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />),
      });

    const initialProps = await Document.getInitialProps(ctx);

    const styles = extractCritical(initialProps.html);

    return {
      ...initialProps,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
        <style
          dangerouslySetInnerHTML={{ __html: styles.css }}
          data-emotion={`css ${styles.ids.join(' ')}`}
          // eslint-disable-next-line react/no-danger
          key="emotion-style-tag"
        />,
      ],
    };
  }
}
