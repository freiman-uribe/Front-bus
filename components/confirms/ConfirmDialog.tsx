import { Dialog, Portal, Button, Text } from 'react-native-paper';

interface ConfirmDeleteDialogProps {
    visible: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    message: string;
    title: string;
}

const ConfirmDialog = ({ visible, onConfirm, onCancel, message, title }: ConfirmDeleteDialogProps) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel}>
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Content>
          <Text>{message}</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onCancel}>Cancelar</Button>
          <Button onPress={onConfirm}>Eliminar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ConfirmDialog;