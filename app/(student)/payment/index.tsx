import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';
import { Axios } from '@/resources/axios/axios';

export default function Payment() {
  const [wompiHTML, setWompiHTML] = useState<string | null>(null);
  const fetchDataPayment = async () => {
    try {
      const { data } = await Axios.post(`/payment/create-payment`);
      setWompiHTML(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Wompi Payment</title>
        </head>
        <body>
            <form>
              <script
                src="https://checkout.co.uat.wompi.dev/widget.js"
                data-render="button"
                data-public-key="pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7"
                data-currency="COP"
                data-amount-in-cents="${data.totalPayment}"	
                data-reference="${data.reference}"
                data-signature:integrity="${data.signature}">
              </script>
            </form>
        </body>
        </html>
      `);

    } catch (error) {
      console.log('🚀 ~ handleDelete ~ error', error);
    }
  }

  console.log(wompiHTML);

  useEffect(() => {
    fetchDataPayment();
  },[])

  return (
    wompiHTML ? <WebView
      originWhitelist={['*']}
      source={{ html: wompiHTML }}
      style={{ flex: 1 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
    /> : <View style={styles.container} ></View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
