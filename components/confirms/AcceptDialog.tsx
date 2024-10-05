import { Dialog, Portal, Button, Text } from 'react-native-paper';

interface AcceptDialogProps {
    visible: boolean;
    onAccept: () => void;
    message: string;
    title: string;
}

const AcceptDialog = ({ visible, onAccept, message, title }: AcceptDialogProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onAccept}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onAccept}>Aceptar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default AcceptDialog;
