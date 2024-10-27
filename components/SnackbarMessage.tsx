import React from "react";
import { useEffect, useState } from "react";
import { Snackbar } from "react-native-paper";

export const PlanAlert = ({ session }:any) => {
  const [visible, setVisible] = useState(false);

  const onDismissSnackBar = () => setVisible(false);

  useEffect(() => {
    if (session && !session?.active_plan) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [session])
  return (
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        duration={150000}  // La alerta se mostrará por 4 segundos
        action={{
          label: 'Cerrar',
          onPress: onDismissSnackBar,
        }}
        style={{ backgroundColor: '#f50057' }}  // Color personalizado para la alerta
      >
        No tienes un plan activo, paga para ingresar al bus.
      </Snackbar>
  );
};
