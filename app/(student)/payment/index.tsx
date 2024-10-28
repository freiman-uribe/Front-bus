import { useSession } from "@/hooks/useSession";
import useSocket from "@/hooks/useSocket";
import { Axios } from "@/resources/axios/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text } from "react-native";
import {
  Card,
  Button,
  Modal,
  Portal,
  Provider,
  RadioButton,
} from "react-native-paper";
import WebView from "react-native-webview";

const plans = [
  { id: 1, name: "Plan Básico", price: "10 USD" },
  { id: 2, name: "Plan Estándar", price: "20 USD" },
  { id: 3, name: "Plan Premium", price: "30 USD" },
];

const Payment = () => {
  const [plans, setPlans] = useState<any>([]);  // Lista de planes de fetchPlans
  const {session, getSession} = useSession()
  const [selectedPlan, setSelectedPlan] = useState<any>(null); // Plan seleccionado
  const [wompiHTML, setWompiHTML] = useState<string | null>(null);
  const [visible, setVisible] = useState(false); // Modal de confirmación
  const [isPayment, setIsPayment] = useState(false); // Modal de confirmación

  const { messages, sendMessage }=useSocket(process.env.EXPO_PUBLIC_HOST as string);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    if (messages.length > 0) {
      if (messages.includes('UPDATE_PLAN')) {
        fetchActivePlans();

        setIsPayment(false)
      }
    }
  }, [messages])
  const fetchPlans = async () => {
    const { data } = await Axios.get(`/payment/get-plans`);
    setPlans(data);
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log(session, 'session')
      getSession()
      return () => {};
    }, [])
  );

  const fetchActivePlans = async () => {
    const { data } = await Axios.get(`/payment/get-active-plan`);

    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    await AsyncStorage.setItem('accessToken', accessToken);
    await AsyncStorage.setItem('refreshToken', refreshToken);
    getSession()
    return data;
  };

  const fetchDataPayment = async (referenceId: string) => {
    try {
      const { data } = await Axios.post(`/payment/create-payment/${referenceId}`);
      console.log(`${process.env.EXPO_PUBLIC_HOST}/payment/checkout`)
      setWompiHTML(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Wompi Payment</title>
          </head>
          <body>
              <form style={display: flex, justify-content: space-between, width: 100%}	>
                <script
                  src="https://checkout.co.uat.wompi.dev/widget.js"
                  data-render="button"
                  data-public-key="pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7"
                  data-currency="COP"
                  data-amount-in-cents="${data.totalPayment}"	
                  data-reference="${data.reference}"
                  data-signature:integrity="${data.signature}"
                  data-customer-data:email="prueba@woompi.com"
                  data-customer-data:full-name="Lola Perez"
                  data-redirect-url="https://3.128.90.2:3000/payment/checkout"
                >
                </script>
              </form>
          </body>
        </html>
      `);
    } catch (error) {
      console.log("🚀 ~ handleDelete ~ error", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handlePayment = async () => {
    console.log(selectedPlan, 'selectedPlan')
    await fetchDataPayment(selectedPlan.id);
    setIsPayment(true)
    hideModal();
    // Aquí puedes redirigir al usuario a una pantalla de pago o procesar el pago.
    // alert(`Has seleccionado el ${selectedPlan?.name}. Procediendo al pago...`);
  };

  return (
    <Provider>
        {
          isPayment ? (
            <View style={{ flex: 1 }}>
              {
                wompiHTML && <WebView
                  originWhitelist={['*']}
                  source={{ html: wompiHTML }}
                  style={{flex: 1}}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                />
              }
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>
                Selecciona tu plan
              </Text>

              {plans.map((plan: any) => (
                <Card
                  key={plan.id}
                  style={{ marginBottom: 16 }}
                  onPress={() => setSelectedPlan(plan)}
                >
                  <Card.Title
                    title={plan.name}
                    subtitle={`Precio: ${plan.amount_perday * plan.equals_day}`}
                  />
                  <Card.Content>
                    <RadioButton.Group
                      onValueChange={() => setSelectedPlan(plan)}
                      value={selectedPlan?.id === plan.id ? plan.id : null}
                    >
                      <RadioButton.Item
                        disabled={session?.active_plan ? true : false}
                        label="Seleccionar este plan"
                        value={plan.id}
                      />
                    </RadioButton.Group>
                  </Card.Content>
                </Card>
              ))}
              <Button
                mode="contained"
                onPress={showModal}
                disabled={!selectedPlan || session?.active_plan ? true : false} // Deshabilitar si no se seleccionó un plan
                style={{ marginTop: 16 }}
              >
                Ir a pagar
              </Button>
            </ScrollView>
          )
        }
        {/* {
          wompiHTML && <WebView
            originWhitelist={['*']}
            source={{ html: wompiHTML }}
            style={{ height: 100 }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        } */}

        {/* Modal de confirmación */}
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{
              backgroundColor: "white",
              padding: 20,
              marginHorizontal: 20,
              borderRadius: 10,
            }}
          >
             <ScrollView>
            <Text style={{ fontSize: 18, marginBottom: 16 }}>
              Confirmar pago del {selectedPlan?.name}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 24 }}>
              ¿Deseas proceder con el pago de {selectedPlan?.amount_perday * selectedPlan?.equals_day}?
              
            </Text>
             <Button mode="contained" onPress={handlePayment}>
                Pagar {selectedPlan?.amount_perday * selectedPlan?.equals_day}
              </Button>
             </ScrollView>
          </Modal>
        </Portal>

    </Provider>
  );
};

export default Payment;
